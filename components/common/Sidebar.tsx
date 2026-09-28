"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { navigation } from "@/constants/navigation";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar className="border-r-0! bg-white! text-[#53687b]! shadow-[2px_0_12px_rgba(30,55,80,0.08)]">
      <SidebarHeader className="px-[25px] pt-[34px] pb-[49px]">
        <Link href="/" className="flex items-center gap-4" aria-label="다이렉트보험 홈">
          <span className="flex size-9 shrink-0 items-center justify-center rounded-[9px] bg-[#2388e4] ml-3">
            <svg viewBox="0 0 32 32" className="size-6 fill-white" aria-hidden="true">
              <path d="M16 1 22 7 16 13 10 7zM7 10l6 6-6 6-6-6zm18 0 6 6-6 6-6-6zm-9 9 6 6-6 6-6-6z" />
            </svg>
          </span>
          <span className="whitespace-nowrap text-[20px] font-bold tracking-[-0.04em] text-[#53687b]">
            보험다이렉트
          </span>
        </Link>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup className="px-[25px] py-0">
          <SidebarMenu className="gap-[15px]">
            {navigation.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.url;

              return (
                <SidebarMenuItem key={item.url}>
                  <SidebarMenuButton
                    render={<Link href={item.url} aria-current={isActive ? "page" : undefined} />}
                    isActive={isActive}
                    className="h-[51px] gap-[18px] rounded-[5px] px-[19px] text-[18px] font-normal text-[#53687b] hover:bg-[#eef7ff] hover:text-[#0873d1] data-active:bg-[#e8f4ff] data-active:font-semibold data-active:text-[#0873d1] [&_svg]:size-[22px]"
                  >
                    <span
                      className={isActive ? "flex size-[28px] shrink-0 items-center justify-center rounded-[6px] bg-[#0873d1] text-white" : "flex size-[20px] shrink-0 items-center justify-center"}
                    >
                      <Icon className={isActive ? "size-[22px]!" : undefined} strokeWidth={2.7} aria-hidden="true" />
                    </span>
                    <span>{item.name}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
