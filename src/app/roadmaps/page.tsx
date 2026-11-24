"use client";

import React from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Roadmaps from "@/components/Roadmaps";
import {
  Compass,
  Map,
  BookOpenCheck,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Users,
  Gamepad2,
  Brain,
  CheckCircle2,
} from "lucide-react";
import PtiroMascot from "@/components/PtiroMascot";
import { useUserProfile } from "@/context/UserProfileContext";

export default function RoadmapsPage() {
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
            <span className="text-accent font-bold">Academic Roadmaps</span>
          </nav>

          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
            <div className="max-w-3xl space-y-4">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange-100/80 border border-orange-200/80 text-orange-900 text-xs font-bold uppercase tracking-wider">
                <Map className="size-3.5 text-primary" />
                <span>Class 6 to 12 • NEP 2020 Multi-Disciplinary</span>
              </div>

              <h1 className="text-3xl sm:text-5xl font-display font-black tracking-tight text-accent leading-tight">
                Academic Roadmaps & Stream Alignment
              </h1>

              <p className="text-base sm:text-lg text-text-muted leading-relaxed">
                No more coercive stream choices. Discover customized academic milestone blueprints for
                <strong> CBSE</strong>, <strong>ICSE</strong>, <strong>State Boards</strong>, and <strong>IB</strong>,
                seamlessly aligned with real-world Indian university admissions.
              </p>

              {/* Trust Badges */}
              <div className="pt-2 flex flex-wrap items-center gap-2.5 sm:gap-3 text-xs text-stone-600">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-border shadow-2xs">
                  <ShieldCheck className="size-3.5 text-emerald-600" />
                  <span>NCrF Bagless Days Integrated</span>
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-border shadow-2xs">
                  <CheckCircle2 className="size-3.5 text-emerald-600" />
                  <span>Zero Stream Rigidity</span>
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-border shadow-2xs">
                  <Users className="size-3.5 text-orange-600" />
                  <span>IIT, NLSIU & AIIMS Mentorship</span>
                </span>
              </div>
            </div>

            {/* Ptiro Mascot Guide Card */}
            <div className="w-full lg:max-w-sm shrink-0 p-4 sm:p-5 rounded-2xl sm:rounded-3xl bg-white border border-orange-200 shadow-xs">
              <div className="flex items-center gap-3.5">
                <PtiroMascot variant="copilot" size={64} showSpeech={false} interactive={false} />
                <div className="min-w-0 flex-1">
                  <h3 className="font-display font-bold text-sm text-stone-900">
                    Ptiro Navigator Tip
                  </h3>
                  <p className="text-xs text-stone-600 mt-0.5 leading-relaxed">
                    Select your current stage below to see curated subject choices, board blueprints, and milestone targets.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Embedded Full Interactive Roadmaps Component */}
      <section className="py-12 sm:py-16">
        <Roadmaps />
      </section>

      {/* Strategic 1:1 Consultation Banner */}
      <section className="py-16 bg-white border-t border-border/60">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl bg-gradient-to-br from-stone-900 via-stone-950 to-stone-900 text-white p-8 sm:p-12 shadow-xl border border-stone-800 flex flex-col md:flex-row md:items-center justify-between gap-8">
            <div className="space-y-3 max-w-xl">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-500/20 text-orange-300 text-xs font-bold uppercase tracking-wider border border-orange-500/30">
                <Users className="size-3.5 text-orange-400" />
                Senior Council 1-on-1 Guidance
              </span>
              <h2 className="text-2xl sm:text-3xl font-display font-black tracking-tight text-white">
                Unsure Which Subject Combination Fits You?
              </h2>
              <p className="text-xs sm:text-sm text-stone-300 leading-relaxed">
                Should you take PCM with Economics or Humanities with Legal Studies? Schedule a dedicated 20-minute strategy call with our senior mentors from IIT Delhi, NLSIU, and AIIMS.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0">
              <button
                type="button"
                onClick={() => openBookingModal()}
                className="w-full sm:w-auto px-6 py-3.5 rounded-full bg-primary text-white font-bold text-xs hover:bg-primary-dark transition shadow-lg shadow-primary/25 cursor-pointer active:scale-95 flex items-center justify-center gap-2"
              >
                <Users className="size-4" />
                <span>Book 1:1 Strategy Call</span>
              </button>

              <Link
                href="/simulator"
                className="w-full sm:w-auto px-6 py-3.5 rounded-full bg-stone-800 hover:bg-stone-700 text-stone-200 font-bold text-xs border border-stone-700 transition active:scale-95 flex items-center justify-center gap-2"
              >
                <Gamepad2 className="size-4 text-orange-400" />
                <span>Test-Drive in Simulator</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
