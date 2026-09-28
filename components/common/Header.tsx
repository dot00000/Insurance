"use client";

import { SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@base-ui/react";
import { User, LogOut, LogIn } from "lucide-react";
import { useRouter } from "next/navigation";

export default function Header() {
  const router = useRouter();
  return (
    <header className="sticky top-0 z-20 flex h-16 items-center gap-3 border-b border-slate-200 bg-white px-6 shadow-[0_2px_12px_rgba(30,55,80,0.08)]">
      <SidebarTrigger className="text-slate-700 hover:bg-slate-100" />
      <div className="ml-auto flex items-center gap-5 pr-2">
        <User />
        <Button className="flex" onClick={() => router.push("/login")}>
          <LogIn />
          &nbsp; 로그인
        </Button>
        <div className="flex">
          <LogOut />
          &nbsp; 로그아웃
        </div>
      </div>
    </header>
  );
}
