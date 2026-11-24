"use client";

import React, { useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Contact from "@/components/Contact";
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  MessageSquare,
  ShieldCheck,
  ChevronDown,
  CheckCircle2,
  ExternalLink,
  Users,
  Calendar,
  Sparkles,
} from "lucide-react";
import PtiroMascot from "@/components/PtiroMascot";
import { useUserProfile } from "@/context/UserProfileContext";

const faqs = [
  {
    question: "How quickly does the admissions team respond to inquiries?",
    answer:
      "Our counseling council responds to inquiries within 2 to 4 business hours via WhatsApp and email with your personalized intake questionnaire.",
  },
  {
    question: "Can both students and parents attend the 1-on-1 strategy call?",
    answer:
      "Yes, absolutely. In fact, we strongly encourage at least one parent or guardian to attend so both student passions and parental aspirations can be harmonized without conflict.",
  },
  {
    question: "What happens during a 20-minute Gurukul mentor session?",
    answer:
      "A senior practitioner (IIT, NLSIU, AIIMS alumni) reviews your diagnostic scores, resolves high-friction stream doubts (e.g. PCM vs Humanities), and outlines a 3-year Kaizen action blueprint.",
  },
  {
    question: "Already reserved a mentorship call? How can I check its status?",
    answer:
      "You can enter your Booking Reference ID (e.g. bk_...) or your 10-digit registered mobile number directly on our live meeting tracker page.",
    hasTrackerLink: true,
  },
  {
    question: "Which boards and grades are eligible for PTIROS programs?",
    answer:
      "Students from Class 6 through Class 12 across CBSE, ICSE, Cambridge (IGCSE/IB), and State Boards are supported.",
  },
];

const centers = [
  {
    city: "Bengaluru",
    wing: "Technology & Autonomous Systems Hub",
    address: "100ft Road, Indiranagar, Bengaluru, Karnataka 560038",
    timing: "Mon — Sat, 9:30 AM — 6:30 PM IST",
  },
  {
    city: "New Delhi",
    wing: "Public Policy & Legal Studies Wing",
    address: "Barakhamba Road, Connaught Place, New Delhi 110001",
    timing: "Mon — Sat, 9:30 AM — 6:30 PM IST",
  },
  {
    city: "Mumbai",
    wing: "Fintech & Biomedical Devices Wing",
    address: "G-Block, Bandra Kurla Complex (BKC), Mumbai, Maharashtra 400051",
    timing: "Mon — Sat, 9:30 AM — 6:30 PM IST",
  },
];

export default function ContactPage() {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);
  const { openBookingModal } = useUserProfile();

  const toggleFaq = (idx: number) => {
    setOpenFaqIndex(openFaqIndex === idx ? null : idx);
  };

  return (
    <main className="min-h-screen bg-bg text-text selection:bg-orange-500 selection:text-white">
      <Navbar />

      {/* Hero Header */}
      <section className="relative overflow-hidden pt-28 pb-12 sm:pt-36 sm:pb-16 border-b border-border/60 bg-stone-50/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Breadcrumbs */}
          <nav className="flex items-center gap-2 text-xs font-semibold text-text-muted mb-4" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-primary transition-colors">
              Home
            </Link>
            <span>/</span>
            <span className="text-accent font-bold">Contact & Admissions</span>
          </nav>

          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
            <div className="max-w-3xl space-y-4">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange-100/80 border border-orange-200/80 text-orange-900 text-xs font-bold uppercase tracking-wider">
                <Phone className="size-3.5 text-primary" />
                <span>Admissions & Strategic Counseling</span>
              </div>

              <h1 className="text-3xl sm:text-5xl font-display font-black tracking-tight text-accent leading-tight">
                Connect with PTIROS Mentors & Admissions
              </h1>

              <p className="text-base sm:text-lg text-text-muted leading-relaxed">
                Have questions about stream selection, our workplace simulators, or senior mentor sessions?
                Reach out to our admissions council for personalized guidance for your student.
              </p>

              {/* Fast Action Cards */}
              <div className="pt-2 flex flex-col sm:flex-row sm:flex-wrap items-stretch sm:items-center gap-3">
                <a
                  href="https://api.whatsapp.com/send?phone=919876543210&text=Hello%20PTIROS%2C%20I%20would%20like%20to%20inquire%20about%20student%20career%20mentorship."
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-4 py-3 sm:py-2.5 rounded-xl bg-emerald-600 text-white font-bold text-xs hover:bg-emerald-700 transition shadow-sm active:scale-95"
                >
                  <MessageSquare className="size-4 shrink-0" />
                  <span>Instant WhatsApp Hotline</span>
                </a>

                <Link
                  href="/track-booking"
                  className="inline-flex items-center justify-center gap-2 px-4 py-3 sm:py-2.5 rounded-xl border border-stone-300 bg-white text-stone-800 font-bold text-xs hover:bg-stone-50 transition shadow-2xs active:scale-95"
                >
                  <Clock className="size-4 text-orange-600 shrink-0" />
                  <span>Track Existing Meeting</span>
                </Link>

                <button
                  type="button"
                  onClick={() => openBookingModal()}
                  className="inline-flex items-center justify-center gap-2 px-4 py-3 sm:py-2.5 rounded-xl bg-primary text-white font-bold text-xs hover:bg-primary-dark transition shadow-md shadow-primary/25 active:scale-95 cursor-pointer"
                >
                  <Users className="size-4 shrink-0" />
                  <span>Book 1:1 Consultation</span>
                </button>
              </div>
            </div>

            {/* Ptiro Mascot Help Card */}
            <div className="shrink-0 w-full lg:max-w-sm p-4 sm:p-5 rounded-3xl bg-white border border-orange-200 shadow-lg">
              <div className="flex items-center gap-3.5">
                <PtiroMascot variant="copilot" size={68} interactive={false} showSpeech={false} />
                <div className="min-w-0">
                  <h3 className="font-display font-bold text-sm text-stone-900">
                    Need Direct Guidance?
                  </h3>
                  <p className="text-xs text-stone-600 mt-0.5 leading-relaxed">
                    Leave your student details in the form below. We match you with the right faculty domain expert.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Embedded Contact Component */}
      <section className="py-12 sm:py-16">
        <Contact />
      </section>

      {/* Regional Learning & Admissions Centers */}
      <section className="py-16 bg-white border-t border-border/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-primary">
              Physical Hubs
            </span>
            <h2 className="text-2xl sm:text-3xl font-display font-black text-stone-900">
              Regional Admissions & Innovation Wings
            </h2>
            <p className="text-xs sm:text-sm text-stone-500">
              In-person consultation centers for parents, school principals, and academic partners.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {centers.map((c) => (
              <div
                key={c.city}
                className="p-6 rounded-2xl bg-stone-50/70 border border-stone-200/80 space-y-3 hover:border-orange-300 transition"
              >
                <div className="flex items-center gap-2">
                  <span className="p-2 rounded-xl bg-orange-100 text-orange-700">
                    <MapPin className="size-4" />
                  </span>
                  <div>
                    <h3 className="font-display font-bold text-base text-stone-900">
                      {c.city} Center
                    </h3>
                    <span className="text-[11px] font-semibold text-primary">
                      {c.wing}
                    </span>
                  </div>
                </div>

                <p className="text-xs text-stone-600 leading-relaxed">
                  {c.address}
                </p>

                <div className="pt-2 flex items-center gap-1.5 text-[11px] text-stone-400 border-t border-stone-200/60">
                  <Clock className="size-3 text-stone-400" />
                  <span>{c.timing}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Accordion Section */}
      <section className="py-16 sm:py-20 border-t border-border/60 bg-stone-50/50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="text-center space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-primary">
              Parent & Student FAQ
            </span>
            <h2 className="text-2xl sm:text-3xl font-display font-black text-stone-900">
              Frequently Asked Questions
            </h2>
            <p className="text-xs sm:text-sm text-stone-500">
              Everything you need to know about our admissions, roadmaps, and mentorship sessions.
            </p>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, idx) => {
              const isOpen = openFaqIndex === idx;
              return (
                <div
                  key={idx}
                  className="rounded-2xl border border-stone-200 bg-white overflow-hidden shadow-2xs transition"
                >
                  <button
                    type="button"
                    onClick={() => toggleFaq(idx)}
                    className="w-full flex items-center justify-between p-4 sm:p-5 text-left text-sm font-bold text-stone-900 hover:text-primary transition cursor-pointer"
                  >
                    <span>{faq.question}</span>
                    <ChevronDown
                      className={`size-4 text-stone-400 shrink-0 transition-transform duration-200 ${
                        isOpen ? "rotate-180 text-primary" : ""
                      }`}
                    />
                  </button>

                  {isOpen && (
                    <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-stone-600 leading-relaxed border-t border-stone-100">
                      <p>{faq.answer}</p>
                      {faq.hasTrackerLink && (
                        <div className="mt-3">
                          <Link
                            href="/track-booking"
                            className="inline-flex items-center gap-1.5 text-xs font-bold text-primary hover:underline"
                          >
                            <span>Open Public Meeting Tracker</span>
                            <ExternalLink className="size-3" />
                          </Link>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
