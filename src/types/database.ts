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
  userId?: string;
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
  userId?: string;
  careerTestId?: string;
  topTrackTitle?: string;
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

export interface StudentUser {
  id: string;
  name: string;
  email: string;
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
  authProvider?: "email" | "google" | "phone";
  phoneVerified?: boolean;
  avatarInitials: string;
  createdAt: string;
  updatedAt?: string;
}

export interface StudentDiaryEntry {
  id: string;
  userId: string;
  date: string;
  title: string;
  content: string;
  category: string;
  createdAt: string;
}

export interface StudentPlannerGoal {
  id: string;
  userId: string;
  title: string;
  timeView: "daily" | "monthly" | "yearly";
  completed: boolean;
  deadline?: string;
  createdAt: string;
}

export interface StudentSimResult {
  id: string;
  userId: string;
  trackId: string;
  trackTitle: string;
  fitScore: number;
  resiliencePoints: number;
  badgeEarned?: string;
  completedAt: string;
}

export type CareerDimensionId =
  | "analytical"
  | "creative"
  | "quantitative"
  | "empathy"
  | "communication";

export interface CareerDimensionScore {
  id: CareerDimensionId;
  label: string;
  score: number;
  summary: string;
}

export interface CareerTrackMatchScore {
  trackId: string;
  trackTitle: string;
  categoryLabel: string;
  matchPercent: number;
  recommendedStream: string;
  simulatorUrl: string;
  mentorId: string;
}

export interface StudentCareerTestRecord {
  id: string;
  userId: string;
  studentName: string;
  grade: string;
  topTrackId: string;
  topTrackTitle: string;
  matchConfidence: number;
  archetype: string;
  recommendedStream: string;
  answers: Record<string, string>;
  dimensionScores: CareerDimensionScore[];
  rankedTracks: CareerTrackMatchScore[];
  dossierUnlocked: boolean;
  dossierOrderId?: string;
  completedAt: string;
}

export interface StudentActivity {
  id: string;
  userId: string;
  title: string;
  role: string;
  organization?: string;
  category: "leadership" | "competition" | "creative" | "sports" | "service";
  grade: string;
  description: string;
  competencies: string[];
  createdAt: string;
}

export interface StudentSavedPathway {
  id: string;
  trackId: string;
  title: string;
  domain: string;
  status: "primary" | "considering" | "backup";
  entrySalary: string;
  seniorSalary: string;
  targetColleges: string[];
  streamRequired: string;
  exams: string[];
  simulationTrackId: string;
  savedAt: string;
}

export interface StudentPortalData {
  user: StudentUser;
  diary: StudentDiaryEntry[];
  goals: StudentPlannerGoal[];
  simulations: StudentSimResult[];
  careerTests?: StudentCareerTestRecord[];
  dossiers?: PaidDossierOrder[];
  activities?: StudentActivity[];
  savedPathways?: StudentSavedPathway[];
  bookings?: MentorshipSessionRecord[];
}

export type ApiResponse<T> =
  | { success: true; data: T; total?: number }
  | { success: false; error: string; details?: Record<string, string> };
