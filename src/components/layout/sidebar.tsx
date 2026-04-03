"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  ScrollText,
  Mountain,
  Flame,
  Settings,
  User,
  BookOpen,
  Landmark,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";

interface NavItem {
  title: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
}

const navItems: NavItem[] = [
  {
    title: "百工堂",
    href: "/workspace",
    icon: ScrollText,
    description: "群贤毕至，各司其职",
  },
  {
    title: "金銮殿",
    href: "/investment",
    icon: Landmark,
    description: "运筹帷幄，决胜千里",
  },
  {
    title: "逍遥园",
    href: "/park",
    icon: Mountain,
    description: "偷得浮生半日闲",
  },
  {
    title: "明心殿",
    href: "/cultivation",
    icon: Flame,
    description: "洞察本心，明心见性",
  },
  {
    title: "藏经阁",
    href: "/cultivation/library",
    icon: BookOpen,
    description: "纳百川之智，藏万法之宗",
  },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-64 flex-col border-r border-[#3d352d] bg-[#2a2520]">
      {/* Header */}
      <div className="flex h-20 items-center border-b border-[#3d352d] px-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#d97760]">
            <Flame className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-semibold tracking-wide text-[#faf9f5] font-serif">
              云轩阁 · <span className="text-[#d97760]">玄微</span>
            </h1>
            <p className="text-xs text-[#9a9590]">Yun Xuan Ge · Xuan Wei</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <ScrollArea className="flex-1 px-4 py-6">
        <nav className="space-y-2">
          <p className="mb-3 px-3 text-xs font-medium tracking-wider text-[#9a9590]">
            阁中洞天
          </p>
          {navItems.map((item) => {
            // 特殊处理某些路由的激活状态
            const isActive = 
              item.href === "/cultivation"
                ? pathname === "/cultivation" || (pathname.startsWith("/cultivation/") && !pathname.startsWith("/cultivation/library"))
                : item.href === "/investment"
                ? pathname === "/investment" || pathname.startsWith("/investment/")
                : pathname === item.href || pathname.startsWith(`${item.href}/`);
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "group flex items-center gap-3 rounded-lg px-3 py-3 transition-all duration-300 border-l-2",
                  isActive
                    ? "bg-[#3d352d] border-[#d97760] text-[#faf9f5]"
                    : "border-transparent text-[#b8b3ad] hover:bg-[#3d352d]/50 hover:text-[#faf9f5]"
                )}
              >
                <div
                  className={cn(
                    "flex h-9 w-9 items-center justify-center rounded-lg transition-all duration-300",
                    isActive
                      ? "bg-[#d97760] text-white"
                      : "bg-[#3d352d] text-[#9a9590] group-hover:text-[#faf9f5]"
                  )}
                >
                  <Icon className="h-4 w-4" />
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-medium font-serif tracking-wide">{item.title}</span>
                  <span className="text-xs text-[#9a9590] group-hover:text-[#b8b3ad]">
                    {item.description}
                  </span>
                </div>
                {isActive && (
                  <div className="ml-auto h-1.5 w-1.5 rounded-full bg-[#d97760]" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Decorative Element */}
        <div className="mt-8 rounded-lg border border-[#3d352d] bg-[#3d352d]/30 p-4">
          <div className="flex items-center gap-2 text-[#d97760]">
            <Flame className="h-4 w-4" />
            <span className="text-xs font-medium font-serif">每日一语</span>
          </div>
          <p className="mt-2 text-xs leading-relaxed text-[#b8b3ad] font-serif">
            "工欲善其事，必先利其器。"
          </p>
        </div>
      </ScrollArea>

      {/* Footer */}
      <div className="border-t border-[#3d352d] p-4">
        <div className="flex items-center gap-3 rounded-lg bg-[#3d352d]/50 px-3 py-3 transition-colors hover:bg-[#3d352d]">
          <Avatar className="h-10 w-10 ring-2 ring-[#3d352d]">
            <AvatarImage src="" />
            <AvatarFallback className="bg-[#d97760] text-white text-sm">
              <User className="h-4 w-4" />
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-[#faf9f5] truncate font-serif">道友</p>
            <p className="text-xs text-[#9a9590] truncate">visitor@yunxuange.com</p>
          </div>
          <button className="flex h-8 w-8 items-center justify-center rounded-lg text-[#9a9590] transition-colors hover:bg-[#2a2520] hover:text-[#faf9f5]">
            <Settings className="h-4 w-4" />
          </button>
        </div>
      </div>
    </aside>
  );
}
