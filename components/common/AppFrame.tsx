"use client";

import type { CSSProperties, ReactNode } from "react";
import { usePathname } from "next/navigation";
import { AppSidebar } from "@/components/common/Sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import Header from "@/components/common/Header";

export default function AppFrame({ children }: Readonly<{ children: ReactNode }>) {
  const pathname = usePathname();

  if (pathname === "/login") {
    return children;
  } else if (pathname === "/signup" || pathname === "/reset-password") {
    return children;
  }

  return (
    <SidebarProvider style={{ "--sidebar-width": "340px" } as CSSProperties}>
      <AppSidebar />
      <div className="min-h-svh min-w-0 flex-1 bg-[#f5f7fa]">
        <Header />
        {children}
      </div>
    </SidebarProvider>
  );
}
