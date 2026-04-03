"use client";

import Link from "next/link";
import { ArrowLeft, Sparkles } from "lucide-react";
import { ChatPanel } from "@/components/chat/chat-panel";

export default function QuietRoomPage() {
  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center gap-4 px-6 py-4 border-b border-[#c2c0b6] bg-[#faf9f5]">
        <Link
          href="/cultivation"
          className="flex items-center gap-2 text-sm text-[#5e5d59] hover:text-[#d97760] transition-colors font-serif"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>返回问道阁</span>
        </Link>
        <div className="flex-1" />
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-[#d97760]" />
          <span className="text-sm text-[#5e5d59] font-serif">观心室</span>
        </div>
      </div>

      {/* Chat Panel */}
      <div className="flex-1 overflow-hidden">
        <ChatPanel
          agentId="quiet-room-guide"
          agentName="慧镜禅师"
          agentTitle="内观引导师"
          placeholder="说出你心中所想..."
          welcomeMessage="施主有礼。此间清净，正宜内观。你今日可有什么心事想要梳理？不妨说来，让我们一同探寻。"
        />
      </div>
    </div>
  );
}
