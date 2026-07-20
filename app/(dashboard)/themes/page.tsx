"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Input from "@/components/ui/Input";

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
  { name: "Slate", hex: "#64748B" },
  { name: "Red", hex: "#EF4444" },
  { name: "Orange", hex: "#F97316" },
  { name: "Amber", hex: "#F59E0B" },
  { name: "Green", hex: "#10B981" },
  { name: "Blue", hex: "#3B82F6" },
  { name: "Indigo", hex: "#6366F1" },
  { name: "Purple", hex: "#A855F7" },
  { name: "Pink", hex: "#EC4899" },
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
    color: "#64748B",
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
        setForm({ name: "", description: "", color: "#64748B" });
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
      <div className="flex h-[80vh] items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
          <p className="text-sm font-medium text-gray-500">Loading themes and trends...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">Theme Intelligence</h1>
        <p className="mt-1 text-sm text-gray-500">
          Monitor trends, track volume growth, and analyze sentiment across core business topics.
        </p>
      </div>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-800">
          {error}
        </div>
      )}

      {success && (
        <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800">
          {success}
        </div>
      )}

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Create Theme */}
        {!isViewer && (
          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm h-fit">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Create Custom Theme</h2>
            <form onSubmit={onSubmit} className="space-y-4">
              <Input
                label="Theme Name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
              />
              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-gray-700">Description</label>
                <textarea
                  rows={3}
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="rounded-lg border border-gray-300 px-4 py-2 outline-none focus:border-blue-500 text-sm"
                />
              </div>

              {/* Color pick grid */}
              <div className="space-y-2">
                <span className="text-sm font-medium text-gray-700">Theme Color Label</span>
                <div className="grid grid-cols-5 gap-2">
                  {defaultColors.map((color) => {
                    const isSelected = form.color === color.hex;
                    return (
                      <button
                        key={color.hex}
                        type="button"
                        onClick={() => setForm({ ...form, color: color.hex })}
                        className={`h-8 w-8 rounded-full border transition-all ${
                          isSelected ? "ring-2 ring-blue-500 scale-110" : "border-gray-200"
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
                className="w-full inline-flex items-center justify-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none disabled:opacity-50"
              >
                {creating ? "Creating..." : "➕ Create Theme"}
              </button>
            </form>
          </div>
        )}

        {/* Theme cards list */}
        <div className={`lg:col-span-2 space-y-6 ${isViewer ? "lg:col-span-3" : ""}`}>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {trends.length === 0 ? (
              <p className="text-sm text-gray-500 py-4 col-span-full">No themes set up yet.</p>
            ) : (
              trends.map((theme) => {
                const totalSent = theme.sentiment.positive + theme.sentiment.neutral + theme.sentiment.negative;
                const posPercent = totalSent > 0 ? (theme.sentiment.positive / totalSent) * 100 : 0;
                const neuPercent = totalSent > 0 ? (theme.sentiment.neutral / totalSent) * 100 : 0;
                const negPercent = totalSent > 0 ? (theme.sentiment.negative / totalSent) * 100 : 0;

                return (
                  <div
                    key={theme.id}
                    className="relative overflow-hidden rounded-xl border border-gray-200 bg-white p-5 shadow-sm space-y-4"
                  >
                    {/* Top line with name and color tag */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span
                          className="h-3.5 w-3.5 rounded-full"
                          style={{ backgroundColor: theme.color || "#64748B" }}
                        />
                        <h3 className="font-semibold text-gray-900">{theme.name}</h3>
                      </div>
                      <span className="inline-flex items-center rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-semibold text-blue-700 ring-1 ring-inset ring-blue-700/10">
                        {theme.total} items
                      </span>
                    </div>

                    <p className="text-xs text-gray-500 line-clamp-2 min-h-[2rem]">
                      {theme.description || "No description provided."}
                    </p>

                    {/* Growth indicators */}
                    <div className="flex items-center justify-between text-xs border-t border-gray-100 pt-3">
                      <span className="text-gray-400 font-semibold uppercase">30-day Growth</span>
                      {theme.growth === "rising" && (
                        <span className="inline-flex items-center gap-1 font-bold text-emerald-600">
                          ↗️ Rising (+{theme.recentCount})
                        </span>
                      )}
                      {theme.growth === "declining" && (
                        <span className="inline-flex items-center gap-1 font-bold text-rose-600">
                          ↘️ Declining ({theme.recentCount})
                        </span>
                      )}
                      {theme.growth === "stable" && (
                        <span className="inline-flex items-center gap-1 font-bold text-gray-500">
                          ➡️ Stable ({theme.recentCount})
                        </span>
                      )}
                    </div>

                    {/* Sentiment micro bar */}
                    <div className="space-y-1.5">
                      <div className="flex justify-between text-[10px] text-gray-400 font-bold uppercase">
                        <span>Sentiment ratio</span>
                        <span>
                          {posPercent.toFixed(0)}% / {neuPercent.toFixed(0)}% / {negPercent.toFixed(0)}%
                        </span>
                      </div>
                      <div className="flex h-2.5 w-full overflow-hidden rounded-full bg-gray-150">
                        <div
                          className="h-full bg-emerald-500 transition-all"
                          style={{ width: `${posPercent}%` }}
                          title={`Positive: ${posPercent.toFixed(0)}%`}
                        />
                        <div
                          className="h-full bg-amber-400 transition-all"
                          style={{ width: `${neuPercent}%` }}
                          title={`Neutral: ${neuPercent.toFixed(0)}%`}
                        />
                        <div
                          className="h-full bg-rose-500 transition-all"
                          style={{ width: `${negPercent}%` }}
                          title={`Negative: ${negPercent.toFixed(0)}%`}
                        />
                      </div>
                    </div>

                    {/* Trash option for editor */}
                    {!isViewer && (
                      <div className="flex justify-end pt-2">
                        <button
                          onClick={() => handleDelete(theme.id)}
                          className="text-[11px] font-semibold text-gray-400 hover:text-red-600 transition-colors"
                        >
                          🗑️ Delete Theme
                        </button>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
