"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FileText, 
  Sparkles, 
  Download, 
  Trash2, 
  Calendar, 
  Layers, 
  Plus,
  TrendingUp,
  FileSpreadsheet
} from "lucide-react";

type Report = {
  id: string;
  title: string;
  periodStart: string;
  periodEnd: string;
  contentJson: {
    totalFeedback: number;
    positive: number;
    neutral: number;
    negative: number;
    insights: {
      insights: string[];
    };
  };
  createdAt: string;
  generatedBy: {
    name: string;
    email: string;
  };
};

export default function ReportsPage() {
  const { data: session } = useSession();
  const [reports, setReports] = useState<Report[]>([]);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const isViewer = session?.user?.role === "VIEWER";

  async function loadReports() {
    try {
      const response = await fetch("/api/reports");
      const result = await response.json();

      if (result.success) {
        setReports(result.reports);
        if (result.reports.length > 0 && !selectedReport) {
          setSelectedReport(result.reports[0]);
        }
      }
    } catch (err) {
      console.error("Failed to load reports:", err);
    } finally {
      setLoading(false);
    }
  }

  async function handleGenerate() {
    setGenerating(true);
    setError("");
    setSuccess("");

    try {
      const response = await fetch("/api/reports/generate", {
        method: "POST",
      });
      const result = await response.json();

      if (result.success) {
        setSuccess("Report generated successfully!");
        await loadReports();
        setSelectedReport(result.report);
      } else {
        setError(result.message || "Failed to generate report.");
      }
    } catch (err) {
      setError("An error occurred while generating the report.");
    } finally {
      setGenerating(false);
    }
  }

  async function handleDelete(id: string) {
    if (!window.confirm("Are you sure you want to delete this report?")) {
      return;
    }

    try {
      const response = await fetch(`/api/reports/${id}`, {
        method: "DELETE",
      });
      const result = await response.json();

      if (result.success) {
        setSuccess("Report deleted successfully.");
        if (selectedReport?.id === id) {
          setSelectedReport(null);
        }
        await loadReports();
      } else {
        setError(result.message || "Failed to delete report.");
      }
    } catch (err) {
      setError("An error occurred while deleting the report.");
    }
  }

  function handleDownloadPDF() {
    if (selectedReport) {
      window.location.href = `/api/export/pdf?id=${selectedReport.id}`;
    } else {
      window.location.href = "/api/export/pdf";
    }
  }

  useEffect(() => {
    loadReports();
  }, []);

  if (loading) {
    return (
      <div className="flex h-[70vh] items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 rounded-full border-4 border-[#4C74D9] border-t-transparent animate-spin"></div>
          <p className="text-sm font-extrabold text-[#2B4DA2]/60 uppercase tracking-widest font-sans">
            Loading Reports Slide...
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
          <span className="text-[10px] font-black uppercase tracking-widest text-[#2B4DA2]/50 bg-[#FFF6D6] px-2.5 py-1 rounded-full border border-[#2B4DA2]/10">
            Slide 03 — Insight Summary
          </span>
          <h1 className="text-4xl font-black tracking-tight text-[#2B4DA2] mt-2.5 font-heading">
            Executive PDF Reports
          </h1>
          <p className="text-xs text-[#374151]/65 mt-1 font-sans">
            Export unified analytics and text feedback summaries into PDF presentations.
          </p>
        </div>
        
        {/* CTAs */}
        <div className="flex items-center gap-3">
          <button
            onClick={handleDownloadPDF}
            disabled={!selectedReport}
            className="inline-flex items-center justify-center gap-2 rounded-full border border-[#2B4DA2]/15 bg-white px-5 py-3 text-xs font-bold text-[#2B4DA2] shadow-xs hover:bg-[#FAFAFC] active:scale-95 transition-all disabled:opacity-50 cursor-pointer"
          >
            <Download className="h-4 w-4" />
            <span>Export Report PDF</span>
          </button>
          {!isViewer && (
            <button
              onClick={handleGenerate}
              disabled={generating}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-[#4C74D9] hover:bg-[#2B4DA2] px-6 py-3 text-xs font-black text-white shadow-sm hover:shadow-md active:scale-95 transition-all disabled:opacity-50 cursor-pointer"
            >
              <Sparkles className="h-4 w-4" />
              <span>{generating ? "Generating..." : "Generate Slide Report"}</span>
            </button>
          )}
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
        {/* Slide Archive Index */}
        <div className="rounded-[24px] border border-[#2B4DA2]/10 bg-white p-6 shadow-xs text-left">
          <h2 className="text-lg font-black text-[#2B4DA2] mb-5 font-heading">Report Slides Index</h2>
          {reports.length === 0 ? (
            <div className="py-8 text-center space-y-4">
              <p className="text-xs text-[#374151]/50 font-medium">No reports generated yet.</p>
              <img src="/6.png" className="max-h-[100px] mx-auto animate-float object-contain" alt="No reports illustration" />
            </div>
          ) : (
            <div className="space-y-3.5">
              {reports.map((report, idx) => {
                const isSelected = selectedReport?.id === report.id;
                const slideNum = String(idx + 1).padStart(2, "0");
                return (
                  <div
                    key={report.id}
                    onClick={() => setSelectedReport(report)}
                    className={`group flex items-center justify-between rounded-2xl p-4 border transition-all cursor-pointer ${
                      isSelected
                        ? "border-[#4C74D9] bg-[#4C74D9]/5 text-[#2B4DA2]"
                        : "border-[#2B4DA2]/10 bg-transparent hover:border-[#2B4DA2]/20 hover:bg-[#FAFAFC]/50"
                    }`}
                  >
                    <div className="min-w-0 flex-1 flex gap-3 items-center">
                      <span className={`text-[10px] font-black ${isSelected ? "text-[#4C74D9]" : "text-[#2B4DA2]/40"}`}>
                        SLIDE {slideNum}
                      </span>
                      <div className="truncate text-left">
                        <p className="text-xs font-extrabold text-[#374151] truncate">
                          {report.title}
                        </p>
                        <p className="text-[10px] text-[#2B4DA2]/60 font-bold mt-0.5">
                          {new Date(report.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    {!isViewer && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(report.id);
                        }}
                        className="ml-2 rounded-full p-1.5 text-gray-400 opacity-0 group-hover:opacity-100 hover:bg-rose-50 hover:text-rose-600 transition-all border border-transparent hover:border-rose-100"
                        title="Delete Report"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Slide Inspector (Editorial Slide layout) */}
        <div className="lg:col-span-2">
          <AnimatePresence mode="wait">
            {selectedReport ? (
              <motion.div 
                key={selectedReport.id}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.3 }}
                className="rounded-[24px] border border-[#2B4DA2]/10 bg-white p-6 md:p-8 shadow-xs space-y-6 text-left relative overflow-hidden"
              >
                {/* Visual slide decor */}
                <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-[#FFF6D6] rounded-full blur-2xl opacity-60 z-0 pointer-events-none" />

                <div className="relative z-10 flex flex-col sm:flex-row justify-between items-start border-b border-[#2B4DA2]/10 pb-5 gap-3">
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-[#2B4DA2]/50 bg-[#FFF6D6] px-2 py-0.5 rounded-md border border-[#2B4DA2]/10">
                      Slide Report Inspector
                    </span>
                    <h2 className="text-2xl font-black text-[#2B4DA2] mt-2 font-heading">{selectedReport.title}</h2>
                    <p className="text-[10px] text-[#2B4DA2]/60 font-bold mt-1">
                      Author: {selectedReport.generatedBy?.name || "LOOP AI"} on{" "}
                      {new Date(selectedReport.createdAt).toLocaleString()}
                    </p>
                  </div>
                  <FileText className="h-9 w-9 text-[#4C74D9] hidden sm:block" />
                </div>

                {/* Canva Grid for Statistics */}
                <div className="relative z-10 grid grid-cols-2 gap-4 sm:grid-cols-4">
                  <div className="rounded-2xl bg-[#FAFAFC] p-4 border border-[#2B4DA2]/10 text-center">
                    <span className="text-[9px] text-[#2B4DA2]/60 uppercase tracking-widest font-black">Feedback Sample</span>
                    <p className="text-2xl font-black text-[#2B4DA2] mt-1 font-heading">
                      {selectedReport.contentJson.totalFeedback}
                    </p>
                  </div>
                  <div className="rounded-2xl bg-[#D8C4FF] p-4 border border-[#2B4DA2]/10 text-center">
                    <span className="text-[9px] text-[#2B4DA2]/70 uppercase tracking-widest font-black">Positive tone</span>
                    <p className="text-2xl font-black text-[#2B4DA2] mt-1 font-heading">
                      {selectedReport.contentJson.positive}
                    </p>
                  </div>
                  <div className="rounded-2xl bg-[#FFF6D6] p-4 border border-[#2B4DA2]/10 text-center">
                    <span className="text-[9px] text-[#2B4DA2]/70 uppercase tracking-widest font-black">Neutral tone</span>
                    <p className="text-2xl font-black text-[#2B4DA2] mt-1 font-heading">
                      {selectedReport.contentJson.neutral}
                    </p>
                  </div>
                  <div className="rounded-2xl bg-[#F8B4D9] p-4 border border-[#2B4DA2]/10 text-center">
                    <span className="text-[9px] text-[#2B4DA2]/70 uppercase tracking-widest font-black">Negative tone</span>
                    <p className="text-2xl font-black text-[#2B4DA2] mt-1 font-heading">
                      {selectedReport.contentJson.negative}
                    </p>
                  </div>
                </div>

                {/* Insights Pinboard */}
                <div className="relative z-10 space-y-4 pt-2">
                  <h3 className="text-lg font-black text-[#2B4DA2] font-heading flex items-center gap-1.5">
                    <Sparkles className="h-5 w-5 text-[#4C74D9]" />
                    <span>AI Generated Presentation Insights</span>
                  </h3>
                  {selectedReport.contentJson.insights?.insights?.length > 0 ? (
                    <div className="grid grid-cols-1 gap-4">
                      {selectedReport.contentJson.insights.insights.map((insight, idx) => (
                        <div
                          key={idx}
                          className="flex items-start gap-3 rounded-2xl border border-[#2B4DA2]/10 bg-[#FAFAFC]/85 p-5 relative overflow-hidden"
                        >
                          <span className="text-sm mt-0.5">💡</span>
                          <p className="text-xs font-semibold text-[#374151]/85 leading-relaxed font-sans">{insight}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-[#374151]/50 font-sans italic">No semantic insights available for this slide.</p>
                  )}
                </div>
              </motion.div>
            ) : (
              <div className="rounded-[24px] border-2 border-dashed border-[#2B4DA2]/15 bg-white p-16 text-center space-y-5">
                <div className="h-14 w-14 rounded-full bg-[#FFF6D6] flex items-center justify-center mx-auto border border-[#2B4DA2]/10">
                  <FileSpreadsheet className="h-6 w-6 text-[#4C74D9] animate-bounce" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-lg font-black text-[#2B4DA2] font-heading">No Slide Selected</h3>
                  <p className="text-xs text-[#374151]/60 font-sans font-medium max-w-xs mx-auto">
                    Select a report from the presentation index or click "Generate Slide Report" to create a new report deck.
                  </p>
                </div>
                <img 
                  src="/6.png" 
                  alt="Reports empty state" 
                  className="max-h-[150px] mx-auto opacity-70"
                />
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}
