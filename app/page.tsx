"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Sparkles, 
  ArrowRight, 
  MessageSquare, 
  Search, 
  ShieldCheck, 
  Layers, 
  UploadCloud, 
  BarChart3, 
  BrainCircuit, 
  TrendingUp, 
  FileSpreadsheet, 
  Sliders, 
  HelpCircle,
  Stars,
  CircleDot
} from "lucide-react";

const consoleQAs = [
  {
    q: "What is LOOP AI?",
    a: "LOOP is an AI-powered customer feedback intelligence platform that collects, analyzes, organizes, and transforms customer feedback into actionable business insights using artificial intelligence.",
    icon: Sparkles,
    cta: "Get Started",
    href: "/signup",
  },
  {
    q: "How does Semantic Search work?",
    a: "Semantic Search searches feedback by meaning, not just keywords. For example, searching 'slow dashboard' also finds 'reports take too long to load' using vector database embeddings.",
    icon: Search,
    cta: "Try Search",
    href: "/signup",
  },
  {
    q: "What are the roles and permissions?",
    a: "We enforce Role-Based Access Control: Admin has full control; Analyst manages and analyzes feedback; Viewer has read-only access to metrics and reports.",
    icon: ShieldCheck,
    cta: "Explore Roles",
    href: "/signup",
  },
];

const features = [
  { title: "Secure Login", desc: "Users can securely log into the platform based on their role (Admin, Analyst, or Viewer).", icon: ShieldCheck, color: "bg-[#FFF6D6]/35 dark:bg-[#1F2D54]/35" },
  { title: "Analytics Dashboard", desc: "Provides a complete overview of customer feedback, including total feedback, sentiment breakdown, recent logs, and AI-generated insights.", icon: BarChart3, color: "bg-[#D8C4FF]/35 dark:bg-[#2F2A4A]/35" },
  { title: "Collect Customer Feedback", desc: "Allows users to manually add customer feedback from support tickets, emails, surveys, app reviews, live chat, or social media.", icon: MessageSquare, color: "bg-[#F8B4D9]/35 dark:bg-[#F8B4D9]/35" },
  { title: "Manage Feedback Logs", desc: "View, edit, delete, search, and filter feedback records by status smoothly in the history panel.", icon: Sliders, color: "bg-white dark:bg-[#1F2D54]/35" },
  { title: "Bulk Import Feedback", desc: "Import hundreds of customer feedback records at once using CSV files.", icon: UploadCloud, color: "bg-[#FFF6D6]/35 dark:bg-[#1F2D54]/35" },
  { title: "AI Feedback Analysis", desc: "Automatically analyzes every feedback and determines customer sentiment, category, and a short AI summary.", icon: BrainCircuit, color: "bg-[#D8C4FF]/35 dark:bg-[#2F2A4A]/35" },
  { title: "Ask LOOP (AI Chat)", desc: "Ask questions in plain English ('What are customers complaining about?') and get answers based on own feedback.", icon: HelpCircle, color: "bg-[#F8B4D9]/35 dark:bg-[#F8B4D9]/35" },
  { title: "Semantic Search", desc: "Searches feedback by meaning, not just keywords (e.g. searching 'slow dashboard' matches 'reports take too long').", icon: Search, color: "bg-white dark:bg-[#1F2D54]/35" },
  { title: "Theme Detection", desc: "Automatically groups similar feedback into common themes such as Performance, Billing, Authentication, and UI.", icon: Layers, color: "bg-[#FFF6D6]/35 dark:bg-[#1F2D54]/35" },
  { title: "Theme Trends", desc: "Shows which customer issues are increasing, decreasing, or most common over time using trend lines.", icon: TrendingUp, color: "bg-[#D8C4FF]/35 dark:bg-[#2F2A4A]/35" },
  { title: "Voice of Customer (VoC)", desc: "Generates an executive summary showing major concerns, positive feedback, emerging issues, and AI recommendations.", icon: Sparkles, color: "bg-[#F8B4D9]/35 dark:bg-[#F8B4D9]/35" },
  { title: "AI Business Insights", desc: "Automatically identifies common customer pain points, frequently requested features, and areas needing improvement.", icon: BrainCircuit, color: "bg-white dark:bg-[#1F2D54]/35" },
  { title: "Reports Archive", desc: "Generate AI-powered business reports that summarize customer feedback and insights.", icon: FileSpreadsheet, color: "bg-[#FFF6D6]/35 dark:bg-[#1F2D54]/35" },
  { title: "Export Reports", desc: "Download generated reports as PDF files for sharing with stakeholders.", icon: UploadCloud, color: "bg-[#D8C4FF]/35 dark:bg-[#2F2A4A]/35" },
  { title: "Workspace Management", desc: "Supports organizations by keeping each company's data separate and secure.", icon: Layers, color: "bg-[#F8B4D9]/35 dark:bg-[#F8B4D9]/35" },
];

export default function Home() {
  const [activeIdx, setActiveIdx] = useState(0);
  const [displayText, setDisplayText] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    let active = true;
    setIsTyping(true);
    let current = "";
    let i = 0;
    const target = consoleQAs[activeIdx].a;
    setDisplayText("");

    const interval = setInterval(() => {
      if (!active) return;
      if (i < target.length) {
        current += target[i];
        setDisplayText(current);
        i++;
      } else {
        clearInterval(interval);
        setIsTyping(false);
      }
    }, 12);

    return () => {
      active = false;
      clearInterval(interval);
    };
  }, [activeIdx]);

  return (
    <div className="min-h-screen bg-[#FAFAFC] text-[#374151] font-sans selection:bg-[#4C74D9] selection:text-white overflow-x-hidden editorial-dots paper-texture">
      
      {/* Header Slide Style */}
      <header className="border-b border-[#2B4DA2]/10 bg-[#FAFAFC] sticky top-0 z-50 transition-colors">
        <div className="max-w-6xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl font-black tracking-tight text-[#2B4DA2] flex items-center gap-2">
              <span className="text-xl bg-[#4C74D9] text-white h-8 w-8 rounded-full flex items-center justify-center">L</span>
              <span>LOOP AI</span>
            </span>
          </div>
          <div className="flex items-center gap-4">
            <Link
              href="/login"
              className="text-sm font-bold text-[#2B4DA2] hover:text-[#4C74D9] transition-colors cursor-pointer px-4 py-2"
            >
              Log In
            </Link>
            <Link
              href="/signup"
              className="rounded-full bg-[#4C74D9] hover:bg-[#2B4DA2] px-6 py-2.5 text-sm font-bold text-white transition-all shadow-sm hover:shadow-md hover:-translate-y-0.5 cursor-pointer"
            >
              Sign Up
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-12 md:py-20 space-y-24 md:space-y-36">
        
        {/* SLIDE 1: Hero Section */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center min-h-[500px]">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-7 space-y-6 text-left"
          >

            <h1 className="text-5xl md:text-7xl font-black tracking-tight leading-none text-[#2B4DA2] font-heading">
              Feedback <br />
              Intelligence. <br />
              <span className="text-[#4C74D9]">Unbound.</span>
            </h1>

            <p className="text-lg text-[#374151] max-w-xl leading-relaxed font-sans">
              LOOP is an AI-powered customer feedback intelligence platform that collects, analyzes, organizes, and transforms customer feedback into actionable business insights.
            </p>

            <div className="pt-4 flex flex-col sm:flex-row gap-4">
              <Link
                href="/signup"
                className="rounded-full bg-[#4C74D9] hover:bg-[#2B4DA2] px-8 py-4 font-bold text-white transition-all shadow-sm hover:shadow-md hover:-translate-y-0.5 cursor-pointer text-center text-base flex items-center justify-center gap-2"
              >
                <span>Get Started Free</span>
                <ArrowRight className="h-5 w-5" />
              </Link>
              <Link
                href="/dashboard"
                className="rounded-full bg-[#FFF6D6] hover:bg-[#FFF6D6]/70 border border-[#2B4DA2]/20 px-8 py-4 font-bold text-[#2B4DA2] transition-all hover:-translate-y-0.5 cursor-pointer text-center text-base"
              >
                Go to Workspace
              </Link>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="lg:col-span-5 flex justify-center items-center relative"
          >
            {/* Organic background shapes */}
            <div className="absolute top-10 right-10 w-48 h-48 bg-[#D8C4FF] rounded-full blur-3xl opacity-60 z-0" />
            <div className="absolute -bottom-10 -left-10 w-64 h-64 bg-[#F8B4D9] rounded-full blur-3xl opacity-50 z-0" />
            
            <div className="relative z-10 animate-float">
              <img 
                src="/1.png" 
                alt="LOOP Editorial Vector"
                className="max-h-[420px] object-contain rounded-[32px]"
              />
            </div>
          </motion.div>
        </section>

        {/* SLIDE 2: Interactive Pitch & QA Console */}
        <section className="bg-[#FFF6D6] dark:bg-[#1F2D54] rounded-[40px] border border-[#2B4DA2]/10 p-8 md:p-12 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#F8B4D9]/20 rounded-full blur-3xl pointer-events-none" />
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Pitch Text */}
            <div className="lg:col-span-5 space-y-6 text-left relative z-10">
              <h2 className="text-4xl font-black text-[#2B4DA2] leading-tight font-heading">
                Semantic AI <br />
                Query Engine
              </h2>
              <p className="text-sm text-[#374151] leading-relaxed font-sans">
                LOOP uses vector database embeddings to find matching items by concept and meaning, bypassing the limitations of simple keywords.
              </p>
              <div className="flex justify-start">
                <img 
                  src="/2.png" 
                  alt="Feature illustration"
                  className="max-h-[140px] object-contain animate-float"
                />
              </div>
            </div>

            {/* Slide Presentation Tab Interface */}
            <div className="lg:col-span-7 bg-white rounded-3xl border border-[#2B4DA2]/15 p-6 md:p-8 shadow-xs relative z-10">
              <div className="flex items-center justify-between border-b border-[#2B4DA2]/10 pb-4 mb-6">
                <div className="flex items-center gap-2">
                  <CircleDot className="h-4.5 w-4.5 text-[#4C74D9]" />
                  <span className="text-xs font-bold text-[#2B4DA2]/80 uppercase tracking-widest font-sans">AI Conversation Slide</span>
                </div>
                <span className="text-[10px] font-extrabold bg-[#D8C4FF] text-[#2B4DA2] px-2.5 py-1 rounded-full uppercase">Active Session</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                <div className="md:col-span-5 flex flex-col gap-2.5">
                  <span className="text-[10px] font-extrabold text-[#2B4DA2]/70 uppercase tracking-wider mb-1">
                    Select a Prompt:
                  </span>
                  {consoleQAs.map((qa, idx) => {
                    const QAIcon = qa.icon;
                    return (
                      <button
                        key={idx}
                        onClick={() => setActiveIdx(idx)}
                        className={`text-left rounded-xl px-4 py-3.5 border transition-all cursor-pointer text-xs font-bold font-sans flex items-center gap-2 ${
                          activeIdx === idx
                            ? "border-[#4C74D9] bg-[#4C74D9]/5 text-[#4C74D9]"
                            : "border-[#374151]/10 bg-transparent text-[#374151]/75 hover:border-[#374151]/20 hover:bg-[#FAFAFC]"
                        }`}
                      >
                        <QAIcon className="h-4 w-4" />
                        <span>{qa.q}</span>
                      </button>
                    );
                  })}
                </div>

                <div className="md:col-span-7 flex flex-col justify-between rounded-2xl border border-[#2B4DA2]/10 bg-[#FAFAFC] p-5 min-h-[220px]">
                  <div className="flex flex-col h-full justify-between">
                    <div>
                      <div className="flex items-center gap-1.5 text-[10px] font-bold text-[#2B4DA2]/50 uppercase tracking-wider mb-3">
                        <span>$</span>
                        <span>query --model=gemini-flash</span>
                      </div>
                      <p className="text-[#374151] text-xs md:text-sm leading-relaxed font-medium min-h-[100px]">
                        {displayText}
                        {isTyping && (
                          <span className="inline-block w-2 h-4 bg-[#4C74D9] ml-1 animate-pulse rounded-xs" />
                        )}
                      </p>
                    </div>

                    <div className="mt-6 flex items-center justify-between border-t border-[#2B4DA2]/10 pt-3">
                      <span className="text-[10px] text-[#2B4DA2]/80 font-semibold">
                        Ready Workspace
                      </span>
                      <Link
                        href={consoleQAs[activeIdx].href}
                        className="rounded-full bg-[#4C74D9] hover:bg-[#2B4DA2] px-4 py-1.5 text-[10px] font-bold text-white transition-all hover:scale-105 active:scale-95 cursor-pointer"
                      >
                        {consoleQAs[activeIdx].cta}
                      </Link>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* Features Pitch Grid */}
        <section className="space-y-16">
          <div className="text-center max-w-2xl mx-auto space-y-4">
            <h2 className="text-4xl md:text-5xl font-black text-[#2B4DA2] tracking-tight font-heading">
              Platform Overview
            </h2>
            <p className="text-sm text-[#374151] leading-relaxed font-sans">
              LOOP classifies, extracts summaries, and transforms customer reviews into executable product feedback loops.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, idx) => {
              const FeatureIcon = feature.icon;
              return (
                <motion.div
                  key={idx}
                  whileHover={{ y: -4, scale: 1.015 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  className={`rounded-[28px] border border-[#2B4DA2]/10 ${feature.color} p-6 shadow-xs card-hover relative overflow-hidden flex flex-col justify-between min-h-[200px] text-left group`}
                >
                  <div className="relative z-10 space-y-4">
                    <div className="h-10 w-10 rounded-full bg-white flex items-center justify-center border border-[#2B4DA2]/10 text-[#4C74D9] group-hover:rotate-6 transition-transform duration-300 shadow-xs">
                      <FeatureIcon className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="text-lg font-black text-[#2B4DA2] leading-tight tracking-tight font-heading">
                        {feature.title}
                      </h3>
                      <p className="mt-2 text-xs md:text-sm text-[#374151] leading-relaxed font-sans">
                        {feature.desc}
                      </p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </section>

        {/* SLIDE 4: Call to action with illustrations */}
        <section className="bg-[#D8C4FF] dark:bg-[#2F2A4A] rounded-[40px] border border-[#2B4DA2]/10 p-8 md:p-16 relative overflow-hidden text-center">
          <div className="absolute -top-10 -right-10 w-64 h-64 bg-[#F8B4D9]/30 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute -bottom-10 -left-10 w-64 h-64 bg-[#FFF6D6]/40 rounded-full blur-2xl pointer-events-none" />
          
          <div className="relative z-10 max-w-2xl mx-auto space-y-8">
            <h2 className="text-4xl md:text-6xl font-black text-[#2B4DA2] tracking-tight leading-none font-heading">
              Ready to present <br />your insights?
            </h2>
            <p className="text-base text-[#2B4DA2]/90 leading-relaxed font-sans max-w-lg mx-auto">
              Get started with LOOP AI today. No credit card required. Build company workspaces in less than 30 seconds.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                href="/signup"
                className="rounded-full bg-[#4C74D9] hover:bg-[#2B4DA2] px-10 py-4 font-bold text-white transition-all shadow-sm hover:shadow-md hover:-translate-y-0.5 cursor-pointer text-base"
              >
                Create Free Workspace
              </Link>
              <Link
                href="/login"
                className="rounded-full bg-[#FAFAFC] hover:bg-[#FAFAFC]/90 border border-[#2B4DA2]/10 px-10 py-4 font-bold text-[#2B4DA2] transition-all hover:-translate-y-0.5 cursor-pointer text-base"
              >
                Sign In Instead
              </Link>
            </div>
            
            <div className="pt-6 flex justify-center items-center">
              <img 
                src="/3.png" 
                alt="Success presentation illustration"
                className="max-h-[180px] object-contain animate-float"
              />
            </div>
          </div>
        </section>

      </main>

      <footer className="border-t border-[#2B4DA2]/10 bg-[#FFF6D6]/40 py-12 text-center text-xs font-semibold text-[#2B4DA2]/80">
        <div className="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div>&copy; 2026 LOOP AI Feedback Intelligence Platform. All rights reserved.</div>
          <div className="flex items-center gap-4">
            <Link href="/login" className="hover:underline">Dashboard</Link>
            <span>•</span>
            <Link href="/signup" className="hover:underline">Workspace</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

