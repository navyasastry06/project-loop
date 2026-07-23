import { generateContentWithFallback } from "@/lib/gemini";

export async function analyzeFeedback(feedback: string) {
  const prompt = `
You are an AI assistant that analyzes customer feedback.

Return ONLY valid JSON.

Schema:

{
  "sentiment": "Positive | Neutral | Negative",
  "category": "UI | Performance | Bug | Feature Request | Pricing | Support | Other",
  "summary": "One sentence summary"
}

Feedback:
"${feedback}"
`;

  const mockAnalysis = () => {
    const lower = feedback.toLowerCase();
    let sentiment = "Neutral";
    if (/\b(love|great|awesome|amazing|good|happy|like|perfect|fast|helpful)\b/.test(lower)) {
      sentiment = "Positive";
    } else if (/\b(bad|slow|crash|issue|bug|error|fail|broke|hate|expensive|poor|worst)\b/.test(lower)) {
      sentiment = "Negative";
    }

    let category = "Other";
    if (/\b(slow|speed|performance|load|time|lag|delay)\b/.test(lower)) {
      category = "Performance";
    } else if (/\b(ui|design|page|layout|screen|button|color|style|look)\b/.test(lower)) {
      category = "UI";
    } else if (/\b(bug|crash|error|exception|fail|broke|broken|fix)\b/.test(lower)) {
      category = "Bug";
    } else if (/\b(price|billing|cost|subscribe|pay|plan|invoice)\b/.test(lower)) {
      category = "Pricing";
    } else if (/\b(help|support|contact|agent|service)\b/.test(lower)) {
      category = "Support";
    } else if (/\b(add|feature|want|request|hope|need|suggest)\b/.test(lower)) {
      category = "Feature Request";
    }

    const cleanText = feedback.trim();
    const summary = cleanText.length > 60 ? cleanText.substring(0, 57) + "..." : cleanText;

    return {
      sentiment,
      category,
      summary,
    };
  };

  const text = await generateContentWithFallback({
    contents: prompt,
    defaultMock: mockAnalysis,
  });

  const jsonStart = text.indexOf("{");
  const jsonEnd = text.lastIndexOf("}");

  const cleaned = text.slice(jsonStart, jsonEnd + 1);
  const analysis = JSON.parse(cleaned);

  let sentiment: "POS" | "NEU" | "NEG";

  switch (analysis.sentiment.toLowerCase()) {
    case "positive":
      sentiment = "POS";
      break;

    case "negative":
      sentiment = "NEG";
      break;

    default:
      sentiment = "NEU";
  }

  return {
    ...analysis,
    sentiment,
  };
}

export async function generateInsights(
  feedbacks: {
    content: string;
    sentiment: string | null;
    category: string | null;
  }[]
) {
  const prompt = `
You are a product analytics expert.

Analyze the following customer feedback data:

${JSON.stringify(feedbacks)}

Generate exactly 4 short business insights.

Return ONLY valid JSON.

{
  "insights": [
    "Insight 1",
    "Insight 2",
    "Insight 3",
    "Insight 4"
  ]
}
`;

  const mockInsights = () => ({
    insights: [
      "Performance issues remain a top priority, with 30% of user comments citing slow page response times in reports.",
      "Positive sentiment is driven heavily by the new semantic search engine and intuitive dashboard layout.",
      "Users are requesting custom external integrations, particularly with Slack and Jira, to automate workflows.",
      "Clearer billing settings and tier limits are recommended to resolve occasional pricing support inquiries."
    ]
  });

  const text = await generateContentWithFallback({
    contents: prompt,
    defaultMock: mockInsights,
  });

  const jsonStart = text.indexOf("{");
  const jsonEnd = text.lastIndexOf("}");

  const cleaned = text.slice(jsonStart, jsonEnd + 1);

  return JSON.parse(cleaned);
}