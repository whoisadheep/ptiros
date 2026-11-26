"use client";

import { motion, useReducedMotion } from "framer-motion";
import {
  ArrowRight,
  GraduationCap,
  Award,
  CheckCircle2,
  Sparkles,
} from "lucide-react";
import Link from "next/link";

const EASE_CURVE = [0.22, 1, 0.36, 1] as const;

export default function Hero() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <section
      id="home"
      className="relative flex flex-col justify-center overflow-hidden bg-stone-50/60 pt-24 pb-14 sm:pt-28 sm:pb-16 lg:pt-32 lg:pb-20 border-b border-stone-200/60"
      aria-label="Hero"
    >
      {/* Ambient Motion Graphics Layer: Orbital Career Constellation + Soft Warm Glows */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
        <motion.div
          animate={
            prefersReducedMotion
              ? undefined
              : { scale: [1, 1.08, 1], opacity: [0.35, 0.55, 0.35], x: [0, 18, 0], y: [0, -12, 0] }
          }
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-24 -right-20 h-96 w-96 rounded-full bg-gradient-to-br from-orange-300/30 via-amber-200/20 to-transparent blur-3xl"
        />
        <motion.div
          animate={
            prefersReducedMotion
              ? undefined
              : { scale: [1, 1.1, 1], opacity: [0.25, 0.45, 0.25], x: [0, -16, 0], y: [0, 14, 0] }
          }
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
          className="absolute -bottom-28 -left-20 h-80 w-80 rounded-full bg-gradient-to-tr from-amber-300/25 via-orange-200/20 to-transparent blur-3xl"
        />

        {/* Subtle SVG Orbital Ring behind Right Card */}
        <svg
          className="hidden lg:block absolute right-[-6%] top-1/2 -translate-y-1/2 w-[560px] h-[560px] opacity-[0.22]"
          viewBox="0 0 400 400"
          fill="none"
        >
          <motion.circle
            cx="200"
            cy="200"
            r="175"
            stroke="url(#heroOrbGrad)"
            strokeWidth="1"
            strokeDasharray="6 8"
            animate={prefersReducedMotion ? undefined : { rotate: 360 }}
            transition={{ duration: 48, repeat: Infinity, ease: "linear" }}
            style={{ transformOrigin: "200px 200px" }}
          />
          <motion.circle
            cx="200"
            cy="200"
            r="130"
            stroke="url(#heroOrbGrad)"
            strokeWidth="1"
            strokeDasharray="3 10"
            animate={prefersReducedMotion ? undefined : { rotate: -360 }}
            transition={{ duration: 36, repeat: Infinity, ease: "linear" }}
            style={{ transformOrigin: "200px 200px" }}
          />
          <defs>
            <linearGradient id="heroOrbGrad" x1="0" y1="0" x2="400" y2="400" gradientUnits="userSpaceOnUse">
              <stop stopColor="#ea580c" />
              <stop offset="1" stopColor="#f59e0b" stopOpacity="0.2" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      <div className="relative z-10 mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Top Context Row */}
        <motion.div
          initial={prefersReducedMotion ? false : { opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: EASE_CURVE }}
          className="mb-8 flex flex-col gap-2.5 sm:flex-row sm:items-center sm:justify-between border-b border-stone-200/80 pb-4"
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-stone-200 bg-white px-3.5 py-1 text-xs font-semibold text-stone-700 shadow-2xs">
            <span className="relative flex size-2">
              {!prefersReducedMotion && (
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              )}
              <span className="relative inline-flex size-2 rounded-full bg-emerald-600" />
            </span>
            <span>Admissions &amp; Stream Guidance for Classes 8–12</span>
          </div>

          <div className="text-xs font-medium text-stone-500">
            Aligned with <span className="font-semibold text-stone-900">NEP 2020 Multi-Disciplinary Standards</span>
          </div>
        </motion.div>

        {/* Main Hero Split Grid */}
        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-12 lg:gap-14">
          {/* Left Column: Focused Headline and Proposition */}
          <div className="flex flex-col items-start lg:col-span-7 space-y-5">
            <motion.h1
              initial={prefersReducedMotion ? false : { opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, ease: EASE_CURVE, delay: 0.05 }}
              className="font-display text-4xl sm:text-6xl md:text-7xl font-bold leading-[1.08] tracking-tight text-stone-950"
            >
              Roadmap to your
              <br />
              <span className="relative inline-block text-orange-700">
                dream career.
                {/* Animated SVG Hand-Drawn Trajectory Underline */}
                <svg
                  className="absolute -bottom-1.5 left-0 w-full h-3 overflow-visible pointer-events-none"
                  viewBox="0 0 260 12"
                  fill="none"
                  preserveAspectRatio="none"
                  aria-hidden="true"
                >
                  <motion.path
                    d="M2 9.5C68 2.5 186 2.5 258 8.5"
                    stroke="#ea580c"
                    strokeWidth="3"
                    strokeLinecap="round"
                    initial={prefersReducedMotion ? false : { pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: 0.85 }}
                    transition={{ duration: 0.9, ease: EASE_CURVE, delay: 0.4 }}
                  />
                </svg>
              </span>
            </motion.h1>

            <motion.p
              initial={prefersReducedMotion ? false : { opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: EASE_CURVE, delay: 0.14 }}
              className="max-w-xl text-base sm:text-lg leading-relaxed text-stone-600"
            >
              Test-drive real-world careers before locking in high-school subject combinations. Backed by interactive workplace simulations, board exam blueprints, and 1:1 strategy calls with IIT, NLSIU, and AIIMS alumni.
            </motion.p>

            {/* Quick Proof Points */}
            <motion.div
              initial={prefersReducedMotion ? false : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: EASE_CURVE, delay: 0.22 }}
              className="pt-2 flex flex-wrap items-center gap-4 text-xs font-semibold text-stone-600"
            >
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="size-4 text-emerald-600" />
                Zero Stream Pressure
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="size-4 text-emerald-600" />
                Interactive Roleplay Simulations
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="size-4 text-emerald-600" />
                10-Year Indian Salary Ladders
              </span>
            </motion.div>
          </div>

          {/* Right Column: Grounded Assessment Card with Live Signal Motion Graphic */}
          <motion.div
            initial={prefersReducedMotion ? false : { opacity: 0, y: 20, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.55, ease: EASE_CURVE, delay: 0.18 }}
            whileHover={prefersReducedMotion ? undefined : { y: -4 }}
            className="relative flex flex-col items-start justify-center rounded-2xl sm:rounded-3xl border border-stone-200/90 bg-white/95 backdrop-blur-xs p-6 sm:p-8 shadow-sm hover:shadow-md hover:border-orange-300/80 transition-shadow lg:col-span-5 space-y-4"
          >
            <div className="w-full flex items-center justify-between gap-2">
              <div className="inline-flex items-center gap-1.5 rounded-md bg-stone-100 px-2.5 py-1 text-xs font-semibold text-stone-700">
                <GraduationCap className="size-3.5 text-orange-700" />
                <span>5-Minute Career Diagnostic</span>
              </div>

              {/* Live Animated Signal Equalizer */}
              <div className="flex items-end gap-0.5 h-4 px-2 py-1 rounded-full bg-orange-50 border border-orange-200/60" aria-hidden="true">
                {[0.55, 0.95, 0.7, 1, 0.65].map((h, i) => (
                  <motion.span
                    key={i}
                    className="w-0.5 rounded-full bg-orange-600"
                    animate={
                      prefersReducedMotion
                        ? { height: `${h * 10}px` }
                        : { height: [`${h * 5}px`, `${h * 11}px`, `${h * 5}px`] }
                    }
                    transition={{
                      duration: 1.4,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: i * 0.15,
                    }}
                  />
                ))}
                <Sparkles className="size-2.5 text-orange-600 ml-1" />
              </div>
            </div>

            <h2 className="font-display text-2xl sm:text-3xl font-bold leading-tight text-stone-950">
              Most students choose the wrong stream.
              <br />
              <span className="text-orange-700">Are you?</span>
            </h2>

            <p className="text-xs sm:text-sm leading-relaxed text-stone-600">
              Over 93% of Indian students choose their stream without understanding their natural cognitive strengths or university entrance requirements. Find your authentic fit in 5 minutes.
            </p>

            {/* CTA Button */}
            <div className="w-full pt-1">
              <Link
                href="/career-test"
                className="group relative overflow-hidden flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-orange-600 px-6 py-3.5 text-sm font-bold text-white shadow-xs transition-colors hover:bg-orange-700 active:scale-[0.99]"
              >
                <span>Take Free Career Diagnostic</span>
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </div>

            <div className="flex w-full items-center justify-between border-t border-stone-100 pt-3 text-xs text-stone-500">
              <span className="flex items-center gap-1.5">
                <Award className="size-3.5 text-stone-400" />
                Instant personalized report
              </span>
              <Link
                href="/roadmaps"
                className="font-semibold text-stone-700 hover:text-orange-700 transition-colors"
              >
                Explore Roadmaps →
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
