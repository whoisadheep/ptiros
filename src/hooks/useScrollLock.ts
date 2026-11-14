"use client";

import { useEffect } from "react";
import { useLenis } from "lenis/react";

let activeLocks = 0;
let originalBodyOverflow = "";
let originalHtmlOverflow = "";

/**
 * Universal scroll lock hook for modal dialogs and slide-out drawers.
 * 1. Locks the background document body and root html to prevent page scrolling.
 * 2. Pauses Lenis smooth scrolling instance if active.
 * 3. Gracefully restores scroll state and restarts Lenis on modal close or unmount.
 */
export function useScrollLock(isLocked: boolean) {
  const lenis = useLenis();

  useEffect(() => {
    if (!isLocked) return;

    if (activeLocks === 0) {
      originalBodyOverflow = document.body.style.overflow;
      originalHtmlOverflow = document.documentElement.style.overflow;
      document.body.style.overflow = "hidden";
      document.documentElement.style.overflow = "hidden";
      try {
        lenis?.stop();
      } catch (err) {
        console.warn("Failed to pause Lenis:", err);
      }
    }
    activeLocks++;

    return () => {
      activeLocks--;
      if (activeLocks <= 0) {
        activeLocks = 0;
        document.body.style.overflow = originalBodyOverflow;
        document.documentElement.style.overflow = originalHtmlOverflow;
        try {
          lenis?.start();
        } catch (err) {
          console.warn("Failed to resume Lenis:", err);
        }
      }
    };
  }, [isLocked, lenis]);
}
