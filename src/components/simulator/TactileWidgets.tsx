"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sliders,
  AlertTriangle,
  CheckCircle2,
  Activity,
  Heart,
  ShieldAlert,
  ShieldCheck,
  Smartphone,
  Eye,
  Volume2,
  TrendingUp,
  Percent,
  Play,
  Flame,
  Check,
  X,
  RotateCcw,
  Zap,
  Info,
  DollarSign,
  Maximize2,
} from "lucide-react";

/* ────────────────────────────────────────────────────────────
   1. AI & ROBOTICS: Sensor Fusion & Confidence Threshold Lab
   ──────────────────────────────────────────────────────────── */
export function RoboticsTactileWidget({ onSolved }: { onSolved?: () => void }) {
  const [filterThreshold, setFilterThreshold] = useState<number>(35);
  const [resetStaleBuffer, setResetStaleBuffer] = useState<boolean>(false);

  // Solved when threshold is between 70-85% AND resetStaleBuffer is checked
  const isOptimal = filterThreshold >= 70 && filterThreshold <= 90 && resetStaleBuffer;
  const isGhostObstacle = !resetStaleBuffer || filterThreshold < 60;

  return (
    <div className="overflow-hidden rounded-3xl border border-indigo-900/60 bg-[#0E0E18] text-gray-200 shadow-xl">
      {/* Terminal Title Bar */}
      <div className="flex items-center justify-between border-b border-indigo-950 bg-[#141424] px-4 py-3 text-xs font-mono">
        <div className="flex items-center gap-2">
          <span className="h-3 w-3 rounded-full bg-red-500/80" />
          <span className="h-3 w-3 rounded-full bg-yellow-500/80" />
          <span className="h-3 w-3 rounded-full bg-emerald-500/80" />
          <span className="ml-2 font-bold text-indigo-300">ROS2 Telemetry • Obstacle Fusion Node</span>
        </div>
        <span className="rounded-full bg-indigo-500/20 px-2.5 py-0.5 text-[10px] font-semibold text-indigo-300">
          Live Sensor Canvas
        </span>
      </div>

      <div className="p-5 space-y-5 font-mono text-xs">
        {/* 2D Corridor Visualizer */}
        <div className="relative h-36 w-full rounded-2xl border border-indigo-950 bg-[#080811] p-3 flex flex-col justify-between overflow-hidden">
          {/* Warehouse Aisle Grid Lines */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f293d0f_1px,transparent_1px),linear-gradient(to_bottom,#1f293d0f_1px,transparent_1px)] bg-[size:16px_16px]" />

          <div className="relative z-10 flex items-center justify-between text-[11px] text-gray-400">
            <span>Fulfilment Corridor Aisle-04</span>
            <span className={isGhostObstacle ? "text-amber-400 font-bold" : "text-emerald-400 font-bold"}>
              {isGhostObstacle ? "⚠️ Obstacle Detected (HALTED)" : "✅ Path Clear (DRIVING)"}
            </span>
          </div>

          {/* Robot & Obstacle Visual Track */}
          <div className="relative z-10 flex items-center justify-between px-6 py-2">
            {/* Robot Node */}
            <div className="flex flex-col items-center gap-1">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-lg shadow-indigo-500/30">
                🤖
              </div>
              <span className="text-[10px] text-indigo-300 font-bold">Bot #402</span>
            </div>

            {/* Path Connection Line */}
            <div className="relative flex-1 mx-4 h-1.5 rounded-full overflow-hidden bg-gray-800">
              <div
                className={`h-full transition-all duration-500 ${
                  isGhostObstacle ? "w-1/2 bg-amber-500" : "w-full bg-emerald-500 shadow-[0_0_12px_#10B981]"
                }`}
              />
            </div>

            {/* Obstacle Target Node */}
            <div className="flex flex-col items-center gap-1">
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-xl border text-sm transition-all duration-300 ${
                  isGhostObstacle
                    ? "border-red-500/60 bg-red-950/40 text-red-400 animate-pulse"
                    : "border-gray-800 bg-gray-900/60 text-gray-600"
                }`}
              >
                {isGhostObstacle ? "🛑" : "🟢"}
              </div>
              <span className="text-[10px] text-gray-500 font-bold">
                {isGhostObstacle ? "Ghost Obstacle" : "Target Waypoint"}
              </span>
            </div>
          </div>

          {/* Telemetry Readout */}
          <div className="relative z-10 flex items-center justify-between text-[10px] text-gray-400 border-t border-indigo-950/80 pt-2">
            <span>Ultrasonic: 0.84m (Clear)</span>
            <span>LiDAR Stale Buffer: {resetStaleBuffer ? "CLEARED" : "STALE (240ms lag)"}</span>
            <span>Confidence: {filterThreshold}%</span>
          </div>
        </div>

        {/* Interactive Controls */}
        <div className="rounded-2xl border border-indigo-900/40 bg-indigo-950/20 p-4 space-y-4">
          <div className="flex items-center justify-between">
            <label className="font-semibold text-indigo-200 flex items-center gap-2">
              <Sliders className="h-4 w-4 text-indigo-400" />
              <span>Kalman Filter Confidence Weighting:</span>
            </label>
            <span className="rounded-lg bg-indigo-900/40 px-2.5 py-1 text-xs font-bold text-indigo-300">
              {filterThreshold}%
            </span>
          </div>

          <input
            type="range"
            min="20"
            max="100"
            value={filterThreshold}
            onChange={(e) => setFilterThreshold(Number(e.target.value))}
            className="w-full accent-indigo-500 cursor-pointer h-2 bg-indigo-950 rounded-lg"
          />

          <div className="flex items-center justify-between pt-1">
            <button
              onClick={() => setResetStaleBuffer(!resetStaleBuffer)}
              className={`flex items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-bold transition-all cursor-pointer ${
                resetStaleBuffer
                  ? "bg-emerald-600 text-white shadow-md shadow-emerald-500/20"
                  : "bg-indigo-900/40 border border-indigo-700/60 text-indigo-200 hover:bg-indigo-900/70"
              }`}
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span>{resetStaleBuffer ? "Buffer Flush Active" : "Flush Stale LiDAR Cache"}</span>
            </button>

            <span className="text-[11px] text-gray-400">
              Optimal Tuning: 70–85% + Cache Flush
            </span>
          </div>
        </div>

        {/* Dynamic Verification Output */}
        <div
          className={`rounded-2xl p-3.5 border transition-all duration-300 ${
            isOptimal
              ? "bg-emerald-950/40 border-emerald-500/50 text-emerald-200"
              : "bg-amber-950/30 border-amber-500/40 text-amber-200"
          }`}
        >
          <div className="flex items-center gap-2 font-bold mb-1">
            {isOptimal ? (
              <>
                <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                <span>Sensor Fusion Calibrated: Ghost Obstacle Cleared!</span>
              </>
            ) : (
              <>
                <AlertTriangle className="h-4 w-4 text-amber-400" />
                <span>Diagnostic Stalled: Stale LiDAR packet is generating false obstacle triggers.</span>
              </>
            )}
          </div>
          <p className="text-[11px] leading-relaxed text-gray-300">
            {isOptimal
              ? "Autonomous pathfinding node recalculated trajectory. Warehouse robot fleet resuming sorting at 2.4 m/s velocity."
              : "Adjust the confidence threshold above 70% and flush the stale buffer cache to verify the path."}
          </p>
        </div>
      </div>
    </div>
  );
}

/* ────────────────────────────────────────────────────────────
   2. CORPORATE LAW: Interactive SPA Contract Redliner
   ──────────────────────────────────────────────────────────── */
export function LawTactileWidget({ onSolved }: { onSolved?: () => void }) {
  const [redlines, setRedlines] = useState<{ [key: string]: boolean }>({
    clause14: false, // 8-year non-compete
    clause15: false, // uncapped indemnity
  });

  const toggleRedline = (clause: string) => {
    setRedlines((prev) => ({ ...prev, [clause]: !prev[clause] }));
  };

  const protectionScore = useMemo(() => {
    let score = 30;
    if (redlines.clause14) score += 35;
    if (redlines.clause15) score += 35;
    return score;
  }, [redlines]);

  return (
    <div className="overflow-hidden rounded-3xl border border-sky-200/80 bg-white shadow-xl">
      {/* Legal Header Bar */}
      <div className="flex items-center justify-between border-b border-sky-100 bg-sky-50/60 px-5 py-3 text-xs">
        <div className="flex items-center gap-2">
          <ShieldAlert className="h-4 w-4 text-sky-700" />
          <span className="font-display font-bold text-sky-950">
            Share Purchase Agreement (SPA) • Redline Markup Studio
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-semibold text-gray-500">Founder Protection:</span>
          <span
            className={`font-display text-xs font-black px-2.5 py-0.5 rounded-full ${
              protectionScore >= 90
                ? "bg-emerald-100 text-emerald-800"
                : "bg-amber-100 text-amber-800"
            }`}
          >
            {protectionScore}% Safe
          </span>
        </div>
      </div>

      <div className="p-5 sm:p-6 space-y-4">
        <p className="text-xs text-gray-500">
          Click the problematic highlighted clauses below to apply corporate law redlines and protect the founders:
        </p>

        {/* Clause 14: Non-Compete */}
        <button
          type="button"
          role="button"
          aria-pressed={redlines.clause14}
          onClick={() => toggleRedline("clause14")}
          className={`group w-full text-left cursor-pointer rounded-2xl border p-4 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-orange-500/40 ${
            redlines.clause14
              ? "bg-emerald-50/60 border-emerald-300 ring-1 ring-emerald-400"
              : "bg-rose-50/60 border-rose-300 hover:border-rose-400"
          }`}
        >
          <div className="flex items-center justify-between mb-1.5">
            <span className="font-bold text-xs uppercase tracking-wider text-gray-700">
              Clause 14.2: Restrictive Trade Covenant
            </span>
            <span
              className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                redlines.clause14 ? "bg-emerald-200 text-emerald-800" : "bg-rose-200 text-rose-800"
              }`}
            >
              {redlines.clause14 ? "✓ REDLINED & STRUCK OUT" : "⚠️ UNENFORCEABLE RESTRICTION"}
            </span>
          </div>

          <p
            className={`text-xs sm:text-sm leading-relaxed font-serif ${
              redlines.clause14 ? "line-through text-gray-400" : "text-gray-900"
            }`}
          >
            &quot;The Founders undertake that for a period of{" "}
            <span className="bg-rose-200/60 px-1 font-bold">8 (eight) years from Closing Date</span>, they shall
            not directly or indirectly engage in, advise, or invest in any business activity related to software
            across the <span className="bg-rose-200/60 px-1 font-bold">entire territory of India</span>.&quot;
          </p>

          {redlines.clause14 && (
            <div className="mt-2 text-[11px] font-medium text-emerald-800 flex items-center gap-1.5">
              <Check className="h-3.5 w-3.5 text-emerald-600" />
              <span>
                Struck out under Section 27 (Indian Contract Act). Counter-proposed 18 months in direct competitive domain.
              </span>
            </div>
          )}
        </button>

        {/* Clause 15: Indemnity Cap */}
        <button
          type="button"
          role="button"
          aria-pressed={redlines.clause15}
          onClick={() => toggleRedline("clause15")}
          className={`group w-full text-left cursor-pointer rounded-2xl border p-4 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-orange-500/40 ${
            redlines.clause15
              ? "bg-emerald-50/60 border-emerald-300 ring-1 ring-emerald-400"
              : "bg-rose-50/60 border-rose-300 hover:border-rose-400"
          }`}
        >
          <div className="flex items-center justify-between mb-1.5">
            <span className="font-bold text-xs uppercase tracking-wider text-gray-700">
              Clause 15.1: Seller Representations & Indemnity
            </span>
            <span
              className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                redlines.clause15 ? "bg-emerald-200 text-emerald-800" : "bg-rose-200 text-rose-800"
              }`}
            >
              {redlines.clause15 ? "✓ REDLINED & CAPPED" : "⚠️ UNCAPPED PERSONAL LIABILITY"}
            </span>
          </div>

          <p
            className={`text-xs sm:text-sm leading-relaxed font-serif ${
              redlines.clause15 ? "line-through text-gray-400" : "text-gray-900"
            }`}
          >
            &quot;The Founders shall jointly and severally indemnify the Acquirer with{" "}
            <span className="bg-rose-200/60 px-1 font-bold">no monetary ceiling or time limitation</span> for any
            past operational, intellectual property, or tax contingencies.&quot;
          </p>

          {redlines.clause15 && (
            <div className="mt-2 text-[11px] font-medium text-emerald-800 flex items-center gap-1.5">
              <Check className="h-3.5 w-3.5 text-emerald-600" />
              <span>
                Replaced with standard 15% purchase price escrow cap for a 24-month survival period.
              </span>
            </div>
          )}
        </button>

        {/* Statutory Citation Card */}
        <div className="rounded-2xl bg-sky-50 border border-sky-200/70 p-3.5 text-xs text-sky-950 flex items-start gap-2.5">
          <Info className="h-4 w-4 text-sky-600 shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            <span className="font-bold">Section 27, Indian Contract Act 1872: </span>
            &quot;Every agreement by which any one is restrained from exercising a lawful profession, trade or
            business of any kind, is to that extent void.&quot;
          </p>
        </div>
      </div>
    </div>
  );
}

/* ────────────────────────────────────────────────────────────
   3. UX DESIGN: Interactive Micro-Finance App Sandbox
   ──────────────────────────────────────────────────────────── */
export function UXTactileWidget() {
  const [highContrast, setHighContrast] = useState<boolean>(false);
  const [progressiveDisclosure, setProgressiveDisclosure] = useState<boolean>(false);
  const [voiceGuidance, setVoiceGuidance] = useState<boolean>(false);

  // Dynamic funnel calculation
  const dropoffRate = useMemo(() => {
    let rate = 68;
    if (highContrast) rate -= 18;
    if (progressiveDisclosure) rate -= 26;
    if (voiceGuidance) rate -= 12;
    return Math.max(12, rate);
  }, [highContrast, progressiveDisclosure, voiceGuidance]);

  const completionRate = 100 - dropoffRate;

  return (
    <div className="overflow-hidden rounded-3xl border border-pink-200/80 bg-white shadow-xl">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-pink-100 bg-pink-50/60 px-5 py-3 text-xs">
        <div className="flex items-center gap-2">
          <Smartphone className="h-4 w-4 text-pink-600" />
          <span className="font-display font-bold text-gray-900">
            BharatPay Merchant KYC • Usability Lab
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-semibold text-gray-500">Drop-off:</span>
          <span
            className={`font-display text-xs font-black px-2.5 py-0.5 rounded-full ${
              dropoffRate <= 25 ? "bg-emerald-100 text-emerald-800" : "bg-rose-100 text-rose-800"
            }`}
          >
            {dropoffRate}% Bounce
          </span>
        </div>
      </div>

      <div className="p-5 sm:p-6 grid grid-cols-1 md:grid-cols-12 gap-5">
        {/* Smartphone Simulator Mockup */}
        <div className="md:col-span-6 flex justify-center">
          <div className="w-full max-w-[240px] rounded-[2.5rem] border-4 border-gray-900 bg-gray-950 p-2.5 shadow-2xl">
            {/* Screen Notch */}
            <div className="h-3 w-20 rounded-full bg-gray-900 mx-auto mb-2" />

            {/* Simulated App Screen */}
            <div
              className={`rounded-2xl p-3.5 transition-colors duration-300 min-h-[300px] flex flex-col justify-between ${
                highContrast ? "bg-white text-gray-950" : "bg-[#F8FAFC] text-gray-400"
              }`}
            >
              <div>
                <div className="flex items-center justify-between text-[10px] pb-2 border-b border-gray-100">
                  <span className="font-bold">BharatPay Business</span>
                  <span className="text-[9px] bg-primary/10 text-primary px-1 rounded">KYC</span>
                </div>

                {voiceGuidance && (
                  <div className="mt-2 rounded-xl bg-orange-100 text-orange-800 p-1.5 text-[9px] font-bold flex items-center gap-1 animate-pulse">
                    <Volume2 className="h-3 w-3" />
                    <span>&quot;Apna Aadhar card scan karein&quot; (Hindi Audio)</span>
                  </div>
                )}

                <h4
                  className={`mt-3 text-xs font-bold leading-tight ${
                    highContrast ? "text-gray-950 font-black text-sm" : "text-gray-400"
                  }`}
                >
                  {progressiveDisclosure
                    ? "Step 1 of 3: Fast Aadhar Scan"
                    : "Merchant Registration (12 Fields Required)"}
                </h4>

                <p className="mt-1 text-[10px] leading-relaxed">
                  {progressiveDisclosure
                    ? "Take a photo of your card. We auto-fill details."
                    : "Fill legal name, father name, GSTIN, PAN, bank IFSC..."}
                </p>

                {/* Form fields simulator */}
                <div className="mt-3 space-y-1.5">
                  <div
                    className={`h-7 rounded-lg border px-2 flex items-center text-[10px] ${
                      highContrast
                        ? "border-gray-900 bg-white font-bold text-gray-950"
                        : "border-gray-200 bg-gray-50 text-gray-300"
                    }`}
                  >
                    {progressiveDisclosure ? "📷 Scan Aadhar Card" : "Input Merchant PAN Number"}
                  </div>
                  {!progressiveDisclosure && (
                    <>
                      <div className="h-6 rounded-lg border border-gray-200 bg-gray-50 px-2 flex items-center text-[9px] text-gray-300">
                        Input Business Address Line 1
                      </div>
                      <div className="h-6 rounded-lg border border-gray-200 bg-gray-50 px-2 flex items-center text-[9px] text-gray-300">
                        Input Bank Account Number
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Action Button */}
              <div
                className={`mt-4 rounded-xl py-2 text-center text-[11px] font-bold transition-all ${
                  highContrast
                    ? "bg-primary text-white shadow-md shadow-primary/30"
                    : "bg-gray-200 text-gray-400"
                }`}
              >
                {progressiveDisclosure ? "Next Step →" : "Submit 12 Fields"}
              </div>
            </div>
          </div>
        </div>

        {/* Interactive Controls & Funnel Output */}
        <div className="md:col-span-6 flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-pink-700">
              Interactive Design System Tokens
            </span>

            {/* Toggle 1: Contrast */}
            <div
              onClick={() => setHighContrast(!highContrast)}
              className="flex cursor-pointer items-center justify-between rounded-2xl border p-3 bg-gray-50 hover:bg-gray-100 transition-colors"
            >
              <div className="flex items-center gap-2.5">
                <Eye className="h-4 w-4 text-pink-600" />
                <div>
                  <p className="text-xs font-bold text-gray-900">WCAG AAA 7:1 Contrast</p>
                  <p className="text-[10px] text-gray-500">Readable in harsh Indian outdoor sunlight</p>
                </div>
              </div>
              <span
                className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                  highContrast ? "bg-emerald-200 text-emerald-800" : "bg-gray-200 text-gray-600"
                }`}
              >
                {highContrast ? "ON" : "OFF"}
              </span>
            </div>

            {/* Toggle 2: Progressive Disclosure */}
            <div
              onClick={() => setProgressiveDisclosure(!progressiveDisclosure)}
              className="flex cursor-pointer items-center justify-between rounded-2xl border p-3 bg-gray-50 hover:bg-gray-100 transition-colors"
            >
              <div className="flex items-center gap-2.5">
                <Sliders className="h-4 w-4 text-pink-600" />
                <div>
                  <p className="text-xs font-bold text-gray-900">Progressive Disclosure</p>
                  <p className="text-[10px] text-gray-500">Split 12 fields into 3 micro-steps + OCR</p>
                </div>
              </div>
              <span
                className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                  progressiveDisclosure ? "bg-emerald-200 text-emerald-800" : "bg-gray-200 text-gray-600"
                }`}
              >
                {progressiveDisclosure ? "ON" : "OFF"}
              </span>
            </div>

            {/* Toggle 3: Voice Guidance */}
            <div
              onClick={() => setVoiceGuidance(!voiceGuidance)}
              className="flex cursor-pointer items-center justify-between rounded-2xl border p-3 bg-gray-50 hover:bg-gray-100 transition-colors"
            >
              <div className="flex items-center gap-2.5">
                <Volume2 className="h-4 w-4 text-pink-600" />
                <div>
                  <p className="text-xs font-bold text-gray-900">Regional Voice Guidance</p>
                  <p className="text-[10px] text-gray-500">Audio prompts in Hindi, Tamil, Marathi</p>
                </div>
              </div>
              <span
                className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                  voiceGuidance ? "bg-emerald-200 text-emerald-800" : "bg-gray-200 text-gray-600"
                }`}
              >
                {voiceGuidance ? "ON" : "OFF"}
              </span>
            </div>
          </div>

          {/* Funnel Progress Gauge */}
          <div className="rounded-2xl bg-pink-50/70 border border-pink-200/80 p-3.5">
            <div className="flex justify-between text-xs font-bold text-gray-800 mb-1.5">
              <span>Merchant Onboarding Success:</span>
              <span className="text-emerald-700">{completionRate}% Completed</span>
            </div>
            <div className="h-2.5 w-full bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-pink-500 to-emerald-500 transition-all duration-500 rounded-full"
                style={{ width: `${completionRate}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ────────────────────────────────────────────────────────────
   4. CLINICAL MEDICINE: Bedside Triage Vitals Monitor & Action Tray
   ──────────────────────────────────────────────────────────── */
export function MedicineTactileWidget() {
  const [decompressionDone, setDecompressionDone] = useState<boolean>(false);
  const [actionAlert, setActionAlert] = useState<string | null>(null);

  const vitals = useMemo(() => {
    if (decompressionDone) {
      return {
        hr: 76,
        bp: "120/78",
        spo2: 99,
        resp: 16,
        status: "STABILIZED (LUNG RE-EXPANDED)",
        color: "text-emerald-400",
      };
    }
    return {
      hr: 122,
      bp: "86/58",
      spo2: 91,
      resp: 28,
      status: "TENSION PNEUMOTHORAX COLLAPSE",
      color: "text-red-400",
    };
  }, [decompressionDone]);

  const handleAction = (action: "sedate" | "ct" | "needle") => {
    if (action === "sedate") {
      setActionAlert("CRITICAL ERROR: IV Sedation causes respiratory arrest in obstructive shock!");
    } else if (action === "ct") {
      setActionAlert("CONTRAINDICATED: Patient is hemodynamically unstable. Do not transfer to CT scan!");
    } else if (action === "needle") {
      setDecompressionDone(true);
      setActionAlert("LIFE-SAVING ACTION: Immediate 2nd Intercostal Space Needle Decompression released trapped tension air!");
    }
  };

  return (
    <div className="overflow-hidden rounded-3xl border border-gray-800 bg-[#0A0D14] text-gray-200 shadow-2xl font-mono">
      {/* Vitals Screen Header */}
      <div className="flex items-center justify-between border-b border-gray-800 bg-[#121622] px-5 py-3 text-xs">
        <div className="flex items-center gap-2">
          <Activity className="h-4 w-4 text-emerald-400 animate-pulse" />
          <span className="font-bold text-gray-200">ICU Bedside Monitor #04 • Apollo Trauma</span>
        </div>
        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-black/40 ${vitals.color}`}>
          {vitals.status}
        </span>
      </div>

      <div className="p-5 space-y-5">
        {/* Vitals Display Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
          <div className="rounded-2xl border border-gray-800 bg-gray-900/60 p-3">
            <span className="text-[10px] text-gray-400 flex items-center justify-center gap-1">
              <Heart className="h-3 w-3 text-red-500" /> HR (BPM)
            </span>
            <p className={`text-2xl font-black mt-1 ${vitals.color}`}>{vitals.hr}</p>
          </div>
          <div className="rounded-2xl border border-gray-800 bg-gray-900/60 p-3">
            <span className="text-[10px] text-gray-400">BP (mmHg)</span>
            <p className={`text-2xl font-black mt-1 ${vitals.color}`}>{vitals.bp}</p>
          </div>
          <div className="rounded-2xl border border-gray-800 bg-gray-900/60 p-3">
            <span className="text-[10px] text-gray-400">SpO2 (%)</span>
            <p className={`text-2xl font-black mt-1 ${vitals.color}`}>{vitals.spo2}%</p>
          </div>
          <div className="rounded-2xl border border-gray-800 bg-gray-900/60 p-3">
            <span className="text-[10px] text-gray-400">Resp Rate</span>
            <p className={`text-2xl font-black mt-1 ${vitals.color}`}>{vitals.resp}/m</p>
          </div>
        </div>

        {/* Thoracic Diagnostic Status */}
        <div className="rounded-2xl border border-gray-800 bg-gray-900/40 p-4 text-xs space-y-1">
          <div className="flex justify-between">
            <span className="text-gray-400">Trachea Deviation:</span>
            <span className={decompressionDone ? "text-emerald-400 font-bold" : "text-red-400 font-bold"}>
              {decompressionDone ? "Centred (Normal)" : "Deviated to Right Side (Obstructive Shift)"}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Left Chest Auscultation:</span>
            <span className={decompressionDone ? "text-emerald-400 font-bold" : "text-red-400 font-bold"}>
              {decompressionDone ? "Bilateral Vesicular Breath Sounds Restored" : "Absent Air Entry (Hyper-resonant)"}
            </span>
          </div>
        </div>

        {/* Emergency Doctor Intervention Tray */}
        <div className="space-y-2">
          <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
            Physician Urgent Intervention Tray:
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            <button
              onClick={() => handleAction("needle")}
              className={`cursor-pointer rounded-xl p-3 text-left border transition-all ${
                decompressionDone
                  ? "bg-emerald-600/30 border-emerald-500 text-emerald-200"
                  : "bg-emerald-950/40 border-emerald-700/60 text-emerald-300 hover:bg-emerald-900/60"
              }`}
            >
              <p className="font-bold text-xs">💉 Needle Thoracostomy</p>
              <p className="text-[10px] text-emerald-400/80 mt-0.5">2nd Intercostal Mid-Clavicular</p>
            </button>

            <button
              onClick={() => handleAction("sedate")}
              className="cursor-pointer rounded-xl p-3 text-left border border-gray-800 bg-gray-900/40 text-gray-300 hover:bg-gray-800/60"
            >
              <p className="font-bold text-xs">💊 IV Sedation Dose</p>
              <p className="text-[10px] text-gray-500 mt-0.5">Relieve anxiety & pain</p>
            </button>

            <button
              onClick={() => handleAction("ct")}
              className="cursor-pointer rounded-xl p-3 text-left border border-gray-800 bg-gray-900/40 text-gray-300 hover:bg-gray-800/60"
            >
              <p className="font-bold text-xs">🏥 CT Scan Transfer</p>
              <p className="text-[10px] text-gray-500 mt-0.5">64-slice high-res imaging</p>
            </button>
          </div>
        </div>

        {/* Feedback Alert */}
        {actionAlert && (
          <div
            className={`rounded-2xl p-3.5 border text-xs leading-relaxed ${
              decompressionDone
                ? "bg-emerald-950/50 border-emerald-500/50 text-emerald-200"
                : "bg-red-950/50 border-red-500/50 text-red-200"
            }`}
          >
            {actionAlert}
          </div>
        )}
      </div>
    </div>
  );
}

/* ────────────────────────────────────────────────────────────
   5. FINANCE & WEALTH: 3-Way Asset Allocation & Inflation Shield
   ──────────────────────────────────────────────────────────── */
export function FinanceTactileWidget() {
  const [equity, setEquity] = useState<number>(60);
  const [debt, setDebt] = useState<number>(25);
  const gold = Math.max(0, 100 - equity - debt);

  // Return calculation (Equity ~12%, Debt ~7%, Gold/USD ~9%)
  const nominalReturn = useMemo(() => {
    return (equity * 0.12 + debt * 0.07 + gold * 0.09).toFixed(1);
  }, [equity, debt, gold]);

  // Tax drag ~25% average, Inflation 6%
  const realReturn = useMemo(() => {
    const afterTax = Number(nominalReturn) * 0.75;
    return (afterTax - 6.0).toFixed(1);
  }, [nominalReturn]);

  const isWealthProtected = Number(realReturn) > 1.5;

  return (
    <div className="overflow-hidden rounded-3xl border border-amber-200/80 bg-white shadow-xl">
      <div className="flex items-center justify-between border-b border-amber-100 bg-amber-50/60 px-5 py-3 text-xs">
        <div className="flex items-center gap-2">
          <TrendingUp className="h-4 w-4 text-amber-600" />
          <span className="font-display font-bold text-gray-900">
            Portfolio Allocation & Inflation Simulator (₹10 Cr Corpus)
          </span>
        </div>
        <span
          className={`font-display text-xs font-black px-2.5 py-0.5 rounded-full ${
            isWealthProtected ? "bg-emerald-100 text-emerald-800" : "bg-rose-100 text-rose-800"
          }`}
        >
          {isWealthProtected ? "Wealth Shielded" : "Inflation Loss"}
        </span>
      </div>

      <div className="p-5 sm:p-6 space-y-5">
        {/* Sliders Grid */}
        <div className="space-y-3">
          <div>
            <div className="flex justify-between text-xs font-semibold text-gray-700 mb-1">
              <span>Equities (Nifty 50 / Multicap):</span>
              <span className="font-bold text-indigo-600">{equity}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="90"
              value={equity}
              onChange={(e) => {
                const val = Number(e.target.value);
                setEquity(val);
                if (val + debt > 100) setDebt(100 - val);
              }}
              className="w-full accent-indigo-600 cursor-pointer"
            />
          </div>

          <div>
            <div className="flex justify-between text-xs font-semibold text-gray-700 mb-1">
              <span>Debt Funds / Bank FDs:</span>
              <span className="font-bold text-amber-600">{debt}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="90"
              value={debt}
              onChange={(e) => {
                const val = Number(e.target.value);
                setDebt(val);
                if (equity + val > 100) setEquity(100 - val);
              }}
              className="w-full accent-amber-600 cursor-pointer"
            />
          </div>

          <div>
            <div className="flex justify-between text-xs font-semibold text-gray-700 mb-1">
              <span>US Dollar Index / Sovereign Gold ETF:</span>
              <span className="font-bold text-yellow-600">{gold}%</span>
            </div>
            <div className="h-2 w-full bg-yellow-100 rounded-full overflow-hidden">
              <div className="h-full bg-yellow-500 rounded-full" style={{ width: `${gold}%` }} />
            </div>
          </div>
        </div>

        {/* 10-Year Purchasing Power Projection Readout */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-center border-t border-gray-100 pt-4">
          <div className="rounded-xl bg-gray-50 p-2.5">
            <span className="text-[10px] text-gray-500">Gross Nominal Return</span>
            <p className="text-base font-bold text-gray-800 mt-0.5">{nominalReturn}% p.a.</p>
          </div>
          <div className="rounded-xl bg-gray-50 p-2.5">
            <span className="text-[10px] text-gray-500">Indian CPI Inflation</span>
            <p className="text-base font-bold text-rose-600 mt-0.5">-6.0%</p>
          </div>
          <div className="col-span-2 sm:col-span-1 rounded-xl bg-emerald-50 p-2.5 border border-emerald-200">
            <span className="text-[10px] text-emerald-800 font-bold">Real Net Purchasing Power</span>
            <p
              className={`text-base font-black mt-0.5 ${
                Number(realReturn) >= 0 ? "text-emerald-700" : "text-rose-600"
              }`}
            >
              {Number(realReturn) > 0 ? `+${realReturn}%` : `${realReturn}%`}
            </p>
          </div>
        </div>

        <p className="text-[11px] leading-relaxed text-gray-500 italic">
          💡 If you put 100% in Bank FDs (7%), after 30% tax bracket you net 4.9%, which permanently destroys capital
          against 6% inflation. A 60-25-15 allocation beats inflation while hedging USD tuition costs.
        </p>
      </div>
    </div>
  );
}

/* ────────────────────────────────────────────────────────────
   6. MEDIA & BRANDING: Viral Hook Scrubber & Retention Curve
   ──────────────────────────────────────────────────────────── */
export function MediaTactileWidget() {
  const [selectedHook, setSelectedHook] = useState<"A" | "B">("B");
  const [timelineSec, setTimelineSec] = useState<number>(3);

  const retentionAtSecond = useMemo(() => {
    if (selectedHook === "A") {
      // Steep crash at 2 seconds
      if (timelineSec <= 1) return 92;
      if (timelineSec <= 3) return 24;
      return 12;
    } else {
      // High retention past 3 seconds
      if (timelineSec <= 1) return 96;
      if (timelineSec <= 3) return 86;
      return 72;
    }
  }, [selectedHook, timelineSec]);

  const isViral = retentionAtSecond >= 60;

  return (
    <div className="overflow-hidden rounded-3xl border border-purple-200/80 bg-white shadow-xl">
      <div className="flex items-center justify-between border-b border-purple-100 bg-purple-50/60 px-5 py-3 text-xs">
        <div className="flex items-center gap-2">
          <Play className="h-4 w-4 text-purple-600" />
          <span className="font-display font-bold text-gray-900">
            Short-Form Video Retention Analyzer (0s – 10s)
          </span>
        </div>
        <span
          className={`font-display text-xs font-black px-2.5 py-0.5 rounded-full ${
            isViral ? "bg-emerald-100 text-emerald-800" : "bg-rose-100 text-rose-800"
          }`}
        >
          {isViral ? "Viral Multiplier Active" : "Algorithmic Drop"}
        </span>
      </div>

      <div className="p-5 sm:p-6 space-y-4">
        {/* Hook Selector */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div
            onClick={() => setSelectedHook("A")}
            className={`cursor-pointer rounded-2xl border p-3.5 transition-all ${
              selectedHook === "A"
                ? "bg-purple-50 border-purple-400 ring-2 ring-purple-300"
                : "bg-gray-50 border-gray-200"
            }`}
          >
            <span className="text-[10px] font-bold uppercase text-gray-500">Hook Option A</span>
            <p className="mt-1 text-xs font-semibold text-gray-800">
              &quot;Hello everyone, today let&apos;s talk about sustainable fashion fabrics...&quot;
            </p>
          </div>

          <div
            onClick={() => setSelectedHook("B")}
            className={`cursor-pointer rounded-2xl border p-3.5 transition-all ${
              selectedHook === "B"
                ? "bg-purple-50 border-purple-400 ring-2 ring-purple-300"
                : "bg-gray-50 border-gray-200"
            }`}
          >
            <span className="text-[10px] font-bold uppercase text-emerald-600">Hook Option B (Contradiction)</span>
            <p className="mt-1 text-xs font-semibold text-gray-800">
              [Split-screen] Burning a ₹2,000 note vs a fast-fashion shirt dissolving in wash.
            </p>
          </div>
        </div>

        {/* Timeline Scrubber */}
        <div className="space-y-1.5 pt-2">
          <div className="flex justify-between text-xs font-semibold text-gray-600">
            <span>Video Time Scrubber: {timelineSec} seconds</span>
            <span className={isViral ? "text-emerald-700 font-bold" : "text-rose-600 font-bold"}>
              {retentionAtSecond}% Audience Retained
            </span>
          </div>

          <input
            type="range"
            min="0"
            max="10"
            value={timelineSec}
            onChange={(e) => setTimelineSec(Number(e.target.value))}
            className="w-full accent-purple-600 cursor-pointer"
          />

          <div className="flex justify-between text-[10px] text-gray-400">
            <span>0s (Hook)</span>
            <span>3s (The Drop-off Cliff)</span>
            <span>10s (Retention)</span>
          </div>
        </div>

        {/* Algorithm Status Box */}
        <div
          className={`rounded-2xl p-3.5 border text-xs leading-relaxed ${
            isViral
              ? "bg-emerald-50 border-emerald-200 text-emerald-900"
              : "bg-rose-50 border-rose-200 text-rose-900"
          }`}
        >
          {isViral ? (
            <p>
              <span className="font-bold">🚀 Algorithmic Breakthrough: </span>
              Retaining 86% of Gen Z past the 3-second mark triggers the recommendation engine. Video projected for
              500K+ organic impressions.
            </p>
          ) : (
            <p>
              <span className="font-bold">📉 Algorithmic Penalty: </span>
              Preachy speech causes an 76% viewer drop at 2.4s. The platform algorithm suppresses the post.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
