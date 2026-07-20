import { NextResponse } from "next/server";
import { semanticSearch } from "@/services/search.service";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const query = searchParams.get("q");

  if (!query) {
    return NextResponse.json({
      success: false,
      message: "Query required",
    });
  }

  const results = await semanticSearch(query);

  return NextResponse.json({
    success: true,
    results,
  });
}