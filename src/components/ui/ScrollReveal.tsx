"use client";

import { useReducedMotion } from "framer-motion";
import { ReactNode, useEffect, useState, useRef } from "react";

interface ScrollRevealProps {
  children: ReactNode;
  delay?: number;
  direction?: "up" | "down" | "left" | "right" | "none";
  distance?: number;
  duration?: number;
  className?: string;
  once?: boolean;
}

export default function ScrollReveal({
  children,
  delay = 0,
  direction = "up",
  distance = 18,
  duration = 0.45,
  className = "",
  once = true,
}: ScrollRevealProps) {
  const prefersReducedMotion = useReducedMotion();
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // If user prefers reduced motion, show immediately
    if (prefersReducedMotion) {
      setIsVisible(true);
      return;
    }

    const el = ref.current;
    if (!el) {
      setIsVisible(true);
      return;
    }

    // Modern IntersectionObserver with generous margins so it triggers BEFORE entering viewport
    if (typeof window !== "undefined" && "IntersectionObserver" in window) {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setIsVisible(true);
              if (once) {
                observer.unobserve(entry.target);
              }
            }
          });
        },
        {
          // Pre-trigger 140px before scrolling into viewport, and 100px past top
          rootMargin: "100px 0px 140px 0px",
          threshold: 0.01,
        }
      );

      observer.observe(el);

      // Safety fallback: NEVER allow content to stay invisible on any mobile browser
      const safetyTimer = setTimeout(() => {
        setIsVisible(true);
      }, 1500);

      return () => {
        observer.disconnect();
        clearTimeout(safetyTimer);
      };
    } else {
      setIsVisible(true);
    }
  }, [once, prefersReducedMotion]);

  if (prefersReducedMotion) {
    return <div className={className}>{children}</div>;
  }

  const getInitialPosition = () => {
    switch (direction) {
      case "up":
        return { y: distance, x: 0 };
      case "down":
        return { y: -distance, x: 0 };
      case "left":
        return { x: distance, y: 0 };
      case "right":
        return { x: -distance, y: 0 };
      case "none":
        return { x: 0, y: 0 };
    }
  };

  const initialOffset = getInitialPosition();

  return (
    <div
      ref={ref}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible
          ? "translate3d(0, 0, 0)"
          : `translate3d(${initialOffset.x}px, ${initialOffset.y}px, 0)`,
        transition: `opacity ${duration}s cubic-bezier(0.16, 1, 0.3, 1) ${delay}s, transform ${duration}s cubic-bezier(0.16, 1, 0.3, 1) ${delay}s`,
        willChange: isVisible ? "auto" : "opacity, transform",
      }}
      className={`scroll-reveal-item ${className}`}
    >
      {children}
    </div>
  );
}
