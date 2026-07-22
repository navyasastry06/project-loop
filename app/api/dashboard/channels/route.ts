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