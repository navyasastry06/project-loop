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

    const feedbackCount = await prisma.feedback.count({
      where: {
        workspaceId,
      },
    });

    const analyzedCount = await prisma.feedback.count({
      where: {
        workspaceId,
        analyzedAt: {
          not: null,
        },
      },
    });

    const pendingAnalysis = feedbackCount - analyzedCount;

    const latestAnalysis = await prisma.feedback.findFirst({
      where: {
        workspaceId,
        analyzedAt: {
          not: null,
        },
      },
      orderBy: {
        analyzedAt: "desc",
      },
      select: {
        analyzedAt: true,
      },
    });

    return NextResponse.json({
      success: true,
      workspace: {
        feedbackCount,
        analyzedCount,
        pendingAnalysis,
        lastAnalysis: latestAnalysis?.analyzedAt ?? null,
      },
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message: "Internal server error.",
      },
      {
        status: 500,
      }
    );
  }
}