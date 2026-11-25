import { StudentUser } from "@/types/database";

export const STUDENT_GRADES = [
  { value: "Class 6", label: "Class 6" },
  { value: "Class 7", label: "Class 7" },
  { value: "Class 8", label: "Class 8" },
  { value: "Class 9", label: "Class 9" },
  { value: "Class 10", label: "Class 10" },
  { value: "Class 11", label: "Class 11" },
  { value: "Class 12", label: "Class 12" },
  { value: "Dropper / UG 1st Yr", label: "UG / Dropper" },
] as const;

export const SCHOOL_BOARDS = [
  "CBSE",
  "ICSE",
  "IB",
  "Cambridge",
  "State Board",
  "Other",
] as const;

export const GENDER_OPTIONS = ["Female", "Male", "Prefer not to say"] as const;

export const INDIAN_STATES = [
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chandigarh",
  "Chhattisgarh",
  "Delhi NCR",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jammu & Kashmir",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Puducherry",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal",
  "Other / International",
] as const;

export const DREAM_PRESETS = [
  "AI & Robotics Engineer",
  "Doctor / Clinical Research",
  "Lawyer / Civil Services",
  "Product & Industrial Design",
  "Finance & Entrepreneurship",
  "Space & Theoretical Physics",
  "Professional Athlete",
  "Still figuring it out",
] as const;

export const COMPETITION_LEVELS = [
  "Interschool",
  "State level",
  "National level",
] as const;

export function getProfileCompleteness(user: Partial<StudentUser>) {
  const trackedFields: Array<{ key: string; label: string; filled: boolean }> = [
    { key: "name", label: "Full Name", filled: Boolean(user.name?.trim()) },
    { key: "age", label: "Age", filled: typeof user.age === "number" && user.age > 0 },
    { key: "gender", label: "Sex / Gender", filled: Boolean(user.gender?.trim()) },
    { key: "address", label: "Home Address", filled: Boolean(user.address?.trim()) },
    { key: "singleChild", label: "Single Child", filled: typeof user.singleChild === "boolean" },
    { key: "fatherName", label: "Father's Name", filled: Boolean(user.fatherName?.trim()) },
    { key: "motherName", label: "Mother's Name", filled: Boolean(user.motherName?.trim()) },
    { key: "parentPhone", label: "Parent Mobile", filled: Boolean(user.parentPhone?.trim()) },
    { key: "email", label: "Student Email", filled: Boolean(user.email?.trim()) },
    { key: "parentEmail", label: "Parent Email", filled: Boolean(user.parentEmail?.trim()) },
    { key: "grade", label: "Class", filled: Boolean(user.grade?.trim()) },
    { key: "schoolName", label: "School Name", filled: Boolean(user.schoolName?.trim()) },
    { key: "schoolAddress", label: "School Address", filled: Boolean(user.schoolAddress?.trim()) },
    { key: "curriculum", label: "Board", filled: Boolean(user.curriculum?.trim()) },
    { key: "state", label: "State", filled: Boolean(user.state?.trim()) },
    { key: "parentDream", label: "Childhood Aim / Dream", filled: Boolean(user.parentDream?.trim()) },
    {
      key: "lastYearPercentage",
      label: "Last Year % / Rank",
      filled: Boolean(user.lastYearPercentage?.trim() || user.lastYearRank?.trim()),
    },
    { key: "proSports", label: "Pro Sports Status", filled: typeof user.proSports === "boolean" },
    { key: "competitions", label: "Competitions", filled: Boolean(user.competitions?.trim()) },
  ];

  const completedCount = trackedFields.filter((f) => f.filled).length;
  const totalCount = trackedFields.length;
  const percent = Math.round((completedCount / totalCount) * 100);
  const missingFields = trackedFields.filter((f) => !f.filled);

  return {
    completedCount,
    totalCount,
    percent,
    missingFields,
  };
}
