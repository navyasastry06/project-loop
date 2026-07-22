"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Tags, 
  TrendingUp, 
  TrendingDown, 
  TrendingUp as StableIcon, 
  Trash2, 
  Plus, 
  FileText,
  AlertCircle
} from "lucide-react";

type ThemeTrend = {
  id: string;
  name: string;
  color: string | null;
  description: string | null;
  total: number;
  sentiment: {
    positive: number;
    neutral: number;
    negative: number;
  };
  recentCount: number;
  growth: "rising" | "stable" | "declining";
};

const defaultColors = [
  { name: "Navy", hex: "#2B4DA2" },
  { name: "Blue", hex: "#4C74D9" },
  { name: "Cream", hex: "#FFF6D6" },
  { name: "Pink", hex: "#F8B4D9" },
  { name: "Lavender", hex: "#D8C4FF" },
  { name: "Purple", hex: "#A98AE5" },
  { name: "Red", hex: "#EF4444" },
  { name: "Green", hex: "#10B981" },
  { name: "Orange", hex: "#F97316" },
  { name: "Indigo", hex: "#6366F1" },
];

export default function ThemesPage() {
  const { data: session } = useSession();
  const [trends, setTrends] = useState<ThemeTrend[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [form, setForm] = useState({
    name: "",
    description: "",
    color: "#4C74D9",
  });

  const isViewer = session?.user?.role === "VIEWER";

  async function loadTrends() {
    try {
      const response = await fetch("/api/themes/trends");
      const result = await response.json();
      if (result.success) {
        setTrends(result.trends);
      }
    } catch (err) {
      console.error("Failed to load themes trends:", err);
    } finally {
      setLoading(false);
    }
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name.trim()) return;

    setCreating(true);
    setError("");
    setSuccess("");

    try {
      const response = await fetch("/api/themes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const result = await response.json();

      if (result.success) {
        setSuccess("Theme created successfully.");
        setForm({ name: "", description: "", color: "#4C74D9" });
        await loadTrends();
      } else {
        setError(result.message || "Failed to create theme.");
      }
    } catch (err) {
      setError("An error occurred while creating the theme.");
    } finally {
      setCreating(false);
    }
  }

  async function handleDelete(id: string) {
    if (!window.confirm("Are you sure you want to delete this theme?")) {
      return;
    }

    setError("");
    setSuccess("");

    try {
      const response = await fetch(`/api/themes/${id}`, {
        method: "DELETE",
      });
      const result = await response.json();

      if (result.success) {
        setSuccess("Theme deleted successfully.");
        await loadTrends();
      } else {
        setError(result.message || "Failed to delete theme.");
      }
    } catch (err) {
      setError("An error occurred while deleting the theme.");
    }
  }

  useEffect(() => {
    loadTrends();
  }, []);

  if (loading) {
    return (
      <div className="flex h-[70vh] items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 rounded-full border-4 border-[#4C74D9] border-t-transparent animate-spin"></div>
          <p className="text-sm font-extrabold text-[#2B4DA2]/60 uppercase tracking-widest font-sans">
            Loading Themes Slide...
          </p>
        </div>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-10 pb-16"
    >
      {/* Title Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#2B4DA2]/10 pb-6">
        <div>
          <h1 className="text-4xl font-black tracking-tight text-[#2B4DA2] mt-2.5 font-heading">
            Theme Trends Intelligence
          </h1>
          <p className="text-xs text-[#374151]/65 mt-1 font-sans">
            Monitor topic volume, sentiment distributions, and 30-day index fluctuations.
          </p>
        </div>
      </div>

      {error && (
        <div className="rounded-2xl border border-rose-200 bg-rose-50/50 p-4 text-xs font-semibold text-rose-700">
          ⚠️ {error}
        </div>
      )}

      {success && (
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50/50 p-4 text-xs font-semibold text-emerald-700">
          ✨ {success}
        </div>
      )}

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3 items-start">
        {/* Create Theme Slide Card */}
        {!isViewer && (
          <motion.div 
            whileHover={{ y: -2 }}
            className="rounded-[24px] border border-[#2B4DA2]/10 bg-[#D8C4FF] p-6 md:p-8 shadow-xs text-left relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#A98AE5]/35 rounded-full blur-2xl pointer-events-none" />
            <h2 className="text-xl font-black text-[#2B4DA2] font-heading flex items-center gap-2 mb-6 relative z-10">
              <Plus className="h-5 w-5 bg-white rounded-full p-0.5 text-[#A98AE5]" />
              <span>Create Topic Theme</span>
            </h2>

            <form onSubmit={onSubmit} className="space-y-4 relative z-10">
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-extrabold uppercase tracking-wider text-[#2B4DA2]/75">Theme Label Name</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="e.g. Mobile Performance"
                  className="w-full rounded-2xl border border-[#2B4DA2]/15 bg-[#FAFAFC] px-4 py-3 outline-none focus:border-[#4C74D9] text-xs font-semibold text-[#374151]"
                  required
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-extrabold uppercase tracking-wider text-[#2B4DA2]/75">Description</label>
                <textarea
                  rows={3}
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="What customer queries map to this theme?"
                  className="w-full rounded-2xl border border-[#2B4DA2]/15 bg-[#FAFAFC] px-4 py-3 outline-none focus:border-[#4C74D9] text-xs font-semibold text-[#374151]"
                />
              </div>

              {/* Color pick grid */}
              <div className="space-y-2">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#2B4DA2]/75">Label Visual Tag Color</span>
                <div className="grid grid-cols-5 gap-2.5">
                  {defaultColors.map((color) => {
                    const isSelected = form.color === color.hex;
                    return (
                      <button
                        key={color.hex}
                        type="button"
                        onClick={() => setForm({ ...form, color: color.hex })}
                        className={`h-7 w-7 rounded-full border transition-all ${
                          isSelected ? "ring-2 ring-[#4C74D9] scale-110 border-white" : "border-[#2B4DA2]/15"
                        }`}
                        style={{ backgroundColor: color.hex }}
                        title={color.name}
                      />
                    );
                  })}
                </div>
              </div>

              <button
                type="submit"
                disabled={creating || !form.name.trim()}
                className="w-full mt-4 rounded-full bg-[#4C74D9] hover:bg-[#2B4DA2] py-3.5 font-bold text-white shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer text-xs"
              >
                {creating ? "Saving Slide..." : "Save Custom Theme"}
              </button>
            </form>
          </motion.div>
        )}

        {/* Theme Cards List */}
        <div className={`lg:col-span-2 space-y-6 ${isViewer ? "lg:col-span-3" : ""}`}>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            {trends.length === 0 ? (
              <div className="col-span-full rounded-3xl border border-[#2B4DA2]/10 bg-white p-12 text-center space-y-4">
                <AlertCircle className="h-10 w-10 text-[#4C74D9] mx-auto" />
                <p className="text-xs text-[#374151]/50 font-bold font-sans">No themes configured in this presentation deck yet.</p>
              </div>
            ) : (
              trends.map((theme) => {
                const totalSent = theme.sentiment.positive + theme.sentiment.neutral + theme.sentiment.negative;
                const posPercent = totalSent > 0 ? (theme.sentiment.positive / totalSent) * 100 : 0;
                const neuPercent = totalSent > 0 ? (theme.sentiment.neutral / totalSent) * 100 : 0;
                const negPercent = totalSent > 0 ? (theme.sentiment.negative / totalSent) * 100 : 0;

                return (
                  <motion.div
                    key={theme.id}
                    whileHover={{ y: -4 }}
                    className="relative overflow-hidden rounded-[24px] border border-[#2B4DA2]/10 bg-white p-6 shadow-xs flex flex-col justify-between min-h-[240px] text-left"
                  >
                    {/* Top line with name and color tag */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span
                            className="h-3 w-3 rounded-full flex-shrink-0"
                            style={{ backgroundColor: theme.color || "#4C74D9" }}
                          />
                          <h3 className="font-extrabold text-sm text-[#374151] truncate max-w-[120px]">{theme.name}</h3>
                        </div>
                        <span className="inline-flex items-center rounded-full bg-[#FAFAFC] px-2.5 py-0.5 text-[9px] font-black text-[#2B4DA2] border border-[#2B4DA2]/10">
                          {theme.total} items
                        </span>
                      </div>

                      <p className="text-[11px] text-[#374151]/65 font-medium leading-relaxed font-sans line-clamp-2 min-h-[2.5rem]">
                        {theme.description || "No topic mapping description has been set up."}
                      </p>
                    </div>

                    <div className="space-y-4 mt-4">
                      {/* Growth indicators */}
                      <div className="flex items-center justify-between text-[10px] border-t border-[#2B4DA2]/5 pt-3">
                        <span className="text-[#2B4DA2]/50 font-bold uppercase">30-day index</span>
                        {theme.growth === "rising" && (
                          <span className="inline-flex items-center gap-1 font-black text-emerald-600">
                            <TrendingUp className="h-3.5 w-3.5" />
                            <span>Rising (+{theme.recentCount})</span>
                          </span>
                        )}
                        {theme.growth === "declining" && (
                          <span className="inline-flex items-center gap-1 font-black text-rose-500">
                            <TrendingDown className="h-3.5 w-3.5" />
                            <span>Declining ({theme.recentCount})</span>
                          </span>
                        )}
                        {theme.growth === "stable" && (
                          <span className="inline-flex items-center gap-1 font-black text-[#2B4DA2]/60">
                            <StableIcon className="h-3.5 w-3.5" />
                            <span>Stable ({theme.recentCount})</span>
                          </span>
                        )}
                      </div>

                      {/* Sentiment micro bar */}
                      <div className="space-y-1.5">
                        <div className="flex justify-between text-[9px] text-[#2B4DA2]/50 font-black uppercase tracking-wider">
                          <span>Ratio</span>
                          <span>
                            {posPercent.toFixed(0)}% / {neuPercent.toFixed(0)}% / {negPercent.toFixed(0)}%
                          </span>
                        </div>
                        <div className="flex h-3 w-full overflow-hidden rounded-full bg-[#FAFAFC] border border-[#2B4DA2]/10">
                          <div
                            className="h-full bg-[#D8C4FF] transition-all"
                            style={{ width: `${posPercent}%` }}
                            title={`Positive: ${posPercent.toFixed(0)}%`}
                          />
                          <div
                            className="h-full bg-[#FFF6D6] transition-all"
                            style={{ width: `${neuPercent}%` }}
                            title={`Neutral: ${neuPercent.toFixed(0)}%`}
                          />
                          <div
                            className="h-full bg-[#F8B4D9] transition-all"
                            style={{ width: `${negPercent}%` }}
                            title={`Negative: ${negPercent.toFixed(0)}%`}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Trash option for editor */}
                    {!isViewer && (
                      <div className="flex justify-end pt-3 mt-2 border-t border-[#2B4DA2]/5">
                        <button
                          onClick={() => handleDelete(theme.id)}
                          className="inline-flex items-center gap-1 text-[10px] font-bold text-[#2B4DA2]/50 hover:text-rose-600 transition-colors"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                          <span>Delete Theme</span>
                        </button>
                      </div>
                    )}
                  </motion.div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
