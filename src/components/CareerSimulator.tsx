"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Cpu,
  Scale,
  Palette,
  Stethoscope,
  TrendingUp,
  Film,
  ArrowRight,
  Clock,
  Zap,
  Trophy,
  X,
  ChevronRight,
  Check,
  RotateCcw,
  Sparkles,
  Star,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import ScrollReveal from "./ui/ScrollReveal";
import Link from "next/link";

const easeOutExpo = [0.16, 1, 0.3, 1] as const;

/* ─── Types ────────────────────────────────────── */

interface SimQuestion {
  prompt: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

interface CareerSim {
  id: string;
  icon: LucideIcon;
  title: string;
  tagline: string;
  color: string;
  bgGradient: string;
  duration: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  description: string;
  scenario: string;
  questions: SimQuestion[];
}

/* ─── Simulation Data ──────────────────────────── */

const simulations: CareerSim[] = [
  {
    id: "ai-robotics",
    icon: Cpu,
    title: "AI & Robotics",
    tagline: "Program. Build. Innovate.",
    color: "#6366F1",
    bgGradient: "from-indigo-500 to-purple-600",
    duration: "2 min",
    difficulty: "Intermediate",
    description:
      "Step into the shoes of an AI engineer. Solve real-world problems using logic and pattern recognition.",
    scenario:
      "You're an AI Engineer at a robotics startup. A warehouse robot is malfunctioning — it keeps crashing into shelves. Your task: diagnose and fix the issue.",
    questions: [
      {
        prompt:
          "The robot's collision sensor shows normal readings, but it still crashes. What's the most likely root cause?",
        options: [
          "The motor is too fast",
          "The pathfinding algorithm has a bug",
          "The battery is low",
          "The wheels are misaligned",
        ],
        correctIndex: 1,
        explanation:
          "When sensors are working fine but the robot still collides, the issue is in the software logic — specifically the pathfinding algorithm that calculates the route.",
      },
      {
        prompt:
          "You've found a bug in the A* pathfinding algorithm. The robot ignores obstacles in its second scan. Which fix is correct?",
        options: [
          "Increase the sensor range",
          "Reset obstacle map before each full scan cycle",
          "Add more RAM to the robot",
          "Reduce the robot's speed by 50%",
        ],
        correctIndex: 1,
        explanation:
          "Resetting the obstacle map ensures each scan starts fresh, preventing stale data from causing the robot to ignore newly detected obstacles.",
      },
      {
        prompt:
          "After fixing the bug, how would you verify the robot works correctly before deploying to the warehouse?",
        options: [
          "Just deploy it and see what happens",
          "Run a simulation with virtual obstacles first",
          "Ask a colleague to watch it",
          "Check the code one more time by reading it",
        ],
        correctIndex: 1,
        explanation:
          "Running simulations with virtual obstacles is the industry standard for testing robotics software — it's safe, repeatable, and catches edge cases.",
      },
    ],
  },
  {
    id: "corporate-law",
    icon: Scale,
    title: "Corporate Law",
    tagline: "Analyse. Argue. Advocate.",
    color: "#0EA5E9",
    bgGradient: "from-sky-500 to-blue-600",
    duration: "2 min",
    difficulty: "Beginner",
    description:
      "Think like a lawyer. Review contracts, spot ethical issues, and make arguments that win.",
    scenario:
      "You're a junior corporate lawyer. A client's business partner wants to add a non-compete clause that seems unfair. Your job: protect your client's interests.",
    questions: [
      {
        prompt:
          'The proposed non-compete clause says: "The party shall not engage in any business activity for 10 years within India." What\'s the main legal problem?',
        options: [
          "It's not written in legal language",
          "The duration and geographic scope are unreasonably broad",
          "It needs more signatures",
          "Non-compete clauses are always illegal",
        ],
        correctIndex: 1,
        explanation:
          "Indian courts typically strike down non-compete clauses that are too broad in duration (10 years is excessive) or geographic scope (all of India is too wide).",
      },
      {
        prompt:
          "Your client wants to counter-propose. What would be a reasonable alternative?",
        options: [
          "Remove the clause entirely",
          "2-year restriction within the same city and same industry",
          "Lifetime restriction but only in the same office building",
          "No restriction but the partner pays a penalty",
        ],
        correctIndex: 1,
        explanation:
          "Courts generally accept non-compete clauses that are limited in time (1-2 years), geography (same city/region), and scope (same industry). This balances both parties' interests.",
      },
      {
        prompt:
          "The opposing lawyer argues their clause is standard practice. How do you respond?",
        options: [
          "Accept their argument and agree",
          "Cite Section 27 of the Indian Contract Act which restricts restraint of trade",
          "Threaten to walk away from the deal",
          "Ask for more time to think about it",
        ],
        correctIndex: 1,
        explanation:
          "Section 27 of the Indian Contract Act declares agreements in restraint of trade void. Citing this law strengthens your position with legal authority.",
      },
    ],
  },
  {
    id: "ux-design",
    icon: Palette,
    title: "UX Design",
    tagline: "Design. Test. Delight.",
    color: "#EC4899",
    bgGradient: "from-pink-500 to-rose-600",
    duration: "2 min",
    difficulty: "Beginner",
    description:
      "Design interfaces that people love. Make decisions that shape how millions interact with technology.",
    scenario:
      "You're a UX Designer at an ed-tech startup. The student dashboard has a 70% bounce rate — students leave without completing their first lesson. Fix it!",
    questions: [
      {
        prompt:
          "Students say the dashboard is 'overwhelming'. What's the first step in your UX process?",
        options: [
          "Change all the colors to something calmer",
          "Conduct user interviews and analyze the current information hierarchy",
          "Add more features so students stay longer",
          "Make all the text bigger",
        ],
        correctIndex: 1,
        explanation:
          "Always start with user research. Understanding WHY students feel overwhelmed (through interviews and hierarchy analysis) prevents you from solving the wrong problem.",
      },
      {
        prompt:
          "Your research shows students see 15+ options on first login. What design principle should you apply?",
        options: [
          "Add animations to make it feel faster",
          "Progressive disclosure — show only 3-4 key actions first",
          "Put everything in a dropdown menu",
          "Add a tutorial video that explains everything",
        ],
        correctIndex: 1,
        explanation:
          "Progressive disclosure reduces cognitive load by showing only essential options first, then revealing more as users need them. It's a core UX principle (Hick's Law).",
      },
      {
        prompt:
          "You've redesigned the dashboard. How do you measure if your changes worked?",
        options: [
          "Ask your boss if they like it",
          "Run an A/B test comparing old vs new design with real users",
          "Post it on social media and count likes",
          "If it looks better, it works better",
        ],
        correctIndex: 1,
        explanation:
          "A/B testing with real users provides objective, data-driven evidence of whether your design changes actually improved the user experience and reduced bounce rate.",
      },
    ],
  },
  {
    id: "medicine",
    icon: Stethoscope,
    title: "Medicine",
    tagline: "Diagnose. Heal. Care.",
    color: "#10B981",
    bgGradient: "from-emerald-500 to-teal-600",
    duration: "2 min",
    difficulty: "Intermediate",
    description:
      "Think like a doctor. Analyze symptoms, consider differentials, and make life-saving decisions.",
    scenario:
      "You're a resident doctor in the emergency department. A 16-year-old student comes in with sudden chest pain during a cricket match. Diagnose and manage the case.",
    questions: [
      {
        prompt:
          "The student has sharp chest pain on the left side, worse with breathing. Vitals: HR 110, BP 120/80, SpO2 94%. What's your first priority?",
        options: [
          "Give painkillers immediately",
          "Order a chest X-ray and check for pneumothorax",
          "Tell the patient to rest and come back tomorrow",
          "Start antibiotics for a possible infection",
        ],
        correctIndex: 1,
        explanation:
          "Sharp, pleuritic chest pain with tachycardia and slightly low oxygen in a young athlete suggests pneumothorax (collapsed lung). A chest X-ray is the immediate diagnostic step.",
      },
      {
        prompt:
          "The X-ray shows a small (15%) left-sided pneumothorax. The patient is stable. What's the appropriate management?",
        options: [
          "Emergency surgery immediately",
          "Observation with high-flow oxygen and repeat X-ray in 4-6 hours",
          "Send the patient home with painkillers",
          "Insert a chest tube right away",
        ],
        correctIndex: 1,
        explanation:
          "Small pneumothorax (<20%) in a stable patient is managed conservatively with observation, supplemental oxygen (speeds air reabsorption), and repeat imaging to ensure it's not expanding.",
      },
      {
        prompt:
          "The repeat X-ray shows the pneumothorax hasn't changed. The patient asks when they can play cricket again. What do you advise?",
        options: [
          "They can play next week if they feel fine",
          "Wait for complete resolution, then gradually return to activity over 2-4 weeks with medical clearance",
          "They should never play sports again",
          "They can play tomorrow if they take painkillers",
        ],
        correctIndex: 1,
        explanation:
          "Return to sports after pneumothorax requires complete resolution confirmed by imaging, followed by gradual return to activity. Rushing back risks recurrence.",
      },
    ],
  },
  {
    id: "finance",
    icon: TrendingUp,
    title: "Finance & Business",
    tagline: "Analyse. Invest. Grow.",
    color: "#F59E0B",
    bgGradient: "from-amber-500 to-orange-600",
    duration: "2 min",
    difficulty: "Beginner",
    description:
      "Make strategic financial decisions. Analyze markets, manage risk, and build wealth.",
    scenario:
      "You're a financial analyst at a mutual fund. A client with ₹5 lakh wants to invest for their child's college education (10 years away). Create an investment strategy.",
    questions: [
      {
        prompt:
          "The client says 'I want maximum returns with zero risk.' How do you respond as a professional?",
        options: [
          "Promise them 20% annual returns",
          "Explain the risk-return tradeoff and assess their actual risk tolerance",
          "Put everything in a savings account",
          "Invest everything in cryptocurrency",
        ],
        correctIndex: 1,
        explanation:
          "The risk-return tradeoff is fundamental: higher potential returns always come with higher risk. A good advisor educates clients and finds the right balance for their goals and comfort level.",
      },
      {
        prompt:
          "After assessment, the client has moderate risk tolerance. With a 10-year horizon, what's the most suitable allocation?",
        options: [
          "100% in stocks for maximum growth",
          "60% equity mutual funds, 30% debt funds, 10% gold ETFs",
          "100% fixed deposits for safety",
          "50% crypto, 50% real estate",
        ],
        correctIndex: 1,
        explanation:
          "A diversified 60-30-10 portfolio balances growth (equity), stability (debt), and inflation hedge (gold). The 10-year horizon allows for equity exposure while debt provides safety.",
      },
      {
        prompt:
          "Two years in, the stock market drops 30%. The client panics and wants to sell everything. What's your advice?",
        options: [
          "Sell everything as they requested",
          "Explain that corrections are normal, stay invested, and consider buying more at lower prices (SIP)",
          "Move everything to gold",
          "Stop all investments and wait",
        ],
        correctIndex: 1,
        explanation:
          "Market corrections are normal and temporary. With 8 years still remaining, staying invested and continuing SIPs (buying at lower prices) historically leads to better long-term outcomes.",
      },
    ],
  },
  {
    id: "media",
    icon: Film,
    title: "Media & Content",
    tagline: "Create. Engage. Inspire.",
    color: "#8B5CF6",
    bgGradient: "from-violet-500 to-purple-600",
    duration: "2 min",
    difficulty: "Beginner",
    description:
      "Craft compelling stories and content strategies. Learn how media shapes perception and drives engagement.",
    scenario:
      "You're a content strategist at a digital media company. A new education startup wants to reach students aged 14-18 on social media. Build their content strategy.",
    questions: [
      {
        prompt:
          "The startup wants to post the same content on Instagram, YouTube, and LinkedIn. What's the problem with this approach?",
        options: [
          "Nothing, it saves time",
          "Each platform has different audiences, formats, and engagement patterns — content needs to be platform-native",
          "They should only use one platform",
          "They need to post more frequently",
        ],
        correctIndex: 1,
        explanation:
          "Platform-native content performs 3-5x better. Instagram favors visual storytelling (Reels/Carousels), YouTube rewards long-form depth, and LinkedIn needs professional value. Cross-posting feels lazy to audiences.",
      },
      {
        prompt:
          "For Instagram Reels targeting 14-18 year old students, which content format would perform best?",
        options: [
          "Long text posts explaining career options",
          "Quick 'Day in the Life' career simulations with trending audio and fast cuts",
          "Formal interview-style videos with experts",
          "Stock photo slideshows with facts",
        ],
        correctIndex: 1,
        explanation:
          "'Day in the Life' content is among the top-performing formats for Gen-Z. Combined with trending audio and fast editing, it creates aspirational, shareable content that drives organic reach.",
      },
      {
        prompt:
          "After 1 month, Reels get 50K views but only 20 website visits. How do you improve the conversion?",
        options: [
          "Buy more ads",
          "Add clear CTAs, use link-in-bio tools, and create 'Part 2 on our website' hooks",
          "Stop making Reels",
          "Post the website URL in every caption",
        ],
        correctIndex: 1,
        explanation:
          "The views-to-conversion gap is solved with strategic CTAs, link-in-bio tools (like Linktree), and content hooks that drive curiosity ('Full career roadmap on our site'). This bridges entertainment and action.",
      },
    ],
  },
];

/* ─── Confetti Component ───────────────────────── */

function Confetti() {
  const pieces = Array.from({ length: 24 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    delay: Math.random() * 0.3,
    color: ["#F97316", "#6366F1", "#EC4899", "#10B981", "#F59E0B", "#8B5CF6"][
      i % 6
    ],
    rotation: Math.random() * 720 - 360,
    size: Math.random() * 6 + 4,
  }));

  return (
    <div className="pointer-events-none fixed inset-0 z-[100] overflow-hidden">
      {pieces.map((p) => (
        <motion.div
          key={p.id}
          initial={{ y: -20, x: `${p.x}vw`, opacity: 1, rotate: 0 }}
          animate={{
            y: "110vh",
            opacity: 0,
            rotate: p.rotation,
          }}
          transition={{
            duration: 2.5 + Math.random(),
            delay: p.delay,
            ease: "easeOut",
          }}
          className="absolute rounded-sm"
          style={{
            width: p.size,
            height: p.size * 1.4,
            backgroundColor: p.color,
          }}
        />
      ))}
    </div>
  );
}

/* ─── Career Card ──────────────────────────────── */

function CareerCard({
  sim,
  onStart,
  index,
}: {
  sim: CareerSim;
  onStart: () => void;
  index: number;
}) {
  const Icon = sim.icon;
  return (
    <ScrollReveal delay={index * 0.07} direction="up" distance={24}>
      <motion.div
        whileHover={{ y: -6, scale: 1.015 }}
        transition={{ duration: 0.3, ease: easeOutExpo }}
        className="group relative flex h-full cursor-pointer flex-col overflow-hidden rounded-3xl border border-border/60 bg-white shadow-sm transition-shadow duration-300 hover:shadow-xl hover:shadow-black/8"
        onClick={onStart}
      >
        {/* Top Gradient Bar */}
        <div
          className={`h-1.5 w-full bg-gradient-to-r ${sim.bgGradient}`}
        />

        <div className="flex flex-1 flex-col p-5 sm:p-6">
          {/* Icon + Badges */}
          <div className="flex items-start justify-between">
            <div
              className="flex h-13 w-13 items-center justify-center rounded-2xl shadow-md transition-transform duration-300 group-hover:scale-110"
              style={{ backgroundColor: `${sim.color}15` }}
            >
              <Icon
                className="h-6 w-6"
                style={{ color: sim.color }}
                strokeWidth={2}
              />
            </div>
            <div className="flex items-center gap-1.5">
              <span className="flex items-center gap-1 rounded-full bg-bg-muted px-2.5 py-1 text-[11px] font-semibold text-text-muted">
                <Clock className="h-3 w-3" />
                {sim.duration}
              </span>
              <span className="flex items-center gap-1 rounded-full bg-bg-muted px-2.5 py-1 text-[11px] font-semibold text-text-muted">
                <Zap className="h-3 w-3" />
                {sim.difficulty}
              </span>
            </div>
          </div>

          {/* Title + Tagline */}
          <h3 className="mt-4 font-display text-lg sm:text-xl font-bold text-accent leading-tight">
            {sim.title}
          </h3>
          <p
            className="mt-0.5 text-xs font-bold uppercase tracking-widest"
            style={{ color: sim.color }}
          >
            {sim.tagline}
          </p>

          {/* Description */}
          <p className="mt-3 flex-1 text-sm leading-relaxed text-text-muted">
            {sim.description}
          </p>

          {/* CTA */}
          <div className="mt-5 flex items-center justify-between">
            <span className="text-sm font-semibold text-primary group-hover:text-primary-dark transition-colors">
              Start Simulation
            </span>
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary transition-all duration-300 group-hover:bg-primary group-hover:text-white">
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
            </div>
          </div>
        </div>
      </motion.div>
    </ScrollReveal>
  );
}

/* ─── Simulation Modal ─────────────────────────── */

function SimulationModal({
  sim,
  onClose,
}: {
  sim: CareerSim;
  onClose: () => void;
}) {
  const [currentQ, setCurrentQ] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [score, setScore] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  const question = sim.questions[currentQ];
  const isCorrect = selectedAnswer === question?.correctIndex;
  const progress = ((currentQ + (completed ? 1 : 0)) / sim.questions.length) * 100;

  const handleAnswer = (index: number) => {
    if (selectedAnswer !== null) return;
    setSelectedAnswer(index);
    setShowExplanation(true);
    if (index === question.correctIndex) {
      setScore((s) => s + 1);
    }
  };

  const handleNext = () => {
    if (currentQ < sim.questions.length - 1) {
      setCurrentQ((q) => q + 1);
      setSelectedAnswer(null);
      setShowExplanation(false);
    } else {
      setCompleted(true);
      if (score + (isCorrect ? 0 : 0) >= sim.questions.length - 1) {
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 3000);
      }
    }
  };

  const handleRestart = () => {
    setCurrentQ(0);
    setSelectedAnswer(null);
    setShowExplanation(false);
    setScore(0);
    setCompleted(false);
  };

  const fitPercentage = Math.round(
    (score / sim.questions.length) * 100
  );

  const Icon = sim.icon;

  return (
    <>
      {showConfetti && <Confetti />}

      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.25 }}
        onClick={onClose}
        className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm"
      />

      {/* Modal */}
      <motion.div
        initial={{ opacity: 0, scale: 0.92, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ duration: 0.4, ease: easeOutExpo }}
        className="fixed inset-x-4 top-[5vh] bottom-[5vh] z-[70] mx-auto flex max-w-2xl flex-col overflow-hidden rounded-3xl bg-white shadow-2xl sm:inset-x-auto sm:top-[8vh] sm:bottom-[8vh]"
      >
        {/* Header */}
        <div
          className={`relative flex items-center justify-between px-5 py-4 sm:px-7 sm:py-5 bg-gradient-to-r ${sim.bgGradient} text-white`}
        >
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm">
              <Icon className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-display text-lg font-bold">{sim.title}</h3>
              <p className="text-xs text-white/80">Career Simulation</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm transition-colors hover:bg-white/30"
            aria-label="Close simulation"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="h-1 w-full bg-gray-100">
          <motion.div
            className="h-full rounded-r-full"
            style={{
              background: `linear-gradient(90deg, ${sim.color}, ${sim.color}dd)`,
            }}
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5, ease: easeOutExpo }}
          />
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-5 py-5 sm:px-7 sm:py-6">
          <AnimatePresence mode="wait">
            {!completed ? (
              <motion.div
                key={`q-${currentQ}`}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3, ease: easeOutExpo }}
              >
                {/* Scenario (shown on first question) */}
                {currentQ === 0 && (
                  <div className="mb-5 rounded-2xl bg-bg-muted border border-border/50 p-4">
                    <p className="text-xs font-bold uppercase tracking-widest text-primary mb-1.5">
                      📋 Scenario
                    </p>
                    <p className="text-sm leading-relaxed text-accent">
                      {sim.scenario}
                    </p>
                  </div>
                )}

                {/* Question Counter */}
                <div className="mb-3 flex items-center gap-2">
                  <span
                    className="inline-flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold text-white"
                    style={{ backgroundColor: sim.color }}
                  >
                    {currentQ + 1}
                  </span>
                  <span className="text-xs font-semibold text-text-muted">
                    of {sim.questions.length} Questions
                  </span>
                </div>

                {/* Question */}
                <h4 className="font-display text-base sm:text-lg font-bold text-accent leading-snug">
                  {question.prompt}
                </h4>

                {/* Options */}
                <div className="mt-4 space-y-2.5">
                  {question.options.map((option, idx) => {
                    let optionStyle =
                      "border-border/60 bg-white hover:border-primary/40 hover:bg-primary/5";
                    if (selectedAnswer !== null) {
                      if (idx === question.correctIndex) {
                        optionStyle =
                          "border-emerald-400 bg-emerald-50 ring-1 ring-emerald-400/30";
                      } else if (idx === selectedAnswer) {
                        optionStyle =
                          "border-red-400 bg-red-50 ring-1 ring-red-400/30";
                      } else {
                        optionStyle = "border-border/40 bg-gray-50 opacity-60";
                      }
                    }

                    return (
                      <motion.button
                        key={idx}
                        whileTap={selectedAnswer === null ? { scale: 0.98 } : {}}
                        onClick={() => handleAnswer(idx)}
                        disabled={selectedAnswer !== null}
                        className={`flex w-full cursor-pointer items-start gap-3 rounded-2xl border p-3.5 sm:p-4 text-left transition-all duration-200 ${optionStyle} ${
                          selectedAnswer !== null
                            ? "cursor-default"
                            : "cursor-pointer"
                        }`}
                      >
                        <span
                          className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                            selectedAnswer !== null &&
                            idx === question.correctIndex
                              ? "bg-emerald-500 text-white"
                              : selectedAnswer === idx
                              ? "bg-red-500 text-white"
                              : "bg-bg-muted text-text-muted"
                          }`}
                        >
                          {selectedAnswer !== null &&
                          idx === question.correctIndex ? (
                            <Check className="h-3.5 w-3.5" />
                          ) : selectedAnswer === idx ? (
                            <X className="h-3.5 w-3.5" />
                          ) : (
                            String.fromCharCode(65 + idx)
                          )}
                        </span>
                        <span className="text-sm sm:text-base font-medium text-accent leading-snug">
                          {option}
                        </span>
                      </motion.button>
                    );
                  })}
                </div>

                {/* Explanation */}
                <AnimatePresence>
                  {showExplanation && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3, ease: easeOutExpo }}
                      className="overflow-hidden"
                    >
                      <div
                        className={`mt-4 rounded-2xl p-4 ${
                          isCorrect
                            ? "bg-emerald-50 border border-emerald-200"
                            : "bg-amber-50 border border-amber-200"
                        }`}
                      >
                        <p className="text-xs font-bold uppercase tracking-widest mb-1.5">
                          {isCorrect ? "✅ Correct!" : "💡 Not quite — here's why:"}
                        </p>
                        <p className="text-sm leading-relaxed text-accent/80">
                          {question.explanation}
                        </p>
                      </div>

                      <motion.button
                        whileTap={{ scale: 0.97 }}
                        onClick={handleNext}
                        className="mt-4 flex w-full cursor-pointer items-center justify-center gap-2 rounded-2xl py-3.5 font-display text-sm font-bold text-white shadow-lg transition-all hover:shadow-xl active:scale-[0.98]"
                        style={{
                          background: `linear-gradient(135deg, ${sim.color}, ${sim.color}cc)`,
                        }}
                      >
                        <span>
                          {currentQ < sim.questions.length - 1
                            ? "Next Question"
                            : "See Results"}
                        </span>
                        <ChevronRight className="h-4 w-4" />
                      </motion.button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ) : (
              /* ─── Results Screen ─── */
              <motion.div
                key="results"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, ease: easeOutExpo }}
                className="flex flex-col items-center text-center"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{
                    duration: 0.5,
                    delay: 0.2,
                    type: "spring",
                    stiffness: 200,
                  }}
                  className="flex h-20 w-20 items-center justify-center rounded-3xl shadow-lg"
                  style={{ backgroundColor: `${sim.color}15` }}
                >
                  <Trophy
                    className="h-10 w-10"
                    style={{ color: sim.color }}
                  />
                </motion.div>

                <h3 className="mt-5 font-display text-2xl sm:text-3xl font-black text-accent">
                  Simulation Complete!
                </h3>

                <p className="mt-2 text-sm text-text-muted">
                  Here&apos;s how you performed in {sim.title}
                </p>

                {/* Score Ring */}
                <div className="relative mt-6 flex h-36 w-36 items-center justify-center">
                  <svg
                    className="absolute inset-0 -rotate-90"
                    viewBox="0 0 100 100"
                  >
                    <circle
                      cx="50"
                      cy="50"
                      r="42"
                      fill="none"
                      stroke="#f1f5f9"
                      strokeWidth="8"
                    />
                    <motion.circle
                      cx="50"
                      cy="50"
                      r="42"
                      fill="none"
                      stroke={sim.color}
                      strokeWidth="8"
                      strokeLinecap="round"
                      initial={{ pathLength: 0 }}
                      animate={{
                        pathLength: fitPercentage / 100,
                      }}
                      transition={{
                        duration: 1.2,
                        delay: 0.3,
                        ease: easeOutExpo,
                      }}
                      style={{
                        pathLength: 0,
                        strokeDasharray: "264",
                      }}
                    />
                  </svg>
                  <div className="flex flex-col items-center">
                    <motion.span
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.5 }}
                      className="font-display text-3xl font-black"
                      style={{ color: sim.color }}
                    >
                      {fitPercentage}%
                    </motion.span>
                    <span className="text-xs font-semibold text-text-muted">
                      Career Fit
                    </span>
                  </div>
                </div>

                {/* Score Details */}
                <div className="mt-5 flex items-center gap-4">
                  <div className="rounded-xl bg-emerald-50 px-4 py-2 border border-emerald-200">
                    <p className="text-lg font-bold text-emerald-600">
                      {score}
                    </p>
                    <p className="text-[10px] font-semibold uppercase text-emerald-600/70">
                      Correct
                    </p>
                  </div>
                  <div className="rounded-xl bg-red-50 px-4 py-2 border border-red-200">
                    <p className="text-lg font-bold text-red-500">
                      {sim.questions.length - score}
                    </p>
                    <p className="text-[10px] font-semibold uppercase text-red-500/70">
                      Missed
                    </p>
                  </div>
                  <div className="rounded-xl bg-bg-muted px-4 py-2 border border-border/50">
                    <p className="text-lg font-bold text-accent">
                      {sim.questions.length}
                    </p>
                    <p className="text-[10px] font-semibold uppercase text-text-muted">
                      Total
                    </p>
                  </div>
                </div>

                {/* Career Insight */}
                <div
                  className="mt-6 w-full rounded-2xl p-4 text-left border"
                  style={{
                    backgroundColor: `${sim.color}08`,
                    borderColor: `${sim.color}25`,
                  }}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <Star className="h-4 w-4" style={{ color: sim.color }} />
                    <p className="text-xs font-bold uppercase tracking-widest" style={{ color: sim.color }}>
                      Career Insight
                    </p>
                  </div>
                  <p className="text-sm leading-relaxed text-accent/80">
                    {fitPercentage >= 80
                      ? `Amazing! You showed strong analytical thinking perfect for ${sim.title}. Your problem-solving approach aligns well with industry professionals.`
                      : fitPercentage >= 50
                      ? `Good effort! You have a solid foundation for ${sim.title}. With the right mentoring, you could excel in this field. PTIROS can help build your roadmap.`
                      : `This field might be new to you, and that's totally okay! ${sim.title} requires specific skills that can be developed. Take the PTIROS Career Test for a personalized analysis.`}
                  </p>
                </div>

                {/* Actions */}
                <div className="mt-6 flex w-full flex-col gap-2.5 sm:flex-row">
                  <button
                    onClick={handleRestart}
                    className="flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-2xl border border-border/60 py-3 text-sm font-semibold text-accent transition-colors hover:bg-bg-muted"
                  >
                    <RotateCcw className="h-4 w-4" />
                    Try Again
                  </button>
                  <Link
                    href="/career-test"
                    className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-primary py-3 text-sm font-bold text-white shadow-lg shadow-primary/25 transition-all hover:bg-primary-dark hover:shadow-xl"
                  >
                    <Sparkles className="h-4 w-4" />
                    Full Career Test
                  </Link>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </>
  );
}

/* ─── Main Section Component ───────────────────── */

export default function CareerSimulator() {
  const [activeSim, setActiveSim] = useState<CareerSim | null>(null);

  const handleStart = useCallback((sim: CareerSim) => {
    setActiveSim(sim);
    document.body.style.overflow = "hidden";
  }, []);

  const handleClose = useCallback(() => {
    setActiveSim(null);
    document.body.style.overflow = "";
  }, []);

  return (
    <section
      id="simulator"
      className="relative overflow-hidden bg-bg py-20 sm:py-28"
      aria-label="Virtual Career Simulator"
    >
      {/* Decorative background shapes */}
      <div
        className="pointer-events-none absolute inset-0 overflow-hidden"
        aria-hidden="true"
      >
        <div className="absolute -left-32 top-20 h-80 w-80 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute -right-32 bottom-20 h-96 w-96 rounded-full bg-indigo-500/5 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
        {/* Section Header */}
        <ScrollReveal direction="up" distance={20}>
          <div className="mb-14 text-center">
            <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-xs sm:text-sm font-bold uppercase tracking-widest text-primary">
              <Sparkles className="h-3.5 w-3.5" />
              Interactive Experience
            </span>
            <h2 className="mt-4 font-display text-3xl sm:text-5xl lg:text-6xl font-black text-accent">
              Test-Drive Your{" "}
              <span className="text-gradient">Dream Career</span>
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-base sm:text-lg leading-relaxed text-text-muted">
              Experience what real professionals do every day. Solve authentic
              challenges, make critical decisions, and discover which career
              fits you best.
            </p>
          </div>
        </ScrollReveal>

        {/* Career Cards Grid */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {simulations.map((sim, idx) => (
            <CareerCard
              key={sim.id}
              sim={sim}
              index={idx}
              onStart={() => handleStart(sim)}
            />
          ))}
        </div>

        {/* Bottom CTA */}
        <ScrollReveal delay={0.3} direction="up" distance={16}>
          <div className="mt-14 flex flex-col items-center text-center">
            <p className="text-sm sm:text-base text-text-muted">
              Want a complete career analysis beyond simulations?
            </p>
            <Link
              href="/career-test"
              className="mt-4 inline-flex items-center gap-2 rounded-full bg-accent px-8 py-3.5 font-display text-sm sm:text-base font-bold text-white shadow-xl shadow-accent/20 transition-all hover:shadow-2xl hover:shadow-accent/30 hover:-translate-y-0.5 active:scale-[0.98]"
            >
              <span>Take the Full 360° Career Test</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </ScrollReveal>
      </div>

      {/* Simulation Modal */}
      <AnimatePresence>
        {activeSim && (
          <SimulationModal sim={activeSim} onClose={handleClose} />
        )}
      </AnimatePresence>
    </section>
  );
}
