"use client";

import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, MessageSquare, X, Bot, Trophy, PartyPopper, BookOpen } from "lucide-react";

// Dynamically import DotLottieReact with SSR disabled to ensure clean canvas mount
const DotLottieReact = dynamic(
  () => import("@lottiefiles/dotlottie-react").then((mod) => mod.DotLottieReact),
  {
    ssr: false,
    loading: () => (
      <div className="size-full flex items-center justify-center animate-pulse bg-orange-100/60 rounded-2xl">
        <Bot className="size-6 text-primary animate-bounce" />
      </div>
    ),
  }
);

export type MascotVariant = "copilot" | "celebrate" | "confetti" | "study";

interface PtiroMascotProps {
  variant?: MascotVariant;
  size?: number | string;
  speech?: string;
  subSpeech?: string;
  showSpeech?: boolean;
  interactive?: boolean;
  loop?: boolean;
  autoplay?: boolean;
  className?: string;
  onClick?: () => void;
}

const mascotSources: Record<MascotVariant, string> = {
  copilot: "/mascots/robot_mascot.json",
  celebrate: "/mascots/trophy_celebrate.json",
  confetti: "/mascots/confetti_blast.json",
  study: "/mascots/student_study.json",
};

export default function PtiroMascot({
  variant = "copilot",
  size = 140,
  speech,
  subSpeech,
  showSpeech = true,
  interactive = true,
  loop = true,
  autoplay = true,
  className = "",
  onClick,
}: PtiroMascotProps) {
  const [speechVisible, setSpeechVisible] = useState(showSpeech);
  const [clickCount, setClickCount] = useState(0);

  useEffect(() => {
    setSpeechVisible(showSpeech);
  }, [showSpeech, speech]);

  const defaultSpeeches: Record<MascotVariant, { title: string; sub: string }> = {
    copilot: {
      title: "Hi, I'm Ptiro!",
      sub: "Your Kaizen copilot & career guide.",
    },
    celebrate: {
      title: "Phenomenal Work!",
      sub: "Milestone unlocked • +1 Kaizen Streak",
    },
    confetti: {
      title: "Goal Completed!",
      sub: "National NEP competency credit earned.",
    },
    study: {
      title: "Deep Focus Mode",
      sub: "Quiet reflections fuel great futures.",
    },
  };

  const activeSpeech = speech || defaultSpeeches[variant]?.title;
  const activeSubSpeech = subSpeech || defaultSpeeches[variant]?.sub;

  const handleClick = () => {
    setClickCount((prev) => prev + 1);
    if (onClick) onClick();
  };

  const dimensionStyle =
    typeof size === "number"
      ? { width: `${size}px`, height: `${size}px` }
      : { width: size, height: size };

  return (
    <div className={`relative inline-flex items-center gap-3 select-none ${className}`}>
      {/* Mascot Canvas Container */}
      <motion.div
        whileHover={interactive ? { scale: 1.05 } : undefined}
        whileTap={interactive ? { scale: 0.95 } : undefined}
        onClick={handleClick}
        className={`relative shrink-0 flex items-center justify-center ${
          interactive ? "cursor-pointer" : ""
        }`}
        style={dimensionStyle}
      >
        <DotLottieReact
          src={mascotSources[variant]}
          loop={loop}
          autoplay={autoplay}
          className="size-full object-contain"
        />

        {/* Status Aura Glow */}
        <div className="absolute inset-0 -z-10 rounded-full bg-gradient-to-tr from-orange-400/20 to-amber-300/10 blur-xl pointer-events-none" />
      </motion.div>

      {/* Speech Bubble */}
      <AnimatePresence>
        {speechVisible && activeSpeech && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 4, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="relative max-w-xs rounded-2xl bg-white border border-orange-200/90 shadow-md p-3 text-left z-10"
          >
            {/* Pointer arrow */}
            <div className="absolute top-1/2 -left-2 -translate-y-1/2 w-0 h-0 border-y-6 border-y-transparent border-r-8 border-r-white drop-shadow-xs" />

            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <div className="flex items-center gap-1.5 text-xs font-bold text-stone-900">
                  <Sparkles className="size-3 text-primary shrink-0" />
                  <span className="truncate">{activeSpeech}</span>
                </div>
                {activeSubSpeech && (
                  <p className="text-[11px] text-stone-500 mt-0.5 leading-snug">
                    {activeSubSpeech}
                  </p>
                )}
              </div>
              <button
                type="button"
                onClick={() => setSpeechVisible(false)}
                className="text-stone-300 hover:text-stone-600 transition p-0.5 rounded cursor-pointer shrink-0"
                title="Dismiss tip"
              >
                <X className="size-3" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
