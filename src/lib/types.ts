export interface Agent {
  id: string;
  name: string;         // 古风名称
  title: string;        // 头衔/角色描述
  description: string;  // 详细描述
  avatar?: string;      // 头像URL或首字符
  category: 'workspace' | 'cultivation';  // 所属模块
  systemPrompt?: string; // 系统提示词（预留）
  isOnline: boolean;    // 是否在线（在线的显示在百工堂，离线的在藏经阁）
}

export interface Attachment {
  id: string;
  name: string;
  type: string;
  size: number;
  content?: string; // 文本文件内容
  url?: string;     // 文件URL（用于图片等）
}

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
  agentId: string;
  attachments?: Attachment[]; // 附件列表
  skillName?: string;         // 调用的 Skill 名称
}

export interface ChatSession {
  id: string;
  agentId: string;
  messages: Message[];
  createdAt: number;
  updatedAt: number;
}

export interface UserProfile {
  name: string;
  tags: string[];           // 性格标签
  thinkingPatterns: string[]; // 思维模式
  growthTimeline: Array<{
    date: string;
    event: string;
    insight: string;
  }>;
}

export interface DebateTopic {
  id: string;
  title: string;
  description: string;
  category: string;
}

// 长期记忆：用户级别的跨会话记忆
export interface LongTermMemory {
  id: string;
  content: string;        // 记忆内容摘要
  source: string;         // 来源（哪个 agent 的对话）
  category: 'preference' | 'fact' | 'insight' | 'habit';  // 分类
  createdAt: number;
  updatedAt: number;
}

// Agent 专属记忆：每个 Agent 记住与用户的互动要点
export interface AgentMemory {
  agentId: string;
  keyFacts: string[];          // Agent 观察到的用户关键信息
  interactionCount: number;    // 交互次数
  lastInteraction: number;     // 最后一次交互时间
  summary: string;             // Agent 对用户的总结认知
}

// ============================================
// 投资管理模块类型定义
// ============================================

// 被投企业发展阶段
export type CompanyStage = 'seed' | 'angel' | 'preA' | 'A' | 'B' | 'C' | 'preIPO' | 'IPO';

// 被投企业状态
export type CompanyStatus = 'active' | 'exited' | 'writtenOff';

// 风险类型
export type RiskType = 'financial' | 'operational' | 'team' | 'market' | 'legal' | 'other';

// 风险等级
export type RiskLevel = 'low' | 'medium' | 'high' | 'critical';

// 报告类型
export type ReportType = 'monthly' | 'quarterly' | 'annual' | 'adHoc';

// 里程碑状态
export type MilestoneStatus = 'pending' | 'achieved' | 'delayed' | 'atRisk';

// 被投企业信息
export interface PortfolioCompany {
  id: string;
  name: string;                    // 企业名称
  industry: string;                // 所属行业
  investmentDate: string;          // 投资日期
  investmentAmount: number;        // 投资金额（万元）
  equityRatio: number;             // 持股比例(%)
  valuationAtInvestment: number;   // 投资时估值（万元）
  currentValuation?: number;       // 当前估值（万元）
  stage: CompanyStage;             // 发展阶段
  status: CompanyStatus;           // 状态
  description?: string;            // 企业简介
  website?: string;                // 官网
  location?: string;               // 所在地
  
  // 关键联系人
  contacts: CompanyContact[];
  
  // 经营数据（定期更新）
  financials: FinancialData[];
  
  // 里程碑
  milestones: Milestone[];
  
  // 风险标记
  riskFlags: RiskFlag[];
  
  createdAt: number;
  updatedAt: number;
}

// 企业联系人
export interface CompanyContact {
  id: string;
  name: string;
  role: string;
  phone?: string;
  email?: string;
  isPrimary: boolean;              // 是否主要联系人
}

// 财务数据
export interface FinancialData {
  id: string;
  companyId: string;
  period: string;                  // 报告期（如：2024-Q1）
  revenue?: number;                // 营收（万元）
  netProfit?: number;              // 净利润（万元）
  cashBalance?: number;            // 现金余额（万元）
  burnRate?: number;               // 月度烧钱率（万元）
  runway?: number;                 // 资金 runway（月）
  gmv?: number;                    // GMV（如有）
  userCount?: number;              // 用户数（如有）
  notes?: string;                  // 备注
  reportedAt: number;              // 报告时间
}

// 里程碑
export interface Milestone {
  id: string;
  companyId: string;
  title: string;                   // 里程碑标题
  description: string;             // 描述
  targetDate: string;              // 目标日期
  status: MilestoneStatus;
  achievedDate?: string;           // 实际达成日期
  createdAt: number;
}

// 风险标记
export interface RiskFlag {
  id: string;
  companyId: string;
  type: RiskType;
  level: RiskLevel;
  description: string;
  identifiedAt: number;
  resolvedAt?: number;
  mitigationPlan?: string;         // 缓解措施
  resolvedBy?: string;             // 解决人
}

// 投后报告
export interface PostInvestmentReport {
  id: string;
  companyId: string;
  reportType: ReportType;
  period: string;                  // 报告期
  summary: string;                 // 执行摘要
  financialAnalysis: string;       // 财务分析
  operationalUpdate: string;       // 经营动态
  riskAssessment: string;          // 风险评估
  valuationUpdate?: number;        // 估值更新
  recommendations: string[];       // 建议事项
  nextSteps: string[];             // 下一步行动
  createdAt: number;
  createdBy: string;               // 报告创建者（Agent或用户）
}
