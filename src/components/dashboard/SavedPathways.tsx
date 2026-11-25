"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import {
  Bookmark,
  Heart,
  Briefcase,
  TrendingUp,
  Building,
  GraduationCap,
  Sparkles,
  Gamepad2,
  Users,
  Check,
  Plus,
  ArrowUpRight,
  ShieldAlert,
  Compass,
} from "lucide-react";
import { StudentSavedPathway } from "@/types/database";

interface SavedPathwaysProps {
  userId?: string;
  onNavigateTab?: (tab: string) => void;
}

const ALL_MASTER_PATHWAYS: StudentSavedPathway[] = [
  {
    id: "pw_ai_systems",
    trackId: "ai-systems",
    title: "AI & Distributed Systems Architecture",
    domain: "Computer Science & Engineering",
    status: "primary",
    entrySalary: "₹18 - 32 LPA",
    seniorSalary: "₹65 - 1.2 Cr+",
    targetColleges: ["IIT Bombay", "IIT Delhi", "BITS Pilani", "Stanford University"],
    streamRequired: "PCM (Physics, Chem, Math) + Computer Science",
    exams: ["JEE Advanced", "JEE Main", "BITSAT"],
    simulationTrackId: "engineering",
    savedAt: "2026-10-01T10:00:00Z",
  },
  {
    id: "pw_corporate_law",
    trackId: "corporate-law",
    title: "Corporate Law, M&A & Tech Governance",
    domain: "Law, Governance & Public Policy",
    status: "primary",
    entrySalary: "₹16 - 28 LPA",
    seniorSalary: "₹75 - 1.8 Cr+",
    targetColleges: ["NLSIU Bengaluru", "NALSAR Hyderabad", "WBNUJS Kolkata", "Oxford Law"],
    streamRequired: "Any Stream (Humanities, Commerce, or Science) + Legal Studies",
    exams: ["CLAT", "AILET"],
    simulationTrackId: "law",
    savedAt: "2026-10-05T11:00:00Z",
  },
  {
    id: "pw_precision_medicine",
    trackId: "precision-medicine",
    title: "Precision BioTech & Clinical Medicine",
    domain: "Healthcare, BioTech & Clinical Sciences",
    status: "primary",
    entrySalary: "₹14 - 24 LPA",
    seniorSalary: "₹50 - 1.1 Cr+",
    targetColleges: ["AIIMS New Delhi", "CMC Vellore", "JIPMER", "Johns Hopkins"],
    streamRequired: "PCB (Physics, Chemistry, Biology) + BioTechnology",
    exams: ["NEET-UG", "USMLE (for US residencies)"],
    simulationTrackId: "medicine",
    savedAt: "2026-10-10T09:00:00Z",
  },
  {
    id: "pw_quant_finance",
    trackId: "quant-finance",
    title: "Quantitative Finance & Algorithmic Trading",
    domain: "Financial Engineering & Applied Mathematics",
    status: "considering",
    entrySalary: "₹30 - 55 LPA",
    seniorSalary: "₹1.5 - 3.5 Cr+",
    targetColleges: ["IIT Kharagpur", "IIT Kanpur", "ISI Kolkata", "Wharton / CMU"],
    streamRequired: "PCM + Higher Applied Mathematics & Statistics",
    exams: ["JEE Advanced", "ISI Entrance Exam"],
    simulationTrackId: "finance",
    savedAt: "2026-10-15T14:00:00Z",
  },
  {
    id: "pw_ux_product",
    trackId: "ux-product",
    title: "Product Architecture & Human-AI Experience Design",
    domain: "Design & Technology Integration",
    status: "backup",
    entrySalary: "₹12 - 22 LPA",
    seniorSalary: "₹45 - 90 LPA",
    targetColleges: ["NID Ahmedabad", "IDC - IIT Bombay", "Srishti Institute", "Rhode Island School of Design"],
    streamRequired: "Any Stream + Portfolio & Creative Thinking",
    exams: ["UCEED", "NID DAT"],
    simulationTrackId: "ux-design",
    savedAt: "2026-10-20T16:00:00Z",
  },
  {
    id: "pw_creative_media",
    trackId: "creative-media",
    title: "Interactive Media & Virtual World Systems",
    domain: "Creative Media & Real-Time Engines",
    status: "considering",
    entrySalary: "₹10 - 20 LPA",
    seniorSalary: "₹40 - 85 LPA",
    targetColleges: ["FTII Pune", "Whistling Woods", "USC School of Cinematic Arts"],
    streamRequired: "Any Stream + Visual Storytelling & Tech Tools",
    exams: ["JET", "Creative Aptitude Evaluation"],
    simulationTrackId: "media",
    savedAt: "2026-10-25T11:30:00Z",
  },
];

export default function SavedPathways({ userId = "", onNavigateTab }: SavedPathwaysProps) {
  const storageKey = userId ? `ptiros_saved_pathways_${userId}` : "";
  const [savedTrackIds, setSavedTrackIds] = useState<string[]>([]);
  const [activeFilter, setActiveFilter] = useState<"all" | "primary" | "considering" | "backup">("all");

  useEffect(() => {
    if (storageKey) {
      try {
        const stored = localStorage.getItem(storageKey);
        if (stored !== null) {
          const parsed: string[] = JSON.parse(stored);
          if (Array.isArray(parsed)) {
            setSavedTrackIds(parsed);
            return;
          }
        }
      } catch {}
    }

    setSavedTrackIds([]);
  }, [userId, storageKey]);

  const toggleSavePathway = (trackId: string) => {
    const next = savedTrackIds.includes(trackId)
      ? savedTrackIds.filter((id) => id !== trackId)
      : [...savedTrackIds, trackId];

    setSavedTrackIds(next);
    if (!storageKey) return;
    try {
      localStorage.setItem(storageKey, JSON.stringify(next));
    } catch {}
  };

  const savedList = useMemo(() => {
    return ALL_MASTER_PATHWAYS.filter((p) => savedTrackIds.includes(p.trackId));
  }, [savedTrackIds]);

  const filteredList = useMemo(() => {
    if (activeFilter === "all") return savedList;
    return savedList.filter((p) => p.status === activeFilter);
  }, [savedList, activeFilter]);

  return (
    <div className="space-y-6">
      {/* 1. Header Banner */}
      <div className="bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-7 border border-stone-200/80 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-stone-100">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-orange-100 text-orange-800 text-[11px] font-bold uppercase tracking-wider mb-2">
              <Bookmark className="size-3 text-orange-600" />
              Saved Careers & Pathways
            </div>
            <h2 className="text-lg sm:text-xl font-display font-bold text-stone-900">
              Your Bookmarked Flight Paths & University Targets
            </h2>
            <p className="text-xs text-stone-500 mt-1 max-w-2xl leading-relaxed">
              Compare salary trajectories, high school stream combinations, and admission entrance exams for the careers you are evaluating.
            </p>
          </div>

          <Link
            href="/roadmaps"
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-white text-xs font-bold shadow-xs transition active:scale-95 cursor-pointer shrink-0"
          >
            <Compass className="size-4 text-orange-400" />
            <span>Explore All Roadmaps</span>
          </Link>
        </div>

        {/* Status Filter Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setActiveFilter("all")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
              activeFilter === "all" ? "bg-stone-900 text-white shadow-xs" : "bg-stone-100 text-stone-600 hover:bg-stone-200"
            }`}
          >
            All Saved ({savedList.length})
          </button>
          <button
            onClick={() => setActiveFilter("primary")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
              activeFilter === "primary" ? "bg-orange-600 text-white shadow-xs" : "bg-stone-100 text-stone-600 hover:bg-stone-200"
            }`}
          >
            Primary Target
          </button>
          <button
            onClick={() => setActiveFilter("considering")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
              activeFilter === "considering" ? "bg-stone-900 text-white shadow-xs" : "bg-stone-100 text-stone-600 hover:bg-stone-200"
            }`}
          >
            Actively Considering
          </button>
          <button
            onClick={() => setActiveFilter("backup")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
              activeFilter === "backup" ? "bg-stone-900 text-white shadow-xs" : "bg-stone-100 text-stone-600 hover:bg-stone-200"
            }`}
          >
            Backup Plan
          </button>
        </div>
      </div>

      {/* 2. Saved Pathways Grid */}
      {filteredList.length === 0 ? (
        <div className="bg-white rounded-2xl sm:rounded-3xl p-8 border border-dashed border-stone-300 text-center space-y-2">
          <Bookmark className="size-8 text-stone-300 mx-auto" />
          <p className="text-sm font-semibold text-stone-800">
            {savedList.length === 0 ? "No Saved Career Pathways Yet" : "No Pathways in This Filter"}
          </p>
          <p className="text-xs text-stone-500 max-w-md mx-auto">
            Click the heart icon on any career in the library below to bookmark streams, entrance exams, and Indian salary benchmarks to your portal.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredList.map((pw) => (
          <div
            key={pw.id}
            className="bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-6 border border-stone-200/80 shadow-xs hover:border-orange-300 transition-all flex flex-col justify-between space-y-4"
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 block mb-1">
                    {pw.domain}
                  </span>
                  <h3 className="text-base sm:text-lg font-bold text-stone-900 font-display">
                    {pw.title}
                  </h3>
                </div>

                <button
                  onClick={() => toggleSavePathway(pw.trackId)}
                  className="p-2 rounded-xl bg-orange-50 text-orange-600 hover:bg-orange-100 transition cursor-pointer shrink-0"
                  title="Remove from saved"
                >
                  <Heart className="size-4 fill-orange-600" />
                </button>
              </div>

              {/* Salary Ladder */}
              <div className="grid grid-cols-2 gap-2 p-3 rounded-xl bg-stone-50 border border-stone-200/70 text-xs">
                <div>
                  <span className="text-[10px] text-stone-400 font-semibold block">Entry Level (0-2 Yrs)</span>
                  <strong className="text-stone-900 font-bold">{pw.entrySalary}</strong>
                </div>
                <div>
                  <span className="text-[10px] text-stone-400 font-semibold block">Senior / Lead (8+ Yrs)</span>
                  <strong className="text-orange-700 font-bold">{pw.seniorSalary}</strong>
                </div>
              </div>

              {/* Stream Prerequisite */}
              <div className="space-y-1.5 text-xs">
                <div className="flex items-start gap-1.5 text-stone-600">
                  <GraduationCap className="size-3.5 text-stone-400 mt-0.5 shrink-0" />
                  <span><strong>Recommended Stream:</strong> {pw.streamRequired}</span>
                </div>
                <div className="flex items-start gap-1.5 text-stone-600">
                  <Building className="size-3.5 text-stone-400 mt-0.5 shrink-0" />
                  <span><strong>Target Institutions:</strong> {pw.targetColleges.slice(0, 3).join(", ")}</span>
                </div>
              </div>

              {/* Entrance Exams */}
              <div className="flex flex-wrap items-center gap-1.5 pt-1">
                <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider mr-1">
                  Key Exams:
                </span>
                {pw.exams.map((exam) => (
                  <span
                    key={exam}
                    className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-stone-100 text-stone-700"
                  >
                    {exam}
                  </span>
                ))}
              </div>
            </div>

            {/* Action Bar */}
            <div className="flex items-center gap-2 pt-3 border-t border-stone-100">
              <Link
                href={`/simulator?track=${pw.simulationTrackId}`}
                className="flex-1 py-2 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs shadow-xs transition flex items-center justify-center gap-1.5"
              >
                <Gamepad2 className="size-3.5" />
                <span>Test-Drive Simulation</span>
              </Link>

              {onNavigateTab ? (
                <button
                  onClick={() => onNavigateTab("mentorship")}
                  className="px-3 py-2 rounded-xl border border-stone-200 hover:bg-stone-50 text-stone-700 font-semibold text-xs transition cursor-pointer"
                  title="Book mentor in this field"
                >
                  <Users className="size-3.5" />
                </button>
              ) : (
                <Link
                  href="/dashboard?tab=mentorship"
                  className="px-3 py-2 rounded-xl border border-stone-200 hover:bg-stone-50 text-stone-700 font-semibold text-xs transition"
                  title="Book mentor in this field"
                >
                  <Users className="size-3.5" />
                </Link>
              )}
            </div>
          </div>
        ))}
        </div>
      )}

      {/* 3. Browse Other Careers to Heart Strip */}
      <div className="bg-stone-50 rounded-2xl p-5 border border-stone-200/80 space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-bold uppercase tracking-wider text-stone-500">
            Available Careers in Library
          </h4>
          <span className="text-xs text-stone-400">Click heart to add to your list</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          {ALL_MASTER_PATHWAYS.map((p) => {
            const isSaved = savedTrackIds.includes(p.trackId);
            return (
              <div
                key={p.trackId}
                className="flex items-center justify-between p-3 rounded-xl bg-white border border-stone-200/80 text-xs"
              >
                <div className="pr-2 truncate">
                  <strong className="block text-stone-900 truncate">{p.title}</strong>
                  <span className="text-[10px] text-stone-400">{p.domain.split(" ")[0]}</span>
                </div>
                <button
                  onClick={() => toggleSavePathway(p.trackId)}
                  className={`p-1.5 rounded-lg transition cursor-pointer shrink-0 ${
                    isSaved ? "bg-orange-100 text-orange-600" : "bg-stone-100 text-stone-400 hover:text-stone-600"
                  }`}
                  title={isSaved ? "Saved" : "Save this career"}
                >
                  <Heart className={`size-3.5 ${isSaved ? "fill-orange-600" : ""}`} />
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
