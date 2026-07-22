import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { getCurrentSession } from "@/lib/session";
import { generateInsights } from "@/services/ai.service";
import {
  canManageReports,
  type UserRole,
} from "@/lib/permissions";
import { handleApiError } from "@/utils/api-error";

export async function POST() {
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

    if (!canManageReports(session.user.role as UserRole)) {
      return NextResponse.json(
        {
          success: false,
          message: "Forbidden",
        },
        { status: 403 }
      );
    }

    const feedbacks = await prisma.feedback.findMany({
      where: {
        workspaceId: session.user.workspaceId,
      },
      select: {
        content: true,
        sentiment: true,
        category: true,
      },
    });

    const insights = await generateInsights(feedbacks);

    const totalFeedback = feedbacks.length;

    const positive = feedbacks.filter(
      (f) => f.sentiment === "POS"
    ).length;

    const neutral = feedbacks.filter(
      (f) => f.sentiment === "NEU"
    ).length;

    const negative = feedbacks.filter(
      (f) => f.sentiment === "NEG"
    ).length;

    const report = await prisma.report.create({
      data: {
        title: `Report ${new Date().toLocaleDateString()}`,

        periodStart: new Date(),

        periodEnd: new Date(),

        workspaceId: session.user.workspaceId,

        generatedById: session.user.id,

        contentJson: {
          totalFeedback,
          positive,
          neutral,
          negative,
          insights,
        },
      },
    });

    return NextResponse.json({
      success: true,
      report,
    });
  } catch (error) {
    return handleApiError(error, "Failed to generate report.");
  }
}