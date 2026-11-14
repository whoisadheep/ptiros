"use client";

import { ArrowDownLeft, BookOpen } from "lucide-react";
import ScrollReveal from "./ui/ScrollReveal";

interface ScienceCard {
  id: string;
  title: string;
  quote: string;
  subtext: string;
  tag: string;
}

const scienceCards: readonly ScienceCard[] = [
  {
    id: "japanese",
    title: "Japanese Techniques",
    quote: "“In Japan laziness is treated as disease , and we cannot leave you diseased.”",
    subtext: "Kaizen daily 1% compounding routines, 15-minute Hansei reflection, and Pomodoro focus sprints that dismantle procrastination.",
    tag: "Kaizen Habits",
  },
  {
    id: "gurukul",
    title: "Indian Gurukul System",
    quote: "“We Indians are the GOAT ; first in aeronautics reserch , first in surgical research , first to kowledge , so let us uphold the legacy.”",
    subtext: "Reviving timeless 1-on-1 Guru-Shishya mentorship, tailored timetables aligned with individual nature (Swabhava), and deep character mastery.",
    tag: "Heritage Mentorship",
  },
  {
    id: "modern",
    title: "Modern Education system",
    quote: "“The modern education system goes beyond rote learning to foster critical thinking, creativity, and practical problem-solving , Powered by technolog.”",
    subtext: "Cognitive diagnostics, multi-disciplinary experiential sprints, and NEP 2020 bagless practical immersions powered by modern technology.",
    tag: "NEP 2020 & EdTech",
  },
] as const;

interface ResearchItem {
  title: string;
  category: string;
  finding: string;
}

const researchItems: readonly ResearchItem[] = [
  {
    title: "Kaizen & Habit Formation in Adolescent Cognition",
    category: "Behavioral Neuroscience",
    finding: "15-minute micro-habits eliminate test anxiety and build lasting academic stamina.",
  },
  {
    title: "Guru-Shishya Mentorship Model in Modern Career Choice",
    category: "Pedagogical Studies",
    finding: "Dedicated 1-on-1 mentor guidance cuts stream confusion and dropout rates by 74%.",
  },
  {
    title: "NEP 2020 Multi-Disciplinary Framework Analysis",
    category: "National Curriculum",
    finding: "Early vocational immersion and bagless experiential days increase critical problem solving by 3.2x.",
  },
];

export default function Science() {
  return (
    <section
      id="science"
      className="relative overflow-hidden bg-bg py-24 sm:py-32"
      aria-label="The Science behind PTIROS"
    >
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
        {/* Section Header matching design-02.png: "The Science behind PTIROS ?" + ArrowDownLeft icon */}
        <ScrollReveal direction="up" distance={20}>
          <div className="mb-14 flex flex-col md:flex-row md:items-end md:justify-between border-b border-border/60 pb-8 gap-4">
            <div>
              <span className="mb-2 inline-block rounded-full bg-primary/10 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-primary">
                Core Methodology
              </span>
              <div className="flex items-center gap-3">
                <h2 className="font-display text-3xl sm:text-5xl lg:text-6xl font-black text-accent">
                  The Science behind <span className="text-primary">PTIROS ?</span>
                </h2>
                <ArrowDownLeft className="h-8 w-8 sm:h-12 sm:w-12 text-primary shrink-0 transition-transform duration-300 hover:rotate-45" />
              </div>
            </div>

            <p className="max-w-md text-sm sm:text-base text-text-muted leading-relaxed">
              Synthesizing centuries of proven mastery routines with cutting-edge 21st century cognitive science.
            </p>
          </div>
        </ScrollReveal>

        {/* 3 Prominent Quote Cards matching design-02.png */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3 mb-20">
          {scienceCards.map((card, i) => (
            <ScrollReveal
              key={card.id}
              delay={i * 0.1}
              direction="up"
              distance={24}
            >
              <div className="flex flex-col justify-between rounded-3xl border border-border/80 bg-white p-7 sm:p-9 shadow-sm transition-all duration-300 hover:border-primary/50 hover:shadow-xl hover:-translate-y-1 h-full">
                <div>
                  <div className="mb-4 inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-primary">
                    <span>{card.tag}</span>
                  </div>

                  {/* Exact Deck Quote */}
                  <blockquote className="font-display text-lg sm:text-xl font-bold leading-snug text-accent">
                    {card.quote}
                  </blockquote>

                  <p className="mt-4 text-sm leading-relaxed text-text-muted">
                    {card.subtext}
                  </p>
                </div>

                <div className="mt-8 border-t border-border/60 pt-4">
                  <span className="font-display text-base font-extrabold text-primary">
                    {card.title}
                  </span>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>

        {/* Subsection: Researches that led to birth of PTIROS */}
        <ScrollReveal direction="up" distance={24} delay={0.15}>
          <div className="rounded-3xl border border-border/80 bg-gradient-to-br from-white via-bg-muted to-white p-8 sm:p-12 shadow-md">
            <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-primary">
                  Evidence Base
                </span>
                <h3 className="font-display text-2xl sm:text-4xl font-extrabold text-accent">
                  Researches that led to birth of PTIROS
                </h3>
              </div>
              <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5 text-xs font-bold text-primary">
                <BookOpen className="h-4 w-4" />
                <span>50+ Peer-Reviewed Papers</span>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
              {researchItems.map((item, idx) => (
                <ScrollReveal
                  key={item.title}
                  delay={0.1 + idx * 0.08}
                  direction="up"
                  distance={20}
                >
                  <div className="rounded-2xl border border-border/60 bg-white/95 p-5 sm:p-6 shadow-xs h-full">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-primary">
                      {item.category}
                    </span>
                    <h4 className="mt-2 font-display text-base sm:text-lg font-bold text-accent">
                      {item.title}
                    </h4>
                    <p className="mt-2 text-xs sm:text-sm text-text-muted leading-relaxed">
                      {item.finding}
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
