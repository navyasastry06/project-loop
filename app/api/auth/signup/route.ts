import { NextResponse } from "next/server";
import { signup } from "@/services/auth.service";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const result = await signup(body);

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