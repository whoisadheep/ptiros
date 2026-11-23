"use client";

import { ArrowRight, CheckCircle2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import ScrollReveal from "./ui/ScrollReveal";

const testHighlights = [
  "Identify your cognitive strengths across 6 thinking styles",
  "Match with 250+ careers across AI, Law, Medicine, and Design",
  "Zero exam pressure: 100% supportive, exploratory, and private",
  "Customized roadmap tailored to your exact school grade (Classes 8–12)",
  "Instant personalized career blueprint with actionable next steps",
] as const;

export default function CareerTestCTA() {
  return (
    <section
      id="career-test"
      className="relative overflow-hidden bg-white py-20 sm:py-28 border-t border-stone-200/60"
      aria-label="Career Diagnostic Test"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-12 lg:gap-14">
          {/* Left Column: Brain Line Art */}
          <div className="flex flex-col items-center justify-center lg:col-span-5">
            <ScrollReveal direction="up" distance={20} duration={0.5}>
              <div className="relative w-full max-w-md aspect-square flex items-center justify-center p-4">
                <div className="relative w-full h-full max-w-[360px] max-h-[360px]">
                  <Image
                    src="/client_brain.png"
                    alt="PTIROS Cognitive Mapping Model"
                    fill
                    className="object-contain"
                    priority
                  />
                </div>
              </div>

              <p className="mt-2 text-center text-xs font-medium text-stone-500">
                Cognitive Aptitude & Neurological Assessment Model
              </p>
            </ScrollReveal>
          </div>

          {/* Right Column: Grounded Primary Callout Card */}
          <div className="lg:col-span-7">
            <ScrollReveal direction="up" delay={0.1} distance={20} duration={0.5}>
              <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-stone-900 p-8 sm:p-12 text-white shadow-xs">
                <div className="relative z-10 space-y-6">
                  {/* Header pill & Title */}
                  <div className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3.5 py-1 text-xs font-semibold text-stone-200">
                    <span className="size-1.5 rounded-full bg-orange-500" />
                    <span>Free Student Diagnostic</span>
                  </div>

                  <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight text-white">
                    Find your authentic future.
                  </h2>

                  {/* 5 Bullet Points with subtle icons */}
                  <ul className="space-y-3 pt-1">
                    {testHighlights.map((point) => (
                      <li
                        key={point}
                        className="flex items-start gap-3 text-sm sm:text-base text-stone-300"
                      >
                        <CheckCircle2 className="size-4 text-orange-500 mt-1 shrink-0" />
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>

                  {/* CTA Button */}
                  <div className="pt-4 flex flex-col sm:flex-row items-start sm:items-center gap-4">
                    <Link
                      href="/career-test"
                      className="group inline-flex items-center justify-center gap-2 rounded-xl bg-orange-600 hover:bg-orange-700 text-white px-7 py-3.5 text-sm font-bold shadow-xs transition-colors active:scale-95"
                    >
                      <span>Start Career Diagnostic</span>
                      <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
                    </Link>
                    <span className="text-xs text-stone-400">
                      Takes 5 minutes • Free • No preparation needed
                    </span>
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
