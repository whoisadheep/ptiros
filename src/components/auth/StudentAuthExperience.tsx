"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  AlertCircle,
  Check,
  Eye,
  EyeOff,
  Loader2,
  Lock,
  Mail,
  User,
  Building,
  Phone,
  ChevronDown,
} from "lucide-react";
import { useStudentAuth } from "@/context/StudentAuthContext";

export type AuthMode = "login" | "signup";

interface StudentAuthExperienceProps {
  initialMode?: AuthMode;
}

const EASE_OUT = [0.22, 1, 0.36, 1] as const;

const GRADES = [
  { value: "Class 8", label: "Class 8" },
  { value: "Class 9", label: "Class 9" },
  { value: "Class 10", label: "Class 10" },
  { value: "Class 11", label: "Class 11" },
  { value: "Class 12", label: "Class 12" },
  { value: "Dropper / UG 1st Yr", label: "UG / Dropper" },
] as const;

const CURRICULA = ["CBSE", "ICSE", "IB", "Cambridge", "State Board"] as const;

const PORTAL_INDEX = [
  {
    code: "01",
    title: "Career Match Diagnostic",
    detail: "Map interests across engineering, law, design, medicine, and finance",
  },
  {
    code: "02",
    title: "Workplace Simulations",
    detail: "Solve realistic scenario briefs before choosing senior secondary streams",
  },
  {
    code: "03",
    title: "Study Planner & Journal",
    detail: "Track weekly targets, extracurricular records, and reflection notes",
  },
  {
    code: "04",
    title: "1-on-1 Mentor Desk",
    detail: "Schedule 20-minute strategy sessions with IIT, NLSIU, and AIIMS alumni",
  },
] as const;

export default function StudentAuthExperience({
  initialMode = "login",
}: StudentAuthExperienceProps) {
  const router = useRouter();
  const prefersReducedMotion = useReducedMotion();
  const { isLoggedIn, login, signup } = useStudentAuth();

  const [mode, setMode] = useState<AuthMode>(initialMode);
  const [signupStep, setSignupStep] = useState<1 | 2>(1);

  // Sign In state
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [showLoginPassword, setShowLoginPassword] = useState(false);

  // Sign Up state
  const [fullName, setFullName] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [showSignupPassword, setShowSignupPassword] = useState(false);
  const [grade, setGrade] = useState<string>("Class 10");
  const [curriculum, setCurriculum] = useState<string>("CBSE");
  const [city, setCity] = useState("Bengaluru");
  const [schoolName, setSchoolName] = useState("");
  const [showParentFields, setShowParentFields] = useState(false);
  const [parentName, setParentName] = useState("");
  const [parentPhone, setParentPhone] = useState("");

  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Sync optional ?mode=signup query param when arriving at /login
  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    const qMode = params.get("mode");
    if (qMode === "signup" || qMode === "login") {
      setMode(qMode);
    }
  }, []);

  useEffect(() => {
    if (isLoggedIn) {
      router.replace("/dashboard");
    }
  }, [isLoggedIn, router]);

  const switchMode = (nextMode: AuthMode) => {
    setMode(nextMode);
    setErrorMsg(null);
    if (nextMode === "signup") {
      setSignupStep(1);
    }
    if (typeof window !== "undefined") {
      const targetPath = nextMode === "signup" ? "/signup" : "/login";
      if (window.location.pathname !== targetPath) {
        window.history.replaceState(null, "", targetPath);
      }
    }
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!loginEmail.trim() || !loginPassword) {
      setErrorMsg("Enter both your student email and password");
      return;
    }

    setIsSubmitting(true);
    const res = await login({
      email: loginEmail.trim(),
      password: loginPassword,
    });
    setIsSubmitting(false);

    if (!res.success) {
      setErrorMsg(res.error || "Invalid email or password");
    } else {
      router.push("/dashboard");
    }
  };

  const handleNextSignupStep = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (fullName.trim().length < 2) {
      setErrorMsg("Enter your full name to continue");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(signupEmail.trim())) {
      setErrorMsg("Enter a valid email address");
      return;
    }
    if (signupPassword.length < 6) {
      setErrorMsg("Password must be at least 6 characters long");
      return;
    }

    setSignupStep(2);
  };

  const handleSignupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (fullName.trim().length < 2 || !signupEmail.trim() || signupPassword.length < 6) {
      setSignupStep(1);
      setErrorMsg("Please check your account details in Step 1");
      return;
    }

    setIsSubmitting(true);
    const res = await signup({
      name: fullName.trim(),
      email: signupEmail.trim(),
      password: signupPassword,
      grade,
      curriculum,
      city: city.trim() || "India",
      schoolName: schoolName.trim() || undefined,
      parentName: parentName.trim() || undefined,
      parentPhone: parentPhone.trim() || undefined,
    });
    setIsSubmitting(false);

    if (!res.success) {
      setErrorMsg(res.error || "Could not create your student account");
    } else {
      router.push("/dashboard");
    }
  };

  const passwordReady = signupPassword.length >= 6;

  return (
    <div className="min-h-[100dvh] bg-[#F7F4EE] text-[#1F1B16] font-body selection:bg-[#C2410C] selection:text-white flex flex-col lg:grid lg:grid-cols-12">
      {/* ================================================================= */}
      {/* LEFT PANEL — WARM ARCHIVAL DESK EDITORIAL SHOWCASE                */}
      {/* ================================================================= */}
      <aside className="hidden lg:flex lg:col-span-6 xl:col-span-6 bg-[#F2EEE3] border-r border-[#1F1B16]/[0.08] flex-col justify-between px-10 xl:px-14 py-8">
        {/* Top Wordmark + Return Link */}
        <header className="flex items-center justify-between gap-4">
          <Link href="/" className="inline-flex items-center gap-2.5 group">
            <span className="size-2.5 rounded-[2px] bg-[#C2410C]" aria-hidden="true" />
            <span className="font-display text-lg font-semibold tracking-[-0.02em] text-[#1F1B16]">
              PTIROS
            </span>
            <span className="text-xs font-normal text-[#685F54] pl-1 border-l border-[#1F1B16]/[0.12]">
              Student Portal
            </span>
          </Link>

          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-medium text-[#5E554A] hover:text-[#1F1B16] transition-colors py-1.5 px-2.5 rounded-lg hover:bg-[#1F1B16]/[0.04]"
          >
            <ArrowLeft className="size-3.5" strokeWidth={1.5} />
            <span>Home</span>
          </Link>
        </header>

        {/* Center Editorial Desk Object & Headline */}
        <motion.div
          initial={prefersReducedMotion ? false : { opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: EASE_OUT }}
          className="my-auto py-6 max-w-xl"
        >
          {/* Desk Illustration seamlessly fading into matching #F2EEE3 surface */}
          <div className="relative mb-6 w-full max-w-[440px]">
            <img
              src="/auth_study_stillness.webp"
              alt="Minimalist pale oak study desk holding a terracotta linen hardcover notebook, an open blank cream sketchbook, a brass drafting compass, and a dark fountain pen"
              width={1200}
              height={896}
              fetchPriority="high"
              className="w-full h-auto block select-none"
              style={{
                maskImage:
                  "radial-gradient(ellipse 84% 78% at 50% 50%, #000 45%, rgba(0,0,0,0.5) 72%, transparent 98%)",
                WebkitMaskImage:
                  "radial-gradient(ellipse 84% 78% at 50% 50%, #000 45%, rgba(0,0,0,0.5) 72%, transparent 98%)",
              }}
            />
          </div>

          <h1 className="font-display text-[32px] xl:text-[36px] font-medium leading-[1.15] tracking-[-0.02em] text-[#1F1B16]">
            {mode === "login"
              ? "Pick up your study plan where you left off"
              : "Build a clear path from school to your career"}
          </h1>

          <p className="mt-3 text-sm leading-relaxed text-[#5E554A] max-w-md">
            Test careers before locking in high-school streams. Keep your diagnostic fit, workplace simulations, study goals, and mentor consultations in one workspace.
          </p>

          {/* Compact Paper Index Ledger */}
          <div className="mt-8 border-t border-[#1F1B16]/[0.08] pt-5 grid grid-cols-2 gap-x-6 gap-y-4">
            {PORTAL_INDEX.map((item) => (
              <div key={item.code} className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-[11px] tabular-nums text-[#9A3412]">
                    {item.code}
                  </span>
                  <span className="text-xs font-medium text-[#1F1B16]">
                    {item.title}
                  </span>
                </div>
                <p className="text-xs leading-snug text-[#685F54]">
                  {item.detail}
                </p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Quiet Footer Note */}
        <footer className="flex items-center justify-between text-xs text-[#685F54] border-t border-[#1F1B16]/[0.08] pt-4">
          <span>Aligned with NEP 2020 Class 8–12 framework</span>
          <Link
            href="/career-test"
            className="font-medium text-[#5E554A] hover:text-[#9A3412] transition-colors"
          >
            Explore Career Diagnostic
          </Link>
        </footer>
      </aside>

      {/* ================================================================= */}
      {/* RIGHT PANEL — CALM PARCHMENT AUTH WORKSPACE                       */}
      {/* ================================================================= */}
      <main className="lg:col-span-6 xl:col-span-6 flex-1 flex flex-col justify-between px-4 py-5 sm:px-8 sm:py-8 lg:px-12 xl:px-16">
        {/* Mobile & Tablet Header Strip */}
        <div className="flex lg:hidden items-center justify-between gap-3 pb-4 border-b border-[#1F1B16]/[0.08]">
          <Link href="/" className="inline-flex items-center gap-2">
            <span className="size-2 rounded-[2px] bg-[#C2410C]" aria-hidden="true" />
            <span className="font-display text-base font-semibold tracking-[-0.02em] text-[#1F1B16]">
              PTIROS
            </span>
          </Link>

          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-medium text-[#5E554A] hover:text-[#1F1B16] py-1.5 px-2.5 rounded-lg bg-[#EFE9DF]/70"
          >
            <ArrowLeft className="size-3.5" strokeWidth={1.5} />
            <span>Home</span>
          </Link>
        </div>

        {/* Centered Form Card */}
        <motion.div
          initial={prefersReducedMotion ? false : { opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.36, ease: EASE_OUT }}
          className="w-full max-w-[440px] mx-auto my-auto py-6 sm:py-8"
        >
          {/* Subtle Mobile Visual Banner Strip */}
          <div className="flex lg:hidden items-center gap-4 mb-5 p-3 rounded-2xl bg-[#F2EEE3] border border-[#1F1B16]/[0.07]">
            <img
              src="/auth_study_stillness.webp"
              alt="PTIROS study desk illustration"
              width={120}
              height={90}
              className="w-20 h-14 object-cover rounded-lg shrink-0"
            />
            <div className="min-w-0">
              <p className="text-xs font-medium text-[#1F1B16]">
                Classes 8–12 Student Workspace
              </p>
              <p className="text-xs text-[#685F54] mt-0.5 leading-snug">
                Career diagnostic, workplace simulations, and 1-on-1 mentorship
              </p>
            </div>
          </div>

          {/* Card Shell */}
          <div className="rounded-[20px] bg-[#FDFBF7] border border-[#1F1B16]/[0.08] p-5 sm:p-8 shadow-[0_1px_2px_rgba(31,27,22,0.04),0_12px_32px_rgba(31,27,22,0.05)]">
            {/* Mode Segmented Toggle */}
            <div
              role="tablist"
              aria-label="Account access mode"
              className="grid grid-cols-2 p-1 rounded-[12px] bg-[#EFE9DF] mb-6 relative"
            >
              {(["login", "signup"] as const).map((tabKey) => {
                const isActive = mode === tabKey;
                return (
                  <button
                    key={tabKey}
                    type="button"
                    role="tab"
                    aria-selected={isActive}
                    onClick={() => switchMode(tabKey)}
                    className={`relative z-10 h-9 rounded-[8px] text-xs font-medium transition-colors cursor-pointer ${
                      isActive ? "text-[#1F1B16]" : "text-[#5E554A] hover:text-[#1F1B16]"
                    }`}
                  >
                    {isActive && (
                      <motion.span
                        layoutId="auth-mode-pill"
                        transition={{ duration: 0.22, ease: EASE_OUT }}
                        className="absolute inset-0 -z-10 rounded-[8px] bg-[#FDFBF7] border border-[#1F1B16]/[0.07] shadow-[0_1px_2px_rgba(31,27,22,0.06)]"
                      />
                    )}
                    {tabKey === "login" ? "Sign in" : "Create account"}
                  </button>
                );
              })}
            </div>

            {/* Card Title & Subtitle */}
            <div className="mb-6">
              <div className="flex items-center justify-between gap-2">
                <h2 className="font-display text-2xl sm:text-[26px] font-medium tracking-[-0.02em] text-[#1F1B16]">
                  {mode === "login" ? "Sign in to your portal" : "Create student account"}
                </h2>
                {mode === "signup" && (
                  <span className="font-mono text-xs tabular-nums text-[#685F54] shrink-0">
                    {signupStep} / 2
                  </span>
                )}
              </div>
              <p className="mt-1.5 text-sm text-[#5E554A] leading-relaxed">
                {mode === "login"
                  ? "Enter your student email and password to open your dashboard"
                  : signupStep === 1
                  ? "Start with your name, email, and a password"
                  : "Tell us your class and board to tailor career recommendations"}
              </p>

              {/* Minimal 2-Step Hairline Bar in Signup Mode */}
              {mode === "signup" && (
                <div className="mt-4 grid grid-cols-2 gap-2" aria-hidden="true">
                  <div className="h-1 rounded-full bg-[#C2410C]" />
                  <div
                    className={`h-1 rounded-full transition-colors duration-200 ${
                      signupStep === 2 ? "bg-[#C2410C]" : "bg-[#1F1B16]/[0.10]"
                    }`}
                  />
                </div>
              )}
            </div>

            {/* Inline Error Alert */}
            {errorMsg && (
              <div
                role="alert"
                className="mb-5 p-3 rounded-[10px] bg-[#FEF2F2] border border-[#B91C1C]/20 flex items-start gap-2.5 text-xs text-[#991B1B]"
              >
                <AlertCircle className="size-4 shrink-0 mt-0.5 text-[#B91C1C]" strokeWidth={1.5} />
                <span className="leading-snug">{errorMsg}</span>
              </div>
            )}

            {/* ========================================================= */}
            {/* FORM BODY WITH SMOOTH TRANSITIONS                         */}
            {/* ========================================================= */}
            <AnimatePresence mode="wait" initial={false}>
              {mode === "login" ? (
                <motion.form
                  key="form-login"
                  initial={prefersReducedMotion ? false : { opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={prefersReducedMotion ? undefined : { opacity: 0, y: -6 }}
                  transition={{ duration: 0.2, ease: EASE_OUT }}
                  onSubmit={handleLoginSubmit}
                  className="space-y-4"
                >
                  <div>
                    <label
                      htmlFor="login-email"
                      className="block text-xs font-medium text-[#1F1B16] mb-1.5"
                    >
                      Student email
                    </label>
                    <div className="relative">
                      <Mail
                        className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-[#685F54] pointer-events-none"
                        strokeWidth={1.5}
                      />
                      <input
                        id="login-email"
                        type="email"
                        required
                        autoComplete="email"
                        value={loginEmail}
                        onChange={(e) => setLoginEmail(e.target.value)}
                        placeholder="student@example.com"
                        className="w-full h-11 pl-10 pr-4 rounded-[10px] bg-white border border-[#1F1B16]/[0.12] text-sm text-[#1F1B16] placeholder:text-[#7B7266] transition-colors focus:outline-none focus:border-[#C2410C] focus:ring-2 focus:ring-[#C2410C]/15"
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="login-password"
                      className="block text-xs font-medium text-[#1F1B16] mb-1.5"
                    >
                      Password
                    </label>
                    <div className="relative">
                      <Lock
                        className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-[#685F54] pointer-events-none"
                        strokeWidth={1.5}
                      />
                      <input
                        id="login-password"
                        type={showLoginPassword ? "text" : "password"}
                        required
                        autoComplete="current-password"
                        value={loginPassword}
                        onChange={(e) => setLoginPassword(e.target.value)}
                        placeholder="Enter your password"
                        className="w-full h-11 pl-10 pr-11 rounded-[10px] bg-white border border-[#1F1B16]/[0.12] text-sm text-[#1F1B16] placeholder:text-[#7B7266] transition-colors focus:outline-none focus:border-[#C2410C] focus:ring-2 focus:ring-[#C2410C]/15"
                      />
                      <button
                        type="button"
                        onClick={() => setShowLoginPassword((v) => !v)}
                        aria-label={showLoginPassword ? "Hide password" : "Show password"}
                        className="absolute right-1.5 top-1/2 -translate-y-1/2 size-8 flex items-center justify-center rounded-md text-[#685F54] hover:text-[#1F1B16] hover:bg-[#EFE9DF]/70 transition-colors cursor-pointer"
                      >
                        {showLoginPassword ? (
                          <EyeOff className="size-4" strokeWidth={1.5} />
                        ) : (
                          <Eye className="size-4" strokeWidth={1.5} />
                        )}
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full h-11 mt-2 rounded-[10px] bg-[#C2410C] hover:bg-[#9A3412] text-white font-medium text-sm transition-[background-color,transform] active:scale-[0.985] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="size-4 animate-spin" strokeWidth={1.5} />
                        <span>Signing in</span>
                      </>
                    ) : (
                      <>
                        <span>Sign in to portal</span>
                        <ArrowRight className="size-4" strokeWidth={1.5} />
                      </>
                    )}
                  </button>

                  <div className="pt-4 border-t border-[#1F1B16]/[0.08] flex items-center justify-between text-xs">
                    <span className="text-[#685F54]">New to PTIROS?</span>
                    <button
                      type="button"
                      onClick={() => switchMode("signup")}
                      className="font-medium text-[#9A3412] hover:text-[#1F1B16] transition-colors cursor-pointer"
                    >
                      Create student account
                    </button>
                  </div>
                </motion.form>
              ) : signupStep === 1 ? (
                <motion.form
                  key="form-signup-step1"
                  initial={prefersReducedMotion ? false : { opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={prefersReducedMotion ? undefined : { opacity: 0, x: -8 }}
                  transition={{ duration: 0.2, ease: EASE_OUT }}
                  onSubmit={handleNextSignupStep}
                  className="space-y-4"
                >
                  <div>
                    <label
                      htmlFor="signup-name"
                      className="block text-xs font-medium text-[#1F1B16] mb-1.5"
                    >
                      Student full name
                    </label>
                    <div className="relative">
                      <User
                        className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-[#685F54] pointer-events-none"
                        strokeWidth={1.5}
                      />
                      <input
                        id="signup-name"
                        type="text"
                        required
                        autoComplete="name"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="Student full name"
                        className="w-full h-11 pl-10 pr-4 rounded-[10px] bg-white border border-[#1F1B16]/[0.12] text-sm text-[#1F1B16] placeholder:text-[#7B7266] transition-colors focus:outline-none focus:border-[#C2410C] focus:ring-2 focus:ring-[#C2410C]/15"
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="signup-email"
                      className="block text-xs font-medium text-[#1F1B16] mb-1.5"
                    >
                      Student email address
                    </label>
                    <div className="relative">
                      <Mail
                        className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-[#685F54] pointer-events-none"
                        strokeWidth={1.5}
                      />
                      <input
                        id="signup-email"
                        type="email"
                        required
                        autoComplete="email"
                        value={signupEmail}
                        onChange={(e) => setSignupEmail(e.target.value)}
                        placeholder="student@example.com"
                        className="w-full h-11 pl-10 pr-4 rounded-[10px] bg-white border border-[#1F1B16]/[0.12] text-sm text-[#1F1B16] placeholder:text-[#7B7266] transition-colors focus:outline-none focus:border-[#C2410C] focus:ring-2 focus:ring-[#C2410C]/15"
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label
                        htmlFor="signup-password"
                        className="block text-xs font-medium text-[#1F1B16]"
                      >
                        Create password
                      </label>
                      <span
                        className={`text-[11px] font-medium tabular-nums transition-colors ${
                          passwordReady ? "text-[#15803D]" : "text-[#685F54]"
                        }`}
                      >
                        {passwordReady ? "Ready" : "Minimum 6 characters"}
                      </span>
                    </div>
                    <div className="relative">
                      <Lock
                        className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-[#685F54] pointer-events-none"
                        strokeWidth={1.5}
                      />
                      <input
                        id="signup-password"
                        type={showSignupPassword ? "text" : "password"}
                        required
                        minLength={6}
                        autoComplete="new-password"
                        value={signupPassword}
                        onChange={(e) => setSignupPassword(e.target.value)}
                        placeholder="At least 6 characters"
                        className="w-full h-11 pl-10 pr-11 rounded-[10px] bg-white border border-[#1F1B16]/[0.12] text-sm text-[#1F1B16] placeholder:text-[#7B7266] transition-colors focus:outline-none focus:border-[#C2410C] focus:ring-2 focus:ring-[#C2410C]/15"
                      />
                      <button
                        type="button"
                        onClick={() => setShowSignupPassword((v) => !v)}
                        aria-label={showSignupPassword ? "Hide password" : "Show password"}
                        className="absolute right-1.5 top-1/2 -translate-y-1/2 size-8 flex items-center justify-center rounded-md text-[#685F54] hover:text-[#1F1B16] hover:bg-[#EFE9DF]/70 transition-colors cursor-pointer"
                      >
                        {showSignupPassword ? (
                          <EyeOff className="size-4" strokeWidth={1.5} />
                        ) : (
                          <Eye className="size-4" strokeWidth={1.5} />
                        )}
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full h-11 mt-2 rounded-[10px] bg-[#1F1B16] hover:bg-[#342E26] text-white font-medium text-sm transition-[background-color,transform] active:scale-[0.985] flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>Continue to school profile</span>
                    <ArrowRight className="size-4" strokeWidth={1.5} />
                  </button>

                  <div className="pt-4 border-t border-[#1F1B16]/[0.08] flex items-center justify-between text-xs">
                    <span className="text-[#685F54]">Already registered?</span>
                    <button
                      type="button"
                      onClick={() => switchMode("login")}
                      className="font-medium text-[#9A3412] hover:text-[#1F1B16] transition-colors cursor-pointer"
                    >
                      Sign in instead
                    </button>
                  </div>
                </motion.form>
              ) : (
                <motion.form
                  key="form-signup-step2"
                  initial={prefersReducedMotion ? false : { opacity: 0, x: 8 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={prefersReducedMotion ? undefined : { opacity: 0, x: 8 }}
                  transition={{ duration: 0.2, ease: EASE_OUT }}
                  onSubmit={handleSignupSubmit}
                  className="space-y-4"
                >
                  {/* Step 1 Summary Strip */}
                  <div className="flex items-center justify-between gap-3 px-3 py-2.5 rounded-[10px] bg-[#EFE9DF]/80 border border-[#1F1B16]/[0.07] text-xs">
                    <div className="flex items-start gap-2 min-w-0">
                      <Check className="size-3.5 text-[#15803D] shrink-0 mt-0.5" strokeWidth={1.75} />
                      <div className="min-w-0">
                        <div className="truncate font-medium text-[#1F1B16]">
                          {fullName.trim()}
                        </div>
                        <div className="truncate text-[11px] text-[#685F54]">
                          {signupEmail.trim()}
                        </div>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setErrorMsg(null);
                        setSignupStep(1);
                      }}
                      className="text-[#9A3412] hover:text-[#1F1B16] font-medium shrink-0 cursor-pointer"
                    >
                      Edit
                    </button>
                  </div>

                  {/* Current Class / Grade Pill Grid */}
                  <div>
                    <span className="block text-xs font-medium text-[#1F1B16] mb-2">
                      Current class
                    </span>
                    <div className="grid grid-cols-3 gap-2">
                      {GRADES.map((g) => {
                        const selected = grade === g.value;
                        return (
                          <button
                            key={g.value}
                            type="button"
                            onClick={() => setGrade(g.value)}
                            className={`h-9 px-2 rounded-[8px] text-xs font-medium border transition-colors cursor-pointer ${
                              selected
                                ? "bg-[#1F1B16] text-white border-[#1F1B16]"
                                : "bg-white text-[#5E554A] border-[#1F1B16]/[0.12] hover:border-[#1F1B16]/[0.28] hover:text-[#1F1B16]"
                            }`}
                          >
                            {g.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Board & City */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label
                        htmlFor="signup-curriculum"
                        className="block text-xs font-medium text-[#1F1B16] mb-1.5"
                      >
                        School board
                      </label>
                      <div className="relative">
                        <select
                          id="signup-curriculum"
                          value={curriculum}
                          onChange={(e) => setCurriculum(e.target.value)}
                          className="w-full h-11 pl-3.5 pr-9 rounded-[10px] bg-white border border-[#1F1B16]/[0.12] text-sm text-[#1F1B16] appearance-none focus:outline-none focus:border-[#C2410C] focus:ring-2 focus:ring-[#C2410C]/15 cursor-pointer"
                        >
                          {CURRICULA.map((board) => (
                            <option key={board} value={board}>
                              {board}
                            </option>
                          ))}
                        </select>
                        <ChevronDown
                          className="absolute right-3 top-1/2 -translate-y-1/2 size-4 text-[#685F54] pointer-events-none"
                          strokeWidth={1.5}
                        />
                      </div>
                    </div>

                    <div>
                      <label
                        htmlFor="signup-city"
                        className="block text-xs font-medium text-[#1F1B16] mb-1.5"
                      >
                        City
                      </label>
                      <input
                        id="signup-city"
                        type="text"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        placeholder="e.g. Bengaluru"
                        className="w-full h-11 px-3.5 rounded-[10px] bg-white border border-[#1F1B16]/[0.12] text-sm text-[#1F1B16] placeholder:text-[#7B7266] focus:outline-none focus:border-[#C2410C] focus:ring-2 focus:ring-[#C2410C]/15"
                      />
                    </div>
                  </div>

                  {/* School Name (Optional) */}
                  <div>
                    <label
                      htmlFor="signup-school"
                      className="block text-xs font-medium text-[#1F1B16] mb-1.5"
                    >
                      School name <span className="text-[#685F54] font-normal">(optional)</span>
                    </label>
                    <div className="relative">
                      <Building
                        className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-[#685F54] pointer-events-none"
                        strokeWidth={1.5}
                      />
                      <input
                        id="signup-school"
                        type="text"
                        value={schoolName}
                        onChange={(e) => setSchoolName(e.target.value)}
                        placeholder="School name"
                        className="w-full h-11 pl-10 pr-4 rounded-[10px] bg-white border border-[#1F1B16]/[0.12] text-sm text-[#1F1B16] placeholder:text-[#7B7266] focus:outline-none focus:border-[#C2410C] focus:ring-2 focus:ring-[#C2410C]/15"
                      />
                    </div>
                  </div>

                  {/* Collapsible Optional Parent Details */}
                  <div className="pt-1">
                    <button
                      type="button"
                      onClick={() => setShowParentFields((v) => !v)}
                      className="inline-flex items-center gap-1.5 text-xs font-medium text-[#5E554A] hover:text-[#1F1B16] transition-colors cursor-pointer"
                    >
                      <ChevronDown
                        className={`size-3.5 transition-transform duration-150 ${
                          showParentFields ? "rotate-180" : ""
                        }`}
                        strokeWidth={1.5}
                      />
                      <span>Add parent or guardian contact (optional)</span>
                    </button>

                    {showParentFields && (
                      <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3 border-t border-[#1F1B16]/[0.08]">
                        <div>
                          <label
                            htmlFor="signup-parent-name"
                            className="block text-xs font-medium text-[#1F1B16] mb-1.5"
                          >
                            Parent name
                          </label>
                          <input
                            id="signup-parent-name"
                            type="text"
                            value={parentName}
                            onChange={(e) => setParentName(e.target.value)}
                            placeholder="Parent name"
                            className="w-full h-11 px-3.5 rounded-[10px] bg-white border border-[#1F1B16]/[0.12] text-sm text-[#1F1B16] placeholder:text-[#7B7266] focus:outline-none focus:border-[#C2410C] focus:ring-2 focus:ring-[#C2410C]/15"
                          />
                        </div>

                        <div>
                          <label
                            htmlFor="signup-parent-phone"
                            className="block text-xs font-medium text-[#1F1B16] mb-1.5"
                          >
                            WhatsApp number
                          </label>
                          <div className="relative">
                            <Phone
                              className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-[#685F54] pointer-events-none"
                              strokeWidth={1.5}
                            />
                            <input
                              id="signup-parent-phone"
                              type="tel"
                              value={parentPhone}
                              onChange={(e) => setParentPhone(e.target.value)}
                              placeholder="10-digit mobile"
                              className="w-full h-11 pl-10 pr-3.5 rounded-[10px] bg-white border border-[#1F1B16]/[0.12] text-sm text-[#1F1B16] placeholder:text-[#7B7266] focus:outline-none focus:border-[#C2410C] focus:ring-2 focus:ring-[#C2410C]/15"
                            />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Step 2 Submit Row */}
                  <div className="flex items-center gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => {
                        setErrorMsg(null);
                        setSignupStep(1);
                      }}
                      className="h-11 px-4 rounded-[10px] bg-[#EFE9DF] hover:bg-[#E6DEC9] text-[#1F1B16] font-medium text-sm transition-colors cursor-pointer"
                    >
                      Back
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="flex-1 h-11 rounded-[10px] bg-[#C2410C] hover:bg-[#9A3412] text-white font-medium text-sm transition-[background-color,transform] active:scale-[0.985] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="size-4 animate-spin" strokeWidth={1.5} />
                          <span>Creating account</span>
                        </>
                      ) : (
                        <>
                          <span>Create student account</span>
                          <ArrowRight className="size-4" strokeWidth={1.5} />
                        </>
                      )}
                    </button>
                  </div>
                </motion.form>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Quiet Footer on Right (cleared from floating copilot pill on small viewports) */}
        <div className="text-left sm:text-center pr-20 sm:pr-0 text-xs text-[#685F54] pt-2 pb-1">
          Sessions are private and tied strictly to your student account
        </div>
      </main>
    </div>
  );
}
