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
} from "chart.js";
import { Pie, Bar } from "react-chartjs-2";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement
);

type DashboardData = {
  stats: {
    total: number;
    positive: number;
    neutral: number;
    negative: number;
  };

  categories: Record<string, number>;

  recentFeedback: {
    id: string;
    content: string;
    channel: string;
    sourceRef: string | null;
    customerLabel: string | null;
    status: string;
    sentiment: string | null;
    sentimentScore: number | null;
    category: string | null;
    summary: string | null;
    analyzedAt: string | null;
    workspaceId: string;
    createdAt: string;
    updatedAt: string;
  }[];
};

export default function DashboardPage() {
  const [dashboard, setDashboard] =
    useState<DashboardData | null>(null);

  useEffect(() => {
    async function loadDashboard() {
      const response = await fetch("/api/dashboard");
      const result = await response.json();

      if (result.success) {
        setDashboard(result);
      }
    }

    loadDashboard();
  }, []);

  if (!dashboard) {
    return (
      <main className="flex min-h-screen items-center justify-center">
        Loading Dashboard...
      </main>
    );
  }

  const pieData = {
    labels: ["Positive", "Neutral", "Negative"],

    datasets: [
      {
        data: [
          dashboard.stats.positive,
          dashboard.stats.neutral,
          dashboard.stats.negative,
        ],
      },
    ],
  };

  const barData = {
    labels: Object.keys(dashboard.categories),

    datasets: [
      {
        label: "Feedback Count",
        data: Object.values(dashboard.categories),
      },
    ],
  };

  return (
    <main className="min-h-screen bg-gray-100 p-8">
      <h1 className="mb-8 text-4xl font-bold">
        LOOP AI Dashboard
      </h1>

      {/* KPI Cards */}

      <div className="mb-8 grid grid-cols-4 gap-6">
        <div className="rounded-xl bg-white p-6 shadow">
          <h2 className="text-gray-600">
            Total Feedback
          </h2>

          <p className="mt-2 text-4xl font-bold">
            {dashboard.stats.total}
          </p>
        </div>

        <div className="rounded-xl bg-white p-6 shadow">
          <h2 className="text-gray-600">
            Positive
          </h2>

          <p className="mt-2 text-4xl font-bold text-green-600">
            {dashboard.stats.positive}
          </p>
        </div>

        <div className="rounded-xl bg-white p-6 shadow">
          <h2 className="text-gray-600">
            Neutral
          </h2>

          <p className="mt-2 text-4xl font-bold text-yellow-600">
            {dashboard.stats.neutral}
          </p>
        </div>

        <div className="rounded-xl bg-white p-6 shadow">
          <h2 className="text-gray-600">
            Negative
          </h2>

          <p className="mt-2 text-4xl font-bold text-red-600">
            {dashboard.stats.negative}
          </p>
        </div>
      </div>

      {/* Charts */}

      <div className="grid grid-cols-2 gap-8">
        <div className="rounded-xl bg-white p-6 shadow">
          <h2 className="mb-4 text-xl font-bold">
            Sentiment Distribution
          </h2>

          <Pie data={pieData} />
        </div>

        <div className="rounded-xl bg-white p-6 shadow">
          <h2 className="mb-4 text-xl font-bold">
            Feedback Categories
          </h2>

          <Bar data={barData} />
        </div>
      </div>

      {/* Recent Feedback */}

      <div className="mt-8 rounded-xl bg-white p-6 shadow">
        <h2 className="mb-4 text-2xl font-bold">
          Recent Feedback
        </h2>

        {dashboard.recentFeedback.length === 0 ? (
          <p className="text-gray-500">
            No feedback found.
          </p>
        ) : (
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b text-left">
                <th className="py-3">
                  Feedback
                </th>
                <th>Category</th>
                <th>Sentiment</th>
              </tr>
            </thead>

            <tbody>
              {dashboard.recentFeedback.map(
                (feedback) => (
                  <tr
                    key={feedback.id}
                    className="border-b"
                  >
                    <td className="py-3">
                      {feedback.content}
                    </td>

                    <td>
                      {feedback.category ??
                        "-"}
                    </td>

                    <td>
                      {feedback.sentiment ??
                        "-"}
                    </td>
                  </tr>
                )
              )}
            </tbody>
          </table>
        )}
      </div>
    </main>
  );
}