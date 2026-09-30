"use client";

import { SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@base-ui/react";
import { User, LogOut, LogIn } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getSupabaseClient } from "@/utils/supabase/client";

export default function Header() {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);

  useEffect(() => {
    const supabase = getSupabaseClient();
    let active = true;
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (active) setIsLoggedIn(Boolean(session));
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (active) setIsLoggedIn(Boolean(session));
    });

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, []);

  async function handleLogout() {
    const { error } = await getSupabaseClient().auth.signOut();
    if (!error) {
      setIsLoggedIn(false);
      router.replace("/");
    }
  }

  return (
    <header className="sticky top-0 z-20 flex h-16 items-center gap-3 border-b border-slate-200 bg-white px-6 shadow-[0_2px_12px_rgba(30,55,80,0.08)]">
      <SidebarTrigger className="text-slate-700 hover:bg-slate-100" />
      <div className="ml-auto flex items-center gap-5 pr-2">
        {isLoggedIn === true && (
          <>
            <Button className="flex" onClick={() => router.push("/mypage")}>
              <User />
              &nbsp; 마이페이지
            </Button>
            <Button className="flex" onClick={handleLogout}>
              <LogOut />
              &nbsp; 로그아웃
            </Button>
          </>
        )}
        {isLoggedIn === false && (
          <Button className="flex" onClick={() => router.push("/login")}>
            <LogIn />
            &nbsp; 로그인
          </Button>
        )}
      </div>
    </header>
  );
}
