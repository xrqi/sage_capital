import type { Metadata } from "next";
import { Noto_Sans_SC, Noto_Serif_SC } from "next/font/google";
import "./globals.css";
import { Sidebar } from "@/components/layout/sidebar";
import { FuchenCursor } from "@/components/effects/fuchen-cursor";
import { ImmortalTransition } from "@/components/effects/immortal-transition";

const notoSansSC = Noto_Sans_SC({
  variable: "--font-noto-sans",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

const notoSerifSC = Noto_Serif_SC({
  variable: "--font-noto-serif",
  subsets: ["latin"],
  weight: ["400", "600", "700"],
});

export const metadata: Metadata = {
  title: "云轩阁",
  description: "心之所向，素履以往",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="zh-CN"
      className={`${notoSansSC.variable} ${notoSerifSC.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-[#faf9f5]" suppressHydrationWarning>
        {/* 浮沉光标 */}
        <FuchenCursor />
        
        <div className="flex h-screen">
          <Sidebar />
          <main className="flex-1 overflow-auto ml-64">
            <div className="min-h-full bg-[#faf9f5]">
              {/* 仙气页面切换效果 */}
              <ImmortalTransition>
                {children}
              </ImmortalTransition>
            </div>
          </main>
        </div>
      </body>
    </html>
  );
}
