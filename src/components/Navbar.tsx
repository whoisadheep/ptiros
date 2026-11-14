"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useUserProfile } from "@/context/UserProfileContext";
import { useStudentAuth } from "@/context/StudentAuthContext";
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
  Gamepad2,
  GraduationCap,
  Building2,
  FileText,
} from "lucide-react";
import Link from "next/link";

const navLinks = [
  { label: "Home", href: "/#home", icon: Home },
  { label: "About", href: "/#about", icon: Info },
  { label: "Why PTIROS", href: "/#why-ptiros", icon: Sparkles },
  { label: "Simulator", href: "/simulator", icon: Gamepad2 },
  { label: "Roadmaps", href: "/#roadmaps", icon: Map },
  { label: "Career Test", href: "/career-test", icon: Brain },
  { label: "Student Portal", href: "/dashboard", icon: LayoutDashboard },
  { label: "Contact", href: "/#contact", icon: Phone },
] as const;

const easeOutExpo = [0.16, 1, 0.3, 1] as const;

export default function Navbar() {
  const { profile, openIntakeModal, openBookingModal, openDossierModal } = useUserProfile();
  const { user: studentUser, openAuthModal: openStudentAuthModal } = useStudentAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

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
        setTimeout(() => {
          const yOffset = -85;
          const y =
            targetElement.getBoundingClientRect().top +
            window.pageYOffset +
            yOffset;
          window.scrollTo({ top: Math.max(0, y), behavior: "smooth" });
        }, 150);
      }
    }
  };

  return (
    <>
      {/* Top Navigation Bar */}
      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
          scrolled
            ? "bg-white/90 backdrop-blur-xl border-b border-border/50 shadow-xs"
            : "bg-transparent"
        }`}
      >
        <nav
          className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 lg:px-8"
          aria-label="Primary navigation"
        >
          {/* Brand */}
          <Link href="/" className="relative cursor-pointer">
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

          {/* Desktop CTA & Profile */}
          <div className="hidden lg:flex items-center gap-2.5">
            {studentUser ? (
              <Link
                href="/dashboard"
                className="flex items-center gap-2 rounded-full border border-orange-200 bg-orange-50/90 px-3 py-1 text-xs font-bold text-orange-950 hover:bg-orange-100 transition shadow-xs cursor-pointer"
                title="Open Student Dashboard"
              >
                <span className="size-6 rounded-full bg-gradient-to-tr from-primary to-secondary text-white text-[10px] font-bold flex items-center justify-center">
                  {studentUser.avatarInitials}
                </span>
                <span className="max-w-[85px] truncate">{studentUser.name.split(" ")[0]}</span>
                <span className="text-[10px] text-orange-700 bg-orange-200/60 px-1.5 py-0.5 rounded-full">
                  {studentUser.grade}
                </span>
              </Link>
            ) : (
              <button
                type="button"
                onClick={() => openStudentAuthModal("login")}
                className="text-xs font-bold text-accent/90 hover:text-primary transition px-3.5 py-1.5 rounded-full border border-border/70 hover:border-primary/40 bg-white/80 cursor-pointer shadow-xs"
              >
                Student Login
              </button>
            )}

            {profile?.studentName && !studentUser && (
              <button
                type="button"
                onClick={openIntakeModal}
                className="flex items-center gap-1.5 rounded-full border border-orange-200 bg-orange-50/80 px-3.5 py-1.5 text-xs font-semibold text-orange-950 hover:bg-orange-100 transition shadow-xs cursor-pointer"
                title="Edit Student & Parent Profile"
              >
                <GraduationCap className="size-3.5 text-primary" />
                <span className="max-w-[110px] truncate">{profile.studentName.split(" ")[0]}</span>
                <span className="text-[10px] text-orange-600 bg-orange-100 px-1.5 py-0.2 rounded-full">
                  {profile.grade}
                </span>
              </button>
            )}

            <Link
              href="/career-test"
              className="cursor-pointer rounded-full bg-primary px-5 py-2 text-xs font-bold text-white shadow-lg shadow-primary/25 transition-all hover:bg-primary-dark hover:shadow-xl hover:shadow-primary/30 active:scale-95"
            >
              Give Career Test
            </Link>
          </div>

          {/* Mobile Menu Toggle Button */}
          <button
            className="relative flex h-11 w-11 cursor-pointer items-center justify-center rounded-xl bg-white/80 backdrop-blur-md border border-border/70 shadow-sm text-accent lg:hidden transition-transform active:scale-90"
            onClick={() => setIsOpen(!isOpen)}
            aria-label={isOpen ? "Close menu" : "Open menu"}
            aria-expanded={isOpen}
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
          </button>
        </nav>
      </header>

      {/* Mobile Navigation Sidebar Drawer — Rendered at Top Level with z-[999] */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-[999] lg:hidden">
            {/* Backdrop Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm"
              aria-hidden="true"
            />

            {/* Slide-in Sidebar Drawer */}
            <motion.aside
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ duration: 0.35, ease: easeOutExpo }}
              className="fixed top-0 right-0 bottom-0 flex h-[100dvh] w-[86vw] max-w-sm flex-col justify-between bg-white shadow-2xl overflow-hidden"
              aria-label="Mobile navigation sidebar"
            >
              {/* Sidebar Header */}
              <div className="flex items-center justify-between border-b border-border/60 px-5 py-4 bg-bg-muted/70">
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
                  className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg bg-white border border-border/60 text-accent transition-colors hover:bg-neutral-100 hover:text-primary active:scale-95"
                  aria-label="Close sidebar"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Scrollable Navigation Items */}
              <div className="flex-1 overflow-y-auto px-4 py-4 space-y-1.5 overscroll-contain">
                {/* Student Session Banner */}
                <div className="mb-3 rounded-2xl border border-orange-200/90 bg-gradient-to-br from-orange-50 to-amber-50/50 p-3.5 text-xs text-orange-950 shadow-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold flex items-center gap-1.5">
                      <GraduationCap className="size-4 text-primary" /> {studentUser ? studentUser.name : (profile?.studentName ? profile.studentName : "Student Portal")}
                    </span>
                    {studentUser ? (
                      <Link
                        href="/dashboard"
                        onClick={() => setIsOpen(false)}
                        className="text-[11px] font-bold text-white bg-primary hover:bg-primary-dark px-3 py-1 rounded-full cursor-pointer transition shadow-xs"
                      >
                        Dashboard →
                      </Link>
                    ) : (
                      <button
                        type="button"
                        onClick={() => {
                          setIsOpen(false);
                          openStudentAuthModal("login");
                        }}
                        className="text-[11px] font-bold text-orange-700 bg-orange-100 hover:bg-orange-200 px-3 py-1 rounded-full cursor-pointer transition"
                      >
                        Login / Demo
                      </button>
                    )}
                  </div>
                  {studentUser ? (
                    <p className="mt-1 text-[11px] text-stone-600">
                      {studentUser.grade} • {studentUser.city} • {studentUser.curriculum}
                    </p>
                  ) : (
                    <p className="mt-1 text-[11px] text-stone-500">
                      Sign in or switch instant demo profiles (Aarav, Meera, Vihaan).
                    </p>
                  )}
                </div>

                {/* Quick Feature Triggers (From Handwritten Blueprint) */}
                <div className="grid grid-cols-2 gap-2 mb-3">
                  <button
                    type="button"
                    onClick={() => {
                      setIsOpen(false);
                      openBookingModal();
                    }}
                    className="flex flex-col items-start rounded-xl border border-border/70 bg-bg-muted/50 p-2.5 text-left hover:border-primary/40 hover:bg-primary/5 transition cursor-pointer"
                  >
                    <Building2 className="size-4 text-primary mb-1" />
                    <span className="text-xs font-bold text-accent">Book Mentor</span>
                    <span className="text-[10px] text-text-muted">1-on-1 Strategy Call</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setIsOpen(false);
                      openDossierModal();
                    }}
                    className="flex flex-col items-start rounded-xl border border-border/70 bg-bg-muted/50 p-2.5 text-left hover:border-primary/40 hover:bg-primary/5 transition cursor-pointer"
                  >
                    <FileText className="size-4 text-primary mb-1" />
                    <span className="text-xs font-bold text-accent">10-Pg Dossier</span>
                    <span className="text-[10px] text-text-muted">Sample Preview</span>
                  </button>
                </div>
                {navLinks.map((link, i) => {
                  const Icon = link.icon;
                  return (
                    <motion.div
                      key={link.href}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{
                        duration: 0.25,
                        delay: i * 0.03,
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

              {/* Sidebar Footer with CTA (with iOS safe-area inset) */}
              <div className="border-t border-border/60 p-5 pb-[calc(1.25rem+env(safe-area-inset-bottom))] bg-bg/90 backdrop-blur-sm">
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
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
