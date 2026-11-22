"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  StudentUser,
  StudentDiaryEntry,
  StudentPlannerGoal,
  StudentSimResult,
  StudentPortalData,
  MentorshipSessionRecord,
} from "@/types/database";

interface StudentAuthContextType {
  user: StudentUser | null;
  diary: StudentDiaryEntry[];
  goals: StudentPlannerGoal[];
  simulations: StudentSimResult[];
  bookings: MentorshipSessionRecord[];
  isLoading: boolean;
  isLoggedIn: boolean;
  isAuthModalOpen: boolean;
  authMode: "login" | "signup";
  openAuthModal: (mode?: "login" | "signup") => void;
  closeAuthModal: () => void;
  login: (credentials: { email: string; password: string }) => Promise<{ success: boolean; error?: string }>;
  loginAsDemo: (demoKey: "aarav" | "meera" | "vihaan") => Promise<{ success: boolean; error?: string }>;
  signup: (formData: {
    name: string;
    email: string;
    password: string;
    grade: string;
    schoolName?: string;
    city: string;
    curriculum: string;
    parentName?: string;
    parentPhone?: string;
    parentDream?: string;
  }) => Promise<{ success: boolean; error?: string }>;
  logout: (redirectTo?: string) => Promise<void>;
  addDiaryEntry: (title: string, content: string, category?: string) => Promise<boolean>;
  deleteDiaryEntry: (entryId: string) => Promise<boolean>;
  toggleGoal: (goalId: string, completed: boolean) => Promise<boolean>;
  addGoal: (title: string, timeView: "daily" | "monthly" | "yearly", deadline?: string) => Promise<boolean>;
  deleteGoal: (goalId: string) => Promise<boolean>;
  saveSimulationResult: (simData: {
    trackId: string;
    trackTitle: string;
    fitScore: number;
    resiliencePoints: number;
    badgeEarned?: string;
  }) => Promise<boolean>;
  trackAndLinkBooking: (query: string) => Promise<{ success: boolean; found: number; error?: string }>;
  refresh: () => Promise<void>;
}

const StudentAuthContext = createContext<StudentAuthContextType | undefined>(undefined);

export function StudentAuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [user, setUser] = useState<StudentUser | null>(null);
  const [diary, setDiary] = useState<StudentDiaryEntry[]>([]);
  const [goals, setGoals] = useState<StudentPlannerGoal[]>([]);
  const [simulations, setSimulations] = useState<StudentSimResult[]>([]);
  const [bookings, setBookings] = useState<MentorshipSessionRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<"login" | "signup">("login");

  const refresh = useCallback(async () => {
    try {
      const res = await fetch("/api/auth/me");
      if (res.ok) {
        const json = await res.json();
        if (json.authenticated && json.data) {
          const data: StudentPortalData = json.data;
          setUser(data.user);
          setDiary(data.diary || []);
          setGoals(data.goals || []);
          setSimulations(data.simulations || []);
          
          // Merge server bookings with any local guest bookings
          const serverBookings = data.bookings || [];
          let localBookings: MentorshipSessionRecord[] = [];
          
          try {
            const raw = localStorage.getItem("ptiros_my_bookings");
            if (raw) {
              const ids: string[] = JSON.parse(raw);
              if (ids.length > 0) {
                const trackRes = await fetch(`/api/bookings/track?query=${encodeURIComponent(ids.join(","))}`);
                if (trackRes.ok) {
                  const trackJson = await trackRes.json();
                  if (trackJson.success && Array.isArray(trackJson.data)) {
                    localBookings = trackJson.data;
                  }
                }
              }
            }
          } catch {}

          const map = new Map<string, MentorshipSessionRecord>();
          serverBookings.forEach((b) => map.set(b.id, b));
          localBookings.forEach((b) => map.set(b.id, b));
          setBookings(Array.from(map.values()));

          // Merge local simulations if any
          try {
            const rawSim = localStorage.getItem("ptiros_my_simulations");
            if (rawSim) {
              const localSims: StudentSimResult[] = JSON.parse(rawSim);
              const simMap = new Map<string, StudentSimResult>();
              (data.simulations || []).forEach((s) => simMap.set(s.trackId, s));
              localSims.forEach((s) => simMap.set(s.trackId, s));
              setSimulations(Array.from(simMap.values()));
            }
          } catch {}
        } else {
          setUser(null);
          setDiary([]);
          setGoals([]);
          setSimulations([]);

          // Guest simulation check
          try {
            const rawSim = localStorage.getItem("ptiros_my_simulations");
            if (rawSim) {
              setSimulations(JSON.parse(rawSim));
            }
          } catch {}
          
          // Guest bookings check
          try {
            const raw = localStorage.getItem("ptiros_my_bookings");
            if (raw) {
              const ids: string[] = JSON.parse(raw);
              if (ids.length > 0) {
                const trackRes = await fetch(`/api/bookings/track?query=${encodeURIComponent(ids[0])}`);
                if (trackRes.ok) {
                  const trackJson = await trackRes.json();
                  if (trackJson.success && Array.isArray(trackJson.data)) {
                    setBookings(trackJson.data);
                  }
                }
              }
            }
          } catch {}
        }
      }
    } catch (err) {
      console.warn("Failed to check active student session:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const openAuthModal = (mode: "login" | "signup" = "login") => {
    setAuthMode(mode);
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
  };

  const login = async (credentials: { email: string; password: string }) => {
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        return { success: false, error: data.error || "Login failed" };
      }
      await refresh();
      closeAuthModal();
      return { success: true };
    } catch {
      return { success: false, error: "Network error occurred. Please try again." };
    }
  };

  const loginAsDemo = async (demoKey: "aarav" | "meera" | "vihaan") => {
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ demoUser: demoKey }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        return { success: false, error: data.error || "Demo login failed" };
      }
      await refresh();
      closeAuthModal();
      return { success: true };
    } catch {
      return { success: false, error: "Network error during demo switch." };
    }
  };

  const signup = async (formData: {
    name: string;
    email: string;
    password: string;
    grade: string;
    schoolName?: string;
    city: string;
    curriculum: string;
    parentName?: string;
    parentPhone?: string;
    parentDream?: string;
  }) => {
    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        return { success: false, error: data.error || "Signup failed" };
      }
      await refresh();
      closeAuthModal();
      return { success: true };
    } catch {
      return { success: false, error: "Network error during account registration." };
    }
  };

  const logout = async (redirectTo: string = "/login") => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } finally {
      setUser(null);
      setDiary([]);
      setGoals([]);
      setSimulations([]);
      if (redirectTo) {
        router.push(redirectTo);
      }
    }
  };

  const addDiaryEntry = async (title: string, content: string, category = "reflection"): Promise<boolean> => {
    try {
      const res = await fetch("/api/student/diary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, content, category }),
      });
      const data = await res.json();
      if (res.ok && data.success && data.entry) {
        setDiary((prev) => [data.entry, ...prev]);
        return true;
      }
    } catch (err) {
      console.error("Add diary error:", err);
    }
    return false;
  };

  const toggleGoal = async (goalId: string, completed: boolean): Promise<boolean> => {
    // Optimistic UI update
    setGoals((prev) =>
      prev.map((g) => (g.id === goalId ? { ...g, completed } : g))
    );

    try {
      const res = await fetch("/api/student/planner", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ goalId, completed }),
      });
      return res.ok;
    } catch (err) {
      console.error("Toggle goal error:", err);
      // Revert if error
      setGoals((prev) =>
        prev.map((g) => (g.id === goalId ? { ...g, completed: !completed } : g))
      );
      return false;
    }
  };

  const addGoal = async (
    title: string,
    timeView: "daily" | "monthly" | "yearly",
    deadline?: string
  ): Promise<boolean> => {
    try {
      const res = await fetch("/api/student/planner", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, timeView, deadline }),
      });
      const data = await res.json();
      if (res.ok && data.success && data.goal) {
        setGoals((prev) => [...prev, data.goal]);
        return true;
      }
    } catch (err) {
      console.error("Add goal error:", err);
    }
    return false;
  };

  const deleteGoal = async (goalId: string): Promise<boolean> => {
    setGoals((prev) => prev.filter((g) => g.id !== goalId));
    try {
      const res = await fetch(`/api/student/planner?id=${encodeURIComponent(goalId)}`, {
        method: "DELETE",
      });
      return res.ok;
    } catch (err) {
      console.error("Delete goal error:", err);
      return false;
    }
  };

  const deleteDiaryEntry = async (entryId: string): Promise<boolean> => {
    setDiary((prev) => prev.filter((d) => d.id !== entryId));
    try {
      const res = await fetch(`/api/student/diary?id=${encodeURIComponent(entryId)}`, {
        method: "DELETE",
      });
      return res.ok;
    } catch (err) {
      console.error("Delete diary error:", err);
      return false;
    }
  };

  const saveSimulationResult = async (simData: {
    trackId: string;
    trackTitle: string;
    fitScore: number;
    resiliencePoints: number;
    badgeEarned?: string;
  }): Promise<boolean> => {
    const localSim: StudentSimResult = {
      id: `sim_${Date.now()}`,
      userId: user?.id || "guest",
      trackId: simData.trackId,
      trackTitle: simData.trackTitle,
      fitScore: simData.fitScore,
      resiliencePoints: simData.resiliencePoints,
      badgeEarned: simData.badgeEarned,
      completedAt: new Date().toISOString(),
    };

    try {
      const raw = localStorage.getItem("ptiros_my_simulations");
      const existing: StudentSimResult[] = raw ? JSON.parse(raw) : [];
      const updated = [localSim, ...existing.filter((s) => s.trackId !== simData.trackId)];
      localStorage.setItem("ptiros_my_simulations", JSON.stringify(updated));
      setSimulations((prev) => [localSim, ...prev.filter((s) => s.trackId !== simData.trackId)]);
    } catch {}

    try {
      const res = await fetch("/api/student/simulations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(simData),
      });
      return res.ok;
    } catch (err) {
      console.error("Save simulation error:", err);
      return false;
    }
  };

  const trackAndLinkBooking = async (query: string): Promise<{ success: boolean; found: number; error?: string }> => {
    try {
      const res = await fetch(`/api/bookings/track?query=${encodeURIComponent(query.trim())}`);
      if (res.ok) {
        const json = await res.json();
        if (json.success && Array.isArray(json.data) && json.data.length > 0) {
          const newBookings: MentorshipSessionRecord[] = json.data;
          setBookings((prev) => {
            const map = new Map<string, MentorshipSessionRecord>();
            newBookings.forEach((b) => map.set(b.id, b));
            prev.forEach((b) => {
              if (!map.has(b.id)) map.set(b.id, b);
            });
            return Array.from(map.values());
          });

          // Save linked IDs to localStorage
          try {
            const raw = localStorage.getItem("ptiros_my_bookings");
            const existingIds: string[] = raw ? JSON.parse(raw) : [];
            const updated = Array.from(new Set([...existingIds, ...newBookings.map((b) => b.id)]));
            localStorage.setItem("ptiros_my_bookings", JSON.stringify(updated));
          } catch {}

          return { success: true, found: newBookings.length };
        } else {
          return { success: false, found: 0, error: json.error || "No meetings found matching your search" };
        }
      }
    } catch (err) {
      console.error("Track booking error:", err);
    }
    return { success: false, found: 0, error: "Network error tracking meeting" };
  };

  return (
    <StudentAuthContext.Provider
      value={{
        user,
        diary,
        goals,
        simulations,
        bookings,
        isLoading,
        isLoggedIn: !!user,
        isAuthModalOpen,
        authMode,
        openAuthModal,
        closeAuthModal,
        login,
        loginAsDemo,
        signup,
        logout,
        addDiaryEntry,
        deleteDiaryEntry,
        toggleGoal,
        addGoal,
        deleteGoal,
        saveSimulationResult,
        trackAndLinkBooking,
        refresh,
      }}
    >
      {children}
    </StudentAuthContext.Provider>
  );
}

export function useStudentAuth() {
  const context = useContext(StudentAuthContext);
  if (!context) {
    throw new Error("useStudentAuth must be used within a StudentAuthProvider");
  }
  return context;
}
