"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Users,
  Award,
  Sparkles,
  TrendingUp,
  GraduationCap,
  BookOpen,
  IndianRupee,
  Share2,
  Copy,
  Check,
  Printer,
  ChevronRight,
  MessageCircle,
  HelpCircle,
  ShieldCheck,
  Building2,
  Clock,
  Compass,
} from "lucide-react";

/* ─── Domain Dossier Data Models ───────────────────── */

export interface TrackDossierData {
  studentStrengthsSummary: string;
  parentPerspective: string;
  economicOutlook: {
    entryLevel: string;
    midCareer: string;
    leadership: string;
    growthNarrative: string;
  };
  topInstitutions: {
    name: string;
    location: string;
    type: "Govt / Premier" | "Top Private" | "Autonomous";
    exam: string;
  }[];
  streamStrategy: {
    recommendedStream: string;
    mandatorySubjects: string[];
    recommendedElectives: string[];
    criticalPitfallToAvoid: string;
  };
  dinnerTableStarters: {
    question: string;
    context: string;
  }[];
}

export const PARENT_DOSSIERS: Record<string, TrackDossierData> = {
  "ai-robotics": {
    studentStrengthsSummary:
      "Your child exhibited high spatial-algorithmic reasoning and methodical fault isolation. Rather than panicking during an unexpected warehouse obstacle freeze, they analyzed sensor telemetry data and isolated the root cause to software sensor-fusion buffers.",
    parentPerspective:
      "Parents often worry that AI and automation will eliminate tech jobs. In reality, the engineers who build and deploy physical robotics hardware and autonomous neural algorithms are among the most irreplaceable and highly compensated specialists in India and globally.",
    economicOutlook: {
      entryLevel: "₹12 – 18 LPA",
      midCareer: "₹25 – 45 LPA",
      leadership: "₹65 – 1.2+ Cr",
      growthNarrative:
        "India's manufacturing push (Make in India, semiconductor fabrication, and automated logistics) has created a 32% annual deficit for specialized robotics and embedded systems engineers.",
    },
    topInstitutions: [
      { name: "IIT Madras / IIT Bombay / IIT Delhi", location: "National", type: "Govt / Premier", exam: "JEE Advanced" },
      { name: "BITS Pilani (Pilani, Goa, Hyd)", location: "Rajasthan / Goa", type: "Top Private", exam: "BITSAT" },
      { name: "IIIT Hyderabad (Robotics Research Center)", location: "Telangana", type: "Govt / Premier", exam: "JEE Main / UGEE" },
      { name: "COEP Technological University", location: "Pune", type: "Govt / Premier", exam: "MHT-CET / JEE Main" },
    ],
    streamStrategy: {
      recommendedStream: "Science (PCM - Physics, Chemistry, Mathematics)",
      mandatorySubjects: ["Mathematics", "Physics"],
      recommendedElectives: ["Computer Science", "Artificial Intelligence / Informatics Practices"],
      criticalPitfallToAvoid:
        "Do not allow your child to drop Mathematics in Class 11. Modern AI and robotics algorithms require foundational linear algebra, calculus, and probability.",
    },
    dinnerTableStarters: [
      {
        question: "How did it feel when the robot halted with an emergency obstacle alert?",
        context: "Helps you understand their emotional response to unexpected high-stakes technical failures.",
      },
      {
        question: "Do you enjoy the physical hardware side (sensors, motors) or the coding math side more?",
        context: "Clarifies whether Mechanical Engineering, Electronics, or Computer Science is their best sub-specialty.",
      },
      {
        question: "Would you rather build logistics bots for warehouses, autonomous drones for agriculture, or medical surgery robots?",
        context: "Connects their natural curiosity with real-world industry domains.",
      },
    ],
  },

  "corporate-law": {
    studentStrengthsSummary:
      "Your child demonstrated razor-sharp statutory precision and fiduciary protectiveness. When presented with predatory corporate contract clauses, they instinctively spotted post-employment restraint violations under Section 27 of the Indian Contract Act and capped commercial liability.",
    parentPerspective:
      "Many Indian families still view law through the outdated lens of local courtroom disputes. Modern corporate law is fundamentally about high-value business deals, international venture capital structuring, and safeguarding corporate integrity from air-conditioned Mumbai, Delhi, and Bengaluru offices.",
    economicOutlook: {
      entryLevel: "₹15 – 22 LPA",
      midCareer: "₹35 – 65 LPA",
      leadership: "₹85L – 2.5+ Cr (Equity Partner)",
      growthNarrative:
        "Tier-1 Indian law firms (Shardul Amarchand, Cyril Amarchand, Khaitan & Co, Trilegal) recruit fresh graduates directly from top NLUs with day-one salaries exceeding those of top tech software engineers.",
    },
    topInstitutions: [
      { name: "NLSIU Bangalore (National Law School)", location: "Bengaluru", type: "Govt / Premier", exam: "CLAT" },
      { name: "NALSAR University of Law", location: "Hyderabad", type: "Govt / Premier", exam: "CLAT" },
      { name: "WBNUJS Kolkata", location: "Kolkata", type: "Govt / Premier", exam: "CLAT" },
      { name: "NLU Delhi", location: "New Delhi", type: "Govt / Premier", exam: "AILET" },
      { name: "Symbiosis Law School", location: "Pune / Noida", type: "Top Private", exam: "SLAT" },
    ],
    streamStrategy: {
      recommendedStream: "Humanities or Commerce (Open to All Streams)",
      mandatorySubjects: ["English", "Political Science / Legal Studies / Business Studies"],
      recommendedElectives: ["Economics", "Applied Mathematics / Psychology"],
      criticalPitfallToAvoid:
        "Do not force a Science stream if your child is passionate about law. Scoring 95%+ in Humanities or Commerce while dedicating focused preparation to CLAT critical reading and logical reasoning is the highest-percentage path to NLSIU.",
    },
    dinnerTableStarters: [
      {
        question: "How did you catch that the non-compete clause was legally invalid?",
        context: "Encourages them to articulate how they analyze arguments and verify fairness.",
      },
      {
        question: "Would you enjoy negotiating between startup founders and multinational buyers?",
        context: "Explores whether commercial dealmaking and strategic persuasion excite them.",
      },
      {
        question: "Do you see yourself advising corporate boards, working in public policy, or handling intellectual property?",
        context: "Broadens the legal horizon beyond traditional criminal courtroom litigation.",
      },
    ],
  },

  "ux-design": {
    studentStrengthsSummary:
      "Your child exhibited extraordinary user empathy, cognitive ergonomics awareness, and data-driven problem solving. They recognized that rural merchants were dropping off due to intimidating form fields and sunlight glare, and redesigned the interface using progressive disclosure and WCAG AAA contrast.",
    parentPerspective:
      "Design is no longer just drawing or fine art. Product & UX Designers are high-earning strategic architects at top tech firms (Google, Swiggy, Uber, CRED). They translate human psychology into interfaces that drive hundreds of crores in digital commerce.",
    economicOutlook: {
      entryLevel: "₹10 – 16 LPA",
      midCareer: "₹24 – 40 LPA",
      leadership: "₹55 – 95+ LPA (VP of Design)",
      growthNarrative:
        "As Indian digital infrastructure expands to the 'Next Billion Users' in Tier 2/3 towns, tech companies compete fiercely for designers who understand regional dialects, accessibility, and cognitive simplicity.",
    },
    topInstitutions: [
      { name: "IIT Bombay (IDC School of Design)", location: "Mumbai", type: "Govt / Premier", exam: "UCEED" },
      { name: "National Institute of Design (NID)", location: "Ahmedabad", type: "Govt / Premier", exam: "NID DAT" },
      { name: "IIT Guwahati / IIT Delhi / IIT Hyderabad (B.Des)", location: "National", type: "Govt / Premier", exam: "UCEED" },
      { name: "Srishti Manipal Institute of Art & Design", location: "Bengaluru", type: "Top Private", exam: "SMEAT" },
    ],
    streamStrategy: {
      recommendedStream: "Open to Any Stream (Humanities, Commerce, or Science)",
      mandatorySubjects: ["English"],
      recommendedElectives: ["Fine Arts / Graphic Design / Psychology / Computer Science"],
      criticalPitfallToAvoid:
        "Don't postpone design portfolio development until Class 12. Premier design colleges like NID and IITs evaluate observational sketching, spatial problem-solving, and creative curiosity over rote school textbook marks.",
    },
    dinnerTableStarters: [
      {
        question: "What made you choose voice guidance and camera scanning for rural shopkeepers?",
        context: "Validates their capacity to design for people whose lives and devices differ from their own.",
      },
      {
        question: "Do you look at apps on our phones and notice things that are confusing or badly designed?",
        context: "Cultivates their everyday design critique and observation instincts.",
      },
      {
        question: "Do you prefer the visual aesthetic side (colors, typography) or the psychology structure side (wireframes, user tests)?",
        context: "Helps discern UI visual design vs Product Management & UX research.",
      },
    ],
  },

  medicine: {
    studentStrengthsSummary:
      "Your child demonstrated exceptional clinical deduction, rapid triage speed, and calm under crisis. Presented with acute dyspnea in an adolescent athlete, they systematically differentiated pneumothorax from simple muscle strains and executed needle thoracostomy decompression.",
    parentPerspective:
      "Medicine remains India's most respected and recession-proof noble profession. While the journey through MBBS, MD/MS, and DM super-specialization requires deep stamina, modern healthcare offers diverse high-impact specialties in interventional cardiology, trauma surgery, and critical care.",
    economicOutlook: {
      entryLevel: "₹10 – 14 LPA (Junior Resident)",
      midCareer: "₹25 – 45 LPA (Specialist)",
      leadership: "₹60L – 1.8+ Cr (Super-Specialist / HOD)",
      growthNarrative:
        "India's doctor-to-population ratio (1:834) remains below global standards, while modern tertiary hospital chains and specialized emergency trauma networks expand rapidly across all states.",
    },
    topInstitutions: [
      { name: "AIIMS New Delhi", location: "New Delhi", type: "Govt / Premier", exam: "NEET-UG" },
      { name: "Christian Medical College (CMC)", location: "Vellore", type: "Top Private", exam: "NEET-UG" },
      { name: "JIPMER", location: "Puducherry", type: "Govt / Premier", exam: "NEET-UG" },
      { name: "King George's Medical University (KGMU)", location: "Lucknow", type: "Govt / Premier", exam: "NEET-UG" },
      { name: "Kasturba Medical College (KMC)", location: "Manipal", type: "Top Private", exam: "NEET-UG" },
    ],
    streamStrategy: {
      recommendedStream: "Science (PCB - Physics, Chemistry, Biology)",
      mandatorySubjects: ["Biology", "Chemistry", "Physics"],
      recommendedElectives: ["Psychology", "Physical Education"],
      criticalPitfallToAvoid:
        "Do not neglect NCERT Physics. Many medical aspirants focus exclusively on Biology and Chemistry, but NEET rankings are overwhelmingly determined by Physics problem-solving speed and accuracy.",
    },
    dinnerTableStarters: [
      {
        question: "How did it feel having to make a life-or-death bedside intervention in seconds?",
        context: "Assesses their emotional stamina and comfort with high-responsibility clinical environments.",
      },
      {
        question: "Did you find understanding the physiology of how the lungs expand and collapse fascinating?",
        context: "Checks if their interest in medicine is rooted in genuine biological curiosity.",
      },
      {
        question: "Are you drawn more to acute hands-on emergency surgical action or long-term diagnostic medicine?",
        context: "Begins exploring internal medicine vs surgical specialties.",
      },
    ],
  },

  finance: {
    studentStrengthsSummary:
      "Your child demonstrated sharp macroeconomic intuition, tax-efficiency acuity, and disciplined behavioral fortitude. They understood that nominal bank fixed deposits lose real purchasing power after tax drag, and resisted emotional panic selling during an 18% market correction.",
    parentPerspective:
      "Finance is the lifeblood of economic growth. From managing multi-crore family office portfolios to structuring venture capital investments, financial strategists combine quantitative acumen with human psychology to safeguard multi-generational wealth.",
    economicOutlook: {
      entryLevel: "₹14 – 24 LPA",
      midCareer: "₹35 – 70 LPA",
      leadership: "₹90L – 3.0+ Cr (Managing Director / Fund Manager)",
      growthNarrative:
        "India's wealth management industry is growing at 24% CAGR as hundreds of thousands of new high-net-worth families seek structured investment advisory rather than passive real estate and gold.",
    },
    topInstitutions: [
      { name: "IIM Indore / IIM Rohtak (5-Year Integrated IPM)", location: "Indore / Rohtak", type: "Govt / Premier", exam: "IPMAT" },
      { name: "Shri Ram College of Commerce (SRCC)", location: "Delhi", type: "Govt / Premier", exam: "CUET" },
      { name: "St. Stephen's College / Hindu College", location: "Delhi", type: "Govt / Premier", exam: "CUET" },
      { name: "St. Xavier's College", location: "Mumbai", type: "Govt / Premier", exam: "XET / Merit" },
      { name: "NMIMS (Anil Surendra Modi School of Commerce)", location: "Mumbai", type: "Top Private", exam: "NPAT" },
    ],
    streamStrategy: {
      recommendedStream: "Commerce with Applied Mathematics (or PCM)",
      mandatorySubjects: ["Accountancy", "Economics", "Mathematics / Applied Math"],
      recommendedElectives: ["Business Studies", "Financial Markets Management"],
      criticalPitfallToAvoid:
        "Never choose Commerce without Mathematics if your child aspires to high-finance or top B-schools. Premier colleges (SRCC, IIM IPMAT, Shaheed Sukhdev) strictly require Mathematics for quantitative finance and economics degrees.",
    },
    dinnerTableStarters: [
      {
        question: "Were you surprised to learn that a 7% bank deposit actually loses money after taxes and inflation?",
        context: "Connects classroom math to real-world family financial wisdom.",
      },
      {
        question: "When markets drop 18%, why do you think so many adults panic and sell at the bottom?",
        context: "Explores their understanding of behavioral psychology and emotional self-control.",
      },
      {
        question: "Would you enjoy analyzing companies and deciding where crores of capital should be invested?",
        context: "Helps distinguish corporate financial advisory from stock trading and accounting.",
      },
    ],
  },

  media: {
    studentStrengthsSummary:
      "Your child showed an instinct for digital attention economics, visual pacing, and narrative emotional resonance. They understood why slow exposition kills short-form engagement and restructured the campaign around authentic Indian handloom artisan craft to drive viral organic shares.",
    parentPerspective:
      "The media and creative economy is experiencing an unprecedented golden age in India. Leading creative content strategists, executive showrunners, and brand narrative directors command executive-level compensation across OTT platforms (Netflix, Prime), global advertising agencies, and corporate brand studios.",
    economicOutlook: {
      entryLevel: "₹9 – 15 LPA",
      midCareer: "₹22 – 38 LPA",
      leadership: "₹50 – 1.0+ Cr (Executive Showrunner / CCO)",
      growthNarrative:
        "India's creator and digital storytelling market has grown 300% in 5 years, with consumer brands shifting over 45% of total advertising budgets from TV to digital video storytelling.",
    },
    topInstitutions: [
      { name: "Indian Institute of Mass Communication (IIMC)", location: "New Delhi", type: "Govt / Premier", exam: "IIMC Entrance / CUET-PG" },
      { name: "Film and Television Institute of India (FTII)", location: "Pune", type: "Govt / Premier", exam: "JET Entrance" },
      { name: "AJK MCRC, Jamia Millia Islamia", location: "New Delhi", type: "Govt / Premier", exam: "JMI Entrance" },
      { name: "Symbiosis Institute of Media & Communication", location: "Pune", type: "Top Private", exam: "SNAP / SIMC" },
      { name: "St. Xavier's College (BMM / BAMMC)", location: "Mumbai", type: "Govt / Premier", exam: "XET" },
    ],
    streamStrategy: {
      recommendedStream: "Humanities or Mass Communication (Open to All Streams)",
      mandatorySubjects: ["English Literature / Journalism"],
      recommendedElectives: ["Psychology", "Sociology", "Economics"],
      criticalPitfallToAvoid:
        "Don't overlook writing and research rigor. Great creative directors are not just video editors; they are deep thinkers who read voraciously about history, psychology, and cultural anthropology.",
    },
    dinnerTableStarters: [
      {
        question: "What makes you stop scrolling when you see a great video on your feed?",
        context: "Encourages them to deconstruct viewer psychology rather than just being a passive consumer.",
      },
      {
        question: "Why do you think celebrating the artisan weaver worked better than lecturing people about landfills?",
        context: "Tests their grasp of positive aspiration vs guilt in persuasive storytelling.",
      },
      {
        question: "Do you see yourself directing films/series, managing brand campaigns, or producing digital journalism?",
        context: "Clarifies which wing of the vast media ecosystem matches their vision.",
      },
    ],
  },
};

/* ─── Main Component Props ───────────────────────── */

interface ParentDossierProps {
  trackId: string;
  trackTitle: string;
  categoryLabel: string;
  color: string;
  fitPercent: number;
  score: number;
  totalMissions: number;
  resiliencePoints: number;
  studentName?: string;
  onClose?: () => void;
}

export default function ParentDossier({
  trackId,
  trackTitle,
  categoryLabel,
  color,
  fitPercent,
  score,
  totalMissions,
  resiliencePoints,
  studentName = "PTIROS Student",
  onClose,
}: ParentDossierProps) {
  const [activeTab, setActiveTab] = useState<"dossier" | "institutions" | "conversation">("dossier");
  const [copiedSummary, setCopiedSummary] = useState(false);

  const dossier = PARENT_DOSSIERS[trackId] || PARENT_DOSSIERS["ai-robotics"];

  const handleCopyWhatsAppSummary = () => {
    const text = `📋 *PTIROS Career Simulation Dossier for ${studentName}*\n\n` +
      `🎯 *Track Tested:* ${trackTitle} (${categoryLabel})\n` +
      `⭐ *Simulation Fit Score:* ${fitPercent}% (${score}/${totalMissions} workplace decisions correct)\n` +
      (resiliencePoints > 0 ? `🔥 *Crisis Resilience Mastery:* +${resiliencePoints} Pts\n\n` : `\n`) +
      `💡 *Executive Observation for Parents:*\n${dossier.studentStrengthsSummary}\n\n` +
      `💼 *Indian Salary Trajectory:* Entry: ${dossier.economicOutlook.entryLevel} | Mid: ${dossier.economicOutlook.midCareer} | Leadership: ${dossier.economicOutlook.leadership}\n\n` +
      `🎓 *Recommended Class 11-12 Stream:* ${dossier.streamStrategy.recommendedStream}\n` +
      `⚠️ *Key Tip to Avoid Pitfalls:* ${dossier.streamStrategy.criticalPitfallToAvoid}\n\n` +
      `Verified by PTIROS Virtual Career Simulator: https://ptiros.in/simulator?track=${trackId}`;

    navigator.clipboard.writeText(text);
    setCopiedSummary(true);
    setTimeout(() => setCopiedSummary(false), 2500);
  };

  return (
    <div className="rounded-3xl border border-orange-200/90 bg-white p-6 sm:p-9 shadow-xl print:border-none print:shadow-none print:p-0">
      {/* ─── Top Header Card ───────────────────────── */}
      <div className="flex flex-col gap-4 border-b border-gray-100 pb-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-xl bg-orange-100 text-orange-600">
              <Users className="h-4 w-4" />
            </span>
            <span className="text-xs font-bold uppercase tracking-wider text-orange-700">
              Parent-Student Dialogue Dossier
            </span>
            <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-[10px] font-bold text-emerald-800">
              Objective Career Science
            </span>
          </div>

          <h3 className="mt-2 font-display text-2xl sm:text-3xl font-black text-gray-900 leading-tight">
            Family Alignment Report: {trackTitle}
          </h3>
          <p className="mt-1 text-xs sm:text-sm text-gray-500">
            Prepared for <span className="font-bold text-gray-800">{studentName}</span> & Family • Grounded in Indian Education Realities & NEP 2020
          </p>
        </div>

        {/* Action Buttons: WhatsApp Share & Print */}
        <div className="flex items-center gap-2 print:hidden">
          <button
            onClick={handleCopyWhatsAppSummary}
            className="flex cursor-pointer items-center gap-1.5 rounded-full border border-emerald-300 bg-emerald-50 px-4 py-2 text-xs font-bold text-emerald-800 shadow-xs transition-all hover:bg-emerald-100 active:scale-95"
            title="Copy structured summary for WhatsApp family group"
          >
            {copiedSummary ? (
              <>
                <Check className="h-3.5 w-3.5 text-emerald-600" />
                <span>Copied to Clipboard!</span>
              </>
            ) : (
              <>
                <Share2 className="h-3.5 w-3.5 text-emerald-600" />
                <span>Share to WhatsApp</span>
              </>
            )}
          </button>

          <button
            onClick={() => window.print()}
            className="flex cursor-pointer items-center gap-1.5 rounded-full border border-gray-200 bg-white px-3.5 py-2 text-xs font-bold text-gray-700 shadow-xs transition-all hover:bg-gray-50 active:scale-95"
            title="Print or Save PDF Dossier"
          >
            <Printer className="h-3.5 w-3.5 text-gray-500" />
            <span>Print Dossier</span>
          </button>
        </div>
      </div>

      {/* ─── Metric Score Ribbons ──────────────────── */}
      <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="rounded-2xl border border-orange-100 bg-orange-50/50 p-3.5">
          <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
            Workplace Fit
          </span>
          <p className="mt-0.5 font-display text-2xl font-black text-orange-600">
            {fitPercent}%
          </p>
          <span className="text-[10px] text-gray-500 font-medium">
            Based on {totalMissions} real challenges
          </span>
        </div>

        <div className="rounded-2xl border border-emerald-100 bg-emerald-50/40 p-3.5">
          <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
            10-Year Indian Trajectory
          </span>
          <p className="mt-0.5 font-display text-lg font-black text-emerald-700">
            {dossier.economicOutlook.midCareer}
          </p>
          <span className="text-[10px] text-gray-500 font-medium">
            Mid-Senior Industry Average
          </span>
        </div>

        <div className="rounded-2xl border border-sky-100 bg-sky-50/40 p-3.5">
          <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
            Stream Fit (Class 11)
          </span>
          <p className="mt-0.5 font-display text-xs font-bold text-sky-900 truncate" title={dossier.streamStrategy.recommendedStream}>
            {dossier.streamStrategy.recommendedStream}
          </p>
          <span className="text-[10px] text-gray-500 font-medium">
            Optimal high school pathway
          </span>
        </div>

        <div className="rounded-2xl border border-purple-100 bg-purple-50/40 p-3.5">
          <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
            Troubleshooting Stamina
          </span>
          <p className="mt-0.5 font-display text-lg font-black text-purple-700">
            {resiliencePoints > 0 ? `+${resiliencePoints} Pts` : "High Aptitude"}
          </p>
          <span className="text-[10px] text-gray-500 font-medium">
            Crisis recovery verified
          </span>
        </div>
      </div>

      {/* ─── Navigation Subtabs ─────────────────────── */}
      <div className="mt-6 flex border-b border-gray-100 print:hidden">
        {[
          { id: "dossier", label: "Executive Parent Briefing", icon: Compass },
          { id: "institutions", label: "Top Colleges & Economics", icon: Building2 },
          { id: "conversation", label: "Dinner Table Dialogue Prompts", icon: MessageCircle },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`flex cursor-pointer items-center gap-2 border-b-2 px-4 py-3 text-xs sm:text-sm font-bold transition-all ${
                isActive
                  ? "border-orange-500 text-orange-600 bg-orange-50/30 rounded-t-xl"
                  : "border-transparent text-gray-500 hover:text-gray-900"
              }`}
            >
              <Icon className="h-4 w-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* ─── Tab 1: Executive Parent Briefing ──────── */}
      {(activeTab === "dossier" || typeof window === "undefined") && (
        <div className="mt-6 space-y-6">
          {/* Scientific Aptitude Observation */}
          <div className="rounded-2xl border border-orange-200/80 bg-gradient-to-br from-white to-orange-50/30 p-5 sm:p-6 shadow-xs">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-orange-700 mb-2">
              <Sparkles className="h-4 w-4 text-orange-500" />
              <span>Observed Workplace Aptitude (Plain-Language Explanation)</span>
            </div>
            <p className="text-xs sm:text-sm text-gray-700 leading-relaxed font-medium">
              {dossier.studentStrengthsSummary}
            </p>
          </div>

          {/* Perspective for Indian Parents */}
          <div className="rounded-2xl border border-blue-200/70 bg-blue-50/40 p-5 sm:p-6 shadow-xs">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-blue-900 mb-2">
              <ShieldCheck className="h-4 w-4 text-blue-600" />
              <span>Perspective for Indian Parents & Guardians</span>
            </div>
            <p className="text-xs sm:text-sm text-blue-950 leading-relaxed">
              {dossier.parentPerspective}
            </p>
          </div>

          {/* Stream Recommendation & Critical Pitfall */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="rounded-2xl border border-emerald-200/80 bg-emerald-50/40 p-5">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-800 mb-2">
                <GraduationCap className="h-4 w-4 text-emerald-600" />
                <span>Recommended Class 11-12 Selection</span>
              </div>
              <p className="font-display text-sm font-bold text-gray-900 mb-1">
                {dossier.streamStrategy.recommendedStream}
              </p>
              <div className="mt-3 space-y-1.5 text-xs text-gray-600">
                <p>
                  <span className="font-semibold text-gray-800">Essential Subjects: </span>
                  {dossier.streamStrategy.mandatorySubjects.join(", ")}
                </p>
                <p>
                  <span className="font-semibold text-gray-800">High-Yield Electives: </span>
                  {dossier.streamStrategy.recommendedElectives.join(", ")}
                </p>
              </div>
            </div>

            <div className="rounded-2xl border border-rose-200/80 bg-rose-50/40 p-5">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-rose-800 mb-2">
                <HelpCircle className="h-4 w-4 text-rose-600" />
                <span>Critical Pitfall to Avoid in High School</span>
              </div>
              <p className="text-xs text-rose-950 leading-relaxed font-medium">
                {dossier.streamStrategy.criticalPitfallToAvoid}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ─── Tab 2: Top Colleges & Economics ───────── */}
      {activeTab === "institutions" && (
        <div className="mt-6 space-y-6">
          {/* Salary Progression Ladder */}
          <div className="rounded-2xl border border-emerald-200 bg-gradient-to-br from-white to-emerald-50/30 p-5 sm:p-6 shadow-xs">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-800 mb-4">
              <IndianRupee className="h-4 w-4 text-emerald-600" />
              <span>Real Indian Industry Compensation Trajectory</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
              <div className="rounded-xl border border-emerald-100 bg-white p-4 shadow-2xs">
                <span className="text-[11px] font-bold uppercase text-gray-400">Entry Level (0–2 Yrs)</span>
                <p className="mt-1 font-display text-xl font-black text-gray-900">{dossier.economicOutlook.entryLevel}</p>
                <span className="text-[11px] text-gray-500">Fresh Graduate from Tier-1/2</span>
              </div>

              <div className="rounded-xl border border-emerald-200 bg-emerald-50/70 p-4 shadow-2xs">
                <span className="text-[11px] font-bold uppercase text-emerald-700">Mid-Career (5–8 Yrs)</span>
                <p className="mt-1 font-display text-xl font-black text-emerald-800">{dossier.economicOutlook.midCareer}</p>
                <span className="text-[11px] text-emerald-900/70 font-semibold">Senior Specialist / Team Lead</span>
              </div>

              <div className="rounded-xl border border-emerald-100 bg-white p-4 shadow-2xs">
                <span className="text-[11px] font-bold uppercase text-gray-400">Leadership (10+ Yrs)</span>
                <p className="mt-1 font-display text-xl font-black text-gray-900">{dossier.economicOutlook.leadership}</p>
                <span className="text-[11px] text-gray-500">Partner / Director / VP</span>
              </div>
            </div>

            <p className="mt-4 text-xs text-gray-600 leading-relaxed border-t border-emerald-100 pt-3">
              <span className="font-bold text-gray-900">Industry Reality: </span>
              {dossier.economicOutlook.growthNarrative}
            </p>
          </div>

          {/* Premier Indian Target Institutions */}
          <div className="rounded-2xl border border-orange-200/80 bg-white p-5 sm:p-6 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-orange-700">
                <Building2 className="h-4 w-4 text-orange-500" />
                <span>Premier Indian Target Institutions & Entrance Exams</span>
              </div>
              <span className="text-[11px] font-bold text-gray-400">
                Merit-Based Entry
              </span>
            </div>

            <div className="divide-y divide-gray-100">
              {dossier.topInstitutions.map((inst, idx) => (
                <div key={idx} className="flex flex-col sm:flex-row sm:items-center justify-between py-3 gap-2">
                  <div>
                    <p className="font-display text-sm font-bold text-gray-900">{inst.name}</p>
                    <p className="text-[11px] text-gray-500">{inst.location} • {inst.type}</p>
                  </div>
                  <span className="inline-flex items-center gap-1 self-start sm:self-auto rounded-full bg-orange-100 px-3 py-1 text-xs font-bold text-orange-800">
                    <GraduationCap className="h-3 w-3 text-orange-600" />
                    {inst.exam}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ─── Tab 3: Dinner Table Dialogue Prompts ──── */}
      {activeTab === "conversation" && (
        <div className="mt-6 space-y-4">
          <div className="rounded-2xl bg-amber-50/70 border border-amber-200 p-4 text-xs text-amber-950">
            <span className="font-bold">Why conversation starters matter: </span>
            In high school, adolescents often withdraw from career discussions when they feel evaluated or pressured. These prompts invite them to tell stories about their simulation experience instead.
          </div>

          <div className="space-y-3.5">
            {dossier.dinnerTableStarters.map((starter, i) => (
              <div
                key={i}
                className="rounded-2xl border border-orange-200/70 bg-white p-5 shadow-xs transition-all hover:border-orange-300"
              >
                <div className="flex items-start gap-3">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-orange-500 text-white text-xs font-bold">
                    {i + 1}
                  </span>
                  <div>
                    <h5 className="font-display text-sm font-bold text-gray-900 leading-snug">
                      “{starter.question}”
                    </h5>
                    <p className="mt-1 text-xs text-gray-500">
                      <span className="font-semibold text-orange-700">Why ask this: </span>
                      {starter.context}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ─── Footer Sign-off ───────────────────────── */}
      <div className="mt-8 border-t border-gray-100 pt-5 flex flex-col sm:flex-row items-center justify-between text-[11px] text-gray-400 gap-3">
        <span>PTIROS Career Advisory Diagnostic • Aligned with NEP 2020 Experiential Discovery</span>
        <span>Generated for Family Discussion</span>
      </div>
    </div>
  );
}
