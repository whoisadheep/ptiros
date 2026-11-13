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
    // Only enable Lenis smooth scrolling on desktop devices with a mouse wheel.
    // Mobile devices (iOS Safari, Android Chrome) have hardware momentum scrolling.
    const isTouch =
      typeof window !== "undefined" &&
      ("ontouchstart" in window ||
        navigator.maxTouchPoints > 0 ||
        window.matchMedia("(pointer: coarse)").matches);

    if (!isTouch) {
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
      }}
    >
      {children}
    </ReactLenis>
  );
}
