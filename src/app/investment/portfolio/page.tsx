"use client";

import Link from "next/link";
import { Building2, Search, Filter, ArrowLeft, TrendingUp, AlertCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useAppStore } from "@/lib/store";
import { PortfolioCompany, CompanyStage, CompanyStatus } from "@/lib/types";
import { AddCompanyDialog } from "../components/add-company-dialog";

// 发展阶段显示映射
const stageLabels: Record<CompanyStage, string> = {
  seed: "种子期",
  angel: "天使轮",
  preA: "Pre-A轮",
  A: "A轮",
  B: "B轮",
  C: "C轮",
  preIPO: "Pre-IPO",
  IPO: "已上市",
};

// 状态显示映射
const statusLabels: Record<CompanyStatus, { label: string; color: string }> = {
  active: { label: "在管", color: "bg-green-100 text-green-700 border-green-200" },
  exited: { label: "已退出", color: "bg-blue-100 text-blue-700 border-blue-200" },
  writtenOff: { label: "已核销", color: "bg-gray-100 text-gray-700 border-gray-200" },
};

// 计算MOIC
function calculateMOIC(company: PortfolioCompany): number | null {
  if (!company.currentValuation || company.currentValuation === 0) return null;
  const currentValue = (company.currentValuation * company.equityRatio) / 100;
  return currentValue / company.investmentAmount;
}

export default function PortfolioPage() {
  const { portfolioCompanies } = useAppStore();

  // 统计信息
  const stats = {
    total: portfolioCompanies.length,
    active: portfolioCompanies.filter((c) => c.status === "active").length,
    exited: portfolioCompanies.filter((c) => c.status === "exited").length,
    totalInvestment: portfolioCompanies.reduce((sum, c) => sum + c.investmentAmount, 0),
    highRisk: portfolioCompanies.filter((c) => 
      c.riskFlags.some((r) => r.level === "high" || r.level === "critical" && !r.resolvedAt)
    ).length,
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
                <Building2 className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-[#141413] font-serif tracking-wide">
                  藏珍阁
                </h1>
                <p className="text-[#9a9590] font-serif">珍宝罗列，价值尽显</p>
              </div>
            </div>
          </div>
          <AddCompanyDialog />
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
        <Card className="border-[#c2c0b6]">
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-[#d97760] font-serif">{stats.total}</p>
            <p className="text-xs text-[#9a9590]">企业总数</p>
          </CardContent>
        </Card>
        <Card className="border-[#c2c0b6]">
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-green-600 font-serif">{stats.active}</p>
            <p className="text-xs text-[#9a9590]">在管企业</p>
          </CardContent>
        </Card>
        <Card className="border-[#c2c0b6]">
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-blue-600 font-serif">{stats.exited}</p>
            <p className="text-xs text-[#9a9590]">已退出</p>
          </CardContent>
        </Card>
        <Card className="border-[#c2c0b6]">
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-[#d97760] font-serif">
              {stats.totalInvestment.toLocaleString()}
            </p>
            <p className="text-xs text-[#9a9590]">投资总额(万)</p>
          </CardContent>
        </Card>
        <Card className="border-[#c2c0b6]">
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-red-500 font-serif">{stats.highRisk}</p>
            <p className="text-xs text-[#9a9590]">风险预警</p>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filter */}
      <div className="flex gap-4 mb-6">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#9a9590]" />
          <Input
            placeholder="搜索企业名称..."
            className="pl-10 border-[#c2c0b6] focus-visible:ring-[#d97760]"
          />
        </div>
        <Button variant="outline" className="border-[#c2c0b6] text-[#5e5d59]">
          <Filter className="h-4 w-4 mr-2" />
          筛选
        </Button>
      </div>

      {/* Company List */}
      {portfolioCompanies.length > 0 ? (
        <div className="space-y-4">
          {portfolioCompanies.map((company) => {
            const moic = calculateMOIC(company);
            const activeRisks = company.riskFlags.filter((r: { resolvedAt?: number }) => !r.resolvedAt);
            const highRisks = activeRisks.filter((r: { level: string }) => r.level === "high" || r.level === "critical");

            return (
              <Link key={company.id} href={`/investment/portfolio/${company.id}`}>
              <Card
                className="border-[#c2c0b6] hover:shadow-md transition-shadow cursor-pointer"
              >
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-[#141413] font-serif">
                          {company.name}
                        </h3>
                        <Badge
                          variant="outline"
                          className={statusLabels[company.status].color}
                        >
                          {statusLabels[company.status].label}
                        </Badge>
                        <Badge variant="outline" className="border-[#c2c0b6] text-[#5e5d59]">
                          {stageLabels[company.stage]}
                        </Badge>
                        {highRisks.length > 0 && (
                          <Badge className="bg-red-100 text-red-700 border-red-200">
                            <AlertCircle className="h-3 w-3 mr-1" />
                            {highRisks.length}个风险
                          </Badge>
                        )}
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                        <div>
                          <p className="text-xs text-[#9a9590]">投资金额</p>
                          <p className="text-sm font-medium text-[#141413]">
                            {company.investmentAmount.toLocaleString()}万
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-[#9a9590]">持股比例</p>
                          <p className="text-sm font-medium text-[#141413]">
                            {company.equityRatio}%
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-[#9a9590]">投资日期</p>
                          <p className="text-sm font-medium text-[#141413]">
                            {company.investmentDate}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-[#9a9590]">MOIC</p>
                          <p
                            className={`text-sm font-medium ${
                              moic && moic >= 1
                                ? "text-green-600"
                                : moic && moic < 1
                                ? "text-red-500"
                                : "text-[#9a9590]"
                            }`}
                          >
                            {moic ? `${moic.toFixed(2)}x` : "--"}
                          </p>
                        </div>
                      </div>

                      {company.description && (
                        <p className="text-sm text-[#5e5d59] mt-3 line-clamp-2">
                          {company.description}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center gap-2 ml-4">
                      <TrendingUp
                        className={`h-5 w-5 ${
                          moic && moic >= 1 ? "text-green-500" : "text-[#c2c0b6]"
                        }`}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
              </Link>
            );
          })}
        </div>
      ) : (
        <Card className="border-[#c2c0b6] border-dashed">
          <CardContent className="p-12 text-center">
            <div className="w-16 h-16 rounded-full bg-[#f0eee6] flex items-center justify-center mx-auto mb-4">
              <Building2 className="h-8 w-8 text-[#9a9590]" />
            </div>
            <h3 className="text-lg font-medium text-[#5e5d59] font-serif mb-2">
              暂无被投企业
            </h3>
            <p className="text-sm text-[#9a9590] max-w-sm mx-auto mb-6">
              藏珍阁中尚无珍宝，请添加您的第一笔投资企业。
            </p>
            <AddCompanyDialog />
          </CardContent>
        </Card>
      )}

      {/* Footer */}
      <div className="mt-12 pt-8 border-t border-[#c2c0b6]/60">
        <p className="text-sm text-[#9a9590] font-serif text-center">
          "善理财者，不急不躁，稳扎稳打，方能致远。"
        </p>
      </div>
    </div>
  );
}
