# 金銮殿投资平台开发路线图

> 为投资公司打造的募投管退全生命周期AI管理系统

---

## 项目概述

**金銮殿**是云轩阁工作平台的核心投资业务模块，通过四大AI Agent协同工作，实现募投管退四大环节的完整闭环管理。

### 核心理念
- **守宝人**：投后管理，守护价值
- **聚宝师**：投前决策，慧眼识珠
- **聚宝使**：募资管理，汇聚资本
- **化宝道**：退出策略，价值兑现

---

## 已完成阶段 ✅

### Phase 1: 基础架构与藏珍阁（投后-企业库）✅
**状态**：已完成

#### 功能清单
- [x] 投资业务类型定义（PortfolioCompany, FinancialData, Milestone, RiskFlag等）
- [x] 四大Agent角色定义与系统提示词
- [x] 金銮殿主页（入口导航）
- [x] 藏珍阁企业列表页（增删改查）
- [x] 侧边栏导航集成
- [x] Zustand状态管理（持久化存储）

#### 核心文件
- `src/lib/types.ts` - 投资业务类型定义
- `src/lib/agents.ts` - 四大Agent定义
- `src/lib/store.ts` - 投资管理状态管理
- `src/app/investment/page.tsx` - 金銮殿主页
- `src/app/investment/portfolio/page.tsx` - 藏珍阁企业列表

---

### Phase 2: 企业详情与基础数据管理 ✅
**状态**：已完成

#### 功能清单
- [x] 企业详情页（基本信息展示）
- [x] 添加企业对话框
- [x] 编辑企业信息功能
- [x] 企业状态管理（在管/退出/核销）
- [x] 估值追踪（投资时/当前）

#### 核心文件
- `src/app/investment/portfolio/[id]/page.tsx` - 企业详情页
- `src/app/investment/components/add-company-dialog.tsx` - 添加企业对话框
- `src/app/investment/components/edit-company-dialog.tsx` - 编辑企业对话框

---

### Phase 3: 深度数据管理 ✅
**状态**：已完成

#### 功能清单
- [x] 财务数据录入（营收、利润、现金、烧钱率、Runway）
- [x] 里程碑管理（目标设定、完成追踪、状态更新）
- [x] 风险标记系统（等级/类型/描述/缓解措施）
- [x] 关键联系人管理
- [x] 估值更新功能

#### 核心文件
- `src/app/investment/components/financial-data-dialog.tsx` - 财务数据录入
- `src/app/investment/components/milestone-dialog.tsx` - 里程碑管理
- `src/app/investment/components/risk-flag-dialog.tsx` - 风险标记
- `src/app/investment/components/contact-dialog.tsx` - 联系人管理

---

### Phase 4: AI投后报告系统 ✅
**状态**：已完成

#### 功能清单
- [x] AI生成投后报告（月度/季度/年度/专项）
- [x] 守宝人Agent集成（自动分析企业数据）
- [x] 报告中心（奏章房）展示
- [x] 报告列表与详情查看
- [x] 报告统计（总数/月度/季度/AI生成）

#### 核心文件
- `src/app/investment/components/generate-report-dialog.tsx` - AI报告生成
- `src/app/investment/components/report-list.tsx` - 报告列表组件
- `src/app/investment/reports/page.tsx` - 奏章房页面

---

### Phase 5: 观星台数据仪表盘 ✅
**状态**：已完成

#### 功能清单
- [x] 投资组合统计卡片（企业数/投资额/MOIC/风险）
- [x] 投资阶段分布饼图
- [x] MOIC收益分析柱状图
- [x] 风险分布双饼图（等级+类型）
- [x] 数据可视化（Recharts集成）

#### 核心文件
- `src/app/investment/components/portfolio-stats.tsx` - 统计卡片
- `src/app/investment/components/stage-distribution-chart.tsx` - 阶段分布
- `src/app/investment/components/moic-analysis-chart.tsx` - MOIC分析
- `src/app/investment/components/risk-distribution-chart.tsx` - 风险分布
- `src/app/investment/dashboard/page.tsx` - 观星台页面

---

## 待开发阶段 📋

### Phase 6: 聚宝师（投前管理）
**优先级**：高
**预计工期**：2-3周

#### 目标
建立投前项目筛选、尽职调查、投资决策支持系统。

#### 功能清单
- [ ] **项目库管理**
  - 潜在投资项目录入（来源渠道、行业、阶段、地区）
  - 项目状态追踪（初筛/尽调/投决/交割/放弃）
  - 项目标签与分类管理
  
- [ ] **初筛评估**
  - AI初筛评分（团队/市场/产品/财务/竞争）
  - 投资备忘录（IC Memo）生成
  - 项目对比分析
  
- [ ] **尽职调查**
  - 尽调清单管理（业务/财务/法律/技术）
  - 尽调文档管理
  - 尽调发现与风险提示
  
- [ ] **投资决策**
  - 投决会材料生成
  - 投资条款记录（TS/SPA/SHA）
  - 投资决策追踪

#### 新增页面
- `src/app/investment/deals/page.tsx` - 项目库（聚宝阁）
- `src/app/investment/deals/[id]/page.tsx` - 项目详情
- `src/app/investment/deals/components/` - 投前相关组件

#### Agent集成
- **聚宝师Agent**：负责项目评估、尽调分析、IC Memo生成

---

### Phase 7: 聚宝使（募资管理）
**优先级**：中
**预计工期**：2周

#### 目标
管理LP关系、募资进度、基金运营。

#### 功能清单
- [ ] **LP管理**
  - LP信息库（机构/个人/政府引导基金）
  - LP分级分类（战略/财务/产业）
  - 沟通记录与关系维护
  
- [ ] **募资进度**
  - 募资目标设定
  - 认缴/实缴追踪
  - 募资里程碑管理
  
- [ ] **基金运营**
  - 基金基础信息管理
  - 管理费计算
  - 投资者报告生成

#### 新增页面
- `src/app/investment/fundraising/page.tsx` - 募资管理（聚宝堂）
- `src/app/investment/fundraising/lps/page.tsx` - LP管理
- `src/app/investment/fundraising/funds/page.tsx` - 基金管理

#### Agent集成
- **聚宝使Agent**：负责LP沟通建议、募资材料生成、投资者报告

---

### Phase 8: 化宝道（退出管理）
**优先级**：中
**预计工期**：2周

#### 目标
管理退出策略、退出执行、收益分配。

#### 功能清单
- [ ] **退出策略**
  - 退出路径规划（IPO/并购/股权转让/回购）
  - 退出时机分析
  - 退出收益预测
  
- [ ] **退出执行**
  - 退出项目追踪
  - 退出文档管理
  - 退出进度管理
  
- [ ] **收益分析**
  - 项目级收益计算（MOIC/IRR/DPI/TVPI）
  - 基金级收益汇总
  - 收益分配计算

#### 新增页面
- `src/app/investment/exits/page.tsx` - 退出管理（化宝阁）
- `src/app/investment/exits/strategy/page.tsx` - 退出策略
- `src/app/investment/exits/returns/page.tsx` - 收益分析

#### Agent集成
- **化宝道Agent**：负责退出策略建议、收益分析、退出报告

---

### Phase 9: 全局功能增强
**优先级**：低
**预计工期**：1-2周

#### 功能清单
- [ ] **文档中心**
  - 投资文档统一管理
  - 文档模板库
  - 版本控制
  
- [ ] **日程与提醒**
  - 投后管理日程
  - 里程碑提醒
  - 风险预警通知
  
- [ ] **数据导入导出**
  - Excel批量导入
  - 数据备份导出
  - API对接（天眼查/企查查）

---

## 技术架构

### 技术栈
- **框架**：Next.js 16 + React + TypeScript
- **状态管理**：Zustand（持久化存储）
- **UI组件**：@base-ui/react + Tailwind CSS
- **图表**：Recharts
- **AI服务**：OpenAI API（可配置）

### 数据模型
```typescript
// 核心实体关系
PortfolioCompany (被投企业)
  ├── FinancialData[] (财务数据)
  ├── Milestone[] (里程碑)
  ├── RiskFlag[] (风险标记)
  ├── Contact[] (联系人)
  └── PostInvestmentReport[] (投后报告)

Deal (投前项目)
  ├── DueDiligence[] (尽职调查)
  └── InvestmentDecision (投资决策)

LP (投资人)
  └── Commitment[] (出资承诺)

Fund (基金)
  ├── LP[] (投资人列表)
  └── Investment[] (投资项目)
```

### 状态管理
```typescript
// store.ts 结构
interface InvestmentState {
  // 投后管理
  portfolioCompanies: PortfolioCompany[];
  reports: PostInvestmentReport[];
  
  // 投前管理 (Phase 6)
  deals: Deal[];
  
  // 募资管理 (Phase 7)
  lps: LP[];
  funds: Fund[];
  
  // 退出管理 (Phase 8)
  exits: Exit[];
}
```

---

## 开发规范

### 命名规范
- **页面目录**：`src/app/investment/[module]/page.tsx`
- **组件目录**：`src/app/investment/components/`
- **类型定义**：`src/lib/types.ts`
- **Agent定义**：`src/lib/agents.ts`

### UI风格
- **主色调**：`#d97760`（朱砂红）
- **背景色**：`#faf9f5`（宣纸白）
- **边框色**：`#c2c0b6`（墨灰）
- **字体**：font-serif（书法风格）

### 代码规范
- 使用 TypeScript 严格模式
- 组件使用 "use client" 指令（需要交互时）
- 状态变更使用 Zustand actions
- AI调用统一使用 `getAIResponse` 函数

---

## 测试计划

### 单元测试
- [ ] Store actions 测试
- [ ] 组件渲染测试
- [ ] AI prompt 构建测试

### 集成测试
- [ ] 完整投后管理流程
- [ ] AI报告生成流程
- [ ] 数据持久化验证

### 用户测试
- [ ] 投资经理使用反馈
- [ ] 报告生成质量评估
- [ ] 仪表盘数据准确性

---

## 部署计划

### 开发环境
```bash
npm run dev
# http://localhost:3000/investment
```

### 生产构建
```bash
npm run build
npm start
```

### 环境变量
```env
# AI服务配置
OPENAI_API_KEY=sk-...
OPENAI_BASE_URL=https://api.openai.com/v1
```

---

## 附录

### 术语表
| 术语 | 说明 |
|------|------|
| MOIC | Multiple on Invested Capital，投资回报倍数 |
| IRR | Internal Rate of Return，内部收益率 |
| DPI | Distributed to Paid-in，实缴资本分红率 |
| TVPI | Total Value to Paid-in，实缴资本总回报 |
| Runway | 现金可支撑运营的月数 |
| Burn Rate | 月度现金消耗 |

### 参考资源
- [投资术语表](https://www.investopedia.com/financial-term-dictionary-4769738)
- [VC投后管理最佳实践](https://www.svca.org.cn/)

---

**文档版本**：v1.0  
**最后更新**：2026年4月2日  
**维护者**：开发团队
