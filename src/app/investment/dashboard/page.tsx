"use client";

import Link from "next/link";
import { TrendingUp, ArrowLeft, BarChart3, PieChart, AlertTriangle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { PortfolioStats } from "../components/portfolio-stats";
import { StageDistributionChart } from "../components/stage-distribution-chart";
import { MOICAnalysisChart } from "../components/moic-analysis-chart";
import { RiskDistributionChart } from "../components/risk-distribution-chart";

export default function DashboardPage() {
  return (
    <div className="min-h-full p-8 lg:p-12">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-4">
          <Link
            href="/investment"
            className="flex items-center gap-2 text-[#5e5d59] hover:text-[#d97760] transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
            <span className="font-serif">返回金銮殿</span>
          </Link>
        </div>
        
        <div className="flex items-center gap-3 mb-2">
          <div className="w-12 h-12 rounded-xl bg-[#d97760] flex items-center justify-center">
            <TrendingUp className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-[#141413] font-serif tracking-wide">
              观星台
            </h1>
            <p className="text-[#9a9590] font-serif">运筹帷幄，决胜千里</p>
          </div>
        </div>
      </div>

      {/* Portfolio Stats */}
      <div className="mb-8">
        <PortfolioStats />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* 投资阶段分布 */}
        <StageDistributionChart />
        
        {/* MOIC分析 */}
        <MOICAnalysisChart />
      </div>

      {/* Risk Distribution - Full Width */}
      <div className="mb-8">
        <RiskDistributionChart />
      </div>

      {/* Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Card className="border-[#c2c0b6] bg-[#faf9f5]">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                <BarChart3 className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <h3 className="font-medium text-[#141413] text-sm">MOIC说明</h3>
                <p className="text-xs text-[#5e5d59]">
                  MOIC = 当前价值 / 投资成本，大于1表示盈利
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-[#c2c0b6] bg-[#faf9f5]">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
                <PieChart className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <h3 className="font-medium text-[#141413] text-sm">阶段分布</h3>
                <p className="text-xs text-[#5e5d59]">
                  展示投资组合在不同发展阶段的企业分布
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-[#c2c0b6] bg-[#faf9f5]">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-red-100 flex items-center justify-center">
                <AlertTriangle className="h-5 w-5 text-red-600" />
              </div>
              <div>
                <h3 className="font-medium text-[#141413] text-sm">风险监控</h3>
                <p className="text-xs text-[#5e5d59]">
                  实时跟踪被投企业的风险状况和预警信息
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Footer */}
      <div className="mt-12 pt-8 border-t border-[#c2c0b6]/60">
        <p className="text-sm text-[#9a9590] font-serif text-center">
          "观天之道，察地之形，知己知彼，百战不殆。"
        </p>
      </div>
    </div>
  );
}
