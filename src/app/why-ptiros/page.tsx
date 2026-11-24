"use client";

import React from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhyPtiros from "@/components/WhyPtiros";
import Science from "@/components/Science";
import Expertise from "@/components/Expertise";
import Statistics from "@/components/Statistics";
import Stats from "@/components/Stats";
import {
  Sparkles,
  Brain,
  ShieldCheck,
  CheckCircle2,
  Users,
  Award,
  ArrowRight,
  Gamepad2,
  BookOpen,
} from "lucide-react";
import PtiroMascot from "@/components/PtiroMascot";
import { useUserProfile } from "@/context/UserProfileContext";

export default function WhyPtirosPage() {
  const { openBookingModal } = useUserProfile();

  return (
    <main className="min-h-screen bg-bg text-text selection:bg-orange-500 selection:text-white">
      <Navbar />

      {/* Page Hero Header */}
      <section className="relative overflow-hidden pt-28 pb-12 sm:pt-36 sm:pb-16 border-b border-border/60 bg-stone-50/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Breadcrumbs */}
          <nav className="flex items-center gap-2 text-xs font-semibold text-text-muted mb-4" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-primary transition-colors">
              Home
            </Link>
            <span>/</span>
            <span className="text-accent font-bold">Why PTIROS & The Science</span>
          </nav>

          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
            <div className="max-w-3xl space-y-4">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange-100/80 border border-orange-200/80 text-orange-900 text-xs font-bold uppercase tracking-wider">
                <Brain className="size-3.5 text-primary" />
                <span>Pedagogy • Neuroscience • Heritage</span>
              </div>

              <h1 className="text-3xl sm:text-5xl font-display font-black tracking-tight text-accent leading-tight">
                The Science of Clarity: Why PTIROS Works
              </h1>

              <p className="text-base sm:text-lg text-text-muted leading-relaxed">
                Most students drop out of competitive coaching or change streams in college not because of a lack of intellect, but due to
                <strong> cognitive mismatch</strong>. PTIROS unifies Japanese Kaizen deliberate practice, India’s Gurukul mentorship, and NEP 2020 experiential learning.
              </p>

              {/* Badges */}
              <div className="pt-2 flex flex-wrap items-center gap-3 text-xs text-stone-600">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-border shadow-2xs">
                  <ShieldCheck className="size-3.5 text-emerald-600" />
                  <span>Cognitive Neuroscience Validated</span>
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-border shadow-2xs">
                  <Award className="size-3.5 text-primary" />
                  <span>9+ Years Classroom Research</span>
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-border shadow-2xs">
                  <CheckCircle2 className="size-3.5 text-emerald-600" />
                  <span>Zero Rote Cramming</span>
                </span>
              </div>
            </div>

            {/* Mascot Banner */}
            <div className="w-full lg:max-w-sm shrink-0 p-4 sm:p-5 rounded-2xl sm:rounded-3xl bg-white border border-orange-200 shadow-xs">
              <div className="flex items-center gap-3.5">
                <PtiroMascot variant="study" size={64} showSpeech={false} interactive={false} />
                <div className="min-w-0 flex-1">
                  <h3 className="font-display font-bold text-sm text-stone-900">
                    1% Daily Focus Principle
                  </h3>
                  <p className="text-xs text-stone-600 mt-0.5 leading-relaxed">
                    Small daily reflection turns frantic exam anxiety into compounding lifelong mastery.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 1. Core Proof Stats */}
      <section className="border-b border-border/40">
        <Stats />
      </section>

      {/* 2. Why PTIROS vs Traditional Schools */}
      <section className="py-12 sm:py-16">
        <WhyPtiros />
      </section>

      {/* 3. The 3 Pillars & Neuroscience Model */}
      <section className="py-12 sm:py-16 border-t border-border/50 bg-stone-50/50">
        <Science />
      </section>

      {/* 4. Senior Mentors & Industry Council */}
      <section className="py-12 sm:py-16 border-t border-border/50">
        <Expertise />
      </section>

      {/* 5. Empirical Board Outcomes & Analytics */}
      <section className="py-12 sm:py-16 border-t border-border/50 bg-stone-50/50">
        <Statistics />
      </section>

      {/* Call to Action Banner */}
      <section className="py-16 sm:py-20 bg-gradient-to-br from-primary via-primary-dark to-accent text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-bold uppercase tracking-wider text-orange-100">
            <Sparkles className="size-3.5" /> Experience the Clarity Difference
          </span>

          <h2 className="text-3xl sm:text-4xl font-display font-black tracking-tight leading-tight">
            Ready to Build an Authentic, Stress-Free Career Path?
          </h2>

          <p className="text-sm sm:text-base text-white/80 max-w-xl mx-auto leading-relaxed">
            Take our 4-minute zero-stress Career Match Quest or schedule a 1-on-1 strategy call with senior mentors from IIT and NLSIU.
          </p>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/career-test"
              className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-white text-stone-900 font-bold text-xs shadow-xl hover:bg-neutral-100 transition active:scale-95 flex items-center justify-center gap-2"
            >
              <span>Give Career Test (Free)</span>
              <ArrowRight className="size-3.5 text-primary" />
            </Link>

            <button
              type="button"
              onClick={() => openBookingModal()}
              className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-white/10 hover:bg-white/20 text-white font-bold text-xs border border-white/30 transition active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
            >
              <Users className="size-3.5" />
              <span>Book 1:1 Mentor Call</span>
            </button>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
