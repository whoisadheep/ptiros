"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUserProfile } from "@/context/UserProfileContext";
import { useStudentAuth } from "@/context/StudentAuthContext";
import { MENTORS } from "@/data/mentors";
import { Mentor, MentorshipBooking } from "@/types/profile";
import { validateIndianMobile } from "@/lib/storage";
import { useScrollLock } from "@/hooks/useScrollLock";
import {
  Building2,
  X,
  CheckCircle2,
  FileText,
  Calendar,
  MessageSquare,
  Star,
  Clock,
  ArrowRight,
  ShieldCheck,
  Video,
  ExternalLink,
  Loader2,
  Download,
  Lock,
  UserPlus,
} from "lucide-react";
import { Blobatar } from "@blobatar/react";

const TIME_SLOTS = [
  "10:00 AM - 10:20 AM IST",
  "11:30 AM - 11:50 AM IST",
  "03:00 PM - 03:20 PM IST",
  "04:30 PM - 04:50 PM IST",
  "06:00 PM - 06:20 PM IST",
  "07:30 PM - 07:50 PM IST",
];

export default function MentorshipBookingModal() {
  const router = useRouter();
  const { isBookingModalOpen, closeBookingModal, selectedMentorTrackId } = useUserProfile();
  const {
    user,
    isLoggedIn,
    isLoading: isAuthLoading,
    isAuthModalOpen,
    openAuthModal,
    refresh: refreshStudentAuth,
  } = useStudentAuth();

  const [selectedMentor, setSelectedMentor] = useState<Mentor>(MENTORS[0]);
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedSlot, setSelectedSlot] = useState<string>(TIME_SLOTS[1]);
  const [studentName, setStudentName] = useState("");
  const [parentPhone, setParentPhone] = useState("");
  const [primaryQuestion, setPrimaryQuestion] = useState("");
  const [bookingConfirmed, setBookingConfirmed] = useState<MentorshipBooking | null>(null);
  const [phoneError, setPhoneError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Sync track when opened (with fallback matching across simulator IDs and mentor domains)
  useEffect(() => {
    if (selectedMentorTrackId) {
      const match = MENTORS.find(
        (m) =>
          m.domainId === selectedMentorTrackId ||
          m.id === selectedMentorTrackId ||
          (selectedMentorTrackId === "medicine" && m.domainId === "digital-health-medicine") ||
          (selectedMentorTrackId === "ux-design" && m.domainId === "product-ux") ||
          (selectedMentorTrackId === "finance" && m.domainId === "quant-finance") ||
          (selectedMentorTrackId === "media" && m.domainId === "media-creative-tech")
      );
      if (match) setSelectedMentor(match);
    }
  }, [selectedMentorTrackId]);

  // Sync details from authenticated student account and reset confirmation state when modal opens
  useEffect(() => {
    if (isBookingModalOpen) {
      setBookingConfirmed(null);
      setPhoneError("");
      setStudentName(user?.name || "");
      setParentPhone(user?.parentPhone || "");
    }
  }, [user, isBookingModalOpen]);

  // Set default date to tomorrow in YYYY-MM-DD
  useEffect(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    setSelectedDate(tomorrow.toISOString().split("T")[0]);
  }, []);

  // Universal scroll lock & Lenis pause
  useScrollLock(isBookingModalOpen && !isAuthModalOpen);

  // Accessibility: Escape key
  useEffect(() => {
    if (!isBookingModalOpen || isAuthModalOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeBookingModal();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isBookingModalOpen, isAuthModalOpen, closeBookingModal]);

  if (!isBookingModalOpen || isAuthModalOpen) return null;

  const handleBookSession = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoggedIn || !user) {
      openAuthModal("login");
      return;
    }

    const phoneVal = validateIndianMobile(parentPhone);
    if (!phoneVal.isValid) {
      setPhoneError("Please enter a valid 10-digit Indian WhatsApp number");
      return;
    }
    setPhoneError("");
    setIsSubmitting(true);

    const bookingPayload = {
      mentorId: selectedMentor.id,
      mentorName: selectedMentor.name,
      domainTitle: selectedMentor.domainTitle,
      date: selectedDate,
      timeSlot: selectedSlot,
      studentName: studentName.trim() || user.name || "PTIROS Student",
      parentPhone: phoneVal.normalized,
      primaryQuestion: primaryQuestion.trim() || "General career & Class 11-12 stream alignment guidance",
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
        setPhoneError("This time slot was just booked with this mentor. Please select another slot or date.");
        setIsSubmitting(false);
        return;
      }

      if (!res.ok) {
        const errJson = await res.json().catch(() => ({}));
        setPhoneError(errJson.error || "Failed to schedule session. Please try again.");
        setIsSubmitting(false);
        return;
      }

      const json = await res.json();
      const realBooking = json.data || bookingPayload;

      // Sync student auth bookings state directly from Neon account
      try {
        await refreshStudentAuth();
      } catch {}

      setBookingConfirmed(realBooking);
    } catch (err) {
      console.error("Session booking exception:", err);
      setPhoneError("Network error. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const generateGoogleCalendarUrl = (booking: MentorshipBooking) => {
    // Parse Date and approximate IST slot into ISO timestamp
    const [timeStr] = booking.timeSlot.split(" - ");
    const isPM = timeStr.includes("PM");
    const [rawHour, rawMinute] = timeStr.replace(/[^0-9:]/g, "").split(":");
    let hour = parseInt(rawHour, 10);
    if (isPM && hour !== 12) hour += 12;
    if (!isPM && hour === 12) hour = 0;

    // Format IST into Date obj
    const start = new Date(`${booking.date}T${String(hour).padStart(2, "0")}:${rawMinute}:00+05:30`);
    const end = new Date(start.getTime() + 20 * 60 * 1000);

    const formatGCal = (d: Date) => d.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
    const dates = `${formatGCal(start)}/${formatGCal(end)}`;

    const title = encodeURIComponent(`1-on-1 PTIROS Gurukul Strategy Call: ${booking.mentorName}`);
    const details = encodeURIComponent(
      `Mentor: ${booking.mentorName} (${booking.domainTitle})\n` +
      `Student: ${booking.studentName}\n` +
      `Core Dilemma: ${booking.primaryQuestion}\n` +
      `Platform: Verified PTIROS Gurukul Session (https://ptiros.in)`
    );

    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${dates}&details=${details}&location=Google+Meet`;
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
        `DESCRIPTION:Mentor: ${booking.mentorName} (${booking.domainTitle})\\nStudent: ${booking.studentName}\\nPlatform: https://ptiros.in`,
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
      `Please connect me with our designated academic mentor on Google Meet. Verified by PTIROS: https://ptiros.in`;

    window.open(`https://api.whatsapp.com/send?phone=919876543210&text=${encodeURIComponent(text)}`, "_blank");
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="booking-title"
      data-lenis-prevent
      className="fixed inset-0 z-[1000] flex items-center justify-center p-3 sm:p-4 bg-stone-900/70 backdrop-blur-md animate-in fade-in duration-200 overscroll-contain"
    >
      <div data-lenis-prevent className="relative w-full max-w-2xl max-h-[90dvh] overflow-y-auto rounded-2xl sm:rounded-3xl bg-white p-4 sm:p-8 shadow-2xl border border-stone-200 text-stone-900 overscroll-contain">
        {/* Header Bar */}
        <div className="flex items-start sm:items-center justify-between gap-2 border-b border-stone-100 pb-4">
          <div className="flex items-center gap-3 min-w-0">
            <span className="flex h-10 w-10 sm:h-11 sm:w-11 shrink-0 items-center justify-center rounded-2xl bg-amber-100 text-amber-700">
              <Building2 className="size-5" />
            </span>
            <div className="min-w-0">
              <h2 id="booking-title" className="text-lg sm:text-xl font-bold tracking-tight text-stone-900">
                Book 1-on-1 Gurukul Mentorship Call
              </h2>
              <p className="text-xs text-stone-500">
                20-minute strategic career & stream clarity session with top industry leaders
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={closeBookingModal}
            className="rounded-full p-2 text-stone-400 hover:bg-stone-100 hover:text-stone-700 transition shrink-0"
            aria-label="Close modal"
          >
            <X className="size-5" />
          </button>
        </div>

        {isAuthLoading ? (
          <div className="py-14 text-center space-y-3">
            <Loader2 className="size-7 animate-spin text-primary mx-auto" />
            <p className="text-xs font-semibold text-stone-500">Checking your student session...</p>
          </div>
        ) : !isLoggedIn ? (
          /* FIRST LOGIN GATE BEFORE SCHEDULING */
          <div className="mt-6 text-center space-y-5 py-4">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-100 text-orange-700 shadow-xs">
              <Lock className="size-7" />
            </div>

            <div className="space-y-1.5 max-w-md mx-auto">
              <span className="inline-block rounded-full bg-orange-100 px-3 py-0.5 text-[11px] font-bold text-orange-800">
                Step 1 of 2: Student Account Required
              </span>
              <h3 className="text-xl sm:text-2xl font-display font-extrabold text-stone-900">
                Sign In Before Scheduling Your Meeting
              </h3>
              <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                Log in or register a free student account first so your 1-on-1 mentor session, Google Meet link, and mentor notes appear directly inside your personal portal.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 max-w-md mx-auto pt-2">
              <button
                type="button"
                onClick={() => openAuthModal("login")}
                className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 text-xs sm:text-sm font-bold text-white shadow-md shadow-primary/20 hover:bg-primary-dark transition cursor-pointer"
              >
                <span>Sign In to Continue</span>
                <ArrowRight className="size-4" />
              </button>
              <button
                type="button"
                onClick={() => openAuthModal("signup")}
                className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl border border-stone-300 bg-stone-50 px-5 py-3 text-xs sm:text-sm font-bold text-stone-800 hover:bg-stone-100 transition cursor-pointer"
              >
                <UserPlus className="size-4 text-primary" />
                <span>Create Account</span>
              </button>
            </div>
          </div>
        ) : bookingConfirmed ? (
          /* CONFIRMATION SCREEN WITH REAL-TIME STEPPER */
          <div className="mt-6 text-center space-y-5 animate-in zoom-in-95 duration-200">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 shadow-xs">
              <CheckCircle2 className="size-8" />
            </div>

            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-stone-100 px-3.5 py-1 text-xs font-semibold text-stone-800 border border-stone-200">
                <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>Saved to Your Account: <strong>{bookingConfirmed.studentName}</strong></span>
              </div>
              <h3 className="mt-2.5 text-2xl font-display font-extrabold text-stone-900">
                1-on-1 Mentorship Call Reserved!
              </h3>
              <p className="text-xs sm:text-sm text-stone-600 max-w-lg mx-auto mt-1 leading-relaxed">
                Your 20-minute strategy call with <strong>{bookingConfirmed.mentorName}</strong> ({bookingConfirmed.domainTitle}) is reserved for <strong>{bookingConfirmed.date}</strong> at <strong>{bookingConfirmed.timeSlot}</strong>.
              </p>
            </div>

            {/* 4-Step Meeting Progress Stepper */}
            <div className="rounded-2xl border border-stone-200/90 bg-stone-50/80 p-4 sm:p-5 text-left max-w-xl mx-auto space-y-3">
              <div className="flex items-center justify-between border-b border-stone-200/60 pb-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-stone-500">Live Progress Stepper</span>
                <span className="text-[11px] font-semibold text-amber-700 bg-amber-100/70 px-2 py-0.5 rounded-full">
                  Step 1 of 4 Confirmed
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 pt-1">
                {/* Step 1 */}
                <div className="p-2.5 rounded-xl bg-white border border-emerald-200 shadow-2xs">
                  <div className="flex items-center gap-1.5 text-emerald-600 font-bold text-xs mb-1">
                    <CheckCircle2 className="size-3.5" />
                    <span>Requested</span>
                  </div>
                  <p className="text-[10px] text-stone-500 leading-tight">Date, slot & dilemma registered</p>
                </div>

                {/* Step 2 */}
                <div className="p-2.5 rounded-xl bg-amber-50/60 border border-amber-300 shadow-2xs">
                  <div className="flex items-center gap-1.5 text-amber-700 font-bold text-xs mb-1">
                    <Clock className="size-3.5 animate-spin" />
                    <span>In Review</span>
                  </div>
                  <p className="text-[10px] text-stone-600 leading-tight">Council reviewing dossier & agenda</p>
                </div>

                {/* Step 3 */}
                <div className="p-2.5 rounded-xl bg-white border border-stone-200/70 opacity-75">
                  <div className="flex items-center gap-1.5 text-stone-600 font-semibold text-xs mb-1">
                    <Video className="size-3.5 text-stone-400" />
                    <span>Meet Room</span>
                  </div>
                  <p className="text-[10px] text-stone-400 leading-tight">Google Meet link opens pre-call</p>
                </div>

                {/* Step 4 */}
                <div className="p-2.5 rounded-xl bg-white border border-stone-200/70 opacity-75">
                  <div className="flex items-center gap-1.5 text-stone-600 font-semibold text-xs mb-1">
                    <ShieldCheck className="size-3.5 text-stone-400" />
                    <span>Action Plan</span>
                  </div>
                  <p className="text-[10px] text-stone-400 leading-tight">Post-call notes & milestones</p>
                </div>
              </div>
            </div>

            {/* Session Briefing Checklist */}
            <div className="rounded-2xl border border-amber-200/80 bg-amber-50/50 p-4 text-left text-xs text-amber-950 space-y-1.5 max-w-xl mx-auto">
              <div className="font-semibold text-amber-900 flex items-center gap-2">
                <FileText className="size-4 text-amber-700" />
                <span>Session Briefing Checklist:</span>
              </div>
              <p>• Have your latest Class 9/10/11 marksheets or career simulation scores ready.</p>
              <p>• Both the student and at least one parent/guardian are encouraged to attend.</p>
              <p>• A Google Meet video link will be confirmed on WhatsApp to <strong>+91 {bookingConfirmed.parentPhone}</strong>.</p>
            </div>

            {/* Quick Actions Cluster */}
            <div className="pt-2 flex flex-col gap-2.5 max-w-xl mx-auto">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <button
                  type="button"
                  onClick={() => {
                    closeBookingModal();
                    router.push("/track-booking");
                  }}
                  className="flex items-center justify-center gap-2 rounded-xl bg-stone-900 px-4 py-2.5 text-xs font-bold text-white shadow-md hover:bg-black active:scale-95 transition cursor-pointer"
                >
                  <Clock className="size-4 text-orange-400" />
                  <span>View Meeting Status</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    closeBookingModal();
                    router.push("/dashboard?tab=mentorship");
                  }}
                  className="flex items-center justify-center gap-2 rounded-xl border border-stone-300 bg-white px-4 py-2.5 text-xs font-bold text-stone-800 shadow-2xs hover:bg-stone-50 active:scale-95 transition cursor-pointer"
                >
                  <span>Student Dashboard</span>
                  <ArrowRight className="size-3.5 text-stone-500" />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <a
                  href={generateGoogleCalendarUrl(bookingConfirmed)}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-stone-200 bg-white px-3 py-2 text-[11px] font-semibold text-stone-700 shadow-2xs hover:bg-stone-50 transition"
                >
                  <Calendar className="size-3.5 text-stone-500" />
                  <span>Google Cal</span>
                </a>
                <button
                  type="button"
                  onClick={() => downloadIcsCalendar(bookingConfirmed)}
                  className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-stone-200 bg-white px-3 py-2 text-[11px] font-semibold text-stone-700 shadow-2xs hover:bg-stone-50 transition cursor-pointer"
                  title="Download .ics for Apple Calendar & Outlook"
                >
                  <Download className="size-3.5 text-stone-500" />
                  <span>.ICS File</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleWhatsAppDispatch(bookingConfirmed)}
                  className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-emerald-600 px-3 py-2 text-[11px] font-semibold text-white shadow-sm hover:bg-emerald-700 transition cursor-pointer"
                >
                  <MessageSquare className="size-3.5 text-white" />
                  <span>WhatsApp</span>
                </button>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="button"
                onClick={() => {
                  setBookingConfirmed(null);
                  closeBookingModal();
                }}
                className="text-xs font-medium text-stone-500 hover:text-stone-800"
              >
                Done / Return to Platform
              </button>
            </div>
          </div>
        ) : (
          /* BOOKING FORM */
          <form onSubmit={handleBookSession} className="mt-6 space-y-5">
            {/* Step 1: Select Mentor */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-stone-600 mb-2">
                1. Select Domain Mentor ({MENTORS.length} Available)
              </label>
              <div data-lenis-prevent className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-52 overflow-y-auto pr-1 overscroll-contain">
                {MENTORS.map((m) => {
                  const isSelected = selectedMentor.id === m.id;
                  return (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => setSelectedMentor(m)}
                      className={`flex items-start gap-3 rounded-2xl p-3 text-left transition border ${
                        isSelected
                          ? "border-orange-500 bg-orange-50/80 ring-2 ring-orange-400/20"
                          : "border-stone-200 bg-stone-50/50 hover:bg-stone-100"
                      }`}
                    >
                      <div className="size-10 rounded-xl overflow-hidden bg-stone-100 border border-stone-200/90 shrink-0 shadow-2xs flex items-center justify-center">
                        <Blobatar name={m.name} size={40} animate="hover" className="size-full object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-stone-900 truncate">{m.name}</span>
                          <span className="text-[10px] font-semibold text-amber-700 bg-amber-100/80 px-1.5 py-0.5 rounded-full flex items-center gap-0.5">
                            <Star className="size-2.5 text-amber-500 fill-amber-500" />
                            {m.rating}
                          </span>
                        </div>
                        <p className="text-[11px] text-stone-600 font-medium truncate">{m.pedigree}</p>
                        <p className="text-[10px] text-stone-400 truncate">{m.domainTitle}</p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Step 2: Date & Slot */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="booking-date" className="block text-xs font-semibold uppercase tracking-wider text-stone-600 mb-1">
                  2. Choose Date <span className="text-orange-600">*</span>
                </label>
                <input
                  id="booking-date"
                  type="date"
                  required
                  value={selectedDate}
                  min={new Date().toISOString().split("T")[0]}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-full rounded-xl border border-stone-300 px-3 py-2 text-sm focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20"
                />
              </div>

              <div>
                <label htmlFor="booking-slot" className="block text-xs font-semibold uppercase tracking-wider text-stone-600 mb-1">
                  3. Select 20-min Slot (IST) <span className="text-orange-600">*</span>
                </label>
                <select
                  id="booking-slot"
                  value={selectedSlot}
                  onChange={(e) => setSelectedSlot(e.target.value)}
                  className="w-full rounded-xl border border-stone-300 px-3 py-2 text-sm focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20 bg-white"
                >
                  {TIME_SLOTS.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Step 3: Contact Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="booking-student" className="block text-xs font-semibold uppercase tracking-wider text-stone-600 mb-1">
                  Student Name <span className="text-orange-600">*</span>
                </label>
                <input
                  id="booking-student"
                  type="text"
                  required
                  placeholder="Student full name"
                  value={studentName}
                  onChange={(e) => setStudentName(e.target.value)}
                  className="w-full rounded-xl border border-stone-300 px-3.5 py-2 text-sm focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20"
                />
              </div>

              <div>
                <label htmlFor="booking-phone" className="block text-xs font-semibold uppercase tracking-wider text-stone-600 mb-1">
                  WhatsApp Number <span className="text-orange-600">*</span>
                </label>
                <div className="flex">
                  <span className="inline-flex items-center rounded-l-xl border border-r-0 border-stone-300 bg-stone-100 px-3 text-xs font-medium text-stone-600">
                    +91
                  </span>
                  <input
                    id="booking-phone"
                    type="tel"
                    required
                    placeholder="9876543210"
                    value={parentPhone}
                    onChange={(e) => {
                      setParentPhone(e.target.value);
                      if (phoneError) setPhoneError("");
                    }}
                    className={`w-full rounded-r-xl border px-3 py-2 text-sm focus:outline-none focus:ring-2 ${
                      phoneError
                        ? "border-red-500 focus:ring-red-400/20"
                        : "border-stone-300 focus:border-orange-500 focus:ring-orange-500/20"
                    }`}
                  />
                </div>
                {phoneError && <p className="mt-1 text-xs text-red-600">{phoneError}</p>}
              </div>
            </div>

            {/* Step 4: Primary Dilemma */}
            <div>
              <label htmlFor="booking-question" className="block text-xs font-semibold uppercase tracking-wider text-stone-600 mb-1">
                Core Career Dilemma or Question for the Mentor
              </label>
              <textarea
                id="booking-question"
                rows={2}
                placeholder="e.g. Should I choose PCM with Computer Science or Humanities for Corporate Law? How can I balance JEE prep with design aptitude?"
                value={primaryQuestion}
                onChange={(e) => setPrimaryQuestion(e.target.value)}
                className="w-full rounded-xl border border-stone-300 px-3.5 py-2 text-sm focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20"
              />
            </div>

            <div className="pt-3 flex flex-col-reverse sm:flex-row sm:items-center justify-between gap-2.5 border-t border-stone-100">
              <button
                type="button"
                onClick={closeBookingModal}
                className="w-full sm:w-auto py-2 text-xs font-semibold text-stone-500 hover:text-stone-800 text-center"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-orange-600 to-amber-600 px-6 py-3 sm:py-2.5 text-sm font-semibold text-white shadow-md hover:brightness-105 active:scale-95 transition disabled:opacity-50 cursor-pointer"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="size-4 animate-spin" />
                    <span>Reserving Slot...</span>
                  </>
                ) : (
                  <span>Confirm 1-on-1 Mentorship Call →</span>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
