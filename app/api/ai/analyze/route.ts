import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { analyzeFeedback } from "@/services/ai.service";
import { getCurrentSession } from "@/lib/session";
import { saveAnalysis } from "@/services/feedback.service";

export async function POST(request: Request) {
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

    const body = await request.json();

    if (!body.id || !body.feedback) {
      return NextResponse.json(
        {
          success: false,
          message: "Feedback id and text are required.",
        },
        { status: 400 }
      );
    }

    const analysis = await analyzeFeedback(body.feedback);
    await saveAnalysis(
  body.id,
  session.user.workspaceId,
  analysis
);

    return NextResponse.json({
      success: true,
      analysis,
    });
  } catch (error) {
    console.error("AI Analysis Error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Internal server error.",
      },
      { status: 500 }
    );
  }
}