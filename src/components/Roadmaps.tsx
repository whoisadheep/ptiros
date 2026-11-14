"use client";

import { useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import {
  BookOpenCheck,
  Sparkles,
  Compass,
  Backpack,
  CheckCircle2,
  ArrowRight,
  GraduationCap,
  Trophy,
  Target,
  Layers,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import Link from "next/link";
import ScrollReveal from "./ui/ScrollReveal";

const easeOutExpo = [0.16, 1, 0.3, 1] as const;

type StageKey = "middle" | "secondary" | "senior";

interface StageInfo {
  id: StageKey;
  label: string;
  badge: string;
  gradeRange: string;
  icon: LucideIcon;
  grades: readonly string[];
}

const stages: readonly StageInfo[] = [
  {
    id: "middle",
    label: "Middle Wing",
    badge: "Foundation & Curiosity",
    gradeRange: "6th — 8th Standard",
    icon: Backpack,
    grades: ["6th", "7th", "8th"],
  },
  {
    id: "secondary",
    label: "Secondary Wing",
    badge: "Aptitude & Board Prep",
    gradeRange: "9th — 10th Standard",
    icon: Compass,
    grades: ["9th", "10th"],
  },
  {
    id: "senior",
    label: "Senior Secondary",
    badge: "Specialization & Career Launch",
    gradeRange: "11th — 12th Standard",
    icon: Trophy,
    grades: ["11th", "12th"],
  },
] as const;

interface GradeCurriculum {
  title: string;
  tagline: string;
  milestone: string;
  cards: {
    title: string;
    badge: string;
    icon: LucideIcon;
    description: string;
    highlights: string[];
    accentGradient: string;
  }[];
}

const gradeData: Record<string, GradeCurriculum> = {
  "6th": {
    title: "Class 6th Standard Roadmap",
    tagline: "Igniting curiosity, experiential learning habits, and structured foundations in math & science.",
    milestone: "Habit & Learning Style Discovery",
    cards: [
      {
        title: "Academic Booster Program",
        badge: "Core Academics",
        icon: BookOpenCheck,
        description: "Concept clarity in Science, Mathematics, and Languages through interactive drills and visual learning.",
        highlights: [
          "Weekly concept checkpoints & error logs",
          "Personalized study routine & timetable",
          "Doubt-clearing with patient mentors",
        ],
        accentGradient: "from-primary to-orange-500",
      },
      {
        title: "Skill Booster Labs",
        badge: "Future Skills",
        icon: Sparkles,
        description: "Early-stage logic building, computational thinking, and stage confidence to eliminate stage fear early.",
        highlights: [
          "Intro to algorithmic logic & block coding",
          "Spoken English & public speaking confidence",
          "Speed arithmetic & memory enhancement",
        ],
        accentGradient: "from-orange-500 to-amber-500",
      },
      {
        title: "1:1 Mentorship & Habits",
        badge: "Personal Mentoring",
        icon: Compass,
        description: "Continuous guidance from senior mentors helping children balance homework, screen time, and hobbies.",
        highlights: [
          "Hansei daily reflection diary tracking",
          "Monthly parent-mentor progress review",
          "Identification of natural strengths",
        ],
        accentGradient: "from-amber-500 to-orange-600",
      },
      {
        title: "NEP 2020 Bagless Days",
        badge: "Hands-on Activities",
        icon: Backpack,
        description: "10 experiential learning days per academic year with hands-on vocational modules and science kits.",
        highlights: [
          "Zero textbook, practical maker workshops",
          "Origami mathematics & nature science labs",
          "Govt-aligned participation certificates",
        ],
        accentGradient: "from-primary-dark to-primary",
      },
    ],
  },
  "7th": {
    title: "Class 7th Standard Roadmap",
    tagline: "Deepening logical reasoning, independent problem-solving skills, and self-directed study routines.",
    milestone: "Logical Reasoning & Communication",
    cards: [
      {
        title: "Academic Booster Program",
        badge: "Core Academics",
        icon: BookOpenCheck,
        description: "Strengthening algebra, scientific application, and language expression with chapter-wise analytics.",
        highlights: [
          "Weekly adaptive quizzes & problem banks",
          "School exam preparation & mock series",
          "Concept mastery before moving to new chapters",
        ],
        accentGradient: "from-primary to-orange-500",
      },
      {
        title: "Skill Booster Labs",
        badge: "Future Skills",
        icon: Sparkles,
        description: "Inter-school debate prep, robotics basics, and practical digital literacy for young learners.",
        highlights: [
          "Robotics & basic electronics experiments",
          "Structured debate & argument building",
          "Creative writing & presentation design",
        ],
        accentGradient: "from-orange-500 to-amber-500",
      },
      {
        title: "1:1 Mentorship & Focus",
        badge: "Personal Mentoring",
        icon: Compass,
        description: "Overcoming procrastination and building focus using Japanese Pomodoro and Kaizen time blocks.",
        highlights: [
          "Personalized study timetable calibration",
          "Kaizen 15-minute daily diary check-ins",
          "Screen-time balance & health coaching",
        ],
        accentGradient: "from-amber-500 to-orange-600",
      },
      {
        title: "NEP 2020 Bagless Days",
        badge: "Hands-on Activities",
        icon: Backpack,
        description: "Applied learning projects connecting textbook concepts to real community and nature problems.",
        highlights: [
          "Environmental science field observation",
          "Hands-on pottery, carpentry & electronics",
          "Creative group problem-solving sprint",
        ],
        accentGradient: "from-primary-dark to-primary",
      },
    ],
  },
  "8th": {
    title: "Class 8th Standard Roadmap",
    tagline: "Bridging middle school to high school rigor with preliminary aptitude profiling and board readiness.",
    milestone: "Pre-High School Bridge & Aptitude",
    cards: [
      {
        title: "Academic Booster Program",
        badge: "Core Academics",
        icon: BookOpenCheck,
        description: "Targeted support in higher-level geometry, physics, chemistry, and advanced language comprehension.",
        highlights: [
          "Pre-boards bridge curriculum (CBSE/ICSE)",
          "Regular timed chapter test series",
          "Dedicated 1:1 doubt-clearing sessions",
        ],
        accentGradient: "from-primary to-orange-500",
      },
      {
        title: "Skill Booster Labs",
        badge: "Future Skills",
        icon: Sparkles,
        description: "Critical reasoning, introductory Python coding, and financial literacy essentials for teenagers.",
        highlights: [
          "Python programming fundamentals",
          "Teen financial literacy & budgeting basics",
          "Advanced persuasion & storytelling skills",
        ],
        accentGradient: "from-orange-500 to-amber-500",
      },
      {
        title: "1:1 Mentorship & Aptitude",
        badge: "Personal Mentoring",
        icon: Compass,
        description: "Early cognitive profiling to discover which streams align best with the student's unique personality.",
        highlights: [
          "Preliminary 360° diagnostic assessment",
          "Mentor guidance on high school stream options",
          "Confidence building & exam stress inoculation",
        ],
        accentGradient: "from-amber-500 to-orange-600",
      },
      {
        title: "NEP 2020 Bagless Days",
        badge: "Hands-on Activities",
        icon: Backpack,
        description: "Vocational immersion in modern trades, digital tools, and collaborative design-thinking challenges.",
        highlights: [
          "Applied science model fabrication",
          "Community surveying & civic data projects",
          "Government-verified portfolio credentials",
        ],
        accentGradient: "from-primary-dark to-primary",
      },
    ],
  },
  "9th": {
    title: "Class 9th Standard Roadmap",
    tagline: "Laying the bedrock for Board examinations and initiating structured stream selection planning.",
    milestone: "High School Foundation & Stream Filter",
    cards: [
      {
        title: "Academic Booster Program",
        badge: "Board Foundation",
        icon: BookOpenCheck,
        description: "Mastering Class 9 high-rigor syllabus with NCERT deep-dives, exemplary question banks, and weekly tests.",
        highlights: [
          "Exemplar problem solving & step marking",
          "Formula sheets & mind-map revisions",
          "Strategic timetable synced with school exams",
        ],
        accentGradient: "from-primary to-orange-500",
      },
      {
        title: "Skill Booster Labs",
        badge: "Future Skills",
        icon: Sparkles,
        description: "Scientific research orientation, TOEFL/IELTS starter vocabulary, and data interpretation skills.",
        highlights: [
          "English proficiency & global speaking drills",
          "Data analysis & spreadsheet fundamentals",
          "Scientific paper reading & hypothesis testing",
        ],
        accentGradient: "from-orange-500 to-amber-500",
      },
      {
        title: "1:1 Mentorship & Stream Blueprint",
        badge: "Career Blueprint",
        icon: Compass,
        description: "Preliminary stream selection counseling to narrow down PCM, PCB, Commerce, or Humanities trajectories.",
        highlights: [
          "In-depth 360° psychometric diagnostic test",
          "Parent & student stream alignment session",
          "Personal study hour optimization",
        ],
        accentGradient: "from-amber-500 to-orange-600",
      },
      {
        title: "NEP 2020 Bagless Days",
        badge: "Hands-on Activities",
        icon: Backpack,
        description: "Industrial visits, coding hackathons, and real-world case studies bridging theory with industry reality.",
        highlights: [
          "Virtual & on-site industry exposure visits",
          "Entrepreneurial mini-venture project",
          "National-level certificate of accomplishment",
        ],
        accentGradient: "from-primary-dark to-primary",
      },
    ],
  },
  "10th": {
    title: "Class 10th Standard Roadmap",
    tagline: "Board exam excellence, stress-free revision schedules, and definitive stream selection blueprint.",
    milestone: "Board Mastery & Stream Decision Dossier",
    cards: [
      {
        title: "Board Booster Masterclass",
        badge: "Board Excellence",
        icon: BookOpenCheck,
        description: "Comprehensive 10th Board exam coaching with 10-year past papers, answer-writing rubrics, and mock sprints.",
        highlights: [
          "Previous 10-year question paper drills",
          "CBSE/ICSE examiner answer-writing rubrics",
          "Full-length proctored pre-board simulations",
        ],
        accentGradient: "from-primary to-orange-500",
      },
      {
        title: "Skill Booster Labs",
        badge: "Future Skills",
        icon: Sparkles,
        description: "Leadership, critical thinking, advanced English rhetoric, and international aptitude test basics.",
        highlights: [
          "Advanced communication & rhetorical skills",
          "Decision-making & crisis resolution drills",
          "Preliminary SAT / aptitude foundation",
        ],
        accentGradient: "from-orange-500 to-amber-500",
      },
      {
        title: "1:1 Stream Selection Dossier",
        badge: "Career Blueprint",
        icon: Compass,
        description: "The definitive PTIROS 10-page Stream Decision Report resolving PCM, PCB, Commerce, or Humanities.",
        highlights: [
          "Full 360° diagnostic report & career mapping",
          "1:1 counseling with parents to remove doubts",
          "Subject combinations tailored to future careers",
        ],
        accentGradient: "from-amber-500 to-orange-600",
      },
      {
        title: "NEP 2020 Bagless Days",
        badge: "Hands-on Activities",
        icon: Backpack,
        description: "Career shadowing, prototype building, and practical science exhibitions validating real competencies.",
        highlights: [
          "Career shadowing with industry mentors",
          "Applied science & technology showcase",
          "Verified credentials for school portfolios",
        ],
        accentGradient: "from-primary-dark to-primary",
      },
    ],
  },
  "11th": {
    title: "Class 11th Standard Roadmap",
    tagline: "Mastering chosen stream concepts, competitive exam foundation (JEE/NEET/CUET/CLAT), and profile building.",
    milestone: "Stream Specialization & Competitive Prep",
    cards: [
      {
        title: "Stream Academic Mastery",
        badge: "Specialized Stream",
        icon: BookOpenCheck,
        description: "Deep conceptual grounding in PCM, PCB, Commerce, or Humanities with dual focus on school and entrances.",
        highlights: [
          "Stream-specific subject deep-dives",
          "Competitive exam foundation (JEE/NEET/CUET)",
          "Error-tracking journal & revision timetable",
        ],
        accentGradient: "from-primary to-orange-500",
      },
      {
        title: "Skill Booster Labs",
        badge: "Future Skills",
        icon: Sparkles,
        description: "Data analysis, scientific research writing, case study modeling, and global language proficiency.",
        highlights: [
          "IELTS / TOEFL high-band speaking & writing",
          "Research methodology & case studies",
          "Professional presentation & pitching skills",
        ],
        accentGradient: "from-orange-500 to-amber-500",
      },
      {
        title: "1:1 Competitive Mentorship",
        badge: "Entrance Strategy",
        icon: Compass,
        description: "Personal mentor guidance from IIT, AIIMS, and IIM alumni for high-stakes entrance exam strategy.",
        highlights: [
          "Exam strategy, time allocation & mock analysis",
          "Burnout prevention & psychological resilience",
          "College entrance criteria roadmap",
        ],
        accentGradient: "from-amber-500 to-orange-600",
      },
      {
        title: "NEP 2020 Bagless Days",
        badge: "Hands-on Activities",
        icon: Backpack,
        description: "University lab immersion, research paper drafting, and industry case sprints for profile building.",
        highlights: [
          "Capstone research project in chosen field",
          "Mentorship with university researchers",
          "Government & institutional certified credits",
        ],
        accentGradient: "from-primary-dark to-primary",
      },
    ],
  },
  "12th": {
    title: "Class 12th Standard Roadmap",
    tagline: "Board rank acceleration, competitive entrance execution, and college admissions launchpad.",
    milestone: "College Admissions & Career Launch",
    cards: [
      {
        title: "Board & Rank Accelerator",
        badge: "Final Sprint",
        icon: BookOpenCheck,
        description: "High-intensity revision, all-India mock series, and targeted score maximization across boards and entrances.",
        highlights: [
          "Board exam score maximization drills",
          "High-yield question banks & formula blitz",
          "Mock test analysis & rank prediction",
        ],
        accentGradient: "from-primary to-orange-500",
      },
      {
        title: "Skill Booster Labs",
        badge: "Future Skills",
        icon: Sparkles,
        description: "College interview preparation, SOP drafting, resume crafting, and personal branding for global universities.",
        highlights: [
          "College interview simulations with alumni",
          "Statement of Purpose (SOP) & essay writing",
          "Professional networking & personal branding",
        ],
        accentGradient: "from-orange-500 to-amber-500",
      },
      {
        title: "1:1 College Launchpad",
        badge: "Admissions Guidance",
        icon: Compass,
        description: "Complete admissions strategy: college list selection, counseling rounds, scholarship applications, and career transition.",
        highlights: [
          "Top college application & cut-off navigation",
          "Scholarship mapping & financial aid guidance",
          "Parent counseling for counseling choices",
        ],
        accentGradient: "from-amber-500 to-orange-600",
      },
      {
        title: "NEP 2020 Bagless Days",
        badge: "Hands-on Activities",
        icon: Backpack,
        description: "Real-world capstone portfolio, industry internship simulations, and final graduation dossier.",
        highlights: [
          "Comprehensive student portfolio dossier",
          "Industry internship simulation certificate",
          "PTIROS Alumni Network lifetime membership",
        ],
        accentGradient: "from-primary-dark to-primary",
      },
    ],
  },
};

export default function Roadmaps() {
  const [activeStage, setActiveStage] = useState<StageKey>("secondary");
  const [activeGrade, setActiveGrade] = useState<string>("10th");
  const prefersReducedMotion = useReducedMotion();

  const handleStageSelect = (stageId: StageKey) => {
    setActiveStage(stageId);
    const stage = stages.find((s) => s.id === stageId);
    if (stage && !stage.grades.includes(activeGrade)) {
      setActiveGrade(stage.grades[0]);
    }
  };

  const currentStage = stages.find((s) => s.id === activeStage) || stages[1];
  const curriculum = gradeData[activeGrade] || gradeData["10th"];

  return (
    <section
      id="roadmaps"
      className="relative overflow-hidden bg-bg-muted py-16 sm:py-24 lg:py-32"
      aria-labelledby="roadmaps-heading"
    >
      <div className="pointer-events-none absolute inset-0 bg-mesh opacity-60" aria-hidden="true" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-8 lg:px-12">
        {/* Section Header */}
        <ScrollReveal direction="up" distance={20}>
          <div className="mb-10 text-center sm:mb-14">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3.5 py-1 text-[11px] font-semibold uppercase tracking-widest text-primary mb-3 sm:text-xs">
              <Layers className="h-3.5 w-3.5" />
              <span>NEP 2020 Blueprints</span>
            </div>
            <h2
              id="roadmaps-heading"
              className="font-display text-2xl font-bold tracking-tight text-accent sm:text-4xl lg:text-5xl"
            >
              Explore Grade-Wise <span className="text-gradient">Roadmaps</span>
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-sm text-text-muted sm:text-base lg:text-lg">
              Structured progression tailored to each stage of Indian schooling—from middle school curiosity to high school board excellence and college launch.
            </p>
          </div>
        </ScrollReveal>

        {/* 1. Academic Stage Selector */}
        {/* Desktop View (≥ 640px): 3 spacious cards */}
        <div className="hidden sm:grid sm:grid-cols-3 gap-3 max-w-3xl mx-auto mb-6">
          {stages.map((stage) => {
            const Icon = stage.icon;
            const isSelected = activeStage === stage.id;
            return (
              <button
                key={stage.id}
                onClick={() => handleStageSelect(stage.id)}
                className={`group relative flex cursor-pointer flex-col items-center rounded-2xl border p-4 text-center transition-all duration-200 ${
                  isSelected
                    ? "border-primary bg-white shadow-xl shadow-primary/10 ring-2 ring-primary/20"
                    : "border-border/60 bg-white/60 hover:border-primary/40 hover:bg-white"
                }`}
              >
                <div
                  className={`mb-2.5 flex h-10 w-10 items-center justify-center rounded-xl transition-colors ${
                    isSelected
                      ? "bg-primary text-white shadow-md shadow-primary/25"
                      : "bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white"
                  }`}
                >
                  <Icon className="h-5 w-5" />
                </div>
                <span className={`font-display text-base font-bold ${isSelected ? "text-primary" : "text-accent"}`}>
                  {stage.label}
                </span>
                <span className="mt-0.5 text-xs text-text-muted font-medium">
                  {stage.gradeRange}
                </span>
                <span className="mt-1 inline-block rounded-full bg-primary/5 px-2 py-0.5 text-[10px] font-semibold text-primary/80">
                  {stage.badge}
                </span>
              </button>
            );
          })}
        </div>

        {/* Mobile View (< 640px): 1-Row Segmented Bar (Saves 450px vertical height!) */}
        <div className="grid grid-cols-3 gap-1.5 sm:hidden p-1.5 rounded-2xl bg-white/90 border border-border/80 shadow-xs mb-4">
          {stages.map((stage) => {
            const Icon = stage.icon;
            const isSelected = activeStage === stage.id;
            return (
              <button
                key={stage.id}
                onClick={() => handleStageSelect(stage.id)}
                className={`flex flex-col items-center justify-center py-2 px-1 rounded-xl transition-all duration-200 ${
                  isSelected
                    ? "bg-primary text-white shadow-sm"
                    : "text-accent hover:bg-black/5"
                }`}
                style={{ minHeight: "48px" }}
              >
                <Icon className={`h-4 w-4 mb-0.5 ${isSelected ? "text-white" : "text-primary"}`} />
                <span className="text-[11px] font-bold leading-tight">
                  {stage.label.split(" ")[0]}
                </span>
                <span className={`text-[9px] ${isSelected ? "text-white/80" : "text-text-muted"}`}>
                  {stage.gradeRange.split(" ")[0]}
                </span>
              </button>
            );
          })}
        </div>

        {/* 2. Compact Grade Selector Pills for Active Stage */}
        <div className="mb-6 flex flex-col items-center">
          <div className="flex items-center gap-1.5 rounded-full border border-border/70 bg-white/90 p-1 shadow-xs backdrop-blur-sm">
            {currentStage.grades.map((grade) => {
              const isSelected = activeGrade === grade;
              return (
                <button
                  key={grade}
                  onClick={() => setActiveGrade(grade)}
                  className="relative cursor-pointer rounded-full px-4 py-1.5 text-xs font-semibold transition-colors duration-200 sm:px-6 sm:py-2 sm:text-sm"
                  style={{ minHeight: "38px" }}
                >
                  {isSelected && (
                    <motion.span
                      layoutId="active-grade-indicator"
                      className="absolute inset-0 rounded-full bg-primary shadow-xs shadow-primary/25"
                      transition={{
                        type: "spring",
                        stiffness: 450,
                        damping: 32,
                      }}
                    />
                  )}
                  <span
                    className={`relative z-10 transition-colors ${
                      isSelected ? "text-white font-bold" : "text-accent hover:text-primary"
                    }`}
                  >
                    {grade} Standard
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 3. Grade Focus Banner */}
        <div className="mb-6 overflow-hidden rounded-2xl border border-primary/20 bg-gradient-to-r from-primary/10 via-white to-primary/5 p-4 sm:p-7 shadow-xs">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-primary">
                <Target className="h-3.5 w-3.5" />
                <span>{currentStage.label} • {activeGrade} Standard</span>
              </div>
              <h3 className="mt-1 font-display text-xl font-bold tracking-tight text-accent sm:text-2xl">
                {curriculum.title}
              </h3>
              <p className="mt-1 text-xs leading-relaxed text-text-muted sm:text-sm max-w-xl">
                {curriculum.tagline}
              </p>
            </div>
            <div className="flex shrink-0 items-center gap-1.5 rounded-xl border border-primary/20 bg-white/90 px-3 py-2 text-xs shadow-2xs self-start sm:self-auto sm:flex-col sm:items-end">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-text-muted">
                Key Milestone
              </span>
              <span className="font-display font-bold text-accent text-xs sm:text-sm flex items-center gap-1.5">
                <Target className="size-3.5 text-primary" />
                <span>{curriculum.milestone}</span>
              </span>
            </div>
          </div>
        </div>

        {/* 4. The 4 Rich Curriculum Tracks */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeGrade}
            initial={prefersReducedMotion ? {} : { opacity: 0, y: 12 }}
            animate={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
            exit={prefersReducedMotion ? {} : { opacity: 0, y: -12 }}
            transition={{ duration: 0.3, ease: easeOutExpo }}
            className="grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2"
          >
            {curriculum.cards.map((card, idx) => {
              const Icon = card.icon;
              return (
                <div
                  key={`${activeGrade}-${card.title}-${idx}`}
                  className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-border/70 bg-white p-5 sm:p-7 shadow-xs transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-lg"
                >
                  <div className={`absolute left-0 right-0 top-0 h-1 bg-gradient-to-r ${card.accentGradient}`} />

                  <div>
                    <div className="mb-3 flex items-center justify-between">
                      <div className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-xl bg-primary/10 text-primary transition-all duration-300 group-hover:bg-primary group-hover:text-white">
                        <Icon className="h-5 w-5 sm:h-6 sm:w-6" />
                      </div>
                      <span className="rounded-full border border-primary/20 bg-primary/5 px-2.5 py-0.5 text-[11px] font-semibold text-primary">
                        {card.badge}
                      </span>
                    </div>

                    <h4 className="mb-1.5 font-display text-lg sm:text-xl font-bold text-accent">
                      {card.title}
                    </h4>

                    <p className="mb-4 text-xs sm:text-sm leading-relaxed text-text-muted">
                      {card.description}
                    </p>

                    <ul className="mb-4 space-y-2">
                      {card.highlights.map((item, i) => (
                        <li key={i} className="flex items-start gap-2 text-xs text-text">
                          <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" />
                          <span className="leading-snug">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="pt-3 border-t border-border/50">
                    <Link
                      href="/career-test"
                      className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-primary transition-colors hover:text-primary-dark"
                    >
                      <span>Explore this track for Class {activeGrade}</span>
                      <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </motion.div>
        </AnimatePresence>

        {/* 5. Bottom Diagnostic CTA Bar */}
        <ScrollReveal direction="up" distance={20} delay={0.1}>
          <div className="mt-8 sm:mt-12 rounded-2xl bg-accent p-6 text-white shadow-xl sm:p-10">
            <div className="flex flex-col items-center justify-between gap-5 text-center sm:flex-row sm:text-left">
              <div>
                <span className="inline-block rounded-full bg-primary/20 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-primary-light mb-1.5">
                  Personalized Recommendation
                </span>
                <h4 className="font-display text-lg sm:text-2xl font-bold">
                  Unsure which stream is right for Class {activeGrade}?
                </h4>
                <p className="mt-1 text-xs sm:text-base text-white/70">
                  Take our 5-minute diagnostic test for an aptitude radar map and tailored course blueprint.
                </p>
              </div>
              <Link
                href="/career-test"
                className="inline-flex w-full sm:w-auto shrink-0 cursor-pointer items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-primary/25 transition-all hover:bg-primary-dark active:scale-[0.98]"
                style={{ minHeight: "44px" }}
              >
                <span>Give Career Test</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
