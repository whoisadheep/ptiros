"use client";

import { motion } from "framer-motion";
import {
  ArrowRight,
  GraduationCap,
  Award,
  CheckCircle2,
} from "lucide-react";
import Link from "next/link";

export default function Hero() {
  return (
    <section
      id="home"
      className="relative flex flex-col justify-center overflow-hidden bg-stone-50/60 pt-24 pb-14 sm:pt-28 sm:pb-16 lg:pt-32 lg:pb-20 border-b border-stone-200/60"
      aria-label="Hero"
    >
      <div className="relative z-10 mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Top Context Row */}
        <div className="mb-8 flex flex-col gap-2.5 sm:flex-row sm:items-center sm:justify-between border-b border-stone-200/80 pb-4">
          <div className="inline-flex items-center gap-2 rounded-full border border-stone-200 bg-white px-3.5 py-1 text-xs font-semibold text-stone-700 shadow-2xs">
            <span className="size-1.5 rounded-full bg-emerald-600" />
            <span>Admissions & Stream Guidance for Classes 8–12</span>
          </div>

          <div className="text-xs font-medium text-stone-500">
            Aligned with <span className="font-semibold text-stone-900">NEP 2020 Multi-Disciplinary Standards</span>
          </div>
        </div>

        {/* Main Hero Split Grid */}
        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-12 lg:gap-14">
          {/* Left Column: Focused Headline and Proposition */}
          <div className="flex flex-col items-start lg:col-span-7 space-y-5">
            <h1 className="font-display text-4xl sm:text-6xl md:text-7xl font-bold leading-[1.08] tracking-tight text-stone-950">
              Roadmap to your
              <br />
              <span className="text-orange-700">dream career.</span>
            </h1>

            <p className="max-w-xl text-base sm:text-lg leading-relaxed text-stone-600">
              Test-drive real-world careers before locking in high-school subject combinations. Backed by interactive workplace simulations, board exam blueprints, and 1:1 strategy calls with IIT, NLSIU, and AIIMS alumni.
            </p>

            {/* Quick Proof Points */}
            <div className="pt-2 flex flex-wrap items-center gap-4 text-xs font-semibold text-stone-600">
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
            </div>
          </div>

          {/* Right Column: Grounded Assessment Card */}
          <div className="flex flex-col items-start justify-center rounded-2xl sm:rounded-3xl border border-stone-200/90 bg-white p-6 sm:p-8 shadow-xs lg:col-span-5 space-y-4">
            <div className="inline-flex items-center gap-1.5 rounded-md bg-stone-100 px-2.5 py-1 text-xs font-semibold text-stone-700">
              <GraduationCap className="size-3.5 text-orange-700" />
              <span>5-Minute Career Diagnostic</span>
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
                className="group flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-orange-600 px-6 py-3.5 text-sm font-bold text-white shadow-xs transition-colors hover:bg-orange-700 active:scale-[0.99]"
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
          </div>
        </div>
      </div>
    </section>
  );
}
