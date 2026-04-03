"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ChatPanel } from "@/components/chat/chat-panel";
import { workspaceAgents } from "@/lib/agents";

export default function AgentChatPage() {
  const params = useParams();
  const agentId = params.agentId as string;

  // 查找对应的 Agent
  const agent = workspaceAgents.find((a) => a.id === agentId);

  // 如果找不到 Agent，显示错误提示
  if (!agent) {
    return (
      <div className="min-h-full flex flex-col items-center justify-center p-8">
        <div className="text-center">
          <div className="w-16 h-16 rounded-full bg-[#f0eee6] flex items-center justify-center mx-auto mb-6">
            <span className="text-3xl text-[#5e5d59]">？</span>
          </div>
          <h1 className="text-2xl font-bold text-[#141413] font-serif tracking-wide mb-3">
            此人不在堂中
          </h1>
          <p className="text-[#5e5d59] mb-8 font-serif">
            未能寻得这位贤士，或许他已云游四方。
          </p>
          <Link href="/workspace">
            <Button
              variant="outline"
              className="border-[#c2c0b6] text-[#141413] hover:bg-[#f0eee6] hover:text-[#141413] font-serif"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              返回百工堂
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  // 生成欢迎消息
  const welcomeMessage = `在下${agent.name}，${agent.description}请问有何吩咐？`;

  return (
    <div className="h-full flex flex-col">
      {/* 顶部导航栏 */}
      <div className="flex items-center gap-4 px-6 py-4 border-b border-[#c2c0b6] bg-[#faf9f5] shrink-0">
        <Link href="/workspace">
          <Button
            variant="ghost"
            size="sm"
            className="text-[#5e5d59] hover:text-[#141413] hover:bg-[#f0eee6] font-serif"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            返回百工堂
          </Button>
        </Link>
        <div className="h-4 w-px bg-[#c2c0b6]" />
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#d97760] text-white text-sm font-medium font-serif">
            {agent.name.charAt(0)}
          </div>
          <div>
            <h2 className="text-sm font-medium text-[#141413] font-serif">
              {agent.name}
            </h2>
            <p className="text-xs text-[#5e5d59]">{agent.title}</p>
          </div>
        </div>
      </div>

      {/* 聊天区域 */}
      <div className="flex-1 min-h-0">
        <ChatPanel
          agentId={agent.id}
          agentName={agent.name}
          agentTitle={agent.title}
          placeholder="请输入你的问题..."
          welcomeMessage={welcomeMessage}
        />
      </div>
    </div>
  );
}
