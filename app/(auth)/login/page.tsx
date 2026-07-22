"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import Input from "@/components/ui/Input";
import { signIn } from "next-auth/react";
import { motion } from "framer-motion";
import Link from "next/link";
import { LogIn } from "lucide-react";

type LoginForm = {
  email: string;
  password: string;
};

export default function LoginPage() {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<LoginForm>();

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function onSubmit(data: LoginForm) {
    setError("");
    setSuccess("");

    const result = await signIn("credentials", {
      email: data.email,
      password: data.password,
      redirect: false,
    });

    if (!result) {
      setError("Something went wrong.");
      return;
    }

    if (result.error) {
      setError("Invalid email or password.");
      return;
    }

    setSuccess("Login successful. Opening dashboard...");

    setTimeout(() => {
      router.push("/dashboard");
    }, 1000);
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-[#FAFAFC] text-[#374151] p-4 md:p-8 editorial-dots paper-texture">
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full max-w-5xl bg-[#FFFFFF] rounded-[32px] border border-[#2B4DA2]/10 shadow-sm overflow-hidden grid grid-cols-1 md:grid-cols-2 min-h-[600px]"
      >
        {/* Left Side: Illustration & Pitch */}
        <div className="bg-[#D8C4FF] p-8 md:p-12 flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#A98AE5]/30 rounded-full blur-3xl" />
          <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-[#FFF6D6]/40 rounded-full blur-2xl" />
          
          <div className="relative z-10">
            <h2 className="text-4xl md:text-5xl font-black text-[#2B4DA2] leading-tight mt-6 tracking-tight font-heading">
              Welcome back to LOOP AI.
            </h2>
            <p className="text-sm text-[#2B4DA2] mt-4 leading-relaxed font-sans max-w-sm">
              Discover customer sentiment, analyze reviews, and build reports in seconds.
            </p>
          </div>

          <div className="relative my-6 md:my-0 flex justify-center items-center z-10 animate-float">
            <svg width="320" height="300" viewBox="0 0 320 300" fill="none" xmlns="http://www.w3.org/2000/svg" className="max-h-[300px] w-full">
              <defs>
                <pattern id="grid-pattern" width="24" height="24" patternUnits="userSpaceOnUse">
                  <path d="M 24 0 L 0 0 0 24" fill="none" stroke="rgba(43, 77, 162, 0.04)" strokeWidth="1"/>
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid-pattern)" rx="24"/>
              
              <circle cx="160" cy="150" r="45" fill="#4C74D9" fillOpacity="0.08" stroke="#4C74D9" strokeWidth="1.5" strokeDasharray="3 3"/>
              <circle cx="160" cy="150" r="30" fill="#4C74D9"/>
              <path d="M152 150h16M160 142v16" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round"/>
              
              <line x1="80" y1="90" x2="135" y2="132" stroke="#4C74D9" strokeWidth="1.5" opacity="0.4"/>
              <circle cx="80" cy="90" r="18" fill="#FFF6D6" stroke="#2B4DA2" strokeWidth="1.5"/>
              <path d="M76 87h8v5h-5l-3 3v-8z" fill="none" stroke="#2B4DA2" strokeWidth="1.5" strokeLinejoin="round"/>
              
              <line x1="240" y1="90" x2="185" y2="132" stroke="#4C74D9" strokeWidth="1.5" opacity="0.4"/>
              <circle cx="240" cy="90" r="18" fill="#F8B4D9" stroke="#2B4DA2" strokeWidth="1.5"/>
              <circle cx="236" cy="88" r="1" fill="#2B4DA2"/>
              <circle cx="244" cy="88" r="1" fill="#2B4DA2"/>
              <path d="M236 93c1.2 1.5 3.8 1.5 5 0" stroke="#2B4DA2" strokeWidth="1.5" strokeLinecap="round"/>
              
              <line x1="80" y1="210" x2="135" y2="168" stroke="#4C74D9" strokeWidth="1.5" opacity="0.4"/>
              <circle cx="80" cy="210" r="18" fill="#D8C4FF" stroke="#2B4DA2" strokeWidth="1.5"/>
              <path d="M74 214v-6M80 214v-10M86 214v-5" stroke="#2B4DA2" strokeWidth="1.5" strokeLinecap="round"/>
              
              <line x1="240" y1="210" x2="185" y2="168" stroke="#4C74D9" strokeWidth="1.5" opacity="0.4"/>
              <circle cx="240" cy="210" r="18" fill="#FFFFFF" stroke="#2B4DA2" strokeWidth="1.5"/>
              <path d="M235 204h10v12h-10z" fill="none" stroke="#2B4DA2" strokeWidth="1.5"/>
              <path d="M238 208h4M238 212h4" stroke="#2B4DA2" strokeWidth="1.5"/>
            </svg>
          </div>

          <div className="relative z-10 text-xs text-[#2B4DA2] font-bold font-sans">
            LOOP AI Feedback Intelligence Platform • © 2026
          </div>
        </div>

        {/* Right Side: Form */}
        <div className="p-8 md:p-12 flex flex-col justify-center bg-[#FFFFFF]">
          <div className="w-full max-w-sm mx-auto">
            <h1 className="text-3xl font-black text-[#374151] tracking-tight font-heading">
              Sign In
            </h1>
            <p className="text-sm text-[#374151]/80 mt-2 font-sans">
              Enter your credentials to access your presentation workspace.
            </p>

            <form
              onSubmit={handleSubmit(onSubmit)}
              className="mt-8 flex flex-col gap-5"
            >
              <div className="flex flex-col gap-1">
                <label className="text-xs font-extrabold uppercase tracking-wider text-[#374151]/60">Email Address</label>
                <input
                  type="email"
                  required
                  placeholder="name@company.com"
                  {...register("email")}
                  className="w-full rounded-2xl border border-[#374151]/25 bg-[#FAFAFC] px-4 py-3.5 outline-none focus:border-[#4C74D9] focus:ring-4 focus:ring-[#4C74D9]/15 text-sm transition-all duration-200"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs font-extrabold uppercase tracking-wider text-[#374151]/60">Password</label>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  {...register("password")}
                  className="w-full rounded-2xl border border-[#374151]/25 bg-[#FAFAFC] px-4 py-3.5 outline-none focus:border-[#4C74D9] focus:ring-4 focus:ring-[#4C74D9]/15 text-sm transition-all duration-200"
                />
              </div>

              {error && (
                <div className="rounded-2xl border border-rose-200 bg-rose-50/50 p-4 text-xs font-medium text-rose-700">
                  ⚠️ {error}
                </div>
              )}

              {success && (
                <div className="rounded-2xl border border-emerald-200 bg-emerald-50/50 p-4 text-xs font-medium text-emerald-700">
                  ✨ {success}
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full mt-4 flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#4C74D9] to-[#2B4DA2] hover:from-[#2B4DA2] hover:to-[#1E2B58] py-3.5 font-bold text-white shadow-[0_4px_14px_rgba(76,116,217,0.3)] hover:shadow-[0_6px_20px_rgba(76,116,217,0.45)] hover:-translate-y-0.5 active:scale-98 transition-all duration-200 disabled:opacity-50 disabled:pointer-events-none cursor-pointer text-sm"
              >
                <LogIn className="h-4 w-4" />
                {isSubmitting ? "Logging in..." : "Continue"}
              </button>

              <p className="text-center text-xs text-[#374151]/60 mt-6 font-semibold">
                Don't have an account?{" "}
                <Link
                  href="/signup"
                  className="font-bold text-[#4C74D9] hover:underline"
                >
                  Create workspace
                </Link>
              </p>
            </form>
          </div>
        </div>
      </motion.div>
    </main>
  );
}