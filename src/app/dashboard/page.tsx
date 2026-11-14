"use client";

import { useState, useMemo } from "react";
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
} from "lucide-react";
import { Blobatar } from "@blobatar/react";

type DashboardTab = "cockpit" | "planner" | "diary" | "credentials" | "analysis" | "mentorship";

export default function DashboardPage() {
  const {
    user,
    diary,
    goals,
    simulations,
    isLoading,
    isLoggedIn,
    loginAsDemo,
    logout,
    openAuthModal,
    addDiaryEntry,
    toggleGoal,
    addGoal,
  } = useStudentAuth();

  const { openBookingModal, openDossierModal } = useUserProfile();

  const [activeTab, setActiveTab] = useState<DashboardTab>("cockpit");
  const [plannerFilter, setPlannerFilter] = useState<"all" | "daily" | "monthly" | "yearly">("all");
  const [goalCategoryFilter, setGoalCategoryFilter] = useState<string>("all");

  // Diary composer state
  const [diaryTitle, setDiaryTitle] = useState("");
  const [diaryNote, setDiaryNote] = useState("");
  const [diaryCategory, setDiaryCategory] = useState("simulator");
  const [diaryEnergy, setDiaryEnergy] = useState<"high" | "steady" | "low">("high");
  const [isSavingDiary, setIsSavingDiary] = useState(false);
  const [diarySearch, setDiarySearch] = useState("");

  // Goal creation drawer / inline modal
  const [showGoalModal, setShowGoalModal] = useState(false);
  const [newGoalTitle, setNewGoalTitle] = useState("");
  const [newGoalTimeView, setNewGoalTimeView] = useState<"daily" | "monthly" | "yearly">("daily");
  const [newGoalDeadline, setNewGoalDeadline] = useState("");
  const [isSubmittingGoal, setIsSubmittingGoal] = useState(false);

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
    if (!diarySearch.trim()) return true;
    const q = diarySearch.toLowerCase();
    return d.title.toLowerCase().includes(q) || d.content.toLowerCase().includes(q);
  });

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

  return (
    <div className="min-h-screen bg-stone-100/70 text-stone-900 font-body flex flex-col selection:bg-orange-500 selection:text-white">
      {/* ========================================================= */}
      {/* 1. TOP GLOBAL COMMAND BAR (Command Center Status) */}
      {/* ========================================================= */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-stone-200/90 shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          {/* Brand & Trajectory Badge */}
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2 group">
              <span className="font-display font-black text-2xl tracking-tight text-gradient">
                PTIROS
              </span>
              <span className="hidden sm:inline-block text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-md bg-stone-900 text-stone-100">
                COCKPIT
              </span>
            </Link>

            <div className="hidden md:flex items-center gap-2 text-xs border-l border-stone-200 pl-3">
              <span className="size-6 rounded-full overflow-hidden border border-orange-300 bg-white flex items-center justify-center shrink-0 shadow-2xs">
                <Blobatar name={student.name} size={24} className="size-full object-cover" />
              </span>
              <span className="font-semibold text-stone-700">{student.name}</span>
              <span className="text-stone-400">•</span>
              <span className="text-stone-500 font-medium">{student.grade} ({student.curriculum})</span>
            </div>
          </div>

          {/* Center Demo Switcher Segment */}
          <div className="flex items-center bg-stone-100 p-1 rounded-xl border border-stone-200/80">
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
          <div className="flex items-center gap-2.5">
            <button
              onClick={() => openBookingModal(trajectoryMeta.primaryMentor.trackId)}
              className="hidden sm:flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-600 text-white font-bold text-xs shadow-xs hover:from-orange-600 hover:to-amber-700 transition cursor-pointer"
            >
              <Users className="size-3.5" />
              <span>1:1 Mentor Desk</span>
            </button>

            {isLoggedIn ? (
              <button
                onClick={logout}
                title="Sign out"
                className="p-2 rounded-xl text-stone-500 hover:text-stone-900 hover:bg-stone-100 transition cursor-pointer"
              >
                <LogOut className="size-4" />
              </button>
            ) : (
              <button
                onClick={() => openAuthModal("login")}
                className="px-3 py-1.5 rounded-xl border border-stone-300 text-xs font-bold hover:bg-stone-50 transition cursor-pointer"
              >
                Login
              </button>
            )}
          </div>
        </div>
      </header>

      {/* ========================================================= */}
      {/* 2. SUB-NAVIGATION TABS (Workbench Mode Switcher) */}
      {/* ========================================================= */}
      <div className="bg-white border-b border-stone-200/80 sticky top-16 z-30 shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-1 sm:space-x-4 overflow-x-auto py-2.5 scrollbar-none">
            {[
              { id: "cockpit", label: "Trajectory Cockpit", icon: Compass },
              { id: "planner", label: `Kaizen Roadmap (${totalGoals - completedGoals} Active)`, icon: Calendar },
              { id: "diary", label: `Hansei Diary (${diary.length})`, icon: FileText },
              { id: "credentials", label: "NEP 2020 Credentials", icon: Award },
              { id: "analysis", label: "Aptitude Diagnostics", icon: Brain },
              { id: "mentorship", label: "Senior Mentors & 1:1", icon: Users },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as DashboardTab)}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                    isActive
                      ? "bg-stone-900 text-white shadow-xs"
                      : "text-stone-600 hover:text-stone-900 hover:bg-stone-100"
                  }`}
                >
                  <Icon className={`size-3.5 ${isActive ? "text-orange-400" : "text-stone-400"}`} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* ========================================================= */}
      {/* 3. MAIN WORKSPACE */}
      {/* ========================================================= */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full space-y-8">
        {/* ========================================================= */}
        {/* TAB 1: TRAJECTORY COCKPIT (THE EXECUTIVE FLIGHT DECK) */}
        {/* ========================================================= */}
        {activeTab === "cockpit" && (
          <div className="space-y-8">
            {/* North Star Flight Card */}
            <div className="relative rounded-3xl bg-gradient-to-br from-stone-900 via-stone-950 to-stone-900 text-white p-6 sm:p-8 shadow-xl overflow-hidden border border-stone-800">
              <div className="absolute top-0 right-0 -mt-12 -mr-12 size-80 rounded-full bg-gradient-to-br from-orange-500/20 to-amber-500/0 blur-3xl pointer-events-none" />
              <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div className="space-y-2.5 max-w-2xl">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/30 text-orange-400 text-xs font-bold uppercase tracking-wider">
                    <Target className="size-3.5" /> Active Career Trajectory
                  </div>
                  <h1 className="text-2xl sm:text-3xl lg:text-4xl font-display font-black tracking-tight text-white">
                    {trajectoryMeta.trackTitle}
                  </h1>
                  <p className="text-stone-300 text-xs sm:text-sm font-normal leading-relaxed">
                    <strong className="text-orange-300 font-semibold">Strategic Target:</strong> {trajectoryMeta.targetAspirations}
                  </p>
                  <div className="pt-2 flex flex-wrap items-center gap-3 text-xs text-stone-400">
                    <span className="flex items-center gap-1.5 bg-stone-800/80 px-2.5 py-1 rounded-lg border border-stone-700/60">
                      <GraduationCap className="size-3.5 text-orange-400" />
                      {student.grade} • {student.curriculum}
                    </span>
                    <span className="flex items-center gap-1.5 bg-stone-800/80 px-2.5 py-1 rounded-lg border border-stone-700/60">
                      <Building className="size-3.5 text-orange-400" />
                      {student.schoolName || student.city}
                    </span>
                    <span className="flex items-center gap-1.5 bg-stone-800/80 px-2.5 py-1 rounded-lg border border-stone-700/60">
                      <ShieldCheck className="size-3.5 text-emerald-400" />
                      NEP 2020 NSQF Level 4 Certified
                    </span>
                  </div>
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

            {/* Core Command Deck Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left Column: Kaizen Active Milestones (2 Cols on lg) */}
              <div className="lg:col-span-2 space-y-6">
                <div className="bg-white rounded-3xl p-6 border border-stone-200/80 shadow-xs space-y-5">
                  <div className="flex items-center justify-between pb-3 border-b border-stone-100">
                    <div>
                      <h2 className="text-lg font-display font-bold text-stone-900 flex items-center gap-2">
                        <span>Kaizen Action Board</span>
                        <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-orange-100 text-orange-800">
                          {totalGoals - completedGoals} Pending
                        </span>
                      </h2>
                      <p className="text-xs text-stone-500">
                        Daily 1% incremental progress toward your dream university trajectory.
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setShowGoalModal(true)}
                        className="px-3 py-1.5 rounded-xl bg-stone-900 text-white text-xs font-bold hover:bg-stone-800 transition flex items-center gap-1.5 cursor-pointer"
                      >
                        <Plus className="size-3.5" /> Add Milestone
                      </button>
                    </div>
                  </div>

                  {/* Goal Cards */}
                  <div className="space-y-3">
                    {goals.slice(0, 5).map((goal) => (
                      <div
                        key={goal.id}
                        onClick={() => toggleGoal(goal.id, !goal.completed)}
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

                        <span
                          className={`text-[11px] font-bold px-2.5 py-1 rounded-full shrink-0 ${
                            goal.completed
                              ? "bg-emerald-50 text-emerald-700"
                              : "bg-amber-50 text-amber-800"
                          }`}
                        >
                          {goal.completed ? "Achieved" : "Active"}
                        </span>
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
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/80 shadow-xs space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-100">
                <div>
                  <h2 className="text-xl font-display font-bold text-stone-900 flex items-center gap-2">
                    <span>Kaizen Academic & Career Roadmap</span>
                    <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-orange-100 text-orange-800">
                      {completedGoals} / {totalGoals} Milestones
                    </span>
                  </h2>
                  <p className="text-xs text-stone-500 mt-0.5">
                    Japanese Kaizen continuous improvement framework + Indian Gurukul discipline.
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  {/* View Segment */}
                  <div className="flex bg-stone-100 p-1 rounded-xl border border-stone-200/80 text-xs font-bold">
                    <button
                      onClick={() => setPlannerFilter("all")}
                      className={`px-3 py-1 rounded-lg transition ${
                        plannerFilter === "all" ? "bg-white shadow-xs text-stone-900" : "text-stone-500"
                      }`}
                    >
                      All
                    </button>
                    <button
                      onClick={() => setPlannerFilter("daily")}
                      className={`px-3 py-1 rounded-lg transition ${
                        plannerFilter === "daily" ? "bg-white shadow-xs text-stone-900" : "text-stone-500"
                      }`}
                    >
                      Daily Focus
                    </button>
                    <button
                      onClick={() => setPlannerFilter("monthly")}
                      className={`px-3 py-1 rounded-lg transition ${
                        plannerFilter === "monthly" ? "bg-white shadow-xs text-stone-900" : "text-stone-500"
                      }`}
                    >
                      Monthly Sprints
                    </button>
                    <button
                      onClick={() => setPlannerFilter("yearly")}
                      className={`px-3 py-1 rounded-lg transition ${
                        plannerFilter === "yearly" ? "bg-white shadow-xs text-stone-900" : "text-stone-500"
                      }`}
                    >
                      Yearly Blueprint
                    </button>
                  </div>

                  <button
                    onClick={() => setShowGoalModal(true)}
                    className="px-4 py-2 rounded-xl bg-orange-600 text-white text-xs font-bold hover:bg-orange-700 transition flex items-center gap-1.5 shadow-xs cursor-pointer"
                  >
                    <Plus className="size-3.5" /> Add Milestone
                  </button>
                </div>
              </div>

              {/* Roadmap Milestones Grid */}
              <div className="space-y-3">
                {filteredGoals.map((goal) => (
                  <div
                    key={goal.id}
                    onClick={() => toggleGoal(goal.id, !goal.completed)}
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

                    <div className="flex items-center gap-3">
                      <span
                        className={`text-xs font-bold px-3 py-1 rounded-full ${
                          goal.completed
                            ? "bg-emerald-100 text-emerald-800"
                            : "bg-orange-100 text-orange-800"
                        }`}
                      >
                        {goal.completed ? "Completed" : "In Progress"}
                      </span>
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
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left 2 Cols: Diary Feed */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/80 shadow-xs space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-100">
                  <div>
                    <h2 className="text-xl font-display font-bold text-stone-900 flex items-center gap-2">
                      <span>Hansei Reflection Logs</span>
                      <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-orange-100 text-orange-800">
                        {diary.length} Recorded
                      </span>
                    </h2>
                    <p className="text-xs text-stone-500 mt-0.5">
                      Japanese deliberate self-audit. Recorded directly into Neon Database.
                    </p>
                  </div>

                  <div className="relative">
                    <Search className="absolute left-3 top-2.5 size-3.5 text-stone-400" />
                    <input
                      type="text"
                      value={diarySearch}
                      onChange={(e) => setDiarySearch(e.target.value)}
                      placeholder="Search reflections..."
                      className="pl-8 pr-3 py-1.5 rounded-xl border border-stone-200 text-xs focus:outline-none focus:ring-2 focus:ring-orange-500/30"
                    />
                  </div>
                </div>

                {/* Reflections List */}
                <div className="space-y-4">
                  {filteredDiary.map((item) => (
                    <div
                      key={item.id}
                      className="p-5 rounded-2xl bg-stone-50/70 border border-stone-200/80 hover:border-orange-300 transition-all space-y-2.5"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-orange-600 uppercase tracking-wider">
                          {item.category || "Reflection"}
                        </span>
                        <span className="text-xs font-medium text-stone-400">{item.date}</span>
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
              <div className="bg-white rounded-3xl p-6 border border-stone-200/80 shadow-xs space-y-5">
                <div className="flex items-center justify-between border-b border-stone-100 pb-3">
                  <h3 className="font-display font-bold text-base text-stone-900 flex items-center gap-1.5">
                    <Sparkles className="size-4 text-orange-600" />
                    Log Daily Hansei Entry
                  </h3>
                  <span className="text-[10px] uppercase font-bold text-stone-400">Live Sync</span>
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
                      placeholder="e.g. Debugging Kalman Filter telemetry latency"
                      className="w-full px-3 py-2 rounded-xl border border-stone-200 text-xs focus:ring-2 focus:ring-orange-500/30 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">
                      Category Tag
                    </label>
                    <select
                      value={diaryCategory}
                      onChange={(e) => setDiaryCategory(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-stone-200 text-xs focus:ring-2 focus:ring-orange-500/30 focus:outline-none bg-white"
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
                      className="w-full p-3 rounded-xl border border-stone-200 text-xs focus:ring-2 focus:ring-orange-500/30 focus:outline-none leading-relaxed"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSavingDiary}
                    className="w-full py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs shadow-xs transition flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                  >
                    {isSavingDiary ? "Committing to Neon DB..." : "Save Hansei Entry"}
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
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/80 shadow-xs space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-100">
                <div>
                  <h2 className="text-xl font-display font-bold text-stone-900 flex items-center gap-2">
                    <span>NEP 2020 Verifiable Credential Vault</span>
                    <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
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
                    className="px-3.5 py-1.5 rounded-xl border border-stone-200 text-xs font-bold hover:bg-stone-50 transition flex items-center gap-1.5 cursor-pointer"
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
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/80 shadow-xs space-y-8">
            <div className="flex items-center justify-between pb-4 border-b border-stone-100">
              <div>
                <h2 className="text-xl font-display font-bold text-stone-900">
                  Career Test 360° Diagnostic Dossier
                </h2>
                <p className="text-xs text-stone-500">
                  Evaluated across Quantitative Logic, Spatial Telemetry, Public Speaking, and Ethical Dilemmas.
                </p>
              </div>
              <Link
                href="/career-test"
                className="px-4 py-2 rounded-xl bg-orange-600 text-white font-bold text-xs hover:bg-orange-700 transition"
              >
                Retake Diagnostic →
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {simulations.map((sim) => (
                <div key={sim.id} className="p-6 rounded-2xl bg-stone-50 border border-stone-200/80 space-y-3">
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
                <div className="col-span-2 text-center py-8 text-stone-400 text-xs">
                  No simulations completed yet. Launch the PTIROS simulator to map your aptitudes!
                </div>
              )}
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 6: SENIOR MENTORS & 1:1 SESSIONS */}
        {/* ========================================================= */}
        {activeTab === "mentorship" && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/80 shadow-xs space-y-8">
            <div className="flex items-center justify-between pb-4 border-b border-stone-100">
              <div>
                <h2 className="text-xl font-display font-bold text-stone-900">
                  PTIROS Senior Mentorship Council
                </h2>
                <p className="text-xs text-stone-500">
                  Elite practitioners from IITs, NLSIU, AIIMS, and Global Frontier Tech.
                </p>
              </div>
              <button
                onClick={() => openBookingModal(trajectoryMeta.primaryMentor.trackId)}
                className="px-4 py-2 rounded-xl bg-orange-600 text-white font-bold text-xs hover:bg-orange-700 transition"
              >
                + Book 1:1 Session
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Mentor 1 */}
              <div className="p-6 rounded-2xl bg-stone-50 border border-stone-200/80 space-y-3">
                <div className="flex items-start gap-4">
                  <div className="size-14 rounded-2xl overflow-hidden bg-stone-100 border border-stone-200/90 shadow-xs flex items-center justify-center shrink-0">
                    <Blobatar name={trajectoryMeta.primaryMentor.name} size={56} animate="hover" className="size-full object-cover" />
                  </div>
                  <div>
                    <h3 className="font-display font-bold text-base text-stone-900">
                      {trajectoryMeta.primaryMentor.name}
                    </h3>
                    <p className="text-xs text-stone-600 font-medium">{trajectoryMeta.primaryMentor.role}</p>
                    <p className="text-[11px] text-stone-400">{trajectoryMeta.primaryMentor.pedigree}</p>
                  </div>
                </div>
                <div className="pt-2 flex items-center justify-between text-xs text-stone-500 border-t border-stone-200/60">
                  <span className="flex items-center gap-1 font-semibold text-stone-700">
                    <Star className="size-3 text-amber-500 fill-amber-500" />
                    <span>{trajectoryMeta.primaryMentor.rating}</span>
                  </span>
                  <button
                    onClick={() => openBookingModal(trajectoryMeta.primaryMentor.trackId)}
                    className="text-orange-600 font-bold hover:underline"
                  >
                    Schedule Session →
                  </button>
                </div>
              </div>

              {/* Mentor 2 */}
              <div className="p-6 rounded-2xl bg-stone-50 border border-stone-200/80 space-y-3">
                <div className="flex items-start gap-4">
                  <div className="size-14 rounded-2xl overflow-hidden bg-stone-100 border border-stone-200/90 shadow-xs flex items-center justify-center shrink-0">
                    <Blobatar name="Pooja Krishnan" size={56} animate="hover" className="size-full object-cover" />
                  </div>
                  <div>
                    <h3 className="font-display font-bold text-base text-stone-900">
                      Pooja Krishnan
                    </h3>
                    <p className="text-xs text-stone-600 font-medium">Public Speaking & Debate Coach</p>
                    <p className="text-[11px] text-stone-400">Toastmasters International • St. Stephen's Delhi</p>
                  </div>
                </div>
                <div className="pt-2 flex items-center justify-between text-xs text-stone-500 border-t border-stone-200/60">
                  <span className="flex items-center gap-1 font-semibold text-stone-700">
                    <Star className="size-3 text-amber-500 fill-amber-500" />
                    <span>4.96</span>
                  </span>
                  <button
                    onClick={() => openBookingModal("media-creative-tech")}
                    className="text-orange-600 font-bold hover:underline"
                  >
                    Schedule Session →
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* ========================================================= */}
      {/* 4. MODAL: ADD MILESTONE DRAWER */}
      {/* ========================================================= */}
      {showGoalModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl border border-stone-200 space-y-4">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <h3 className="font-display font-bold text-lg text-stone-900">
                Add Kaizen Milestone
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
