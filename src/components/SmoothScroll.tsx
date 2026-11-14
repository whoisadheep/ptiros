"use client";

import { useEffect, useState } from "react";
import { ReactLenis } from "lenis/react";
import "lenis/dist/lenis.css";

export default function SmoothScroll({
  children,
}: {
  children: React.ReactNode;
}) {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    // Only disable Lenis on mobile/tablet devices that strictly rely on coarse touch.
    // Laptops with touchscreens (which also have a trackpad/mouse) retain Lenis smooth scrolling.
    const isCoarseTouchOnly =
      typeof window !== "undefined" &&
      window.matchMedia("(pointer: coarse) and (hover: none)").matches;

    if (!isCoarseTouchOnly) {
      setEnabled(true);
    }
  }, []);

  if (!enabled) {
    return <>{children}</>;
  }

  return (
    <ReactLenis
      root
      options={{
        lerp: 0.09,
        duration: 1.2,
        smoothWheel: true,
        wheelMultiplier: 1.05,
        syncTouch: false,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        prevent: (node) => {
          if (!(node instanceof HTMLElement)) return false;
          return Boolean(
            node.hasAttribute("data-lenis-prevent") ||
            node.closest("[data-lenis-prevent]") ||
            node.closest('[role="dialog"]') ||
            node.closest('[aria-modal="true"]') ||
            node.closest(".lenis-prevent")
          );
        },
      }}
    >
      {children}
    </ReactLenis>
  );
}
