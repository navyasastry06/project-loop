import { ReactNode } from "react";
import { redirect } from "next/navigation";

import { getCurrentSession } from "@/lib/session";

export default async function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  const session = await getCurrentSession();

  if (!session) {
    redirect("/login");
  }

  return (
    <main className="min-h-screen bg-gray-50">
      {children}
    </main>
  );
}