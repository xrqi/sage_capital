"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAppStore } from "@/lib/store";
import { CompanyStage } from "@/lib/types";

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

const COLORS = [
  "#d97760", // 主色调
  "#8b7355", // 藏经阁色调
  "#5e5d59", // 深灰
  "#9a9590", // 中灰
  "#c2c0b6", // 浅灰
  "#f0eee6", // 背景色
  "#d4a574", // 暖棕
  "#6b8e6b", // 绿
];

export function StageDistributionChart() {
  const { portfolioCompanies } = useAppStore();

  // 统计各阶段企业数量
  const stageCounts = portfolioCompanies.reduce((acc, company) => {
    acc[company.stage] = (acc[company.stage] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const data = Object.entries(stageCounts).map(([stage, count]) => ({
    name: stageLabels[stage as CompanyStage] || stage,
    value: count,
    stage: stage,
  }));

  // 按数量排序
  data.sort((a, b) => b.value - a.value);

  const total = data.reduce((sum, item) => sum + item.value, 0);

  if (total === 0) {
    return (
      <Card className="border-[#c2c0b6]">
        <CardHeader>
          <CardTitle className="text-lg font-serif text-[#141413]">
            投资阶段分布
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64 flex items-center justify-center text-[#9a9590]">
            暂无数据
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-[#c2c0b6]">
      <CardHeader>
        <CardTitle className="text-lg font-serif text-[#141413]">
          投资阶段分布
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-64 w-full" style={{ minHeight: '256px' }}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value) => [`${value}家 (${((Number(value) / total) * 100).toFixed(1)}%)`, "企业数量"]}
                contentStyle={{
                  backgroundColor: "#faf9f5",
                  border: "1px solid #c2c0b6",
                  borderRadius: "8px",
                }}
              />
              <Legend
                verticalAlign="bottom"
                height={36}
                iconType="circle"
                formatter={(value) => <span className="text-sm text-[#5e5d59]">{value}</span>}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
        
        {/* 阶段统计列表 */}
        <div className="mt-4 space-y-2">
          {data.map((item, index) => (
            <div key={item.stage} className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: COLORS[index % COLORS.length] }}
                />
                <span className="text-[#5e5d59]">{item.name}</span>
              </div>
              <div className="flex items-center gap-4">
                <span className="font-medium text-[#141413]">{item.value}家</span>
                <span className="text-[#9a9590] w-12 text-right">
                  {((item.value / total) * 100).toFixed(0)}%
                </span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
