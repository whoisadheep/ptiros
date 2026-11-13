"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useUserProfile } from "@/context/UserProfileContext";
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
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const { openDossierModal } = useUserProfile();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAnswerSelect = (optionText: string) => {
    setAnswers({ ...answers, [currentQ]: optionText });
    if (currentQ < quizQuestions.length - 1) {
      setCurrentQ(currentQ + 1);
    } else {
      setStep("result");
    }
  };

  return (
    <main className="min-h-screen bg-bg text-text">
      {/* Header */}
      <header className="border-b border-border/50 bg-white/70 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-5 py-4 flex items-center justify-between">
          <Link href="/" className="inline-flex items-center gap-2 text-sm font-semibold text-accent hover:text-primary transition-colors">
            <ArrowLeft className="size-4" /> Back to Home
          </Link>
          <div className="font-display font-bold text-xl text-gradient">PTIROS 360° Assessment</div>
          <div className="text-xs font-medium px-3 py-1 rounded-full bg-primary/10 text-primary">
            {step === "register" && "Step 1 of 3: Student Profile"}
            {step === "quiz" && `Step 2 of 3: Question ${currentQ + 1}/${quizQuestions.length}`}
            {step === "result" && "Step 3 of 3: Assessment Report"}
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-5 py-10">
        <AnimatePresence mode="wait">
          {/* STEP 1: Registration Form */}
          {step === "register" && (
            <motion.div
              key="register"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-white rounded-3xl p-8 sm:p-12 shadow-xl border border-border/60"
            >
              <div className="mb-8">
                <span className="text-xs font-semibold uppercase tracking-wider text-primary">Pre-Assessment Setup</span>
                <h1 className="text-3xl sm:text-4xl font-display font-bold text-accent mt-1">Student & Academic Profile</h1>
                <p className="text-text-muted mt-2 text-sm sm:text-base">
                  As per PTIROS diagnostic framework, we evaluate both personality parameters and scholastic history to formulate your personalized career roadmap.
                </p>
              </div>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  setStep("quiz");
                }}
                className="space-y-8"
              >
                {/* Personal Information */}
                <div>
                  <h3 className="text-lg font-bold text-accent mb-4 flex items-center gap-2 border-b pb-2">
                    <Compass className="size-5 text-primary" /> Personal Details
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-accent mb-1">Student Full Name *</label>
                      <input
                        type="text"
                        name="name"
                        required
                        placeholder="e.g. Aarav Sharma"
                        value={formData.name}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2.5 rounded-xl border border-border focus:ring-2 focus:ring-primary focus:outline-none text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-accent mb-1">Age *</label>
                      <input
                        type="number"
                        name="age"
                        required
                        placeholder="e.g. 15"
                        value={formData.age}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2.5 rounded-xl border border-border focus:ring-2 focus:ring-primary focus:outline-none text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-accent mb-1">Gender *</label>
                      <select
                        name="gender"
                        value={formData.gender}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2.5 rounded-xl border border-border focus:ring-2 focus:ring-primary focus:outline-none text-sm bg-white"
                      >
                        <option>Male</option>
                        <option>Female</option>
                        <option>Other</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Parents & Contact */}
                <div>
                  <h3 className="text-lg font-bold text-accent mb-4 flex items-center gap-2 border-b pb-2">
                    <BookOpen className="size-5 text-primary" /> Contact & Guardian Details
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-accent mb-1">Father's Name</label>
                      <input
                        type="text"
                        name="fatherName"
                        placeholder="Father's Name"
                        value={formData.fatherName}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2.5 rounded-xl border border-border focus:ring-2 focus:ring-primary focus:outline-none text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-accent mb-1">Mother's Name</label>
                      <input
                        type="text"
                        name="motherName"
                        placeholder="Mother's Name"
                        value={formData.motherName}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2.5 rounded-xl border border-border focus:ring-2 focus:ring-primary focus:outline-none text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-accent mb-1">Parent Mobile (Mandatory) *</label>
                      <input
                        type="tel"
                        name="parentPhone"
                        required
                        placeholder="+91 98765 43210"
                        value={formData.parentPhone}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2.5 rounded-xl border border-border focus:ring-2 focus:ring-primary focus:outline-none text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-accent mb-1">Parent Email (Mandatory) *</label>
                      <input
                        type="email"
                        name="parentEmail"
                        required
                        placeholder="parent@example.com"
                        value={formData.parentEmail}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2.5 rounded-xl border border-border focus:ring-2 focus:ring-primary focus:outline-none text-sm"
                      />
                    </div>
                  </div>
                </div>

                {/* Academic Profile */}
                <div>
                  <h3 className="text-lg font-bold text-accent mb-4 flex items-center gap-2 border-b pb-2">
                    <GraduationCap className="size-5 text-primary" /> Academic & Aspirations
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-accent mb-1">Current Class / Standard *</label>
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
                    <div>
                      <label className="block text-xs font-semibold text-accent mb-1">Education Board *</label>
                      <select
                        name="board"
                        value={formData.board}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2.5 rounded-xl border border-border focus:ring-2 focus:ring-primary focus:outline-none text-sm bg-white"
                      >
                        <option>CBSE</option>
                        <option>ICSE / ISC</option>
                        <option>State Board</option>
                        <option>IB / Cambridge</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-accent mb-1">Last Year Score (%) *</label>
                      <input
                        type="text"
                        name="lastYearPercentage"
                        required
                        placeholder="e.g. 88%"
                        value={formData.lastYearPercentage}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2.5 rounded-xl border border-border focus:ring-2 focus:ring-primary focus:outline-none text-sm"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-semibold text-accent mb-1">School Name & City</label>
                      <input
                        type="text"
                        name="schoolName"
                        placeholder="e.g. Delhi Public School, R.K. Puram"
                        value={formData.schoolName}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2.5 rounded-xl border border-border focus:ring-2 focus:ring-primary focus:outline-none text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-accent mb-1">Childhood Aim / Dream</label>
                      <input
                        type="text"
                        name="childhoodDream"
                        placeholder="e.g. Astronaut, Surgeon, Entrepreneur"
                        value={formData.childhoodDream}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2.5 rounded-xl border border-border focus:ring-2 focus:ring-primary focus:outline-none text-sm"
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-4 flex justify-end">
                  <button
                    type="submit"
                    className="cursor-pointer inline-flex items-center gap-2 px-8 py-3.5 rounded-2xl bg-primary text-white font-semibold text-sm shadow-lg shadow-primary/25 hover:bg-primary-dark transition-all hover:scale-[1.02] active:scale-95"
                  >
                    Proceed to Assessment Questions <ArrowRight className="size-4" />
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
              className="bg-white rounded-3xl p-8 sm:p-12 shadow-xl border border-border/60"
            >
              {/* Progress Bar */}
              <div className="mb-8">
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

              <div className="mb-8">
                <span className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold mb-3">
                  Question {currentQ + 1}
                </span>
                <h2 className="text-2xl sm:text-3xl font-display font-bold text-accent leading-snug">
                  {quizQuestions[currentQ].question}
                </h2>
              </div>

              <div className="space-y-4">
                {quizQuestions[currentQ].options.map((opt, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleAnswerSelect(opt.text)}
                    className="w-full text-left p-5 rounded-2xl border border-border/80 hover:border-primary hover:bg-primary/5 transition-all cursor-pointer flex items-center justify-between group"
                  >
                    <div className="flex items-center gap-4">
                      <span className="size-8 rounded-full border border-border flex items-center justify-center font-bold text-xs text-text-muted group-hover:border-primary group-hover:text-primary transition-colors">
                        {String.fromCharCode(65 + idx)}
                      </span>
                      <span className="text-sm sm:text-base font-medium text-accent">{opt.text}</span>
                    </div>
                    <span className="text-xs font-semibold text-primary opacity-0 group-hover:opacity-100 transition-opacity">
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
              {/* Free Basic Report (3-4 pages view as requested in handwritten notes) */}
              <div className="bg-white rounded-3xl p-8 sm:p-12 shadow-xl border border-border/60">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-6 mb-8">
                  <div>
                    <span className="px-3 py-1 rounded-full bg-success/10 text-success text-xs font-bold inline-flex items-center gap-1.5">
                      <CheckCircle2 className="size-3.5" /> Assessment Completed
                    </span>
                    <h1 className="text-2xl sm:text-3xl font-display font-bold text-accent mt-2">
                      PTIROS 360° Career Diagnostics: {formData.name || "Student"}
                    </h1>
                    <p className="text-xs sm:text-sm text-text-muted mt-1">
                      Grade: {formData.className} • Board: {formData.board} • School: {formData.schoolName || "Registered Institution"}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-xs uppercase font-semibold text-text-muted">Aptitude Score</span>
                    <div className="text-3xl font-display font-extrabold text-primary">94.8%</div>
                  </div>
                </div>

                {/* Report Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  {/* Card 1: Skill Gap */}
                  <div className="p-6 rounded-2xl bg-bg-muted border border-border/60">
                    <div className="flex items-center gap-3 mb-3">
                      <BarChart3 className="size-5 text-primary" />
                      <h3 className="font-display font-bold text-accent">1. Skill Gap Analysis</h3>
                    </div>
                    <p className="text-xs sm:text-sm text-text-muted leading-relaxed">
                      Strong analytical aptitude and pattern recognition. Moderate gap detected in impromptu public speaking and structured long-form communication.
                    </p>
                    <div className="mt-4 space-y-2">
                      <div className="flex justify-between text-xs font-semibold">
                        <span>Analytical Thinking</span>
                        <span className="text-primary">92%</span>
                      </div>
                      <div className="w-full h-1.5 rounded-full bg-white overflow-hidden">
                        <div className="h-full bg-primary w-[92%]" />
                      </div>
                      <div className="flex justify-between text-xs font-semibold">
                        <span>Public Expression</span>
                        <span className="text-primary">64%</span>
                      </div>
                      <div className="w-full h-1.5 rounded-full bg-white overflow-hidden">
                        <div className="h-full bg-primary w-[64%]" />
                      </div>
                    </div>
                  </div>

                  {/* Card 2: Brain Areas Developed */}
                  <div className="p-6 rounded-2xl bg-bg-muted border border-border/60">
                    <div className="flex items-center gap-3 mb-3">
                      <Brain className="size-5 text-primary" />
                      <h3 className="font-display font-bold text-accent">2. Brain Areas Developed</h3>
                    </div>
                    <p className="text-xs sm:text-sm text-text-muted leading-relaxed">
                      Pre-frontal cortex engagement shows high strategic planning propensity. Left-hemisphere logical dominance with emerging spatial reasoning.
                    </p>
                    <div className="mt-4 grid grid-cols-2 gap-2 text-center text-xs font-semibold">
                      <div className="p-2.5 rounded-xl bg-white border border-border/40">
                        <span className="text-primary font-bold block">Frontal</span> High Strategy
                      </div>
                      <div className="p-2.5 rounded-xl bg-white border border-border/40">
                        <span className="text-primary font-bold block">Parietal</span> Math & Spatial
                      </div>
                    </div>
                  </div>

                  {/* Card 3: Personality Archetype */}
                  <div className="p-6 rounded-2xl bg-bg-muted border border-border/60">
                    <div className="flex items-center gap-3 mb-3">
                      <Sparkles className="size-5 text-primary" />
                      <h3 className="font-display font-bold text-accent">3. Personality Archetype</h3>
                    </div>
                    <p className="text-xs sm:text-sm text-text-muted leading-relaxed">
                      <strong>The Pragmatic Visionary:</strong> Balances ambitious childhood dreams with calculated step-by-step execution. Highly receptive to mentorship frameworks.
                    </p>
                  </div>

                  {/* Card 4: Top Recommended Streams */}
                  <div className="p-6 rounded-2xl bg-bg-muted border border-border/60">
                    <div className="flex items-center gap-3 mb-3">
                      <Award className="size-5 text-primary" />
                      <h3 className="font-display font-bold text-accent">4. Top Career Tracks</h3>
                    </div>
                    <ul className="text-xs sm:text-sm space-y-1.5 text-accent font-medium">
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="size-4 text-success" /> AI & Data Science Engineering
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="size-4 text-success" /> Quantitative Economics & Fintech
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="size-4 text-success" /> Biomedical Device Architecture
                      </li>
                    </ul>
                  </div>
                </div>

                {/* Free vs Paid Banner (From Handwritten Flow Diagram) */}
                <div className="p-6 sm:p-8 rounded-2xl bg-gradient-to-r from-primary to-primary-dark text-white flex flex-col md:flex-row items-center justify-between gap-6">
                  <div>
                    <span className="text-xs uppercase tracking-wider font-bold bg-white/20 px-3 py-1 rounded-full">
                      Free Basic Report Unlocked
                    </span>
                    <h3 className="text-xl sm:text-2xl font-display font-bold mt-2">
                      Unlock Full 360° Comprehensive Dossier (10+ Pages)
                    </h3>
                    <p className="text-white/80 text-xs sm:text-sm mt-1 max-w-xl">
                      Includes personalized month-by-month roadmap, competitive exam blueprints, recommended certifications, and 1:1 mentor debrief session.
                    </p>
                  </div>
                  <button
                    onClick={() => openDossierModal()}
                    className="cursor-pointer whitespace-nowrap px-6 py-3.5 rounded-xl bg-white text-primary font-bold text-sm shadow-xl hover:bg-neutral-100 transition-all flex items-center gap-2"
                  >
                    <Download className="size-4" /> Preview Full 10-Page Dossier
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}
