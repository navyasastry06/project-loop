import { NextResponse } from "next/server";
import { signup } from "@/services/auth.service";
import { signupSchema } from "@/schemas/auth.schema";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const validated = signupSchema.safeParse(body);

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

const result = await signup(validated.data);

    return NextResponse.json(result, {
      status: result.success ? 201 : 400,
    });
  } catch (error) {
    console.error("Signup API Error:", error);

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