import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { getCurrentSession } from "@/lib/session";

export async function GET(request: Request) {
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

    const { searchParams } = new URL(request.url);
    const startStr = searchParams.get("start");
    const endStr = searchParams.get("end");

    const workspaceId = session.user.workspaceId;

    const whereClause: any = {
      workspaceId,
    };

    if (startStr || endStr) {
      const dateFilter: any = {};
      if (startStr) dateFilter.gte = new Date(startStr);
      if (endStr) dateFilter.lte = new Date(endStr);
      whereClause.createdAt = dateFilter;
    }

    const feedbacks = await prisma.feedback.findMany({
      where: whereClause,
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
      where: whereClause,
      orderBy: {
        createdAt: "desc",
      },
      take: 5,
    });

    const recentReports = await prisma.report.findMany({
      where: whereClause,
      orderBy: {
        createdAt: "desc",
      },
      take: 5,
      include: {
        generatedBy: {
          select: {
            name: true,
            email: true,
          },
        },
      },
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
      recentReports,
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