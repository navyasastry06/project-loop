import { NextResponse } from "next/server";

import { getCurrentSession } from "@/lib/session";
import { createFeedbackSchema } from "@/schemas/feedback.schema";
import {
  updateFeedback,
  deleteFeedback,
} from "@/services/feedback.service";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export async function PATCH(
  request: Request,
  { params }: RouteContext
) {
  try {
    const session = await getCurrentSession();

    if (!session?.user) {
      return NextResponse.json(
        {
          success: false,
          message: "Unauthorized",
        },
        {
          status: 401,
        }
      );
    }

    const { id } = await params;

    const body = await request.json();

    const validated = createFeedbackSchema.safeParse(body);

    if (!validated.success) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid input.",
          errors: validated.error.issues,
        },
        {
          status: 400,
        }
      );
    }

    const result = await updateFeedback(
      id,
      session.user.workspaceId,
      validated.data
    );

    return NextResponse.json(result);
  } catch (error) {
    console.error("Update Feedback Error:", error);

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

export async function DELETE(
  request: Request,
  { params }: RouteContext
) {
  try {
    const session = await getCurrentSession();

    if (!session?.user) {
      return NextResponse.json(
        {
          success: false,
          message: "Unauthorized",
        },
        {
          status: 401,
        }
      );
    }

    const { id } = await params;

    const result = await deleteFeedback(
      id,
      session.user.workspaceId
    );

    return NextResponse.json(result);
  } catch (error) {
    console.error("Delete Feedback Error:", error);

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