"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";

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
    window.location.href = "/api/export/pdf";
  }

  useEffect(() => {
    loadReports();
  }, []);

  if (loading) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
          <p className="text-sm font-medium text-gray-500">Loading reports...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">Reports</h1>
          <p className="mt-1 text-sm text-gray-500">
            Generate, analyze, and export comprehensive feedback reports.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleDownloadPDF}
            className="inline-flex items-center justify-center rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none"
          >
            📥 Export PDF
          </button>
          {!isViewer && (
            <button
              onClick={handleGenerate}
              disabled={generating}
              className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none disabled:opacity-50"
            >
              {generating ? "Generating..." : "✨ Generate Report"}
            </button>
          )}
        </div>
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
        {/* Report List */}
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm h-fit">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Report Archive</h2>
          {reports.length === 0 ? (
            <p className="text-sm text-gray-500 py-4">No reports generated yet.</p>
          ) : (
            <div className="space-y-3">
              {reports.map((report) => {
                const isSelected = selectedReport?.id === report.id;
                return (
                  <div
                    key={report.id}
                    onClick={() => setSelectedReport(report)}
                    className={`group flex items-center justify-between rounded-lg p-4 border transition-all cursor-pointer ${
                      isSelected
                        ? "border-blue-600 bg-blue-50/30"
                        : "border-gray-200 hover:border-gray-300 hover:bg-gray-50/50"
                    }`}
                  >
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {report.title}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {new Date(report.createdAt).toLocaleDateString()} • {report.contentJson.totalFeedback} items
                      </p>
                    </div>
                    {!isViewer && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(report.id);
                        }}
                        className="ml-2 rounded p-1 text-gray-400 opacity-0 group-hover:opacity-100 hover:bg-gray-100 hover:text-red-600 transition-all"
                      >
                        🗑️
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Report Inspector */}
        <div className="lg:col-span-2">
          {selectedReport ? (
            <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm space-y-6">
              <div className="flex justify-between items-start border-b border-gray-100 pb-4">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">{selectedReport.title}</h2>
                  <p className="text-sm text-gray-500 mt-1">
                    Generated by {selectedReport.generatedBy?.name || session?.user?.name || "System"} on{" "}
                    {new Date(selectedReport.createdAt).toLocaleString()}
                  </p>
                </div>
              </div>

              {/* Statistics Grid */}
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                <div className="rounded-lg bg-gray-50 p-4 border border-gray-100 text-center">
                  <span className="text-xs text-gray-500 uppercase font-semibold">Total Sample</span>
                  <p className="text-2xl font-bold text-gray-900 mt-1">
                    {selectedReport.contentJson.totalFeedback}
                  </p>
                </div>
                <div className="rounded-lg bg-emerald-50 p-4 border border-emerald-100 text-center">
                  <span className="text-xs text-emerald-600 uppercase font-semibold">Positive</span>
                  <p className="text-2xl font-bold text-emerald-700 mt-1">
                    {selectedReport.contentJson.positive}
                  </p>
                </div>
                <div className="rounded-lg bg-amber-50 p-4 border border-amber-100 text-center">
                  <span className="text-xs text-amber-600 uppercase font-semibold">Neutral</span>
                  <p className="text-2xl font-bold text-amber-700 mt-1">
                    {selectedReport.contentJson.neutral}
                  </p>
                </div>
                <div className="rounded-lg bg-rose-50 p-4 border border-rose-100 text-center">
                  <span className="text-xs text-rose-600 uppercase font-semibold">Negative</span>
                  <p className="text-2xl font-bold text-rose-700 mt-1">
                    {selectedReport.contentJson.negative}
                  </p>
                </div>
              </div>

              {/* AI Insights Board */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">✨ Generated Insights</h3>
                {selectedReport.contentJson.insights?.insights?.length > 0 ? (
                  <div className="space-y-3">
                    {selectedReport.contentJson.insights.insights.map((insight, idx) => (
                      <div
                        key={idx}
                        className="flex items-start gap-3 rounded-lg border border-gray-100 bg-gray-50/50 p-4"
                      >
                        <span className="text-lg mt-0.5">💡</span>
                        <p className="text-sm text-gray-700 leading-relaxed">{insight}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">No insights available for this report.</p>
                )}
              </div>
            </div>
          ) : (
            <div className="rounded-xl border-2 border-dashed border-gray-200 p-12 text-center">
              <span className="text-4xl">📄</span>
              <h3 className="mt-4 text-lg font-medium text-gray-900">No Report Selected</h3>
              <p className="mt-2 text-sm text-gray-500">
                Select a report from the archive sidebar or click "Generate Report" to create a new one.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
