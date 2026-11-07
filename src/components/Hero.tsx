"use client";

import { motion, useReducedMotion } from "framer-motion";
import {
  ArrowRight,
  Sparkles,
  Compass,
  GraduationCap,
  Award,
} from "lucide-react";
import Link from "next/link";
import MagneticButton from "./ui/MagneticButton";

export default function Hero() {
  const prefersReducedMotion = useReducedMotion();

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
        {/* Client Top Row: "A platform to be the dream you dreamt of" (Left) & "Welcome to PTIROS" (Right) */}
        <motion.div
          initial={false}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-border/60 pb-4"
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5 text-xs sm:text-sm font-semibold tracking-wide text-primary backdrop-blur-sm">
            <Sparkles className="h-3.5 w-3.5 text-primary" />
            <span>A platform to be the dream you dreamt of</span>
          </div>

          <div className="text-xs sm:text-sm font-bold uppercase tracking-widest text-text-muted">
            Welcome to <span className="font-extrabold text-primary">PTIROS</span>
          </div>
        </motion.div>

        {/* Main Hero Split Grid */}
        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-12 lg:gap-14">
          {/* Left Column: Bold Headline matching design-01.png */}
          <motion.div
            initial={false}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col items-start lg:col-span-7"
          >
            <h1 className="font-display text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black leading-[1.04] tracking-tight text-accent">
              ROADMAP TO
              <br />
              <span className="text-gradient">YOUR DREAMS</span>
            </h1>

            <p className="mt-5 max-w-xl text-base sm:text-lg lg:text-xl leading-relaxed text-text-muted">
              Built on the science of Japanese Kaizen routines, ancient Indian Gurukul mentorship, and NEP 2020 experiential learning to guarantee your dream career path.
            </p>
          </motion.div>

          {/* Right Column: "Most students choose the wrong career . Are you ?" + CTA pill matching design-01.png */}
          <motion.div
            initial={false}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
            className="flex flex-col items-start justify-center rounded-3xl border border-border/80 bg-white/80 p-6 sm:p-10 shadow-xl backdrop-blur-lg lg:col-span-5"
          >
            <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-primary">
              <GraduationCap className="h-4 w-4" />
              <span>Career Assessment</span>
            </div>

            <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold leading-tight text-accent">
              Most students choose the wrong career .
              <br />
              <span className="text-primary">Are you ?</span>
            </h2>

            <p className="mt-3 text-sm sm:text-base leading-relaxed text-text-muted">
              Over 93% of Indian students choose their career blindfolded without understanding their cognitive strengths or NEP career alignments. Take the scientifically verified 360° career test now.
            </p>

            {/* CTA Button matching design-01.png ("GIVE CAREER TEST") */}
            <div className="mt-6 flex w-full flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <MagneticButton href="/career-test" strength={0.2} className="w-full">
                <div
                  className="group flex w-full cursor-pointer items-center justify-center gap-3 rounded-full bg-primary px-8 py-4 text-base font-bold uppercase tracking-wide text-white shadow-xl shadow-primary/30 transition-all duration-200 hover:bg-primary-dark active:scale-[0.98]"
                  style={{ minHeight: "52px" }}
                >
                  <span>GIVE CAREER TEST</span>
                  <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
                </div>
              </MagneticButton>
            </div>

            <div className="mt-4 flex w-full items-center justify-between border-t border-border/50 pt-3 text-xs text-text-muted">
              <span className="flex items-center gap-1.5">
                <Award className="h-3.5 w-3.5 text-primary" />
                Free instant diagnosis
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
