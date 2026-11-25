"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronDown,
  LayoutDashboard,
  Compass,
  Target,
  BookOpen,
  Gamepad2,
  Users,
  Clock,
  LogOut,
  GraduationCap,
  ArrowRight,
  ExternalLink,
  Trophy,
  Bookmark,
} from "lucide-react";
import { Blobatar } from "@blobatar/react";
import { useStudentAuth } from "@/context/StudentAuthContext";

const easeOutExpo = [0.16, 1, 0.3, 1] as const;

export default function NavProfileMenu() {
  const router = useRouter();
  const {
    user: studentUser,
    isLoggedIn,
    logout: studentLogout,
  } = useStudentAuth();

  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  const handleSignOut = async () => {
    setIsOpen(false);
    await studentLogout("/");
  };

  // If NOT logged in: Show professional "Student Portal" trigger with quick flyout
  if (!studentUser) {
    return (
      <div className="relative" ref={menuRef}>
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          aria-expanded={isOpen}
          aria-haspopup="menu"
          className="group flex items-center gap-2 rounded-full border border-stone-200/90 bg-white pl-2.5 pr-3 py-1.5 text-xs font-bold text-stone-700 shadow-2xs hover:border-orange-300 hover:bg-stone-50 hover:text-stone-900 transition-all cursor-pointer active:scale-95"
        >
          <span className="flex size-6 items-center justify-center rounded-full bg-orange-100/80 text-primary group-hover:bg-primary group-hover:text-white transition-colors">
            <GraduationCap className="size-3.5" />
          </span>
          <span>Student Portal</span>
          <ChevronDown
            className={`size-3 text-stone-400 transition-transform duration-200 ${
              isOpen ? "rotate-180 text-primary" : "group-hover:text-stone-600"
            }`}
          />
        </button>

        {/* Logged-Out Flyout */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: 8, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 6, scale: 0.96 }}
              transition={{ duration: 0.2, ease: easeOutExpo }}
              className="absolute right-0 top-full mt-2 w-80 max-w-[calc(100vw-2rem)] max-h-[calc(100dvh-5.5rem)] overflow-y-auto overscroll-contain rounded-2xl border border-stone-200 bg-white p-4 shadow-xl z-50 text-stone-900"
            >
              <div className="flex items-center justify-between pb-3 border-b border-stone-100">
                <div className="flex items-center gap-2">
                  <span className="flex size-7 items-center justify-center rounded-xl bg-orange-100 text-primary">
                    <GraduationCap className="size-4" />
                  </span>
                  <div>
                    <h4 className="text-xs font-bold text-stone-900">
                      PTIROS Student Portal
                    </h4>
                    <p className="text-[10px] text-stone-400">
                      Cockpit, Planner & Simulations
                    </p>
                  </div>
                </div>
                <span className="text-[9px] font-bold uppercase tracking-wider text-orange-700 bg-orange-100/70 px-2 py-0.5 rounded-full">
                  Secure Access
                </span>
              </div>

              {/* Sign In / Create Account Actions */}
              <div className="py-3 space-y-2">
                <Link
                  href="/login"
                  onClick={() => setIsOpen(false)}
                  className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-primary text-white font-bold text-xs shadow-sm hover:bg-primary-dark transition active:scale-95"
                >
                  <span>Sign in to portal</span>
                  <ArrowRight className="size-3.5" />
                </Link>
                <Link
                  href="/signup"
                  onClick={() => setIsOpen(false)}
                  className="w-full flex items-center justify-center gap-2 py-2 rounded-xl border border-stone-200 bg-stone-50 text-stone-800 font-semibold text-xs hover:bg-stone-100 transition"
                >
                  <span>Create student account</span>
                </Link>
              </div>

              {/* Meetings Link */}
              <div className="mt-3 pt-2 border-t border-stone-100 flex items-center justify-between text-[11px] text-stone-500">
                <span>Already booked a session?</span>
                <Link
                  href="/track-booking"
                  onClick={() => setIsOpen(false)}
                  className="font-bold text-primary hover:underline inline-flex items-center gap-1"
                >
                  <span>My Meetings</span>
                  <ExternalLink className="size-2.5" />
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  // If LOGGED IN: Professional user avatar pill + flyout menu
  const firstName = studentUser.name.split(" ")[0];

  return (
    <div className="relative" ref={menuRef}>
      {/* Refined Profile Trigger Pill */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-haspopup="menu"
        className="group flex items-center gap-2 rounded-full border border-stone-200/90 bg-white pl-1.5 pr-2.5 py-1 shadow-2xs hover:border-orange-300 hover:bg-stone-50 transition-all cursor-pointer active:scale-95"
      >
        {/* Avatar Ring */}
        <span className="relative size-7 rounded-full overflow-hidden border border-orange-300/80 bg-white flex items-center justify-center shrink-0 shadow-2xs">
          <Blobatar name={studentUser.name} size={28} className="size-full object-cover" />
          <span className="absolute bottom-0 right-0 size-2 rounded-full bg-emerald-500 ring-1 ring-white" />
        </span>

        {/* User Identity */}
        <div className="flex items-center gap-1.5">
          <span className="text-xs font-bold text-stone-800 group-hover:text-primary transition-colors max-w-[90px] truncate">
            {firstName}
          </span>
          <span className="text-[10px] font-semibold text-orange-800 bg-orange-100/70 px-1.5 py-0.5 rounded-full border border-orange-200/50">
            {studentUser.grade}
          </span>
        </div>

        {/* Animated Chevron */}
        <ChevronDown
          className={`size-3.5 text-stone-400 transition-transform duration-200 ${
            isOpen ? "rotate-180 text-primary" : "group-hover:text-stone-600"
          }`}
        />
      </button>

      {/* Flyout Dropdown Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.96 }}
            transition={{ duration: 0.2, ease: easeOutExpo }}
            className="absolute right-0 top-full mt-2 w-80 max-w-[calc(100vw-2rem)] max-h-[calc(100dvh-5.5rem)] overflow-y-auto overscroll-contain rounded-2xl border border-stone-200 bg-white shadow-xl z-50 text-stone-900"
          >
            {/* User Profile Header */}
            <div className="p-4 bg-gradient-to-br from-stone-50 via-white to-orange-50/40 border-b border-stone-100">
              <div className="flex items-start gap-3">
                <div className="relative size-11 rounded-2xl overflow-hidden border border-orange-300/80 bg-white shadow-xs shrink-0">
                  <Blobatar name={studentUser.name} size={44} className="size-full object-cover" />
                  <span className="absolute bottom-0.5 right-0.5 size-2.5 rounded-full bg-emerald-500 ring-2 ring-white" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-1">
                    <h4 className="text-sm font-bold text-stone-900 truncate">
                      {studentUser.name}
                    </h4>
                    <span className="text-[9px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded-md shrink-0">
                      Active
                    </span>
                  </div>
                  <p className="text-[11px] text-stone-500 truncate">
                    {studentUser.grade} • {studentUser.schoolName || studentUser.city}
                  </p>
                  <p className="text-[10px] font-mono text-stone-400 truncate mt-0.5">
                    {studentUser.email}
                  </p>
                </div>
              </div>

              {/* Quick Launch Cockpit Button */}
              <Link
                href="/dashboard"
                onClick={() => setIsOpen(false)}
                className="mt-3 flex items-center justify-center gap-1.5 w-full py-2 rounded-xl bg-primary text-white font-bold text-xs shadow-xs hover:bg-primary-dark transition active:scale-95"
              >
                <LayoutDashboard className="size-3.5" />
                <span>Open Student Cockpit</span>
              </Link>
            </div>

            {/* Quick Portal Navigation Links */}
            <div className="p-2 space-y-0.5">
              <Link
                href="/dashboard?tab=details"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-3 px-3 py-2 rounded-xl text-stone-700 hover:bg-stone-50 hover:text-stone-950 transition text-xs font-semibold group"
              >
                <GraduationCap className="size-4 text-orange-600 group-hover:scale-110 transition-transform" />
                <span>My Student Details</span>
              </Link>

              <Link
                href="/dashboard?tab=cockpit"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-3 px-3 py-2 rounded-xl text-stone-700 hover:bg-stone-50 hover:text-stone-950 transition text-xs font-semibold group"
              >
                <Compass className="size-4 text-orange-600 group-hover:scale-110 transition-transform" />
                <span>My Career Roadmap</span>
              </Link>

              <Link
                href="/dashboard?tab=planner"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-3 px-3 py-2 rounded-xl text-stone-700 hover:bg-stone-50 hover:text-stone-950 transition text-xs font-semibold group"
              >
                <Target className="size-4 text-orange-600 group-hover:scale-110 transition-transform" />
                <span>Weekly Goals & Milestones</span>
              </Link>

              <Link
                href="/dashboard?tab=activities"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-3 px-3 py-2 rounded-xl text-stone-700 hover:bg-stone-50 hover:text-stone-950 transition text-xs font-semibold group"
              >
                <Trophy className="size-4 text-orange-600 group-hover:scale-110 transition-transform" />
                <span>Activity Locker & Portfolio</span>
              </Link>

              <Link
                href="/dashboard?tab=saved"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-3 px-3 py-2 rounded-xl text-stone-700 hover:bg-stone-50 hover:text-stone-950 transition text-xs font-semibold group"
              >
                <Bookmark className="size-4 text-orange-600 group-hover:scale-110 transition-transform" />
                <span>Saved Career Pathways</span>
              </Link>

              <Link
                href="/dashboard?tab=diary"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-3 px-3 py-2 rounded-xl text-stone-700 hover:bg-stone-50 hover:text-stone-950 transition text-xs font-semibold group"
              >
                <BookOpen className="size-4 text-orange-600 group-hover:scale-110 transition-transform" />
                <span>Daily Reflection Journal</span>
              </Link>

              <Link
                href="/dashboard?tab=analysis"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-3 px-3 py-2 rounded-xl text-stone-700 hover:bg-stone-50 hover:text-stone-950 transition text-xs font-semibold group"
              >
                <Gamepad2 className="size-4 text-orange-600 group-hover:scale-110 transition-transform" />
                <span>Career Simulator Practice</span>
              </Link>

              <Link
                href="/dashboard?tab=mentorship"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-3 px-3 py-2 rounded-xl text-stone-700 hover:bg-stone-50 hover:text-stone-950 transition text-xs font-semibold group"
              >
                <Users className="size-4 text-orange-600 group-hover:scale-110 transition-transform" />
                <span>1:1 Mentor Sessions</span>
              </Link>
            </div>

            {/* Sign Out Footer */}
            <div className="p-2 border-t border-stone-100 bg-white">
              <button
                type="button"
                onClick={handleSignOut}
                className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-stone-500 hover:text-red-600 hover:bg-red-50 transition text-xs font-semibold cursor-pointer"
              >
                <span className="flex items-center gap-2">
                  <LogOut className="size-3.5" />
                  <span>Sign Out of Student Account</span>
                </span>
                <span className="text-[10px] text-stone-400">Safe exit</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
