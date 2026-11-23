import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Stats from "@/components/Stats";
import CareerTestCTA from "@/components/CareerTestCTA";
import CareerSimulator from "@/components/CareerSimulator";
import Footer from "@/components/Footer";
import Link from "next/link";
import {
  Map,
  Sparkles,
  Info,
  Phone,
  ArrowRight,
  ShieldCheck,
  Award,
  Users,
  Compass,
  CheckCircle2,
} from "lucide-react";
import PtiroMascot from "@/components/PtiroMascot";

export default function Home() {
  return (
    <main className="bg-mesh min-h-screen overflow-x-clip text-text">
      <Navbar />

      {/* 1. Hero Welcome Section */}
      <section id="home" className="scroll-mt-24">
        <Hero />
      </section>

      {/* 2. Quick Credibility Proof Bar */}
      <Stats />

      {/* 3. Free Cognitive Discovery Quest (Quiz) */}
      <section id="career-test" className="scroll-mt-24">
        <CareerTestCTA />
      </section>

      {/* 4. Interactive Workplace Simulator Teaser */}
      <section id="simulator" className="scroll-mt-24">
        <CareerSimulator />
      </section>

      {/* 5. Core Platform Wings & Exploration Hub */}
      <section className="py-20 sm:py-28 bg-white border-y border-border/60">
        <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12 space-y-12">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-stone-100 text-stone-700 text-xs font-semibold">
              <Compass className="size-3.5 text-orange-700" />
              Complete Educational Ecosystem
            </span>
            <h2 className="text-3xl sm:text-4xl font-display font-bold text-stone-950 tracking-tight">
              Explore PTIROS Across Dedicated Wings
            </h2>
            <p className="text-sm sm:text-base text-stone-600 leading-relaxed">
              Every student is wired differently. Instead of one-size-fits-all coaching, we provide deep, specialized guidance across separate dedicated wings.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Wing 1: Roadmaps */}
            <Link
              href="/roadmaps"
              className="group p-6 rounded-2xl sm:rounded-3xl bg-white border border-stone-200/80 hover:border-orange-300 hover:shadow-xs transition-colors flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="size-11 rounded-xl bg-orange-50 text-orange-700 flex items-center justify-center">
                  <Map className="size-5" />
                </div>
                <div>
                  <span className="text-xs font-semibold text-orange-700">
                    Classes 6 to 12
                  </span>
                  <h3 className="text-lg font-display font-bold text-stone-900 group-hover:text-orange-700 transition-colors mt-0.5">
                    Academic Roadmaps
                  </h3>
                  <p className="text-xs text-stone-500 mt-2 leading-relaxed">
                    Customized blueprints for CBSE, ICSE, and IB. Subject combinations, board checklists, and zero stream rigidity.
                  </p>
                </div>
              </div>
              <div className="pt-5 flex items-center justify-between text-xs font-bold text-orange-700 border-t border-stone-100 mt-4">
                <span>View Roadmaps</span>
                <ArrowRight className="size-3.5 group-hover:translate-x-0.5 transition-transform" />
              </div>
            </Link>

            {/* Wing 2: Why PTIROS & Science */}
            <Link
              href="/why-ptiros"
              className="group p-6 rounded-2xl sm:rounded-3xl bg-white border border-stone-200/80 hover:border-orange-300 hover:shadow-xs transition-colors flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="size-11 rounded-xl bg-amber-50 text-amber-800 flex items-center justify-center">
                  <ShieldCheck className="size-5" />
                </div>
                <div>
                  <span className="text-xs font-semibold text-amber-800">
                    Cognitive Science
                  </span>
                  <h3 className="text-lg font-display font-bold text-stone-900 group-hover:text-orange-700 transition-colors mt-0.5">
                    Why PTIROS & The Science
                  </h3>
                  <p className="text-xs text-stone-500 mt-2 leading-relaxed">
                    How daily self-reflection and cognitive neuroscience replace exam burnout with compounding clarity.
                  </p>
                </div>
              </div>
              <div className="pt-5 flex items-center justify-between text-xs font-bold text-orange-700 border-t border-stone-100 mt-4">
                <span>Explore the Science</span>
                <ArrowRight className="size-3.5 group-hover:translate-x-0.5 transition-transform" />
              </div>
            </Link>

            {/* Wing 3: Our Story */}
            <Link
              href="/about"
              className="group p-6 rounded-2xl sm:rounded-3xl bg-white border border-stone-200/80 hover:border-orange-300 hover:shadow-xs transition-colors flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="size-11 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center">
                  <Info className="size-5" />
                </div>
                <div>
                  <span className="text-xs font-semibold text-blue-700">
                    Our Pedagogy
                  </span>
                  <h3 className="text-lg font-display font-bold text-stone-900 group-hover:text-orange-700 transition-colors mt-0.5">
                    Our Story & Mentors
                  </h3>
                  <p className="text-xs text-stone-500 mt-2 leading-relaxed">
                    Born from frontline classroom realities. Meet the educators, ISRO fellows, and legal scholars behind the mission.
                  </p>
                </div>
              </div>
              <div className="pt-5 flex items-center justify-between text-xs font-bold text-orange-700 border-t border-stone-100 mt-4">
                <span>Read Our Story</span>
                <ArrowRight className="size-3.5 group-hover:translate-x-0.5 transition-transform" />
              </div>
            </Link>

            {/* Wing 4: Admissions & Contact */}
            <Link
              href="/contact"
              className="group p-6 rounded-2xl sm:rounded-3xl bg-white border border-stone-200/80 hover:border-orange-300 hover:shadow-xs transition-colors flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="size-11 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center">
                  <Phone className="size-5" />
                </div>
                <div>
                  <span className="text-xs font-semibold text-emerald-800">
                    Admissions & Support
                  </span>
                  <h3 className="text-lg font-display font-bold text-stone-900 group-hover:text-orange-700 transition-colors mt-0.5">
                    Contact & Counseling
                  </h3>
                  <p className="text-xs text-stone-500 mt-2 leading-relaxed">
                    Direct WhatsApp hotline, 3 regional physical innovation hubs, and 1:1 strategy consultation bookings.
                  </p>
                </div>
              </div>
              <div className="pt-5 flex items-center justify-between text-xs font-bold text-orange-700 border-t border-stone-100 mt-4">
                <span>Get in Touch</span>
                <ArrowRight className="size-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* 6. Grand Call to Action Banner */}
      <section className="py-16 sm:py-24 bg-gradient-to-br from-primary via-primary-dark to-accent text-white">
        <div className="mx-auto max-w-5xl px-5 sm:px-8 text-center space-y-6">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-bold uppercase tracking-wider text-orange-100">
            <Sparkles className="size-3.5" />
            Zero Negative Marking • 100% Free Discovery
          </div>

          <h2 className="text-3xl sm:text-5xl font-display font-black tracking-tight leading-tight">
            Give Your Child the Clarity They Deserve
          </h2>

          <p className="text-base sm:text-lg text-white/80 max-w-2xl mx-auto leading-relaxed">
            Begin with a 4-minute discovery quest to unlock authentic cognitive strengths, or schedule a 1-on-1 session with senior faculty mentors.
          </p>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/career-test"
              className="w-full sm:w-auto px-8 py-4 rounded-full bg-white text-stone-900 font-bold text-sm shadow-xl hover:bg-neutral-100 transition active:scale-95 flex items-center justify-center gap-2"
            >
              <span>Start Free Career Match Quest</span>
              <ArrowRight className="size-4 text-primary" />
            </Link>

            <Link
              href="/contact"
              className="w-full sm:w-auto px-8 py-4 rounded-full bg-white/10 hover:bg-white/20 text-white font-bold text-sm border border-white/30 transition active:scale-95 flex items-center justify-center gap-2"
            >
              <Phone className="size-4" />
              <span>Talk to Admissions</span>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
