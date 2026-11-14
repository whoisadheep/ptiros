# Technical Design Specification: Zero-Cost Database Layer & Admin CRM Panel (v2.0)

**Project:** PTIROS Education Platform  
**Target Routes:** `/api/leads`, `/api/bookings`, `/api/dossiers`, `/api/admin/*`, `/admin`  
**Status:** APPROVED FOR IMPLEMENTATION (Post EGM Dual-Audit Revision)  
**Auditors:** `egm-design` (Hostile System Critic), `egm-implementation-readiness` (Pragmatic Tech Lead)

---

## 1. Executive Summary & Production Architecture
This specification defines the server-side persistence layer and Admin CRM for PTIROS, engineered to operate with zero cloud subscription costs, robust concurrency guarantees, and rigorous security:

1. **Persistence Engine (`src/lib/serverDb.ts`)**:
   - Atomic file-backed engine stored at `data/ptiros_store.json`.
   - **Concurrency Safety via In-Process Write Queue (Mutex)**: All mutating operations are sequenced through a Promise queue (`queueDbWrite`) ensuring zero Lost Updates.
   - **Crash-Resistant Atomic Writes**: Writes stream to a unique temporary file (`ptiros_store.<uuid>.tmp`), execute `fs.fdatasync()`, and atomically replace the database file via `fs.promises.rename()`.
   - **Corrupted State Recovery**: Automatic JSON corruption detection, backup snapshot creation (`ptiros_store.corrupt.<timestamp>.json`), and recovery.
2. **RESTful Route Handlers**:
   - `POST /api/leads` (Ingest & upsert student-parent leads with phone normalization & 16KB body capping)
   - `GET /api/leads` (Admin paginated/filtered CRM query)
   - `POST /api/bookings` (Create 1-on-1 mentorship session with 409 Conflict collision checks)
   - `GET /api/bookings` & `PATCH /api/bookings/[id]` (Admin booking queue & status dispatcher)
   - `POST /api/admin/auth` (Timing-safe PIN verification, rate limiting, and HTTP-only cookie issuance)
   - `GET /api/admin/metrics` (Funnel analytics, grade distribution, track interest)
   - `GET /api/admin/export` (RFC 4180 compliant CSV stream with formula injection sanitization and audit logging)
3. **Admin CRM Portal (`/admin`)**:
   - Protected by server-side verification and cookie session.
   - Searchable, filterable leads table with **1-Click WhatsApp Lead Engagement** (`wa.me/91${phone}?text=...`) using strict URI encoding.
   - Mentorship booking manager with Google Meet linking.
   - Conversion metrics & one-click CSV export.

---

## 2. Complete Data Models & TypeScript Contracts

```typescript
// src/types/database.ts

export type StudentGrade =
  | "Class 6" | "Class 7" | "Class 8" | "Class 9"
  | "Class 10" | "Class 11" | "Class 12" | "Dropper / UG 1st Yr";

export type SchoolCurriculum =
  | "CBSE" | "ICSE" | "IB" | "Cambridge" | "State Board" | "Other";

export type LeadSource = "intake_modal" | "simulator_completion" | "career_test" | "mentor_booking";

export type LeadStatus = "new" | "contacted" | "enrolled" | "archived";

export interface StudentLead {
  id: string; // "lead_XXXXXXXX"
  studentName: string;
  grade: StudentGrade;
  schoolName?: string;
  city: string;
  curriculum: SchoolCurriculum;
  parentName: string;
  parentPhone: string; // Strict 10-digit normalized Indian mobile (^[6-9]\d{9}$)
  parentDream: string;
  source: LeadSource;
  status: LeadStatus;
  notes?: string;
  parentConsent: boolean; // DPDP Act compliance
  createdAt: string; // ISO 8601
  updatedAt: string;
}

export type BookingStatus = "pending" | "confirmed" | "completed" | "cancelled";

export interface MentorshipSessionRecord {
  id: string; // "bk_XXXXXXXX"
  mentorId: string;
  mentorName: string;
  domainTitle: string;
  studentName: string;
  parentPhone: string; // 10-digit format
  date: string; // YYYY-MM-DD
  timeSlot: string; // e.g. "11:30 AM - 11:50 AM IST"
  primaryQuestion: string;
  status: BookingStatus;
  meetingLink?: string;
  adminNotes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PaidDossierOrder {
  id: string; // "ord_XXXXXXXX"
  studentName: string;
  parentPhone: string;
  amount: number; // 499
  currency: "INR";
  status: "payment_pending" | "paid" | "pdf_dispatched";
  createdAt: string;
}

export interface AdminMetricsSummary {
  totalLeads: number;
  totalParentPhones: number;
  bookingsPending: number;
  bookingsConfirmed: number;
  paidDossiersCount: number;
  totalRevenue: number;
  gradeDistribution: Record<string, number>;
  trackDistribution: Record<string, number>;
}

export interface DatabaseStore {
  leads: StudentLead[];
  bookings: MentorshipSessionRecord[];
  dossiers: PaidDossierOrder[];
  exportAuditLog: Array<{
    timestamp: string;
    ip: string;
    count: number;
  }>;
  meta: {
    lastUpdated: string;
    version: number;
  };
}

export type ApiResponse<T> =
  | { success: true; data: T; total?: number }
  | { success: false; error: string; details?: Record<string, string> };
```

---

## 3. Server Database Engine (`src/lib/serverDb.ts`)

### Concurrency & Write Queue Architecture
```typescript
import fs from "fs/promises";
import path from "path";
import crypto from "crypto";
import { DatabaseStore, StudentLead, MentorshipSessionRecord, AdminMetricsSummary } from "@/types/database";

const DATA_DIR = path.join(process.cwd(), "data");
const DB_FILE = path.join(DATA_DIR, "ptiros_store.json");

// In-process serialized write queue to prevent lost updates under async concurrency
let writeQueue = Promise.resolve();

export function queueDbWrite<T>(op: () => Promise<T>): Promise<T> {
  const next = writeQueue.then(op, op);
  writeQueue = next.then(() => {});
  return next;
}
```

### Atomic File Write with Unique Temporary File
1. `const tempFile = path.join(DATA_DIR, \`ptiros_store.\${crypto.randomUUID()}.tmp\`);`
2. `await fs.writeFile(tempFile, JSON.stringify(store, null, 2), "utf8");`
3. `await fs.rename(tempFile, DB_FILE);`

### Upsert Logic for Leads
When a lead is ingested:
- Search existing leads for matching `parentPhone + studentName.toLowerCase()`.
- If match exists, update fields, bump `updatedAt`, retain `id` and `createdAt`.
- If no match, generate `lead_${crypto.randomBytes(4).toString("hex")}` and prepend to `store.leads`.

### Conflict Checking for Mentorship Bookings
- If an active booking (`status !== "cancelled"`) exists for the same `mentorId`, `date`, and `timeSlot`, reject with `409 Conflict`.

---

## 4. Security, Authentication & Sanitization

1. **Admin Secret Key & Timing-Safe Verification**:
   - `ADMIN_SECRET_KEY`: Read from `process.env.ADMIN_SECRET_KEY || "ptiros-admin-secure-2026"`.
   - Verified via `crypto.timingSafeEqual(Buffer.from(hashedInput), Buffer.from(hashedSecret))`.
   - Cookie Name: `ptiros_admin_token` (HMAC-SHA256 signature).
   - Attribute flags: `HttpOnly; SameSite=Lax; Path=/; Max-Age=604800` (7 days).
2. **Rate Limiting & Anti-Spam**:
   - Public ingestion capped to 16KB body size.
   - Invisible honeypot field (`website` / `company_url`) on intake modal: if populated by spambots, silently accept or reject without persisting.
   - Basic IP-based sliding window rate limiter: maximum 10 submissions per IP per 10 minutes.
3. **Phone Normalization & Indian Regex**:
   - `const normalized = phone.replace(/\D/g, "").slice(-10);`
   - Validated against `/^[6-9]\d{9}$/`.
4. **Formula Injection (CSV Injection) Prevention**:
   - In CSV generator, any text cell starting with `=`, `+`, `-`, or `@` is prefixed with an apostrophe `'`.

---

## 5. CSV Export Specification & Audit Logging

- **Headers**:
  ```
  Content-Type: text/csv; charset=utf-8
  Content-Disposition: attachment; filename="ptiros_leads_YYYY-MM-DD.csv"
  ```
- **Columns**:
  `Lead ID, Date Created, Student Name, Grade, Curriculum, School, City, Parent Name, Parent WhatsApp, Parent Aspiration, Source, Status, Notes`
- **Audit Log**:
  Every export call appends an entry to `store.exportAuditLog` with timestamp, client IP, and row count.
