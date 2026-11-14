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
} from "lucide-react";
import {
  StudentLead,
  MentorshipSessionRecord,
  PaidDossierOrder,
  AdminMetricsSummary,
  LeadStatus,
  BookingStatus,
} from "@/types/database";

export default function AdminPortalPage() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [pinInput, setPinInput] = useState("");
  const [authError, setAuthError] = useState("");
  const [authLoading, setAuthLoading] = useState(false);

  // Active Tab
  const [activeTab, setActiveTab] = useState<"metrics" | "leads" | "bookings" | "dossiers">("leads");

  // Data States
  const [metrics, setMetrics] = useState<AdminMetricsSummary | null>(null);
  const [leads, setLeads] = useState<StudentLead[]>([]);
  const [bookings, setBookings] = useState<MentorshipSessionRecord[]>([]);
  const [dossiers, setDossiers] = useState<PaidDossierOrder[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(false);

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
      const [metricsRes, leadsRes, bookingsRes, dossiersRes] = await Promise.all([
        fetch("/api/admin/metrics"),
        fetch("/api/leads"),
        fetch("/api/bookings"),
        fetch("/api/dossiers"),
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
        setBookings(b.data || []);
      }
      if (dossiersRes.ok) {
        const d = await dossiersRes.json();
        setDossiers(d.data || []);
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

  const openWhatsAppToParent = (lead: StudentLead) => {
    const parentGreeting = lead.parentName && lead.parentName !== "Parent/Guardian" ? `${lead.parentName} ji` : "Sir/Ma'am";
    const text =
      `Namaste ${parentGreeting}! Greetings from PTIROS Career Mentorship.\n\n` +
      `We noticed that ${lead.studentName} (${lead.grade}, ${lead.schoolName || lead.city}) explored our career simulations for ${lead.parentDream}.\n\n` +
      `We would love to share your personalized 3-page family diagnostic and schedule your complimentary 20-minute strategy call with our academic counselors.\n\n` +
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
                bookings.map((booking) => (
                  <div
                    key={booking.id}
                    className="rounded-2xl border border-stone-200 bg-white p-5 shadow-xs space-y-3.5 hover:border-orange-300 transition"
                  >
                    <div className="flex items-start justify-between">
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
                        value={booking.status}
                        disabled={updatingId === booking.id}
                        onChange={(e) =>
                          handleUpdateBookingStatus(booking.id, e.target.value as BookingStatus, booking.meetingLink)
                        }
                        className={`rounded-lg border px-2.5 py-1 text-xs font-bold capitalize transition cursor-pointer ${
                          booking.status === "pending"
                            ? "border-amber-400 bg-amber-50 text-amber-800"
                            : booking.status === "confirmed"
                            ? "border-blue-400 bg-blue-50 text-blue-800"
                            : booking.status === "completed"
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

                    <div className="rounded-xl bg-stone-50 p-3 text-xs text-stone-700 border border-stone-200/80">
                      <div className="flex items-center gap-2 font-semibold text-stone-900 mb-1">
                        <Clock className="h-3.5 w-3.5 text-orange-600" />
                        <span>{booking.date} at {booking.timeSlot}</span>
                      </div>
                      <p className="text-[11px] text-stone-600 mt-1">
                        <strong>Dilemma: </strong> {booking.primaryQuestion}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <input
                        type="url"
                        placeholder="Paste Google Meet link (e.g. meet.google.com/...)"
                        defaultValue={booking.meetingLink || ""}
                        onBlur={(e) =>
                          handleUpdateBookingStatus(booking.id, booking.status, e.target.value.trim() || undefined)
                        }
                        className="flex-1 rounded-xl border border-stone-200 px-3 py-1.5 text-xs focus:border-orange-500 focus:outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => openWhatsAppToBooking(booking)}
                        className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 px-3 py-1.5 text-xs font-bold text-white shadow-xs hover:bg-emerald-700 active:scale-95 transition cursor-pointer shrink-0"
                        title="Send confirmation & video call link to parent"
                      >
                        <MessageCircle className="h-3.5 w-3.5" />
                        <span>Dispatch WhatsApp</span>
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* ─── TAB 3: PAID DOSSIER ORDERS ─── */}
        {activeTab === "dossiers" && (
          <div className="space-y-4">
            <div className="rounded-2xl border border-stone-200 bg-white p-4 shadow-xs">
              <h3 className="font-bold text-sm text-stone-900 mb-1">
                Full 10-Page Career Dossier Orders (₹499 Early Pioneer Pass)
              </h3>
              <p className="text-xs text-stone-500">
                Track parent requests for comprehensive psychometric dossiers, verify payments, and trigger PDF dispatches.
              </p>
            </div>

            <div className="overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-xs">
              <table className="w-full text-left text-xs text-stone-600">
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
                        <td className="px-4 py-3 font-semibold text-stone-900">{ord.studentName}</td>
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
                          <button
                            type="button"
                            onClick={() => {
                              const text = `Namaste! Regarding your PTIROS 360° Comprehensive 10-Page Career Dossier for ${ord.studentName} (Order: ${ord.id}): Your report is ready for download!`;
                              window.open(`https://wa.me/91${ord.parentPhone}?text=${encodeURIComponent(text)}`, "_blank");
                            }}
                            className="inline-flex items-center gap-1 rounded-xl bg-orange-600 px-3 py-1 text-xs font-semibold text-white hover:bg-orange-700 transition"
                          >
                            <span>Dispatch PDF</span>
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
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
