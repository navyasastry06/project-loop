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

    const themes = await prisma.theme.findMany({
      where: { workspaceId },
      include: {
        feedbacks: {
          include: {
            feedback: {
              select: {
                sentiment: true,
                createdAt: true,
              },
            },
          },
        },
      },
      orderBy: { name: "asc" },
    });

    const now = new Date();
    const thirtyDaysAgo = new Date(
      now.getTime() - 30 * 24 * 60 * 60 * 1000
    );
    const sixtyDaysAgo = new Date(
      now.getTime() - 60 * 24 * 60 * 60 * 1000
    );

    const trends = themes.map((theme) => {
      const total = theme.feedbacks.length;

      const positive = theme.feedbacks.filter(
        (ft) => ft.feedback.sentiment === "POS"
      ).length;

      const neutral = theme.feedbacks.filter(
        (ft) => ft.feedback.sentiment === "NEU"
      ).length;

      const negative = theme.feedbacks.filter(
        (ft) => ft.feedback.sentiment === "NEG"
      ).length;

      const recentCount = theme.feedbacks.filter(
        (ft) => ft.feedback.createdAt >= thirtyDaysAgo
      ).length;

      const previousCount = theme.feedbacks.filter(
        (ft) =>
          ft.feedback.createdAt >= sixtyDaysAgo &&
          ft.feedback.createdAt < thirtyDaysAgo
      ).length;

      let growth: "rising" | "stable" | "declining" =
        "stable";

      if (previousCount > 0) {
        const change =
          ((recentCount - previousCount) / previousCount) *
          100;

        if (change > 15) growth = "rising";
        else if (change < -15) growth = "declining";
      } else if (recentCount > 0) {
        growth = "rising";
      }

      return {
        id: theme.id,
        name: theme.name,
        color: theme.color,
        description: theme.description,
        total,
        sentiment: { positive, neutral, negative },
        recentCount,
        growth,
      };
    });

    trends.sort((a, b) => b.total - a.total);

    return NextResponse.json({
      success: true,
      trends,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch theme trends.",
      },
      { status: 500 }
    );
  }
}
