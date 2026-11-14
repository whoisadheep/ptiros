import fs from "fs/promises";
import path from "path";
import crypto from "crypto";
import { neon } from "@neondatabase/serverless";
import {
  DatabaseStore,
  StudentLead,
  MentorshipSessionRecord,
  PaidDossierOrder,
  AdminMetricsSummary,
  BookingStatus,
  LeadStatus,
} from "@/types/database";

const DATA_DIR = path.join(process.cwd(), "data");
const DB_FILE = path.join(DATA_DIR, "ptiros_store.json");

// Default Admin Secret Key (can be overridden via ENV)
export const ADMIN_SECRET = process.env.ADMIN_SECRET_KEY || "ptiros-admin-secure-2026";
export const ADMIN_COOKIE_NAME = "ptiros_admin_token";

// In-process serialized write queue to prevent lost updates under async concurrency
let writeQueue = Promise.resolve();

export function queueDbWrite<T>(op: () => Promise<T>): Promise<T> {
  const next = writeQueue.then(op, op);
  writeQueue = next.then(() => {});
  return next;
}

/**
 * Returns a Neon SQL executor if DATABASE_URL is configured.
 */
function getNeonSql() {
  if (process.env.DATABASE_URL) {
    try {
      return neon(process.env.DATABASE_URL);
    } catch (err) {
      console.warn("Neon SQL init warning, falling back to local file store:", err);
    }
  }
  return null;
}

/**
 * Normalizes Indian phone numbers to strict 10 digits.
 * Accepts +91 9876543210, 09876543210, 9876543210 -> 9876543210
 */
export function normalizeIndianMobile(phone: string): { isValid: boolean; normalized: string } {
  let cleaned = phone.replace(/\D/g, "");
  if (cleaned.length === 12 && cleaned.startsWith("91")) {
    cleaned = cleaned.slice(2);
  } else if (cleaned.length === 11 && cleaned.startsWith("0")) {
    cleaned = cleaned.slice(1);
  }
  const isValid = /^[6-9]\d{9}$/.test(cleaned);
  return { isValid, normalized: isValid ? cleaned : "" };
}

/**
 * Generates an HMAC session token for admin authentication.
 */
export function generateAdminToken(): string {
  return crypto.createHmac("sha256", ADMIN_SECRET).update("ptiros-admin-session").digest("hex");
}

/**
 * Timing-safe admin PIN verification.
 */
export function verifyAdminPin(pin: string): boolean {
  if (!pin || typeof pin !== "string") return false;
  const expectedHash = crypto.createHash("sha256").update(ADMIN_SECRET).digest();
  const givenHash = crypto.createHash("sha256").update(pin.trim()).digest();
  return crypto.timingSafeEqual(expectedHash, givenHash);
}

/**
 * Verifies admin session token or API header.
 */
export function isAuthorizedAdmin(cookieToken?: string | null, headerKey?: string | null): boolean {
  if (headerKey && verifyAdminPin(headerKey)) {
    return true;
  }
  if (!cookieToken) return false;
  const expectedToken = generateAdminToken();
  try {
    const a = Buffer.from(cookieToken);
    const b = Buffer.from(expectedToken);
    if (a.length !== b.length) return false;
    return crypto.timingSafeEqual(a, b);
  } catch {
    return false;
  }
}

/**
 * Ensures fallback file and directory exist if Neon is unreachable.
 */
async function ensureDbFile(): Promise<void> {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
    try {
      await fs.access(DB_FILE);
    } catch {
      const initialSeed: DatabaseStore = {
        leads: [],
        bookings: [],
        dossiers: [],
        exportAuditLog: [],
        meta: {
          lastUpdated: new Date().toISOString(),
          version: 1,
        },
      };
      await fs.writeFile(DB_FILE, JSON.stringify(initialSeed, null, 2), "utf8");
    }
  } catch (err) {
    console.error("Failed to initialize database file:", err);
  }
}

/**
 * Reads database store from Neon Postgres (or local file fallback).
 */
export async function getDatabase(): Promise<DatabaseStore> {
  const sql = getNeonSql();
  if (sql) {
    try {
      const [leadsRows, bookingsRows, dossiersRows] = await Promise.all([
        sql`SELECT * FROM leads ORDER BY created_at DESC`,
        sql`SELECT * FROM mentorship_bookings ORDER BY created_at DESC`,
        sql`SELECT * FROM paid_dossiers ORDER BY created_at DESC`,
      ]);

      const leads: StudentLead[] = leadsRows.map((r: any) => ({
        id: r.id,
        studentName: r.student_name,
        grade: r.grade,
        schoolName: r.school_name || undefined,
        city: r.city,
        curriculum: r.curriculum,
        parentName: r.parent_name,
        parentPhone: r.parent_phone,
        parentDream: r.parent_dream,
        source: r.source,
        status: r.status,
        notes: r.notes || undefined,
        parentConsent: Boolean(r.parent_consent),
        createdAt: new Date(r.created_at).toISOString(),
        updatedAt: new Date(r.updated_at).toISOString(),
      }));

      const bookings: MentorshipSessionRecord[] = bookingsRows.map((r: any) => ({
        id: r.id,
        mentorId: r.mentor_id,
        mentorName: r.mentor_name,
        domainTitle: r.domain_title,
        studentName: r.student_name,
        parentPhone: r.parent_phone,
        date: r.date,
        timeSlot: r.time_slot,
        primaryQuestion: r.primary_question,
        status: r.status,
        meetingLink: r.meeting_link || undefined,
        adminNotes: r.admin_notes || undefined,
        createdAt: new Date(r.created_at).toISOString(),
        updatedAt: new Date(r.updated_at).toISOString(),
      }));

      const dossiers: PaidDossierOrder[] = dossiersRows.map((r: any) => ({
        id: r.id,
        studentName: r.student_name,
        parentPhone: r.parent_phone,
        amount: Number(r.amount) || 499,
        currency: r.currency || "INR",
        status: r.status,
        createdAt: new Date(r.created_at).toISOString(),
      }));

      return {
        leads,
        bookings,
        dossiers,
        exportAuditLog: [],
        meta: { lastUpdated: new Date().toISOString(), version: 1 },
      };
    } catch (err) {
      console.warn("Neon query failed, using local file store:", err);
    }
  }

  // Fallback to local store
  await ensureDbFile();
  try {
    const raw = await fs.readFile(DB_FILE, "utf8");
    return JSON.parse(raw) as DatabaseStore;
  } catch (err) {
    return {
      leads: [],
      bookings: [],
      dossiers: [],
      exportAuditLog: [],
      meta: { lastUpdated: new Date().toISOString(), version: 1 },
    };
  }
}

/**
 * Ingests or updates a student-parent lead in Neon Postgres.
 */
export async function saveLead(
  leadInput: Omit<StudentLead, "id" | "createdAt" | "updatedAt" | "status"> & { status?: LeadStatus }
): Promise<StudentLead> {
  const phoneNorm = normalizeIndianMobile(leadInput.parentPhone);
  const cleanPhone = phoneNorm.isValid ? phoneNorm.normalized : leadInput.parentPhone.slice(-10);
  const studentName = leadInput.studentName.trim();
  const sql = getNeonSql();

  if (sql) {
    try {
      const now = new Date().toISOString();
      const existing = await sql`
        SELECT * FROM leads 
        WHERE parent_phone = ${cleanPhone} AND LOWER(student_name) = LOWER(${studentName})
        LIMIT 1
      `;

      if (existing.length > 0) {
        const id = existing[0].id;
        await sql`
          UPDATE leads SET
            grade = ${leadInput.grade},
            school_name = ${leadInput.schoolName || null},
            city = ${leadInput.city},
            curriculum = ${leadInput.curriculum},
            parent_name = ${leadInput.parentName},
            parent_dream = ${leadInput.parentDream},
            source = ${leadInput.source},
            status = ${leadInput.status || existing[0].status},
            notes = ${leadInput.notes || existing[0].notes || null},
            updated_at = NOW()
          WHERE id = ${id}
        `;
        return {
          ...leadInput,
          id,
          parentPhone: cleanPhone,
          status: (leadInput.status || existing[0].status) as LeadStatus,
          parentConsent: Boolean(leadInput.parentConsent),
          createdAt: new Date(existing[0].created_at).toISOString(),
          updatedAt: now,
        };
      }

      const newId = `lead_${crypto.randomBytes(4).toString("hex")}`;
      await sql`
        INSERT INTO leads (
          id, student_name, grade, school_name, city, curriculum,
          parent_name, parent_phone, parent_dream, source, status, notes, parent_consent
        ) VALUES (
          ${newId}, ${studentName}, ${leadInput.grade}, ${leadInput.schoolName || null}, ${leadInput.city}, ${leadInput.curriculum},
          ${leadInput.parentName}, ${cleanPhone}, ${leadInput.parentDream}, ${leadInput.source}, ${leadInput.status || 'new'},
          ${leadInput.notes || null}, ${Boolean(leadInput.parentConsent)}
        )
      `;

      return {
        ...leadInput,
        id: newId,
        parentPhone: cleanPhone,
        status: leadInput.status || "new",
        parentConsent: Boolean(leadInput.parentConsent),
        createdAt: now,
        updatedAt: now,
      };
    } catch (err) {
      console.warn("Neon saveLead failed, falling back to local store:", err);
    }
  }

  // Fallback to local store
  return queueDbWrite(async () => {
    const store = await getDatabase();
    const now = new Date().toISOString();
    const newLead: StudentLead = {
      ...leadInput,
      id: `lead_${crypto.randomBytes(4).toString("hex")}`,
      parentPhone: cleanPhone,
      status: leadInput.status || "new",
      parentConsent: Boolean(leadInput.parentConsent),
      createdAt: now,
      updatedAt: now,
    };
    store.leads.unshift(newLead);
    await ensureDbFile();
    await fs.writeFile(DB_FILE, JSON.stringify(store, null, 2), "utf8");
    return newLead;
  });
}

/**
 * Updates an existing lead status or counselor notes.
 */
export async function updateLeadStatus(id: string, status: LeadStatus, notes?: string): Promise<StudentLead | null> {
  const sql = getNeonSql();
  if (sql) {
    try {
      await sql`
        UPDATE leads SET
          status = ${status},
          notes = COALESCE(${notes || null}, notes),
          updated_at = NOW()
        WHERE id = ${id}
      `;
      const rows = await sql`SELECT * FROM leads WHERE id = ${id} LIMIT 1`;
      if (rows.length === 0) return null;
      const r = rows[0];
      return {
        id: r.id,
        studentName: r.student_name,
        grade: r.grade,
        schoolName: r.school_name || undefined,
        city: r.city,
        curriculum: r.curriculum,
        parentName: r.parent_name,
        parentPhone: r.parent_phone,
        parentDream: r.parent_dream,
        source: r.source,
        status: r.status,
        notes: r.notes || undefined,
        parentConsent: Boolean(r.parent_consent),
        createdAt: new Date(r.created_at).toISOString(),
        updatedAt: new Date(r.updated_at).toISOString(),
      };
    } catch (err) {
      console.warn("Neon updateLeadStatus failed:", err);
    }
  }

  return queueDbWrite(async () => {
    const store = await getDatabase();
    const lead = store.leads.find((l) => l.id === id);
    if (!lead) return null;
    lead.status = status;
    if (notes !== undefined) lead.notes = notes;
    lead.updatedAt = new Date().toISOString();
    await fs.writeFile(DB_FILE, JSON.stringify(store, null, 2), "utf8");
    return lead;
  });
}

/**
 * Creates a new 1-on-1 mentorship session booking with slot conflict checking.
 */
export async function saveBooking(
  bookingInput: Omit<MentorshipSessionRecord, "id" | "createdAt" | "updatedAt" | "status">
): Promise<{ success: boolean; booking?: MentorshipSessionRecord; conflict?: boolean }> {
  const sql = getNeonSql();
  const phoneNorm = normalizeIndianMobile(bookingInput.parentPhone);
  const cleanPhone = phoneNorm.isValid ? phoneNorm.normalized : bookingInput.parentPhone.slice(-10);

  if (sql) {
    try {
      // Check conflict
      const conflicts = await sql`
        SELECT id FROM mentorship_bookings 
        WHERE mentor_id = ${bookingInput.mentorId}
          AND date = ${bookingInput.date}
          AND time_slot = ${bookingInput.timeSlot}
          AND status != 'cancelled'
        LIMIT 1
      `;

      if (conflicts.length > 0) {
        return { success: false, conflict: true };
      }

      const newId = `bk_${crypto.randomBytes(4).toString("hex")}`;
      const now = new Date().toISOString();

      await sql`
        INSERT INTO mentorship_bookings (
          id, mentor_id, mentor_name, domain_title, student_name, parent_phone,
          date, time_slot, primary_question, status
        ) VALUES (
          ${newId}, ${bookingInput.mentorId}, ${bookingInput.mentorName}, ${bookingInput.domainTitle},
          ${bookingInput.studentName}, ${cleanPhone}, ${bookingInput.date}, ${bookingInput.timeSlot},
          ${bookingInput.primaryQuestion}, 'pending'
        )
      `;

      const newBooking: MentorshipSessionRecord = {
        ...bookingInput,
        id: newId,
        parentPhone: cleanPhone,
        status: "pending",
        createdAt: now,
        updatedAt: now,
      };

      return { success: true, booking: newBooking };
    } catch (err) {
      console.warn("Neon saveBooking failed, fallback to local:", err);
    }
  }

  // Fallback to local store
  return queueDbWrite(async () => {
    const store = await getDatabase();
    const hasConflict = store.bookings.some(
      (b) =>
        b.mentorId === bookingInput.mentorId &&
        b.date === bookingInput.date &&
        b.timeSlot === bookingInput.timeSlot &&
        b.status !== "cancelled"
    );
    if (hasConflict) return { success: false, conflict: true };

    const now = new Date().toISOString();
    const newBooking: MentorshipSessionRecord = {
      ...bookingInput,
      id: `bk_${crypto.randomBytes(4).toString("hex")}`,
      parentPhone: cleanPhone,
      status: "pending",
      createdAt: now,
      updatedAt: now,
    };
    store.bookings.unshift(newBooking);
    await fs.writeFile(DB_FILE, JSON.stringify(store, null, 2), "utf8");
    return { success: true, booking: newBooking };
  });
}

/**
 * Updates a mentorship booking's status, meeting link, and counselor notes.
 */
export async function updateBookingStatus(
  id: string,
  status: BookingStatus,
  meetingLink?: string,
  adminNotes?: string
): Promise<MentorshipSessionRecord | null> {
  const sql = getNeonSql();
  if (sql) {
    try {
      await sql`
        UPDATE mentorship_bookings SET
          status = ${status},
          meeting_link = COALESCE(${meetingLink || null}, meeting_link),
          admin_notes = COALESCE(${adminNotes || null}, admin_notes),
          updated_at = NOW()
        WHERE id = ${id}
      `;
      const rows = await sql`SELECT * FROM mentorship_bookings WHERE id = ${id} LIMIT 1`;
      if (rows.length === 0) return null;
      const r = rows[0];
      return {
        id: r.id,
        mentorId: r.mentor_id,
        mentorName: r.mentor_name,
        domainTitle: r.domain_title,
        studentName: r.student_name,
        parentPhone: r.parent_phone,
        date: r.date,
        timeSlot: r.time_slot,
        primaryQuestion: r.primary_question,
        status: r.status,
        meetingLink: r.meeting_link || undefined,
        adminNotes: r.admin_notes || undefined,
        createdAt: new Date(r.created_at).toISOString(),
        updatedAt: new Date(r.updated_at).toISOString(),
      };
    } catch (err) {
      console.warn("Neon updateBookingStatus failed:", err);
    }
  }

  return queueDbWrite(async () => {
    const store = await getDatabase();
    const booking = store.bookings.find((b) => b.id === id);
    if (!booking) return null;
    booking.status = status;
    if (meetingLink !== undefined) booking.meetingLink = meetingLink;
    if (adminNotes !== undefined) booking.adminNotes = adminNotes;
    booking.updatedAt = new Date().toISOString();
    await fs.writeFile(DB_FILE, JSON.stringify(store, null, 2), "utf8");
    return booking;
  });
}

/**
 * Creates a Paid 10-Page Dossier unlock order.
 */
export async function saveDossierOrder(
  orderInput: Omit<PaidDossierOrder, "id" | "createdAt" | "currency" | "amount">
): Promise<PaidDossierOrder> {
  const sql = getNeonSql();
  const phoneNorm = normalizeIndianMobile(orderInput.parentPhone);
  const cleanPhone = phoneNorm.isValid ? phoneNorm.normalized : orderInput.parentPhone;
  const newId = `ord_${crypto.randomBytes(4).toString("hex")}`;
  const now = new Date().toISOString();

  if (sql) {
    try {
      await sql`
        INSERT INTO paid_dossiers (
          id, student_name, parent_phone, amount, currency, status
        ) VALUES (
          ${newId}, ${orderInput.studentName}, ${cleanPhone}, 499, 'INR', ${orderInput.status || 'payment_pending'}
        )
      `;
      return {
        ...orderInput,
        id: newId,
        parentPhone: cleanPhone,
        amount: 499,
        currency: "INR",
        createdAt: now,
      };
    } catch (err) {
      console.warn("Neon saveDossierOrder failed:", err);
    }
  }

  return queueDbWrite(async () => {
    const store = await getDatabase();
    const newOrder: PaidDossierOrder = {
      ...orderInput,
      id: newId,
      parentPhone: cleanPhone,
      amount: 499,
      currency: "INR",
      createdAt: now,
    };
    store.dossiers.unshift(newOrder);
    await fs.writeFile(DB_FILE, JSON.stringify(store, null, 2), "utf8");
    return newOrder;
  });
}

/**
 * Aggregates high-level admin metrics and conversion stats directly from Neon Postgres.
 */
export async function getAdminMetrics(): Promise<AdminMetricsSummary> {
  const store = await getDatabase();

  const gradeDist: Record<string, number> = {};
  store.leads.forEach((l) => {
    gradeDist[l.grade] = (gradeDist[l.grade] || 0) + 1;
  });

  const trackDist: Record<string, number> = {};
  store.bookings.forEach((b) => {
    trackDist[b.domainTitle] = (trackDist[b.domainTitle] || 0) + 1;
  });

  const paidDossiers = store.dossiers.filter((d) => d.status === "paid" || d.status === "pdf_dispatched");
  const totalRevenue = paidDossiers.length * 499;

  return {
    totalLeads: store.leads.length,
    totalParentPhones: new Set(store.leads.map((l) => l.parentPhone)).size,
    bookingsPending: store.bookings.filter((b) => b.status === "pending").length,
    bookingsConfirmed: store.bookings.filter((b) => b.status === "confirmed").length,
    paidDossiersCount: store.dossiers.length,
    totalRevenue,
    gradeDistribution: gradeDist,
    trackDistribution: trackDist,
  };
}

/**
 * Sanitizes strings for CSV to prevent Formula Injection (=, +, -, @) and RFC 4180 escapes.
 */
function escapeCsvCell(val: unknown): string {
  if (val === null || val === undefined) return '""';
  let str = String(val).replace(/[\r\n\t]/g, " ").trim();
  if (/^[=+\-@\t\r]/.test(str)) {
    str = "'" + str;
  }
  str = str.replace(/"/g, '""');
  return `"${str}"`;
}

/**
 * Exports all leads to an RFC 4180 compliant CSV string with audit logging.
 */
export async function exportLeadsToCsv(clientIp: string): Promise<string> {
  const store = await getDatabase();
  const sql = getNeonSql();

  if (sql) {
    try {
      await sql`
        INSERT INTO export_audit_log (client_ip, row_count)
        VALUES (${clientIp}, ${store.leads.length})
      `;
    } catch {}
  }

  const headers = [
    "Lead ID",
    "Date Created",
    "Student Name",
    "Grade",
    "Curriculum",
    "School Name",
    "City",
    "Parent Name",
    "Parent WhatsApp",
    "Parent Career Dream",
    "Lead Source",
    "Status",
    "Notes",
  ];

  const rows = store.leads.map((l) => [
    escapeCsvCell(l.id),
    escapeCsvCell(l.createdAt.slice(0, 10)),
    escapeCsvCell(l.studentName),
    escapeCsvCell(l.grade),
    escapeCsvCell(l.curriculum),
    escapeCsvCell(l.schoolName || "N/A"),
    escapeCsvCell(l.city),
    escapeCsvCell(l.parentName),
    escapeCsvCell(l.parentPhone),
    escapeCsvCell(l.parentDream),
    escapeCsvCell(l.source),
    escapeCsvCell(l.status),
    escapeCsvCell(l.notes || ""),
  ]);

  return [headers.join(","), ...rows.map((r) => r.join(","))].join("\r\n");
}
