import { z } from "zod";

export const createFeedbackSchema = z.object({
  content: z
    .string()
    .trim()
    .min(5, "Feedback must be at least 5 characters.")
    .max(5000, "Feedback cannot exceed 5000 characters."),

  channel: z
    .string()
    .trim()
    .min(2, "Channel is required."),

  sourceRef: z
    .string()
    .trim()
    .optional()
    .or(z.literal("")),

  customerLabel: z
    .string()
    .trim()
    .optional()
    .or(z.literal("")),
});

export type CreateFeedbackInput = z.infer<
  typeof createFeedbackSchema
>;