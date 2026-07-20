import { NextRequest, NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { getCurrentSession } from "@/lib/session";

export async function POST(request: NextRequest) {
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

    const {
      feedbackId,
      themeId,
      confidence,
    } = await request.json();

    const assignment =
      await prisma.feedbackTheme.create({
        data: {
          feedbackId,
          themeId,
          confidence: confidence ?? 1,
        },
      });

    return NextResponse.json({
      success: true,
      assignment,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to assign theme.",
      },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
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

    const {
      feedbackId,
      themeId,
    } = await request.json();

    await prisma.feedbackTheme.delete({
      where: {
        feedbackId_themeId: {
          feedbackId,
          themeId,
        },
      },
    });

    return NextResponse.json({
      success: true,
      message: "Theme removed successfully.",
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to remove theme.",
      },
      { status: 500 }
    );
  }
}