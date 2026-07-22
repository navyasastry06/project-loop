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

    const userId = session.user.id;
    const workspaceId = session.user.workspaceId;

    // Fetch user details from DB
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        name: true,
        email: true,
        role: true,
        createdAt: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "User not found",
        },
        { status: 404 }
      );
    }

    // Fetch workspace details
    const workspace = await prisma.workspace.findUnique({
      where: { id: workspaceId },
      select: {
        id: true,
        name: true,
      },
    });

    if (!workspace) {
      return NextResponse.json(
        {
          success: false,
          message: "Workspace not found",
        },
        { status: 404 }
      );
    }

    // Run count queries in parallel
    const [totalUsers, totalFeedback] = await Promise.all([
      prisma.user.count({
        where: { workspaceId },
      }),
      prisma.feedback.count({
        where: { workspaceId },
      }),
    ]);

    return NextResponse.json({
      success: true,
      user: {
        name: user.name,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt,
      },
      workspace: {
        id: workspace.id,
        name: workspace.name,
        totalUsers,
        totalFeedback,
      },
    });
  } catch (error) {
    console.error("Error in GET /api/settings:", error);

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
