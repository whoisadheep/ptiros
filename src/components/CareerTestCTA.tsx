"use client";

import { ArrowRight, CheckCircle2 } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import ScrollReveal from "./ui/ScrollReveal";

const testHighlights = [
  "Identify your cognitive strengths across 6 thinking styles",
  "Match with 250+ careers across AI, Law, Medicine, and Design",
  "Zero exam pressure: 100% supportive, exploratory, and private",
  "Customized roadmap tailored to your exact school grade (Classes 8–12)",
  "Instant personalized career blueprint with actionable next steps",
] as const;

export default function CareerTestCTA() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <section
      id="career-test"
      className="relative overflow-hidden bg-white py-20 sm:py-28 border-t border-stone-200/60"
      aria-label="Career Diagnostic Test"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-12 lg:gap-14">
          {/* Left Column: Brain Line Art + Neural Orbit Motion Graphic */}
          <div className="flex flex-col items-center justify-center lg:col-span-5">
            <ScrollReveal direction="up" distance={20} duration={0.5}>
              <div className="relative w-full max-w-md aspect-square flex items-center justify-center p-4">
                {/* Rotating Neural Constellation SVG */}
                <svg
                  className="pointer-events-none absolute inset-0 w-full h-full"
                  viewBox="0 0 400 400"
                  fill="none"
                  aria-hidden="true"
                >
                  <motion.circle
                    cx="200"
                    cy="200"
                    r="168"
                    stroke="#fed7aa"
                    strokeWidth="1.5"
                    strokeDasharray="6 8"
                    animate={prefersReducedMotion ? undefined : { rotate: 360 }}
                    transition={{ duration: 36, repeat: Infinity, ease: "linear" }}
                    style={{ transformOrigin: "200px 200px" }}
                  />
                  <motion.circle
                    cx="200"
                    cy="200"
                    r="142"
                    stroke="#fdba74"
                    strokeWidth="1"
                    strokeDasharray="2 10"
                    animate={prefersReducedMotion ? undefined : { rotate: -360 }}
                    transition={{ duration: 28, repeat: Infinity, ease: "linear" }}
                    style={{ transformOrigin: "200px 200px" }}
                  />
                </svg>

                {/* Floating Cognitive Dimension Pills */}
                <motion.span
                  animate={prefersReducedMotion ? undefined : { y: [0, -6, 0] }}
                  transition={{ duration: 3.6, repeat: Infinity, ease: "easeInOut" }}
                  className="hidden sm:inline-flex absolute top-6 left-4 z-10 px-2.5 py-1 rounded-full bg-white/95 border border-orange-200 shadow-xs text-[11px] font-bold text-stone-700"
                >
                  Analytical Logic
                </motion.span>
                <motion.span
                  animate={prefersReducedMotion ? undefined : { y: [0, 6, 0] }}
                  transition={{ duration: 4.2, repeat: Infinity, ease: "easeInOut", delay: 0.6 }}
                  className="hidden sm:inline-flex absolute bottom-8 right-2 z-10 px-2.5 py-1 rounded-full bg-white/95 border border-amber-200 shadow-xs text-[11px] font-bold text-stone-700"
                >
                  Creative Synthesis
                </motion.span>
                <motion.span
                  animate={prefersReducedMotion ? undefined : { y: [0, -5, 0] }}
                  transition={{ duration: 3.9, repeat: Infinity, ease: "easeInOut", delay: 1.1 }}
                  className="hidden sm:inline-flex absolute top-14 right-2 z-10 px-2.5 py-1 rounded-full bg-orange-50/95 border border-orange-200 shadow-xs text-[11px] font-bold text-orange-800"
                >
                  250+ Tracks
                </motion.span>

                <motion.div
                  animate={prefersReducedMotion ? undefined : { scale: [1, 1.025, 1] }}
                  transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                  className="relative w-full h-full max-w-[320px] max-h-[320px]"
                >
                  <Image
                    src="/client_brain.png"
                    alt="PTIROS Cognitive Mapping Model"
                    fill
                    className="object-contain"
                    priority
                  />
                </motion.div>
              </div>

              <p className="mt-2 text-center text-xs font-medium text-stone-500">
                Cognitive Aptitude &amp; Neurological Assessment Model
              </p>
            </ScrollReveal>
          </div>

          {/* Right Column: Grounded Primary Callout Card */}
          <div className="lg:col-span-7">
            <ScrollReveal direction="up" delay={0.1} distance={20} duration={0.5}>
              <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-stone-900 p-8 sm:p-12 text-white shadow-xs">
                <motion.div
                  aria-hidden="true"
                  animate={
                    prefersReducedMotion
                      ? undefined
                      : { opacity: [0.18, 0.34, 0.18], scale: [1, 1.12, 1] }
                  }
                  transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
                  className="pointer-events-none absolute -right-16 -top-16 size-64 rounded-full bg-orange-500/25 blur-3xl"
                />
                <div className="relative z-10 space-y-6">
                  {/* Header pill & Title */}
                  <div className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3.5 py-1 text-xs font-semibold text-stone-200">
                    <span className="size-1.5 rounded-full bg-orange-500" />
                    <span>Free Student Diagnostic</span>
                  </div>

                  <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight text-white">
                    Find your authentic future.
                  </h2>

                  {/* 5 Bullet Points with subtle icons */}
                  <ul className="space-y-3 pt-1">
                    {testHighlights.map((point) => (
                      <li
                        key={point}
                        className="flex items-start gap-3 text-sm sm:text-base text-stone-300"
                      >
                        <CheckCircle2 className="size-4 text-orange-500 mt-1 shrink-0" />
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>

                  {/* CTA Button */}
                  <div className="pt-4 flex flex-col sm:flex-row items-start sm:items-center gap-4">
                    <Link
                      href="/career-test"
                      className="group inline-flex items-center justify-center gap-2 rounded-xl bg-orange-600 hover:bg-orange-700 text-white px-7 py-3.5 text-sm font-bold shadow-xs transition-colors active:scale-95"
                    >
                      <span>Start Career Diagnostic</span>
                      <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
                    </Link>
                    <span className="text-xs text-stone-400">
                      Takes 5 minutes • Free • No preparation needed
                    </span>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </div>
    </section>
  );
}
