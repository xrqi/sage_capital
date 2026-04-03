"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ScrollText, BookOpen } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { workspaceAgents } from "@/lib/agents";
import { useAppStore } from "@/lib/store";

export default function WorkspacePage() {
  const { getOnlineAgents } = useAppStore();
  const [mounted, setMounted] = useState(false);
  const onlineAgents = getOnlineAgents();

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="min-h-full p-8 lg:p-12">
      {/* Header Section */}
      <div className="mb-12">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-xl bg-[#d97760] flex items-center justify-center">
            <ScrollText className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-[#141413] font-serif tracking-wide">
              百工堂
            </h1>
            <p className="text-[#9a9590] font-serif">群贤毕至，各司其职，为君分忧解劳</p>
          </div>
        </div>
        <p className="text-[#5e5d59] max-w-2xl leading-relaxed">
          百工汇聚于此，为君分忧解劳。事务繁杂，自有贤能相助。
        </p>
      </div>

      {/* Agent Cards Grid - Only show online agents */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {!mounted ? (
          // 服务端渲染占位
          <div className="col-span-full flex items-center justify-center py-16">
            <div className="w-8 h-8 border-2 border-[#d97760] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : onlineAgents.length > 0 ? (
          onlineAgents.map((agent) => (
            <Link
              key={agent.id}
              href={`/workspace/chat/${agent.id}`}
              className="group block"
            >
              <Card className="relative overflow-hidden border border-[#c2c0b6] bg-white shadow-md hover:shadow-xl transition-all duration-500 ease-out hover:-translate-y-1 h-full">
                <CardContent className="p-6">
                  {/* Header with Avatar and Online Status */}
                  <div className="flex items-start justify-between mb-4">
                    {/* Avatar - First Character */}
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#d97760] text-white text-lg font-medium font-serif">
                      {agent.name.charAt(0)}
                    </div>
                    {/* Online Status */}
                    <div className="flex items-center gap-1.5">
                      <div className="w-2 h-2 rounded-full bg-green-500" />
                      <span className="text-xs text-[#5e5d59]">在线</span>
                    </div>
                  </div>

                  {/* Agent Info */}
                  <div className="mb-3">
                    <h3 className="text-xl font-semibold text-[#141413] font-serif tracking-wide mb-1 group-hover:text-[#d97760] transition-colors">
                      {agent.name}
                    </h3>
                    <p className="text-sm text-[#5e5d59]">{agent.title}</p>
                  </div>

                  {/* Description */}
                  <p className="text-sm text-[#5e5d59] leading-relaxed font-serif">
                    {agent.description}
                  </p>
                </CardContent>
              </Card>
            </Link>
          ))
        ) : (
          <div className="col-span-full flex flex-col items-center justify-center py-16 text-center">
            <div className="w-16 h-16 rounded-full bg-[#f0eee6] flex items-center justify-center mb-4">
              <ScrollText className="h-8 w-8 text-[#9a9590]" />
            </div>
            <h3 className="text-lg font-medium text-[#5e5d59] font-serif mb-2">
              堂中暂无贤能
            </h3>
            <p className="text-sm text-[#9a9590] max-w-sm mb-6">
              百工堂中空荡荡，暂无贤能在此待命。请前往藏经阁开启贤能开关。
            </p>
            <Link
              href="/cultivation/library"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#d97760] text-white text-sm font-medium hover:bg-[#c96a54] transition-colors"
            >
              <BookOpen className="h-4 w-4" />
              前往藏经阁
            </Link>
          </div>
        )}
      </div>

      {/* Decorative Footer */}
      <div className="mt-16 pt-8 border-t border-[#c2c0b6]/60">
        <div className="flex items-center justify-between text-sm text-[#9a9590]">
          <p className="font-serif">工欲善其事，必先利其器</p>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-[#d97760] animate-pulse" />
            <span className="font-serif">堂中安宁</span>
          </div>
        </div>
      </div>
    </div>
  );
}
