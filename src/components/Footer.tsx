"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Music } from "lucide-react";
import { FacebookIcon, InstagramIcon, TwitterIcon } from "@/components/Icons";
import Link from "next/link";

const easeOutExpo = [0.16, 1, 0.3, 1] as const;

const quickLinks = [
  { label: "Home", href: "#home" },
  { label: "About", href: "#about" },
  { label: "Career Test", href: "#career-test" },
  { label: "Roadmaps", href: "#roadmaps" },
];

const resources = [
  { label: "Why PTIROS", href: "#why-ptiros" },
  { label: "Research", href: "#research" },
  { label: "Statistics", href: "#statistics" },
  { label: "Events", href: "#events" },
];

const contactInfo = [
  { label: "AGConsulting@reallygreatsite.com", href: "mailto:AGConsulting@reallygreatsite.com" },
  { label: "+91 98765 43210", href: "tel:+919876543210" },
  { label: "Chennai, Tamil Nadu, India", href: "#" },
];

const socialLinks = [
  { icon: FacebookIcon, label: "Facebook", href: "#" },
  { icon: InstagramIcon, label: "Instagram", href: "#" },
  { icon: TwitterIcon, label: "Twitter", href: "#" },
  { icon: Music, label: "TikTok", href: "#" },
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.15,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: easeOutExpo,
    },
  },
};

export default function Footer() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <footer
      className="relative bg-accent text-white"
      aria-label="Site footer"
    >
      {/* Orange gradient top border */}
      <div
        className="h-[3px] w-full bg-gradient-to-r from-primary via-primary-light to-secondary"
        aria-hidden="true"
      />

      <div className="mx-auto max-w-7xl px-5 py-16 lg:px-8 lg:py-20">
        <motion.div
          className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-4"
          variants={prefersReducedMotion ? {} : containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
        >
          {/* Column 1 — Brand */}
          <motion.div variants={prefersReducedMotion ? {} : itemVariants}>
            <Link
              href="#home"
              className="mb-4 inline-block cursor-pointer font-display text-2xl font-bold text-white transition-opacity duration-200 hover:opacity-80"
            >
              <span className="text-primary">P</span>TIROS
            </Link>
            <p className="text-sm leading-relaxed text-white/60">
              A platform to be the dream you dreamt of
            </p>
          </motion.div>

          {/* Column 2 — Quick Links */}
          <motion.div variants={prefersReducedMotion ? {} : itemVariants}>
            <h3 className="mb-5 font-display text-sm font-bold uppercase tracking-widest text-white/80">
              Quick Links
            </h3>
            <nav aria-label="Quick links">
              <ul className="space-y-3">
                {quickLinks.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="cursor-pointer text-sm text-white/60 transition-colors duration-200 hover:text-primary"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </motion.div>

          {/* Column 3 — Resources */}
          <motion.div variants={prefersReducedMotion ? {} : itemVariants}>
            <h3 className="mb-5 font-display text-sm font-bold uppercase tracking-widest text-white/80">
              Resources
            </h3>
            <nav aria-label="Resources">
              <ul className="space-y-3">
                {resources.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="cursor-pointer text-sm text-white/60 transition-colors duration-200 hover:text-primary"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </motion.div>

          {/* Column 4 — Contact */}
          <motion.div variants={prefersReducedMotion ? {} : itemVariants}>
            <h3 className="mb-5 font-display text-sm font-bold uppercase tracking-widest text-white/80">
              Contact
            </h3>
            <ul className="space-y-3">
              {contactInfo.map((item) => (
                <li key={item.label}>
                  <a
                    href={item.href}
                    className="cursor-pointer text-sm text-white/60 transition-colors duration-200 hover:text-primary"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>
        </motion.div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-5 py-6 sm:flex-row lg:px-8">
          <p className="text-xs text-white/40">
            &copy; 2024 PTIROS. All rights reserved.
          </p>

          {/* Social icons */}
          <div className="flex items-center gap-3">
            {socialLinks.map((social) => {
              const SocialIcon = social.icon;
              return (
                <a
                  key={social.label}
                  href={social.href}
                  aria-label={social.label}
                  className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full text-white/40 transition-all duration-200 hover:bg-white/10 hover:text-primary"
                >
                  <SocialIcon className="h-4 w-4" />
                </a>
              );
            })}
          </div>
        </div>
      </div>
    </footer>
  );
}
