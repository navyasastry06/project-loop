"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import Image from "next/image";
import LogoutButton from "@/components/auth/LogoutButton";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  MessageSquare,
  FileText,
  Tags,
  Bot,
  Users,
  Settings,
  ChevronLeft,
  ChevronRight,
  Menu,
  X,
  Sparkles
} from "lucide-react";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/feedback", label: "Feedback", icon: MessageSquare },
  { href: "/reports", label: "Reports", icon: FileText },
  { href: "/themes", label: "Themes", icon: Tags },
  { href: "/voc", label: "Voice of Customer", icon: Sparkles },
  { href: "/ask-loop", label: "Ask LOOP", icon: Bot },
  { href: "/users", label: "Users", icon: Users, adminOnly: true },
  { href: "/settings", label: "Settings", icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(true);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setIsCollapsed(false);
      } else {
        setIsCollapsed(true);
      }
    };
    handleResize(); 
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const role = session?.user?.role;

  const filteredNav = navItems.filter((item) => {
    if (item.adminOnly && role !== "ADMIN") return false;
    return true;
  });

  return (
    <>
      
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 right-4 h-11 w-11 z-50 flex items-center justify-center rounded-full bg-[#4C74D9] text-[#FAFAFC] shadow-md md:hidden hover:scale-105 active:scale-95 transition-all cursor-pointer border border-[#2B4DA2]/20"
      >
        {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </button>

     
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.4 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 z-35 bg-black md:hidden"
          />
        )}
      </AnimatePresence>

   
      <aside
        className={`fixed inset-y-0 right-0 z-40 flex h-[100dvh] flex-col bg-[#FFF6D6] dark:bg-[#15223F] text-[#374151] dark:text-[#FAFAFC] border-l border-[#2B4DA2]/15 dark:border-white/10 transition-all duration-350 ease-in-out md:static ${
          isOpen ? "translate-x-0" : "translate-x-full"
        } md:translate-x-0 ${isCollapsed ? "w-22" : "w-68"}`}
      >
       
        <button
          type="button"
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="absolute top-5 -left-3.5 z-50 hidden h-7 w-7 items-center justify-center rounded-full bg-[#4C74D9] hover:bg-[#2B4DA2] text-white border-2 border-[#FAFAFC] dark:border-[#15223F] shadow-sm cursor-pointer md:flex transition-transform hover:scale-110 active:scale-95"
        >
          {isCollapsed ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
        </button>

        {/* Logo Section */}
        <div className={`py-6 border-b border-[#2B4DA2]/10 dark:border-white/10 ${isCollapsed ? "px-2 text-center" : "px-6"}`}>
          {isCollapsed ? (
            <div className="flex justify-center items-center">
              <Image
                src="/logo.png"
                alt="LOOP AI Logo"
                width={50}
                height={50}
                className="h-8 w-8 object-contain rounded-full hover:rotate-12 transition-transform duration-300"
              />
            </div>
          ) : (
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <Image
                  src="/logo.png"
                  alt="LOOP AI Logo"
                  width={45}
                  height={45}
                  className="h-7 w-7 object-contain rounded-full"
                />
                <span className="text-xl font-black text-[#4C74D9] dark:text-[#FAFAFC]">LOOP AI</span>
                <span className="text-[10px] font-bold bg-[#D8C4FF] dark:bg-[#A98AE5] text-[#2B4DA2] dark:text-[#15223F] px-1.5 py-0.5 rounded-md">v1.0</span>
              </div>
            </div>
          )}
        </div>

        {/* Navigation Items (Presentation Slides) */}
        <nav className="flex-1 space-y-2.5 px-3 py-6 overflow-y-auto">
          {filteredNav.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className={`group relative flex items-center gap-3 rounded-2xl px-4 py-3.5 text-sm font-semibold transition-all duration-300 hover:-translate-y-0.5 ${
                  isCollapsed ? "justify-center px-2" : ""
                } ${
                  isActive
                    ? "bg-[#4C74D9] text-[#FAFAFC] shadow-sm"
                    : "text-[#2B4DA2]/80 dark:text-[#FAFAFC]/80 hover:bg-[#FFF6D6]/50 dark:hover:bg-[#1F2D54]/50 hover:text-[#4C74D9] dark:hover:text-white"
                }`}
                title={isCollapsed ? item.label : undefined}
              >

                {/* Icon with subtle hover rotation */}
                <Icon className={`h-5 w-5 flex-shrink-0 transition-transform group-hover:rotate-6 duration-300 ${
                  isActive ? "text-[#FAFAFC]" : "text-[#4C74D9]"
                }`} />

                {/* Text Label */}
                {!isCollapsed && <span className="tracking-wide font-sans">{item.label}</span>}
                
                {/* Visual active dot indicator */}
                {isActive && !isCollapsed && (
                  <span className="absolute right-4 h-2 w-2 rounded-full bg-[#FFF6D6]" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* User Card & Logout Bottom Section */}
        <div className={`border-t border-[#2B4DA2]/10 dark:border-white/10 p-4 bg-[#FAFAFC]/50 dark:bg-[#1E2B58]/30 ${isCollapsed ? "flex flex-col items-center" : ""}`}>
          {session?.user && !isCollapsed && (
            <div className="mb-4 w-full bg-[#FAFAFC] dark:bg-[#1F2D54] p-3 rounded-2xl border border-[#2B4DA2]/5 dark:border-white/5 shadow-xs">
              <div className="flex items-center gap-2.5">
                <span className="h-8 w-8 rounded-full bg-[#F8B4D9] flex items-center justify-center font-bold text-white text-sm shadow-inner">
                  {session.user.name?.charAt(0).toUpperCase() || "U"}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-bold text-[#374151] dark:text-[#FAFAFC] truncate leading-tight">{session.user.name}</p>
                  <p className="text-[10px] text-[#2B4DA2]/60 dark:text-[#FAFAFC]/60 truncate mt-0.5">{session.user.email}</p>
                </div>
              </div>
              <div className="mt-2.5 flex items-center justify-between">
                <span className="text-[10px] uppercase tracking-wider font-extrabold text-[#2B4DA2] dark:text-[#7395EE] bg-[#FFF6D6] dark:bg-[#15223F] px-2 py-0.5 rounded-full border border-[#2B4DA2]/10 dark:border-white/10">
                  {role}
                </span>
              </div>
            </div>
          )}

          {session?.user && isCollapsed && (
            <div className="mb-4 text-center">
              <span
                className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-[#F8B4D9] text-sm font-bold text-white shadow-sm cursor-help hover:scale-105 active:scale-95 transition-transform"
                title={`${session.user.name || "User"} (${role})`}
              >
                {session.user.name?.charAt(0).toUpperCase() || "?"}
              </span>
            </div>
          )}
          <LogoutButton isCollapsed={isCollapsed} />
        </div>
      </aside>
    </>
  );
}

