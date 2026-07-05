import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/utils/hash";
import type { SignupInput } from "@/schemas/auth.schema";

export async function signup(data: SignupInput) {
  const existingUser = await prisma.user.findUnique({
    where: {
      email: data.email,
    },
  });

  if (existingUser) {
    return {
      success: false,
      message: "An account with this email already exists.",
    };
  }
  const passwordHash = await hashPassword(data.password);

  await prisma.$transaction(async (tx) => {
  const workspace = await tx.workspace.create({
    data: {
      name: data.workspaceName,
    },
  });


  await tx.user.create({
    data: {
      name: data.name,
      email: data.email,
      passwordHash,
      role: "ADMIN",
      workspaceId: workspace.id,
    },
  });
});
return {
  success: true,
  message: "Workspace created successfully."
};
}

export async function login() {

}