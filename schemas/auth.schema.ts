import { z } from "zod";

export const signupSchema = z.object({
  workspaceName: z
    .string()
    .trim()
    .min(2, "Workspace name must be at least 2 characters"),

  name: z
    .string()
    .trim()
    .min(2, "Name must be at least 2 characters"),

  email: z
    .email("Please enter a valid email")
    .transform((email) => email.toLowerCase()),

  password: z
    .string()
    .min(8, "Password must be at least 8 characters"),
});

export type SignupInput = z.infer<typeof signupSchema>;