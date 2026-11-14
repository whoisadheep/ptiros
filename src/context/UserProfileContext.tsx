"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { UserProfile } from "@/types/profile";
import { getStoredProfile, setStoredProfile, clearStoredProfile } from "@/lib/storage";

interface UserProfileContextType {
  profile: UserProfile | null;
  isLoaded: boolean;
  saveProfile: (newProfile: Omit<UserProfile, "createdAt" | "updatedAt">) => void;
  updateProfile: (partial: Partial<UserProfile>) => void;
  logoutProfile: () => void;
  // Modal control states
  isIntakeModalOpen: boolean;
  openIntakeModal: () => void;
  closeIntakeModal: () => void;
  isBookingModalOpen: boolean;
  selectedMentorTrackId?: string;
  openBookingModal: (trackId?: string) => void;
  closeBookingModal: () => void;
  isDossierModalOpen: boolean;
  openDossierModal: () => void;
  closeDossierModal: () => void;
}

const UserProfileContext = createContext<UserProfileContextType | undefined>(undefined);

export function UserProfileProvider({ children }: { children: React.ReactNode }) {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  // Modals
  const [isIntakeModalOpen, setIsIntakeModalOpen] = useState(false);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [selectedMentorTrackId, setSelectedMentorTrackId] = useState<string | undefined>();
  const [isDossierModalOpen, setIsDossierModalOpen] = useState(false);

  useEffect(() => {
    const loaded = getStoredProfile();
    if (loaded) {
      setProfile(loaded);
    }
    setIsLoaded(true);
  }, []);

  const saveProfile = (newProfileData: Omit<UserProfile, "createdAt" | "updatedAt">) => {
    const now = new Date().toISOString();
    const fullProfile: UserProfile = {
      ...newProfileData,
      createdAt: profile?.createdAt || now,
      updatedAt: now,
    };
    setProfile(fullProfile);
    setStoredProfile(fullProfile);

    // Non-blocking background sync to server database
    try {
      fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          studentName: fullProfile.studentName,
          grade: fullProfile.grade,
          schoolName: fullProfile.schoolName,
          city: fullProfile.city,
          curriculum: fullProfile.curriculum,
          parentName: fullProfile.parentName,
          parentPhone: fullProfile.parentPhone,
          parentDream: fullProfile.parentDreamCustom || fullProfile.parentDream,
          source: "intake_modal",
          parentConsent: true,
        }),
      }).catch(() => {
        // Silently preserve offline resilience
      });
    } catch {}
  };

  const updateProfile = (partial: Partial<UserProfile>) => {
    if (!profile) return;
    const updated: UserProfile = {
      ...profile,
      ...partial,
      updatedAt: new Date().toISOString(),
    };
    setProfile(updated);
    setStoredProfile(updated);
  };

  const logoutProfile = () => {
    clearStoredProfile();
    setProfile(null);
  };

  const openIntakeModal = () => setIsIntakeModalOpen(true);
  const closeIntakeModal = () => setIsIntakeModalOpen(false);

  const openBookingModal = (trackId?: string) => {
    setSelectedMentorTrackId(trackId);
    setIsBookingModalOpen(true);
  };
  const closeBookingModal = () => {
    setIsBookingModalOpen(false);
    setSelectedMentorTrackId(undefined);
  };

  const openDossierModal = () => setIsDossierModalOpen(true);
  const closeDossierModal = () => setIsDossierModalOpen(false);

  return (
    <UserProfileContext.Provider
      value={{
        profile,
        isLoaded,
        saveProfile,
        updateProfile,
        logoutProfile,
        isIntakeModalOpen,
        openIntakeModal,
        closeIntakeModal,
        isBookingModalOpen,
        selectedMentorTrackId,
        openBookingModal,
        closeBookingModal,
        isDossierModalOpen,
        openDossierModal,
        closeDossierModal,
      }}
    >
      {children}
    </UserProfileContext.Provider>
  );
}

export function useUserProfile() {
  const context = useContext(UserProfileContext);
  if (!context) {
    throw new Error("useUserProfile must be used within a UserProfileProvider");
  }
  return context;
}
