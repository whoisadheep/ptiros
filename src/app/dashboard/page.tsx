"use client";

import { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useStudentAuth } from "@/context/StudentAuthContext";
import { useUserProfile } from "@/context/UserProfileContext";
import {
  Compass,
  Calendar,
  FileText,
  Award,
  Brain,
  Users,
  Sparkles,
  CheckCircle2,
  Circle,
  Clock,
  ArrowUpRight,
  Zap,
  TrendingUp,
  Building,
  GraduationCap,
  LogOut,
  Plus,
  Search,
  Filter,
  ShieldCheck,
  QrCode,
  Share2,
  Download,
  ExternalLink,
  MessageSquare,
  Flame,
  Target,
  ChevronRight,
  AlertCircle,
  Check,
  CheckCircle,
  HelpCircle,
  Layers,
  MapPin,
  CalendarDays,
  ChevronDown,
  BookOpen,
  Star,
  X,
  Video,
  Phone,
  Loader2,
  RefreshCw,
  Copy,
  CheckCheck,
  Trash2,
} from "lucide-react";
import { Blobatar } from "@blobatar/react";
import { useScrollLock } from "@/hooks/useScrollLock";
import PtiroMascot from "@/components/PtiroMascot";
import { MENTORS } from "@/data/mentors";
import { MentorshipSessionRecord } from "@/types/database";

type DashboardTab = "cockpit" | "planner" | "diary" | "credentials" | "analysis" | "mentorship";

export default function DashboardPage() {
  const router = useRouter();
  const {
    user,
    diary,
    goals,
    simulations,
    bookings,
    isLoading,
    isLoggedIn,
    loginAsDemo,
    logout,
    openAuthModal,
    addDiaryEntry,
    deleteDiaryEntry,
    toggleGoal,
    addGoal,
    deleteGoal,
    trackAndLinkBooking,
    refresh: refreshStudentAuth,
  } = useStudentAuth();

  const { openBookingModal, openDossierModal } = useUserProfile();

  const [activeTab, setActiveTab] = useState<DashboardTab>("cockpit");
  const [plannerFilter, setPlannerFilter] = useState<"all" | "daily" | "monthly" | "yearly">("all");
  const [goalCategoryFilter, setGoalCategoryFilter] = useState<string>("all");
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [celebrationGoal, setCelebrationGoal] = useState<string | null>(null);

  // Sync tab from URL search parameters on initial load
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const tabParam = params.get("tab") as DashboardTab | null;
      if (tabParam && ["cockpit", "planner", "diary", "credentials", "analysis", "mentorship"].includes(tabParam)) {
        setActiveTab(tabParam);
      }
    }
  }, []);

  // Mentorship tracking & linking state
  const [trackQuery, setTrackQuery] = useState("");
  const [isTracking, setIsTracking] = useState(false);
  const [trackMsg, setTrackMsg] = useState<{ text: string; error?: boolean } | null>(null);
  const [copiedBookingId, setCopiedBookingId] = useState<string | null>(null);

  const activeBookings = useMemo(() => {
    return (bookings || []).filter((b) => b.status !== "completed" && b.status !== "cancelled");
  }, [bookings]);

  const completedBookings = useMemo(() => {
    return (bookings || []).filter((b) => b.status === "completed");
  }, [bookings]);

  const handleLinkBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!trackQuery.trim()) return;
    setIsTracking(true);
    setTrackMsg(null);
    try {
      const res = await trackAndLinkBooking(trackQuery.trim());
      if (res.success) {
        setTrackMsg({ text: `Successfully linked ${res.found} mentorship session${res.found > 1 ? "s" : ""}!` });
        setTrackQuery("");
      } else {
        setTrackMsg({ text: res.error || "No meetings found matching this reference ID or phone number.", error: true });
      }
    } catch {
      setTrackMsg({ text: "Unable to query meeting lookup service.", error: true });
    } finally {
      setIsTracking(false);
    }
  };

  const handleCopyId = (id: string) => {
    navigator.clipboard?.writeText(id);
    setCopiedBookingId(id);
    setTimeout(() => setCopiedBookingId(null), 2500);
  };

  const downloadIcs = (b: MentorshipSessionRecord) => {
    try {
      const [timeStr] = b.timeSlot.split(" - ");
      const isPM = timeStr.includes("PM");
      const [rawHour, rawMinute] = timeStr.replace(/[^0-9:]/g, "").split(":");
      let hour = parseInt(rawHour, 10);
      if (isPM && hour !== 12) hour += 12;
      if (!isPM && hour === 12) hour = 0;
      const start = new Date(`${b.date}T${String(hour).padStart(2, "0")}:${rawMinute || "00"}:00+05:30`);
      const end = new Date(start.getTime() + 20 * 60 * 1000);
      const formatICS = (d: Date) => d.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
      const icsContent = [
        "BEGIN:VCALENDAR",
        "VERSION:2.0",
        "PRODID:-//PTIROS Gurukul//Mentorship Session//EN",
        "BEGIN:VEVENT",
        `UID:${b.id}@ptiros.in`,
        `DTSTAMP:${formatICS(new Date())}`,
        `DTSTART:${formatICS(start)}`,
        `DTEND:${formatICS(end)}`,
        `SUMMARY:1-on-1 PTIROS Gurukul Session: ${b.mentorName}`,
        `DESCRIPTION:Mentor: ${b.mentorName} (${b.domainTitle})\\nStudent: ${b.studentName}\\nRef: ${b.id}\\nPlatform: https://ptiros.in`,
        "LOCATION:Google Meet",
        "STATUS:CONFIRMED",
        "END:VEVENT",
        "END:VCALENDAR",
      ].join("\r\n");
      const blob = new Blob([icsContent], { type: "text/calendar;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `PTIROS-Session-${b.id}.ics`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.warn("Could not download .ics:", err);
    }
  };

  useEffect(() => {
    if (!isLoading && !isLoggedIn) {
      router.replace("/login");
    }
  }, [isLoading, isLoggedIn, router]);

  // Diary composer state
  const [diaryTitle, setDiaryTitle] = useState("");
  const [diaryNote, setDiaryNote] = useState("");
  const [diaryCategory, setDiaryCategory] = useState("simulator");
  const [diaryCategoryFilter, setDiaryCategoryFilter] = useState("all");
  const [diaryEnergy, setDiaryEnergy] = useState<"high" | "steady" | "low">("high");
  const [isSavingDiary, setIsSavingDiary] = useState(false);
  const [diarySearch, setDiarySearch] = useState("");

  // Career Test result from local quest
  const [careerTestResult, setCareerTestResult] = useState<{
    studentName: string;
    className: string;
    topMatch: string;
    matchConfidence: string;
    superpowers: string[];
    archetype: string;
  } | null>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("ptiros_career_test_result");
      if (raw) {
        setCareerTestResult(JSON.parse(raw));
      }
    } catch {}
  }, []);

  // Goal creation drawer / inline modal
  const [showGoalModal, setShowGoalModal] = useState(false);
  const [newGoalTitle, setNewGoalTitle] = useState("");
  const [newGoalTimeView, setNewGoalTimeView] = useState<"daily" | "monthly" | "yearly">("daily");
  const [newGoalDeadline, setNewGoalDeadline] = useState("");
  const [isSubmittingGoal, setIsSubmittingGoal] = useState(false);

  // Universal scroll lock for milestone modal
  useScrollLock(showGoalModal);

  // Active student profile fallback
  const student = user || {
    id: "usr_demo_aarav",
    name: "Aarav Sharma",
    email: "aarav@demo.ptiros.in",
    grade: "Class 10",
    schoolName: "Delhi Public School, R.K. Puram",
    city: "Delhi NCR",
    curriculum: "CBSE",
    parentName: "Rajesh Sharma",
    avatarInitials: "AS",
    createdAt: new Date().toISOString(),
  };

  // Trajectory details based on active student
  const trajectoryMeta = useMemo(() => {
    if (student.name.includes("Meera") || student.grade === "Class 11") {
      return {
        trackTitle: "Corporate Law, Tech M&A & Public Leadership",
        targetAspirations: "NLSIU Bengaluru / Oxford BCL • Tier-1 M&A Law Practice",
        streamRecommendation: "Humanities with Legal Studies & Economics (or Commerce w/ Math)",
        primaryMentor: {
          name: "Adv. Sneha Mukherjee",
          role: "Senior Associate, Corporate M&A & Tech Policy",
          pedigree: "NLSIU Bengaluru '17 • Former Cyril Amarchand Mangaldas",
          initials: "SM",
          rating: 4.95,
          sessionsHeld: 142,
          trackId: "corporate-law",
        },
        competencies: [
          { name: "Legal Risk Analysis & Redlining", score: 88, status: "Mastery" },
          { name: "Section 27 Contract Law Aptitude", score: 92, status: "Exceptional" },
          { name: "Public Speaking & Cross-Examination", score: 71, status: "Sprint Target" },
          { name: "Regulatory Dilemma Resilience", score: 85, status: "Advanced" },
        ],
        nepCredits: 16,
        boardReadiness: 79,
      };
    } else if (student.name.includes("Vihaan") || student.grade === "Class 12") {
      return {
        trackTitle: "Digital Health, Clinical Robotics & BioTechnology",
        targetAspirations: "AIIMS New Delhi / Johns Hopkins • Precision Surgery Systems",
        streamRecommendation: "PCB with Applied Mathematics & Computer Science",
        primaryMentor: {
          name: "Dr. Rajesh Iyer",
          role: "Clinical Robotics Fellow & Biotech Strategist",
          pedigree: "AIIMS New Delhi • IIT Delhi Biomedical",
          initials: "RI",
          rating: 4.98,
          sessionsHeld: 189,
          trackId: "digital-health-medicine",
        },
        competencies: [
          { name: "Diagnostic Telemetry & Bio-Sensors", score: 94, status: "Top 2%ile" },
          { name: "Clinical Trial Protocol Design", score: 86, status: "Advanced" },
          { name: "NEET Foundation Physical Sciences", score: 89, status: "Mastery" },
          { name: "Medical Ethics & Triage Dilemmas", score: 91, status: "Exceptional" },
        ],
        nepCredits: 18,
        boardReadiness: 86,
      };
    }
    // Default: Aarav Sharma (AI & Robotics)
    return {
      trackTitle: "AI Systems Architecture & Autonomous Robotics",
      targetAspirations: "IIT Bombay / IIT Delhi CSE • Carnegie Mellon Robotics Institute",
      streamRecommendation: "PCM with Computer Science & Information Practices",
      primaryMentor: {
        name: "Dr. Aryan Sharma",
        role: "Autonomous Navigation Lead & Systems Architect",
        pedigree: "Ex-ISRO Telemetry Fellow • IIT Delhi (B.Tech & Ph.D.)",
        initials: "AS",
        rating: 4.97,
        sessionsHeld: 215,
        trackId: "ai-robotics",
      },
      competencies: [
        { name: "Kalman Filter & Telemetry Logic", score: 92, status: "Top 3%ile" },
        { name: "Quantitative Mathematics (Foundation JEE)", score: 88, status: "Advanced" },
        { name: "PID Control & Sensor Fusion", score: 85, status: "Mastery" },
        { name: "Impromptu Technical Communication", score: 68, status: "Sprint Target" },
      ],
      nepCredits: 14,
      boardReadiness: 74,
    };
  }, [student]);

  // Goal stats
  const completedGoals = goals.filter((g) => g.completed).length;
  const totalGoals = goals.length || 6;
  const completionPercent = Math.round((completedGoals / totalGoals) * 100);

  const filteredGoals = goals.filter((g) => {
    if (plannerFilter !== "all" && g.timeView !== plannerFilter) return false;
    return true;
  });

  const filteredDiary = diary.filter((d) => {
    if (diaryCategoryFilter !== "all" && d.category !== diaryCategoryFilter) return false;
    if (!diarySearch.trim()) return true;
    const q = diarySearch.toLowerCase();
    return d.title.toLowerCase().includes(q) || d.content.toLowerCase().includes(q);
  });

  const handleDeleteGoal = async (e: React.MouseEvent, goalId: string) => {
    e.stopPropagation();
    await deleteGoal(goalId);
  };

  const handleDeleteDiary = async (e: React.MouseEvent, entryId: string) => {
    e.stopPropagation();
    await deleteDiaryEntry(entryId);
  };

  const handleDiarySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!diaryNote.trim()) return;
    setIsSavingDiary(true);
    await addDiaryEntry(
      diaryTitle.trim() || `${trajectoryMeta.trackTitle.split(" ")[0]} Reflection`,
      diaryNote.trim(),
      diaryCategory
    );
    setDiaryTitle("");
    setDiaryNote("");
    setIsSavingDiary(false);
  };

  const handleGoalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGoalTitle.trim()) return;
    setIsSubmittingGoal(true);
    await addGoal(
      newGoalTitle.trim(),
      newGoalTimeView,
      newGoalDeadline.trim() || undefined
    );
    setNewGoalTitle("");
    setNewGoalDeadline("");
    setShowGoalModal(false);
    setIsSubmittingGoal(false);
  };

  const handleGoalToggle = async (goalId: string, currentCompleted: boolean, title: string) => {
    if (!currentCompleted) {
      setCelebrationGoal(title);
      setTimeout(() => setCelebrationGoal(null), 4500);
    }
    await toggleGoal(goalId, !currentCompleted);
  };

  const handleLogout = async () => {
    setIsLoggingOut(true);
    await logout("/login");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-stone-100/70 flex items-center justify-center p-4">
        <div className="flex flex-col items-center gap-3">
          <div className="size-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-xs font-semibold text-stone-500">Loading student portal...</p>
        </div>
      </div>
    );
  }

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-stone-100/70 flex items-center justify-center p-4">
        <div className="flex flex-col items-center gap-3">
          <div className="size-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-xs font-semibold text-stone-500">Redirecting to login...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-100/70 text-stone-900 font-body flex flex-col selection:bg-orange-500 selection:text-white">
      {/* ========================================================= */}
      {/* 1. TOP GLOBAL COMMAND BAR (Command Center Status) */}
      {/* ========================================================= */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-stone-200/90 shadow-2xs">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-14 sm:h-16 flex items-center justify-between gap-2 sm:gap-4">
          {/* Brand & Student Avatar Chip */}
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <Link href="/" className="flex items-center gap-1.5 sm:gap-2 group shrink-0">
              <span className="font-display font-black text-xl sm:text-2xl tracking-tight text-gradient">
                PTIROS
              </span>
              <span className="hidden sm:inline-block text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-md bg-stone-900 text-stone-100">
                COCKPIT
              </span>
            </Link>

            {/* Student Chip - Visible on Mobile and Desktop */}
            <div className="flex items-center gap-1.5 sm:gap-2 text-xs border-l border-stone-200 pl-2 sm:pl-3 min-w-0">
              <span className="size-6 sm:size-7 rounded-full overflow-hidden border border-orange-300 bg-white flex items-center justify-center shrink-0 shadow-2xs">
                <Blobatar name={student.name} size={28} className="size-full object-cover" />
              </span>
              <div className="min-w-0">
                <span className="font-bold text-stone-800 text-xs truncate block max-w-[90px] sm:max-w-none">
                  {student.name}
                </span>
                <span className="text-stone-400 text-[10px] hidden md:inline">
                  • {student.grade} ({student.curriculum})
                </span>
              </div>
            </div>
          </div>

          {/* Desktop Demo Switcher Segment */}
          <div className="hidden md:flex items-center bg-stone-100 p-1 rounded-xl border border-stone-200/80">
            <span className="hidden lg:inline-block text-[11px] font-bold text-stone-400 px-2 uppercase tracking-wider">
              Profile:
            </span>
            <button
              onClick={() => loginAsDemo("aarav")}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                student.email === "aarav@demo.ptiros.in"
                  ? "bg-white text-orange-600 shadow-xs border border-stone-200/60"
                  : "text-stone-600 hover:text-stone-900"
              }`}
            >
              Aarav <span className="text-[10px] opacity-75 font-normal hidden sm:inline">(AI)</span>
            </button>
            <button
              onClick={() => loginAsDemo("meera")}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                student.email === "meera@demo.ptiros.in"
                  ? "bg-white text-orange-600 shadow-xs border border-stone-200/60"
                  : "text-stone-600 hover:text-stone-900"
              }`}
            >
              Meera <span className="text-[10px] opacity-75 font-normal hidden sm:inline">(Law)</span>
            </button>
            <button
              onClick={() => loginAsDemo("vihaan")}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                student.email === "vihaan@demo.ptiros.in"
                  ? "bg-white text-orange-600 shadow-xs border border-stone-200/60"
                  : "text-stone-600 hover:text-stone-900"
              }`}
            >
              Vihaan <span className="text-[10px] opacity-75 font-normal hidden sm:inline">(Med)</span>
            </button>
          </div>

          {/* Right Action Stack */}
          <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
            <button
              onClick={() => openBookingModal(trajectoryMeta.primaryMentor.trackId)}
              className="flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-600 text-white font-bold text-xs shadow-xs hover:from-orange-600 hover:to-amber-700 transition cursor-pointer active:scale-95"
              title="1:1 Mentor Desk"
            >
              <Users className="size-3.5" />
              <span className="hidden sm:inline">1:1 Mentor Desk</span>
              <span className="inline sm:hidden text-[11px]">Mentor</span>
            </button>

            {isLoggedIn ? (
              <button
                onClick={handleLogout}
                disabled={isLoggingOut}
                title="Sign out"
                className="flex items-center gap-1.5 p-1.5 sm:px-3 sm:py-1.5 rounded-xl text-stone-500 hover:text-stone-900 hover:bg-stone-100 transition cursor-pointer disabled:opacity-50"
              >
                <LogOut className="size-4" />
                <span className="hidden sm:inline text-xs font-semibold">
                  {isLoggingOut ? "Signing out..." : "Sign out"}
                </span>
              </button>
            ) : (
              <Link
                href="/login"
                className="px-2.5 sm:px-3 py-1.5 rounded-xl border border-stone-300 text-xs font-bold hover:bg-stone-50 transition cursor-pointer"
              >
                Login
              </Link>
            )}
          </div>
        </div>

        {/* Mobile Profile Switcher Bar */}
        <div className="flex md:hidden items-center justify-between px-3 py-1.5 bg-stone-50/90 border-t border-stone-200/70 text-xs overflow-x-auto scrollbar-none">
          <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider shrink-0 mr-1.5">
            Switch:
          </span>
          <div className="flex items-center gap-1.5 min-w-0 flex-1 justify-end">
            <button
              onClick={() => loginAsDemo("aarav")}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition cursor-pointer whitespace-nowrap ${
                student.email === "aarav@demo.ptiros.in"
                  ? "bg-white text-orange-600 shadow-2xs border border-stone-200"
                  : "text-stone-500 hover:text-stone-800"
              }`}
            >
              Aarav (AI)
            </button>
            <button
              onClick={() => loginAsDemo("meera")}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition cursor-pointer whitespace-nowrap ${
                student.email === "meera@demo.ptiros.in"
                  ? "bg-white text-orange-600 shadow-2xs border border-stone-200"
                  : "text-stone-500 hover:text-stone-800"
              }`}
            >
              Meera (Law)
            </button>
            <button
              onClick={() => loginAsDemo("vihaan")}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition cursor-pointer whitespace-nowrap ${
                student.email === "vihaan@demo.ptiros.in"
                  ? "bg-white text-orange-600 shadow-2xs border border-stone-200"
                  : "text-stone-500 hover:text-stone-800"
              }`}
            >
              Vihaan (Med)
            </button>
          </div>
        </div>
      </header>

      {/* ========================================================= */}
      {/* 2. SUB-NAVIGATION TABS (Workbench Mode Switcher) */}
      {/* ========================================================= */}
      <div className="bg-white border-b border-stone-200/80 sticky top-14 sm:top-16 z-30 shadow-2xs">
        <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
          <nav className="flex space-x-1 sm:space-x-3 overflow-x-auto py-2 sm:py-2.5 scrollbar-none snap-x overscroll-contain">
            {[
              { id: "cockpit", label: "Student Overview", shortLabel: "Overview", icon: Compass },
              { id: "planner", label: `Weekly Goals (${totalGoals - completedGoals} Active)`, shortLabel: `Goals (${totalGoals - completedGoals})`, icon: Calendar },
              { id: "diary", label: `Learning Journal (${diary.length})`, shortLabel: `Journal (${diary.length})`, icon: FileText },
              { id: "credentials", label: "Skills & Certificates", shortLabel: "Credentials", icon: Award },
              { id: "analysis", label: "Aptitude & Strengths", shortLabel: "Aptitude", icon: Brain },
              {
                id: "mentorship",
                label: activeBookings.length > 0 ? `Mentorship (${activeBookings.length} Active)` : "Senior Mentors & 1:1",
                shortLabel: activeBookings.length > 0 ? `Mentors (${activeBookings.length})` : "Mentors",
                icon: Users,
              },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as DashboardTab)}
                  className={`flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer snap-start ${
                    isActive
                      ? "bg-stone-900 text-white shadow-xs"
                      : "text-stone-600 hover:text-stone-900 hover:bg-stone-100"
                  }`}
                >
                  <Icon className={`size-3.5 shrink-0 ${isActive ? "text-orange-400" : "text-stone-400"}`} />
                  <span className="hidden sm:inline">{tab.label}</span>
                  <span className="inline sm:hidden">{tab.shortLabel}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* ========================================================= */}
      {/* 3. MAIN WORKSPACE */}
      {/* ========================================================= */}
      <main className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-5 sm:py-8 flex-1 w-full space-y-6 sm:space-y-8">
        {/* ========================================================= */}
        {/* TAB 1: TRAJECTORY COCKPIT (THE EXECUTIVE FLIGHT DECK) */}
        {/* ========================================================= */}
        {activeTab === "cockpit" && (
          <div className="space-y-6 sm:space-y-8">
            {/* Live Mentorship Session Alert Banner */}
            {activeBookings.length > 0 && (
              <div className="rounded-2xl sm:rounded-3xl border border-amber-300/80 bg-gradient-to-r from-amber-50 via-orange-50/60 to-white p-4 sm:p-5 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-start sm:items-center gap-3.5">
                  <div className="size-12 rounded-2xl overflow-hidden bg-white border border-amber-200 shadow-2xs flex items-center justify-center shrink-0">
                    <Blobatar name={activeBookings[0].mentorName} size={48} animate="hover" className="size-full object-cover" />
                  </div>
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-200/70 text-amber-900 border border-amber-300">
                        <Clock className="size-3 animate-spin text-amber-700" />
                        <span>Upcoming 1:1 Mentorship Session</span>
                      </span>
                      <span className="text-[11px] font-mono text-stone-500">
                        ID: {activeBookings[0].id}
                      </span>
                    </div>
                    <h3 className="mt-1 text-sm sm:text-base font-bold text-stone-900">
                      Strategy Call with {activeBookings[0].mentorName} ({activeBookings[0].domainTitle})
                    </h3>
                    <div className="text-xs text-stone-600 flex flex-wrap items-center gap-x-3 gap-y-1 mt-0.5">
                      <span className="flex items-center gap-1 font-semibold text-stone-800">
                        <Calendar className="size-3.5 text-orange-600" />
                        {activeBookings[0].date}
                      </span>
                      <span className="flex items-center gap-1 text-stone-700">
                        <Clock className="size-3.5 text-stone-400" />
                        {activeBookings[0].timeSlot}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 shrink-0 self-end md:self-auto">
                  {activeBookings[0].meetingLink ? (
                    <a
                      href={activeBookings[0].meetingLink}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700 shadow-sm transition active:scale-95"
                    >
                      <Video className="size-3.5" />
                      <span>Join Google Meet</span>
                    </a>
                  ) : null}
                  <button
                    onClick={() => setActiveTab("mentorship")}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-stone-900 text-white text-xs font-bold hover:bg-black shadow-xs transition active:scale-95 cursor-pointer"
                  >
                    <span>View Progress Stepper →</span>
                  </button>
                </div>
              </div>
            )}

            {/* North Star Flight Card */}
            <div className="relative rounded-2xl sm:rounded-3xl bg-gradient-to-br from-stone-900 via-stone-950 to-stone-900 text-white p-5 sm:p-8 shadow-xl overflow-hidden border border-stone-800">
              <div className="absolute top-0 right-0 -mt-12 -mr-12 size-80 rounded-full bg-gradient-to-br from-orange-500/20 to-amber-500/0 blur-3xl pointer-events-none" />
              <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div className="space-y-2.5 max-w-2xl">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/30 text-orange-400 text-xs font-bold uppercase tracking-wider">
                    <Target className="size-3.5" /> Active Career Trajectory
                  </div>
                  <h1 className="text-xl sm:text-3xl lg:text-4xl font-display font-black tracking-tight text-white leading-tight">
                    {trajectoryMeta.trackTitle}
                  </h1>
                  <p className="text-stone-300 text-xs sm:text-sm font-normal leading-relaxed">
                    <strong className="text-orange-300 font-semibold">Strategic Target:</strong> {trajectoryMeta.targetAspirations}
                  </p>
                  <div className="pt-2 flex flex-wrap items-center gap-2 text-xs text-stone-400">
                    <span className="flex items-center gap-1.5 bg-stone-800/80 px-2.5 py-1 rounded-lg border border-stone-700/60 text-[11px] sm:text-xs">
                      <GraduationCap className="size-3.5 text-orange-400" />
                      {student.grade} • {student.curriculum}
                    </span>
                    <span className="flex items-center gap-1.5 bg-stone-800/80 px-2.5 py-1 rounded-lg border border-stone-700/60 text-[11px] sm:text-xs">
                      <Building className="size-3.5 text-orange-400" />
                      {student.schoolName || student.city}
                    </span>
                    <span className="flex items-center gap-1.5 bg-stone-800/80 px-2.5 py-1 rounded-lg border border-stone-700/60 text-[11px] sm:text-xs">
                      <ShieldCheck className="size-3.5 text-emerald-400" />
                      NEP 2020 NSQF Level 4 Certified
                    </span>
                  </div>
                </div>

                {/* Ptiro Copilot Mascot */}
                <div className="hidden xl:flex items-center justify-center p-3 rounded-2xl bg-white/5 border border-white/10 shrink-0">
                  <PtiroMascot
                    variant="copilot"
                    size={75}
                    speech="Trajectory Optimal!"
                    subSpeech={`${trajectoryMeta.boardReadiness}% Board readiness on track.`}
                  />
                </div>

                {/* Readiness Telemetry Dial */}
                <div className="bg-stone-800/60 backdrop-blur-md rounded-2xl p-5 border border-stone-700/60 lg:min-w-[280px] shrink-0 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-stone-400">
                      Trajectory Readiness
                    </span>
                    <span className="text-xs font-black text-emerald-400">ON TRACK</span>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-stone-300">Milestone Velocity</span>
                        <span className="font-mono font-bold text-white">{completionPercent}%</span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-stone-700 overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-orange-500 to-amber-400 transition-all duration-700"
                          style={{ width: `${completionPercent}%` }}
                        />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-stone-300">Board Exam Mastery</span>
                        <span className="font-mono font-bold text-white">{trajectoryMeta.boardReadiness}%</span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-stone-700 overflow-hidden">
                        <div
                          className="h-full bg-emerald-500 transition-all duration-700"
                          style={{ width: `${trajectoryMeta.boardReadiness}%` }}
                        />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-stone-300">NEP Bagless Credits</span>
                        <span className="font-mono font-bold text-white">{trajectoryMeta.nepCredits} / 20</span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-stone-700 overflow-hidden">
                        <div
                          className="h-full bg-blue-500 transition-all duration-700"
                          style={{ width: `${(trajectoryMeta.nepCredits / 20) * 100}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Career Match Quest Result (if completed) */}
            {careerTestResult && (
              <div className="rounded-2xl sm:rounded-3xl border border-orange-200 bg-white p-5 sm:p-6 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div className="flex items-center gap-3.5">
                  <div className="size-11 rounded-2xl bg-orange-100 flex items-center justify-center text-orange-600 shrink-0">
                    <Sparkles className="size-5" />
                  </div>
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                        Quest Result • {careerTestResult.matchConfidence} Match
                      </span>
                      <span className="text-xs text-stone-400">
                        {careerTestResult.archetype}
                      </span>
                    </div>
                    <h3 className="text-base font-bold text-stone-900 mt-0.5">
                      Top Match: {careerTestResult.topMatch}
                    </h3>
                    <p className="text-xs text-stone-500 mt-0.5">
                      Superpowers: {careerTestResult.superpowers?.join(" • ") || "Analytical Thinking"}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2.5 shrink-0 self-end md:self-auto">
                  <Link
                    href="/simulator"
                    className="px-4 py-2 rounded-xl bg-orange-600 text-white font-bold text-xs hover:bg-orange-700 transition shadow-xs active:scale-95 inline-flex items-center gap-1.5"
                  >
                    <span>Test-Drive in Simulator</span>
                    <ArrowUpRight className="size-3.5" />
                  </Link>
                  <Link
                    href="/career-test"
                    className="px-3 py-2 rounded-xl border border-stone-200 text-stone-700 font-bold text-xs hover:bg-stone-50 transition"
                  >
                    Retake Quiz
                  </Link>
                </div>
              </div>
            )}

            {/* Core Command Deck Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left Column: Kaizen Active Milestones (2 Cols on lg) */}
              <div className="lg:col-span-2 space-y-6">
                <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 border border-stone-200/80 shadow-xs space-y-4 sm:space-y-5">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-stone-100 gap-2.5">
                    <div>
                      <h2 className="text-base sm:text-lg font-display font-bold text-stone-900 flex flex-wrap items-center gap-2">
                        <span>Weekly Action Goals</span>
                        <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-orange-100 text-orange-800 whitespace-nowrap">
                          {totalGoals - completedGoals} Pending
                        </span>
                      </h2>
                      <p className="text-xs text-stone-500 mt-0.5">
                        Step-by-step milestones toward your dream university and career path.
                      </p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => setShowGoalModal(true)}
                        className="w-full sm:w-auto justify-center px-3.5 py-2 rounded-xl bg-stone-900 text-white text-xs font-bold hover:bg-stone-800 transition flex items-center gap-1.5 cursor-pointer shadow-xs active:scale-95"
                      >
                        <Plus className="size-3.5" /> Add Milestone
                      </button>
                    </div>
                  </div>

                  {/* Goal Cards */}
                  <div className="space-y-3">
                    {celebrationGoal && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: -6 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="p-3.5 rounded-2xl bg-gradient-to-r from-orange-50 via-amber-50 to-emerald-50 border border-orange-200 flex items-center justify-between gap-3 shadow-xs"
                      >
                        <PtiroMascot
                          variant="celebrate"
                          size={55}
                          speech="Milestone Crushed!"
                          subSpeech={`${celebrationGoal} marked complete.`}
                          interactive={false}
                        />
                        <button
                          type="button"
                          onClick={() => setCelebrationGoal(null)}
                          className="p-1 text-stone-400 hover:text-stone-700 cursor-pointer"
                        >
                          <X className="size-4" />
                        </button>
                      </motion.div>
                    )}

                    {goals.slice(0, 5).map((goal) => (
                      <div
                        key={goal.id}
                        onClick={() => handleGoalToggle(goal.id, goal.completed, goal.title)}
                        className={`p-4 rounded-2xl border transition-all flex items-start justify-between gap-4 cursor-pointer group ${
                          goal.completed
                            ? "bg-stone-50/60 border-stone-200/60 opacity-60"
                            : "bg-white border-stone-200 hover:border-orange-400 hover:shadow-xs"
                        }`}
                      >
                        <div className="flex items-start gap-3.5">
                          <button
                            type="button"
                            className="mt-0.5 text-stone-400 group-hover:text-orange-500 transition"
                          >
                            {goal.completed ? (
                              <CheckCircle2 className="size-5 text-emerald-600 fill-emerald-100" />
                            ) : (
                              <Circle className="size-5" />
                            )}
                          </button>
                          <div>
                            <div
                              className={`text-sm font-semibold text-stone-900 ${
                                goal.completed ? "line-through text-stone-400" : ""
                              }`}
                            >
                              {goal.title}
                            </div>
                            <div className="flex items-center gap-2.5 mt-1 text-xs text-stone-400">
                              <span className="uppercase text-[10px] font-bold tracking-wider px-2 py-0.5 rounded bg-stone-100 text-stone-600">
                                {goal.timeView}
                              </span>
                              {goal.deadline && (
                                <span className="flex items-center gap-1 text-stone-500">
                                  <Clock className="size-3" /> {goal.deadline}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <span
                            className={`text-[11px] font-bold px-2.5 py-1 rounded-full ${
                              goal.completed
                                ? "bg-emerald-50 text-emerald-700"
                                : "bg-amber-50 text-amber-800"
                            }`}
                          >
                            {goal.completed ? "Achieved" : "Active"}
                          </span>
                          <button
                            type="button"
                            onClick={(e) => handleDeleteGoal(e, goal.id)}
                            className="opacity-0 group-hover:opacity-100 p-1 rounded-md text-stone-400 hover:text-red-600 hover:bg-red-50 transition cursor-pointer"
                            title="Delete milestone"
                          >
                            <Trash2 className="size-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="pt-2 flex justify-between items-center text-xs text-stone-500">
                    <span>Synchronized with Neon Serverless Postgres DB</span>
                    <button
                      onClick={() => setActiveTab("planner")}
                      className="font-bold text-orange-600 hover:underline flex items-center gap-1"
                    >
                      Open Full Timeline Roadmap →
                    </button>
                  </div>
                </div>

                {/* Competency Mastery Matrix */}
                <div className="bg-white rounded-3xl p-6 border border-stone-200/80 shadow-xs space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-stone-100">
                    <div>
                      <h3 className="text-base font-display font-bold text-stone-900">
                        Diagnostic Competency Radar
                      </h3>
                      <p className="text-xs text-stone-500">
                        Psychometric aptitude scores calibrated against Indian competitive entrance standards.
                      </p>
                    </div>
                    <button
                      onClick={() => setActiveTab("analysis")}
                      className="text-xs font-bold text-orange-600 hover:underline"
                    >
                      View Report →
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    {trajectoryMeta.competencies.map((comp, idx) => (
                      <div key={idx} className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200/70 space-y-2">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-bold text-stone-800">{comp.name}</span>
                          <span className="font-mono font-bold text-orange-600">{comp.score}%</span>
                        </div>
                        <div className="w-full h-1.5 rounded-full bg-stone-200 overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-orange-500 to-amber-500"
                            style={{ width: `${comp.score}%` }}
                          />
                        </div>
                        <div className="flex items-center justify-between text-[10px] text-stone-400">
                          <span>Status: {comp.status}</span>
                          <span className="text-emerald-600 font-semibold">NEP Calibrated</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Column: Senior Mentor Flight Card & Quick Diary Snippet */}
              <div className="space-y-6">
                {/* Mentor Flight Card */}
                <div className="bg-gradient-to-br from-orange-50 via-white to-amber-50/50 rounded-3xl p-6 border border-orange-200/80 shadow-xs space-y-4">
                  <div className="flex items-center justify-between text-xs font-bold text-orange-900 uppercase tracking-wider">
                    <span className="flex items-center gap-1.5">
                      <Sparkles className="size-3.5 text-orange-600" />
                      Assigned Senior Mentor
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-orange-200/80 text-orange-950 font-semibold text-[10px]">
                      1-on-1 Guidance
                    </span>
                  </div>

                  <div className="flex items-start gap-4 pt-1">
                    <div className="size-14 rounded-2xl overflow-hidden bg-stone-100 border border-stone-200/90 shadow-xs flex items-center justify-center shrink-0">
                      <Blobatar name={trajectoryMeta.primaryMentor.name} size={56} animate="hover" className="size-full object-cover" />
                    </div>
                    <div>
                      <h4 className="font-display font-bold text-base text-stone-900">
                        {trajectoryMeta.primaryMentor.name}
                      </h4>
                      <p className="text-xs text-stone-600 mt-0.5 font-medium">
                        {trajectoryMeta.primaryMentor.role}
                      </p>
                      <p className="text-[11px] text-stone-400 mt-0.5">
                        {trajectoryMeta.primaryMentor.pedigree}
                      </p>
                    </div>
                  </div>

                  {/* Upcoming Consultation Box */}
                  <div className="p-3.5 rounded-2xl bg-white border border-orange-200/60 shadow-xs space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-stone-900 flex items-center gap-1.5">
                        <CalendarDays className="size-3.5 text-orange-600" />
                        Next Consultation
                      </span>
                      <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                        Confirmed
                      </span>
                    </div>
                    <div className="text-sm font-display font-bold text-stone-800">
                      Tomorrow • 5:00 PM - 5:20 PM IST
                    </div>
                    <p className="text-[11px] text-stone-500">
                      Agenda: Term 2 syllabus strategy + stream dilemma debrief with parents.
                    </p>
                  </div>

                  <button
                    onClick={() => openBookingModal(trajectoryMeta.primaryMentor.trackId)}
                    className="w-full py-2.5 rounded-xl bg-orange-600 text-white font-bold text-xs hover:bg-orange-700 transition shadow-xs flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <span>Schedule Additional Session</span>
                    <ArrowUpRight className="size-3.5" />
                  </button>
                </div>

                {/* Parent Dossier Quick Sync */}
                <div className="bg-white rounded-3xl p-6 border border-stone-200/80 shadow-xs space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-display font-bold text-sm text-stone-900 flex items-center gap-1.5">
                      <FileText className="size-4 text-orange-600" />
                      Parent Career Briefing
                    </h3>
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-stone-100 text-stone-700">
                      Synced
                    </span>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200/70 space-y-1.5">
                    <div className="text-[11px] font-bold text-stone-500 uppercase tracking-wider">
                      Parent Aspiration
                    </div>
                    <p className="text-xs font-semibold text-stone-800">
                      {student.parentName ? `Guardian: ${student.parentName}` : "Parent Alignment"}
                    </p>
                    <p className="text-xs text-stone-600 leading-relaxed">
                      "{student.parentDream || 'Wants stable high-growth technology career with national prestige'}"
                    </p>
                  </div>

                  <button
                    onClick={openDossierModal}
                    className="w-full py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <span>Preview 10-Page Parent Dossier</span>
                    <ExternalLink className="size-3" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 2: KAIZEN ROADMAP PLANNER */}
        {/* ========================================================= */}
        {activeTab === "planner" && (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-8 border border-stone-200/80 shadow-xs space-y-5 sm:space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-100">
                <div>
                  <h2 className="text-lg sm:text-xl font-display font-bold text-stone-900 flex flex-wrap items-center gap-2">
                    <span>Academic & Career Action Plan</span>
                    <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-orange-100 text-orange-800 whitespace-nowrap">
                      {completedGoals} / {totalGoals} Milestones
                    </span>
                  </h2>
                  <p className="text-xs text-stone-500 mt-0.5">
                    Clear, step-by-step milestones for board exams, competitive entrances, and real-world skills.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center gap-2.5 w-full sm:w-auto">
                  {/* View Segment */}
                  <div className="flex bg-stone-100 p-1 rounded-xl border border-stone-200/80 text-xs font-bold overflow-x-auto scrollbar-none w-full sm:w-auto">
                    <button
                      onClick={() => setPlannerFilter("all")}
                      className={`flex-1 sm:flex-initial px-2.5 sm:px-3 py-1.5 rounded-lg transition whitespace-nowrap text-center ${
                        plannerFilter === "all" ? "bg-white shadow-xs text-stone-900" : "text-stone-500"
                      }`}
                    >
                      All
                    </button>
                    <button
                      onClick={() => setPlannerFilter("daily")}
                      className={`flex-1 sm:flex-initial px-2.5 sm:px-3 py-1.5 rounded-lg transition whitespace-nowrap text-center ${
                        plannerFilter === "daily" ? "bg-white shadow-xs text-stone-900" : "text-stone-500"
                      }`}
                    >
                      Daily Focus
                    </button>
                    <button
                      onClick={() => setPlannerFilter("monthly")}
                      className={`flex-1 sm:flex-initial px-2.5 sm:px-3 py-1.5 rounded-lg transition whitespace-nowrap text-center ${
                        plannerFilter === "monthly" ? "bg-white shadow-xs text-stone-900" : "text-stone-500"
                      }`}
                    >
                      Monthly Sprints
                    </button>
                    <button
                      onClick={() => setPlannerFilter("yearly")}
                      className={`flex-1 sm:flex-initial px-2.5 sm:px-3 py-1.5 rounded-lg transition whitespace-nowrap text-center ${
                        plannerFilter === "yearly" ? "bg-white shadow-xs text-stone-900" : "text-stone-500"
                      }`}
                    >
                      Yearly Blueprint
                    </button>
                  </div>

                  <button
                    onClick={() => setShowGoalModal(true)}
                    className="w-full sm:w-auto justify-center px-4 py-2 rounded-xl bg-orange-600 text-white text-xs font-bold hover:bg-orange-700 transition flex items-center gap-1.5 shadow-xs cursor-pointer active:scale-95 shrink-0"
                  >
                    <Plus className="size-3.5" /> Add Milestone
                  </button>
                </div>
              </div>

              {/* Roadmap Milestones Grid */}
              <div className="space-y-3">
                {celebrationGoal && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: -6 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="p-3.5 rounded-2xl bg-gradient-to-r from-orange-50 via-amber-50 to-emerald-50 border border-orange-200 flex items-center justify-between gap-3 shadow-xs"
                  >
                    <PtiroMascot
                      variant="celebrate"
                      size={55}
                      speech="Milestone Crushed!"
                      subSpeech={`${celebrationGoal} marked complete.`}
                      interactive={false}
                    />
                    <button
                      type="button"
                      onClick={() => setCelebrationGoal(null)}
                      className="p-1 text-stone-400 hover:text-stone-700 cursor-pointer"
                    >
                      <X className="size-4" />
                    </button>
                  </motion.div>
                )}

                {filteredGoals.map((goal) => (
                  <div
                    key={goal.id}
                    onClick={() => handleGoalToggle(goal.id, goal.completed, goal.title)}
                    className={`p-4 rounded-2xl border transition-all flex items-center justify-between gap-4 cursor-pointer group ${
                      goal.completed
                        ? "bg-stone-50/70 border-stone-200/60 opacity-60"
                        : "bg-white border-stone-200 hover:border-orange-400 hover:shadow-xs"
                    }`}
                  >
                    <div className="flex items-center gap-3.5">
                      <button
                        type="button"
                        className="text-stone-400 group-hover:text-orange-500 transition"
                      >
                        {goal.completed ? (
                          <CheckCircle2 className="size-5 text-emerald-600 fill-emerald-100" />
                        ) : (
                          <Circle className="size-5" />
                        )}
                      </button>
                      <div>
                        <div
                          className={`text-sm font-semibold text-stone-900 ${
                            goal.completed ? "line-through text-stone-400" : ""
                          }`}
                        >
                          {goal.title}
                        </div>
                        <div className="flex items-center gap-3 mt-1 text-xs text-stone-400">
                          <span className="uppercase text-[10px] font-bold px-2 py-0.5 rounded bg-stone-100 text-stone-700">
                            {goal.timeView}
                          </span>
                          {goal.deadline && (
                            <span className="flex items-center gap-1 text-stone-500">
                              <Clock className="size-3" /> {goal.deadline}
                            </span>
                          )}
                          <span className="text-[10px] text-stone-400">
                            Created {goal.createdAt.slice(0, 10)}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2.5">
                      <span
                        className={`text-xs font-bold px-3 py-1 rounded-full ${
                          goal.completed
                            ? "bg-emerald-100 text-emerald-800"
                            : "bg-orange-100 text-orange-800"
                        }`}
                      >
                        {goal.completed ? "Completed" : "In Progress"}
                      </span>
                      <button
                        type="button"
                        onClick={(e) => handleDeleteGoal(e, goal.id)}
                        className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg text-stone-400 hover:text-red-600 hover:bg-red-50 transition cursor-pointer"
                        title="Delete milestone"
                      >
                        <Trash2 className="size-4" />
                      </button>
                    </div>
                  </div>
                ))}

                {filteredGoals.length === 0 && (
                  <div className="text-center py-12 text-stone-400 text-xs">
                    No milestones found in this view. Click "+ Add Milestone" to set your targets.
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 3: HANSEI STUDENT REFLECTIVE DIARY */}
        {/* ========================================================= */}
        {activeTab === "diary" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
            {/* Left 2 Cols: Diary Feed */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-8 border border-stone-200/80 shadow-xs space-y-5 sm:space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-stone-100">
                  <div>
                    <h2 className="text-lg sm:text-xl font-display font-bold text-stone-900 flex flex-wrap items-center gap-2">
                      <span>Daily Learning Journal</span>
                      <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-orange-100 text-orange-800 whitespace-nowrap">
                        {diary.length} Recorded
                      </span>
                    </h2>
                    <p className="text-xs text-stone-500 mt-0.5">
                      Your private daily study journal. Track learnings, challenges, and tomorrow's focus.
                    </p>
                  </div>

                  <div className="relative w-full sm:w-auto">
                    <Search className="absolute left-3 top-2.5 size-3.5 text-stone-400" />
                    <input
                      type="text"
                      value={diarySearch}
                      onChange={(e) => setDiarySearch(e.target.value)}
                      placeholder="Search reflections..."
                      className="w-full sm:w-auto pl-8 pr-3 py-1.5 rounded-xl border border-stone-200 text-sm sm:text-xs focus:outline-none focus:ring-2 focus:ring-orange-500/30"
                    />
                  </div>
                </div>

                {/* Category Filter Pills */}
                <div className="flex flex-wrap items-center gap-1.5 pb-1">
                  {[
                    { id: "all", label: "All Logs" },
                    { id: "simulator", label: "Simulation Debrief" },
                    { id: "reflection", label: "Daily Reflection" },
                    { id: "academic", label: "Academic Milestone" },
                    { id: "mentorship", label: "Mentor Strategy" },
                  ].map((cat) => (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setDiaryCategoryFilter(cat.id)}
                      className={`px-3 py-1 rounded-full text-xs font-semibold transition cursor-pointer ${
                        diaryCategoryFilter === cat.id
                          ? "bg-stone-900 text-white shadow-2xs"
                          : "bg-stone-100 text-stone-600 hover:bg-stone-200"
                      }`}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>

                {/* Reflections List */}
                <div className="space-y-4">
                  {filteredDiary.map((item) => (
                    <div
                      key={item.id}
                      className="p-4 sm:p-5 rounded-2xl bg-stone-50/70 border border-stone-200/80 hover:border-orange-300 transition-all space-y-2.5 group"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-orange-600 uppercase tracking-wider">
                          {item.category || "Reflection"}
                        </span>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-medium text-stone-400">{item.date}</span>
                          <button
                            type="button"
                            onClick={(e) => handleDeleteDiary(e, item.id)}
                            className="opacity-0 group-hover:opacity-100 p-1 rounded-md text-stone-400 hover:text-red-600 hover:bg-red-50 transition cursor-pointer"
                            title="Delete reflection"
                          >
                            <Trash2 className="size-3.5" />
                          </button>
                        </div>
                      </div>
                      <h3 className="font-display font-bold text-base text-stone-900">
                        {item.title}
                      </h3>
                      <p className="text-xs sm:text-sm text-stone-700 leading-relaxed">
                        {item.content}
                      </p>
                      <div className="pt-2 flex items-center justify-between text-[11px] text-stone-400 border-t border-stone-200/50">
                        <span className="flex items-center gap-1 font-mono text-[10px]">
                          ID: {item.id}
                        </span>
                        <span className="text-emerald-700 font-semibold">Verified Log</span>
                      </div>
                    </div>
                  ))}

                  {filteredDiary.length === 0 && (
                    <div className="text-center py-12 text-stone-400 text-xs">
                      No diary entries matching your search. Add a new reflection on the right!
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Right 1 Col: Deliberate Hansei Composer */}
            <div className="space-y-6">
              <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 border border-stone-200/80 shadow-xs space-y-4 sm:space-y-5">
                <div className="flex items-center justify-between border-b border-stone-100 pb-3">
                  <h3 className="font-display font-bold text-base text-stone-900 flex items-center gap-1.5">
                    <Sparkles className="size-4 text-orange-600" />
                    Write Today's Reflection
                  </h3>
                  <span className="text-[10px] uppercase font-bold text-stone-400">Live Sync</span>
                </div>

                <div className="flex items-center gap-3 p-3 rounded-2xl bg-orange-50/70 border border-orange-200/80">
                  <PtiroMascot
                    variant="study"
                    size={64}
                    speech="Daily Journal"
                    subSpeech="Daily reflection turns small study efforts into compounding mastery."
                    interactive={false}
                  />
                </div>

                <form onSubmit={handleDiarySubmit} className="space-y-3.5">
                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">
                      Reflection Theme
                    </label>
                    <input
                      type="text"
                      value={diaryTitle}
                      onChange={(e) => setDiaryTitle(e.target.value)}
                      placeholder="e.g. Debugging physics numericals or debate prep"
                      className="w-full px-3 py-2 rounded-xl border border-stone-200 text-sm sm:text-xs focus:ring-2 focus:ring-orange-500/30 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">
                      Category Tag
                    </label>
                    <select
                      value={diaryCategory}
                      onChange={(e) => setDiaryCategory(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-stone-200 text-sm sm:text-xs focus:ring-2 focus:ring-orange-500/30 focus:outline-none bg-white"
                    >
                      <option value="simulator">Simulation Debrief & Dilemma</option>
                      <option value="academic">Board Exam Derivations / Numericals</option>
                      <option value="mentor">Mentor Takeaway & Doubts</option>
                      <option value="family">Family Stream Blueprint Discussion</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">
                      Detailed Deliberation & Learnings *
                    </label>
                    <textarea
                      value={diaryNote}
                      onChange={(e) => setDiaryNote(e.target.value)}
                      rows={5}
                      required
                      placeholder="1. What was the exact hurdle today?&#10;2. How did I approach it?&#10;3. What will I refine tomorrow morning?"
                      className="w-full p-3 rounded-xl border border-stone-200 text-sm sm:text-xs focus:ring-2 focus:ring-orange-500/30 focus:outline-none leading-relaxed"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSavingDiary}
                    className="w-full py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs shadow-xs transition flex items-center justify-center gap-1.5 cursor-pointer active:scale-95 disabled:opacity-50"
                  >
                    {isSavingDiary ? "Saving to Journal..." : "Save Reflection Entry"}
                    <Sparkles className="size-3.5" />
                  </button>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 4: NEP 2020 CREDENTIAL VAULT */}
        {/* ========================================================= */}
        {activeTab === "credentials" && (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-8 border border-stone-200/80 shadow-xs space-y-5 sm:space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-stone-100">
                <div>
                  <h2 className="text-lg sm:text-xl font-display font-bold text-stone-900 flex flex-wrap items-center gap-2">
                    <span>NEP 2020 Credential Vault</span>
                    <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 whitespace-nowrap">
                      National Standards Aligned
                    </span>
                  </h2>
                  <p className="text-xs text-stone-500 mt-0.5">
                    Recognized under National Skill Qualification Framework (NSQF) & National Credit Framework (NCrF).
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => alert("Verification Hash: 0x9f4a... SHA-256 Validated on PTIROS Registry.")}
                    className="w-full sm:w-auto justify-center px-3.5 py-2 rounded-xl border border-stone-200 text-xs font-bold hover:bg-stone-50 transition flex items-center gap-1.5 cursor-pointer shadow-xs active:scale-95"
                  >
                    <QrCode className="size-3.5 text-orange-600" />
                    Verify Authenticity
                  </button>
                </div>
              </div>

              {/* Certificate Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Certificate 1 */}
                <div className="rounded-2xl border-2 border-stone-200 bg-stone-50/50 p-6 space-y-4 relative overflow-hidden">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-orange-600 bg-orange-100 px-2 py-0.5 rounded">
                      NSQF LEVEL 4
                    </span>
                    <span className="text-xs font-mono text-stone-400">CERT-2026-0814</span>
                  </div>
                  <div>
                    <h3 className="text-base font-display font-bold text-stone-900">
                      {trajectoryMeta.trackTitle} — Professional Simulation
                    </h3>
                    <p className="text-xs text-stone-500 mt-1">
                      Awarded to <strong className="text-stone-800">{student.name}</strong> for completing 15+ hours of real-world mission telemetry and ethical dilemma resolution.
                    </p>
                  </div>
                  <div className="p-3 rounded-xl bg-white border border-stone-200/80 flex items-center justify-between text-xs">
                    <div>
                      <div className="text-[10px] text-stone-400">Accredited Body</div>
                      <div className="font-bold text-stone-800">PTIROS Advisory Council</div>
                    </div>
                    <div className="text-right">
                      <div className="text-[10px] text-stone-400">Date Issued</div>
                      <div className="font-bold text-stone-800">Nov 12, 2026</div>
                    </div>
                  </div>
                </div>

                {/* Certificate 2 */}
                <div className="rounded-2xl border-2 border-stone-200 bg-stone-50/50 p-6 space-y-4 relative overflow-hidden">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                      EXPERIENTIAL LEARNING
                    </span>
                    <span className="text-xs font-mono text-stone-400">BAGLESS-10D-042</span>
                  </div>
                  <div>
                    <h3 className="text-base font-display font-bold text-stone-900">
                      NEP 2020 10-Bagless Days Vocational Immersion
                    </h3>
                    <p className="text-xs text-stone-500 mt-1">
                      Validates {trajectoryMeta.nepCredits} credits of hands-on vocational immersion aligned with school board annual evaluation norms.
                    </p>
                  </div>
                  <div className="p-3 rounded-xl bg-white border border-stone-200/80 flex items-center justify-between text-xs">
                    <div>
                      <div className="text-[10px] text-stone-400">Verification Status</div>
                      <div className="font-bold text-emerald-700 flex items-center gap-1">
                        <Check className="size-3.5" /> Registry Confirmed
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-[10px] text-stone-400">Credits Granted</div>
                      <div className="font-bold text-stone-800">{trajectoryMeta.nepCredits} NCrF Credits</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 5: APTITUDE DIAGNOSTICS & SIMULATION SCORES */}
        {/* ========================================================= */}
        {activeTab === "analysis" && (
          <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-8 border border-stone-200/80 shadow-xs space-y-6 sm:space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-stone-100">
              <div>
                <h2 className="text-lg sm:text-xl font-display font-bold text-stone-900">
                  Career Test 360° Diagnostic Dossier
                </h2>
                <p className="text-xs text-stone-500 mt-0.5">
                  Evaluated across Quantitative Logic, Spatial Telemetry, Public Speaking, and Ethical Dilemmas.
                </p>
              </div>
              <Link
                href="/career-test"
                className="w-full sm:w-auto text-center justify-center px-4 py-2 rounded-xl bg-orange-600 text-white font-bold text-xs hover:bg-orange-700 transition shadow-xs active:scale-95"
              >
                Retake Diagnostic →
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              {simulations.map((sim) => (
                <div key={sim.id} className="p-4 sm:p-6 rounded-2xl bg-stone-50 border border-stone-200/80 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-orange-600 uppercase tracking-wider">
                      {sim.trackTitle}
                    </span>
                    <span className="font-mono font-bold text-base text-stone-900">
                      {sim.fitScore}% Fit
                    </span>
                  </div>
                  <div className="text-sm font-semibold text-stone-800">
                    Badge Earned: <span className="text-orange-600">{sim.badgeEarned || "Autonomous Systems Architect"}</span>
                  </div>
                  <p className="text-xs text-stone-500">
                    Resilience Points: <strong className="text-stone-800">{sim.resiliencePoints} XP</strong> earned through difficult choice tradeoffs in simulation.
                  </p>
                </div>
              ))}

              {simulations.length === 0 && (
                <div className="col-span-1 md:col-span-2 space-y-4">
                  <div className="p-6 rounded-2xl bg-orange-50/70 border border-orange-200 text-center space-y-2">
                    <PtiroMascot
                      variant="study"
                      size={60}
                      speech="No Simulations Logged Yet"
                      subSpeech="Pick any workplace track below to test-drive real challenges and earn certified resilience XP."
                      interactive={false}
                    />
                    <h3 className="font-display font-bold text-base text-stone-900 pt-2">
                      Ready to Test-Drive Your Dream Career?
                    </h3>
                    <p className="text-xs text-stone-600 max-w-md mx-auto">
                      Solve real-world workplace dilemmas across Autonomous AI, Clinical Medicine, Quant Finance, UX Design, or Creative Media.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                    {[
                      { id: "ai-robotics", title: "AI & Autonomous Robotics", desc: "Debugging Kalman Filter & LiDAR telemetry", color: "border-orange-200 hover:border-orange-400" },
                      { id: "medicine", title: "Digital Health & BioTech", desc: "Dialysis alarms & clinical bio-sensors", color: "border-emerald-200 hover:border-emerald-400" },
                      { id: "finance", title: "Quant Finance & HFT Trading", desc: "Volatility hedges & HFT execution", color: "border-amber-200 hover:border-amber-400" },
                      { id: "ux-design", title: "Product Architecture & UX Design", desc: "Fintech onboarding & user drop-off heuristics", color: "border-purple-200 hover:border-purple-400" },
                      { id: "media", title: "Creative Media & Interactive Tech", desc: "Virtual production & game engine pipelines", color: "border-rose-200 hover:border-rose-400" },
                    ].map((track) => (
                      <Link
                        key={track.id}
                        href={`/simulator?track=${track.id}`}
                        className={`p-4 rounded-xl bg-white border ${track.color} shadow-2xs hover:shadow-xs transition group flex flex-col justify-between`}
                      >
                        <div>
                          <span className="text-[10px] font-bold uppercase tracking-wider text-orange-600 block mb-1">
                            Interactive Track
                          </span>
                          <h4 className="font-display font-bold text-sm text-stone-900 group-hover:text-primary transition">
                            {track.title}
                          </h4>
                          <p className="text-xs text-stone-500 mt-1">
                            {track.desc}
                          </p>
                        </div>
                        <div className="pt-3 flex items-center justify-between text-xs font-bold text-primary">
                          <span>Launch Simulator</span>
                          <span>→</span>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 6: SENIOR MENTORS & 1:1 SESSIONS */}
        {/* ========================================================= */}
        {activeTab === "mentorship" && (
          <div className="space-y-6 sm:space-y-8">
            {/* Header & Quick Action */}
            <div className="bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-8 border border-stone-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-100/70 text-orange-800 text-xs font-bold uppercase tracking-wider mb-2">
                  <Users className="size-3.5 text-orange-600" />
                  <span>PTIROS Gurukul Mentorship Wing</span>
                </div>
                <h2 className="text-xl sm:text-2xl font-display font-extrabold text-stone-900 tracking-tight">
                  1-on-1 Mentorship Sessions & Council
                </h2>
                <p className="text-xs sm:text-sm text-stone-500 mt-1 max-w-2xl leading-relaxed">
                  Track live session progress, access Google Meet rooms, review post-call debrief roadmaps, or schedule 20-minute strategic clarity calls with senior practitioners.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2.5 shrink-0">
                <Link
                  href="/track-booking"
                  className="px-4 py-2.5 rounded-xl border border-stone-300 bg-white text-stone-700 font-bold text-xs hover:bg-stone-50 transition shadow-2xs active:scale-95 inline-flex items-center gap-1.5"
                >
                  <Clock className="size-3.5 text-stone-500" />
                  <span>Public Tracker</span>
                  <ExternalLink className="size-3 text-stone-400" />
                </Link>
                <button
                  onClick={() => openBookingModal(trajectoryMeta.primaryMentor.trackId)}
                  className="px-5 py-2.5 rounded-xl bg-orange-600 text-white font-bold text-xs hover:bg-orange-700 transition shadow-xs active:scale-95 cursor-pointer inline-flex items-center gap-1.5"
                >
                  <Plus className="size-4" />
                  <span>Book 1:1 Session</span>
                </button>
              </div>
            </div>

            {/* Quick Session Linker & Verification Bar */}
            <div className="bg-stone-50/80 rounded-2xl p-4 sm:p-5 border border-stone-200/80">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-stone-800 flex items-center gap-1.5">
                    <Search className="size-3.5 text-stone-500" />
                    <span>Track / Link Another Session</span>
                  </h3>
                  <p className="text-[11px] text-stone-500">
                    Booked a session earlier as guest or on another device? Enter your Booking Reference ID (e.g. bk_...) or 10-digit WhatsApp phone.
                  </p>
                </div>
              </div>

              <form onSubmit={handleLinkBooking} className="flex flex-col sm:flex-row gap-2 max-w-2xl">
                <div className="relative flex-1">
                  <input
                    type="text"
                    value={trackQuery}
                    onChange={(e) => setTrackQuery(e.target.value)}
                    placeholder="Enter Reference ID (bk_...) or 10-digit WhatsApp number"
                    className="w-full rounded-xl border border-stone-300 bg-white px-3.5 py-2 text-xs text-stone-800 placeholder-stone-400 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20"
                  />
                </div>
                <button
                  type="submit"
                  disabled={isTracking || !trackQuery.trim()}
                  className="px-4 py-2 rounded-xl bg-stone-900 text-white text-xs font-bold hover:bg-black transition disabled:opacity-50 inline-flex items-center justify-center gap-1.5 shrink-0 cursor-pointer"
                >
                  {isTracking ? (
                    <>
                      <Loader2 className="size-3.5 animate-spin" />
                      <span>Checking...</span>
                    </>
                  ) : (
                    <span>Track & Link</span>
                  )}
                </button>
              </form>

              {trackMsg && (
                <div
                  className={`mt-2.5 inline-flex items-center gap-2 text-xs px-3 py-1.5 rounded-lg border ${
                    trackMsg.error
                      ? "bg-red-50 text-red-700 border-red-200"
                      : "bg-emerald-50 text-emerald-800 border-emerald-200"
                  }`}
                >
                  {trackMsg.error ? (
                    <AlertCircle className="size-3.5 shrink-0" />
                  ) : (
                    <CheckCircle2 className="size-3.5 shrink-0" />
                  )}
                  <span>{trackMsg.text}</span>
                </div>
              )}
            </div>

            {/* SECTION 1: ACTIVE & UPCOMING SESSIONS */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <h3 className="text-base sm:text-lg font-display font-bold text-stone-900">
                    Active & Upcoming Sessions
                  </h3>
                  <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-orange-100 text-orange-800">
                    {activeBookings.length}
                  </span>
                </div>
                {activeBookings.length > 0 && (
                  <button
                    onClick={() => refreshStudentAuth()}
                    className="text-xs text-stone-500 hover:text-stone-800 inline-flex items-center gap-1 cursor-pointer"
                    title="Refresh live status"
                  >
                    <RefreshCw className="size-3" />
                    <span>Sync Status</span>
                  </button>
                )}
              </div>

              {activeBookings.length > 0 ? (
                <div className="space-y-4">
                  {activeBookings.map((b) => {
                    const isPending = b.status === "pending";
                    const isConfirmed = b.status === "confirmed";
                    const hasMeetLink = !!b.meetingLink;

                    return (
                      <div
                        key={b.id}
                        className="bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-7 border border-stone-200/90 shadow-sm space-y-5"
                      >
                        {/* Top Meta Bar */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-stone-100">
                          <div className="flex items-start sm:items-center gap-3.5">
                            <div className="size-14 rounded-2xl overflow-hidden bg-stone-100 border border-stone-200/90 shadow-2xs flex items-center justify-center shrink-0">
                              <Blobatar name={b.mentorName} size={56} animate="hover" className="size-full object-cover" />
                            </div>
                            <div>
                              <div className="flex flex-wrap items-center gap-2">
                                <span
                                  className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${
                                    isPending
                                      ? "bg-amber-100/80 text-amber-900 border-amber-300"
                                      : hasMeetLink
                                      ? "bg-emerald-100/80 text-emerald-900 border-emerald-300"
                                      : "bg-sky-100/80 text-sky-900 border-sky-300"
                                  }`}
                                >
                                  {isPending && <Clock className="size-3 animate-spin text-amber-700" />}
                                  {isConfirmed && !hasMeetLink && <CheckCircle2 className="size-3 text-sky-700" />}
                                  {hasMeetLink && <Video className="size-3 animate-pulse text-emerald-700" />}
                                  <span>
                                    {isPending
                                      ? "Council Reviewing Agenda"
                                      : hasMeetLink
                                      ? "Meet Room Active"
                                      : isConfirmed
                                      ? "Confirmed & Paired"
                                      : b.status}
                                  </span>
                                </span>

                                <button
                                  type="button"
                                  onClick={() => handleCopyId(b.id)}
                                  className="inline-flex items-center gap-1 font-mono text-[11px] text-stone-500 hover:text-stone-800 bg-stone-100 px-2 py-0.5 rounded-md border border-stone-200"
                                  title="Click to copy Reference ID"
                                >
                                  <span>Ref: {b.id}</span>
                                  {copiedBookingId === b.id ? (
                                    <CheckCheck className="size-3 text-emerald-600" />
                                  ) : (
                                    <Copy className="size-3 text-stone-400" />
                                  )}
                                </button>
                              </div>

                              <h4 className="mt-1 text-base font-bold text-stone-900">
                                {b.mentorName}
                              </h4>
                              <p className="text-xs text-stone-500">{b.domainTitle}</p>
                            </div>
                          </div>

                          <div className="flex flex-col sm:items-end gap-1 text-xs">
                            <span className="font-semibold text-stone-800 flex items-center gap-1.5">
                              <Calendar className="size-3.5 text-orange-600" />
                              {b.date}
                            </span>
                            <span className="text-stone-500 flex items-center gap-1.5">
                              <Clock className="size-3.5 text-stone-400" />
                              {b.timeSlot}
                            </span>
                          </div>
                        </div>

                        {/* Student Inquiry Dilemma */}
                        <div className="rounded-xl bg-stone-50 p-3.5 border border-stone-200/60 text-xs">
                          <span className="font-bold text-stone-700 block mb-0.5">
                            Student Agenda & Core Dilemma:
                          </span>
                          <p className="text-stone-600 italic">
                            &quot;{b.primaryQuestion}&quot;
                          </p>
                        </div>

                        {/* 4-Step Progress Stepper */}
                        <div className="space-y-2">
                          <span className="text-[11px] font-bold uppercase tracking-wider text-stone-500 block">
                            Session Execution Stepper
                          </span>
                          <div className="grid grid-cols-1 sm:grid-cols-4 gap-2.5">
                            {/* Step 1 */}
                            <div className="p-3 rounded-xl bg-emerald-50/70 border border-emerald-200">
                              <div className="flex items-center gap-1.5 text-emerald-700 font-bold text-xs mb-1">
                                <CheckCircle2 className="size-3.5" />
                                <span>1. Requested</span>
                              </div>
                              <p className="text-[11px] text-stone-600 leading-tight">
                                Slot & student dilemma registered
                              </p>
                            </div>

                            {/* Step 2 */}
                            <div
                              className={`p-3 rounded-xl border ${
                                isConfirmed
                                  ? "bg-emerald-50/70 border-emerald-200"
                                  : "bg-amber-50/70 border-amber-300"
                              }`}
                            >
                              <div
                                className={`flex items-center gap-1.5 font-bold text-xs mb-1 ${
                                  isConfirmed ? "text-emerald-700" : "text-amber-800"
                                }`}
                              >
                                {isConfirmed ? (
                                  <CheckCircle2 className="size-3.5" />
                                ) : (
                                  <Clock className="size-3.5 animate-spin" />
                                )}
                                <span>2. Council Review</span>
                              </div>
                              <p className="text-[11px] text-stone-600 leading-tight">
                                {isConfirmed
                                  ? "Dossier vetted & mentor confirmed"
                                  : "Council reviewing student dossier"}
                              </p>
                            </div>

                            {/* Step 3 */}
                            <div
                              className={`p-3 rounded-xl border ${
                                b.meetingLink
                                  ? "bg-emerald-50/70 border-emerald-300"
                                  : isConfirmed
                                  ? "bg-stone-50 border-stone-200"
                                  : "bg-white border-stone-200/70 opacity-75"
                              }`}
                            >
                              <div
                                className={`flex items-center gap-1.5 font-semibold text-xs mb-1 ${
                                  b.meetingLink ? "text-emerald-700 font-bold" : "text-stone-700"
                                }`}
                              >
                                <Video className="size-3.5" />
                                <span>3. Meet Link Active</span>
                              </div>
                              <p className="text-[11px] text-stone-500 leading-tight">
                                {b.meetingLink
                                  ? "Google Meet room is live"
                                  : "Link opens 10 min prior to call"}
                              </p>
                            </div>

                            {/* Step 4 */}
                            <div className="p-3 rounded-xl bg-white border border-stone-200/70 opacity-75">
                              <div className="flex items-center gap-1.5 text-stone-600 font-semibold text-xs mb-1">
                                <ShieldCheck className="size-3.5 text-stone-400" />
                                <span>4. Debrief & Plan</span>
                              </div>
                              <p className="text-[11px] text-stone-400 leading-tight">
                                Post-call notes & action goals
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-stone-100">
                          <div className="flex flex-wrap items-center gap-2">
                            {b.meetingLink && (
                              <a
                                href={b.meetingLink}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700 shadow-sm transition active:scale-95"
                              >
                                <Video className="size-3.5" />
                                <span>Join Google Meet</span>
                              </a>
                            )}
                            <Link
                              href={`/track-booking?id=${b.id}`}
                              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-stone-900 text-white text-xs font-bold hover:bg-black transition active:scale-95"
                            >
                              <Clock className="size-3.5 text-orange-400" />
                              <span>Live Tracker Page</span>
                            </Link>
                          </div>

                          <div className="flex flex-wrap items-center gap-2">
                            <a
                              href={`https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(
                                `1-on-1 PTIROS Gurukul Session: ${b.mentorName}`
                              )}&details=${encodeURIComponent(
                                `Mentor: ${b.mentorName}\nStudent: ${b.studentName}\nRef: ${b.id}\nPlatform: https://ptiros.in`
                              )}&location=Google+Meet`}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-stone-200 bg-white text-stone-700 text-xs font-semibold hover:bg-stone-50 transition"
                            >
                              <Calendar className="size-3 text-stone-500" />
                              <span>Google Calendar</span>
                            </a>
                            <button
                              type="button"
                              onClick={() => downloadIcs(b)}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-stone-200 bg-white text-stone-700 text-xs font-semibold hover:bg-stone-50 transition cursor-pointer"
                              title="Download .ics for Apple Calendar & Outlook"
                            >
                              <Download className="size-3 text-stone-500" />
                              <span>.ICS File</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                const text = `*PTIROS Mentorship Session Query*\nRef ID: ${b.id}\nStudent: ${b.studentName}\nMentor: ${b.mentorName}\nDate: ${b.date} at ${b.timeSlot}`;
                                window.open(
                                  `https://api.whatsapp.com/send?phone=919876543210&text=${encodeURIComponent(text)}`,
                                  "_blank"
                                );
                              }}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-emerald-200 bg-emerald-50 text-emerald-800 text-xs font-semibold hover:bg-emerald-100 transition"
                            >
                              <MessageSquare className="size-3 text-emerald-600" />
                              <span>WhatsApp Support</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                /* Empty state when no active bookings */
                <div className="bg-stone-50/80 rounded-2xl p-6 sm:p-8 border border-stone-200/80 text-center space-y-4">
                  <div className="size-14 mx-auto rounded-2xl bg-orange-100 text-orange-600 flex items-center justify-center">
                    <Compass className="size-7" />
                  </div>
                  <div className="max-w-md mx-auto">
                    <h4 className="text-base font-bold text-stone-900">
                      No Active Mentorship Sessions Scheduled
                    </h4>
                    <p className="text-xs text-stone-500 mt-1 leading-relaxed">
                      Need clarity on choosing Class 11–12 streams (PCM, PCB, Commerce, Humanities) or balancing board exams with career ambitions? Schedule a 20-minute 1-on-1 strategy call with our Senior Mentors.
                    </p>
                  </div>
                  <button
                    onClick={() => openBookingModal(trajectoryMeta.primaryMentor.trackId)}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-orange-600 text-white font-bold text-xs hover:bg-orange-700 transition shadow-xs active:scale-95 cursor-pointer"
                  >
                    <span>Schedule 1-on-1 Strategy Call →</span>
                  </button>
                </div>
              )}
            </div>

            {/* SECTION 2: PAST SESSION HISTORY & MENTOR DEBRIEFS */}
            <div className="space-y-4 pt-2">
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-display font-bold text-stone-900">
                  Past Session History & Debriefs
                </h3>
                <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-stone-100 text-stone-600">
                  {completedBookings.length}
                </span>
              </div>

              {completedBookings.length > 0 ? (
                <div className="space-y-3">
                  {completedBookings.map((b) => (
                    <div
                      key={b.id}
                      className="bg-white rounded-2xl p-5 border border-stone-200/90 shadow-2xs space-y-3"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div className="flex items-center gap-3">
                          <div className="size-10 rounded-xl overflow-hidden bg-stone-100 border border-stone-200 shrink-0">
                            <Blobatar name={b.mentorName} size={40} className="size-full object-cover" />
                          </div>
                          <div>
                            <h4 className="text-sm font-bold text-stone-900">{b.mentorName}</h4>
                            <p className="text-xs text-stone-500">{b.domainTitle}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 text-xs">
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-semibold text-[11px]">
                            <CheckCircle2 className="size-3" />
                            <span>Completed</span>
                          </span>
                          <span className="text-stone-400">•</span>
                          <span className="text-stone-600">{b.date}</span>
                        </div>
                      </div>

                      <div className="rounded-xl bg-stone-50 p-3 text-xs border border-stone-200/60">
                        <span className="font-bold text-stone-700 block mb-0.5">Primary Focus Discussed:</span>
                        <p className="text-stone-600">&quot;{b.primaryQuestion}&quot;</p>
                      </div>

                      <div className="pt-1 flex items-center justify-between text-xs">
                        <span className="text-stone-500 font-mono text-[11px]">Ref: {b.id}</span>
                        <button
                          onClick={() => openBookingModal(b.mentorId)}
                          className="text-orange-600 font-bold hover:underline cursor-pointer"
                        >
                          Book Follow-up Session →
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-stone-50/60 rounded-2xl p-4 sm:p-5 border border-dashed border-stone-300 text-xs text-stone-500 flex items-start gap-3">
                  <FileText className="size-4 text-stone-400 mt-0.5 shrink-0" />
                  <div>
                    <strong className="text-stone-700 block mb-0.5">Post-Session Debrief Vault</strong>
                    <p className="leading-relaxed">
                      After every 20-minute 1-on-1 strategy call, your mentor records strategic guidance, recommended textbook/resource lists, and target roadmap goals. They will automatically be recorded here and linked into your Weekly Goals.
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* SECTION 3: SENIOR MENTORSHIP COUNCIL DIRECTORY */}
            <div className="space-y-4 pt-4 border-t border-stone-200/80">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h3 className="text-base sm:text-lg font-display font-bold text-stone-900">
                    Full PTIROS Senior Mentorship Council
                  </h3>
                  <p className="text-xs text-stone-500">
                    Elite domain practitioners across AI, Law, Medicine, UX Architecture, Finance, and Public Policy.
                  </p>
                </div>
                <span className="text-xs font-semibold text-stone-400">
                  {MENTORS.length} Senior Mentors Available
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
                {MENTORS.map((m) => (
                  <div
                    key={m.id}
                    className="p-5 rounded-2xl bg-white border border-stone-200/90 shadow-2xs hover:shadow-xs hover:border-orange-300/80 transition space-y-3 flex flex-col justify-between"
                  >
                    <div className="space-y-3">
                      <div className="flex items-start gap-3.5">
                        <div className="size-12 rounded-2xl overflow-hidden bg-stone-100 border border-stone-200/90 shadow-2xs flex items-center justify-center shrink-0">
                          <Blobatar name={m.name} size={48} animate="hover" className="size-full object-cover" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <h4 className="font-display font-bold text-sm text-stone-900 truncate">
                            {m.name}
                          </h4>
                          <p className="text-xs text-orange-600 font-medium truncate">{m.domainTitle}</p>
                          <p className="text-[11px] text-stone-400 truncate">{m.pedigree}</p>
                        </div>
                      </div>

                      <p className="text-xs text-stone-600 line-clamp-2 leading-relaxed">
                        {m.specialization}
                      </p>
                    </div>

                    <div className="pt-2 flex items-center justify-between text-xs text-stone-500 border-t border-stone-100">
                      <span className="flex items-center gap-1 font-semibold text-stone-700">
                        <Star className="size-3 text-amber-500 fill-amber-500" />
                        <span>{m.rating}</span>
                        <span className="text-stone-400 font-normal text-[11px]">({m.totalSessions}+ calls)</span>
                      </span>
                      <button
                        onClick={() => openBookingModal(m.domainId)}
                        className="text-orange-600 font-bold hover:underline cursor-pointer"
                      >
                        Schedule 20m →
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>

      {/* ========================================================= */}
      {/* 4. MODAL: ADD MILESTONE DRAWER */}
      {/* ========================================================= */}
      {showGoalModal && (
        <div
          role="dialog"
          aria-modal="true"
          data-lenis-prevent
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overscroll-contain"
        >
          <div data-lenis-prevent className="w-full max-w-md max-h-[90vh] overflow-y-auto bg-white rounded-3xl p-6 shadow-2xl border border-stone-200 space-y-4 overscroll-contain">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <h3 className="font-display font-bold text-lg text-stone-900">
                Add New Goal Milestone
              </h3>
              <button
                onClick={() => setShowGoalModal(false)}
                className="text-stone-400 hover:text-stone-600 cursor-pointer p-1 rounded-lg hover:bg-stone-100 transition"
                aria-label="Close"
              >
                <X className="size-4" />
              </button>
            </div>

            <form onSubmit={handleGoalSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Milestone Title *
                </label>
                <input
                  type="text"
                  value={newGoalTitle}
                  onChange={(e) => setNewGoalTitle(e.target.value)}
                  placeholder="e.g. Complete Kinematics test corrections"
                  required
                  className="w-full px-3 py-2 rounded-xl border border-stone-200 text-xs focus:ring-2 focus:ring-orange-500/30 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Timeline Scope
                  </label>
                  <select
                    value={newGoalTimeView}
                    onChange={(e) => setNewGoalTimeView(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl border border-stone-200 text-xs focus:ring-2 focus:ring-orange-500/30 focus:outline-none bg-white"
                  >
                    <option value="daily">Daily Focus (Today)</option>
                    <option value="monthly">Monthly Sprint</option>
                    <option value="yearly">Yearly Blueprint</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Deadline (Optional)
                  </label>
                  <input
                    type="text"
                    value={newGoalDeadline}
                    onChange={(e) => setNewGoalDeadline(e.target.value)}
                    placeholder="e.g. Nov 20, 6 PM"
                    className="w-full px-3 py-2 rounded-xl border border-stone-200 text-xs focus:ring-2 focus:ring-orange-500/30 focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowGoalModal(false)}
                  className="px-4 py-2 rounded-xl border border-stone-200 text-xs font-bold text-stone-600 hover:bg-stone-50 transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingGoal}
                  className="px-5 py-2 rounded-xl bg-orange-600 text-white text-xs font-bold hover:bg-orange-700 transition cursor-pointer disabled:opacity-50"
                >
                  {isSubmittingGoal ? "Saving..." : "Commit Milestone"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
