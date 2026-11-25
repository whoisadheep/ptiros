import type { Metadata } from "next";
import StudentAuthExperience from "@/components/auth/StudentAuthExperience";

export const metadata: Metadata = {
  title: "Create Student Account — PTIROS",
  description:
    "Register for a PTIROS student account to take career diagnostics, test workplace simulations, and book 1-on-1 mentorship calls.",
};

export default function SignupPage() {
  return <StudentAuthExperience initialMode="signup" />;
}
