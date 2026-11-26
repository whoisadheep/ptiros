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
  StudentUser,
  StudentDiaryEntry,
  StudentPlannerGoal,
  StudentSimResult,
  StudentCareerTestRecord,
  StudentPortalData,
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
        userId: r.user_id || undefined,
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
        userId: r.user_id || undefined,
        careerTestId: r.career_test_id || undefined,
        topTrackTitle: r.top_track_title || undefined,
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
          id, user_id, mentor_id, mentor_name, domain_title, student_name, parent_phone,
          date, time_slot, primary_question, status
        ) VALUES (
          ${newId}, ${bookingInput.userId || null}, ${bookingInput.mentorId}, ${bookingInput.mentorName}, ${bookingInput.domainTitle},
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
        userId: r.user_id || undefined,
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
 * Queries mentorship bookings strictly for an authenticated student account.
 */
export async function getStudentBookings(query: {
  bookingId?: string;
  phone?: string;
  studentName?: string;
  userId?: string;
}): Promise<MentorshipSessionRecord[]> {
  const sql = getNeonSql();
  const searchId = query.bookingId?.trim();
  const phoneClean = query.phone ? query.phone.replace(/[^0-9]/g, "").slice(-10) : "";
  const userIdClean = query.userId?.trim();

  if (sql) {
    try {
      let rows: any[] = [];
      if (userIdClean && phoneClean) {
        rows = await sql`
          SELECT * FROM mentorship_bookings
          WHERE user_id = ${userIdClean} OR (user_id IS NULL AND parent_phone LIKE ${"%" + phoneClean})
          ORDER BY created_at DESC
        `;
      } else if (userIdClean) {
        rows = await sql`
          SELECT * FROM mentorship_bookings
          WHERE user_id = ${userIdClean}
          ORDER BY created_at DESC
        `;
      } else if (searchId) {
        rows = await sql`
          SELECT * FROM mentorship_bookings
          WHERE id = ${searchId} OR id = ${searchId.toLowerCase()} OR id = ${searchId.toUpperCase()}
          ORDER BY created_at DESC
        `;
      } else if (phoneClean) {
        rows = await sql`
          SELECT * FROM mentorship_bookings
          WHERE parent_phone LIKE ${"%" + phoneClean}
          ORDER BY created_at DESC
        `;
      }

      return rows.map((r: any) => ({
        id: r.id,
        userId: r.user_id || undefined,
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
    } catch (err) {
      console.warn("Neon getStudentBookings failed, fallback to local file:", err);
    }
  }

  // Fallback to local file
  const store = await getDatabase();
  return store.bookings.filter((b) => {
    if (userIdClean && b.userId === userIdClean) return true;
    if (searchId && (b.id.toLowerCase() === searchId.toLowerCase() || b.id === searchId)) return true;
    if (phoneClean && !b.userId && b.parentPhone.includes(phoneClean)) return true;
    return false;
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
  const status = orderInput.status || "payment_pending";

  if (sql) {
    try {
      await sql`
        INSERT INTO paid_dossiers (
          id, user_id, career_test_id, top_track_title, student_name, parent_phone, amount, currency, status
        ) VALUES (
          ${newId},
          ${orderInput.userId || null},
          ${orderInput.careerTestId || null},
          ${orderInput.topTrackTitle || null},
          ${orderInput.studentName},
          ${cleanPhone},
          499,
          'INR',
          ${status}
        )
      `;
      if (orderInput.careerTestId && orderInput.userId) {
        const isPaid = status === "paid" || status === "pdf_dispatched";
        await sql`
          UPDATE student_career_tests
          SET dossier_order_id = ${newId},
              dossier_unlocked = CASE WHEN ${isPaid} THEN TRUE ELSE dossier_unlocked END
          WHERE id = ${orderInput.careerTestId} AND user_id = ${orderInput.userId}
        `;
      }
      return {
        ...orderInput,
        id: newId,
        parentPhone: cleanPhone,
        amount: 499,
        currency: "INR",
        status,
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
      status,
      createdAt: now,
    };
    store.dossiers.unshift(newOrder);
    await fs.writeFile(DB_FILE, JSON.stringify(store, null, 2), "utf8");
    return newOrder;
  });
}

export async function updateDossierOrderStatus(
  orderId: string,
  status: PaidDossierOrder["status"]
): Promise<PaidDossierOrder | null> {
  const sql = getNeonSql();
  if (sql) {
    const isPaid = status === "paid" || status === "pdf_dispatched";
    const rows = await sql`
      WITH updated_order AS (
        UPDATE paid_dossiers
        SET status = ${status}
        WHERE id = ${orderId}
        RETURNING *
      ),
      unlock_test AS (
        UPDATE student_career_tests t
        SET dossier_unlocked = TRUE, dossier_order_id = ${orderId}
        FROM updated_order o
        WHERE ${isPaid}
          AND (
            (o.career_test_id IS NOT NULL AND t.id = o.career_test_id)
            OR (o.career_test_id IS NULL AND o.user_id IS NOT NULL AND t.user_id = o.user_id)
          )
      )
      SELECT * FROM updated_order;
    `;
    if (rows.length === 0) return null;
    const r = rows[0];
    return {
      id: r.id,
      userId: r.user_id || undefined,
      careerTestId: r.career_test_id || undefined,
      topTrackTitle: r.top_track_title || undefined,
      studentName: r.student_name,
      parentPhone: r.parent_phone,
      amount: Number(r.amount) || 499,
      currency: r.currency || "INR",
      status: r.status,
      createdAt: new Date(r.created_at).toISOString(),
    };
  }

  return queueDbWrite(async () => {
    const store = await getDatabase();
    const target = store.dossiers.find((d) => d.id === orderId);
    if (!target) return null;
    target.status = status;
    await fs.writeFile(DB_FILE, JSON.stringify(store, null, 2), "utf8");
    return target;
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

/* =========================================================================
   STUDENT AUTHENTICATION & PORTAL STORE (Neon Cloud + Fallback)
   ========================================================================= */

export const STUDENT_SECRET = process.env.STUDENT_SECRET_KEY || "ptiros-student-secret-session-key-2026";
export const STUDENT_COOKIE_NAME = "ptiros_student_token";

export function hashStudentPassword(pass: string): string {
  return crypto.createHash("sha256").update(pass).digest("hex");
}

export function createStudentSessionToken(userId: string): string {
  const hmac = crypto.createHmac("sha256", STUDENT_SECRET).update(userId).digest("hex");
  return `${userId}.${hmac}`;
}

export function verifyStudentSessionToken(token?: string | null): string | null {
  if (!token || typeof token !== "string" || !token.includes(".")) return null;
  const [userId, givenHmac] = token.split(".");
  if (!userId || !givenHmac) return null;
  const expectedHmac = crypto.createHmac("sha256", STUDENT_SECRET).update(userId).digest("hex");
  try {
    const a = Buffer.from(givenHmac);
    const b = Buffer.from(expectedHmac);
    if (a.length !== b.length) return null;
    if (crypto.timingSafeEqual(a, b)) {
      return userId;
    }
  } catch {
    return null;
  }
  return null;
}

function formatDateString(d: Date = new Date()): string {
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const month = months[d.getMonth()];
  const day = String(d.getDate()).padStart(2, "0");
  const year = d.getFullYear();
  return `${month} ${day}, ${year}`;
}

function mapNeonUserRow(r: Record<string, any>): StudentUser {
  return {
    id: r.id,
    name: r.name,
    email: r.email,
    age: r.age !== null && r.age !== undefined ? Number(r.age) : undefined,
    gender: r.gender || undefined,
    address: r.address || undefined,
    singleChild:
      r.single_child !== null && r.single_child !== undefined ? Boolean(r.single_child) : undefined,
    fatherName: r.father_name || undefined,
    motherName: r.mother_name || undefined,
    personalPhone: r.personal_phone || undefined,
    parentEmail: r.parent_email || undefined,
    grade: r.grade,
    schoolName: r.school_name || undefined,
    schoolAddress: r.school_address || undefined,
    city: r.city,
    state: r.state || undefined,
    curriculum: r.curriculum,
    parentName: r.parent_name || undefined,
    parentPhone: r.parent_phone || undefined,
    parentDream: r.parent_dream || undefined,
    lastYearRank: r.last_year_rank || undefined,
    lastYearPercentage: r.last_year_percentage || undefined,
    proSports:
      r.pro_sports !== null && r.pro_sports !== undefined ? Boolean(r.pro_sports) : undefined,
    competitions: r.competitions || undefined,
    aparId: r.apar_id || undefined,
    avatarInitials: r.avatar_initials || "ST",
    createdAt: typeof r.created_at === "string" ? r.created_at : new Date(r.created_at).toISOString(),
    updatedAt: r.updated_at
      ? typeof r.updated_at === "string"
        ? r.updated_at
        : new Date(r.updated_at).toISOString()
      : undefined,
  };
}

export async function getStudentUserById(userId: string): Promise<StudentUser | null> {
  const sql = getNeonSql();
  if (sql) {
    try {
      const rows = await sql`
        SELECT id, name, email, age, gender, address, single_child, father_name, mother_name,
               personal_phone, parent_email, grade, school_name, school_address, city, state,
               curriculum, parent_name, parent_phone, parent_dream, last_year_rank,
               last_year_percentage, pro_sports, competitions, apar_id, avatar_initials,
               created_at, updated_at
        FROM users
        WHERE id = ${userId}
        LIMIT 1;
      `;
      if (rows.length > 0) {
        return mapNeonUserRow(rows[0]);
      }
    } catch (err) {
      console.warn("Neon getStudentUserById error:", err);
    }
  }

  return null;
}

export async function getStudentUserByEmail(email: string): Promise<{ user: StudentUser; passwordHash: string } | null> {
  const cleanEmail = email.trim().toLowerCase();
  const sql = getNeonSql();
  if (sql) {
    try {
      const rows = await sql`
        SELECT id, name, email, password_hash, age, gender, address, single_child, father_name,
               mother_name, personal_phone, parent_email, grade, school_name, school_address,
               city, state, curriculum, parent_name, parent_phone, parent_dream,
               last_year_rank, last_year_percentage, pro_sports, competitions, apar_id,
               avatar_initials, created_at, updated_at
        FROM users
        WHERE LOWER(email) = ${cleanEmail}
        LIMIT 1;
      `;
      if (rows.length > 0) {
        const r = rows[0];
        return { user: mapNeonUserRow(r), passwordHash: r.password_hash };
      }
    } catch (err) {
      console.warn("Neon getStudentUserByEmail error:", err);
    }
  }

  return null;
}

export interface CreateStudentInput {
  name: string;
  email: string;
  password: string;
  age?: number;
  gender?: string;
  address?: string;
  singleChild?: boolean;
  fatherName?: string;
  motherName?: string;
  personalPhone?: string;
  parentEmail?: string;
  grade: string;
  schoolName?: string;
  schoolAddress?: string;
  city: string;
  state?: string;
  curriculum: string;
  parentName?: string;
  parentPhone?: string;
  parentDream?: string;
  lastYearRank?: string;
  lastYearPercentage?: string;
  proSports?: boolean;
  competitions?: string;
  aparId?: string;
}

export async function createStudentUser(data: CreateStudentInput): Promise<StudentUser> {
  const userId = `usr_${crypto.randomBytes(4).toString("hex")}`;
  const cleanEmail = data.email.trim().toLowerCase();
  const cleanParentEmail = data.parentEmail?.trim().toLowerCase() || null;
  const passwordHash = hashStudentPassword(data.password);
  const initials = data.name
    .split(/\s+/)
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2) || "ST";

  const sql = getNeonSql();
  if (sql) {
    await sql`
      INSERT INTO users (
        id, name, email, password_hash, age, gender, address, single_child,
        father_name, mother_name, personal_phone, parent_email, grade,
        school_name, school_address, city, state, curriculum, parent_name,
        parent_phone, parent_dream, last_year_rank, last_year_percentage,
        pro_sports, competitions, apar_id, avatar_initials
      ) VALUES (
        ${userId}, ${data.name.trim()}, ${cleanEmail}, ${passwordHash},
        ${data.age ?? null}, ${data.gender?.trim() || null}, ${data.address?.trim() || null},
        ${typeof data.singleChild === "boolean" ? data.singleChild : null},
        ${data.fatherName?.trim() || null}, ${data.motherName?.trim() || null},
        ${data.personalPhone?.trim() || null}, ${cleanParentEmail}, ${data.grade},
        ${data.schoolName?.trim() || null}, ${data.schoolAddress?.trim() || null},
        ${data.city.trim()}, ${data.state?.trim() || null}, ${data.curriculum},
        ${data.parentName?.trim() || data.fatherName?.trim() || data.motherName?.trim() || null},
        ${data.parentPhone?.trim() || null}, ${data.parentDream?.trim() || null},
        ${data.lastYearRank?.trim() || null}, ${data.lastYearPercentage?.trim() || null},
        ${typeof data.proSports === "boolean" ? data.proSports : null},
        ${data.competitions?.trim() || null}, ${data.aparId?.trim() || null},
        ${initials}
      );
    `;
  }

  // Record lead in CRM database so counselors have full onboarding context
  try {
    await saveLead({
      studentName: data.name.trim(),
      grade: data.grade as any,
      schoolName: data.schoolName?.trim(),
      city: data.city.trim(),
      curriculum: data.curriculum as any,
      parentName:
        data.parentName?.trim() ||
        data.fatherName?.trim() ||
        data.motherName?.trim() ||
        "Guardian",
      parentPhone: data.parentPhone || "9800000000",
      parentDream: data.parentDream?.trim() || "Exploring potential",
      source: "career_test",
      parentConsent: true,
      notes: `Registered student account (${cleanEmail}${cleanParentEmail ? `, Parent: ${cleanParentEmail}` : ""})`,
    });
  } catch (err) {
    console.warn("Could not mirror student to leads table:", err);
  }

  return {
    id: userId,
    name: data.name.trim(),
    email: cleanEmail,
    age: data.age,
    gender: data.gender?.trim(),
    address: data.address?.trim(),
    singleChild: data.singleChild,
    fatherName: data.fatherName?.trim(),
    motherName: data.motherName?.trim(),
    personalPhone: data.personalPhone?.trim(),
    parentEmail: cleanParentEmail || undefined,
    grade: data.grade,
    schoolName: data.schoolName?.trim(),
    schoolAddress: data.schoolAddress?.trim(),
    city: data.city.trim(),
    state: data.state?.trim(),
    curriculum: data.curriculum,
    parentName: data.parentName?.trim() || data.fatherName?.trim() || data.motherName?.trim(),
    parentPhone: data.parentPhone?.trim(),
    parentDream: data.parentDream?.trim(),
    lastYearRank: data.lastYearRank?.trim(),
    lastYearPercentage: data.lastYearPercentage?.trim(),
    proSports: data.proSports,
    competitions: data.competitions?.trim(),
    aparId: data.aparId?.trim(),
    avatarInitials: initials,
    createdAt: new Date().toISOString(),
  };
}

export async function updateStudentUserProfile(
  userId: string,
  updates: Partial<Omit<StudentUser, "id" | "email" | "createdAt" | "updatedAt">>
): Promise<StudentUser | null> {
  const existing = await getStudentUserById(userId);
  if (!existing) return null;

  const merged: StudentUser = {
    ...existing,
    ...updates,
    id: existing.id,
    email: existing.email,
    name: (updates.name ?? existing.name).trim(),
    city: (updates.city ?? existing.city).trim() || existing.city,
    grade: (updates.grade ?? existing.grade).trim() || existing.grade,
    curriculum: (updates.curriculum ?? existing.curriculum).trim() || existing.curriculum,
    avatarInitials:
      (updates.name ?? existing.name)
        .split(/\s+/)
        .map((w) => w[0])
        .join("")
        .toUpperCase()
        .slice(0, 2) || existing.avatarInitials,
    updatedAt: new Date().toISOString(),
  };

  const sql = getNeonSql();
  if (sql) {
    const rows = await sql`
      UPDATE users SET
        name = ${merged.name},
        age = ${merged.age ?? null},
        gender = ${merged.gender?.trim() || null},
        address = ${merged.address?.trim() || null},
        single_child = ${typeof merged.singleChild === "boolean" ? merged.singleChild : null},
        father_name = ${merged.fatherName?.trim() || null},
        mother_name = ${merged.motherName?.trim() || null},
        personal_phone = ${merged.personalPhone?.trim() || null},
        parent_email = ${merged.parentEmail?.trim().toLowerCase() || null},
        grade = ${merged.grade},
        school_name = ${merged.schoolName?.trim() || null},
        school_address = ${merged.schoolAddress?.trim() || null},
        city = ${merged.city},
        state = ${merged.state?.trim() || null},
        curriculum = ${merged.curriculum},
        parent_name = ${merged.parentName?.trim() || merged.fatherName?.trim() || merged.motherName?.trim() || null},
        parent_phone = ${merged.parentPhone?.trim() || null},
        parent_dream = ${merged.parentDream?.trim() || null},
        last_year_rank = ${merged.lastYearRank?.trim() || null},
        last_year_percentage = ${merged.lastYearPercentage?.trim() || null},
        pro_sports = ${typeof merged.proSports === "boolean" ? merged.proSports : null},
        competitions = ${merged.competitions?.trim() || null},
        apar_id = ${merged.aparId?.trim() || null},
        avatar_initials = ${merged.avatarInitials},
        updated_at = NOW()
      WHERE id = ${userId}
      RETURNING *;
    `;
    if (rows.length > 0) {
      return mapNeonUserRow(rows[0]);
    }
  }

  return merged;
}

export async function getStudentPortalData(userId: string): Promise<StudentPortalData | null> {
  const user = await getStudentUserById(userId);
  if (!user) return null;

  let diary: StudentDiaryEntry[] = [];
  let goals: StudentPlannerGoal[] = [];
  let simulations: StudentSimResult[] = [];
  let careerTests: StudentCareerTestRecord[] = [];
  let dossiers: PaidDossierOrder[] = [];

  const sql = getNeonSql();
  if (sql) {
    try {
      const diaryRows = await sql`
        SELECT id, user_id, date, title, content, category, created_at
        FROM student_diary
        WHERE user_id = ${userId}
        ORDER BY created_at DESC;
      `;
      diary = diaryRows.map((r) => ({
        id: r.id,
        userId: r.user_id,
        date: r.date,
        title: r.title,
        content: r.content,
        category: r.category || "reflection",
        createdAt: typeof r.created_at === "string" ? r.created_at : new Date(r.created_at).toISOString(),
      }));

      const goalRows = await sql`
        SELECT id, user_id, title, time_view, completed, deadline, created_at
        FROM student_planner_goals
        WHERE user_id = ${userId}
        ORDER BY created_at ASC;
      `;
      goals = goalRows.map((r) => ({
        id: r.id,
        userId: r.user_id,
        title: r.title,
        timeView: (r.time_view as "daily" | "monthly" | "yearly") || "daily",
        completed: Boolean(r.completed),
        deadline: r.deadline || undefined,
        createdAt: typeof r.created_at === "string" ? r.created_at : new Date(r.created_at).toISOString(),
      }));

      const simRows = await sql`
        SELECT id, user_id, track_id, track_title, fit_score, resilience_points, badge_earned, completed_at
        FROM student_sim_results
        WHERE user_id = ${userId}
        ORDER BY completed_at DESC;
      `;
      simulations = simRows.map((r) => ({
        id: r.id,
        userId: r.user_id,
        trackId: r.track_id,
        trackTitle: r.track_title,
        fitScore: Number(r.fit_score),
        resiliencePoints: Number(r.resilience_points),
        badgeEarned: r.badge_earned || undefined,
        completedAt: typeof r.completed_at === "string" ? r.completed_at : new Date(r.completed_at).toISOString(),
      }));

      careerTests = await getStudentCareerTests(userId);

      const dossierRows = await sql`
        SELECT id, user_id, career_test_id, top_track_title, student_name, parent_phone, amount, currency, status, created_at
        FROM paid_dossiers
        WHERE user_id = ${userId}
        ORDER BY created_at DESC;
      `;
      dossiers = dossierRows.map((r: any) => ({
        id: r.id,
        userId: r.user_id || undefined,
        careerTestId: r.career_test_id || undefined,
        topTrackTitle: r.top_track_title || undefined,
        studentName: r.student_name,
        parentPhone: r.parent_phone,
        amount: Number(r.amount) || 499,
        currency: r.currency || "INR",
        status: r.status,
        createdAt: typeof r.created_at === "string" ? r.created_at : new Date(r.created_at).toISOString(),
      }));
    } catch (err) {
      console.warn("Neon getStudentPortalData error:", err);
    }
  }

  const bookings = await getStudentBookings({
    userId: user.id,
  });

  return { user, diary, goals, simulations, careerTests, dossiers, bookings };
}

export async function addStudentDiaryEntry(
  userId: string,
  data: { title: string; content: string; category?: string }
): Promise<StudentDiaryEntry> {
  const id = `dia_${crypto.randomBytes(4).toString("hex")}`;
  const dateStr = formatDateString();
  const category = data.category || "reflection";
  const now = new Date().toISOString();

  const sql = getNeonSql();
  if (sql) {
    await sql`
      INSERT INTO student_diary (id, user_id, date, title, content, category)
      VALUES (${id}, ${userId}, ${dateStr}, ${data.title.trim()}, ${data.content.trim()}, ${category});
    `;
  }

  return {
    id,
    userId,
    date: dateStr,
    title: data.title.trim(),
    content: data.content.trim(),
    category,
    createdAt: now,
  };
}

export async function toggleStudentGoal(userId: string, goalId: string, completed: boolean): Promise<boolean> {
  const sql = getNeonSql();
  if (sql) {
    try {
      await sql`
        UPDATE student_planner_goals
        SET completed = ${completed}
        WHERE id = ${goalId} AND user_id = ${userId};
      `;
      return true;
    } catch (err) {
      console.warn("Neon toggleStudentGoal error:", err);
    }
  }
  return true;
}

export async function addStudentGoal(
  userId: string,
  data: { title: string; timeView: "daily" | "monthly" | "yearly"; deadline?: string }
): Promise<StudentPlannerGoal> {
  const id = `g_${crypto.randomBytes(4).toString("hex")}`;
  const now = new Date().toISOString();
  const sql = getNeonSql();
  if (sql) {
    await sql`
      INSERT INTO student_planner_goals (id, user_id, title, time_view, completed, deadline)
      VALUES (${id}, ${userId}, ${data.title.trim()}, ${data.timeView}, false, ${data.deadline?.trim() || null});
    `;
  }
  return {
    id,
    userId,
    title: data.title.trim(),
    timeView: data.timeView,
    completed: false,
    deadline: data.deadline?.trim(),
    createdAt: now,
  };
}

export async function deleteStudentGoal(userId: string, goalId: string): Promise<boolean> {
  const sql = getNeonSql();
  if (sql) {
    try {
      await sql`
        DELETE FROM student_planner_goals
        WHERE id = ${goalId} AND user_id = ${userId};
      `;
      return true;
    } catch (err) {
      console.warn("Neon deleteStudentGoal error:", err);
    }
  }
  return true;
}

export async function deleteStudentDiaryEntry(userId: string, entryId: string): Promise<boolean> {
  const sql = getNeonSql();
  if (sql) {
    try {
      await sql`
        DELETE FROM student_diary
        WHERE id = ${entryId} AND user_id = ${userId};
      `;
      return true;
    } catch (err) {
      console.warn("Neon deleteStudentDiaryEntry error:", err);
    }
  }
  return true;
}

export async function addStudentSimResult(
  userId: string,
  data: {
    trackId: string;
    trackTitle: string;
    fitScore: number;
    resiliencePoints: number;
    badgeEarned?: string;
  }
): Promise<StudentSimResult> {
  const id = `sim_${crypto.randomBytes(4).toString("hex")}`;
  const now = new Date().toISOString();
  const sql = getNeonSql();
  if (sql) {
    try {
      await sql`
        INSERT INTO student_sim_results (id, user_id, track_id, track_title, fit_score, resilience_points, badge_earned, completed_at)
        VALUES (${id}, ${userId}, ${data.trackId}, ${data.trackTitle}, ${data.fitScore}, ${data.resiliencePoints}, ${data.badgeEarned || null}, ${now});
      `;
    } catch (err) {
      console.warn("Neon addStudentSimResult error:", err);
    }
  }
  return {
    id,
    userId,
    trackId: data.trackId,
    trackTitle: data.trackTitle,
    fitScore: data.fitScore,
    resiliencePoints: data.resiliencePoints,
    badgeEarned: data.badgeEarned,
    completedAt: now,
  };
}

function mapNeonCareerTestRow(r: Record<string, any>): StudentCareerTestRecord {
  const parseJsonField = <T,>(val: unknown, fallback: T): T => {
    if (typeof val === "string") {
      try {
        return JSON.parse(val) as T;
      } catch {
        return fallback;
      }
    }
    if (val && typeof val === "object") {
      return val as T;
    }
    return fallback;
  };

  return {
    id: r.id,
    userId: r.user_id,
    studentName: r.student_name,
    grade: r.grade,
    topTrackId: r.top_track_id,
    topTrackTitle: r.top_track_title,
    matchConfidence: Number(r.match_confidence),
    archetype: r.archetype,
    recommendedStream: r.recommended_stream,
    answers: parseJsonField<Record<string, string>>(r.answers_json, {}),
    dimensionScores: parseJsonField(r.dimension_scores_json, []),
    rankedTracks: parseJsonField(r.ranked_tracks_json, []),
    dossierUnlocked: Boolean(r.dossier_unlocked),
    dossierOrderId: r.dossier_order_id || undefined,
    completedAt:
      typeof r.completed_at === "string"
        ? r.completed_at
        : new Date(r.completed_at).toISOString(),
  };
}

export async function saveStudentCareerTest(
  userId: string,
  data: {
    studentName: string;
    grade: string;
    topTrackId: string;
    topTrackTitle: string;
    matchConfidence: number;
    archetype: string;
    recommendedStream: string;
    answers: Record<string, string>;
    dimensionScores: StudentCareerTestRecord["dimensionScores"];
    rankedTracks: StudentCareerTestRecord["rankedTracks"];
  }
): Promise<StudentCareerTestRecord> {
  const id = `ct_${crypto.randomBytes(4).toString("hex")}`;
  const now = new Date().toISOString();
  let dossierUnlocked = false;
  let dossierOrderId: string | undefined;

  const sql = getNeonSql();
  if (sql) {
    // Propagate DB errors rather than returning a synthetic success record
    const paidRows = await sql`
      SELECT id
      FROM paid_dossiers
      WHERE user_id = ${userId} AND status IN ('paid', 'pdf_dispatched')
      ORDER BY created_at DESC
      LIMIT 1;
    `;
    if (paidRows.length > 0) {
      dossierUnlocked = true;
      dossierOrderId = paidRows[0].id;
    }

    await sql`
      INSERT INTO student_career_tests (
        id, user_id, student_name, grade, top_track_id, top_track_title,
        match_confidence, archetype, recommended_stream,
        answers_json, dimension_scores_json, ranked_tracks_json,
        dossier_unlocked, dossier_order_id, completed_at
      ) VALUES (
        ${id}, ${userId}, ${data.studentName}, ${data.grade},
        ${data.topTrackId}, ${data.topTrackTitle},
        ${Math.round(data.matchConfidence)}, ${data.archetype}, ${data.recommendedStream},
        ${JSON.stringify(data.answers)}::jsonb,
        ${JSON.stringify(data.dimensionScores)}::jsonb,
        ${JSON.stringify(data.rankedTracks)}::jsonb,
        ${dossierUnlocked}, ${dossierOrderId || null}, ${now}
      );
    `;
  }

  return {
    id,
    userId,
    studentName: data.studentName,
    grade: data.grade,
    topTrackId: data.topTrackId,
    topTrackTitle: data.topTrackTitle,
    matchConfidence: Math.round(data.matchConfidence),
    archetype: data.archetype,
    recommendedStream: data.recommendedStream,
    answers: data.answers,
    dimensionScores: data.dimensionScores,
    rankedTracks: data.rankedTracks,
    dossierUnlocked,
    dossierOrderId,
    completedAt: now,
  };
}

export async function getStudentCareerTests(userId: string): Promise<StudentCareerTestRecord[]> {
  const sql = getNeonSql();
  if (!sql) return [];
  try {
    const rows = await sql`
      SELECT id, user_id, student_name, grade, top_track_id, top_track_title,
             match_confidence, archetype, recommended_stream,
             answers_json, dimension_scores_json, ranked_tracks_json,
             dossier_unlocked, dossier_order_id, completed_at
      FROM student_career_tests
      WHERE user_id = ${userId}
      ORDER BY completed_at DESC;
    `;
    return rows.map(mapNeonCareerTestRow);
  } catch (err) {
    console.warn("Neon getStudentCareerTests error:", err);
    return [];
  }
}

export async function getStudentCareerTestById(
  userId: string,
  testId: string
): Promise<StudentCareerTestRecord | null> {
  const sql = getNeonSql();
  if (!sql) return null;
  try {
    const rows = await sql`
      SELECT id, user_id, student_name, grade, top_track_id, top_track_title,
             match_confidence, archetype, recommended_stream,
             answers_json, dimension_scores_json, ranked_tracks_json,
             dossier_unlocked, dossier_order_id, completed_at
      FROM student_career_tests
      WHERE id = ${testId} AND user_id = ${userId}
      LIMIT 1;
    `;
    if (rows.length === 0) return null;
    return mapNeonCareerTestRow(rows[0]);
  } catch (err) {
    console.warn("Neon getStudentCareerTestById error:", err);
    return null;
  }
}
