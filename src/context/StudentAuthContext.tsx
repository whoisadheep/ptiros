"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  StudentUser,
  StudentDiaryEntry,
  StudentPlannerGoal,
  StudentSimResult,
  StudentPortalData,
} from "@/types/database";

interface StudentAuthContextType {
  user: StudentUser | null;
  diary: StudentDiaryEntry[];
  goals: StudentPlannerGoal[];
  simulations: StudentSimResult[];
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
  toggleGoal: (goalId: string, completed: boolean) => Promise<boolean>;
  addGoal: (title: string, timeView: "daily" | "monthly" | "yearly", deadline?: string) => Promise<boolean>;
  refresh: () => Promise<void>;
}

const StudentAuthContext = createContext<StudentAuthContextType | undefined>(undefined);

export function StudentAuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [user, setUser] = useState<StudentUser | null>(null);
  const [diary, setDiary] = useState<StudentDiaryEntry[]>([]);
  const [goals, setGoals] = useState<StudentPlannerGoal[]>([]);
  const [simulations, setSimulations] = useState<StudentSimResult[]>([]);
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
        } else {
          setUser(null);
          setDiary([]);
          setGoals([]);
          setSimulations([]);
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

  return (
    <StudentAuthContext.Provider
      value={{
        user,
        diary,
        goals,
        simulations,
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
        toggleGoal,
        addGoal,
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
