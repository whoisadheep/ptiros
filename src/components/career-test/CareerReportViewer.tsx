"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import {
  Award,
  BarChart3,
  BookOpen,
  CheckCircle2,
  Download,
  ExternalLink,
  FileText,
  Lock,
  ShieldCheck,
  Sparkles,
  Users,
  Loader2,
} from "lucide-react";
import {
  buildReportPagesFromRecord,
  CAREER_TRACK_BLUEPRINTS,
  type AssessmentStudentContext,
  type CareerTrackId,
} from "@/lib/careerAssessment";
import { generateCareerReportPdfBytes, sanitizePdfText } from "@/lib/pdfGenerator";
import { MENTORS } from "@/data/mentors";
import { useStudentAuth } from "@/context/StudentAuthContext";
import { useUserProfile } from "@/context/UserProfileContext";
import type { StudentCareerTestRecord } from "@/types/database";

interface CareerReportViewerProps {
  record: StudentCareerTestRecord;
  studentContext?: Partial<AssessmentStudentContext>;
  onRetake?: () => void;
  showDashboardLink?: boolean;
}

export default function CareerReportViewer({
  record,
  studentContext,
  onRetake,
  showDashboardLink = true,
}: CareerReportViewerProps) {
  const { user, isLoggedIn } = useStudentAuth();
  const { openDossierModal, openBookingModal } = useUserProfile();

  const [selectedPageIdx, setSelectedPageIdx] = useState(0);
  const [downloadingTier, setDownloadingTier] = useState<"free" | "full" | null>(null);
  const [downloadMsg, setDownloadMsg] = useState<string | null>(null);

  const effectiveContext: AssessmentStudentContext = useMemo(
    () => ({
      studentName: studentContext?.studentName || record.studentName || user?.name || "PTIROS Student",
      grade: studentContext?.grade || record.grade || user?.grade || "Class 10",
      curriculum: studentContext?.curriculum || user?.curriculum,
      city: studentContext?.city || user?.city,
      state: studentContext?.state || user?.state,
      schoolName: studentContext?.schoolName || user?.schoolName,
      parentName:
        studentContext?.parentName ||
        user?.parentName ||
        user?.fatherName ||
        user?.motherName,
      parentDream: studentContext?.parentDream || user?.parentDream,
      lastYearPercentage: studentContext?.lastYearPercentage || user?.lastYearPercentage,
      lastYearRank: studentContext?.lastYearRank || user?.lastYearRank,
      proSports: studentContext?.proSports ?? user?.proSports,
      competitions: studentContext?.competitions || user?.competitions,
      aparId: studentContext?.aparId || user?.aparId,
    }),
    [studentContext, record, user]
  );

  const pages = useMemo(
    () => buildReportPagesFromRecord(record, effectiveContext),
    [record, effectiveContext]
  );

  const topTrack =
    CAREER_TRACK_BLUEPRINTS[record.topTrackId as CareerTrackId] ||
    CAREER_TRACK_BLUEPRINTS["ai-robotics"];
  const pairedMentor = MENTORS.find((m) => m.id === topTrack.mentorId) || MENTORS[0];
  const activePage = pages[selectedPageIdx] || pages[0];
  const isPaidPageLocked = activePage.tier === "paid" && !record.dossierUnlocked;

  const triggerDownload = async (tier: "free" | "full") => {
    setDownloadMsg(null);
    if (tier === "full" && !record.dossierUnlocked) {
      openDossierModal({
        careerTestId: record.id.startsWith("guest_") ? undefined : record.id,
        topTrackTitle: record.topTrackTitle,
      });
      return;
    }

    setDownloadingTier(tier);
    try {
      const safeName =
        sanitizePdfText(record.studentName)
          .replace(/[^a-zA-Z0-9]+/g, "-")
          .replace(/^-|-$/g, "") || "Student";
      const fileName =
        tier === "full"
          ? `PTIROS-Complete-9Page-Dossier-${safeName}.pdf`
          : `PTIROS-Free-Basic-Analysis-${safeName}.pdf`;

      let blob: Blob;
      if (isLoggedIn && !record.id.startsWith("guest_")) {
        const res = await fetch(
          `/api/student/career-test/${encodeURIComponent(record.id)}/pdf?tier=${tier}`
        );
        if (!res.ok) {
          const errJson = await res.json().catch(() => ({}));
          setDownloadMsg(errJson.error || "Could not generate PDF right now.");
          setDownloadingTier(null);
          return;
        }
        blob = await res.blob();
      } else {
        const bytes = await generateCareerReportPdfBytes(record, effectiveContext, tier);
        blob = new Blob([new Uint8Array(bytes)], { type: "application/pdf" });
      }

      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      setDownloadMsg(
        tier === "full"
          ? "Complete 9-page PDF dossier downloaded."
          : "Free 4-page Basic Analysis PDF downloaded."
      );
    } catch (err) {
      console.error("PDF download failed:", err);
      setDownloadMsg("Failed to build PDF. Please try again.");
    } finally {
      setDownloadingTier(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Executive Header Card */}
      <div className="bg-white rounded-3xl p-5 sm:p-8 shadow-sm border border-stone-200/80 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 border-b border-stone-100 pb-5">
          <div className="space-y-2 min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold inline-flex items-center gap-1.5">
                <CheckCircle2 className="size-3.5" />
                {isLoggedIn && !record.id.startsWith("guest_")
                  ? "Saved to Student Portal"
                  : "Free Basic Analysis Ready"}
              </span>
              {record.dossierUnlocked ? (
                <span className="px-3 py-1 rounded-full bg-orange-100 text-orange-800 text-xs font-bold inline-flex items-center gap-1.5">
                  <ShieldCheck className="size-3.5" /> Complete 9-Page Dossier Unlocked
                </span>
              ) : (
                <span className="px-3 py-1 rounded-full bg-stone-100 text-stone-700 text-xs font-semibold">
                  Pages 1–4 Free • Pages 5–9 Paid
                </span>
              )}
            </div>

            <h2 className="text-2xl sm:text-3xl font-display font-bold text-stone-900 leading-tight">
              {record.studentName}&apos;s Career Match: {record.topTrackTitle}
            </h2>
            <p className="text-xs sm:text-sm text-stone-500">
              {record.grade}
              {effectiveContext.curriculum ? ` (${effectiveContext.curriculum})` : ""} • Archetype:{" "}
              <strong className="text-stone-800">{record.archetype}</strong> • Optimal Stream:{" "}
              <strong className="text-stone-800">{record.recommendedStream}</strong>
            </p>
          </div>

          <div className="shrink-0 bg-orange-50 px-5 py-3 rounded-2xl border border-orange-200 text-left sm:text-right">
            <span className="text-[11px] uppercase font-bold tracking-wider text-orange-800 block">
              Match Confidence
            </span>
            <div className="text-3xl font-display font-black text-[#C2410C] tabular-nums">
              {record.matchConfidence}%
            </div>
            <span className="text-[11px] text-orange-700 font-medium">8-Scenario Scoring</span>
          </div>
        </div>

        {/* Cognitive Dimensions + All 6 Career Tracks Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {/* 5 Cognitive Dimensions */}
          <div className="p-5 rounded-2xl bg-[#F7F4EE] border border-stone-200/80 space-y-3.5">
            <div className="flex items-center gap-2">
              <BarChart3 className="size-4 text-[#C2410C]" />
              <h3 className="font-display font-bold text-sm sm:text-base text-stone-900">
                Your 5-Axis Cognitive Superpowers
              </h3>
            </div>
            <div className="space-y-3">
              {record.dimensionScores.map((dim) => (
                <div key={dim.id} className="space-y-1">
                  <div className="flex items-center justify-between text-xs font-semibold text-stone-800">
                    <span>{dim.label}</span>
                    <span className="text-[#C2410C] font-mono font-bold">{dim.score}%</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-white border border-stone-200/60 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-[#C2410C] transition-all duration-500"
                      style={{ width: `${dim.score}%` }}
                    />
                  </div>
                  <p className="text-[11px] text-stone-500 leading-snug">{dim.summary}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Ranked Career Tracks */}
          <div className="p-5 rounded-2xl bg-[#F7F4EE] border border-stone-200/80 space-y-3.5">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <Award className="size-4 text-[#C2410C]" />
                <h3 className="font-display font-bold text-sm sm:text-base text-stone-900">
                  Ranked Career Track Fit
                </h3>
              </div>
              <span className="text-[11px] text-stone-500 font-medium">Top 3 Simulation Links</span>
            </div>

            <div className="space-y-2.5">
              {record.rankedTracks.slice(0, 6).map((tr, idx) => (
                <div
                  key={tr.trackId}
                  className={`p-3 rounded-xl border transition ${
                    idx === 0
                      ? "bg-white border-orange-300 shadow-2xs"
                      : "bg-white/80 border-stone-200/70"
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="min-w-0">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 block">
                        Rank #{idx + 1} • {tr.categoryLabel}
                      </span>
                      <div className="text-xs sm:text-sm font-bold text-stone-900 leading-snug">
                        {tr.trackTitle}
                      </div>
                    </div>
                    <div className="flex items-center gap-2.5 shrink-0">
                      <span
                        className={`text-xs font-mono font-bold px-2 py-0.5 rounded-md ${
                          idx === 0
                            ? "bg-orange-100 text-[#C2410C]"
                            : "bg-stone-100 text-stone-700"
                        }`}
                      >
                        {tr.matchPercent}%
                      </span>
                      {idx < 3 && (
                        <Link
                          href={tr.simulatorUrl}
                          className="text-xs font-bold text-[#C2410C] hover:underline whitespace-nowrap"
                        >
                          Try Lab →
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Download & Save Action Bar */}
        <div className="p-4 sm:p-5 rounded-2xl bg-stone-900 text-white flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="text-xs font-bold uppercase tracking-wider text-orange-300">
              {record.dossierUnlocked
                ? "Complete 9-Page PDF Ready"
                : "Free 4-Page Basic Report Unlocked"}
            </div>
            <p className="text-xs sm:text-sm text-stone-200 max-w-2xl">
              {record.dossierUnlocked
                ? "Your full 9-page Parent-Student Diagnostic Dossier is unlocked and saved to your portal. Download any time."
                : "Download your free 4-page basic snapshot right away, or unlock the full 9-page PDF with entrance exams, salary ladders & mentor blueprint."}
            </p>
            {downloadMsg && (
              <p className="text-xs font-semibold text-emerald-300 pt-1">{downloadMsg}</p>
            )}
          </div>

          <div className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-2.5 shrink-0">
            <button
              type="button"
              onClick={() => triggerDownload("free")}
              disabled={downloadingTier !== null}
              className="cursor-pointer px-4 py-2.5 rounded-xl bg-white text-stone-900 font-bold text-xs hover:bg-stone-100 transition flex items-center justify-center gap-2 disabled:opacity-60"
            >
              {downloadingTier === "free" ? (
                <Loader2 className="size-3.5 animate-spin" />
              ) : (
                <Download className="size-3.5 text-[#C2410C]" />
              )}
              <span>Download Free 4-Page PDF</span>
            </button>

            {record.dossierUnlocked ? (
              <button
                type="button"
                onClick={() => triggerDownload("full")}
                disabled={downloadingTier !== null}
                className="cursor-pointer px-5 py-2.5 rounded-xl bg-[#C2410C] text-white font-bold text-xs hover:bg-[#9A3412] transition flex items-center justify-center gap-2 disabled:opacity-60"
              >
                {downloadingTier === "full" ? (
                  <Loader2 className="size-3.5 animate-spin" />
                ) : (
                  <FileText className="size-3.5" />
                )}
                <span>Download Full 9-Page PDF</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={() =>
                  openDossierModal({
                    careerTestId: record.id.startsWith("guest_") ? undefined : record.id,
                    topTrackTitle: record.topTrackTitle,
                  })
                }
                className="cursor-pointer px-5 py-2.5 rounded-xl bg-[#C2410C] text-white font-bold text-xs hover:bg-[#9A3412] transition flex items-center justify-center gap-2"
              >
                <Sparkles className="size-3.5" />
                <span>Unlock Full 9-Page PDF (₹499) →</span>
              </button>
            )}
          </div>
        </div>

        {/* Guest Save Prompt */}
        {!isLoggedIn && (
          <div className="p-4 rounded-2xl bg-orange-50 border border-orange-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="text-xs text-stone-700">
              <strong className="text-stone-900">Want to save this analysis permanently?</strong>{" "}
              Create your free student account — your test results will attach automatically.
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <Link
                href="/signup?next=%2Fdashboard%3Ftab%3Danalysis"
                className="px-4 py-2 rounded-xl bg-[#C2410C] text-white text-xs font-bold hover:bg-[#9A3412] transition whitespace-nowrap"
              >
                Save to Portal →
              </Link>
              <Link
                href="/login?next=%2Fdashboard%3Ftab%3Danalysis"
                className="px-3 py-2 rounded-xl bg-white border border-stone-200 text-stone-700 text-xs font-semibold hover:bg-stone-50 transition whitespace-nowrap"
              >
                Sign In
              </Link>
            </div>
          </div>
        )}
      </div>

      {/* Multi-Page Interactive Report Explorer (4 Free Pages vs 9 Complete Pages) */}
      <div className="bg-white rounded-3xl p-5 sm:p-8 shadow-sm border border-stone-200/80 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-100 pb-4">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#C2410C] block">
              Your 9-Page Career Report
            </span>
            <h3 className="font-display font-bold text-lg text-stone-900 mt-0.5">
              Read Pages 1–4 Free • {record.dossierUnlocked ? "Pages 5–9 Unlocked" : "What's Inside Pages 5–9"}
            </h3>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {onRetake && (
              <button
                type="button"
                onClick={onRetake}
                className="px-3.5 py-2 rounded-xl border border-stone-200 text-xs font-semibold text-stone-700 hover:bg-stone-50 transition cursor-pointer"
              >
                Retake Assessment
              </button>
            )}
            {showDashboardLink && isLoggedIn && (
              <Link
                href="/dashboard?tab=analysis"
                className="px-3.5 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-xs font-bold text-stone-800 transition inline-flex items-center gap-1.5"
              >
                <span>Open in Dashboard</span>
                <ExternalLink className="size-3" />
              </Link>
            )}
          </div>
        </div>

        {/* Page Selector Pills */}
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
          {pages.map((p, idx) => {
            const isSelected = idx === selectedPageIdx;
            const locked = p.tier === "paid" && !record.dossierUnlocked;
            return (
              <button
                key={p.pageNumber}
                type="button"
                onClick={() => setSelectedPageIdx(idx)}
                className={`shrink-0 px-3 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer border ${
                  isSelected
                    ? "bg-stone-900 text-white border-stone-900"
                    : p.tier === "free"
                    ? "bg-[#F7F4EE] text-stone-800 border-stone-200 hover:border-stone-300"
                    : "bg-orange-50/70 text-orange-900 border-orange-200/80 hover:border-orange-300"
                }`}
              >
                {locked ? <Lock className="size-3 text-[#C2410C]" /> : <BookOpen className="size-3" />}
                <span>Page {p.pageNumber}</span>
                {p.tier === "free" && (
                  <span
                    className={`text-[9px] px-1.5 py-0.2 rounded uppercase ${
                      isSelected ? "bg-white/20 text-white" : "bg-emerald-100 text-emerald-800"
                    }`}
                  >
                    Free
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Selected Page Sheet */}
        <div className="rounded-2xl border border-stone-200 bg-[#FDFBF7] p-5 sm:p-7 space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 border-b border-stone-200/70 pb-4">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#C2410C]">
                {activePage.tag}
              </span>
              <h4 className="text-lg sm:text-xl font-display font-bold text-stone-900 mt-1">
                {activePage.title}
              </h4>
              <p className="text-xs text-stone-500 mt-0.5">{activePage.subtitle}</p>
            </div>
            <span className="text-xs font-mono font-semibold text-stone-500 shrink-0">
              Sheet 0{activePage.pageNumber} / 0{pages.length}
            </span>
          </div>

          {isPaidPageLocked ? (
            <div className="py-6 px-4 rounded-2xl bg-white border border-orange-200 text-center space-y-4">
              <div className="size-11 rounded-2xl bg-orange-100 text-[#C2410C] flex items-center justify-center mx-auto">
                <Lock className="size-5" />
              </div>
              <div className="max-w-lg mx-auto space-y-1.5">
                <h5 className="font-display font-bold text-base text-stone-900">
                  Page {activePage.pageNumber}: {activePage.title}
                </h5>
                <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                  Included in the Paid Complete 9-Page Dossier (₹499 Early Pioneer Pass). Unlocks subject selection safeguards, target Indian colleges &amp; exams, 10-year salary outlook, family conversation guide, and downloadable 9-page PDF.
                </p>
              </div>
              <div className="flex flex-wrap justify-center gap-2.5 pt-1">
                <button
                  type="button"
                  onClick={() =>
                    openDossierModal({
                      careerTestId: record.id.startsWith("guest_") ? undefined : record.id,
                      topTrackTitle: record.topTrackTitle,
                    })
                  }
                  className="cursor-pointer px-5 py-2.5 rounded-xl bg-[#C2410C] text-white font-bold text-xs hover:bg-[#9A3412] transition"
                >
                  Unlock Complete 9-Page Dossier (₹499) →
                </button>
                <button
                  type="button"
                  onClick={() => openBookingModal(topTrack.id)}
                  className="cursor-pointer px-4 py-2.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold text-xs transition inline-flex items-center gap-1.5"
                >
                  <Users className="size-3.5" />
                  <span>Ask Mentor {pairedMentor.name}</span>
                </button>
              </div>
            </div>
          ) : (
            <>
              {activePage.metrics && activePage.metrics.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  {activePage.metrics.map((m, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 rounded-xl bg-white border border-stone-200/80 shadow-2xs"
                    >
                      <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 block">
                        {m.label}
                      </span>
                      <span className="text-sm font-bold text-stone-900 mt-1 block">
                        {m.value}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              <ul className="space-y-3">
                {activePage.bullets.map((b, idx) => (
                  <li
                    key={idx}
                    className="flex items-start gap-2.5 text-xs sm:text-sm text-stone-700 leading-relaxed"
                  >
                    <CheckCircle2 className="size-4 text-[#C2410C] shrink-0 mt-0.5" />
                    <span>{b}</span>
                  </li>
                ))}
              </ul>

              {activePage.callout && (
                <div className="p-4 rounded-xl bg-orange-50/80 border border-orange-200 space-y-1">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-[#C2410C] flex items-center gap-1.5">
                    <ShieldCheck className="size-3.5" />
                    <span>{activePage.callout.title}</span>
                  </div>
                  <p className="text-xs sm:text-sm text-stone-700 leading-relaxed">
                    {activePage.callout.body}
                  </p>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
