"use client";

import { ArrowRight } from "lucide-react";
import Image from "next/image";
import MagneticButton from "./ui/MagneticButton";
import ScrollReveal from "./ui/ScrollReveal";

const testHighlights = [
  "Most suited career recommendations",
  "Skill gap analysis",
  "Personality analysis",
  "Strength and weakness analysis",
  "Brain areas developed",
] as const;

export default function CareerTestCTA() {
  return (
    <section
      id="career-test"
      className="relative overflow-hidden bg-bg py-20 sm:py-28"
      aria-label="Career Test"
    >
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-12 lg:gap-14">
          {/* Left Column: Brain Line Art with 4 colored dots */}
          <div className="flex flex-col items-center justify-center lg:col-span-5">
            <ScrollReveal direction="up" distance={24} duration={0.6}>
              <div className="relative w-full max-w-md aspect-square flex items-center justify-center p-4">
                {/* Subtle ambient aura */}
                <div
                  className="absolute inset-0 rounded-full bg-primary/10 blur-3xl"
                  aria-hidden="true"
                />
                
                <div className="relative w-full h-full max-w-[380px] max-h-[380px] transition-transform duration-500 hover:scale-105">
                  <Image
                    src="/client_brain.png"
                    alt="PTIROS Brain Line Art with 4 Colored Cognitive Nodes"
                    fill
                    className="object-contain"
                    priority
                  />
                </div>
              </div>

              <p className="mt-2 text-center text-xs font-semibold uppercase tracking-widest text-text-muted">
                Cognitive Aptitude & Brain Mapping
              </p>
            </ScrollReveal>
          </div>

          {/* Right Column: Solid Vibrant Orange Card matching design-01.png */}
          <div className="lg:col-span-7">
            <ScrollReveal direction="up" delay={0.15} distance={28} duration={0.6}>
              <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-primary via-[#FA6500] to-primary-dark p-8 sm:p-12 lg:p-14 text-white shadow-2xl shadow-primary/25">
                {/* Subtle background rings */}
                <div
                  className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-white/10 blur-2xl"
                  aria-hidden="true"
                />
                <div
                  className="pointer-events-none absolute -bottom-16 -left-16 h-56 w-56 rounded-full bg-black/10 blur-xl"
                  aria-hidden="true"
                />

                <div className="relative z-10">
                  {/* Header pill & Title */}
                  <span className="inline-block rounded-full bg-white/20 px-4 py-1 text-xs sm:text-sm font-bold uppercase tracking-widest text-white backdrop-blur-sm">
                    Career Test
                  </span>

                  <h2 className="mt-4 font-display text-3xl sm:text-5xl lg:text-6xl font-black leading-tight text-white">
                    360 degree Career Report
                  </h2>

                  {/* 5 Bullet Points with White Dots matching design-01.png */}
                  <ul className="mt-6 space-y-3.5">
                    {testHighlights.map((point) => (
                      <li
                        key={point}
                        className="flex items-center gap-3 text-base sm:text-lg lg:text-xl font-medium text-white/95"
                      >
                        <span className="flex h-3 w-3 shrink-0 items-center justify-center rounded-full bg-white shadow-sm" />
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>

                  {/* CTA Button matching design-01.png: White pill button with "TAKE YOUR TEST" */}
                  <div className="mt-8 pt-2">
                    <MagneticButton href="/career-test" strength={0.25}>
                      <div
                        className="group inline-flex cursor-pointer items-center justify-center gap-3 rounded-full bg-white px-9 py-4 text-base sm:text-lg font-black uppercase tracking-wider text-primary shadow-xl shadow-black/10 transition-all duration-200 hover:bg-white/95 hover:shadow-2xl active:scale-[0.98]"
                        style={{ minHeight: "54px" }}
                      >
                        <span>TAKE YOUR TEST</span>
                        <ArrowRight className="h-5 w-5 transition-transform duration-200 group-hover:translate-x-1" />
                      </div>
                    </MagneticButton>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </div>
    </section>
  );
}
