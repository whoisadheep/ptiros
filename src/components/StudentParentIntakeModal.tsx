"use client";

import React, { useState, useEffect } from "react";
import { useUserProfile } from "@/context/UserProfileContext";
import { StudentGrade, SchoolCurriculum, ParentDreamOption } from "@/types/profile";
import { validateIndianMobile } from "@/lib/storage";

const GRADES: StudentGrade[] = [
  "Class 6",
  "Class 7",
  "Class 8",
  "Class 9",
  "Class 10",
  "Class 11",
  "Class 12",
  "Dropper / UG 1st Yr",
];

const CURRICULA: SchoolCurriculum[] = [
  "CBSE",
  "ICSE",
  "IB",
  "Cambridge",
  "State Board",
  "Other",
];

const PARENT_DREAMS: ParentDreamOption[] = [
  "Wants stable engineering/technology career",
  "Wants stable medical/healthcare career",
  "Wants to support creative/design passion",
  "Needs clarity between Commerce vs Tech",
  "Seeking corporate law & public leadership",
  "Planning foreign undergraduate admissions",
  "Open to child's discovered aptitude",
  "Other",
];

export default function StudentParentIntakeModal() {
  const { isIntakeModalOpen, closeIntakeModal, profile, saveProfile } = useUserProfile();

  const [step, setStep] = useState<1 | 2>(1);

  // Form State
  const [studentName, setStudentName] = useState("");
  const [grade, setGrade] = useState<StudentGrade>("Class 10");
  const [schoolName, setSchoolName] = useState("");
  const [city, setCity] = useState("");
  const [curriculum, setCurriculum] = useState<SchoolCurriculum>("CBSE");

  const [parentName, setParentName] = useState("");
  const [parentPhone, setParentPhone] = useState("");
  const [parentDream, setParentDream] = useState<ParentDreamOption>("Open to child's discovered aptitude");
  const [parentDreamCustom, setParentDreamCustom] = useState("");

  const [phoneError, setPhoneError] = useState("");

  // Sync existing profile if editing
  useEffect(() => {
    if (profile) {
      setStudentName(profile.studentName || "");
      setGrade(profile.grade || "Class 10");
      setSchoolName(profile.schoolName || "");
      setCity(profile.city || "");
      setCurriculum(profile.curriculum || "CBSE");
      setParentName(profile.parentName || "");
      setParentPhone(profile.parentPhone || "");
      setParentDream(profile.parentDream || "Open to child's discovered aptitude");
      setParentDreamCustom(profile.parentDreamCustom || "");
    }
  }, [profile, isIntakeModalOpen]);

  // Accessibility: Escape key and body scroll lock
  useEffect(() => {
    if (!isIntakeModalOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeIntakeModal();
    };

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isIntakeModalOpen, closeIntakeModal]);

  if (!isIntakeModalOpen) return null;

  const handleNextStep = (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentName.trim()) return;
    setStep(2);
  };

  const handleFinalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const phoneVal = validateIndianMobile(parentPhone);
    if (!phoneVal.isValid) {
      setPhoneError("Please enter a valid 10-digit Indian mobile number (e.g. 9876543210)");
      return;
    }
    setPhoneError("");

    saveProfile({
      studentName: studentName.trim(),
      grade,
      schoolName: schoolName.trim() || undefined,
      city: city.trim() || "India",
      curriculum,
      parentName: parentName.trim() || "Parent/Guardian",
      parentPhone: phoneVal.normalized,
      parentDream,
      parentDreamCustom: parentDream === "Other" ? parentDreamCustom.trim() : undefined,
    });

    closeIntakeModal();
    setStep(1);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="intake-title"
      className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-stone-900/70 backdrop-blur-md animate-in fade-in duration-200"
    >
      <div className="relative w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-3xl bg-white p-6 sm:p-8 shadow-2xl border border-stone-200 text-stone-900">
        {/* Header Bar */}
        <div className="flex items-center justify-between border-b border-stone-100 pb-4">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-orange-100 text-xl font-bold text-orange-600">
              {step === 1 ? "🎓" : "👨‍👩‍👦"}
            </span>
            <div>
              <h2 id="intake-title" className="text-xl font-bold tracking-tight text-stone-900">
                {step === 1 ? "Student Profile Setup" : "Parent Alignment & Aspiration"}
              </h2>
              <p className="text-xs text-stone-500">
                {step === 1
                  ? "Step 1 of 2: Demographics for personalized career simulations"
                  : "Step 2 of 2: Harmonizing student aptitude with family vision"}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={closeIntakeModal}
            className="rounded-full p-2 text-stone-400 hover:bg-stone-100 hover:text-stone-700 transition"
            aria-label="Close modal"
          >
            ✕
          </button>
        </div>

        {/* Progress Bar */}
        <div className="mt-4 flex gap-2">
          <div
            className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
              step >= 1 ? "bg-orange-600" : "bg-stone-200"
            }`}
          />
          <div
            className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
              step === 2 ? "bg-orange-600" : "bg-stone-200"
            }`}
          />
        </div>

        {step === 1 ? (
          /* STEP 1: STUDENT DEMOGRAPHICS */
          <form onSubmit={handleNextStep} className="mt-6 space-y-4">
            <div>
              <label htmlFor="student-name" className="block text-xs font-semibold uppercase tracking-wider text-stone-600 mb-1">
                Student Full Name <span className="text-orange-600">*</span>
              </label>
              <input
                id="student-name"
                type="text"
                required
                placeholder="e.g. Aarav Sharma"
                value={studentName}
                onChange={(e) => setStudentName(e.target.value)}
                className="w-full rounded-xl border border-stone-300 px-4 py-2.5 text-sm focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="student-grade" className="block text-xs font-semibold uppercase tracking-wider text-stone-600 mb-1">
                  Current Grade / Class <span className="text-orange-600">*</span>
                </label>
                <select
                  id="student-grade"
                  value={grade}
                  onChange={(e) => setGrade(e.target.value as StudentGrade)}
                  className="w-full rounded-xl border border-stone-300 px-3 py-2.5 text-sm focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20 bg-white"
                >
                  {GRADES.map((g) => (
                    <option key={g} value={g}>
                      {g}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="student-curriculum" className="block text-xs font-semibold uppercase tracking-wider text-stone-600 mb-1">
                  School Curriculum <span className="text-orange-600">*</span>
                </label>
                <select
                  id="student-curriculum"
                  value={curriculum}
                  onChange={(e) => setCurriculum(e.target.value as SchoolCurriculum)}
                  className="w-full rounded-xl border border-stone-300 px-3 py-2.5 text-sm focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20 bg-white"
                >
                  {CURRICULA.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="school-name" className="block text-xs font-semibold uppercase tracking-wider text-stone-600 mb-1">
                  School Name (Optional)
                </label>
                <input
                  id="school-name"
                  type="text"
                  placeholder="e.g. DPS R.K. Puram"
                  value={schoolName}
                  onChange={(e) => setSchoolName(e.target.value)}
                  className="w-full rounded-xl border border-stone-300 px-4 py-2.5 text-sm focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20"
                />
              </div>

              <div>
                <label htmlFor="student-city" className="block text-xs font-semibold uppercase tracking-wider text-stone-600 mb-1">
                  City / State <span className="text-orange-600">*</span>
                </label>
                <input
                  id="student-city"
                  type="text"
                  required
                  placeholder="e.g. Delhi NCR, Jaipur, Bengaluru"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full rounded-xl border border-stone-300 px-4 py-2.5 text-sm focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20"
                />
              </div>
            </div>

            <div className="pt-4 flex items-center justify-between border-t border-stone-100">
              <button
                type="button"
                onClick={closeIntakeModal}
                className="text-xs font-semibold text-stone-500 hover:text-stone-800"
              >
                Skip for now
              </button>
              <button
                type="submit"
                className="rounded-xl bg-gradient-to-r from-orange-600 to-amber-600 px-6 py-2.5 text-sm font-semibold text-white shadow-md hover:brightness-105 active:scale-95 transition"
              >
                Continue to Parent Alignment →
              </button>
            </div>
          </form>
        ) : (
          /* STEP 2: PARENT ALIGNMENT */
          <form onSubmit={handleFinalSubmit} className="mt-6 space-y-4">
            <div className="rounded-xl bg-amber-50/80 p-3.5 border border-amber-200/80 text-xs text-amber-900 leading-relaxed">
              💡 <strong>Why we ask this:</strong> PTIROS creates an executive Parent Dossier with dinner table conversation prompts to prevent family conflict during Class 11-12 stream selection.
            </div>

            <div>
              <label htmlFor="parent-name" className="block text-xs font-semibold uppercase tracking-wider text-stone-600 mb-1">
                Parent / Guardian Full Name <span className="text-orange-600">*</span>
              </label>
              <input
                id="parent-name"
                type="text"
                required
                placeholder="e.g. Rajesh Sharma"
                value={parentName}
                onChange={(e) => setParentName(e.target.value)}
                className="w-full rounded-xl border border-stone-300 px-4 py-2.5 text-sm focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20"
              />
            </div>

            <div>
              <label htmlFor="parent-phone" className="block text-xs font-semibold uppercase tracking-wider text-stone-600 mb-1">
                Parent WhatsApp Number <span className="text-orange-600">*</span>
              </label>
              <div className="flex">
                <span className="inline-flex items-center rounded-l-xl border border-r-0 border-stone-300 bg-stone-100 px-3.5 text-sm font-medium text-stone-600">
                  +91
                </span>
                <input
                  id="parent-phone"
                  type="tel"
                  required
                  placeholder="9876543210"
                  value={parentPhone}
                  onChange={(e) => {
                    setParentPhone(e.target.value);
                    if (phoneError) setPhoneError("");
                  }}
                  className={`w-full rounded-r-xl border px-4 py-2.5 text-sm focus:outline-none focus:ring-2 ${
                    phoneError
                      ? "border-red-500 focus:ring-red-400/20"
                      : "border-stone-300 focus:border-orange-500 focus:ring-orange-500/20"
                  }`}
                />
              </div>
              {phoneError && <p className="mt-1 text-xs text-red-600">{phoneError}</p>}
            </div>

            <div>
              <label htmlFor="parent-dream" className="block text-xs font-semibold uppercase tracking-wider text-stone-600 mb-1">
                Parent’s Primary Aspiration for Child <span className="text-orange-600">*</span>
              </label>
              <select
                id="parent-dream"
                value={parentDream}
                onChange={(e) => setParentDream(e.target.value as ParentDreamOption)}
                className="w-full rounded-xl border border-stone-300 px-3 py-2.5 text-sm focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20 bg-white"
              >
                {PARENT_DREAMS.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>

            {parentDream === "Other" && (
              <div>
                <label htmlFor="parent-custom" className="block text-xs font-semibold uppercase tracking-wider text-stone-600 mb-1">
                  Specify Aspiration / Career Dream
                </label>
                <input
                  id="parent-custom"
                  type="text"
                  placeholder="Describe parental perspective..."
                  value={parentDreamCustom}
                  onChange={(e) => setParentDreamCustom(e.target.value)}
                  className="w-full rounded-xl border border-stone-300 px-4 py-2.5 text-sm focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20"
                />
              </div>
            )}

            <div className="pt-4 flex items-center justify-between border-t border-stone-100">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="text-xs font-semibold text-stone-500 hover:text-stone-800"
              >
                ← Back to Student Details
              </button>
              <button
                type="submit"
                className="rounded-xl bg-gradient-to-r from-orange-600 to-amber-600 px-6 py-2.5 text-sm font-semibold text-white shadow-md hover:brightness-105 active:scale-95 transition"
              >
                Save Profile & Personalize Platform ✓
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
