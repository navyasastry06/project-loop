import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { getCurrentSession } from "@/lib/session";
import { analyzeFeedback } from "@/services/ai.service";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
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

    const { id } = await params;

    const feedback = await prisma.feedback.findFirst({
      where: {
        id,
        workspaceId: session.user.workspaceId,
      },
    });

    if (!feedback) {
      return NextResponse.json(
        {
          success: false,
          message: "Feedback not found.",
        },
        { status: 404 }
      );
    }

    const analysis = await analyzeFeedback(feedback.content);

    await prisma.feedback.update({
      where: {
        id,
      },
      data: {
        sentiment: analysis.sentiment,
        category: analysis.category,
        summary: analysis.summary,
        analyzedAt: new Date(),
      },
    });

    return NextResponse.json({
      success: true,
      message: "Feedback re-analyzed successfully.",
      analysis,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message: "Internal server error.",
      },
      { status: 500 }
    );
  }
}