"use client";

import React, { Suspense } from "react";
import Link from "next/link";
import {
  Calendar,
  Clock,
  Video,
  CheckCircle2,
  Clock3,
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  ExternalLink,
  MessageSquare,
  Sparkles,
  ShieldCheck,
  RefreshCw,
  Compass,
  Download,
  Lock,
  UserPlus,
  Plus,
} from "lucide-react";
import { Blobatar } from "@blobatar/react";
import PtiroMascot from "@/components/PtiroMascot";
import { useStudentAuth } from "@/context/StudentAuthContext";
import { useUserProfile } from "@/context/UserProfileContext";
import { MentorshipSessionRecord, BookingStatus } from "@/types/database";

function TrackBookingContent() {
  const { user, bookings, isLoggedIn, isLoading, openAuthModal, refresh } = useStudentAuth();
  const { openBookingModal } = useUserProfile();

  const getStatusBadge = (status: BookingStatus) => {
    switch (status) {
      case "pending":
        return {
          label: "Pending Council Review",
          bg: "bg-amber-100 text-amber-900 border-amber-300",
          icon: Clock3,
        };
      case "confirmed":
        return {
          label: "Session Confirmed",
          bg: "bg-emerald-100 text-emerald-900 border-emerald-300",
          icon: CheckCircle2,
        };
      case "completed":
        return {
          label: "Session Completed",
          bg: "bg-blue-100 text-blue-900 border-blue-300",
          icon: ShieldCheck,
        };
      case "cancelled":
        return {
          label: "Cancelled / Rescheduled",
          bg: "bg-stone-100 text-stone-700 border-stone-300",
          icon: AlertCircle,
        };
      default:
        return {
          label: "Processing",
          bg: "bg-stone-100 text-stone-700 border-stone-300",
          icon: Clock3,
        };
    }
  };

  const getProgressStep = (status: BookingStatus, hasMeetingLink: boolean) => {
    if (status === "completed") return 4;
    if (status === "confirmed" && hasMeetingLink) return 3;
    if (status === "confirmed") return 2;
    if (status === "pending") return 1;
    return 1;
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
        `UID:${Date.now()}@ptiros.in`,
        `DTSTAMP:${formatICS(new Date())}`,
        `DTSTART:${formatICS(start)}`,
        `DTEND:${formatICS(end)}`,
        `SUMMARY:1-on-1 PTIROS Gurukul Session: ${b.mentorName}`,
        `DESCRIPTION:Mentor: ${b.mentorName} (${b.domainTitle})\\nStudent: ${b.studentName}\\nPlatform: https://ptiros.in`,
        "LOCATION:Google Meet",
        "STATUS:CONFIRMED",
        "END:VEVENT",
        "END:VCALENDAR",
      ].join("\r\n");
      const blob = new Blob([icsContent], { type: "text/calendar;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `PTIROS-Mentorship-${b.date}.ics`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.warn("Could not download .ics:", err);
    }
  };

  return (
    <div className="min-h-screen bg-[#FFFBF5] text-[#1A1A2E] font-body selection:bg-orange-500 selection:text-white">
      {/* Top Header */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-stone-200/80 shadow-2xs">
        <div className="max-w-6xl mx-auto px-3 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <Link
              href="/"
              className="flex items-center gap-1.5 text-xs font-bold text-stone-600 hover:text-stone-900 hover:bg-stone-100 px-2 sm:px-2.5 py-1.5 rounded-xl transition shrink-0"
            >
              <ArrowLeft className="size-4 shrink-0" />
              <span className="hidden sm:inline">Back to Home</span>
              <span className="sm:hidden">Home</span>
            </Link>
            <span className="h-4 w-px bg-stone-200 hidden sm:inline-block" />
            <Link href="/" className="flex items-center gap-2 min-w-0">
              <span className="font-display text-lg sm:text-xl font-black tracking-tight text-gradient">
                PTIROS
              </span>
              <span className="hidden sm:inline-block text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-orange-100 text-orange-800 whitespace-nowrap">
                My Meetings
              </span>
            </Link>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <Link
              href="/dashboard"
              className="flex items-center gap-1.5 text-xs font-bold text-stone-700 hover:text-primary transition px-2.5 py-1.5 rounded-xl hover:bg-orange-50/70"
            >
              <Compass className="size-4 text-primary shrink-0" />
              <span className="hidden sm:inline">Student Portal</span>
              <span className="sm:hidden">Portal</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-6 sm:space-y-8">
        {/* Hero Banner */}
        <div className="rounded-3xl bg-white border border-orange-200 p-5 sm:p-8 shadow-sm flex flex-col sm:flex-row items-center gap-6">
          <div className="shrink-0">
            <PtiroMascot variant="copilot" size={80} showSpeech={false} />
          </div>
          <div className="space-y-2 text-center sm:text-left min-w-0 flex-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-100 text-orange-800 text-xs font-bold">
              <Sparkles className="size-3.5 text-primary" />
              1-on-1 Gurukul Schedule & Status
            </div>
            <h1 className="text-2xl sm:text-3xl font-display font-black text-stone-900 tracking-tight">
              My Scheduled Mentorship Meetings
            </h1>
            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed max-w-xl">
              View live confirmation status, upcoming mentor calls, and Google Meet links linked directly to your PTIROS Student Account.
            </p>
          </div>
        </div>

        {/* Auth Gate: First Login, Then Meeting */}
        {isLoading ? (
          <div className="rounded-3xl bg-white border border-stone-200 p-12 text-center space-y-3">
            <RefreshCw className="size-8 text-primary animate-spin mx-auto" />
            <p className="text-sm font-semibold text-stone-700">Verifying student session...</p>
          </div>
        ) : !isLoggedIn || !user ? (
          <div className="rounded-3xl bg-white border border-orange-200 p-6 sm:p-10 text-center space-y-5 shadow-sm">
            <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-orange-100 text-orange-700">
              <Lock className="size-7" />
            </div>
            <div className="space-y-1.5 max-w-md mx-auto">
              <span className="inline-block rounded-full bg-orange-100 px-3 py-0.5 text-[11px] font-bold text-orange-800">
                Sign In Required
              </span>
              <h2 className="text-xl sm:text-2xl font-display font-extrabold text-stone-900">
                First Sign In to View or Book Meetings
              </h2>
              <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                All 1-on-1 mentorship appointments and Google Meet rooms are tied securely to your student account—no reference codes needed.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 max-w-md mx-auto pt-1">
              <button
                type="button"
                onClick={() => openAuthModal("login")}
                className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 text-xs sm:text-sm font-bold text-white shadow-md shadow-primary/20 hover:bg-primary-dark transition cursor-pointer"
              >
                <span>Sign In to My Account</span>
                <ArrowRight className="size-4" />
              </button>
              <button
                type="button"
                onClick={() => openAuthModal("signup")}
                className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl border border-stone-300 bg-stone-50 px-5 py-3 text-xs sm:text-sm font-bold text-stone-800 hover:bg-stone-100 transition cursor-pointer"
              >
                <UserPlus className="size-4 text-primary" />
                <span>Create Student Account</span>
              </button>
            </div>
          </div>
        ) : bookings.length > 0 ? (
          <div className="space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 className="text-base font-bold text-stone-900 flex items-center gap-2">
                <span>Scheduled Sessions for {user.name}</span>
                <span className="size-5 rounded-full bg-orange-100 text-primary text-xs font-bold flex items-center justify-center">
                  {bookings.length}
                </span>
              </h2>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => refresh()}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-stone-200 bg-white px-3 py-1.5 text-xs font-semibold text-stone-600 hover:bg-stone-50 transition cursor-pointer"
                >
                  <RefreshCw className="size-3.5" />
                  <span>Sync Status</span>
                </button>
                <button
                  type="button"
                  onClick={() => openBookingModal()}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-3.5 py-1.5 text-xs font-bold text-white hover:bg-primary-dark transition cursor-pointer"
                >
                  <Plus className="size-3.5" />
                  <span>Book 1:1 Call</span>
                </button>
              </div>
            </div>

            {bookings.map((b) => {
              const badge = getStatusBadge(b.status);
              const BadgeIcon = badge.icon;
              const step = getProgressStep(b.status, !!b.meetingLink);

              return (
                <div
                  key={b.id}
                  className="rounded-3xl bg-white border border-orange-200/90 p-5 sm:p-8 shadow-sm space-y-6 hover:border-orange-300 transition"
                >
                  {/* Top Bar: Mentor + Status Badge */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-stone-100">
                    <div className="flex items-center gap-3.5">
                      <div className="size-14 rounded-2xl overflow-hidden bg-stone-100 border border-orange-200 shadow-xs flex items-center justify-center shrink-0">
                        <Blobatar name={b.mentorName} size={56} animate="hover" className="size-full object-cover" />
                      </div>
                      <div>
                        <h3 className="font-display font-bold text-lg text-stone-900">
                          {b.mentorName}
                        </h3>
                        <p className="text-xs font-semibold text-orange-700">{b.domainTitle}</p>
                        <p className="text-[11px] text-stone-500">
                          Student: <strong>{b.studentName}</strong>
                        </p>
                      </div>
                    </div>

                    <div className="shrink-0">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-bold ${badge.bg}`}>
                        <BadgeIcon className="size-4 shrink-0" />
                        <span>{badge.label}</span>
                      </span>
                    </div>
                  </div>

                  {/* 4-Step Visual Progress Stepper */}
                  <div className="py-2">
                    <p className="text-xs font-bold text-stone-700 mb-3 uppercase tracking-wider">
                      Appointment Journey Progress
                    </p>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
                      <div className={`p-3 rounded-2xl border text-left transition ${
                        step >= 1 ? "bg-emerald-50 border-emerald-300 text-emerald-950" : "bg-stone-50 border-stone-200 text-stone-400"
                      }`}>
                        <div className="flex items-center gap-1.5 text-xs font-bold">
                          <span className={`size-4 rounded-full flex items-center justify-center text-[10px] text-white ${
                            step >= 1 ? "bg-emerald-600" : "bg-stone-300"
                          }`}>1</span>
                          <span>Slot Requested</span>
                        </div>
                        <p className="text-[10px] text-stone-500 mt-1">Submitted & logged</p>
                      </div>

                      <div className={`p-3 rounded-2xl border text-left transition ${
                        step >= 2 ? "bg-emerald-50 border-emerald-300 text-emerald-950" : step === 1 ? "bg-amber-50 border-amber-300 text-amber-950 animate-pulse" : "bg-stone-50 border-stone-200 text-stone-400"
                      }`}>
                        <div className="flex items-center gap-1.5 text-xs font-bold">
                          <span className={`size-4 rounded-full flex items-center justify-center text-[10px] text-white ${
                            step >= 2 ? "bg-emerald-600" : step === 1 ? "bg-amber-500" : "bg-stone-300"
                          }`}>2</span>
                          <span>Council Review</span>
                        </div>
                        <p className="text-[10px] text-stone-500 mt-1">
                          {step >= 2 ? "Mentor paired" : "Under review"}
                        </p>
                      </div>

                      <div className={`p-3 rounded-2xl border text-left transition ${
                        step >= 3 ? "bg-emerald-50 border-emerald-300 text-emerald-950" : "bg-stone-50 border-stone-200 text-stone-400"
                      }`}>
                        <div className="flex items-center gap-1.5 text-xs font-bold">
                          <span className={`size-4 rounded-full flex items-center justify-center text-[10px] text-white ${
                            step >= 3 ? "bg-emerald-600" : "bg-stone-300"
                          }`}>3</span>
                          <span>Meet Link Ready</span>
                        </div>
                        <p className="text-[10px] text-stone-500 mt-1">
                          {b.meetingLink ? "Ready to join" : "Issuing shortly"}
                        </p>
                      </div>

                      <div className={`p-3 rounded-2xl border text-left transition ${
                        step >= 4 ? "bg-blue-50 border-blue-300 text-blue-950" : "bg-stone-50 border-stone-200 text-stone-400"
                      }`}>
                        <div className="flex items-center gap-1.5 text-xs font-bold">
                          <span className={`size-4 rounded-full flex items-center justify-center text-[10px] text-white ${
                            step >= 4 ? "bg-blue-600" : "bg-stone-300"
                          }`}>4</span>
                          <span>Debrief & Action</span>
                        </div>
                        <p className="text-[10px] text-stone-500 mt-1">
                          {step >= 4 ? "Completed" : "Post-session notes"}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Details Card */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-stone-50 rounded-2xl p-4 border border-stone-200/80 text-xs">
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2 text-stone-700 font-semibold">
                        <Calendar className="size-4 text-primary" />
                        <span>Scheduled Date: <strong>{b.date}</strong></span>
                      </div>
                      <div className="flex items-center gap-2 text-stone-700 font-semibold">
                        <Clock className="size-4 text-primary" />
                        <span>Slot: <strong>{b.timeSlot}</strong></span>
                      </div>
                      <div className="text-stone-500 pt-1">
                        Phone: <strong>+91 {b.parentPhone}</strong> (WhatsApp updates enabled)
                      </div>
                    </div>

                    <div className="space-y-1 border-t sm:border-t-0 sm:border-l border-stone-200/80 pt-2 sm:pt-0 sm:pl-4">
                      <p className="text-stone-500 font-semibold">Primary Question / Focus:</p>
                      <p className="text-stone-800 leading-relaxed italic bg-white p-2.5 rounded-xl border border-stone-200/60">
                        &ldquo;{b.primaryQuestion}&rdquo;
                      </p>
                    </div>
                  </div>

                  {/* Google Meet Room & Actions */}
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
                    {b.meetingLink ? (
                      <a
                        href={b.meetingLink.startsWith("http") ? b.meetingLink : `https://${b.meetingLink}`}
                        target="_blank"
                        rel="noreferrer"
                        className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition active:scale-95 cursor-pointer"
                      >
                        <Video className="size-4" />
                        <span>Join Google Meet Call Now</span>
                        <ExternalLink className="size-3.5" />
                      </a>
                    ) : (
                      <div className="flex items-center gap-2 text-xs text-amber-800 bg-amber-50 px-4 py-2.5 rounded-2xl border border-amber-200">
                        <Clock3 className="size-4 text-amber-600 shrink-0" />
                        <span>Video link will appear here and on WhatsApp before the call.</span>
                      </div>
                    )}

                    <div className="grid grid-cols-2 sm:flex sm:flex-wrap items-center gap-2 w-full sm:w-auto">
                      <a
                        href={`https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(
                          `1-on-1 PTIROS Gurukul Session: ${b.mentorName}`
                        )}&details=${encodeURIComponent(
                          `Mentor: ${b.mentorName}\nStudent: ${b.studentName}\nPlatform: https://ptiros.in`
                        )}&location=Google+Meet`}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl border border-stone-200 bg-white hover:bg-stone-50 text-stone-700 font-semibold text-xs shadow-2xs transition"
                        title="Add to Google Calendar"
                      >
                        <Calendar className="size-3.5 text-stone-500" />
                        <span>Google Cal</span>
                      </a>
                      <button
                        type="button"
                        onClick={() => downloadIcs(b)}
                        className="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl border border-stone-200 bg-white hover:bg-stone-50 text-stone-700 font-semibold text-xs shadow-2xs transition cursor-pointer"
                        title="Download .ics for Apple Calendar & Outlook"
                      >
                        <Download className="size-3.5 text-stone-500" />
                        <span>.ICS File</span>
                      </button>
                      <a
                        href={`https://api.whatsapp.com/send?phone=919876543210&text=${encodeURIComponent(
                          `Hi PTIROS Coordinator, I am checking on ${b.studentName}'s mentorship session with ${b.mentorName} scheduled for ${b.date} at ${b.timeSlot}. Please assist me with meeting details.`
                        )}`}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl border border-stone-300 bg-white hover:bg-stone-50 text-stone-700 font-bold text-xs shadow-2xs transition active:scale-95"
                      >
                        <MessageSquare className="size-3.5 text-emerald-600" />
                        <span>WhatsApp</span>
                      </a>
                      <Link
                        href="/dashboard?tab=mentorship"
                        className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl bg-stone-900 hover:bg-stone-800 text-white font-bold text-xs shadow-xs transition active:scale-95"
                      >
                        <Compass className="size-3.5" />
                        <span>Dashboard</span>
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="rounded-3xl bg-white border border-stone-200 p-8 sm:p-12 text-center space-y-4">
            <div className="size-16 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center mx-auto">
              <Calendar className="size-8" />
            </div>
            <div className="space-y-1">
              <h3 className="text-xl font-bold text-stone-900">No Scheduled Mentorship Meetings Yet</h3>
              <p className="text-xs sm:text-sm text-stone-600 max-w-md mx-auto">
                Your student account ({user.name}) currently has no booked 1-on-1 consultations. Pick a mentor and time slot to get started.
              </p>
            </div>
            <div className="pt-2 flex flex-wrap justify-center gap-3">
              <button
                type="button"
                onClick={() => openBookingModal()}
                className="px-5 py-2.5 rounded-full bg-primary hover:bg-primary-dark text-white font-bold text-xs transition cursor-pointer"
              >
                Book a 1:1 Session Now
              </button>
              <Link
                href="/dashboard?tab=mentorship"
                className="px-5 py-2.5 rounded-full border border-stone-300 bg-white hover:bg-stone-50 text-stone-800 font-bold text-xs transition"
              >
                Go to Dashboard Mentorship Tab
              </Link>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default function TrackBookingPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#FFFBF5] flex items-center justify-center">
          <div className="text-center space-y-3">
            <div className="size-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-xs text-stone-500 font-semibold">Loading My Meetings...</p>
          </div>
        </div>
      }
    >
      <TrackBookingContent />
    </Suspense>
  );
}
