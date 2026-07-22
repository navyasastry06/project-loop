import { NextResponse } from "next/server";

export function handleApiError(error: any, defaultMessage: string) {
  console.error(error);
  
  const errorMessage = error?.message || String(error);
  const isRateLimit = 
    error?.status === 429 ||
    errorMessage.includes("429") ||
    errorMessage.includes("quota") ||
    errorMessage.includes("RESOURCE_EXHAUSTED") ||
    errorMessage.includes("limit") ||
    errorMessage.includes("quota exceeded");

  if (isRateLimit) {
    return NextResponse.json(
      {
        success: false,
        message: "Gemini API rate limit or daily free tier quota exceeded. Please wait a few seconds before retrying, or verify your billing plan settings.",
      },
      { status: 429 }
    );
  }

  return NextResponse.json(
    {
      success: false,
      message: defaultMessage,
    },
    { status: 500 }
  );
}
