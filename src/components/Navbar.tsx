"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLenis } from "lenis/react";
import {
  Menu,
  X,
  Home,
  Info,
  Sparkles,
  Map,
  Brain,
  LayoutDashboard,
  Phone,
  ChevronRight,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";

const navLinks = [
  { label: "Home", href: "/#home", icon: Home },
  { label: "About", href: "/#about", icon: Info },
  { label: "Why PTIROS", href: "/#why-ptiros", icon: Sparkles },
  { label: "Roadmaps", href: "/#roadmaps", icon: Map },
  { label: "Career Test", href: "/career-test", icon: Brain },
  { label: "Student Portal", href: "/dashboard", icon: LayoutDashboard },
  { label: "Contact", href: "/#contact", icon: Phone },
] as const;

const easeOutExpo = [0.16, 1, 0.3, 1] as const;

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const lenis = useLenis();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const handleNavClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string
  ) => {
    setIsOpen(false);
    if (href.startsWith("/#") && typeof window !== "undefined") {
      const targetId = href.replace("/#", "");
      const targetElement = document.getElementById(targetId);
      if (targetElement) {
        e.preventDefault();
        // Give time for sidebar animation to begin and body overflow unlock
        setTimeout(() => {
          if (lenis) {
            lenis.scrollTo(targetElement, { offset: -70 });
          } else {
            targetElement.scrollIntoView({ behavior: "smooth" });
          }
        }, 120);
      }
    }
  };

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: easeOutExpo }}
      className={`fixed top-0 left-0 right-0 z-40 transition-all ${
        scrolled
          ? "bg-white/80 backdrop-blur-xl border-b border-border/50 shadow-sm"
          : "bg-transparent"
      }`}
      style={{ transitionDuration: "var(--duration-standard)" }}
    >
      <nav
        className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 lg:px-8"
        aria-label="Primary navigation"
      >
        {/* Brand */}
        <Link href="/" className="relative z-40 cursor-pointer">
          <span className="font-display text-2xl font-bold tracking-tight text-gradient">
            PTIROS
          </span>
        </Link>

        {/* Desktop Links */}
        <ul className="hidden items-center gap-1 lg:flex" role="list">
          {navLinks.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                onClick={(e) => handleNavClick(e, link.href)}
                className="relative cursor-pointer rounded-lg px-4 py-2 text-sm font-medium text-accent transition-colors hover:text-primary"
                style={{ transitionDuration: "var(--duration-quick)" }}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Desktop CTA */}
        <div className="hidden lg:block">
          <Link
            href="/career-test"
            className="cursor-pointer rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-primary/25 transition-all hover:bg-primary-dark hover:shadow-xl hover:shadow-primary/30 active:scale-95"
            style={{
              transitionDuration: "var(--duration-quick)",
              transitionTimingFunction: "var(--ease-out-expo)",
            }}
          >
            Give Career Test
          </Link>
        </div>

        {/* Mobile Menu Toggle Button */}
        <motion.button
          className="relative z-40 flex h-11 w-11 cursor-pointer items-center justify-center rounded-xl bg-white/60 backdrop-blur-md border border-border/60 shadow-sm text-accent lg:hidden"
          onClick={() => setIsOpen(!isOpen)}
          aria-label={isOpen ? "Close menu" : "Open menu"}
          aria-expanded={isOpen}
          whileTap={{ scale: 0.92 }}
          transition={{ duration: 0.15, ease: easeOutExpo }}
        >
          <div className="relative h-5 w-6 flex items-center justify-center">
            {isOpen ? (
              <X className="h-6 w-6 text-accent" />
            ) : (
              <div className="space-y-1.5 w-6">
                <span className="block h-0.5 w-6 rounded-full bg-accent" />
                <span className="block h-0.5 w-4 rounded-full bg-primary ml-auto" />
                <span className="block h-0.5 w-6 rounded-full bg-accent" />
              </div>
            )}
          </div>
        </motion.button>
      </nav>

      {/* Mobile Navigation Sidebar Drawer */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm lg:hidden"
              aria-hidden="true"
            />

            {/* Slide-in Sidebar Drawer */}
            <motion.aside
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ duration: 0.35, ease: easeOutExpo }}
              className="fixed top-0 right-0 bottom-0 z-50 flex h-full w-[86vw] max-w-sm flex-col justify-between bg-white shadow-2xl overflow-hidden lg:hidden"
              aria-label="Mobile navigation sidebar"
            >
              {/* Sidebar Header */}
              <div className="flex items-center justify-between border-b border-border/60 px-5 py-4 bg-bg-muted/50">
                <div className="flex items-center gap-2">
                  <span className="font-display text-xl font-black text-gradient">
                    PTIROS
                  </span>
                  <span className="rounded-md bg-primary/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-primary">
                    Navigation
                  </span>
                </div>

                <button
                  onClick={() => setIsOpen(false)}
                  className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg bg-white border border-border/60 text-accent transition-colors hover:bg-neutral-100 hover:text-primary"
                  aria-label="Close sidebar"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Scrollable Navigation Items */}
              <div className="flex-1 overflow-y-auto px-4 py-4 space-y-1.5 overscroll-contain">
                {navLinks.map((link, i) => {
                  const Icon = link.icon;
                  return (
                    <motion.div
                      key={link.href}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{
                        duration: 0.25,
                        delay: i * 0.04,
                        ease: easeOutExpo,
                      }}
                    >
                      <Link
                        href={link.href}
                        onClick={(e) => handleNavClick(e, link.href)}
                        className="group flex cursor-pointer items-center justify-between rounded-xl px-3.5 py-3 text-accent transition-all duration-150 hover:bg-primary/5 active:bg-primary/10"
                      >
                        <div className="flex items-center gap-3.5">
                          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-bg-muted border border-border/50 text-accent group-hover:border-primary/40 group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                            <Icon className="h-4 w-4" />
                          </div>
                          <span className="font-display text-base font-semibold text-accent group-hover:text-primary transition-colors">
                            {link.label}
                          </span>
                        </div>
                        <ChevronRight className="h-4 w-4 text-text-muted/60 transition-transform duration-150 group-hover:translate-x-1 group-hover:text-primary" />
                      </Link>
                    </motion.div>
                  );
                })}
              </div>

              {/* Sidebar Footer with CTA */}
              <div className="border-t border-border/60 p-5 bg-bg/80 backdrop-blur-sm">
                <Link
                  href="/career-test"
                  onClick={() => setIsOpen(false)}
                  className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-2xl bg-primary py-3.5 px-6 font-display text-base font-bold text-white shadow-lg shadow-primary/25 transition-all hover:bg-primary-dark active:scale-[0.98]"
                >
                  <span>Give Career Test</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>

                <div className="mt-3 flex items-center justify-between text-[11px] font-medium text-text-muted px-1">
                  <span>NEP 2020 Aligned</span>
                  <span>Free Instant Report</span>
                </div>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
