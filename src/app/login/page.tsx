"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useStudentAuth } from "@/context/StudentAuthContext";
import { Zap, ArrowRight, ArrowLeft, Bot, Scale, Stethoscope } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const { isLoggedIn, openAuthModal, loginAsDemo } = useStudentAuth();

  useEffect(() => {
    if (isLoggedIn) {
      router.push("/dashboard");
    }
  }, [isLoggedIn, router]);

  const handleDemo = async (demoKey: "aarav" | "meera" | "vihaan") => {
    const res = await loginAsDemo(demoKey);
    if (res.success) {
      router.push("/dashboard");
    }
  };

  return (
    <div className="min-h-screen bg-bg-muted flex flex-col justify-center items-center p-4">
      <div className="w-full max-w-md bg-white rounded-3xl p-8 border border-border shadow-xl space-y-6">
        <div className="text-center">
          <Link href="/" className="inline-block mb-3">
            <span className="font-display font-extrabold text-3xl text-gradient">PTIROS</span>
          </Link>
          <h1 className="text-2xl font-display font-bold text-accent">Student Portal Login</h1>
          <p className="text-xs text-text-muted mt-1">
            Access your personalized roadmap, Hansei diary, and mentorship trajectory.
          </p>
        </div>

        {/* 1-Click Demo Accounts */}
        <div className="p-4 rounded-2xl bg-orange-50/80 border border-orange-200 space-y-3">
          <div className="flex items-center gap-1.5 text-xs font-bold text-orange-950">
            <Zap className="size-4 text-primary fill-primary" />
            <span>Instant Demo Login (No Password Needed)</span>
          </div>
          <div className="space-y-2">
            <button
              onClick={() => handleDemo("aarav")}
              className="w-full p-3 rounded-xl bg-white hover:bg-orange-100/70 border border-orange-200 text-left transition flex items-center justify-between group cursor-pointer"
            >
              <div>
                <div className="text-xs font-bold text-accent group-hover:text-primary flex items-center gap-1.5">
                  <Bot className="size-3.5 text-primary" />
                  <span>Aarav Sharma</span>
                </div>
                <div className="text-[11px] text-text-muted">Class 10 • AI & Autonomous Robotics</div>
              </div>
              <ArrowRight className="size-4 text-primary group-hover:translate-x-1 transition-transform" />
            </button>

            <button
              onClick={() => handleDemo("meera")}
              className="w-full p-3 rounded-xl bg-white hover:bg-blue-50 border border-blue-200 text-left transition flex items-center justify-between group cursor-pointer"
            >
              <div>
                <div className="text-xs font-bold text-accent group-hover:text-blue-700 flex items-center gap-1.5">
                  <Scale className="size-3.5 text-blue-600" />
                  <span>Meera Nair</span>
                </div>
                <div className="text-[11px] text-text-muted">Class 11 • Corporate Law & Policy</div>
              </div>
              <ArrowRight className="size-4 text-blue-600 group-hover:translate-x-1 transition-transform" />
            </button>

            <button
              onClick={() => handleDemo("vihaan")}
              className="w-full p-3 rounded-xl bg-white hover:bg-emerald-50 border border-emerald-200 text-left transition flex items-center justify-between group cursor-pointer"
            >
              <div>
                <div className="text-xs font-bold text-accent group-hover:text-emerald-700 flex items-center gap-1.5">
                  <Stethoscope className="size-3.5 text-emerald-600" />
                  <span>Vihaan Patel</span>
                </div>
                <div className="text-[11px] text-text-muted">Class 12 • Medicine & BioTech</div>
              </div>
              <ArrowRight className="size-4 text-emerald-600 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>

        <div className="space-y-3">
          <button
            onClick={() => openAuthModal("login")}
            className="w-full py-3 rounded-xl bg-primary text-white font-bold text-xs shadow-md shadow-primary/20 hover:bg-primary-dark transition cursor-pointer"
          >
            Enter Email & Password
          </button>
          <button
            onClick={() => openAuthModal("signup")}
            className="w-full py-3 rounded-xl bg-bg-muted hover:bg-white border border-border text-accent font-bold text-xs transition cursor-pointer"
          >
            Create New Student Account
          </button>
        </div>

        <div className="text-center pt-2">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs text-text-muted hover:text-primary transition"
          >
            <ArrowLeft className="size-3.5" /> Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
