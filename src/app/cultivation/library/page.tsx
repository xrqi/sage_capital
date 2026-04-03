"use client";

import Link from "next/link";
import { BookOpen, Power, PowerOff } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { workspaceAgents, investmentAgents } from "@/lib/agents";
import { useAppStore } from "@/lib/store";
import { cn } from "@/lib/utils";

export default function LibraryPage() {
  const { agentStatuses, toggleAgentStatus } = useAppStore();
  
  // 合并所有Agent
  const allAgents = [...workspaceAgents, ...investmentAgents];
  
  // 获取 agent 的当前状态
  const getAgentStatus = (agentId: string) => {
    return agentStatuses[agentId] ?? allAgents.find(a => a.id === agentId)?.isOnline ?? false;
  };
  
  // 在线和离线Agent
  const onlineAgents = allAgents.filter(a => getAgentStatus(a.id));
  const offlineAgents = allAgents.filter(a => !getAgentStatus(a.id));

  return (
    <div className="min-h-full p-8 lg:p-12">
      {/* Header Section */}
      <div className="mb-12">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-xl bg-[#8b7355] flex items-center justify-center">
            <BookOpen className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-[#141413] font-serif tracking-wide">
              藏经阁
            </h1>
            <p className="text-[#9a9590] font-serif">纳百川之智，藏万法之宗</p>
          </div>
        </div>
        <p className="text-[#5e5d59] max-w-2xl leading-relaxed">
          此处收纳各路贤能，或潜心修炼，或静候召唤。开启开关，即可唤至百工堂听用。
        </p>
      </div>

      {/* Agent Category Tabs */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-[#141413] font-serif mb-4">通用办公</h2>
      </div>

      {/* Workspace Agent Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-10">
        {workspaceAgents.map((agent) => {
          const isOnline = getAgentStatus(agent.id);
          return (
            <Card
              key={agent.id}
              className={cn(
                "relative overflow-hidden border transition-all duration-500 ease-out h-full",
                isOnline
                  ? "border-[#d97760] bg-white shadow-lg"
                  : "border-[#c2c0b6] bg-[#faf9f5]/50 shadow-sm opacity-75"
              )}
            >
              <CardContent className="p-6">
                {/* Header with Avatar and Status Switch */}
                <div className="flex items-start justify-between mb-4">
                  {/* Avatar - First Character */}
                  <div
                    className={cn(
                      "flex h-12 w-12 items-center justify-center rounded-full text-white text-lg font-medium font-serif transition-colors duration-300",
                      isOnline ? "bg-[#d97760]" : "bg-[#9a9590]"
                    )}
                  >
                    {agent.name.charAt(0)}
                  </div>
                  {/* Status Switch */}
                  <div className="flex items-center gap-2">
                    <span className={cn(
                      "text-xs transition-colors",
                      isOnline ? "text-green-600" : "text-[#9a9590]"
                    )}>
                      {isOnline ? "在线" : "离线"}
                    </span>
                    <Switch
                      checked={isOnline}
                      onCheckedChange={() => toggleAgentStatus(agent.id)}
                      className="data-[state=checked]:bg-[#d97760]"
                    />
                  </div>
                </div>

                {/* Agent Info */}
                <div className="mb-3">
                  <h3 className="text-xl font-semibold text-[#141413] font-serif tracking-wide mb-1">
                    {agent.name}
                  </h3>
                  <p className="text-sm text-[#5e5d59]">{agent.title}</p>
                </div>

                {/* Description */}
                <p className="text-sm text-[#5e5d59] leading-relaxed font-serif">
                  {agent.description}
                </p>

                {/* Status Indicator */}
                <div className="mt-4 pt-4 border-t border-[#e8e6df]">
                  <div className="flex items-center gap-2">
                    {isOnline ? (
                      <>
                        <Power className="h-4 w-4 text-green-500" />
                        <span className="text-xs text-green-600">已在百工堂待命</span>
                      </>
                    ) : (
                      <>
                        <PowerOff className="h-4 w-4 text-[#9a9590]" />
                        <span className="text-xs text-[#9a9590]">于藏经阁中静修</span>
                      </>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Investment Agents Section */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-[#141413] font-serif mb-4">投资管理</h2>
      </div>

      {/* Investment Agent Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-10">
        {investmentAgents.map((agent) => {
          const isOnline = getAgentStatus(agent.id);
          return (
            <Card
              key={agent.id}
              className={cn(
                "relative overflow-hidden border transition-all duration-500 ease-out h-full",
                isOnline
                  ? "border-[#d97760] bg-white shadow-lg"
                  : "border-[#c2c0b6] bg-[#faf9f5]/50 shadow-sm opacity-75"
              )}
            >
              <CardContent className="p-6">
                {/* Header with Avatar and Status Switch */}
                <div className="flex items-start justify-between mb-4">
                  {/* Avatar - First Character */}
                  <div
                    className={cn(
                      "flex h-12 w-12 items-center justify-center rounded-full text-white text-lg font-medium font-serif transition-colors duration-300",
                      isOnline ? "bg-[#d97760]" : "bg-[#9a9590]"
                    )}
                  >
                    {agent.name.charAt(0)}
                  </div>
                  {/* Status Switch */}
                  <div className="flex items-center gap-2">
                    <span className={cn(
                      "text-xs transition-colors",
                      isOnline ? "text-green-600" : "text-[#9a9590]"
                    )}>
                      {isOnline ? "在线" : "离线"}
                    </span>
                    <Switch
                      checked={isOnline}
                      onCheckedChange={() => toggleAgentStatus(agent.id)}
                      className="data-[state=checked]:bg-[#d97760]"
                    />
                  </div>
                </div>

                {/* Agent Info */}
                <div className="mb-3">
                  <h3 className="text-xl font-semibold text-[#141413] font-serif tracking-wide mb-1">
                    {agent.name}
                  </h3>
                  <p className="text-sm text-[#5e5d59]">{agent.title}</p>
                </div>

                {/* Description */}
                <p className="text-sm text-[#5e5d59] leading-relaxed font-serif">
                  {agent.description}
                </p>

                {/* Status Indicator */}
                <div className="mt-4 pt-4 border-t border-[#e8e6df]">
                  <div className="flex items-center gap-2">
                    {isOnline ? (
                      <>
                        <Power className="h-4 w-4 text-green-500" />
                        <span className="text-xs text-green-600">已在百工堂待命</span>
                      </>
                    ) : (
                      <>
                        <PowerOff className="h-4 w-4 text-[#9a9590]" />
                        <span className="text-xs text-[#9a9590]">于藏经阁中静修</span>
                      </>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Stats Summary */}
      <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="rounded-lg border border-[#c2c0b6] bg-white p-4 text-center">
          <p className="text-2xl font-bold text-[#d97760] font-serif">{allAgents.length}</p>
          <p className="text-xs text-[#9a9590]">贤能总数</p>
        </div>
        <div className="rounded-lg border border-[#c2c0b6] bg-white p-4 text-center">
          <p className="text-2xl font-bold text-green-600 font-serif">
            {onlineAgents.length}
          </p>
          <p className="text-xs text-[#9a9590]">在线待命</p>
        </div>
        <div className="rounded-lg border border-[#c2c0b6] bg-white p-4 text-center">
          <p className="text-2xl font-bold text-[#9a9590] font-serif">
            {offlineAgents.length}
          </p>
          <p className="text-xs text-[#9a9590]">静修中</p>
        </div>
        <div className="rounded-lg border border-[#c2c0b6] bg-white p-4 text-center">
          <Link
            href="/workspace"
            className="text-sm text-[#d97760] hover:underline font-serif"
          >
            前往百工堂 →
          </Link>
          <p className="text-xs text-[#9a9590]">召唤贤能</p>
        </div>
      </div>

      {/* Decorative Footer */}
      <div className="mt-16 pt-8 border-t border-[#c2c0b6]/60">
        <div className="flex items-center justify-between text-sm text-[#9a9590]">
          <p className="font-serif">藏器于身，待时而动</p>
          <div className="flex items-center gap-2">
            <BookOpen className="h-4 w-4 text-[#8b7355]" />
            <span className="font-serif">阁中藏珍</span>
          </div>
        </div>
      </div>
    </div>
  );
}
