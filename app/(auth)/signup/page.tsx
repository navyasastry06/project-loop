"use client";

import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { UserPlus } from "lucide-react";

type SignupForm = {
  workspaceName: string;
  name: string;
  email: string;
  password: string;
};

export default function SignupPage() {
  const { register, handleSubmit, formState: { isSubmitting } } = useForm<SignupForm>();
  const router = useRouter();
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function onSubmit(data: SignupForm) {
    setError("");
    setSuccess("");

    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (result.success) {
        setSuccess("Workspace created successfully! Redirecting to login...");
        setTimeout(() => {
          router.push("/login");
        }, 1200);
      } else {
        setError(result.message || "Failed to create workspace.");
      }
    } catch (err) {
      setError("An unexpected error occurred.");
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-[#FAFAFC] text-[#374151] p-4 md:p-8 editorial-dots paper-texture">
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full max-w-5xl bg-[#FFFFFF] rounded-[32px] border border-[#2B4DA2]/10 shadow-sm overflow-hidden grid grid-cols-1 md:grid-cols-2 min-h-[600px]"
      >
        {/* Left Side: Pitch and Illustration */}
        <div className="bg-[#F8B4D9] p-8 md:p-12 flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#FFF6D6]/30 rounded-full blur-3xl" />
          <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-[#D8C4FF]/40 rounded-full blur-2xl" />
          
          <div className="relative z-10">
            <span className="text-xs uppercase tracking-widest text-[#2B4DA2]/60 font-extrabold bg-[#FFF6D6] px-3 py-1.5 rounded-full border border-[#2B4DA2]/10">
              Slide 02 — Workspace Setup
            </span>
            <h2 className="text-4xl md:text-5xl font-black text-[#2B4DA2] leading-tight mt-6 tracking-tight font-heading">
              Create your intelligence space.
            </h2>
            <p className="text-sm text-[#2B4DA2]/80 mt-4 leading-relaxed font-sans max-w-sm">
              Launch a unified feedback workspace for your entire product team in one click.
            </p>
          </div>

          <div className="relative my-6 md:my-0 flex justify-center items-center z-10 animate-float">
            <img 
              src="/5.png" 
              alt="Workspace Creation" 
              className="max-h-[300px] object-contain rounded-2xl"
            />
          </div>

          <div className="relative z-10 text-xs text-[#2B4DA2]/50 font-bold font-sans">
            LOOP AI Feedback Intelligence Platform • © 2026
          </div>
        </div>

        {/* Right Side: Form */}
        <div className="p-8 md:p-12 flex flex-col justify-center bg-[#FFFFFF] overflow-y-auto">
          <div className="w-full max-w-sm mx-auto py-4">
            <h1 className="text-3xl font-black text-[#374151] tracking-tight font-heading">
              Get Started
            </h1>
            <p className="text-sm text-[#374151]/60 mt-2 font-sans">
              Set up your account and workspace parameters.
            </p>

            <form
              onSubmit={handleSubmit(onSubmit)}
              className="mt-8 flex flex-col gap-4"
            >
              <div className="flex flex-col gap-1">
                <label className="text-xs font-extrabold uppercase tracking-wider text-[#374151]/50">Workspace Name</label>
                <input
                  type="text"
                  required
                  placeholder="Acme Product Team"
                  {...register("workspaceName")}
                  className="w-full rounded-2xl border border-[#374151]/10 bg-[#FAFAFC] px-4 py-3 outline-none focus:border-[#4C74D9] focus:ring-2 focus:ring-[#4C74D9]/10 text-sm transition-all duration-200"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs font-extrabold uppercase tracking-wider text-[#374151]/50">Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="Alex Mercer"
                  {...register("name")}
                  className="w-full rounded-2xl border border-[#374151]/10 bg-[#FAFAFC] px-4 py-3 outline-none focus:border-[#4C74D9] focus:ring-2 focus:ring-[#4C74D9]/10 text-sm transition-all duration-200"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs font-extrabold uppercase tracking-wider text-[#374151]/50">Email Address</label>
                <input
                  type="email"
                  required
                  placeholder="alex@company.com"
                  {...register("email")}
                  className="w-full rounded-2xl border border-[#374151]/10 bg-[#FAFAFC] px-4 py-3 outline-none focus:border-[#4C74D9] focus:ring-2 focus:ring-[#4C74D9]/10 text-sm transition-all duration-200"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs font-extrabold uppercase tracking-wider text-[#374151]/50">Password</label>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  {...register("password")}
                  className="w-full rounded-2xl border border-[#374151]/10 bg-[#FAFAFC] px-4 py-3 outline-none focus:border-[#4C74D9] focus:ring-2 focus:ring-[#4C74D9]/10 text-sm transition-all duration-200"
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
                className="w-full mt-4 flex items-center justify-center gap-2 rounded-full bg-[#4C74D9] hover:bg-[#2B4DA2] py-3.5 font-bold text-white shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:pointer-events-none cursor-pointer text-sm"
              >
                <UserPlus className="h-4 w-4" />
                {isSubmitting ? "Creating workspace..." : "Create Account"}
              </button>

              <p className="text-center text-xs text-[#374151]/60 mt-6 font-semibold">
                Already have an account?{" "}
                <Link
                  href="/login"
                  className="font-bold text-[#4C74D9] hover:underline"
                >
                  Sign In
                </Link>
              </p>
            </form>
          </div>
        </div>
      </motion.div>
    </main>
  );
}