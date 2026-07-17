import { NextResponse } from "next/server";

import { getCurrentSession } from "@/lib/session";
import { createFeedbackSchema } from "@/schemas/feedback.schema";
import {
  createFeedback,
  getFeedbacks,
} from "@/services/feedback.service";


export async function POST(request: Request) {
  try {
    const session = await getCurrentSession();
    console.log("SESSION:", JSON.stringify(session, null, 2));

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

    const result = await createFeedback(
      validated.data,
      session.user.workspaceId
    );

    return NextResponse.json(result, {
      status: 201,
    });
  } catch (error) {
    console.error("Create Feedback Error:", error);

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

export async function GET() {
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

    const result = await getFeedbacks(
      session.user.workspaceId
    );

    return NextResponse.json(result);
  } catch (error) {
    console.error("Get Feedback Error:", error);

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