import { NextResponse } from "next/server";
import { getCurrentSession } from "@/lib/session";
import { semanticSearch } from "@/services/search.service";

export async function GET(request: Request) {
  try {
    const session = await getCurrentSession();

    if (!session?.user) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q");

    if (!query || query.trim().length === 0) {
      return NextResponse.json(
        { success: false, message: "Query is required." },
        { status: 400 }
      );
    }

    const results = await semanticSearch(
      query,
      session.user.workspaceId
    );

    return NextResponse.json({
      success: true,
      query,
      count: results.length,
      results: results.map((item) => ({
        id: item.feedback.id,
        content: item.feedback.content,
        channel: item.feedback.channel,
        sentiment: item.feedback.sentiment,
        category: item.feedback.category,
        summary: item.feedback.summary,
        score: Number(item.score.toFixed(3)),
        createdAt: item.feedback.createdAt,
      })),
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Search failed." },
      { status: 500 }
    );
  }
}