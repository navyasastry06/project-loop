import { ReactNode } from "react";
import { redirect } from "next/navigation";

import { getCurrentSession } from "@/lib/session";
import Sidebar from "@/components/layout/Sidebar";

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
    <div className="flex h-screen bg-[#FAFAFC] dark:bg-[#16223F] overflow-hidden">
      <main className="flex-1 overflow-y-auto p-6 md:p-10 lg:p-12 pt-24 md:pt-10 transition-colors duration-300 editorial-dots paper-texture relative">
        <div className="max-w-7xl mx-auto h-full flex flex-col">
          {children}
        </div>
      </main>
      <Sidebar />
    </div>
  );
}