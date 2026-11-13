"use client";

import { motion } from "framer-motion";
import {
  Cpu,
  Scale,
  Palette,
  Stethoscope,
  TrendingUp,
  Film,
  ArrowRight,
  Clock,
  Sparkles,
  Zap,
  CheckCircle2,
  ShieldCheck,
  ChevronRight,
  GraduationCap,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import ScrollReveal from "./ui/ScrollReveal";
import Link from "next/link";

const easeOutExpo = [0.16, 1, 0.3, 1] as const;

interface SimulatorTeaserTrack {
  id: string;
  icon: LucideIcon;
  title: string;
  tagline: string;
  color: string;
  bgGradient: string;
  duration: string;
  salary: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  workplaceBrief: string;
  tasksCount: string;
}

const teaserTracks: SimulatorTeaserTrack[] = [
  {
    id: "ai-robotics",
    icon: Cpu,
    title: "AI & Autonomous Robotics",
    tagline: "Sensor Fusion & ROS2 Pathfinding",
    color: "#6366F1",
    bgGradient: "from-indigo-600 via-indigo-500 to-purple-600",
    duration: "3 min lab",
    salary: "₹12 – 35 LPA",
    difficulty: "Intermediate",
    workplaceBrief: "Diagnose ghost obstacle false-alarms in autonomous warehouse robots.",
    tasksCount: "3 Workplace Missions",
  },
  {
    id: "corporate-law",
    icon: Scale,
    title: "Corporate Mergers & Law",
    tagline: "M&A Contracts & Section 27 Restraints",
    color: "#0EA5E9",
    bgGradient: "from-sky-600 via-blue-600 to-indigo-700",
    duration: "3 min lab",
    salary: "₹15 – 45 LPA",
    difficulty: "Intermediate",
    workplaceBrief: "Review ₹250 Cr acquisition terms and strike down illegal non-competes.",
    tasksCount: "3 Workplace Missions",
  },
  {
    id: "ux-design",
    icon: Palette,
    title: "Product & UX Architecture",
    tagline: "Cognitive Load & Accessibility",
    color: "#EC4899",
    bgGradient: "from-pink-600 via-rose-500 to-red-500",
    duration: "3 min lab",
    salary: "₹10 – 30 LPA",
    difficulty: "Beginner",
    workplaceBrief: "Redesign rural fintech KYC onboarding with voice assistance and OCR.",
    tasksCount: "3 Workplace Missions",
  },
  {
    id: "medicine",
    icon: Stethoscope,
    title: "Clinical Medicine & Trauma",
    tagline: "Auscultation & Emergency Triage",
    color: "#10B981",
    bgGradient: "from-emerald-600 via-teal-600 to-cyan-600",
    duration: "3 min lab",
    salary: "₹12 – 40+ LPA",
    difficulty: "Advanced",
    workplaceBrief: "Decompress tension pneumothorax in an athlete and counsel families.",
    tasksCount: "3 Workplace Missions",
  },
  {
    id: "finance",
    icon: TrendingUp,
    title: "Investment Banking & Wealth",
    tagline: "Asset Allocation & Dollar Hedging",
    color: "#F59E0B",
    bgGradient: "from-amber-500 via-orange-500 to-red-600",
    duration: "3 min lab",
    salary: "₹14 – 42 LPA",
    difficulty: "Intermediate",
    workplaceBrief: "Construct a 10-year foreign education fund resisting 6% inflation.",
    tasksCount: "3 Workplace Missions",
  },
  {
    id: "media",
    icon: Film,
    title: "Media Production & Storytelling",
    tagline: "Viral Narrative & PR Management",
    color: "#8B5CF6",
    bgGradient: "from-purple-600 via-violet-600 to-indigo-600",
    duration: "3 min lab",
    salary: "₹9 – 28 LPA",
    difficulty: "Beginner",
    workplaceBrief: "Hook Gen-Z attention in 3 seconds and handle social greenwashing crises.",
    tasksCount: "3 Workplace Missions",
  },
];

export default function CareerSimulator() {
  return (
    <section
      id="simulator"
      className="relative overflow-hidden bg-[#FFFBF5] py-20 sm:py-28"
      aria-label="Virtual Career Simulator Showcase"
    >
      {/* Decorative ambient auras */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
        <div className="absolute -left-32 top-20 h-96 w-96 rounded-full bg-orange-500/8 blur-3xl" />
        <div className="absolute -right-32 bottom-20 h-96 w-96 rounded-full bg-indigo-500/8 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
        {/* Section Header */}
        <ScrollReveal direction="up" distance={20}>
          <div className="text-center max-w-3xl mx-auto">
            <span className="inline-flex items-center gap-2 rounded-full bg-orange-100 px-4 py-1.5 text-xs sm:text-sm font-bold uppercase tracking-widest text-orange-700">
              <Sparkles className="h-3.5 w-3.5" />
              Mindler Immrse Inspired
            </span>

            <h2 className="mt-4 font-display text-3xl sm:text-5xl lg:text-6xl font-black text-gray-900 leading-tight">
              Test-Drive Your{" "}
              <span className="text-gradient">Dream Career</span> First.
            </h2>

            <p className="mt-4 text-base sm:text-lg leading-relaxed text-gray-600">
              Don’t pick subjects in the dark. Experience 3-minute interactive workplace missions
              designed around real industry challenges, from AI robotics to corporate mergers.
            </p>

            {/* Quick Metrics */}
            <div className="mt-6 flex flex-wrap items-center justify-center gap-3 text-xs font-semibold text-gray-500">
              <span className="flex items-center gap-1.5 rounded-full bg-white px-3 py-1 border border-orange-200/80 shadow-xs">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
                100% Free Virtual Simulations
              </span>
              <span className="flex items-center gap-1.5 rounded-full bg-white px-3 py-1 border border-orange-200/80 shadow-xs">
                <GraduationCap className="h-3.5 w-3.5 text-orange-600" />
                NEP 2020 Experiential Labs
              </span>
              <span className="flex items-center gap-1.5 rounded-full bg-white px-3 py-1 border border-orange-200/80 shadow-xs">
                <Zap className="h-3.5 w-3.5 text-amber-500" />
                Instant Career Fit Score
              </span>
            </div>
          </div>
        </ScrollReveal>

        {/* 6 Career Tracks Grid */}
        <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {teaserTracks.map((track, idx) => {
            const Icon = track.icon;
            return (
              <ScrollReveal key={track.id} delay={idx * 0.06} direction="up" distance={20}>
                <Link
                  href={`/simulator?track=${track.id}`}
                  className="group relative flex h-full flex-col justify-between overflow-hidden rounded-3xl border border-orange-200/70 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-orange-300 hover:shadow-xl hover:shadow-orange-950/5"
                >
                  {/* Top Color Line */}
                  <div
                    className={`absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r ${track.bgGradient}`}
                  />

                  <div>
                    {/* Top row */}
                    <div className="flex items-start justify-between">
                      <div
                        className="flex h-13 w-13 items-center justify-center rounded-2xl shadow-sm transition-transform duration-300 group-hover:scale-110"
                        style={{ backgroundColor: `${track.color}15` }}
                      >
                        <Icon className="h-6 w-6" style={{ color: track.color }} strokeWidth={2.2} />
                      </div>

                      <div className="flex flex-col items-end gap-1">
                        <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-[10px] font-bold text-emerald-700 border border-emerald-200">
                          {track.salary}
                        </span>
                        <span className="flex items-center gap-1 text-[10px] font-semibold text-gray-400">
                          <Clock className="h-3 w-3" />
                          {track.duration}
                        </span>
                      </div>
                    </div>

                    {/* Title & Tagline */}
                    <h3 className="mt-4 font-display text-lg font-bold text-gray-900 group-hover:text-orange-600 transition-colors">
                      {track.title}
                    </h3>
                    <p className="text-xs font-semibold" style={{ color: track.color }}>
                      {track.tagline}
                    </p>

                    {/* Workplace Brief */}
                    <p className="mt-3 text-xs leading-relaxed text-gray-500">
                      {track.workplaceBrief}
                    </p>
                  </div>

                  {/* Footer CTA */}
                  <div className="mt-6 flex items-center justify-between border-t border-gray-100 pt-3">
                    <span className="text-[11px] font-bold text-gray-400">
                      {track.tasksCount}
                    </span>
                    <div className="flex items-center gap-1 text-xs font-bold text-orange-600 group-hover:translate-x-1 transition-transform">
                      <span>Launch Lab</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </div>
                  </div>
                </Link>
              </ScrollReveal>
            );
          })}
        </div>

        {/* Global Hub CTA Card */}
        <ScrollReveal delay={0.25} direction="up" distance={16}>
          <div className="mt-14 overflow-hidden rounded-3xl bg-gradient-to-r from-[#1A1A2E] via-[#2A2A44] to-[#1A1A2E] p-8 sm:p-10 text-white shadow-xl">
            <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
              <div className="max-w-xl text-center md:text-left">
                <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-bold uppercase tracking-widest text-orange-400">
                  Dedicated Experience
                </span>
                <h3 className="mt-3 font-display text-2xl sm:text-3xl font-black text-white">
                  Enter the Full PTIROS Career Simulator Lab
                </h3>
                <p className="mt-1 text-xs sm:text-sm text-gray-300">
                  Browse by category, access code editors & case files, analyze day-in-the-life
                  timelines, and generate your verified simulation certificate.
                </p>
              </div>

              <Link
                href="/simulator"
                className="group inline-flex shrink-0 items-center gap-2 rounded-full bg-primary px-8 py-3.5 font-display text-sm font-bold uppercase tracking-wider text-white shadow-xl shadow-primary/30 transition-all hover:bg-primary-dark hover:scale-105 active:scale-95"
              >
                <span>Explore All Simulator Labs</span>
                <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
