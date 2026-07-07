import { NextResponse } from "next/server";
import { login } from "@/services/auth.service";
import { loginSchema } from "@/schemas/auth.schema";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const validated = loginSchema.safeParse(body);

    if (!validated.success) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid form data.",
          errors: validated.error.issues,
        },
        {
          status: 400,
        }
      );
    }

    const result = await login(validated.data);

    return NextResponse.json(result, {
      status: result.success ? 200 : 400,
    });
  } catch (error) {
    console.error("Login API Error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Internal server error",
      },
      {
        status: 500,
      }
    );
  }
}