"use client";

import { signOut } from "next-auth/react";
import { LogOut } from "lucide-react";

export default function LogoutButton({ isCollapsed }: { isCollapsed?: boolean }) {
  return (
    <button
      onClick={() =>
        signOut({
          callbackUrl: "/login",
        })
      }
      className={`rounded-full border border-rose-400 bg-rose-50/50 dark:bg-rose-950/20 text-rose-700 dark:text-rose-300 hover:bg-rose-100 dark:hover:bg-rose-950/40 transition-all duration-200 cursor-pointer font-medium text-sm flex items-center justify-center gap-2 ${
        isCollapsed ? "w-10 h-10 p-0" : "px-4 py-2.5 w-full"
      }`}
      title={isCollapsed ? "Logout" : undefined}
    >
      <LogOut className="h-4 w-4" />
      {!isCollapsed && <span>Logout</span>}
    </button>
  );
}