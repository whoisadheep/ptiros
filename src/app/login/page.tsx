import type { Metadata } from "next";
import StudentAuthExperience from "@/components/auth/StudentAuthExperience";

export const metadata: Metadata = {
  title: "Sign In — PTIROS Student Portal",
  description:
    "Sign in to your PTIROS student portal to access career diagnostics, simulations, weekly goals, and 1-on-1 alumni mentor sessions.",
};

export default function LoginPage() {
  return <StudentAuthExperience initialMode="login" />;
}
