"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  CheckCircle2,
  User,
  GraduationCap,
  Trophy,
  ShieldCheck,
  Mail,
  Phone,
  MapPin,
  Sparkles,
  Loader2,
  Minus,
  Plus,
} from "lucide-react";
import { useStudentAuth } from "@/context/StudentAuthContext";
import {
  STUDENT_GRADES,
  SCHOOL_BOARDS,
  GENDER_OPTIONS,
  INDIAN_STATES,
  DREAM_PRESETS,
  COMPETITION_LEVELS,
  getProfileCompleteness,
} from "@/lib/studentProfileOptions";
import {
  validateStudentName,
  validateEmailField,
  validateIndianMobileField,
  validateAgeField,
  validatePercentageField,
} from "@/lib/formValidation";

type DetailsFilter = "all" | "personal" | "academic" | "sports" | "apaar";

export default function StudentDetailsSection() {
  const { user, updateProfile } = useStudentAuth();
  const [filter, setFilter] = useState<DetailsFilter>("all");
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<{ type: "ok" | "err"; text: string } | null>(null);
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const markTouched = (k: string) => setTouched((prev) => (prev[k] ? prev : { ...prev, [k]: true }));

  // Personal form state
  const [name, setName] = useState("");
  const [age, setAge] = useState<string>("");
  const [gender, setGender] = useState<string>("");
  const [singleChild, setSingleChild] = useState<boolean | undefined>(undefined);
  const [fatherName, setFatherName] = useState("");
  const [motherName, setMotherName] = useState("");
  const [address, setAddress] = useState("");
  const [personalPhone, setPersonalPhone] = useState("");
  const [parentPhone, setParentPhone] = useState("");
  const [parentEmail, setParentEmail] = useState("");

  // Academic form state
  const [grade, setGrade] = useState("Class 10");
  const [curriculum, setCurriculum] = useState("CBSE");
  const [stateVal, setStateVal] = useState("");
  const [city, setCity] = useState("");
  const [schoolName, setSchoolName] = useState("");
  const [schoolAddress, setSchoolAddress] = useState("");
  const [parentDream, setParentDream] = useState("");
  const [lastYearPercentage, setLastYearPercentage] = useState("");
  const [lastYearRank, setLastYearRank] = useState("");

  // Sports, Competitions & APAR state
  const [proSports, setProSports] = useState<boolean | undefined>(undefined);
  const [selectedCompLevels, setSelectedCompLevels] = useState<string[]>([]);
  const [competitionNote, setCompetitionNote] = useState("");
  const [aparId, setAparId] = useState("");

  useEffect(() => {
    if (!user) return;
    setName(user.name || "");
    setAge(user.age ? String(user.age) : "");
    setGender(user.gender || "");
    setSingleChild(user.singleChild);
    setFatherName(user.fatherName || "");
    setMotherName(user.motherName || "");
    setAddress(user.address || "");
    setPersonalPhone(user.personalPhone || "");
    setParentPhone(user.parentPhone || "");
    setParentEmail(user.parentEmail || "");

    setGrade(user.grade || "Class 10");
    setCurriculum(user.curriculum || "CBSE");
    setStateVal(user.state || "");
    setCity(user.city || "");
    setSchoolName(user.schoolName || "");
    setSchoolAddress(user.schoolAddress || "");
    setParentDream(user.parentDream || "");
    setLastYearPercentage(user.lastYearPercentage || "");
    setLastYearRank(user.lastYearRank || "");

    setProSports(user.proSports);
    const rawComp = user.competitions || "";
    const matchedLevels = COMPETITION_LEVELS.filter((lvl) =>
      rawComp.toLowerCase().includes(lvl.toLowerCase())
    );
    setSelectedCompLevels([...matchedLevels]);
    // Extract note portion after ' — ' if present
    const sepIdx = rawComp.indexOf(" — ");
    if (sepIdx !== -1) {
      setCompetitionNote(rawComp.slice(sepIdx + 3));
    } else if (matchedLevels.length === 0) {
      setCompetitionNote(rawComp);
    } else {
      setCompetitionNote("");
    }
    setAparId(user.aparId || "");
  }, [user]);

  const draftPreview = useMemo(() => {
    const compCombined = [selectedCompLevels.join(", "), competitionNote.trim()]
      .filter(Boolean)
      .join(" — ");
    return getProfileCompleteness({
      ...(user || {}),
      name,
      age: age ? Number(age) : undefined,
      gender,
      singleChild,
      fatherName,
      motherName,
      address,
      personalPhone,
      parentPhone,
      email: user?.email || "",
      parentEmail,
      grade,
      curriculum,
      state: stateVal,
      city,
      schoolName,
      schoolAddress,
      parentDream,
      lastYearPercentage,
      lastYearRank,
      proSports,
      competitions: compCombined,
    });
  }, [
    user,
    name,
    age,
    gender,
    singleChild,
    fatherName,
    motherName,
    address,
    personalPhone,
    parentPhone,
    parentEmail,
    grade,
    curriculum,
    stateVal,
    city,
    schoolName,
    schoolAddress,
    parentDream,
    lastYearPercentage,
    lastYearRank,
    proSports,
    selectedCompLevels,
    competitionNote,
  ]);

  if (!user) return null;

  const toggleCompetitionLevel = (lvl: string) => {
    setSelectedCompLevels((prev) =>
      prev.includes(lvl) ? prev.filter((item) => item !== lvl) : [...prev, lvl]
    );
  };

  const adjustAge = (delta: number) => {
    const current = age ? Number(age) : 15;
    const next = Math.min(24, Math.max(8, (Number.isNaN(current) ? 15 : current) + delta));
    setAge(String(next));
  };

  const nameCheck = validateStudentName(name);
  const ageCheck = validateAgeField(age);
  const parentEmailCheck = validateEmailField(parentEmail, true, "Parent email");
  const parentMobileCheck = validateIndianMobileField(parentPhone, true, "Parent mobile");
  const personalMobileCheck = validateIndianMobileField(personalPhone, false, "Personal mobile");
  const pctCheck = validatePercentageField(lastYearPercentage);

  const immediatePhoneBad = (raw: string, chk: ReturnType<typeof validateIndianMobileField>) => {
    if (chk.valid) return false;
    const t = raw.trim();
    return /[A-Za-z]/.test(t) || chk.digits.length > 10 || (chk.digits.length > 0 && !/^[6-9]/.test(chk.digits));
  };

  const showNameErr = !nameCheck.valid && (Boolean(touched.name) || (name.trim().length > 0 && !/[A-Za-z]/.test(name)));
  const showAgeErr = !ageCheck.valid && (Boolean(touched.age) || age.trim().length > 0);
  const showParentEmailErr = Boolean(touched.parentEmail) && !parentEmailCheck.valid;
  const showParentMobileErr = !parentMobileCheck.valid && (Boolean(touched.parentPhone) || immediatePhoneBad(parentPhone, parentMobileCheck));
  const showPersonalMobileErr = !personalMobileCheck.valid && (Boolean(touched.personalPhone) || immediatePhoneBad(personalPhone, personalMobileCheck));
  const showPctErr = !pctCheck.valid && (Boolean(touched.lastYearPercentage) || lastYearPercentage.trim().length > 0);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaveMessage(null);
    setTouched({
      name: true,
      age: true,
      parentEmail: true,
      parentPhone: true,
      personalPhone: true,
      lastYearPercentage: true,
    });

    if (
      !nameCheck.valid ||
      !ageCheck.valid ||
      !parentEmailCheck.valid ||
      !parentMobileCheck.valid ||
      !personalMobileCheck.valid ||
      !pctCheck.valid
    ) {
      setSaveMessage({ type: "err", text: "Fix the highlighted fields above before saving." });
      return;
    }

    setIsSaving(true);

    const compCombined = [selectedCompLevels.join(", "), competitionNote.trim()]
      .filter(Boolean)
      .join(" — ");

    const res = await updateProfile({
      name: name.trim(),
      age: age.trim() ? Number(age) : undefined,
      gender: gender || undefined,
      singleChild,
      fatherName: fatherName.trim() || undefined,
      motherName: motherName.trim() || undefined,
      address: address.trim() || undefined,
      personalPhone: personalMobileCheck.digits || undefined,
      parentPhone: parentMobileCheck.digits,
      parentEmail: parentEmail.trim(),
      grade,
      curriculum,
      state: stateVal || undefined,
      city: city.trim() || user.city,
      schoolName: schoolName.trim() || undefined,
      schoolAddress: schoolAddress.trim() || undefined,
      parentDream: parentDream.trim() || undefined,
      lastYearPercentage: lastYearPercentage.trim() || undefined,
      lastYearRank: lastYearRank.trim() || undefined,
      proSports,
      competitions: compCombined || undefined,
      aparId: aparId.trim() || undefined,
    });

    setIsSaving(false);
    if (res.success) {
      setSaveMessage({ type: "ok", text: "Student profile details saved cleanly." });
    } else {
      setSaveMessage({ type: "err", text: res.error || "Could not save details. Check fields above." });
    }
  };

  const showSection = (sec: Exclude<DetailsFilter, "all">) => filter === "all" || filter === sec;

  return (
    <div className="space-y-6">
      {/* Header Progress & Filter Bar */}
      <div className="rounded-2xl sm:rounded-3xl bg-white border border-stone-200/80 p-5 sm:p-7 shadow-xs space-y-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-orange-100 px-2.5 py-0.5 text-[11px] font-bold text-orange-800">
                <User className="size-3" />
                My Student Dossier
              </span>
              <span className="text-xs font-mono font-bold text-stone-500">
                {draftPreview.completedCount}/{draftPreview.totalCount} saved ({draftPreview.percent}%)
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-display font-bold text-stone-900">
              Personal, Family & Academic Details
            </h2>
            <p className="text-xs sm:text-sm text-stone-500 max-w-2xl">
              Tap options quickly or update marks, parent contacts, and achievements anytime. Mentors use this profile before your 1:1 session.
            </p>
          </div>

          {/* Compact Progress Bar */}
          <div className="w-full md:w-64 shrink-0 space-y-1.5 bg-stone-50 p-3.5 rounded-2xl border border-stone-200/70">
            <div className="flex items-center justify-between text-xs font-semibold text-stone-700">
              <span>Profile Completeness</span>
              <span className="font-mono text-orange-700">{draftPreview.percent}%</span>
            </div>
            <div className="w-full h-2 rounded-full bg-stone-200 overflow-hidden">
              <div
                className="h-full bg-orange-600 transition-all duration-300"
                style={{ width: `${draftPreview.percent}%` }}
              />
            </div>
            {draftPreview.missingFields.length > 0 ? (
              <p className="text-[11px] text-stone-500 truncate">
                Next to add: {draftPreview.missingFields[0].label}
              </p>
            ) : (
              <p className="text-[11px] text-emerald-700 font-semibold">
                All core personal & academic fields complete
              </p>
            )}
          </div>
        </div>

        {/* Section Filter Pills */}
        <div className="flex flex-wrap gap-2 pt-1 border-t border-stone-100">
          {[
            { id: "all", label: "All Sections" },
            { id: "personal", label: "Personal & Family" },
            { id: "academic", label: "Academic & Dream" },
            { id: "sports", label: "Sports & Competitions" },
            { id: "apaar", label: "APAAR (Later Stage)" },
          ].map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setFilter(item.id as DetailsFilter)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                filter === item.id
                  ? "bg-stone-900 text-white"
                  : "bg-stone-100 text-stone-600 hover:bg-stone-200 hover:text-stone-900"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Feedback Banner */}
      {saveMessage && (
        <div
          role="status"
          className={`rounded-2xl p-4 border text-xs sm:text-sm font-semibold flex items-center gap-2.5 ${
            saveMessage.type === "ok"
              ? "bg-emerald-50 border-emerald-200 text-emerald-800"
              : "bg-red-50 border-red-200 text-red-700"
          }`}
        >
          <CheckCircle2 className="size-4 shrink-0" />
          <span>{saveMessage.text}</span>
        </div>
      )}

      <form noValidate onSubmit={handleSave} className="space-y-6">
        {/* ============================================================ */}
        {/* (a) PERSONAL & FAMILY DETAILS                                */}
        {/* ============================================================ */}
        {showSection("personal") && (
          <section className="rounded-2xl sm:rounded-3xl bg-white border border-stone-200/80 p-5 sm:p-7 shadow-xs space-y-5">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <div>
                <h3 className="text-base sm:text-lg font-display font-bold text-stone-900 flex items-center gap-2">
                  <User className="size-4 text-orange-600" />
                  <span>Personal & Family Details</span>
                </h3>
                <p className="text-xs text-stone-500 mt-0.5">
                  Student Email, Parent Email, and Parent Mobile are compulsory; personal mobile stays optional.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Student Name */}
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1.5">
                  Full Name <span className="text-orange-600">*</span>
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  onBlur={() => markTouched("name")}
                  aria-invalid={showNameErr}
                  className={`w-full h-11 px-3.5 rounded-xl border text-sm focus:outline-none focus:ring-2 ${
                    showNameErr
                      ? "border-red-500 focus:ring-red-500/20 focus:border-red-500"
                      : "border-stone-200 focus:ring-orange-500/20 focus:border-orange-500"
                  }`}
                />
                {showNameErr && (
                  <p className="mt-1 text-[11px] text-red-600" role="alert">
                    {nameCheck.error}
                  </p>
                )}
              </div>

              {/* Age Quick Stepper */}
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1.5">
                  Age (Years)
                </label>
                <div
                  className={`flex items-center h-11 rounded-xl border bg-white overflow-hidden ${
                    showAgeErr ? "border-red-500" : "border-stone-200"
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => adjustAge(-1)}
                    className="h-full px-3.5 text-stone-600 hover:bg-stone-100 transition cursor-pointer"
                    aria-label="Decrease age"
                  >
                    <Minus className="size-4" />
                  </button>
                  <input
                    type="number"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    onBlur={() => markTouched("age")}
                    aria-invalid={showAgeErr}
                    placeholder="e.g. 15"
                    className="w-full text-center text-sm font-semibold text-stone-900 focus:outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none"
                  />
                  <button
                    type="button"
                    onClick={() => adjustAge(1)}
                    className="h-full px-3.5 text-stone-600 hover:bg-stone-100 transition cursor-pointer"
                    aria-label="Increase age"
                  >
                    <Plus className="size-4" />
                  </button>
                </div>
                {showAgeErr && (
                  <p className="mt-1 text-[11px] text-red-600" role="alert">
                    {ageCheck.error}
                  </p>
                )}
              </div>

              {/* Sex / Gender Chips */}
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1.5">
                  Sex / Gender
                </label>
                <div className="grid grid-cols-3 gap-1.5">
                  {GENDER_OPTIONS.map((gOpt) => (
                    <button
                      key={gOpt}
                      type="button"
                      onClick={() => setGender(gOpt)}
                      className={`h-11 px-2 rounded-xl border text-xs font-bold transition cursor-pointer truncate ${
                        gender === gOpt
                          ? "bg-stone-900 text-white border-stone-900"
                          : "bg-stone-50 text-stone-600 border-stone-200 hover:bg-stone-100"
                      }`}
                    >
                      {gOpt === "Prefer not to say" ? "Other" : gOpt}
                    </button>
                  ))}
                </div>
              </div>

              {/* Single Child Toggle */}
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1.5">
                  Single Child?
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { val: true, label: "Yes, single child" },
                    { val: false, label: "No, have siblings" },
                  ].map((opt) => (
                    <button
                      key={String(opt.val)}
                      type="button"
                      onClick={() => setSingleChild(opt.val)}
                      className={`h-11 px-3 rounded-xl border text-xs font-bold transition cursor-pointer ${
                        singleChild === opt.val
                          ? "bg-stone-900 text-white border-stone-900"
                          : "bg-stone-50 text-stone-600 border-stone-200 hover:bg-stone-100"
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Father's Name */}
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1.5">
                  Father&apos;s Name
                </label>
                <input
                  type="text"
                  value={fatherName}
                  onChange={(e) => setFatherName(e.target.value)}
                  placeholder="Father's full name"
                  className="w-full h-11 px-3.5 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                />
              </div>

              {/* Mother's Name */}
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1.5">
                  Mother&apos;s Name
                </label>
                <input
                  type="text"
                  value={motherName}
                  onChange={(e) => setMotherName(e.target.value)}
                  placeholder="Mother's full name"
                  className="w-full h-11 px-3.5 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                />
              </div>
            </div>

            {/* Contact Group: Compulsory vs Optional explicitly marked */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-stone-100">
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold text-stone-700">
                    Email ID (Personal)
                  </label>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-orange-100 text-orange-800">
                    Compulsory · Login ID
                  </span>
                </div>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-stone-400" />
                  <input
                    type="email"
                    value={user.email}
                    disabled
                    className="w-full h-11 pl-10 pr-3.5 rounded-xl border border-stone-200 bg-stone-50 text-sm text-stone-500"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold text-stone-700">
                    Email ID (Parent) <span className="text-orange-600">*</span>
                  </label>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-orange-100 text-orange-800">
                    Compulsory
                  </span>
                </div>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-stone-400" />
                  <input
                    type="email"
                    value={parentEmail}
                    onChange={(e) => setParentEmail(e.target.value)}
                    onBlur={() => markTouched("parentEmail")}
                    aria-invalid={showParentEmailErr}
                    placeholder="parent@example.com"
                    className={`w-full h-11 pl-10 pr-3.5 rounded-xl border text-sm focus:outline-none focus:ring-2 ${
                      showParentEmailErr
                        ? "border-red-500 focus:ring-red-500/20 focus:border-red-500"
                        : "border-stone-200 focus:ring-orange-500/20 focus:border-orange-500"
                    }`}
                  />
                </div>
                {showParentEmailErr && (
                  <p className="mt-1 text-[11px] text-red-600" role="alert">
                    {parentEmailCheck.error}
                  </p>
                )}
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold text-stone-700">
                    Mobile No (Parent) <span className="text-orange-600">*</span>
                  </label>
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-orange-100 text-orange-800">
                    {parentMobileCheck.valid ? "10/10 · Compulsory" : `${parentMobileCheck.digits.length}/10 · Compulsory`}
                  </span>
                </div>
                <div className="relative">
                  <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-stone-400" />
                  <input
                    type="tel"
                    inputMode="numeric"
                    value={parentPhone}
                    onChange={(e) => setParentPhone(e.target.value)}
                    onBlur={() => markTouched("parentPhone")}
                    aria-invalid={showParentMobileErr}
                    placeholder="10-digit parent mobile"
                    className={`w-full h-11 pl-10 pr-3.5 rounded-xl border text-sm focus:outline-none focus:ring-2 ${
                      showParentMobileErr
                        ? "border-red-500 focus:ring-red-500/20 focus:border-red-500"
                        : "border-stone-200 focus:ring-orange-500/20 focus:border-orange-500"
                    }`}
                  />
                </div>
                {showParentMobileErr && (
                  <p className="mt-1 text-[11px] text-red-600" role="alert">
                    {parentMobileCheck.error}
                  </p>
                )}
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold text-stone-700">
                    Mobile No (Personal)
                  </label>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-stone-100 text-stone-500">
                    {personalPhone.trim() ? `${personalMobileCheck.digits.length}/10 · Optional` : "Optional"}
                  </span>
                </div>
                <div className="relative">
                  <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-stone-400" />
                  <input
                    type="tel"
                    inputMode="numeric"
                    value={personalPhone}
                    onChange={(e) => setPersonalPhone(e.target.value)}
                    onBlur={() => markTouched("personalPhone")}
                    aria-invalid={showPersonalMobileErr}
                    placeholder="10-digit student mobile (optional)"
                    className={`w-full h-11 pl-10 pr-3.5 rounded-xl border text-sm focus:outline-none focus:ring-2 ${
                      showPersonalMobileErr
                        ? "border-red-500 focus:ring-red-500/20 focus:border-red-500"
                        : "border-stone-200 focus:ring-orange-500/20 focus:border-orange-500"
                    }`}
                  />
                </div>
                {showPersonalMobileErr && (
                  <p className="mt-1 text-[11px] text-red-600" role="alert">
                    {personalMobileCheck.error}
                  </p>
                )}
              </div>
            </div>

            {/* Residential Address */}
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1.5">
                Home Address
              </label>
              <div className="relative">
                <MapPin className="absolute left-3.5 top-3.5 size-4 text-stone-400" />
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="House/street locality and pin code"
                  className="w-full h-11 pl-10 pr-3.5 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                />
              </div>
            </div>
          </section>
        )}

        {/* ============================================================ */}
        {/* (b) ACADEMIC & DREAM PROFILE                                 */}
        {/* ============================================================ */}
        {showSection("academic") && (
          <section className="rounded-2xl sm:rounded-3xl bg-white border border-stone-200/80 p-5 sm:p-7 shadow-xs space-y-5">
            <div className="border-b border-stone-100 pb-3">
              <h3 className="text-base sm:text-lg font-display font-bold text-stone-900 flex items-center gap-2">
                <GraduationCap className="size-4 text-orange-600" />
                <span>Academic Details & Childhood Aim</span>
              </h3>
              <p className="text-xs text-stone-500 mt-0.5">
                Used to match roadmaps, board milestones, and career simulator tracks.
              </p>
            </div>

            {/* Class 1-tap Pills */}
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-2">
                Class
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2">
                {STUDENT_GRADES.map((g) => (
                  <button
                    key={g.value}
                    type="button"
                    onClick={() => setGrade(g.value)}
                    className={`h-10 px-2.5 rounded-xl border text-xs font-bold transition cursor-pointer ${
                      grade === g.value
                        ? "bg-stone-900 text-white border-stone-900"
                        : "bg-stone-50 text-stone-600 border-stone-200 hover:bg-stone-100"
                    }`}
                  >
                    {g.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Board 1-tap Pills */}
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-2">
                Board
              </label>
              <div className="flex flex-wrap gap-2">
                {SCHOOL_BOARDS.map((b) => (
                  <button
                    key={b}
                    type="button"
                    onClick={() => setCurriculum(b)}
                    className={`h-9 px-3.5 rounded-xl border text-xs font-bold transition cursor-pointer ${
                      curriculum === b
                        ? "bg-orange-600 text-white border-orange-600"
                        : "bg-stone-50 text-stone-600 border-stone-200 hover:bg-stone-100"
                    }`}
                  >
                    {b}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1.5">
                  State
                </label>
                <select
                  value={stateVal}
                  onChange={(e) => setStateVal(e.target.value)}
                  className="w-full h-11 px-3.5 rounded-xl border border-stone-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                >
                  <option value="">Select State</option>
                  {INDIAN_STATES.map((st) => (
                    <option key={st} value={st}>
                      {st}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1.5">
                  City
                </label>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="e.g. Bengaluru"
                  className="w-full h-11 px-3.5 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1.5">
                  School Name
                </label>
                <input
                  type="text"
                  value={schoolName}
                  onChange={(e) => setSchoolName(e.target.value)}
                  placeholder="Your school name"
                  className="w-full h-11 px-3.5 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                />
              </div>

              <div className="sm:col-span-2 lg:col-span-3">
                <label className="block text-xs font-bold text-stone-700 mb-1.5">
                  School Address
                </label>
                <input
                  type="text"
                  value={schoolAddress}
                  onChange={(e) => setSchoolAddress(e.target.value)}
                  placeholder="School campus locality and city"
                  className="w-full h-11 px-3.5 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                />
              </div>
            </div>

            {/* Childhood Dream Picker + Custom */}
            <div className="space-y-2.5 pt-2 border-t border-stone-100">
              <label className="block text-xs font-bold text-stone-700">
                Aim / Dream as a Child
              </label>
              <div className="flex flex-wrap gap-2">
                {DREAM_PRESETS.map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => setParentDream(preset)}
                    className={`px-3 py-1.5 rounded-xl border text-xs font-semibold transition cursor-pointer ${
                      parentDream === preset
                        ? "bg-orange-100 border-orange-400 text-orange-900"
                        : "bg-stone-50 border-stone-200 text-stone-600 hover:bg-stone-100"
                    }`}
                  >
                    {preset}
                  </button>
                ))}
              </div>
              <input
                type="text"
                value={parentDream}
                onChange={(e) => setParentDream(e.target.value)}
                placeholder="Or describe your own childhood aim or career dream"
                className="w-full h-11 px-3.5 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
              />
            </div>

            {/* Last Year Score Card / Percentage / Rank */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-stone-100">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1.5">
                  Percentage of Last Year
                </label>
                <input
                  type="text"
                  value={lastYearPercentage}
                  onChange={(e) => setLastYearPercentage(e.target.value)}
                  onBlur={() => markTouched("lastYearPercentage")}
                  aria-invalid={showPctErr}
                  placeholder="e.g. 88.4%"
                  className={`w-full h-11 px-3.5 rounded-xl border text-sm focus:outline-none focus:ring-2 ${
                    showPctErr
                      ? "border-red-500 focus:ring-red-500/20 focus:border-red-500"
                      : "border-stone-200 focus:ring-orange-500/20 focus:border-orange-500"
                  }`}
                />
                {showPctErr && (
                  <p className="mt-1 text-[11px] text-red-600" role="alert">
                    {pctCheck.error}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1.5">
                  Last Year Score Card / Rank in Class
                </label>
                <input
                  type="text"
                  value={lastYearRank}
                  onChange={(e) => setLastYearRank(e.target.value)}
                  placeholder="e.g. Rank 4 in Class or A1 in Math & Science"
                  className="w-full h-11 px-3.5 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                />
              </div>
            </div>
          </section>
        )}

        {/* ============================================================ */}
        {/* (c) SPORTS & COMPETITIONS                                    */}
        {/* ============================================================ */}
        {showSection("sports") && (
          <section className="rounded-2xl sm:rounded-3xl bg-white border border-stone-200/80 p-5 sm:p-7 shadow-xs space-y-5">
            <div className="border-b border-stone-100 pb-3">
              <h3 className="text-base sm:text-lg font-display font-bold text-stone-900 flex items-center gap-2">
                <Trophy className="size-4 text-orange-600" />
                <span>Sports Education & Competitions</span>
              </h3>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-2">
                Do you pursue sports education professionally?
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setProSports(true)}
                  className={`p-3.5 rounded-2xl border text-left transition cursor-pointer ${
                    proSports === true
                      ? "bg-stone-900 text-white border-stone-900"
                      : "bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100"
                  }`}
                >
                  <div className="text-xs font-bold">Yes — Professional / Academy Training</div>
                  <div className={`text-[11px] mt-0.5 ${proSports === true ? "text-stone-300" : "text-stone-500"}`}>
                    Regular coaching, competitive calendar, or athlete pathway
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setProSports(false)}
                  className={`p-3.5 rounded-2xl border text-left transition cursor-pointer ${
                    proSports === false
                      ? "bg-stone-900 text-white border-stone-900"
                      : "bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100"
                  }`}
                >
                  <div className="text-xs font-bold">No — Recreational Only</div>
                  <div className={`text-[11px] mt-0.5 ${proSports === false ? "text-stone-300" : "text-stone-500"}`}>
                    School games or casual fitness without academy focus
                  </div>
                </button>
              </div>
            </div>

            <div className="space-y-2.5 pt-2 border-t border-stone-100">
              <label className="block text-xs font-bold text-stone-700">
                Participated in any State / Interschool / National level competition?
              </label>
              <div className="flex flex-wrap gap-2">
                {COMPETITION_LEVELS.map((lvl) => {
                  const active = selectedCompLevels.includes(lvl);
                  return (
                    <button
                      key={lvl}
                      type="button"
                      onClick={() => toggleCompetitionLevel(lvl)}
                      className={`px-3.5 py-2 rounded-xl border text-xs font-bold transition cursor-pointer ${
                        active
                          ? "bg-orange-600 text-white border-orange-600"
                          : "bg-stone-50 text-stone-600 border-stone-200 hover:bg-stone-100"
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
                placeholder="Which event, Olympiad, debate, or sport? (e.g. SOF Science Olympiad, Zonal Badminton)"
                className="w-full h-11 px-3.5 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
              />
            </div>
          </section>
        )}

        {/* ============================================================ */}
        {/* (d) APAAR (LATER STAGE)                                      */}
        {/* ============================================================ */}
        {showSection("apaar") && (
          <section className="rounded-2xl sm:rounded-3xl bg-stone-50 border border-stone-200/80 p-5 sm:p-6 space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <ShieldCheck className="size-4 text-stone-600" />
                <h3 className="text-sm font-display font-bold text-stone-900">
                  APAAR ID (Academic Bank of Credits)
                </h3>
              </div>
              <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-white border border-stone-200 text-stone-600">
                Later Stage · Optional
              </span>
            </div>
            <p className="text-xs text-stone-500 leading-relaxed">
              Verified national APAAR integration happens in a later stage. You can leave this blank now or store your 12-digit APAAR ID ahead of time.
            </p>
            <input
              type="text"
              value={aparId}
              onChange={(e) => setAparId(e.target.value)}
              placeholder="12-digit APAAR ID (optional)"
              className="w-full max-w-md h-11 px-3.5 rounded-xl border border-stone-200 bg-white text-sm font-mono focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
            />
          </section>
        )}

        {/* Sticky Save Footer */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2">
          <span className="text-xs text-stone-500 flex items-center gap-1.5">
            <Sparkles className="size-3.5 text-orange-600" />
            Changes sync immediately to your PTIROS account in Neon Postgres
          </span>
          <button
            type="submit"
            disabled={isSaving}
            className="h-11 px-6 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-sm shadow-sm transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
          >
            {isSaving ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                <span>Saving Details...</span>
              </>
            ) : (
              <span>Save Student Details</span>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
