"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Compass,
  X,
  Star,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Target,
  Brain,
  ShieldCheck,
  GraduationCap,
  Award,
  Users,
  CheckCircle2,
  HeartHandshake,
  Lightbulb,
  Building,
  TrendingUp,
  MapPin,
  Flame,
  Calendar,
  Gamepad2,
  BookOpen,
  Scale,
  Stethoscope,
  Cpu,
} from "lucide-react";
import { Blobatar } from "@blobatar/react";
import PtiroMascot from "@/components/PtiroMascot";
import { useUserProfile } from "@/context/UserProfileContext";

const timelineMilestones = [
  {
    year: "Phase 1: 2015 – 2018",
    title: "The Frontline Classroom Awakening",
    tagline: "9+ Years of Teaching Uncovered a Silent Epidemic",
    description:
      "While mentoring students preparing for national competitive exams, our founding educators watched brilliant teenagers break down in tears over derivations. They weren't failing because they lacked intellect—they were failing because they had been coerced into streams (PCM, PCB) that directly contradicted their innate cognitive wiring.",
    takeaway: "Traditional schools teach subjects; nobody was teaching self-discovery.",
    icon: GraduationCap,
    stat: "9+ Years",
    statLabel: "Teaching & Mentorship",
  },
  {
    year: "Phase 2: 2019 – 2021",
    title: "The 10,000-Student Pan-India Diagnostic",
    tagline: "Exposing the Anatomy of Career Illiteracy",
    description:
      "We took to the road, conducting comprehensive diagnostic surveys across hundreds of schools in Delhi NCR, Mumbai, Bengaluru, and tier-2 towns. The data was chilling: 73% of students chose their stream because of peer contagion or parental anxiety, and 90% could name only 7 career paths out of more than 250 available.",
    takeaway: "The career counseling industry was selling static 10-minute quizzes instead of authentic life blueprints.",
    icon: Brain,
    stat: "10,000+",
    statLabel: "Student Surveys",
  },
  {
    year: "Phase 3: 2022 – 2024",
    title: "Formulating the PTIROS Pedagogy",
    tagline: "Synthesizing Kaizen, Gurukul, and Modern Cognitive Science",
    description:
      "We refused to copy western multiple-choice tests. Instead, we architected a trilateral philosophy: Japanese Kaizen (1% compounding daily discipline & Hansei reflection), ancient Indian Gurukul traditions (deep 1:1 human mentorship and moral fortitude), and modern EdTech simulation.",
    takeaway: "Students don't need lectures; they need authentic experiential test-drives.",
    icon: Sparkles,
    stat: "50+",
    statLabel: "Research Papers Synthesized",
  },
  {
    year: "Phase 4: 2025 & Beyond",
    title: "The NEP 2020 Autonomous Cockpit",
    tagline: "From Blind Guessing to National Competency Credentials",
    description:
      "Today, PTIROS empowers students across Class 6 to 12 to test-drive real-world careers in AI, Corporate Law, and Precision Medicine. We equip families with data-backed salary ladders and give students a personal flight cockpit to track board exam readiness and Kaizen streaks.",
    takeaway: "Every student deserves an authentic North Star trajectory.",
    icon: Target,
    stat: "100%",
    statLabel: "NEP 2020 Aligned",
  },
];

const coreValues = [
  {
    title: "Self-Knowledge Precedes Stream Selection",
    description:
      "Never lock in PCM, PCB, Commerce, or Humanities based on hearsay. Uncover your natural cognitive brain traits first through authentic diagnostic telemetry.",
    icon: Compass,
    accent: "from-orange-500/10 to-amber-500/10",
    border: "border-orange-200",
  },
  {
    title: "Kaizen Over Last-Minute Cramming",
    description:
      "Real career readiness is built on 1% incremental daily compounding and deliberate Hansei reflections—not frantic 14-hour cramming sessions before board exams.",
    icon: TrendingUp,
    accent: "from-amber-500/10 to-yellow-500/10",
    border: "border-amber-200",
  },
  {
    title: "Test-Drive Before You Commit",
    description:
      "You wouldn't buy a car without a test-drive. Why spend 4 years and lakhs of rupees on a college degree before simulating real workplace assignments?",
    icon: Gamepad2,
    accent: "from-sky-500/10 to-blue-500/10",
    border: "border-sky-200",
  },
  {
    title: "Family Alignment, Not Family Conflict",
    description:
      "Career planning shouldn't cause shouting matches at the dinner table. We bridge the generational gap with factual salary ladders and structured dialogue dossiers.",
    icon: HeartHandshake,
    accent: "from-emerald-500/10 to-teal-500/10",
    border: "border-emerald-200",
  },
];

const mentorFellows = [
  {
    name: "Dr. Aryan Sharma",
    role: "Autonomous Navigation Lead & Systems Architect",
    pedigree: "Ex-ISRO Telemetry Fellow • IIT Delhi (B.Tech & Ph.D.)",
    focus: "AI, Quantum Computing & Space Robotics",
    avatar: "Dr. Aryan Sharma",
    icon: Cpu,
  },
  {
    name: "Adv. Sneha Mukherjee",
    role: "Senior Associate, Corporate M&A & Tech Policy",
    pedigree: "NLSIU Bengaluru '17 • Former Cyril Amarchand Mangaldas",
    focus: "Cross-Border Deals, Tech Antitrust & IP",
    avatar: "Sneha Mukherjee",
    icon: Scale,
  },
  {
    name: "Dr. Rajesh Iyer",
    role: "Clinical Robotics Fellow & Biotech Strategist",
    pedigree: "AIIMS New Delhi • IIT Delhi Biomedical Fellowship",
    focus: "Minimally Invasive Surgery & Bio-Sensors",
    avatar: "Dr. Rajesh Iyer",
    icon: Stethoscope,
  },
  {
    name: "Sanya Kapoor",
    role: "Staff Product Designer & Cognitive Usability Fellow",
    pedigree: "National Institute of Design (NID) • Former Swiggy Design Lead",
    focus: "Human-Computer Interaction & Accessibility",
    avatar: "Sanya Kapoor",
    icon: Lightbulb,
  },
];

export default function AboutPage() {
  const { openBookingModal, openDossierModal } = useUserProfile();
  const [activeStage, setActiveStage] = useState(0);

  return (
    <div className="min-h-screen bg-[#FFFBF5] text-[#1A1A2E] font-body selection:bg-orange-500 selection:text-white">
      {/* ─── Top Global Command Bar ──────────────────────── */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-stone-200/80 shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="flex items-center gap-2 rounded-xl px-2.5 py-1.5 text-xs font-bold text-stone-600 hover:text-stone-900 hover:bg-stone-100 transition"
            >
              <ArrowLeft className="size-4" />
              <span>Back to Home</span>
            </Link>

            <span className="hidden sm:inline-block h-4 w-px bg-stone-200" />

            <Link href="/" className="flex items-center gap-2">
              <span className="font-display text-xl sm:text-2xl font-black tracking-tight text-gradient">
                PTIROS
              </span>
              <span className="hidden md:inline-block text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-orange-100 text-orange-800">
                Our Story
              </span>
            </Link>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/simulator"
              className="hidden sm:flex items-center gap-1.5 text-xs font-bold text-stone-700 hover:text-primary transition"
            >
              <Gamepad2 className="size-4 text-primary" />
              <span>Simulator</span>
            </Link>
            <Link
              href="/dashboard"
              className="hidden sm:flex items-center gap-1.5 text-xs font-bold text-stone-700 hover:text-primary transition"
            >
              <Compass className="size-4 text-primary" />
              <span>Student Portal</span>
            </Link>
            <Link
              href="/career-test"
              className="rounded-full bg-primary px-4 sm:px-5 py-2 text-xs font-bold text-white shadow-md shadow-primary/20 hover:bg-primary-dark transition-all flex items-center gap-1.5 active:scale-95"
            >
              <span>Give Career Test</span>
              <ArrowRight className="size-3.5" />
            </Link>
          </div>
        </div>
      </header>

      {/* ─── 1. HERO SECTION (The Human Purpose) ─────────── */}
      <section className="relative overflow-hidden pt-12 pb-16 sm:pt-20 sm:pb-24 border-b border-stone-200/70">
        <div className="absolute top-0 right-1/4 -mt-20 size-96 rounded-full bg-orange-400/10 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-10 size-80 rounded-full bg-amber-400/10 blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-10 lg:gap-14">
            <div className="max-w-3xl space-y-5">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange-100/80 border border-orange-200/80 text-orange-900 text-xs font-bold uppercase tracking-wider">
                <Sparkles className="size-3.5 text-primary" />
                <span>Our Story • Born from Classroom Realities</span>
              </div>

              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-display font-black tracking-tight text-stone-900 leading-[1.15]">
                Empowering Every Student to{" "}
                <span className="text-gradient">Create Their True Future.</span>
              </h1>

              <p className="text-base sm:text-lg text-stone-600 leading-relaxed font-normal">
                We started PTIROS because we refused to accept an educational reality where{" "}
                <strong className="text-stone-900 font-semibold">73% of Indian students</strong> are forced
                into career streams they secretly regret. Here is the story of how frontline classroom
                frustration sparked an experiential mentorship movement across India.
              </p>

              {/* Verified Trust Proof Points */}
              <div className="pt-2 flex flex-wrap items-center gap-3 sm:gap-4 text-xs font-bold text-stone-700">
                <div className="flex items-center gap-2 bg-white px-3.5 py-2 rounded-xl border border-stone-200/90 shadow-2xs">
                  <ShieldCheck className="size-4 text-emerald-600" />
                  <span>NEP 2020 5+3+3+4 Aligned</span>
                </div>
                <div className="flex items-center gap-2 bg-white px-3.5 py-2 rounded-xl border border-stone-200/90 shadow-2xs">
                  <GraduationCap className="size-4 text-orange-600" />
                  <span>9+ Years High School Mentorship</span>
                </div>
                <div className="flex items-center gap-2 bg-white px-3.5 py-2 rounded-xl border border-stone-200/90 shadow-2xs">
                  <Brain className="size-4 text-sky-600" />
                  <span>10,000+ Student Diagnostics</span>
                </div>
              </div>
            </div>

            {/* Ptiro Mascot Spotlight Card */}
            <div className="shrink-0 flex justify-center">
              <div className="p-6 sm:p-8 rounded-3xl bg-white border border-orange-200/90 shadow-xl max-w-sm text-center space-y-4">
                <PtiroMascot
                  variant="copilot"
                  size={120}
                  speech="Welcome to our story!"
                  subSpeech="Discover why authentic mentorship beats blind guessing."
                />
                <div className="pt-2 border-t border-stone-100 text-left space-y-1">
                  <p className="text-xs font-bold text-stone-900">Ptiro — Your Flight Copilot</p>
                  <p className="text-[11px] text-stone-500 leading-relaxed">
                    Inspired by the ancient Greek word <em>Pteros</em> (wings), symbolizing purposeful flight
                    and North Star direction.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── 2. THE SPARK / ORIGIN (Why We Started) ───────── */}
      <section className="py-16 sm:py-24 bg-white border-b border-stone-200/70">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="max-w-2xl space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-orange-600">
              The Genesis
            </span>
            <h2 className="text-2xl sm:text-4xl font-display font-black text-stone-900 tracking-tight">
              The Problem We Couldn&apos;t Ignore.
            </h2>
            <p className="text-sm sm:text-base text-stone-600 leading-relaxed">
              Every year across India, millions of Class 10 students stand at an artificial crossroads.
              Without ever experiencing what an engineer, corporate lawyer, or clinical researcher actually
              does on a Tuesday morning, they are forced to choose an irreversible path.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* The Old Reality */}
            <div className="p-6 sm:p-8 rounded-3xl bg-red-50/50 border border-red-200/80 space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-100 text-red-800 text-xs font-bold">
                The Broken Status Quo
              </div>
              <h3 className="text-xl font-display font-bold text-red-950">
                Blind Decisions & Broken Aspirations
              </h3>
              <ul className="space-y-3 text-xs sm:text-sm text-stone-700 leading-relaxed">
                <li className="flex items-start gap-2.5">
                  <X className="size-4 text-red-500 shrink-0 mt-0.5" />
                  <span><strong>73% of Indian students</strong> admit choosing their stream based on neighbor prestige or family pressure.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <X className="size-4 text-red-500 shrink-0 mt-0.5" />
                  <span><strong>90% of students</strong> can name only 7 careers out of 250+ lucrative modern professions.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <X className="size-4 text-red-500 shrink-0 mt-0.5" />
                  <span>Massive parental anxiety and painful dinner table conflict with zero objective data.</span>
                </li>
              </ul>
            </div>

            {/* The PTIROS Shift */}
            <div className="p-6 sm:p-8 rounded-3xl bg-emerald-50/50 border border-emerald-200/80 space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold">
                The PTIROS Paradigm
              </div>
              <h3 className="text-xl font-display font-bold text-emerald-950">
                Experiential Clarity & Lifelong Mastery
              </h3>
              <ul className="space-y-3 text-xs sm:text-sm text-stone-700 leading-relaxed">
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="size-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>Test-Drive First</strong>: 3-minute tactile career simulators before committing to a 4-year college tuition.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="size-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>1% Daily Kaizen</strong>: Compounding board exam mastery with daily sprint milestones and Hansei reflection.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="size-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>Parent Alignment Dossiers</strong>: Objective 10-year Indian salary trajectories bridging the generational gap.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ─── 3. OUR STORY TIMELINE (Interactive Journey) ──── */}
      <section className="py-16 sm:py-24 bg-[#FFFBF5] border-b border-stone-200/70">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-orange-600">
              Evolutionary Timeline
            </span>
            <h2 className="text-2xl sm:text-4xl font-display font-black text-stone-900 tracking-tight">
              From Chalkboards to Autonomous Career Cockpits.
            </h2>
            <p className="text-sm sm:text-base text-stone-600 leading-relaxed">
              How nine years of deliberate experimentation turned a classroom question into an
              industry-grade student navigation platform.
            </p>
          </div>

          {/* Interactive Timeline Tabs */}
          <div className="flex items-center justify-center gap-2 overflow-x-auto pb-2">
            {timelineMilestones.map((m, idx) => (
              <button
                key={m.year}
                onClick={() => setActiveStage(idx)}
                className={`px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                  activeStage === idx
                    ? "bg-stone-900 text-white shadow-xs"
                    : "bg-white text-stone-600 hover:text-stone-950 border border-stone-200"
                }`}
              >
                {m.year}
              </button>
            ))}
          </div>

          {/* Active Milestone Card */}
          <div className="max-w-4xl mx-auto">
            {(() => {
              const stage = timelineMilestones[activeStage];
              const Icon = stage.icon;
              return (
                <motion.div
                  key={stage.year}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="rounded-3xl bg-white border border-orange-200/90 shadow-xl p-6 sm:p-10 space-y-6"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-100">
                    <div className="flex items-center gap-3.5">
                      <span className="size-12 rounded-2xl bg-orange-500/10 border border-orange-300 flex items-center justify-center text-primary shrink-0 shadow-xs">
                        <Icon className="size-6 text-primary" />
                      </span>
                      <div>
                        <span className="text-xs font-bold text-orange-600 uppercase tracking-wider">
                          {stage.year}
                        </span>
                        <h3 className="text-xl sm:text-2xl font-display font-bold text-stone-900">
                          {stage.title}
                        </h3>
                      </div>
                    </div>

                    <div className="text-right sm:text-right shrink-0 bg-orange-50/80 px-4 py-2 rounded-2xl border border-orange-200">
                      <p className="text-xl font-display font-black text-orange-950">{stage.stat}</p>
                      <p className="text-[10px] font-semibold text-orange-800">{stage.statLabel}</p>
                    </div>
                  </div>

                  <p className="text-sm sm:text-base text-stone-700 leading-relaxed">
                    {stage.description}
                  </p>

                  <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 text-xs sm:text-sm font-semibold text-stone-800 flex items-center gap-2.5">
                    <CheckCircle2 className="size-4 text-emerald-600 shrink-0" />
                    <span><strong>Core Breakthrough:</strong> {stage.takeaway}</span>
                  </div>
                </motion.div>
              );
            })()}
          </div>
        </div>
      </section>

      {/* ─── 4. CORE VALUES / GUIDING PRINCIPLES ─────────── */}
      <section className="py-16 sm:py-24 bg-white border-b border-stone-200/70">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-orange-600">
              Guiding Convictions
            </span>
            <h2 className="text-2xl sm:text-4xl font-display font-black text-stone-900 tracking-tight">
              What We Believe at PTIROS.
            </h2>
            <p className="text-sm sm:text-base text-stone-600 leading-relaxed">
              These principles govern every algorithm, career simulation, and mentor consultation we build.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
            {coreValues.map((val) => {
              const Icon = val.icon;
              return (
                <div
                  key={val.title}
                  className={`p-6 sm:p-8 rounded-3xl bg-gradient-to-br ${val.accent} border ${val.border} space-y-3 transition-transform hover:-translate-y-1 shadow-2xs`}
                >
                  <span className="size-11 rounded-2xl bg-white border border-stone-200 flex items-center justify-center text-stone-900 shadow-2xs">
                    <Icon className="size-5 text-primary" />
                  </span>
                  <h3 className="text-lg sm:text-xl font-display font-bold text-stone-900">
                    {val.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-stone-600 leading-relaxed font-normal">
                    {val.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─── 5. GURUKUL MENTOR FELLOWS (Pedigree & People) ─ */}
      <section className="py-16 sm:py-24 bg-[#FFFBF5] border-b border-stone-200/70">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
            <div className="max-w-2xl space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-orange-600">
                Frontline Practitioners
              </span>
              <h2 className="text-2xl sm:text-4xl font-display font-black text-stone-900 tracking-tight">
                Guided by Senior Gurukul Fellows.
              </h2>
              <p className="text-sm sm:text-base text-stone-600 leading-relaxed">
                We do not employ generic counselors reading slides. Our fellows are practicing engineers,
                surgeons, corporate associates, and designers from India&apos;s apex institutions.
              </p>
            </div>

            <button
              onClick={() => openBookingModal()}
              className="px-5 py-2.5 rounded-full bg-stone-900 hover:bg-stone-800 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-xs cursor-pointer shrink-0"
            >
              <Users className="size-4" />
              <span>Book 1:1 Fellow Strategy Call</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {mentorFellows.map((fellow) => {
              const Icon = fellow.icon;
              return (
                <div
                  key={fellow.name}
                  className="p-5 sm:p-6 rounded-3xl bg-white border border-stone-200/90 shadow-2xs space-y-4 flex flex-col justify-between group hover:border-orange-300 transition"
                >
                  <div className="space-y-3">
                    <div className="size-14 rounded-2xl overflow-hidden border border-orange-200 bg-stone-50 flex items-center justify-center shadow-xs">
                      <Blobatar name={fellow.avatar} size={56} animate="hover" className="size-full object-cover" />
                    </div>

                    <div>
                      <h4 className="font-display font-bold text-base text-stone-900 group-hover:text-primary transition-colors">
                        {fellow.name}
                      </h4>
                      <p className="text-xs font-semibold text-orange-700 mt-0.5">{fellow.role}</p>
                      <p className="text-[11px] text-stone-500 mt-1 leading-snug">{fellow.pedigree}</p>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-stone-100 flex items-center justify-between text-[11px] font-semibold text-stone-600">
                    <span className="flex items-center gap-1">
                      <Icon className="size-3.5 text-primary" />
                      <span className="truncate max-w-[140px]">{fellow.focus}</span>
                    </span>
                    <span className="flex items-center gap-1 text-amber-600 font-bold bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                      <Star className="size-3 fill-amber-500 text-amber-500" />
                      4.9
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─── 6. THE EMPIRICAL EVIDENCE & CITATIONS ────────── */}
      <section className="py-16 sm:py-20 bg-stone-900 text-white border-b border-stone-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="max-w-2xl space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-orange-400">
              The Science Behind PTIROS
            </span>
            <h2 className="text-2xl sm:text-4xl font-display font-black tracking-tight text-white">
              Grounding Intuition in Rigorous Evidence.
            </h2>
            <p className="text-sm sm:text-base text-stone-300 leading-relaxed">
              We draw inspiration from three distinct intellectual traditions to build a complete
              framework for human potential:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-stone-800/80 border border-stone-700/80 space-y-3">
              <div className="size-10 rounded-xl bg-orange-500/20 border border-orange-500/30 flex items-center justify-center text-orange-400">
                <Flame className="size-5" />
              </div>
              <h3 className="font-display font-bold text-lg text-white">Japanese Kaizen & Hansei</h3>
              <p className="text-xs text-stone-300 leading-relaxed">
                “In Japan, complacency is treated as an illness. Compounding 1% daily discipline and
                ruthless Hansei self-auditing ensures continuous evolution.”
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-stone-800/80 border border-stone-700/80 space-y-3">
              <div className="size-10 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
                <BookOpen className="size-5" />
              </div>
              <h3 className="font-display font-bold text-lg text-white">Indian Gurukul Pedagogy</h3>
              <p className="text-xs text-stone-300 leading-relaxed">
                India pioneered holistic discovery—from Sushruta&apos;s early surgical treatises to Aryabhata&apos;s
                mathematics. We revive the sacred teacher-student covenant of authentic inquiry.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-stone-800/80 border border-stone-700/80 space-y-3">
              <div className="size-10 rounded-xl bg-sky-500/20 border border-sky-500/30 flex items-center justify-center text-sky-400">
                <Cpu className="size-5" />
              </div>
              <h3 className="font-display font-bold text-lg text-white">Modern NEP 2020 EdTech</h3>
              <p className="text-xs text-stone-300 leading-relaxed">
                Fulfilling the National Education Policy 2020 vision: replacing rote memorization with
                vocational simulations, experiential internships, and verified competency micro-credentials.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ─── 7. FINAL CALL TO ACTION (Next Chapter) ───────── */}
      <section className="py-20 sm:py-28 bg-gradient-to-br from-orange-500 via-orange-600 to-amber-600 text-white text-center">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-white/15 backdrop-blur-md text-xs font-bold uppercase tracking-wider text-orange-100">
            <Sparkles className="size-3.5" />
            Your Future Starts with One Deliberate Decision
          </span>

          <h2 className="text-3xl sm:text-5xl lg:text-6xl font-display font-black tracking-tight leading-tight">
            Ready to Discover Your True Trajectory?
          </h2>

          <p className="text-base sm:text-lg text-orange-100 max-w-2xl mx-auto leading-relaxed">
            Take our comprehensive 360° Career Diagnostic or test-drive real-world careers in our
            Virtual Simulator today.
          </p>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3.5">
            <Link
              href="/career-test"
              className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-white text-stone-900 font-bold text-sm shadow-xl hover:bg-orange-50 transition active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Find Your Career Match</span>
              <Sparkles className="size-4 text-primary" />
            </Link>

            <Link
              href="/simulator"
              className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-orange-700/70 hover:bg-orange-700 text-white font-bold text-sm border border-orange-400/40 shadow-md transition active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
            >
              <Gamepad2 className="size-4" />
              <span>Test-Drive Simulator</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
