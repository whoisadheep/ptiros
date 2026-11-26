import { MENTORS } from "@/data/mentors";
import type {
  CareerDimensionId,
  CareerDimensionScore,
  CareerTrackMatchScore,
  StudentCareerTestRecord,
} from "@/types/database";

export type CareerTrackId =
  | "ai-robotics"
  | "corporate-law"
  | "ux-design"
  | "medicine"
  | "finance"
  | "media";

export interface AssessmentQuestionOption {
  id: string;
  text: string;
  traitLabel: string;
  trackWeights: Partial<Record<CareerTrackId, number>>;
  dimensionWeights: Partial<Record<CareerDimensionId, number>>;
}

export interface AssessmentQuestion {
  id: string;
  number: number;
  category: string;
  question: string;
  hint: string;
  options: AssessmentQuestionOption[];
}

export interface CareerTrackBlueprint {
  id: CareerTrackId;
  title: string;
  categoryLabel: string;
  archetypeTitle: string;
  archetypeSummary: string;
  brainZones: [string, string];
  learningStyle: string;
  recommendedStream: string;
  mandatorySubjects: string[];
  recommendedElectives: string[];
  criticalPitfall: string;
  entranceExams: string[];
  topColleges: { name: string; location: string; exam: string }[];
  salaryLadder: {
    entryLevel: string;
    midCareer: string;
    leadership: string;
    outlookNote: string;
  };
  parentBridgeNote: string;
  dinnerPrompts: string[];
  simulatorUrl: string;
  mentorId: string;
}

const DIMENSION_META: Record<
  CareerDimensionId,
  { label: string; highNote: string; midNote: string }
> = {
  analytical: {
    label: "Analytical & Systems Logic",
    highNote: "Exceptional root-cause isolation and first-principles problem breakdown.",
    midNote: "Solid logical structuring that benefits from algorithmic and case-based practice.",
  },
  creative: {
    label: "Creative Synthesis & Design",
    highNote: "Strong intuitive pattern recombination, originality, and visual/narrative sense.",
    midNote: "Balanced imagination with practical grounding in real-world constraints.",
  },
  quantitative: {
    label: "Quantitative & Economic Acuity",
    highNote: "Sharp fluency with probabilities, trade-offs, metrics, and structural models.",
    midNote: "Steady comfort with numbers that strengthens rapidly through applied challenges.",
  },
  empathy: {
    label: "Human Empathy & Care Intuition",
    highNote: "Deep awareness of human needs, calm bedside/user insight, and ethical judgment.",
    midNote: "Thoughtful people sense useful across collaborative and advisory environments.",
  },
  communication: {
    label: "Strategic Persuasion & Expression",
    highNote: "Natural ability to frame complex ideas clearly, advocate, and align diverse groups.",
    midNote: "Clear communication instincts ready to scale through debate and structured writing.",
  },
};

export const CAREER_TRACK_BLUEPRINTS: Record<CareerTrackId, CareerTrackBlueprint> = {
  "ai-robotics": {
    id: "ai-robotics",
    title: "AI & Autonomous Robotics",
    categoryLabel: "Technology, Engineering & DeepTech",
    archetypeTitle: "The Pragmatic Systems Builder",
    archetypeSummary:
      "You naturally decompose complex systems into measurable components and learn fastest by testing real prototypes rather than memorizing passive theory.",
    brainZones: ["Prefrontal Strategy", "Parietal Spatial-Logic"],
    learningStyle: "Hands-on experimentation, modular debugging, and visual system diagrams",
    recommendedStream: "Science (PCM — Physics, Chemistry, Mathematics)",
    mandatorySubjects: ["Mathematics", "Physics", "Chemistry"],
    recommendedElectives: ["Computer Science (Python)", "Artificial Intelligence / Electronics"],
    criticalPitfall:
      "Do not drop core Mathematics in Class 11–12; neural architectures, kinematics, and algorithmic engineering depend on calculus and linear algebra.",
    entranceExams: ["JEE Main", "JEE Advanced", "BITSAT", "IIIT-H UGEE"],
    topColleges: [
      { name: "IIT Madras / IIT Bombay / IIT Delhi", location: "National", exam: "JEE Advanced" },
      { name: "IIIT Hyderabad (Robotics & AI Labs)", location: "Telangana", exam: "UGEE / JEE Main" },
      { name: "BITS Pilani (Pilani / Goa / Hyd)", location: "Rajasthan / Goa", exam: "BITSAT" },
      { name: "NIT Trichy / NIT Surathkal", location: "Tamil Nadu / Karnataka", exam: "JEE Main" },
    ],
    salaryLadder: {
      entryLevel: "₹12 – 22 LPA",
      midCareer: "₹28 – 48 LPA",
      leadership: "₹65L – 1.4+ Cr",
      outlookNote:
        "India's semiconductor mission, industrial automation, and applied AI engineering face a sustained talent shortage across R&D centers and DeepTech startups.",
    },
    parentBridgeNote:
      "Building autonomous AI hardware and core systems engineering places your child among the architects of automation rather than those displaced by routine coding.",
    dinnerPrompts: [
      "What fascinates you more right now: physical machines/drones or software intelligence algorithms?",
      "Which everyday problem in our city would you automate or redesign first if you had a robotics kit?",
      "Would you enjoy a weekly tinkering project alongside school board preparation?",
    ],
    simulatorUrl: "/simulator?track=ai-robotics",
    mentorId: "dr-aryan-sharma",
  },
  "corporate-law": {
    id: "corporate-law",
    title: "Corporate Law & Public Policy",
    categoryLabel: "Law, Governance & Strategic Advisory",
    archetypeTitle: "The Civic Strategist",
    archetypeSummary:
      "You weigh fairness, rules, and second-order consequences instinctively, spotting flaws in arguments long before others notice them.",
    brainZones: ["Left-Temporal Verbal", "Frontal Executive Critique"],
    learningStyle: "Case debates, Socratic questioning, reading patterns, and structured briefs",
    recommendedStream: "Humanities or Commerce with Legal Studies / Economics",
    mandatorySubjects: ["English", "Political Science or Business Studies"],
    recommendedElectives: ["Legal Studies", "Economics", "Applied Mathematics"],
    criticalPitfall:
      "Avoid forcing Science out of habit; scoring strongly in Humanities or Commerce while reserving focused daily time for CLAT reading comprehension boosts NLU admission odds dramatically.",
    entranceExams: ["CLAT", "AILET (NLU Delhi)", "SLAT", "LSAT-India"],
    topColleges: [
      { name: "NLSIU Bengaluru", location: "Karnataka", exam: "CLAT" },
      { name: "NALSAR University of Law", location: "Hyderabad", exam: "CLAT" },
      { name: "NLU Delhi", location: "New Delhi", exam: "AILET" },
      { name: "WBNUJS Kolkata / NLU Jodhpur", location: "Kolkata / Jodhpur", exam: "CLAT" },
    ],
    salaryLadder: {
      entryLevel: "₹15 – 22 LPA",
      midCareer: "₹35 – 68 LPA",
      leadership: "₹90L – 2.5+ Cr",
      outlookNote:
        "Tier-1 corporate law firms, tech policy teams, and cross-border M&A desks recruit straight from premier 5-year NLUs with compensation rivalling top engineering graduates.",
    },
    parentBridgeNote:
      "Modern corporate law centers on venture deals, AI regulation, and boardroom advisory rather than stereotypical lower-court litigation.",
    dinnerPrompts: [
      "What kind of debates make you lose track of time — rules & fairness, tech privacy, or business deals?",
      "Would you enjoy representing startup founders or writing national technology policy briefs?",
      "Which book, news story, or rule recently felt unfair to you, and how would you rewrite it?",
    ],
    simulatorUrl: "/simulator?track=corporate-law",
    mentorId: "adv-sneha-mukherjee",
  },
  "ux-design": {
    id: "ux-design",
    title: "Product Architecture & UX Design",
    categoryLabel: "Human-Centered Tech & Design Systems",
    archetypeTitle: "The Human-Centered Architect",
    archetypeSummary:
      "You combine sharp visual intuition with deep user empathy, noticing friction in everyday tools and reimagining simpler pathways.",
    brainZones: ["Right-Parietal Spatial", "Prefrontal Empathy Mapping"],
    learningStyle: "Observational sketching, rapid interactive prototyping, and user critiques",
    recommendedStream: "Open to Any Stream (Science, Commerce, or Humanities + Design Portfolio)",
    mandatorySubjects: ["English", "Mathematics or Psychology (Helpful)"],
    recommendedElectives: ["Design / Fine Arts", "Computer Science", "Psychology"],
    criticalPitfall:
      "Do not wait until after Class 12 board exams to start a portfolio; UCEED and NID DAT test spatial visualization, observation, and product problem-solving over years.",
    entranceExams: ["UCEED (IITs)", "NID DAT", "NIFT", "CEED (Masters Track)"],
    topColleges: [
      { name: "IDC School of Design — IIT Bombay", location: "Mumbai", exam: "UCEED" },
      { name: "National Institute of Design (NID)", location: "Ahmedabad", exam: "NID DAT" },
      { name: "IIT Delhi / IIT Guwahati / IIT Hyderabad (B.Des)", location: "National", exam: "UCEED" },
      { name: "IIIT Delhi (CSD Design Track)", location: "New Delhi", exam: "UCEED / JEE" },
    ],
    salaryLadder: {
      entryLevel: "₹10 – 18 LPA",
      midCareer: "₹24 – 44 LPA",
      leadership: "₹55L – 1.1+ Cr",
      outlookNote:
        "Product & UX designers sit at the core of Indian tech companies building fintech, AI interfaces, and vernacular platforms for India's next billion users.",
    },
    parentBridgeNote:
      "Product UX Design at IITs and NID is high-earning technological problem-solving grounded in cognitive psychology — not traditional fine-art painting.",
    dinnerPrompts: [
      "Which app or physical product on our kitchen table annoys you most, and how would you redesign it?",
      "Do you enjoy understanding how users think, or crafting the visual look and motion feel more?",
      "Should we start a small monthly notebook of design observations and redesign sketches?",
    ],
    simulatorUrl: "/simulator?track=ux-design",
    mentorId: "ananya-roy",
  },
  medicine: {
    id: "medicine",
    title: "Digital Health & Clinical Medicine",
    categoryLabel: "Clinical Sciences, BioTech & MedTech",
    archetypeTitle: "The Clinical Investigator",
    archetypeSummary:
      "You stay composed when responsibility is high, connect subtle biological clues systematically, and care deeply about tangible human recovery.",
    brainZones: ["Diagnostic Prefrontal", "Insular Empathy & Calm"],
    learningStyle: "Structured NCERT conceptual mastery, clinical case tracing, and visual anatomy",
    recommendedStream: "Science (PCB — Physics, Chemistry, Biology)",
    mandatorySubjects: ["Biology", "Chemistry", "Physics"],
    recommendedElectives: ["Biotechnology", "Psychology / Applied Math"],
    criticalPitfall:
      "Do not treat Physics as secondary to Biology; competitive NEET ranks are frequently decided by speed and confidence in Physics numericals.",
    entranceExams: ["NEET-UG", "IISER IAT (Bio-Research)", "CUET (Life Sciences)"],
    topColleges: [
      { name: "AIIMS New Delhi & AIIMS Campuses", location: "New Delhi / National", exam: "NEET-UG" },
      { name: "CMC Vellore", location: "Tamil Nadu", exam: "NEET-UG" },
      { name: "JIPMER Puducherry", location: "Puducherry", exam: "NEET-UG" },
      { name: "MAMC Delhi / KGMU / KMC Manipal", location: "National", exam: "NEET-UG" },
    ],
    salaryLadder: {
      entryLevel: "₹10 – 16 LPA",
      midCareer: "₹26 – 50 LPA",
      leadership: "₹65L – 1.8+ Cr",
      outlookNote:
        "Clinical medicine combined with BioTech, genomics, and digital health informatics offers unmatched career resilience and societal respect.",
    },
    parentBridgeNote:
      "Beyond standard MBBS practice, today's top clinicians pioneer AI diagnostics, surgical robotics, biomedical devices, and translational genomics.",
    dinnerPrompts: [
      "What draws you most: direct patient diagnosis and emergency care, or discovering new treatments in a lab?",
      "How do you handle high-focus reading subjects like Biology alongside numerical Physics practice?",
      "Would you enjoy shadowing a doctor or visiting a medical university open day this year?",
    ],
    simulatorUrl: "/simulator?track=medicine",
    mentorId: "dr-rohan-verma",
  },
  finance: {
    id: "finance",
    title: "Quantitative Finance & Economics",
    categoryLabel: "Capital Markets, Wealth & Econometrics",
    archetypeTitle: "The Quantitative Strategist",
    archetypeSummary:
      "You naturally weigh risk versus reward, look past emotional noise in numbers, and enjoy structuring long-term compounding decisions.",
    brainZones: ["Parietal Numerical Grid", "Frontal Risk Calibration"],
    learningStyle: "Scenario modelling, market post-mortems, spreadsheet thinking, and applied probability",
    recommendedStream: "Commerce with Core/Applied Mathematics OR Science (PCM)",
    mandatorySubjects: ["Mathematics / Applied Mathematics", "Economics"],
    recommendedElectives: ["Accountancy", "Business Studies", "Computer Science / Statistics"],
    criticalPitfall:
      "Never opt for Commerce without Mathematics if targeting SRCC Economics, IIM IPMAT, ISI, or quantitative FinTech roles — math eligibility is non-negotiable.",
    entranceExams: ["IPMAT (IIM Indore/Rohtak)", "CUET-UG (SRCC/St. Stephen's)", "NPAT", "JEE / ISI Admission Test"],
    topColleges: [
      { name: "IIM Indore / IIM Rohtak (5-Yr IPM)", location: "MP / Haryana", exam: "IPMAT" },
      { name: "SRCC & St. Stephen's College (DU)", location: "New Delhi", exam: "CUET-UG" },
      { name: "Indian Statistical Institute (ISI)", location: "Kolkata / Bengaluru", exam: "ISI Test" },
      { name: "IIT Kharagpur / IIT Kanpur (Financial Engg)", location: "National", exam: "JEE Advanced" },
    ],
    salaryLadder: {
      entryLevel: "₹14 – 28 LPA",
      midCareer: "₹35 – 75 LPA",
      leadership: "₹1.0 – 3.0+ Cr",
      outlookNote:
        "India's booming capital markets, digital fintech rails, and institutional wealth advisory create exceptional upside for quantitatively sharp strategists.",
    },
    parentBridgeNote:
      "Strong Commerce-plus-Mathematics or Quantitative Economics combines stability with global corporate mobility across banking, startups, and fund management.",
    dinnerPrompts: [
      "When you hear about a company growing fast or crashing, what is the first question you want answered?",
      "Would you enjoy tracking household/business investments and learning how compounding works over 10 years?",
      "Do you prefer Economics/Business strategy or pure mathematical modelling?",
    ],
    simulatorUrl: "/simulator?track=finance",
    mentorId: "vikramaditya-sen",
  },
  media: {
    id: "media",
    title: "Creative Media & Digital Storytelling",
    categoryLabel: "Media Economics, Film & Brand Strategy",
    archetypeTitle: "The Cultural Storyteller",
    archetypeSummary:
      "You sense why audiences pause, feel, and remember stories, uniting narrative instinct with modern digital distribution systems.",
    brainZones: ["Visual-Auditory Association", "Social Narrative Framing"],
    learningStyle: "Project creation, visual breakdown, writing hooks, and audience experimentation",
    recommendedStream: "Humanities, Commerce, or Science (Open Stream Flexibility)",
    mandatorySubjects: ["English Literature / Communication", "Social Sciences / Psychology"],
    recommendedElectives: ["Media Studies", "Economics", "Design / Performing Arts"],
    criticalPitfall:
      "Never equate modern media careers with casual social-media scrolling; lasting creative directors read deeply in history, behavioral psychology, and business economics.",
    entranceExams: ["CUET-UG (DU / JMI)", "XET (St. Xavier's)", "SIMC Entrance", "FTII JET (PG)"],
    topColleges: [
      { name: "St. Xavier's College (BAMMC)", location: "Mumbai", exam: "XET" },
      { name: "Ashoka University / Krea University", location: "NCR / AP", exam: "Holistic + AAT" },
      { name: "Symbiosis Institute of Media & Comm", location: "Pune", exam: "SET / SIMC" },
      { name: "IIMC New Delhi / FTII Pune", location: "Delhi / Pune", exam: "CUET-PG / JET" },
    ],
    salaryLadder: {
      entryLevel: "₹9 – 16 LPA",
      midCareer: "₹22 – 42 LPA",
      leadership: "₹55L – 1.2+ Cr",
      outlookNote:
        "OTT studios, interactive gaming, and D2C brand leadership rely heavily on strategic producers who pair creative taste with audience analytics.",
    },
    parentBridgeNote:
      "Strategic media production combines brand consulting, product marketing, and IP ownership — high-leverage business roles well beyond hobby filmmaking.",
    dinnerPrompts: [
      "Why do certain ads, films, or creators hold our attention while others feel forgettable?",
      "Would you rather direct the story/script, craft visuals/editing, or lead creative business strategy?",
      "What small creative project (podcast, short film, newsletter) could you ship in the next 30 days?",
    ],
    simulatorUrl: "/simulator?track=media",
    mentorId: "kabir-mehta",
  },
};

export const CAREER_ASSESSMENT_QUESTIONS: AssessmentQuestion[] = [
  {
    id: "q1_puzzle",
    number: 1,
    category: "Analytical & Problem Solving",
    question: "When an unfamiliar school project or tricky problem stalls your progress, what is your natural first move?",
    hint: "Pick the instinct that happens automatically before anyone gives you instructions.",
    options: [
      {
        id: "q1_a",
        text: "Break the system into smaller pieces and test step-by-step where logic broke down",
        traitLabel: "Systems Deconstructor",
        trackWeights: { "ai-robotics": 4, finance: 2 },
        dimensionWeights: { analytical: 4, quantitative: 2 },
      },
      {
        id: "q1_b",
        text: "Sketch an easier user flow or prototype a simpler, cleaner workaround",
        traitLabel: "Human-Centered Maker",
        trackWeights: { "ux-design": 4, media: 2 },
        dimensionWeights: { creative: 4, empathy: 2 },
      },
      {
        id: "q1_c",
        text: "Examine all the facts and evidence carefully before defending one conclusion",
        traitLabel: "Evidence Analyst",
        trackWeights: { "corporate-law": 3, medicine: 3 },
        dimensionWeights: { analytical: 3, communication: 2 },
      },
      {
        id: "q1_d",
        text: "Estimate costs, probabilities, and payoff so effort goes only where impact is highest",
        traitLabel: "Decision Optimizer",
        trackWeights: { finance: 4, "corporate-law": 1 },
        dimensionWeights: { quantitative: 4, analytical: 2 },
      },
    ],
  },
  {
    id: "q2_bagless",
    number: 2,
    category: "Interest & Curiosity (Bagless Day)",
    question: "Your school announces a full zero-textbook Bagless Discovery Day. Which 3-hour studio do you sprint to join?",
    hint: "Ignore board marks or parent expectations — just follow pure curiosity.",
    options: [
      {
        id: "q2_a",
        text: "Autonomous Rover & AI Lab: wiring sensors and programming obstacle-avoidance logic",
        traitLabel: "DeepTech Builder",
        trackWeights: { "ai-robotics": 5 },
        dimensionWeights: { analytical: 3, quantitative: 2, creative: 1 },
      },
      {
        id: "q2_b",
        text: "Clinical Forensics & Bio-Tech Lab: diagnosing simulated patient vitals under time limits",
        traitLabel: "Clinical Investigator",
        trackWeights: { medicine: 5 },
        dimensionWeights: { analytical: 2, empathy: 4 },
      },
      {
        id: "q2_c",
        text: "Stock Market & Startup Pitch Arena: evaluating real businesses and pricing risk",
        traitLabel: "Capital Strategist",
        trackWeights: { finance: 5 },
        dimensionWeights: { quantitative: 4, communication: 1 },
      },
      {
        id: "q2_d",
        text: "Supreme Court Moot & Tech Policy Council: debating real constitutional dilemmas",
        traitLabel: "Legal Advocate",
        trackWeights: { "corporate-law": 5 },
        dimensionWeights: { communication: 4, analytical: 2 },
      },
      {
        id: "q2_e",
        text: "Product Design & Short-Film Studio: redesigning confusing apps or crafting visual stories",
        traitLabel: "Experience Creator",
        trackWeights: { "ux-design": 3, media: 3 },
        dimensionWeights: { creative: 4, empathy: 2 },
      },
    ],
  },
  {
    id: "q3_team",
    number: 3,
    category: "Collaboration & Team Role",
    question: "In an inter-school competition team of four students, which responsibility naturally lands in your hands?",
    hint: "Think about what teammates thank you for afterwards.",
    options: [
      {
        id: "q3_a",
        text: "The Core Architect who tackles the hardest technical build or mathematical verification",
        traitLabel: "Core Technical Lead",
        trackWeights: { "ai-robotics": 3, finance: 3 },
        dimensionWeights: { analytical: 3, quantitative: 3 },
      },
      {
        id: "q3_b",
        text: "The Storyteller who shapes slides, visuals, hooks, and makes judges truly care",
        traitLabel: "Narrative & Experience Lead",
        trackWeights: { media: 4, "ux-design": 3 },
        dimensionWeights: { creative: 3, communication: 3 },
      },
      {
        id: "q3_c",
        text: "The Cross-Examiner who anticipates tough judge questions and prepares airtight answers",
        traitLabel: "Strategic Debater",
        trackWeights: { "corporate-law": 4, finance: 1 },
        dimensionWeights: { communication: 4, analytical: 2 },
      },
      {
        id: "q3_d",
        text: "The Anchor who notices overwhelmed teammates, keeps everyone calm, and tracks human impact",
        traitLabel: "Empathetic Coordinator",
        trackWeights: { medicine: 4, "ux-design": 2 },
        dimensionWeights: { empathy: 5, communication: 1 },
      },
    ],
  },
  {
    id: "q4_crisis",
    number: 4,
    category: "Decision Making Under Pressure",
    question: "An urgent unexpected problem hits 20 minutes before a deadline. What calms your mind fastest?",
    hint: "How your brain restores order reveals genuine career stamina.",
    options: [
      {
        id: "q4_a",
        text: "Checking logs, formulas, and raw numbers — data never panics even when people do",
        traitLabel: "Quantitative Composure",
        trackWeights: { finance: 4, "ai-robotics": 3 },
        dimensionWeights: { quantitative: 4, analytical: 2 },
      },
      {
        id: "q4_b",
        text: "Prioritizing who gets affected most and stabilizing the human side immediately",
        traitLabel: "Crisis Triage Instinct",
        trackWeights: { medicine: 4, "ux-design": 2 },
        dimensionWeights: { empathy: 4, analytical: 1 },
      },
      {
        id: "q4_c",
        text: "Re-reading exact rules/commitments so we make zero careless procedural mistakes",
        traitLabel: "Fiduciary Discipline",
        trackWeights: { "corporate-law": 4, medicine: 1 },
        dimensionWeights: { analytical: 3, communication: 2 },
      },
      {
        id: "q4_d",
        text: "Simplifying the presentation story on the fly so the core message still lands powerfully",
        traitLabel: "Adaptive Communicator",
        trackWeights: { media: 4, "ux-design": 3 },
        dimensionWeights: { creative: 3, communication: 3 },
      },
    ],
  },
  {
    id: "q5_media",
    number: 5,
    category: "Subconscious Attention Patterns",
    question: "When exploring YouTube, podcasts, or articles without homework, which rabbit hole holds your attention longest?",
    hint: "What you read voluntarily is stronger evidence than marks.",
    options: [
      {
        id: "q5_a",
        text: "How AI models, rockets, chips, or robots work under the hood",
        traitLabel: "Engineering Curiosity",
        trackWeights: { "ai-robotics": 4 },
        dimensionWeights: { analytical: 3, quantitative: 2 },
      },
      {
        id: "q5_b",
        text: "Why brands go viral, behind-the-scenes cinema craft, or interactive product design",
        traitLabel: "Design & Media Instinct",
        trackWeights: { media: 3, "ux-design": 4 },
        dimensionWeights: { creative: 4, empathy: 1 },
      },
      {
        id: "q5_c",
        text: "How the human brain heals, medical mysteries, or neuroscience breakthroughs",
        traitLabel: "Biological Inquiry",
        trackWeights: { medicine: 4 },
        dimensionWeights: { empathy: 3, analytical: 2 },
      },
      {
        id: "q5_d",
        text: "Why economies boom/crash, geopolitical treaties, or landmark corporate court battles",
        traitLabel: "Macro & Policy Mind",
        trackWeights: { finance: 3, "corporate-law": 3 },
        dimensionWeights: { quantitative: 2, communication: 2, analytical: 2 },
      },
    ],
  },
  {
    id: "q6_learning",
    number: 6,
    category: "Natural Learning Engine",
    question: "Think about the concept you understood fastest this year. What made it finally click?",
    hint: "Helps us tailor your study planner format too.",
    options: [
      {
        id: "q6_a",
        text: "Building a working model, writing code, or solving tough numerical puzzles",
        traitLabel: "Constructive Builder",
        trackWeights: { "ai-robotics": 4, finance: 2 },
        dimensionWeights: { analytical: 3, quantitative: 3 },
      },
      {
        id: "q6_b",
        text: "Drawing visual mind maps, interfaces, or storytelling analogies",
        traitLabel: "Visual Synthesizer",
        trackWeights: { "ux-design": 4, media: 3 },
        dimensionWeights: { creative: 4, empathy: 1 },
      },
      {
        id: "q6_c",
        text: "Teaching it to a friend, debating viewpoints, or writing structured arguments",
        traitLabel: "Dialogic Thinker",
        trackWeights: { "corporate-law": 4, media: 2 },
        dimensionWeights: { communication: 4, empathy: 1 },
      },
      {
        id: "q6_d",
        text: "Connecting how a system affects living organisms, real patients, or communities",
        traitLabel: "Applied Life Systems",
        trackWeights: { medicine: 4, "ux-design": 1 },
        dimensionWeights: { empathy: 3, analytical: 2 },
      },
    ],
  },
  {
    id: "q7_impact",
    number: 7,
    category: "Long-Horizon Ambition",
    question: "Fast forward 12 years: which headline about your work would genuinely make you proudest?",
    hint: "Choose the outcome whose daily craft feels meaningful.",
    options: [
      {
        id: "q7_a",
        text: "Engineered autonomous machines or AI infrastructure deployed across Indian industry",
        traitLabel: "DeepTech Impact",
        trackWeights: { "ai-robotics": 5 },
        dimensionWeights: { analytical: 3, creative: 1, quantitative: 1 },
      },
      {
        id: "q7_b",
        text: "Shaped landmark technology regulations, human rights precedents, or billion-dollar deals",
        traitLabel: "Institutional Leadership",
        trackWeights: { "corporate-law": 5 },
        dimensionWeights: { communication: 4, analytical: 2 },
      },
      {
        id: "q7_c",
        text: "Led life-saving clinical innovations or affordable medical breakthroughs for families",
        traitLabel: "Healing & BioTech",
        trackWeights: { medicine: 5 },
        dimensionWeights: { empathy: 4, analytical: 2 },
      },
      {
        id: "q7_d",
        text: "Built financial strategies compounding wealth or designed products loved by millions daily",
        traitLabel: "Product & Market Craft",
        trackWeights: { finance: 3, "ux-design": 4 },
        dimensionWeights: { quantitative: 3, creative: 3 },
      },
      {
        id: "q7_e",
        text: "Directed cultural stories, documentaries, or brand movements shaping national conversation",
        traitLabel: "Cultural Voice",
        trackWeights: { media: 5 },
        dimensionWeights: { creative: 4, communication: 3 },
      },
    ],
  },
  {
    id: "q8_workspace",
    number: 8,
    category: "Everyday Craft Preference",
    question: "If you had to spend 4 focused hours every afternoon mastering one craft, which would drain you the LEAST?",
    hint: "Sustainable careers come from energy-giving daily work.",
    options: [
      {
        id: "q8_a",
        text: "Writing clean code, testing circuits, or modeling predictive algorithms",
        traitLabel: "Technical Craft",
        trackWeights: { "ai-robotics": 4, finance: 1 },
        dimensionWeights: { analytical: 3, quantitative: 2 },
      },
      {
        id: "q8_b",
        text: "Analyzing financial statements, market charts, and risk probability scenarios",
        traitLabel: "Market Craft",
        trackWeights: { finance: 4 },
        dimensionWeights: { quantitative: 4, analytical: 1 },
      },
      {
        id: "q8_c",
        text: "Interviewing users, wireframing screens, and refining product usability",
        traitLabel: "Design Craft",
        trackWeights: { "ux-design": 4, media: 1 },
        dimensionWeights: { creative: 3, empathy: 3 },
      },
      {
        id: "q8_d",
        text: "Reading clinical cases, anatomical research, or advising people through hard moments",
        traitLabel: "Care Craft",
        trackWeights: { medicine: 4, "corporate-law": 1 },
        dimensionWeights: { empathy: 4, analytical: 1 },
      },
      {
        id: "q8_e",
        text: "Drafting persuasive arguments, negotiating, or scripting visual stories",
        traitLabel: "Persuasion Craft",
        trackWeights: { "corporate-law": 3, media: 3 },
        dimensionWeights: { communication: 4, creative: 2 },
      },
    ],
  },
];

export interface AssessmentStudentContext {
  studentName: string;
  grade: string;
  curriculum?: string;
  city?: string;
  state?: string;
  schoolName?: string;
  parentName?: string;
  parentDream?: string;
  lastYearPercentage?: string;
  lastYearRank?: string;
  proSports?: boolean;
  competitions?: string;
  aparId?: string;
}

export interface EvaluatedCareerAssessment {
  topTrack: CareerTrackBlueprint;
  secondaryTrack: CareerTrackBlueprint;
  alternateTrack: CareerTrackBlueprint;
  matchConfidence: number;
  archetype: string;
  recommendedStream: string;
  dimensionScores: CareerDimensionScore[];
  rankedTracks: CareerTrackMatchScore[];
  gradeStageLabel: string;
  quarterlyActionPlan: { quarter: string; title: string; detail: string }[];
  parentDreamAlignmentNote: string;
  mentor: (typeof MENTORS)[number];
}

export function getGradeActionPlan(grade: string, topTrack: CareerTrackBlueprint) {
  const numMatch = grade.match(/\d+/);
  const std = numMatch ? parseInt(numMatch[0], 10) : 10;

  if (std <= 8) {
    return {
      gradeStageLabel: "Middle School Discovery Stage (Classes 6–8)",
      quarterlyActionPlan: [
        {
          quarter: "Q1 (Months 1–3)",
          title: "Zero-Pressure Curiosity & Simulator Labs",
          detail: `Complete the ${topTrack.title} simulator lab plus one opposite-domain lab (e.g., Design or Finance) to compare natural energy levels.`,
        },
        {
          quarter: "Q2 (Months 4–6)",
          title: "Bagless Days Mini-Portfolio",
          detail: "Ship one tangible weekend mini-project (a small circuit, redesign sketch, debate journal, or science logbook) instead of passive memorizing.",
        },
        {
          quarter: "Q3 (Months 7–9)",
          title: "Core Foundation & Reading Habit",
          detail: `Build effortless intuition in ${topTrack.mandatorySubjects[0]} and logical reasoning while reading 1 biography or domain explainer per month.`,
        },
        {
          quarter: "Q4 (Months 10–12)",
          title: "Competition Exploration & Mentor Review",
          detail: "Try one stress-free school olympiad or competition and schedule a family debrief to track evolving strengths.",
        },
      ],
    };
  }

  if (std <= 10) {
    return {
      gradeStageLabel: "Stream & Identity Crossroads (Classes 9–10)",
      quarterlyActionPlan: [
        {
          quarter: "Q1 (Months 1–3)",
          title: "Lock Subject Affinity Without Peer Pressure",
          detail: `Evaluate comfort across ${topTrack.mandatorySubjects.join(" & ")} alongside daily NCERT clarity before locking Class 11 stream.`,
        },
        {
          quarter: "Q2 (Months 4–6)",
          title: "Applied Validation & Entrance Orientation",
          detail: `Explore sample papers of ${topTrack.entranceExams.slice(0, 2).join(" & ")} purely to test conceptual style — no rushed coaching panic.`,
        },
        {
          quarter: "Q3 (Months 7–9)",
          title: "Board Exam Kaizen + Activity Proof",
          detail: "Balance 85%+ NCERT board fundamentals with one verified leadership, olympiad, or project artifact in your Activity Locker.",
        },
        {
          quarter: "Q4 (Months 10–12)",
          title: "Final Stream & Elective Confirmation Call",
          detail: `Sit with parents and your PTIROS mentor (${MENTORS.find((m) => m.domainId.includes(topTrack.id.split("-")[0]))?.name || "Senior Mentor"}) to select ${topTrack.recommendedStream}.`,
        },
      ],
    };
  }

  return {
    gradeStageLabel: "Senior Execution & College Admissions Stage (Classes 11–12+)",
    quarterlyActionPlan: [
      {
        quarter: "Q1 (Months 1–3)",
        title: "Exam & Backup Matrix Calibration",
        detail: `Anchor weekly prep around ${topTrack.entranceExams[0]} while securing Plan-B eligibility via ${topTrack.entranceExams.slice(1, 3).join(" / ") || "CUET"}.`,
      },
      {
        quarter: "Q2 (Months 4–6)",
        title: "High-Yield Weak-Topic Audits",
        detail: "Convert weak mock sections into fortnightly Kaizen checklists inside your Dashboard Planner (Daily/Monthly views).",
      },
      {
        quarter: "Q3 (Months 7–9)",
        title: "Shortlist Target Colleges & Portfolios",
        detail: `Map cutoff/portfolio requirements for ${topTrack.topColleges.slice(0, 2).map((c) => c.name).join(" and ")} and complete mock interviews.`,
      },
      {
        quarter: "Q4 (Months 10–12)",
        title: "Final Exam Execution & Counseling Readiness",
        detail: "Protect sleep/recovery rhythm, finalize application deadlines, and verify NEP/APAAR documentation for smooth university onboarding.",
      },
    ],
  };
}

export function evaluateCareerAssessment(
  answers: Record<string, string>,
  context: AssessmentStudentContext
): EvaluatedCareerAssessment {
  const trackRaw: Record<CareerTrackId, number> = {
    "ai-robotics": 0,
    "corporate-law": 0,
    "ux-design": 0,
    medicine: 0,
    finance: 0,
    media: 0,
  };

  const dimRaw: Record<CareerDimensionId, number> = {
    analytical: 0,
    creative: 0,
    quantitative: 0,
    empathy: 0,
    communication: 0,
  };

  const dimMax: Record<CareerDimensionId, number> = {
    analytical: 1,
    creative: 1,
    quantitative: 1,
    empathy: 1,
    communication: 1,
  };

  for (const q of CAREER_ASSESSMENT_QUESTIONS) {
    // Track theoretical maximum per dimension for balanced normalization
    const perDimBest: Partial<Record<CareerDimensionId, number>> = {};
    for (const opt of q.options) {
      for (const [dim, w] of Object.entries(opt.dimensionWeights) as [CareerDimensionId, number][]) {
        perDimBest[dim] = Math.max(perDimBest[dim] || 0, w);
      }
    }
    for (const [dim, bestW] of Object.entries(perDimBest) as [CareerDimensionId, number][]) {
      dimMax[dim] += bestW;
    }

    const chosenId = answers[q.id];
    const matchedOpt = q.options.find(
      (o) => o.id === chosenId || o.text === chosenId
    );
    if (!matchedOpt) continue;

    for (const [trackId, w] of Object.entries(matchedOpt.trackWeights) as [CareerTrackId, number][]) {
      trackRaw[trackId] += w;
    }
    for (const [dim, w] of Object.entries(matchedOpt.dimensionWeights) as [CareerDimensionId, number][]) {
      dimRaw[dim] += w;
    }
  }

  // Subtle alignment bonus from stated parent/student dream if keywords clearly align (never overrides psychometric answers)
  const dreamLower = (context.parentDream || "").toLowerCase();
  if (dreamLower.includes("robot") || dreamLower.includes("ai") || dreamLower.includes("engineer") || dreamLower.includes("cs")) {
    trackRaw["ai-robotics"] += 1.5;
  } else if (dreamLower.includes("law") || dreamLower.includes("ias") || dreamLower.includes("policy")) {
    trackRaw["corporate-law"] += 1.5;
  } else if (dreamLower.includes("design") || dreamLower.includes("ux") || dreamLower.includes("architect")) {
    trackRaw["ux-design"] += 1.5;
  } else if (dreamLower.includes("med") || dreamLower.includes("doctor") || dreamLower.includes("bio")) {
    trackRaw.medicine += 1.5;
  } else if (dreamLower.includes("fin") || dreamLower.includes("ca") || dreamLower.includes("econ") || dreamLower.includes("quant")) {
    trackRaw.finance += 1.5;
  } else if (dreamLower.includes("media") || dreamLower.includes("film") || dreamLower.includes("journal")) {
    trackRaw.media += 1.5;
  }

  const maxTrackScore = Math.max(...Object.values(trackRaw), 1);

  const rankedTracks: CareerTrackMatchScore[] = (Object.keys(CAREER_TRACK_BLUEPRINTS) as CareerTrackId[])
    .map((trackId) => {
      const bp = CAREER_TRACK_BLUEPRINTS[trackId];
      const ratio = trackRaw[trackId] / maxTrackScore;
      // Realistic diagnostic spread between 58% and 96%
      const matchPercent = Math.min(96, Math.max(58, Math.round(58 + ratio * 38)));
      return {
        trackId,
        trackTitle: bp.title,
        categoryLabel: bp.categoryLabel,
        matchPercent,
        recommendedStream: bp.recommendedStream,
        simulatorUrl: bp.simulatorUrl,
        mentorId: bp.mentorId,
      };
    })
    .sort((a, b) => b.matchPercent - a.matchPercent);

  const dimensionScores: CareerDimensionScore[] = (Object.keys(DIMENSION_META) as CareerDimensionId[])
    .map((dim) => {
      const ratio = dimRaw[dim] / Math.max(dimMax[dim], 1);
      const score = Math.min(97, Math.max(52, Math.round(50 + ratio * 47)));
      const meta = DIMENSION_META[dim];
      return {
        id: dim,
        label: meta.label,
        score,
        summary: score >= 78 ? meta.highNote : meta.midNote,
      };
    })
    .sort((a, b) => b.score - a.score);

  const topTrack = CAREER_TRACK_BLUEPRINTS[rankedTracks[0].trackId as CareerTrackId];
  const secondaryTrack = CAREER_TRACK_BLUEPRINTS[rankedTracks[1].trackId as CareerTrackId];
  const alternateTrack = CAREER_TRACK_BLUEPRINTS[rankedTracks[2].trackId as CareerTrackId];

  const mentor =
    MENTORS.find((m) => m.id === topTrack.mentorId) || MENTORS[0];

  const { gradeStageLabel, quarterlyActionPlan } = getGradeActionPlan(
    context.grade || "Class 10",
    topTrack
  );

  const parentDreamAlignmentNote = context.parentDream
    ? `Saved family aspiration ("${context.parentDream}") has been compared objectively against your natural cognitive scores (${topTrack.title} at ${rankedTracks[0].matchPercent}% and ${secondaryTrack.title} at ${rankedTracks[1].matchPercent}%). Use Section 7 in the full report to align stream decisions calmly with facts.`
    : `No fixed family dream constraint recorded yet — this gives you healthy flexibility to evaluate ${topTrack.title} (${rankedTracks[0].matchPercent}%) alongside ${secondaryTrack.title} (${rankedTracks[1].matchPercent}%) cleanly.`;

  return {
    topTrack,
    secondaryTrack,
    alternateTrack,
    matchConfidence: rankedTracks[0].matchPercent,
    archetype: topTrack.archetypeTitle,
    recommendedStream: topTrack.recommendedStream,
    dimensionScores,
    rankedTracks,
    gradeStageLabel,
    quarterlyActionPlan,
    parentDreamAlignmentNote,
    mentor,
  };
}

export interface DossierReportPage {
  pageNumber: number;
  tier: "free" | "paid";
  tag: string;
  title: string;
  subtitle: string;
  metrics?: { label: string; value: string }[];
  bullets: string[];
  callout?: { title: string; body: string };
}

export function buildReportPagesFromRecord(
  record: StudentCareerTestRecord,
  context: AssessmentStudentContext
): DossierReportPage[] {
  const topTrack =
    CAREER_TRACK_BLUEPRINTS[record.topTrackId as CareerTrackId] ||
    CAREER_TRACK_BLUEPRINTS["ai-robotics"];
  const secondaryId = record.rankedTracks[1]?.trackId as CareerTrackId | undefined;
  const secondaryTrack =
    (secondaryId && CAREER_TRACK_BLUEPRINTS[secondaryId]) ||
    CAREER_TRACK_BLUEPRINTS["finance"];
  const thirdId = record.rankedTracks[2]?.trackId as CareerTrackId | undefined;
  const thirdTrack =
    (thirdId && CAREER_TRACK_BLUEPRINTS[thirdId]) ||
    CAREER_TRACK_BLUEPRINTS["ux-design"];

  const mentor =
    MENTORS.find((m) => m.id === topTrack.mentorId) || MENTORS[0];
  const { gradeStageLabel, quarterlyActionPlan } = getGradeActionPlan(
    record.grade,
    topTrack
  );
  const topDim = record.dimensionScores[0];
  const secondDim = record.dimensionScores[1];
  const thirdDim = record.dimensionScores[2];

  const studentLine = `${record.studentName} • ${record.grade}${context.curriculum ? ` (${context.curriculum})` : ""}${context.city ? ` • ${context.city}` : ""}`;

  // Pages 1–4 = Free Basic Analysis (Half Basic Analysis, 4 pages)
  // Pages 1–9 = Complete Dossier (< 10 pages, Paid Unlock + Download PDF)
  return [
    {
      pageNumber: 1,
      tier: "free",
      tag: "Page 1 of 4 • Free Basic Snapshot",
      title: "Executive Cognitive Profile & Primary Fit",
      subtitle: studentLine,
      metrics: [
        { label: "Top Match", value: `${record.matchConfidence}%` },
        { label: "Primary Archetype", value: record.archetype },
        { label: topDim?.label || "Core Strength", value: `${topDim?.score || 88}%` },
        { label: secondDim?.label || "Secondary Strength", value: `${secondDim?.score || 82}%` },
      ],
      bullets: [
        `Primary Career Alignment: ${topTrack.title} (${record.matchConfidence}% natural scenario fit).`,
        `Top Cognitive Driver: ${topDim?.label} (${topDim?.score}%) — ${topDim?.summary || ""}`,
        `Supporting Driver: ${secondDim?.label} (${secondDim?.score}%) — ${secondDim?.summary || ""}`,
      ],
      callout: {
        title: "Archetype Profile",
        body: topTrack.archetypeSummary,
      },
    },
    {
      pageNumber: 2,
      tier: "free",
      tag: "Page 2 of 4 • Free Basic Snapshot",
      title: "How You Think, Learn & Decide",
      subtitle: `Learning Engine & Cognitive Style for ${record.studentName}`,
      metrics: record.dimensionScores.slice(0, 4).map((d) => ({
        label: d.label,
        value: `${d.score}%`,
      })),
      bullets: [
        `Dominant Cognitive Zones: ${topTrack.brainZones[0]} paired with ${topTrack.brainZones[1]}.`,
        `Natural Learning Style: ${topTrack.learningStyle}.`,
        `Third Supporting Dimension (${thirdDim?.label} — ${thirdDim?.score}%): ${thirdDim?.summary || ""}`,
        context.proSports
          ? "Active Athletic Discipline noted — your time-blocking planner should explicitly protect recovery and practice windows."
          : "Balanced academic pacing recommended — combine short visual recall sprints with weekly applied problem sets.",
      ],
    },
    {
      pageNumber: 3,
      tier: "free",
      tag: "Page 3 of 4 • Free Basic Snapshot",
      title: "Top 3 Career Tracks & Stream Orientation",
      subtitle: "Ranked directly from your 8 scenario decisions",
      metrics: [
        { label: `#1 ${topTrack.title}`, value: `${record.rankedTracks[0]?.matchPercent || record.matchConfidence}%` },
        { label: `#2 ${secondaryTrack.title}`, value: `${record.rankedTracks[1]?.matchPercent || 78}%` },
        { label: `#3 ${thirdTrack.title}`, value: `${record.rankedTracks[2]?.matchPercent || 72}%` },
        { label: "Recommended Stream", value: topTrack.recommendedStream.split("(")[0].trim() },
      ],
      bullets: [
        `Primary Track (#1): ${topTrack.title} — Optimal Stream: ${topTrack.recommendedStream}.`,
        `Secondary Track (#2): ${secondaryTrack.title} — Keeps strong overlap if you maintain ${secondaryTrack.mandatorySubjects[0]}.`,
        `Plan-B Pathway (#3): ${thirdTrack.title} — Accessible via ${thirdTrack.entranceExams.slice(0, 2).join(" / ")}.`,
      ],
      callout: {
        title: "Try Your #1 Track Live Before Committing",
        body: `Launch the interactive "${topTrack.title}" Workplace Simulator to experience day-to-day problem solving firsthand.`,
      },
    },
    {
      pageNumber: 4,
      tier: "free",
      tag: "Page 4 of 4 • Free Basic Snapshot",
      title: "Immediate Next Steps & Full Dossier Scope",
      subtitle: gradeStageLabel,
      bullets: [
        `Step 1 (Today): Run the ${topTrack.title} workplace simulator (${topTrack.simulatorUrl}) to earn resilience XP.`,
        `Step 2 (This Week): Add "${quarterlyActionPlan[0].title}" to your PTIROS Study Planner.`,
        `Step 3 (With Parents): Upgrade to unlock Pages 5–9 for complete entrance exam calendars, top Indian colleges, 10-year salary ladders, dinner-table mediation prompts, and Mentor ${mentor.name}'s action blueprint.`,
      ],
      callout: {
        title: "Free vs. Complete 9-Page PDF Dossier",
        body: "Pages 1–4 give you your core snapshot and top 3 tracks for free. Unlocking the full 9-page PDF adds stream safeguards, institution cutoffs, 10-year ROI, parent dialogue guides, and a saved archival PDF.",
      },
    },
    // --- PAID PAGES 5–9 (Total 9 pages < 10 pages per specification) ---
    {
      pageNumber: 5,
      tier: "paid",
      tag: "Page 5 of 9 • Paid Complete Dossier",
      title: "NEP 2020 Stream & Subject Combination Safeguards",
      subtitle: `Subject Selection Blueprint for ${topTrack.title}`,
      metrics: [
        { label: "Mandatory Core", value: topTrack.mandatorySubjects.join(", ") },
        { label: "Key Electives", value: topTrack.recommendedElectives.slice(0, 2).join(", ") },
      ],
      bullets: [
        `Optimal Stream: ${topTrack.recommendedStream}.`,
        `Dual-Track Compatibility: Keeping ${topTrack.mandatorySubjects[0]} preserves entry into #2 ${secondaryTrack.title} as well.`,
        `Academic Record Alignment: ${context.lastYearPercentage ? `With ${context.lastYearPercentage}% last year, focus on deep conceptual problem-solving over rote repetition.` : "Aim for strong conceptual command in NCERT fundamentals to keep all Tier-1 entrance routes open."}`,
      ],
      callout: {
        title: "Critical Academic Pitfall to Avoid",
        body: topTrack.criticalPitfall,
      },
    },
    {
      pageNumber: 6,
      tier: "paid",
      tag: "Page 6 of 9 • Paid Complete Dossier",
      title: "Top Indian Institutions & Entrance Exam Matrix",
      subtitle: `Admissions Pathways for ${topTrack.title} & ${secondaryTrack.title}`,
      bullets: [
        `Primary Entrance Exams: ${topTrack.entranceExams.join(" • ")}.`,
        ...topTrack.topColleges.map(
          (c) => `${c.name} (${c.location}) — Admission via ${c.exam}`
        ),
        `Backup Institution Exam Track (${secondaryTrack.title}): ${secondaryTrack.entranceExams.slice(0, 2).join(" / ")}.`,
      ],
    },
    {
      pageNumber: 7,
      tier: "paid",
      tag: "Page 7 of 9 • Paid Complete Dossier",
      title: "10-Year Economic Outlook & Indian Salary Ladders",
      subtitle: `Empirical ROI & Talent Demand Curve (${topTrack.title})`,
      metrics: [
        { label: "Entry CTC (Yr 0–2)", value: topTrack.salaryLadder.entryLevel },
        { label: "Mid-Career (Yr 5–7)", value: topTrack.salaryLadder.midCareer },
        { label: "Leadership (Yr 10+)", value: topTrack.salaryLadder.leadership },
      ],
      bullets: [
        topTrack.salaryLadder.outlookNote,
        `Secondary Track Comparison (${secondaryTrack.title}): Entry ${secondaryTrack.salaryLadder.entryLevel} scaling to ${secondaryTrack.salaryLadder.leadership}.`,
        "Key Compensated Differentiator: Verified project portfolios, competitions, and multidisciplinary fluency routinely outperform pure exam-only resumes.",
      ],
    },
    {
      pageNumber: 8,
      tier: "paid",
      tag: "Page 8 of 9 • Paid Complete Dossier",
      title: "Parent-Child Alignment & Dinner-Table Matrix",
      subtitle: context.parentName
        ? `Prepared calmly for ${record.studentName} & ${context.parentName}`
        : `Bridging Family Aspirations & Natural Aptitude`,
      bullets: [
        `Family Perspective Note: ${topTrack.parentBridgeNote}`,
        ...(context.parentDream
          ? [`Recorded Family Aspiration: "${context.parentDream}" — align around concrete day-in-the-life reality and dual-eligibility subjects.`]
          : ["Keep conversations anchored on day-to-day problem enjoyment rather than neighborhood peer comparison."]),
        ...topTrack.dinnerPrompts.map((p, i) => `Discussion Prompt #${i + 1}: "${p}"`),
      ],
    },
    {
      pageNumber: 9,
      tier: "paid",
      tag: "Page 9 of 9 • Paid Complete Dossier",
      title: "12-Month Kaizen Roadmap & Senior Mentor Brief",
      subtitle: `Paired Mentor: ${mentor.name} (${mentor.pedigree})`,
      bullets: [
        ...quarterlyActionPlan.map(
          (q) => `${q.quarter} — ${q.title}: ${q.detail}`
        ),
        `Recommended 1-on-1 Session Focus with ${mentor.name}: Review Class ${record.grade} subject load, validate simulator fit, and lock 90-day study priorities.`,
      ],
      callout: {
        title: "Credential Status",
        body: context.aparId
          ? `APAAR Reference (${context.aparId}) linked for transcript continuity.`
          : "APAAR ID can be linked anytime under Dashboard -> My Details once finalized with school.",
      },
    },
  ];
}
