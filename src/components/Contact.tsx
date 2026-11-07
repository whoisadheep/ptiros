"use client";

import { useState } from "react";
import { Send, CheckCircle2, Mail, Phone, MapPin } from "lucide-react";
import { FacebookIcon, InstagramIcon } from "@/components/Icons";
import ScrollReveal from "./ui/ScrollReveal";

export default function Contact() {
  const [formState, setFormState] = useState({
    fullName: "",
    email: "",
    mobile: "",
    standard: "10th",
    message: "",
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
    }, 800);
  };

  return (
    <section
      id="contact"
      className="relative overflow-hidden bg-bg py-24 sm:py-32"
      aria-label="Contact PTIROS"
    >
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
        <ScrollReveal direction="up" distance={30} duration={0.6}>
          <div className="grid grid-cols-1 overflow-hidden rounded-[2.5rem] border border-border/80 bg-white shadow-2xl lg:grid-cols-12">
            {/* Left Column: Bold Orange Panel matching design-03.png */}
            <div className="relative flex flex-col justify-between overflow-hidden bg-gradient-to-br from-primary via-[#FA6500] to-primary-dark p-8 sm:p-12 lg:col-span-5 text-white">
              {/* Ambient glows */}
              <div
                className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-white/10 blur-2xl"
                aria-hidden="true"
              />
              <div
                className="pointer-events-none absolute -bottom-16 -left-16 h-64 w-64 rounded-full bg-black/15 blur-2xl"
                aria-hidden="true"
              />

              <div className="relative z-10">
                <span className="inline-block rounded-full bg-white/20 px-3.5 py-1 text-xs font-bold uppercase tracking-widest text-white backdrop-blur-sm">
                  Get In Touch
                </span>

                {/* Exact Deck Heading */}
                <h2 className="mt-6 font-display text-3xl sm:text-5xl font-black leading-tight text-white">
                  Every challenge is unique.
                  <br />
                  <span className="text-white/90">Let’s talk about yours.</span>
                </h2>

                <p className="mt-4 text-base leading-relaxed text-white/90">
                  Book a personalized 1-on-1 discovery consultation for your child. Our mentors analyze your student's cognitive temperament and build their customized roadmap.
                </p>

                {/* Quick Contact Info */}
                <div className="mt-8 space-y-3 text-sm text-white/90">
                  <div className="flex items-center gap-3">
                    <Mail className="h-4 w-4 text-white" />
                    <span>admissions@ptiros.education</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="h-4 w-4 text-white" />
                    <span>+91 98765 43210</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <MapPin className="h-4 w-4 text-white" />
                    <span>Bengaluru / New Delhi / Mumbai, India</span>
                  </div>
                </div>
              </div>

              {/* Social Links matching design-03.png */}
              <div className="relative z-10 mt-10 border-t border-white/20 pt-6">
                <span className="text-xs font-semibold uppercase tracking-wider text-white/80">
                  Follow PTIROS:
                </span>
                <div className="mt-3 flex items-center gap-3">
                  <a
                    href="#"
                    className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/15 text-white transition-all hover:bg-white hover:text-primary"
                    aria-label="Facebook"
                  >
                    <FacebookIcon className="h-5 w-5" />
                  </a>
                  <a
                    href="#"
                    className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/15 text-white transition-all hover:bg-white hover:text-primary"
                    aria-label="Instagram"
                  >
                    <InstagramIcon className="h-5 w-5" />
                  </a>
                </div>
              </div>
            </div>

            {/* Right Column: Clean Form matching design-03.png */}
            <div className="flex flex-col justify-center p-8 sm:p-12 lg:col-span-7 bg-white">
              {isSubmitted ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                    <CheckCircle2 className="h-10 w-10" />
                  </div>
                  <h3 className="mt-4 font-display text-2xl font-bold text-accent">
                    Thank You!
                  </h3>
                  <p className="mt-2 max-w-sm text-sm text-text-muted">
                    Your details have been submitted. Our Senior Academic Counselor will reach out to you within 24 hours.
                  </p>
                  <button
                    onClick={() => setIsSubmitted(false)}
                    className="mt-6 rounded-full bg-primary/10 px-6 py-2.5 text-xs font-bold uppercase tracking-wider text-primary hover:bg-primary/20"
                  >
                    Submit Another Inquiry
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label
                      htmlFor="fullName"
                      className="block text-xs font-bold uppercase tracking-wider text-accent mb-1.5"
                    >
                      Full name
                    </label>
                    <input
                      id="fullName"
                      required
                      type="text"
                      value={formState.fullName}
                      onChange={(e) =>
                        setFormState({ ...formState, fullName: e.target.value })
                      }
                      placeholder="e.g. Adheep Sharma"
                      className="w-full rounded-xl border border-border/80 bg-bg/50 px-4 py-3 text-sm text-accent placeholder:text-text-muted/60 focus:border-primary focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label
                        htmlFor="email"
                        className="block text-xs font-bold uppercase tracking-wider text-accent mb-1.5"
                      >
                        Email address
                      </label>
                      <input
                        id="email"
                        required
                        type="email"
                        value={formState.email}
                        onChange={(e) =>
                          setFormState({ ...formState, email: e.target.value })
                        }
                        placeholder="name@email.com"
                        className="w-full rounded-xl border border-border/80 bg-bg/50 px-4 py-3 text-sm text-accent placeholder:text-text-muted/60 focus:border-primary focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="mobile"
                        className="block text-xs font-bold uppercase tracking-wider text-accent mb-1.5"
                      >
                        Mobile number
                      </label>
                      <input
                        id="mobile"
                        required
                        type="tel"
                        value={formState.mobile}
                        onChange={(e) =>
                          setFormState({ ...formState, mobile: e.target.value })
                        }
                        placeholder="+91 98765 43210"
                        className="w-full rounded-xl border border-border/80 bg-bg/50 px-4 py-3 text-sm text-accent placeholder:text-text-muted/60 focus:border-primary focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="standard"
                      className="block text-xs font-bold uppercase tracking-wider text-accent mb-1.5"
                    >
                      Current Standard / Grade
                    </label>
                    <select
                      id="standard"
                      value={formState.standard}
                      onChange={(e) =>
                        setFormState({ ...formState, standard: e.target.value })
                      }
                      className="w-full rounded-xl border border-border/80 bg-bg/50 px-4 py-3 text-sm text-accent focus:border-primary focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                    >
                      <option value="6th">6th Standard (Middle School)</option>
                      <option value="7th">7th Standard (Middle School)</option>
                      <option value="8th">8th Standard (Middle School)</option>
                      <option value="9th">9th Standard (Secondary)</option>
                      <option value="10th">10th Standard (Secondary Board)</option>
                      <option value="11th">11th Standard (Senior Secondary)</option>
                      <option value="12th">12th Standard (Senior Secondary)</option>
                    </select>
                  </div>

                  <div>
                    <label
                      htmlFor="message"
                      className="block text-xs font-bold uppercase tracking-wider text-accent mb-1.5"
                    >
                      Message
                    </label>
                    <textarea
                      id="message"
                      rows={3}
                      value={formState.message}
                      onChange={(e) =>
                        setFormState({ ...formState, message: e.target.value })
                      }
                      placeholder="Tell us about the student's career aspirations or doubts..."
                      className="w-full rounded-xl border border-border/80 bg-bg/50 px-4 py-3 text-sm text-accent placeholder:text-text-muted/60 focus:border-primary focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-primary px-8 py-3.5 text-base font-bold uppercase tracking-wider text-white shadow-lg shadow-primary/25 transition-all duration-200 hover:bg-primary-dark active:scale-[0.99] disabled:opacity-70"
                  >
                    <span>{isSubmitting ? "Submitting..." : "Submit"}</span>
                    <Send className="h-4 w-4" />
                  </button>
                </form>
              )}
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
