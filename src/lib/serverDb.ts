import fs from "fs/promises";
import path from "path";
import crypto from "crypto";
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
 * Ensures data directory and store file exist.
 */
async function ensureDbFile(): Promise<void> {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
    try {
      await fs.access(DB_FILE);
    } catch {
      const initialSeed: DatabaseStore = {
        leads: [
          {
            id: "lead_init_001",
            studentName: "Aarav Sharma",
            grade: "Class 10",
            schoolName: "Delhi Public School, R.K. Puram",
            city: "Delhi NCR",
            curriculum: "CBSE",
            parentName: "Rajesh Sharma",
            parentPhone: "9876543210",
            parentDream: "Wants stable engineering/technology career",
            source: "intake_modal",
            status: "new",
            notes: "Interested in AI & Robotics track. Father works in PSU.",
            parentConsent: true,
            createdAt: new Date(Date.now() - 3600000 * 24).toISOString(),
            updatedAt: new Date(Date.now() - 3600000 * 24).toISOString(),
          },
          {
            id: "lead_init_002",
            studentName: "Meera Nair",
            grade: "Class 11",
            schoolName: "The Mother's International School",
            city: "Bengaluru",
            curriculum: "ICSE",
            parentName: "Suresh Nair",
            parentPhone: "9812345678",
            parentDream: "Seeking corporate law & public leadership",
            source: "simulator_completion",
            status: "contacted",
            notes: "Scored 92% in Corporate Law simulation. Looking for CLAT counseling.",
            parentConsent: true,
            createdAt: new Date(Date.now() - 3600000 * 12).toISOString(),
            updatedAt: new Date(Date.now() - 3600000 * 10).toISOString(),
          },
        ],
        bookings: [
          {
            id: "bk_init_001",
            mentorId: "dr-aryan-sharma",
            mentorName: "Dr. Aryan Sharma",
            domainTitle: "AI & Autonomous Robotics",
            studentName: "Aarav Sharma",
            parentPhone: "9876543210",
            date: new Date(Date.now() + 3600000 * 24).toISOString().split("T")[0],
            timeSlot: "11:30 AM - 11:50 AM IST",
            primaryQuestion: "Should I focus on JEE Advanced math or start ROS robotics projects in 11th?",
            status: "pending",
            createdAt: new Date(Date.now() - 3600000 * 6).toISOString(),
            updatedAt: new Date(Date.now() - 3600000 * 6).toISOString(),
          },
        ],
        dossiers: [
          {
            id: "ord_init_001",
            studentName: "Meera Nair",
            parentPhone: "9812345678",
            amount: 499,
            currency: "INR",
            status: "paid",
            createdAt: new Date(Date.now() - 3600000 * 8).toISOString(),
          },
        ],
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
 * Reads database store with crash recovery.
 */
export async function getDatabase(): Promise<DatabaseStore> {
  await ensureDbFile();
  try {
    const raw = await fs.readFile(DB_FILE, "utf8");
    return JSON.parse(raw) as DatabaseStore;
  } catch (err) {
    console.error("Corrupted database file detected. Attempting recovery snapshot...", err);
    try {
      const corruptName = path.join(DATA_DIR, `ptiros_store.corrupt.${Date.now()}.json`);
      await fs.copyFile(DB_FILE, corruptName);
    } catch {}
    // Return empty safe structure
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
 * Atomically writes database to disk using a unique temporary file and rename.
 */
async function atomicWriteDatabase(store: DatabaseStore): Promise<void> {
  await ensureDbFile();
  store.meta.lastUpdated = new Date().toISOString();
  const tempFile = path.join(DATA_DIR, `ptiros_store.${crypto.randomUUID()}.tmp`);
  await fs.writeFile(tempFile, JSON.stringify(store, null, 2), "utf8");
  await fs.rename(tempFile, DB_FILE);
}

/**
 * Ingests or updates a student-parent lead.
 */
export async function saveLead(
  leadInput: Omit<StudentLead, "id" | "createdAt" | "updatedAt" | "status"> & { status?: LeadStatus }
): Promise<StudentLead> {
  return queueDbWrite(async () => {
    const store = await getDatabase();
    const phoneNorm = normalizeIndianMobile(leadInput.parentPhone);
    const cleanPhone = phoneNorm.isValid ? phoneNorm.normalized : leadInput.parentPhone.slice(-10);

    const now = new Date().toISOString();
    const existingIdx = store.leads.findIndex(
      (l) => l.parentPhone === cleanPhone && l.studentName.trim().toLowerCase() === leadInput.studentName.trim().toLowerCase()
    );

    if (existingIdx >= 0) {
      // Upsert update
      const existing = store.leads[existingIdx];
      const updated: StudentLead = {
        ...existing,
        ...leadInput,
        parentPhone: cleanPhone,
        updatedAt: now,
      };
      store.leads[existingIdx] = updated;
      await atomicWriteDatabase(store);
      return updated;
    }

    // New Lead
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
    await atomicWriteDatabase(store);
    return newLead;
  });
}

/**
 * Updates an existing lead status or counselor notes.
 */
export async function updateLeadStatus(id: string, status: LeadStatus, notes?: string): Promise<StudentLead | null> {
  return queueDbWrite(async () => {
    const store = await getDatabase();
    const lead = store.leads.find((l) => l.id === id);
    if (!lead) return null;

    lead.status = status;
    if (notes !== undefined) lead.notes = notes;
    lead.updatedAt = new Date().toISOString();

    await atomicWriteDatabase(store);
    return lead;
  });
}

/**
 * Creates a new 1-on-1 mentorship session booking with slot conflict checking.
 */
export async function saveBooking(
  bookingInput: Omit<MentorshipSessionRecord, "id" | "createdAt" | "updatedAt" | "status">
): Promise<{ success: boolean; booking?: MentorshipSessionRecord; conflict?: boolean }> {
  return queueDbWrite(async () => {
    const store = await getDatabase();

    // Conflict Check: Is the mentor already booked for this exact slot?
    const hasConflict = store.bookings.some(
      (b) =>
        b.mentorId === bookingInput.mentorId &&
        b.date === bookingInput.date &&
        b.timeSlot === bookingInput.timeSlot &&
        b.status !== "cancelled"
    );

    if (hasConflict) {
      return { success: false, conflict: true };
    }

    const phoneNorm = normalizeIndianMobile(bookingInput.parentPhone);
    const cleanPhone = phoneNorm.isValid ? phoneNorm.normalized : bookingInput.parentPhone.slice(-10);
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
    await atomicWriteDatabase(store);
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
  return queueDbWrite(async () => {
    const store = await getDatabase();
    const booking = store.bookings.find((b) => b.id === id);
    if (!booking) return null;

    booking.status = status;
    if (meetingLink !== undefined) booking.meetingLink = meetingLink;
    if (adminNotes !== undefined) booking.adminNotes = adminNotes;
    booking.updatedAt = new Date().toISOString();

    await atomicWriteDatabase(store);
    return booking;
  });
}

/**
 * Creates a Paid 10-Page Dossier unlock order.
 */
export async function saveDossierOrder(
  orderInput: Omit<PaidDossierOrder, "id" | "createdAt" | "currency" | "amount">
): Promise<PaidDossierOrder> {
  return queueDbWrite(async () => {
    const store = await getDatabase();
    const phoneNorm = normalizeIndianMobile(orderInput.parentPhone);

    const newOrder: PaidDossierOrder = {
      ...orderInput,
      id: `ord_${crypto.randomBytes(4).toString("hex")}`,
      parentPhone: phoneNorm.isValid ? phoneNorm.normalized : orderInput.parentPhone,
      amount: 499,
      currency: "INR",
      createdAt: new Date().toISOString(),
    };

    store.dossiers.unshift(newOrder);
    await atomicWriteDatabase(store);
    return newOrder;
  });
}

/**
 * Aggregates high-level admin metrics and conversion stats.
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
  // Prevent CSV Formula Injection in Excel/Sheets
  if (/^[=+\-@\t\r]/.test(str)) {
    str = "'" + str;
  }
  // Escape inner quotes
  str = str.replace(/"/g, '""');
  return `"${str}"`;
}

/**
 * Exports all leads to an RFC 4180 compliant CSV string with audit logging.
 */
export async function exportLeadsToCsv(clientIp: string): Promise<string> {
  return queueDbWrite(async () => {
    const store = await getDatabase();

    // Audit log
    store.exportAuditLog.push({
      timestamp: new Date().toISOString(),
      ip: clientIp,
      count: store.leads.length,
    });
    await atomicWriteDatabase(store);

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
  });
}
