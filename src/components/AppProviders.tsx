"use client";

import React from "react";
import { UserProfileProvider } from "@/context/UserProfileContext";
import { StudentAuthProvider } from "@/context/StudentAuthContext";
import StudentParentIntakeModal from "@/components/StudentParentIntakeModal";
import MentorshipBookingModal from "@/components/MentorshipBookingModal";
import ComprehensiveDossierModal from "@/components/ComprehensiveDossierModal";
import StudentAuthModal from "@/components/StudentAuthModal";
import FloatingCopilot from "@/components/FloatingCopilot";

export default function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <UserProfileProvider>
      <StudentAuthProvider>
        {children}
        <StudentAuthModal />
        <StudentParentIntakeModal />
        <MentorshipBookingModal />
        <ComprehensiveDossierModal />
        <FloatingCopilot />
      </StudentAuthProvider>
    </UserProfileProvider>
  );
}
