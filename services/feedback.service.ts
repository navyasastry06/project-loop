import { prisma } from "@/lib/prisma";
import type { CreateFeedbackInput } from "@/schemas/feedback.schema";
import { generateEmbedding } from "@/services/embedding.service";

export async function createFeedback(
  data: CreateFeedbackInput,
  workspaceId: string
) {
  const feedback = await prisma.feedback.create({
    data: {
      content: data.content,
      channel: data.channel,
      sourceRef: data.sourceRef || null,
      customerLabel: data.customerLabel || null,
      workspaceId,
    },
  });

  const vector = await generateEmbedding(data.content);

  await prisma.embedding.create({
    data: {
      feedbackId: feedback.id,
      vector,
    },
  });

  return {
    success: true,
    message: "Feedback created successfully.",
    feedback,
  };
}

export async function getFeedbacks(workspaceId: string) {
  const feedbacks = await prisma.feedback.findMany({
    where: {
      workspaceId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return {
    success: true,
    feedbacks,
  };
}

export async function updateFeedback(
  id: string,
  workspaceId: string,
  data: CreateFeedbackInput
) {
  const updateData: any = {
    content: data.content,
    channel: data.channel,
    sourceRef: data.sourceRef || null,
    customerLabel: data.customerLabel || null,
  };

  if (data.status) {
    updateData.status = data.status;
  }

  const feedback = await prisma.feedback.updateMany({
    where: {
      id,
      workspaceId,
    },
    data: updateData,
  });

  try {
    const vector = await generateEmbedding(data.content);
    await prisma.embedding.upsert({
      where: { feedbackId: id },
      update: { vector },
      create: {
        feedbackId: id,
        vector,
      },
    });
  } catch (error) {
    console.error("Failed to update embedding vector:", error);
  }

  return {
    success: true,
    message: "Feedback updated successfully.",
    feedback,
  };
}

export async function deleteFeedback(
  id: string,
  workspaceId: string
) {
  await prisma.feedback.deleteMany({
    where: {
      id,
      workspaceId,
    },
  });

  return {
    success: true,
    message: "Feedback deleted successfully.",
  };
}

export async function saveAnalysis(
  id: string,
  workspaceId: string,
  analysis: {
    sentiment: "POS" | "NEU" | "NEG";
    category: string;
    summary: string;
  }
) {
  const feedback = await prisma.feedback.updateMany({
    where: {
      id,
      workspaceId,
    },
    data: {
      sentiment: analysis.sentiment,
      category: analysis.category,
      summary: analysis.summary,
      analyzedAt: new Date(),
    },
  });

  return {
    success: true,
    feedback,
  };
}