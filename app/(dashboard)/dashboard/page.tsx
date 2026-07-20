"use client";

import { useEffect, useState } from "react";
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
};

export default function DashboardPage() {
  const [dashboard, setDashboard] = useState<DashboardData | null>(null);
  const [insights, setInsights] = useState<string[]>([]);
  const [analytics, setAnalytics] = useState<any | null>(null);
  const [channels, setChannels] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [dashRes, insRes, anaRes, chanRes] = await Promise.all([
          fetch("/api/dashboard"),
          fetch("/api/dashboard/insights"),
          fetch("/api/dashboard/analytics"),
          fetch("/api/dashboard/channels"),
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
  }, []);

  if (loading) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
          <p className="text-sm font-medium text-gray-500">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (!dashboard) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-center text-red-800">
        Failed to load dashboard data. Please try again.
      </div>
    );
  }

  const sentimentData = {
    labels: ["Positive", "Neutral", "Negative"],
    datasets: [
      {
        data: [
          dashboard.stats.positive,
          dashboard.stats.neutral,
          dashboard.stats.negative,
        ],
        backgroundColor: ["#10B981", "#F59E0B", "#EF4444"],
        borderWidth: 0,
      },
    ],
  };

  const categoryData = {
    labels: Object.keys(dashboard.categories),
    datasets: [
      {
        label: "Feedback Volume",
        data: Object.values(dashboard.categories),
        backgroundColor: "#3B82F6",
        borderRadius: 6,
      },
    ],
  };

  // Prepare monthly trend data
  const monthlyLabels = analytics ? Object.keys(analytics.monthlyVolume) : [];
  const monthlyValues = analytics ? Object.values(analytics.monthlyVolume) : [];

  const trendData = {
    labels: monthlyLabels.length > 0 ? monthlyLabels : ["No Data"],
    datasets: [
      {
        fill: true,
        label: "Feedback Count",
        data: monthlyValues.length > 0 ? monthlyValues : [0],
        borderColor: "#3B82F6",
        backgroundColor: "rgba(59, 130, 246, 0.1)",
        tension: 0.3,
      },
    ],
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">Dashboard</h1>
        <p className="mt-1 text-sm text-gray-500">
          Get a real-time overview of customer sentiment and feedback trends.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <div className="relative overflow-hidden rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-500">Total Feedback</span>
            <span className="rounded-full bg-blue-50 p-2 text-xl">💬</span>
          </div>
          <div className="mt-4">
            <span className="text-3xl font-bold text-gray-900">{dashboard.stats.total}</span>
          </div>
        </div>

        <div className="relative overflow-hidden rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-500">Positive Sentiment</span>
            <span className="rounded-full bg-emerald-50 p-2 text-xl">🟢</span>
          </div>
          <div className="mt-4">
            <span className="text-3xl font-bold text-emerald-600">{dashboard.stats.positive}</span>
          </div>
        </div>

        <div className="relative overflow-hidden rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-500">Neutral Sentiment</span>
            <span className="rounded-full bg-amber-50 p-2 text-xl">🟡</span>
          </div>
          <div className="mt-4">
            <span className="text-3xl font-bold text-amber-600">{dashboard.stats.neutral}</span>
          </div>
        </div>

        <div className="relative overflow-hidden rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-500">Negative Sentiment</span>
            <span className="rounded-full bg-rose-50 p-2 text-xl">🔴</span>
          </div>
          <div className="mt-4">
            <span className="text-3xl font-bold text-rose-600">{dashboard.stats.negative}</span>
          </div>
        </div>
      </div>

      {/* AI Insights and Channels */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">✨ AI Executive Insights</h2>
          </div>
          {insights.length === 0 ? (
            <p className="text-sm text-gray-500 py-4">No AI insights generated yet. Add more feedback to analyze.</p>
          ) : (
            <div className="space-y-4">
              {insights.map((insight, idx) => (
                <div key={idx} className="flex items-start gap-3 rounded-lg bg-gray-50 p-4 border border-gray-100">
                  <span className="text-lg mt-0.5">💡</span>
                  <p className="text-sm text-gray-700 leading-relaxed">{insight}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Channels</h2>
          {Object.keys(channels).length === 0 ? (
            <p className="text-sm text-gray-500 py-4">No channel data available.</p>
          ) : (
            <div className="space-y-4">
              {Object.entries(channels).map(([channel, count]) => {
                const total = Object.values(channels).reduce((a, b) => a + b, 0);
                const percent = total > 0 ? ((count / total) * 100).toFixed(0) : 0;
                return (
                  <div key={channel} className="space-y-1">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium text-gray-700">{channel}</span>
                      <span className="text-gray-500">{count} ({percent}%)</span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-gray-100">
                      <div
                        className="h-2 rounded-full bg-blue-600"
                        style={{ width: `${percent}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Main Charts & Analytics */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Sentiment Distribution</h2>
          <div className="flex justify-center h-[260px]">
            <Pie data={sentimentData} options={{ maintainAspectRatio: false }} />
          </div>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Volume Trends</h2>
          <div className="h-[260px]">
            <Line data={trendData} options={{ maintainAspectRatio: false }} />
          </div>
        </div>
      </div>

      {/* Feedback Category Breakdown */}
      <div className="grid grid-cols-1 gap-8">
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Feedback by Categories</h2>
          <div className="h-[300px]">
            <Bar data={categoryData} options={{ maintainAspectRatio: false }} />
          </div>
        </div>
      </div>

      {/* Recent Feedback List */}
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Feedback</h2>
        {dashboard.recentFeedback.length === 0 ? (
          <p className="text-sm text-gray-500 py-4">No recent feedback available.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm border-collapse">
              <thead>
                <tr className="border-b border-gray-200 text-gray-500 font-medium pb-3">
                  <th className="py-3 px-4">Feedback Content</th>
                  <th className="py-3 px-4">Channel</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Sentiment</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {dashboard.recentFeedback.map((feedback) => (
                  <tr key={feedback.id} className="hover:bg-gray-50">
                    <td className="py-3.5 px-4 max-w-md truncate text-gray-900 font-medium">
                      {feedback.content}
                    </td>
                    <td className="py-3.5 px-4 text-gray-600">{feedback.channel}</td>
                    <td className="py-3.5 px-4">
                      {feedback.category ? (
                        <span className="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10">
                          {feedback.category}
                        </span>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4">
                      {feedback.sentiment === "POS" && (
                        <span className="inline-flex items-center rounded-md bg-emerald-50 px-2 py-1 text-xs font-medium text-emerald-700 ring-1 ring-inset ring-emerald-700/10">
                          Positive
                        </span>
                      )}
                      {feedback.sentiment === "NEU" && (
                        <span className="inline-flex items-center rounded-md bg-amber-50 px-2 py-1 text-xs font-medium text-amber-700 ring-1 ring-inset ring-amber-700/10">
                          Neutral
                        </span>
                      )}
                      {feedback.sentiment === "NEG" && (
                        <span className="inline-flex items-center rounded-md bg-rose-50 px-2 py-1 text-xs font-medium text-rose-700 ring-1 ring-inset ring-rose-700/10">
                          Negative
                        </span>
                      )}
                      {!feedback.sentiment && <span className="text-gray-400">-</span>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}