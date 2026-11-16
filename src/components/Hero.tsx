"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import {
  ArrowRight,
  Sparkles,
  Compass,
  GraduationCap,
  Award,
  Gamepad2,
  CheckCircle2,
  Users,
  Smile,
} from "lucide-react";
import Link from "next/link";
import MagneticButton from "./ui/MagneticButton";
import PtiroMascot from "./PtiroMascot";

export default function Hero() {
  const prefersReducedMotion = useReducedMotion();
  const [activeAudience, setActiveAudience] = useState<"student" | "parent">("student");

  return (
    <section
      id="home"
      className="relative flex flex-col justify-center overflow-hidden bg-bg pt-24 pb-14 sm:pt-28 sm:pb-16 lg:pt-32 lg:pb-20"
      aria-label="Hero"
    >
      {/* Background Ambient Fluid Warmth */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
        <div className="absolute -left-20 top-10 h-80 w-80 sm:h-[30rem] sm:w-[30rem] rounded-full bg-primary/15 blur-[90px] sm:blur-[130px]" />
        <div className="absolute right-0 top-20 h-96 w-96 sm:h-[34rem] sm:w-[34rem] rounded-full bg-primary-light/15 blur-[100px] sm:blur-[140px]" />
        <div className="absolute bottom-10 left-1/3 h-72 w-72 sm:h-80 sm:w-80 rounded-full bg-secondary/15 blur-[80px] sm:blur-[110px]" />
      </div>

      <div className="relative z-10 mx-auto w-full max-w-7xl px-5 sm:px-8 lg:px-12">
        {/* Top Switcher: Audience Mode & Friendly Reassurance */}
        <motion.div
          initial={false}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-border/60 pb-4"
        >
          <div className="flex items-center gap-2 bg-stone-100/90 p-1 rounded-full border border-stone-200/80 w-fit">
            <button
              type="button"
              onClick={() => setActiveAudience("student")}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                activeAudience === "student"
                  ? "bg-white text-stone-900 shadow-xs border border-stone-200"
                  : "text-stone-500 hover:text-stone-900"
              }`}
            >
              <Smile className="size-3.5 text-primary" />
              <span>For Students (Class 6–12)</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveAudience("parent")}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                activeAudience === "parent"
                  ? "bg-white text-stone-900 shadow-xs border border-stone-200"
                  : "text-stone-500 hover:text-stone-900"
              }`}
            >
              <Users className="size-3.5 text-orange-600" />
              <span>For Parents & Teachers</span>
            </button>
          </div>

          <div className="text-xs sm:text-sm font-bold uppercase tracking-widest text-text-muted">
            Welcome to <span className="font-extrabold text-primary">PTIROS</span>
          </div>
        </motion.div>

        {/* Main Hero Split Grid */}
        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-12 lg:gap-14">
          {/* Left Column: Bold Headline & Reassuring Mission */}
          <motion.div
            initial={false}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col items-start lg:col-span-7 space-y-4"
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5 text-xs sm:text-sm font-semibold tracking-wide text-primary backdrop-blur-sm">
              <Sparkles className="h-3.5 w-3.5 text-primary" />
              <span>
                {activeAudience === "student"
                  ? "Zero stress, zero marks — discover what you love!"
                  : "NEP 2020-aligned experiential career guidance"}
              </span>
            </div>

            <h1 className="font-display text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black leading-[1.04] tracking-tight text-accent">
              ROADMAP TO
              <br />
              <span className="text-gradient">YOUR DREAMS</span>
            </h1>

            <p className="max-w-xl text-base sm:text-lg lg:text-xl leading-relaxed text-text-muted">
              {activeAudience === "student" ? (
                <>
                  You don&apos;t have to figure out your entire life today. Test-drive real careers like a
                  game, find out what your brain naturally enjoys, and chart your own path with confidence.
                </>
              ) : (
                <>
                  Built on the science of Japanese Kaizen routines, ancient Indian Gurukul mentorship, and NEP
                  2020 experiential learning to guarantee your child&apos;s authentic career clarity.
                </>
              )}
            </p>

            {/* Student-Friendly Safety Guarantees */}
            <div className="pt-2 flex flex-wrap items-center gap-3 text-xs font-semibold text-stone-600">
              <span className="flex items-center gap-1.5 bg-white/80 px-3 py-1.5 rounded-full border border-stone-200/80 shadow-2xs">
                <CheckCircle2 className="size-3.5 text-emerald-600" />
                No wrong answers
              </span>
              <span className="flex items-center gap-1.5 bg-white/80 px-3 py-1.5 rounded-full border border-stone-200/80 shadow-2xs">
                <CheckCircle2 className="size-3.5 text-emerald-600" />
                5 minutes & 100% free
              </span>
              <span className="flex items-center gap-1.5 bg-white/80 px-3 py-1.5 rounded-full border border-stone-200/80 shadow-2xs">
                <CheckCircle2 className="size-3.5 text-emerald-600" />
                No board marks needed
              </span>
            </div>
          </motion.div>

          {/* Right Column: Welcoming Invitation Card (Warm, encouraging, zero-anxiety) */}
          <motion.div
            initial={false}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
            className="flex flex-col items-start justify-center rounded-3xl border border-border/80 bg-white/90 p-6 sm:p-9 shadow-xl backdrop-blur-lg lg:col-span-5 relative overflow-hidden"
          >
            {/* Ptiro Mascot Mini Floating Greeting */}
            <div className="flex items-center gap-3 mb-3 bg-orange-50/80 border border-orange-200/80 rounded-2xl p-2.5 w-full">
              <div className="shrink-0">
                <PtiroMascot variant="copilot" size={44} />
              </div>
              <div className="text-left">
                <p className="text-xs font-bold text-stone-900">Hi, I&apos;m Ptiro!</p>
                <p className="text-[11px] text-stone-600">Take a breath — no exams here, just discovering what fits you best.</p>
              </div>
            </div>

            <h2 className="font-display text-2xl sm:text-3xl font-bold leading-tight text-accent">
              Wondering which career
              <br />
              <span className="text-primary">fits your vibe?</span>
            </h2>

            <p className="mt-3 text-xs sm:text-sm leading-relaxed text-text-muted">
              Most students pick their stream because of rumors or pressure. Take our quick, fun discovery
              quest to match your natural interests with 250+ future professions.
            </p>

            {/* Primary Action: "Find My Career Match" */}
            <div className="mt-5 flex w-full flex-col gap-2.5">
              <MagneticButton href="/career-test" strength={0.2} className="w-full">
                <div
                  className="group flex w-full cursor-pointer items-center justify-center gap-2.5 rounded-full bg-primary px-6 py-3.5 text-sm sm:text-base font-bold uppercase tracking-wide text-white shadow-xl shadow-primary/30 transition-all duration-200 hover:bg-primary-dark active:scale-[0.98]"
                  style={{ minHeight: "48px" }}
                >
                  <span>Find My Career Match</span>
                  <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
                </div>
              </MagneticButton>

              <Link
                href="/simulator"
                className="flex items-center justify-center gap-2 rounded-full bg-stone-100 hover:bg-stone-200/80 text-stone-800 text-xs font-bold py-2.5 transition active:scale-95"
              >
                <Gamepad2 className="size-4 text-primary" />
                <span>Or Play Career Simulator (3 min lab)</span>
              </Link>
            </div>

            <div className="mt-4 flex w-full items-center justify-between border-t border-border/50 pt-3 text-[11px] text-text-muted">
              <span className="flex items-center gap-1.5">
                <Award className="h-3.5 w-3.5 text-primary" />
                Free personalized blueprint
              </span>
              <Link
                href="#roadmaps"
                className="font-semibold text-primary hover:underline"
              >
                Explore Roadmaps ↓
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
