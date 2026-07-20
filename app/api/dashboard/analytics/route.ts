import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentSession } from "@/lib/session";

export async function GET() {
  try {
    const session = await getCurrentSession();

    if (!session?.user) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const workspaceId = session.user.workspaceId;

    const feedbacks = await prisma.feedback.findMany({
      where: { workspaceId },
      select: {
        sentiment: true,
        category: true,
        createdAt: true,
      },
      orderBy: { createdAt: "asc" },
    });

    const sentimentTimeline: Record<
      string,
      { positive: number; neutral: number; negative: number }
    > = {};

    const categoryTimeline: Record<
      string,
      Record<string, number>
    > = {};

    const monthlyVolume: Record<string, number> = {};
    const weeklyVolume: Record<string, number> = {};

    for (const fb of feedbacks) {
      const date = fb.createdAt;
      const day = date.toISOString().split("T")[0];
      const month = day.substring(0, 7);

      const startOfWeek = new Date(date);
      startOfWeek.setDate(
        date.getDate() - date.getDay()
      );
      const week = startOfWeek
        .toISOString()
        .split("T")[0];

      if (!sentimentTimeline[day]) {
        sentimentTimeline[day] = {
          positive: 0,
          neutral: 0,
          negative: 0,
        };
      }

      if (fb.sentiment === "POS")
        sentimentTimeline[day].positive++;
      else if (fb.sentiment === "NEU")
        sentimentTimeline[day].neutral++;
      else if (fb.sentiment === "NEG")
        sentimentTimeline[day].negative++;

      if (!categoryTimeline[day]) {
        categoryTimeline[day] = {};
      }

      if (fb.category) {
        categoryTimeline[day][fb.category] =
          (categoryTimeline[day][fb.category] || 0) + 1;
      }

      monthlyVolume[month] =
        (monthlyVolume[month] || 0) + 1;

      weeklyVolume[week] =
        (weeklyVolume[week] || 0) + 1;
    }

    const totalFeedback = feedbacks.length;

    const sentimentTotals = {
      positive: feedbacks.filter(
        (f) => f.sentiment === "POS"
      ).length,
      neutral: feedbacks.filter(
        (f) => f.sentiment === "NEU"
      ).length,
      negative: feedbacks.filter(
        (f) => f.sentiment === "NEG"
      ).length,
      unanalyzed: feedbacks.filter(
        (f) => f.sentiment === null
      ).length,
    };

    const categoryTotals: Record<string, number> = {};
    for (const fb of feedbacks) {
      if (fb.category) {
        categoryTotals[fb.category] =
          (categoryTotals[fb.category] || 0) + 1;
      }
    }

    return NextResponse.json({
      success: true,
      analytics: {
        totalFeedback,
        sentimentTotals,
        categoryTotals,
        sentimentTimeline,
        categoryTimeline,
        monthlyVolume,
        weeklyVolume,
      },
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "Failed to load analytics.",
      },
      { status: 500 }
    );
  }
}
