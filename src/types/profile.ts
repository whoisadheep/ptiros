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

export type ParentDreamOption =
  | "Wants stable engineering/technology career"
  | "Wants stable medical/healthcare career"
  | "Wants to support creative/design passion"
  | "Needs clarity between Commerce vs Tech"
  | "Seeking corporate law & public leadership"
  | "Planning foreign undergraduate admissions"
  | "Open to child's discovered aptitude"
  | "Other";

export interface UserProfile {
  studentName: string;
  grade: StudentGrade;
  schoolName?: string;
  city: string;
  curriculum: SchoolCurriculum;
  parentName: string;
  parentPhone: string; // 10-digit normalized format without +91
  parentDream: ParentDreamOption;
  parentDreamCustom?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Mentor {
  id: string;
  name: string;
  domainId:
    | "ai-robotics"
    | "corporate-law"
    | "digital-health-medicine"
    | "product-ux"
    | "quant-finance"
    | "media-creative-tech";
  domainTitle: string;
  designation: string;
  pedigree: string;
  avatarEmoji: string;
  experienceYears: number;
  rating: number;
  totalSessions: number;
  specialization: string;
}

export interface MentorshipBooking {
  id: string;
  mentorId: string;
  mentorName: string;
  domainTitle: string;
  date: string; // YYYY-MM-DD
  timeSlot: string; // e.g. "11:00 AM - 11:20 AM IST"
  studentName: string;
  parentPhone: string;
  primaryQuestion: string;
  createdAt: string;
}
