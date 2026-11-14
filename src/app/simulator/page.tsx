"use client";

import { useState, useMemo, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  Cpu,
  Scale,
  Palette,
  Stethoscope,
  TrendingUp,
  Film,
  ArrowRight,
  ArrowLeft,
  Clock,
  Zap,
  Trophy,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Sparkles,
  Star,
  Search,
  BookOpen,
  Briefcase,
  GraduationCap,
  IndianRupee,
  ShieldCheck,
  ChevronRight,
  Share2,
  Award,
  Layers,
  Flame,
  Check,
  Users,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import {
  RoboticsTactileWidget,
  LawTactileWidget,
  UXTactileWidget,
  MedicineTactileWidget,
  FinanceTactileWidget,
  MediaTactileWidget,
} from "@/components/simulator/TactileWidgets";
import WorkplaceFeed from "@/components/simulator/WorkplaceFeed";
import ConsequenceBranching from "@/components/simulator/ConsequenceBranching";
import ParentDossier from "@/components/simulator/ParentDossier";
import { useUserProfile } from "@/context/UserProfileContext";
import { useScrollLock } from "@/hooks/useScrollLock";
import PtiroMascot from "@/components/PtiroMascot";

const easeOutExpo = [0.16, 1, 0.3, 1] as const;

/* ─── Simulation Data Models ───────────────────── */

interface MissionQuestion {
  id: number;
  phase: string;
  contextHeader: string;
  visualArtifactType?: "code" | "contract" | "vitals" | "ux" | "finance" | "media";
  visualArtifactContent?: string;
  prompt: string;
  options: {
    text: string;
    isCorrect: boolean;
    explanation: string;
  }[];
  pedagogicalTakeaway: string;
}

interface CareerTrack {
  id: string;
  category: "tech" | "law" | "design" | "health" | "business" | "media";
  categoryLabel: string;
  title: string;
  tagline: string;
  icon: LucideIcon;
  color: string;
  bgGradient: string;
  lightBg: string;
  salaryRange: string;
  growthRate: string;
  recommendedStreams: string[];
  keyExams: string[];
  duration: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  companyName: string;
  companyRole: string;
  companyMission: string;
  dayInTheLife: {
    time: string;
    task: string;
  }[];
  missions: MissionQuestion[];
  competencies: {
    name: string;
    weight: number;
  }[];
}

/* ─── 6 Deep Authentic Indian Career Tracks ────── */

const CAREER_TRACKS: CareerTrack[] = [
  {
    id: "ai-robotics",
    category: "tech",
    categoryLabel: "Technology & AI",
    title: "AI & Autonomous Robotics",
    tagline: "Build neural algorithms that navigate physical worlds",
    icon: Cpu,
    color: "#6366F1",
    bgGradient: "from-indigo-600 via-indigo-500 to-purple-600",
    lightBg: "bg-indigo-50 border-indigo-200 text-indigo-700",
    salaryRange: "₹12 – 35 LPA",
    growthRate: "+32% Annual Demand",
    recommendedStreams: ["PCM with Computer Science", "AI & Robotics Electives"],
    keyExams: ["JEE Main / Advanced", "BITS AT", "GATE (AI & DS)"],
    duration: "3 mins",
    difficulty: "Intermediate",
    companyName: "Garuda Autonomous Systems • Bengaluru Lab",
    companyRole: "Junior Robotics Algorithm Specialist",
    companyMission:
      "A fleet of autonomous logistics robots inside a mega fulfilment center in Pune is encountering critical obstacle-detection stalls during peak sorting hours.",
    dayInTheLife: [
      { time: "09:30 AM", task: "Review overnight telemetry data & lidar point-cloud accuracy from warehouse test runs." },
      { time: "11:45 AM", task: "Optimize ROS2 pathfinding node to reduce latency around dynamically moving forklifts." },
      { time: "03:15 PM", task: "Run hardware-in-the-loop (HIL) simulation to test emergency braking under low-light sensor conditions." },
      { time: "05:30 PM", task: "Collaborate with mechanical engineers to calibrate camera mount vibration damping." },
    ],
    competencies: [
      { name: "Algorithmic Logic", weight: 95 },
      { name: "Hardware Integration", weight: 88 },
      { name: "Fault Diagnostics", weight: 92 },
      { name: "Optimization Acuity", weight: 85 },
    ],
    missions: [
      {
        id: 1,
        phase: "Phase 1: Incident Diagnosis",
        contextHeader: "ROS2 Telemetry Log #4092",
        visualArtifactType: "code",
        visualArtifactContent: `[WARN] [obstacle_tracker]: Ultrasonic sensor: OK (0.84m)
[WARN] [obstacle_tracker]: LiDAR node: 0 reflections received (stale buffer)
[ERROR] [motion_controller]: Emergency brake engaged - Obstacle detected at (x: 1.2m, y: 0.0m)
[INFO] Visual camera feed: CLEAR PATH ahead. No physical obstruction.`,
        prompt:
          "The warehouse robot suddenly halts with an emergency brake, but the camera feed shows a completely empty aisle. What is the root cause of this ghost obstacle?",
        options: [
          {
            text: "The motors have overheated and triggered thermal shutdown.",
            isCorrect: false,
            explanation: "Motor shutdown wouldn't report an obstacle at coordinates (1.2m, 0.0m) from the sensor tracker.",
          },
          {
            text: "Sensor fusion failure: LiDAR node is reading a stale buffer while ultrasonic sensors report conflicting close-range reflections.",
            isCorrect: true,
            explanation: "Spot-on! In autonomous robotics, when one sensor crashes or sends stale cached packets, naive sensor fusion algorithms treat stale data as active obstacles.",
          },
          {
            text: "The battery voltage dropped below safety threshold.",
            isCorrect: false,
            explanation: "Low battery triggers return-to-dock protocol, not emergency obstacle collision brakes.",
          },
        ],
        pedagogicalTakeaway:
          "Autonomous systems engineers must master sensor fusion (Kalman Filters) — combining camera, LiDAR, and IMU data to prevent false positives.",
      },
      {
        id: 2,
        phase: "Phase 2: Algorithm Fix",
        contextHeader: "Pathfinding Node Optimization",
        visualArtifactType: "code",
        visualArtifactContent: `// A* Cost Calculation Function
function calculatePathCost(currentNode, targetNode) {
    let distanceCost = euclideanDistance(currentNode, targetNode);
    // TODO: Weigh dynamic obstacle confidence score
    return distanceCost * obstacleConfidence;
}`,
        prompt:
          "When moving through aisles with transient workers, the robot frequently oscillates between two alternative paths. How do robotics engineers fix this path jitter?",
        options: [
          {
            text: "Increase robot velocity so it shoots through the aisle faster.",
            isCorrect: false,
            explanation: "Increasing speed dramatically raises safety hazards in industrial environments.",
          },
          {
            text: "Implement a Path Hysteresis / Momentum penalty so the robot prefers staying on its current committed trajectory.",
            isCorrect: true,
            explanation: "Brilliant! Adding hysteresis ensures small momentary cost differences don't cause erratic back-and-forth oscillations.",
          },
          {
            text: "Disable path recalculation and only calculate the route once at startup.",
            isCorrect: false,
            explanation: "Static paths cannot adapt to moving people or sudden obstacles.",
          },
        ],
        pedagogicalTakeaway:
          "Mathematical optimization and stability control are the backbone of modern robotics and autonomous vehicle engineering.",
      },
      {
        id: 3,
        phase: "Phase 3: Production Deployment",
        contextHeader: "Pre-Flight Verification Protocol",
        prompt:
          "Before uploading your firmware update to 200 robots operating in the Pune warehouse, what is the mandatory industry-standard testing sequence?",
        options: [
          {
            text: "Push directly via Over-The-Air (OTA) update at night when human workers are absent.",
            isCorrect: false,
            explanation: "Direct production pushes without staged verification risk catastrophic fleet failure.",
          },
          {
            text: "Digital Twin simulation → Single isolated robot staging pen test → Canary rollout to 5% of fleet with rollback trigger.",
            isCorrect: true,
            explanation: "Exactly right! Digital twin simulation (Gazebo/Isaac Sim) followed by a physical canary test is the gold standard for robotics deployments.",
          },
          {
            text: "Print the code diff and get physical signatures from all warehouse floor managers.",
            isCorrect: false,
            explanation: "Managerial sign-off is administrative, not empirical technical validation.",
          },
        ],
        pedagogicalTakeaway:
          "Top tech companies prize engineers who understand safety-critical deployment lifecycles and Digital Twin testing.",
      },
    ],
  },
  {
    id: "corporate-law",
    category: "law",
    categoryLabel: "Law & Public Policy",
    title: "Corporate Mergers & Contract Law",
    tagline: "Structure high-value deals and protect legal integrity",
    icon: Scale,
    color: "#0EA5E9",
    bgGradient: "from-sky-600 via-blue-600 to-indigo-700",
    lightBg: "bg-sky-50 border-sky-200 text-sky-700",
    salaryRange: "₹15 – 45 LPA",
    growthRate: "+28% Commercial Practice",
    recommendedStreams: ["Humanities or Commerce", "Open to All Streams"],
    keyExams: ["CLAT (National Law Universities)", "AILET", "SLAT"],
    duration: "3 mins",
    difficulty: "Intermediate",
    companyName: "Khaitan & Mitra Legal Partners • Mumbai",
    companyRole: "Associate Corporate Counsel",
    companyMission:
      "A fast-growing Indian SaaS startup is being acquired by a multinational tech conglomerate for ₹250 Crores. You must inspect the Share Purchase Agreement (SPA).",
    dayInTheLife: [
      { time: "09:00 AM", task: "Examine redline markups on Intellectual Property indemnity clauses." },
      { time: "11:30 AM", task: "Join negotiation call between startup founders and acquirer's London legal team." },
      { time: "02:45 PM", task: "Analyze Competition Commission of India (CCI) threshold limits for merger notification." },
      { time: "05:00 PM", task: "Draft founder escrow retention milestones and non-solicitation schedules." },
    ],
    competencies: [
      { name: "Statutory Precision", weight: 96 },
      { name: "Risk Mitigation", weight: 94 },
      { name: "Negotiation Acuity", weight: 89 },
      { name: "Ethical Foresight", weight: 91 },
    ],
    missions: [
      {
        id: 1,
        phase: "Phase 1: Restrictive Covenants Analysis",
        contextHeader: "SPA Draft Clause 14.2 (Non-Compete)",
        visualArtifactType: "contract",
        visualArtifactContent: `"Clause 14.2: The Founders undertake that for a period of 8 (eight) years from Closing Date, they shall not directly or indirectly engage in, advise, or invest in any business activity related to software, internet technologies, or cloud platforms across the territory of India."`,
        prompt:
          "Under Indian Contract Act, 1872, what is the enforceability status of this 8-year nationwide blanket non-compete clause against the founders?",
        options: [
          {
            text: "Completely enforceable because both parties signed with mutual consent.",
            isCorrect: false,
            explanation: "Mutual consent cannot override statutory law. Section 27 explicitly bars agreements in restraint of trade.",
          },
          {
            text: "Void and unenforceable under Section 27 of the Indian Contract Act; post-employment/post-exit blanket trade restraints are prohibited by Indian courts.",
            isCorrect: true,
            explanation: "Spot-on! Unlike US law where non-competes are often enforced with 'blue-penciling', Indian courts strictly hold post-exit restraints void unless narrowly covered under sale of goodwill exceptions.",
          },
          {
            text: "Enforceable only if approved by the Ministry of Corporate Affairs.",
            isCorrect: false,
            explanation: "MCA does not adjudicate private non-compete validity; civil courts and arbitral tribunals do.",
          },
        ],
        pedagogicalTakeaway:
          "Lawyers protect clients from signing clauses that appear intimidating but are fundamentally legally void.",
      },
      {
        id: 2,
        phase: "Phase 2: Founder Representation & Warranties",
        contextHeader: "Indemnity Cap Negotiation",
        prompt:
          "The acquirer demands an 'Uncapped Indemnity' clause — meaning if any past tax or IP liability arises, the founders are personally liable with no monetary limit. How do you counter?",
        options: [
          {
            text: "Accept it immediately to avoid delaying the deal closure.",
            isCorrect: false,
            explanation: "Uncapped indemnity can bankrupt founders over minor unforeseen historic oversights.",
          },
          {
            text: "Cap indemnity liability to a percentage of the purchase price (e.g., 10-15%), introduce a de minimis threshold, and limit duration to 18-24 months.",
            isCorrect: true,
            explanation: "Masterful corporate lawcraft! Market-standard deal terms cap fundamental representations and place operational indemnities in escrow for a defined window.",
          },
          {
            text: "Refuse to provide any indemnity or warranties whatsoever.",
            isCorrect: false,
            explanation: "No buyer will acquire a ₹250 Cr asset without standard representations and warranties.",
          },
        ],
        pedagogicalTakeaway:
          "Corporate lawyers are deal-makers who balance closing transaction velocity with safeguarding long-term client wealth.",
      },
      {
        id: 3,
        phase: "Phase 3: Regulatory Compliance",
        contextHeader: "FDI & RBI Reporting",
        prompt:
          "Since the buyer is a Singapore-registered entity injecting funds into an Indian enterprise, which regulatory reporting is legally mandatory under FEMA?",
        options: [
          {
            text: "FIRMS portal filing (FC-TRS form) with the Reserve Bank of India within 60 days of share transfer.",
            isCorrect: true,
            explanation: "Correct! Cross-border equity transfers between residents and non-residents must be filed via Form FC-TRS on RBI's FIRMS portal.",
          },
          {
            text: "Publishing a notice in local daily newspapers in English and Hindi.",
            isCorrect: false,
            explanation: "Newspaper notices are required for amalgamations/schemes, not routine private equity share purchases.",
          },
          {
            text: "No reporting is needed if the money arrives through net banking.",
            isCorrect: false,
            explanation: "FEMA violations attract heavy financial penalties under RBI enforcement.",
          },
        ],
        pedagogicalTakeaway:
          "Understanding Foreign Direct Investment (FDI) and RBI compliance is a cornerstone of top-tier corporate legal careers in India.",
      },
    ],
  },
  {
    id: "ux-design",
    category: "design",
    categoryLabel: "Design & Product Innovation",
    title: "Product & UX Architecture",
    tagline: "Design digital experiences used by millions every single day",
    icon: Palette,
    color: "#EC4899",
    bgGradient: "from-pink-600 via-rose-500 to-red-500",
    lightBg: "bg-pink-50 border-pink-200 text-pink-700",
    salaryRange: "₹10 – 30 LPA",
    growthRate: "+35% Consumer Tech",
    recommendedStreams: ["Any Stream (Design, Humanities, Science)", "Art/Design Portfolio"],
    keyExams: ["UCEED (IIT Bombay)", "NID DAT", "NIFT"],
    duration: "3 mins",
    difficulty: "Beginner",
    companyName: "BharatPay Digital Banking • Gurgaon Studio",
    companyRole: "Senior UI/UX Experience Architect",
    companyMission:
      "A rural micro-finance app tailored for small shopkeepers across Tier 2 and Tier 3 cities is facing a 68% drop-off at the KYC registration stage.",
    dayInTheLife: [
      { time: "10:00 AM", task: "Review user session recordings & heatmaps on regional language onboarding screens." },
      { time: "12:00 PM", task: "Rapidly prototype an audio-guided voice onboarding flow in Figma." },
      { time: "02:30 PM", task: "Conduct user testing with 5 local merchants in Hindi, Marathi, and Tamil." },
      { time: "04:45 PM", task: "Hand off WCAG AAA contrast design tokens to the mobile engineering team." },
    ],
    competencies: [
      { name: "User Empathy", weight: 98 },
      { name: "Information Architecture", weight: 92 },
      { name: "Visual Accessibility", weight: 94 },
      { name: "Rapid Prototyping", weight: 88 },
    ],
    missions: [
      {
        id: 1,
        phase: "Phase 1: Friction Diagnostics",
        contextHeader: "Funnel Analytics Drop-off Log",
        visualArtifactType: "ux",
        visualArtifactContent: `Step 1: Phone number & OTP: 94% completion
Step 2: Business PAN & Bank account: 88% completion
Step 3: Document Upload (12 form fields + Aadhar scan): 26% completion
Step 4: Activation: 22% completion`,
        prompt:
          "Users are dropping off massively at Step 3. Feedback shows merchants feel 'intimidated by legal English jargon and 12 simultaneous input fields'. What is the optimal UX redesign?",
        options: [
          {
            text: "Make the submit button bigger and brighter green.",
            isCorrect: false,
            explanation: "Button visual styling doesn't address severe cognitive overload and language barriers.",
          },
          {
            text: "Apply Progressive Disclosure: Split into 3 micro-steps, add regional voice prompts, and use OCR auto-fill from Aadhar photo.",
            isCorrect: true,
            explanation: "Spot-on! Progressive disclosure drastically reduces cognitive load. Combining it with regional voice guidance and OCR transforms high-friction forms into effortless wins.",
          },
          {
            text: "Add an unskippable 3-minute video explaining how to fill out the form.",
            isCorrect: false,
            explanation: "Video tutorials increase onboarding time and create higher bounce rates on mobile networks.",
          },
        ],
        pedagogicalTakeaway:
          "UX Designers don't just 'make screens pretty' — they use cognitive psychology to solve multi-million rupee business problems.",
      },
      {
        id: 2,
        phase: "Phase 2: Accessibility & Inclusive Design",
        contextHeader: "Outdoor Sunlight Usability Test",
        prompt:
          "Shopkeepers frequently use this app outdoors in harsh Indian sunlight on budget smartphones with low-brightness LCD displays. Which design system standard is essential?",
        options: [
          {
            text: "Use subtle pastel grays (#E2E8F0) with delicate 10px ultra-light font weights for a sleek minimalist look.",
            isCorrect: false,
            explanation: "Low contrast and thin fonts completely wash out under sunlight on budget screens.",
          },
          {
            text: "Enforce WCAG AAA 7:1 color contrast ratio, minimum 16px touch targets (48x48dp), and bold haptic feedback on button taps.",
            isCorrect: true,
            explanation: "Masterful! Designing for real-world constraints (sunlight glare, budget displays, larger thumb zones) is the hallmark of elite product design.",
          },
          {
            text: "Only allow users to access the app during evening hours.",
            isCorrect: false,
            explanation: "Unrealistic! Product designers adapt software to user realities, not the reverse.",
          },
        ],
        pedagogicalTakeaway:
          "Designing for the 'Next Billion Users' in India requires deep empathy for physical environments and hardware variations.",
      },
      {
        id: 3,
        phase: "Phase 3: Data-Driven Validation",
        contextHeader: "A/B Experiment Measurement",
        prompt:
          "You roll out the new voice-assisted onboarding to 20,000 merchants (Variant B) while 20,000 keep the old form (Variant A). How do you confirm statistical significance?",
        options: [
          {
            text: "Check if the CEO prefers Variant B during the Monday morning demo.",
            isCorrect: false,
            explanation: "Subjective executive preference is the opposite of empirical user experience validation.",
          },
          {
            text: "Track completion rate with a 95% confidence interval (p < 0.05) and monitor day-7 activation retention.",
            isCorrect: true,
            explanation: "Exact! Great product designers rely on statistical rigour (p-values, retention cohorts) to prove the monetary ROI of their UX interventions.",
          },
          {
            text: "Assume it worked if no one writes an angry review on Twitter.",
            isCorrect: false,
            explanation: "Absence of public complaint does not equal product success.",
          },
        ],
        pedagogicalTakeaway:
          "Top tech companies like Google, Swiggy, and Flipkart pay top salaries to UX designers who speak the language of analytics and business impact.",
      },
    ],
  },
  {
    id: "medicine",
    category: "health",
    categoryLabel: "Healthcare & Clinical Medicine",
    title: "Clinical Medicine & Emergency Care",
    tagline: "Diagnose acute pathologies and make life-critical clinical calls",
    icon: Stethoscope,
    color: "#10B981",
    bgGradient: "from-emerald-600 via-teal-600 to-cyan-600",
    lightBg: "bg-emerald-50 border-emerald-200 text-emerald-700",
    salaryRange: "₹12 – 40+ LPA",
    growthRate: "Recession-Proof Noble Profession",
    recommendedStreams: ["PCB (Physics, Chemistry, Biology)"],
    keyExams: ["NEET-UG", "AIIMS / INI-CET", "USMLE / PLAB (for Abroad)"],
    duration: "3 mins",
    difficulty: "Advanced",
    companyName: "Apollo Super Specialty Trauma Centre • Hyderabad",
    companyRole: "Resident Emergency Care Physician",
    companyMission:
      "A 17-year-old inter-school athlete is brought to trauma triage after collapsing during a state badminton match with acute left-sided chest pain and sudden dyspnea.",
    dayInTheLife: [
      { time: "08:00 AM", task: "Review bedside ultrasound (POCUS) scans and arterial blood gas values during ward handover." },
      { time: "11:15 AM", task: "Manage acute clinical resuscitation and stabilize multi-trauma emergency presentations." },
      { time: "02:00 PM", task: "Counsel worried family members on procedural consent and post-operative prognosis." },
      { time: "04:30 PM", task: "Coordinate with cardiothoracic surgeons for urgent intercostal chest tube insertion." },
    ],
    competencies: [
      { name: "Clinical Diagnostic Acuity", weight: 97 },
      { name: "Crisis Decision Speed", weight: 95 },
      { name: "Patient Communication", weight: 90 },
      { name: "Pathophysiological Rigor", weight: 96 },
    ],
    missions: [
      {
        id: 1,
        phase: "Phase 1: Emergency Triage Vitals",
        contextHeader: "Triage Monitor #Bed-04",
        visualArtifactType: "vitals",
        visualArtifactContent: `Heart Rate: 118 bpm (Sinus Tachycardia)
Blood Pressure: 114/76 mmHg
SpO2: 91% on room air
Respiratory Rate: 26 breaths/min (Tachypnea)
Chest Auscultation: Absent breath sounds over left hemithorax. Hyper-resonant percussion.`,
        prompt:
          "Based on the physical exam findings of absent breath sounds on the left and hyper-resonant percussion in a tall, athletic teenager, what is your top differential diagnosis?",
        options: [
          {
            text: "Acute bacterial pneumonia with pulmonary consolidation.",
            isCorrect: false,
            explanation: "Consolidation causes dull percussion notes and bronchial breathing, not absent breath sounds and hyper-resonance.",
          },
          {
            text: "Primary Spontaneous Pneumothorax (Ruptured apical subpleural bleb).",
            isCorrect: true,
            explanation: "Spot-on clinical deduction! Tall, athletic adolescents are classic candidates for spontaneous pneumothorax due to apical bleb rupture during intense exertion.",
          },
          {
            text: "Musculoskeletal muscle pull from a hard overhead racket smash.",
            isCorrect: false,
            explanation: "A simple muscle strain never causes absent breath sounds or an SpO2 drop to 91%.",
          },
        ],
        pedagogicalTakeaway:
          "Doctors use systematic auscultation and percussion to differentiate life-threatening thoracic crises from benign muscular aches.",
      },
      {
        id: 2,
        phase: "Phase 2: Acute Intervention",
        contextHeader: "Immediate Clinical Management",
        prompt:
          "While waiting for the portable X-ray machine, the patient's trachea begins deviating towards the RIGHT, systolic BP drops to 84 mmHg, and neck veins become visibly engorged. What critical emergency is developing?",
        options: [
          {
            text: "Patient is experiencing a panic attack; administer intravenous sedation.",
            isCorrect: false,
            explanation: "Administering sedation during an obstructive shock crisis would cause immediate respiratory and cardiac arrest.",
          },
          {
            text: "Tension Pneumothorax with mediastinal shift and venous return compromise; perform immediate needle thoracostomy in the 2nd intercostal space.",
            isCorrect: true,
            explanation: "Life-saving clinical reflex! Tracheal deviation away from the affected side + hypotension indicates tension pneumothorax. Never wait for an X-ray — immediately decompress with a large-bore needle!",
          },
          {
            text: "Order a 64-slice contrast CT scan and transfer patient to radiology.",
            isCorrect: false,
            explanation: "Transferring an unstable tension pneumothorax patient to radiology without decompression is fatal.",
          },
        ],
        pedagogicalTakeaway:
          "In critical emergency medicine, clinical acumen overrides imaging — prompt bedside decompression saves lives.",
      },
      {
        id: 3,
        phase: "Phase 3: Post-Stabilization Care & Counseling",
        contextHeader: "Patient Return-to-Play Guidance",
        prompt:
          "After successful intercostal drainage tube placement and full lung re-expansion, the student athlete and their parents ask when they can fly to an international tournament next week. What is your evidence-based medical advice?",
        options: [
          {
            text: "They may fly immediately as long as they carry oral pain relievers.",
            isCorrect: false,
            explanation: "Cabin pressure changes at 35,000 feet will cause residual trapped air to rapidly expand, triggering repeat tension collapse.",
          },
          {
            text: "Commercial air travel is strictly contraindicated for at least 1–2 weeks following confirmed radiological resolution due to Boyle's Law gas expansion risks.",
            isCorrect: true,
            explanation: "Clinically precise! Atmospheric cabin pressure drops cause any residual pneumothorax air pocket to expand by 30%, risking catastrophic recurrence mid-flight.",
          },
          {
            text: "They must abandon sports permanently and can never fly again in their life.",
            isCorrect: false,
            explanation: "Excessive and incorrect. Full recovery and return to athletic sports is standard after proper observation.",
          },
        ],
        pedagogicalTakeaway:
          "A great doctor combines acute diagnostic reflexes with thoughtful, science-backed patient counseling.",
      },
    ],
  },
  {
    id: "finance",
    category: "business",
    categoryLabel: "Finance & Wealth Strategy",
    title: "Investment Banking & Wealth Strategy",
    tagline: "Navigate capital markets, risk hedging, and wealth creation",
    icon: TrendingUp,
    color: "#F59E0B",
    bgGradient: "from-amber-500 via-orange-500 to-red-600",
    lightBg: "bg-amber-50 border-amber-200 text-amber-700",
    salaryRange: "₹14 – 42 LPA",
    growthRate: "+26% Capital Markets",
    recommendedStreams: ["Commerce with Applied Math", "PCM (Quantitative Finance)"],
    keyExams: ["IPMAT (IIM Indore/Rohtak)", "CUET (SRCC/St. Stephen's)", "CFA Institute"],
    duration: "3 mins",
    difficulty: "Intermediate",
    companyName: "Kotak Mahindra Private Wealth • Mumbai",
    companyRole: "Senior Portfolio Strategist",
    companyMission:
      "A family business patriarch approaching retirement with a ₹10 Crore corpus seeks a multi-generational asset allocation strategy to fund grandchildren's foreign education.",
    dayInTheLife: [
      { time: "09:00 AM", task: "Synthesize RBI Monetary Policy statement and yield curve shifts." },
      { time: "11:30 AM", task: "Stress-test equity portfolios against 200 bps interest rate hikes and rupee-dollar volatility." },
      { time: "02:15 PM", task: "Structure sovereign green bond ladder to generate predictable tax-free cash flows." },
      { time: "04:30 PM", task: "Pitch family-office alternative investment fund (AIF) allocations." },
    ],
    competencies: [
      { name: "Macroeconomic Acuity", weight: 93 },
      { name: "Risk Hedging", weight: 96 },
      { name: "Capital Allocation", weight: 91 },
      { name: "Quantitative Modeling", weight: 89 },
    ],
    missions: [
      {
        id: 1,
        phase: "Phase 1: Risk-Return Calibration",
        contextHeader: "Client Portfolio Brief #102",
        visualArtifactType: "finance",
        visualArtifactContent: `Target Corpus: ₹10,00,00,000
Objective 1: Protect capital against inflation (CPI ~6%)
Objective 2: Fund overseas college fees in USD in 7 years
Current Client Stance: "Put 100% in bank Fixed Deposits for total safety."`,
        prompt:
          "The client wants 100% in Bank FDs earning 7% interest. With inflation at 6% and top-bracket income tax at 39%, what is the true real return of their money?",
        options: [
          {
            text: "They make a clean positive 7% wealth increase every year.",
            isCorrect: false,
            explanation: "Completely ignores both tax drag and real purchasing power erosion.",
          },
          {
            text: "Negative real return: After 39% tax on interest, net return is ~4.27%, which loses purchasing power against 6% inflation, especially with rupee currency depreciation.",
            isCorrect: true,
            explanation: "Spot-on quantitative insight! Inflation and taxation silently destroy 'safe' bank savings. Educating clients on real vs nominal returns is the first duty of elite wealth advisors.",
          },
          {
            text: "Bank FDs are completely immune to taxes in India.",
            isCorrect: false,
            explanation: "Fixed deposit interest is fully taxable at the individual's marginal income tax slab.",
          },
        ],
        pedagogicalTakeaway:
          "Financial analysts use quantitative taxation and inflation models to prove why idle cash silently destroys wealth.",
      },
      {
        id: 2,
        phase: "Phase 2: Currency Hedging for Foreign Education",
        contextHeader: "USD/INR Depletion Simulation",
        prompt:
          "Since the education costs will be in US Dollars (USD) 7 years from now, how should the portfolio hedge against historic Indian Rupee depreciation (~3-4% annually)?",
        options: [
          {
            text: "Keep all money in cash under the mattress.",
            isCorrect: false,
            explanation: "Physical cash generates 0% return and depreciates fastest.",
          },
          {
            text: "Allocate 20-25% to US Equity Index Funds (S&P 500 / Nasdaq ETFs) through RBI's Liberalised Remittance Scheme (LRS).",
            isCorrect: true,
            explanation: "Strategically brilliant! Dollar-denominated assets ensure that when the dollar appreciates against the rupee, the foreign education fund automatically matches university tuition inflation.",
          },
          {
            text: "Borrow foreign debt from international banks.",
            isCorrect: false,
            explanation: "Borrowing in foreign currency introduces catastrophic foreign exchange debt risk for retail families.",
          },
        ],
        pedagogicalTakeaway:
          "Modern financial planners understand global macroeconomics, LRS guidelines, and currency hedging mechanisms.",
      },
      {
        id: 3,
        phase: "Phase 3: Market Crash Psychology",
        contextHeader: "Correction Crisis Protocol",
        prompt:
          "During an unexpected geopolitical conflict, domestic equity indices plummet 18% in three weeks. The client panics and demands to liquidate all equity holdings. What is your action?",
        options: [
          {
            text: "Execute the panic sale and lock in the 18% loss.",
            isCorrect: false,
            explanation: "Panic selling at market bottoms transforms temporary paper volatility into permanent irreversible capital loss.",
          },
          {
            text: "Show rolling returns history, enforce systematic rebalancing (buying cheaper equity units from debt allocation), and anchor on the 7-year goal horizon.",
            isCorrect: true,
            explanation: "Masterful behavioral finance leadership! Rebalancing during corrections takes advantage of dollar-cost averaging, generating exceptional long-term alpha.",
          },
          {
            text: "Guaranteed promise that the market will bounce back tomorrow morning.",
            isCorrect: false,
            explanation: "SEBI regulations prohibit financial advisors from making false short-term market guarantees.",
          },
        ],
        pedagogicalTakeaway:
          "The greatest asset in wealth management is emotional discipline and disciplined rebalancing frameworks.",
      },
    ],
  },
  {
    id: "media",
    category: "media",
    categoryLabel: "Media & Digital Storytelling",
    title: "Media Production & Brand Storytelling",
    tagline: "Direct narratives, viral communication, and multi-channel reach",
    icon: Film,
    color: "#8B5CF6",
    bgGradient: "from-purple-600 via-violet-600 to-indigo-600",
    lightBg: "bg-purple-50 border-purple-200 text-purple-700",
    salaryRange: "₹9 – 28 LPA",
    growthRate: "+30% Creator Economy",
    recommendedStreams: ["Humanities or Mass Comm", "Open to All Streams"],
    keyExams: ["IIMC Entrance", "FTII Entrance", "CUET (Mass Communication)"],
    duration: "3 mins",
    difficulty: "Beginner",
    companyName: "ViralPulse Media Studio • Mumbai & Delhi",
    companyRole: "Lead Creative Content Strategist",
    companyMission:
      "A sustainable Indian fashion brand wants to launch a nationwide campaign to encourage Gen Z consumers to choose cruelty-free khadi and recycled cotton over fast fashion.",
    dayInTheLife: [
      { time: "09:30 AM", task: "Analyze trending cultural audio cues and algorithmic retention curves on short-form video platforms." },
      { time: "11:45 AM", task: "Direct a 3-act narrative storyboard comparing textile landfills to handloom artisan heritage." },
      { time: "02:30 PM", task: "Review rough cuts with the color grading and sound design team." },
      { time: "05:00 PM", task: "A/B test thumbnail hooks and script opening lines to maximize 3-second hold rate." },
    ],
    competencies: [
      { name: "Narrative Architecture", weight: 95 },
      { name: "Audience Psychology", weight: 94 },
      { name: "Viral Hook Crafting", weight: 91 },
      { name: "Multi-Platform Strategy", weight: 89 },
    ],
    missions: [
      {
        id: 1,
        phase: "Phase 1: The 3-Second Hook",
        contextHeader: "Short-Form Retention Analytics",
        visualArtifactType: "media",
        visualArtifactContent: `Hook Option A: "Hello guys, today we are going to talk about sustainability." (Drop-off: 82% at 2 sec)
Hook Option B: Split screen showing a burning ₹2,000 note vs an ultra-cheap fast fashion t-shirt falling apart after 1 wash. (Drop-off: 14% at 3 sec)`,
        prompt:
          "Why did Hook Option B produce 6x higher retention than Option A among 15–24 year old Indian audiences?",
        options: [
          {
            text: "Because the font color was yellow.",
            isCorrect: false,
            explanation: "Visual font color is secondary; cognitive curiosity and contrast are the primary drivers.",
          },
          {
            text: "Visceral visual contradiction creates an instant 'information gap' that compels the viewer's brain to stay for resolution.",
            isCorrect: true,
            explanation: "Exact psychological principle! Gen-Z audiences scroll past didactic preaching. Visceral visual metaphors bypass skepticism and create emotional resonance.",
          },
          {
            text: "Option B was simply lucky with the algorithm.",
            isCorrect: false,
            explanation: "Algorithmic reach is an output of high retention and engagement metrics, not pure luck.",
          },
        ],
        pedagogicalTakeaway:
          "Media strategists understand the neurobiology of attention — converting passive scrollers into passionate advocates.",
      },
      {
        id: 2,
        phase: "Phase 2: Platform-Native Storytelling",
        contextHeader: "Cross-Channel Strategy",
        prompt:
          "The brand wants to run the exact same 60-second video without edits across YouTube Long-form, Instagram Reels, and LinkedIn. What is your strategic counsel?",
        options: [
          {
            text: "Agree, because it saves production budget and effort.",
            isCorrect: false,
            explanation: "Lazy cross-posting degrades brand authority and triggers low platform algorithmic distribution.",
          },
          {
            text: "Adapt content natively: Fast-paced visual hooks on Reels, in-depth supply chain documentary on YouTube, and an economic thought-leadership breakdown on LinkedIn.",
            isCorrect: true,
            explanation: "Masterclass in media distribution! Platform algorithms and viewer expectations differ radically. Native packaging unlocks 4x higher compounding reach.",
          },
          {
            text: "Delete all social media and only put physical hoardings on highways.",
            isCorrect: false,
            explanation: "Highway hoardings offer zero audience targeting or measurable digital conversion tracking for youth demographics.",
          },
        ],
        pedagogicalTakeaway:
          "High-earning media directors master cross-platform narrative packaging, adapting stories for distinct audience mindsets.",
      },
      {
        id: 3,
        phase: "Phase 3: Crisis Management & Brand Integrity",
        contextHeader: "Greenwashing Accusation Handling",
        prompt:
          "A vocal fashion activist tweets that your brand uses plastic packaging for shipping organic clothes, triggering a sudden social media storm. How do you respond?",
        options: [
          {
            text: "Block the user and delete all negative comments immediately.",
            isCorrect: false,
            explanation: "Deleting comments triggers the 'Streisand Effect', multiplying community backlash and destroying trust.",
          },
          {
            text: "Publish transparent acknowledgment, share immediate transition to cassava-starch biodegradable envelopes, and invite the activist to audit the warehouse.",
            isCorrect: true,
            explanation: "Masterful PR strategy! Radical transparency and genuine corrective accountability transform a potential brand disaster into an authentic credibility victory.",
          },
          {
            text: "Sue the activist for defamation in court.",
            isCorrect: false,
            explanation: "Litigation against consumers creates devastating brand hostility for a sustainability lifestyle company.",
          },
        ],
        pedagogicalTakeaway:
          "Modern media leaders excel in crisis PR, turning vulnerable moments into unbreakable brand trust through radical honesty.",
      },
    ],
  },
];

/* ─── Confetti Cannon ──────────────────────────── */

function SimulatorConfetti() {
  const pieces = useMemo(
    () =>
      Array.from({ length: 32 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        delay: Math.random() * 0.4,
        color: [
          "#F97316",
          "#6366F1",
          "#EC4899",
          "#10B981",
          "#F59E0B",
          "#8B5CF6",
          "#38BDF8",
        ][i % 7],
        rotation: Math.random() * 720 - 360,
        size: Math.random() * 8 + 5,
      })),
    []
  );

  return (
    <div className="pointer-events-none fixed inset-0 z-[100] overflow-hidden">
      {pieces.map((p) => (
        <motion.div
          key={p.id}
          initial={{ y: -30, x: `${p.x}vw`, opacity: 1, rotate: 0 }}
          animate={{ y: "115vh", opacity: 0, rotate: p.rotation }}
          transition={{ duration: 2.8 + Math.random(), delay: p.delay, ease: "easeOut" }}
          className="absolute rounded-sm"
          style={{ width: p.size, height: p.size * 1.5, backgroundColor: p.color }}
        />
      ))}
    </div>
  );
}

/* ─── Main Page Component ──────────────────────── */

function SimulatorContent() {
  const searchParams = useSearchParams();
  const trackParam = searchParams.get("track");

  const { profile, openIntakeModal, openBookingModal, openDossierModal } = useUserProfile();

  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [activeTrack, setActiveTrack] = useState<CareerTrack | null>(null);

  // Simulation play state
  const [currentMissionIdx, setCurrentMissionIdx] = useState<number>(0);
  const [selectedOptionIdx, setSelectedOptionIdx] = useState<number | null>(null);
  const [isAnswerRevealed, setIsAnswerRevealed] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);
  const [resiliencePoints, setResiliencePoints] = useState<number>(0);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const [showCertificateModal, setShowCertificateModal] = useState<boolean>(false);
  
  // Universal scroll lock for certificate modal
  useScrollLock(showCertificateModal);
  const [studentName, setStudentName] = useState<string>("PTIROS Explorer");
  const [completionTab, setCompletionTab] = useState<"student" | "parent">("student");

  // Sync profile name
  useEffect(() => {
    if (profile?.studentName) {
      setStudentName(profile.studentName);
    }
  }, [profile]);

  // Sync trackParam with activeTrack on mount
  useEffect(() => {
    if (trackParam) {
      const match = CAREER_TRACKS.find((t) => t.id === trackParam);
      if (match) {
        setActiveTrack(match);
        resetSimulationState();
      }
    }
  }, [trackParam]);

  // Restore session state on track launch if available
  useEffect(() => {
    if (activeTrack && typeof window !== "undefined") {
      try {
        const saved = sessionStorage.getItem(`ptiros_sim_${activeTrack.id}`);
        if (saved) {
          const parsed = JSON.parse(saved);
          if (typeof parsed.currentMissionIdx === "number" && !isCompleted) {
            setCurrentMissionIdx(parsed.currentMissionIdx);
            setScore(parsed.score || 0);
            setResiliencePoints(parsed.resiliencePoints || 0);
          }
        }
      } catch {
        // Ignore session storage errors
      }
    }
  }, [activeTrack]);

  // Persist session state on change to protect against mobile background tab reloads
  useEffect(() => {
    if (activeTrack && typeof window !== "undefined") {
      try {
        if (!isCompleted) {
          sessionStorage.setItem(
            `ptiros_sim_${activeTrack.id}`,
            JSON.stringify({ currentMissionIdx, score, resiliencePoints })
          );
        } else {
          sessionStorage.removeItem(`ptiros_sim_${activeTrack.id}`);
        }
      } catch {
        // Ignore session storage errors
      }
    }
  }, [activeTrack, currentMissionIdx, score, resiliencePoints, isCompleted]);

  const resetSimulationState = () => {
    setCurrentMissionIdx(0);
    setSelectedOptionIdx(null);
    setIsAnswerRevealed(false);
    setScore(0);
    setResiliencePoints(0);
    setIsCompleted(false);
    setShowCertificateModal(false);
    setCompletionTab("student");
    if (activeTrack && typeof window !== "undefined") {
      try {
        sessionStorage.removeItem(`ptiros_sim_${activeTrack.id}`);
      } catch {}
    }
  };

  const handleLaunchTrack = (track: CareerTrack) => {
    setActiveTrack(track);
    resetSimulationState();
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleExitSimulation = () => {
    setActiveTrack(null);
    resetSimulationState();
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Filtered tracks
  const filteredTracks = useMemo(() => {
    return CAREER_TRACKS.filter((track) => {
      const matchesCategory =
        selectedCategory === "all" || track.category === selectedCategory;
      const matchesSearch =
        track.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        track.tagline.toLowerCase().includes(searchQuery.toLowerCase()) ||
        track.companyRole.toLowerCase().includes(searchQuery.toLowerCase()) ||
        track.keyExams.some((e) => e.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  const currentMission = activeTrack?.missions[currentMissionIdx];

  const handleSelectOption = (idx: number) => {
    if (isAnswerRevealed || !currentMission) return;
    setSelectedOptionIdx(idx);
    setIsAnswerRevealed(true);
    if (currentMission.options[idx].isCorrect) {
      setScore((s) => s + 1);
    }
  };

  const handleNextMission = () => {
    if (!activeTrack) return;
    if (currentMissionIdx < activeTrack.missions.length - 1) {
      setCurrentMissionIdx((i) => i + 1);
      setSelectedOptionIdx(null);
      setIsAnswerRevealed(false);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      setIsCompleted(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const fitPercent = activeTrack
    ? Math.round((score / activeTrack.missions.length) * 100)
    : 0;

  return (
    <div className="min-h-screen bg-[#FFFBF5] text-[#1A1A2E] selection:bg-orange-500 selection:text-white">
      {/* ─── Top Brand Navigation Bar ──────────────── */}
      <header className="sticky top-0 z-40 border-b border-orange-200/60 bg-white/85 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-3.5 sm:px-8">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="flex items-center gap-2 rounded-xl px-2.5 py-1.5 text-xs font-bold text-gray-600 transition-colors hover:bg-orange-50 hover:text-orange-600"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Home</span>
            </Link>

            <span className="hidden h-4 w-px bg-gray-200 sm:inline-block" />

            <div className="flex items-center gap-2">
              <span className="font-display text-lg font-black tracking-tight text-gradient">
                PTIROS
              </span>
              <span className="rounded-full bg-orange-100 px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider text-orange-700">
                Career Simulator
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/career-test"
              className="hidden sm:inline-flex items-center gap-1.5 text-xs font-semibold text-gray-600 transition-colors hover:text-orange-600"
            >
              <Sparkles className="h-3.5 w-3.5 text-orange-500" />
              <span>360° Diagnostic Test</span>
            </Link>
            <Link
              href="/career-test"
              className="rounded-full bg-primary px-4 py-2 text-xs font-bold uppercase tracking-wider text-white shadow-md shadow-primary/20 transition-all hover:bg-primary-dark"
            >
              Full Assessment
            </Link>
          </div>
        </div>
      </header>

      {/* ─── VIEW 1: CATALOG & EXPLORATION HUB ──────── */}
      {!activeTrack ? (
        <main className="mx-auto max-w-7xl px-5 py-10 sm:px-8 lg:py-16">
          {/* Hero Banner */}
          <section className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-[#1A1A2E] via-[#24243E] to-[#1A1A2E] p-8 sm:p-12 lg:p-16 text-white shadow-2xl">
            {/* Ambient background orbs */}
            <div
              className="pointer-events-none absolute -right-20 -top-20 h-96 w-96 rounded-full bg-orange-500/20 blur-3xl"
              aria-hidden="true"
            />
            <div
              className="pointer-events-none absolute -bottom-20 -left-20 h-96 w-96 rounded-full bg-indigo-500/20 blur-3xl"
              aria-hidden="true"
            />

            <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
              <div className="max-w-3xl">
                <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-orange-400 backdrop-blur-md">
                  <Sparkles className="h-3.5 w-3.5" />
                  Virtual Internship & Career Simulator
                </span>

                <h1 className="mt-5 font-display text-3xl sm:text-5xl lg:text-6xl font-black leading-tight tracking-tight text-white">
                  Test-Drive Careers{" "}
                  <span className="bg-gradient-to-r from-orange-400 via-amber-300 to-orange-400 bg-clip-text text-transparent">
                    Before Choosing
                  </span>{" "}
                  Your Stream.
                </h1>

                <p className="mt-5 text-base sm:text-lg leading-relaxed text-gray-300">
                  Step directly into the shoes of top professionals. Solve authentic workplace
                  emergencies, contract disputes, product design bottlenecks, and clinical triage
                  cases in 3-minute interactive simulations.
                </p>

                {/* Three Value Badges */}
                <div className="mt-8 flex flex-wrap items-center gap-3 text-xs sm:text-sm font-semibold text-gray-300">
                  <div className="flex items-center gap-1.5 rounded-full bg-white/10 px-3.5 py-1.5 backdrop-blur-sm">
                    <ShieldCheck className="h-4 w-4 text-emerald-400" />
                    <span>100% Free for Students</span>
                  </div>
                  <div className="flex items-center gap-1.5 rounded-full bg-white/10 px-3.5 py-1.5 backdrop-blur-sm">
                    <GraduationCap className="h-4 w-4 text-orange-400" />
                    <span>NEP 2020 Aligned</span>
                  </div>
                  <div className="flex items-center gap-1.5 rounded-full bg-white/10 px-3.5 py-1.5 backdrop-blur-sm">
                    <Award className="h-4 w-4 text-sky-400" />
                    <span>Verified Simulation Badge</span>
                  </div>
                </div>
              </div>

              {/* Ptiro Mascot Hero Spotlight */}
              <div className="hidden lg:flex flex-col items-center justify-center p-5 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-md shrink-0">
                <PtiroMascot
                  variant="copilot"
                  size={120}
                  speech="Ptiro Copilot Ready!"
                  subSpeech="Test-drive authentic careers before stream selection."
                />
              </div>
            </div>
          </section>

          {/* Filter & Search Controls */}
          <section className="mt-12">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              {/* Category Pills */}
              <div className="flex flex-wrap items-center gap-2 overflow-x-auto pb-2 sm:pb-0">
                {[
                  { id: "all", label: "All Career Tracks" },
                  { id: "tech", label: "Technology & AI" },
                  { id: "law", label: "Law & Policy" },
                  { id: "design", label: "Design & UX" },
                  { id: "health", label: "Healthcare" },
                  { id: "business", label: "Finance & Wealth" },
                  { id: "media", label: "Media & PR" },
                ].map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`cursor-pointer rounded-full px-4 py-2 text-xs sm:text-sm font-bold transition-all duration-200 ${
                      selectedCategory === cat.id
                        ? "bg-primary text-white shadow-md shadow-primary/25"
                        : "bg-white text-gray-600 border border-orange-200/70 hover:border-orange-400 hover:text-orange-600"
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>

              {/* Search Bar */}
              <div className="relative w-full sm:w-72">
                <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search role, exam, skill..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-full border border-orange-200/80 bg-white py-2 pl-10 pr-4 text-xs sm:text-sm font-medium text-gray-800 placeholder-gray-400 shadow-sm focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20"
                />
              </div>
            </div>

            {/* Results count indicator */}
            <p className="mt-4 text-xs font-semibold text-gray-500">
              Showing {filteredTracks.length} realistic career simulation labs
            </p>
          </section>

          {/* Career Cards Grid */}
          <section className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredTracks.map((track) => {
              const Icon = track.icon;
              return (
                <div
                  key={track.id}
                  className="group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-orange-200/70 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-orange-300 hover:shadow-xl hover:shadow-orange-950/5"
                >
                  {/* Top gradient highlight bar */}
                  <div className={`absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r ${track.bgGradient}`} />

                  <div>
                    {/* Header Row: Icon + Compensation & Time */}
                    <div className="flex items-start justify-between">
                      <div
                        className="flex h-14 w-14 items-center justify-center rounded-2xl shadow-sm transition-transform duration-300 group-hover:scale-105"
                        style={{ backgroundColor: `${track.color}15` }}
                      >
                        <Icon className="h-7 w-7" style={{ color: track.color }} strokeWidth={2.2} />
                      </div>

                      <div className="flex flex-col items-end gap-1">
                        <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-[11px] font-bold text-emerald-700 border border-emerald-200">
                          {track.salaryRange}
                        </span>
                        <span className="flex items-center gap-1 text-[11px] font-semibold text-gray-500">
                          <Clock className="h-3 w-3" />
                          {track.duration}
                        </span>
                      </div>
                    </div>

                    {/* Title + Category Badge */}
                    <div className="mt-4">
                      <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: track.color }}>
                        {track.categoryLabel}
                      </span>
                      <h3 className="mt-0.5 font-display text-xl font-bold text-gray-900 leading-snug">
                        {track.title}
                      </h3>
                      <p className="mt-1 text-xs leading-relaxed text-gray-500">
                        {track.tagline}
                      </p>
                    </div>

                    {/* Role & Workplace */}
                    <div className="mt-4 rounded-2xl bg-orange-50/60 border border-orange-100 p-3.5 text-xs text-gray-700">
                      <p className="font-bold text-gray-900">{track.companyRole}</p>
                      <p className="text-[11px] text-gray-500 mt-0.5">{track.companyName}</p>
                    </div>

                    {/* Day in the Life preview */}
                    <div className="mt-4 space-y-1.5">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                        Day in the Life Snapshot:
                      </p>
                      {track.dayInTheLife.slice(0, 2).map((item, i) => (
                        <div key={i} className="flex items-start gap-2 text-[11px] text-gray-600">
                          <span className="shrink-0 font-bold text-gray-400">{item.time}</span>
                          <span className="truncate">{item.task}</span>
                        </div>
                      ))}
                    </div>

                    {/* Entrance Exams */}
                    <div className="mt-4 flex flex-wrap gap-1.5">
                      {track.keyExams.slice(0, 2).map((exam) => (
                        <span
                          key={exam}
                          className="rounded-md bg-gray-100 px-2 py-0.5 text-[10px] font-semibold text-gray-600"
                        >
                          {exam}
                        </span>
                      ))}
                      {track.keyExams.length > 2 && (
                        <span className="rounded-md bg-gray-100 px-1.5 py-0.5 text-[10px] font-semibold text-gray-500">
                          +{track.keyExams.length - 2} more
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Launch CTA */}
                  <div className="mt-6 pt-4 border-t border-gray-100">
                    <button
                      onClick={() => handleLaunchTrack(track)}
                      className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-2xl py-3 font-display text-sm font-bold text-white shadow-md transition-all duration-200 hover:shadow-lg active:scale-[0.98]"
                      style={{
                        background: `linear-gradient(135deg, ${track.color}, ${track.color}dd)`,
                      }}
                    >
                      <span>Launch Simulation Lab</span>
                      <ArrowRight className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </section>

          {/* Bottom Diagnostic Banner */}
          <section className="mt-16 rounded-3xl bg-gradient-to-r from-orange-500 to-amber-500 p-8 sm:p-10 text-white shadow-xl">
            <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
              <div>
                <span className="rounded-full bg-white/20 px-3 py-1 text-xs font-bold uppercase tracking-widest text-white backdrop-blur-sm">
                  PTIROS 360° Diagnostic
                </span>
                <h3 className="mt-2 font-display text-2xl sm:text-3xl font-black text-white">
                  Want to Know Your Scientific Cognitive Profile?
                </h3>
                <p className="mt-1 text-sm text-white/90 max-w-xl">
                  Simulations test day-to-day interest, but our 360° diagnostic maps brain hemisphere dominance,
                  aptitude, and academic personality.
                </p>
              </div>

              <Link
                href="/career-test"
                className="shrink-0 rounded-full bg-white px-8 py-3.5 font-display text-sm font-black uppercase tracking-wider text-orange-600 shadow-xl transition-all hover:bg-orange-50 active:scale-95"
              >
                Take Career Test Now
              </Link>
            </div>
          </section>
        </main>
      ) : (
        /* ─── VIEW 2: DEDICATED FULL-PAGE SIMULATION WORKSPACE ── */
        <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:py-12">
          {/* Breadcrumb & Exit Control */}
          <div className="mb-6 flex items-center justify-between">
            <button
              onClick={handleExitSimulation}
              className="flex cursor-pointer items-center gap-2 rounded-xl bg-white px-3.5 py-2 text-xs font-bold text-gray-700 border border-orange-200/80 shadow-sm transition-all hover:border-orange-400 hover:text-orange-600 active:scale-95"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Exit to Career Labs</span>
            </button>

            <div className="flex items-center gap-2">
              <span className="rounded-full bg-orange-100 px-3 py-1 text-xs font-bold text-orange-700">
                {activeTrack.companyRole}
              </span>
              <span className="hidden sm:inline-block text-xs font-semibold text-gray-500">
                • {activeTrack.companyName}
              </span>
            </div>
          </div>

          {!isCompleted && currentMission ? (
            <div className="space-y-6">
              {/* Mission Progress Header */}
              <div className="overflow-hidden rounded-3xl border border-orange-200/80 bg-white p-6 shadow-sm">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <span
                      className="text-xs font-bold uppercase tracking-wider"
                      style={{ color: activeTrack.color }}
                    >
                      {currentMission.phase}
                    </span>
                    <h2 className="mt-1 font-display text-2xl sm:text-3xl font-black text-gray-900">
                      {activeTrack.title}
                    </h2>
                  </div>

                  {/* Progress Indicator */}
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1.5">
                      {activeTrack.missions.map((_, i) => (
                        <div
                          key={i}
                          className={`h-2.5 rounded-full transition-all duration-300 ${
                            i === currentMissionIdx
                              ? "w-8 bg-primary"
                              : i < currentMissionIdx
                              ? "w-3 bg-emerald-500"
                              : "w-3 bg-gray-200"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-xs font-bold text-gray-500">
                      Mission {currentMissionIdx + 1} of {activeTrack.missions.length}
                    </span>
                  </div>
                </div>
              </div>

              {/* Simulation Challenge Split Layout */}
              <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
                {/* Left Panel: Real-World Case File & Context */}
                <div className="space-y-6 lg:col-span-5">
                  {/* Workplace Feed (Slack Chat & Audio Memo Dispatch) */}
                  <WorkplaceFeed
                    trackId={activeTrack.id}
                    companyName={activeTrack.companyName}
                    missionPhase={currentMission.phase}
                  />

                  {/* Context Briefing */}
                  <div className="rounded-3xl border border-orange-200/80 bg-white p-6 shadow-sm">
                    <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-orange-600 mb-2">
                      <Briefcase className="h-4 w-4" />
                      <span>Workplace Assignment</span>
                    </div>
                    <h3 className="font-display text-lg font-bold text-gray-900 leading-snug">
                      {activeTrack.companyMission}
                    </h3>

                    {/* Day in the Life Reminder */}
                    <div className="mt-6 border-t border-gray-100 pt-4">
                      <p className="text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-2.5">
                        Typical Workplace Tasks:
                      </p>
                      <div className="space-y-2">
                        {activeTrack.dayInTheLife.map((d, i) => (
                          <div key={i} className="flex items-start gap-2.5 text-xs text-gray-600">
                            <span className="shrink-0 font-bold text-orange-600">{d.time}</span>
                            <span>{d.task}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Career Compensation & Degrees Box */}
                  <div className="rounded-3xl border border-orange-200/80 bg-gradient-to-br from-white to-orange-50/40 p-6 shadow-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold uppercase tracking-wider text-gray-500">
                        Average Industry Pay
                      </span>
                      <span className="font-display text-lg font-black text-emerald-600">
                        {activeTrack.salaryRange}
                      </span>
                    </div>

                    <div className="mt-4 border-t border-gray-200/60 pt-3 text-xs text-gray-600 space-y-1.5">
                      <p className="font-semibold text-gray-800">Target Degrees & Pathways:</p>
                      <p className="text-[11px] text-gray-600 leading-relaxed">
                        {activeTrack.recommendedStreams.join(" • ")}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Right Panel: Interactive Problem & Artifact */}
                <div className="space-y-6 lg:col-span-7">
                  {/* Interactive Tactile Workplace Simulation Widget */}
                  <div>
                    {activeTrack.id === "ai-robotics" && <RoboticsTactileWidget />}
                    {activeTrack.id === "corporate-law" && <LawTactileWidget />}
                    {activeTrack.id === "ux-design" && <UXTactileWidget />}
                    {activeTrack.id === "medicine" && <MedicineTactileWidget />}
                    {activeTrack.id === "finance" && <FinanceTactileWidget />}
                    {activeTrack.id === "media" && <MediaTactileWidget />}
                  </div>

                  {/* Question & Options Box */}
                  <div className="rounded-3xl border border-orange-200/80 bg-white p-6 sm:p-8 shadow-sm">
                    <span className="text-xs font-bold uppercase tracking-wider text-orange-600">
                      Your Critical Decision
                    </span>
                    <h3 className="mt-2 font-display text-lg sm:text-xl font-bold text-gray-900 leading-snug">
                      {currentMission.prompt}
                    </h3>

                    {/* Options List */}
                    <div className="mt-6 space-y-3">
                      {currentMission.options.map((opt, idx) => {
                        let btnStyle =
                          "border-gray-200 bg-white hover:border-orange-400 hover:bg-orange-50/50 text-gray-800";
                        if (isAnswerRevealed) {
                          if (opt.isCorrect) {
                            btnStyle = "border-emerald-500 bg-emerald-50 text-emerald-900 font-semibold";
                          } else if (idx === selectedOptionIdx) {
                            btnStyle = "border-red-400 bg-red-50 text-red-900";
                          } else {
                            btnStyle = "border-gray-100 bg-gray-50 opacity-50 text-gray-400";
                          }
                        }

                        return (
                          <button
                            key={idx}
                            onClick={() => handleSelectOption(idx)}
                            disabled={isAnswerRevealed}
                            className={`flex w-full cursor-pointer items-start gap-3.5 rounded-2xl border p-4 text-left transition-all duration-200 ${btnStyle} ${
                              isAnswerRevealed ? "cursor-default" : "cursor-pointer"
                            }`}
                          >
                            <span
                              className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                                isAnswerRevealed && opt.isCorrect
                                  ? "bg-emerald-600 text-white"
                                  : isAnswerRevealed && idx === selectedOptionIdx
                                  ? "bg-red-500 text-white"
                                  : "bg-gray-100 text-gray-700"
                              }`}
                            >
                              {isAnswerRevealed && opt.isCorrect ? (
                                <Check className="h-3.5 w-3.5" />
                              ) : isAnswerRevealed && idx === selectedOptionIdx ? (
                                <XCircle className="h-3.5 w-3.5" />
                              ) : (
                                String.fromCharCode(65 + idx)
                              )}
                            </span>
                            <span className="text-sm leading-relaxed">{opt.text}</span>
                          </button>
                        );
                      })}
                    </div>

                    {/* Dynamic Consequence Branching (Pillar 3) */}
                    <AnimatePresence>
                      {isAnswerRevealed && selectedOptionIdx !== null && (
                        <ConsequenceBranching
                          trackId={activeTrack.id}
                          missionId={currentMission.id}
                          selectedOptionIdx={selectedOptionIdx}
                          isCorrect={Boolean(
                            selectedOptionIdx !== null &&
                              currentMission.options[selectedOptionIdx].isCorrect
                          )}
                          onAdvance={handleNextMission}
                          isLastMission={currentMissionIdx === activeTrack.missions.length - 1}
                          onResilienceEarned={() => setResiliencePoints((r) => r + 15)}
                        />
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* ─── Simulation Completion & Competency Diagnostic ─── */
            <div className="space-y-8">
              <SimulatorConfetti />

              {/* ─── View Switcher: Student Diagnostic vs Parent Dialogue Dossier ─── */}
              <div className="flex justify-center">
                <div className="inline-flex rounded-full bg-orange-100/90 p-1 border border-orange-200 shadow-xs">
                  <button
                    onClick={() => setCompletionTab("student")}
                    className={`flex cursor-pointer items-center gap-2 rounded-full px-5 py-2.5 text-xs font-bold transition-all ${
                      completionTab === "student"
                        ? "bg-white text-gray-900 shadow-sm"
                        : "text-gray-600 hover:text-gray-900"
                    }`}
                  >
                    <Trophy className="h-4 w-4 text-orange-500" />
                    <span>Student Diagnostic</span>
                  </button>
                  <button
                    onClick={() => setCompletionTab("parent")}
                    className={`flex cursor-pointer items-center gap-2 rounded-full px-5 py-2.5 text-xs font-bold transition-all ${
                      completionTab === "parent"
                        ? "bg-primary text-white shadow-sm"
                        : "text-gray-600 hover:text-gray-900"
                    }`}
                  >
                    <Users className="h-4 w-4" />
                    <span>Parent-Student Dialogue Dossier</span>
                    <span className="hidden sm:inline-block rounded-full bg-white/20 px-2 py-0.5 text-[10px] font-bold">Recommended</span>
                  </button>
                </div>
              </div>

              {/* ─── TAB A: PARENT-STUDENT DIALOGUE DOSSIER ─── */}
              {completionTab === "parent" ? (
                <ParentDossier
                  trackId={activeTrack.id}
                  trackTitle={activeTrack.title}
                  categoryLabel={activeTrack.categoryLabel}
                  color={activeTrack.color}
                  fitPercent={fitPercent}
                  score={score}
                  totalMissions={activeTrack.missions.length}
                  resiliencePoints={resiliencePoints}
                  studentName={studentName}
                  parentName={profile?.parentName}
                  parentDream={profile?.parentDream}
                />
              ) : (
                /* ─── TAB B: STUDENT PERFORMANCE REPORT ─── */
                <div className="overflow-hidden rounded-3xl border border-orange-200/80 bg-white p-8 sm:p-12 text-center shadow-lg">
                  <div className="mx-auto flex justify-center mb-3">
                    <PtiroMascot
                      variant="celebrate"
                      size={95}
                      speech="Simulation Lab Mastered!"
                      subSpeech={`You scored ${fitPercent}% in ${activeTrack.title}`}
                      interactive={false}
                    />
                  </div>

                  <h2 className="mt-2 font-display text-3xl sm:text-4xl font-black text-gray-900">
                    Simulation Lab Completed!
                  </h2>
                  <p className="mt-2 text-sm text-gray-500">
                    You successfully navigated real-world assignments in {activeTrack.title}
                  </p>

                  {/* Score & Fit Ring */}
                  <div className="mt-8 flex flex-col items-center justify-center">
                    <div className="relative flex h-36 w-36 items-center justify-center">
                      <svg className="absolute inset-0 -rotate-90" viewBox="0 0 100 100">
                        <circle cx="50" cy="50" r="42" fill="none" stroke="#f1f5f9" strokeWidth="8" />
                        <circle
                          cx="50"
                          cy="50"
                          r="42"
                          fill="none"
                          stroke={activeTrack.color}
                          strokeWidth="8"
                          strokeLinecap="round"
                          strokeDasharray="264"
                          strokeDashoffset={264 - (264 * fitPercent) / 100}
                          className="transition-all duration-1000 ease-out"
                        />
                      </svg>
                      <div className="flex flex-col items-center">
                        <span
                          className="font-display text-3xl font-black"
                          style={{ color: activeTrack.color }}
                        >
                          {fitPercent}%
                        </span>
                        <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400">
                          Career Fit
                        </span>
                      </div>
                    </div>

                    <div className="mt-4 flex flex-wrap items-center justify-center gap-2.5">
                      <span className="text-xs font-bold text-gray-600">
                        Solved {score} of {activeTrack.missions.length} Workplace Dilemmas Correctly
                      </span>
                      {resiliencePoints > 0 && (
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-orange-100 px-3 py-1 text-xs font-bold text-orange-800 border border-orange-200 shadow-xs">
                          <Flame className="h-3.5 w-3.5 text-orange-600" />
                          +{resiliencePoints} Resilience Mastery Pts
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Competency Score Bars */}
                  <div className="mt-10 mx-auto max-w-xl text-left border-t border-gray-100 pt-8">
                    <h4 className="font-display text-sm font-bold uppercase tracking-wider text-gray-500 mb-4">
                      Assessed Real-World Competencies:
                    </h4>
                    <div className="space-y-4">
                      {activeTrack.competencies.map((comp) => {
                        const calculatedScore = Math.min(
                          100,
                          Math.max(45, Math.round(comp.weight * (fitPercent / 100) + 15))
                        );
                        return (
                          <div key={comp.name}>
                            <div className="flex justify-between text-xs font-semibold text-gray-700 mb-1">
                              <span>{comp.name}</span>
                              <span className="font-bold">{calculatedScore}%</span>
                            </div>
                            <div className="h-2 w-full overflow-hidden rounded-full bg-gray-100">
                              <div
                                className="h-full rounded-full transition-all duration-1000 ease-out"
                                style={{
                                  width: `${calculatedScore}%`,
                                  backgroundColor: activeTrack.color,
                                }}
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Parent-Student Dialogue Callout Banner */}
                  <div className="mt-8 mx-auto max-w-xl rounded-2xl border-2 border-dashed border-orange-300 bg-orange-50/70 p-5 text-left">
                    <div className="flex items-start gap-3.5">
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-orange-500 text-white shadow-xs">
                        <Users className="h-5 w-5" />
                      </span>
                      <div>
                        <p className="font-display text-sm font-bold text-gray-900">
                          Reviewing this career with Mom & Dad?
                        </p>
                        <p className="mt-0.5 text-xs text-gray-600 leading-relaxed">
                          We prepared a specialized <strong>Parent-Student Alignment Dossier</strong> featuring 10-year Indian salary ladders, top government colleges (IITs, NLUs, AIIMS), and 3 constructive dinner table discussion questions.
                        </p>
                        <button
                          onClick={() => setCompletionTab("parent")}
                          className="mt-3 inline-flex cursor-pointer items-center gap-1.5 rounded-full bg-primary px-4 py-1.5 text-xs font-bold text-white shadow-xs hover:bg-primary-dark transition-all"
                        >
                          <span>Open Parent Dialogue Dossier</span>
                          <ArrowRight className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Educational Action Plan */}
                  <div className="mt-8 mx-auto max-w-xl rounded-2xl bg-orange-50/70 border border-orange-200/80 p-5 text-left text-xs leading-relaxed text-gray-700">
                    <p className="font-bold text-orange-900 mb-1 text-sm">
                      Recommended 10th-to-11th Stream & Roadmap:
                    </p>
                    <p>
                      <span className="font-semibold">Suggested Class 11-12 Focus: </span>
                      {activeTrack.recommendedStreams.join(", ")}
                    </p>
                    <p className="mt-1">
                      <span className="font-semibold">Key Indian Entrance Milestones: </span>
                      {activeTrack.keyExams.join(", ")}
                    </p>
                  </div>

                  {/* Action Buttons */}
                  <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
                    <button
                      onClick={() => setCompletionTab("parent")}
                      className="flex w-full sm:w-auto cursor-pointer items-center justify-center gap-2 rounded-full border border-orange-400 bg-orange-50 px-6 py-3 text-xs font-bold text-orange-800 shadow-sm transition-all hover:bg-orange-100 active:scale-95"
                    >
                      <Users className="h-4 w-4 text-orange-600" />
                      <span>Parent Dossier</span>
                    </button>

                    <button
                      onClick={() => setShowCertificateModal(true)}
                      className="flex w-full sm:w-auto cursor-pointer items-center justify-center gap-2 rounded-full border border-orange-300 bg-white px-6 py-3 text-xs font-bold text-orange-700 shadow-sm transition-all hover:bg-orange-50 active:scale-95"
                    >
                      <Award className="h-4 w-4 text-orange-500" />
                      <span>View Verified Credential</span>
                    </button>

                    <button
                      onClick={() => openBookingModal(activeTrack.id)}
                      className="flex w-full sm:w-auto cursor-pointer items-center justify-center gap-2 rounded-full border border-amber-400 bg-amber-50 px-6 py-3 text-xs font-bold text-amber-900 shadow-sm transition-all hover:bg-amber-100 active:scale-95"
                    >
                      <Users className="h-4 w-4 text-amber-700" />
                      <span>Book Mentor Call</span>
                    </button>

                    <button
                      onClick={resetSimulationState}
                      className="flex w-full sm:w-auto cursor-pointer items-center justify-center gap-2 rounded-full border border-gray-300 bg-white px-6 py-3 text-xs font-bold text-gray-700 shadow-sm transition-all hover:bg-gray-50 active:scale-95"
                    >
                      <RotateCcw className="h-4 w-4" />
                      <span>Retry Track</span>
                    </button>

                    <Link
                      href="/career-test"
                      className="flex w-full sm:w-auto cursor-pointer items-center justify-center gap-2 rounded-full bg-primary px-7 py-3 text-xs font-bold uppercase tracking-wider text-white shadow-lg shadow-primary/25 transition-all hover:bg-primary-dark active:scale-95"
                    >
                      <Sparkles className="h-4 w-4" />
                      <span>Get Full 360° Roadmap</span>
                    </Link>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ─── Official NEP 2020 Certificate Record Modal ─── */}
          <AnimatePresence>
            {showCertificateModal && (
              <>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setShowCertificateModal(false)}
                  className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm"
                />

                <motion.div
                  initial={{ opacity: 0, scale: 0.9, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: 10 }}
                  transition={{ duration: 0.3, ease: easeOutExpo }}
                  role="dialog"
                  aria-modal="true"
                  data-lenis-prevent
                  className="fixed inset-x-4 top-[6vh] z-50 mx-auto max-w-xl max-h-[90vh] overflow-y-auto rounded-3xl bg-white p-6 sm:p-8 shadow-2xl border-4 border-amber-200 overscroll-contain"
                >
                  <div className="text-center">
                    {/* Official National Emblem / Top Seal */}
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <span className="rounded-full bg-orange-100 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-orange-800 border border-orange-200">
                        NEP 2020 Experiential Vocational Record
                      </span>
                    </div>

                    <span className="font-display text-2xl font-black text-gradient">
                      PTIROS ACADEMIC NETWORK
                    </span>
                    <p className="text-[11px] uppercase tracking-wider text-gray-500 mt-0.5">
                      National Career Assessment & Virtual Simulation Directorate
                    </p>

                    <div className="my-6 rounded-2xl bg-gradient-to-br from-amber-50/80 via-white to-orange-50/80 border-2 border-amber-300/80 p-6 shadow-xs text-left relative overflow-hidden">
                      <div className="absolute -right-10 -bottom-10 h-32 w-32 rounded-full bg-amber-400/10 blur-xl pointer-events-none" />

                      <p className="text-[11px] uppercase tracking-wider text-gray-400 font-bold">Official Credential</p>
                      <p className="text-xs text-gray-600 mt-1">This certifies that student</p>

                      <div className="mt-1 border-b-2 border-orange-400 pb-1">
                        <input
                          type="text"
                          value={studentName}
                          onChange={(e) => setStudentName(e.target.value)}
                          placeholder="Type Your Full Name"
                          className="w-full font-display text-2xl font-black text-gray-900 bg-transparent focus:outline-none"
                        />
                      </div>

                      <p className="mt-3 text-xs text-gray-600 leading-relaxed">
                        has completed rigorous, industry-grade workplace simulations in the domain of
                      </p>
                      <p className="font-display text-lg font-black text-orange-600 mt-0.5">
                        {activeTrack.title}
                      </p>

                      {/* Micro-Credentials Grid */}
                      <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
                        <div className="rounded-xl bg-white/90 border border-amber-200 p-2.5">
                          <span className="text-[10px] uppercase font-bold text-gray-400">Aptitude Rating</span>
                          <p className="font-display text-base font-bold text-gray-900">{fitPercent}% Fit</p>
                        </div>
                        <div className="rounded-xl bg-white/90 border border-amber-200 p-2.5">
                          <span className="text-[10px] uppercase font-bold text-gray-400">Decision Stamina</span>
                          <p className="font-display text-base font-bold text-emerald-700">{score}/{activeTrack.missions.length} Optimal</p>
                        </div>
                      </div>

                      <div className="mt-4 pt-3 border-t border-amber-200/60 flex flex-wrap items-center justify-between text-[10px] text-gray-500 font-mono">
                        <span>ID: PTIROS-EXP-{activeTrack.id.toUpperCase().slice(0, 4)}-2026-V1</span>
                        <span>Date: 13 Nov 2026</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-gray-400 border-t border-gray-100 pt-3">
                      <span>Accredited Experiential Discovery</span>
                      <span>Verified Digital Record</span>
                    </div>

                    <div className="mt-6 flex gap-3">
                      <button
                        onClick={() => window.print()}
                        className="flex-1 rounded-full bg-primary py-3 text-xs font-bold text-white shadow-md hover:bg-primary-dark transition-all"
                      >
                        Print / Save Official Certificate
                      </button>
                      <button
                        onClick={() => setShowCertificateModal(false)}
                        className="flex-1 rounded-full border border-gray-200 py-3 text-xs font-bold text-gray-700 hover:bg-gray-50 transition-all"
                      >
                        Close
                      </button>
                    </div>
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </main>
      )}
    </div>
  );
}

export default function SimulatorPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#FFFBF5] flex items-center justify-center">Loading Simulator...</div>}>
      <SimulatorContent />
    </Suspense>
  );
}
