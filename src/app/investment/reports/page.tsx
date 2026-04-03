"use client";

import Link from "next/link";
import { FileText, ArrowLeft, BarChart3, TrendingUp } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useAppStore } from "@/lib/store";
import { ReportList } from "../components/report-list";

export default function ReportsPage() {
  const { reports, portfolioCompanies } = useAppStore();

  // 统计信息
  const stats = {
    total: reports.length,
    monthly: reports.filter((r) => r.reportType === "monthly").length,
    quarterly: reports.filter((r) => r.reportType === "quarterly").length,
    aiGenerated: reports.filter((r) => r.createdBy.includes("AI")).length,
  };

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
        
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 rounded-xl bg-[#d97760] flex items-center justify-center">
                <FileText className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-[#141413] font-serif tracking-wide">
                  奏章房
                </h1>
                <p className="text-[#9a9590] font-serif">定期奏报，洞察先机</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <Card className="border-[#c2c0b6]">
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-[#d97760] font-serif">{stats.total}</p>
            <p className="text-xs text-[#9a9590]">报告总数</p>
          </CardContent>
        </Card>
        <Card className="border-[#c2c0b6]">
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-blue-600 font-serif">{stats.monthly}</p>
            <p className="text-xs text-[#9a9590]">月度报告</p>
          </CardContent>
        </Card>
        <Card className="border-[#c2c0b6]">
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-green-600 font-serif">{stats.quarterly}</p>
            <p className="text-xs text-[#9a9590]">季度报告</p>
          </CardContent>
        </Card>
        <Card className="border-[#c2c0b6]">
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-purple-600 font-serif">{stats.aiGenerated}</p>
            <p className="text-xs text-[#9a9590]">AI生成</p>
          </CardContent>
        </Card>
      </div>

      {/* Report List */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-[#141413] font-serif mb-4">
          投后报告列表
        </h2>
        <ReportList />
      </div>

      {/* Info Card */}
      <Card className="border-[#c2c0b6] bg-[#faf9f5]">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-lg bg-[#d97760]/10 flex items-center justify-center flex-shrink-0">
              <TrendingUp className="h-5 w-5 text-[#d97760]" />
            </div>
            <div>
              <h3 className="font-medium text-[#141413] mb-1">如何生成投后报告？</h3>
              <p className="text-sm text-[#5e5d59]">
                前往"藏珍阁"选择具体企业，在企业详情页点击"AI生成报告"按钮，
                守宝人将根据企业财务数据、里程碑进展和风险状况自动生成专业投后报告。
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Footer */}
      <div className="mt-12 pt-8 border-t border-[#c2c0b6]/60">
        <p className="text-sm text-[#9a9590] font-serif text-center">
          "运筹帷幄之中，决胜千里之外。"
        </p>
      </div>
    </div>
  );
}
