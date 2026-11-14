"use client";

import { useState } from "react";
import Link from "next/link";
import { useStudentAuth } from "@/context/StudentAuthContext";
import { useUserProfile } from "@/context/UserProfileContext";
import {
  Calendar,
  BookOpen,
  Award,
  Clock,
  CheckCircle,
  Circle,
  Users,
  Compass,
  FileText,
  Bell,
  ArrowRight,
  TrendingUp,
  Brain,
  Sparkles,
  Search,
  Menu,
  X,
  Plus,
  Zap,
  LogOut,
  UserCheck,
  ShieldCheck,
  Building,
  GraduationCap,
} from "lucide-react";

type Tab = "overview" | "diary" | "planner" | "analysis" | "courses" | "mentors";

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

  const { openBookingModal } = useUserProfile();

  const [activeTab, setActiveTab] = useState<Tab>("overview");
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const [plannerView, setPlannerView] = useState<"daily" | "monthly" | "yearly">("daily");

  // Diary form state
  const [diaryTitle, setDiaryTitle] = useState("");
  const [diaryNote, setDiaryNote] = useState("");
  const [diaryCategory, setDiaryCategory] = useState("reflection");
  const [isSavingDiary, setIsSavingDiary] = useState(false);

  // Goal form state
  const [newGoalTitle, setNewGoalTitle] = useState("");
  const [newGoalDeadline, setNewGoalDeadline] = useState("");
  const [isAddingGoal, setIsAddingGoal] = useState(false);
  const [showGoalForm, setShowGoalForm] = useState(false);

  // Active student details (fallback to Aarav if guest preview)
  const currentStudent = user || {
    id: "guest",
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

  const handleAddDiary = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!diaryNote.trim()) return;
    setIsSavingDiary(true);
    await addDiaryEntry(
      diaryTitle.trim() || "Daily Reflection",
      diaryNote.trim(),
      diaryCategory
    );
    setDiaryTitle("");
    setDiaryNote("");
    setIsSavingDiary(false);
  };

  const handleCreateGoal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGoalTitle.trim()) return;
    setIsAddingGoal(true);
    await addGoal(
      newGoalTitle.trim(),
      plannerView,
      newGoalDeadline.trim() || undefined
    );
    setNewGoalTitle("");
    setNewGoalDeadline("");
    setShowGoalForm(false);
    setIsAddingGoal(false);
  };

  // Filter goals for active view
  const currentGoals = goals.filter((g) => g.timeView === plannerView);
  const pendingGoalsCount = goals.filter((g) => !g.completed).length;

  return (
    <div className="min-h-screen bg-bg-muted flex flex-col md:flex-row text-text font-body">
      {/* Mobile Header Bar */}
      <div className="md:hidden flex items-center justify-between p-4 bg-white border-b border-border/70 sticky top-0 z-30 shadow-sm">
        <Link href="/" className="flex items-center gap-2">
          <span className="font-display font-extrabold text-xl text-gradient">PTIROS</span>
          <span className="text-[10px] uppercase font-bold tracking-widest px-1.5 py-0.5 rounded-md bg-primary/10 text-primary">
            Portal
          </span>
        </Link>
        <button
          onClick={() => setIsMobileNavOpen(!isMobileNavOpen)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-border/60 bg-bg text-accent text-xs font-bold"
          aria-label="Toggle dashboard menu"
        >
          <span className="capitalize">{activeTab}</span>
          {isMobileNavOpen ? <X className="size-4" /> : <Menu className="size-4" />}
        </button>
      </div>

      {/* Sidebar */}
      <aside
        className={`${
          isMobileNavOpen ? "flex" : "hidden"
        } md:flex w-full md:w-72 md:sticky md:top-0 md:h-screen md:overflow-y-auto bg-white border-r border-border/70 p-6 flex-col justify-between z-20 shrink-0`}
      >
        <div>
          {/* Logo (Desktop) */}
          <Link href="/" className="hidden md:flex items-center gap-2 mb-6">
            <span className="font-display font-extrabold text-2xl text-gradient">PTIROS</span>
            <span className="text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded-md bg-primary/10 text-primary">
              Portal
            </span>
          </Link>

          {/* User profile card */}
          <div className="p-3.5 rounded-2xl bg-bg border border-border/60 mb-5">
            <div className="flex items-center gap-3">
              <div className="size-11 rounded-xl bg-gradient-to-tr from-primary to-secondary text-white font-bold flex items-center justify-center font-display shadow-xs shrink-0">
                {currentStudent.avatarInitials}
              </div>
              <div className="overflow-hidden">
                <div className="font-bold text-sm text-accent truncate">
                  {currentStudent.name}
                </div>
                <div className="text-xs text-text-muted truncate">
                  {currentStudent.grade} • {currentStudent.curriculum}
                </div>
              </div>
            </div>
            {currentStudent.schoolName && (
              <div className="mt-2 text-[11px] text-text-muted flex items-center gap-1 truncate pt-2 border-t border-border/40">
                <Building className="size-3 shrink-0 text-primary/70" />
                <span className="truncate">{currentStudent.schoolName}</span>
              </div>
            )}
          </div>

          {/* Navigation */}
          <nav className="space-y-1">
            <button
              onClick={() => {
                setActiveTab("overview");
                setIsMobileNavOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
                activeTab === "overview"
                  ? "bg-primary text-white shadow-md shadow-primary/20"
                  : "text-accent hover:bg-bg"
              }`}
            >
              <Compass className="size-4" /> Dashboard Overview
            </button>
            <button
              onClick={() => {
                setActiveTab("planner");
                setIsMobileNavOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
                activeTab === "planner"
                  ? "bg-primary text-white shadow-md shadow-primary/20"
                  : "text-accent hover:bg-bg"
              }`}
            >
              <Calendar className="size-4" /> My Planner ({pendingGoalsCount})
            </button>
            <button
              onClick={() => {
                setActiveTab("diary");
                setIsMobileNavOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
                activeTab === "diary"
                  ? "bg-primary text-white shadow-md shadow-primary/20"
                  : "text-accent hover:bg-bg"
              }`}
            >
              <FileText className="size-4" /> My Diary ({diary.length})
            </button>
            <button
              onClick={() => {
                setActiveTab("courses");
                setIsMobileNavOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
                activeTab === "courses"
                  ? "bg-primary text-white shadow-md shadow-primary/20"
                  : "text-accent hover:bg-bg"
              }`}
            >
              <BookOpen className="size-4" /> My Courses & Roadmaps
            </button>
            <button
              onClick={() => {
                setActiveTab("analysis");
                setIsMobileNavOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
                activeTab === "analysis"
                  ? "bg-primary text-white shadow-md shadow-primary/20"
                  : "text-accent hover:bg-bg"
              }`}
            >
              <Brain className="size-4" /> Career Test Analysis
            </button>
            <button
              onClick={() => {
                setActiveTab("mentors");
                setIsMobileNavOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
                activeTab === "mentors"
                  ? "bg-primary text-white shadow-md shadow-primary/20"
                  : "text-accent hover:bg-bg"
              }`}
            >
              <Users className="size-4" /> My Mentors & Sessions
            </button>
          </nav>
        </div>

        {/* Sidebar Footer: Session controls & Home link */}
        <div className="pt-4 border-t border-border/50 space-y-3">
          {isLoggedIn ? (
            <button
              onClick={logout}
              className="w-full flex items-center justify-between text-xs font-semibold text-text-muted hover:text-red-600 transition-colors cursor-pointer py-1"
            >
              <span className="flex items-center gap-1.5">
                <LogOut className="size-3.5" /> Sign Out
              </span>
              <span className="text-[10px] text-text-muted/60">{currentStudent.email}</span>
            </button>
          ) : (
            <button
              onClick={() => openAuthModal("login")}
              className="w-full py-2 px-3 rounded-xl bg-orange-50 border border-orange-200 text-primary text-xs font-bold hover:bg-orange-100 transition flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Zap className="size-3.5" /> Sign In / Demo Switch
            </button>
          )}

          <Link
            href="/"
            className="flex items-center justify-between text-xs font-semibold text-text-muted hover:text-primary transition-colors pt-1"
          >
            <span>Back to Public Website</span>
            <ArrowRight className="size-3.5" />
          </Link>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-5 sm:p-8 lg:p-10 overflow-y-auto">
        {/* Top interactive Demo Switcher bar */}
        <div className="mb-6 p-3.5 rounded-2xl bg-white border border-border/70 shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-bold text-accent">Active Demo Session:</span>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-orange-100 text-orange-800">
              {currentStudent.name} ({currentStudent.grade})
            </span>
          </div>

          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-[11px] text-text-muted mr-1 font-medium">Switch Student:</span>
            <button
              type="button"
              onClick={() => loginAsDemo("aarav")}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition cursor-pointer border ${
                currentStudent.email === "aarav@demo.ptiros.in"
                  ? "bg-primary text-white border-primary shadow-xs"
                  : "bg-bg-muted hover:bg-orange-50 border-border/60 text-accent"
              }`}
            >
              🚀 Aarav (AI)
            </button>
            <button
              type="button"
              onClick={() => loginAsDemo("meera")}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition cursor-pointer border ${
                currentStudent.email === "meera@demo.ptiros.in"
                  ? "bg-primary text-white border-primary shadow-xs"
                  : "bg-bg-muted hover:bg-blue-50 border-border/60 text-accent"
              }`}
            >
              ⚖️ Meera (Law)
            </button>
            <button
              type="button"
              onClick={() => loginAsDemo("vihaan")}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition cursor-pointer border ${
                currentStudent.email === "vihaan@demo.ptiros.in"
                  ? "bg-primary text-white border-primary shadow-xs"
                  : "bg-bg-muted hover:bg-emerald-50 border-border/60 text-accent"
              }`}
            >
              🧬 Vihaan (Med)
            </button>
            <button
              type="button"
              onClick={() => openAuthModal("signup")}
              className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-bg-muted hover:bg-white border border-border/60 text-text-muted hover:text-accent transition cursor-pointer ml-1"
            >
              + New Signup
            </button>
          </div>
        </div>

        {/* Page Title & Diagnostic CTA */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-display font-bold text-accent">
              Welcome back, {currentStudent.name.split(" ")[0]} 👋
            </h1>
            <p className="text-xs sm:text-sm text-text-muted mt-1">
              {currentStudent.schoolName ? `${currentStudent.schoolName} • ` : ""}
              {currentStudent.city} • Verified Neon Database Cloud Sync
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/career-test"
              className="px-4 py-2 rounded-xl bg-primary text-white font-bold text-xs shadow-md shadow-primary/20 hover:bg-primary-dark transition-all flex items-center gap-1.5"
            >
              <Sparkles className="size-3.5" /> Retake Diagnostic
            </Link>
          </div>
        </div>

        {/* ========================================================= */}
        {/* TAB 1: OVERVIEW */}
        {/* ========================================================= */}
        {activeTab === "overview" && (
          <div className="space-y-8">
            {/* Quick Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-5 rounded-2xl bg-white border border-border/70 shadow-sm">
                <div className="flex items-center justify-between text-text-muted text-xs font-semibold mb-2">
                  <span>Weekly Study Target</span>
                  <Clock className="size-4 text-primary" />
                </div>
                <div className="text-2xl font-bold font-display text-accent">18.5 / 20 hrs</div>
                <div className="w-full h-1.5 rounded-full bg-border/40 mt-3 overflow-hidden">
                  <div className="h-full bg-primary w-[92%]" />
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-white border border-border/70 shadow-sm">
                <div className="flex items-center justify-between text-text-muted text-xs font-semibold mb-2">
                  <span>Roadmap Milestones</span>
                  <TrendingUp className="size-4 text-primary" />
                </div>
                <div className="text-2xl font-bold font-display text-accent">
                  {goals.filter((g) => g.completed).length} / {goals.length || 6} Done
                </div>
                <div className="w-full h-1.5 rounded-full bg-border/40 mt-3 overflow-hidden">
                  <div
                    className="h-full bg-success transition-all duration-500"
                    style={{
                      width: `${
                        goals.length > 0
                          ? Math.round((goals.filter((g) => g.completed).length / goals.length) * 100)
                          : 65
                      }%`,
                    }}
                  />
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-white border border-border/70 shadow-sm">
                <div className="flex items-center justify-between text-text-muted text-xs font-semibold mb-2">
                  <span>Verified Credentials</span>
                  <Award className="size-4 text-primary" />
                </div>
                <div className="text-2xl font-bold font-display text-accent">
                  {simulations.length > 0 ? `${simulations.length} Badges` : "2 Certificates"}
                </div>
                <div className="text-[11px] text-success mt-2 font-medium flex items-center gap-1">
                  <ShieldCheck className="size-3.5" /> NEP 2020 Aligned
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-white border border-border/70 shadow-sm">
                <div className="flex items-center justify-between text-text-muted text-xs font-semibold mb-2">
                  <span>Upcoming Mentor Session</span>
                  <Users className="size-4 text-primary" />
                </div>
                <div className="text-base font-bold font-display text-accent">Tomorrow, 5:00 PM</div>
                <div className="text-[11px] text-text-muted mt-2 font-medium">
                  {currentStudent.grade === "Class 11"
                    ? "Adv. Sneha Mukherjee (NLSIU)"
                    : "Dr. Aryan Sharma (IIT Delhi)"}
                </div>
              </div>
            </div>

            {/* Split row: Tasks & Today's Schedule */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* My Active Tasks (Live Neon sync) */}
              <div className="p-6 rounded-3xl bg-white border border-border/70 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-display font-bold text-accent text-lg">My Active Tasks</h3>
                  <button
                    onClick={() => setActiveTab("planner")}
                    className="text-xs font-bold text-primary hover:underline"
                  >
                    View All ({goals.length}) →
                  </button>
                </div>

                <div className="space-y-2.5">
                  {goals.slice(0, 4).map((goal) => (
                    <div
                      key={goal.id}
                      onClick={() => toggleGoal(goal.id, !goal.completed)}
                      className={`p-3.5 rounded-xl border transition-all flex items-center justify-between cursor-pointer ${
                        goal.completed
                          ? "bg-bg-muted/40 border-border/40 opacity-70"
                          : "border-border/60 hover:border-primary/40 bg-white"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        {goal.completed ? (
                          <CheckCircle className="size-4 text-emerald-600 shrink-0" />
                        ) : (
                          <Circle className="size-4 text-text-muted shrink-0 hover:text-primary" />
                        )}
                        <div>
                          <div
                            className={`text-sm font-semibold ${
                              goal.completed ? "line-through text-text-muted" : "text-accent"
                            }`}
                          >
                            {goal.title}
                          </div>
                          {goal.deadline && (
                            <div className="text-xs text-text-muted">{goal.deadline}</div>
                          )}
                        </div>
                      </div>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-orange-100 text-orange-700 capitalize">
                        {goal.timeView}
                      </span>
                    </div>
                  ))}

                  {goals.length === 0 && (
                    <p className="text-xs text-text-muted text-center py-4">
                      No tasks yet. Open Planner to add your daily milestones.
                    </p>
                  )}
                </div>
              </div>

              {/* Personalized Timetable */}
              <div className="p-6 rounded-3xl bg-white border border-border/70 shadow-sm">
                <h3 className="font-display font-bold text-accent text-lg mb-4 flex items-center justify-between">
                  <span>Personalized Timetable</span>
                  <span className="text-xs text-text-muted">Synced with School Hours</span>
                </h3>
                <div className="space-y-3 text-sm">
                  <div className="flex items-start gap-4 p-3 rounded-xl bg-bg-muted">
                    <span className="font-bold text-xs text-primary whitespace-nowrap pt-0.5">
                      04:30 PM
                    </span>
                    <div>
                      <div className="font-semibold text-accent text-xs sm:text-sm">
                        Foundation Drill & Problem Sets
                      </div>
                      <div className="text-xs text-text-muted">
                        High-yield concepts with timer constraint
                      </div>
                    </div>
                  </div>
                  <div className="flex items-start gap-4 p-3 rounded-xl bg-bg-muted">
                    <span className="font-bold text-xs text-primary whitespace-nowrap pt-0.5">
                      06:00 PM
                    </span>
                    <div>
                      <div className="font-semibold text-accent text-xs sm:text-sm">
                        Skill Booster: Interactive Simulation
                      </div>
                      <div className="text-xs text-text-muted">
                        Applied dilemma solving and real-world tools
                      </div>
                    </div>
                  </div>
                  <div className="flex items-start gap-4 p-3 rounded-xl bg-bg-muted">
                    <span className="font-bold text-xs text-primary whitespace-nowrap pt-0.5">
                      07:30 PM
                    </span>
                    <div>
                      <div className="font-semibold text-accent text-xs sm:text-sm">
                        Japanese Kaizen Self-Reflection (Hansei)
                      </div>
                      <div className="text-xs text-text-muted">
                        Log daily diary entry & review learnings
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 2: MY PLANNER (Kaizen Framework) */}
        {/* ========================================================= */}
        {activeTab === "planner" && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-border/70 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-4">
              <div>
                <h2 className="text-xl font-display font-bold text-accent">Student Roadmap Planner</h2>
                <p className="text-xs text-text-muted mt-0.5">
                  Framework inspired by Japanese Kaizen + Indian Gurukul discipline. Click task to toggle completion.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex gap-1 p-1 rounded-xl bg-bg-muted border border-border/50 text-xs font-semibold">
                  <button
                    onClick={() => setPlannerView("daily")}
                    className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                      plannerView === "daily" ? "bg-primary text-white" : "text-accent hover:bg-white"
                    }`}
                  >
                    Daily
                  </button>
                  <button
                    onClick={() => setPlannerView("monthly")}
                    className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                      plannerView === "monthly" ? "bg-primary text-white" : "text-accent hover:bg-white"
                    }`}
                  >
                    Monthly
                  </button>
                  <button
                    onClick={() => setPlannerView("yearly")}
                    className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                      plannerView === "yearly" ? "bg-primary text-white" : "text-accent hover:bg-white"
                    }`}
                  >
                    Yearly
                  </button>
                </div>

                <button
                  onClick={() => setShowGoalForm(!showGoalForm)}
                  className="px-3 py-1.5 rounded-xl bg-primary text-white text-xs font-bold flex items-center gap-1 hover:bg-primary-dark transition cursor-pointer"
                >
                  <Plus className="size-3.5" /> Add Task
                </button>
              </div>
            </div>

            {/* Inline Add Goal Form */}
            {showGoalForm && (
              <form onSubmit={handleCreateGoal} className="p-4 rounded-2xl bg-orange-50/70 border border-orange-200 space-y-3">
                <div className="text-xs font-bold text-orange-950">Add New {plannerView.toUpperCase()} Milestone</div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="sm:col-span-2">
                    <input
                      type="text"
                      value={newGoalTitle}
                      onChange={(e) => setNewGoalTitle(e.target.value)}
                      placeholder="e.g. Complete Coordinate Geometry numericals"
                      required
                      className="w-full px-3 py-2 rounded-xl border border-border bg-white text-xs focus:ring-2 focus:ring-primary focus:outline-none"
                    />
                  </div>
                  <div>
                    <input
                      type="text"
                      value={newGoalDeadline}
                      onChange={(e) => setNewGoalDeadline(e.target.value)}
                      placeholder="Deadline (e.g. Today 6 PM)"
                      className="w-full px-3 py-2 rounded-xl border border-border bg-white text-xs focus:ring-2 focus:ring-primary focus:outline-none"
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowGoalForm(false)}
                    className="px-3 py-1.5 rounded-xl border border-border text-xs text-text-muted hover:bg-white cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isAddingGoal}
                    className="px-4 py-1.5 rounded-xl bg-primary text-white text-xs font-bold hover:bg-primary-dark transition cursor-pointer disabled:opacity-50"
                  >
                    {isAddingGoal ? "Saving..." : "Save Milestone"}
                  </button>
                </div>
              </form>
            )}

            {/* Task list for current view */}
            <div className="space-y-3">
              {currentGoals.map((goal) => (
                <div
                  key={goal.id}
                  onClick={() => toggleGoal(goal.id, !goal.completed)}
                  className={`p-4 rounded-2xl border transition-all flex items-center justify-between cursor-pointer ${
                    goal.completed
                      ? "bg-bg-muted/40 border-border/40 opacity-70"
                      : "bg-white border-border/80 hover:border-primary/50 shadow-xs"
                  }`}
                >
                  <div className="flex items-center gap-3.5">
                    {goal.completed ? (
                      <CheckCircle className="size-5 text-emerald-600 shrink-0" />
                    ) : (
                      <Circle className="size-5 text-text-muted shrink-0 hover:text-primary" />
                    )}
                    <div>
                      <h4
                        className={`text-sm font-semibold ${
                          goal.completed ? "line-through text-text-muted" : "text-accent"
                        }`}
                      >
                        {goal.title}
                      </h4>
                      {goal.deadline && (
                        <p className="text-xs text-text-muted mt-0.5">{goal.deadline}</p>
                      )}
                    </div>
                  </div>
                  <span
                    className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                      goal.completed
                        ? "bg-emerald-100 text-emerald-800"
                        : "bg-orange-100 text-orange-800"
                    }`}
                  >
                    {goal.completed ? "Completed" : "In Progress"}
                  </span>
                </div>
              ))}

              {currentGoals.length === 0 && (
                <div className="text-center py-8 text-text-muted text-xs">
                  No {plannerView} milestones listed yet. Click "+ Add Task" to set your targets!
                </div>
              )}
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 3: MY DIARY (Hansei Reflection) */}
        {/* ========================================================= */}
        {activeTab === "diary" && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-border/70 shadow-sm space-y-6">
            <div>
              <h2 className="text-xl font-display font-bold text-accent">Student Learning Diary</h2>
              <p className="text-xs text-text-muted mt-0.5">
                Daily reflective journaling as practiced in the Japanese education system (Hansei). Recorded live in Neon Database.
              </p>
            </div>

            <form onSubmit={handleAddDiary} className="space-y-3 bg-bg-muted/50 p-4 rounded-2xl border border-border/60">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2">
                  <input
                    type="text"
                    value={diaryTitle}
                    onChange={(e) => setDiaryTitle(e.target.value)}
                    placeholder="Entry title (e.g. Robotics Simulator Milestone reflection)"
                    className="w-full p-3 rounded-xl border border-border focus:ring-2 focus:ring-primary focus:outline-none text-xs bg-white"
                  />
                </div>
                <div>
                  <select
                    value={diaryCategory}
                    onChange={(e) => setDiaryCategory(e.target.value)}
                    className="w-full p-3 rounded-xl border border-border focus:ring-2 focus:ring-primary focus:outline-none text-xs bg-white"
                  >
                    <option value="reflection">General Reflection</option>
                    <option value="simulator">Simulation Debrief</option>
                    <option value="academic">Board Exam Prep</option>
                    <option value="family">Parent Stream Discussion</option>
                  </select>
                </div>
              </div>

              <textarea
                value={diaryNote}
                onChange={(e) => setDiaryNote(e.target.value)}
                placeholder="What did you learn today? What dilemma did you face and how did you resolve it?"
                rows={3}
                required
                className="w-full p-3.5 rounded-xl border border-border focus:ring-2 focus:ring-primary focus:outline-none text-xs bg-white"
              />

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={isSavingDiary}
                  className="px-5 py-2.5 rounded-xl bg-primary text-white font-semibold text-xs shadow-md shadow-primary/20 hover:bg-primary-dark transition-all cursor-pointer disabled:opacity-60 flex items-center gap-1.5"
                >
                  {isSavingDiary ? "Saving to Neon..." : "Save Daily Entry"}
                  <Sparkles className="size-3.5" />
                </button>
              </div>
            </form>

            <div className="space-y-4 pt-2">
              <h3 className="font-bold text-sm text-accent flex items-center justify-between">
                <span>Past Reflections</span>
                <span className="text-xs text-text-muted">{diary.length} entries recorded</span>
              </h3>

              {diary.map((entry) => (
                <div key={entry.id} className="p-4 rounded-2xl bg-bg-muted border border-border/50">
                  <div className="flex justify-between items-center text-xs font-semibold text-text-muted mb-1.5">
                    <span className="text-primary font-bold text-sm">{entry.title}</span>
                    <span className="text-[11px]">{entry.date}</span>
                  </div>
                  <p className="text-xs sm:text-sm text-accent leading-relaxed">{entry.content}</p>
                  <div className="mt-2.5 flex items-center gap-2">
                    <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-orange-100 text-orange-800">
                      {entry.category}
                    </span>
                  </div>
                </div>
              ))}

              {diary.length === 0 && (
                <div className="text-center py-8 text-text-muted text-xs">
                  No diary entries yet. Write your first reflection above!
                </div>
              )}
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 4: CAREER TEST ANALYSIS & SIMULATION SCORES */}
        {/* ========================================================= */}
        {activeTab === "analysis" && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-border/70 shadow-sm space-y-6">
            <div className="flex items-center justify-between border-b pb-4">
              <div>
                <h2 className="text-xl font-display font-bold text-accent">Career Test 360° Diagnostic</h2>
                <p className="text-xs text-text-muted">
                  Verified by PTIROS Senior Advisory Council • Neon Cloud Linked
                </p>
              </div>
              <Link
                href="/career-test"
                className="px-4 py-2 rounded-xl bg-primary/10 text-primary font-bold text-xs hover:bg-primary/20 transition-all"
              >
                View Full Dossier →
              </Link>
            </div>

            {/* Simulation scores from Neon */}
            <div className="space-y-4">
              <h3 className="font-bold text-sm text-accent">Completed Simulation Tracks</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {simulations.map((sim) => (
                  <div key={sim.id} className="p-5 rounded-2xl bg-orange-50/70 border border-orange-200">
                    <div className="flex items-center justify-between text-xs font-bold text-primary mb-2">
                      <span>SIMULATION TRACK</span>
                      <span className="px-2 py-0.5 rounded-full bg-orange-200/60 text-orange-900">
                        {sim.fitScore}% Fit Score
                      </span>
                    </div>
                    <h4 className="font-bold text-accent text-base">{sim.trackTitle}</h4>
                    <p className="text-xs text-text-muted mt-1">
                      Resilience Points: <strong className="text-accent">{sim.resiliencePoints} XP</strong>
                    </p>
                    {sim.badgeEarned && (
                      <div className="mt-3 flex items-center gap-1.5 text-xs font-semibold text-emerald-800 bg-emerald-100/80 px-2.5 py-1 rounded-xl w-fit">
                        <Award className="size-3.5" />
                        <span>Badge: {sim.badgeEarned}</span>
                      </div>
                    )}
                  </div>
                ))}

                {simulations.length === 0 && (
                  <div className="col-span-2 p-5 rounded-2xl bg-bg-muted border border-border/60 text-center py-8">
                    <p className="text-xs text-text-muted mb-3">
                      You haven't completed any simulator missions yet. Test your real-world aptitudes!
                    </p>
                    <Link
                      href="/simulator"
                      className="px-4 py-2 rounded-xl bg-primary text-white text-xs font-bold"
                    >
                      Launch Career Simulator →
                    </Link>
                  </div>
                )}
              </div>
            </div>

            {/* Qualitative Strengths */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-border/50">
              <div className="p-4 rounded-2xl bg-bg-muted border border-border/60">
                <span className="text-xs font-bold text-primary">PRIMARY STRENGTH</span>
                <h4 className="font-bold text-accent text-base mt-1">
                  {currentStudent.grade === "Class 11"
                    ? "Contract Analysis & Risk Spotting"
                    : "High Quantitative & Systems Thinking"}
                </h4>
                <p className="text-xs text-text-muted mt-1">
                  {currentStudent.grade === "Class 11"
                    ? "Identified subtle non-compete clauses and regulatory compliance bottlenecks."
                    : "Exceptional performance in algorithm building, PID logic, and telemetry calibration."}
                </p>
              </div>
              <div className="p-4 rounded-2xl bg-bg-muted border border-border/60">
                <span className="text-xs font-bold text-primary">GROWTH OPPORTUNITY</span>
                <h4 className="font-bold text-accent text-base mt-1">Impromptu Communication</h4>
                <p className="text-xs text-text-muted mt-1">
                  Recommended: 4 sessions of weekly public speaking & debate coaching with Toastmasters mentors.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 5: COURSES */}
        {/* ========================================================= */}
        {activeTab === "courses" && (
          <div className="space-y-4">
            <h2 className="text-xl font-display font-bold text-accent">Enrolled PTIROS Modules</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-5 rounded-2xl bg-white border border-border/70 shadow-sm">
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-primary/10 text-primary">
                  Active
                </span>
                <h3 className="font-bold text-base text-accent mt-2">
                  {currentStudent.grade} Board Examination Blueprint
                </h3>
                <p className="text-xs text-text-muted mt-1">
                  Comprehensive NCERT derivations, speed drills, and pre-board mock series.
                </p>
                <div className="mt-4 flex items-center justify-between text-xs font-semibold text-primary">
                  <span>Progress: 72%</span>
                  <Link href="#continue" className="hover:underline">
                    Continue Module →
                  </Link>
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-white border border-border/70 shadow-sm">
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-700">
                  Enrolled
                </span>
                <h3 className="font-bold text-base text-accent mt-2">
                  Elite Government Certification Track
                </h3>
                <p className="text-xs text-text-muted mt-1">
                  National Skill Qualification Framework (NSQF Level 4) computational thinking credential.
                </p>
                <div className="mt-4 flex items-center justify-between text-xs font-semibold text-primary">
                  <span>Exam Window: Dec 2026</span>
                  <Link href="#view" className="hover:underline">
                    View Syllabus →
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 6: MENTORS */}
        {/* ========================================================= */}
        {activeTab === "mentors" && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-border/70 shadow-sm space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-display font-bold text-accent">Assigned Mentors & 1:1 Sessions</h2>
                <p className="text-xs text-text-muted">Personalized mentors mapped to your aptitude profile</p>
              </div>
              <button
                onClick={() => openBookingModal()}
                className="px-4 py-2 rounded-xl bg-primary text-white text-xs font-bold shadow-md shadow-primary/20 hover:bg-primary-dark transition cursor-pointer"
              >
                + Book 1:1 Session
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-5 rounded-2xl bg-bg-muted border border-border/60 flex items-center gap-4">
                <div className="size-14 rounded-2xl bg-primary text-white font-bold flex items-center justify-center font-display text-lg shrink-0">
                  AS
                </div>
                <div>
                  <h4 className="font-bold text-accent">Dr. Aryan Sharma</h4>
                  <div className="text-xs text-text-muted">AI & Robotics Lead (Ex-ISRO / IIT Delhi)</div>
                  <button
                    onClick={() => openBookingModal("ai-robotics")}
                    className="mt-2 text-xs font-bold text-primary hover:underline cursor-pointer"
                  >
                    Schedule 1:1 Consultation →
                  </button>
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-bg-muted border border-border/60 flex items-center gap-4">
                <div className="size-14 rounded-2xl bg-secondary text-white font-bold flex items-center justify-center font-display text-lg shrink-0">
                  SM
                </div>
                <div>
                  <h4 className="font-bold text-accent">Adv. Sneha Mukherjee</h4>
                  <div className="text-xs text-text-muted">Corporate Law & Public Policy (NLSIU)</div>
                  <button
                    onClick={() => openBookingModal("corporate-law")}
                    className="mt-2 text-xs font-bold text-primary hover:underline cursor-pointer"
                  >
                    Schedule 1:1 Consultation →
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
