import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";

import { prisma } from "@/lib/prisma";
import { getCurrentSession } from "@/lib/session";
import {
  canManageUsers,
  type UserRole,
} from "@/lib/permissions";

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

    if (!canManageUsers(session.user.role as UserRole)) {
      return NextResponse.json(
        {
          success: false,
          message: "Forbidden",
        },
        { status: 403 }
      );
    }

    const body = await request.json();

    const {
      name,
      email,
      password,
      role,
    } = body;

        if (
      !name ||
      !email ||
      !password ||
      !role
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "All fields are required.",
        },
        { status: 400 }
      );
    }

        const existingUser =
      await prisma.user.findUnique({
        where: {
          email,
        },
      });

    if (existingUser) {
      return NextResponse.json(
        {
          success: false,
          message: "User already exists.",
        },
        { status: 400 }
      );
    }

        const passwordHash =
      await bcrypt.hash(password, 10);

          const user =
      await prisma.user.create({
        data: {
          name,
          email,
          passwordHash,
          role,
          workspaceId:
            session.user.workspaceId,
        },
      });

    return NextResponse.json({
      success: true,
      message: "User invited successfully.",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });

  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to invite user.",
      },
      {
        status: 500,
      }
    );
  }
}