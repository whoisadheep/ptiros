"use client";

import React, { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Blobatar } from "@blobatar/react";
import {
  ArrowLeft,
  ArrowRight,
  Calendar,
  CalendarDays,
  CheckCircle2,
  Clock,
  Compass,
  Download,
  FileText,
  Loader2,
  Lock,
  MessageSquare,
  ShieldCheck,
  Sparkles,
  Star,
  UserPlus,
  Users,
  Video,
  AlertCircle,
} from "lucide-react";
import PtiroMascot from "@/components/PtiroMascot";
import { MENTORS } from "@/data/mentors";
import { useStudentAuth } from "@/context/StudentAuthContext";
import { validateIndianMobile } from "@/lib/storage";
import { Mentor, MentorshipBooking } from "@/types/profile";

const TIME_SLOTS = [
  "10:00 AM - 10:20 AM IST",
  "11:30 AM - 11:50 AM IST",
  "03:00 PM - 03:20 PM IST",
  "04:30 PM - 04:50 PM IST",
  "06:00 PM - 06:20 PM IST",
  "07:30 PM - 07:50 PM IST",
];

const DILEMMA_SUGGESTIONS = [
  "Stream selection after Class 10 (PCM vs PCB vs Commerce/Law)",
  "Balancing board exams with JEE / NEET / CLAT / UCEED prep",
  "Building an authentic portfolio & Olympiad roadmap",
  "Aligning student passion with parent expectations",
];

interface FormErrors {
  date?: string;
  slot?: string;
  studentName?: string;
  parentPhone?: string;
  primaryQuestion?: string;
  general?: string;
}

function getTodayStr() {
  return new Date().toISOString().split("T")[0];
}

function getTomorrowStr() {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  return d.toISOString().split("T")[0];
}

function BookMentorshipContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const {
    user,
    isLoggedIn,
    isLoading: isAuthLoading,
    openAuthModal,
    refresh: refreshStudentAuth,
  } = useStudentAuth();

  const [selectedMentor, setSelectedMentor] = useState<Mentor>(MENTORS[0]);
  const [selectedDate, setSelectedDate] = useState<string>(getTomorrowStr);
  const [selectedSlot, setSelectedSlot] = useState<string>(TIME_SLOTS[1]);
  const [studentName, setStudentName] = useState<string>("");
  const [parentPhone, setParentPhone] = useState<string>("");
  const [primaryQuestion, setPrimaryQuestion] = useState<string>("");
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingConfirmed, setBookingConfirmed] = useState<MentorshipBooking | null>(null);

  // Preselect mentor from query param (?track=... or ?mentor=...)
  useEffect(() => {
    const param = searchParams.get("track") || searchParams.get("mentor");
    if (!param) return;
    const match = MENTORS.find(
      (m) =>
        m.id === param ||
        m.domainId === param ||
        (param === "medicine" && m.domainId === "digital-health-medicine") ||
        (param === "ux-design" && m.domainId === "product-ux") ||
        (param === "finance" && m.domainId === "quant-finance") ||
        (param === "media" && m.domainId === "media-creative-tech")
    );
    if (match) setSelectedMentor(match);
  }, [searchParams]);

  // Autofill student details when logged in
  useEffect(() => {
    if (user) {
      setStudentName((prev) => prev || user.name || "");
      setParentPhone((prev) => prev || user.parentPhone || "");
    }
  }, [user]);

  const validateForm = (): { valid: boolean; normalizedPhone: string } => {
    const nextErrors: FormErrors = {};
    const today = getTodayStr();

    if (!selectedDate) {
      nextErrors.date = "Please choose a preferred date for your session.";
    } else if (selectedDate < today) {
      nextErrors.date = "Please select today or a future date.";
    }

    if (!selectedSlot) {
      nextErrors.slot = "Please select a 20-minute time slot.";
    }

    const trimmedName = studentName.trim();
    if (!trimmedName || trimmedName.length < 2) {
      nextErrors.studentName = "Please enter the student's full name (at least 2 characters).";
    }

    const phoneVal = validateIndianMobile(parentPhone);
    if (!phoneVal.isValid) {
      nextErrors.parentPhone = "Enter a valid 10-digit Indian WhatsApp number (e.g. 9876543210).";
    }

    const trimmedQuestion = primaryQuestion.trim();
    if (!trimmedQuestion || trimmedQuestion.length < 10) {
      nextErrors.primaryQuestion =
        "Please describe your main career question or dilemma (at least 10 characters) so your mentor can prepare.";
    }

    setErrors(nextErrors);
    return {
      valid: Object.keys(nextErrors).length === 0,
      normalizedPhone: phoneVal.normalized,
    };
  };

  const handleBookSession = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoggedIn || !user) {
      openAuthModal("login");
      return;
    }

    const { valid, normalizedPhone } = validateForm();
    if (!valid) return;

    setIsSubmitting(true);
    setErrors({});

    const bookingPayload = {
      mentorId: selectedMentor.id,
      mentorName: selectedMentor.name,
      domainTitle: selectedMentor.domainTitle,
      date: selectedDate,
      timeSlot: selectedSlot,
      studentName: studentName.trim(),
      parentPhone: normalizedPhone,
      primaryQuestion: primaryQuestion.trim(),
      createdAt: new Date().toISOString(),
    };

    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bookingPayload),
      });

      if (res.status === 401) {
        openAuthModal("login");
        setIsSubmitting(false);
        return;
      }

      if (res.status === 409) {
        setErrors({
          slot: "This time slot was just reserved with this mentor. Please pick another slot or date.",
          general: "Slot unavailable — please choose another time or date.",
        });
        setIsSubmitting(false);
        return;
      }

      if (!res.ok) {
        const errJson = await res.json().catch(() => ({}));
        setErrors({
          general: errJson.error || "Failed to schedule your mentorship call. Please try again.",
        });
        setIsSubmitting(false);
        return;
      }

      const json = await res.json();
      const confirmedData: MentorshipBooking = json.data || bookingPayload;

      try {
        await refreshStudentAuth();
      } catch {}

      setBookingConfirmed(confirmedData);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      console.error("Booking submission error:", err);
      setErrors({ general: "Network error while scheduling. Please check your connection and retry." });
    } finally {
      setIsSubmitting(false);
    }
  };

  const generateGoogleCalendarUrl = (booking: MentorshipBooking) => {
    const [timeStr] = booking.timeSlot.split(" - ");
    const isPM = timeStr.includes("PM");
    const [rawHour, rawMinute] = timeStr.replace(/[^0-9:]/g, "").split(":");
    let hour = parseInt(rawHour, 10);
    if (isPM && hour !== 12) hour += 12;
    if (!isPM && hour === 12) hour = 0;

    const start = new Date(`${booking.date}T${String(hour).padStart(2, "0")}:${rawMinute || "00"}:00+05:30`);
    const end = new Date(start.getTime() + 20 * 60 * 1000);
    const formatGCal = (d: Date) => d.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";

    const title = encodeURIComponent(`1-on-1 PTIROS Gurukul Strategy Call: ${booking.mentorName}`);
    const details = encodeURIComponent(
      `Mentor: ${booking.mentorName} (${booking.domainTitle})\n` +
        `Student: ${booking.studentName}\n` +
        `Core Dilemma: ${booking.primaryQuestion}\n` +
        `Platform: Verified PTIROS Gurukul Session (https://ptiros.vercel.app)`
    );

    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${formatGCal(start)}/${formatGCal(end)}&details=${details}&location=Google+Meet`;
  };

  const downloadIcsCalendar = (booking: MentorshipBooking) => {
    try {
      const [timeStr] = booking.timeSlot.split(" - ");
      const isPM = timeStr.includes("PM");
      const [rawHour, rawMinute] = timeStr.replace(/[^0-9:]/g, "").split(":");
      let hour = parseInt(rawHour, 10);
      if (isPM && hour !== 12) hour += 12;
      if (!isPM && hour === 12) hour = 0;

      const start = new Date(`${booking.date}T${String(hour).padStart(2, "0")}:${rawMinute || "00"}:00+05:30`);
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
        `SUMMARY:1-on-1 PTIROS Gurukul Strategy Call: ${booking.mentorName}`,
        `DESCRIPTION:Mentor: ${booking.mentorName} (${booking.domainTitle})\\nStudent: ${booking.studentName}\\nPlatform: https://ptiros.vercel.app`,
        "LOCATION:Google Meet",
        "STATUS:CONFIRMED",
        "END:VEVENT",
        "END:VCALENDAR",
      ].join("\r\n");

      const blob = new Blob([icsContent], { type: "text/calendar;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `PTIROS-Mentorship-${booking.date}.ics`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (e) {
      console.warn("Failed to generate .ics file:", e);
    }
  };

  const handleWhatsAppDispatch = (booking: MentorshipBooking) => {
    const text =
      `*PTIROS 1-on-1 Gurukul Mentorship Booking Confirmed*\n\n` +
      `[Student] ${booking.studentName}\n` +
      `[Senior Mentor] ${booking.mentorName} (${booking.domainTitle})\n` +
      `[Date] ${booking.date}\n` +
      `[Slot] ${booking.timeSlot}\n` +
      `[Primary Dilemma] ${booking.primaryQuestion}\n\n` +
      `Please connect me with our designated academic mentor on Google Meet.`;

    window.open(`https://api.whatsapp.com/send?phone=919876543210&text=${encodeURIComponent(text)}`, "_blank");
  };

  return (
    <div className="min-h-screen bg-[#fdfbf7] text-stone-900 pb-20">
      {/* Sticky Top Header */}
      <header className="sticky top-0 z-30 border-b border-stone-200/80 bg-white/85 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-stone-600 hover:text-stone-900 transition px-2.5 py-1.5 rounded-xl hover:bg-stone-100"
            >
              <ArrowLeft className="size-4" />
              <span className="hidden sm:inline">Back to Dashboard</span>
            </Link>
            <div className="h-4 w-px bg-stone-200 hidden sm:block" />
            <Link href="/" className="font-display font-black text-lg tracking-tight text-stone-900 flex items-center gap-2">
              <span>PTIRŌS</span>
              <span className="text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-orange-100 text-orange-800">
                Gurukul Desk
              </span>
            </Link>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            <Link
              href="/track-booking"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-stone-700 hover:text-orange-600 transition px-3 py-1.5 rounded-xl border border-stone-200 bg-white hover:bg-orange-50/60"
            >
              <Clock className="size-3.5 text-orange-600" />
              <span>My Bookings</span>
            </Link>
            <Link
              href="/dashboard"
              className="hidden sm:inline-flex items-center gap-1.5 text-xs font-bold text-white bg-stone-900 hover:bg-black transition px-3.5 py-1.5 rounded-xl"
            >
              <Compass className="size-3.5 text-orange-400" />
              <span>Student Portal</span>
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-10 space-y-8">
        {/* Hero Header Card */}
        <motion.section
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="rounded-3xl bg-white border border-orange-200/80 p-6 sm:p-8 shadow-xs flex flex-col md:flex-row items-center justify-between gap-6"
        >
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 text-center sm:text-left">
            <div className="shrink-0">
              <PtiroMascot variant={bookingConfirmed ? "celebrate" : "copilot"} size={78} showSpeech={false} />
            </div>
            <div className="space-y-2 max-w-2xl">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-100/90 text-orange-800 text-xs font-bold">
                <Sparkles className="size-3.5 text-orange-600" />
                <span>20-Minute 1-on-1 Gurukul Strategy Call</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-display font-black text-stone-900 tracking-tight">
                Book 1-on-1 Gurukul Mentorship Call
              </h1>
              <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                Sit down one-on-one with an IIT, AIIMS, NLSIU, IIM, or FTII practitioner. Bring your stream dilemmas, entrance prep questions, and a parent/guardian for aligned clarity.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:flex sm:flex-col gap-2 shrink-0 w-full md:w-auto">
            <div className="px-3.5 py-2 rounded-2xl bg-stone-50 border border-stone-200/80 text-xs font-semibold text-stone-700 flex items-center gap-2">
              <Video className="size-4 text-orange-600 shrink-0" />
              <span>Google Meet</span>
            </div>
            <div className="px-3.5 py-2 rounded-2xl bg-stone-50 border border-stone-200/80 text-xs font-semibold text-stone-700 flex items-center gap-2">
              <Users className="size-4 text-emerald-600 shrink-0" />
              <span>Student + Parent</span>
            </div>
          </div>
        </motion.section>

        {/* Auth Loading / Gate / Confirmed / Form */}
        {isAuthLoading ? (
          <div className="rounded-3xl bg-white border border-stone-200 p-14 text-center space-y-3 shadow-xs">
            <Loader2 className="size-8 animate-spin text-orange-600 mx-auto" />
            <p className="text-sm font-semibold text-stone-600">Checking your student session...</p>
          </div>
        ) : !isLoggedIn || !user ? (
          <motion.section
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-3xl bg-white border border-orange-200 p-8 sm:p-12 text-center space-y-5 shadow-xs max-w-2xl mx-auto"
          >
            <div className="mx-auto flex size-16 items-center justify-center rounded-2xl bg-orange-100 text-orange-700 shadow-xs">
              <Lock className="size-7" />
            </div>
            <div className="space-y-2">
              <span className="inline-block rounded-full bg-orange-100 px-3 py-0.5 text-[11px] font-bold text-orange-800 uppercase tracking-wider">
                Student Account Required
              </span>
              <h2 className="text-xl sm:text-2xl font-display font-extrabold text-stone-900">
                Sign In to Reserve Your 1-on-1 Session
              </h2>
              <p className="text-xs sm:text-sm text-stone-600 leading-relaxed max-w-md mx-auto">
                Log in or create a free student account first so your confirmed Google Meet link, mentor notes, and action plan appear directly in your portal.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 max-w-md mx-auto pt-2">
              <button
                type="button"
                onClick={() => openAuthModal("login")}
                className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-orange-600 px-5 py-3 text-sm font-bold text-white shadow-sm hover:bg-orange-700 transition cursor-pointer"
              >
                <span>Sign In to Continue</span>
                <ArrowRight className="size-4" />
              </button>
              <button
                type="button"
                onClick={() => openAuthModal("signup")}
                className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl border border-stone-300 bg-stone-50 px-5 py-3 text-sm font-bold text-stone-800 hover:bg-stone-100 transition cursor-pointer"
              >
                <UserPlus className="size-4 text-orange-600" />
                <span>Create Free Account</span>
              </button>
            </div>
          </motion.section>
        ) : bookingConfirmed ? (
          /* ══════════════════════════════════════════════════ */
          /* SUCCESS CONFIRMATION EXPERIENCE                    */
          /* ══════════════════════════════════════════════════ */
          <motion.section
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.35 }}
            role="status"
            aria-live="polite"
            className="rounded-3xl bg-white border border-emerald-200 p-6 sm:p-10 shadow-sm max-w-3xl mx-auto space-y-6 text-center"
          >
            <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 shadow-xs">
              <CheckCircle2 className="size-9" />
            </div>

            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3.5 py-1 text-xs font-bold text-emerald-800 border border-emerald-200">
                <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>Booking Confirmed &amp; Saved to Account: {bookingConfirmed.studentName}</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-display font-black text-stone-900">
                1-on-1 Mentorship Call Reserved!
              </h2>
              <p className="text-sm text-stone-600 max-w-xl mx-auto leading-relaxed">
                Your 20-minute Gurukul strategy session with{" "}
                <strong className="text-stone-900">{bookingConfirmed.mentorName}</strong> ({bookingConfirmed.domainTitle}) is scheduled for{" "}
                <strong className="text-stone-900">{bookingConfirmed.date}</strong> at{" "}
                <strong className="text-stone-900">{bookingConfirmed.timeSlot}</strong>.
              </p>
            </div>

            {/* Summary Card */}
            <div className="rounded-2xl border border-stone-200 bg-stone-50/80 p-5 text-left grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-wider text-stone-400">Assigned Mentor</p>
                <p className="text-sm font-bold text-stone-900 mt-0.5">{bookingConfirmed.mentorName}</p>
                <p className="text-xs text-stone-600">{bookingConfirmed.domainTitle}</p>
              </div>
              <div>
                <p className="text-[11px] font-bold uppercase tracking-wider text-stone-400">Date &amp; Time</p>
                <p className="text-sm font-bold text-stone-900 mt-0.5">{bookingConfirmed.date}</p>
                <p className="text-xs text-orange-700 font-semibold">{bookingConfirmed.timeSlot}</p>
              </div>
              <div className="sm:col-span-2 pt-2 border-t border-stone-200/70">
                <p className="text-[11px] font-bold uppercase tracking-wider text-stone-400">Session Focus</p>
                <p className="text-xs text-stone-700 mt-0.5 leading-relaxed">{bookingConfirmed.primaryQuestion}</p>
              </div>
            </div>

            {/* 4-Step Meeting Progress Stepper */}
            <div className="rounded-2xl border border-stone-200/90 bg-white p-4 sm:p-5 text-left space-y-3">
              <div className="flex items-center justify-between border-b border-stone-100 pb-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-stone-500">Live Progress Stepper</span>
                <span className="text-[11px] font-bold text-emerald-700 bg-emerald-100 px-2.5 py-0.5 rounded-full">
                  Step 1 of 4 Complete
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-2.5">
                <div className="p-3 rounded-xl bg-emerald-50/60 border border-emerald-200">
                  <div className="flex items-center gap-1.5 text-emerald-700 font-bold text-xs mb-1">
                    <CheckCircle2 className="size-3.5" />
                    <span>Requested</span>
                  </div>
                  <p className="text-[11px] text-stone-600">Slot &amp; agenda locked</p>
                </div>
                <div className="p-3 rounded-xl bg-amber-50/70 border border-amber-200">
                  <div className="flex items-center gap-1.5 text-amber-800 font-bold text-xs mb-1">
                    <Clock className="size-3.5" />
                    <span>In Review</span>
                  </div>
                  <p className="text-[11px] text-stone-600">Mentor reviewing profile</p>
                </div>
                <div className="p-3 rounded-xl bg-stone-50 border border-stone-200 opacity-75">
                  <div className="flex items-center gap-1.5 text-stone-600 font-semibold text-xs mb-1">
                    <Video className="size-3.5 text-stone-400" />
                    <span>Meet Room</span>
                  </div>
                  <p className="text-[11px] text-stone-400">Link sent pre-session</p>
                </div>
                <div className="p-3 rounded-xl bg-stone-50 border border-stone-200 opacity-75">
                  <div className="flex items-center gap-1.5 text-stone-600 font-semibold text-xs mb-1">
                    <ShieldCheck className="size-3.5 text-stone-400" />
                    <span>Action Plan</span>
                  </div>
                  <p className="text-[11px] text-stone-400">Notes &amp; next milestones</p>
                </div>
              </div>
            </div>

            {/* Briefing Checklist */}
            <div className="rounded-2xl border border-amber-200/80 bg-amber-50/50 p-4 text-left text-xs text-amber-950 space-y-1.5">
              <div className="font-bold text-amber-900 flex items-center gap-2">
                <FileText className="size-4 text-amber-700" />
                <span>Session Briefing Checklist</span>
              </div>
              <p>• Keep your latest marksheets or Career Match Test report handy.</p>
              <p>• Both the student and at least one parent/guardian are encouraged to join.</p>
              <p>
                • Google Meet confirmation will be shared on WhatsApp at{" "}
                <strong>+91 {bookingConfirmed.parentPhone}</strong>.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3 pt-1">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => router.push("/track-booking")}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-stone-900 px-5 py-3 text-xs font-bold text-white shadow-sm hover:bg-black transition cursor-pointer"
                >
                  <Clock className="size-4 text-orange-400" />
                  <span>View Meeting Status</span>
                </button>
                <button
                  type="button"
                  onClick={() => router.push("/dashboard?tab=mentorship")}
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-stone-300 bg-white px-5 py-3 text-xs font-bold text-stone-800 hover:bg-stone-50 transition cursor-pointer"
                >
                  <span>Go to Student Dashboard</span>
                  <ArrowRight className="size-3.5" />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                <a
                  href={generateGoogleCalendarUrl(bookingConfirmed)}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-stone-200 bg-white px-3 py-2.5 text-xs font-semibold text-stone-700 hover:bg-stone-50 transition"
                >
                  <Calendar className="size-3.5 text-stone-500" />
                  <span>Add to Google Cal</span>
                </a>
                <button
                  type="button"
                  onClick={() => downloadIcsCalendar(bookingConfirmed)}
                  className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-stone-200 bg-white px-3 py-2.5 text-xs font-semibold text-stone-700 hover:bg-stone-50 transition cursor-pointer"
                >
                  <Download className="size-3.5 text-stone-500" />
                  <span>Download .ICS</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleWhatsAppDispatch(bookingConfirmed)}
                  className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-emerald-600 px-3 py-2.5 text-xs font-semibold text-white hover:bg-emerald-700 transition cursor-pointer"
                >
                  <MessageSquare className="size-3.5" />
                  <span>Share on WhatsApp</span>
                </button>
              </div>

              <button
                type="button"
                onClick={() => {
                  setBookingConfirmed(null);
                  setPrimaryQuestion("");
                  setErrors({});
                }}
                className="inline-block pt-2 text-xs font-semibold text-stone-500 hover:text-stone-900 underline underline-offset-4 cursor-pointer"
              >
                Schedule Another Mentorship Call
              </button>
            </div>
          </motion.section>
        ) : (
          /* ══════════════════════════════════════════════════ */
          /* BOOKING FORM + STICKY MENTOR SPOTLIGHT             */
          /* ══════════════════════════════════════════════════ */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left Column: Interactive Form (7 cols) */}
            <motion.form
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: 0.05 }}
              onSubmit={handleBookSession}
              noValidate
              className="lg:col-span-7 rounded-3xl bg-white border border-stone-200/90 p-5 sm:p-8 shadow-xs space-y-7"
            >
              {errors.general && (
                <div
                  role="alert"
                  className="rounded-2xl border border-red-200 bg-red-50 p-3.5 flex items-start gap-2.5 text-xs text-red-800"
                >
                  <AlertCircle className="size-4 text-red-600 shrink-0 mt-0.5" />
                  <span className="font-medium">{errors.general}</span>
                </div>
              )}

              {/* Step 1: Mentor Selection */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold uppercase tracking-wider text-stone-600">
                    1. Select Your Gurukul Mentor ({MENTORS.length} Available)
                  </label>
                  <span className="text-[11px] font-semibold text-orange-700 bg-orange-50 px-2.5 py-0.5 rounded-full">
                    {selectedMentor.domainTitle}
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {MENTORS.map((m) => {
                    const isSelected = selectedMentor.id === m.id;
                    return (
                      <button
                        key={m.id}
                        type="button"
                        onClick={() => setSelectedMentor(m)}
                        className={`relative flex items-start gap-3 rounded-2xl p-3.5 text-left transition border cursor-pointer ${
                          isSelected
                            ? "border-orange-500 bg-orange-50/75 ring-2 ring-orange-400/20 shadow-xs"
                            : "border-stone-200 bg-stone-50/40 hover:bg-stone-50 hover:border-stone-300"
                        }`}
                      >
                        <div className="size-11 rounded-xl overflow-hidden bg-stone-100 border border-stone-200 shrink-0">
                          <Blobatar name={m.name} size={44} animate="hover" className="size-full object-cover" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-1.5">
                            <span className="text-xs font-bold text-stone-900 truncate">{m.name}</span>
                            <span className="text-[10px] font-bold text-amber-800 bg-amber-100 px-1.5 py-0.5 rounded-full inline-flex items-center gap-0.5 shrink-0">
                              <Star className="size-2.5 text-amber-500 fill-amber-500" />
                              {m.rating}
                            </span>
                          </div>
                          <p className="text-[11px] text-stone-600 font-medium truncate mt-0.5">{m.pedigree}</p>
                          <p className="text-[10px] text-stone-400 truncate">{m.domainTitle}</p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Step 2: Date & Time Slot Pills */}
              <div className="space-y-4 pt-2 border-t border-stone-100">
                <div>
                  <label htmlFor="page-booking-date" className="block text-xs font-bold uppercase tracking-wider text-stone-600 mb-1.5">
                    2. Preferred Date <span className="text-orange-600">*</span>
                  </label>
                  <input
                    id="page-booking-date"
                    type="date"
                    value={selectedDate}
                    min={getTodayStr()}
                    onChange={(e) => {
                      setSelectedDate(e.target.value);
                      if (errors.date) setErrors((prev) => ({ ...prev, date: undefined }));
                    }}
                    className={`w-full sm:max-w-xs rounded-xl border px-3.5 py-2.5 text-sm font-medium focus:outline-none focus:ring-2 ${
                      errors.date
                        ? "border-red-500 focus:ring-red-400/20 bg-red-50/30"
                        : "border-stone-300 focus:border-orange-500 focus:ring-orange-500/20 bg-white"
                    }`}
                  />
                  {errors.date && <p className="mt-1.5 text-xs font-medium text-red-600">{errors.date}</p>}
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-stone-600 mb-2">
                    3. Choose 20-Minute Slot (IST) <span className="text-orange-600">*</span>
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {TIME_SLOTS.map((slot) => {
                      const active = selectedSlot === slot;
                      return (
                        <button
                          key={slot}
                          type="button"
                          onClick={() => {
                            setSelectedSlot(slot);
                            if (errors.slot) setErrors((prev) => ({ ...prev, slot: undefined }));
                          }}
                          className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl border text-xs font-bold transition cursor-pointer ${
                            active
                              ? "border-orange-500 bg-stone-900 text-white shadow-xs"
                              : "border-stone-200 bg-stone-50/60 text-stone-700 hover:bg-stone-100"
                          }`}
                        >
                          <span className="flex items-center gap-2">
                            <Clock className={`size-3.5 ${active ? "text-orange-400" : "text-stone-400"}`} />
                            {slot}
                          </span>
                          {active && <CheckCircle2 className="size-3.5 text-orange-400 shrink-0" />}
                        </button>
                      );
                    })}
                  </div>
                  {errors.slot && <p className="mt-1.5 text-xs font-medium text-red-600">{errors.slot}</p>}
                </div>
              </div>

              {/* Step 3: Student & WhatsApp Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-stone-100">
                <div>
                  <label htmlFor="page-booking-student" className="block text-xs font-bold uppercase tracking-wider text-stone-600 mb-1.5">
                    4. Student Full Name <span className="text-orange-600">*</span>
                  </label>
                  <input
                    id="page-booking-student"
                    type="text"
                    placeholder="e.g. Aarav Sharma"
                    value={studentName}
                    onChange={(e) => {
                      setStudentName(e.target.value);
                      if (errors.studentName) setErrors((prev) => ({ ...prev, studentName: undefined }));
                    }}
                    className={`w-full rounded-xl border px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 ${
                      errors.studentName
                        ? "border-red-500 focus:ring-red-400/20 bg-red-50/30"
                        : "border-stone-300 focus:border-orange-500 focus:ring-orange-500/20"
                    }`}
                  />
                  {errors.studentName && <p className="mt-1.5 text-xs font-medium text-red-600">{errors.studentName}</p>}
                </div>

                <div>
                  <label htmlFor="page-booking-phone" className="block text-xs font-bold uppercase tracking-wider text-stone-600 mb-1.5">
                    Parent / Student WhatsApp <span className="text-orange-600">*</span>
                  </label>
                  <div className="flex">
                    <span className="inline-flex items-center rounded-l-xl border border-r-0 border-stone-300 bg-stone-100 px-3 text-xs font-bold text-stone-600">
                      +91
                    </span>
                    <input
                      id="page-booking-phone"
                      type="tel"
                      placeholder="9876543210"
                      value={parentPhone}
                      onChange={(e) => {
                        setParentPhone(e.target.value);
                        if (errors.parentPhone) setErrors((prev) => ({ ...prev, parentPhone: undefined }));
                      }}
                      className={`w-full rounded-r-xl border px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 ${
                        errors.parentPhone
                          ? "border-red-500 focus:ring-red-400/20 bg-red-50/30"
                          : "border-stone-300 focus:border-orange-500 focus:ring-orange-500/20"
                      }`}
                    />
                  </div>
                  {errors.parentPhone && <p className="mt-1.5 text-xs font-medium text-red-600">{errors.parentPhone}</p>}
                </div>
              </div>

              {/* Step 4: Core Career Dilemma */}
              <div className="space-y-2.5 pt-2 border-t border-stone-100">
                <div className="flex items-center justify-between">
                  <label htmlFor="page-booking-question" className="block text-xs font-bold uppercase tracking-wider text-stone-600">
                    5. Core Career Dilemma or Question <span className="text-orange-600">*</span>
                  </label>
                  <span className="text-[11px] text-stone-400">{primaryQuestion.trim().length} chars</span>
                </div>

                <div className="flex flex-wrap gap-1.5">
                  {DILEMMA_SUGGESTIONS.map((topic) => (
                    <button
                      key={topic}
                      type="button"
                      onClick={() => {
                        setPrimaryQuestion(topic);
                        if (errors.primaryQuestion) setErrors((prev) => ({ ...prev, primaryQuestion: undefined }));
                      }}
                      className="text-[11px] font-medium px-2.5 py-1 rounded-full bg-stone-100 hover:bg-orange-100 text-stone-700 hover:text-orange-900 transition cursor-pointer"
                    >
                      + {topic}
                    </button>
                  ))}
                </div>

                <textarea
                  id="page-booking-question"
                  rows={3}
                  placeholder="Share what you'd like to resolve in this 20-minute call (e.g., stream choice, entrance strategy, or balancing school & projects)..."
                  value={primaryQuestion}
                  onChange={(e) => {
                    setPrimaryQuestion(e.target.value);
                    if (errors.primaryQuestion) setErrors((prev) => ({ ...prev, primaryQuestion: undefined }));
                  }}
                  className={`w-full rounded-xl border px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 ${
                    errors.primaryQuestion
                      ? "border-red-500 focus:ring-red-400/20 bg-red-50/30"
                      : "border-stone-300 focus:border-orange-500 focus:ring-orange-500/20"
                  }`}
                />
                {errors.primaryQuestion && (
                  <p className="text-xs font-medium text-red-600">{errors.primaryQuestion}</p>
                )}
              </div>

              <div className="pt-3 border-t border-stone-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <p className="text-[11px] text-stone-500">
                  Complimentary 20-min strategy session • Google Meet link sent via WhatsApp
                </p>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-orange-600 to-amber-600 px-6 py-3 text-sm font-bold text-white shadow-md hover:brightness-105 active:scale-95 transition disabled:opacity-50 cursor-pointer shrink-0"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="size-4 animate-spin" />
                      <span>Reserving Session...</span>
                    </>
                  ) : (
                    <>
                      <span>Confirm 1-on-1 Call</span>
                      <ArrowRight className="size-4" />
                    </>
                  )}
                </button>
              </div>
            </motion.form>

            {/* Right Column: Sticky Mentor Spotlight & Summary (5 cols) */}
            <motion.aside
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: 0.1 }}
              className="lg:col-span-5 space-y-5 lg:sticky lg:top-24"
            >
              {/* Dark Mentor Spotlight Card */}
              <div className="rounded-3xl bg-gradient-to-br from-stone-900 via-stone-900 to-stone-800 text-white p-6 shadow-sm space-y-5 relative overflow-hidden">
                <div className="absolute -right-12 -top-12 size-44 rounded-full bg-orange-500/15 blur-2xl pointer-events-none" />
                <div className="relative z-10 flex items-center justify-between">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-orange-300">
                    Selected Gurukul Fellow
                  </span>
                  <span className="inline-flex items-center gap-1 rounded-full bg-white/10 px-2.5 py-0.5 text-xs font-bold text-amber-300">
                    <Star className="size-3 fill-amber-300 text-amber-300" />
                    {selectedMentor.rating} ({selectedMentor.totalSessions}+ calls)
                  </span>
                </div>

                <div className="relative z-10 flex items-center gap-4">
                  <div className="size-16 rounded-2xl overflow-hidden bg-stone-800 border border-white/15 shrink-0">
                    <Blobatar name={selectedMentor.name} size={64} animate="hover" className="size-full object-cover" />
                  </div>
                  <div className="min-w-0">
                    <h2 className="text-lg font-display font-bold text-white truncate">{selectedMentor.name}</h2>
                    <p className="text-xs font-semibold text-orange-300">{selectedMentor.designation}</p>
                    <p className="text-[11px] text-stone-300 mt-0.5">{selectedMentor.pedigree}</p>
                  </div>
                </div>

                <div className="relative z-10 rounded-2xl bg-white/5 border border-white/10 p-4 space-y-1.5">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-stone-400">
                    Core Specialization
                  </p>
                  <p className="text-xs text-stone-200 leading-relaxed">{selectedMentor.specialization}</p>
                </div>

                {/* Live Selection Summary */}
                <div className="relative z-10 pt-3 border-t border-white/10 grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <p className="text-[10px] uppercase tracking-wider text-stone-400 font-bold">Date</p>
                    <p className="font-bold text-white mt-0.5 flex items-center gap-1.5">
                      <CalendarDays className="size-3.5 text-orange-400" />
                      {selectedDate || "Not chosen"}
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-wider text-stone-400 font-bold">IST Slot</p>
                    <p className="font-bold text-white mt-0.5 truncate">{selectedSlot}</p>
                  </div>
                </div>
              </div>

              {/* Preparation Card */}
              <div className="rounded-3xl bg-white border border-stone-200/90 p-5 shadow-xs space-y-3">
                <h3 className="text-sm font-display font-bold text-stone-900 flex items-center gap-2">
                  <ShieldCheck className="size-4 text-emerald-600" />
                  <span>What Happens After You Book</span>
                </h3>
                <ul className="space-y-2.5 text-xs text-stone-600">
                  <li className="flex items-start gap-2">
                    <span className="size-5 rounded-full bg-orange-100 text-orange-700 font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                      1
                    </span>
                    <span>Your academic profile &amp; dilemma are shared securely with {selectedMentor.name}.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="size-5 rounded-full bg-orange-100 text-orange-700 font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                      2
                    </span>
                    <span>You receive a verified Google Meet link on WhatsApp and inside your Student Portal.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="size-5 rounded-full bg-orange-100 text-orange-700 font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                      3
                    </span>
                    <span>After the 20-minute session, your mentor logs actionable milestones into your planner.</span>
                  </li>
                </ul>
              </div>
            </motion.aside>
          </div>
        )}
      </main>
    </div>
  );
}

export default function BookMentorshipPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#fdfbf7] flex items-center justify-center">
          <Loader2 className="size-8 animate-spin text-orange-600" />
        </div>
      }
    >
      <BookMentorshipContent />
    </Suspense>
  );
}
