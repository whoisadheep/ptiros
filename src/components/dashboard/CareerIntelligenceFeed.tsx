"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Clock,
  Briefcase,
  AlertCircle,
  BookOpen,
  Sparkles,
  ChevronRight,
  ShieldCheck,
  Building,
  Gamepad2,
  Users,
} from "lucide-react";

interface TrackIntelligence {
  id: string;
  careerName: string;
  tagline: string;
  timeline: { time: string; task: string; details: string }[];
  myth: string;
  reality: string;
  recommendedPrep: string[];
  simulationTrack: string;
}

const INTELLIGENCE_TRACKS: TrackIntelligence[] = [
  {
    id: "ai-engineer",
    careerName: "AI Systems & ML Infrastructure Engineer",
    tagline: "Building scalable distributed neural pipelines & inference systems",
    timeline: [
      {
        time: "09:30 AM",
        task: "Async Standup & Cluster Health Check",
        details: "Reviewing GPU cluster utilization metrics, latency spikes, and automated test pass rates across 128 nodes.",
      },
      {
        time: "11:00 AM",
        task: "Core Architecture Review",
        details: "Optimizing memory cache hit rates for high-throughput model inference to lower API roundtrip latency from 45ms to 18ms.",
      },
      {
        time: "02:30 PM",
        task: "Distributed Training Run Launch",
        details: "Writing custom PyTorch CUDA kernels to reduce gradient sync overhead across high-bandwidth interconnects.",
      },
      {
        time: "05:00 PM",
        task: "Post-Mortem & Security Audit",
        details: "Auditing prompt injection safeguards and safety filters before deploying to millions of production users.",
      },
    ],
    myth: "AI engineers just type prompts into ChatGPT and copy-paste code all day.",
    reality: "85% of real AI engineering is distributed systems, discrete mathematics, telemetry monitoring, data cleaning, and performance engineering.",
    recommendedPrep: [
      "Master linear algebra and multivariable calculus in Class 11-12",
      "Build a project using Python, PyTorch, and raw Linux CLI",
      "Compete in SOF Cyber Olympiads and algorithmic contests on Codeforces",
    ],
    simulationTrack: "engineering",
  },
  {
    id: "corporate-law",
    careerName: "Corporate M&A & Technology Lawyer",
    tagline: "Structuring multi-billion dollar cross-border acquisitions and policy",
    timeline: [
      {
        time: "09:00 AM",
        task: "Deal Room Standup & Regulatory Pulse",
        details: "Reviewing Competition Commission of India (CCI) merger filings for an international tech acquisition.",
      },
      {
        time: "11:30 AM",
        task: "Due Diligence & Risk Audit",
        details: "Inspecting 40+ intellectual property assignment agreements to ensure the target startup owns 100% of their proprietary AI algorithms.",
      },
      {
        time: "03:00 PM",
        task: "Multi-Party Term Sheet Negotiation",
        details: "High-stakes video call with partner counsel debating liquidation preference clauses and founder indemnities.",
      },
      {
        time: "06:00 PM",
        task: "Closing Documents Drafting",
        details: "Drafting bulletproof shareholder agreements and escrow release conditions before the midnight signing deadline.",
      },
    ],
    myth: "Lawyers spend every day shouting 'Objection, My Lord!' inside dramatic courtroom trials.",
    reality: "Tier-1 corporate lawyers rarely step inside a litigation courtroom. Their work is strategic contract architecture, multi-million dollar corporate negotiation, and policy risk management.",
    recommendedPrep: [
      "Read The Hindu / Indian Express editorials daily to build critical reading stamina for CLAT",
      "Participate actively in Model United Nations (MUNs) and parliamentary debating",
      "Master logical deduction and reading comprehension passages under timed pressure",
    ],
    simulationTrack: "law",
  },
  {
    id: "biotech-medicine",
    careerName: "Clinical BioTech & Precision Medicine Specialist",
    tagline: "Pioneering targeted genomic therapies and clinical triage",
    timeline: [
      {
        time: "08:00 AM",
        task: "Clinical Ward Rounds & Patient Telemetry",
        details: "Reviewing ICU blood panels, ventilator settings, and real-time hemodynamic monitor telemetry with attending residents.",
      },
      {
        time: "10:30 AM",
        task: "Genomic Sequencing & Biomarker Review",
        details: "Analyzing next-generation sequencing (NGS) data to pinpoint an oncological mutation and recommend tailored targeted immunotherapy.",
      },
      {
        time: "02:00 PM",
        task: "Interdisciplinary Tumor Board Meeting",
        details: "Conferring with surgical oncologists, radiotherapists, and clinical pharmacologists on precision treatment plans.",
      },
      {
        time: "04:30 PM",
        task: "Translational Lab Research",
        details: "Monitoring ongoing cellular culture assays testing synthetic monoclonal antibody binding affinities.",
      },
    ],
    myth: "Being a doctor is only memorizing textbooks and diagnosing simple coughs in clinic.",
    reality: "Modern medicine is deeply computational, combining advanced biochemistry, molecular genetics, data-driven diagnostics, and immense empathetic communication.",
    recommendedPrep: [
      "Excel in NCERT Biology diagrams, organic chemistry reaction mechanisms, and physics numericals for NEET",
      "Shadow at a local hospital or volunteer with the Red Cross / First Aid cadre",
      "Read popular science journals (Scientific American, The Lancet summaries)",
    ],
    simulationTrack: "medicine",
  },
];

export default function CareerIntelligenceFeed() {
  const [selectedTrackId, setSelectedTrackId] = useState("ai-engineer");

  const currentTrack =
    INTELLIGENCE_TRACKS.find((t) => t.id === selectedTrackId) || INTELLIGENCE_TRACKS[0];

  return (
    <div className="bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-7 border border-stone-200/80 shadow-xs space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-stone-100">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-orange-100 text-orange-800 text-[11px] font-bold uppercase tracking-wider mb-1">
            <Sparkles className="size-3 text-orange-600" />
            Field Intelligence & Reality Check
          </div>
          <h3 className="font-display font-bold text-base sm:text-lg text-stone-900">
            A Day in the Life of Real Practitioners
          </h3>
          <p className="text-xs text-stone-500 mt-0.5">
            Discover what senior IIT, NLSIU, and AIIMS alumni actually do during their workday.
          </p>
        </div>

        {/* Track Switcher */}
        <div className="flex items-center gap-1 bg-stone-100 p-1 rounded-xl text-xs font-bold overflow-x-auto scrollbar-none">
          {INTELLIGENCE_TRACKS.map((t) => (
            <button
              key={t.id}
              onClick={() => setSelectedTrackId(t.id)}
              className={`px-3 py-1.5 rounded-lg transition whitespace-nowrap cursor-pointer ${
                selectedTrackId === t.id
                  ? "bg-white shadow-2xs text-stone-900"
                  : "text-stone-500 hover:text-stone-800"
              }`}
            >
              {t.careerName.split(" ")[0]} {t.careerName.split(" ")[1]}
            </button>
          ))}
        </div>
      </div>

      {/* Track Title and Tagline */}
      <div className="p-3.5 rounded-xl bg-orange-50/70 border border-orange-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <strong className="text-sm font-bold text-stone-900 block">{currentTrack.careerName}</strong>
          <span className="text-xs text-stone-600">{currentTrack.tagline}</span>
        </div>

        <Link
          href={`/simulator?track=${currentTrack.simulationTrack}`}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold shrink-0 self-start sm:self-auto"
        >
          <Gamepad2 className="size-3.5" />
          Test-Drive Simulation
        </Link>
      </div>

      {/* Hour-by-hour Timeline */}
      <div className="space-y-3">
        <span className="text-[11px] font-bold uppercase tracking-wider text-stone-400 block">
          Hour-by-Hour Workday Breakdown
        </span>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
          {currentTrack.timeline.map((slot, idx) => (
            <div
              key={idx}
              className="p-3 rounded-xl bg-stone-50 border border-stone-200/70 space-y-1 text-xs"
            >
              <div className="flex items-center justify-between font-bold text-stone-900">
                <span className="text-orange-700 font-display flex items-center gap-1">
                  <Clock className="size-3 text-orange-600" />
                  {slot.time}
                </span>
                <span className="text-[11px] text-stone-700">{slot.task}</span>
              </div>
              <p className="text-[11px] text-stone-500 leading-relaxed">{slot.details}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Myth vs Reality Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
        <div className="p-3.5 rounded-xl bg-rose-50/60 border border-rose-200 text-xs space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-rose-700 flex items-center gap-1">
            <AlertCircle className="size-3 text-rose-600" />
            Common Media Myth
          </span>
          <p className="text-stone-700 italic">{currentTrack.myth}</p>
        </div>

        <div className="p-3.5 rounded-xl bg-emerald-50/60 border border-emerald-200 text-xs space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 flex items-center gap-1">
            <ShieldCheck className="size-3 text-emerald-600" />
            Ground Reality
          </span>
          <p className="text-stone-700">{currentTrack.reality}</p>
        </div>
      </div>

      {/* Actionable High School Prep Tips */}
      <div className="p-3.5 rounded-xl bg-stone-50 border border-stone-200/80 space-y-2 text-xs">
        <span className="text-[11px] font-bold text-stone-700 uppercase tracking-wider block">
          What You Should Focus On in Classes 9–12:
        </span>
        <ul className="space-y-1.5 text-stone-600">
          {currentTrack.recommendedPrep.map((tip, i) => (
            <li key={i} className="flex items-start gap-2">
              <span className="size-1.5 rounded-full bg-orange-600 mt-1.5 shrink-0" />
              <span>{tip}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
