"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useStudentAuth } from "@/context/StudentAuthContext";
import {
  X,
  Sparkles,
  Lock,
  Mail,
  User,
  GraduationCap,
  Building,
  Phone,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Zap,
  BookOpen,
} from "lucide-react";

export default function StudentAuthModal() {
  const {
    isAuthModalOpen,
    closeAuthModal,
    authMode,
    openAuthModal,
    login,
    loginAsDemo,
    signup,
  } = useStudentAuth();

  // Login form state
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  // Signup form state
  const [fullName, setFullName] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [grade, setGrade] = useState("Class 10");
  const [curriculum, setCurriculum] = useState("CBSE");
  const [schoolName, setSchoolName] = useState("");
  const [city, setCity] = useState("Delhi NCR");
  const [parentName, setParentName] = useState("");
  const [parentPhone, setParentPhone] = useState("");
  const [parentDream, setParentDream] = useState("Wants stable engineering/technology career");

  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isAuthModalOpen) return null;

  const handleDemoClick = async (demoKey: "aarav" | "meera" | "vihaan") => {
    setIsSubmitting(true);
    setErrorMsg(null);
    const res = await loginAsDemo(demoKey);
    setIsSubmitting(false);
    if (!res.success) {
      setErrorMsg(res.error || "Failed to switch demo account");
    }
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginEmail || !loginPassword) {
      setErrorMsg("Please enter both email and password.");
      return;
    }
    setIsSubmitting(true);
    setErrorMsg(null);
    const res = await login({ email: loginEmail, password: loginPassword });
    setIsSubmitting(false);
    if (!res.success) {
      setErrorMsg(res.error || "Invalid login credentials.");
    }
  };

  const handleSignupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !signupEmail.trim() || !signupPassword) {
      setErrorMsg("Please fill in all mandatory fields.");
      return;
    }
    if (signupPassword.length < 6) {
      setErrorMsg("Password must be at least 6 characters.");
      return;
    }
    setIsSubmitting(true);
    setErrorMsg(null);
    const res = await signup({
      name: fullName,
      email: signupEmail,
      password: signupPassword,
      grade,
      curriculum,
      schoolName: schoolName || undefined,
      city: city || "Delhi NCR",
      parentName: parentName || undefined,
      parentPhone: parentPhone || undefined,
      parentDream: parentDream || undefined,
    });
    setIsSubmitting(false);
    if (!res.success) {
      setErrorMsg(res.error || "Failed to create student account.");
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={closeAuthModal}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.2 }}
          className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-border/80 overflow-hidden z-10 flex flex-col max-h-[92vh]"
        >
          {/* Header */}
          <div className="relative px-6 pt-6 pb-4 bg-gradient-to-r from-orange-50 via-amber-50 to-orange-100/50 border-b border-border/60">
            <button
              onClick={closeAuthModal}
              className="absolute top-5 right-5 size-9 rounded-full bg-white/80 hover:bg-white text-text-muted hover:text-accent flex items-center justify-center shadow-xs transition"
              aria-label="Close modal"
            >
              <X className="size-4" />
            </button>

            <div className="flex items-center gap-2 mb-1">
              <span className="font-display font-black text-xl text-gradient">PTIROS</span>
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                Student Portal
              </span>
            </div>
            <h2 className="text-xl font-display font-bold text-accent">
              {authMode === "login" ? "Sign in to Student Dashboard" : "Create Student Account"}
            </h2>
            <p className="text-xs text-text-muted mt-0.5">
              Access your personalized roadmap, Hansei diary, Kaizen daily planner, and mentor notes.
            </p>

            {/* Quick Demo Switcher Strip */}
            <div className="mt-4 p-3 rounded-2xl bg-white/90 border border-orange-200/80 shadow-xs">
              <div className="flex items-center justify-between text-xs font-bold text-orange-950 mb-2">
                <span className="flex items-center gap-1.5">
                  <Zap className="size-3.5 text-primary fill-primary" />
                  Instant Demo Login (1-Click)
                </span>
                <span className="text-[10px] font-normal text-text-muted">No password needed</span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => handleDemoClick("aarav")}
                  disabled={isSubmitting}
                  className="p-2 rounded-xl bg-orange-50/90 hover:bg-orange-100 border border-orange-200/60 text-left transition text-xs group cursor-pointer disabled:opacity-50"
                >
                  <div className="font-bold text-accent group-hover:text-primary flex items-center justify-between">
                    <span>Aarav</span>
                    <span className="text-[10px] px-1 rounded bg-orange-200/60 text-orange-800">Cl. 10</span>
                  </div>
                  <div className="text-[10px] text-text-muted truncate">AI & Robotics</div>
                </button>

                <button
                  type="button"
                  onClick={() => handleDemoClick("meera")}
                  disabled={isSubmitting}
                  className="p-2 rounded-xl bg-blue-50/90 hover:bg-blue-100 border border-blue-200/60 text-left transition text-xs group cursor-pointer disabled:opacity-50"
                >
                  <div className="font-bold text-accent group-hover:text-blue-700 flex items-center justify-between">
                    <span>Meera</span>
                    <span className="text-[10px] px-1 rounded bg-blue-200/60 text-blue-800">Cl. 11</span>
                  </div>
                  <div className="text-[10px] text-text-muted truncate">Corporate Law</div>
                </button>

                <button
                  type="button"
                  onClick={() => handleDemoClick("vihaan")}
                  disabled={isSubmitting}
                  className="p-2 rounded-xl bg-emerald-50/90 hover:bg-emerald-100 border border-emerald-200/60 text-left transition text-xs group cursor-pointer disabled:opacity-50"
                >
                  <div className="font-bold text-accent group-hover:text-emerald-700 flex items-center justify-between">
                    <span>Vihaan</span>
                    <span className="text-[10px] px-1 rounded bg-emerald-200/60 text-emerald-800">Cl. 12</span>
                  </div>
                  <div className="text-[10px] text-text-muted truncate">Medicine & Bio</div>
                </button>
              </div>
            </div>
          </div>

          {/* Mode Tabs */}
          <div className="flex border-b border-border/70 bg-bg-muted/40">
            <button
              type="button"
              onClick={() => {
                openAuthModal("login");
                setErrorMsg(null);
              }}
              className={`flex-1 py-3 text-xs font-bold text-center border-b-2 transition cursor-pointer ${
                authMode === "login"
                  ? "border-primary text-primary bg-white"
                  : "border-transparent text-text-muted hover:text-accent"
              }`}
            >
              Sign In (Email & Password)
            </button>
            <button
              type="button"
              onClick={() => {
                openAuthModal("signup");
                setErrorMsg(null);
              }}
              className={`flex-1 py-3 text-xs font-bold text-center border-b-2 transition cursor-pointer ${
                authMode === "signup"
                  ? "border-primary text-primary bg-white"
                  : "border-transparent text-text-muted hover:text-accent"
              }`}
            >
              New Student Registration
            </button>
          </div>

          {/* Content Body */}
          <div className="p-6 overflow-y-auto flex-1">
            {errorMsg && (
              <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
                <AlertCircle className="size-4 shrink-0 text-red-500" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* TAB: LOGIN */}
            {authMode === "login" && (
              <form onSubmit={handleLoginSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-accent mb-1.5">
                    Student Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-3 size-4 text-text-muted" />
                    <input
                      type="email"
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      placeholder="e.g. aarav@demo.ptiros.in"
                      required
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary"
                    />
                  </div>
                  <div className="text-[11px] text-text-muted mt-1 flex items-center gap-1">
                    <span>Demo account:</span>
                    <button
                      type="button"
                      onClick={() => {
                        setLoginEmail("aarav@demo.ptiros.in");
                        setLoginPassword("student123");
                      }}
                      className="text-primary hover:underline font-semibold"
                    >
                      Fill Aarav credentials
                    </button>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-bold text-accent">Password</label>
                    <span className="text-[10px] text-text-muted">(Demo: student123)</span>
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-3 size-4 text-text-muted" />
                    <input
                      type="password"
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      placeholder="••••••••"
                      required
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 rounded-xl bg-primary text-white font-bold text-sm shadow-md shadow-primary/25 hover:bg-primary-dark transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
                >
                  {isSubmitting ? "Signing In..." : "Sign In to Dashboard"}
                  <ArrowRight className="size-4" />
                </button>
              </form>
            )}

            {/* TAB: SIGNUP */}
            {authMode === "signup" && (
              <form onSubmit={handleSignupSubmit} className="space-y-3.5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-accent mb-1">
                      Student Full Name *
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-2.5 size-4 text-text-muted" />
                      <input
                        type="text"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="Rohan Sharma"
                        required
                        className="w-full pl-9 pr-3 py-2 rounded-xl border border-border text-xs focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-accent mb-1">
                      Student Email Address *
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-2.5 size-4 text-text-muted" />
                      <input
                        type="email"
                        value={signupEmail}
                        onChange={(e) => setSignupEmail(e.target.value)}
                        placeholder="rohan@example.com"
                        required
                        className="w-full pl-9 pr-3 py-2 rounded-xl border border-border text-xs focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-accent mb-1">
                      Create Password *
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-2.5 size-4 text-text-muted" />
                      <input
                        type="password"
                        value={signupPassword}
                        onChange={(e) => setSignupPassword(e.target.value)}
                        placeholder="At least 6 characters"
                        required
                        minLength={6}
                        className="w-full pl-9 pr-3 py-2 rounded-xl border border-border text-xs focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-accent mb-1">
                      Current Grade / Class *
                    </label>
                    <div className="relative">
                      <GraduationCap className="absolute left-3 top-2.5 size-4 text-text-muted" />
                      <select
                        value={grade}
                        onChange={(e) => setGrade(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 rounded-xl border border-border text-xs focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary bg-white"
                      >
                        <option value="Class 8">Class 8</option>
                        <option value="Class 9">Class 9</option>
                        <option value="Class 10">Class 10</option>
                        <option value="Class 11">Class 11</option>
                        <option value="Class 12">Class 12</option>
                        <option value="Dropper / UG 1st Yr">Dropper / UG 1st Yr</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-accent mb-1">
                      School Curriculum
                    </label>
                    <select
                      value={curriculum}
                      onChange={(e) => setCurriculum(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-border text-xs focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary bg-white"
                    >
                      <option value="CBSE">CBSE</option>
                      <option value="ICSE">ICSE</option>
                      <option value="IB">IB</option>
                      <option value="Cambridge">Cambridge / IGCSE</option>
                      <option value="State Board">State Board</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-accent mb-1">
                      City / Location
                    </label>
                    <input
                      type="text"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      placeholder="e.g. Mumbai, Bengaluru"
                      className="w-full px-3 py-2 rounded-xl border border-border text-xs focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-accent mb-1">
                    School Name
                  </label>
                  <div className="relative">
                    <Building className="absolute left-3 top-2.5 size-4 text-text-muted" />
                    <input
                      type="text"
                      value={schoolName}
                      onChange={(e) => setSchoolName(e.target.value)}
                      placeholder="e.g. Kendriya Vidyalaya IIT Powai"
                      className="w-full pl-9 pr-3 py-2 rounded-xl border border-border text-xs focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1 border-t border-border/50">
                  <div>
                    <label className="block text-xs font-bold text-accent mb-1">
                      Parent / Guardian Name
                    </label>
                    <input
                      type="text"
                      value={parentName}
                      onChange={(e) => setParentName(e.target.value)}
                      placeholder="e.g. Rajesh Sharma"
                      className="w-full px-3 py-2 rounded-xl border border-border text-xs focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-accent mb-1">
                      Parent WhatsApp Mobile
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-2.5 size-4 text-text-muted" />
                      <input
                        type="tel"
                        value={parentPhone}
                        onChange={(e) => setParentPhone(e.target.value)}
                        placeholder="10-digit number"
                        className="w-full pl-9 pr-3 py-2 rounded-xl border border-border text-xs focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary"
                      />
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full mt-2 py-3 rounded-xl bg-primary text-white font-bold text-sm shadow-md shadow-primary/25 hover:bg-primary-dark transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
                >
                  {isSubmitting ? "Creating Account in Neon..." : "Complete Registration & Launch Portal"}
                  <Sparkles className="size-4" />
                </button>
              </form>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
