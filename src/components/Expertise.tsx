"use client";

import { Compass, BookOpen, Award, Languages, Heart } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import ScrollReveal from "./ui/ScrollReveal";

interface ExpertiseItem {
  icon: LucideIcon;
  title: string;
  description: string;
}

const expertiseData: ExpertiseItem[] = [
  {
    icon: Compass,
    title: "Career building",
    description:
      "We design actionable roadmaps for career path and help them to implement.",
  },
  {
    icon: BookOpen,
    title: "Academic Boost",
    description:
      "We assist students in their regular tests and term exams through effective personalised timetables",
  },
  {
    icon: Award,
    title: "Government verified certificate courses",
    description:
      "Various government certificates that increase opportunities in near future",
  },
  {
    icon: Languages,
    title: "English proficiency",
    description:
      "TOEFL and IELTS like preparation for english proficiency , for abroad placements",
  },
  {
    icon: Heart,
    title: "Health coaching",
    description:
      "Health vulnerabilities personalised for each student and their prevention",
  },
];

export default function Expertise() {
  return (
    <section
      id="expertise"
      className="relative overflow-hidden bg-primary py-24 sm:py-32 text-white"
      aria-label="Our Areas of Expertise"
    >
      {/* Decorative subtle glows */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
        <div className="absolute right-0 top-0 h-96 w-96 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute left-0 bottom-0 h-80 w-80 rounded-full bg-black/10 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
        {/* Section Heading matching design-03.png */}
        <ScrollReveal direction="up" distance={20}>
          <div className="mb-14 text-center">
            <span className="inline-block rounded-full bg-white/20 px-4 py-1.5 text-xs sm:text-sm font-bold uppercase tracking-widest text-white backdrop-blur-sm">
              Core Competencies
            </span>
            <h2 className="mt-4 font-display text-3xl sm:text-5xl lg:text-6xl font-black uppercase tracking-tight text-white">
              Our areas of expertise
            </h2>
          </div>
        </ScrollReveal>

        {/* 5 Tall White-Bordered Cards matching design-03.png */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
          {expertiseData.map((item, idx) => {
            const Icon = item.icon;
            return (
              <ScrollReveal
                key={item.title}
                delay={idx * 0.08}
                direction="up"
                distance={24}
              >
                <div
                  className="group flex flex-col justify-between rounded-3xl border border-white/30 bg-white/10 p-6 sm:p-7 backdrop-blur-md transition-all duration-300 hover:bg-white/20 hover:border-white/60 hover:-translate-y-1.5 h-full"
                  style={{ minHeight: "340px" }}
                >
                  <div>
                    <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-primary shadow-lg transition-transform duration-300 group-hover:scale-110">
                      <Icon className="h-7 w-7" strokeWidth={2.2} />
                    </div>

                    <h3 className="font-display text-xl sm:text-2xl font-bold leading-snug text-white">
                      {item.title}
                    </h3>
                  </div>

                  <div className="mt-6 border-t border-white/20 pt-4">
                    <p className="text-sm sm:text-base leading-relaxed text-white/95">
                      {item.description}
                    </p>
                  </div>
                </div>
              </ScrollReveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
