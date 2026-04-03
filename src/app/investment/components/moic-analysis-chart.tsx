"use client";

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, Cell } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAppStore } from "@/lib/store";

// 计算MOIC
function calculateMOIC(investmentAmount: number, equityRatio: number, currentValuation?: number): number {
  if (!currentValuation || currentValuation === 0) return 1;
  const currentValue = (currentValuation * equityRatio) / 100;
  return currentValue / investmentAmount;
}

export function MOICAnalysisChart() {
  const { portfolioCompanies } = useAppStore();

  // 计算每个企业的MOIC
  const data = portfolioCompanies
    .filter((c) => c.status === "active") // 只显示在管企业
    .map((company) => {
      const moic = calculateMOIC(
        company.investmentAmount,
        company.equityRatio,
        company.currentValuation
      );
      return {
        name: company.name.length > 8 ? company.name.slice(0, 8) + "..." : company.name,
        fullName: company.name,
        moic: Number(moic.toFixed(2)),
        investment: company.investmentAmount,
        stage: company.stage,
      };
    })
    .sort((a, b) => b.moic - a.moic); // 按MOIC降序排列

  if (data.length === 0) {
    return (
      <Card className="border-[#c2c0b6]">
        <CardHeader>
          <CardTitle className="text-lg font-serif text-[#141413]">
            MOIC分析
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64 flex items-center justify-center text-[#9a9590]">
            暂无在管企业数据
          </div>
        </CardContent>
      </Card>
    );
  }

  // 计算平均MOIC
  const avgMOIC = data.reduce((sum, item) => sum + item.moic, 0) / data.length;

  return (
    <Card className="border-[#c2c0b6]">
      <CardHeader>
        <CardTitle className="text-lg font-serif text-[#141413]">
          MOIC分析（在管企业）
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-64 w-full" style={{ minHeight: '256px' }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e8e6df" />
              <XAxis 
                dataKey="name" 
                tick={{ fill: "#5e5d59", fontSize: 12 }}
                axisLine={{ stroke: "#c2c0b6" }}
              />
              <YAxis 
                tick={{ fill: "#5e5d59", fontSize: 12 }}
                axisLine={{ stroke: "#c2c0b6" }}
                label={{ value: "MOIC (x)", angle: -90, position: "insideLeft", fill: "#5e5d59" }}
              />
              <Tooltip
                formatter={(value, name, props) => {
                  const item = props.payload;
                  return [
                    `MOIC: ${value}x`,
                    item.fullName,
                  ];
                }}
                labelFormatter={() => ""}
                contentStyle={{
                  backgroundColor: "#faf9f5",
                  border: "1px solid #c2c0b6",
                  borderRadius: "8px",
                }}
              />
              <ReferenceLine 
                y={1} 
                stroke="#9a9590" 
                strokeDasharray="5 5"
                label={{ value: "保本线", fill: "#9a9590", fontSize: 12 }}
              />
              <ReferenceLine 
                y={avgMOIC} 
                stroke="#d97760" 
                strokeDasharray="5 5"
                label={{ value: `平均: ${avgMOIC.toFixed(2)}x`, fill: "#d97760", fontSize: 12 }}
              />
              <Bar dataKey="moic" radius={[4, 4, 0, 0]}>
                {data.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={entry.moic >= 1 ? "#22c55e" : "#ef4444"}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
        
        {/* 统计摘要 */}
        <div className="mt-4 grid grid-cols-3 gap-4 pt-4 border-t border-[#e8e6df]">
          <div className="text-center">
            <p className="text-xs text-[#9a9590]">最高MOIC</p>
            <p className="text-lg font-bold text-green-600">
              {Math.max(...data.map(d => d.moic)).toFixed(2)}x
            </p>
          </div>
          <div className="text-center">
            <p className="text-xs text-[#9a9590]">平均MOIC</p>
            <p className="text-lg font-bold text-[#d97760]">
              {avgMOIC.toFixed(2)}x
            </p>
          </div>
          <div className="text-center">
            <p className="text-xs text-[#9a9590]">最低MOIC</p>
            <p className="text-lg font-bold text-red-500">
              {Math.min(...data.map(d => d.moic)).toFixed(2)}x
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
