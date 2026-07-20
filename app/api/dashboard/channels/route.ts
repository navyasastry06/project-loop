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

    const feedbacks = await prisma.feedback.findMany({
      where: {
        workspaceId: session.user.workspaceId,
      },
      select: {
        channel: true,
      },
    });

    const channels: Record<string, number> = {};

    feedbacks.forEach((feedback) => {
      channels[feedback.channel] =
        (channels[feedback.channel] || 0) + 1;
    });

    return NextResponse.json({
      success: true,
      channels,
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