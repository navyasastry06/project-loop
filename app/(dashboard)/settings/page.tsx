"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { 
  User as UserIcon, 
  Briefcase, 
  Palette, 
  Info, 
  Copy, 
  Check, 
  Layers
} from "lucide-react";

type Theme = "light" | "dark" | "system";

type SettingsData = {
  success: boolean;
  user: {
    name: string;
    email: string;
    role: "ADMIN" | "ANALYST" | "VIEWER";
    createdAt: string;
  };
  workspace: {
    id: string;
    name: string;
    totalUsers: number;
    totalFeedback: number;
  };
};

export default function SettingsPage() {
  const [theme, setTheme] = useState<Theme>("system");
  const [data, setData] = useState<SettingsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  // Load theme preference on mount
  useEffect(() => {
    const savedTheme = (localStorage.getItem("theme") as Theme) || "system";
    setTheme(savedTheme);
  }, []);

  // Fetch settings info
  useEffect(() => {
    async function loadSettings() {
      try {
        const response = await fetch("/api/settings");
        if (!response.ok) {
          throw new Error("Failed to fetch settings");
        }
        const json = await response.json();
        if (json.success) {
          setData(json);
        } else {
          throw new Error(json.message || "Failed to load settings data");
        }
      } catch (err: any) {
        setError(err.message || "An unexpected error occurred");
      } finally {
        setLoading(false);
      }
    }

    loadSettings();
  }, []);

  const handleThemeChange = (newTheme: Theme) => {
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);

    const root = document.documentElement;
    if (newTheme === "dark") {
      root.classList.add("dark");
    } else if (newTheme === "light") {
      root.classList.remove("dark");
    } else {
      const isDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      if (isDark) {
        root.classList.add("dark");
      } else {
        root.classList.remove("dark");
      }
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const roleColors = {
    ADMIN: "bg-[#F8B4D9] text-[#2B4DA2] border border-[#2B4DA2]/10",
    ANALYST: "bg-[#D8C4FF] text-[#2B4DA2] border border-[#2B4DA2]/10",
    VIEWER: "bg-[#FFF6D6] text-[#2B4DA2] border border-[#2B4DA2]/10",
  };

  const techStack = [
    { name: "Next.js 16", style: "bg-white border border-[#2B4DA2]/15 text-[#2B4DA2]" },
    { name: "Prisma ORM", style: "bg-[#D8C4FF] text-[#2B4DA2] border border-[#2B4DA2]/10" },
    { name: "PostgreSQL Database", style: "bg-[#FFF6D6] text-[#2B4DA2] border border-[#2B4DA2]/10" },
    { name: "Gemini Pro LLM", style: "bg-[#F8B4D9] text-[#2B4DA2] border border-[#2B4DA2]/10" },
    { name: "TailwindCSS & Framer Motion", style: "bg-white border border-[#2B4DA2]/15 text-[#2B4DA2]" },
  ];

  if (loading) {
    return (
      <div className="flex h-[70vh] items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 rounded-full border-4 border-[#4C74D9] border-t-transparent animate-spin"></div>
          <p className="text-sm font-extrabold text-[#2B4DA2]/60 uppercase tracking-widest font-sans">
            Loading Settings Slide...
          </p>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="rounded-[24px] border border-rose-200 bg-rose-50/50 p-4 text-xs font-semibold text-rose-700 text-center">
        <h3 className="font-black text-lg">Error Loading Settings</h3>
        <p className="mt-1 text-xs font-semibold">{error || "Could not retrieve settings data."}</p>
      </div>
    );
  }

  const { user, workspace } = data;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-10 pb-16 text-left max-w-5xl"
    >
      {/* Title Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#2B4DA2]/10 pb-6">
        <div>
          <span className="text-[10px] font-black uppercase tracking-widest text-[#2B4DA2]/50 bg-[#FFF6D6] px-2.5 py-1 rounded-full border border-[#2B4DA2]/10">
            Slide 06 — Workspace Controls
          </span>
          <h1 className="text-4xl font-black tracking-tight text-[#2B4DA2] mt-2.5 font-heading">
            Preferences & Settings
          </h1>
          <p className="text-xs text-[#374151]/65 mt-1 font-sans">
            Manage your account preferences, view workspace databases, and adjust theme displays.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        {/* Profile Card */}
        <motion.div 
          whileHover={{ y: -2 }}
          className="rounded-[24px] border border-[#2B4DA2]/10 bg-[#FFF6D6] p-6 md:p-8 shadow-xs relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#F8B4D9]/20 rounded-full blur-2xl pointer-events-none" />
          
          <div className="flex items-center gap-3 border-b border-[#2B4DA2]/10 pb-4 relative z-10">
            <UserIcon className="h-5 w-5 text-[#4C74D9]" />
            <div>
              <h2 className="text-lg font-black text-[#2B4DA2] font-heading">Presenter Profile</h2>
              <p className="text-[10px] text-[#2B4DA2]/60 font-bold uppercase">Account identity (Read-only)</p>
            </div>
          </div>

          <div className="mt-6 space-y-4 relative z-10">
            <div>
              <label className="text-[10px] font-extrabold uppercase tracking-wider text-[#2B4DA2]/55">Account Name</label>
              <div className="mt-1 flex h-11 w-full items-center rounded-xl border border-[#2B4DA2]/10 bg-[#FAFAFC] px-3.5 text-xs font-semibold text-[#374151]">
                {user.name}
              </div>
            </div>

            <div>
              <label className="text-[10px] font-extrabold uppercase tracking-wider text-[#2B4DA2]/55">Email Address</label>
              <div className="mt-1 flex h-11 w-full items-center rounded-xl border border-[#2B4DA2]/10 bg-[#FAFAFC] px-3.5 text-xs font-semibold text-[#374151]">
                {user.email}
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-1">
                <label className="text-[10px] font-extrabold uppercase tracking-wider text-[#2B4DA2]/55">Design Role</label>
                <div className="mt-1">
                  <span className={`inline-flex items-center rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-wider ${roleColors[user.role]}`}>
                    {user.role}
                  </span>
                </div>
              </div>

              {user.createdAt && (
                <div className="flex-1">
                  <label className="text-[10px] font-extrabold uppercase tracking-wider text-[#2B4DA2]/55">Active Since</label>
                  <div className="mt-2.5 text-xs font-bold text-[#374151]/85 font-sans">
                    {formatDate(user.createdAt)}
                  </div>
                </div>
              )}
            </div>
          </div>
        </motion.div>

        {/* Workspace Card */}
        <motion.div 
          whileHover={{ y: -2 }}
          className="rounded-[24px] border border-[#2B4DA2]/10 bg-[#D8C4FF] p-6 md:p-8 shadow-xs relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#A98AE5]/30 rounded-full blur-2xl pointer-events-none" />
          
          <div className="flex items-center gap-3 border-b border-[#2B4DA2]/10 pb-4 relative z-10">
            <Briefcase className="h-5 w-5 text-[#4C74D9]" />
            <div>
              <h2 className="text-lg font-black text-[#2B4DA2] font-heading">Workspace Analytics</h2>
              <p className="text-[10px] text-[#2B4DA2]/60 font-bold uppercase">Current partition statistics (Read-only)</p>
            </div>
          </div>

          <div className="mt-6 space-y-4 relative z-10">
            <div>
              <label className="text-[10px] font-extrabold uppercase tracking-wider text-[#2B4DA2]/55">Workspace Partition</label>
              <div className="mt-1 flex h-11 w-full items-center rounded-xl border border-[#2B4DA2]/10 bg-[#FAFAFC] px-3.5 text-xs font-semibold text-[#374151]">
                {workspace.name}
              </div>
            </div>

            <div>
              <label className="text-[10px] font-extrabold uppercase tracking-wider text-[#2B4DA2]/55">System Partition ID</label>
              <div className="mt-1 flex h-11 w-full items-center justify-between rounded-xl border border-[#2B4DA2]/10 bg-[#FAFAFC] pl-3.5 pr-1.5 text-xs font-semibold text-[#374151]">
                <span className="font-mono text-[10px] truncate mr-2 opacity-75">{workspace.id}</span>
                <button
                  type="button"
                  onClick={() => copyToClipboard(workspace.id)}
                  className="flex h-8 items-center justify-center gap-1 rounded-full bg-white border border-[#2B4DA2]/10 px-3.5 text-[10px] font-extrabold text-[#2B4DA2] transition-all hover:bg-[#FFF6D6] cursor-pointer"
                >
                  {copied ? (
                    <>
                      <Check className="h-3 w-3 text-emerald-600" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-3 w-3" />
                      <span>Copy</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-xl bg-white/70 p-4 border border-[#2B4DA2]/10">
                <span className="block text-[9px] font-black uppercase text-[#2B4DA2]/65">Users Registered</span>
                <span className="mt-1 block text-2xl font-black text-[#2B4DA2] font-heading">{workspace.totalUsers}</span>
              </div>

              <div className="rounded-xl bg-white/70 p-4 border border-[#2B4DA2]/10">
                <span className="block text-[9px] font-black uppercase text-[#2B4DA2]/65">Feedback logs</span>
                <span className="mt-1 block text-2xl font-black text-[#2B4DA2] font-heading">{workspace.totalFeedback}</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Theme Settings Card */}
        <motion.div 
          whileHover={{ y: -2 }}
          className="rounded-[24px] border border-[#2B4DA2]/10 bg-white p-6 md:p-8 shadow-xs relative overflow-hidden"
        >
          <div className="flex items-center gap-3 border-b border-[#2B4DA2]/10 pb-4">
            <Palette className="h-5 w-5 text-[#4C74D9]" />
            <div>
              <h2 className="text-lg font-black text-[#2B4DA2] font-heading">Display Preferences</h2>
              <p className="text-[10px] text-[#2B4DA2]/60 font-bold uppercase">Customize app styling preference</p>
            </div>
          </div>

          <div className="mt-6 space-y-4 font-sans">
            <p className="text-xs text-[#374151]/75 leading-relaxed font-semibold">
              Select between a Light mode presentation look, Dark mode slide backgrounds, or let LOOP match your system settings automatically.
            </p>

            <div className="flex gap-2 rounded-2xl bg-[#FAFAFC] border border-[#2B4DA2]/10 p-1.5 w-full">
              {(["light", "dark", "system"] as const).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => handleThemeChange(t)}
                  className={`flex-1 flex items-center justify-center gap-2 rounded-xl py-2.5 text-xs font-bold transition-all duration-200 capitalize cursor-pointer ${
                    theme === t
                      ? "bg-[#2B4DA2] text-white shadow-sm"
                      : "text-[#2B4DA2]/70 hover:text-black hover:bg-[#FFF6D6]/50"
                  }`}
                >
                  <span className="capitalize">{t}</span>
                </button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Platform Info Card */}
        <motion.div 
          whileHover={{ y: -2 }}
          className="rounded-[24px] border border-[#2B4DA2]/10 bg-white p-6 md:p-8 shadow-xs relative overflow-hidden"
        >
          <div className="flex items-center gap-3 border-b border-[#2B4DA2]/10 pb-4">
            <Info className="h-5 w-5 text-[#4C74D9]" />
            <div>
              <h2 className="text-lg font-black text-[#2B4DA2] font-heading">Platform Architecture</h2>
              <p className="text-[10px] text-[#2B4DA2]/60 font-bold uppercase">System build summary & tags</p>
            </div>
          </div>

          <div className="mt-6 space-y-5">
            <div>
              <h3 className="text-sm font-black text-[#2B4DA2] font-heading">LOOP AI Feedback Intelligence Platform</h3>
              <p className="text-[10px] text-[#374151]/50 font-bold mt-0.5 uppercase tracking-wide">Version 1.0 (Canva Editorial Redesign Build)</p>
            </div>

            <div className="pt-2 border-t border-[#2B4DA2]/5">
              <label className="block text-[10px] font-extrabold uppercase tracking-wider text-[#2B4DA2]/50 mb-2.5">
                Workspace Technology Stack
              </label>
              <div className="flex flex-wrap gap-2">
                {techStack.map((tech) => (
                  <span
                    key={tech.name}
                    className={`inline-flex items-center rounded-full px-3 py-1 text-[9px] font-black uppercase tracking-wider ${tech.style}`}
                  >
                    {tech.name}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
