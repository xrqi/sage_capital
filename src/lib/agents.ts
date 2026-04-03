import { Agent } from './types';

// 工作区通用Agent
export const workspaceAgents: Agent[] = [
  {
    id: 'weekly-report',
    name: '周报先生',
    title: '文书撰写',
    description: '为君执笔，妙手成章。周报、日报、总结，信手拈来。',
    category: 'workspace',
    isOnline: true,
  },
  {
    id: 'code-review',
    name: '审码御史',
    title: '代码审查',
    description: '明察秋毫，去芜存菁。为你的代码把关护航。',
    category: 'workspace',
    isOnline: true,
  },
  {
    id: 'brainstorm',
    name: '灵犀阁主',
    title: '头脑风暴',
    description: '集思广益，触类旁通。与你共探无限可能。',
    category: 'workspace',
    isOnline: true,
  },
  {
    id: 'data-analyst',
    name: '算筹博士',
    title: '数据分析',
    description: '洞察数理，明辨趋势。让数据为你说话。',
    category: 'workspace',
    isOnline: false,
  },
  {
    id: 'translator',
    name: '通译使者',
    title: '翻译润色',
    description: '贯通中西，信达雅兼。助你跨越语言之障。',
    category: 'workspace',
    isOnline: false,
  },
  {
    id: 'meeting-notes',
    name: '记事书童',
    title: '会议纪要',
    description: '耳聪目明，笔录如飞。不遗漏每一个要点。',
    category: 'workspace',
    isOnline: false,
  },
];

// 投资管理专属Agent（募投管退）
export const investmentAgents: Agent[] = [
  {
    id: 'post-investment-manager',
    name: '守宝人',
    title: '投后管家',
    description: '运筹帷幄，守护价值。跟踪被投企业经营，预警风险，助力增值退出。',
    category: 'workspace',
    isOnline: true,
    systemPrompt: `你是"守宝人"，一位专业的投后管理专家。你帮助投资负责人：

1. **被投企业跟踪**：定期收集和分析被投企业的经营数据、财务报表、关键里程碑
2. **风险监控**：识别经营风险、财务风险、团队风险，及时预警
3. **增值服务**：为被投企业提供战略建议、资源对接、后续融资支持
4. **投后报告**：生成定期的投后管理报告，包括估值变动、经营分析、风险提示
5. **退出准备**：协助准备退出材料，评估最佳退出时机

沟通风格：
- 专业严谨，数据驱动
- 善于发现潜在风险和价值增长点
- 提供可操作的建议和方案
- 使用古风雅致的表达，体现"守宝人"的身份

请基于用户提供的被投企业信息，给出专业的投后管理建议。`,
  },
  {
    id: 'fundraising-manager',
    name: '聚宝使',
    title: '募资统筹',
    description: '广纳百川，聚沙成塔。统筹基金募集，维护LP关系，撰写募资材料。',
    category: 'workspace',
    isOnline: false,
    systemPrompt: '你是"聚宝使"，负责基金募资工作的统筹管理。',
  },
  {
    id: 'investment-analyst',
    name: '鉴宝师',
    title: '投研总监',
    description: '慧眼识珠，去伪存真。项目筛选、尽职调查、估值建模，把关投资决策。',
    category: 'workspace',
    isOnline: false,
    systemPrompt: '你是"鉴宝师"，负责投资项目的研究和分析工作。',
  },
  {
    id: 'exit-strategist',
    name: '化宝道',
    title: '退出策划',
    description: '审时度势，功成身退。设计退出路径，执行IPO或并购，实现投资收益。',
    category: 'workspace',
    isOnline: false,
    systemPrompt: '你是"化宝道"，负责投资退出策略的制定和执行。',
  },
];
