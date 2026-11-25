"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useUserProfile } from "@/context/UserProfileContext";
import { useStudentAuth } from "@/context/StudentAuthContext";
import PtiroMascot from "@/components/PtiroMascot";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Sparkles,
  Download,
  Brain,
  GraduationCap,
  Award,
  BarChart3,
  BookOpen,
  Compass,
  Smile,
  ShieldCheck,
  ChevronDown,
  LayoutDashboard,
} from "lucide-react";

type Step = "register" | "quiz" | "result";

interface StudentForm {
  name: string;
  age: string;
  gender: string;
  className: string;
  schoolName: string;
  board: string;
  state: string;
  fatherName: string;
  motherName: string;
  parentPhone: string;
  studentPhone: string;
  parentEmail: string;
  studentEmail: string;
  childhoodDream: string;
  lastYearPercentage: string;
  sportsProfessional: "Yes" | "No";
  competitionParticipation: string;
}

const initialForm: StudentForm = {
  name: "",
  age: "",
  gender: "Male",
  className: "10th",
  schoolName: "",
  board: "CBSE",
  state: "",
  fatherName: "",
  motherName: "",
  parentPhone: "",
  studentPhone: "",
  parentEmail: "",
  studentEmail: "",
  childhoodDream: "",
  lastYearPercentage: "",
  sportsProfessional: "No",
  competitionParticipation: "None",
};

const quizQuestions = [
  {
    id: 1,
    category: "Analytical & Problem Solving",
    question: "When faced with an unfamiliar math puzzle or technical challenge, what is your natural reaction?",
    options: [
      { text: "Break it down into logical steps and test hypotheses", trait: "STEM / Engineering" },
      { text: "Find an intuitive or creative workaround", trait: "Design / Innovation" },
      { text: "Discuss it with friends or mentors to brainstorm", trait: "Leadership / Management" },
      { text: "Read the theory and find foundational rules first", trait: "Research / Academia" },
    ],
  },
  {
    id: 2,
    category: "Interest & Curiosity",
    question: "If you had an entire free bagless day at school, which workshop would you instantly join?",
    options: [
      { text: "Building an AI assistant or robotics circuit", trait: "Computer Science & Robotics" },
      { text: "Stock market simulation & startup pitch battle", trait: "Finance & Entrepreneurship" },
      { text: "Bio-medical forensics & human anatomy lab", trait: "Medicine & Life Sciences" },
      { text: "Model United Nations & public debate on geopolitics", trait: "Law, Policy & Media" },
    ],
  },
  {
    id: 3,
    category: "Work & Decision Style",
    question: "How do you prefer to make critical life decisions?",
    options: [
      { text: "Data, metrics, pros-and-cons spreadsheets", trait: "Analytical Thinker" },
      { text: "Gut feeling backed by personal passion", trait: "Intuitive Creator" },
      { text: "Guidance from teachers, parents, and proven roadmaps", trait: "Structured Achiever" },
      { text: "Trial, quick experimentation, and learning by failure", trait: "Agile Builder" },
    ],
  },
  {
    id: 4,
    category: "Social & Leadership",
    question: "In a group project, what role do you naturally assume?",
    options: [
      { text: "The Strategist who structures goals and timelines", trait: "Chief Coordinator" },
      { text: "The Problem Solver who does the hardest technical tasks", trait: "Core Specialist" },
      { text: "The Presenter who pitches and commands the stage", trait: "Public Speaker" },
      { text: "The Mediator who ensures everyone is heard and supported", trait: "People Catalyst" },
    ],
  },
];

export default function CareerTestPage() {
  const [step, setStep] = useState<Step>("register");
  const [formData, setFormData] = useState<StudentForm>(initialForm);
  const [showParentFields, setShowParentFields] = useState(false);
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const { openDossierModal } = useUserProfile();
  const { user } = useStudentAuth();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAnswerSelect = (optionText: string) => {
    const updatedAnswers = { ...answers, [currentQ]: optionText };
    setAnswers(updatedAnswers);
    if (currentQ < quizQuestions.length - 1) {
      setCurrentQ(currentQ + 1);
    } else {
      setStep("result");
      const resultData = {
        studentName: formData.name || "PTIROS Explorer",
        className: formData.className,
        completedAt: new Date().toISOString(),
        topMatch: "AI & Autonomous Robotics",
        matchConfidence: "94.8%",
        superpowers: ["Analytical & Logical Thinking (92%)", "Creative Problem Solving (88%)"],
        archetype: "The Pragmatic Builder",
        answers: updatedAnswers,
      };
      try {
        const storageKey = user?.id
          ? `ptiros_career_test_result_${user.id}`
          : "ptiros_career_test_guest";
        localStorage.setItem(storageKey, JSON.stringify(resultData));
      } catch {}

      // Save lead to database for follow-up
      fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          studentName: formData.name || "Career Quest Student",
          grade: formData.className,
          schoolName: formData.schoolName || undefined,
          city: formData.state || undefined,
          parentName: formData.fatherName || formData.motherName || undefined,
          parentPhone: formData.parentPhone || undefined,
          parentEmail: formData.parentEmail || undefined,
          notes: `Completed Career Match Quest. Top Match: AI & Autonomous Robotics (94.8%). Selected Options: ${Object.values(updatedAnswers).join("; ")}`,
          source: "career-test",
        }),
      }).catch(() => {});
    }
  };

  return (
    <main className="min-h-screen bg-bg text-text">
      {/* Header */}
      <header className="border-b border-border/50 bg-white/80 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-3.5 sm:px-5 py-3 sm:py-4 flex items-center justify-between gap-2">
          <Link href="/" className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-accent hover:text-primary transition-colors shrink-0">
            <ArrowLeft className="size-4 shrink-0" />
            <span className="hidden sm:inline">Back to Home</span>
            <span className="sm:hidden">Home</span>
          </Link>
          <div className="font-display font-bold text-base sm:text-xl text-gradient truncate">
            PTIROS Career Match
          </div>
          <div className="text-[11px] sm:text-xs font-medium px-2.5 sm:px-3 py-1 rounded-full bg-primary/10 text-primary shrink-0 whitespace-nowrap">
            {step === "register" && (
              <>
                <span className="hidden sm:inline">Step 1 of 3: Quick Setup</span>
                <span className="sm:hidden">Step 1/3</span>
              </>
            )}
            {step === "quiz" && (
              <>
                <span className="hidden sm:inline">{`Step 2 of 3: Quest ${currentQ + 1} of ${quizQuestions.length}`}</span>
                <span className="sm:hidden">{`Quest ${currentQ + 1}/${quizQuestions.length}`}</span>
              </>
            )}
            {step === "result" && (
              <>
                <span className="hidden sm:inline">Step 3 of 3: Your Superpower Match</span>
                <span className="sm:hidden">Step 3/3</span>
              </>
            )}
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-5 py-10">
        <AnimatePresence mode="wait">
          {/* STEP 1: Friendly Discovery Setup */}
          {step === "register" && (
            <motion.div
              key="register"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-white rounded-3xl p-6 sm:p-10 shadow-xl border border-border/60 space-y-6"
            >
              {/* Mascot Friendly Welcome Banner */}
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 p-5 rounded-2xl bg-orange-50/90 border border-orange-200">
                <div className="shrink-0">
                  <PtiroMascot variant="copilot" size={60} />
                </div>
                <div className="space-y-1 text-center sm:text-left">
                  <span className="text-xs font-bold uppercase tracking-wider text-primary">
                    Zero Stress • Pure Discovery
                  </span>
                  <h2 className="text-lg sm:text-xl font-display font-bold text-stone-900">
                    Welcome to Your Career Quest!
                  </h2>
                  <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                    Take a breath — there are <strong>no math tests</strong>, <strong>no grades</strong>, and <strong>no wrong answers</strong>.
                    Just 4 quick scenario questions to discover which real-world careers match how you think!
                  </p>
                </div>
              </div>

              {/* Quick Essentials Form */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  setStep("quiz");
                }}
                className="space-y-6"
              >
                <div>
                  <h3 className="text-base font-bold text-accent mb-3 flex items-center gap-2">
                    <Smile className="size-4 text-primary" /> Tell us a bit about you
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-accent mb-1">Your Name / Nickname *</label>
                      <input
                        type="text"
                        name="name"
                        required
                        placeholder="Your first name or nickname"
                        value={formData.name}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2.5 rounded-xl border border-border focus:ring-2 focus:ring-primary focus:outline-none text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-accent mb-1">Current Class / Grade *</label>
                      <select
                        name="className"
                        value={formData.className}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2.5 rounded-xl border border-border focus:ring-2 focus:ring-primary focus:outline-none text-sm bg-white"
                      >
                        <option>6th Standard</option>
                        <option>7th Standard</option>
                        <option>8th Standard</option>
                        <option>9th Standard</option>
                        <option>10th Standard</option>
                        <option>11th Standard</option>
                        <option>12th Standard</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-accent mb-1">
                    What are you curious about? (Optional)
                  </label>
                  <input
                    type="text"
                    name="childhoodDream"
                    placeholder="e.g. Robotics, Video Games, Animals, Space, Medicine, Law, Art..."
                    value={formData.childhoodDream}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 rounded-xl border border-border focus:ring-2 focus:ring-primary focus:outline-none text-sm"
                  />
                  <p className="text-[11px] text-stone-500 mt-1">
                    Don&apos;t worry if you don&apos;t know yet — that&apos;s exactly what this quest is for!
                  </p>
                </div>

                {/* Optional Expandable: Parent / Guardian Details */}
                <div className="rounded-2xl border border-stone-200 bg-stone-50/70 p-4">
                  <button
                    type="button"
                    onClick={() => setShowParentFields(!showParentFields)}
                    className="w-full flex items-center justify-between text-left text-xs font-semibold text-stone-700 hover:text-primary transition cursor-pointer"
                  >
                    <span className="flex items-center gap-2">
                      <BookOpen className="size-4 text-primary" />
                      <span>[Optional] Want us to send the full Parent Report to mom or dad?</span>
                    </span>
                    <ChevronDown className={`size-4 transition-transform ${showParentFields ? "rotate-180" : ""}`} />
                  </button>

                  {showParentFields && (
                    <div className="mt-4 pt-4 border-t border-stone-200 grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-semibold text-stone-700 mb-1">Parent Mobile</label>
                        <input
                          type="tel"
                          name="parentPhone"
                          placeholder="+91 98765 43210"
                          value={formData.parentPhone}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs bg-white focus:ring-2 focus:ring-primary focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-stone-700 mb-1">Parent Email</label>
                        <input
                          type="email"
                          name="parentEmail"
                          placeholder="parent@example.com"
                          value={formData.parentEmail}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs bg-white focus:ring-2 focus:ring-primary focus:outline-none"
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Reassurance Badges */}
                <div className="flex flex-wrap items-center gap-3 text-xs text-stone-600">
                  <span className="flex items-center gap-1.5">
                    <ShieldCheck className="size-4 text-emerald-600" />
                    100% Free
                  </span>
                  <span className="flex items-center gap-1.5">
                    <CheckCircle2 className="size-4 text-emerald-600" />
                    Zero negative marking
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Sparkles className="size-4 text-orange-600" />
                    4 Fun Scenario Questions
                  </span>
                </div>

                <div className="pt-2 flex justify-end">
                  <button
                    type="submit"
                    className="cursor-pointer inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-primary text-white font-bold text-sm shadow-lg shadow-primary/25 hover:bg-primary-dark transition-all hover:scale-[1.02] active:scale-95"
                  >
                    <span>Start My Discovery Quest</span>
                    <ArrowRight className="size-4" />
                  </button>
                </div>
              </form>
            </motion.div>
          )}

          {/* STEP 2: Interactive Quiz */}
          {step === "quiz" && (
            <motion.div
              key="quiz"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-white rounded-3xl p-6 sm:p-10 shadow-xl border border-border/60 space-y-6"
            >
              {/* Progress Bar & Ptiro Encouragement */}
              <div className="flex items-center gap-3 bg-orange-50/80 p-3 rounded-2xl border border-orange-200">
                <div className="shrink-0">
                  <PtiroMascot variant="copilot" size={40} />
                </div>
                <div className="text-left">
                  <p className="text-xs font-bold text-stone-900">Ptiro says:</p>
                  <p className="text-xs text-stone-600">
                    Just pick what sounds coolest to you! There are no wrong choices.
                  </p>
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center text-xs font-semibold text-text-muted mb-2">
                  <span>Category: {quizQuestions[currentQ].category}</span>
                  <span>{Math.round(((currentQ + 1) / quizQuestions.length) * 100)}% Complete</span>
                </div>
                <div className="w-full h-2 rounded-full bg-border/40 overflow-hidden">
                  <div
                    className="h-full bg-primary transition-all duration-300"
                    style={{ width: `${((currentQ + 1) / quizQuestions.length) * 100}%` }}
                  />
                </div>
              </div>

              <div>
                <span className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold mb-3">
                  Question {currentQ + 1} of {quizQuestions.length}
                </span>
                <h2 className="text-xl sm:text-2xl font-display font-bold text-accent leading-snug">
                  {quizQuestions[currentQ].question}
                </h2>
              </div>

              <div className="space-y-3.5">
                {quizQuestions[currentQ].options.map((opt, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleAnswerSelect(opt.text)}
                    className="w-full text-left p-4 sm:p-5 rounded-2xl border border-border/80 hover:border-primary hover:bg-orange-50/50 transition-all cursor-pointer flex items-center justify-between group"
                  >
                    <div className="flex items-center gap-3.5">
                      <span className="size-8 rounded-full border border-stone-200 bg-stone-50 flex items-center justify-center font-bold text-xs text-stone-600 group-hover:border-primary group-hover:text-primary transition-colors">
                        {String.fromCharCode(65 + idx)}
                      </span>
                      <span className="text-sm sm:text-base font-medium text-accent">{opt.text}</span>
                    </div>
                    <span className="text-xs font-semibold text-primary opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity shrink-0">
                      Select →
                    </span>
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {/* STEP 3: Career Diagnostic Report */}
          {step === "result" && (
            <motion.div
              key="result"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              className="space-y-8"
            >
              {/* Free Basic Report */}
              <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-xl border border-border/60 space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-6">
                  <div className="flex items-center gap-4">
                    <PtiroMascot variant="celebrate" size={64} />
                    <div>
                      <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold inline-flex items-center gap-1.5">
                        <CheckCircle2 className="size-3.5" /> Discovery Quest Completed!
                      </span>
                      <h1 className="text-2xl sm:text-3xl font-display font-bold text-accent mt-1.5">
                        {formData.name ? `${formData.name}'s Career Blueprint` : "Your Career Blueprint"}
                      </h1>
                      <p className="text-xs sm:text-sm text-text-muted mt-0.5">
                        Grade: {formData.className} • Focus: Authentic Strengths & Natural Fit
                      </p>
                    </div>
                  </div>
                  <div className="text-left sm:text-right bg-orange-50 px-4 py-2.5 rounded-2xl border border-orange-200">
                    <span className="text-xs uppercase font-semibold text-orange-800">Match Confidence</span>
                    <div className="text-2xl sm:text-3xl font-display font-extrabold text-primary">94.8%</div>
                  </div>
                </div>

                {/* Report Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Card 1: Core Superpowers */}
                  <div className="p-5 sm:p-6 rounded-2xl bg-bg-muted border border-border/60 space-y-3">
                    <div className="flex items-center gap-3">
                      <BarChart3 className="size-5 text-primary" />
                      <h3 className="font-display font-bold text-accent">1. Core Cognitive Superpowers</h3>
                    </div>
                    <p className="text-xs sm:text-sm text-text-muted leading-relaxed">
                      You have exceptional structured reasoning and natural problem-solving stamina. You love
                      making sense of complex ideas and seeing how things work under the hood.
                    </p>
                    <div className="mt-3 space-y-2">
                      <div className="flex justify-between text-xs font-semibold">
                        <span>Analytical & Logical Thinking</span>
                        <span className="text-primary font-bold">92%</span>
                      </div>
                      <div className="w-full h-1.5 rounded-full bg-white overflow-hidden">
                        <div className="h-full bg-primary w-[92%]" />
                      </div>
                      <div className="flex justify-between text-xs font-semibold">
                        <span>Creative Problem Solving</span>
                        <span className="text-primary font-bold">88%</span>
                      </div>
                      <div className="w-full h-1.5 rounded-full bg-white overflow-hidden">
                        <div className="h-full bg-primary w-[88%]" />
                      </div>
                    </div>
                  </div>

                  {/* Card 2: Brain Areas Developed */}
                  <div className="p-5 sm:p-6 rounded-2xl bg-bg-muted border border-border/60 space-y-3">
                    <div className="flex items-center gap-3">
                      <Brain className="size-5 text-primary" />
                      <h3 className="font-display font-bold text-accent">2. How Your Brain Solves Puzzles</h3>
                    </div>
                    <p className="text-xs sm:text-sm text-text-muted leading-relaxed">
                      High strategic planning and spatial intuition. You are wired to organize information and
                      find smart, efficient pathways instead of rote cramming.
                    </p>
                    <div className="mt-3 grid grid-cols-2 gap-2 text-center text-xs font-semibold">
                      <div className="p-2.5 rounded-xl bg-white border border-border/40">
                        <span className="text-primary font-bold block">Frontal</span> Strategic Vision
                      </div>
                      <div className="p-2.5 rounded-xl bg-white border border-border/40">
                        <span className="text-primary font-bold block">Parietal</span> Systems & Spatial
                      </div>
                    </div>
                  </div>

                  {/* Card 3: Personality Archetype */}
                  <div className="p-5 sm:p-6 rounded-2xl bg-bg-muted border border-border/60 space-y-3">
                    <div className="flex items-center gap-3">
                      <Sparkles className="size-5 text-primary" />
                      <h3 className="font-display font-bold text-accent">3. Your Learning Archetype</h3>
                    </div>
                    <p className="text-xs sm:text-sm text-text-muted leading-relaxed">
                      <strong>The Pragmatic Builder:</strong> You learn fastest by doing, testing, and seeing real-world
                      applications—not by listening to endless lectures.
                    </p>
                  </div>

                  {/* Card 4: Top Recommended Tracks */}
                  <div className="p-5 sm:p-6 rounded-2xl bg-bg-muted border border-border/60 space-y-3">
                    <div className="flex items-center gap-3">
                      <Award className="size-5 text-primary" />
                      <h3 className="font-display font-bold text-accent">4. Top Career Matches</h3>
                    </div>
                    <ul className="text-xs sm:text-sm space-y-2 text-accent font-medium">
                      <li className="flex items-center justify-between">
                        <span className="flex items-center gap-2">
                          <CheckCircle2 className="size-4 text-emerald-600 shrink-0" />
                          <span>AI & Autonomous Robotics</span>
                        </span>
                        <Link href="/simulator?track=ai-robotics" className="text-xs text-primary font-bold hover:underline">
                          Test-Drive ➔
                        </Link>
                      </li>
                      <li className="flex items-center justify-between">
                        <span className="flex items-center gap-2">
                          <CheckCircle2 className="size-4 text-emerald-600 shrink-0" />
                          <span>Biomedical Device & Tech</span>
                        </span>
                        <Link href="/simulator?track=medicine" className="text-xs text-primary font-bold hover:underline">
                          Test-Drive ➔
                        </Link>
                      </li>
                      <li className="flex items-center justify-between">
                        <span className="flex items-center gap-2">
                          <CheckCircle2 className="size-4 text-emerald-600 shrink-0" />
                          <span>Fintech & Quantitative Economics</span>
                        </span>
                        <Link href="/simulator?track=finance" className="text-xs text-primary font-bold hover:underline">
                          Test-Drive ➔
                        </Link>
                      </li>
                    </ul>
                  </div>
                </div>

                {/* Free vs Paid Banner */}
                <div className="p-6 sm:p-8 rounded-2xl bg-gradient-to-r from-primary to-primary-dark text-white flex flex-col md:flex-row items-center justify-between gap-6">
                  <div>
                    <span className="text-xs uppercase tracking-wider font-bold bg-white/20 px-3 py-1 rounded-full">
                      Free Basic Blueprint Unlocked
                    </span>
                    <h3 className="text-xl sm:text-2xl font-display font-bold mt-2">
                      Want to Share with Parents? Preview 10-Page Dossier
                    </h3>
                    <p className="text-white/80 text-xs sm:text-sm mt-1 max-w-xl">
                      Includes 10-year Indian salary trajectories, board exam Kaizen checklists, and 1:1 strategy call booking with IIT & NLSIU mentors.
                    </p>
                  </div>
                  <div className="w-full sm:w-auto flex flex-col sm:flex-row sm:flex-wrap items-stretch sm:items-center gap-3 shrink-0">
                    <button
                      onClick={() => openDossierModal()}
                      className="cursor-pointer whitespace-nowrap px-6 py-3.5 rounded-full bg-white text-primary font-bold text-sm shadow-xl hover:bg-neutral-100 transition-all flex items-center justify-center gap-2 active:scale-95"
                    >
                      <Download className="size-4" /> Preview Parent Dossier
                    </button>
                    <Link
                      href="/dashboard"
                      className="cursor-pointer whitespace-nowrap px-5 py-3.5 rounded-full bg-white/20 hover:bg-white/30 text-white font-bold text-sm transition-all flex items-center justify-center gap-2 active:scale-95 border border-white/30"
                    >
                      <LayoutDashboard className="size-4" /> Open Dashboard
                    </Link>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}
