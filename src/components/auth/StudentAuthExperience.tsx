"use client";

import React, { useEffect, useState, useMemo } from "react";
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
  Phone,
  ChevronDown,
  MapPin,
  Building,
  Minus,
  Plus,
  Compass,
  LayoutDashboard,
  CheckCircle2,
  Sparkles,
} from "lucide-react";
import { useStudentAuth } from "@/context/StudentAuthContext";
import {
  STUDENT_GRADES,
  SCHOOL_BOARDS,
  GENDER_OPTIONS,
  INDIAN_STATES,
  DREAM_PRESETS,
  COMPETITION_LEVELS,
} from "@/lib/studentProfileOptions";
import {
  validateStudentName,
  validateEmailField,
  validateIndianMobileField,
  validateAgeField,
  validatePercentageField,
  evaluatePassword,
} from "@/lib/formValidation";
import PasswordRulesChecklist from "@/components/auth/PasswordRulesChecklist";

export type AuthMode = "login" | "signup";

interface StudentAuthExperienceProps {
  initialMode?: AuthMode;
}

const EASE_OUT = [0.22, 1, 0.36, 1] as const;

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

function shouldShowMobileErrNow(
  raw: string,
  isTouched: boolean,
  check: ReturnType<typeof validateIndianMobileField>
) {
  if (check.valid) return false;
  const trimmed = raw.trim();
  const immediateIssue =
    /[A-Za-z]/.test(trimmed) ||
    check.digits.length > 10 ||
    (check.digits.length > 0 && !/^[6-9]/.test(check.digits));
  return isTouched || immediateIssue;
}

export default function StudentAuthExperience({
  initialMode = "login",
}: StudentAuthExperienceProps) {
  const router = useRouter();
  const prefersReducedMotion = useReducedMotion();
  const { isLoggedIn, login, signup, refresh } = useStudentAuth();

  const [mode, setMode] = useState<AuthMode>(initialMode);
  const [authChannel, setAuthChannel] = useState<"email" | "phone">("email");
  const [signupStep, setSignupStep] = useState<1 | 2 | 3>(1);
  const [justSignedUp, setJustSignedUp] = useState(false);
  const [nextPath, setNextPath] = useState<string>("/dashboard");
  const [providers, setProviders] = useState<{ googleConfigured: boolean; otpPreviewEnabled: boolean }>({
    googleConfigured: false,
    otpPreviewEnabled: false,
  });

  // Phone OTP state
  const [otpPhone, setOtpPhone] = useState("");
  const [otpCode, setOtpCode] = useState("");
  const [otpStage, setOtpStage] = useState<"phone" | "code" | "complete_profile">("phone");
  const [otpDevPreview, setOtpDevPreview] = useState<string | null>(null);
  const [verifiedPhoneToken, setVerifiedPhoneToken] = useState<string | null>(null);
  const [otpName, setOtpName] = useState("");
  const [otpGrade, setOtpGrade] = useState("Class 10");
  const [otpParentEmail, setOtpParentEmail] = useState("");
  const [isOtpBusy, setIsOtpBusy] = useState(false);

  // Sign In state
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [showLoginPassword, setShowLoginPassword] = useState(false);

  // Step 1: Account & Compulsory Contacts
  const [fullName, setFullName] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [parentEmail, setParentEmail] = useState("");
  const [parentPhone, setParentPhone] = useState("");
  const [personalPhone, setPersonalPhone] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [showSignupPassword, setShowSignupPassword] = useState(false);

  // Step 2: Class, Board, State & Childhood Dream + Sports
  const [grade, setGrade] = useState<string>("Class 10");
  const [curriculum, setCurriculum] = useState<string>("CBSE");
  const [stateVal, setStateVal] = useState<string>("Karnataka");
  const [city, setCity] = useState<string>("Bengaluru");
  const [parentDream, setParentDream] = useState<string>("");
  const [proSports, setProSports] = useState<boolean>(false);

  // Step 3: Optional Fast Personal & Academic Snapshot
  const [age, setAge] = useState<string>("15");
  const [gender, setGender] = useState<string>("");
  const [singleChild, setSingleChild] = useState<boolean | undefined>(undefined);
  const [lastYearPercentage, setLastYearPercentage] = useState("");
  const [lastYearRank, setLastYearRank] = useState("");
  const [selectedCompLevels, setSelectedCompLevels] = useState<string[]>([]);
  const [competitionNote, setCompetitionNote] = useState("");
  const [showFamilyAddress, setShowFamilyAddress] = useState(false);
  const [fatherName, setFatherName] = useState("");
  const [motherName, setMotherName] = useState("");
  const [address, setAddress] = useState("");
  const [schoolName, setSchoolName] = useState("");
  const [schoolAddress, setSchoolAddress] = useState("");

  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const markTouched = (field: string) => {
    setTouched((prev) => (prev[field] ? prev : { ...prev, [field]: true }));
  };

  // Live per-field validation evaluated on every render
  const loginEmailCheck = validateEmailField(loginEmail, true, "Student email");
  const loginPasswordMissing = !loginPassword;

  const nameCheck = validateStudentName(fullName);
  const signupEmailCheck = validateEmailField(signupEmail, true, "Student email");
  const parentEmailCheck = validateEmailField(parentEmail, true, "Parent email");
  const parentMobileCheck = validateIndianMobileField(parentPhone, true, "Parent mobile");
  const personalMobileCheck = validateIndianMobileField(personalPhone, false, "Student mobile");
  const passwordEval = evaluatePassword(signupPassword);
  const ageCheck = validateAgeField(age);
  const percentageCheck = validatePercentageField(lastYearPercentage);

  const showNameErr =
    !nameCheck.valid &&
    (Boolean(touched.signupName) || (fullName.trim().length > 0 && !/[A-Za-z]/.test(fullName)));
  const showSignupEmailErr = Boolean(touched.signupEmail) && !signupEmailCheck.valid;
  const showParentEmailErr = Boolean(touched.parentEmail) && !parentEmailCheck.valid;
  const showParentMobileErr = shouldShowMobileErrNow(
    parentPhone,
    Boolean(touched.parentPhone),
    parentMobileCheck
  );
  const showPersonalMobileErr = shouldShowMobileErrNow(
    personalPhone,
    Boolean(touched.personalPhone),
    personalMobileCheck
  );
  const showPasswordErr =
    !passwordEval.allRequiredMet && Boolean(touched.signupPassword);
  const showAgeErr = !ageCheck.valid && (Boolean(touched.age) || age.trim().length > 0);
  const showPctErr =
    !percentageCheck.valid &&
    (Boolean(touched.lastYearPercentage) || lastYearPercentage.trim().length > 0);

  const getFieldBorder = (isValid: boolean, isErr: boolean, hasContent: boolean) => {
    if (isErr) {
      return "border-[#B91C1C] focus:border-[#B91C1C] focus:ring-2 focus:ring-[#B91C1C]/15";
    }
    if (hasContent && isValid) {
      return "border-[#15803D]/40 focus:border-[#C2410C] focus:ring-2 focus:ring-[#C2410C]/15";
    }
    return "border-[#1F1B16]/[0.12] focus:border-[#C2410C] focus:ring-2 focus:ring-[#C2410C]/15";
  };

  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    const qMode = params.get("mode");
    const qNext = params.get("next");
    const qError = params.get("error");
    if (qMode === "signup" || qMode === "login") {
      setMode(qMode);
    }
    if (qNext && qNext.startsWith("/")) {
      setNextPath(qNext);
    }
    if (qError === "google_not_configured") {
      setErrorMsg("Google Sign-In is not configured on this server yet. Please use Email or Phone OTP.");
    } else if (qError?.startsWith("google_")) {
      setErrorMsg("Google Sign-In could not be completed. Please try again or use Email / Phone OTP.");
    }

    fetch("/api/auth/providers")
      .then((r) => r.json())
      .then((d) => {
        setProviders({
          googleConfigured: Boolean(d?.googleConfigured),
          otpPreviewEnabled: Boolean(d?.otpPreviewEnabled),
        });
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (isLoggedIn && !justSignedUp) {
      router.replace(nextPath || "/dashboard");
    }
  }, [isLoggedIn, justSignedUp, nextPath, router]);

  const switchMode = (nextMode: AuthMode) => {
    setMode(nextMode);
    setErrorMsg(null);
    setTouched({});
    if (nextMode === "signup") {
      setSignupStep(1);
    }
    if (typeof window !== "undefined") {
      const targetPath = nextMode === "signup" ? "/signup" : "/login";
      const nextSuffix =
        nextPath && nextPath !== "/dashboard"
          ? `?next=${encodeURIComponent(nextPath)}`
          : "";
      if (window.location.pathname + window.location.search !== `${targetPath}${nextSuffix}`) {
        window.history.replaceState(null, "", `${targetPath}${nextSuffix}`);
      }
    }
  };

  const liveInitials = useMemo(() => {
    if (!fullName.trim()) return "ST";
    return (
      fullName
        .trim()
        .split(/\s+/)
        .map((w) => w[0])
        .join("")
        .toUpperCase()
        .slice(0, 2) || "ST"
    );
  }, [fullName]);

  const handleGoogleContinue = () => {
    setErrorMsg(null);
    if (!providers.googleConfigured) {
      setErrorMsg(
        "Google Sign-In requires GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET in server environment variables. Please use Email or Phone OTP right now."
      );
      return;
    }
    window.location.href = `/api/auth/google?next=${encodeURIComponent(nextPath || "/dashboard")}`;
  };

  const otpMobileCheck = validateIndianMobileField(otpPhone, true, "Mobile number");

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setTouched((prev) => ({ ...prev, otpPhone: true }));
    if (!otpMobileCheck.valid) return;

    setIsOtpBusy(true);
    try {
      const res = await fetch("/api/auth/otp/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: otpMobileCheck.digits }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        setErrorMsg(data.error || "Could not send verification code");
      } else {
        setOtpDevPreview(data.devOtpPreview || null);
        setOtpStage("code");
      }
    } catch {
      setErrorMsg("Network error while sending OTP");
    } finally {
      setIsOtpBusy(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setIsOtpBusy(true);
    try {
      const res = await fetch("/api/auth/otp/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: otpMobileCheck.digits, otp: otpCode }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        setErrorMsg(data.error || "Invalid verification code");
      } else if (data.requiresProfile && data.verifiedPhoneToken) {
        setVerifiedPhoneToken(data.verifiedPhoneToken);
        setOtpStage("complete_profile");
      } else {
        await refresh();
        router.push(nextPath || "/dashboard");
      }
    } catch {
      setErrorMsg("Network error while verifying code");
    } finally {
      setIsOtpBusy(false);
    }
  };

  const handleCompletePhoneSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    const nCheck = validateStudentName(otpName);
    const peCheck = validateEmailField(otpParentEmail, false, "Parent email");
    if (!nCheck.valid) {
      setErrorMsg(nCheck.error || "Enter your full name");
      return;
    }
    if (!peCheck.valid) {
      setErrorMsg(peCheck.error || "Enter a valid parent email");
      return;
    }

    setIsOtpBusy(true);
    try {
      const res = await fetch("/api/auth/otp/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          verifiedPhoneToken,
          name: otpName.trim(),
          grade: otpGrade,
          parentEmail: otpParentEmail.trim() || undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        setErrorMsg(data.error || "Could not complete account setup");
      } else {
        await refresh();
        setJustSignedUp(true);
      }
    } catch {
      setErrorMsg("Network error while creating account");
    } finally {
      setIsOtpBusy(false);
    }
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setTouched((prev) => ({ ...prev, loginEmail: true, loginPassword: true }));

    if (!loginEmailCheck.valid || loginPasswordMissing) {
      const firstBadId = !loginEmailCheck.valid ? "login-email" : "login-password";
      document.getElementById(firstBadId)?.focus();
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
      router.push(nextPath || "/dashboard");
    }
  };

  const handleNextFromStep1 = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setTouched((prev) => ({
      ...prev,
      signupName: true,
      signupEmail: true,
      parentEmail: true,
      parentPhone: true,
      personalPhone: true,
      signupPassword: true,
    }));

    const firstInvalidId = !nameCheck.valid
      ? "signup-name"
      : !signupEmailCheck.valid
      ? "signup-email"
      : !parentEmailCheck.valid
      ? "signup-parent-email"
      : !parentMobileCheck.valid
      ? "signup-parent-phone"
      : !personalMobileCheck.valid
      ? "signup-personal-phone"
      : !passwordEval.allRequiredMet
      ? "signup-password"
      : null;

    if (firstInvalidId) {
      document.getElementById(firstInvalidId)?.focus();
      return;
    }

    setSignupStep(2);
  };

  const handleNextFromStep2 = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSignupStep(3);
  };

  const submitSignup = async (skipExtras: boolean) => {
    setErrorMsg(null);
    if (
      !nameCheck.valid ||
      !signupEmailCheck.valid ||
      !parentEmailCheck.valid ||
      !parentMobileCheck.valid ||
      !personalMobileCheck.valid ||
      !passwordEval.allRequiredMet
    ) {
      setSignupStep(1);
      setTouched((prev) => ({
        ...prev,
        signupName: true,
        signupEmail: true,
        parentEmail: true,
        parentPhone: true,
        personalPhone: true,
        signupPassword: true,
      }));
      return;
    }

    if (!skipExtras && (!ageCheck.valid || !percentageCheck.valid)) {
      setTouched((prev) => ({ ...prev, age: true, lastYearPercentage: true }));
      const badId = !ageCheck.valid ? "signup-age" : "signup-percentage";
      document.getElementById(badId)?.focus();
      return;
    }

    const compCombined = [selectedCompLevels.join(", "), competitionNote.trim()]
      .filter(Boolean)
      .join(" — ");

    setIsSubmitting(true);
    const res = await signup({
      name: fullName.trim(),
      email: signupEmail.trim(),
      password: signupPassword,
      parentEmail: parentEmail.trim(),
      parentPhone: parentMobileCheck.digits,
      personalPhone: personalMobileCheck.digits || undefined,
      grade,
      curriculum,
      state: stateVal,
      city: city.trim() || stateVal || "India",
      parentDream: parentDream.trim() || undefined,
      proSports,
      ...(skipExtras
        ? {}
        : {
            age: age.trim() ? Number(age) : undefined,
            gender: gender || undefined,
            singleChild,
            lastYearPercentage: lastYearPercentage.trim() || undefined,
            lastYearRank: lastYearRank.trim() || undefined,
            competitions: compCombined || undefined,
            fatherName: fatherName.trim() || undefined,
            motherName: motherName.trim() || undefined,
            address: address.trim() || undefined,
            schoolName: schoolName.trim() || undefined,
            schoolAddress: schoolAddress.trim() || undefined,
          }),
    });
    setIsSubmitting(false);

    if (!res.success) {
      setErrorMsg(res.error || "Could not create your student account");
    } else {
      setJustSignedUp(true);
    }
  };

  const toggleCompetition = (lvl: string) => {
    setSelectedCompLevels((prev) =>
      prev.includes(lvl) ? prev.filter((item) => item !== lvl) : [...prev, lvl]
    );
  };

  const adjustAge = (delta: number) => {
    const cur = Number(age) || 15;
    const next = Math.min(24, Math.max(8, cur + delta));
    setAge(String(next));
  };

  return (
    <div className="min-h-[100dvh] bg-[#F7F4EE] text-[#1F1B16] font-body selection:bg-[#C2410C] selection:text-white flex flex-col lg:grid lg:grid-cols-12">
      {/* ================================================================= */}
      {/* LEFT PANEL — DESK ILLUSTRATION & LIVE STUDENT PASS PREVIEW        */}
      {/* ================================================================= */}
      <aside className="hidden lg:flex lg:col-span-6 xl:col-span-5 bg-[#F2EEE3] border-r border-[#1F1B16]/[0.08] flex-col justify-between px-9 xl:px-12 py-8">
        <header className="flex items-center justify-between gap-4">
          <Link href="/" className="inline-flex items-center gap-2.5 group">
            <span className="size-2.5 rounded-[2px] bg-[#C2410C]" aria-hidden="true" />
            <span className="font-display text-lg font-semibold tracking-[-0.02em] text-[#1F1B16]">
              PTIROS
            </span>
            <span className="text-xs font-normal text-[#685F54] pl-2 border-l border-[#1F1B16]/[0.12]">
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

        <div className="my-auto py-5 max-w-lg">
          {mode === "login" ? (
            <motion.div
              key="left-login"
              initial={prefersReducedMotion ? false : { opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, ease: EASE_OUT }}
            >
              <div className="relative mb-6 w-full max-w-[400px]">
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

              <h1 className="font-display text-[30px] xl:text-[34px] font-medium leading-[1.15] tracking-[-0.02em] text-[#1F1B16]">
                Pick up your study plan where you left off
              </h1>
              <p className="mt-3 text-sm leading-relaxed text-[#5E554A]">
                Your career diagnostic, interactive workplace simulations, weekly study milestones, and 1-on-1 alumni mentor sessions live in one place.
              </p>

              <div className="mt-7 border-t border-[#1F1B16]/[0.08] pt-5 grid grid-cols-2 gap-x-5 gap-y-4">
                {PORTAL_INDEX.map((item) => (
                  <div key={item.code} className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[11px] tabular-nums text-[#9A3412]">
                        {item.code}
                      </span>
                      <span className="text-xs font-medium text-[#1F1B16]">{item.title}</span>
                    </div>
                    <p className="text-xs leading-snug text-[#685F54]">{item.detail}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="left-signup-live"
              initial={prefersReducedMotion ? false : { opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, ease: EASE_OUT }}
              className="space-y-5"
            >
              <div className="relative w-full max-w-[280px]">
                <img
                  src="/auth_study_stillness.webp"
                  alt="Study desk illustration"
                  width={1200}
                  height={896}
                  className="w-full h-auto block select-none"
                  style={{
                    maskImage:
                      "radial-gradient(ellipse 84% 78% at 50% 50%, #000 45%, rgba(0,0,0,0.5) 72%, transparent 98%)",
                    WebkitMaskImage:
                      "radial-gradient(ellipse 84% 78% at 50% 50%, #000 45%, rgba(0,0,0,0.5) 72%, transparent 98%)",
                  }}
                />
              </div>

              <div>
                <h1 className="font-display text-[28px] xl:text-[32px] font-medium leading-[1.15] tracking-[-0.02em] text-[#1F1B16]">
                  Your student career card builds as you tap
                </h1>
                <p className="mt-2 text-xs text-[#5E554A] leading-relaxed">
                  Only essential contacts are required right now. Sports, scores, and deeper academic details stay light and editable anytime.
                </p>
              </div>

              {/* LIVE UPDATING STUDENT CARD PREVIEW */}
              <div className="rounded-[18px] bg-[#FDFBF7] border border-[#1F1B16]/[0.09] p-5 shadow-[0_2px_10px_rgba(31,27,22,0.04)] space-y-4">
                <div className="flex items-start justify-between gap-3 pb-3.5 border-b border-[#1F1B16]/[0.07]">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="size-11 rounded-xl bg-[#1F1B16] text-white font-display font-medium text-sm flex items-center justify-center shrink-0">
                      {liveInitials}
                    </div>
                    <div className="min-w-0">
                      <div className="font-display text-base font-medium text-[#1F1B16] truncate">
                        {fullName.trim() || "Student Full Name"}
                      </div>
                      <div className="text-xs text-[#685F54] truncate">
                        {grade} · {curriculum} · {city.trim() || stateVal}
                      </div>
                    </div>
                  </div>
                  <span className="font-mono text-[11px] tabular-nums px-2 py-0.5 rounded-md bg-[#EFE9DF] text-[#5E554A] shrink-0">
                    Step {signupStep}/3
                  </span>
                </div>

                {/* Live Chips Reflecting Choices */}
                <div className="space-y-2.5">
                  <div>
                    <div className="text-[11px] text-[#685F54] mb-1">Childhood aim</div>
                    <span className="inline-flex items-center px-2.5 py-1 rounded-lg bg-[#FFF0E0] text-[#9A3412] text-xs font-medium border border-[#C2410C]/15">
                      {parentDream.trim() || "Choose an aim in Step 2"}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-3 pt-1 text-xs">
                    <div className="p-2.5 rounded-xl bg-[#F7F4EE] border border-[#1F1B16]/[0.06]">
                      <div className="text-[11px] text-[#685F54]">Family contact</div>
                      <div className="font-medium text-[#1F1B16] mt-0.5 truncate">
                        {parentEmail.trim() ? "Parent synced" : "Pending in Step 1"}
                      </div>
                    </div>
                    <div className="p-2.5 rounded-xl bg-[#F7F4EE] border border-[#1F1B16]/[0.06]">
                      <div className="text-[11px] text-[#685F54]">Pro sports</div>
                      <div className="font-medium text-[#1F1B16] mt-0.5">
                        {proSports ? "Yes, competitive" : "No / Casual"}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </div>

        <footer className="flex items-center justify-between text-xs text-[#685F54] border-t border-[#1F1B16]/[0.08] pt-4">
          <span>Classes 6–12 · NEP 2020 Ready</span>
          <Link
            href="/career-test"
            className="font-medium text-[#5E554A] hover:text-[#9A3412] transition-colors"
          >
            Explore Career Diagnostic
          </Link>
        </footer>
      </aside>

      {/* ================================================================= */}
      {/* RIGHT PANEL — CALM AUTH & INTERACTIVE 3-STEP ONBOARDING           */}
      {/* ================================================================= */}
      <main className="lg:col-span-6 xl:col-span-7 flex-1 flex flex-col justify-between px-4 py-5 sm:px-8 sm:py-8 lg:px-10 xl:px-14">
        {/* Mobile Header */}
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

        <motion.div
          initial={prefersReducedMotion ? false : { opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.32, ease: EASE_OUT }}
          className="w-full max-w-[520px] mx-auto my-auto py-4 sm:py-6"
        >
          {/* Mobile Mini Preview Banner */}
          <div className="flex lg:hidden items-center gap-3.5 mb-4 p-3 rounded-2xl bg-[#F2EEE3] border border-[#1F1B16]/[0.07]">
            <img
              src="/auth_study_stillness.webp"
              alt="PTIROS study desk illustration"
              width={120}
              height={90}
              className="w-16 h-12 object-cover rounded-lg shrink-0"
            />
            <div className="min-w-0">
              <p className="text-xs font-medium text-[#1F1B16] truncate">
                {mode === "signup" && fullName.trim()
                  ? `${fullName.trim()} · ${grade}`
                  : "Classes 6–12 Student Portal"}
              </p>
              <p className="text-[11px] text-[#685F54] mt-0.5 leading-snug truncate">
                {mode === "signup" && parentDream
                  ? `Goal: ${parentDream}`
                  : "Career diagnostic, workplace simulations & 1-on-1 mentorship"}
              </p>
            </div>
          </div>

          {/* Card Shell */}
          <div className="rounded-[20px] bg-[#FDFBF7] border border-[#1F1B16]/[0.08] p-5 sm:p-8 shadow-[0_1px_2px_rgba(31,27,22,0.04),0_12px_32px_rgba(31,27,22,0.05)]">
            {justSignedUp ? (
              <motion.div
                key="signup-complete-choice"
                initial={prefersReducedMotion ? false : { opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25, ease: EASE_OUT }}
                className="space-y-6"
              >
                <div className="flex items-start gap-3.5">
                  <div className="size-11 rounded-2xl bg-[#15803D]/10 border border-[#15803D]/20 flex items-center justify-center shrink-0 text-[#15803D]">
                    <CheckCircle2 className="size-5" strokeWidth={1.75} />
                  </div>
                  <div>
                    <span className="inline-block text-[11px] font-semibold uppercase tracking-wider text-[#15803D]">
                      Account & Student Pass Ready
                    </span>
                    <h2 className="font-display text-xl sm:text-2xl font-medium tracking-[-0.02em] text-[#1F1B16] mt-0.5">
                      Welcome, {fullName.trim().split(" ")[0] || "Explorer"}
                    </h2>
                    <p className="text-xs sm:text-sm text-[#5E554A] mt-1 leading-relaxed">
                      Your profile ({grade} • {curriculum}) is saved. Choose where you want to start right now:
                    </p>
                  </div>
                </div>

                <div className="space-y-3">
                  {nextPath && nextPath !== "/dashboard" ? (
                    <button
                      type="button"
                      onClick={() => router.push(nextPath)}
                      className="w-full p-4 rounded-2xl bg-[#C2410C] hover:bg-[#9A3412] text-white text-left transition flex items-center justify-between gap-3 shadow-sm cursor-pointer active:scale-[0.99]"
                    >
                      <div className="flex items-start gap-3 min-w-0">
                        <span className="size-9 rounded-xl bg-white/15 flex items-center justify-center shrink-0 mt-0.5">
                          <Compass className="size-4.5" strokeWidth={1.75} />
                        </span>
                        <div className="min-w-0">
                          <span className="text-sm font-semibold block">
                            View Your Saved Career Report
                          </span>
                          <p className="text-xs text-white/85 mt-0.5 leading-snug">
                            Continue directly to your saved diagnostic analysis and PDF options.
                          </p>
                        </div>
                      </div>
                      <ArrowRight className="size-4 shrink-0" strokeWidth={1.75} />
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => router.push("/career-test")}
                      className="w-full p-4 rounded-2xl bg-[#C2410C] hover:bg-[#9A3412] text-white text-left transition flex items-center justify-between gap-3 shadow-sm cursor-pointer active:scale-[0.99]"
                    >
                      <div className="flex items-start gap-3 min-w-0">
                        <span className="size-9 rounded-xl bg-white/15 flex items-center justify-center shrink-0 mt-0.5">
                          <Compass className="size-4.5" strokeWidth={1.75} />
                        </span>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-sm font-semibold">Take Career Match Test Now</span>
                            <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-white/20">
                              3–4 Min • Free Basic Report
                            </span>
                          </div>
                          <p className="text-xs text-white/85 mt-1 leading-snug">
                            Answer 8 scenario questions for your instant 4-page basic analysis &amp; downloadable PDF.
                          </p>
                        </div>
                      </div>
                      <ArrowRight className="size-4 shrink-0" strokeWidth={1.75} />
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => router.push("/dashboard")}
                    className="w-full p-4 rounded-2xl bg-white hover:bg-[#F2EEE3] border border-[#1F1B16]/[0.12] text-[#1F1B16] text-left transition flex items-center justify-between gap-3 cursor-pointer"
                  >
                    <div className="flex items-start gap-3 min-w-0">
                      <span className="size-9 rounded-xl bg-[#EFE9DF] flex items-center justify-center shrink-0 mt-0.5 text-[#5E554A]">
                        <LayoutDashboard className="size-4.5" strokeWidth={1.75} />
                      </span>
                      <div className="min-w-0">
                        <span className="text-sm font-semibold block">Open Student Portal (Main Dashboard)</span>
                        <p className="text-xs text-[#5E554A] mt-0.5 leading-snug">
                          Explore workplace simulations, study planner, journal, and mentor booking anytime.
                        </p>
                      </div>
                    </div>
                    <ArrowRight className="size-4 text-[#5E554A] shrink-0" strokeWidth={1.5} />
                  </button>
                </div>

                <div className="pt-2 border-t border-[#1F1B16]/[0.08] flex items-center gap-2 text-xs text-[#685F54]">
                  <Sparkles className="size-3.5 text-[#C2410C] shrink-0" strokeWidth={1.5} />
                  <span>Your Career Test score saves automatically to your portal once completed.</span>
                </div>
              </motion.div>
            ) : (
            <>
            {/* Segmented Mode Toggle */}
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

            {/* Card Header & Step Rail */}
            <div className="mb-5">
              <div className="flex items-center justify-between gap-2">
                <h2 className="font-display text-xl sm:text-2xl font-medium tracking-[-0.02em] text-[#1F1B16]">
                  {mode === "login"
                    ? "Sign in to your portal"
                    : signupStep === 1
                    ? "Contacts & password"
                    : signupStep === 2
                    ? "Class & childhood dream"
                    : "Quick finishing touches"}
                </h2>
                {mode === "signup" && (
                  <span className="font-mono text-xs tabular-nums text-[#685F54] shrink-0">
                    {signupStep} / 3
                  </span>
                )}
              </div>
              <p className="mt-1 text-xs sm:text-sm text-[#5E554A] leading-relaxed">
                {mode === "login"
                  ? "Enter your student email and password to open your dashboard"
                  : signupStep === 1
                  ? "Compulsory student & parent reachability so mentor bookings stay synced"
                  : signupStep === 2
                  ? "Tap options directly — no long essays needed"
                  : "Optional personal snapshot to help mentors tailor advice faster"}
              </p>

              {mode === "signup" && (
                <div className="mt-4 grid grid-cols-3 gap-2" aria-hidden="true">
                  <div className="h-1 rounded-full bg-[#C2410C]" />
                  <div
                    className={`h-1 rounded-full transition-colors duration-200 ${
                      signupStep >= 2 ? "bg-[#C2410C]" : "bg-[#1F1B16]/[0.10]"
                    }`}
                  />
                  <div
                    className={`h-1 rounded-full transition-colors duration-200 ${
                      signupStep === 3 ? "bg-[#C2410C]" : "bg-[#1F1B16]/[0.10]"
                    }`}
                  />
                </div>
              )}
            </div>

            {errorMsg && (
              <div
                role="alert"
                className="mb-4 p-3 rounded-[10px] bg-[#FEF2F2] border border-[#B91C1C]/20 flex items-start gap-2.5 text-xs text-[#991B1B]"
              >
                <AlertCircle className="size-4 shrink-0 mt-0.5 text-[#B91C1C]" strokeWidth={1.5} />
                <span className="leading-snug">{errorMsg}</span>
              </div>
            )}

            {/* Google + Email / Phone OTP Quick Switcher */}
            {(mode === "login" || signupStep === 1) && (
              <div className="mb-5 space-y-3">
                <button
                  type="button"
                  onClick={handleGoogleContinue}
                  className="w-full h-11 rounded-[10px] bg-white hover:bg-[#F7F4EE] border border-[#1F1B16]/[0.14] text-xs sm:text-sm font-medium text-[#1F1B16] transition-colors flex items-center justify-center gap-2.5 cursor-pointer shadow-[0_1px_2px_rgba(31,27,22,0.03)]"
                >
                  <svg className="size-4 shrink-0" viewBox="0 0 24 24" aria-hidden="true">
                    <path
                      fill="#4285F4"
                      d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17Z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.11-6.72-4.96H1.29v3.14C3.26 21.3 7.31 24 12 24Z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.28 14.24c-.24-.72-.38-1.49-.38-2.24s.14-1.52.38-2.24V6.62H1.29C.47 8.24 0 10.06 0 12s.47 3.76 1.29 5.38l3.99-3.14Z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.26 2.7 1.29 6.62l3.99 3.14c.95-2.85 3.6-4.96 6.72-4.96Z"
                    />
                  </svg>
                  <span>Continue with Google</span>
                </button>

                <div className="flex items-center gap-3">
                  <div className="h-px flex-1 bg-[#1F1B16]/[0.08]" />
                  <div className="inline-flex rounded-[8px] bg-[#EFE9DF] p-0.5 text-[11px] font-medium">
                    <button
                      type="button"
                      onClick={() => {
                        setErrorMsg(null);
                        setAuthChannel("email");
                      }}
                      className={`px-2.5 py-1 rounded-[6px] transition cursor-pointer ${
                        authChannel === "email"
                          ? "bg-white text-[#1F1B16] shadow-2xs"
                          : "text-[#5E554A] hover:text-[#1F1B16]"
                      }`}
                    >
                      Email
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setErrorMsg(null);
                        setAuthChannel("phone");
                        setOtpStage("phone");
                      }}
                      className={`px-2.5 py-1 rounded-[6px] transition cursor-pointer ${
                        authChannel === "phone"
                          ? "bg-white text-[#1F1B16] shadow-2xs"
                          : "text-[#5E554A] hover:text-[#1F1B16]"
                      }`}
                    >
                      Phone OTP
                    </button>
                  </div>
                  <div className="h-px flex-1 bg-[#1F1B16]/[0.08]" />
                </div>
              </div>
            )}

            <AnimatePresence mode="wait" initial={false}>
              {/* ==================== PHONE OTP FLOW ==================== */}
              {authChannel === "phone" && (mode === "login" || signupStep === 1) ? (
                <motion.div
                  key={`form-phone-${otpStage}`}
                  initial={prefersReducedMotion ? false : { opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={prefersReducedMotion ? undefined : { opacity: 0, y: -6 }}
                  transition={{ duration: 0.2, ease: EASE_OUT }}
                  className="space-y-4"
                >
                  {otpStage === "phone" && (
                    <form onSubmit={handleSendOtp} noValidate className="space-y-4">
                      <div>
                        <label htmlFor="otp-phone" className="block text-xs font-medium text-[#1F1B16] mb-1.5">
                          Mobile number (10 digits)
                        </label>
                        <div className="relative">
                          <Phone
                            className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-[#685F54] pointer-events-none"
                            strokeWidth={1.5}
                          />
                          <input
                            id="otp-phone"
                            type="tel"
                            inputMode="numeric"
                            value={otpPhone}
                            onChange={(e) => setOtpPhone(e.target.value)}
                            onBlur={() => markTouched("otpPhone")}
                            placeholder="98765 43210"
                            className={`w-full h-11 pl-10 pr-4 rounded-[10px] bg-white border text-sm text-[#1F1B16] placeholder:text-[#7B7266] focus:outline-none ${getFieldBorder(
                              otpMobileCheck.valid,
                              Boolean(touched.otpPhone && !otpMobileCheck.valid),
                              otpPhone.trim().length > 0
                            )}`}
                          />
                        </div>
                        {touched.otpPhone && !otpMobileCheck.valid && (
                          <p className="mt-1 text-[11px] text-[#B91C1C]" role="alert">
                            {otpMobileCheck.error}
                          </p>
                        )}
                      </div>

                      <button
                        type="submit"
                        disabled={isOtpBusy}
                        className="w-full h-11 rounded-[10px] bg-[#C2410C] hover:bg-[#9A3412] text-white font-medium text-sm transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
                      >
                        {isOtpBusy ? <Loader2 className="size-4 animate-spin" /> : null}
                        <span>Send 6-Digit OTP</span>
                        <ArrowRight className="size-4" strokeWidth={1.5} />
                      </button>
                    </form>
                  )}

                  {otpStage === "code" && (
                    <form onSubmit={handleVerifyOtp} className="space-y-4">
                      <div className="p-3 rounded-[10px] bg-[#F2EEE3] border border-[#1F1B16]/[0.08] text-xs text-[#1F1B16]">
                        Code sent to <strong>+91 {otpMobileCheck.digits}</strong>.{" "}
                        <button
                          type="button"
                          onClick={() => {
                            setOtpStage("phone");
                            setOtpCode("");
                          }}
                          className="underline text-[#9A3412] font-medium cursor-pointer"
                        >
                          Change number
                        </button>
                        {otpDevPreview && (
                          <div className="mt-1.5 font-mono text-[11px] text-[#15803D]">
                            Preview OTP code: <strong>{otpDevPreview}</strong>
                          </div>
                        )}
                      </div>

                      <div>
                        <label htmlFor="otp-code" className="block text-xs font-medium text-[#1F1B16] mb-1.5">
                          Enter 6-digit verification code
                        </label>
                        <input
                          id="otp-code"
                          type="text"
                          inputMode="numeric"
                          maxLength={6}
                          value={otpCode}
                          onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                          placeholder="000000"
                          className="w-full h-11 px-4 rounded-[10px] bg-white border border-[#1F1B16]/[0.14] text-center font-mono text-base tracking-[0.35em] text-[#1F1B16] focus:outline-none focus:border-[#C2410C]"
                        />
                      </div>

                      <button
                        type="submit"
                        disabled={isOtpBusy || otpCode.length < 6}
                        className="w-full h-11 rounded-[10px] bg-[#C2410C] hover:bg-[#9A3412] text-white font-medium text-sm transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
                      >
                        {isOtpBusy ? <Loader2 className="size-4 animate-spin" /> : null}
                        <span>Verify &amp; Continue</span>
                        <ArrowRight className="size-4" strokeWidth={1.5} />
                      </button>
                    </form>
                  )}

                  {otpStage === "complete_profile" && (
                    <form onSubmit={handleCompletePhoneSignup} className="space-y-3.5">
                      <p className="text-xs text-[#5E554A]">
                        Verified <strong>+91 {otpMobileCheck.digits}</strong>. Add your name and class to create your student pass:
                      </p>
                      <div>
                        <label className="block text-xs font-medium text-[#1F1B16] mb-1">
                          Student full name *
                        </label>
                        <input
                          type="text"
                          value={otpName}
                          onChange={(e) => setOtpName(e.target.value)}
                          placeholder="e.g. Aarav Sharma"
                          className="w-full h-11 px-3.5 rounded-[10px] bg-white border border-[#1F1B16]/[0.14] text-sm"
                        />
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-medium text-[#1F1B16] mb-1">
                            Current class *
                          </label>
                          <select
                            value={otpGrade}
                            onChange={(e) => setOtpGrade(e.target.value)}
                            className="w-full h-11 px-3 rounded-[10px] bg-white border border-[#1F1B16]/[0.14] text-sm"
                          >
                            {STUDENT_GRADES.map((g) => (
                              <option key={g.value} value={g.value}>
                                {g.label}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-[#1F1B16] mb-1">
                            Parent email (optional)
                          </label>
                          <input
                            type="email"
                            value={otpParentEmail}
                            onChange={(e) => setOtpParentEmail(e.target.value)}
                            placeholder="parent@example.com"
                            className="w-full h-11 px-3.5 rounded-[10px] bg-white border border-[#1F1B16]/[0.14] text-sm"
                          />
                        </div>
                      </div>
                      <button
                        type="submit"
                        disabled={isOtpBusy}
                        className="w-full h-11 rounded-[10px] bg-[#C2410C] hover:bg-[#9A3412] text-white font-medium text-sm transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
                      >
                        {isOtpBusy ? <Loader2 className="size-4 animate-spin" /> : null}
                        <span>Create Student Account →</span>
                      </button>
                    </form>
                  )}
                </motion.div>
              ) : mode === "login" ? (
                <motion.form
                  key="form-login"
                  noValidate
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
                        autoComplete="email"
                        value={loginEmail}
                        onChange={(e) => setLoginEmail(e.target.value)}
                        onBlur={() => markTouched("loginEmail")}
                        aria-invalid={Boolean(touched.loginEmail && !loginEmailCheck.valid)}
                        placeholder="student@example.com"
                        className={`w-full h-11 pl-10 pr-10 rounded-[10px] bg-white border text-sm text-[#1F1B16] placeholder:text-[#7B7266] transition-colors focus:outline-none ${getFieldBorder(
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
                        autoComplete="current-password"
                        value={loginPassword}
                        onChange={(e) => setLoginPassword(e.target.value)}
                        onBlur={() => markTouched("loginPassword")}
                        aria-invalid={Boolean(touched.loginPassword && loginPasswordMissing)}
                        placeholder="Enter your password"
                        className={`w-full h-11 pl-10 pr-11 rounded-[10px] bg-white border text-sm text-[#1F1B16] placeholder:text-[#7B7266] transition-colors focus:outline-none ${getFieldBorder(
                          !loginPasswordMissing,
                          Boolean(touched.loginPassword && loginPasswordMissing),
                          loginPassword.length > 0
                        )}`}
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
                    {touched.loginPassword && loginPasswordMissing && (
                      <p className="mt-1 text-[11px] text-[#B91C1C]" role="alert">
                        Enter your account password
                      </p>
                    )}
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
                /* ==================== SIGN UP STEP 1 ==================== */
                <motion.form
                  key="form-signup-step1"
                  noValidate
                  initial={prefersReducedMotion ? false : { opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={prefersReducedMotion ? undefined : { opacity: 0, x: -8 }}
                  transition={{ duration: 0.2, ease: EASE_OUT }}
                  onSubmit={handleNextFromStep1}
                  className="space-y-3.5"
                >
                  <div>
                    <label
                      htmlFor="signup-name"
                      className="block text-xs font-medium text-[#1F1B16] mb-1"
                    >
                      Student full name *
                    </label>
                    <div className="relative">
                      <User
                        className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-[#685F54] pointer-events-none"
                        strokeWidth={1.5}
                      />
                      <input
                        id="signup-name"
                        type="text"
                        autoComplete="name"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        onBlur={() => markTouched("signupName")}
                        aria-invalid={showNameErr}
                        placeholder="Student full name"
                        className={`w-full h-11 pl-10 pr-10 rounded-[10px] bg-white border text-sm text-[#1F1B16] placeholder:text-[#7B7266] focus:outline-none ${getFieldBorder(
                          nameCheck.valid,
                          showNameErr,
                          fullName.trim().length > 0
                        )}`}
                      />
                      {fullName.trim().length > 0 && nameCheck.valid && (
                        <Check className="absolute right-3.5 top-1/2 -translate-y-1/2 size-4 text-[#15803D]" strokeWidth={2} />
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
                      <div className="flex items-center justify-between mb-1">
                        <label
                          htmlFor="signup-email"
                          className="text-xs font-medium text-[#1F1B16]"
                        >
                          Student email *
                        </label>
                        <span className="text-[10px] text-[#9A3412] font-medium">Required</span>
                      </div>
                      <div className="relative">
                        <Mail
                          className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-[#685F54] pointer-events-none"
                          strokeWidth={1.5}
                        />
                        <input
                          id="signup-email"
                          type="email"
                          autoComplete="email"
                          value={signupEmail}
                          onChange={(e) => setSignupEmail(e.target.value)}
                          onBlur={() => markTouched("signupEmail")}
                          aria-invalid={showSignupEmailErr}
                          placeholder="student@example.com"
                          className={`w-full h-11 pl-10 pr-8 rounded-[10px] bg-white border text-sm text-[#1F1B16] placeholder:text-[#7B7266] focus:outline-none ${getFieldBorder(
                            signupEmailCheck.valid,
                            showSignupEmailErr,
                            signupEmail.trim().length > 0
                          )}`}
                        />
                        {signupEmail.trim().length > 0 && signupEmailCheck.valid && (
                          <Check className="absolute right-3 top-1/2 -translate-y-1/2 size-3.5 text-[#15803D]" strokeWidth={2} />
                        )}
                      </div>
                      {showSignupEmailErr && (
                        <p className="mt-1 text-[11px] text-[#B91C1C]" role="alert">
                          {signupEmailCheck.error}
                        </p>
                      )}
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label
                          htmlFor="signup-parent-email"
                          className="text-xs font-medium text-[#1F1B16]"
                        >
                          Parent email *
                        </label>
                        <span className="text-[10px] text-[#9A3412] font-medium">Required</span>
                      </div>
                      <div className="relative">
                        <Mail
                          className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-[#685F54] pointer-events-none"
                          strokeWidth={1.5}
                        />
                        <input
                          id="signup-parent-email"
                          type="email"
                          value={parentEmail}
                          onChange={(e) => setParentEmail(e.target.value)}
                          onBlur={() => markTouched("parentEmail")}
                          aria-invalid={showParentEmailErr}
                          placeholder="parent@example.com"
                          className={`w-full h-11 pl-10 pr-8 rounded-[10px] bg-white border text-sm text-[#1F1B16] placeholder:text-[#7B7266] focus:outline-none ${getFieldBorder(
                            parentEmailCheck.valid,
                            showParentEmailErr,
                            parentEmail.trim().length > 0
                          )}`}
                        />
                        {parentEmail.trim().length > 0 && parentEmailCheck.valid && (
                          <Check className="absolute right-3 top-1/2 -translate-y-1/2 size-3.5 text-[#15803D]" strokeWidth={2} />
                        )}
                      </div>
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
                        <label
                          htmlFor="signup-parent-phone"
                          className="text-xs font-medium text-[#1F1B16]"
                        >
                          Parent mobile *
                        </label>
                        <span
                          className={`text-[10px] font-mono tabular-nums ${
                            parentMobileCheck.valid
                              ? "text-[#15803D] font-semibold"
                              : showParentMobileErr
                              ? "text-[#B91C1C]"
                              : "text-[#685F54]"
                          }`}
                        >
                          {parentMobileCheck.valid
                            ? "10/10 valid"
                            : parentMobileCheck.digits.length > 0
                            ? `${parentMobileCheck.digits.length}/10`
                            : "Required"}
                        </span>
                      </div>
                      <div className="relative">
                        <Phone
                          className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-[#685F54] pointer-events-none"
                          strokeWidth={1.5}
                        />
                        <input
                          id="signup-parent-phone"
                          type="tel"
                          inputMode="numeric"
                          value={parentPhone}
                          onChange={(e) => setParentPhone(e.target.value)}
                          onBlur={() => markTouched("parentPhone")}
                          aria-invalid={showParentMobileErr}
                          placeholder="10-digit mobile"
                          className={`w-full h-11 pl-10 pr-8 rounded-[10px] bg-white border text-sm text-[#1F1B16] placeholder:text-[#7B7266] focus:outline-none ${getFieldBorder(
                            parentMobileCheck.valid,
                            showParentMobileErr,
                            parentPhone.trim().length > 0
                          )}`}
                        />
                        {parentMobileCheck.valid && (
                          <Check className="absolute right-3 top-1/2 -translate-y-1/2 size-3.5 text-[#15803D]" strokeWidth={2} />
                        )}
                      </div>
                      {showParentMobileErr && (
                        <p className="mt-1 text-[11px] text-[#B91C1C]" role="alert">
                          {parentMobileCheck.error}
                        </p>
                      )}
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label
                          htmlFor="signup-personal-phone"
                          className="text-xs font-medium text-[#1F1B16]"
                        >
                          Student mobile
                        </label>
                        <span
                          className={`text-[10px] font-mono tabular-nums ${
                            personalPhone.trim() && personalMobileCheck.valid
                              ? "text-[#15803D] font-semibold"
                              : showPersonalMobileErr
                              ? "text-[#B91C1C]"
                              : "text-[#685F54]"
                          }`}
                        >
                          {personalPhone.trim() && personalMobileCheck.valid
                            ? "10/10 valid"
                            : personalMobileCheck.digits.length > 0
                            ? `${personalMobileCheck.digits.length}/10`
                            : "Optional"}
                        </span>
                      </div>
                      <div className="relative">
                        <Phone
                          className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-[#685F54] pointer-events-none"
                          strokeWidth={1.5}
                        />
                        <input
                          id="signup-personal-phone"
                          type="tel"
                          inputMode="numeric"
                          value={personalPhone}
                          onChange={(e) => setPersonalPhone(e.target.value)}
                          onBlur={() => markTouched("personalPhone")}
                          aria-invalid={showPersonalMobileErr}
                          placeholder="Optional personal no."
                          className={`w-full h-11 pl-10 pr-8 rounded-[10px] bg-white border text-sm text-[#1F1B16] placeholder:text-[#7B7266] focus:outline-none ${getFieldBorder(
                            personalMobileCheck.valid,
                            showPersonalMobileErr,
                            personalPhone.trim().length > 0
                          )}`}
                        />
                        {personalPhone.trim().length > 0 && personalMobileCheck.valid && (
                          <Check className="absolute right-3 top-1/2 -translate-y-1/2 size-3.5 text-[#15803D]" strokeWidth={2} />
                        )}
                      </div>
                      {showPersonalMobileErr && (
                        <p className="mt-1 text-[11px] text-[#B91C1C]" role="alert">
                          {personalMobileCheck.error}
                        </p>
                      )}
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label
                        htmlFor="signup-password"
                        className="text-xs font-medium text-[#1F1B16]"
                      >
                        Create password *
                      </label>
                      <span
                        className={`text-[11px] font-medium tabular-nums transition-colors ${
                          passwordEval.allRequiredMet ? "text-[#15803D]" : "text-[#685F54]"
                        }`}
                      >
                        {passwordEval.allRequiredMet ? "All rules met" : "Required"}
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
                        autoComplete="new-password"
                        value={signupPassword}
                        onChange={(e) => setSignupPassword(e.target.value)}
                        onBlur={() => markTouched("signupPassword")}
                        aria-invalid={showPasswordErr}
                        placeholder="Create a strong password"
                        className={`w-full h-11 pl-10 pr-11 rounded-[10px] bg-white border text-sm text-[#1F1B16] placeholder:text-[#7B7266] focus:outline-none ${getFieldBorder(
                          passwordEval.allRequiredMet,
                          showPasswordErr,
                          signupPassword.length > 0
                        )}`}
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
                    <PasswordRulesChecklist password={signupPassword} showError={showPasswordErr} />
                  </div>

                  <button
                    type="submit"
                    className="w-full h-11 mt-1 rounded-[10px] bg-[#1F1B16] hover:bg-[#342E26] text-white font-medium text-sm transition-[background-color,transform] active:scale-[0.985] flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>Next: Class & dream</span>
                    <ArrowRight className="size-4" strokeWidth={1.5} />
                  </button>

                  <div className="pt-3 border-t border-[#1F1B16]/[0.08] flex items-center justify-between text-xs">
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
              ) : signupStep === 2 ? (
                /* ==================== SIGN UP STEP 2 ==================== */
                <motion.form
                  key="form-signup-step2"
                  initial={prefersReducedMotion ? false : { opacity: 0, x: 8 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={prefersReducedMotion ? undefined : { opacity: 0, x: -8 }}
                  transition={{ duration: 0.2, ease: EASE_OUT }}
                  onSubmit={handleNextFromStep2}
                  className="space-y-4"
                >
                  {/* Step 2: 1-Tap Class Grid */}
                  <div>
                    <span className="block text-xs font-medium text-[#1F1B16] mb-2">
                      Which class are you in?
                    </span>
                    <div className="grid grid-cols-4 gap-1.5">
                      {STUDENT_GRADES.map((g) => {
                        const selected = grade === g.value;
                        return (
                          <button
                            key={g.value}
                            type="button"
                            onClick={() => setGrade(g.value)}
                            className={`h-9 px-1.5 rounded-[8px] text-[11px] font-medium border transition-colors cursor-pointer ${
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

                  {/* Board Chips */}
                  <div>
                    <span className="block text-xs font-medium text-[#1F1B16] mb-2">
                      School board
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {SCHOOL_BOARDS.map((board) => {
                        const active = curriculum === board;
                        return (
                          <button
                            key={board}
                            type="button"
                            onClick={() => setCurriculum(board)}
                            className={`h-8 px-3 rounded-[8px] text-xs font-medium border transition-colors cursor-pointer ${
                              active
                                ? "bg-[#C2410C] text-white border-[#C2410C]"
                                : "bg-white text-[#5E554A] border-[#1F1B16]/[0.12] hover:text-[#1F1B16]"
                            }`}
                          >
                            {board}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* State & City */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label
                        htmlFor="signup-state"
                        className="block text-xs font-medium text-[#1F1B16] mb-1"
                      >
                        State
                      </label>
                      <div className="relative">
                        <select
                          id="signup-state"
                          value={stateVal}
                          onChange={(e) => setStateVal(e.target.value)}
                          className="w-full h-11 pl-3.5 pr-9 rounded-[10px] bg-white border border-[#1F1B16]/[0.12] text-sm text-[#1F1B16] appearance-none focus:outline-none focus:border-[#C2410C] cursor-pointer"
                        >
                          {INDIAN_STATES.map((st) => (
                            <option key={st} value={st}>
                              {st}
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
                        className="block text-xs font-medium text-[#1F1B16] mb-1"
                      >
                        City
                      </label>
                      <input
                        id="signup-city"
                        type="text"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        placeholder="e.g. Bengaluru"
                        className="w-full h-11 px-3.5 rounded-[10px] bg-white border border-[#1F1B16]/[0.12] text-sm text-[#1F1B16] placeholder:text-[#7B7266] focus:outline-none focus:border-[#C2410C]"
                      />
                    </div>
                  </div>

                  {/* Interactive 1-Tap Childhood Aim Picker */}
                  <div className="space-y-2">
                    <span className="block text-xs font-medium text-[#1F1B16]">
                      Childhood dream or target field
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {DREAM_PRESETS.map((preset) => {
                        const active = parentDream === preset;
                        return (
                          <button
                            key={preset}
                            type="button"
                            onClick={() => setParentDream(preset)}
                            className={`px-2.5 py-1.5 rounded-[8px] text-[11px] font-medium border transition-colors cursor-pointer ${
                              active
                                ? "bg-[#FFF0E0] text-[#9A3412] border-[#C2410C]/40"
                                : "bg-white text-[#5E554A] border-[#1F1B16]/[0.12] hover:text-[#1F1B16]"
                            }`}
                          >
                            {preset}
                          </button>
                        );
                      })}
                    </div>
                    <input
                      id="signup-dream"
                      type="text"
                      value={parentDream}
                      onChange={(e) => setParentDream(e.target.value)}
                      placeholder="Or type your own childhood aim"
                      className="w-full h-10 px-3.5 rounded-[10px] bg-white border border-[#1F1B16]/[0.12] text-xs text-[#1F1B16] placeholder:text-[#7B7266] focus:outline-none focus:border-[#C2410C]"
                    />
                  </div>

                  {/* Pro Sports Quick Yes / No */}
                  <div>
                    <span className="block text-xs font-medium text-[#1F1B16] mb-1.5">
                      Do you take sports education professionally?
                    </span>
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        { val: true, label: "Yes — Pro / Academy" },
                        { val: false, label: "No — Casual / Fun" },
                      ].map((opt) => (
                        <button
                          key={String(opt.val)}
                          type="button"
                          onClick={() => setProSports(opt.val)}
                          className={`h-9 px-3 rounded-[8px] text-xs font-medium border transition-colors cursor-pointer ${
                            proSports === opt.val
                              ? "bg-[#1F1B16] text-white border-[#1F1B16]"
                              : "bg-white text-[#5E554A] border-[#1F1B16]/[0.12] hover:text-[#1F1B16]"
                          }`}
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center gap-3 pt-1">
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
                      className="flex-1 h-11 rounded-[10px] bg-[#1F1B16] hover:bg-[#342E26] text-white font-medium text-sm transition-[background-color,transform] active:scale-[0.985] flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <span>Last quick check</span>
                      <ArrowRight className="size-4" strokeWidth={1.5} />
                    </button>
                  </div>
                </motion.form>
              ) : (
                /* ==================== SIGN UP STEP 3 ==================== */
                <motion.form
                  key="form-signup-step3"
                  noValidate
                  initial={prefersReducedMotion ? false : { opacity: 0, x: 8 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={prefersReducedMotion ? undefined : { opacity: 0, x: 8 }}
                  transition={{ duration: 0.2, ease: EASE_OUT }}
                  onSubmit={(e) => {
                    e.preventDefault();
                    submitSignup(false);
                  }}
                  className="space-y-4"
                >
                  {/* Quick Visual Row: Age Stepper + Single Child + Gender */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <span className="block text-xs font-medium text-[#1F1B16] mb-1.5">
                        Age
                      </span>
                      <div
                        className={`flex items-center h-10 rounded-[10px] bg-white border overflow-hidden ${getFieldBorder(
                          ageCheck.valid,
                          showAgeErr,
                          age.trim().length > 0
                        )}`}
                      >
                        <button
                          type="button"
                          onClick={() => adjustAge(-1)}
                          className="h-full px-3 text-[#5E554A] hover:bg-[#EFE9DF]/70 cursor-pointer"
                          aria-label="Decrease age"
                        >
                          <Minus className="size-3.5" />
                        </button>
                        <input
                          id="signup-age"
                          type="number"
                          value={age}
                          onChange={(e) => setAge(e.target.value)}
                          onBlur={() => markTouched("age")}
                          aria-invalid={showAgeErr}
                          className="w-full text-center text-sm font-medium text-[#1F1B16] focus:outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none"
                        />
                        <button
                          type="button"
                          onClick={() => adjustAge(1)}
                          className="h-full px-3 text-[#5E554A] hover:bg-[#EFE9DF]/70 cursor-pointer"
                          aria-label="Increase age"
                        >
                          <Plus className="size-3.5" />
                        </button>
                      </div>
                      {showAgeErr && (
                        <p className="mt-1 text-[11px] text-[#B91C1C]" role="alert">
                          {ageCheck.error}
                        </p>
                      )}
                    </div>

                    <div>
                      <span className="block text-xs font-medium text-[#1F1B16] mb-1.5">
                        Single child?
                      </span>
                      <div className="grid grid-cols-2 gap-1.5">
                        {[
                          { val: true, label: "Yes" },
                          { val: false, label: "Have siblings" },
                        ].map((opt) => (
                          <button
                            key={String(opt.val)}
                            type="button"
                            onClick={() => setSingleChild(opt.val)}
                            className={`h-10 px-2 rounded-[8px] text-xs font-medium border transition-colors cursor-pointer ${
                              singleChild === opt.val
                                ? "bg-[#1F1B16] text-white border-[#1F1B16]"
                                : "bg-white text-[#5E554A] border-[#1F1B16]/[0.12] hover:text-[#1F1B16]"
                            }`}
                          >
                            {opt.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Gender 1-tap Pills */}
                  <div>
                    <span className="block text-xs font-medium text-[#1F1B16] mb-1.5">
                      Sex / Gender
                    </span>
                    <div className="grid grid-cols-3 gap-1.5">
                      {GENDER_OPTIONS.map((gOpt) => (
                        <button
                          key={gOpt}
                          type="button"
                          onClick={() => setGender(gOpt)}
                          className={`h-9 px-2 rounded-[8px] text-xs font-medium border transition-colors cursor-pointer truncate ${
                            gender === gOpt
                              ? "bg-[#1F1B16] text-white border-[#1F1B16]"
                              : "bg-white text-[#5E554A] border-[#1F1B16]/[0.12] hover:text-[#1F1B16]"
                          }`}
                        >
                          {gOpt === "Prefer not to say" ? "Other" : gOpt}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Last Year % & Rank */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label
                        htmlFor="signup-percentage"
                        className="block text-xs font-medium text-[#1F1B16] mb-1"
                      >
                        Last year %
                      </label>
                      <input
                        id="signup-percentage"
                        type="text"
                        value={lastYearPercentage}
                        onChange={(e) => setLastYearPercentage(e.target.value)}
                        onBlur={() => markTouched("lastYearPercentage")}
                        aria-invalid={showPctErr}
                        placeholder="e.g. 89%"
                        className={`w-full h-10 px-3 rounded-[10px] bg-white border text-xs text-[#1F1B16] focus:outline-none ${getFieldBorder(
                          percentageCheck.valid,
                          showPctErr,
                          lastYearPercentage.trim().length > 0
                        )}`}
                      />
                      {showPctErr && (
                        <p className="mt-1 text-[11px] text-[#B91C1C]" role="alert">
                          {percentageCheck.error}
                        </p>
                      )}
                    </div>
                    <div>
                      <label
                        htmlFor="signup-rank"
                        className="block text-xs font-medium text-[#1F1B16] mb-1"
                      >
                        Score card / class rank
                      </label>
                      <input
                        id="signup-rank"
                        type="text"
                        value={lastYearRank}
                        onChange={(e) => setLastYearRank(e.target.value)}
                        placeholder="e.g. Top 5 or A1"
                        className="w-full h-10 px-3 rounded-[10px] bg-white border border-[#1F1B16]/[0.12] text-xs text-[#1F1B16] focus:outline-none focus:border-[#C2410C]"
                      />
                    </div>
                  </div>

                  {/* Competitions */}
                  <div className="space-y-2">
                    <span className="block text-xs font-medium text-[#1F1B16]">
                      Participated in competitions?
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {COMPETITION_LEVELS.map((lvl) => {
                        const active = selectedCompLevels.includes(lvl);
                        return (
                          <button
                            key={lvl}
                            type="button"
                            onClick={() => toggleCompetition(lvl)}
                            className={`h-8 px-3 rounded-[8px] text-xs font-medium border transition-colors cursor-pointer ${
                              active
                                ? "bg-[#C2410C] text-white border-[#C2410C]"
                                : "bg-white text-[#5E554A] border-[#1F1B16]/[0.12] hover:text-[#1F1B16]"
                            }`}
                          >
                            {lvl}
                          </button>
                        );
                      })}
                    </div>
                    <input
                      type="text"
                      value={competitionNote}
                      onChange={(e) => setCompetitionNote(e.target.value)}
                      placeholder="Competition names or Olympiad details (optional)"
                      className="w-full h-10 px-3 rounded-[10px] bg-white border border-[#1F1B16]/[0.12] text-xs text-[#1F1B16] focus:outline-none focus:border-[#C2410C]"
                    />
                  </div>

                  {/* Collapsible Father, Mother, Address & School Details */}
                  <div className="pt-1">
                    <button
                      type="button"
                      onClick={() => setShowFamilyAddress((v) => !v)}
                      className="inline-flex items-center gap-1.5 text-xs font-medium text-[#5E554A] hover:text-[#1F1B16] transition-colors cursor-pointer"
                    >
                      <ChevronDown
                        className={`size-3.5 transition-transform duration-150 ${
                          showFamilyAddress ? "rotate-180" : ""
                        }`}
                        strokeWidth={1.5}
                      />
                      <span>Add father, mother, school & home address (or fill later)</span>
                    </button>

                    {showFamilyAddress && (
                      <div className="mt-3 space-y-3 pt-3 border-t border-[#1F1B16]/[0.08]">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <input
                            type="text"
                            value={fatherName}
                            onChange={(e) => setFatherName(e.target.value)}
                            placeholder="Father's full name"
                            className="w-full h-10 px-3 rounded-[10px] bg-white border border-[#1F1B16]/[0.12] text-xs text-[#1F1B16] focus:outline-none focus:border-[#C2410C]"
                          />
                          <input
                            type="text"
                            value={motherName}
                            onChange={(e) => setMotherName(e.target.value)}
                            placeholder="Mother's full name"
                            className="w-full h-10 px-3 rounded-[10px] bg-white border border-[#1F1B16]/[0.12] text-xs text-[#1F1B16] focus:outline-none focus:border-[#C2410C]"
                          />
                        </div>
                        <div className="relative">
                          <MapPin
                            className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-[#685F54]"
                            strokeWidth={1.5}
                          />
                          <input
                            type="text"
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            placeholder="Home street address"
                            className="w-full h-10 pl-8 pr-3 rounded-[10px] bg-white border border-[#1F1B16]/[0.12] text-xs text-[#1F1B16] focus:outline-none focus:border-[#C2410C]"
                          />
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div className="relative">
                            <Building
                              className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-[#685F54]"
                              strokeWidth={1.5}
                            />
                            <input
                              type="text"
                              value={schoolName}
                              onChange={(e) => setSchoolName(e.target.value)}
                              placeholder="School name"
                              className="w-full h-10 pl-8 pr-3 rounded-[10px] bg-white border border-[#1F1B16]/[0.12] text-xs text-[#1F1B16] focus:outline-none focus:border-[#C2410C]"
                            />
                          </div>
                          <input
                            type="text"
                            value={schoolAddress}
                            onChange={(e) => setSchoolAddress(e.target.value)}
                            placeholder="School address / locality"
                            className="w-full h-10 px-3 rounded-[10px] bg-white border border-[#1F1B16]/[0.12] text-xs text-[#1F1B16] focus:outline-none focus:border-[#C2410C]"
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Step 3 Action Stack with Skip Escape Hatch */}
                  <div className="space-y-2.5 pt-2">
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => {
                          setErrorMsg(null);
                          setSignupStep(2);
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
                            <span>Complete & open portal</span>
                            <ArrowRight className="size-4" strokeWidth={1.5} />
                          </>
                        )}
                      </button>
                    </div>

                    <button
                      type="button"
                      disabled={isSubmitting}
                      onClick={() => submitSignup(true)}
                      className="w-full text-center text-xs font-medium text-[#685F54] hover:text-[#1F1B16] py-1 transition-colors cursor-pointer"
                    >
                      Skip optional Step 3 extras and enter portal now
                    </button>
                  </div>
                </motion.form>
              )}
            </AnimatePresence>
            </>
            )}
          </div>
        </motion.div>

        <div className="text-left sm:text-center pr-20 sm:pr-0 text-xs text-[#685F54] pt-2 pb-1">
          APAAR registration can be added in your dashboard at a later stage
        </div>
      </main>
    </div>
  );
}
