"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  AlertTriangle,
  CheckCircle2,
  TrendingUp,
  TrendingDown,
  ShieldAlert,
  ShieldCheck,
  RotateCcw,
  Sparkles,
  ArrowRight,
  Flame,
  Award,
  Zap,
  Activity,
  MessageSquare,
  Wrench,
  Check,
} from "lucide-react";

/* ─── Sound Dispatch Utility ─────────────────────── */
function playBranchChime(type: "success" | "crisis" | "recovery") {
  if (typeof window === "undefined") return;
  try {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();

    if (type === "success") {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(523.25, ctx.currentTime); // C5
      osc.frequency.exponentialRampToValueAtTime(783.99, ctx.currentTime + 0.15); // G5
      gain.gain.setValueAtTime(0.12, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.35);
    } else if (type === "crisis") {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(220, ctx.currentTime); // A3
      osc.frequency.linearRampToValueAtTime(160, ctx.currentTime + 0.25);
      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.4);
    } else if (type === "recovery") {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "triangle";
      osc.frequency.setValueAtTime(440, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.2);
      gain.gain.setValueAtTime(0.14, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.3);
    }
  } catch {
    // Ignore audio autoplay restrictions
  }
}

/* ─── Consequence Models ─────────────────────────── */
export interface ConsequenceRecoveryAction {
  id: string;
  label: string;
  description: string;
  isCorrect: boolean;
  resolutionText: string;
}

export interface ConsequenceData {
  optimalHeadline: string;
  optimalMetric: {
    label: string;
    value: string;
    delta: string;
    isPositive: boolean;
  };
  optimalManagerFeedback: string;

  suboptimalHeadline: string;
  suboptimalMetric: {
    label: string;
    value: string;
    delta: string;
    isPositive: boolean;
  };
  suboptimalManagerFeedback: string;
  crisisNarrative: string;
  recoveryActions: ConsequenceRecoveryAction[];
  pedagogicalTakeaway: string;
}

/* ─── 18 Comprehensive Industry Consequence Trees ─── */
const CONSEQUENCE_REGISTRY: Record<string, Record<number, ConsequenceData>> = {
  "ai-robotics": {
    1: {
      optimalHeadline: "LiDAR Buffer Cleared & Kalman Sensor Lock Established",
      optimalMetric: {
        label: "Aisle A-04 Throughput",
        value: "2.4 m/s Full Velocity",
        delta: "+100% Restored",
        isPositive: true,
      },
      optimalManagerFeedback:
        "“Outstanding diagnostic call! Bot 402 flushed the stale packet cache and identified the clear optical corridor. 4,000 hourly orders back on track without floor manager escalation.”",
      suboptimalHeadline: "Critical Obstacle Escalation: Fleet Bot #402 Stalled",
      suboptimalMetric: {
        label: "Warehouse Staging Loss",
        value: "₹4.2 Lakhs / Hr Risk",
        delta: "-45% Bottleneck",
        isPositive: false,
      },
      suboptimalManagerFeedback:
        "“Priya here: Alert! Bot 402 is stuck blocking aisle 4! 14 automated forklifts behind it are queuing up. We have 60 seconds before warehouse dispatch escalates to leadership!”",
      crisisNarrative:
        "Because the stale sensor cache was not identified, the robot's safety controller assumed an unyielding physical wall is directly ahead, stalling the entire automated sorting line.",
      recoveryActions: [
        {
          id: "r1",
          label: "Execute Remote ROS2 Flush & Sensor Re-weighting",
          description: "Run `ros2 service call /lidar_node/flush_buffer` and elevate ultrasonic confidence weighting to 85%.",
          isCorrect: true,
          resolutionText: "Stale buffer dumped! Sensor fusion re-converged in 1.4s. Bot 402 smoothly disengaged emergency brakes and resumed velocity.",
        },
        {
          id: "r2",
          label: "Send 2 Floor Technicians to Manually Push Robot",
          description: "Physically disconnect drive gears and wheel the 380kg robot off the active sorting corridor.",
          isCorrect: false,
          resolutionText: "Manual intervention breached safety protocols and halted conveyor belt safety trip-switches. Always use remote diagnostic recovery first.",
        },
      ],
      pedagogicalTakeaway:
        "Autonomous vehicle engineers prioritize software sensor-fusion hygiene before assuming mechanical or physical hardware faults.",
    },
    2: {
      optimalHeadline: "Trajectory Hysteresis Engaged: Smooth Dynamic Navigation",
      optimalMetric: {
        label: "Path Recalculation Jitter",
        value: "0.02 Hz Stable",
        delta: "-92% Vibration",
        isPositive: true,
      },
      optimalManagerFeedback:
        "“Flawless! Adding the momentum penalty prevented the pathfinding node from flip-flopping every 50 milliseconds around moving human workers.”",
      suboptimalHeadline: "Path Hunting Oscillation: Motor Inverter Overheating",
      suboptimalMetric: {
        label: "Steering Actuator Strain",
        value: "94°C Thermal Alert",
        delta: "+65% Mechanical Wear",
        isPositive: false,
      },
      suboptimalManagerFeedback:
        "“Priya: The robot is violently trembling between left and right avoidance paths! Stepper motor temperature spiked to 94°C.”",
      crisisNarrative:
        "Without path hysteresis, the A* algorithm recomputes a brand-new trajectory on every single millisecond camera frame, causing extreme steering jitter.",
      recoveryActions: [
        {
          id: "r1",
          label: "Inject Trajectory Momentum & Hysteresis Damping",
          description: "Penalize directional shifts less than 1.5m unless current path cost increases by >30%.",
          isCorrect: true,
          resolutionText: "Vibration ceased instantly. Robot committed to the starboard corridor and safely bypassed workers.",
        },
        {
          id: "r2",
          label: "Double the Stepper Motor Voltage to Force Alignment",
          description: "Overdrive current into actuators to overpower mechanical oscillation.",
          isCorrect: false,
          resolutionText: "Current spike blew the safety fuse on the motor inverter! Hysteresis is an algorithmic problem, not brute power.",
        },
      ],
      pedagogicalTakeaway:
        "Robotics algorithms must bridge abstract mathematics with real mechanical inertia and motor wear limits.",
    },
    3: {
      optimalHeadline: "Digital Twin Canary Passed: 200 Bots Safely Updated",
      optimalMetric: {
        label: "Fleet Reliability Index",
        value: "99.98% Uptime",
        delta: "+14% Efficiency",
        isPositive: true,
      },
      optimalManagerFeedback:
        "“Engineering leadership is thrilled. Your canary staging caught a subtle wheel slip edge-case in Isaac Sim before a single real bot touched the firmware.”",
      suboptimalHeadline: "Catastrophic Firmware Rollout: Fleet-Wide E-Stop",
      suboptimalMetric: {
        label: "Warehouse Down Fleet",
        value: "180 / 200 Bots Frozen",
        delta: "-90% Capacity",
        isPositive: false,
      },
      suboptimalManagerFeedback:
        "“Priya: An untested direct OTA push locked up the flash memory on 180 robots at once. Dispatch operations is halting fulfillment!”",
      crisisNarrative:
        "Unverified global pushes in safety-critical robotics environments risk bricking distributed embedded units across production facilities.",
      recoveryActions: [
        {
          id: "r1",
          label: "Trigger Dual-Bank A/B Firmware Rollback via Canary Gateway",
          description: "Broadcast an authenticated fallback interrupt to switch memory bootloader back to Version 4.1.",
          isCorrect: true,
          resolutionText: "Rollback successful! All 180 units rebooted to stable release 4.1 in 45 seconds.",
        },
        {
          id: "r2",
          label: "Manually Insert USB Flash Drives into Each Robot",
          description: "Walk across the 500,000 sq ft facility with a recovery USB stick.",
          isCorrect: false,
          resolutionText: "Takes 8 hours and causes ₹35 Lakhs in fulfillment delays. Automated dual-bank fail-safes are the proper industry standard.",
        },
      ],
      pedagogicalTakeaway:
        "Tier-1 tech companies evaluate engineers based on their testing discipline and fail-safe rollback architecture.",
    },
  },

  "corporate-law": {
    1: {
      optimalHeadline: "Section 27 Invoked: Founder Non-Compete Stricken",
      optimalMetric: {
        label: "Statutory Enforceability",
        value: "100% Compliant",
        delta: "Complete Shield",
        isPositive: true,
      },
      optimalManagerFeedback:
        "“Brilliant redline! Vikramaditya here: Acquirer's London partners backed down immediately once we cited Delhi High Court Section 27 jurisprudence. Founders are fully protected.”",
      suboptimalHeadline: "Legal Exposure Warning: Unenforceable Restraint Signed",
      suboptimalMetric: {
        label: "Litigation Risk",
        value: "₹45 Cr Injunction Threat",
        delta: "Severe Vulnerability",
        isPositive: false,
      },
      suboptimalManagerFeedback:
        "“Adv. Mitra: Wait! If we allow this blanket restraint into the signing draft, our founders could be dragged into Singapore arbitration the moment they invest in another tech startup.”",
      crisisNarrative:
        "Blanket trade restraints violate statutory public policy under the Indian Contract Act. Leaving them intact invites protracted cross-border litigation.",
      recoveryActions: [
        {
          id: "r1",
          label: "Replace Blanket Restraint with Narrow Goodwill Exception",
          description: "Limit covenant strictly to direct enterprise customers for 24 months, citing Section 27 Exception 1 (Sale of Goodwill).",
          isCorrect: true,
          resolutionText: "Counter-draft accepted! Acquirer legal team conceded and agreed to the narrow 24-month goodwill carve-out.",
        },
        {
          id: "r2",
          label: "Add a Clause Claiming English Law Governs Instead",
          description: "Attempt to circumvent Indian courts by specifying UK jurisdiction for the contract.",
          isCorrect: false,
          resolutionText: "Indian courts refuse foreign jurisdiction clauses when they violate substantive Indian statutory public policy.",
        },
      ],
      pedagogicalTakeaway:
        "Elite corporate lawyers use statutory precedent to protect clients against predatory deal terms without blowing up the transaction.",
    },
    2: {
      optimalHeadline: "Indemnity Capped at 15% with Escrow Ring-Fence",
      optimalMetric: {
        label: "Founder Personal Liability",
        value: "Zero Bankruptcy Risk",
        delta: "₹250 Cr Protected",
        isPositive: true,
      },
      optimalManagerFeedback:
        "“Masterful commercial negotiation. The acquirer agreed to a 15% cap held in escrow for 18 months. Founders keep their personal assets safe.”",
      suboptimalHeadline: "Founder Bankruptcy Peril: Uncapped Indemnity Demanded",
      suboptimalMetric: {
        label: "Uncapped Exposure",
        value: "₹250 Cr Unlimited",
        delta: "Catastrophic Risk",
        isPositive: false,
      },
      suboptimalManagerFeedback:
        "“Vikramaditya: If we accept an uncapped indemnity, a single retrospective GST reassessment 4 years later could wipe out the founders' entire life savings!”",
      crisisNarrative:
        "Uncapped indemnities transfer open-ended commercial risk onto individuals. Top corporate dealmakers strictly ring-fence liability.",
      recoveryActions: [
        {
          id: "r1",
          label: "Structure a De Minimis Basket & 18-Month Sunset Clause",
          description: "Set minimum claim threshold at ₹25 Lakhs, overall cap at ₹37.5 Cr (15%), and expire representations after 18 months.",
          isCorrect: true,
          resolutionText: "Acquirer investment committee signed off on the 15% escrow basket. Founders retain 85% clean liquidity on closing day.",
        },
        {
          id: "r2",
          label: "Tell the Acquirer the Deal is Canceled Immediately",
          description: "Walk away from the ₹250 Cr buyout without offering compromise terms.",
          isCorrect: false,
          resolutionText: "Walking away without counter-proposals destroys deal value. Corporate counsel are deal-makers, not deal-breakers.",
        },
      ],
      pedagogicalTakeaway:
        "Commercial law is the art of balancing transaction speed with airtight risk limitation caps.",
    },
    3: {
      optimalHeadline: "Form FC-TRS Filed on FIRMS: RBI Clean Chit",
      optimalMetric: {
        label: "FEMA Statutory Compliance",
        value: "Zero Compounding Penalty",
        delta: "100% Approved",
        isPositive: true,
      },
      optimalManagerFeedback:
        "“Impeccable regulatory foresight. Foreign inward remittance approved, share certificates issued, and full compliance certificate delivered.”",
      suboptimalHeadline: "FEMA Violation Notice: Enforcement Directorate Risk",
      suboptimalMetric: {
        label: "Statutory Penalty Risk",
        value: "300% of Remittance",
        delta: "Severe Enforcement",
        isPositive: false,
      },
      suboptimalManagerFeedback:
        "“Mitra: Inward foreign funds arrived without FC-TRS registration! We have an impending FEMA non-compliance report with RBI's Foreign Exchange Department.”",
      crisisNarrative:
        "Failing to report cross-border share sales between residents and non-residents within statutory timelines freezes corporate bank accounts.",
      recoveryActions: [
        {
          id: "r1",
          label: "File Immediate Condonation & Form FC-TRS via AD Bank",
          description: "Submit certified valuation report and share transfer deed through Authorized Dealer Bank within the 60-day window.",
          isCorrect: true,
          resolutionText: "AD Bank verified fair value pricing under DCF method. RBI FIRMS acknowledgment generated with zero penalty.",
        },
        {
          id: "r2",
          label: "Transfer the Money into a Personal Savings Account",
          description: "Route the funds into an offshore personal debit card to avoid corporate audits.",
          isCorrect: false,
          resolutionText: "Severe violation of the Prevention of Money Laundering Act (PMLA). Never mix corporate remittances with personal accounts.",
        },
      ],
      pedagogicalTakeaway:
        "Cross-border venture capital and M&A in India hinges on mastery of FEMA, RBI FIRMS, and foreign direct investment regulations.",
    },
  },

  "ux-design": {
    1: {
      optimalHeadline: "Progressive Disclosure Deployed: Drop-Off Plunges",
      optimalMetric: {
        label: "KYC Onboarding Completion",
        value: "86% Merchant Activation",
        delta: "+330% Surge",
        isPositive: true,
      },
      optimalManagerFeedback:
        "“Ananya Roy here: Wow! Breaking the form into 3 bite-sized steps with OCR auto-fill reduced merchant onboarding drop-off from 68% down to 14%. Our regional GMV jumped ₹18L today!”",
      suboptimalHeadline: "Severe Friction: 68% Merchant Drop-Off Persists",
      suboptimalMetric: {
        label: "Acquisition Loss",
        value: "₹24 Lakhs Lost GMV",
        delta: "-68% Drop-off",
        isPositive: false,
      },
      suboptimalManagerFeedback:
        "“Ananya: The churn numbers on Tier 2 cities are disastrous. 7 out of 10 small business owners abandon the app because the 12 English fields look like a tax audit.”",
      crisisNarrative:
        "Cognitive overload and linguistic anxiety cause users to quickly bounce from complex financial apps.",
      recoveryActions: [
        {
          id: "r1",
          label: "Implement 1-Tap Aadhar QR Camera Scanner & Hindi Voice Prompts",
          description: "Replace manual typing with instant camera scan and local dialect audio prompts.",
          isCorrect: true,
          resolutionText: "Completion soared! 91% of rural shopkeepers finished KYC in under 45 seconds using voice guidance.",
        },
        {
          id: "r2",
          label: "Add Red Warning Text: 'Failure to complete will lock your account'",
          description: "Use fear of missing out (FOMO) and intimidation to force compliance.",
          isCorrect: false,
          resolutionText: "Negative reinforcement backfired: Uninstalls surged by 42%. UX is built on clarity and trust, not anxiety.",
        },
      ],
      pedagogicalTakeaway:
        "Product designers leverage cognitive psychology and assistive micro-interactions to empower diverse, non-technical demographics.",
    },
    2: {
      optimalHeadline: "WCAG AAA 7:1 Contrast Passed: Sunlight Usability Confirmed",
      optimalMetric: {
        label: "Outdoor Readability Score",
        value: "99.4% Legible",
        delta: "+85% Usability",
        isPositive: true,
      },
      optimalManagerFeedback:
        "“Sensational! In field testing across vegetable wholesale mandis in Nagpur, merchants could tap buttons effortlessly even in blinding 42°C direct sunlight.”",
      suboptimalHeadline: "Sunlight Glare Invisibility: 82% Failed Tap Rate",
      suboptimalMetric: {
        label: "Field Usability Failure",
        value: "82% Mis-taps",
        delta: "Unusable Outdoors",
        isPositive: false,
      },
      suboptimalManagerFeedback:
        "“Ananya: The field research team in Jaipur reports that light gray buttons completely vanish outdoors. Shopkeepers are hammering the screen in frustration!”",
      crisisNarrative:
        "Designing on high-end color-calibrated MacBooks often blinds designers to real-world budget screen contrast and glare limitations.",
      recoveryActions: [
        {
          id: "r1",
          label: "Adopt High-Contrast Design System with 48dp Minimum Touch Targets",
          description: "Switch to deep slate typography (#0F172A), high-contrast amber buttons (#D97706), and add tactile vibration feedback.",
          isCorrect: true,
          resolutionText: "Display readability verified under 80,000 lux sunlight simulator! Tap error rate dropped from 82% to 1.2%.",
        },
        {
          id: "r2",
          label: "Tell Users to Step Under an Umbrella While Using the App",
          description: "Add a tooltip suggesting users seek shade before continuing.",
          isCorrect: false,
          resolutionText: "Users laughed and uninstalled. Software must adapt to human work environments, not the other way around.",
        },
      ],
      pedagogicalTakeaway:
        "World-class product design is deeply contextual—respecting physical environments, ambient lighting, and hardware diversity.",
    },
    3: {
      optimalHeadline: "A/B Experiment Validated: p = 0.002 Significance",
      optimalMetric: {
        label: "Merchant D-30 Retention",
        value: "74.8% Active",
        delta: "+22.4% Metric Win",
        isPositive: true,
      },
      optimalManagerFeedback:
        "“Executive sign-off achieved! Your 95% confidence interval and cohort analysis proved a ₹4.5 Crore annual revenue uplift. This design token goes company-wide!”",
      suboptimalHeadline: "Invalidated Experiment: Executive Disapproval",
      suboptimalMetric: {
        label: "Statistical Power",
        value: "p = 0.42 (Inconclusive)",
        delta: "Zero Business Proof",
        isPositive: false,
      },
      suboptimalManagerFeedback:
        "“Ananya: The VP of Product rejected our design deck. They said 'Without statistical confidence and cohort retention data, this is just your personal opinion.'”",
      crisisNarrative:
        "Senior tech executives make multi-crore investment decisions based on empirical data, not subjective aesthetic impressions.",
      recoveryActions: [
        {
          id: "r1",
          label: "Run 14-Day Chi-Square Test & Track Day-7 Transaction Cohorts",
          description: "Isolate sample bias, control for weekend seasonality, and compute statistical p-value.",
          isCorrect: true,
          resolutionText: "Data proved Variant B delivered a statistically verified 24% uplift. VP greenlit full company rollout.",
        },
        {
          id: "r2",
          label: "Make a Slide Deck Showing Beautiful Screen Gradients",
          description: "Try to convince management using visual moodboards and color theory.",
          isCorrect: false,
          resolutionText: "Executive teams require financial metrics and user conversion telemetry, not aesthetic theory.",
        },
      ],
      pedagogicalTakeaway:
        "Elite UX architects translate human empathy into concrete, mathematically verified enterprise business growth.",
    },
  },

  medicine: {
    1: {
      optimalHeadline: "Primary Spontaneous Pneumothorax Diagnosed in 45s",
      optimalMetric: {
        label: "Diagnostic Accuracy",
        value: "100% Precision",
        delta: "+40% Triage Speed",
        isPositive: true,
      },
      optimalManagerFeedback:
        "“Dr. Sengupta here: Spot-on clinical instinct! Auscultation and hyper-resonance in an athletic teen are diagnostic hallmarks. You avoided a dangerous misdiagnosis of muscle pull.”",
      suboptimalHeadline: "Misdiagnosis Crisis: Impending Tension Collapse",
      suboptimalMetric: {
        label: "Patient Stability",
        value: "SpO2 Falling to 83%",
        delta: "Acute Deterioration",
        isPositive: false,
      },
      suboptimalManagerFeedback:
        "“Dr. Sengupta: Wait! The patient's left lung is completely collapsed! Dismissing this as a simple strain while SpO2 drops to 83% is putting the boy in acute danger!”",
      crisisNarrative:
        "Failing to recognize absent breath sounds and hyper-resonance delays life-saving pleural space interventions.",
      recoveryActions: [
        {
          id: "r1",
          label: "Immediate Bedside Ultrasound (POCUS) Lung Point Scan",
          description: "Place high-frequency linear probe over 3rd intercostal space to verify absent lung sliding and confirm pneumothorax.",
          isCorrect: true,
          resolutionText: "POCUS revealed classic 'Barcode Sign' with zero lung sliding. Pneumothorax definitively confirmed in 8 seconds!",
        },
        {
          id: "r2",
          label: "Prescribe Oral Ibuprofen and Tell Patient to Rest in Waiting Room",
          description: "Treat for chest wall contusion and re-evaluate in 2 hours.",
          isCorrect: false,
          resolutionText: "Fatal oversight! Patient would have collapsed in the waiting room from tension pneumothorax. Never send dyspneic patients away.",
        },
      ],
      pedagogicalTakeaway:
        "Emergency physicians rely on physical diagnostic skills to catch life-threatening pulmonary emergencies before imaging is even ordered.",
    },
    2: {
      optimalHeadline: "Immediate Needle Thoracostomy: Life Saved!",
      optimalMetric: {
        label: "Patient Hemodynamics",
        value: "BP 118/74 • SpO2 97%",
        delta: "Obstructive Shock Reversed",
        isPositive: true,
      },
      optimalManagerFeedback:
        "“Heroic clinical reflex! You decompressed the 2nd intercostal space immediately. Air hissed out, the trachea recentered, and cardiac output returned to normal within 20 seconds.”",
      suboptimalHeadline: "Cardiac Arrest Alert: Obstructive Shock Collapsing Venous Return",
      suboptimalMetric: {
        label: "Systolic Blood Pressure",
        value: "62/38 mmHg Critical",
        delta: "Severe Shock",
        isPositive: false,
      },
      suboptimalManagerFeedback:
        "“Dr. Sengupta: Code Blue imminent! Mediastinum has shifted, compressing the vena cava! Waiting for radiology when a patient is in obstructive shock will kill them!”",
      crisisNarrative:
        "Tension pneumothorax creates an intra-thoracic pressure valve that kinks great vessels, stopping blood from returning to the heart.",
      recoveryActions: [
        {
          id: "r1",
          label: "Insert 14-Gauge Large-Bore Cannula in 2nd Intercostal Space Mid-Clavicular Line",
          description: "Decompress pressurized pleural air immediately without waiting for any radiology machines.",
          isCorrect: true,
          resolutionText: "Audible rush of trapped air released! Mediastinum snapped back to midline, pulse returned to 88 bpm, BP stabilized to 116/72.",
        },
        {
          id: "r2",
          label: "Wheel Patient to CT Suite on 3rd Floor",
          description: "Push bed onto elevator to obtain cross-sectional tomography.",
          isCorrect: false,
          resolutionText: "The patient arrested in the elevator. In tension pneumothorax, clinical decompression ALWAYS precedes imaging.",
        },
      ],
      pedagogicalTakeaway:
        "In critical trauma care, clinical intervention cannot wait for diagnostic confirmation when hemodynamics are in free fall.",
    },
    3: {
      optimalHeadline: "Boyle's Law Counseling Provided: Mid-Flight Crisis Averted",
      optimalMetric: {
        label: "Patient Safety Prognosis",
        value: "Zero Barotrauma Risk",
        delta: "100% Evidence-Based",
        isPositive: true,
      },
      optimalManagerFeedback:
        "“Dr. Sengupta: Thorough, empathetic medicine. The parents thanked you for explaining Boyle's Law. Flying with residual pneumothorax could have caused a fatal inflight emergency.”",
      suboptimalHeadline: "Flight Clearance Hazard: Mid-Air Atmospheric Barotrauma",
      suboptimalMetric: {
        label: "Inflight Rupture Risk",
        value: "+30% Gas Expansion",
        delta: "Severe Mid-Air Crisis",
        isPositive: false,
      },
      suboptimalManagerFeedback:
        "“Dr. Sengupta: Danger! At cruising altitude (8,000 ft cabin altitude), trapped pleural air pockets expand by 30%. Re-tension mid-air without medical tools is catastrophic.”",
      crisisNarrative:
        "Boyle's Law ($P_1V_1 = P_2V_2$) dictates that as cabin atmospheric pressure drops, residual trapped gas pockets expand rapidly inside body cavities.",
      recoveryActions: [
        {
          id: "r1",
          label: "Schedule Post-Discharge High-Res CT & Ground Travel for Tournament",
          description: "Mandate 14-day flight abstinence with ultrasound checkup, authorizing train travel to tournament instead.",
          isCorrect: true,
          resolutionText: "Family accepted ground travel plan safely. Repeat scan at Day 14 confirmed 100% pleurodesis without residual air.",
        },
        {
          id: "r2",
          label: "Tell Family to Open Plane Window if Patient Feels Chest Pain",
          description: "Provide unscientific advice regarding aircraft cabin pressure.",
          isCorrect: false,
          resolutionText: "Pressurized aircraft windows cannot be opened. Evidence-based medicine relies on strict aviation barotrauma guidelines.",
        },
      ],
      pedagogicalTakeaway:
        "Master clinicians translate foundational physics principles (Boyle's Law) into life-saving discharge counseling.",
    },
  },

  finance: {
    1: {
      optimalHeadline: "Real After-Tax Inflation Analysis Completed",
      optimalMetric: {
        label: "Client Purchasing Power",
        value: "+13.2% Real Growth",
        delta: "Capital Protected",
        isPositive: true,
      },
      optimalManagerFeedback:
        "“Kavita Krishnamurthy here: Exceptional wealth strategy! Showing the patriarch that a 7% bank FD yields -1.73% after 39% tax and 6% CPI opened his eyes to intelligent asset allocation.”",
      suboptimalHeadline: "Silent Wealth Erosion: 100% Cash Drag Warning",
      suboptimalMetric: {
        label: "Real Wealth Depletion",
        value: "-₹1.73 Lakhs / Cr / Yr",
        delta: "Purchasing Power Loss",
        isPositive: false,
      },
      suboptimalManagerFeedback:
        "“Kavita: If we leave ₹10 Crores sitting in bank FDs, the family will lose over ₹1.2 Crores in real purchasing power over 7 years due to inflation and tax drag!”",
      crisisNarrative:
        "Nominal yields create a dangerous illusion of safety. High net-worth portfolios must outpace the combined drag of tax slabs and consumer inflation.",
      recoveryActions: [
        {
          id: "r1",
          label: "Present Multi-Asset Matrix (Equity, Sovereign Gold Bonds, Arbitrage)",
          description: "Demonstrate how tax-efficient debt arbitrage funds and SGBs beat fixed deposits while preserving capital.",
          isCorrect: true,
          resolutionText: "Patriarch reviewed the comparative tax schedule and agreed to allocate ₹6 Crores into tax-advantaged hybrid structures.",
        },
        {
          id: "r2",
          label: "Tell Client to Put Everything into Unregulated Crypto Memecoins",
          description: "Promise 100x speculative returns to beat inflation.",
          isCorrect: false,
          resolutionText: "Catastrophic breach of SEBI fiduciary duties! Wealth management is based on calculated risk-adjusted allocation, not gambling.",
        },
      ],
      pedagogicalTakeaway:
        "Quantitative wealth managers evaluate portfolios on real post-tax purchasing power rather than nominal headline bank rates.",
    },
    2: {
      optimalHeadline: "LRS Currency Hedge Active: US Tuition Protected",
      optimalMetric: {
        label: "USD/INR Depletion Protection",
        value: "100% FX Hedged",
        delta: "+4% Annual FX Alpha",
        isPositive: true,
      },
      optimalManagerFeedback:
        "“Kavita: Strategically flawless! Using the RBI LRS window to allocate $250,000 into global index funds ensures the grandchildren's university tuition is fully dollar-hedged.”",
      suboptimalHeadline: "Foreign Exchange Shock Hazard: Unhedged Rupee Slippage",
      suboptimalMetric: {
        label: "College Tuition Deficit",
        value: "₹65 Lakhs Shortfall Risk",
        delta: "3-4% Annual INR Slide",
        isPositive: false,
      },
      suboptimalManagerFeedback:
        "“Kavita: The rupee depreciates against the dollar by ~3.5% annually. If foreign tuition is funded purely in INR, the family will face a massive funding deficit in Year 7!”",
      crisisNarrative:
        "Future liabilities denominated in foreign currencies must be matched with currency-hedged assets to eliminate exchange rate shocks.",
      recoveryActions: [
        {
          id: "r1",
          label: "Execute Systematic LRS Remittance into Broad US Index ETFs",
          description: "Dollar-cost average quarterly transfers under RBI's $250,000 per person annual quota into S&P 500 index funds.",
          isCorrect: true,
          resolutionText: "Currency hedge fully active. When the dollar rose, the education fund appreciation matched university tuition inflation perfectly.",
        },
        {
          id: "r2",
          label: "Buy Foreign Currency Cash on the Black Market",
          description: "Store physical paper dollar notes in home lockers.",
          isCorrect: false,
          resolutionText: "Violates FEMA and anti-money laundering laws. Legitimate wealth management uses regulated RBI LRS channels.",
        },
      ],
      pedagogicalTakeaway:
        "Global portfolio planners match currency asset liability timing to shield multi-generational families from macroeconomic shocks.",
    },
    3: {
      optimalHeadline: "Disciplined Rebalancing Enforced: ₹1.4 Cr Alpha Captured",
      optimalMetric: {
        label: "Market Correction Alpha",
        value: "+18.4% Long-Term CAGR",
        delta: "Emotional Discipline Win",
        isPositive: true,
      },
      optimalManagerFeedback:
        "“Kavita: Masterful behavioral finance leadership! Rebalancing out of debt into depressed equities during the panic created substantial wealth once markets rebounded.”",
      suboptimalHeadline: "Panic Liquidation Disaster: Paper Loss Made Permanent",
      suboptimalMetric: {
        label: "Permanent Capital Loss",
        value: "-₹1.8 Crores Locked",
        delta: "Panic Selling Trap",
        isPositive: false,
      },
      suboptimalManagerFeedback:
        "“Kavita: Warning! Panic-selling at market lows locks in temporary cyclical drawdowns as irreversible permanent capital destruction!”",
      crisisNarrative:
        "Retail investors frequently surrender to panic at the bottom of market cycles. Elite wealth advisors act as emotional anchors.",
      recoveryActions: [
        {
          id: "r1",
          label: "Enforce Pre-Committed Asset Allocation Band Rebalancing",
          description: "Show client 20-year rolling returns data proving that bear markets have always represented the best buying opportunities.",
          isCorrect: true,
          resolutionText: "Client calm restored! Rebalanced 10% debt into quality large-cap equity. Portfolio surged 34% over the subsequent 18 months.",
        },
        {
          id: "r2",
          label: "Blame the Government and Tell Client to Hide Cash",
          description: "Validate client panic and confirm the world financial system is collapsing.",
          isCorrect: false,
          resolutionText: "Unprofessional and destructive. Advisors provide objective historical data, not emotional confirmation bias.",
        },
      ],
      pedagogicalTakeaway:
        "The highest economic value of a wealth manager is preventing client behavioral panic during temporary market drawdowns.",
    },
  },

  media: {
    1: {
      optimalHeadline: "Visual Pattern Interrupt Deployed: 84% 3-Sec Hold Rate",
      optimalMetric: {
        label: "First 3-Second Retention",
        value: "84.2% Viewer Hold",
        delta: "+48% Over Industry Avg",
        isPositive: true,
      },
      optimalManagerFeedback:
        "“Zubin Mehta here: Phenomenal! Starting with the burning synthetic fast-fashion garment hook stopped scrollers dead in their tracks. The algorithmic velocity is exploding!”",
      suboptimalHeadline: "Scenic Intro Drop-Off: 71% Swiped Away",
      suboptimalMetric: {
        label: "Early Viewer Churn",
        value: "71% Swiped in 2 Sec",
        delta: "Algorithmic Death",
        isPositive: false,
      },
      suboptimalManagerFeedback:
        "“Zubin: The slow 8-second landscape drone shot killed the video. On mobile feeds, users decide in 1.2 seconds whether to swipe. We lost the entire audience!”",
      crisisNarrative:
        "Modern digital audiences have infinite content options. Slow narrative exposition in short-form content results in immediate algorithmic suppression.",
      recoveryActions: [
        {
          id: "r1",
          label: "Re-edit Opening: Cold Open with Shocking Stat & Macro Fabric Close-up",
          description: "Cut directly to split-screen: 'This ₹499 fast fashion shirt will sit in an Indian landfill for 200 years. Here is the artisan alternative.'",
          isCorrect: true,
          resolutionText: "Hold rate jumped from 29% to 81%! Algorithm detected high retention and pushed video onto Discover trending feeds.",
        },
        {
          id: "r2",
          label: "Pay Influencers to Tell Followers Not to Swipe Away",
          description: "Add a celebrity asking viewers to please watch till the end.",
          isCorrect: false,
          resolutionText: "Pleading for attention irritates mobile users and increases drop-off. Great content hooks curiosity naturally.",
        },
      ],
      pedagogicalTakeaway:
        "Creative directors in modern media balance cinematic craft with algorithmic viewer psychology and hook retention data.",
    },
    2: {
      optimalHeadline: "3-Act Emotional Resonance: 68% Watch-Through Rate",
      optimalMetric: {
        label: "Full Completion Rate",
        value: "68.4% Completed",
        delta: "+3.2x Organic Shares",
        isPositive: true,
      },
      optimalManagerFeedback:
        "“Zubin: That handloom weaver contrast in Maheshwar hit right in the heart. Comments are overflowing with emotional Gen Z praise and organic shares!”",
      suboptimalHeadline: "Preachy Lecture Tone: High Comment Backlash",
      suboptimalMetric: {
        label: "Audience Sentiment",
        value: "54% Dislike Ratio",
        delta: "Negative Brand Perception",
        isPositive: false,
      },
      suboptimalManagerFeedback:
        "“Zubin: The rough cut came off as preachy and guilt-tripping. Gen Z doesn't like being lectured—they want inspiring authentic stories!”",
      crisisNarrative:
        "Social cause campaigns fail when they induce guilt instead of inspiring pride and aesthetic agency.",
      recoveryActions: [
        {
          id: "r1",
          label: "Shift Narrative to Celebrating Heritage Artisan Craftsmanship",
          description: "Re-frame khadi not as a sacrifice, but as bespoke sustainable luxury crafted by master Indian generational weavers.",
          isCorrect: true,
          resolutionText: "Sentiment reversed! Engagement ratio hit 96% positive, and the sustainable fashion line sold out in 3 days.",
        },
        {
          id: "r2",
          label: "Disable Comments and Delete Negative Feedback",
          description: "Hide user comments to avoid looking bad.",
          isCorrect: false,
          resolutionText: "Silencing audiences destroys brand authenticity and triggers public PR boycotts.",
        },
      ],
      pedagogicalTakeaway:
        "Compelling brand storytelling inspires aspirational pride rather than weaponizing moral guilt.",
    },
    3: {
      optimalHeadline: "Algorithmic Audio Sync: 4.8 Million Organic Impressions",
      optimalMetric: {
        label: "Viral Reach Multiplier",
        value: "4.8M Organic Views",
        delta: "Zero Paid Ad Spend",
        isPositive: true,
      },
      optimalManagerFeedback:
        "“Zubin: Incredible campaign wrap-up! By syncing visual beat cuts to trending regional indie instruments, the video became a viral template across 12,000 creators.”",
      suboptimalHeadline: "Flat Pacing: Algorithm Drops Impression Feed",
      suboptimalMetric: {
        label: "Reach Stagnation",
        value: "1,200 Impressions Cap",
        delta: "Distribution Halted",
        isPositive: false,
      },
      suboptimalManagerFeedback:
        "“Zubin: The background audio was generic royalty-free elevator jazz. The recommendation engine categorizes the content as low engagement!”",
      crisisNarrative:
        "Audio design on short-form platforms accounts for up to 60% of emotional engagement and algorithmic recommendation scoring.",
      recoveryActions: [
        {
          id: "r1",
          label: "Remaster with Fast-Paced Rhythmic Folk Percussion & Kinetic Typography",
          description: "Align visual frame transitions strictly with rhythmic percussion beats (128 BPM) and bold kinetic captions.",
          isCorrect: true,
          resolutionText: "Average watch time doubled! Algorithm triggered secondary distribution wave to 2.4 million additional users.",
        },
        {
          id: "r2",
          label: "Buy Fake Bot Views from Online Click Farms",
          description: "Artificially inflate view counters to trick the algorithm.",
          isCorrect: false,
          resolutionText: "Algorithm detected bot traffic and shadow-banned the channel account. Never fake engagement metrics.",
        },
      ],
      pedagogicalTakeaway:
        "Digital content creators must master sound design, pacing rhythm, and platform distribution mechanics to achieve breakout viral reach.",
    },
  },
};

/* ─── Main Component ─────────────────────────────── */
interface ConsequenceBranchingProps {
  trackId: string;
  missionId: number;
  selectedOptionIdx: number | null;
  isCorrect: boolean;
  onAdvance: () => void;
  isLastMission: boolean;
  onResilienceEarned?: () => void;
}

export default function ConsequenceBranching({
  trackId,
  missionId,
  selectedOptionIdx,
  isCorrect,
  onAdvance,
  isLastMission,
  onResilienceEarned,
}: ConsequenceBranchingProps) {
  const [selectedRecoveryId, setSelectedRecoveryId] = useState<string | null>(null);
  const [isRecoveryResolved, setIsRecoveryResolved] = useState<boolean>(false);
  const [recoveryFeedback, setRecoveryFeedback] = useState<string>("");

  const trackData = CONSEQUENCE_REGISTRY[trackId] || CONSEQUENCE_REGISTRY["ai-robotics"];
  const consequence = trackData[missionId] || trackData[1];

  // Play audio chime when consequence is first displayed
  React.useEffect(() => {
    if (selectedOptionIdx !== null) {
      if (isCorrect) {
        playBranchChime("success");
      } else {
        playBranchChime("crisis");
      }
    }
  }, [selectedOptionIdx, isCorrect]);

  const handleSelectRecovery = (action: ConsequenceRecoveryAction) => {
    setSelectedRecoveryId(action.id);
    if (action.isCorrect) {
      playBranchChime("recovery");
      setIsRecoveryResolved(true);
      setRecoveryFeedback(action.resolutionText);
      if (onResilienceEarned) {
        onResilienceEarned();
      }
    } else {
      playBranchChime("crisis");
      setIsRecoveryResolved(false);
      setRecoveryFeedback(action.resolutionText);
    }
  };

  if (selectedOptionIdx === null) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      className="mt-6 space-y-4"
    >
      {/* ─── Branch A: Optimal Choice (Mastery State) ─── */}
      {isCorrect ? (
        <div className="overflow-hidden rounded-3xl border border-emerald-300 bg-gradient-to-br from-emerald-50/90 via-white to-teal-50/70 p-6 sm:p-7 shadow-md">
          {/* Header Badge */}
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-xl bg-emerald-600 text-white shadow-sm">
                <Check className="h-4 w-4" />
              </span>
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">
                Real-World Consequence: Optimal Protocol Executed
              </span>
            </div>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100/90 px-3 py-1 text-[11px] font-bold text-emerald-800">
              <Zap className="h-3 w-3 text-emerald-600" />
              +25 Mastery Points
            </span>
          </div>

          {/* Consequence Headline */}
          <h4 className="mt-3 font-display text-lg sm:text-xl font-bold text-gray-900 leading-snug">
            {consequence.optimalHeadline}
          </h4>

          {/* Measurable Real-World Impact Card */}
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="rounded-2xl border border-emerald-200/80 bg-white/90 p-3.5 shadow-xs">
              <span className="text-[11px] font-bold uppercase tracking-wider text-gray-500">
                Industry Metric Impact
              </span>
              <div className="mt-1 flex items-baseline gap-2">
                <span className="font-display text-xl font-black text-gray-900">
                  {consequence.optimalMetric.value}
                </span>
                <span className="flex items-center text-xs font-bold text-emerald-600">
                  <TrendingUp className="h-3.5 w-3.5 mr-0.5" />
                  {consequence.optimalMetric.delta}
                </span>
              </div>
              <p className="mt-0.5 text-[11px] text-gray-500 font-medium">
                {consequence.optimalMetric.label}
              </p>
            </div>

            <div className="rounded-2xl border border-emerald-200/80 bg-white/90 p-3.5 shadow-xs flex flex-col justify-center">
              <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700 flex items-center gap-1">
                <ShieldCheck className="h-3.5 w-3.5" />
                Operational Status
              </span>
              <p className="mt-1 text-xs font-semibold text-gray-800">
                Stable • Greenlit for Scale
              </p>
              <p className="text-[11px] text-gray-500">All fail-safes verified</p>
            </div>
          </div>

          {/* Manager Direct Quote */}
          <div className="mt-4 rounded-2xl border border-emerald-100 bg-emerald-50/60 p-4">
            <div className="flex items-center gap-2 text-[11px] font-bold text-emerald-900 mb-1">
              <MessageSquare className="h-3.5 w-3.5 text-emerald-700" />
              <span>Executive Mentor Feedback:</span>
            </div>
            <p className="text-xs sm:text-sm text-emerald-950 leading-relaxed italic">
              {consequence.optimalManagerFeedback}
            </p>
          </div>

          {/* Pedagogical Takeaway */}
          <div className="mt-4 border-t border-emerald-200/60 pt-3 flex items-start gap-2 text-xs text-gray-700">
            <Sparkles className="h-4 w-4 shrink-0 text-emerald-600 mt-0.5" />
            <div>
              <span className="font-bold text-gray-900">Professional Rationale: </span>
              {consequence.pedagogicalTakeaway}
            </div>
          </div>

          {/* Advance Button */}
          <button
            onClick={onAdvance}
            className="mt-5 flex w-full cursor-pointer items-center justify-center gap-2 rounded-2xl bg-emerald-600 py-3.5 font-display text-sm font-bold text-white shadow-lg shadow-emerald-600/25 transition-all hover:bg-emerald-700 active:scale-[0.98]"
          >
            <span>
              {isLastMission
                ? "Generate Verified Simulation Report"
                : "Advance to Next Workplace Phase"}
            </span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      ) : (
        /* ─── Branch B: Suboptimal Choice (Crisis & Recovery Branch) ─── */
        <div className="overflow-hidden rounded-3xl border border-amber-300 bg-gradient-to-br from-amber-50/90 via-white to-orange-50/70 p-6 sm:p-7 shadow-md">
          {/* Header Alert Badge */}
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-xl bg-amber-500 text-white shadow-sm animate-bounce">
                <AlertTriangle className="h-4 w-4" />
              </span>
              <span className="text-xs font-bold uppercase tracking-wider text-amber-900">
                Workplace Consequence: Friction / Escalation Triggered
              </span>
            </div>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-200/80 px-3 py-1 text-[11px] font-bold text-amber-900">
              <Activity className="h-3 w-3 text-amber-700" />
              Active Incident
            </span>
          </div>

          {/* Consequence Headline */}
          <h4 className="mt-3 font-display text-lg sm:text-xl font-bold text-gray-900 leading-snug">
            {consequence.suboptimalHeadline}
          </h4>

          {/* Real-World Risk Metric */}
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="rounded-2xl border border-amber-200 bg-white/90 p-3.5 shadow-xs">
              <span className="text-[11px] font-bold uppercase tracking-wider text-gray-500">
                Immediate Downside Exposure
              </span>
              <div className="mt-1 flex items-baseline gap-2">
                <span className="font-display text-xl font-black text-red-600">
                  {consequence.suboptimalMetric.value}
                </span>
                <span className="flex items-center text-xs font-bold text-red-500">
                  <TrendingDown className="h-3.5 w-3.5 mr-0.5" />
                  {consequence.suboptimalMetric.delta}
                </span>
              </div>
              <p className="mt-0.5 text-[11px] text-gray-500 font-medium">
                {consequence.suboptimalMetric.label}
              </p>
            </div>

            <div className="rounded-2xl border border-amber-200 bg-white/90 p-3.5 shadow-xs flex flex-col justify-center">
              <span className="text-[11px] font-bold uppercase tracking-wider text-amber-800 flex items-center gap-1">
                <ShieldAlert className="h-3.5 w-3.5 text-amber-600" />
                Root Cause Analysis
              </span>
              <p className="mt-1 text-xs text-gray-700 leading-snug">
                {consequence.crisisNarrative}
              </p>
            </div>
          </div>

          {/* Manager Direct Feedback */}
          <div className="mt-4 rounded-2xl border border-amber-200 bg-amber-50/70 p-4">
            <div className="flex items-center gap-2 text-[11px] font-bold text-amber-900 mb-1">
              <MessageSquare className="h-3.5 w-3.5 text-amber-700" />
              <span>Urgent Dispatch from Manager:</span>
            </div>
            <p className="text-xs sm:text-sm text-amber-950 leading-relaxed italic">
              {consequence.suboptimalManagerFeedback}
            </p>
          </div>

          {/* Interactive Multi-Turn Recovery Decision (Mastery Resilience) */}
          <div className="mt-5 rounded-2xl border border-orange-200/90 bg-white p-5 shadow-xs">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Wrench className="h-4 w-4 text-orange-600" />
                <span className="text-xs font-bold uppercase tracking-wider text-orange-950">
                  Rapid Workplace Counter-Measure
                </span>
              </div>
              <span className="text-[11px] font-bold text-gray-400">
                Resilience Turn
              </span>
            </div>
            <p className="mt-1.5 text-xs text-gray-600">
              In real top-tier workplaces, professionals are measured by how quickly they troubleshoot mistakes. Choose your immediate emergency response:
            </p>

            {/* Recovery Action Options */}
            <div className="mt-3.5 space-y-2.5">
              {consequence.recoveryActions.map((action) => {
                const isSelected = selectedRecoveryId === action.id;
                let btnBorder = "border-gray-200 hover:border-orange-400 hover:bg-orange-50/40 bg-white";
                if (isSelected) {
                  btnBorder = action.isCorrect
                    ? "border-emerald-500 bg-emerald-50/80 text-emerald-950"
                    : "border-red-400 bg-red-50/80 text-red-950";
                }

                return (
                  <button
                    key={action.id}
                    onClick={() => handleSelectRecovery(action)}
                    disabled={isRecoveryResolved}
                    className={`w-full text-left rounded-xl border p-3.5 transition-all cursor-pointer ${btnBorder}`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <span className="text-xs font-bold text-gray-900">
                        {action.label}
                      </span>
                      {isSelected && action.isCorrect && (
                        <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-600 text-white text-[10px]">
                          <Check className="h-3 w-3" />
                        </span>
                      )}
                    </div>
                    <p className="mt-1 text-[11px] text-gray-600 leading-relaxed">
                      {action.description}
                    </p>
                  </button>
                );
              })}
            </div>

            {/* Recovery Resolution Banner */}
            <AnimatePresence>
              {selectedRecoveryId && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="mt-3 pt-3 border-t border-gray-100"
                >
                  <div
                    className={`rounded-xl p-3 text-xs leading-relaxed ${
                      isRecoveryResolved
                        ? "bg-emerald-50 border border-emerald-200 text-emerald-900"
                        : "bg-red-50 border border-red-200 text-red-900"
                    }`}
                  >
                    <div className="flex items-center gap-1.5 font-bold mb-1">
                      {isRecoveryResolved ? (
                        <>
                          <Award className="h-4 w-4 text-emerald-600" />
                          <span>Incident Resolved • Resilient Solver Badge Earned (+15 pts)</span>
                        </>
                      ) : (
                        <>
                          <AlertTriangle className="h-4 w-4 text-red-600" />
                          <span>Suboptimal Protocol • Review Industry Standard Below</span>
                        </>
                      )}
                    </div>
                    <p className="text-[11px]">{recoveryFeedback}</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Pedagogical Takeaway */}
          <div className="mt-4 border-t border-amber-200/60 pt-3 flex items-start gap-2 text-xs text-gray-700">
            <Sparkles className="h-4 w-4 shrink-0 text-amber-600 mt-0.5" />
            <div>
              <span className="font-bold text-gray-900">Key Professional Takeaway: </span>
              {consequence.pedagogicalTakeaway}
            </div>
          </div>

          {/* Advance Button */}
          <button
            onClick={onAdvance}
            className="mt-5 flex w-full cursor-pointer items-center justify-center gap-2 rounded-2xl bg-orange-600 py-3.5 font-display text-sm font-bold text-white shadow-lg shadow-orange-600/25 transition-all hover:bg-orange-700 active:scale-[0.98]"
          >
            <span>
              {isLastMission
                ? "Generate Verified Simulation Report"
                : "Advance to Next Mission"}
            </span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      )}
    </motion.div>
  );
}
