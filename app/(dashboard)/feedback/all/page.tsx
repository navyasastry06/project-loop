"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useForm } from "react-hook-form";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { 
  ArrowLeft,
  Trash2, 
  Edit3, 
  Search, 
  Sparkles, 
  History, 
  X
} from "lucide-react";

type Feedback = {
  id: string;
  content: string;
  channel: string;
  sourceRef: string | null;
  customerLabel: string | null;
  status: string;
  createdAt: string;
  sentiment?: string | null;
  category?: string | null;
  summary?: string | null;
};

export default function FeedbackAllPage() {
  const { data: session } = useSession();

  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [analysis, setAnalysis] = useState<any>(null);
  const [analyzingId, setAnalyzingId] = useState<string | null>(null);
  const [analyzingAll, setAnalyzingAll] = useState(false);

  const [editForm, setEditForm] = useState({
    content: "",
    channel: "",
    sourceRef: "",
    customerLabel: "",
    status: "NEW",
  });

  async function loadFeedbacks() {
    const response = await fetch("/api/feedback");
    const result = await response.json();
    if (result.success) {
      setFeedbacks(result.feedbacks);
    }
  }

  async function handleDelete(id: string) {
    const confirmed = window.confirm("Are you sure you want to delete this feedback log?");
    if (!confirmed) return;

    try {
      const response = await fetch(`/api/feedback/${id}`, {
        method: "DELETE",
      });
      const result = await response.json();
      if (!result.success) {
        setError(result.message);
        return;
      }
      setSuccess(result.message);
      await loadFeedbacks();
    } catch {
      setError("Something went wrong.");
    }
  }

  async function handleUpdate() {
    if (!editingId) return;
    setError("");
    setSuccess("");

    try {
      const response = await fetch(`/api/feedback/${editingId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editForm),
      });
      const result = await response.json();

      if (!result.success) {
        setError(result.message);
        return;
      }
      setSuccess(result.message);
      setEditingId(null);
      await loadFeedbacks();
    } catch {
      setError("Something went wrong.");
    }
  }

  async function handleAnalyze(id: string, content: string) {
    setAnalyzingId(id);
    setError("");
    setAnalysis(null);

    try {
      const response = await fetch("/api/ai/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, feedback: content }),
      });
      const result = await response.json();

      if (!result.success) {
        setError(result.message);
        return;
      }
      setAnalysis(result.analysis);
      await loadFeedbacks();
    } catch {
      setError("AI analysis failed.");
    } finally {
      setAnalyzingId(null);
    }
  }

  async function handleAnalyzeAll() {
    setAnalyzingAll(true);
    setError("");
    setSuccess("");

    try {
      const response = await fetch("/api/ai/analyze-all", {
        method: "POST",
      });
      const result = await response.json();

      if (result.success) {
        setSuccess(result.message || "Bulk analysis complete.");
        await loadFeedbacks();
      } else {
        setError(result.message || "Failed to run bulk analysis.");
      }
    } catch (err) {
      setError("An error occurred during bulk analysis.");
    } finally {
      setAnalyzingAll(false);
    }
  }

  useEffect(() => {
    loadFeedbacks();
  }, []);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-8 pb-16"
    >
      {/* Title Header with Back Link */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#2B4DA2]/10 pb-5">
        <div className="text-left">
          <Link 
            href="/feedback" 
            className="inline-flex items-center gap-1.5 text-xs font-black text-[#4C74D9] hover:text-[#2B4DA2] transition-colors mb-3"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Back to Ingestion Slide</span>
          </Link>
          <h1 className="text-4xl font-black tracking-tight text-[#2B4DA2] font-heading">
            All Feedback Logs
          </h1>
          <p className="text-xs text-[#374151]/65 mt-1 font-sans">
            Full searchable list of all logs collected in this workspace partition.
          </p>
        </div>
      </div>

      {error && (
        <div className="rounded-2xl border border-rose-200 bg-rose-50/50 p-4 text-xs font-semibold text-rose-700 text-left">
          ⚠️ {error}
        </div>
      )}

      {success && (
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50/50 p-4 text-xs font-semibold text-emerald-700 text-left">
          ✨ {success}
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-[24px] border border-[#2B4DA2]/10 p-5 shadow-xs flex flex-col sm:flex-row items-stretch sm:items-end gap-4 text-left">
        <div className="flex-1 space-y-1.5">
          <label className="text-[10px] font-extrabold uppercase tracking-wider text-[#2B4DA2]/50">Search Logs</label>
          <div className="relative flex items-center">
            <Search className="absolute left-3.5 h-4.5 w-4.5 text-[#2B4DA2]/40" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search comments by keyword meaning..."
              className="w-full rounded-2xl border border-[#2B4DA2]/10 bg-[#FAFAFC] pl-10 pr-4 py-3.5 outline-none focus:border-[#4C74D9] text-xs font-semibold text-[#374151]"
            />
          </div>
        </div>

        <div className="w-full sm:w-48 space-y-1.5">
          <label className="text-[10px] font-extrabold uppercase tracking-wider text-[#2B4DA2]/50">Status Filter</label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full rounded-2xl border border-[#2B4DA2]/10 bg-[#FAFAFC] px-4 py-3.5 outline-none text-xs font-extrabold text-[#2B4DA2] cursor-pointer"
          >
            <option value="ALL">All Statuses</option>
            <option value="NEW">New</option>
            <option value="REVIEWED">Reviewed</option>
            <option value="ACTIONED">Actioned</option>
          </select>
        </div>

        {session?.user?.role !== "VIEWER" && (
          <button
            type="button"
            onClick={handleAnalyzeAll}
            disabled={analyzingAll}
            className="rounded-full bg-[#4C74D9] hover:bg-[#2B4DA2] px-6 py-3.5 font-bold text-white shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer text-xs h-12 flex items-center justify-center gap-2 whitespace-nowrap disabled:opacity-50"
          >
            <Sparkles className="h-4 w-4" />
            <span>{analyzingAll ? "Analyzing All..." : "Analyze All Logs"}</span>
          </button>
        )}
      </div>

      {/* Complete Presentation Table */}
      <div className="rounded-[24px] border border-[#2B4DA2]/10 bg-white p-6 shadow-xs text-left">
        <div className="flex items-center gap-2 mb-6 border-b border-[#2B4DA2]/10 pb-4">
          <History className="h-5 w-5 text-[#4C74D9]" />
          <h2 className="text-xl font-black text-[#2B4DA2] font-heading">Complete Archive logs ({feedbacks.length})</h2>
        </div>

        {feedbacks.length === 0 ? (
          <p className="text-xs text-[#374151]/50 py-12 text-center font-sans font-medium">
            No feedback logs archived in this workspace.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-xs text-[#374151]">
              <thead>
                <tr className="border-b border-[#2B4DA2]/10 text-[#2B4DA2]/60 font-extrabold uppercase tracking-wider">
                  <th className="py-3 px-3">Content Log</th>
                  <th className="py-3 px-3">Source Channel</th>
                  <th className="py-3 px-3">Sentiment Badge</th>
                  <th className="py-3 px-3">Status</th>
                  <th className="py-3 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#2B4DA2]/5">
                {feedbacks
                  .filter((fb) => {
                    const matchesSearch = fb.content.toLowerCase().includes(search.toLowerCase());
                    const matchesStatus = statusFilter === "ALL" || fb.status === statusFilter;
                    return matchesSearch && matchesStatus;
                  })
                  .map((fb) => (
                    <tr key={fb.id} className="hover:bg-[#FFF6D6]/30 transition-colors">
                      <td className="py-4 px-3 font-semibold leading-relaxed max-w-[280px] sm:max-w-md truncate">
                        {fb.content}
                      </td>
                      <td className="py-4 px-3 font-bold text-[#2B4DA2]">
                        {fb.channel}
                      </td>
                      <td className="py-4 px-3">
                        {fb.sentiment === "POS" && (
                          <span className="inline-flex items-center rounded-full bg-[#D8C4FF] px-2.5 py-1 font-bold text-[#2B4DA2] border border-[#2B4DA2]/10 shadow-3xs">
                            Positive
                          </span>
                        )}
                        {fb.sentiment === "NEU" && (
                          <span className="inline-flex items-center rounded-full bg-[#FFF6D6] px-2.5 py-1 font-bold text-[#2B4DA2] border border-[#2B4DA2]/10">
                            Neutral
                          </span>
                        )}
                        {fb.sentiment === "NEG" && (
                          <span className="inline-flex items-center rounded-full bg-[#F8B4D9] px-2.5 py-1 font-bold text-[#2B4DA2] border border-[#2B4DA2]/10">
                            Negative
                          </span>
                        )}
                        {!fb.sentiment && (
                          <span className="text-gray-400 font-bold italic">Not Analyzed</span>
                        )}
                      </td>
                      <td className="py-4 px-3">
                        <span className="inline-flex items-center rounded-full bg-[#FAFAFC] px-2 py-0.5 text-[9px] font-black text-[#2B4DA2]/70 border border-[#2B4DA2]/10">
                          {fb.status}
                        </span>
                      </td>
                      <td className="py-4 px-3 text-right">
                        {session?.user.role !== "VIEWER" && (
                          <div className="inline-flex gap-2">
                            <button
                              type="button"
                              onClick={() => {
                                setEditingId(fb.id);
                                setEditForm({
                                  content: fb.content,
                                  channel: fb.channel,
                                  sourceRef: fb.sourceRef ?? "",
                                  customerLabel: fb.customerLabel ?? "",
                                  status: fb.status,
                                });
                              }}
                              className="rounded-full bg-[#FFF6D6] hover:bg-[#D8C4FF] p-2 text-[#2B4DA2] border border-[#2B4DA2]/10 transition-all"
                              title="Edit Log"
                            >
                              <Edit3 className="h-3.5 w-3.5" />
                            </button>

                            <button
                              type="button"
                              onClick={() => handleDelete(fb.id)}
                              className="rounded-full bg-[#F8B4D9]/10 hover:bg-[#F8B4D9]/30 p-2 text-rose-600 border border-rose-250 transition-all"
                              title="Delete Log"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>

                            <button
                              type="button"
                              onClick={() => handleAnalyze(fb.id, fb.content)}
                              disabled={analyzingId === fb.id}
                              className="rounded-full bg-[#D8C4FF] hover:bg-[#A98AE5] px-3 py-1 font-bold text-[#2B4DA2] border border-[#2B4DA2]/10 transition-all disabled:opacity-50 flex items-center gap-1"
                            >
                              <Sparkles className="h-3 w-3" />
                              <span>{analyzingId === fb.id ? "Analyzing..." : "Analyze"}</span>
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Edit Form Modal Slide */}
      <AnimatePresence>
        {editingId && session?.user.role !== "VIEWER" && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4"
          >
            <motion.div 
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              className="w-full max-w-lg rounded-[28px] bg-white border border-[#2B4DA2]/15 p-6 md:p-8 shadow-md text-left relative"
            >
              <button
                onClick={() => setEditingId(null)}
                className="absolute top-4 right-4 h-8 w-8 bg-[#FAFAFC] rounded-full flex items-center justify-center text-gray-500 hover:text-black border border-gray-100"
              >
                <X className="h-4 w-4" />
              </button>

              <h2 className="text-xl font-black text-[#2B4DA2] font-heading mb-6 flex items-center gap-2">
                <Edit3 className="h-5 w-5" />
                <span>Modify Feedback Record</span>
              </h2>

              <div className="space-y-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-extrabold uppercase tracking-wider text-[#2B4DA2]/75">Customer Input</label>
                  <textarea
                    rows={4}
                    value={editForm.content}
                    onChange={(e) => setEditForm({ ...editForm, content: e.target.value })}
                    className="rounded-2xl border border-[#2B4DA2]/15 bg-[#FAFAFC] px-4 py-3 outline-none focus:border-[#4C74D9] text-xs font-semibold text-[#374151]"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-extrabold uppercase tracking-wider text-[#2B4DA2]/75">Channel</label>
                  <input
                    type="text"
                    value={editForm.channel}
                    onChange={(e) => setEditForm({ ...editForm, channel: e.target.value })}
                    className="rounded-xl border border-[#2B4DA2]/15 bg-[#FAFAFC] px-3.5 py-2.5 outline-none focus:border-[#4C74D9] text-xs font-semibold"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-extrabold uppercase tracking-wider text-[#2B4DA2]/75">Segment Label</label>
                  <input
                    type="text"
                    value={editForm.customerLabel}
                    onChange={(e) => setEditForm({ ...editForm, customerLabel: e.target.value })}
                    className="rounded-xl border border-[#2B4DA2]/15 bg-[#FAFAFC] px-3.5 py-2.5 outline-none focus:border-[#4C74D9] text-xs font-semibold"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-extrabold uppercase tracking-wider text-[#2B4DA2]/75">Reference ID</label>
                  <input
                    type="text"
                    value={editForm.sourceRef}
                    onChange={(e) => setEditForm({ ...editForm, sourceRef: e.target.value })}
                    className="rounded-xl border border-[#2B4DA2]/15 bg-[#FAFAFC] px-3.5 py-2.5 outline-none focus:border-[#4C74D9] text-xs font-semibold"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-extrabold uppercase tracking-wider text-[#2B4DA2]/75">Status Review State</label>
                  <select
                    value={editForm.status}
                    onChange={(e) => setEditForm({ ...editForm, status: e.target.value })}
                    className="rounded-xl border border-[#2B4DA2]/15 bg-[#FAFAFC] px-3.5 py-2.5 outline-none text-xs font-bold text-[#2B4DA2] cursor-pointer"
                  >
                    <option value="NEW">New</option>
                    <option value="REVIEWED">Reviewed</option>
                    <option value="ACTIONED">Actioned</option>
                  </select>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={handleUpdate}
                    className="flex-1 rounded-full bg-[#4C74D9] hover:bg-[#2B4DA2] py-3.5 font-bold text-white shadow-sm text-xs cursor-pointer"
                  >
                    Save Modifications
                  </button>
                  <button
                    onClick={() => setEditingId(null)}
                    className="flex-1 rounded-full bg-[#FAFAFC] hover:bg-[#FFF6D6] border border-[#2B4DA2]/15 py-3.5 font-bold text-[#2B4DA2] text-xs cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* AI Inspector Details Slide (Pops up after single analyze click) */}
      <AnimatePresence>
        {analysis && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4"
          >
            <motion.div 
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              className="w-full max-w-2xl rounded-[28px] bg-[#FFF6D6] border border-[#2B4DA2]/15 p-6 md:p-8 shadow-md text-left relative"
            >
              <button
                onClick={() => setAnalysis(null)}
                className="absolute top-4 right-4 h-8 w-8 bg-[#FAFAFC] rounded-full flex items-center justify-center text-gray-500 hover:text-black border border-gray-150"
              >
                <X className="h-4 w-4" />
              </button>

              <h2 className="text-xl font-black text-[#2B4DA2] font-heading mb-6 flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-[#A98AE5]" />
                <span>AI Analysis Response</span>
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 font-sans">
                <div className="bg-white rounded-2xl border border-[#2B4DA2]/10 p-4">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#2B4DA2]/50">Sentiment Tone</span>
                  <p className="text-sm font-bold text-[#2B4DA2] mt-1 capitalize">
                    {analysis.sentiment === "POS" ? "Positive" : analysis.sentiment === "NEG" ? "Negative" : "Neutral"}
                  </p>
                </div>

                <div className="bg-white rounded-2xl border border-[#2B4DA2]/10 p-4">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#2B4DA2]/50">AI Category</span>
                  <p className="text-sm font-bold text-[#2B4DA2] mt-1 capitalize">{analysis.category}</p>
                </div>

                <div className="bg-white rounded-2xl border border-[#2B4DA2]/10 p-4">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#2B4DA2]/50">Executive Summary</span>
                  <p className="text-xs font-semibold text-[#374151] leading-relaxed mt-1">{analysis.summary}</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
