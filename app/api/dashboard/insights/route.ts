import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { getCurrentSession } from "@/lib/session";
import { generateInsights } from "@/services/ai.service";

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

    return NextResponse.json({
      success: true,
      insights,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to generate insights.",
      },
      { status: 500 }
    );
  }
}