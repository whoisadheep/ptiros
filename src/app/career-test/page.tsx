"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useStudentAuth } from "@/context/StudentAuthContext";
import PtiroMascot from "@/components/PtiroMascot";
import CareerReportViewer from "@/components/career-test/CareerReportViewer";
import { CAREER_ASSESSMENT_QUESTIONS } from "@/lib/careerAssessment";
import { STUDENT_GRADES } from "@/lib/studentProfileOptions";
import {
  validateStudentName,
  validateIndianMobileField,
  validateEmailField,
} from "@/lib/formValidation";
import type { StudentCareerTestRecord } from "@/types/database";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  ChevronDown,
  Loader2,
  ShieldCheck,
  Smile,
  Sparkles,
  UserCheck,
} from "lucide-react";

type Step = "setup" | "quiz" | "result";

export default function CareerTestPage() {
  const { user, isLoggedIn, isLoading: authLoading, careerTests, saveCareerTestResult } =
    useStudentAuth();

  const [step, setStep] = useState<Step>("setup");
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [isScoring, setIsScoring] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [activeRecord, setActiveRecord] = useState<StudentCareerTestRecord | null>(null);

  // Draft overrides (when null, automatically derives from signed-in student profile)
  const [studentNameDraft, setStudentNameDraft] = useState<string | null>(null);
  const [gradeDraft, setGradeDraft] = useState<string | null>(null);
  const [dreamDraft, setDreamDraft] = useState<string | null>(null);
  const [parentPhoneDraft, setParentPhoneDraft] = useState<string | null>(null);
  const [parentEmailDraft, setParentEmailDraft] = useState<string | null>(null);
  const [showOptionalContact, setShowOptionalContact] = useState(false);
  const [showAdjustSignedIn, setShowAdjustSignedIn] = useState(false);
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const studentName = studentNameDraft ?? user?.name ?? "";
  const grade = gradeDraft ?? user?.grade ?? "Class 10";
  const childhoodDream = dreamDraft ?? user?.parentDream ?? "";
  const parentPhone = parentPhoneDraft ?? user?.parentPhone ?? "";
  const parentEmail = parentEmailDraft ?? user?.parentEmail ?? "";

  const nameCheck = validateStudentName(studentName);
  const phoneCheck = validateIndianMobileField(parentPhone, false, "Parent mobile");
  const emailCheck = validateEmailField(parentEmail, false, "Parent email");

  const startAssessment = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);
    setTouched({ name: true, parentPhone: true, parentEmail: true });

    if (!isLoggedIn && !nameCheck.valid) {
      document.getElementById("ct-name")?.focus();
      return;
    }
    if (!phoneCheck.valid || !emailCheck.valid) {
      return;
    }

    setCurrentQ(0);
    setAnswers({});
    setStep("quiz");
  };

  const handleAnswerSelect = async (questionId: string, optionId: string) => {
    const updated = { ...answers, [questionId]: optionId };
    setAnswers(updated);

    if (currentQ < CAREER_ASSESSMENT_QUESTIONS.length - 1) {
      setCurrentQ(currentQ + 1);
      return;
    }

    // Completed all 8 questions — evaluate on server and persist if signed in
    setIsScoring(true);
    setSubmitError(null);
    const res = await saveCareerTestResult({
      studentName: (studentName || user?.name || "PTIROS Explorer").trim(),
      grade: grade || user?.grade || "Class 10",
      curriculum: user?.curriculum,
      city: user?.city,
      state: user?.state,
      schoolName: user?.schoolName,
      parentName: user?.parentName || user?.fatherName || user?.motherName,
      parentDream: childhoodDream.trim() || user?.parentDream,
      childhoodDream: childhoodDream.trim() || undefined,
      parentPhone: phoneCheck.digits || user?.parentPhone,
      answers: updated,
    });
    setIsScoring(false);

    if (!res.success || !res.record) {
      setSubmitError("Could not score your diagnostic right now. Please try again.");
      return;
    }

    setActiveRecord(res.record);
    setStep("result");
  };

  const activeQuestion = CAREER_ASSESSMENT_QUESTIONS[currentQ];
  const progressPct = Math.round(
    ((currentQ + 1) / CAREER_ASSESSMENT_QUESTIONS.length) * 100
  );

  return (
    <main className="min-h-screen bg-[#F7F4EE] text-stone-900">
      {/* Header */}
      <header className="border-b border-stone-200/80 bg-[#FDFBF7]/90 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between gap-2">
          <Link
            href={isLoggedIn ? "/dashboard" : "/"}
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-stone-700 hover:text-[#C2410C] transition-colors shrink-0"
          >
            <ArrowLeft className="size-4 shrink-0" />
            <span className="hidden sm:inline">
              {isLoggedIn ? "Back to Dashboard" : "Back to Home"}
            </span>
            <span className="sm:hidden">{isLoggedIn ? "Portal" : "Home"}</span>
          </Link>

          <div className="font-display font-bold text-base sm:text-lg text-stone-900 truncate">
            PTIROS Career Match
          </div>

          <div className="text-[11px] sm:text-xs font-semibold px-3 py-1 rounded-full bg-orange-100 text-[#C2410C] shrink-0 whitespace-nowrap">
            {step === "setup" && "Step 1 of 3 • Quick Ready Check"}
            {step === "quiz" &&
              `Step 2 of 3 • Scenario ${currentQ + 1} / ${CAREER_ASSESSMENT_QUESTIONS.length}`}
            {step === "result" && "Step 3 of 3 • Your Analysis"}
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-10">
        <AnimatePresence mode="wait">
          {/* STEP 1: SETUP (1-Tap for signed-in students, lightweight for guests) */}
          {step === "setup" && (
            <motion.div
              key="setup"
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -14 }}
              className="bg-white rounded-3xl p-6 sm:p-9 shadow-sm border border-stone-200/80 space-y-6"
            >
              {/* Welcome Banner */}
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 p-5 rounded-2xl bg-orange-50/80 border border-orange-200">
                <div className="shrink-0">
                  <PtiroMascot variant="copilot" size={60} showSpeech={false} interactive={false} />
                </div>
                <div className="space-y-1 text-center sm:text-left">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#C2410C]">
                    Zero Stress • No Studying Required
                  </span>
                  <h1 className="text-lg sm:text-2xl font-display font-bold text-stone-900">
                    Discover Which Real Careers Match How You Think
                  </h1>
                  <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                    Just <strong>8 short scenario choices</strong> (3–4 minutes). You&apos;ll unlock a{" "}
                    <strong>Free 4-Page Basic Analysis + Downloadable PDF</strong> immediately, with an
                    optional upgrade to the complete 9-page parent-student dossier.
                  </p>
                </div>
              </div>

              {!authLoading && isLoggedIn && user ? (
                /* SIGNED-IN STUDENT FAST START */
                <form onSubmit={startAssessment} className="space-y-5">
                  <div className="p-4 sm:p-5 rounded-2xl bg-[#F7F4EE] border border-stone-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-start gap-3">
                      <span className="size-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                        <UserCheck className="size-5" />
                      </span>
                      <div>
                        <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700 block">
                          Profile Connected Automatically
                        </span>
                        <p className="text-sm font-bold text-stone-900 mt-0.5">
                          {studentName || user.name} • {grade} ({user.curriculum})
                        </p>
                        <p className="text-xs text-stone-500 mt-0.5">
                          {user.city}
                          {childhoodDream ? ` • Dream: ${childhoodDream}` : ""} • Score saves directly to your Dashboard.
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => setShowAdjustSignedIn((v) => !v)}
                      className="text-xs font-semibold text-stone-600 hover:text-[#C2410C] inline-flex items-center gap-1 self-start sm:self-center shrink-0 cursor-pointer"
                    >
                      <span>{showAdjustSignedIn ? "Hide quick edit" : "Adjust class/curiosity"}</span>
                      <ChevronDown
                        className={`size-3.5 transition-transform ${
                          showAdjustSignedIn ? "rotate-180" : ""
                        }`}
                      />
                    </button>
                  </div>

                  {showAdjustSignedIn && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-2xl border border-stone-200 bg-stone-50/70">
                      <div>
                        <label className="block text-xs font-semibold text-stone-700 mb-1">
                          Class / Grade
                        </label>
                        <select
                          value={grade}
                          onChange={(e) => setGradeDraft(e.target.value)}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 bg-white text-sm"
                        >
                          {STUDENT_GRADES.map((g) => (
                            <option key={g.value} value={g.value}>
                              {g.label}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-stone-700 mb-1">
                          Current Curiosity / Dream
                        </label>
                        <input
                          type="text"
                          value={childhoodDream}
                          onChange={(e) => setDreamDraft(e.target.value)}
                          placeholder="e.g. Robotics, Law, Medicine, Design..."
                          className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 bg-white text-sm"
                        />
                      </div>
                    </div>
                  )}

                  {careerTests.length > 0 && (
                    <div className="p-3.5 rounded-xl bg-white border border-stone-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                      <span className="text-stone-600">
                        You already completed a diagnostic ({careerTests[0].topTrackTitle} •{" "}
                        {careerTests[0].matchConfidence}%).
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          setActiveRecord(careerTests[0]);
                          setStep("result");
                        }}
                        className="font-bold text-[#C2410C] hover:underline text-left cursor-pointer"
                      >
                        View Previous Report →
                      </button>
                    </div>
                  )}

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-1">
                    <div className="flex flex-wrap items-center gap-4 text-xs text-stone-600">
                      <span className="flex items-center gap-1.5">
                        <ShieldCheck className="size-4 text-emerald-600" />
                        8 Scenario Questions
                      </span>
                      <span className="flex items-center gap-1.5">
                        <CheckCircle2 className="size-4 text-emerald-600" />
                        Free 4-Page PDF Ready Instantly
                      </span>
                    </div>

                    <button
                      type="submit"
                      className="cursor-pointer inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl bg-[#C2410C] hover:bg-[#9A3412] text-white font-bold text-sm shadow-sm transition active:scale-[0.98]"
                    >
                      <span>Start 8-Question Diagnostic</span>
                      <ArrowRight className="size-4" />
                    </button>
                  </div>
                </form>
              ) : (
                /* GUEST QUICK SETUP */
                <form onSubmit={startAssessment} noValidate className="space-y-5">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3.5 rounded-xl bg-[#F7F4EE] border border-stone-200 text-xs">
                    <span className="text-stone-700">
                      Already have a PTIROS Student account? Sign in so your test saves automatically.
                    </span>
                    <Link
                      href="/login?next=/career-test"
                      className="font-bold text-[#C2410C] hover:underline shrink-0"
                    >
                      Sign In First →
                    </Link>
                  </div>

                  <div>
                    <h2 className="text-base font-bold text-stone-900 mb-3 flex items-center gap-2">
                      <Smile className="size-4 text-[#C2410C]" /> Quick Setup
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="ct-name" className="block text-xs font-semibold text-stone-800 mb-1">
                          Your Name *
                        </label>
                        <input
                          id="ct-name"
                          type="text"
                          value={studentName}
                          onChange={(e) => setStudentNameDraft(e.target.value)}
                          onBlur={() => setTouched((p) => ({ ...p, name: true }))}
                          placeholder="e.g. Aarav Sharma"
                          className={`w-full px-3.5 py-2.5 rounded-xl border text-sm bg-white focus:outline-none ${
                            touched.name && !nameCheck.valid
                              ? "border-red-500"
                              : "border-stone-300 focus:border-[#C2410C]"
                          }`}
                        />
                        {touched.name && !nameCheck.valid && (
                          <p className="text-xs text-red-600 mt-1">{nameCheck.error}</p>
                        )}
                      </div>

                      <div>
                        <label htmlFor="ct-grade" className="block text-xs font-semibold text-stone-800 mb-1">
                          Current Class *
                        </label>
                        <select
                          id="ct-grade"
                          value={grade}
                          onChange={(e) => setGradeDraft(e.target.value)}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 bg-white text-sm focus:outline-none focus:border-[#C2410C]"
                        >
                          {STUDENT_GRADES.map((g) => (
                            <option key={g.value} value={g.value}>
                              {g.label}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="ct-dream" className="block text-xs font-semibold text-stone-800 mb-1">
                      What are you curious about right now? (Optional)
                    </label>
                    <input
                      id="ct-dream"
                      type="text"
                      value={childhoodDream}
                      onChange={(e) => setDreamDraft(e.target.value)}
                      placeholder="e.g. Robotics, Law, Medicine, Design, Quant Finance, Film..."
                      className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 bg-white text-sm focus:outline-none focus:border-[#C2410C]"
                    />
                  </div>

                  <div className="rounded-2xl border border-stone-200 bg-stone-50/70 p-4">
                    <button
                      type="button"
                      onClick={() => setShowOptionalContact((v) => !v)}
                      className="w-full flex items-center justify-between text-left text-xs font-semibold text-stone-700 hover:text-[#C2410C] cursor-pointer"
                    >
                      <span>[Optional] Add Parent WhatsApp / Email for Parent Briefing Copy</span>
                      <ChevronDown
                        className={`size-4 transition-transform ${
                          showOptionalContact ? "rotate-180" : ""
                        }`}
                      />
                    </button>

                    {showOptionalContact && (
                      <div className="mt-3 pt-3 border-t border-stone-200 grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-semibold text-stone-700 mb-1">
                            Parent Mobile
                          </label>
                          <input
                            type="tel"
                            value={parentPhone}
                            onChange={(e) => setParentPhoneDraft(e.target.value)}
                            onBlur={() => setTouched((p) => ({ ...p, parentPhone: true }))}
                            placeholder="10-digit Indian mobile"
                            className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs bg-white"
                          />
                          {touched.parentPhone && !phoneCheck.valid && (
                            <p className="text-[11px] text-red-600 mt-1">{phoneCheck.error}</p>
                          )}
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-stone-700 mb-1">
                            Parent Email
                          </label>
                          <input
                            type="email"
                            value={parentEmail}
                            onChange={(e) => setParentEmailDraft(e.target.value)}
                            onBlur={() => setTouched((p) => ({ ...p, parentEmail: true }))}
                            placeholder="parent@example.com"
                            className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs bg-white"
                          />
                          {touched.parentEmail && !emailCheck.valid && (
                            <p className="text-[11px] text-red-600 mt-1">{emailCheck.error}</p>
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-1">
                    <div className="flex flex-wrap items-center gap-3 text-xs text-stone-600">
                      <span className="flex items-center gap-1.5">
                        <ShieldCheck className="size-4 text-emerald-600" />
                        100% Free Basic Analysis
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Sparkles className="size-4 text-[#C2410C]" />
                        8 Interactive Scenarios
                      </span>
                    </div>

                    <button
                      type="submit"
                      className="cursor-pointer inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl bg-[#C2410C] hover:bg-[#9A3412] text-white font-bold text-sm shadow-sm transition active:scale-[0.98]"
                    >
                      <span>Start Career Match</span>
                      <ArrowRight className="size-4" />
                    </button>
                  </div>
                </form>
              )}
            </motion.div>
          )}

          {/* STEP 2: 8 SCENARIO QUESTIONS */}
          {step === "quiz" && activeQuestion && (
            <motion.div
              key={`quiz-${activeQuestion.id}`}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              className="bg-white rounded-3xl p-6 sm:p-9 shadow-sm border border-stone-200/80 space-y-6"
            >
              <div>
                <div className="flex justify-between items-center text-xs font-semibold text-stone-500 mb-2">
                  <span>{activeQuestion.category}</span>
                  <span>
                    Question {currentQ + 1} of {CAREER_ASSESSMENT_QUESTIONS.length} ({progressPct}%)
                  </span>
                </div>
                <div className="w-full h-2 rounded-full bg-stone-100 overflow-hidden">
                  <div
                    className="h-full bg-[#C2410C] transition-all duration-300"
                    style={{ width: `${progressPct}%` }}
                  />
                </div>
              </div>

              <div>
                <span className="inline-block px-3 py-1 rounded-full bg-orange-100 text-[#C2410C] text-xs font-bold mb-3">
                  Scenario 0{activeQuestion.number}
                </span>
                <h2 className="text-xl sm:text-2xl font-display font-bold text-stone-900 leading-snug">
                  {activeQuestion.question}
                </h2>
                <p className="text-xs sm:text-sm text-stone-500 mt-1.5">{activeQuestion.hint}</p>
              </div>

              {submitError && (
                <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 font-medium">
                  {submitError}
                </div>
              )}

              <div className="space-y-3">
                {activeQuestion.options.map((opt, idx) => {
                  const isChosen = answers[activeQuestion.id] === opt.id;
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      disabled={isScoring}
                      onClick={() => handleAnswerSelect(activeQuestion.id, opt.id)}
                      className={`w-full text-left p-4 sm:p-5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 group disabled:opacity-60 ${
                        isChosen
                          ? "border-[#C2410C] bg-orange-50/70"
                          : "border-stone-200 hover:border-[#C2410C] hover:bg-orange-50/40"
                      }`}
                    >
                      <div className="flex items-start gap-3.5 min-w-0">
                        <span
                          className={`size-8 rounded-full border flex items-center justify-center font-bold text-xs shrink-0 mt-0.5 transition-colors ${
                            isChosen
                              ? "border-[#C2410C] bg-[#C2410C] text-white"
                              : "border-stone-200 bg-stone-50 text-stone-600 group-hover:border-[#C2410C] group-hover:text-[#C2410C]"
                          }`}
                        >
                          {String.fromCharCode(65 + idx)}
                        </span>
                        <div className="min-w-0">
                          <span className="text-sm sm:text-base font-medium text-stone-900 block leading-snug">
                            {opt.text}
                          </span>
                          <span className="text-[11px] text-stone-400 font-medium mt-1 block">
                            Signal: {opt.traitLabel}
                          </span>
                        </div>
                      </div>
                      <span className="text-xs font-bold text-[#C2410C] shrink-0">
                        {isScoring && currentQ === CAREER_ASSESSMENT_QUESTIONS.length - 1 ? (
                          <Loader2 className="size-4 animate-spin" />
                        ) : (
                          "Choose →"
                        )}
                      </span>
                    </button>
                  );
                })}
              </div>

              <div className="pt-2 flex items-center justify-between border-t border-stone-100">
                <button
                  type="button"
                  disabled={isScoring}
                  onClick={() => {
                    if (currentQ > 0) setCurrentQ(currentQ - 1);
                    else setStep("setup");
                  }}
                  className="text-xs font-semibold text-stone-600 hover:text-stone-900 inline-flex items-center gap-1 cursor-pointer"
                >
                  <ArrowLeft className="size-3.5" />
                  <span>{currentQ > 0 ? "Previous Scenario" : "Back to Setup"}</span>
                </button>
                <span className="text-[11px] text-stone-400">
                  No wrong answers • Instant dynamic fit
                </span>
              </div>
            </motion.div>
          )}

          {/* STEP 3: FREE 4-PAGE BASIC ANALYSIS + PAID 9-PAGE DOSSIER */}
          {step === "result" && activeRecord && (
            <motion.div
              key="result"
              initial={{ opacity: 0, scale: 0.99 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <CareerReportViewer
                record={activeRecord}
                studentContext={{
                  studentName: activeRecord.studentName,
                  grade: activeRecord.grade,
                  parentDream: childhoodDream || user?.parentDream,
                }}
                onRetake={() => {
                  setAnswers({});
                  setCurrentQ(0);
                  setStep("quiz");
                }}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}
