"use client";

import { useRef, useEffect, useState } from "react";
import { useInView, useReducedMotion } from "framer-motion";
import { FileBarChart, BookOpen, GraduationCap } from "lucide-react";
import ScrollReveal from "./ui/ScrollReveal";

interface StatItem {
  value: number;
  suffix: string;
  label: string;
  description: string;
  icon: React.ElementType;
}

const stats: StatItem[] = [
  {
    value: 10000,
    suffix: "+",
    label: "survey reports",
    description:
      "10 thousand + surveys taken across different schools by school students about problems faced by them in schools due to lack of skill development and career blueprint",
    icon: FileBarChart,
  },
  {
    value: 50,
    suffix: "+",
    label: "research studied",
    description:
      "50+ studies done across various research papers on techniques that increase productivity across Japanese techniques, Indian gurukul system and modern education system",
    icon: BookOpen,
  },
  {
    value: 9,
    suffix: "+",
    label: "yrs of teaching",
    description:
      "after about 9+ years in teaching, mentorship and analysis from personal experience,",
    icon: GraduationCap,
  },
];

function formatNumber(n: number): string {
  if (n >= 1000) {
    return n.toLocaleString("en-IN");
  }
  return n.toString();
}

function AnimatedCounter({
  target,
  suffix,
  isInView,
}: {
  target: number;
  suffix: string;
  isInView: boolean;
}) {
  const [count, setCount] = useState(target);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    if (!isInView || prefersReducedMotion) return;

    let start = 0;
    const duration = 1600;
    const startTime = performance.now();

    function easeOutExpoFn(t: number): number {
      return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
    }

    function animate(currentTime: number) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easedProgress = easeOutExpoFn(progress);

      setCount(Math.round(easedProgress * target));

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    }

    requestAnimationFrame(animate);
  }, [isInView, target, prefersReducedMotion]);

  return (
    <span className="tabular-nums">
      {formatNumber(count)}
      {suffix}
    </span>
  );
}

export default function Stats() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.2 });

  return (
    <section
      id="stats"
      ref={sectionRef}
      className="relative bg-bg py-16 sm:py-24 border-t border-b border-border/60"
      aria-label="Key Statistics"
    >
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
        <div className="divide-y divide-border/60">
          {stats.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <ScrollReveal
                key={stat.label}
                delay={idx * 0.1}
                direction="up"
                distance={20}
              >
                <div className="group grid grid-cols-1 items-center gap-6 py-8 sm:py-10 md:grid-cols-12 md:gap-8 transition-colors duration-200 hover:bg-primary/[0.02]">
                  {/* Column 1: Big Number & Suffix (4 Cols) */}
                  <div className="flex items-center gap-4 md:col-span-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary transition-transform duration-300 group-hover:scale-110">
                      <Icon className="h-6 w-6" strokeWidth={2} />
                    </div>
                    <div>
                      <span className="font-display text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-accent">
                        <AnimatedCounter
                          target={stat.value}
                          suffix={stat.suffix}
                          isInView={isInView}
                        />
                      </span>
                      <span className="block font-display text-base sm:text-lg font-bold text-primary">
                        {stat.label}
                      </span>
                    </div>
                  </div>

                  {/* Column 2: Exact Copy from Client deck (8 Cols) */}
                  <div className="md:col-span-8">
                    <p className="text-base sm:text-lg lg:text-xl font-normal leading-relaxed text-text">
                      {stat.description}
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
