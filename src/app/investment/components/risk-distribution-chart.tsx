"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAppStore } from "@/lib/store";
import { RiskLevel, RiskType } from "@/lib/types";

const riskLevelLabels: Record<RiskLevel, string> = {
  low: "低风险",
  medium: "中风险",
  high: "高风险",
  critical: "紧急风险",
};

const riskTypeLabels: Record<RiskType, string> = {
  financial: "财务风险",
  operational: "经营风险",
  team: "团队风险",
  market: "市场风险",
  legal: "法律风险",
  other: "其他风险",
};

const LEVEL_COLORS = {
  low: "#fbbf24",      // 黄色
  medium: "#f97316",   // 橙色
  high: "#ef4444",     // 红色
  critical: "#7f1d1d", // 深红色
};

const TYPE_COLORS = [
  "#d97760",
  "#8b7355",
  "#5e5d59",
  "#9a9590",
  "#c2c0b6",
  "#6b8e6b",
];

export function RiskDistributionChart() {
  const { portfolioCompanies } = useAppStore();

  // 收集所有未解决的风险
  const activeRisks = portfolioCompanies.flatMap((company) =>
    company.riskFlags.filter((r) => !r.resolvedAt)
  );

  // 按等级统计
  const levelCounts = activeRisks.reduce((acc, risk) => {
    acc[risk.level] = (acc[risk.level] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const levelData = Object.entries(levelCounts).map(([level, count]) => ({
    name: riskLevelLabels[level as RiskLevel] || level,
    value: count,
    level: level,
    color: LEVEL_COLORS[level as RiskLevel] || "#9a9590",
  }));

  // 按类型统计
  const typeCounts = activeRisks.reduce((acc, risk) => {
    acc[risk.type] = (acc[risk.type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const typeData = Object.entries(typeCounts).map(([type, count], index) => ({
    name: riskTypeLabels[type as RiskType] || type,
    value: count,
    type: type,
    color: TYPE_COLORS[index % TYPE_COLORS.length],
  }));

  const totalRisks = activeRisks.length;

  if (totalRisks === 0) {
    return (
      <Card className="border-[#c2c0b6]">
        <CardHeader>
          <CardTitle className="text-lg font-serif text-[#141413]">
            风险分布
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-48 flex items-center justify-center text-[#9a9590]">
            <div className="text-center">
              <p className="text-green-600 font-medium mb-1">🎉 暂无风险标记</p>
              <p className="text-sm">所有被投企业运行良好</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-[#c2c0b6]">
      <CardHeader>
        <CardTitle className="text-lg font-serif text-[#141413]">
          风险分布（共{totalRisks}个）
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* 风险等级分布 */}
          <div>
            <h4 className="text-sm font-medium text-[#5e5d59] mb-3 text-center">按等级分布</h4>
            <div className="h-40 w-full" style={{ minHeight: '160px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={levelData}
                    cx="50%"
                    cy="50%"
                    innerRadius={30}
                    outerRadius={50}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {levelData.map((entry, index) => (
                      <Cell key={`cell-level-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value) => [`${value}个`, "数量"]}
                    contentStyle={{
                      backgroundColor: "#faf9f5",
                      border: "1px solid #c2c0b6",
                      borderRadius: "8px",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-1 mt-2">
              {levelData.map((item) => (
                <div key={item.level} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                    <span className="text-[#5e5d59]">{item.name}</span>
                  </div>
                  <span className="font-medium text-[#141413]">{item.value}个</span>
                </div>
              ))}
            </div>
          </div>

          {/* 风险类型分布 */}
          <div>
            <h4 className="text-sm font-medium text-[#5e5d59] mb-3 text-center">按类型分布</h4>
            <div className="h-40 w-full" style={{ minHeight: '160px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={typeData}
                    cx="50%"
                    cy="50%"
                    innerRadius={30}
                    outerRadius={50}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {typeData.map((entry, index) => (
                      <Cell key={`cell-type-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value) => [`${value}个`, "数量"]}
                    contentStyle={{
                      backgroundColor: "#faf9f5",
                      border: "1px solid #c2c0b6",
                      borderRadius: "8px",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-1 mt-2">
              {typeData.map((item) => (
                <div key={item.type} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                    <span className="text-[#5e5d59]">{item.name}</span>
                  </div>
                  <span className="font-medium text-[#141413]">{item.value}个</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
