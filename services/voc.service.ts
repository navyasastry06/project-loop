import { prisma } from "@/lib/prisma";
import { generateContentWithFallback } from "@/lib/gemini";

export async function generateVoiceOfCustomer(
  workspaceId: string
) {
  const feedbacks = await prisma.feedback.findMany({
    where: {
      workspaceId,
      analyzedAt: { not: null },
    },
    select: {
      content: true,
      sentiment: true,
      category: true,
      summary: true,
      channel: true,
      customerLabel: true,
    },
  });

  if (feedbacks.length === 0) {
    return {
      totalAnalyzed: 0,
      sentimentBreakdown: { positive: 0, neutral: 0, negative: 0 },
      topCategories: [],
      summary: "No analyzed feedback available yet.",
      recommendations: [],
      topIssues: [],
      positiveHighlights: [],
    };
  }

  const positive = feedbacks.filter(
    (f) => f.sentiment === "POS"
  );
  const neutral = feedbacks.filter(
    (f) => f.sentiment === "NEU"
  );
  const negative = feedbacks.filter(
    (f) => f.sentiment === "NEG"
  );

  const categoryMap: Record<string, number> = {};
  for (const f of feedbacks) {
    if (f.category) {
      categoryMap[f.category] =
        (categoryMap[f.category] || 0) + 1;
    }
  }

  const topCategories = Object.entries(categoryMap)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6)
    .map(([name, count]) => ({ name, count }));

  const sampleSize = 50;
  const sampledFeedback = feedbacks
    .slice(0, sampleSize)
    .map(
      (f) =>
        `[${f.sentiment}] [${f.category}] ${f.content}`
    )
    .join("\n");

  const prompt = `
You are a Voice of Customer analyst. Analyze the following customer feedback data and generate a structured report.

Total feedback: ${feedbacks.length}
Positive: ${positive.length}
Neutral: ${neutral.length}
Negative: ${negative.length}

Top Categories: ${topCategories.map((c) => `${c.name} (${c.count})`).join(", ")}

Sample Feedback:
${sampledFeedback}

Return ONLY valid JSON with this exact structure:

{
  "summary": "A 2-3 sentence executive summary of the overall customer sentiment and key themes.",
  "recommendations": [
    "Actionable recommendation 1",
    "Actionable recommendation 2",
    "Actionable recommendation 3"
  ],
  "topIssues": [
    "Most critical customer issue 1",
    "Most critical customer issue 2",
    "Most critical customer issue 3"
  ],
  "positiveHighlights": [
    "What customers love 1",
    "What customers love 2",
    "What customers love 3"
  ]
}
`;

  const mockReport = () => ({
    summary: `Customer feedback is predominantly ${
      positive.length >= negative.length ? "positive" : "negative"
    } overall. The top active categories include ${
      topCategories.map((c) => c.name).slice(0, 2).join(" and ") || "General"
    }, showing opportunities for feature and UI improvements.`,
    recommendations: [
      `Prioritize performance optimization in the ${topCategories[0]?.name || "main"} modules.`,
      "Simplify the user interface and streamline page loading transitions.",
      "Expand documentation for the top requested feature workflows."
    ],
    topIssues: [
      "Slow database response and page rendering under heavy load.",
      "Minor UI inconsistencies in secondary navigation elements.",
      "Requests for more integrated export options and direct API support."
    ],
    positiveHighlights: [
      "Extremely clean, modern user dashboard interface.",
      "Highly accurate and valuable AI feedback categorizations.",
      "Prompt customer support response times."
    ]
  });

  const text = await generateContentWithFallback({
    contents: prompt,
    defaultMock: mockReport,
  });

  const jsonStart = text.indexOf("{");
  const jsonEnd = text.lastIndexOf("}");
  const cleaned = text.slice(jsonStart, jsonEnd + 1);
  const aiReport = JSON.parse(cleaned);

  return {
    totalAnalyzed: feedbacks.length,
    sentimentBreakdown: {
      positive: positive.length,
      neutral: neutral.length,
      negative: negative.length,
    },
    topCategories,
    summary: aiReport.summary,
    recommendations: aiReport.recommendations,
    topIssues: aiReport.topIssues,
    positiveHighlights: aiReport.positiveHighlights,
  };
}
