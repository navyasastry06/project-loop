"use client";

import { useEffect, useState } from "react";
import { 
  Sparkles, 
  TrendingUp, 
  AlertTriangle, 
  ThumbsUp, 
  ListChecks, 
  RefreshCw, 
  Loader2 
} from "lucide-react";
import { motion } from "framer-motion";

interface SentimentBreakdown {
  positive: number;
  neutral: number;
  negative: number;
}

interface TopCategory {
  name: string;
  count: number;
}

interface VoCReport {
  totalAnalyzed: number;
  sentimentBreakdown: SentimentBreakdown;
  topCategories: TopCategory[];
  summary: string;
  recommendations: string[];
  topIssues: string[];
  positiveHighlights: string[];
}

export default function VoCPage() {
  const [data, setData] = useState<VoCReport | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const fetchData = async () => {
    try {
      setError(null);
      const res = await fetch("/api/voc");
      const json = await res.json();
      
      if (!res.ok) {
        throw new Error(json.message || "Failed to fetch Voice of Customer report");
      }
      
      setData(json);
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchData();
  };

  if (loading) {
    return (
      <div className="flex h-[70vh] flex-col items-center justify-center gap-3">
        <Loader2 className="h-10 w-10 animate-spin text-[#4C74D9]" />
        <p className="text-[#374151] dark:text-[#FAFAFC]/80 font-medium">Analyzing customer logs & generating insights...</p>
      </div>
    );
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1 }
  };

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-black text-[#2B4DA2] dark:text-white tracking-tight flex items-center gap-2">
            <Sparkles className="h-8 w-8 text-[#4C74D9]" />
            Voice of Customer (VoC)
          </h1>
          <p className="text-[#374151] dark:text-white/60 mt-1.5 font-medium">
            AI-synthesized analysis of customer experiences, sentiment trends, and feature requests.
          </p>
        </div>
        <button
          onClick={handleRefresh}
          disabled={refreshing}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#4C74D9] to-[#2B4DA2] text-white hover:shadow-lg hover:scale-102 active:scale-98 transition-all disabled:opacity-50 cursor-pointer text-sm font-semibold border border-white/10"
        >
          <RefreshCw className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`} />
          {refreshing ? "Re-analyzing..." : "Refresh Report"}
        </button>
      </div>

      {error ? (
        <div className="mb-6 p-5 rounded-2xl bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/50 text-red-700 dark:text-red-300">
          <div className="flex items-center gap-2 font-bold mb-1">
            <AlertTriangle className="h-5 w-5" />
            Analysis Failed
          </div>
          <p className="text-sm">{error}</p>
        </div>
      ) : null}

      {data && (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="space-y-6"
        >
          {/* Executive Summary Card */}
          <motion.div
            variants={itemVariants}
            className="card-hover p-6 rounded-2xl border border-[#2B4DA2]/10 dark:border-white/10 bg-gradient-to-br from-[#FFF6D6] via-[#FAFAFC] to-[#F8B4D9]/20 dark:from-[#212f4d] dark:to-[#15223F] shadow-sm"
          >
            <h2 className="text-lg font-extrabold text-[#2B4DA2] dark:text-white mb-2 flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-[#4C74D9]" />
              Executive AI Synthesis
            </h2>
            <p className="text-[#374151] dark:text-white/80 leading-relaxed font-medium">
              {data.summary}
            </p>
          </motion.div>

          {/* Quick Metrics Grid */}
          <motion.div
            variants={itemVariants}
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            {/* Total feedback card */}
            <div className="p-6 rounded-2xl border border-[#2B4DA2]/10 dark:border-white/10 bg-[#FAFAFC]/60 dark:bg-[#1C2C4E]/60 backdrop-blur-md">
              <span className="text-xs font-bold text-[#2B4DA2]/60 dark:text-[#FAFAFC]/60 uppercase tracking-wider">Total Feedback Logs</span>
              <h3 className="text-4xl font-black text-[#2B4DA2] dark:text-white mt-2">{data.totalAnalyzed}</h3>
              <p className="text-xs text-[#374151]/80 dark:text-[#FAFAFC]/80 mt-1 font-medium">Categorized & vector-mapped logs in active workspace</p>
            </div>

            {/* Sentiment breakdown card */}
            <div className="p-6 rounded-2xl border border-[#2B4DA2]/10 dark:border-white/10 bg-[#FAFAFC]/60 dark:bg-[#1C2C4E]/60 backdrop-blur-md md:col-span-2">
              <span className="text-xs font-bold text-[#2B4DA2]/60 dark:text-[#FAFAFC]/60 uppercase tracking-wider block mb-3">Overall Sentiment Breakdown</span>
              <div className="grid grid-cols-3 gap-4">
                <div className="p-3.5 rounded-xl bg-green-50 dark:bg-green-950/20 border border-green-100 dark:border-green-900/30 text-center">
                  <span className="text-xs font-bold text-green-700 dark:text-green-400">Positive</span>
                  <div className="text-xl font-black text-green-800 dark:text-green-300 mt-1">{data.sentimentBreakdown.positive}</div>
                </div>
                <div className="p-3.5 rounded-xl bg-gray-50 dark:bg-gray-800/40 border border-gray-100 dark:border-gray-700/30 text-center">
                  <span className="text-xs font-bold text-gray-600 dark:text-gray-400">Neutral</span>
                  <div className="text-xl font-black text-gray-700 dark:text-gray-300 mt-1">{data.sentimentBreakdown.neutral}</div>
                </div>
                <div className="p-3.5 rounded-xl bg-red-50 dark:bg-red-950/20 border border-red-100 dark:border-red-900/30 text-center">
                  <span className="text-xs font-bold text-red-700 dark:text-red-400">Negative</span>
                  <div className="text-xl font-black text-red-800 dark:text-red-300 mt-1">{data.sentimentBreakdown.negative}</div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Detailed Reports Grid */}
          <motion.div
            variants={itemVariants}
            className="grid grid-cols-1 lg:grid-cols-3 gap-6"
          >
            {/* Top Issues Card */}
            <div className="p-6 rounded-2xl border border-[#2B4DA2]/10 dark:border-white/10 bg-[#FAFAFC]/60 dark:bg-[#1C2C4E]/60 backdrop-blur-md flex flex-col">
              <h3 className="text-md font-extrabold text-[#2B4DA2] dark:text-white mb-4 flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-red-500" />
                Critical Issues & Pain Points
              </h3>
              <ul className="space-y-3.5 flex-1">
                {data.topIssues.map((issue, idx) => (
                  <li key={idx} className="flex gap-2.5 items-start text-[#374151] dark:text-white/80 text-sm font-medium leading-relaxed">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-red-50 dark:bg-red-950/30 text-red-700 dark:text-red-400 text-xs font-bold">{idx + 1}</span>
                    <span>{issue}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Positive Highlights Card */}
            <div className="p-6 rounded-2xl border border-[#2B4DA2]/10 dark:border-white/10 bg-[#FAFAFC]/60 dark:bg-[#1C2C4E]/60 backdrop-blur-md flex flex-col">
              <h3 className="text-md font-extrabold text-[#2B4DA2] dark:text-white mb-4 flex items-center gap-2">
                <ThumbsUp className="h-5 w-5 text-green-600" />
                Positive Highlights & Praises
              </h3>
              <ul className="space-y-3.5 flex-1">
                {data.positiveHighlights.map((highlight, idx) => (
                  <li key={idx} className="flex gap-2.5 items-start text-[#374151] dark:text-white/80 text-sm font-medium leading-relaxed">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-green-50 dark:bg-green-950/30 text-green-700 dark:text-green-400 text-xs font-bold">{idx + 1}</span>
                    <span>{highlight}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Actionable Recommendations Card */}
            <div className="p-6 rounded-2xl border border-[#2B4DA2]/10 dark:border-white/10 bg-[#FAFAFC]/60 dark:bg-[#1C2C4E]/60 backdrop-blur-md flex flex-col">
              <h3 className="text-md font-extrabold text-[#2B4DA2] dark:text-white mb-4 flex items-center gap-2">
                <ListChecks className="h-5 w-5 text-[#4C74D9]" />
                Actionable Recommendations
              </h3>
              <ul className="space-y-3.5 flex-1">
                {data.recommendations.map((rec, idx) => (
                  <li key={idx} className="flex gap-2.5 items-start text-[#374151] dark:text-white/80 text-sm font-medium leading-relaxed">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#D8C4FF] dark:bg-[#A98AE5] text-[#2B4DA2] dark:text-[#15223F] text-xs font-bold">{idx + 1}</span>
                    <span>{rec}</span>
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}
