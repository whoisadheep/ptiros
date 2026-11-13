# Architecture & Implementation Design: Client Blueprint Features (DOC-20260914-WA0019)

## 1. High-Level Motivation & Context
Based on the client's original handwritten 3-page blueprint (`DOC-20260914-WA0019.pdf`), PTIROS requires three critical conversion-funnel mechanisms currently missing from the digital prototype:
1. **Student & Parent Dual-Intake Onboarding (Page 2)**: Before students launch their career test or simulation, their baseline profile (Name, Grade 6-12, School, City) and Parent Context (Parent Name, WhatsApp contact, Parent's Dream/Aspiration for child) must be captured and stored in state so all subsequent dossiers, psychometric scores, and certificates are personalized.
2. **1-on-1 Mentorship Booking Flow ("My Mentors", Page 3)**: A booking system connecting students/parents with verified domain mentors (e.g., IIT Bombay, IIM Ahmedabad, AIIMS, NLSIU alumni counselors) for a 20-minute Gurukul strategic counseling call.
3. **Freemium Tier Value Comparison (Page 1)**: An interactive modal/drawer demonstrating the distinction between the Free 3-4 Page Snapshot and the 10-Page Comprehensive Career Dossier to drive paid tier conversions.

---

## 2. Component Architecture

### Component A: `src/components/StudentParentIntakeModal.tsx`
- **Trigger**: Automatically checks `localStorage.getItem("ptiros_user_profile")`. If absent when user clicks "Start Simulator" or "Start Assessment", pops open a modern 2-step modal. Also accessible via a "My Profile" button in the Navbar.
- **Step 1: Student Demographics**:
  - `studentName` (string, required)
  - `grade` (enum: Class 6, 7, 8, 9, 10, 11, 12, Dropper/UG 1st Yr)
  - `schoolName` (string, optional)
  - `city` (string, required - e.g., Delhi NCR, Mumbai, Bengaluru, Jaipur, etc.)
  - `curriculum` (enum: CBSE, ICSE, IB, Cambridge, State Board)
- **Step 2: Parent Alignment & Aspirations**:
  - `parentName` (string, required)
  - `parentPhone` (10-digit Indian mobile format with +91 validation)
  - `parentDream` (enum/free text: "Wants stable engineering/medical career", "Wants to support creative/design passion", "Needs clarity on commerce vs tech", "Seeking foreign university guidance", "Other")
- **Persistence & Reactivity**:
  - Saves to `localStorage.setItem("ptiros_user_profile", JSON.stringify(profile))`.
  - Dispatches a custom window event `ptiros:profile-updated` so Navbar, Simulator, and Career Test update immediately without hard reload.

### Component B: `src/components/MentorshipBookingModal.tsx`
- **Trigger**: "Book 1-on-1 Mentor" CTA in Navbar, Footer, and inside the Simulator/Dossier completion views.
- **Domain Mentors Catalog**:
  - 6 Domain Mentors with real pedigree cards:
    - AI & Robotics: Dr. Aryan Sharma (Ex-DRDO, IIT Kharagpur)
    - Corporate Law: Adv. Sneha Mukherjee (NLU Delhi, Senior Associate)
    - Digital Health & Medicine: Dr. Rohan Verma (AIIMS Delhi Resident)
    - Product & UX Design: Ananya Roy (IDC IIT Bombay, Design Lead)
    - Quant Finance: Vikramaditya Sen (IIM Calcutta, Goldman Sachs alumnus)
    - Media & Creative Tech: Kabir Mehta (FTII Pune, YouTube Creator Strategy)
- **Booking Flow**:
  - Step 1: Select Mentor & Domain.
  - Step 2: Select Date & Available Slot (Next 5 calendar days, morning/evening 20-minute slots).
  - Step 3: Enter Primary Question/Dilemma (e.g. "Should I take PCM with Computer Science or Economics?").
  - Step 4: Instant Confirmation with Google Calendar `.ics` trigger and WhatsApp notification dispatch button.

### Component C: `src/components/DossierSampleModal.tsx`
- **Trigger**: "View Sample 10-Page Dossier" on Landing Page and Parent Dossier view.
- **Content**:
  - Interactive tabbed carousel previewing the 10 distinct sections of the Paid Dossier:
    1. Executive Summary & Holistic Fit Index
    2. NEP 2020 5+3+3+4 Stage Competency Breakdown
    3. RIASEC Holland Hexagon Psychometric Chart
    4. 3-Tier Career Trajectory (India vs Global Market)
    5. Class 11-12 Subject Combination Strategy & Pitfall Matrix
    6. Top Tier Indian Colleges (Cutoffs, Entrance Exams, ROI)
    7. 10-Year Economic Salary Ladder (Entry, Mid, Leadership)
    8. Parent-Student Alignment Matrix & Cognitive Conflict Map
    9. Kaizen Weekly Action Checklist for Grades 9-12
    10. 1-on-1 Mentor Recommendation & Action Plan

---

## 3. Data Flow & Integration Points
- `src/components/Navbar.tsx`: Add "Book Mentor" CTA + "My Profile" badge displaying student name if logged in.
- `src/app/simulator/page.tsx`: Read student name from intake profile to populate Parent Dossier and Certificate automatically.
- `src/components/simulator/ParentDossier.tsx`: Display `studentName` and `parentName` directly on the executive briefing and WhatsApp share message.
