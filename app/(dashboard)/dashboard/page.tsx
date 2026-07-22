"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Filler,
} from "chart.js";
import { Pie, Bar, Line } from "react-chartjs-2";
import { 
  Sparkles, 
  MessageSquare, 
  Smile, 
  Meh, 
  Frown, 
  TrendingUp, 
  Layers, 
  Clock, 
  Calendar,
  ChevronDown
} from "lucide-react";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Filler
);

type DashboardData = {
  stats: {
    total: number;
    positive: number;
    neutral: number;
    negative: number;
  };
  categories: Record<string, number>;
  recentFeedback: any[];
  recentReports?: any[];
};

export default function DashboardPage() {
  const [dateRange, setDateRange] = useState<string>("ALL");
  const [dashboard, setDashboard] = useState<DashboardData | null>(null);
  const [insights, setInsights] = useState<string[]>([]);
  const [analytics, setAnalytics] = useState<any | null>(null);
  const [channels, setChannels] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        let params = "";
        if (dateRange !== "ALL") {
          const days = parseInt(dateRange);
          const start = new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString();
          params = `?start=${start}`;
        }

        const [dashRes, insRes, anaRes, chanRes] = await Promise.all([
          fetch(`/api/dashboard${params}`),
          fetch(`/api/dashboard/insights${params}`),
          fetch(`/api/dashboard/analytics${params}`),
          fetch(`/api/dashboard/channels${params}`),
        ]);

        const [dashData, insData, anaData, chanData] = await Promise.all([
          dashRes.json(),
          insRes.json(),
          anaRes.json(),
          chanRes.json(),
        ]);

        if (dashData.success) setDashboard(dashData);
        if (insData.success && insData.insights?.insights) {
          setInsights(insData.insights.insights);
        } else {
          setInsights([]);
        }
        if (anaData.success) setAnalytics(anaData.analytics);
        if (chanData.success) setChannels(chanData.channels);
      } catch (error) {
        console.error("Failed to load dashboard data:", error);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [dateRange]);

  if (loading) {
    return (
      <div className="flex h-[70vh] items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 rounded-full border-4 border-[#4C74D9] border-t-transparent animate-spin"></div>
          <p className="text-sm font-extrabold text-[#2B4DA2]/60 uppercase tracking-widest font-sans">
            Loading Presentation Slide...
          </p>
        </div>
      </div>
    );
  }

  if (!dashboard) {
    return (
      <div className="rounded-2xl border border-rose-200 bg-rose-50/50 p-6 text-center text-rose-800 font-bold">
        Failed to load slide analytics. Please refresh workspace.
      </div>
    );
  }

  // Canva pastel tones for Pie chart
  const sentimentData = {
    labels: ["Positive", "Neutral", "Negative"],
    datasets: [
      {
        data: [
          dashboard.stats.positive,
          dashboard.stats.neutral,
          dashboard.stats.negative,
        ],
        backgroundColor: ["#D8C4FF", "#FFF6D6", "#F8B4D9"],
        borderColor: "rgba(48, 78, 154, 0.1)",
        borderWidth: 1.5,
      },
    ],
  };

  const sentimentOptions = {
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          font: {
            family: 'Poppins',
            size: 11,
            weight: 'bold' as const
          },
          color: '#374151'
        }
      }
    }
  };

  // Bar Chart styling
  const categoryData = {
    labels: Object.keys(dashboard.categories),
    datasets: [
      {
        label: "Feedback Items",
        data: Object.values(dashboard.categories),
        backgroundColor: "#A98AE5",
        borderRadius: 16,
        borderWidth: 0,
        barThickness: 24,
      },
    ],
  };

  const categoryOptions = {
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      }
    },
    scales: {
      y: {
        grid: {
          color: "rgba(48, 78, 154, 0.05)"
        },
        ticks: {
          font: { family: "Poppins", size: 10 }
        }
      },
      x: {
        grid: {
          display: false
        },
        ticks: {
          font: { family: "Poppins", size: 10 }
        }
      }
    }
  };

  // Volume Trends line styling
  const monthlyLabels = analytics ? Object.keys(analytics.monthlyVolume) : [];
  const monthlyValues = analytics ? Object.values(analytics.monthlyVolume) : [];

  const trendData = {
    labels: monthlyLabels.length > 0 ? monthlyLabels : ["No Logs"],
    datasets: [
      {
        fill: true,
        label: "Feedback Count",
        data: monthlyValues.length > 0 ? monthlyValues : [0],
        borderColor: "#4C74D9",
        backgroundColor: "rgba(76, 116, 217, 0.05)",
        tension: 0.35,
        borderWidth: 3,
        pointBackgroundColor: "#2B4DA2",
      },
    ],
  };

  const trendOptions = {
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      }
    },
    scales: {
      y: {
        grid: {
          color: "rgba(48, 78, 154, 0.05)"
        },
        ticks: {
          font: { family: "Poppins", size: 10 }
        }
      },
      x: {
        grid: {
          display: false
        },
        ticks: {
          font: { family: "Poppins", size: 10 }
        }
      }
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-10 pb-16"
    >
      {/* Editorial Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#2B4DA2]/10 pb-6">
        <div>
          <span className="text-[10px] font-black uppercase tracking-widest text-[#2B4DA2]/50 bg-[#FFF6D6] px-2.5 py-1 rounded-full border border-[#2B4DA2]/10">
            Slide 01 — Executive Overview
          </span>
          <h1 className="text-4xl font-black tracking-tight text-[#2B4DA2] mt-2.5 font-heading">
            Workspace Dashboard
          </h1>
          <p className="text-xs text-[#374151]/65 mt-1 font-sans">
            Real-time presentation of customer feedback metrics and semantic themes.
          </p>
        </div>

        {/* Date Filter */}
        <div className="flex items-center gap-2 bg-[#FFF6D6] dark:bg-[#1E2B58]/30 px-3.5 py-2 rounded-full border border-[#2B4DA2]/15 shadow-xs w-fit">
          <Calendar className="h-4 w-4 text-[#4C74D9]" />
          <span className="text-xs font-bold text-[#2B4DA2]">Period:</span>
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="bg-transparent text-xs font-extrabold text-[#2B4DA2] outline-none cursor-pointer pr-1"
          >
            <option value="ALL">All Slide Data</option>
            <option value="7">Last 7 Days</option>
            <option value="30">Last 30 Days</option>
            <option value="90">Last 90 Days</option>
          </select>
        </div>
      </div>

      {/* Spacious 24px Stats Cards */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {/* Card 1 */}
        <motion.div 
          whileHover={{ y: -4, scale: 1.015 }}
          className="relative overflow-hidden rounded-[24px] border border-[#2B4DA2]/10 bg-[#FFF6D6] dark:bg-[#1F2D54] p-6 text-left shadow-xs flex flex-col justify-between min-h-[140px] card-hover"
        >
          <div className="flex justify-between items-center">
            <span className="text-xs font-black uppercase tracking-wider text-[#2B4DA2]/80">Total Logs</span>
            <span className="h-9 w-9 rounded-full bg-white flex items-center justify-center text-sm shadow-xs border border-[#2B4DA2]/10">
              <MessageSquare className="h-4 w-4 text-[#4C74D9]" />
            </span>
          </div>
          <div>
            <h3 className="text-3xl font-black text-[#2B4DA2] font-heading leading-none mt-2">
              {dashboard.stats.total}
            </h3>
            <p className="text-[10px] text-[#374151] mt-1 font-bold">Feedback Items Indexed</p>
          </div>
        </motion.div>

        {/* Card 2 */}
        <motion.div 
          whileHover={{ y: -4, scale: 1.015 }}
          className="relative overflow-hidden rounded-[24px] border border-[#2B4DA2]/10 bg-[#D8C4FF] dark:bg-[#2F2A4A] p-6 text-left shadow-xs flex flex-col justify-between min-h-[140px] card-hover"
        >
          <div className="flex justify-between items-center">
            <span className="text-xs font-black uppercase tracking-wider text-[#2B4DA2]/80">Positive</span>
            <span className="h-9 w-9 rounded-full bg-white flex items-center justify-center text-sm shadow-xs border border-[#2B4DA2]/10">
              <Smile className="h-4 w-4 text-[#A98AE5]" />
            </span>
          </div>
          <div>
            <h3 className="text-3xl font-black text-[#2B4DA2] font-heading leading-none mt-2">
              {dashboard.stats.positive}
            </h3>
            <p className="text-[10px] text-[#374151] mt-1 font-bold">Customer Applauses</p>
          </div>
        </motion.div>

        {/* Card 3 */}
        <motion.div 
          whileHover={{ y: -4, scale: 1.015 }}
          className="relative overflow-hidden rounded-[24px] border border-[#2B4DA2]/10 bg-[#FFF6D6] dark:bg-[#1F2D54] p-6 text-left shadow-xs flex flex-col justify-between min-h-[140px] card-hover"
        >
          <div className="flex justify-between items-center">
            <span className="text-xs font-black uppercase tracking-wider text-[#2B4DA2]/80">Neutral</span>
            <span className="h-9 w-9 rounded-full bg-white flex items-center justify-center text-sm shadow-xs border border-[#2B4DA2]/10">
              <Meh className="h-4 w-4 text-[#4C74D9]" />
            </span>
          </div>
          <div>
            <h3 className="text-3xl font-black text-[#2B4DA2] font-heading leading-none mt-2">
              {dashboard.stats.neutral}
            </h3>
            <p className="text-[10px] text-[#374151] mt-1 font-bold">Balanced Opinions</p>
          </div>
        </motion.div>

        {/* Card 4 */}
        <motion.div 
          whileHover={{ y: -4, scale: 1.015 }}
          className="relative overflow-hidden rounded-[24px] border border-[#2B4DA2]/10 bg-[#F8B4D9] dark:bg-[#F8B4D9] p-6 text-left shadow-xs flex flex-col justify-between min-h-[140px] card-hover"
        >
          <div className="flex justify-between items-center">
            <span className="text-xs font-black uppercase tracking-wider text-[#2B4DA2]/80">Negative</span>
            <span className="h-9 w-9 rounded-full bg-white flex items-center justify-center text-sm shadow-xs border border-[#2B4DA2]/10">
              <Frown className="h-4 w-4 text-[#F8B4D9]" />
            </span>
          </div>
          <div>
            <h3 className="text-3xl font-black text-[#2B4DA2] font-heading leading-none mt-2">
              {dashboard.stats.negative}
            </h3>
            <p className="text-[10px] text-[#374151] mt-1 font-bold">Criticisms & Friction</p>
          </div>
        </motion.div>
      </div>

      {/* AI Insights & Channels Split */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Sticky note style AI insights */}
        <div className="lg:col-span-2 rounded-[24px] border border-[#2B4DA2]/10 bg-white p-6 shadow-xs relative">
          <div className="absolute top-4 right-4 text-[#D8C4FF] text-xl">📌</div>
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="h-5 w-5 text-[#4C74D9]" />
            <h2 className="text-lg font-black text-[#2B4DA2] font-heading">AI Executive Pinboard</h2>
          </div>
          
          {insights.length === 0 ? (
            <p className="text-xs text-[#374151]/50 py-8 text-center font-sans font-medium">
              No executive notes pinned. Run feedback queries to generate.
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {insights.map((insight, idx) => (
                <motion.div
                  key={idx}
                  whileHover={{ rotate: 1 }}
                  className="rounded-2xl bg-[#FFF6D6] border border-[#2B4DA2]/10 p-5 shadow-xs relative overflow-hidden text-left"
                >
                  {/* Pinned paper visual details */}
                  <span className="absolute top-2 right-2 text-xs opacity-40">📌</span>
                  <p className="text-xs font-semibold text-[#2B4DA2]/95 leading-relaxed font-sans mt-2">
                    {insight}
                  </p>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* Channels Card */}
        <div className="rounded-[24px] border border-[#2B4DA2]/10 bg-white p-6 shadow-xs flex flex-col justify-between">
          <div>
            <h2 className="text-lg font-black text-[#2B4DA2] mb-5 font-heading">Feedback Channels</h2>
            {Object.keys(channels).length === 0 ? (
              <p className="text-xs text-[#374151]/50 py-8 text-center font-sans">No channel metrics available.</p>
            ) : (
              <div className="space-y-4 text-left">
                {Object.entries(channels).map(([channel, count]) => {
                  const total = Object.values(channels).reduce((a, b) => a + b, 0);
                  const percent = total > 0 ? ((count / total) * 100).toFixed(0) : 0;
                  return (
                    <div key={channel} className="space-y-1">
                      <div className="flex items-center justify-between text-xs font-bold font-sans">
                        <span className="text-[#2B4DA2]">{channel}</span>
                        <span className="text-[#2B4DA2]/60">{count} ({percent}%)</span>
                      </div>
                      <div className="h-3 w-full rounded-full bg-[#FAFAFC] border border-[#2B4DA2]/10 overflow-hidden">
                        <div
                          className="h-full rounded-full bg-[#4C74D9]"
                          style={{ width: `${percent}%` }}
                        ></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
          
          <div className="pt-4 mt-4 border-t border-[#2B4DA2]/10 flex justify-center">
            <span className="text-[10px] font-black text-[#2B4DA2]/50 uppercase tracking-widest">
              Live Sources Distribution
            </span>
          </div>
        </div>
      </div>

      {/* Main Charts & Analytics (Spacious, rounded) */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        <div className="rounded-[24px] border border-[#2B4DA2]/10 bg-white p-6 shadow-xs">
          <h2 className="text-lg font-black text-[#2B4DA2] mb-6 text-left font-heading">Sentiment Composition</h2>
          <div className="flex justify-center h-[260px]">
            <Pie data={sentimentData} options={sentimentOptions} />
          </div>
        </div>

        <div className="rounded-[24px] border border-[#2B4DA2]/10 bg-white p-6 shadow-xs">
          <h2 className="text-lg font-black text-[#2B4DA2] mb-6 text-left font-heading">Log Influx Timeline</h2>
          <div className="h-[260px]">
            <Line data={trendData} options={trendOptions} />
          </div>
        </div>
      </div>

      {/* Feedback Category Bar Chart */}
      <div className="rounded-[24px] border border-[#2B4DA2]/10 bg-white p-6 shadow-xs">
        <h2 className="text-lg font-black text-[#2B4DA2] mb-6 text-left font-heading">Topics & Categories Distribution</h2>
        <div className="h-[280px]">
          <Bar data={categoryData} options={categoryOptions} />
        </div>
      </div>

      {/* Recent Feedback & Activity Tables */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        {/* Recent Feedback Table */}
        <div className="rounded-[24px] border border-[#2B4DA2]/10 bg-white p-6 shadow-xs">
          <h2 className="text-lg font-black text-[#2B4DA2] mb-4 text-left font-heading">Recent Submissions</h2>
          {dashboard.recentFeedback.length === 0 ? (
            <p className="text-xs text-[#374151]/50 py-8 text-center font-sans">No recent submissions found.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-[#2B4DA2]/10 text-[#2B4DA2]/55 font-extrabold uppercase tracking-wider">
                    <th className="py-3 px-3">Comment</th>
                    <th className="py-3 px-3">Source</th>
                    <th className="py-3 px-3">Tone</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#2B4DA2]/5">
                  {dashboard.recentFeedback.slice(0, 5).map((feedback) => (
                    <tr key={feedback.id} className="hover:bg-[#FFF6D6]/30 transition-colors">
                      <td className="py-3.5 px-3 max-w-[180px] truncate text-[#374151] font-semibold font-sans">
                        {feedback.content}
                      </td>
                      <td className="py-3.5 px-3 text-[#2B4DA2] font-bold">{feedback.channel}</td>
                      <td className="py-3.5 px-3">
                        {feedback.sentiment === "POS" && (
                          <span className="inline-flex items-center rounded-full bg-[#D8C4FF] px-2.5 py-1 text-[10px] font-bold text-[#2B4DA2] border border-[#2B4DA2]/10">
                            Positive
                          </span>
                        )}
                        {feedback.sentiment === "NEU" && (
                          <span className="inline-flex items-center rounded-full bg-[#FFF6D6] px-2.5 py-1 text-[10px] font-bold text-[#2B4DA2] border border-[#2B4DA2]/10">
                            Neutral
                          </span>
                        )}
                        {feedback.sentiment === "NEG" && (
                          <span className="inline-flex items-center rounded-full bg-[#F8B4D9] px-2.5 py-1 text-[10px] font-bold text-[#2B4DA2] border border-[#2B4DA2]/10">
                            Negative
                          </span>
                        )}
                        {!feedback.sentiment && <span className="text-gray-450 font-bold">-</span>}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Recent Reports Table */}
        <div className="rounded-[24px] border border-[#2B4DA2]/10 bg-white p-6 shadow-xs">
          <h2 className="text-lg font-black text-[#2B4DA2] mb-4 text-left font-heading">Slide Reports generated</h2>
          {!dashboard.recentReports || dashboard.recentReports.length === 0 ? (
            <p className="text-xs text-[#374151]/50 py-8 text-center font-sans">No recent reports found.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-[#2B4DA2]/10 text-[#2B4DA2]/55 font-extrabold uppercase tracking-wider">
                    <th className="py-3 px-3">Presentation Name</th>
                    <th className="py-3 px-3">Presenter</th>
                    <th className="py-3 px-3">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#2B4DA2]/5">
                  {dashboard.recentReports.slice(0, 5).map((report) => (
                    <tr key={report.id} className="hover:bg-[#FFF6D6]/30 transition-colors">
                      <td className="py-3.5 px-3 max-w-[180px] truncate text-[#374151] font-semibold font-sans">
                        {report.title}
                      </td>
                      <td className="py-3.5 px-3 text-[#2B4DA2] font-bold">
                        {report.generatedBy?.name || "LOOP AI"}
                      </td>
                      <td className="py-3.5 px-3 text-[#374151]/70 font-semibold">
                        {new Date(report.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}