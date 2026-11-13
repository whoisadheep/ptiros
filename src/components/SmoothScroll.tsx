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
      }}
    >
      {children}
    </ReactLenis>
  );
}
