import { NextRequest, NextResponse } from "next/server";

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

    const themes = await prisma.theme.findMany({
      where: {
        workspaceId: session.user.workspaceId,
      },
      orderBy: {
        name: "asc",
      },
    });

    return NextResponse.json({
      success: true,
      themes,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch themes.",
      },
      { status: 500 }
    );
  }
}

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

    const body = await request.json();

    const {
      name,
      description,
      color,
    } = body;

    if (!name) {
      return NextResponse.json(
        {
          success: false,
          message: "Theme name is required.",
        },
        { status: 400 }
      );
    }

    const theme = await prisma.theme.create({
      data: {
        name,
        description,
        color,
        workspaceId: session.user.workspaceId,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Theme created successfully.",
      theme,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to create theme.",
      },
      { status: 500 }
    );
  }
}
