"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  X,
  Compass,
  Brain,
  Gamepad2,
  Users,
  ChevronUp,
  ChevronDown,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";
import PtiroMascot from "./PtiroMascot";
import { useUserProfile } from "@/context/UserProfileContext";
import { useStudentAuth } from "@/context/StudentAuthContext";

export default function FloatingCopilot() {
  const [isOpen, setIsOpen] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);
  const pathname = usePathname();
  const { openBookingModal, openDossierModal } = useUserProfile();
  const { user } = useStudentAuth();

  // Hide on admin page to keep admin command center completely clean
  if (pathname?.startsWith("/admin") || isDismissed) {
    return null;
  }

  const tipsByRoute: Record<string, { title: string; hint: string }> = {
    "/": {
      title: "Discover Your Trajectory",
      hint: "Most students choose the wrong stream. Take our 360° test to find your authentic path.",
    },
    "/dashboard": {
      title: "Kaizen Momentum",
      hint: "Check off your daily sprint tasks to build your board exam readiness score.",
    },
    "/simulator": {
      title: "Experiential Test-Drive",
      hint: "Test 3 real-world careers before locking in high school subject combinations.",
    },
    "/career-test": {
      title: "Diagnostic Focus",
      hint: "Answer intuitively based on your natural curiosity, not parental pressure.",
    },
    "/login": {
      title: "1-Click Demo Available",
      hint: "Select Aarav, Meera, or Vihaan for instant access without a password.",
    },
  };

  const currentTip = tipsByRoute[pathname || "/"] || {
    title: "Kaizen Career Guidance",
    hint: "Every great career starts with structured self-knowledge and deliberate practice.",
  };

  return (
    <div className="fixed bottom-4 right-4 z-40 select-none">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 15 }}
            transition={{ duration: 0.2 }}
            className="mb-3 w-80 sm:w-88 rounded-3xl bg-white/95 backdrop-blur-md border border-orange-200/90 shadow-2xl p-4 sm:p-5 text-stone-900 space-y-4"
          >
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <div className="flex items-center gap-2">
                <span className="size-2 rounded-full bg-emerald-500 animate-ping" />
                <span className="font-display font-bold text-sm text-stone-900">
                  Ptiro Copilot
                </span>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-orange-100 text-orange-800 uppercase tracking-wider">
                  AI Navigator
                </span>
              </div>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="p-1 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition cursor-pointer"
                title="Minimize Copilot"
              >
                <ChevronDown className="size-4" />
              </button>
            </div>

            {/* Mascot Centerpiece */}
            <div className="flex items-center gap-3 bg-gradient-to-br from-orange-50/80 to-amber-50/40 p-3 rounded-2xl border border-orange-100/80">
              <PtiroMascot
                variant="copilot"
                size={70}
                showSpeech={false}
                interactive={false}
              />
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1 text-xs font-bold text-stone-900">
                  <Sparkles className="size-3 text-primary shrink-0" />
                  <span className="truncate">{currentTip.title}</span>
                </div>
                <p className="text-[11px] text-stone-600 mt-1 leading-snug">
                  {currentTip.hint}
                </p>
              </div>
            </div>

            {/* Quick Strategic Actions */}
            <div className="space-y-1.5 text-xs font-semibold">
              <Link
                href="/simulator"
                onClick={() => setIsOpen(false)}
                className="flex items-center justify-between p-2.5 rounded-xl bg-stone-50 hover:bg-orange-50/80 hover:text-orange-950 border border-stone-100 hover:border-orange-200 transition group"
              >
                <div className="flex items-center gap-2">
                  <Gamepad2 className="size-4 text-primary" />
                  <span>Virtual Career Simulator</span>
                </div>
                <ArrowRight className="size-3.5 text-stone-400 group-hover:text-primary group-hover:translate-x-0.5 transition" />
              </Link>

              <Link
                href="/career-test"
                onClick={() => setIsOpen(false)}
                className="flex items-center justify-between p-2.5 rounded-xl bg-stone-50 hover:bg-orange-50/80 hover:text-orange-950 border border-stone-100 hover:border-orange-200 transition group"
              >
                <div className="flex items-center gap-2">
                  <Brain className="size-4 text-primary" />
                  <span>360° Diagnostic Test</span>
                </div>
                <ArrowRight className="size-3.5 text-stone-400 group-hover:text-primary group-hover:translate-x-0.5 transition" />
              </Link>

              <button
                type="button"
                onClick={() => {
                  setIsOpen(false);
                  openBookingModal();
                }}
                className="w-full flex items-center justify-between p-2.5 rounded-xl bg-stone-50 hover:bg-orange-50/80 hover:text-orange-950 border border-stone-100 hover:border-orange-200 transition group cursor-pointer text-left"
              >
                <div className="flex items-center gap-2">
                  <Users className="size-4 text-primary" />
                  <span>Book 1:1 Gurukul Mentor</span>
                </div>
                <ArrowRight className="size-3.5 text-stone-400 group-hover:text-primary group-hover:translate-x-0.5 transition" />
              </button>
            </div>

            {/* Bottom Status */}
            <div className="flex items-center justify-between pt-2 border-t border-stone-100 text-[10px] text-stone-400">
              <span className="flex items-center gap-1">
                <ShieldCheck className="size-3 text-emerald-600" />
                NEP 2020 Aligned
              </span>
              <button
                type="button"
                onClick={() => setIsDismissed(true)}
                className="hover:text-stone-700 transition cursor-pointer"
              >
                Don&apos;t show again
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Pill Toggle Button */}
      {!isOpen && (
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-2 px-3.5 py-2 rounded-full bg-white/95 backdrop-blur-md border border-orange-300 text-stone-900 shadow-xl hover:border-primary hover:shadow-orange-500/10 transition cursor-pointer"
          title="Open Ptiro Copilot"
        >
          <div className="size-6 shrink-0 relative flex items-center justify-center">
            <PtiroMascot variant="copilot" size={26} showSpeech={false} interactive={false} />
          </div>
          <span className="text-xs font-bold text-stone-900 hidden sm:inline">Ptiro Copilot</span>
          <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
        </motion.button>
      )}
    </div>
  );
}
