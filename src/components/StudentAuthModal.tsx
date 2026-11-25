"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useStudentAuth } from "@/context/StudentAuthContext";
import { useScrollLock } from "@/hooks/useScrollLock";
import {
  X,
  Lock,
  Mail,
  User,
  GraduationCap,
  Building,
  Phone,
  ArrowRight,
  AlertCircle,
  Eye,
  EyeOff,
  Loader2,
  ExternalLink,
} from "lucide-react";

const EASE_OUT = [0.22, 1, 0.36, 1] as const;

export default function StudentAuthModal() {
  const {
    isAuthModalOpen,
    closeAuthModal,
    authMode,
    openAuthModal,
    login,
    signup,
  } = useStudentAuth();

  // Login form state
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [showLoginPassword, setShowLoginPassword] = useState(false);

  // Signup form state
  const [fullName, setFullName] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [showSignupPassword, setShowSignupPassword] = useState(false);
  const [grade, setGrade] = useState("Class 10");
  const [curriculum, setCurriculum] = useState("CBSE");
  const [schoolName, setSchoolName] = useState("");
  const [city, setCity] = useState("Bengaluru");
  const [parentName, setParentName] = useState("");
  const [parentPhone, setParentPhone] = useState("");

  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useScrollLock(isAuthModalOpen);

  if (!isAuthModalOpen) return null;

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginEmail || !loginPassword) {
      setErrorMsg("Enter both your student email and password");
      return;
    }
    setIsSubmitting(true);
    setErrorMsg(null);
    const res = await login({ email: loginEmail.trim(), password: loginPassword });
    setIsSubmitting(false);
    if (!res.success) {
      setErrorMsg(res.error || "Invalid login credentials");
    }
  };

  const handleSignupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !signupEmail.trim() || !signupPassword) {
      setErrorMsg("Fill in all mandatory fields");
      return;
    }
    if (signupPassword.length < 6) {
      setErrorMsg("Password must be at least 6 characters");
      return;
    }
    setIsSubmitting(true);
    setErrorMsg(null);
    const res = await signup({
      name: fullName.trim(),
      email: signupEmail.trim(),
      password: signupPassword,
      grade,
      curriculum,
      schoolName: schoolName.trim() || undefined,
      city: city.trim() || "India",
      parentName: parentName.trim() || undefined,
      parentPhone: parentPhone.trim() || undefined,
    });
    setIsSubmitting(false);
    if (!res.success) {
      setErrorMsg(res.error || "Failed to create student account");
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[1100] flex items-center justify-center p-3 sm:p-4 font-body">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18, ease: EASE_OUT }}
          onClick={closeAuthModal}
          className="fixed inset-0 bg-[#1F1B16]/55 backdrop-blur-xs"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.97, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.97, y: 10 }}
          transition={{ duration: 0.24, ease: EASE_OUT }}
          role="dialog"
          aria-modal="true"
          data-lenis-prevent
          className="relative w-full max-w-lg bg-[#FDFBF7] text-[#1F1B16] rounded-[20px] shadow-[0_12px_40px_rgba(31,27,22,0.18)] border border-[#1F1B16]/[0.1] overflow-y-auto z-10 flex flex-col max-h-[90dvh] overscroll-contain"
        >
          {/* Header */}
          <div className="relative px-5 sm:px-6 pt-5 pb-4 bg-[#F3EDE2] border-b border-[#1F1B16]/[0.08]">
            <button
              type="button"
              onClick={closeAuthModal}
              className="absolute top-4 right-4 size-9 rounded-full bg-[#FDFBF7] border border-[#1F1B16]/[0.08] text-[#5E554A] hover:text-[#1F1B16] flex items-center justify-center transition-colors cursor-pointer"
              aria-label="Close modal"
            >
              <X className="size-4" strokeWidth={1.5} />
            </button>

            <div className="flex items-center gap-2 mb-1.5">
              <span className="size-2 rounded-[2px] bg-[#C2410C]" aria-hidden="true" />
              <span className="font-display font-semibold text-base tracking-[-0.02em] text-[#1F1B16]">
                PTIROS
              </span>
              <span className="text-xs text-[#685F54] pl-2 border-l border-[#1F1B16]/[0.12]">
                Student Portal
              </span>
            </div>
            <h2 className="text-xl font-display font-medium tracking-[-0.02em] text-[#1F1B16]">
              {authMode === "login" ? "Sign in to your portal" : "Create student account"}
            </h2>
            <p className="text-xs text-[#5E554A] mt-1">
              {authMode === "login"
                ? "Access your roadmap, study planner, and 1-on-1 mentor meetings"
                : "Set up a personal student workspace for career diagnostics and goals"}
            </p>
          </div>

          {/* Mode Tabs */}
          <div className="p-4 pb-0 sm:px-6">
            <div className="grid grid-cols-2 p-1 rounded-[12px] bg-[#EFE9DF]">
              <button
                type="button"
                onClick={() => {
                  openAuthModal("login");
                  setErrorMsg(null);
                }}
                className={`h-9 rounded-[8px] text-xs font-medium text-center transition-colors cursor-pointer ${
                  authMode === "login"
                    ? "bg-[#FDFBF7] text-[#1F1B16] border border-[#1F1B16]/[0.07] shadow-2xs"
                    : "text-[#5E554A] hover:text-[#1F1B16]"
                }`}
              >
                Sign in
              </button>
              <button
                type="button"
                onClick={() => {
                  openAuthModal("signup");
                  setErrorMsg(null);
                }}
                className={`h-9 rounded-[8px] text-xs font-medium text-center transition-colors cursor-pointer ${
                  authMode === "signup"
                    ? "bg-[#FDFBF7] text-[#1F1B16] border border-[#1F1B16]/[0.07] shadow-2xs"
                    : "text-[#5E554A] hover:text-[#1F1B16]"
                }`}
              >
                Create account
              </button>
            </div>
          </div>

          {/* Content Body */}
          <div data-lenis-prevent className="p-5 sm:p-6 overflow-y-auto flex-1 overscroll-contain">
            {errorMsg && (
              <div
                role="alert"
                className="mb-4 p-3 rounded-[10px] bg-[#FEF2F2] border border-[#B91C1C]/20 text-[#991B1B] text-xs flex items-start gap-2"
              >
                <AlertCircle className="size-4 shrink-0 mt-0.5 text-[#B91C1C]" strokeWidth={1.5} />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* TAB: LOGIN */}
            {authMode === "login" && (
              <form onSubmit={handleLoginSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-[#1F1B16] mb-1.5">
                    Student email address
                  </label>
                  <div className="relative">
                    <Mail
                      className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-[#685F54]"
                      strokeWidth={1.5}
                    />
                    <input
                      type="email"
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      placeholder="student@example.com"
                      required
                      className="w-full h-11 pl-10 pr-4 rounded-[10px] bg-white border border-[#1F1B16]/[0.12] text-sm text-[#1F1B16] placeholder:text-[#7B7266] focus:outline-none focus:border-[#C2410C] focus:ring-2 focus:ring-[#C2410C]/15"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#1F1B16] mb-1.5">
                    Password
                  </label>
                  <div className="relative">
                    <Lock
                      className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-[#685F54]"
                      strokeWidth={1.5}
                    />
                    <input
                      type={showLoginPassword ? "text" : "password"}
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      placeholder="Enter your password"
                      required
                      className="w-full h-11 pl-10 pr-11 rounded-[10px] bg-white border border-[#1F1B16]/[0.12] text-sm text-[#1F1B16] placeholder:text-[#7B7266] focus:outline-none focus:border-[#C2410C] focus:ring-2 focus:ring-[#C2410C]/15"
                    />
                    <button
                      type="button"
                      onClick={() => setShowLoginPassword((v) => !v)}
                      aria-label={showLoginPassword ? "Hide password" : "Show password"}
                      className="absolute right-1.5 top-1/2 -translate-y-1/2 size-8 flex items-center justify-center rounded-md text-[#685F54] hover:text-[#1F1B16] cursor-pointer"
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
                  className="w-full h-11 rounded-[10px] bg-[#C2410C] hover:bg-[#9A3412] text-white font-medium text-sm transition-[background-color,transform] active:scale-[0.985] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
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
              </form>
            )}

            {/* TAB: SIGNUP */}
            {authMode === "signup" && (
              <form onSubmit={handleSignupSubmit} className="space-y-3.5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-[#1F1B16] mb-1">
                      Student full name *
                    </label>
                    <div className="relative">
                      <User
                        className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-[#685F54]"
                        strokeWidth={1.5}
                      />
                      <input
                        type="text"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="Student full name"
                        required
                        className="w-full h-10 pl-9 pr-3 rounded-[10px] bg-white border border-[#1F1B16]/[0.12] text-xs text-[#1F1B16] focus:outline-none focus:border-[#C2410C] focus:ring-2 focus:ring-[#C2410C]/15"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-[#1F1B16] mb-1">
                      Student email *
                    </label>
                    <div className="relative">
                      <Mail
                        className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-[#685F54]"
                        strokeWidth={1.5}
                      />
                      <input
                        type="email"
                        value={signupEmail}
                        onChange={(e) => setSignupEmail(e.target.value)}
                        placeholder="student@example.com"
                        required
                        className="w-full h-10 pl-9 pr-3 rounded-[10px] bg-white border border-[#1F1B16]/[0.12] text-xs text-[#1F1B16] focus:outline-none focus:border-[#C2410C] focus:ring-2 focus:ring-[#C2410C]/15"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-[#1F1B16] mb-1">
                      Create password *
                    </label>
                    <div className="relative">
                      <Lock
                        className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-[#685F54]"
                        strokeWidth={1.5}
                      />
                      <input
                        type={showSignupPassword ? "text" : "password"}
                        value={signupPassword}
                        onChange={(e) => setSignupPassword(e.target.value)}
                        placeholder="Min. 6 characters"
                        required
                        minLength={6}
                        className="w-full h-10 pl-9 pr-9 rounded-[10px] bg-white border border-[#1F1B16]/[0.12] text-xs text-[#1F1B16] focus:outline-none focus:border-[#C2410C] focus:ring-2 focus:ring-[#C2410C]/15"
                      />
                      <button
                        type="button"
                        onClick={() => setShowSignupPassword((v) => !v)}
                        aria-label={showSignupPassword ? "Hide password" : "Show password"}
                        className="absolute right-1.5 top-1/2 -translate-y-1/2 size-7 flex items-center justify-center rounded text-[#685F54] hover:text-[#1F1B16] cursor-pointer"
                      >
                        {showSignupPassword ? (
                          <EyeOff className="size-3.5" strokeWidth={1.5} />
                        ) : (
                          <Eye className="size-3.5" strokeWidth={1.5} />
                        )}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-[#1F1B16] mb-1">
                      Current class *
                    </label>
                    <div className="relative">
                      <GraduationCap
                        className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-[#685F54]"
                        strokeWidth={1.5}
                      />
                      <select
                        value={grade}
                        onChange={(e) => setGrade(e.target.value)}
                        className="w-full h-10 pl-9 pr-3 rounded-[10px] bg-white border border-[#1F1B16]/[0.12] text-xs text-[#1F1B16] focus:outline-none focus:border-[#C2410C] focus:ring-2 focus:ring-[#C2410C]/15"
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
                    <label className="block text-xs font-medium text-[#1F1B16] mb-1">
                      School board
                    </label>
                    <select
                      value={curriculum}
                      onChange={(e) => setCurriculum(e.target.value)}
                      className="w-full h-10 px-3 rounded-[10px] bg-white border border-[#1F1B16]/[0.12] text-xs text-[#1F1B16] focus:outline-none focus:border-[#C2410C] focus:ring-2 focus:ring-[#C2410C]/15"
                    >
                      <option value="CBSE">CBSE</option>
                      <option value="ICSE">ICSE</option>
                      <option value="IB">IB</option>
                      <option value="Cambridge">Cambridge / IGCSE</option>
                      <option value="State Board">State Board</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-[#1F1B16] mb-1">
                      City
                    </label>
                    <input
                      type="text"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      placeholder="e.g. Bengaluru"
                      className="w-full h-10 px-3 rounded-[10px] bg-white border border-[#1F1B16]/[0.12] text-xs text-[#1F1B16] focus:outline-none focus:border-[#C2410C] focus:ring-2 focus:ring-[#C2410C]/15"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#1F1B16] mb-1">
                    School name (optional)
                  </label>
                  <div className="relative">
                    <Building
                      className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-[#685F54]"
                      strokeWidth={1.5}
                    />
                    <input
                      type="text"
                      value={schoolName}
                      onChange={(e) => setSchoolName(e.target.value)}
                      placeholder="School name"
                      className="w-full h-10 pl-9 pr-3 rounded-[10px] bg-white border border-[#1F1B16]/[0.12] text-xs text-[#1F1B16] focus:outline-none focus:border-[#C2410C] focus:ring-2 focus:ring-[#C2410C]/15"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-[#1F1B16]/[0.07]">
                  <div>
                    <label className="block text-xs font-medium text-[#1F1B16] mb-1">
                      Parent name (optional)
                    </label>
                    <input
                      type="text"
                      value={parentName}
                      onChange={(e) => setParentName(e.target.value)}
                      placeholder="Parent / guardian name"
                      className="w-full h-10 px-3 rounded-[10px] bg-white border border-[#1F1B16]/[0.12] text-xs text-[#1F1B16] focus:outline-none focus:border-[#C2410C] focus:ring-2 focus:ring-[#C2410C]/15"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-[#1F1B16] mb-1">
                      Parent WhatsApp (optional)
                    </label>
                    <div className="relative">
                      <Phone
                        className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-[#685F54]"
                        strokeWidth={1.5}
                      />
                      <input
                        type="tel"
                        value={parentPhone}
                        onChange={(e) => setParentPhone(e.target.value)}
                        placeholder="10-digit number"
                        className="w-full h-10 pl-9 pr-3 rounded-[10px] bg-white border border-[#1F1B16]/[0.12] text-xs text-[#1F1B16] focus:outline-none focus:border-[#C2410C] focus:ring-2 focus:ring-[#C2410C]/15"
                      />
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full h-11 mt-1 rounded-[10px] bg-[#C2410C] hover:bg-[#9A3412] text-white font-medium text-sm transition-[background-color,transform] active:scale-[0.985] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
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
              </form>
            )}

            {/* Full-Page Link Footer */}
            <div className="mt-5 pt-4 border-t border-[#1F1B16]/[0.08] flex items-center justify-between text-xs text-[#685F54]">
              <span>Open full portal gateway</span>
              <Link
                href={authMode === "signup" ? "/signup" : "/login"}
                onClick={closeAuthModal}
                className="inline-flex items-center gap-1 font-medium text-[#9A3412] hover:text-[#1F1B16] transition-colors"
              >
                <span>{authMode === "signup" ? "Open Sign Up Page" : "Open Sign In Page"}</span>
                <ExternalLink className="size-3" strokeWidth={1.5} />
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
