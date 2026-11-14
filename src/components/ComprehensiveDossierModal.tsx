"use client";

import React, { useState, useEffect } from "react";
import { useUserProfile } from "@/context/UserProfileContext";
import { useScrollLock } from "@/hooks/useScrollLock";
import {
  Target,
  Landmark,
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
  LucideIcon,
} from "lucide-react";

interface PageTeaser {
  pageNumber: number;
  title: string;
  badge: string;
  previewPoints: string[];
  icon: LucideIcon;
}

const DOSSIER_PAGES: PageTeaser[] = [
  {
    pageNumber: 1,
    title: "Executive Cognitive Summary & Fit Index",
    badge: "Core Diagnostic",
    icon: Target,
    previewPoints: [
      "Cross-validated score across 5 Career Simulation pillars",
      "Cognitive strength profile vs top 10% Indian cohort",
      "Executive overview tailored for school principals and parents",
    ],
  },
  {
    pageNumber: 2,
    title: "NEP 2020 5+3+3+4 Competency Mapping",
    badge: "Govt Standard",
    icon: Landmark,
    previewPoints: [
      "Alignment with National Education Policy Middle & Secondary stages",
      "Experiential learning credit breakdown for academic transcripts",
      "National Skill Qualification Framework (NSQF) level compatibility",
    ],
  },
  {
    pageNumber: 3,
    title: "RIASEC Holland Hexagon Psychometric Chart",
    badge: "Psychometrics",
    icon: BarChart3,
    previewPoints: [
      "Realistic, Investigative, Artistic, Social, Enterprising, Conventional score map",
      "Inconsistency index detection to weed out peer pressure bias",
      "Sub-cluster work style recommendations",
    ],
  },
  {
    pageNumber: 4,
    title: "3-Tier Indian & Global Career Trajectory",
    badge: "Macro Analysis",
    icon: Globe,
    previewPoints: [
      "Primary track, lateral transition options, and emerging hybrid roles",
      "Automation risk index: How AI will impact this career by 2035",
      "Comparison between domestic Indian market and overseas growth hubs",
    ],
  },
  {
    pageNumber: 5,
    title: "Class 11-12 Stream Combination & Pitfall Guide",
    badge: "Crucial Decision",
    icon: Compass,
    previewPoints: [
      "Exact subject combination strategy (PCM vs PCB vs Commerce with Applied Math)",
      "High-risk academic traps: When coaching institutes misalign with aptitude",
      "Alternate Plan B and Plan C subject electives",
    ],
  },
  {
    pageNumber: 6,
    title: "Top Indian Institutions & Entrance Exam Strategy",
    badge: "Admissions",
    icon: GraduationCap,
    previewPoints: [
      "IITs, NITs, NLUs, AIIMS, BITS, and premier private universities breakdown",
      "Historical cutoff trajectories and seats-per-applicant ratio",
      "Entrance exam prep calendar (JEE, NEET, CLAT, CUET, UCEED, IPMAT)",
    ],
  },
  {
    pageNumber: 7,
    title: "10-Year Economic Outlook & Salary Ladders",
    badge: "Financial ROI",
    icon: Briefcase,
    previewPoints: [
      "Entry-level CTC (₹8L-₹24L) vs 5-Year Mid-Career (₹22L-₹55L) vs Leadership (₹70L+)",
      "Tier 1 campus placements vs off-campus industry demand curves",
      "Education loan payback period calculations",
    ],
  },
  {
    pageNumber: 8,
    title: "Parent-Child Dialogue & Conflict Resolution Matrix",
    badge: "Family Alignment",
    icon: Users,
    previewPoints: [
      "Objective mediation guide for differing parental expectations vs student aptitude",
      "4 structured dinner-table discussion prompts with empirical data",
      "Bridging the generational gap in new-age tech and media careers",
    ],
  },
  {
    pageNumber: 9,
    title: "Kaizen 4-Year Action Checklist (Grades 9-12)",
    badge: "Execution",
    icon: Zap,
    previewPoints: [
      "Quarter-by-quarter milestones: competitions, olympiads, and portfolio projects",
      "Extracurricular activities that genuinely matter to tier-1 admissions",
      "Continuous Hansei reflection points to track growth",
    ],
  },
  {
    pageNumber: 10,
    title: "Senior Gurukul Mentor Action Blueprint",
    badge: "1-on-1 Guidance",
    icon: Handshake,
    previewPoints: [
      "Direct notes from senior industry mentor evaluation",
      "Tailored preparation checklist for 20-minute strategic counseling call",
      "Permanent PTIROS lifetime membership and community access pass",
    ],
  },
];

export default function ComprehensiveDossierModal() {
  const { isDossierModalOpen, closeDossierModal, profile } = useUserProfile();
  const [selectedPageIndex, setSelectedPageIndex] = useState(0);

  // Accessibility: Escape key and body scroll lock
  // Universal scroll lock & Lenis pause
  useScrollLock(isDossierModalOpen);

  // Accessibility: Escape key
  useEffect(() => {
    if (!isDossierModalOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeDossierModal();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isDossierModalOpen, closeDossierModal]);

  if (!isDossierModalOpen) return null;

  const activePage = DOSSIER_PAGES[selectedPageIndex];
  const ActivePageIcon = activePage.icon;

  const handleUnlockDossier = () => {
    const studentName = profile?.studentName || "PTIROS Student";

    // Record order in server database
    fetch("/api/dossiers", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        studentName,
        parentPhone: profile?.parentPhone || "9876543210",
        status: "payment_pending",
      }),
    }).catch(() => {});

    const text =
      `*PTIROS 360° Comprehensive 10-Page Career Dossier Unlock Request*\n\n` +
      `[Student] ${studentName}\n` +
      `[Grade] ${profile?.grade || "Class 10"}\n` +
      `[City] ${profile?.city || "India"}\n` +
      `[Parent Contact] ${profile?.parentPhone ? "+91 " + profile.parentPhone : "Pending"}\n` +
      `[Offer Selected] Full 10-Page Dossier (₹499 Early Pioneer Pass)\n\n` +
      `Please issue our personalized 10-page verified PDF dossier and activate our 1-on-1 Gurukul mentor session: https://ptiros.in`;

    window.open(`https://api.whatsapp.com/send?phone=919876543210&text=${encodeURIComponent(text)}`, "_blank");
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="dossier-sample-title"
      data-lenis-prevent
      className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-stone-900/75 backdrop-blur-md animate-in fade-in duration-200 overscroll-contain"
    >
      <div data-lenis-prevent className="relative w-full max-w-3xl max-h-[92vh] overflow-y-auto rounded-3xl bg-white p-6 sm:p-8 shadow-2xl border border-stone-200 text-stone-900 overscroll-contain">
        {/* Header Bar */}
        <div className="flex items-center justify-between border-b border-stone-100 pb-4">
          <div className="flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-orange-100 text-orange-600">
              <FileText className="size-5" />
            </span>
            <div>
              <div className="flex items-center gap-2">
                <h2 id="dossier-sample-title" className="text-xl font-bold tracking-tight text-stone-900">
                  PTIROS 360° Full Career Dossier
                </h2>
                <span className="rounded-full bg-orange-100 px-2 py-0.5 text-[10px] font-bold text-orange-800 uppercase tracking-wider">
                  10 Pages
                </span>
              </div>
              <p className="text-xs text-stone-500">
                Compare the Free 3-Page Snapshot vs the Complete 10-Page Paid Parent-Student Strategic Dossier
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={closeDossierModal}
            className="rounded-full p-2 text-stone-400 hover:bg-stone-100 hover:text-stone-700 transition"
            aria-label="Close modal"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* Free vs Paid Tier Value Matrix */}
        <div className="mt-4 grid grid-cols-2 gap-3 text-xs">
          <div className="rounded-2xl border border-stone-200 bg-stone-50/60 p-3">
            <div className="font-bold text-stone-600 flex items-center gap-1.5 mb-1">
              <FileText className="size-3.5 text-stone-500" />
              <span>Free Snapshot (Included)</span>
            </div>
            <ul className="space-y-1 text-stone-500 text-[11px]">
              <li className="flex items-center gap-1">
                <Check className="size-3 text-stone-400" /> Basic 3-Page Summary
              </li>
              <li className="flex items-center gap-1">
                <Check className="size-3 text-stone-400" /> Top Career Category Match
              </li>
              <li className="flex items-center gap-1">
                <Check className="size-3 text-stone-400" /> General Salary Range
              </li>
              <li className="text-stone-400 line-through">Detailed College Cutoff Matrix</li>
              <li className="text-stone-400 line-through">1-on-1 Mentor Strategy Call</li>
            </ul>
          </div>

          <div className="rounded-2xl border border-orange-200 bg-orange-50/70 p-3 ring-1 ring-orange-400/30">
            <div className="font-bold text-orange-950 flex items-center justify-between mb-1">
              <span className="flex items-center gap-1.5">
                <Sparkles className="size-3.5 text-orange-600" />
                <span>Full 10-Page Dossier</span>
              </span>
              <span className="text-[11px] font-extrabold text-orange-700 bg-orange-100 px-2 py-0.5 rounded-full">
                ₹499 Only
              </span>
            </div>
            <ul className="space-y-1 text-orange-900 text-[11px]">
              <li className="flex items-center gap-1">
                <Check className="size-3 text-orange-600" /> All 10 In-Depth Diagnostic Modules
              </li>
              <li className="flex items-center gap-1">
                <Check className="size-3 text-orange-600" /> NEP 2020 Transcript Credential
              </li>
              <li className="flex items-center gap-1">
                <Check className="size-3 text-orange-600" /> Subject Stream & Coaching Strategy
              </li>
              <li className="flex items-center gap-1">
                <Check className="size-3 text-orange-600" /> Parent-Child Dinner Mediation Guide
              </li>
              <li className="flex items-center gap-1">
                <Check className="size-3 text-orange-600" /> Priority 1-on-1 Mentor Reservation
              </li>
            </ul>
          </div>
        </div>

        {/* Page Preview Carousel / Tabs */}
        <div className="mt-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-stone-500">
              Interactive Page Inspector (Click to explore)
            </span>
            <span className="text-xs text-orange-600 font-semibold">
              Page {activePage.pageNumber} of {DOSSIER_PAGES.length}
            </span>
          </div>

          {/* Horizontal scrollable tab chips */}
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
            {DOSSIER_PAGES.map((page, idx) => {
              const isSelected = selectedPageIndex === idx;
              const PageIcon = page.icon;
              return (
                <button
                  key={page.pageNumber}
                  type="button"
                  onClick={() => setSelectedPageIndex(idx)}
                  className={`flex items-center gap-1.5 whitespace-nowrap rounded-xl px-3 py-1.5 text-xs font-medium transition shrink-0 cursor-pointer ${
                    isSelected
                      ? "bg-stone-900 text-white shadow-sm"
                      : "bg-stone-100 text-stone-600 hover:bg-stone-200"
                  }`}
                >
                  <PageIcon className="size-3.5" />
                  <span>Pg {page.pageNumber}</span>
                </button>
              );
            })}
          </div>

          {/* Selected Page Teaser Card */}
          <div className="mt-3 rounded-2xl border border-stone-200 bg-stone-50/50 p-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <span className="inline-block rounded-full bg-orange-100 px-2.5 py-0.5 text-[10px] font-bold text-orange-800">
                  {activePage.badge}
                </span>
                <h4 className="mt-1.5 text-base font-bold text-stone-900 flex items-center gap-2">
                  <ActivePageIcon className="size-4 text-orange-600" />
                  <span>{activePage.title}</span>
                </h4>
              </div>
              <div className="rounded-xl border border-stone-200 bg-white px-3 py-1.5 text-right shadow-sm shrink-0">
                <span className="text-[10px] uppercase font-bold text-stone-400 block">Dossier Sheet</span>
                <span className="text-sm font-black text-stone-900">0{activePage.pageNumber} / 10</span>
              </div>
            </div>

            <div className="mt-4 space-y-2">
              <span className="text-xs font-semibold text-stone-600 block">
                What this section reveals for {profile?.studentName || "your child"}:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                {activePage.previewPoints.map((point, i) => (
                  <div key={i} className="rounded-xl bg-white p-3 border border-stone-200/80 shadow-xs text-xs text-stone-700 leading-relaxed">
                    <span className="text-orange-500 font-bold block mb-1">0{i + 1}.</span>
                    {point}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Footer CTAs */}
        <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-stone-100 pt-4">
          <div className="text-xs text-stone-500 text-center sm:text-left flex items-center gap-1.5">
            <ShieldCheck className="size-4 text-stone-600 shrink-0" />
            <span>Includes Instant PDF Download + 20-min 1-on-1 Mentor strategy call.</span>
          </div>
          <div className="flex gap-2 w-full sm:w-auto">
            <button
              type="button"
              onClick={closeDossierModal}
              className="flex-1 sm:flex-none rounded-xl border border-stone-300 px-4 py-2.5 text-xs font-semibold text-stone-700 hover:bg-stone-50 cursor-pointer"
            >
              Close Preview
            </button>
            <button
              type="button"
              onClick={handleUnlockDossier}
              className="flex-1 sm:flex-none rounded-xl bg-gradient-to-r from-orange-600 to-amber-600 px-6 py-2.5 text-xs font-bold text-white shadow-lg hover:brightness-105 active:scale-95 transition cursor-pointer"
            >
              Unlock 10-Page Dossier (₹499) →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
