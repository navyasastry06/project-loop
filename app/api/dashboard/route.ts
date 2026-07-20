import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { getCurrentSession } from "@/lib/session";

export async function GET() {
  try {
    const session = await getCurrentSession();

    if (!session?.user) {
      return NextResponse.json(
        {
          success: false,
          message: "Unauthorized",
        },
        { status: 401 }
      );
    }

    const workspaceId = session.user.workspaceId;

    const feedbacks = await prisma.feedback.findMany({
      where: {
        workspaceId,
      },
    });

    const total = feedbacks.length;

    const positive = feedbacks.filter(
      (f) => f.sentiment === "POS"
    ).length;

    const neutral = feedbacks.filter(
      (f) => f.sentiment === "NEU"
    ).length;

    const negative = feedbacks.filter(
      (f) => f.sentiment === "NEG"
    ).length;

    const categoryCounts: Record<string, number> = {};

    feedbacks.forEach((feedback) => {
      if (!feedback.category) return;

      categoryCounts[feedback.category] =
        (categoryCounts[feedback.category] ?? 0) + 1;
    });

    const recentFeedback = await prisma.feedback.findMany({
  where: {
    workspaceId,
  },
  orderBy: {
    createdAt: "desc",
  },
  take: 5,
});

    return NextResponse.json({
      success: true,

  stats: {
    total,
    positive,
    neutral,
    negative,
  },

  categories: categoryCounts,

  recentFeedback,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message: "Internal server error",
      },
      {
        status: 500,
      }
    );
  }
}