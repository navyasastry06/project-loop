import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { getCurrentSession } from "@/lib/session";
import { analyzeFeedback } from "@/services/ai.service";

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

    const workspaceId = session.user.workspaceId;

    const feedbacks = await prisma.feedback.findMany({
      where: {
        workspaceId,
        analyzedAt: null,
      },
    });

    let processed = 0;

    for (const feedback of feedbacks) {
      const analysis = await analyzeFeedback(feedback.content);

      await prisma.feedback.update({
        where: {
          id: feedback.id,
        },
        data: {
          sentiment: analysis.sentiment,
          category: analysis.category,
          summary: analysis.summary,
          analyzedAt: new Date(),
        },
      });

      processed++;
    }

    return NextResponse.json({
      success: true,
      processed,
      message: `${processed} feedback analyzed successfully.`,
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