import { NextResponse } from "next/server";

import { getCurrentSession } from "@/lib/session";
import { askLoop } from "@/services/ask-loop.service";

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

    if (!body.question) {
      return NextResponse.json(
        {
          success: false,
          message: "Question required.",
        },
        { status: 400 }
      );
    }

    const result = await askLoop(body.question, session.user.workspaceId);

    return NextResponse.json({
      success: true,
      ...result,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to answer question.",
      },
      {
        status: 500,
      }
    );
  }
}