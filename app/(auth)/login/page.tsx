"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { signIn } from "next-auth/react";
import { motion } from "framer-motion";
import Link from "next/link";
import { LogIn } from "lucide-react";

import Image from "next/image";

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
            <Image
              src="/7.png"
              alt="LOOP AI Dashboard Preview"
              width={320}
              height={300}
              priority
              className="max-h-[300px] w-auto object-contain rounded-2xl"
            />
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
                 {success}
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
                Don&apos;t have an account?{" "}
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
