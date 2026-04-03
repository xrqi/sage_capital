"use client";

import { useState } from "react";
import { FileText, Calendar, ChevronDown, ChevronUp, Building2, Sparkles } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAppStore } from "@/lib/store";
import { PostInvestmentReport, ReportType } from "@/lib/types";

const reportTypeLabels: Record<ReportType, { label: string; color: string }> = {
  monthly: { label: "月度报告", color: "bg-blue-100 text-blue-700 border-blue-200" },
  quarterly: { label: "季度报告", color: "bg-green-100 text-green-700 border-green-200" },
  annual: { label: "年度报告", color: "bg-purple-100 text-purple-700 border-purple-200" },
  adHoc: { label: "专项报告", color: "bg-orange-100 text-orange-700 border-orange-200" },
};

interface ReportListProps {
  companyId?: string; // 如果指定，只显示该企业的报告
}

export function ReportList({ companyId }: ReportListProps) {
  const { reports, portfolioCompanies } = useAppStore();
  const [expandedReport, setExpandedReport] = useState<string | null>(null);

  // 过滤报告
  const filteredReports = companyId
    ? reports.filter((r) => r.companyId === companyId)
    : reports;

  // 按创建时间倒序排列
  const sortedReports = [...filteredReports].sort(
    (a, b) => b.createdAt - a.createdAt
  );

  const getCompanyName = (companyId: string) => {
    const company = portfolioCompanies.find((c) => c.id === companyId);
    return company?.name || "未知企业";
  };

  const toggleExpand = (reportId: string) => {
    setExpandedReport(expandedReport === reportId ? null : reportId);
  };

  if (sortedReports.length === 0) {
    return (
      <Card className="border-[#c2c0b6] border-dashed">
        <CardContent className="p-12 text-center">
          <div className="w-16 h-16 rounded-full bg-[#f0eee6] flex items-center justify-center mx-auto mb-4">
            <FileText className="h-8 w-8 text-[#9a9590]" />
          </div>
          <h3 className="text-lg font-medium text-[#5e5d59] font-serif mb-2">
            暂无投后报告
          </h3>
          <p className="text-sm text-[#9a9590] max-w-sm mx-auto">
            使用守宝人AI助手生成您的第一份投后管理报告
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {sortedReports.map((report) => {
        const isExpanded = expandedReport === report.id;
        
        return (
          <Card
            key={report.id}
            className="border-[#c2c0b6] overflow-hidden"
          >
            <CardContent className="p-0">
              {/* 报告头部 */}
              <div
                className="p-4 cursor-pointer hover:bg-[#faf9f5] transition-colors"
                onClick={() => toggleExpand(report.id)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <Badge
                        variant="outline"
                        className={reportTypeLabels[report.reportType].color}
                      >
                        {reportTypeLabels[report.reportType].label}
                      </Badge>
                      <span className="text-sm text-[#9a9590] flex items-center gap-1">
                        <Calendar className="h-3.5 w-3.5" />
                        {report.period}
                      </span>
                      {report.createdBy.includes("AI") && (
                        <Badge className="bg-[#d97760]/10 text-[#d97760] border-[#d97760]/20">
                          <Sparkles className="h-3 w-3 mr-1" />
                          AI生成
                        </Badge>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-2 mb-2">
                      <Building2 className="h-4 w-4 text-[#9a9590]" />
                      <span className="font-medium text-[#141413]">
                        {getCompanyName(report.companyId)}
                      </span>
                    </div>
                    
                    <p className="text-sm text-[#5e5d59] line-clamp-2">
                      {report.summary}
                    </p>
                  </div>
                  
                  <Button variant="ghost" size="sm" className="ml-2">
                    {isExpanded ? (
                      <ChevronUp className="h-4 w-4 text-[#9a9590]" />
                    ) : (
                      <ChevronDown className="h-4 w-4 text-[#9a9590]" />
                    )}
                  </Button>
                </div>
                
                <div className="flex items-center gap-4 mt-3 text-xs text-[#9a9590]">
                  <span>生成时间: {new Date(report.createdAt).toLocaleDateString('zh-CN')}</span>
                  <span>生成者: {report.createdBy}</span>
                </div>
              </div>

              {/* 展开的详细内容 */}
              {isExpanded && (
                <div className="border-t border-[#e8e6df] p-4 bg-[#faf9f5]">
                  <div className="prose prose-sm max-w-none">
                    <div className="whitespace-pre-wrap text-sm text-[#141413]">
                      {report.financialAnalysis}
                    </div>
                  </div>
                  
                  {report.recommendations.length > 0 && (
                    <div className="mt-4">
                      <h4 className="text-sm font-medium text-[#141413] mb-2">
                        建议事项
                      </h4>
                      <ul className="list-disc list-inside text-sm text-[#5e5d59]">
                        {report.recommendations.map((rec, index) => (
                          <li key={index}>{rec}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  {report.nextSteps.length > 0 && (
                    <div className="mt-4">
                      <h4 className="text-sm font-medium text-[#141413] mb-2">
                        下一步行动
                      </h4>
                      <ul className="list-disc list-inside text-sm text-[#5e5d59]">
                        {report.nextSteps.map((step, index) => (
                          <li key={index}>{step}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
