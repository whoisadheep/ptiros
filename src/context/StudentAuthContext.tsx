"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  StudentUser,
  StudentDiaryEntry,
  StudentPlannerGoal,
  StudentSimResult,
  StudentCareerTestRecord,
  PaidDossierOrder,
  StudentPortalData,
  MentorshipSessionRecord,
  StudentAssignedCourse,
} from "@/types/database";

interface CareerTestSubmissionPayload {
  studentName?: string;
  grade?: string;
  curriculum?: string;
  city?: string;
  state?: string;
  schoolName?: string;
  parentName?: string;
  parentDream?: string;
  parentPhone?: string;
  childhoodDream?: string;
  answers: Record<string, string>;
}

interface StudentAuthContextType {
  user: StudentUser | null;
  diary: StudentDiaryEntry[];
  goals: StudentPlannerGoal[];
  simulations: StudentSimResult[];
  careerTests: StudentCareerTestRecord[];
  dossiers: PaidDossierOrder[];
  bookings: MentorshipSessionRecord[];
  assignedCourses: StudentAssignedCourse[];
  updateAssignedCourseStatus: (
    courseId: string,
    status: StudentAssignedCourse["status"]
  ) => Promise<boolean>;
  isLoading: boolean;
  isLoggedIn: boolean;
  isAuthModalOpen: boolean;
  authMode: "login" | "signup";
  openAuthModal: (mode?: "login" | "signup") => void;
  closeAuthModal: () => void;
  login: (credentials: { email: string; password: string }) => Promise<{ success: boolean; error?: string }>;
  signup: (formData: {
    name: string;
    email: string;
    password: string;
    age?: number;
    gender?: string;
    address?: string;
    singleChild?: boolean;
    fatherName?: string;
    motherName?: string;
    personalPhone?: string;
    parentEmail: string;
    grade: string;
    schoolName?: string;
    schoolAddress?: string;
    city: string;
    state?: string;
    curriculum: string;
    parentName?: string;
    parentPhone: string;
    parentDream?: string;
    lastYearRank?: string;
    lastYearPercentage?: string;
    proSports?: boolean;
    competitions?: string;
    aparId?: string;
  }) => Promise<{ success: boolean; error?: string }>;
  updateProfile: (
    updates: Partial<Omit<StudentUser, "id" | "email" | "createdAt" | "updatedAt">>
  ) => Promise<{ success: boolean; error?: string }>;
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
  saveCareerTestResult: (payload: CareerTestSubmissionPayload) => Promise<{
    success: boolean;
    savedToPortal: boolean;
    record: StudentCareerTestRecord | null;
  }>;
  refresh: () => Promise<void>;
}

const StudentAuthContext = createContext<StudentAuthContextType | undefined>(undefined);

export function StudentAuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [user, setUser] = useState<StudentUser | null>(null);
  const [diary, setDiary] = useState<StudentDiaryEntry[]>([]);
  const [goals, setGoals] = useState<StudentPlannerGoal[]>([]);
  const [simulations, setSimulations] = useState<StudentSimResult[]>([]);
  const [careerTests, setCareerTests] = useState<StudentCareerTestRecord[]>([]);
  const [dossiers, setDossiers] = useState<PaidDossierOrder[]>([]);
  const [bookings, setBookings] = useState<MentorshipSessionRecord[]>([]);
  const [assignedCourses, setAssignedCourses] = useState<StudentAssignedCourse[]>([]);
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
          setCareerTests(data.careerTests || []);
          setDossiers(data.dossiers || []);
          setBookings(data.bookings || []);
          setAssignedCourses(data.assignedCourses || []);

          // Scope any cached offline simulation completions strictly to this student ID
          try {
            const rawSim = localStorage.getItem(`ptiros_sims_${data.user.id}`);
            if (rawSim) {
              const localSims: StudentSimResult[] = JSON.parse(rawSim);
              const simMap = new Map<string, StudentSimResult>();
              (data.simulations || []).forEach((s) => simMap.set(s.trackId, s));
              localSims.forEach((s) => simMap.set(s.trackId, s));
              setSimulations(Array.from(simMap.values()));
            } else {
              setSimulations(data.simulations || []);
            }
          } catch {
            setSimulations(data.simulations || []);
          }
        } else {
          setUser(null);
          setDiary([]);
          setGoals([]);
          setCareerTests([]);
          setDossiers([]);
          setBookings([]);
          setAssignedCourses([]);

          try {
            const rawGuest = localStorage.getItem("ptiros_guest_simulations");
            setSimulations(rawGuest ? JSON.parse(rawGuest) : []);
          } catch {
            setSimulations([]);
          }
        }
      }
    } catch (err) {
      console.warn("Failed to check active student session:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.removeItem("ptiros_my_bookings");
      localStorage.removeItem("ptiros_my_simulations");
      localStorage.removeItem("ptiros_career_test_result");
    } catch {}
    refresh();
  }, [refresh]);

  const openAuthModal = (mode: "login" | "signup" = "login") => {
    setAuthMode(mode);
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
  };

  const syncPendingGuestAssessment = async () => {
    try {
      const guestAnswersRaw = localStorage.getItem("ptiros_career_test_guest_answers");
      if (!guestAnswersRaw) return;
      const parsed = JSON.parse(guestAnswersRaw);
      if (parsed?.answers && Object.keys(parsed.answers).length > 0) {
        const res = await fetch("/api/student/career-test", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            answers: parsed.answers,
            childhoodDream: parsed.childhoodDream,
          }),
        });
        if (res.ok) {
          localStorage.removeItem("ptiros_career_test_guest_answers");
          localStorage.removeItem("ptiros_career_test_guest");
        }
      }
    } catch {}
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
      await syncPendingGuestAssessment();
      await refresh();
      closeAuthModal();
      return { success: true };
    } catch {
      return { success: false, error: "Network error occurred. Please try again." };
    }
  };

  const signup = async (formData: {
    name: string;
    email: string;
    password: string;
    age?: number;
    gender?: string;
    address?: string;
    singleChild?: boolean;
    fatherName?: string;
    motherName?: string;
    personalPhone?: string;
    parentEmail: string;
    grade: string;
    schoolName?: string;
    schoolAddress?: string;
    city: string;
    state?: string;
    curriculum: string;
    parentName?: string;
    parentPhone: string;
    parentDream?: string;
    lastYearRank?: string;
    lastYearPercentage?: string;
    proSports?: boolean;
    competitions?: string;
    aparId?: string;
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
      await syncPendingGuestAssessment();
      await refresh();
      closeAuthModal();
      return { success: true };
    } catch {
      return { success: false, error: "Network error during account registration." };
    }
  };

  const updateProfile = async (
    updates: Partial<Omit<StudentUser, "id" | "email" | "createdAt" | "updatedAt">>
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      const res = await fetch("/api/student/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      });
      const data = await res.json();
      if (!res.ok || !data.success || !data.user) {
        return { success: false, error: data.error || "Failed to update profile details" };
      }
      setUser(data.user);
      return { success: true };
    } catch {
      return { success: false, error: "Network error while saving profile details." };
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
      setCareerTests([]);
      setDossiers([]);
      setBookings([]);
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
      const storageKey = user?.id ? `ptiros_sims_${user.id}` : "ptiros_guest_simulations";
      const raw = localStorage.getItem(storageKey);
      const existing: StudentSimResult[] = raw ? JSON.parse(raw) : [];
      const updated = [localSim, ...existing.filter((s) => s.trackId !== simData.trackId)];
      localStorage.setItem(storageKey, JSON.stringify(updated));
      setSimulations((prev) => [localSim, ...prev.filter((s) => s.trackId !== simData.trackId)]);
    } catch {}

    if (!user?.id) {
      return false;
    }

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

  const saveCareerTestResult = async (payload: CareerTestSubmissionPayload) => {
    try {
      const res = await fetch("/api/student/career-test", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      if (!res.ok || !json.success || !json.record) {
        return { success: false, savedToPortal: false, record: null };
      }

      const record = json.record as StudentCareerTestRecord;
      if (json.savedToPortal) {
        setCareerTests((prev) => [record, ...prev.filter((c) => c.id !== record.id)]);
      } else {
        try {
          localStorage.setItem("ptiros_career_test_guest", JSON.stringify(record));
          localStorage.setItem(
            "ptiros_career_test_guest_answers",
            JSON.stringify({
              answers: payload.answers,
              childhoodDream: payload.childhoodDream,
            })
          );
        } catch {}
      }

      return {
        success: true,
        savedToPortal: Boolean(json.savedToPortal),
        record,
      };
    } catch (err) {
      console.error("Save career test error:", err);
      return { success: false, savedToPortal: false, record: null };
    }
  };

  const updateAssignedCourseStatus = async (
    courseId: string,
    status: StudentAssignedCourse["status"]
  ): Promise<boolean> => {
    try {
      const res = await fetch("/api/student/courses", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ courseId, status }),
      });
      if (res.ok) {
        setAssignedCourses((prev) =>
          prev.map((c) => (c.id === courseId ? { ...c, status, updatedAt: new Date().toISOString() } : c))
        );
        return true;
      }
    } catch (err) {
      console.error("Update assigned course status error:", err);
    }
    return false;
  };

  // Live background sync on tab focus, visibility change, and 25s interval while active
  useEffect(() => {
    if (!user) return;
    const handleVisibilityOrFocus = () => {
      if (document.visibilityState === "visible") {
        refresh();
      }
    };
    window.addEventListener("focus", handleVisibilityOrFocus);
    document.addEventListener("visibilitychange", handleVisibilityOrFocus);
    const interval = window.setInterval(() => {
      if (document.visibilityState === "visible") {
        refresh();
      }
    }, 25000);
    return () => {
      window.removeEventListener("focus", handleVisibilityOrFocus);
      document.removeEventListener("visibilitychange", handleVisibilityOrFocus);
      window.clearInterval(interval);
    };
  }, [user?.id, refresh]);

  return (
    <StudentAuthContext.Provider
      value={{
        user,
        diary,
        goals,
        simulations,
        careerTests,
        dossiers,
        bookings,
        assignedCourses,
        updateAssignedCourseStatus,
        isLoading,
        isLoggedIn: !!user,
        isAuthModalOpen,
        authMode,
        openAuthModal,
        closeAuthModal,
        login,
        signup,
        updateProfile,
        logout,
        addDiaryEntry,
        deleteDiaryEntry,
        toggleGoal,
        addGoal,
        deleteGoal,
        saveSimulationResult,
        saveCareerTestResult,
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
