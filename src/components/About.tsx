"use client";

import { CheckCircle2 } from "lucide-react";
import ScrollReveal from "./ui/ScrollReveal";

const nepPillars = [
  {
    title: "Adhering to Developmental Stages (5+3+3+4 Framework)",
    description:
      "Ptiros customizes its academic help, creative modules, and skill tracks to match the cognitive growth phases defined in the NEP structure—supporting young minds from foundational concepts through to secondary-level career exploration.",
  },
  {
    title: "Fostering Creative Thinking & No-Bag Concepts",
    description:
      "Aligning with NEP's push away from heavy school bags and textbook-only burdens, Ptiros focuses on interactive, digital-first learning that stimulates problem-solving, cognitive development, and creativity over memorization.",
  },
  {
    title: "Skill Development & Vocational Integration",
    description:
      "NEP 2020 mandates integrating practical skills early on. Ptiros delivers on this by offering dedicated training in public speaking, modern technical proficiencies, and career-oriented tracks.",
  },
  {
    title: "Trust Through Government-Verified Credentials",
    description:
      "In alignment with NEP’s emphasis on credible, transparent credentialing, Ptiros provides government-verified certifications that validate a student's extracurricular and skill milestones, ensuring they are future-ready.",
  },
] as const;

const studentBenefits = [
  {
    title: "Holistic Growth",
    description:
      "Combines core academic help with vital soft skills like public speaking and communication.",
  },
  {
    title: "Verified Employability",
    description:
      "Empowers learners with authenticated, government-backed certificates that carry weight in the professional world.",
  },
  {
    title: "Stress-Free, Engaging Learning",
    description:
      "Alleviates traditional academic pressure through an interactive, digital approach that champions experiential learning and critical thinking.",
  },
] as const;

export default function About() {
  return (
    <section
      id="about"
      className="relative overflow-hidden bg-primary py-24 sm:py-32 text-white"
      aria-label="About PTIROS & NEP 2020"
    >
      {/* Decorative Aura / Waves */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
        <div className="absolute -right-20 top-0 h-96 w-96 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute -left-20 bottom-0 h-96 w-96 rounded-full bg-black/10 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
        {/* Top Header matching design-02.png */}
        <ScrollReveal direction="up" distance={24}>
          <div className="mb-12 border-b border-white/20 pb-8">
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <span className="rounded-full bg-white/20 px-4 py-1 text-xs sm:text-sm font-bold uppercase tracking-widest text-white backdrop-blur-sm">
                About PTIROS
              </span>
              <span className="rounded-full bg-white px-3 py-1 text-xs sm:text-sm font-black text-primary">
                + NEP 2020
              </span>
            </div>

            <h2 className="font-display text-3xl sm:text-5xl lg:text-6xl font-black leading-tight text-white">
              Ptiros: Redefining Learning & Career Building through NEP 2020
            </h2>

            <p className="mt-6 max-w-4xl text-base sm:text-lg lg:text-xl font-normal leading-relaxed text-white/95">
              Ptiros is a next-generation, all-in-one ecosystem designed to bridge the gap between traditional schooling and real-world success. Built as a comprehensive career-building and skill-development platform, Ptiros goes beyond academics by integrating public speaking, government-verified certifications, and robust academic assistance into a single, seamless application.
            </p>
          </div>
        </ScrollReveal>

        {/* Section 2: How Ptiros Aligns with NEP 2020 */}
        <div className="mb-16">
          <ScrollReveal direction="up" distance={20}>
            <div className="mb-6">
              <h3 className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold text-white">
                How Ptiros Aligns with NEP 2020
              </h3>
              <p className="mt-2 max-w-3xl text-sm sm:text-base text-white/90 leading-relaxed">
                The National Education Policy (NEP) 2020 transitions India from a rigid, rote-learning model to a flexible, futuristic framework (structured around the 5+3+3+4 progression, activity-based learning, and no-bag/experiential learning concepts). Ptiros is engineered from the ground up to support this vision:
              </p>
            </div>
          </ScrollReveal>

          {/* 4 Pillars Grid in clean white frosted cards */}
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            {nepPillars.map((pillar, i) => (
              <ScrollReveal
                key={pillar.title}
                delay={i * 0.08}
                direction="up"
                distance={24}
              >
                <div className="group rounded-2xl border border-white/20 bg-white/10 p-6 sm:p-8 backdrop-blur-md transition-all duration-200 hover:bg-white/15 h-full">
                  <div className="mb-3 flex items-center gap-2.5">
                    <CheckCircle2 className="h-5 w-5 shrink-0 text-white" />
                    <h4 className="font-display text-base sm:text-lg font-bold text-white leading-snug">
                      {pillar.title}
                    </h4>
                  </div>
                  <p className="text-sm sm:text-base leading-relaxed text-white/90">
                    {pillar.description}
                  </p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>

        {/* Section 3: How Ptiros Helps Students */}
        <ScrollReveal direction="up" distance={24} delay={0.1}>
          <div className="rounded-3xl border border-white/25 bg-black/15 p-6 sm:p-10 backdrop-blur-md">
            <h3 className="mb-6 font-display text-2xl sm:text-3xl font-bold text-white">
              How Ptiros Helps Students
            </h3>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              {studentBenefits.map((benefit, i) => (
                <ScrollReveal
                  key={benefit.title}
                  delay={0.1 + i * 0.08}
                  direction="up"
                  distance={20}
                >
                  <div className="rounded-2xl border border-white/20 bg-white/10 p-5 sm:p-6 h-full">
                    <div className="mb-2 font-display text-lg sm:text-xl font-bold text-white">
                      • {benefit.title}
                    </div>
                    <p className="text-sm sm:text-base leading-relaxed text-white/90">
                      {benefit.description}
                    </p>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
