import { prisma } from "@/lib/prisma";
import type { CreateFeedbackInput } from "@/schemas/feedback.schema";

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
  const feedback = await prisma.feedback.updateMany({
    where: {
      id,
      workspaceId,
    },
    data: {
      content: data.content,
      channel: data.channel,
      sourceRef: data.sourceRef || null,
      customerLabel: data.customerLabel || null,
    },
  });

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