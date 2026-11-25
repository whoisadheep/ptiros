"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useStudentAuth } from "@/context/StudentAuthContext";
import { ArrowRight, ArrowLeft, Lock, Mail, GraduationCap, AlertCircle } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const { isLoggedIn, login, openAuthModal } = useStudentAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isLoggedIn) {
      router.replace("/dashboard");
    }
  }, [isLoggedIn, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setIsSubmitting(true);
    const res = await login({ email: email.trim(), password });
    setIsSubmitting(false);
    if (!res.success) {
      setErrorMsg(res.error || "Invalid email or password");
    } else {
      router.push("/dashboard");
    }
  };

  return (
    <div className="min-h-[100dvh] bg-gradient-to-br from-orange-50/60 via-white to-stone-50 flex flex-col items-center justify-center p-4 sm:p-6">
      <div className="max-w-md w-full bg-white rounded-3xl border border-stone-200 shadow-xl p-6 sm:p-8 space-y-6">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-100 text-orange-800 text-[11px] font-bold uppercase tracking-wider">
            <GraduationCap className="size-3.5" /> Student Portal
          </div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-stone-900">
            Student Portal Sign In
          </h1>
          <p className="text-xs sm:text-sm text-stone-500">
            Sign in with your student email to access your roadmap, career tests, simulations, and 1:1 mentor sessions.
          </p>
        </div>

        {errorMsg && (
          <div className="p-3 rounded-xl bg-red-50 border border-red-200 flex items-start gap-2.5 text-xs text-red-700">
            <AlertCircle className="size-4 shrink-0 mt-0.5 text-red-600" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="login-email" className="block text-xs font-bold text-stone-700 mb-1.5">
              Student Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-3 size-4 text-stone-400" />
              <input
                id="login-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="student@example.com"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-stone-200 text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary"
              />
            </div>
          </div>

          <div>
            <label htmlFor="login-password" className="block text-xs font-bold text-stone-700 mb-1.5">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-3 size-4 text-stone-400" />
              <input
                id="login-password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-stone-200 text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 rounded-xl bg-primary text-white font-bold text-sm hover:bg-primary-dark transition shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            <span>{isSubmitting ? "Signing In..." : "Sign In to My Portal"}</span>
            <ArrowRight className="size-4" />
          </button>
        </form>

        <div className="pt-2 border-t border-stone-100 space-y-3 text-center">
          <p className="text-xs text-stone-500">New to PTIROS?</p>
          <button
            type="button"
            onClick={() => openAuthModal("signup")}
            className="w-full py-2.5 rounded-xl bg-stone-50 border border-stone-200 text-stone-800 font-bold text-sm hover:bg-stone-100 transition cursor-pointer"
          >
            Create New Student Account
          </button>
          <Link
            href="/"
            className="flex items-center justify-center gap-1.5 text-xs font-semibold text-stone-500 hover:text-stone-900 pt-2 transition"
          >
            <ArrowLeft className="size-3.5" /> Return to Homepage
          </Link>
        </div>
      </div>
    </div>
  );
}
