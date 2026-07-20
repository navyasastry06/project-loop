import { prisma } from "../lib/prisma";

const sampleFeedbacks = [
  {
    content: "The monthly analytics charts are loading extremely slowly on mobile. It takes about 10 seconds to respond.",
    channel: "Mobile App",
    sentiment: "NEG" as const,
    sentimentScore: 0.12,
    category: "Performance",
    summary: "Slow charts loading on mobile devices.",
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
  },
  {
    content: "We love the new AI insights cards! They highlight the exact pain points we need to address every week.",
    channel: "Web App",
    sentiment: "POS" as const,
    sentimentScore: 0.95,
    category: "UI",
    summary: "Users love the AI insights board.",
    createdAt: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000),
  },
  {
    content: "The support team was incredibly helpful and quick when resolving our billing inquiry.",
    channel: "Support",
    sentiment: "POS" as const,
    sentimentScore: 0.98,
    category: "Support",
    summary: "Excellent billing support resolution.",
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
  },
  {
    content: "Is there any plan to support pricing plans in Euro? Currently we can only pay in USD.",
    channel: "Email",
    sentiment: "NEU" as const,
    sentimentScore: 0.5,
    category: "Pricing",
    summary: "Inquiry about Euro pricing support.",
    createdAt: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000),
  },
  {
    content: "The dashboard keeps throwing white screens on Safari. Works fine on Chrome though.",
    channel: "Web App",
    sentiment: "NEG" as const,
    sentimentScore: 0.08,
    category: "Bug",
    summary: "Safari browser white screen crashes.",
    createdAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000),
  },
  {
    content: "It would be great if we could schedule reports to be sent directly to our Slack channel.",
    channel: "Slack",
    sentiment: "NEU" as const,
    sentimentScore: 0.55,
    category: "Feature Request",
    summary: "Request for automated Slack report exports.",
    createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
  },
  {
    content: "The reports PDF export function cuts off the bottom of the charts. Please fix the layout page margins.",
    channel: "Web App",
    sentiment: "NEG" as const,
    sentimentScore: 0.2,
    category: "Bug",
    summary: "PDF exports clipping chart visuals.",
    createdAt: new Date(Date.now() - 19 * 24 * 60 * 60 * 1000),
  },
  {
    content: "Super easy onboarding flow! I was able to upload my feedback logs and see reports in under 5 minutes.",
    channel: "Website",
    sentiment: "POS" as const,
    sentimentScore: 0.96,
    category: "UI",
    summary: "Smooth onboarding and rapid reporting.",
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
  },
  {
    content: "The subscription pricing is too high for smaller agencies. Suggest adding a lower tier plan.",
    channel: "Support",
    sentiment: "NEG" as const,
    sentimentScore: 0.3,
    category: "Pricing",
    summary: "Request for cheaper starter tier plans.",
    createdAt: new Date(Date.now() - 32 * 24 * 60 * 60 * 1000),
  },
  {
    content: "The semantic search matches exactly what I mean, even when using synonyms. Impressive technology.",
    channel: "Web App",
    sentiment: "POS" as const,
    sentimentScore: 0.94,
    category: "Feature Request",
    summary: "Highly satisfied with synonym-matching search.",
    createdAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000),
  }
];

async function seed() {
  try {
    const workspaces = await prisma.workspace.findMany();
    if (workspaces.length === 0) {
      console.log("No workspace found. Please register an account first via the UI.");
      return;
    }

    console.log(`Found ${workspaces.length} workspaces. Seeding each workspace that has 0 feedback items...`);

    for (const ws of workspaces) {
      const count = await prisma.feedback.count({
        where: { workspaceId: ws.id },
      });

      if (count > 0) {
        console.log(`Workspace: ${ws.name} (${ws.id}) already has ${count} feedbacks. Skipping.`);
        continue;
      }

      console.log(`Seeding 10 feedback items for workspace: ${ws.name} (${ws.id})`);
      for (const item of sampleFeedbacks) {
        const fb = await prisma.feedback.create({
          data: {
            content: item.content,
            channel: item.channel,
            status: "NEW",
            sentiment: item.sentiment,
            sentimentScore: item.sentimentScore,
            category: item.category,
            summary: item.summary,
            analyzedAt: new Date(),
            workspaceId: ws.id,
            createdAt: item.createdAt,
          }
        });

        const dummyVector = Array.from({ length: 3072 }, () => Math.random() - 0.5);

        await prisma.embedding.create({
          data: {
            feedbackId: fb.id,
            vector: dummyVector,
          }
        });
      }
    }

    console.log("Seeding process completed!");
  } catch (error) {
    console.error("Failed to seed database:", error);
  } finally {
    await prisma.$disconnect();
  }
}

seed();
