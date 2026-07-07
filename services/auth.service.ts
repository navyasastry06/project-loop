import { prisma } from "@/lib/prisma";
import { hashPassword, verifyPassword } from "@/utils/hash";
import type {
  SignupInput,
  LoginInput,
} from "@/schemas/auth.schema";

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

export async function verifyCredentials(data: LoginInput) {
  const user = await prisma.user.findUnique({
    where: {
      email: data.email,
    },
  });

  if (!user) {
    return null;
  }

  const passwordMatches = await verifyPassword(
    data.password,
    user.passwordHash
  );

  if (!passwordMatches) {
    return null;
  }

  return user;
}

export async function login(data: LoginInput) {
  const user = await verifyCredentials(data);

  if (!user) {
    return {
      success: false,
      message: "Invalid email or password.",
    };
  }

  return {
    success: true,
    message: "Login successful.",
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      workspaceId: user.workspaceId,
    },
  };
}