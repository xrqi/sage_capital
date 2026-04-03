"use client";

import Link from "next/link";
import { Building2, FileText, TrendingUp, Shield, ArrowRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { investmentAgents } from "@/lib/agents";
import { useAppStore } from "@/lib/store";

interface InvestmentRoom {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

const rooms: InvestmentRoom[] = [
  {
    id: "portfolio",
    title: "藏珍阁",
    subtitle: "珍宝罗列，价值尽显",
    description: "被投企业全景一览，经营状况、估值变动尽在掌握。",
    href: "/investment/portfolio",
    icon: Building2,
  },
  {
    id: "reports",
    title: "奏章房",
    subtitle: "定期奏报，洞察先机",
    description: "投后管理报告生成与归档，风险预警，决策支持。",
    href: "/investment/reports",
    icon: FileText,
  },
  {
    id: "dashboard",
    title: "观星台",
    subtitle: "运筹帷幄，决胜千里",
    description: "投资组合仪表盘，关键指标监控，趋势分析。",
    href: "/investment/dashboard",
    icon: TrendingUp,
  },
];

export default function InvestmentPage() {
  const { agentStatuses, toggleAgentStatus } = useAppStore();
  
  // 获取募投管退四大Agent的状态
  const getAgentStatus = (agentId: string) => {
    return agentStatuses[agentId] ?? investmentAgents.find(a => a.id === agentId)?.isOnline ?? false;
  };

  const onlineInvestmentAgents = investmentAgents.filter(a => getAgentStatus(a.id));

  return (
    <div className="min-h-full p-8 lg:p-12">
      {/* Header Section */}
      <div className="mb-12 text-center">
        <h1 className="text-4xl font-bold text-[#141413] font-serif tracking-wide mb-4">
          金銮殿
        </h1>
        <div className="w-16 h-0.5 bg-[#d97760] mx-auto mb-4" />
        <p className="text-lg text-[#5e5d59] font-serif tracking-wider">
          运筹帷幄，决胜千里，募投管退，尽在掌握
        </p>
      </div>

      {/* Investment Agents Section */}
      <div className="mb-12">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-semibold text-[#141413] font-serif tracking-wide">
              四大贤能
            </h2>
            <p className="text-sm text-[#9a9590] font-serif">募投管退，各司其职</p>
          </div>
          <Link
            href="/cultivation/library"
            className="text-sm text-[#d97760] hover:underline font-serif"
          >
            前往藏经阁管理 →
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {investmentAgents.map((agent) => {
            const isOnline = getAgentStatus(agent.id);
            return (
              <Card
                key={agent.id}
                className={`relative overflow-hidden border transition-all duration-300 ${
                  isOnline
                    ? "border-[#d97760] bg-white shadow-md"
                    : "border-[#c2c0b6] bg-[#faf9f5]/50 opacity-60"
                }`}
              >
                <CardContent className="p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <div
                      className={`flex h-10 w-10 items-center justify-center rounded-full text-white text-sm font-medium font-serif ${
                        isOnline ? "bg-[#d97760]" : "bg-[#9a9590]"
                      }`}
                    >
                      {agent.name.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-semibold text-[#141413] font-serif truncate">
                        {agent.name}
                      </h3>
                      <p className="text-xs text-[#5e5d59] truncate">{agent.title}</p>
                    </div>
                  </div>
                  <p className="text-xs text-[#5e5d59] leading-relaxed font-serif line-clamp-2">
                    {agent.description}
                  </p>
                  {isOnline && (
                    <div className="mt-3 flex items-center gap-1.5">
                      <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                      <span className="text-xs text-green-600">当值中</span>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Room Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
        {rooms.map((room) => {
          const Icon = room.icon;
          return (
            <Link key={room.id} href={room.href} className="group block">
              <Card className="relative h-full bg-white border border-[#c2c0b6] overflow-hidden transition-all duration-500 ease-out hover:shadow-lg hover:-translate-y-1">
                {/* Decorative ink wash line at top */}
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#c2c0b6] to-transparent opacity-60" />
                
                <CardContent className="p-8 flex flex-col items-center text-center">
                  {/* Icon Container */}
                  <div className="relative mb-6">
                    {/* Decorative circle background */}
                    <div className="absolute inset-0 rounded-full bg-[#f0eee6] scale-150 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <div className="relative w-16 h-16 rounded-full border border-[#c2c0b6] flex items-center justify-center transition-all duration-500 group-hover:border-[#d97760] group-hover:bg-[#faf9f5]">
                      <Icon className="h-7 w-7 text-[#5e5d59] transition-colors duration-500 group-hover:text-[#d97760]" />
                    </div>
                  </div>

                  {/* Title */}
                  <h2 className="text-xl font-semibold text-[#141413] font-serif tracking-wide mb-2 transition-colors duration-300 group-hover:text-[#d97760]">
                    {room.title}
                  </h2>

                  {/* Subtitle */}
                  <p className="text-sm text-[#9a9590] font-serif mb-4 tracking-wider">
                    {room.subtitle}
                  </p>

                  {/* Decorative divider */}
                  <div className="w-8 h-px bg-[#c2c0b6] mb-4 transition-all duration-500 group-hover:w-12 group-hover:bg-[#d97760]" />

                  {/* Description */}
                  <p className="text-sm text-[#5e5d59] leading-relaxed mb-6 font-serif">
                    {room.description}
                  </p>

                  {/* Enter button */}
                  <div className="mt-auto flex items-center gap-2 text-sm text-[#9a9590] transition-all duration-300 group-hover:text-[#d97760]">
                    <span className="font-serif">入内</span>
                    <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                  </div>
                </CardContent>

                {/* Corner decoration */}
                <div className="absolute bottom-0 right-0 w-16 h-16 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <div className="absolute bottom-3 right-3 w-8 h-px bg-[#c2c0b6]/40 rotate-45" />
                  <div className="absolute bottom-3 right-3 w-px h-8 bg-[#c2c0b6]/40 rotate-45" />
                </div>
              </Card>
            </Link>
          );
        })}
      </div>

      {/* Stats Section */}
      <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
        <div className="rounded-lg border border-[#c2c0b6] bg-white p-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Building2 className="h-5 w-5 text-[#d97760]" />
          </div>
          <p className="text-2xl font-bold text-[#d97760] font-serif">--</p>
          <p className="text-xs text-[#9a9590]">被投企业</p>
        </div>
        <div className="rounded-lg border border-[#c2c0b6] bg-white p-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <TrendingUp className="h-5 w-5 text-[#d97760]" />
          </div>
          <p className="text-2xl font-bold text-[#d97760] font-serif">--</p>
          <p className="text-xs text-[#9a9590]">投资总额(万)</p>
        </div>
        <div className="rounded-lg border border-[#c2c0b6] bg-white p-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Shield className="h-5 w-5 text-[#d97760]" />
          </div>
          <p className="text-2xl font-bold text-[#d97760] font-serif">--</p>
          <p className="text-xs text-[#9a9590]">风险预警</p>
        </div>
        <div className="rounded-lg border border-[#c2c0b6] bg-white p-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <FileText className="h-5 w-5 text-[#d97760]" />
          </div>
          <p className="text-2xl font-bold text-[#d97760] font-serif">--</p>
          <p className="text-xs text-[#9a9590]">投后报告</p>
        </div>
      </div>

      {/* Bottom quote */}
      <div className="mt-16 text-center">
        <p className="text-sm text-[#9a9590] font-serif italic">
          "不谋全局者，不足谋一域；不谋万世者，不足谋一时。"
        </p>
        <p className="text-xs text-[#c2c0b6] mt-2 font-serif">——《陈澹然》</p>
      </div>
    </div>
  );
}
