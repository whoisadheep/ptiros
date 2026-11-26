"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import {
  Map,
  Sparkles,
  Info,
  Phone,
  ArrowRight,
  ShieldCheck,
  Compass,
} from "lucide-react";

const EASE_CURVE = [0.22, 1, 0.36, 1] as const;

const WINGS = [
  {
    href: "/roadmaps",
    badge: "Classes 6 to 12",
    title: "Academic Roadmaps",
    description:
      "Customized blueprints for CBSE, ICSE, and IB. Subject combinations, board checklists, and zero stream rigidity.",
    cta: "View Roadmaps",
    icon: Map,
    iconBg: "bg-orange-50 text-orange-700",
    badgeColor: "text-orange-700",
  },
  {
    href: "/why-ptiros",
    badge: "Cognitive Science",
    title: "Why PTIROS & The Science",
    description:
      "How daily self-reflection and cognitive neuroscience replace exam burnout with compounding clarity.",
    cta: "Explore the Science",
    icon: ShieldCheck,
    iconBg: "bg-amber-50 text-amber-800",
    badgeColor: "text-amber-800",
  },
  {
    href: "/about",
    badge: "Our Pedagogy",
    title: "Our Story & Mentors",
    description:
      "Born from frontline classroom realities. Meet the educators, ISRO fellows, and legal scholars behind the mission.",
    cta: "Read Our Story",
    icon: Info,
    iconBg: "bg-blue-50 text-blue-700",
    badgeColor: "text-blue-700",
  },
  {
    href: "/contact",
    badge: "Admissions & Support",
    title: "Contact & Counseling",
    description:
      "Direct WhatsApp hotline, 3 regional physical innovation hubs, and 1:1 strategy consultation bookings.",
    cta: "Get in Touch",
    icon: Phone,
    iconBg: "bg-emerald-50 text-emerald-800",
    badgeColor: "text-emerald-800",
  },
];

export default function LandingWingsMotion() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <>
      {/* 5. Core Platform Wings & Exploration Hub */}
      <section className="py-20 sm:py-28 bg-white border-y border-border/60">
        <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12 space-y-12">
          <motion.div
            initial={prefersReducedMotion ? false : { opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.45, ease: EASE_CURVE }}
            className="text-center max-w-3xl mx-auto space-y-3"
          >
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
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {WINGS.map((wing, idx) => {
              const Icon = wing.icon;
              return (
                <motion.div
                  key={wing.href}
                  initial={prefersReducedMotion ? false : { opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.45, ease: EASE_CURVE, delay: idx * 0.08 }}
                  whileHover={prefersReducedMotion ? undefined : { y: -5 }}
                >
                  <Link
                    href={wing.href}
                    className="group h-full p-6 rounded-2xl sm:rounded-3xl bg-white border border-stone-200/80 hover:border-orange-300 hover:shadow-md transition-all flex flex-col justify-between"
                  >
                    <div className="space-y-4">
                      <div
                        className={`size-11 rounded-xl ${wing.iconBg} flex items-center justify-center transition-transform duration-300 group-hover:scale-110`}
                      >
                        <Icon className="size-5" />
                      </div>
                      <div>
                        <span className={`text-xs font-semibold ${wing.badgeColor}`}>
                          {wing.badge}
                        </span>
                        <h3 className="text-lg font-display font-bold text-stone-900 group-hover:text-orange-700 transition-colors mt-0.5">
                          {wing.title}
                        </h3>
                        <p className="text-xs text-stone-500 mt-2 leading-relaxed">
                          {wing.description}
                        </p>
                      </div>
                    </div>
                    <div className="pt-5 flex items-center justify-between text-xs font-bold text-orange-700 border-t border-stone-100 mt-4">
                      <span>{wing.cta}</span>
                      <ArrowRight className="size-3.5 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 6. Grand Call to Action Banner with Ambient Motion */}
      <section className="relative overflow-hidden py-16 sm:py-24 bg-gradient-to-br from-primary via-primary-dark to-accent text-white">
        <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
          <motion.div
            animate={
              prefersReducedMotion
                ? undefined
                : { x: [0, 30, 0], y: [0, -20, 0], opacity: [0.22, 0.4, 0.22] }
            }
            transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -top-24 -left-16 size-80 rounded-full bg-amber-300/25 blur-3xl"
          />
          <motion.div
            animate={
              prefersReducedMotion
                ? undefined
                : { x: [0, -25, 0], y: [0, 22, 0], opacity: [0.18, 0.35, 0.18] }
            }
            transition={{ duration: 11, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            className="absolute -bottom-24 -right-16 size-96 rounded-full bg-white/15 blur-3xl"
          />
        </div>

        <motion.div
          initial={prefersReducedMotion ? false : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.5, ease: EASE_CURVE }}
          className="relative z-10 mx-auto max-w-5xl px-5 sm:px-8 text-center space-y-6"
        >
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-bold uppercase tracking-wider text-orange-100">
            <Sparkles className="size-3.5" />
            Zero Negative Marking • 100% Free Discovery
          </div>

          <h2 className="text-3xl sm:text-5xl font-display font-black tracking-tight leading-tight">
            Give Your Child the Clarity They Deserve
          </h2>

          <p className="text-base sm:text-lg text-white/85 max-w-2xl mx-auto leading-relaxed">
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
              href="/book-mentorship"
              className="w-full sm:w-auto px-8 py-4 rounded-full bg-white/10 hover:bg-white/20 text-white font-bold text-sm border border-white/30 transition active:scale-95 flex items-center justify-center gap-2"
            >
              <Phone className="size-4" />
              <span>Book 1:1 Gurukul Call</span>
            </Link>
          </div>
        </motion.div>
      </section>
    </>
  );
}
