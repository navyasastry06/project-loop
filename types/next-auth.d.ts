import { DefaultSession, DefaultUser } from "next-auth";
import { JWT } from "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    user: DefaultSession["user"] & {
      id: string;
      role: string;
      workspaceId: string;
    };
  }

  interface User extends DefaultUser {
    id: string;
    role: string;
    workspaceId: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: string;
    workspaceId: string;
  }
}