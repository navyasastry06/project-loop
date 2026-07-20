import { NextResponse } from "next/server";
import { generateEmbedding } from "@/services/embedding.service";

export async function GET() {
  const vector = await generateEmbedding(
    "The dashboard is very slow."
  );

  return NextResponse.json({
    dimensions: vector.length,
    sample: vector.slice(0, 10),
  });
}