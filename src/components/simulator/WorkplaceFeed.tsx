"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MessageSquare,
  Mic,
  FileText,
  Play,
  Pause,
  Volume2,
  Clock,
  CheckCheck,
  Paperclip,
  Radio,
  ChevronDown,
  ChevronUp,
  User,
  Sparkles,
} from "lucide-react";

export interface WorkplaceManager {
  name: string;
  role: string;
  avatarInitials: string;
  avatarGradient: string;
  status: string;
  channelName: string;
  voiceMemoDuration: string;
  voiceMemoTranscript: string;
  messages: {
    sender: "manager" | "system" | "student";
    text: string;
    time: string;
    attachment?: {
      name: string;
      size: string;
      type: string;
    };
  }[];
}

const MANAGERS_DATA: { [trackId: string]: WorkplaceManager } = {
  "ai-robotics": {
    name: "Priya Sharma",
    role: "Director of Robotics Systems",
    avatarInitials: "PS",
    avatarGradient: "from-indigo-600 to-purple-600",
    status: "🟢 In Autonomous Testing Lab 4",
    channelName: "#robotics-fleet-ops",
    voiceMemoDuration: "0:14",
    voiceMemoTranscript:
      "Aarav, emergency dispatch from warehouse aisle 4. Fleet bot 402 is triggering emergency collision brakes on empty corridors. We have 4,000 orders pending this hour. I've sent you the raw LiDAR and ultrasonic telemetry. Inspect the sensor fusion filter and flush that stale packet buffer immediately.",
    messages: [
      {
        sender: "system",
        text: "⚡ INCIDENT #4092 TRIGGERED: Fleet Bot 402 halted on corridor aisle A-04.",
        time: "09:41 AM",
      },
      {
        sender: "manager",
        text: "Hey! We have an urgent issue on the warehouse floor. Bot 402 keeps phantom-braking despite clear camera feeds.",
        time: "09:42 AM",
        attachment: {
          name: "telemetry_ros2_dump_4092.log",
          size: "420 KB",
          type: "ROS2 Telemetry",
        },
      },
      {
        sender: "manager",
        text: "Check if the LiDAR point-cloud node has a stale buffer before the dispatch manager escalates this to executive leadership.",
        time: "09:43 AM",
      },
    ],
  },
  "corporate-law": {
    name: "Adv. Vikramaditya Mitra",
    role: "Senior Partner • M&A Practice",
    avatarInitials: "VM",
    avatarGradient: "from-sky-600 to-blue-700",
    status: "🟢 On Call with Singapore Acquirer",
    channelName: "#saas-acquisition-dealroom",
    voiceMemoDuration: "0:16",
    voiceMemoTranscript:
      "Aarav, the buyer's London legal team just slipped an 8-year nationwide blanket non-compete into Schedule 14. Under Indian Contract Act Section 27, that's completely void and predatory against our founders. Redline that clause immediately and cap their indemnity liability to standard escrow limits.",
    messages: [
      {
        sender: "system",
        text: "🔒 SECURE DEAL ROOM: Acquirer Legal uploaded SPA_Draft_v4.2.docx",
        time: "11:15 AM",
      },
      {
        sender: "manager",
        text: "Look at Clause 14.2 right now. The buyer is attempting an 8-year non-compete across all of India plus uncapped indemnity.",
        time: "11:16 AM",
        attachment: {
          name: "SPA_Redline_Schedule_14.pdf",
          size: "1.8 MB",
          type: "Legal Agreement",
        },
      },
      {
        sender: "manager",
        text: "Strike that out immediately and cite Section 27 precedent. We cannot let our client sign personal bankruptcy risks.",
        time: "11:17 AM",
      },
    ],
  },
  "ux-design": {
    name: "Ananya Roy",
    role: "Head of Product Experience",
    avatarInitials: "AR",
    avatarGradient: "from-pink-600 to-rose-600",
    status: "🟢 In User Research Session",
    channelName: "#merchant-kyc-redesign",
    voiceMemoDuration: "0:15",
    voiceMemoTranscript:
      "Our rural shopkeeper activation just dropped 68% at the KYC stage. Local merchants in Indore and Nashik are telling us the screens wash out in daylight and 12 simultaneous input fields terrify them. Let's prototype a progressive flow with voice prompts and test it live.",
    messages: [
      {
        sender: "system",
        text: "📊 MIXPANEL ALERT: Step 3 KYC Drop-off reached 68.4% (Threshold: 30%)",
        time: "10:02 AM",
      },
      {
        sender: "manager",
        text: "Merchants are abandoning registration. Faint pastel gray text washes out on budget LCD screens in outdoor sunlight.",
        time: "10:04 AM",
        attachment: {
          name: "heatmaps_and_session_recording.mp4",
          size: "14.2 MB",
          type: "User Session Log",
        },
      },
      {
        sender: "manager",
        text: "Switch to WCAG AAA 7:1 contrast tokens and split the 12 fields into 3 micro-steps with Hindi voice guidance.",
        time: "10:05 AM",
      },
    ],
  },
  "medicine": {
    name: "Dr. Rajesh Sengupta",
    role: "Chief of Trauma & Emergency Medicine",
    avatarInitials: "RS",
    avatarGradient: "from-emerald-600 to-teal-700",
    status: "🔴 URGENT • Trauma Bay Bed-04",
    channelName: "#trauma-resuscitation-code",
    voiceMemoDuration: "0:17",
    voiceMemoTranscript:
      "Trauma team, Bed 4! 17-year-old athlete collapsed mid-badminton match. Acute left pleuritic chest pain, absent breath sounds, SpO2 down to 91%. His trachea is beginning to deviate rightward and systolic BP is crashing to 84. This is a tension pneumothorax crisis — prep for immediate needle decompression!",
    messages: [
      {
        sender: "system",
        text: "🚨 CODE BLUE TRAUMA: Acute Respiratory Failure • Bed #04",
        time: "02:14 PM",
      },
      {
        sender: "manager",
        text: "Patient is in acute respiratory collapse! Absent left breath sounds, hyper-resonant percussion.",
        time: "02:15 PM",
        attachment: {
          name: "bedside_ecg_vitals_feed.dat",
          size: "85 KB",
          type: "ICU Monitor Data",
        },
      },
      {
        sender: "manager",
        text: "Trachea is visibly shifting to the opposite side! Do NOT wait for CT or radiology — intervene bedside now!",
        time: "02:15 PM",
      },
    ],
  },
  "finance": {
    name: "Kavita Krishnamurthy",
    role: "Managing Director • Private Wealth",
    avatarInitials: "KK",
    avatarGradient: "from-amber-500 to-orange-600",
    status: "🟢 In Portfolio Committee Meeting",
    channelName: "#hnw-portfolio-strategy",
    voiceMemoDuration: "0:15",
    voiceMemoTranscript:
      "Aarav, our ₹10 Crore client wants to put 100% into fixed deposits for his granddaughter's US college fund. He thinks it's zero risk. Walk him through the math: after 30% tax, a 7% FD nets 4.9%, which loses wealth against 6% inflation, especially with rupee depreciation. Structure a 60-25-15 hedge.",
    messages: [
      {
        sender: "system",
        text: "💼 CLIENT BRIEF: Gupta Family Trust (Corpus: ₹10,00,00,000)",
        time: "03:10 PM",
      },
      {
        sender: "manager",
        text: "Mr. Gupta is fearful of stock market volatility and wants 100% bank fixed deposits for a 10-year foreign education corpus.",
        time: "03:11 PM",
        attachment: {
          name: "gupta_family_asset_profile.xlsx",
          size: "1.2 MB",
          type: "Financial Model",
        },
      },
      {
        sender: "manager",
        text: "Show him real post-tax returns against 6% inflation and introduce dollar-hedged ETF allocations under RBI's LRS scheme.",
        time: "03:12 PM",
      },
    ],
  },
  "media": {
    name: "Zubin Mehta",
    role: "Executive Creative Director",
    avatarInitials: "ZM",
    avatarGradient: "from-purple-600 to-indigo-600",
    status: "🟢 Creative War Room",
    channelName: "#campaign-viral-hooks",
    voiceMemoDuration: "0:14",
    voiceMemoTranscript:
      "Team, our 3-second hold rate on the sustainability campaign draft is tanking at 24%. Gen Z viewers scroll past preachy lectures in less than 2 seconds. We need a visceral visual contradiction right up front — split screen burning a ₹2,000 note against cheap fabric. Test that hook now.",
    messages: [
      {
        sender: "system",
        text: "📈 TIKTOK/REELS ANALYTICS: 3-Second Hold Rate dropped to 24.1%",
        time: "04:30 PM",
      },
      {
        sender: "manager",
        text: "Nobody is watching past 3 seconds. The opening 2 seconds make or break the algorithm.",
        time: "04:31 PM",
        attachment: {
          name: "rough_cut_v2_storyboard.mp4",
          size: "28.5 MB",
          type: "Video Storyboard",
        },
      },
      {
        sender: "manager",
        text: "A/B test Hook A against Hook B. We need that retention curve above 80% to hit the viral distribution tier.",
        time: "04:32 PM",
      },
    ],
  },
};

export default function WorkplaceFeed({
  trackId,
  companyName,
  missionPhase,
}: {
  trackId: string;
  companyName: string;
  missionPhase: string;
}) {
  const [activeTab, setActiveTab] = useState<"slack" | "audio" | "dossier">("slack");
  const [isPlayingAudio, setIsPlayingAudio] = useState<boolean>(false);
  const [audioProgress, setAudioProgress] = useState<number>(0);
  const [isTranscriptOpen, setIsTranscriptOpen] = useState<boolean>(false);
  const [isTyping, setIsTyping] = useState<boolean>(false);

  const audioCtxRef = useRef<AudioContext | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const manager = MANAGERS_DATA[trackId] || MANAGERS_DATA["ai-robotics"];

  // Brief typing simulation on missionPhase change
  useEffect(() => {
    setIsTyping(true);
    const t = setTimeout(() => {
      setIsTyping(false);
    }, 1800);
    return () => clearTimeout(t);
  }, [missionPhase]);

  // Procedural Web Audio API sound effect for authentic dispatch chime
  const playDispatchSound = () => {
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      audioCtxRef.current = ctx;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
      osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.12); // A5

      gain.gain.setValueAtTime(0.12, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.25);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.25);
    } catch {
      // AudioContext not allowed without gesture
    }
  };

  // Toggle voice memo playback
  const togglePlayAudio = () => {
    if (isPlayingAudio) {
      setIsPlayingAudio(false);
      if (timerRef.current) clearInterval(timerRef.current);
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
    } else {
      setIsPlayingAudio(true);
      playDispatchSound();

      // Read aloud via SpeechSynthesis if available
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(manager.voiceMemoTranscript);
        utterance.rate = 1.05;
        utterance.pitch = 1.0;
        utterance.onend = () => {
          setIsPlayingAudio(false);
          setAudioProgress(0);
        };
        window.speechSynthesis.speak(utterance);
      }

      // Animate progress bar over ~14 seconds
      const totalSeconds = 14;
      let elapsed = 0;
      timerRef.current = setInterval(() => {
        elapsed += 0.5;
        const pct = Math.min(100, (elapsed / totalSeconds) * 100);
        setAudioProgress(pct);
        if (pct >= 100) {
          setIsPlayingAudio(false);
          if (timerRef.current) clearInterval(timerRef.current);
        }
      }, 500);
    }
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  return (
    <div className="overflow-hidden rounded-3xl border border-orange-200/80 bg-white shadow-sm flex flex-col">
      {/* Top Channel Header Bar */}
      <div className="border-b border-orange-100 bg-[#1E1E2F] px-4 py-3 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div
              className={`flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-tr ${manager.avatarGradient} text-white font-bold text-xs shadow-sm`}
            >
              {manager.avatarInitials}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-display text-xs font-bold">{manager.name}</span>
                <span className="text-[10px] text-gray-400 font-mono">{manager.channelName}</span>
              </div>
              <p className="text-[10px] text-emerald-400 font-mono leading-none mt-0.5">
                {manager.status}
              </p>
            </div>
          </div>

          <span className="rounded-full bg-white/10 px-2.5 py-0.5 text-[10px] font-mono text-orange-300">
            {companyName.split("•")[0]}
          </span>
        </div>

        {/* Tab Switcher */}
        <div className="mt-3 flex items-center gap-1.5 border-t border-white/10 pt-2 text-xs font-medium">
          <button
            onClick={() => setActiveTab("slack")}
            className={`flex cursor-pointer items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs transition-colors ${
              activeTab === "slack"
                ? "bg-white/20 text-white font-bold"
                : "text-gray-400 hover:text-white"
            }`}
          >
            <MessageSquare className="h-3.5 w-3.5" />
            <span>Workplace Chat</span>
            <span className="ml-0.5 rounded-full bg-primary px-1.5 py-0.2 text-[9px] font-black text-white">
              2
            </span>
          </button>

          <button
            onClick={() => setActiveTab("audio")}
            className={`flex cursor-pointer items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs transition-colors ${
              activeTab === "audio"
                ? "bg-white/20 text-white font-bold"
                : "text-gray-400 hover:text-white"
            }`}
          >
            <Mic className="h-3.5 w-3.5 text-orange-400" />
            <span>Voice Memo ({manager.voiceMemoDuration})</span>
            {isPlayingAudio && (
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-orange-500" />
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Tab Content Area */}
      <div className="p-4 sm:p-5 flex-1 bg-[#FAFAFC]">
        {activeTab === "slack" ? (
          /* ─── TAB 1: SLACK STYLE CHAT FEED ─── */
          <div className="space-y-3.5">
            {manager.messages.map((msg, i) => {
              if (msg.sender === "system") {
                return (
                  <div
                    key={i}
                    className="rounded-xl border border-amber-200/70 bg-amber-50/70 px-3 py-1.5 text-[11px] font-mono text-amber-900"
                  >
                    {msg.text}
                  </div>
                );
              }

              return (
                <div key={i} className="flex items-start gap-2.5">
                  <div
                    className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-gradient-to-tr ${manager.avatarGradient} text-white font-bold text-[10px] mt-0.5`}
                  >
                    {manager.avatarInitials}
                  </div>

                  <div className="flex-1 space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-xs text-gray-900">{manager.name}</span>
                      <span className="text-[10px] text-gray-400">{msg.time}</span>
                    </div>

                    <div className="rounded-2xl rounded-tl-sm bg-white p-3 text-xs leading-relaxed text-gray-800 border border-gray-200/70 shadow-xs">
                      {msg.text}

                      {/* File Attachment Pill */}
                      {msg.attachment && (
                        <div className="mt-2.5 flex items-center justify-between rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-[11px]">
                          <div className="flex items-center gap-2">
                            <Paperclip className="h-3.5 w-3.5 text-gray-400" />
                            <div>
                              <p className="font-bold text-gray-800">{msg.attachment.name}</p>
                              <p className="text-[9px] text-gray-400">{msg.attachment.size} • {msg.attachment.type}</p>
                            </div>
                          </div>
                          <span className="rounded-md bg-white border border-gray-200 px-2 py-0.5 text-[10px] font-semibold text-primary">
                            Attached
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Typing Indicator */}
            {isTyping && (
              <div className="flex items-center gap-2 text-[11px] font-mono text-gray-400 pl-9">
                <span className="italic">{manager.name} is typing...</span>
                <span className="flex gap-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-gray-400 animate-bounce" />
                  <span className="h-1.5 w-1.5 rounded-full bg-gray-400 animate-bounce [animation-delay:0.2s]" />
                  <span className="h-1.5 w-1.5 rounded-full bg-gray-400 animate-bounce [animation-delay:0.4s]" />
                </span>
              </div>
            )}
          </div>
        ) : (
          /* ─── TAB 2: AUDIO VOICE MEMO DISPATCH ─── */
          <div className="space-y-4">
            <div className="rounded-2xl border border-orange-200 bg-orange-50/60 p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Radio className="h-4 w-4 text-orange-600 animate-pulse" />
                  <span className="text-xs font-bold uppercase tracking-wider text-orange-950">
                    Encrypted Voice Dispatch
                  </span>
                </div>
                <span className="text-[11px] font-mono text-gray-500">
                  Duration: {manager.voiceMemoDuration}
                </span>
              </div>

              {/* Audio Waveform Bars Simulation */}
              <div className="flex items-center gap-3">
                <button
                  onClick={togglePlayAudio}
                  className="flex h-11 w-11 shrink-0 cursor-pointer items-center justify-center rounded-full bg-primary text-white shadow-md shadow-primary/30 transition-transform active:scale-95 hover:bg-primary-dark"
                  aria-label={isPlayingAudio ? "Pause Audio" : "Play Voice Memo"}
                >
                  {isPlayingAudio ? (
                    <Pause className="h-5 w-5 fill-current" />
                  ) : (
                    <Play className="h-5 w-5 fill-current ml-0.5" />
                  )}
                </button>

                {/* Dynamic EQ Bouncing Waveform */}
                <div className="flex flex-1 items-center gap-1 h-9 px-2 bg-white/80 rounded-xl border border-orange-100">
                  {Array.from({ length: 24 }).map((_, idx) => {
                    const heights = [35, 60, 90, 45, 80, 100, 70, 40, 85, 95, 65, 50];
                    const h = heights[idx % heights.length];
                    return (
                      <div
                        key={idx}
                        className={`flex-1 rounded-full transition-all duration-150 ${
                          isPlayingAudio ? "bg-primary animate-pulse" : "bg-orange-300"
                        }`}
                        style={{
                          height: isPlayingAudio ? `${Math.max(15, Math.round(h * Math.random()))}%` : `${h * 0.4}%`,
                          animationDelay: `${idx * 0.05}s`,
                        }}
                      />
                    );
                  })}
                </div>
              </div>

              {/* Scrub Progress Bar */}
              <div className="mt-3">
                <div className="h-1.5 w-full bg-orange-200/80 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary transition-all duration-300"
                    style={{ width: `${audioProgress}%` }}
                  />
                </div>
                <div className="mt-1 flex justify-between text-[10px] text-gray-500 font-mono">
                  <span>{isPlayingAudio ? "Playing..." : "Tap play to listen"}</span>
                  <span>{manager.voiceMemoDuration}</span>
                </div>
              </div>
            </div>

            {/* Collapsible Transcript */}
            <div className="rounded-2xl border border-gray-200 bg-white overflow-hidden text-xs">
              <button
                onClick={() => setIsTranscriptOpen(!isTranscriptOpen)}
                className="w-full flex items-center justify-between p-3 cursor-pointer text-gray-700 hover:bg-gray-50 font-bold"
              >
                <span>Voice Memo Transcript</span>
                {isTranscriptOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </button>

              {isTranscriptOpen && (
                <div className="p-3.5 pt-0 text-gray-600 leading-relaxed border-t border-gray-100 font-serif italic text-xs bg-gray-50/50">
                  &quot;{manager.voiceMemoTranscript}&quot;
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
