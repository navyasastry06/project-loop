"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import LogoutButton from "@/components/auth/LogoutButton";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: "📊" },
  { href: "/feedback", label: "Feedback", icon: "💬" },
  { href: "/reports", label: "Reports", icon: "📄" },
  { href: "/themes", label: "Themes", icon: "🏷️" },
  { href: "/ask-loop", label: "Ask LOOP", icon: "🤖" },
  { href: "/users", label: "Users", icon: "👥", adminOnly: true },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();

  const role = session?.user?.role;

  const filteredNav = navItems.filter((item) => {
    if (item.adminOnly && role !== "ADMIN") return false;
    return true;
  });

  return (
    <aside className="flex h-screen w-64 flex-col bg-gray-900 text-white">
      <div className="border-b border-gray-700 px-6 py-5">
        <h1 className="text-xl font-bold tracking-wide">
          🔄 LOOP AI
        </h1>
        <p className="mt-1 text-xs text-gray-400">
          Feedback Intelligence
        </p>
      </div>

      <nav className="flex-1 space-y-1 px-3 py-4">
        {filteredNav.map((item) => {
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 rounded-lg px-4 py-2.5 text-sm font-medium transition-colors ${
                isActive
                  ? "bg-blue-600 text-white"
                  : "text-gray-300 hover:bg-gray-800 hover:text-white"
              }`}
            >
              <span className="text-lg">{item.icon}</span>
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-gray-700 px-4 py-4">
        {session?.user && (
          <div className="mb-3">
            <p className="text-sm font-medium truncate">
              {session.user.name}
            </p>
            <p className="text-xs text-gray-400 truncate">
              {session.user.email}
            </p>
            <span className="mt-1 inline-block rounded bg-gray-700 px-2 py-0.5 text-xs text-gray-300">
              {role}
            </span>
          </div>
        )}
        <LogoutButton />
      </div>
    </aside>
  );
}
