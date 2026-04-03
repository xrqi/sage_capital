"use client";

import { useState } from "react";
import { FileText, Sparkles, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectItem,
} from "@/components/ui/select";
import { useAppStore } from "@/lib/store";
import { PortfolioCompany, ReportType, PostInvestmentReport } from "@/lib/types";
import { getAIResponse } from "@/lib/ai-service";
import { investmentAgents } from "@/lib/agents";

interface GenerateReportDialogProps {
  company: PortfolioCompany;
}

const reportTypeOptions: { value: ReportType; label: string }[] = [
  { value: "monthly", label: "月度报告" },
  { value: "quarterly", label: "季度报告" },
  { value: "annual", label: "年度报告" },
  { value: "adHoc", label: "专项报告" },
];

// 构建投后报告生成的 prompt
function buildReportPrompt(company: PortfolioCompany, reportType: string, period: string): string {
  const financials = company.financials.map(f => `
- 报告期: ${f.period}
  营收: ${f.revenue || 'N/A'}万元, 净利润: ${f.netProfit || 'N/A'}万元, 现金余额: ${f.cashBalance || 'N/A'}万元
  烧钱率: ${f.burnRate || 'N/A'}万元/月, Runway: ${f.runway || 'N/A'}月
`).join('\n');

  const milestones = company.milestones.map(m => `
- ${m.title} (${m.status === 'achieved' ? '已完成' : m.status === 'atRisk' ? '有风险' : m.status === 'delayed' ? '已延期' : '待完成'})
  目标日期: ${m.targetDate}${m.achievedDate ? `, 完成日期: ${m.achievedDate}` : ''}
  ${m.description}
`).join('\n');

  const risks = company.riskFlags.filter(r => !r.resolvedAt).map(r => `
- [${r.level === 'critical' ? '紧急' : r.level === 'high' ? '高' : r.level === 'medium' ? '中' : '低'}] ${r.type === 'financial' ? '财务' : r.type === 'operational' ? '经营' : r.type === 'team' ? '团队' : r.type === 'market' ? '市场' : r.type === 'legal' ? '法律' : '其他'}风险
  ${r.description}
  ${r.mitigationPlan ? `缓解措施: ${r.mitigationPlan}` : ''}
`).join('\n');

  return `请为以下被投企业生成一份${reportType}投后管理报告。

## 企业基本信息
- 企业名称: ${company.name}
- 所属行业: ${company.industry}
- 投资阶段: ${company.stage}
- 投资日期: ${company.investmentDate}
- 投资金额: ${company.investmentAmount}万元
- 持股比例: ${company.equityRatio}%
- 投资时估值: ${company.valuationAtInvestment}万元
- 当前估值: ${company.currentValuation || '未更新'}万元
${company.description ? `- 企业简介: ${company.description}` : ''}

## 财务数据
${financials || '暂无财务数据'}

## 里程碑进展
${milestones || '暂无里程碑记录'}

## 风险标记
${risks || '暂无未解决风险'}

## 报告要求
请生成一份专业的投后管理报告，包含以下内容：

1. **执行摘要** - 对企业整体状况的概括性评价
2. **财务分析** - 基于财务数据的分析和趋势判断
3. **经营动态** - 里程碑完成情况和企业发展动态
4. **风险评估** - 当前面临的主要风险及应对建议
5. **估值更新** - 是否需要调整估值及理由
6. **建议事项** - 具体的投后管理建议
7. **下一步行动** - 明确的后续跟进计划

请以专业、客观、建设性的语气撰写报告，使用中文。报告期: ${period}`;
}

export function GenerateReportDialog({ company }: GenerateReportDialogProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [generatedReport, setGeneratedReport] = useState<string | null>(null);
  const { addReport } = useAppStore();
  
  const [formData, setFormData] = useState({
    reportType: "quarterly" as ReportType,
    period: "",
  });

  const handleGenerate = async () => {
    if (!formData.period) return;
    
    setLoading(true);
    
    try {
      // 获取守宝人Agent的系统提示词
      const shoubaoAgent = investmentAgents.find(a => a.id === 'post-investment-manager');
      
      const prompt = buildReportPrompt(company, 
        reportTypeOptions.find(t => t.value === formData.reportType)?.label || '投后管理',
        formData.period
      );
      
      // 调用AI生成报告
      const report = await getAIResponse(
        'post-investment-manager',
        prompt,
        shoubaoAgent?.systemPrompt
      );
      
      setGeneratedReport(report);
    } catch (error) {
      console.error('生成报告失败:', error);
      setGeneratedReport('报告生成失败，请稍后重试。');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = () => {
    if (!generatedReport) return;

    const report: Omit<PostInvestmentReport, "id" | "createdAt"> = {
      companyId: company.id,
      reportType: formData.reportType,
      period: formData.period,
      summary: generatedReport.slice(0, 200) + "...", // 简单摘要
      financialAnalysis: generatedReport, // 存储完整报告
      operationalUpdate: "",
      riskAssessment: "",
      recommendations: [],
      nextSteps: [],
      createdBy: "守宝人 (AI)",
    };

    addReport(report);
    setOpen(false);
    setGeneratedReport(null);
    setFormData({ reportType: "quarterly", period: "" });
  };

  const handleClose = () => {
    setOpen(false);
    setGeneratedReport(null);
    setFormData({ reportType: "quarterly", period: "" });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button className="bg-[#d97760] hover:bg-[#c96a54] text-white">
            <Sparkles className="h-4 w-4 mr-2" />
            AI生成报告
          </Button>
        }
      />
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-serif text-[#141413]">
            生成投后报告
          </DialogTitle>
          <DialogDescription className="text-[#5e5d59]">
            使用守宝人AI助手，基于企业数据自动生成投后管理报告
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          {/* 报告类型 */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="reportType" className="text-[#5e5d59]">
                报告类型
              </Label>
              <Select
                value={formData.reportType}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setFormData({ ...formData, reportType: e.target.value as ReportType })}
                className="border-[#c2c0b6] focus:ring-[#d97760]"
                disabled={loading || !!generatedReport}
              >
                {reportTypeOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="period" className="text-[#5e5d59]">
                报告期 <span className="text-red-500">*</span>
              </Label>
              <Input
                id="period"
                value={formData.period}
                onChange={(e) => setFormData({ ...formData, period: e.target.value })}
                placeholder="如：2024-Q1、2024年3月"
                className="border-[#c2c0b6] focus-visible:ring-[#d97760]"
                disabled={loading || !!generatedReport}
                required
              />
            </div>
          </div>

          {/* 生成按钮 */}
          {!generatedReport && (
            <Button
              onClick={handleGenerate}
              disabled={loading || !formData.period}
              className="w-full bg-[#d97760] hover:bg-[#c96a54] text-white"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  守宝人正在生成报告...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4 mr-2" />
                  生成报告
                </>
              )}
            </Button>
          )}

          {/* 生成的报告 */}
          {generatedReport && (
            <div className="space-y-4">
              <div className="border border-[#c2c0b6] rounded-lg p-4 bg-[#faf9f5] max-h-96 overflow-y-auto">
                <div className="prose prose-sm max-w-none">
                  <div className="whitespace-pre-wrap text-sm text-[#141413]">
                    {generatedReport}
                  </div>
                </div>
              </div>
              
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => setGeneratedReport(null)}
                  className="flex-1 border-[#c2c0b6] text-[#5e5d59]"
                >
                  重新生成
                </Button>
                <Button
                  onClick={handleSave}
                  className="flex-1 bg-[#d97760] hover:bg-[#c96a54] text-white"
                >
                  <FileText className="h-4 w-4 mr-2" />
                  保存报告
                </Button>
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={handleClose}
            className="border-[#c2c0b6] text-[#5e5d59]"
          >
            关闭
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
