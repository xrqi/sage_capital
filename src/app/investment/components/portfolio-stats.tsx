"use client";

import { 
  Building2, 
  TrendingUp, 
  AlertTriangle, 
  DollarSign,
  PieChart,
  Target
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useAppStore } from "@/lib/store";

export function PortfolioStats() {
  const { portfolioCompanies } = useAppStore();

  // 计算统计数据
  const stats = {
    // 企业统计
    total: portfolioCompanies.length,
    active: portfolioCompanies.filter((c) => c.status === "active").length,
    exited: portfolioCompanies.filter((c) => c.status === "exited").length,
    writtenOff: portfolioCompanies.filter((c) => c.status === "writtenOff").length,
    
    // 投资金额统计
    totalInvestment: portfolioCompanies.reduce((sum, c) => sum + c.investmentAmount, 0),
    activeInvestment: portfolioCompanies
      .filter((c) => c.status === "active")
      .reduce((sum, c) => sum + c.investmentAmount, 0),
    
    // 估值统计
    totalValuation: portfolioCompanies.reduce((sum, c) => sum + (c.currentValuation || c.valuationAtInvestment), 0),
    initialValuation: portfolioCompanies.reduce((sum, c) => sum + c.valuationAtInvestment, 0),
    
    // 风险统计
    highRisk: portfolioCompanies.filter((c) => 
      c.riskFlags.some((r) => !r.resolvedAt && (r.level === "high" || r.level === "critical"))
    ).length,
    totalRisks: portfolioCompanies.reduce((sum, c) => 
      sum + c.riskFlags.filter((r) => !r.resolvedAt).length, 0
    ),
    
    // MOIC统计
    avgMOIC: portfolioCompanies.length > 0
      ? portfolioCompanies.reduce((sum, c) => {
          if (c.currentValuation && c.currentValuation > 0) {
            const currentValue = (c.currentValuation * c.equityRatio) / 100;
            return sum + (currentValue / c.investmentAmount);
          }
          return sum + 1; // 默认1x
        }, 0) / portfolioCompanies.length
      : 0,
  };

  // 计算投资组合整体MOIC
  const portfolioMOIC = stats.totalInvestment > 0
    ? portfolioCompanies.reduce((sum, c) => {
        if (c.currentValuation && c.currentValuation > 0) {
          const currentValue = (c.currentValuation * c.equityRatio) / 100;
          return sum + currentValue;
        }
        return sum + c.investmentAmount;
      }, 0) / stats.totalInvestment
    : 1;

  const statCards = [
    {
      title: "被投企业",
      value: stats.total,
      subValue: `${stats.active}家在管 / ${stats.exited}家退出`,
      icon: Building2,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: "投资总额",
      value: `${(stats.totalInvestment / 10000).toFixed(2)}亿`,
      subValue: `在管: ${(stats.activeInvestment / 10000).toFixed(2)}亿`,
      icon: DollarSign,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      title: "投资组合MOIC",
      value: `${portfolioMOIC.toFixed(2)}x`,
      subValue: `平均: ${stats.avgMOIC.toFixed(2)}x`,
      icon: TrendingUp,
      color: portfolioMOIC >= 1 ? "text-green-600" : "text-red-600",
      bgColor: portfolioMOIC >= 1 ? "bg-green-50" : "bg-red-50",
    },
    {
      title: "风险预警",
      value: stats.highRisk,
      subValue: `共${stats.totalRisks}个风险待处理`,
      icon: AlertTriangle,
      color: stats.highRisk > 0 ? "text-red-600" : "text-yellow-600",
      bgColor: stats.highRisk > 0 ? "bg-red-50" : "bg-yellow-50",
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {statCards.map((card, index) => {
        const Icon = card.icon;
        return (
          <Card key={index} className="border-[#c2c0b6]">
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs text-[#9a9590] mb-1">{card.title}</p>
                  <p className={`text-2xl font-bold font-serif ${card.color}`}>
                    {card.value}
                  </p>
                  <p className="text-xs text-[#5e5d59] mt-1">{card.subValue}</p>
                </div>
                <div className={`w-10 h-10 rounded-lg ${card.bgColor} flex items-center justify-center`}>
                  <Icon className={`h-5 w-5 ${card.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
