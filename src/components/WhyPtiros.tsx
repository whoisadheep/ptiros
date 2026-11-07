"use client";

import { Check, X } from "lucide-react";
import Image from "next/image";
import ScrollReveal from "./ui/ScrollReveal";

interface IllustrationItem {
  imageSrc: string;
  alt: string;
  title: string;
  caption: string;
}

const illustrationCards: readonly IllustrationItem[] = [
  {
    imageSrc: "/icon_signpost.png",
    alt: "Signpost pointing towards Doctor, Pilot, Researcher",
    title: "Directional Clarity",
    caption: "Doctor, Pilot, Researcher — eliminating career confusion early.",
  },
  {
    imageSrc: "/icon_career_steps.png",
    alt: "Student climbing career steps",
    title: "Step-by-Step Ascension",
    caption: "Milestone-driven roadmap from 6th grade to college admissions.",
  },
  {
    imageSrc: "/icon_innovation.png",
    alt: "Innovation lightbulb with gear arrows",
    title: "Dynamic Innovation",
    caption: "Continuous Kaizen cycles, practical problem solving & NEP tools.",
  },
] as const;

interface ComparisonRow {
  feature: string;
  ptiros: boolean;
  schools: boolean;
}

const comparisonData: ComparisonRow[] = [
  { feature: "Career building", ptiros: true, schools: false },
  { feature: "Strategy Roadmaps", ptiros: true, schools: false },
  {
    feature: "Personalised time tables and planners",
    ptiros: true,
    schools: false,
  },
  {
    feature: "Real life problem solving frameworks",
    ptiros: true,
    schools: false,
  },
  {
    feature: "Elite government certificatin tracks",
    ptiros: true,
    schools: false,
  },
];

export default function WhyPtiros() {
  return (
    <section
      id="why-ptiros"
      className="relative overflow-hidden bg-bg py-24 sm:py-32"
      aria-label="Why PTIROS"
    >
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
        {/* Section Heading matching design-03.png */}
        <ScrollReveal direction="up" distance={20}>
          <div className="mb-14 text-center">
            <span className="inline-block rounded-full bg-primary/10 px-4 py-1 text-xs sm:text-sm font-bold uppercase tracking-wider text-primary">
              The Difference
            </span>
            <h2 className="mt-3 font-display text-4xl sm:text-6xl font-black text-accent">
              Why <span className="text-primary">PTIROS ?</span>
            </h2>
          </div>
        </ScrollReveal>

        {/* 3 Visual Illustration Cards matching design-03.png */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3 mb-16">
          {illustrationCards.map((item, idx) => (
            <ScrollReveal
              key={item.title}
              delay={idx * 0.1}
              direction="up"
              distance={24}
            >
              <div className="flex flex-col items-center text-center rounded-3xl border border-border/70 bg-white p-7 sm:p-9 shadow-sm transition-all duration-300 hover:border-primary/40 hover:shadow-xl hover:-translate-y-1 h-full">
                <div className="relative h-32 w-32 sm:h-36 sm:w-36 mb-4 flex items-center justify-center">
                  <Image
                    src={item.imageSrc}
                    alt={item.alt}
                    fill
                    className="object-contain"
                  />
                </div>

                <h3 className="font-display text-xl sm:text-2xl font-bold text-accent">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm text-text-muted leading-relaxed">
                  {item.caption}
                </p>
              </div>
            </ScrollReveal>
          ))}
        </div>

        {/* Feature Comparison Table matching design-03.png */}
        <ScrollReveal direction="up" distance={24} delay={0.15}>
          <div className="overflow-hidden rounded-3xl border border-border/80 bg-white shadow-xl">
            {/* Table Header */}
            <div className="grid grid-cols-12 border-b border-border/80 bg-bg-muted/80 p-5 sm:p-6 text-sm sm:text-base font-bold text-accent">
              <div className="col-span-6 sm:col-span-6 uppercase tracking-wider text-text-muted">
                Core Deliverables
              </div>
              <div className="col-span-3 sm:col-span-3 text-center font-display text-lg sm:text-xl font-extrabold text-primary">
                PTIROS
              </div>
              <div className="col-span-3 sm:col-span-3 text-center font-display text-base sm:text-lg font-bold text-text-muted">
                Indian schools
              </div>
            </div>

            {/* Table Rows */}
            <div className="divide-y divide-border/60">
              {comparisonData.map((row) => (
                <div
                  key={row.feature}
                  className="grid grid-cols-12 items-center p-4 sm:p-5 transition-colors duration-150 hover:bg-primary/[0.02]"
                >
                  <div className="col-span-6 sm:col-span-6 font-display text-sm sm:text-base font-bold text-accent pr-2">
                    {row.feature}
                  </div>

                  {/* PTIROS Column */}
                  <div className="col-span-3 sm:col-span-3 flex justify-center">
                    <div className="flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 shadow-xs">
                      <Check className="h-5 w-5 sm:h-6 sm:w-6 stroke-[3]" />
                    </div>
                  </div>

                  {/* Indian Schools Column */}
                  <div className="col-span-3 sm:col-span-3 flex justify-center">
                    <div className="flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-full bg-red-100 text-red-500 shadow-xs">
                      <X className="h-4 w-4 sm:h-5 sm:w-5 stroke-[2.5]" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
