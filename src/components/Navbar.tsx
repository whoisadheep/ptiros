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
  Users,
  FileText,
  LogOut,
} from "lucide-react";
import Link from "next/link";
import { Blobatar } from "@blobatar/react";
import { useScrollLock } from "@/hooks/useScrollLock";

// Streamlined desktop links — removes duplicates (Home is logo, Career Test & Portal are in actions)
const desktopNavLinks = [
  { label: "Simulator", href: "/simulator", highlight: true },
  { label: "Roadmaps", href: "/#roadmaps" },
  { label: "Why PTIROS", href: "/#why-ptiros" },
  { label: "About", href: "/#about" },
  { label: "Contact", href: "/#contact" },
] as const;

// Curated mobile drawer links
const mobileNavLinks = [
  { label: "Career Simulator", href: "/simulator", icon: Gamepad2, tag: "Interactive" },
  { label: "360° Career Test", href: "/career-test", icon: Brain, tag: "Assessment" },
  { label: "Academic Roadmaps", href: "/#roadmaps", icon: Map, tag: "Class 6–12" },
  { label: "The Science & Why Us", href: "/#why-ptiros", icon: Sparkles },
  { label: "About PTIROS & NEP 2020", href: "/#about", icon: Info },
  { label: "Contact & Consultations", href: "/#contact", icon: Phone },
] as const;

const easeOutExpo = [0.16, 1, 0.3, 1] as const;

export default function Navbar() {
  const { openBookingModal, openDossierModal } = useUserProfile();
  const { user: studentUser, openAuthModal: openStudentAuthModal, logout: studentLogout } = useStudentAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 15);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Universal scroll lock & Lenis pause for mobile drawer
  useScrollLock(isOpen);

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
      {/* Top Global Navigation Bar */}
      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
          scrolled
            ? "bg-white/95 backdrop-blur-xl border-b border-stone-200/80 shadow-2xs py-3"
            : "bg-white/70 backdrop-blur-md border-b border-stone-200/40 py-4"
        }`}
      >
        <nav
          className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8"
          aria-label="Primary navigation"
        >
          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-2 group shrink-0">
            <span className="font-display text-2xl font-black tracking-tight text-gradient">
              PTIROS
            </span>
            <span className="hidden sm:inline-block text-[9px] font-bold uppercase tracking-widest px-1.5 py-0.5 rounded bg-orange-100 text-orange-800">
              NEP 2020
            </span>
          </Link>

          {/* Clean, Decluttered Desktop Navigation Links */}
          <ul className="hidden items-center gap-6 xl:gap-8 lg:flex" role="list">
            {desktopNavLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  onClick={(e) => handleNavClick(e, link.href)}
                  className="relative cursor-pointer text-xs font-bold uppercase tracking-wider text-stone-600 hover:text-stone-950 transition-colors flex items-center gap-1.5 py-1"
                >
                  <span>{link.label}</span>
                  {"highlight" in link && link.highlight && (
                    <span className="size-1.5 rounded-full bg-orange-500 animate-pulse shrink-0" />
                  )}
                </Link>
              </li>
            ))}
          </ul>

          {/* Desktop Right Action Cluster (Clear Hierarchy) */}
          <div className="hidden lg:flex items-center gap-3">
            {/* Student Auth State */}
            {studentUser ? (
              <div className="flex items-center gap-1.5 bg-stone-50 border border-stone-200/80 rounded-full pl-1.5 pr-2 py-1 shadow-2xs">
                <Link
                  href="/dashboard"
                  className="flex items-center gap-2 text-xs font-bold text-stone-800 hover:text-primary transition"
                  title="Open Student Dashboard"
                >
                  <span className="size-6 rounded-full overflow-hidden border border-orange-300 bg-white flex items-center justify-center shrink-0">
                    <Blobatar name={studentUser.name} size={24} className="size-full object-cover" />
                  </span>
                  <span className="max-w-[80px] truncate">{studentUser.name.split(" ")[0]}</span>
                  <span className="text-[10px] text-orange-700 bg-orange-100 px-1.5 py-0.2 rounded-full">
                    {studentUser.grade}
                  </span>
                </Link>
                <button
                  type="button"
                  onClick={() => studentLogout("/")}
                  className="p-1 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-200/60 transition cursor-pointer"
                  title="Sign out of student account"
                >
                  <LogOut className="size-3.5" />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => openStudentAuthModal("login")}
                className="text-xs font-bold text-stone-700 hover:text-primary transition px-3.5 py-1.5 rounded-full hover:bg-stone-100/80 cursor-pointer"
              >
                Student Login
              </button>
            )}

            {/* Primary Action Button */}
            <Link
              href="/career-test"
              className="cursor-pointer rounded-full bg-primary px-4 sm:px-5 py-2 text-xs font-bold text-white shadow-md shadow-primary/20 transition-all hover:bg-primary-dark hover:shadow-lg hover:shadow-primary/25 active:scale-95 flex items-center gap-1.5"
            >
              <span>Give Career Test</span>
              <ArrowRight className="size-3.5" />
            </Link>
          </div>

          {/* Mobile Menu Toggle Button */}
          <button
            className="relative flex h-10 w-10 cursor-pointer items-center justify-center rounded-xl bg-white border border-stone-200 shadow-2xs text-stone-800 lg:hidden transition-transform active:scale-90"
            onClick={() => setIsOpen(!isOpen)}
            aria-label={isOpen ? "Close menu" : "Open menu"}
            aria-expanded={isOpen}
          >
            {isOpen ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </nav>
      </header>

      {/* Mobile Navigation Sidebar Drawer */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-[999] lg:hidden">
            {/* Backdrop Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm"
              aria-hidden="true"
            />

            {/* Slide-in Sidebar Drawer */}
            <motion.aside
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ duration: 0.3, ease: easeOutExpo }}
              data-lenis-prevent
              className="fixed top-0 right-0 bottom-0 flex h-[100dvh] w-[86vw] max-w-sm flex-col justify-between bg-white shadow-2xl overflow-hidden overscroll-contain"
              aria-label="Mobile navigation sidebar"
            >
              {/* Sidebar Header */}
              <div className="flex items-center justify-between border-b border-stone-100 px-5 py-4 bg-stone-50/70">
                <div className="flex items-center gap-2">
                  <span className="font-display text-xl font-black text-gradient">
                    PTIROS
                  </span>
                  <span className="rounded-md bg-primary/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-primary">
                    Menu
                  </span>
                </div>

                <button
                  onClick={() => setIsOpen(false)}
                  className="flex size-8 cursor-pointer items-center justify-center rounded-lg bg-white border border-stone-200 text-stone-600 transition-colors hover:bg-stone-100 hover:text-stone-900 active:scale-95"
                  aria-label="Close sidebar"
                >
                  <X className="size-4" />
                </button>
              </div>

              {/* Scrollable Navigation Body */}
              <div data-lenis-prevent className="flex-1 overflow-y-auto px-4 py-4 space-y-4 overscroll-contain">
                {/* Student Profile Card */}
                {studentUser ? (
                  <div className="rounded-2xl border border-orange-200 bg-gradient-to-br from-orange-50 to-amber-50/60 p-3.5 shadow-xs">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <span className="size-8 rounded-full overflow-hidden border border-orange-300 bg-white flex items-center justify-center shrink-0 shadow-2xs">
                          <Blobatar name={studentUser.name} size={32} className="size-full object-cover" />
                        </span>
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-stone-900 truncate">
                            {studentUser.name}
                          </p>
                          <p className="text-[10px] text-stone-500">
                            {studentUser.grade} • {studentUser.city}
                          </p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={async () => {
                          setIsOpen(false);
                          await studentLogout("/");
                        }}
                        className="text-stone-400 hover:text-stone-700 p-1 rounded-md transition"
                        title="Sign out"
                      >
                        <LogOut className="size-4" />
                      </button>
                    </div>

                    <Link
                      href="/dashboard"
                      onClick={() => setIsOpen(false)}
                      className="mt-3 flex items-center justify-center gap-1.5 w-full py-2 rounded-xl bg-primary text-white font-bold text-xs shadow-xs hover:bg-primary-dark transition"
                    >
                      <LayoutDashboard className="size-3.5" />
                      <span>Open Student Dashboard</span>
                    </Link>
                  </div>
                ) : (
                  <div className="rounded-2xl border border-stone-200 bg-stone-50 p-3.5 space-y-2">
                    <div className="flex items-center justify-between text-xs font-bold text-stone-800">
                      <span className="flex items-center gap-1.5">
                        <GraduationCap className="size-4 text-primary" />
                        Student Portal
                      </span>
                      <span className="text-[10px] text-orange-700 font-semibold bg-orange-100 px-2 py-0.5 rounded-full">
                        Demo Ready
                      </span>
                    </div>
                    <p className="text-[11px] text-stone-500">
                      Sign in or test with instant demo profiles (Aarav, Meera, Vihaan).
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        setIsOpen(false);
                        openStudentAuthModal("login");
                      }}
                      className="w-full py-2 rounded-xl bg-white border border-stone-200 hover:border-orange-300 text-stone-900 font-bold text-xs transition cursor-pointer shadow-2xs"
                    >
                      Student Login / Demo Accounts →
                    </button>
                  </div>
                )}

                {/* Primary Route Links */}
                <div className="space-y-1">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-stone-400 px-2 pb-1">
                    Explore Platform
                  </p>
                  {mobileNavLinks.map((link) => {
                    const Icon = link.icon;
                    return (
                      <Link
                        key={link.href}
                        href={link.href}
                        onClick={(e) => handleNavClick(e, link.href)}
                        className="flex items-center justify-between rounded-xl px-3 py-2.5 text-stone-700 hover:bg-orange-50/70 hover:text-stone-950 transition-colors group"
                      >
                        <div className="flex items-center gap-3">
                          <Icon className="size-4 text-primary" />
                          <span className="text-xs font-semibold">{link.label}</span>
                        </div>
                        {"tag" in link && link.tag ? (
                          <span className="text-[10px] font-bold text-orange-700 bg-orange-100/80 px-2 py-0.5 rounded-full">
                            {link.tag}
                          </span>
                        ) : (
                          <ChevronRight className="size-3.5 text-stone-400 group-hover:translate-x-0.5 transition-transform" />
                        )}
                      </Link>
                    );
                  })}
                </div>

                {/* 1:1 Booking & Dossier Triggers */}
                <div className="space-y-1 pt-2 border-t border-stone-100">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-stone-400 px-2 pb-1">
                    Direct Triggers
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setIsOpen(false);
                      openBookingModal();
                    }}
                    className="w-full flex items-center justify-between rounded-xl px-3 py-2 text-stone-700 hover:bg-orange-50/70 transition-colors text-left cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <Users className="size-4 text-primary" />
                      <span className="text-xs font-semibold">Book 1:1 Gurukul Mentor Call</span>
                    </div>
                    <ArrowRight className="size-3.5 text-stone-400" />
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setIsOpen(false);
                      openDossierModal();
                    }}
                    className="w-full flex items-center justify-between rounded-xl px-3 py-2 text-stone-700 hover:bg-orange-50/70 transition-colors text-left cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <FileText className="size-4 text-primary" />
                      <span className="text-xs font-semibold">Preview 10-Page Career Dossier</span>
                    </div>
                    <ArrowRight className="size-3.5 text-stone-400" />
                  </button>
                </div>
              </div>

              {/* Sidebar Footer with CTA */}
              <div className="border-t border-stone-100 p-4 pb-[calc(1rem+env(safe-area-inset-bottom))] bg-stone-50/60">
                <Link
                  href="/career-test"
                  onClick={() => setIsOpen(false)}
                  className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-primary py-3 px-5 font-bold text-xs uppercase tracking-wider text-white shadow-md shadow-primary/25 transition-all hover:bg-primary-dark active:scale-98"
                >
                  <Sparkles className="size-3.5" />
                  <span>Give 360° Career Test</span>
                </Link>
              </div>
            </motion.aside>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
