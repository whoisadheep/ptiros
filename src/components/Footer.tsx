"use client";

import { motion, useReducedMotion } from "framer-motion";
import { FacebookIcon, InstagramIcon, TwitterIcon, LinkedInIcon } from "@/components/Icons";
import Link from "next/link";

const easeOutExpo = [0.16, 1, 0.3, 1] as const;

const quickLinks = [
  { label: "Home", href: "/" },
  { label: "About Us & Story", href: "/about" },
  { label: "Academic Roadmaps", href: "/roadmaps" },
  { label: "Career Match Quest", href: "/career-test" },
  { label: "Virtual Simulator", href: "/simulator" },
  { label: "Track Meeting Progress", href: "/track-booking" },
];

const resources = [
  { label: "Why PTIROS & The Science", href: "/why-ptiros" },
  { label: "Contact & Consultations", href: "/contact" },
  { label: "Student Portal & Cockpit", href: "/dashboard" },
  { label: "Verified Credentials", href: "/dashboard?tab=credentials" },
  { label: "Admin CRM", href: "/admin" },
];

const contactInfo = [
  { label: "admissions@ptiros.education", href: "mailto:admissions@ptiros.education" },
  { label: "+91 98765 43210", href: "tel:+919876543210" },
  { label: "Bengaluru / New Delhi / Mumbai, India", href: "/contact" },
];

const socialLinks = [
  { icon: LinkedInIcon, label: "LinkedIn", href: "https://linkedin.com" },
  { icon: InstagramIcon, label: "Instagram", href: "https://instagram.com" },
  { icon: TwitterIcon, label: "Twitter", href: "https://twitter.com" },
  { icon: FacebookIcon, label: "Facebook", href: "https://facebook.com" },
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

      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-12 sm:py-16 lg:px-8 lg:py-20">
        <motion.div
          className="grid grid-cols-1 gap-8 sm:grid-cols-2 sm:gap-10 lg:grid-cols-4 lg:gap-12"
          variants={prefersReducedMotion ? {} : containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
        >
          {/* Column 1 — Brand */}
          <motion.div variants={prefersReducedMotion ? {} : itemVariants}>
            <Link
              href="/"
              className="mb-3 inline-flex min-h-[36px] items-center cursor-pointer font-display text-2xl font-bold text-white transition-opacity duration-200 hover:opacity-80"
            >
              <span className="text-primary">P</span>TIROS
            </Link>
            <p className="text-sm leading-relaxed text-white/60">
              Experiential career guidance & mentorship for Classes 6–12.
            </p>
          </motion.div>

          {/* Column 2 — Quick Links */}
          <motion.div variants={prefersReducedMotion ? {} : itemVariants}>
            <h3 className="mb-4 font-display text-sm font-bold uppercase tracking-widest text-white/80">
              Quick Links
            </h3>
            <nav aria-label="Quick links">
              <ul className="space-y-1.5">
                {quickLinks.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="inline-block py-1 cursor-pointer text-sm text-white/60 transition-colors duration-200 hover:text-primary"
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
            <h3 className="mb-4 font-display text-sm font-bold uppercase tracking-widest text-white/80">
              Resources
            </h3>
            <nav aria-label="Resources">
              <ul className="space-y-1.5">
                {resources.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="inline-block py-1 cursor-pointer text-sm text-white/60 transition-colors duration-200 hover:text-primary"
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
            <h3 className="mb-4 font-display text-sm font-bold uppercase tracking-widest text-white/80">
              Contact
            </h3>
            <ul className="space-y-1.5">
              {contactInfo.map((item) => (
                <li key={item.label}>
                  <a
                    href={item.href}
                    className="inline-block py-1 cursor-pointer text-sm text-white/60 transition-colors duration-200 hover:text-primary break-words"
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
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 sm:px-6 pt-6 pb-20 sm:pb-6 sm:flex-row lg:px-8">
          <p className="text-xs text-white/40">
            &copy; 2026 PTIROS. All rights reserved.
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
                  className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full text-white/40 transition-colors duration-200 hover:bg-white/10 hover:text-primary"
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
