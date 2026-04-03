"use client";

import { use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  Building2, 
  ArrowLeft, 
  Edit, 
  Trash2, 
  TrendingUp, 
  Calendar,
  AlertCircle,
  CheckCircle2,
  Clock,
  ExternalLink,
  MapPin,
  Users
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAppStore } from "@/lib/store";
import { CompanyStage, CompanyStatus, RiskLevel } from "@/lib/types";
import { AddFinancialDialog } from "../../components/add-financial-dialog";
import { AddMilestoneDialog } from "../../components/add-milestone-dialog";
import { AddRiskDialog } from "../../components/add-risk-dialog";
import { AddContactDialog } from "../../components/add-contact-dialog";
import { EditCompanyDialog } from "../../components/edit-company-dialog";
import { GenerateReportDialog } from "../../components/generate-report-dialog";
import { ReportList } from "../../components/report-list";

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

// 风险等级颜色
const riskLevelColors: Record<RiskLevel, string> = {
  low: "bg-yellow-100 text-yellow-700 border-yellow-200",
  medium: "bg-orange-100 text-orange-700 border-orange-200",
  high: "bg-red-100 text-red-700 border-red-200",
  critical: "bg-red-200 text-red-800 border-red-300",
};

// 风险类型标签
const riskTypeLabels: Record<string, string> = {
  financial: "财务风险",
  operational: "经营风险",
  team: "团队风险",
  market: "市场风险",
  legal: "法律风险",
  other: "其他风险",
};

// 计算MOIC
function calculateMOIC(investmentAmount: number, equityRatio: number, currentValuation?: number): number | null {
  if (!currentValuation || currentValuation === 0) return null;
  const currentValue = (currentValuation * equityRatio) / 100;
  return currentValue / investmentAmount;
}

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function CompanyDetailPage({ params }: PageProps) {
  const { id } = use(params);
  const router = useRouter();
  const { portfolioCompanies, deleteCompany } = useAppStore();
  
  const company = portfolioCompanies.find((c) => c.id === id);
  
  if (!company) {
    return (
      <div className="min-h-full p-8 lg:p-12">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-[#141413] font-serif mb-4">
            企业未找到
          </h1>
          <p className="text-[#5e5d59] mb-6">该企业不存在或已被删除</p>
          <Link href="/investment/portfolio">
            <Button className="bg-[#d97760] hover:bg-[#c96a54] text-white">
              返回藏珍阁
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const moic = calculateMOIC(company.investmentAmount, company.equityRatio, company.currentValuation);
  const activeRisks = company.riskFlags.filter((r) => !r.resolvedAt);
  const highRisks = activeRisks.filter((r) => r.level === "high" || r.level === "critical");
  const pendingMilestones = company.milestones.filter((m) => m.status === "pending" || m.status === "atRisk");
  const latestFinancial = company.financials[company.financials.length - 1];

  const handleDelete = () => {
    if (confirm("确定要删除该企业吗？此操作不可恢复。")) {
      deleteCompany(company.id);
      router.push("/investment/portfolio");
    }
  };

  return (
    <div className="min-h-full p-8 lg:p-12">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-4">
          <Link
            href="/investment/portfolio"
            className="flex items-center gap-2 text-[#5e5d59] hover:text-[#d97760] transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
            <span className="font-serif">返回藏珍阁</span>
          </Link>
        </div>
        
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 rounded-xl bg-[#d97760] flex items-center justify-center flex-shrink-0">
              <Building2 className="h-8 w-8 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl font-bold text-[#141413] font-serif tracking-wide">
                  {company.name}
                </h1>
                <Badge
                  variant="outline"
                  className={statusLabels[company.status].color}
                >
                  {statusLabels[company.status].label}
                </Badge>
                <Badge variant="outline" className="border-[#c2c0b6] text-[#5e5d59]">
                  {stageLabels[company.stage]}
                </Badge>
              </div>
              
              <div className="flex items-center gap-4 text-sm text-[#5e5d59]">
                {company.industry && (
                  <span className="flex items-center gap-1">
                    <span className="text-[#9a9590]">行业:</span>
                    {company.industry}
                  </span>
                )}
                {company.location && (
                  <span className="flex items-center gap-1">
                    <MapPin className="h-3.5 w-3.5" />
                    {company.location}
                  </span>
                )}
                {company.website && (
                  <a 
                    href={company.website} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-[#d97760] hover:underline"
                  >
                    <ExternalLink className="h-3.5 w-3.5" />
                    官网
                  </a>
                )}
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <GenerateReportDialog company={company} />
            <EditCompanyDialog company={company} />
            <Button 
              variant="outline" 
              className="border-red-200 text-red-600 hover:bg-red-50"
              onClick={handleDelete}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              删除
            </Button>
          </div>
        </div>
        
        {company.description && (
          <p className="mt-4 text-[#5e5d59] max-w-3xl">
            {company.description}
          </p>
        )}
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <Card className="border-[#c2c0b6]">
          <CardContent className="p-4">
            <p className="text-xs text-[#9a9590] mb-1">投资金额</p>
            <p className="text-xl font-bold text-[#141413] font-serif">
              {company.investmentAmount.toLocaleString()}万
            </p>
          </CardContent>
        </Card>
        <Card className="border-[#c2c0b6]">
          <CardContent className="p-4">
            <p className="text-xs text-[#9a9590] mb-1">持股比例</p>
            <p className="text-xl font-bold text-[#141413] font-serif">
              {company.equityRatio}%
            </p>
          </CardContent>
        </Card>
        <Card className="border-[#c2c0b6]">
          <CardContent className="p-4">
            <p className="text-xs text-[#9a9590] mb-1">MOIC</p>
            <p className={`text-xl font-bold font-serif ${
              moic && moic >= 1 ? "text-green-600" : moic && moic < 1 ? "text-red-500" : "text-[#9a9590]"
            }`}>
              {moic ? `${moic.toFixed(2)}x` : "--"}
            </p>
          </CardContent>
        </Card>
        <Card className="border-[#c2c0b6]">
          <CardContent className="p-4">
            <p className="text-xs text-[#9a9590] mb-1">投资日期</p>
            <p className="text-xl font-bold text-[#141413] font-serif">
              {company.investmentDate || "--"}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Financial Data */}
          <Card className="border-[#c2c0b6]">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-serif text-[#141413]">财务数据</CardTitle>
                <AddFinancialDialog companyId={company.id} />
              </div>
            </CardHeader>
            <CardContent>
              {latestFinancial ? (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {latestFinancial.revenue !== undefined && (
                    <div>
                      <p className="text-xs text-[#9a9590]">营收</p>
                      <p className="text-lg font-medium text-[#141413]">{latestFinancial.revenue.toLocaleString()}万</p>
                    </div>
                  )}
                  {latestFinancial.netProfit !== undefined && (
                    <div>
                      <p className="text-xs text-[#9a9590]">净利润</p>
                      <p className={`text-lg font-medium ${latestFinancial.netProfit >= 0 ? 'text-green-600' : 'text-red-500'}`}>
                        {latestFinancial.netProfit.toLocaleString()}万
                      </p>
                    </div>
                  )}
                  {latestFinancial.cashBalance !== undefined && (
                    <div>
                      <p className="text-xs text-[#9a9590]">现金余额</p>
                      <p className="text-lg font-medium text-[#141413]">{latestFinancial.cashBalance.toLocaleString()}万</p>
                    </div>
                  )}
                  {latestFinancial.runway !== undefined && (
                    <div>
                      <p className="text-xs text-[#9a9590]">Runway</p>
                      <p className="text-lg font-medium text-[#141413]">{latestFinancial.runway}个月</p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-8 text-[#9a9590]">
                  <TrendingUp className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p>暂无财务数据</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Milestones */}
          <Card className="border-[#c2c0b6]">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-serif text-[#141413]">里程碑</CardTitle>
                <AddMilestoneDialog companyId={company.id} />
              </div>
            </CardHeader>
            <CardContent>
              {company.milestones.length > 0 ? (
                <div className="space-y-3">
                  {company.milestones.map((milestone) => (
                    <div key={milestone.id} className="flex items-start gap-3 p-3 rounded-lg bg-[#faf9f5]">
                      {milestone.status === "achieved" ? (
                        <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5" />
                      ) : milestone.status === "atRisk" ? (
                        <AlertCircle className="h-5 w-5 text-red-500 mt-0.5" />
                      ) : (
                        <Clock className="h-5 w-5 text-[#9a9590] mt-0.5" />
                      )}
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-[#141413]">{milestone.title}</span>
                          {milestone.status === "achieved" && (
                            <Badge className="bg-green-100 text-green-700">已完成</Badge>
                          )}
                          {milestone.status === "atRisk" && (
                            <Badge className="bg-red-100 text-red-700">有风险</Badge>
                          )}
                          {milestone.status === "delayed" && (
                            <Badge className="bg-yellow-100 text-yellow-700">已延期</Badge>
                          )}
                        </div>
                        <p className="text-sm text-[#5e5d59] mt-1">{milestone.description}</p>
                        <p className="text-xs text-[#9a9590] mt-1">
                          目标日期: {milestone.targetDate}
                          {milestone.achievedDate && ` · 完成日期: ${milestone.achievedDate}`}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-[#9a9590]">
                  <Calendar className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p>暂无里程碑</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Risk Flags */}
          <Card className="border-[#c2c0b6]">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-serif text-[#141413]">风险监控</CardTitle>
                <AddRiskDialog companyId={company.id} />
              </div>
            </CardHeader>
            <CardContent>
              {activeRisks.length > 0 ? (
                <div className="space-y-3">
                  {activeRisks.map((risk) => (
                    <div key={risk.id} className="p-3 rounded-lg border border-[#e8e6df]">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="outline" className={riskLevelColors[risk.level]}>
                          {risk.level === "low" && "低"}
                          {risk.level === "medium" && "中"}
                          {risk.level === "high" && "高"}
                          {risk.level === "critical" && "紧急"}
                        </Badge>
                        <span className="text-xs text-[#9a9590]">{riskTypeLabels[risk.type]}</span>
                      </div>
                      <p className="text-sm text-[#141413]">{risk.description}</p>
                      {risk.mitigationPlan && (
                        <p className="text-xs text-[#5e5d59] mt-2">
                          <span className="text-[#9a9590]">缓解措施:</span> {risk.mitigationPlan}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-[#9a9590]">
                  <CheckCircle2 className="h-8 w-8 mx-auto mb-2 text-green-500" />
                  <p>暂无风险标记</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Contacts */}
          <Card className="border-[#c2c0b6]">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-serif text-[#141413]">联系人</CardTitle>
                <AddContactDialog companyId={company.id} />
              </div>
            </CardHeader>
            <CardContent>
              {company.contacts.length > 0 ? (
                <div className="space-y-3">
                  {company.contacts.map((contact) => (
                    <div key={contact.id} className="p-3 rounded-lg bg-[#faf9f5]">
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-[#141413]">{contact.name}</span>
                        {contact.isPrimary && (
                          <Badge variant="outline" className="border-[#d97760] text-[#d97760]">主要</Badge>
                        )}
                      </div>
                      <p className="text-sm text-[#5e5d59]">{contact.role}</p>
                      {contact.email && (
                        <p className="text-xs text-[#9a9590] mt-1">{contact.email}</p>
                      )}
                      {contact.phone && (
                        <p className="text-xs text-[#9a9590]">{contact.phone}</p>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-[#9a9590]">
                  <Users className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p>暂无联系人</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
