"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { useUserProfile } from "@/context/UserProfileContext";
import { useStudentAuth } from "@/context/StudentAuthContext";
import { useScrollLock } from "@/hooks/useScrollLock";
import { validateIndianMobileField, validateStudentName } from "@/lib/formValidation";
import {
  Target,
  BarChart3,
  Globe,
  Compass,
  GraduationCap,
  Briefcase,
  Users,
  Zap,
  Handshake,
  FileText,
  X,
  Check,
  Sparkles,
  ShieldCheck,
  Download,
  Lock,
  Unlock,
  Loader2,
  RefreshCw,
  ExternalLink,
  LucideIcon,
} from "lucide-react";

interface PageTeaser {
  pageNumber: number;
  tier: "free" | "paid";
  title: string;
  badge: string;
  previewPoints: string[];
  icon: LucideIcon;
}

const DOSSIER_PAGES: PageTeaser[] = [
  {
    pageNumber: 1,
    tier: "free",
    title: "Executive Cognitive Profile & Primary Fit",
    badge: "Free Page 1",
    icon: Target,
    previewPoints: [
      "Dynamic 5-axis aptitude score calculated from your scenario decisions",
      "Primary learning archetype and match confidence index",
      "Clean executive summary ready for student & parent review",
    ],
  },
  {
    pageNumber: 2,
    tier: "free",
    title: "How You Think, Learn & Decide",
    badge: "Free Page 2",
    icon: BarChart3,
    previewPoints: [
      "Dominant brain-style zones paired with natural study engine",
      "Decision pattern analysis under tight deadlines",
      "Balanced pacing note tailored to sports & extracurricular load",
    ],
  },
  {
    pageNumber: 3,
    tier: "free",
    title: "Top 3 Career Tracks & Stream Orientation",
    badge: "Free Page 3",
    icon: Globe,
    previewPoints: [
      "Primary (#1), Secondary (#2), and Plan-B (#3) career rankings",
      "Direct test-drive links into realistic workplace simulations",
      "Recommended Class 11–12 academic stream alignment",
    ],
  },
  {
    pageNumber: 4,
    tier: "free",
    title: "Immediate Next Steps & Full Scope",
    badge: "Free Page 4",
    icon: Zap,
    previewPoints: [
      "Immediate 7-day simulator & planner setup tasks",
      "Clear comparison between Free Basic Report & Paid Full Dossier",
      "Direct download as a crisp 4-page PDF snapshot",
    ],
  },
  {
    pageNumber: 5,
    tier: "paid",
    title: "Stream & Subject Safeguards",
    badge: "Paid Page 5",
    icon: Compass,
    previewPoints: [
      "Mandatory core subjects vs dual-eligibility electives",
      "High-risk academic pitfalls to avoid in Class 11 selection",
      "Keeping both #1 and #2 career tracks open together",
    ],
  },
  {
    pageNumber: 6,
    tier: "paid",
    title: "Top Indian Institutions & Exam Routes",
    badge: "Paid Page 6",
    icon: GraduationCap,
    previewPoints: [
      "IITs, IIITs, NLUs, AIIMS, NID/IDC, SRCC & IIM IPM pathways",
      "Primary & backup entrance exams (JEE, NEET, CLAT, UCEED, IPMAT, CUET)",
      "Alternative college routes for your #2 track",
    ],
  },
  {
    pageNumber: 7,
    tier: "paid",
    title: "10-Year Career Growth & Salary Outlook",
    badge: "Paid Page 7",
    icon: Briefcase,
    previewPoints: [
      "Starting Pay (Yr 0–2), Mid-Career, and Senior Lead ranges",
      "Long-term sector demand drivers through 2035",
      "Why portfolio projects boost career trajectory",
    ],
  },
  {
    pageNumber: 8,
    tier: "paid",
    title: "Parent-Child Alignment & Dialogue Guide",
    badge: "Paid Page 8",
    icon: Users,
    previewPoints: [
      "Bridges parent expectations objectively with student aptitude",
      "Calm, data-backed perspective for parents on modern tracks",
      "3 structured dinner-table conversation prompts",
    ],
  },
  {
    pageNumber: 9,
    tier: "paid",
    title: "12-Month Action Plan & Senior Mentor Brief",
    badge: "Paid Page 9",
    icon: Handshake,
    previewPoints: [
      "Grade-specific Q1–Q4 execution milestones",
      "Optional APAAR Student ID guidance",
      "Paired 1-on-1 PTIROS mentor session agenda",
    ],
  },
];

export default function ComprehensiveDossierModal() {
  const { isDossierModalOpen, closeDossierModal, dossierContext, profile } = useUserProfile();
  const { user, careerTests, dossiers, isLoggedIn, refresh } = useStudentAuth();

  const [selectedPageIndex, setSelectedPageIndex] = useState(4);
  const [studentNameDraft, setStudentNameDraft] = useState<string | null>(null);
  const [parentPhoneDraft, setParentPhoneDraft] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [downloadingPdf, setDownloadingPdf] = useState(false);
  const [createdOrderId, setCreatedOrderId] = useState<string | null>(null);
  const [checkingUnlock, setCheckingUnlock] = useState(false);

  const studentNameInput = studentNameDraft ?? user?.name ?? profile?.studentName ?? "";
  const parentPhoneInput = parentPhoneDraft ?? user?.parentPhone ?? profile?.parentPhone ?? "";

  const handleClose = () => {
    setFormError(null);
    setCreatedOrderId(null);
    setStudentNameDraft(null);
    setParentPhoneDraft(null);
    closeDossierModal();
  };

  useScrollLock(isDossierModalOpen);

  useEffect(() => {
    if (!isDossierModalOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setFormError(null);
        setCreatedOrderId(null);
        setStudentNameDraft(null);
        setParentPhoneDraft(null);
        closeDossierModal();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isDossierModalOpen, closeDossierModal]);

  const activeTest = useMemo(() => {
    if (dossierContext?.careerTestId) {
      return careerTests.find((t) => t.id === dossierContext.careerTestId) || careerTests[0];
    }
    return careerTests[0];
  }, [careerTests, dossierContext]);

  const matchingPendingOrder = useMemo(() => {
    if (createdOrderId) {
      return { id: createdOrderId, status: "payment_pending" as const };
    }
    if (!dossiers.length || !activeTest) return null;
    return dossiers.find((d) => d.careerTestId === activeTest.id) || null;
  }, [dossiers, activeTest, createdOrderId]);

  const isUnlocked = Boolean(activeTest?.dossierUnlocked);

  if (!isDossierModalOpen) return null;

  const activePage = DOSSIER_PAGES[selectedPageIndex] || DOSSIER_PAGES[4];
  const ActivePageIcon = activePage.icon;
  const effectiveStudentName = studentNameInput.trim() || user?.name || profile?.studentName || "Student";
  const effectiveTrackTitle =
    dossierContext?.topTrackTitle || activeTest?.topTrackTitle || "PTIROS 360° Career Match";

  const handleDownloadFullPdf = async () => {
    if (!activeTest) return;
    setDownloadingPdf(true);
    setFormError(null);
    try {
      const res = await fetch(
        `/api/student/career-test/${encodeURIComponent(activeTest.id)}/pdf?tier=full`
      );
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        setFormError(err.error || "Complete dossier requires confirmed unlock.");
        setDownloadingPdf(false);
        return;
      }
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      const safeSlug = effectiveStudentName.replace(/[^a-zA-Z0-9]+/g, "-").replace(/^-|-$/g, "") || "Student";
      a.download = `PTIROS-Complete-9Page-Dossier-${safeSlug}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch {
      setFormError("Network error while downloading PDF.");
    } finally {
      setDownloadingPdf(false);
    }
  };

  const handleRequestUnlock = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    const nameCheck = validateStudentName(studentNameInput);
    if (!nameCheck.valid) {
      setFormError(nameCheck.error || "Enter student name");
      return;
    }

    const phoneCheck = validateIndianMobileField(
      parentPhoneInput,
      true,
      "Parent WhatsApp number"
    );
    if (!phoneCheck.valid) {
      setFormError(phoneCheck.error || "Enter a valid 10-digit parent mobile number");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/dossiers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          studentName: studentNameInput.trim(),
          parentPhone: phoneCheck.digits,
          careerTestId: activeTest?.id,
          topTrackTitle: effectiveTrackTitle,
          status: "payment_pending",
        }),
      });
      const json = await res.json();
      if (!res.ok || !json.success || !json.data) {
        setFormError(json.error || "Could not create dossier unlock order");
        setSubmitting(false);
        return;
      }
      setCreatedOrderId(json.data.id);
      if (isLoggedIn) {
        await refresh();
      }
    } catch {
      setFormError("Network error while placing unlock order");
    } finally {
      setSubmitting(false);
    }
  };

  const whatsappText =
    `*PTIROS Complete 9-Page Career Dossier Unlock Request*\n\n` +
    `Order Ref: ${matchingPendingOrder?.id || "New Order"}\n` +
    `Student: ${effectiveStudentName}\n` +
    `Grade: ${activeTest?.grade || user?.grade || profile?.grade || "Class 10"}\n` +
    `Matched Track: ${effectiveTrackTitle}\n` +
    `Parent Mobile: +91 ${parentPhoneInput.replace(/\D/g, "").slice(-10)}\n` +
    `Plan: Complete 9-Page PDF Dossier (₹499 Early Pioneer Pass)`;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="dossier-sample-title"
      data-lenis-prevent
      className="fixed inset-0 z-[1000] flex items-center justify-center p-3 sm:p-4 bg-stone-900/75 backdrop-blur-md animate-in fade-in duration-200 overscroll-contain"
    >
      <div
        data-lenis-prevent
        className="relative w-full max-w-3xl max-h-[90dvh] overflow-y-auto rounded-2xl sm:rounded-3xl bg-white p-4 sm:p-8 shadow-2xl border border-stone-200 text-stone-900 overscroll-contain space-y-5"
      >
        {/* Header Bar */}
        <div className="flex items-start sm:items-center justify-between gap-2 border-b border-stone-100 pb-4">
          <div className="flex items-center gap-3 min-w-0">
            <span className="flex h-10 w-10 sm:h-11 sm:w-11 shrink-0 items-center justify-center rounded-2xl bg-orange-100 text-[#C2410C]">
              <FileText className="size-5" />
            </span>
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h2 id="dossier-sample-title" className="text-base sm:text-xl font-bold tracking-tight text-stone-900">
                  PTIROS Complete 9-Page Career Dossier
                </h2>
                <span className="rounded-full bg-orange-100 px-2.5 py-0.5 text-[10px] font-bold text-[#C2410C] uppercase tracking-wider shrink-0">
                  9-Page Complete Dossier
                </span>
              </div>
              <p className="text-xs text-stone-500 mt-0.5">
                Compare your Free 4-Page Basic Analysis vs. the Full 9-Page Downloadable PDF Dossier
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleClose}
            className="rounded-full p-2 text-stone-400 hover:bg-stone-100 hover:text-stone-700 transition shrink-0 cursor-pointer"
            aria-label="Close modal"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* Free vs Paid Matrix */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div className="rounded-2xl border border-stone-200 bg-stone-50/70 p-3.5">
            <div className="font-bold text-stone-700 flex items-center gap-1.5 mb-1.5">
              <FileText className="size-3.5 text-stone-500" />
              <span>Free Basic Analysis (Pages 1–4)</span>
            </div>
            <ul className="space-y-1 text-stone-500 text-[11px]">
              <li className="flex items-center gap-1.5">
                <Check className="size-3 text-emerald-600 shrink-0" /> Executive Cognitive Profile & Archetype
              </li>
              <li className="flex items-center gap-1.5">
                <Check className="size-3 text-emerald-600 shrink-0" /> 5-Axis Aptitude Scores & Learning Style
              </li>
              <li className="flex items-center gap-1.5">
                <Check className="size-3 text-emerald-600 shrink-0" /> Top 3 Ranked Career Tracks + Free 4-Pg PDF
              </li>
              <li className="text-stone-400 line-through">Detailed College & Entrance Exam Matrix</li>
              <li className="text-stone-400 line-through">10-Year ROI & Parent Dinner-Table Guide</li>
            </ul>
          </div>

          <div className="rounded-2xl border border-orange-200 bg-orange-50/70 p-3.5 ring-1 ring-orange-400/25">
            <div className="font-bold text-orange-950 flex items-center justify-between mb-1.5">
              <span className="flex items-center gap-1.5">
                <Sparkles className="size-3.5 text-[#C2410C]" />
                <span>Complete Paid Dossier (Pages 1–9)</span>
              </span>
              <span className="text-[11px] font-extrabold text-[#C2410C] bg-orange-100 px-2 py-0.5 rounded-full">
                ₹499 Only
              </span>
            </div>
            <ul className="space-y-1 text-orange-950/90 text-[11px]">
              <li className="flex items-center gap-1.5">
                <Check className="size-3 text-[#C2410C] shrink-0" /> All 9 Pages Saved & Downloadable as PDF
              </li>
              <li className="flex items-center gap-1.5">
                <Check className="size-3 text-[#C2410C] shrink-0" /> NEP 2020 Stream & Subject Safeguards
              </li>
              <li className="flex items-center gap-1.5">
                <Check className="size-3 text-[#C2410C] shrink-0" /> Tier-1 Indian Colleges & Exam Strategy
              </li>
              <li className="flex items-center gap-1.5">
                <Check className="size-3 text-[#C2410C] shrink-0" /> 10-Yr Salary Ladders & Parent Alignment Matrix
              </li>
              <li className="flex items-center gap-1.5">
                <Check className="size-3 text-[#C2410C] shrink-0" /> Grade-Specific 12-Month Kaizen Roadmap
              </li>
            </ul>
          </div>
        </div>

        {/* Page Inspector Tabs (1..9) */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-stone-500">
              9-Page Dossier Breakdown (Click to inspect)
            </span>
            <span className="text-xs text-[#C2410C] font-semibold">
              Page {activePage.pageNumber} of {DOSSIER_PAGES.length}
            </span>
          </div>

          <div className="flex gap-1.5 overflow-x-auto pb-2 scrollbar-none">
            {DOSSIER_PAGES.map((page, idx) => {
              const isSelected = selectedPageIndex === idx;
              return (
                <button
                  key={page.pageNumber}
                  type="button"
                  onClick={() => setSelectedPageIndex(idx)}
                  className={`flex items-center gap-1.5 whitespace-nowrap rounded-xl px-3 py-1.5 text-xs font-semibold transition shrink-0 cursor-pointer ${
                    isSelected
                      ? "bg-stone-900 text-white shadow-xs"
                      : page.tier === "paid"
                      ? "bg-orange-50 text-orange-900 hover:bg-orange-100"
                      : "bg-stone-100 text-stone-700 hover:bg-stone-200"
                  }`}
                >
                  {page.tier === "paid" && !isUnlocked ? (
                    <Lock className="size-3 text-[#C2410C]" />
                  ) : (
                    <page.icon className="size-3.5" />
                  )}
                  <span>Pg {page.pageNumber}</span>
                </button>
              );
            })}
          </div>

          <div className="mt-2 rounded-2xl border border-stone-200 bg-[#F7F4EE] p-4 sm:p-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <span className="inline-block rounded-full bg-orange-100 px-2.5 py-0.5 text-[10px] font-bold text-[#C2410C]">
                  {activePage.badge}
                </span>
                <h4 className="mt-1.5 text-sm sm:text-base font-bold text-stone-900 flex items-center gap-2">
                  <ActivePageIcon className="size-4 text-[#C2410C] shrink-0" />
                  <span>{activePage.title}</span>
                </h4>
              </div>
              <div className="rounded-xl border border-stone-200 bg-white px-3 py-1.5 text-right shadow-2xs shrink-0">
                <span className="text-[10px] uppercase font-bold text-stone-400 block">Sheet</span>
                <span className="text-xs sm:text-sm font-black text-stone-900">
                  0{activePage.pageNumber} / 09
                </span>
              </div>
            </div>

            <div className="mt-3 grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              {activePage.previewPoints.map((point, i) => (
                <div
                  key={i}
                  className="rounded-xl bg-white p-3 border border-stone-200/80 text-xs text-stone-700 leading-relaxed"
                >
                  <span className="text-[#C2410C] font-bold block mb-0.5">0{i + 1}.</span>
                  {point}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Unlock / Download Action Box */}
        {formError && (
          <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 font-medium">
            {formError}
          </div>
        )}

        {isUnlocked && activeTest ? (
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50/70 p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <Unlock className="size-5 text-emerald-700 shrink-0 mt-0.5" />
              <div>
                <div className="text-xs font-bold uppercase tracking-wider text-emerald-800">
                  Complete 9-Page Dossier Unlocked
                </div>
                <p className="text-xs text-emerald-900/90 mt-0.5">
                  Your verified 9-page PDF for <strong>{activeTest.topTrackTitle}</strong> is ready to download and saved in your portal.
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={handleDownloadFullPdf}
              disabled={downloadingPdf}
              className="cursor-pointer px-5 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs flex items-center justify-center gap-2 shrink-0 disabled:opacity-60"
            >
              {downloadingPdf ? (
                <Loader2 className="size-3.5 animate-spin" />
              ) : (
                <Download className="size-3.5" />
              )}
              <span>Download Full 9-Page PDF</span>
            </button>
          </div>
        ) : !isLoggedIn ? (
          <div className="rounded-2xl border border-orange-200 bg-orange-50/70 p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="text-xs text-stone-700 space-y-1">
              <strong className="text-stone-900 block">
                Sign in or create an account to save &amp; unlock your 9-Page Dossier
              </strong>
              <span>
                Your Career Match score and unlocked PDF remain saved in your Student Portal across devices.
              </span>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <Link
                href="/signup?next=%2Fdashboard%3Ftab%3Danalysis"
                onClick={handleClose}
                className="px-4 py-2.5 rounded-xl bg-[#C2410C] text-white font-bold text-xs hover:bg-[#9A3412] transition whitespace-nowrap"
              >
                Create Free Account →
              </Link>
              <Link
                href="/login?next=%2Fdashboard%3Ftab%3Danalysis"
                onClick={handleClose}
                className="px-3.5 py-2.5 rounded-xl bg-white border border-stone-200 text-stone-800 font-semibold text-xs hover:bg-stone-50 transition whitespace-nowrap"
              >
                Sign In
              </Link>
            </div>
          </div>
        ) : !activeTest ? (
          <div className="rounded-2xl border border-stone-200 bg-stone-50 p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="text-xs text-stone-700">
              <strong className="text-stone-900 block">Take the 8-Question Career Match Test First</strong>
              <span>Your personalized 9-page PDF is generated directly from your live test scores.</span>
            </div>
            <Link
              href="/career-test"
              onClick={closeDossierModal}
              className="px-4 py-2.5 rounded-xl bg-[#C2410C] text-white font-bold text-xs hover:bg-[#9A3412] transition whitespace-nowrap text-center"
            >
              Take Career Test Now →
            </Link>
          </div>
        ) : matchingPendingOrder ? (
          <div className="rounded-2xl border border-orange-200 bg-orange-50/70 p-4 sm:p-5 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#C2410C]">
                  Unlock Request Recorded • Ref {matchingPendingOrder.id}
                </span>
                <p className="text-xs text-stone-700 mt-0.5">
                  Complete the ₹499 UPI payment with our counselor team on WhatsApp using your order reference, then click &quot;Refresh Unlock Status&quot; here to unlock your 9-page PDF download.
                </p>
              </div>
              <button
                type="button"
                disabled={checkingUnlock}
                onClick={async () => {
                  setCheckingUnlock(true);
                  await refresh();
                  setCreatedOrderId(null);
                  setCheckingUnlock(false);
                }}
                className="px-3.5 py-2 rounded-xl bg-white border border-stone-300 text-xs font-bold text-stone-800 hover:bg-stone-50 inline-flex items-center gap-1.5 shrink-0 cursor-pointer"
              >
                <RefreshCw className={`size-3.5 ${checkingUnlock ? "animate-spin" : ""}`} />
                <span>Refresh Unlock Status</span>
              </button>
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
              <a
                href={`https://api.whatsapp.com/send?phone=919876543210&text=${encodeURIComponent(whatsappText)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold transition"
              >
                <span>Complete ₹499 Unlock via WhatsApp Concierge</span>
                <ExternalLink className="size-3.5" />
              </a>
            </div>
          </div>
        ) : (
          <form
            onSubmit={handleRequestUnlock}
            className="rounded-2xl border border-stone-200 bg-stone-50/80 p-4 space-y-3"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-stone-700 mb-1">
                  Student Name on Dossier *
                </label>
                <input
                  type="text"
                  value={studentNameInput}
                  onChange={(e) => setStudentNameDraft(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 bg-white text-xs"
                  placeholder="Student full name"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-stone-700 mb-1">
                  Parent WhatsApp Mobile *
                </label>
                <input
                  type="tel"
                  value={parentPhoneInput}
                  onChange={(e) => setParentPhoneDraft(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 bg-white text-xs"
                  placeholder="10-digit parent mobile"
                />
              </div>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
              <div className="text-xs text-stone-500 flex items-center gap-1.5">
                <ShieldCheck className="size-4 text-emerald-600 shrink-0" />
                <span>1. Submit request → 2. Pay ₹499 via WhatsApp → 3. Refresh here to download PDF.</span>
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={handleClose}
                  className="rounded-xl border border-stone-300 px-4 py-2.5 text-xs font-semibold text-stone-700 hover:bg-stone-100 cursor-pointer"
                >
                  Close
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="rounded-xl bg-[#C2410C] hover:bg-[#9A3412] px-5 py-2.5 text-xs font-bold text-white shadow-sm transition cursor-pointer inline-flex items-center gap-1.5 disabled:opacity-60"
                >
                  {submitting && <Loader2 className="size-3.5 animate-spin" />}
                  <span>Continue to WhatsApp Unlock (₹499) →</span>
                </button>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
