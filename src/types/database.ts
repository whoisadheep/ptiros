export type StudentGrade =
  | "Class 6"
  | "Class 7"
  | "Class 8"
  | "Class 9"
  | "Class 10"
  | "Class 11"
  | "Class 12"
  | "Dropper / UG 1st Yr";

export type SchoolCurriculum =
  | "CBSE"
  | "ICSE"
  | "IB"
  | "Cambridge"
  | "State Board"
  | "Other";

export type LeadSource =
  | "intake_modal"
  | "simulator_completion"
  | "career_test"
  | "mentor_booking";

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
  parentPhone: string;
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
