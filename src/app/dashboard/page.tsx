"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Calendar,
  BookOpen,
  Award,
  Clock,
  CheckCircle,
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
  ChevronDown,
} from "lucide-react";

type Tab = "overview" | "diary" | "planner" | "analysis" | "courses" | "mentors";

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState<Tab>("overview");
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const [plannerView, setPlannerView] = useState<"daily" | "monthly" | "yearly">("daily");
  const [diaryNote, setDiaryNote] = useState("");
  const [diaryEntries, setDiaryEntries] = useState([
    {
      date: "Nov 06, 2026",
      title: "Completed Science Milestone: Robotics Logic",
      content: "Learned about motor drivers and sensor integration. Mentor suggested reviewing proportional control.",
    },
    {
      date: "Nov 04, 2026",
      title: "Mock Debating on Public Policy",
      content: "Spoke on renewable energy adoption. Improved eye contact and paced my speech.",
    },
  ]);

  const handleAddDiary = (e: React.FormEvent) => {
    e.preventDefault();
    if (!diaryNote.trim()) return;
    setDiaryEntries([
      {
        date: "Today",
        title: "Daily Reflection",
        content: diaryNote,
      },
      ...diaryEntries,
    ]);
    setDiaryNote("");
  };

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
          <Link href="/" className="hidden md:flex items-center gap-2 mb-8">
            <span className="font-display font-extrabold text-2xl text-gradient">PTIROS</span>
            <span className="text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded-md bg-primary/10 text-primary">
              Portal
            </span>
          </Link>

          {/* User badge */}
          <div className="flex items-center gap-3 p-3 rounded-2xl bg-bg border border-border/40 mb-6">
            <div className="size-11 rounded-xl bg-gradient-to-tr from-primary to-secondary text-white font-bold flex items-center justify-center font-display">
              AS
            </div>
            <div>
              <div className="font-bold text-sm text-accent">Aarav Sharma</div>
              <div className="text-xs text-text-muted">Grade 10 • CBSE</div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="space-y-1">
            <button
              onClick={() => {
                setActiveTab("overview");
                setIsMobileNavOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
                activeTab === "overview" ? "bg-primary text-white shadow-md shadow-primary/20" : "text-accent hover:bg-bg"
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
                activeTab === "planner" ? "bg-primary text-white shadow-md shadow-primary/20" : "text-accent hover:bg-bg"
              }`}
            >
              <Calendar className="size-4" /> My Planner
            </button>
            <button
              onClick={() => {
                setActiveTab("diary");
                setIsMobileNavOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
                activeTab === "diary" ? "bg-primary text-white shadow-md shadow-primary/20" : "text-accent hover:bg-bg"
              }`}
            >
              <FileText className="size-4" /> My Diary
            </button>
            <button
              onClick={() => {
                setActiveTab("courses");
                setIsMobileNavOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
                activeTab === "courses" ? "bg-primary text-white shadow-md shadow-primary/20" : "text-accent hover:bg-bg"
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
                activeTab === "analysis" ? "bg-primary text-white shadow-md shadow-primary/20" : "text-accent hover:bg-bg"
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
                activeTab === "mentors" ? "bg-primary text-white shadow-md shadow-primary/20" : "text-accent hover:bg-bg"
              }`}
            >
              <Users className="size-4" /> My Mentors & Sessions
            </button>
          </nav>
        </div>

        {/* Return to website */}
        <div className="pt-6 border-t border-border/50">
          <Link
            href="/"
            className="flex items-center justify-between text-xs font-semibold text-text-muted hover:text-primary transition-colors"
          >
            <span>Back to Public Website</span>
            <ArrowRight className="size-3.5" />
          </Link>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-6 sm:p-10 overflow-y-auto">
        {/* Top bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-display font-bold text-accent">
              Welcome back, Aarav 👋
            </h1>
            <p className="text-xs sm:text-sm text-text-muted mt-1">
              Here is your active mentorship trajectory, daily planner, and milestones.
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

        {/* Tab 1: Overview */}
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
                  <span>Roadmap Progress</span>
                  <TrendingUp className="size-4 text-primary" />
                </div>
                <div className="text-2xl font-bold font-display text-accent">74% Done</div>
                <div className="w-full h-1.5 rounded-full bg-border/40 mt-3 overflow-hidden">
                  <div className="h-full bg-success w-[74%]" />
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-white border border-border/70 shadow-sm">
                <div className="flex items-center justify-between text-text-muted text-xs font-semibold mb-2">
                  <span>Verified Credentials</span>
                  <Award className="size-4 text-primary" />
                </div>
                <div className="text-2xl font-bold font-display text-accent">3 Certificates</div>
                <div className="text-[11px] text-success mt-2 font-medium">NEP 2020 Aligned</div>
              </div>

              <div className="p-5 rounded-2xl bg-white border border-border/70 shadow-sm">
                <div className="flex items-center justify-between text-text-muted text-xs font-semibold mb-2">
                  <span>Upcoming Mentor Session</span>
                  <Users className="size-4 text-primary" />
                </div>
                <div className="text-base font-bold font-display text-accent">Tomorrow, 5:00 PM</div>
                <div className="text-[11px] text-text-muted mt-2 font-medium">Dr. Rajesh Iyer (IIT-D)</div>
              </div>
            </div>

            {/* Split row: Tasks & Today's Schedule */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* My Tasks */}
              <div className="p-6 rounded-3xl bg-white border border-border/70 shadow-sm">
                <h3 className="font-display font-bold text-accent text-lg mb-4 flex items-center justify-between">
                  <span>My Active Tasks</span>
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-primary/10 text-primary">
                    3 Pending
                  </span>
                </h3>
                <div className="space-y-3">
                  <div className="p-3.5 rounded-xl border border-border/60 hover:bg-bg-muted transition-colors flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <CheckCircle className="size-4 text-primary" />
                      <div>
                        <div className="text-sm font-semibold text-accent">Complete Physics Circuit Lab</div>
                        <div className="text-xs text-text-muted">Due today at 8:00 PM</div>
                      </div>
                    </div>
                    <span className="text-xs font-bold px-2 py-0.5 rounded bg-orange-100 text-orange-700">High</span>
                  </div>

                  <div className="p-3.5 rounded-xl border border-border/60 hover:bg-bg-muted transition-colors flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <CheckCircle className="size-4 text-text-muted" />
                      <div>
                        <div className="text-sm font-semibold text-accent">Public Speaking Speech Draft (3 Mins)</div>
                        <div className="text-xs text-text-muted">Due Nov 08</div>
                      </div>
                    </div>
                    <span className="text-xs font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-700">Skill</span>
                  </div>

                  <div className="p-3.5 rounded-xl border border-border/60 hover:bg-bg-muted transition-colors flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <CheckCircle className="size-4 text-text-muted" />
                      <div>
                        <div className="text-sm font-semibold text-accent">English Vocabulary Quiz #4</div>
                        <div className="text-xs text-text-muted">Due Nov 10</div>
                      </div>
                    </div>
                    <span className="text-xs font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-700">Language</span>
                  </div>
                </div>
              </div>

              {/* Today's Timetable */}
              <div className="p-6 rounded-3xl bg-white border border-border/70 shadow-sm">
                <h3 className="font-display font-bold text-accent text-lg mb-4 flex items-center justify-between">
                  <span>Personalized Timetable</span>
                  <span className="text-xs text-text-muted">Synced with School Hours</span>
                </h3>
                <div className="space-y-3 text-sm">
                  <div className="flex items-start gap-4 p-3 rounded-xl bg-bg-muted">
                    <span className="font-bold text-xs text-primary whitespace-nowrap pt-0.5">04:30 PM</span>
                    <div>
                      <div className="font-semibold text-accent text-xs sm:text-sm">Foundation Mathematics Drill</div>
                      <div className="text-xs text-text-muted">Trigonometry & Spatial Problems</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-4 p-3 rounded-xl bg-bg-muted">
                    <span className="font-bold text-xs text-primary whitespace-nowrap pt-0.5">06:00 PM</span>
                    <div>
                      <div className="font-semibold text-accent text-xs sm:text-sm">Skill Booster: Robotics Code</div>
                      <div className="text-xs text-text-muted">Microcontroller Logic & Sensors</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-4 p-3 rounded-xl bg-bg-muted">
                    <span className="font-bold text-xs text-primary whitespace-nowrap pt-0.5">07:30 PM</span>
                    <div>
                      <div className="font-semibold text-accent text-xs sm:text-sm">Japanese Kaizen Self-Reflection</div>
                      <div className="text-xs text-text-muted">15-minute daily diary logging</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: My Planner (Yearly / Monthly / Daily as requested in doc-3) */}
        {activeTab === "planner" && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-border/70 shadow-sm space-y-6">
            <div className="flex items-center justify-between border-b pb-4">
              <div>
                <h2 className="text-xl font-display font-bold text-accent">Student Roadmap Planner</h2>
                <p className="text-xs text-text-muted">Framework inspired by Japanese Kaizen + Indian Gurukul discipline.</p>
              </div>
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
            </div>

            {plannerView === "daily" && (
              <div className="space-y-4">
                <div className="text-sm font-bold text-accent">Today's Hourly Focus Blocks</div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="p-4 rounded-2xl bg-orange-50 border border-orange-200">
                    <span className="text-xs font-bold text-primary block">BLOCK 1 • 6:30 AM - 7:30 AM</span>
                    <h4 className="font-bold text-sm text-accent mt-1">Deep Academic Sprint</h4>
                    <p className="text-xs text-text-muted mt-1">Reviewing high-difficulty formula derivations before school.</p>
                  </div>
                  <div className="p-4 rounded-2xl bg-blue-50 border border-blue-200">
                    <span className="text-xs font-bold text-blue-600 block">BLOCK 2 • 4:30 PM - 6:00 PM</span>
                    <h4 className="font-bold text-sm text-accent mt-1">Skill Booster Workshop</h4>
                    <p className="text-xs text-text-muted mt-1">Hands-on coding and public speaking practice.</p>
                  </div>
                  <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200">
                    <span className="text-xs font-bold text-emerald-600 block">BLOCK 3 • 8:00 PM - 9:00 PM</span>
                    <h4 className="font-bold text-sm text-accent mt-1">Mentorship Review</h4>
                    <p className="text-xs text-text-muted mt-1">Weekly test corrections with 1:1 guidance.</p>
                  </div>
                </div>
              </div>
            )}

            {plannerView === "monthly" && (
              <div className="space-y-4">
                <div className="text-sm font-bold text-accent">November 2026 Milestone Map</div>
                <div className="space-y-3">
                  <div className="p-4 rounded-xl border border-border/80 flex items-center justify-between">
                    <div>
                      <span className="text-xs font-bold text-primary">WEEK 1</span>
                      <h4 className="font-bold text-sm text-accent">Complete Term Exam Preparation Sprint</h4>
                    </div>
                    <span className="text-xs font-semibold text-success bg-success/10 px-2.5 py-1 rounded-full">
                      Completed
                    </span>
                  </div>
                  <div className="p-4 rounded-xl border border-border/80 flex items-center justify-between">
                    <div>
                      <span className="text-xs font-bold text-primary">WEEK 2</span>
                      <h4 className="font-bold text-sm text-accent">Inter-School Science Project Submission</h4>
                    </div>
                    <span className="text-xs font-semibold text-primary bg-primary/10 px-2.5 py-1 rounded-full">
                      In Progress
                    </span>
                  </div>
                  <div className="p-4 rounded-xl border border-border/80 flex items-center justify-between">
                    <div>
                      <span className="text-xs font-bold text-primary">WEEK 3 & 4</span>
                      <h4 className="font-bold text-sm text-accent">Government Certification Track Module 1</h4>
                    </div>
                    <span className="text-xs font-semibold text-text-muted bg-border/40 px-2.5 py-1 rounded-full">
                      Upcoming
                    </span>
                  </div>
                </div>
              </div>
            )}

            {plannerView === "yearly" && (
              <div className="space-y-4">
                <div className="text-sm font-bold text-accent">10th Standard Academic & Career Blueprint</div>
                <div className="p-5 rounded-2xl bg-bg-muted border border-border/70 space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="size-8 rounded-full bg-primary text-white font-bold flex items-center justify-center text-xs">
                      Q1
                    </div>
                    <div>
                      <h5 className="font-bold text-sm text-accent">Foundation & Diagnostic Phase</h5>
                      <p className="text-xs text-text-muted">PTIROS 360° Career Test + Board Syllabus alignment.</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="size-8 rounded-full bg-primary text-white font-bold flex items-center justify-center text-xs">
                      Q2
                    </div>
                    <div>
                      <h5 className="font-bold text-sm text-accent">Skill Acceleration & Bagless Days</h5>
                      <p className="text-xs text-text-muted">Public speaking, English proficiency (TOEFL/IELTS basics), and hackathons.</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="size-8 rounded-full bg-primary text-white font-bold flex items-center justify-center text-xs">
                      Q3 & Q4
                    </div>
                    <div>
                      <h5 className="font-bold text-sm text-accent">Board Mastery & Stream Finalization</h5>
                      <p className="text-xs text-text-muted">Pre-board mock exams and 11th standard stream blueprint lockdown.</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Tab 3: My Diary (Hansei reflection) */}
        {activeTab === "diary" && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-border/70 shadow-sm space-y-6">
            <div>
              <h2 className="text-xl font-display font-bold text-accent">Student Learning Diary</h2>
              <p className="text-xs text-text-muted">
                Daily reflective journaling as practiced in the Japanese education system (Hansei).
              </p>
            </div>

            <form onSubmit={handleAddDiary} className="space-y-3">
              <textarea
                value={diaryNote}
                onChange={(e) => setDiaryNote(e.target.value)}
                placeholder="What did you learn today? What challenge did you face and how did you overcome it?"
                rows={3}
                className="w-full p-4 rounded-2xl border border-border focus:ring-2 focus:ring-primary focus:outline-none text-sm"
              />
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-primary text-white font-semibold text-xs shadow-md shadow-primary/20 hover:bg-primary-dark transition-all cursor-pointer"
                >
                  Save Daily Entry
                </button>
              </div>
            </form>

            <div className="space-y-4 pt-4 border-t border-border/50">
              <h3 className="font-bold text-sm text-accent">Past Reflections</h3>
              {diaryEntries.map((entry, i) => (
                <div key={i} className="p-4 rounded-2xl bg-bg-muted border border-border/50">
                  <div className="flex justify-between items-center text-xs font-semibold text-text-muted mb-1">
                    <span className="text-primary font-bold">{entry.title}</span>
                    <span>{entry.date}</span>
                  </div>
                  <p className="text-xs sm:text-sm text-accent leading-relaxed">{entry.content}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 4: Career Test Analysis */}
        {activeTab === "analysis" && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-border/70 shadow-sm space-y-6">
            <div className="flex items-center justify-between border-b pb-4">
              <div>
                <h2 className="text-xl font-display font-bold text-accent">Career Test 360° Diagnostic</h2>
                <p className="text-xs text-text-muted">Last evaluated: Nov 06, 2026 • Verified by PTIROS Senior Council</p>
              </div>
              <Link
                href="/career-test"
                className="px-4 py-2 rounded-xl bg-primary/10 text-primary font-bold text-xs hover:bg-primary/20 transition-all"
              >
                View Full Dossier →
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-bg-muted border border-border/60">
                <span className="text-xs font-bold text-primary">PRIMARY STRENGTH</span>
                <h4 className="font-bold text-accent text-base mt-1">High Quantitative & Systems Thinking</h4>
                <p className="text-xs text-text-muted mt-1">Exceptional performance in algorithm building and logic puzzles.</p>
              </div>
              <div className="p-4 rounded-2xl bg-bg-muted border border-border/60">
                <span className="text-xs font-bold text-primary">GROWTH OPPORTUNITY</span>
                <h4 className="font-bold text-accent text-base mt-1">Impromptu Communication</h4>
                <p className="text-xs text-text-muted mt-1">Recommended: 4 sessions of weekly public speaking practice.</p>
              </div>
            </div>
          </div>
        )}

        {/* Tab 5: Courses */}
        {activeTab === "courses" && (
          <div className="space-y-4">
            <h2 className="text-xl font-display font-bold text-accent">Enrolled PTIROS Modules</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-5 rounded-2xl bg-white border border-border/70 shadow-sm">
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-primary/10 text-primary">Active</span>
                <h3 className="font-bold text-base text-accent mt-2">10th Standard Academic Booster</h3>
                <p className="text-xs text-text-muted mt-1">Board examination blueprints, test series, and weekly timetables.</p>
                <div className="mt-4 flex items-center justify-between text-xs font-semibold text-primary">
                  <span>Progress: 68%</span>
                  <Link href="#continue" className="hover:underline">Continue Course →</Link>
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-white border border-border/70 shadow-sm">
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-700">Enrolled</span>
                <h3 className="font-bold text-base text-accent mt-2">Elite Government Certification Track</h3>
                <p className="text-xs text-text-muted mt-1">National skill council recognized computational thinking credential.</p>
                <div className="mt-4 flex items-center justify-between text-xs font-semibold text-primary">
                  <span>Next Exam: Dec 15</span>
                  <Link href="#view" className="hover:underline">View Syllabus →</Link>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 6: Mentors */}
        {activeTab === "mentors" && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-border/70 shadow-sm space-y-6">
            <h2 className="text-xl font-display font-bold text-accent">Assigned Mentors & 1:1 Sessions</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-5 rounded-2xl bg-bg-muted border border-border/60 flex items-center gap-4">
                <div className="size-14 rounded-2xl bg-primary text-white font-bold flex items-center justify-center font-display text-lg">
                  RI
                </div>
                <div>
                  <h4 className="font-bold text-accent">Dr. Rajesh Iyer</h4>
                  <div className="text-xs text-text-muted">Academic Strategy & Science Mentor (IIT Delhi)</div>
                  <button className="mt-2 text-xs font-bold text-primary hover:underline cursor-pointer">
                    Book Next 1:1 Session →
                  </button>
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-bg-muted border border-border/60 flex items-center gap-4">
                <div className="size-14 rounded-2xl bg-secondary text-white font-bold flex items-center justify-center font-display text-lg">
                  PK
                </div>
                <div>
                  <h4 className="font-bold text-accent">Pooja Krishnan</h4>
                  <div className="text-xs text-text-muted">Public Speaking & Soft Skills Coach (Toastmasters)</div>
                  <button className="mt-2 text-xs font-bold text-primary hover:underline cursor-pointer">
                    Book Next 1:1 Session →
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
