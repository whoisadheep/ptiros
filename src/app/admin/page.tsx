"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  Users,
  Calendar,
  FileSpreadsheet,
  Lock,
  LogOut,
  TrendingUp,
  Phone,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  Sparkles,
  ExternalLink,
  RefreshCw,
  Video,
  Shield,
  MessageCircle,
  FileText,
  Building,
  GraduationCap,
  BookOpen,
  Plus,
  Trash2,
  Save,
  Target,
  Send,
} from "lucide-react";
import {
  StudentLead,
  MentorshipSessionRecord,
  PaidDossierOrder,
  AdminMetricsSummary,
  LeadStatus,
  BookingStatus,
  AdminStudentSummary,
} from "@/types/database";

const COURSE_CATALOG = [
  {
    courseCode: "ai-robotics",
    title: "AI & Autonomous Robotics Lab",
    category: "Technology & AI",
    description: "ROS2 architecture, sensor fusion, and dual-degree robotics engineering.",
    simulatorUrl: "/simulator?track=ai-robotics",
  },
  {
    courseCode: "corporate-law",
    title: "Corporate Law & Tech M&A",
    category: "Law & Policy",
    description: "CLAT strategy, cross-border tech IP, and corporate policy simulations.",
    simulatorUrl: "/simulator?track=corporate-law",
  },
  {
    courseCode: "ux-design",
    title: "Product & Experience Architecture",
    category: "Design & UX",
    description: "UCEED/NID portfolio building, behavioral UX, and design systems.",
    simulatorUrl: "/simulator?track=ux-design",
  },
  {
    courseCode: "medicine",
    title: "Digital Health & Clinical AI",
    category: "Healthcare",
    description: "NEET clinical roadmap, bio-design, and AI diagnostics.",
    simulatorUrl: "/simulator?track=medicine",
  },
  {
    courseCode: "finance",
    title: "Algorithmic Finance & FinTech",
    category: "Finance & Wealth",
    description: "Quantitative portfolio strategy, math-stats olympiads, and FinTech.",
    simulatorUrl: "/simulator?track=finance",
  },
  {
    courseCode: "media",
    title: "Creative Media & Content Ops",
    category: "Media & PR",
    description: "Storyboarding, viral hook science, and digital brand economics.",
    simulatorUrl: "/simulator?track=media",
  },
];

const ADMIN_TIME_SLOTS = [
  "10:00 AM - 10:20 AM IST",
  "11:30 AM - 11:50 AM IST",
  "03:00 PM - 03:20 PM IST",
  "04:30 PM - 04:50 PM IST",
  "06:00 PM - 06:20 PM IST",
  "07:30 PM - 07:50 PM IST",
];

export default function AdminPortalPage() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [pinInput, setPinInput] = useState("");
  const [authError, setAuthError] = useState("");
  const [authLoading, setAuthLoading] = useState(false);

  // Active Tab
  const [activeTab, setActiveTab] = useState<"metrics" | "leads" | "bookings" | "dossiers" | "students">("leads");

  // Data States
  const [metrics, setMetrics] = useState<AdminMetricsSummary | null>(null);
  const [leads, setLeads] = useState<StudentLead[]>([]);
  const [bookings, setBookings] = useState<MentorshipSessionRecord[]>([]);
  const [dossiers, setDossiers] = useState<PaidDossierOrder[]>([]);
  const [students, setStudents] = useState<AdminStudentSummary[]>([]);
  const [selectedStudentId, setSelectedStudentId] = useState<string>("");
  const [isLoadingData, setIsLoadingData] = useState(false);
  const [syncBanner, setSyncBanner] = useState<string>("");

  // Booking inline edit drafts
  const [bookingDrafts, setBookingDrafts] = useState<
    Record<string, { status: BookingStatus; meetingLink: string; adminNotes: string; date: string; timeSlot: string }>
  >({});

  // Course assignment form state
  const [courseCatalogCode, setCourseCatalogCode] = useState<string>(COURSE_CATALOG[0].courseCode);
  const [customCourseTitle, setCustomCourseTitle] = useState<string>("");
  const [courseNote, setCourseNote] = useState<string>("");
  const [courseDueDate, setCourseDueDate] = useState<string>("");

  // Goal push form state
  const [pushGoalTitle, setPushGoalTitle] = useState<string>("");
  const [pushGoalView, setPushGoalView] = useState<"daily" | "monthly" | "yearly">("daily");
  const [pushGoalDeadline, setPushGoalDeadline] = useState<string>("");

  // Student profile sync edit state
  const [editGrade, setEditGrade] = useState<string>("");
  const [editCurriculum, setEditCurriculum] = useState<string>("");
  const [editParentDream, setEditParentDream] = useState<string>("");

  // Search & Filter
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGrade, setSelectedGrade] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");

  // Status updating state
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  // Check auth status on mount
  useEffect(() => {
    fetch("/api/admin/auth")
      .then((res) => res.json())
      .then((data) => {
        setIsAuthenticated(Boolean(data?.data?.authenticated));
      })
      .catch(() => setIsAuthenticated(false));
  }, []);

  const fetchAllAdminData = useCallback(async () => {
    setIsLoadingData(true);
    try {
      const [metricsRes, leadsRes, bookingsRes, dossiersRes, studentsRes] = await Promise.all([
        fetch("/api/admin/metrics"),
        fetch("/api/leads"),
        fetch("/api/bookings"),
        fetch("/api/dossiers"),
        fetch("/api/admin/students"),
      ]);

      if (metricsRes.ok) {
        const m = await metricsRes.json();
        setMetrics(m.data);
      }
      if (leadsRes.ok) {
        const l = await leadsRes.json();
        setLeads(l.data || []);
      }
      if (bookingsRes.ok) {
        const b = await bookingsRes.json();
        const bList: MentorshipSessionRecord[] = b.data || [];
        setBookings(bList);
        const drafts: Record<
          string,
          { status: BookingStatus; meetingLink: string; adminNotes: string; date: string; timeSlot: string }
        > = {};
        for (const item of bList) {
          drafts[item.id] = {
            status: item.status,
            meetingLink: item.meetingLink || "",
            adminNotes: item.adminNotes || "",
            date: item.date,
            timeSlot: item.timeSlot,
          };
        }
        setBookingDrafts(drafts);
      }
      if (dossiersRes.ok) {
        const d = await dossiersRes.json();
        setDossiers(d.data || []);
      }
      if (studentsRes.ok) {
        const s = await studentsRes.json();
        const list: AdminStudentSummary[] = s.data || [];
        setStudents(list);
        setSelectedStudentId((prev) => (prev && list.some((st) => st.id === prev) ? prev : list[0]?.id || ""));
      }
    } catch (err) {
      console.error("Failed to fetch admin data:", err);
    } finally {
      setIsLoadingData(false);
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      fetchAllAdminData();
    }
  }, [isAuthenticated, fetchAllAdminData]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthLoading(true);
    setAuthError("");

    try {
      const res = await fetch("/api/admin/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pin: pinInput }),
      });
      const data = await res.json();

      if (res.ok && data?.data?.authenticated) {
        setIsAuthenticated(true);
      } else {
        setAuthError(data?.error || "Incorrect Admin PIN / Secret");
      }
    } catch {
      setAuthError("Network error while connecting to security gate");
    } finally {
      setAuthLoading(false);
    }
  };

  const handleLogout = async () => {
    await fetch("/api/admin/auth", { method: "DELETE" });
    setIsAuthenticated(false);
    setPinInput("");
  };

  const handleUpdateLeadStatus = async (leadId: string, newStatus: LeadStatus) => {
    setUpdatingId(leadId);
    try {
      const res = await fetch("/api/leads", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: leadId, status: newStatus }),
      });
      if (res.ok) {
        setLeads((prev) => prev.map((l) => (l.id === leadId ? { ...l, status: newStatus } : l)));
      }
    } catch (err) {
      console.error("Error updating lead status:", err);
    } finally {
      setUpdatingId(null);
    }
  };

  const showSyncNotice = (msg: string) => {
    setSyncBanner(msg);
    setTimeout(() => setSyncBanner((cur) => (cur === msg ? "" : cur)), 4000);
  };

  const selectedStudent = students.find((s) => s.id === selectedStudentId) || students[0] || null;

  useEffect(() => {
    if (selectedStudent) {
      setEditGrade(selectedStudent.grade || "Class 10");
      setEditCurriculum(selectedStudent.curriculum || "CBSE");
      setEditParentDream(selectedStudent.parentDream || "");
    }
  }, [selectedStudent?.id]);

  const handleSaveBookingSync = async (bookingId: string) => {
    const draft = bookingDrafts[bookingId];
    if (!draft) return;
    setUpdatingId(bookingId);
    try {
      const res = await fetch(`/api/bookings/${bookingId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: draft.status,
          meetingLink: draft.meetingLink.trim(),
          adminNotes: draft.adminNotes.trim(),
          date: draft.date,
          timeSlot: draft.timeSlot,
        }),
      });
      if (res.ok) {
        const json = await res.json();
        const updated = json.data as MentorshipSessionRecord;
        setBookings((prev) => prev.map((b) => (b.id === bookingId ? updated : b)));
        showSyncNotice(`Synced meeting ${updated.studentName} (${updated.status}) to student portal.`);
        await fetchAllAdminData();
      }
    } catch (err) {
      console.error("Error syncing booking:", err);
    } finally {
      setUpdatingId(null);
    }
  };

  const handleAssignCourse = async (userId: string) => {
    const catalogItem = COURSE_CATALOG.find((c) => c.courseCode === courseCatalogCode);
    const title = customCourseTitle.trim() || catalogItem?.title || "Custom Study Module";
    const courseCode = customCourseTitle.trim()
      ? `custom-${Date.now().toString(36)}`
      : catalogItem?.courseCode || "custom";

    setUpdatingId(`course_${userId}`);
    try {
      const res = await fetch("/api/admin/courses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          courseCode,
          title,
          category: catalogItem?.category || "Mentorship Track",
          description: catalogItem?.description,
          simulatorUrl: customCourseTitle.trim() ? "/simulator" : catalogItem?.simulatorUrl,
          mentorNote: courseNote.trim() || undefined,
          dueDate: courseDueDate || undefined,
        }),
      });
      if (res.ok) {
        setCustomCourseTitle("");
        setCourseNote("");
        setCourseDueDate("");
        showSyncNotice(`Assigned "${title}" to student portal.`);
        await fetchAllAdminData();
      }
    } catch (err) {
      console.error("Error assigning course:", err);
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDeleteCourse = async (courseId: string) => {
    setUpdatingId(courseId);
    try {
      const res = await fetch(`/api/admin/courses?id=${encodeURIComponent(courseId)}`, {
        method: "DELETE",
      });
      if (res.ok) {
        showSyncNotice("Removed course assignment from student portal.");
        await fetchAllAdminData();
      }
    } catch (err) {
      console.error("Error removing course:", err);
    } finally {
      setUpdatingId(null);
    }
  };

  const handlePushGoal = async (userId: string) => {
    if (!pushGoalTitle.trim()) return;
    setUpdatingId(`goal_${userId}`);
    try {
      const res = await fetch("/api/admin/goals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          title: pushGoalTitle.trim(),
          timeView: pushGoalView,
          deadline: pushGoalDeadline || undefined,
        }),
      });
      if (res.ok) {
        setPushGoalTitle("");
        setPushGoalDeadline("");
        showSyncNotice("Pushed milestone to student's Weekly/Action Planner.");
        await fetchAllAdminData();
      }
    } catch (err) {
      console.error("Error pushing goal:", err);
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDeleteAdminGoal = async (userId: string, goalId: string) => {
    setUpdatingId(goalId);
    try {
      const res = await fetch(
        `/api/admin/goals?userId=${encodeURIComponent(userId)}&goalId=${encodeURIComponent(goalId)}`,
        { method: "DELETE" }
      );
      if (res.ok) {
        showSyncNotice("Removed milestone from student planner.");
        await fetchAllAdminData();
      }
    } catch (err) {
      console.error("Error deleting goal:", err);
    } finally {
      setUpdatingId(null);
    }
  };

  const handleSyncStudentProfile = async (userId: string) => {
    setUpdatingId(`profile_${userId}`);
    try {
      const res = await fetch("/api/admin/students", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          grade: editGrade,
          curriculum: editCurriculum,
          parentDream: editParentDream.trim(),
        }),
      });
      if (res.ok) {
        showSyncNotice("Updated student profile & target trajectory.");
        await fetchAllAdminData();
      }
    } catch (err) {
      console.error("Error updating student profile:", err);
    } finally {
      setUpdatingId(null);
    }
  };

  const handleUpdateBookingStatus = async (
    bookingId: string,
    newStatus: BookingStatus,
    meetingLink?: string
  ) => {
    setUpdatingId(bookingId);
    try {
      const res = await fetch(`/api/bookings/${bookingId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus, meetingLink }),
      });
      if (res.ok) {
        setBookings((prev) =>
          prev.map((b) => (b.id === bookingId ? { ...b, status: newStatus, meetingLink } : b))
        );
      }
    } catch (err) {
      console.error("Error updating booking status:", err);
    } finally {
      setUpdatingId(null);
    }
  };

  const handleUpdateDossierStatus = async (
    orderId: string,
    newStatus: PaidDossierOrder["status"]
  ) => {
    setUpdatingId(orderId);
    try {
      const res = await fetch(`/api/admin/dossiers/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        setDossiers((prev) =>
          prev.map((d) => (d.id === orderId ? { ...d, status: newStatus } : d))
        );
      }
    } catch (err) {
      console.error("Error updating dossier order status:", err);
    } finally {
      setUpdatingId(null);
    }
  };

  const openWhatsAppToParent = (lead: StudentLead) => {
    const parentGreeting = lead.parentName && lead.parentName !== "Parent/Guardian" ? `${lead.parentName} ji` : "Sir/Ma'am";
    const text =
      `Namaste ${parentGreeting}! Greetings from PTIROS Career Mentorship.\n\n` +
      `We noticed that ${lead.studentName} (${lead.grade}, ${lead.schoolName || lead.city}) explored our career simulations for ${lead.parentDream}.\n\n` +
      `We would love to share your personalized 4-page family diagnostic and schedule your complimentary 20-minute strategy call with our academic counselors.\n\n` +
      `When would be a good time to connect today?`;

    window.open(`https://wa.me/91${lead.parentPhone}?text=${encodeURIComponent(text)}`, "_blank");
  };

  const openWhatsAppToBooking = (booking: MentorshipSessionRecord) => {
    const text =
      `*PTIROS 1-on-1 Mentorship Confirmation*\n\n` +
      `Student: ${booking.studentName}\n` +
      `Designated Mentor: ${booking.mentorName} (${booking.domainTitle})\n` +
      `Scheduled Date: ${booking.date} at ${booking.timeSlot}\n` +
      (booking.meetingLink ? `Video Link: ${booking.meetingLink}\n\n` : `\n`) +
      `Our mentor is looking forward to addressing your core dilemma: "${booking.primaryQuestion}".\n\n` +
      `Please let us know if you need to reschedule or have any questions.`;

    window.open(`https://wa.me/91${booking.parentPhone}?text=${encodeURIComponent(text)}`, "_blank");
  };

  // Filtered Leads
  const filteredLeads = leads.filter((l) => {
    const matchesSearch =
      l.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.parentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.parentPhone.includes(searchQuery) ||
      (l.schoolName && l.schoolName.toLowerCase().includes(searchQuery.toLowerCase())) ||
      l.city.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesGrade = selectedGrade === "all" || l.grade === selectedGrade;
    const matchesStatus = selectedStatus === "all" || l.status === selectedStatus;
    return matchesSearch && matchesGrade && matchesStatus;
  });

  // 1. Loading State
  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen bg-stone-900 flex items-center justify-center text-stone-300">
        <div className="flex items-center gap-3">
          <RefreshCw className="h-5 w-5 animate-spin text-orange-500" />
          <span>Verifying security credentials...</span>
        </div>
      </div>
    );
  }

  // 2. Authentication Gate Screen
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-stone-950 via-stone-900 to-amber-950 flex items-center justify-center p-4 text-stone-100">
        <div className="w-full max-w-md rounded-3xl border border-stone-800 bg-stone-900/90 p-8 shadow-2xl backdrop-blur-xl">
          <div className="text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-600/10 text-orange-500 border border-orange-500/20 shadow-inner">
              <Shield className="h-7 w-7" />
            </div>
            <h1 className="mt-4 font-display text-2xl font-black tracking-tight text-white">
              PTIROS Admin Console
            </h1>
            <p className="mt-1 text-xs text-stone-400">
              Operations CRM, Mentorship Queue & Lead Management
            </p>
          </div>

          <form onSubmit={handleLogin} className="mt-6 space-y-4">
            <div>
              <label htmlFor="admin-pin" className="block text-xs font-semibold uppercase tracking-wider text-stone-400 mb-1.5">
                Admin Secret Key / Passcode
              </label>
              <div className="relative">
                <input
                  id="admin-pin"
                  type="password"
                  required
                  placeholder="Enter administrator passkey..."
                  value={pinInput}
                  onChange={(e) => {
                    setPinInput(e.target.value);
                    if (authError) setAuthError("");
                  }}
                  className="w-full rounded-xl border border-stone-700 bg-stone-800/80 px-4 py-3 text-sm text-white placeholder-stone-500 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20"
                />
                <Lock className="absolute right-3.5 top-3.5 h-4 w-4 text-stone-500" />
              </div>
              {authError && <p className="mt-2 text-xs text-red-400">{authError}</p>}
            </div>

            <button
              type="submit"
              disabled={authLoading}
              className="w-full rounded-xl bg-gradient-to-r from-orange-600 to-amber-600 py-3 text-sm font-bold text-white shadow-lg shadow-orange-950/40 hover:brightness-105 active:scale-[0.98] transition cursor-pointer disabled:opacity-50"
            >
              {authLoading ? "Authenticating..." : "Unlock Admin CRM →"}
            </button>
          </form>

          <div className="mt-6 border-t border-stone-800 pt-4 text-center">
            <Link href="/" className="text-xs text-stone-400 hover:text-orange-400 transition">
              ← Return to PTIROS Student Platform
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // 3. Authenticated Admin Dashboard
  return (
    <div className="min-h-screen bg-stone-100 text-stone-900 font-sans">
      {/* Top Header Bar */}
      <header className="sticky top-0 z-40 border-b border-stone-200 bg-white/95 backdrop-blur-md shadow-xs">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3.5 sm:px-6">
          <div className="flex items-center gap-3">
            <Link href="/" className="font-display text-xl font-black text-orange-600 tracking-tight">
              PTIROS
            </Link>
            <span className="rounded-md bg-stone-900 px-2 py-0.5 text-[11px] font-bold uppercase tracking-wider text-white">
              Admin CRM
            </span>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={fetchAllAdminData}
              disabled={isLoadingData}
              className="flex items-center gap-1.5 rounded-xl border border-stone-200 bg-stone-50 px-3 py-1.5 text-xs font-semibold text-stone-700 hover:bg-stone-100 transition cursor-pointer"
              title="Refresh Records"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${isLoadingData ? "animate-spin text-orange-600" : ""}`} />
              <span className="hidden sm:inline">Refresh</span>
            </button>

            <a
              href="/api/admin/export"
              download
              className="flex items-center gap-1.5 rounded-xl bg-emerald-600 px-3.5 py-1.5 text-xs font-bold text-white shadow-xs hover:bg-emerald-700 active:scale-95 transition"
              title="Export all leads as CSV for Excel / Google Sheets"
            >
              <FileSpreadsheet className="h-3.5 w-3.5" />
              <span>Export CSV</span>
            </a>

            <button
              type="button"
              onClick={handleLogout}
              className="flex items-center gap-1.5 rounded-xl border border-stone-200 bg-white px-3 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-50 transition cursor-pointer"
            >
              <LogOut className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Exit</span>
            </button>
          </div>
        </div>

        {/* Navigation Tabs Bar */}
        <div className="mx-auto flex max-w-7xl gap-1 overflow-x-auto px-4 sm:px-6 border-t border-stone-100 text-xs font-semibold">
          <button
            type="button"
            onClick={() => setActiveTab("leads")}
            className={`flex items-center gap-2 border-b-2 px-4 py-3 transition cursor-pointer whitespace-nowrap ${
              activeTab === "leads"
                ? "border-orange-600 text-orange-600 bg-orange-50/50"
                : "border-transparent text-stone-600 hover:text-stone-900"
            }`}
          >
            <Users className="h-4 w-4" />
            <span>Student & Parent Leads ({leads.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("bookings")}
            className={`flex items-center gap-2 border-b-2 px-4 py-3 transition cursor-pointer whitespace-nowrap ${
              activeTab === "bookings"
                ? "border-orange-600 text-orange-600 bg-orange-50/50"
                : "border-transparent text-stone-600 hover:text-stone-900"
            }`}
          >
            <Calendar className="h-4 w-4" />
            <span>Mentorship Sessions ({bookings.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("dossiers")}
            className={`flex items-center gap-2 border-b-2 px-4 py-3 transition cursor-pointer whitespace-nowrap ${
              activeTab === "dossiers"
                ? "border-orange-600 text-orange-600 bg-orange-50/50"
                : "border-transparent text-stone-600 hover:text-stone-900"
            }`}
          >
            <FileText className="h-4 w-4" />
            <span>Paid Dossier Orders ({dossiers.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("students")}
            className={`flex items-center gap-2 border-b-2 px-4 py-3 transition cursor-pointer whitespace-nowrap ${
              activeTab === "students"
                ? "border-orange-600 text-orange-600 bg-orange-50/50"
                : "border-transparent text-stone-600 hover:text-stone-900"
            }`}
          >
            <BookOpen className="h-4 w-4" />
            <span>Students &amp; Courses ({students.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("metrics")}
            className={`flex items-center gap-2 border-b-2 px-4 py-3 transition cursor-pointer whitespace-nowrap ${
              activeTab === "metrics"
                ? "border-orange-600 text-orange-600 bg-orange-50/50"
                : "border-transparent text-stone-600 hover:text-stone-900"
            }`}
          >
            <TrendingUp className="h-4 w-4" />
            <span>Analytics & KPIs</span>
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="mx-auto max-w-7xl p-4 sm:p-6 space-y-6">
        {syncBanner && (
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-xs font-bold text-emerald-800 flex items-center gap-2 shadow-xs">
            <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
            <span>{syncBanner}</span>
          </div>
        )}
        {/* KPI Mini-Row (Always visible) */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="rounded-2xl border border-stone-200 bg-white p-4 shadow-xs">
            <span className="text-[11px] font-bold uppercase tracking-wider text-stone-500">Total Leads</span>
            <div className="mt-1 text-2xl font-black text-stone-900">{leads.length}</div>
            <p className="text-[10px] text-stone-400 mt-0.5">Students registered</p>
          </div>

          <div className="rounded-2xl border border-stone-200 bg-white p-4 shadow-xs">
            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700">Parent WhatsApps</span>
            <div className="mt-1 text-2xl font-black text-emerald-600">
              {new Set(leads.map((l) => l.parentPhone)).size}
            </div>
            <p className="text-[10px] text-stone-400 mt-0.5">Verified Indian contacts</p>
          </div>

          <div className="rounded-2xl border border-stone-200 bg-white p-4 shadow-xs">
            <span className="text-[11px] font-bold uppercase tracking-wider text-amber-700">Mentor Bookings</span>
            <div className="mt-1 text-2xl font-black text-amber-600">{bookings.length}</div>
            <p className="text-[10px] text-stone-400 mt-0.5">
              {bookings.filter((b) => b.status === "pending").length} awaiting confirmation
            </p>
          </div>

          <div className="rounded-2xl border border-stone-200 bg-white p-4 shadow-xs">
            <span className="text-[11px] font-bold uppercase tracking-wider text-orange-700">Paid Tier Orders</span>
            <div className="mt-1 text-2xl font-black text-orange-600">{dossiers.length}</div>
            <p className="text-[10px] text-stone-400 mt-0.5">
              ₹{dossiers.filter((d) => d.status === "paid" || d.status === "pdf_dispatched").length * 499} Revenue
            </p>
          </div>
        </div>

        {/* ─── TAB 1: LEADS CRM ─── */}
        {activeTab === "leads" && (
          <div className="space-y-4">
            {/* Filter Bar */}
            <div className="flex flex-col sm:flex-row gap-3 items-center justify-between rounded-2xl bg-white p-3.5 border border-stone-200 shadow-xs">
              <div className="relative w-full sm:w-80">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-stone-400" />
                <input
                  type="text"
                  placeholder="Search student, parent, school, city, phone..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-xl border border-stone-200 pl-9 pr-4 py-1.5 text-xs focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500/20"
                />
              </div>

              <div className="flex gap-2 w-full sm:w-auto">
                <select
                  value={selectedGrade}
                  onChange={(e) => setSelectedGrade(e.target.value)}
                  className="rounded-xl border border-stone-200 bg-stone-50 px-3 py-1.5 text-xs font-medium text-stone-700 focus:outline-none"
                >
                  <option value="all">All Grades</option>
                  <option value="Class 6">Class 6</option>
                  <option value="Class 7">Class 7</option>
                  <option value="Class 8">Class 8</option>
                  <option value="Class 9">Class 9</option>
                  <option value="Class 10">Class 10</option>
                  <option value="Class 11">Class 11</option>
                  <option value="Class 12">Class 12</option>
                  <option value="Dropper / UG 1st Yr">Dropper / UG 1st</option>
                </select>

                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="rounded-xl border border-stone-200 bg-stone-50 px-3 py-1.5 text-xs font-medium text-stone-700 focus:outline-none"
                >
                  <option value="all">All Statuses</option>
                  <option value="new">New</option>
                  <option value="contacted">Contacted</option>
                  <option value="enrolled">Enrolled</option>
                  <option value="archived">Archived</option>
                </select>
              </div>
            </div>

            {/* Leads Table */}
            <div className="overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-stone-600">
                  <thead className="border-b border-stone-200 bg-stone-50 text-[11px] font-bold uppercase tracking-wider text-stone-500">
                    <tr>
                      <th className="px-4 py-3">Student & School</th>
                      <th className="px-4 py-3">Grade & Curriculum</th>
                      <th className="px-4 py-3">Parent Details</th>
                      <th className="px-4 py-3">Parent Aspiration</th>
                      <th className="px-4 py-3">Status</th>
                      <th className="px-4 py-3 text-right">Quick WhatsApp Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100">
                    {filteredLeads.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="px-4 py-8 text-center text-stone-400">
                          No student leads match the filter criteria.
                        </td>
                      </tr>
                    ) : (
                      filteredLeads.map((lead) => (
                        <tr key={lead.id} className="hover:bg-stone-50/70 transition">
                          <td className="px-4 py-3">
                            <div className="font-bold text-stone-900">{lead.studentName}</div>
                            <div className="text-[11px] text-stone-400 flex items-center gap-1 mt-0.5">
                              <Building className="h-3 w-3" />
                              <span>{lead.schoolName || "School Unspecified"}</span> • <span>{lead.city}</span>
                            </div>
                          </td>

                          <td className="px-4 py-3">
                            <span className="inline-block rounded-md bg-stone-100 px-2 py-0.5 font-semibold text-stone-800">
                              {lead.grade}
                            </span>
                            <span className="ml-1 text-[11px] text-stone-400">{lead.curriculum}</span>
                          </td>

                          <td className="px-4 py-3">
                            <div className="font-medium text-stone-900">{lead.parentName}</div>
                            <div className="text-[11px] text-emerald-700 font-semibold font-mono mt-0.5">
                              +91 {lead.parentPhone}
                            </div>
                          </td>

                          <td className="px-4 py-3 max-w-xs">
                            <p className="truncate text-stone-700" title={lead.parentDream}>
                              {lead.parentDream}
                            </p>
                            <span className="text-[10px] text-stone-400">
                              Source: {lead.source.replace("_", " ")}
                            </span>
                          </td>

                          <td className="px-4 py-3">
                            <select
                              value={lead.status}
                              disabled={updatingId === lead.id}
                              onChange={(e) => handleUpdateLeadStatus(lead.id, e.target.value as LeadStatus)}
                              className={`rounded-lg border px-2 py-1 text-[11px] font-bold capitalize transition cursor-pointer ${
                                lead.status === "new"
                                  ? "border-blue-300 bg-blue-50 text-blue-700"
                                  : lead.status === "contacted"
                                  ? "border-amber-300 bg-amber-50 text-amber-700"
                                  : lead.status === "enrolled"
                                  ? "border-emerald-300 bg-emerald-50 text-emerald-700"
                                  : "border-stone-200 bg-stone-100 text-stone-600"
                              }`}
                            >
                              <option value="new">New</option>
                              <option value="contacted">Contacted</option>
                              <option value="enrolled">Enrolled</option>
                              <option value="archived">Archived</option>
                            </select>
                          </td>

                          <td className="px-4 py-3 text-right">
                            <button
                              type="button"
                              onClick={() => openWhatsAppToParent(lead)}
                              className="inline-flex items-center gap-1 rounded-xl bg-emerald-600 px-3 py-1.5 text-xs font-bold text-white shadow-xs hover:bg-emerald-700 active:scale-95 transition cursor-pointer"
                              title="Message parent directly on WhatsApp with student report"
                            >
                              <MessageCircle className="h-3.5 w-3.5" />
                              <span>WhatsApp Lead</span>
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ─── TAB 2: MENTORSHIP SESSIONS ─── */}
        {activeTab === "bookings" && (
          <div className="space-y-4">
            <div className="rounded-2xl border border-stone-200 bg-white p-4 shadow-xs">
              <h3 className="font-bold text-sm text-stone-900 mb-1">
                1-on-1 Gurukul Mentorship Dispatch Desk
              </h3>
              <p className="text-xs text-stone-500">
                Review incoming 20-minute counseling session requests, attach Google Meet links, and notify parents on WhatsApp.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {bookings.length === 0 ? (
                <div className="col-span-2 rounded-2xl border border-stone-200 bg-white p-8 text-center text-stone-400 text-xs">
                  No mentorship sessions currently scheduled.
                </div>
              ) : (
                bookings.map((booking) => {
                  const draft = bookingDrafts[booking.id] || {
                    status: booking.status,
                    meetingLink: booking.meetingLink || "",
                    adminNotes: booking.adminNotes || "",
                    date: booking.date,
                    timeSlot: booking.timeSlot,
                  };
                  return (
                  <div
                    key={booking.id}
                    className="rounded-2xl border border-stone-200 bg-white p-5 shadow-xs space-y-3.5 hover:border-orange-300 transition"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <span className="rounded-md bg-amber-100 px-2 py-0.5 text-[10px] font-bold text-amber-900 uppercase">
                          {booking.domainTitle}
                        </span>
                        <h4 className="mt-1 font-bold text-base text-stone-900">
                          {booking.mentorName}
                        </h4>
                        <p className="text-xs text-stone-500">
                          Student: <span className="font-semibold text-stone-800">{booking.studentName}</span> • +91 {booking.parentPhone}
                        </p>
                      </div>

                      <select
                        value={draft.status}
                        disabled={updatingId === booking.id}
                        onChange={(e) => {
                          const nextStatus = e.target.value as BookingStatus;
                          setBookingDrafts((prev) => ({
                            ...prev,
                            [booking.id]: { ...draft, status: nextStatus },
                          }));
                          handleUpdateBookingStatus(booking.id, nextStatus, draft.meetingLink || undefined);
                        }}
                        className={`rounded-lg border px-2.5 py-1 text-xs font-bold capitalize transition cursor-pointer ${
                          draft.status === "pending"
                            ? "border-amber-400 bg-amber-50 text-amber-800"
                            : draft.status === "confirmed"
                            ? "border-blue-400 bg-blue-50 text-blue-800"
                            : draft.status === "completed"
                            ? "border-emerald-400 bg-emerald-50 text-emerald-800"
                            : "border-stone-300 bg-stone-100 text-stone-600"
                        }`}
                      >
                        <option value="pending">Pending</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="completed">Completed</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </div>

                    <div className="rounded-xl bg-stone-50 p-3 text-xs text-stone-700 border border-stone-200/80 space-y-2">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        <div>
                          <label className="block text-[10px] font-bold uppercase text-stone-400 mb-0.5">Date</label>
                          <input
                            type="date"
                            value={draft.date}
                            onChange={(e) =>
                              setBookingDrafts((prev) => ({
                                ...prev,
                                [booking.id]: { ...draft, date: e.target.value },
                              }))
                            }
                            className="w-full rounded-lg border border-stone-200 bg-white px-2.5 py-1 text-xs font-semibold text-stone-800"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold uppercase text-stone-400 mb-0.5">Slot (IST)</label>
                          <select
                            value={draft.timeSlot}
                            onChange={(e) =>
                              setBookingDrafts((prev) => ({
                                ...prev,
                                [booking.id]: { ...draft, timeSlot: e.target.value },
                              }))
                            }
                            className="w-full rounded-lg border border-stone-200 bg-white px-2 py-1 text-xs font-semibold text-stone-800"
                          >
                            {ADMIN_TIME_SLOTS.map((s) => (
                              <option key={s} value={s}>{s}</option>
                            ))}
                          </select>
                        </div>
                      </div>
                      <p className="text-[11px] text-stone-600 pt-1">
                        <strong>Dilemma: </strong> {booking.primaryQuestion}
                      </p>
                    </div>

                    <div className="space-y-2">
                      <input
                        type="url"
                        placeholder="Paste Google Meet link (e.g. https://meet.google.com/...)"
                        value={draft.meetingLink}
                        onChange={(e) =>
                          setBookingDrafts((prev) => ({
                            ...prev,
                            [booking.id]: { ...draft, meetingLink: e.target.value },
                          }))
                        }
                        className="w-full rounded-xl border border-stone-200 px-3 py-2 text-xs focus:border-orange-500 focus:outline-none"
                      />
                      <textarea
                        rows={2}
                        placeholder="Mentor Action Notes / Debrief (synced live to Student Dashboard & Track Booking)..."
                        value={draft.adminNotes}
                        onChange={(e) =>
                          setBookingDrafts((prev) => ({
                            ...prev,
                            [booking.id]: { ...draft, adminNotes: e.target.value },
                          }))
                        }
                        className="w-full rounded-xl border border-stone-200 px-3 py-2 text-xs focus:border-orange-500 focus:outline-none"
                      />
                    </div>

                    <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                      <button
                        type="button"
                        disabled={updatingId === booking.id}
                        onClick={() => handleSaveBookingSync(booking.id)}
                        className="inline-flex items-center gap-1.5 rounded-xl bg-stone-900 px-3.5 py-2 text-xs font-bold text-white hover:bg-black transition cursor-pointer disabled:opacity-50"
                      >
                        <Save className="h-3.5 w-3.5 text-orange-400" />
                        <span>{updatingId === booking.id ? "Syncing..." : "Save & Sync to Student"}</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => openWhatsAppToBooking(booking)}
                        className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-emerald-600 px-3 py-2 text-xs font-bold text-white shadow-xs hover:bg-emerald-700 active:scale-95 transition cursor-pointer shrink-0"
                        title="Send confirmation & video call link to parent"
                      >
                        <MessageCircle className="h-3.5 w-3.5" />
                        <span>Dispatch WhatsApp</span>
                      </button>
                    </div>
                  </div>
                  );
                })
              )}
            </div>
          </div>
        )}

        {/* ─── TAB 3: PAID DOSSIER ORDERS ─── */}
        {activeTab === "dossiers" && (
          <div className="space-y-4">
            <div className="rounded-2xl border border-stone-200 bg-white p-4 shadow-xs">
              <h3 className="font-bold text-sm text-stone-900 mb-1">
                Full 9-Page Career Dossier Orders (₹499 Early Pioneer Pass)
              </h3>
              <p className="text-xs text-stone-500">
                Track parent requests for comprehensive psychometric dossiers, verify payments, and trigger PDF dispatches.
              </p>
            </div>

            <div className="overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-xs">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[640px] text-left text-xs text-stone-600">
                <thead className="border-b border-stone-200 bg-stone-50 text-[11px] font-bold uppercase tracking-wider text-stone-500">
                  <tr>
                    <th className="px-4 py-3">Order Ref</th>
                    <th className="px-4 py-3">Student Name</th>
                    <th className="px-4 py-3">Parent WhatsApp</th>
                    <th className="px-4 py-3">Amount</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {dossiers.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-4 py-8 text-center text-stone-400">
                        No paid dossier unlock orders placed yet.
                      </td>
                    </tr>
                  ) : (
                    dossiers.map((ord) => (
                      <tr key={ord.id} className="hover:bg-stone-50/70 transition">
                        <td className="px-4 py-3 font-mono font-bold text-stone-800">{ord.id}</td>
                        <td className="px-4 py-3">
                          <div className="font-semibold text-stone-900">{ord.studentName}</div>
                          {ord.topTrackTitle && (
                            <div className="text-[11px] text-stone-500">{ord.topTrackTitle}</div>
                          )}
                        </td>
                        <td className="px-4 py-3 font-mono text-emerald-700 font-semibold">+91 {ord.parentPhone}</td>
                        <td className="px-4 py-3 font-bold text-stone-900">₹{ord.amount}</td>
                        <td className="px-4 py-3">
                          <span
                            className={`inline-block rounded-md px-2 py-0.5 text-[10px] font-bold uppercase ${
                              ord.status === "paid" || ord.status === "pdf_dispatched"
                                ? "bg-emerald-100 text-emerald-800"
                                : "bg-amber-100 text-amber-800"
                            }`}
                          >
                            {ord.status.replace("_", " ")}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-right">
                          <div className="flex items-center justify-end gap-2">
                            {ord.status === "payment_pending" && (
                              <button
                                type="button"
                                disabled={updatingId === ord.id}
                                onClick={() => handleUpdateDossierStatus(ord.id, "paid")}
                                className="inline-flex items-center gap-1 rounded-xl bg-emerald-700 px-3 py-1 text-xs font-semibold text-white hover:bg-emerald-800 transition cursor-pointer disabled:opacity-60"
                              >
                                <span>Approve &amp; Unlock PDF</span>
                              </button>
                            )}
                            {ord.status === "paid" && (
                              <button
                                type="button"
                                disabled={updatingId === ord.id}
                                onClick={() => handleUpdateDossierStatus(ord.id, "pdf_dispatched")}
                                className="inline-flex items-center gap-1 rounded-xl bg-stone-800 px-3 py-1 text-xs font-semibold text-white hover:bg-stone-900 transition cursor-pointer disabled:opacity-60"
                              >
                                <span>Mark Dispatched</span>
                              </button>
                            )}
                            <button
                              type="button"
                              onClick={() => {
                                const text = `Namaste! Regarding your PTIROS 360° Complete 9-Page Career Dossier for ${ord.studentName} (Order: ${ord.id}): Your report is unlocked and ready for download in your Student Portal!`;
                                window.open(`https://wa.me/91${ord.parentPhone}?text=${encodeURIComponent(text)}`, "_blank");
                              }}
                              className="inline-flex items-center gap-1 rounded-xl bg-orange-600 px-3 py-1 text-xs font-semibold text-white hover:bg-orange-700 transition cursor-pointer"
                            >
                              <span>WhatsApp</span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
              </div>
            </div>
          </div>
        )}

        {/* ─── TAB 5: STUDENTS & COURSES SYNC ─── */}
        {activeTab === "students" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left Column: Registered Students Roster */}
            <div className="lg:col-span-4 rounded-2xl border border-stone-200 bg-white p-4 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-sm text-stone-900">Registered Students ({students.length})</h3>
                <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-orange-100 text-orange-800">
                  Live Sync
                </span>
              </div>

              <div className="space-y-2 max-h-[620px] overflow-y-auto pr-1">
                {students.length === 0 ? (
                  <p className="text-xs text-stone-400 py-8 text-center">No registered student accounts yet.</p>
                ) : (
                  students.map((st) => {
                    const isSelected = selectedStudent?.id === st.id;
                    return (
                      <button
                        key={st.id}
                        type="button"
                        onClick={() => setSelectedStudentId(st.id)}
                        className={`w-full text-left p-3 rounded-xl border transition cursor-pointer ${
                          isSelected
                            ? "border-orange-500 bg-orange-50/70 ring-1 ring-orange-400/30"
                            : "border-stone-200 bg-stone-50/40 hover:bg-stone-50"
                        }`}
                      >
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-xs font-bold text-stone-900 truncate">{st.name}</span>
                          <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-white border border-stone-200 text-stone-600 shrink-0">
                            {st.grade}
                          </span>
                        </div>
                        <p className="text-[11px] text-stone-500 truncate mt-0.5">{st.email}</p>
                        <div className="flex flex-wrap gap-1.5 mt-2 text-[10px] font-semibold text-stone-600">
                          <span className="px-1.5 py-0.5 rounded bg-stone-100">{st.assignedCoursesCount} Courses</span>
                          <span className="px-1.5 py-0.5 rounded bg-stone-100">{st.goalsCount} Goals</span>
                          <span className="px-1.5 py-0.5 rounded bg-stone-100">{st.bookingsCount} Calls</span>
                        </div>
                      </button>
                    );
                  })
                )}
              </div>
            </div>

            {/* Right Column: Selected Student Sync Workspace */}
            <div className="lg:col-span-8 space-y-5">
              {!selectedStudent ? (
                <div className="rounded-2xl border border-stone-200 bg-white p-10 text-center text-xs text-stone-400">
                  Select a student on the left to sync courses, milestones, and profile targets.
                </div>
              ) : (
                <>
                  {/* 1. Profile & Target Sync */}
                  <div className="rounded-2xl border border-stone-200 bg-white p-5 shadow-xs space-y-4">
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-stone-100 pb-3">
                      <div>
                        <h3 className="font-bold text-base text-stone-900">{selectedStudent.name}</h3>
                        <p className="text-xs text-stone-500">
                          {selectedStudent.email} • {selectedStudent.city} {selectedStudent.aparId ? `• APAAR: ${selectedStudent.aparId}` : ""}
                        </p>
                      </div>
                      <button
                        type="button"
                        disabled={updatingId === `profile_${selectedStudent.id}`}
                        onClick={() => handleSyncStudentProfile(selectedStudent.id)}
                        className="inline-flex items-center gap-1.5 rounded-xl bg-stone-900 px-3.5 py-2 text-xs font-bold text-white hover:bg-black transition cursor-pointer disabled:opacity-50"
                      >
                        <Save className="h-3.5 w-3.5 text-orange-400" />
                        <span>Sync Profile</span>
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                      <div>
                        <label className="block text-[10px] font-bold uppercase text-stone-400 mb-1">Grade</label>
                        <input
                          type="text"
                          value={editGrade}
                          onChange={(e) => setEditGrade(e.target.value)}
                          className="w-full rounded-xl border border-stone-200 px-3 py-2 text-xs"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold uppercase text-stone-400 mb-1">Curriculum</label>
                        <input
                          type="text"
                          value={editCurriculum}
                          onChange={(e) => setEditCurriculum(e.target.value)}
                          className="w-full rounded-xl border border-stone-200 px-3 py-2 text-xs"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold uppercase text-stone-400 mb-1">Target Trajectory / Dream</label>
                        <input
                          type="text"
                          value={editParentDream}
                          onChange={(e) => setEditParentDream(e.target.value)}
                          placeholder="e.g. IIT CS / AIIMS"
                          className="w-full rounded-xl border border-stone-200 px-3 py-2 text-xs"
                        />
                      </div>
                    </div>
                  </div>

                  {/* 2. Assign Courses & Tracks */}
                  <div className="rounded-2xl border border-stone-200 bg-white p-5 shadow-xs space-y-4">
                    <h4 className="font-bold text-sm text-stone-900 flex items-center gap-2">
                      <BookOpen className="h-4 w-4 text-orange-600" />
                      <span>Assign Course / Experiential Lab to Student</span>
                    </h4>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                      <div>
                        <label className="block text-[10px] font-bold uppercase text-stone-400 mb-1">PTIROS Course Track</label>
                        <select
                          value={courseCatalogCode}
                          onChange={(e) => setCourseCatalogCode(e.target.value)}
                          className="w-full rounded-xl border border-stone-200 bg-white px-3 py-2 text-xs font-semibold"
                        >
                          {COURSE_CATALOG.map((c) => (
                            <option key={c.courseCode} value={c.courseCode}>
                              {c.title} ({c.category})
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold uppercase text-stone-400 mb-1">Or Custom Course Title</label>
                        <input
                          type="text"
                          value={customCourseTitle}
                          onChange={(e) => setCustomCourseTitle(e.target.value)}
                          placeholder="Optional custom module title"
                          className="w-full rounded-xl border border-stone-200 px-3 py-2 text-xs"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold uppercase text-stone-400 mb-1">Mentor Note</label>
                        <input
                          type="text"
                          value={courseNote}
                          onChange={(e) => setCourseNote(e.target.value)}
                          placeholder="e.g. Complete before Friday mentor call"
                          className="w-full rounded-xl border border-stone-200 px-3 py-2 text-xs"
                        />
                      </div>
                      <div className="flex items-end gap-2">
                        <div className="flex-1">
                          <label className="block text-[10px] font-bold uppercase text-stone-400 mb-1">Target Date</label>
                          <input
                            type="date"
                            value={courseDueDate}
                            onChange={(e) => setCourseDueDate(e.target.value)}
                            className="w-full rounded-xl border border-stone-200 px-3 py-2 text-xs"
                          />
                        </div>
                        <button
                          type="button"
                          disabled={updatingId === `course_${selectedStudent.id}`}
                          onClick={() => handleAssignCourse(selectedStudent.id)}
                          className="inline-flex items-center gap-1.5 rounded-xl bg-orange-600 px-4 py-2 text-xs font-bold text-white hover:bg-orange-700 transition cursor-pointer shrink-0 disabled:opacity-50"
                        >
                          <Plus className="h-3.5 w-3.5" />
                          <span>Assign Course</span>
                        </button>
                      </div>
                    </div>

                    <div className="space-y-2 pt-2 border-t border-stone-100">
                      {selectedStudent.assignedCourses.length === 0 ? (
                        <p className="text-xs text-stone-400 py-3 text-center">No courses assigned to this student yet.</p>
                      ) : (
                        selectedStudent.assignedCourses.map((c) => (
                          <div
                            key={c.id}
                            className="flex items-center justify-between gap-3 p-3 rounded-xl bg-stone-50 border border-stone-200/80 text-xs"
                          >
                            <div className="min-w-0">
                              <div className="flex items-center gap-2">
                                <span className="font-bold text-stone-900 truncate">{c.title}</span>
                                <span
                                  className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                                    c.status === "completed"
                                      ? "bg-emerald-100 text-emerald-800"
                                      : c.status === "in_progress"
                                      ? "bg-blue-100 text-blue-800"
                                      : "bg-amber-100 text-amber-800"
                                  }`}
                                >
                                  {c.status.replace("_", " ")}
                                </span>
                              </div>
                              {c.mentorNote && <p className="text-[11px] text-stone-600 mt-0.5">{c.mentorNote}</p>}
                            </div>
                            <button
                              type="button"
                              onClick={() => handleDeleteCourse(c.id)}
                              className="p-1.5 rounded-lg text-stone-400 hover:text-red-600 hover:bg-red-50 transition cursor-pointer shrink-0"
                              title="Remove course"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        ))
                      )}
                    </div>
                  </div>

                  {/* 3. Push Action Milestones / Goals */}
                  <div className="rounded-2xl border border-stone-200 bg-white p-5 shadow-xs space-y-4">
                    <h4 className="font-bold text-sm text-stone-900 flex items-center gap-2">
                      <Target className="h-4 w-4 text-orange-600" />
                      <span>Push Study Milestone to Student Planner</span>
                    </h4>

                    <div className="grid grid-cols-1 sm:grid-cols-12 gap-2 text-xs">
                      <input
                        type="text"
                        value={pushGoalTitle}
                        onChange={(e) => setPushGoalTitle(e.target.value)}
                        placeholder="e.g. Solve 25 JEE Physics rotational mechanics problems"
                        className="sm:col-span-6 rounded-xl border border-stone-200 px-3 py-2 text-xs"
                      />
                      <select
                        value={pushGoalView}
                        onChange={(e) => setPushGoalView(e.target.value as "daily" | "monthly" | "yearly")}
                        className="sm:col-span-2 rounded-xl border border-stone-200 bg-white px-2.5 py-2 text-xs font-semibold"
                      >
                        <option value="daily">Weekly/Daily</option>
                        <option value="monthly">Monthly</option>
                        <option value="yearly">Yearly</option>
                      </select>
                      <input
                        type="text"
                        value={pushGoalDeadline}
                        onChange={(e) => setPushGoalDeadline(e.target.value)}
                        placeholder="Deadline (e.g. Fri)"
                        className="sm:col-span-2 rounded-xl border border-stone-200 px-2.5 py-2 text-xs"
                      />
                      <button
                        type="button"
                        disabled={updatingId === `goal_${selectedStudent.id}`}
                        onClick={() => handlePushGoal(selectedStudent.id)}
                        className="sm:col-span-2 inline-flex items-center justify-center gap-1 rounded-xl bg-stone-900 px-3 py-2 text-xs font-bold text-white hover:bg-black transition cursor-pointer disabled:opacity-50"
                      >
                        <Send className="h-3.5 w-3.5 text-orange-400" />
                        <span>Push</span>
                      </button>
                    </div>

                    <div className="space-y-2 pt-2 border-t border-stone-100">
                      {selectedStudent.goals.length === 0 ? (
                        <p className="text-xs text-stone-400 py-3 text-center">No planner milestones for this student yet.</p>
                      ) : (
                        selectedStudent.goals.map((g) => (
                          <div
                            key={g.id}
                            className="flex items-center justify-between gap-3 p-2.5 rounded-xl bg-stone-50 border border-stone-200/80 text-xs"
                          >
                            <div className="min-w-0 flex items-center gap-2">
                              <span
                                className={`size-2 rounded-full shrink-0 ${
                                  g.completed ? "bg-emerald-500" : "bg-amber-500"
                                }`}
                              />
                              <span className={`font-semibold truncate ${g.completed ? "line-through text-stone-400" : "text-stone-800"}`}>
                                {g.title}
                              </span>
                              <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded bg-white border border-stone-200 text-stone-500">
                                {g.timeView}
                              </span>
                            </div>
                            <button
                              type="button"
                              onClick={() => handleDeleteAdminGoal(selectedStudent.id, g.id)}
                              className="p-1 rounded-lg text-stone-400 hover:text-red-600 hover:bg-red-50 transition cursor-pointer shrink-0"
                              title="Remove milestone"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        {/* ─── TAB 4: METRICS & KPIS ─── */}
        {activeTab === "metrics" && metrics && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Grade Distribution */}
              <div className="rounded-2xl border border-stone-200 bg-white p-5 shadow-xs">
                <h4 className="font-bold text-sm text-stone-900 mb-3 flex items-center gap-2">
                  <GraduationCap className="h-4 w-4 text-orange-600" />
                  <span>Student Distribution by Grade</span>
                </h4>
                <div className="space-y-2">
                  {Object.entries(metrics.gradeDistribution).map(([grade, count]) => {
                    const percent = Math.round((count / (metrics.totalLeads || 1)) * 100);
                    return (
                      <div key={grade} className="space-y-1">
                        <div className="flex justify-between text-xs">
                          <span className="font-medium text-stone-700">{grade}</span>
                          <span className="font-bold text-stone-900">{count} ({percent}%)</span>
                        </div>
                        <div className="h-2 rounded-full bg-stone-100 overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-orange-500 to-amber-500 rounded-full"
                            style={{ width: `${percent}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Track Interests */}
              <div className="rounded-2xl border border-stone-200 bg-white p-5 shadow-xs">
                <h4 className="font-bold text-sm text-stone-900 mb-3 flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-amber-600" />
                  <span>Mentorship Domain Inquiries</span>
                </h4>
                <div className="space-y-2">
                  {Object.keys(metrics.trackDistribution).length === 0 ? (
                    <p className="text-xs text-stone-400 py-4 text-center">No domain bookings logged yet.</p>
                  ) : (
                    Object.entries(metrics.trackDistribution).map(([track, count]) => (
                      <div key={track} className="flex items-center justify-between p-2 rounded-xl bg-stone-50 text-xs">
                        <span className="font-semibold text-stone-800">{track}</span>
                        <span className="font-bold bg-white px-2 py-0.5 rounded-md border border-stone-200 text-stone-900">
                          {count} session(s)
                        </span>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
