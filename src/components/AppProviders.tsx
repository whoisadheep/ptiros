"use client";

import React from "react";
import { UserProfileProvider } from "@/context/UserProfileContext";
import StudentParentIntakeModal from "@/components/StudentParentIntakeModal";
import MentorshipBookingModal from "@/components/MentorshipBookingModal";
import ComprehensiveDossierModal from "@/components/ComprehensiveDossierModal";

export default function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <UserProfileProvider>
      {children}
      <StudentParentIntakeModal />
      <MentorshipBookingModal />
      <ComprehensiveDossierModal />
    </UserProfileProvider>
  );
}
