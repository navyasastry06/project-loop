import { prisma } from "../lib/prisma";
import bcrypt from "bcrypt";
import { generateEmbedding } from "../services/embedding.service";

const positivePhrases = [
  "The system is extremely fast and responsive.",
  "I really love the new executive insights on the dashboard.",
  "The customer support team helped me resolve my billing issue immediately.",
  "Onboarding was super smooth and took less than 5 minutes.",
  "Semantic search matches exactly what I mean every time.",
  "The report PDF download is beautifully formatted and very clear.",
  "Great job on the new interface, it looks clean and premium.",
  "I am impressed by the speed of the AI categorization.",
  "We are seeing a lot of value from the theme trends dashboard.",
  "The user invitation flow is simple and works perfectly.",
];

const neutralPhrases = [
  "The application works as expected, but the layout could be improved.",
  "Is there any plan to support payments in Euro in the future?",
  "The dashboard is okay, though I prefer the previous design.",
  "We imported our logs from last month without any major issues.",
  "The reports are generated fine, but we need more customization options.",
  "Can we configure daily email summaries of the feedback logs?",
  "I noticed a slight delay when searching for specific terms.",
  "The documentation is clear, but could include more screenshots.",
  "We are currently reviewing the pricing tiers for our team.",
  "The dark mode is decent, but some borders are hard to see.",
];

const negativePhrases = [
  "The charts keep taking forever to load on my mobile screen.",
  "I got a white screen crash when trying to access reports on Safari.",
  "The PDF export cuts off the bottom of the insights page.",
  "The subscription pricing is way too high for small teams.",
  "I had trouble inviting a new member; the page threw an obscure error.",
  "Fuzzy search is returning irrelevant results for simple queries.",
  "The theme clustering service is grouping unrelated billing feedbacks.",
  "I keep getting logged out of my session every hour.",
  "The CSV import fails without giving any clear validation errors.",
  "The navigation sidebar is confusing and hard to use.",
];

const channels = ["Mobile App", "Web App", "Support", "Email", "Slack", "Community"];
const customerLabels = ["Enterprise", "Startup", "SMB", "Free"];
const categories = ["Performance", "UI", "Support", "Pricing", "Bug", "Feature Request"];

async function main() {
  console.log("Starting seed script...");
  const passwordHash = await bcrypt.hash("password123", 10);

  let workspace = await prisma.workspace.findFirst({
    where: { name: "Acme Corporation" },
  });

  if (!workspace) {
    workspace = await prisma.workspace.create({
      data: { name: "Acme Corporation" },
    });
    console.log("Created workspace Acme Corporation");
  } else {
    console.log("Workspace Acme Corporation already exists");
  }

  const usersToCreate = [
    { name: "Demo Admin", email: "admin@example.com", role: "ADMIN" as const },
    { name: "Demo Analyst", email: "analyst@example.com", role: "ANALYST" as const },
    { name: "Demo Viewer", email: "viewer@example.com", role: "VIEWER" as const },
  ];

  for (const userData of usersToCreate) {
    const existingUser = await prisma.user.findUnique({
      where: { email: userData.email },
    });
    if (!existingUser) {
      await prisma.user.create({
        data: {
          name: userData.name,
          email: userData.email,
          passwordHash,
          role: userData.role,
          workspaceId: workspace.id,
        },
      });
      console.log(`Created user ${userData.email}`);
    } else {
      console.log(`User ${userData.email} already exists`);
    }
  }

  const themesToCreate = [
    { name: "Performance", description: "Feedback regarding system speed, response times, and loading states.", color: "#64748B" },
    { name: "Billing", description: "Feedback about invoices, payment options, and pricing plans.", color: "#EF4444" },
    { name: "Authentication", description: "Feedback about login, signup, passwords, and sessions.", color: "#F97316" },
    { name: "User Experience", description: "General user interface layout, design, and usability comments.", color: "#10B981" },
    { name: "Security", description: "Concerns or suggestions regarding data protection and workspace safety.", color: "#3B82F6" },
    { name: "Reporting", description: "Feedback on PDF downloads, executive insight cards, and export features.", color: "#A855F7" },
  ];

  for (const themeData of themesToCreate) {
    const existingTheme = await prisma.theme.findFirst({
      where: { workspaceId: workspace.id, name: themeData.name },
    });
    if (!existingTheme) {
      await prisma.theme.create({
        data: {
          name: themeData.name,
          description: themeData.description,
          color: themeData.color,
          workspaceId: workspace.id,
        },
      });
      console.log(`Created theme ${themeData.name}`);
    } else {
      console.log(`Theme ${themeData.name} already exists`);
    }
  }

  const feedbackCount = await prisma.feedback.count({
    where: { workspaceId: workspace.id },
  });

  if (feedbackCount === 0) {
    console.log("Seeding 120 feedback items and embeddings...");
    const records = [];

    for (let i = 0; i < 54; i++) {
      const phrase = positivePhrases[i % positivePhrases.length];
      records.push({
        content: `${phrase} (Sample Reference: #${i + 1})`,
        sentiment: "POS" as const,
        sentimentScore: 0.8 + Math.random() * 0.2,
      });
    }

    for (let i = 0; i < 30; i++) {
      const phrase = neutralPhrases[i % neutralPhrases.length];
      records.push({
        content: `${phrase} (Sample Reference: #${i + 1})`,
        sentiment: "NEU" as const,
        sentimentScore: 0.4 + Math.random() * 0.2,
      });
    }

    for (let i = 0; i < 36; i++) {
      const phrase = negativePhrases[i % negativePhrases.length];
      records.push({
        content: `${phrase} (Sample Reference: #${i + 1})`,
        sentiment: "NEG" as const,
        sentimentScore: Math.random() * 0.3,
      });
    }

    for (let i = 0; i < records.length; i++) {
      const item = records[i];
      const channel = channels[i % channels.length];
      const customerLabel = customerLabels[i % customerLabels.length];
      const category = categories[i % categories.length];

      const fb = await prisma.feedback.create({
        data: {
          content: item.content,
          channel,
          customerLabel,
          status: "NEW" as const,
          sentiment: item.sentiment,
          sentimentScore: item.sentimentScore,
          category,
          summary: `Summary for feedback #${i + 1}`,
          workspaceId: workspace.id,
          analyzedAt: new Date(),
          createdAt: new Date(Date.now() - (i % 30) * 24 * 60 * 60 * 1000),
        },
      });

      let vector;
      try {
        vector = await generateEmbedding(item.content);
        await new Promise((resolve) => setTimeout(resolve, 300)); // Rate limit buffer
      } catch (e) {
        const dummyVector = Array.from({ length: 3072 }, () => Math.random() - 0.5);
        const magnitude = Math.sqrt(dummyVector.reduce((sum, val) => sum + val * val, 0));
        vector = dummyVector.map((val) => val / (magnitude || 1));
      }

      await prisma.embedding.create({
        data: {
          feedbackId: fb.id,
          vector,
        },
      });
      if ((i + 1) % 20 === 0) {
        console.log(`Seeded ${i + 1} / 120 feedbacks and embeddings...`);
      }
    }
  } else {
    console.log(`Workspace already has ${feedbackCount} feedbacks. Skipping feedback seeding.`);
  }

  console.log("Database seeding completed successfully!");
  process.exit(0);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
