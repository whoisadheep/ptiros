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
  Check,
} from "lucide-react";
import { STUDENT_GRADES, SCHOOL_BOARDS, INDIAN_STATES } from "@/lib/studentProfileOptions";
import {
  validateStudentName,
  validateEmailField,
  validateIndianMobileField,
  evaluatePassword,
} from "@/lib/formValidation";
import PasswordRulesChecklist from "@/components/auth/PasswordRulesChecklist";

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
  const [parentEmail, setParentEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [showSignupPassword, setShowSignupPassword] = useState(false);
  const [grade, setGrade] = useState("Class 10");
  const [curriculum, setCurriculum] = useState("CBSE");
  const [stateVal, setStateVal] = useState("Karnataka");
  const [schoolName, setSchoolName] = useState("");
  const [city, setCity] = useState("Bengaluru");
  const [parentName, setParentName] = useState("");
  const [parentPhone, setParentPhone] = useState("");
  const [personalPhone, setPersonalPhone] = useState("");

  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const markTouched = (k: string) => setTouched((prev) => (prev[k] ? prev : { ...prev, [k]: true }));

  useScrollLock(isAuthModalOpen);

  if (!isAuthModalOpen) return null;

  const loginEmailCheck = validateEmailField(loginEmail, true, "Student email");
  const nameCheck = validateStudentName(fullName);
  const signupEmailCheck = validateEmailField(signupEmail, true, "Student email");
  const parentEmailCheck = validateEmailField(parentEmail, true, "Parent email");
  const parentMobileCheck = validateIndianMobileField(parentPhone, true, "Parent mobile");
  const personalMobileCheck = validateIndianMobileField(personalPhone, false, "Student mobile");
  const passwordEval = evaluatePassword(signupPassword);

  const immediatePhoneBad = (raw: string, chk: ReturnType<typeof validateIndianMobileField>) => {
    if (chk.valid) return false;
    const t = raw.trim();
    return /[A-Za-z]/.test(t) || chk.digits.length > 10 || (chk.digits.length > 0 && !/^[6-9]/.test(chk.digits));
  };

  const showNameErr =
    !nameCheck.valid && (Boolean(touched.name) || (fullName.trim().length > 0 && !/[A-Za-z]/.test(fullName)));
  const showSignupEmailErr = Boolean(touched.signupEmail) && !signupEmailCheck.valid;
  const showParentEmailErr = Boolean(touched.parentEmail) && !parentEmailCheck.valid;
  const showParentMobileErr =
    !parentMobileCheck.valid && (Boolean(touched.parentPhone) || immediatePhoneBad(parentPhone, parentMobileCheck));
  const showPersonalMobileErr =
    !personalMobileCheck.valid &&
    (Boolean(touched.personalPhone) || immediatePhoneBad(personalPhone, personalMobileCheck));
  const showPasswordErr = !passwordEval.allRequiredMet && Boolean(touched.signupPassword);

  const borderTone = (valid: boolean, err: boolean, hasContent: boolean) =>
    err
      ? "border-[#B91C1C] focus:border-[#B91C1C] focus:ring-2 focus:ring-[#B91C1C]/15"
      : hasContent && valid
      ? "border-[#15803D]/40 focus:border-[#C2410C]"
      : "border-[#1F1B16]/[0.12] focus:border-[#C2410C]";

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTouched((prev) => ({ ...prev, loginEmail: true, loginPassword: true }));
    if (!loginEmailCheck.valid || !loginPassword) return;

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
    setTouched({
      name: true,
      signupEmail: true,
      parentEmail: true,
      parentPhone: true,
      personalPhone: true,
      signupPassword: true,
    });

    if (
      !nameCheck.valid ||
      !signupEmailCheck.valid ||
      !parentEmailCheck.valid ||
      !parentMobileCheck.valid ||
      !personalMobileCheck.valid ||
      !passwordEval.allRequiredMet
    ) {
      return;
    }

    setIsSubmitting(true);
    setErrorMsg(null);
    const res = await signup({
      name: fullName.trim(),
      email: signupEmail.trim(),
      parentEmail: parentEmail.trim(),
      password: signupPassword,
      grade,
      curriculum,
      state: stateVal,
      schoolName: schoolName.trim() || undefined,
      city: city.trim() || stateVal || "India",
      parentName: parentName.trim() || undefined,
      parentPhone: parentMobileCheck.digits,
      personalPhone: personalMobileCheck.digits || undefined,
    });
    setIsSubmitting(false);
    if (!res.success) {
      setErrorMsg(res.error || "Failed to create student account");
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[1100] flex items-center justify-center p-3 sm:p-4 font-body">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18, ease: EASE_OUT }}
          onClick={closeAuthModal}
          className="fixed inset-0 bg-[#1F1B16]/55 backdrop-blur-xs"
        />

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
          <div className="relative px-5 sm:px-6 pt-5 pb-4 bg-[#F2EEE3] border-b border-[#1F1B16]/[0.08]">
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
                : "Register your student & parent contacts, then personalize inside your dashboard"}
            </p>
          </div>

          <div className="p-4 pb-0 sm:px-6">
            <div className="grid grid-cols-2 p-1 rounded-[12px] bg-[#EFE9DF]">
              <button
                type="button"
                onClick={() => {
                  openAuthModal("login");
                  setErrorMsg(null);
                  setTouched({});
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
                  setTouched({});
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

            {authMode === "login" && (
              <form noValidate onSubmit={handleLoginSubmit} className="space-y-4">
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
                      onBlur={() => markTouched("loginEmail")}
                      placeholder="student@example.com"
                      className={`w-full h-11 pl-10 pr-10 rounded-[10px] bg-white border text-sm text-[#1F1B16] placeholder:text-[#7B7266] focus:outline-none ${borderTone(
                        loginEmailCheck.valid,
                        Boolean(touched.loginEmail && !loginEmailCheck.valid),
                        loginEmail.trim().length > 0
                      )}`}
                    />
                    {loginEmail.trim().length > 0 && loginEmailCheck.valid && (
                      <Check className="absolute right-3.5 top-1/2 -translate-y-1/2 size-4 text-[#15803D]" strokeWidth={2} />
                    )}
                  </div>
                  {touched.loginEmail && !loginEmailCheck.valid && (
                    <p className="mt-1 text-[11px] text-[#B91C1C]" role="alert">
                      {loginEmailCheck.error}
                    </p>
                  )}
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
                      onBlur={() => markTouched("loginPassword")}
                      placeholder="Enter your password"
                      className={`w-full h-11 pl-10 pr-11 rounded-[10px] bg-white border text-sm text-[#1F1B16] placeholder:text-[#7B7266] focus:outline-none ${borderTone(
                        Boolean(loginPassword),
                        Boolean(touched.loginPassword && !loginPassword),
                        loginPassword.length > 0
                      )}`}
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
                  {touched.loginPassword && !loginPassword && (
                    <p className="mt-1 text-[11px] text-[#B91C1C]" role="alert">
                      Enter your password
                    </p>
                  )}
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

            {authMode === "signup" && (
              <form noValidate onSubmit={handleSignupSubmit} className="space-y-3">
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
                      onBlur={() => markTouched("name")}
                      placeholder="Student full name"
                      className={`w-full h-10 pl-9 pr-8 rounded-[10px] bg-white border text-xs text-[#1F1B16] focus:outline-none ${borderTone(
                        nameCheck.valid,
                        showNameErr,
                        fullName.trim().length > 0
                      )}`}
                    />
                    {fullName.trim().length > 0 && nameCheck.valid && (
                      <Check className="absolute right-3 top-1/2 -translate-y-1/2 size-3.5 text-[#15803D]" strokeWidth={2} />
                    )}
                  </div>
                  {showNameErr && (
                    <p className="mt-1 text-[11px] text-[#B91C1C]" role="alert">
                      {nameCheck.error}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-[#1F1B16] mb-1">
                      Student email *
                    </label>
                    <input
                      type="email"
                      value={signupEmail}
                      onChange={(e) => setSignupEmail(e.target.value)}
                      onBlur={() => markTouched("signupEmail")}
                      placeholder="student@example.com"
                      className={`w-full h-10 px-3 rounded-[10px] bg-white border text-xs text-[#1F1B16] focus:outline-none ${borderTone(
                        signupEmailCheck.valid,
                        showSignupEmailErr,
                        signupEmail.trim().length > 0
                      )}`}
                    />
                    {showSignupEmailErr && (
                      <p className="mt-1 text-[11px] text-[#B91C1C]" role="alert">
                        {signupEmailCheck.error}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-[#1F1B16] mb-1">
                      Parent email *
                    </label>
                    <input
                      type="email"
                      value={parentEmail}
                      onChange={(e) => setParentEmail(e.target.value)}
                      onBlur={() => markTouched("parentEmail")}
                      placeholder="parent@example.com"
                      className={`w-full h-10 px-3 rounded-[10px] bg-white border text-xs text-[#1F1B16] focus:outline-none ${borderTone(
                        parentEmailCheck.valid,
                        showParentEmailErr,
                        parentEmail.trim().length > 0
                      )}`}
                    />
                    {showParentEmailErr && (
                      <p className="mt-1 text-[11px] text-[#B91C1C]" role="alert">
                        {parentEmailCheck.error}
                      </p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="block text-xs font-medium text-[#1F1B16]">
                        Parent mobile *
                      </label>
                      <span
                        className={`text-[10px] font-mono tabular-nums ${
                          parentMobileCheck.valid
                            ? "text-[#15803D]"
                            : showParentMobileErr
                            ? "text-[#B91C1C]"
                            : "text-[#685F54]"
                        }`}
                      >
                        {parentMobileCheck.digits.length}/10
                      </span>
                    </div>
                    <div className="relative">
                      <Phone
                        className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-[#685F54]"
                        strokeWidth={1.5}
                      />
                      <input
                        type="tel"
                        inputMode="numeric"
                        value={parentPhone}
                        onChange={(e) => setParentPhone(e.target.value)}
                        onBlur={() => markTouched("parentPhone")}
                        placeholder="10-digit parent mobile"
                        className={`w-full h-10 pl-9 pr-3 rounded-[10px] bg-white border text-xs text-[#1F1B16] focus:outline-none ${borderTone(
                          parentMobileCheck.valid,
                          showParentMobileErr,
                          parentPhone.trim().length > 0
                        )}`}
                      />
                    </div>
                    {showParentMobileErr && (
                      <p className="mt-1 text-[11px] text-[#B91C1C]" role="alert">
                        {parentMobileCheck.error}
                      </p>
                    )}
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="block text-xs font-medium text-[#1F1B16]">
                        Student mobile <span className="text-[#685F54]">(optional)</span>
                      </label>
                    </div>
                    <input
                      type="tel"
                      inputMode="numeric"
                      value={personalPhone}
                      onChange={(e) => setPersonalPhone(e.target.value)}
                      onBlur={() => markTouched("personalPhone")}
                      placeholder="Optional"
                      className={`w-full h-10 px-3 rounded-[10px] bg-white border text-xs text-[#1F1B16] focus:outline-none ${borderTone(
                        personalMobileCheck.valid,
                        showPersonalMobileErr,
                        personalPhone.trim().length > 0
                      )}`}
                    />
                    {showPersonalMobileErr && (
                      <p className="mt-1 text-[11px] text-[#B91C1C]" role="alert">
                        {personalMobileCheck.error}
                      </p>
                    )}
                  </div>
                </div>

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
                      onBlur={() => markTouched("signupPassword")}
                      placeholder="Create strong password"
                      className={`w-full h-10 pl-9 pr-9 rounded-[10px] bg-white border text-xs text-[#1F1B16] focus:outline-none ${borderTone(
                        passwordEval.allRequiredMet,
                        showPasswordErr,
                        signupPassword.length > 0
                      )}`}
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
                  <PasswordRulesChecklist password={signupPassword} showError={showPasswordErr} compact />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-[#1F1B16] mb-1">
                      Class *
                    </label>
                    <div className="relative">
                      <GraduationCap
                        className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-[#685F54]"
                        strokeWidth={1.5}
                      />
                      <select
                        value={grade}
                        onChange={(e) => setGrade(e.target.value)}
                        className="w-full h-10 pl-9 pr-2 rounded-[10px] bg-white border border-[#1F1B16]/[0.12] text-xs text-[#1F1B16] focus:outline-none focus:border-[#C2410C]"
                      >
                        {STUDENT_GRADES.map((g) => (
                          <option key={g.value} value={g.value}>
                            {g.value}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-[#1F1B16] mb-1">
                      Board
                    </label>
                    <select
                      value={curriculum}
                      onChange={(e) => setCurriculum(e.target.value)}
                      className="w-full h-10 px-2.5 rounded-[10px] bg-white border border-[#1F1B16]/[0.12] text-xs text-[#1F1B16] focus:outline-none focus:border-[#C2410C]"
                    >
                      {SCHOOL_BOARDS.map((b) => (
                        <option key={b} value={b}>
                          {b}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-[#1F1B16] mb-1">
                      State
                    </label>
                    <select
                      value={stateVal}
                      onChange={(e) => setStateVal(e.target.value)}
                      className="w-full h-10 px-2.5 rounded-[10px] bg-white border border-[#1F1B16]/[0.12] text-xs text-[#1F1B16] focus:outline-none focus:border-[#C2410C]"
                    >
                      {INDIAN_STATES.map((st) => (
                        <option key={st} value={st}>
                          {st}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="City"
                    className="w-full h-10 px-3 rounded-[10px] bg-white border border-[#1F1B16]/[0.12] text-xs text-[#1F1B16] focus:outline-none focus:border-[#C2410C]"
                  />
                  <div className="relative">
                    <Building
                      className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-[#685F54]"
                      strokeWidth={1.5}
                    />
                    <input
                      type="text"
                      value={schoolName}
                      onChange={(e) => setSchoolName(e.target.value)}
                      placeholder="School (optional)"
                      className="w-full h-10 pl-9 pr-3 rounded-[10px] bg-white border border-[#1F1B16]/[0.12] text-xs text-[#1F1B16] focus:outline-none focus:border-[#C2410C]"
                    />
                  </div>
                  <input
                    type="text"
                    value={parentName}
                    onChange={(e) => setParentName(e.target.value)}
                    placeholder="Parent name (opt.)"
                    className="w-full h-10 px-3 rounded-[10px] bg-white border border-[#1F1B16]/[0.12] text-xs text-[#1F1B16] focus:outline-none focus:border-[#C2410C]"
                  />
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

            <div className="mt-5 pt-4 border-t border-[#1F1B16]/[0.08] flex items-center justify-between text-xs text-[#685F54]">
              <span>Prefer interactive card onboarding?</span>
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
