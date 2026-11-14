"use client";

import React, { useState, useEffect } from "react";
import { useUserProfile } from "@/context/UserProfileContext";
import { MENTORS } from "@/data/mentors";
import { Mentor, MentorshipBooking } from "@/types/profile";
import { validateIndianMobile } from "@/lib/storage";

const TIME_SLOTS = [
  "10:00 AM - 10:20 AM IST",
  "11:30 AM - 11:50 AM IST",
  "03:00 PM - 03:20 PM IST",
  "04:30 PM - 04:50 PM IST",
  "06:00 PM - 06:20 PM IST",
  "07:30 PM - 07:50 PM IST",
];

export default function MentorshipBookingModal() {
  const { isBookingModalOpen, closeBookingModal, selectedMentorTrackId, profile } = useUserProfile();

  const [selectedMentor, setSelectedMentor] = useState<Mentor>(MENTORS[0]);
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedSlot, setSelectedSlot] = useState<string>(TIME_SLOTS[1]);
  const [studentName, setStudentName] = useState("");
  const [parentPhone, setParentPhone] = useState("");
  const [primaryQuestion, setPrimaryQuestion] = useState("");
  const [bookingConfirmed, setBookingConfirmed] = useState<MentorshipBooking | null>(null);
  const [phoneError, setPhoneError] = useState("");

  // Sync track when opened
  useEffect(() => {
    if (selectedMentorTrackId) {
      const match = MENTORS.find((m) => m.domainId === selectedMentorTrackId);
      if (match) setSelectedMentor(match);
    }
  }, [selectedMentorTrackId]);

  // Sync profile details
  useEffect(() => {
    if (profile) {
      if (profile.studentName) setStudentName(profile.studentName);
      if (profile.parentPhone) setParentPhone(profile.parentPhone);
    }
  }, [profile, isBookingModalOpen]);

  // Set default date to tomorrow in YYYY-MM-DD
  useEffect(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    setSelectedDate(tomorrow.toISOString().split("T")[0]);
  }, []);

  // Accessibility: Escape key and body scroll lock
  useEffect(() => {
    if (!isBookingModalOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeBookingModal();
    };

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isBookingModalOpen, closeBookingModal]);

  if (!isBookingModalOpen) return null;

  const handleBookSession = (e: React.FormEvent) => {
    e.preventDefault();
    const phoneVal = validateIndianMobile(parentPhone);
    if (!phoneVal.isValid) {
      setPhoneError("Please enter a valid 10-digit Indian WhatsApp number");
      return;
    }
    setPhoneError("");

    const bookingPayload = {
      id: "BK-" + Math.floor(100000 + Math.random() * 900000),
      mentorId: selectedMentor.id,
      mentorName: selectedMentor.name,
      domainTitle: selectedMentor.domainTitle,
      date: selectedDate,
      timeSlot: selectedSlot,
      studentName: studentName.trim() || (profile?.studentName ?? "PTIROS Student"),
      parentPhone: phoneVal.normalized,
      primaryQuestion: primaryQuestion.trim() || "General career & Class 11-12 stream alignment guidance",
      createdAt: new Date().toISOString(),
    };

    // Sync to server database in background
    fetch("/api/bookings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(bookingPayload),
    })
      .then(async (res) => {
        if (res.status === 409) {
          setPhoneError("This time slot was just booked with this mentor. Please select another slot or date.");
        }
      })
      .catch(() => {});

    setBookingConfirmed(bookingPayload);
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
      `🎯 Mentor: ${booking.mentorName} (${booking.domainTitle})\n` +
      `🎓 Student: ${booking.studentName}\n` +
      `💬 Core Dilemma: ${booking.primaryQuestion}\n` +
      `⚡ Platform: Verified PTIROS Gurukul Session (https://ptiros.in)`
    );

    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${dates}&details=${details}&location=Google+Meet`;
  };

  const handleWhatsAppDispatch = (booking: MentorshipBooking) => {
    const text =
      `🏛️ *PTIROS 1-on-1 Gurukul Mentorship Booking Confirmed!*\n\n` +
      `📌 *Booking Ref:* ${booking.id}\n` +
      `🎓 *Student:* ${booking.studentName}\n` +
      `👨‍🏫 *Senior Mentor:* ${booking.mentorName} (${booking.domainTitle})\n` +
      `📅 *Date:* ${booking.date}\n` +
      `⏰ *Slot:* ${booking.timeSlot}\n` +
      `❓ *Primary Dilemma:* ${booking.primaryQuestion}\n\n` +
      `Please connect me with our designated academic mentor on Google Meet. Verified by PTIROS: https://ptiros.in`;

    window.open(`https://api.whatsapp.com/send?phone=919876543210&text=${encodeURIComponent(text)}`, "_blank");
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="booking-title"
      className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-stone-900/70 backdrop-blur-md animate-in fade-in duration-200"
    >
      <div className="relative w-full max-w-2xl max-h-[92vh] overflow-y-auto rounded-3xl bg-white p-6 sm:p-8 shadow-2xl border border-stone-200 text-stone-900">
        {/* Header Bar */}
        <div className="flex items-center justify-between border-b border-stone-100 pb-4">
          <div className="flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-amber-100 text-2xl font-bold text-amber-700">
              🏛️
            </span>
            <div>
              <h2 id="booking-title" className="text-xl font-bold tracking-tight text-stone-900">
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
            className="rounded-full p-2 text-stone-400 hover:bg-stone-100 hover:text-stone-700 transition"
            aria-label="Close modal"
          >
            ✕
          </button>
        </div>

        {bookingConfirmed ? (
          /* CONFIRMATION SCREEN */
          <div className="mt-6 text-center space-y-5 animate-in zoom-in-95 duration-200">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-3xl text-emerald-600">
              ✓
            </div>
            <div>
              <span className="inline-block rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 border border-emerald-200">
                Booking ID: {bookingConfirmed.id}
              </span>
              <h3 className="mt-2 text-2xl font-bold text-stone-900">
                Mentorship Session Scheduled!
              </h3>
              <p className="text-sm text-stone-600 max-w-md mx-auto mt-1">
                Your 20-minute strategy call with <strong>{bookingConfirmed.mentorName}</strong> has been provisionally reserved for <strong>{bookingConfirmed.date}</strong> at <strong>{bookingConfirmed.timeSlot}</strong>.
              </p>
            </div>

            <div className="rounded-2xl border border-amber-200 bg-amber-50/70 p-4 text-left text-xs text-amber-950 space-y-2 max-w-lg mx-auto">
              <div className="font-semibold text-amber-900 flex items-center gap-2">
                <span>📋</span> Session Briefing Checklist:
              </div>
              <p>• Have your latest Class 9/10/11 marksheets or career simulation scores ready.</p>
              <p>• Both the student and at least one parent/guardian are encouraged to attend.</p>
              <p>• A Google Meet video link will be confirmed on WhatsApp to <strong>+91 {bookingConfirmed.parentPhone}</strong>.</p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
              <a
                href={generateGoogleCalendarUrl(bookingConfirmed)}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-stone-300 bg-white px-5 py-2.5 text-xs font-semibold text-stone-800 shadow-sm hover:bg-stone-50 active:scale-95 transition"
              >
                <span>📅</span> Add to Google Calendar
              </a>
              <button
                type="button"
                onClick={() => handleWhatsAppDispatch(bookingConfirmed)}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-xs font-semibold text-white shadow-md hover:bg-emerald-700 active:scale-95 transition"
              >
                <span>💬</span> Confirm via WhatsApp
              </button>
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
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-52 overflow-y-auto pr-1">
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
                      <span className="text-2xl mt-0.5">{m.avatarEmoji}</span>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-stone-900 truncate">{m.name}</span>
                          <span className="text-[10px] font-semibold text-amber-600 bg-amber-100/80 px-1.5 py-0.5 rounded-full">
                            ★ {m.rating}
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
                  placeholder="e.g. Aarav Sharma"
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

            <div className="pt-3 flex items-center justify-between border-t border-stone-100">
              <button
                type="button"
                onClick={closeBookingModal}
                className="text-xs font-semibold text-stone-500 hover:text-stone-800"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="rounded-xl bg-gradient-to-r from-orange-600 to-amber-600 px-6 py-2.5 text-sm font-semibold text-white shadow-md hover:brightness-105 active:scale-95 transition"
              >
                Confirm 1-on-1 Mentorship Call →
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
