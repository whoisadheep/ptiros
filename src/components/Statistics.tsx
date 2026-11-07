"use client";

import { useEffect, useState, useRef } from "react";
import { useInView, useReducedMotion } from "framer-motion";
import ScrollReveal from "./ui/ScrollReveal";

interface Stat {
  value: number;
  suffix: string;
  description: string;
  variant: "orange" | "white";
}

const stats: Stat[] = [
  {
    value: 73,
    suffix: "%",
    description: "of Indian students choose wrong academic streams",
    variant: "white",
  },
  {
    value: 93,
    suffix: "%",
    description: "of Indian students choose their career completely blindfolded",
    variant: "orange",
  },
  {
    value: 80,
    suffix: "%",
    description: "of college graduates secretly regret their academic degrees",
    variant: "orange",
  },
  {
    value: 90,
    suffix: "%",
    description: "of Indian students can name only 7 out of 250 career options",
    variant: "white",
  },
];

function AnimatedCounter({
  target,
  suffix,
  isInView,
}: {
  target: number;
  suffix: string;
  isInView: boolean;
}) {
  const [display, setDisplay] = useState(target);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (!isInView || reducedMotion) return;

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

      setDisplay(Math.round(easedProgress * target));

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    }

    requestAnimationFrame(animate);
  }, [isInView, target, reducedMotion]);

  return (
    <span>
      {display}
      {suffix}
    </span>
  );
}

function StatCard({
  stat,
  isInView,
}: {
  stat: Stat;
  isInView: boolean;
}) {
  const isOrange = stat.variant === "orange";

  return (
    <div
      className={`group relative flex flex-col justify-between overflow-hidden rounded-[2.5rem] p-8 sm:p-12 shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl h-full ${
        isOrange
          ? "bg-gradient-to-br from-primary via-[#FA6500] to-primary-dark text-white"
          : "border border-border/80 bg-white text-accent"
      }`}
      style={{ minHeight: "260px" }}
    >
      {/* Big Percentage Number matching design-03.png */}
      <div>
        <p
          className={`font-display text-6xl sm:text-7xl lg:text-8xl font-black tracking-tight ${
            isOrange ? "text-white" : "text-primary"
          }`}
        >
          <AnimatedCounter
            target={stat.value}
            suffix={stat.suffix}
            isInView={isInView}
          />
        </p>
      </div>

      {/* Description matching design-03.png */}
      <div className="mt-6 border-t pt-4 border-current/20">
        <p
          className={`font-display text-lg sm:text-xl lg:text-2xl font-bold leading-snug ${
            isOrange ? "text-white/95" : "text-accent"
          }`}
        >
          {stat.description}
        </p>
      </div>
    </div>
  );
}

export default function Statistics() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.2 });

  return (
    <section
      id="statistics"
      ref={sectionRef}
      className="relative overflow-hidden bg-bg py-24 sm:py-32"
      aria-label="Critical Student Statistics"
    >
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
        <ScrollReveal direction="up" distance={20}>
          <div className="mb-14 text-center">
            <span className="inline-block rounded-full bg-primary/10 px-4 py-1 text-xs sm:text-sm font-bold uppercase tracking-wider text-primary">
              The Reality
            </span>
            <h2 className="mt-3 font-display text-3xl sm:text-5xl lg:text-6xl font-black text-accent">
              Why Early Guidance Matters
            </h2>
          </div>
        </ScrollReveal>

        {/* 2x2 Checkerboard Grid matching design-03.png */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:gap-8">
          {stats.map((stat, idx) => (
            <ScrollReveal
              key={stat.description}
              delay={idx * 0.1}
              direction="up"
              distance={24}
            >
              <StatCard
                stat={stat}
                isInView={isInView}
              />
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
