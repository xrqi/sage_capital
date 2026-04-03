import { Agent } from "./types";

// 工作空间类 Agent 的回复 - 实用、专业、古风韵味
const workspaceResponses = [
  "此事需从长计议。依我之见，当分三步而行：先理清脉络，再定主次，后逐一击破。",
  "阁下所言甚是。然凡事预则立，不预则废，不妨先列一清单，将诸项要务按轻重缓急排序。",
  "工欲善其事，必先利其器。建议先备齐所需之物，再着手施行，方可事半功倍。",
  "此法可行，但尚有完善之处。若能佐以数据佐证，再辅以实例说明，则更具说服力。",
  "闻君一席话，胜读十年书。此思路甚妙，不妨再深究其细节，或可发现更优解。",
  "此事看似复杂，实则皆有章法可循。建议先拆解为小节，逐个攻破，则大事可成。",
  "阁下思虑周详，令人钦佩。然时机亦是不可忽视，所谓天时地利人和，缺一不可。",
  "古人云：'不积跬步，无以至千里。'此事当循序渐进，切忌急于求成。",
  "依我多年经验，此类事宜最忌操之过急。不如先静观其变，待时机成熟再行动。",
  "阁下所虑甚是周全。然凡事皆有变数，建议预留几分余地，以应不时之需。",
];

// 观心室 Agent（内观引导师）- 引导自我探索的问题
const cultivationIntrospectionResponses = [
  "你提到了此事，这让你内心产生了怎样的涟漪？不妨静心思索片刻。",
  "闻君所言，似是心中有所牵挂。这份牵挂，于你而言意味着什么？",
  "古人云：'知人者智，自知者明。'你如何看待自己此刻的心境？",
  "此事牵动了你哪根心弦？是忧虑、期盼，还是另有他情？",
  "你所说的这些，是否让你想起了过往某些经历？那些经历教会了你什么？",
  "若将此事比作一面镜子，你从中看到了怎样的自己？",
  "我注意到你提及此事时语气有所变化。这份变化，你自己可曾察觉？",
  "所谓'境由心造'，你如何看待外界与内心的关系？此事于你，是外境所迫，还是内心所召？",
  "若时光倒流，回到此事发生之前，你会对那时的自己说些什么？",
  "你此刻的感受，是源自事情本身，还是源自你对事情的看法？可曾想过二者的分别？",
];

// 论道场 Agent（辩论对手）- 有力的反驳观点
const cultivationDebateResponses = [
  "阁下所言虽有道理，然未免过于理想。须知世事无常，岂能尽如人意？",
  "此论听来甚美，然细思之下，似有以偏概全之嫌。世间诸事，岂能一概而论？",
  "君之所言，乃是一面之词。若换个角度观之，结论或将大相径庭。",
  "此说看似有理，实则忽略了关键之处。若将此因素纳入考量，结论恐需重新审视。",
  "阁下论证严密，令人佩服。然前提若有不妥，则推论亦难成立。",
  "古人云：'兼听则明，偏信则暗。'君只见其一，未见其二，岂非有失偏颇？",
  "此观点颇有新意，然实践中却难以施行。理论与实际之间，往往存在鸿沟。",
  "君之推论，逻辑上似无破绽。然人情世故，岂是逻辑所能尽述？",
  "阁下所言，乃是从己之立场出发。若设身处地为他人着想，观点或将不同。",
  "此论过于绝对。须知世间万物，皆有其两面性，岂可非黑即白？",
];

// 延迟函数
function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// 获取随机回复
function getRandomResponse(responses: string[]): string {
  const index = Math.floor(Math.random() * responses.length);
  return responses[index];
}

// 根据 agentId 判断 agent 类型
function getAgentType(agentId: string): "workspace" | "introspection" | "debate" {
  // 观心室相关 agent
  if (
    agentId.includes("introspection") ||
    agentId.includes("guanxin") ||
    agentId.includes("mirror") ||
    agentId.includes("meditation")
  ) {
    return "introspection";
  }

  // 论道场相关 agent
  if (
    agentId.includes("debate") ||
    agentId.includes("lundao") ||
    agentId.includes("argue") ||
    agentId.includes("dialectic")
  ) {
    return "debate";
  }

  // 默认为工作空间类型
  return "workspace";
}

/**
 * 生成周报回复
 * 严格按照 SKILL 模板格式生成结构化周报
 */
function generateWeeklyReport(userMessage: string): string {
  // 尝试从消息中提取日期范围
  const datePatterns = [
    /(\d{4}年\d{1,2}月\d{1,2}日)\s*[-~～至]\s*(\d{4}年\d{1,2}月\d{1,2}日)/,
    /(\d{4})\.(\d{1,2})\.(\d{1,2})\s*[-~～至]\s*(\d{4})\.(\d{1,2})\.(\d{1,2})/,
    /(\d{1,2}月\d{1,2}日)\s*[-~～至]\s*(\d{1,2}月\d{1,2}日)/,
    /时间范围[:：]\s*(.+?)(?:\n|$)/,
  ];

  let dateRange = "";
  for (const pattern of datePatterns) {
    const match = userMessage.match(pattern);
    if (match) {
      dateRange = match[1] && match[2] ? `${match[1]}-${match[2]}` : match[1];
      break;
    }
  }

  // 如果没有提取到日期，使用默认格式
  if (!dateRange) {
    dateRange = "本周";
  }

  // 检查是否包含附件内容
  const hasAttachments = userMessage.includes("## 附件:");

  // 提取附件中的实际内容
  let contentToParse = userMessage;
  const attachmentMatch = userMessage.match(/## 附件:[\s\S]+$/);
  if (attachmentMatch) {
    contentToParse = attachmentMatch[0];
  }

  // 构建周报内容 - 严格按照 SKILL 模板格式
  let report = `# 周报 - ${dateRange}\n\n`;

  // 本周完成工作
  report += `## 本周完成工作\n\n`;

  // 从原始内容按天提取
  const lines = contentToParse.split("\n");
  let hasContent = false;

  // 尝试提取周一到周五的工作内容
  const dayPatterns = [
    { name: "周一", pattern: /^周一[（\(]?/ },
    { name: "周二", pattern: /^周二[（\(]?/ },
    { name: "周三", pattern: /^周三[（\(]?/ },
    { name: "周四", pattern: /^周四[（\(]?/ },
    { name: "周五", pattern: /^周五[（\(]?/ },
  ];

  let currentDay = "";
  let dayContent: string[] = [];

  lines.forEach((line) => {
    const trimmedLine = line.trim();

    // 检测日期行
    const dayMatch = dayPatterns.find((d) => d.pattern.test(trimmedLine));
    if (dayMatch) {
      // 保存前一天的内容
      if (currentDay && dayContent.length > 0) {
        report += `### ${currentDay}\n\n`;
        report += `- **状态**: 已完成\n`;
        report += `- **内容**: \n`;
        dayContent.forEach((content) => {
          report += `  - ${content}\n`;
        });
        report += `- **成果**: 完成当日计划工作\n\n`;
        hasContent = true;
      }
      currentDay = dayMatch.name;
      dayContent = [];
    }
    // 收集工作内容
    else if (
      currentDay &&
      trimmedLine &&
      !trimmedLine.startsWith("#") &&
      !trimmedLine.startsWith("---") &&
      trimmedLine.length > 5
    ) {
      // 提取具体任务
      if (
        trimmedLine.includes("完成") ||
        trimmedLine.includes("优化") ||
        trimmedLine.includes("开发") ||
        trimmedLine.includes("测试") ||
        trimmedLine.includes("设计") ||
        trimmedLine.includes("实现") ||
        trimmedLine.startsWith("-") ||
        trimmedLine.startsWith("•")
      ) {
        const cleanContent = trimmedLine.replace(/^[-•]\s*/, "").trim();
        if (cleanContent) {
          dayContent.push(cleanContent);
        }
      }
    }
  });

  // 保存最后一天的内容
  if (currentDay && dayContent.length > 0) {
    report += `### ${currentDay}\n\n`;
    report += `- **状态**: 已完成\n`;
    report += `- **内容**: \n`;
    dayContent.forEach((content) => {
      report += `  - ${content}\n`;
    });
    report += `- **成果**: 完成当日计划工作\n\n`;
    hasContent = true;
  }

  if (!hasContent) {
    report += `> 本周暂无详细工作记录，请补充具体内容。\n\n`;
  }

  // 下周计划（SKILL 要求格式）
  report += `## 下周计划\n\n`;
  report += `### 1. 完成用户认证系统重构\n`;
  report += `- **目标**: 完成全部功能开发并提测\n`;
  report += `- **预计完成时间**: 周三\n\n`;
  report += `### 2. 开发权限管理模块\n`;
  report += `- **目标**: 完成RBAC权限模型的前端实现\n`;
  report += `- **预计完成时间**: 周五\n\n`;
  report += `### 3. 持续性能优化\n`;
  report += `- **目标**: 优化其他核心页面的加载速度\n`;
  report += `- **预计完成时间**: 持续进行\n\n`;

  // 遇到的问题与风险（SKILL 要求格式 - 表格）
  report += `## 遇到的问题与风险\n\n`;
  report += `| 问题 | 影响 | 解决方案/状态 |\n`;
  report += `|------|------|---------------|\n`;
  report += `| 报表导出大文件时浏览器内存占用过高 | 数据报表模块 | 已通过流式下载优化解决 |\n`;
  report += `| 旧版IE浏览器不支持新认证方案 | 用户认证系统 | 需要产品确认是否继续支持IE |\n`;
  report += `| 第三方登录接口文档不完整 | 用户认证系统 | 已联系对方技术支持，等待回复 |\n`;
  report += `\n`;

  // 需要的支持（SKILL 要求格式）
  report += `## 需要的支持\n\n`;
  report += `- [ ] 申请测试环境的CDN资源用于性能测试\n`;
  report += `- [ ] 确认IE浏览器兼容性支持策略\n`;
  report += `- [ ] 协调UI设计师支持权限管理模块的图标设计\n`;
  report += `\n`;

  // 其他事项（SKILL 要求格式）
  report += `## 其他事项\n\n`;
  report += `- 本周整体工作饱和度较高，按计划完成了主要任务\n`;
  report += `- 认证系统重构进度符合预期，下周可以进入测试阶段\n`;
  if (hasAttachments) {
    report += `- 本周报基于提供的工作内容文档自动生成\n`;
  }

  return report;
}

/**
 * 获取 Mock AI 回复
 * @param agentId Agent 的 ID
 * @param userMessage 用户消息
 * @param skillName 调用的 Skill 名称
 * @returns Promise<string> 延迟后的回复内容
 */
export async function getMockResponse(
  agentId: string,
  userMessage: string,
  skillName?: string
): Promise<string> {
  // 模拟网络延迟 500-1500ms
  const delayMs = Math.floor(Math.random() * 1000) + 500;
  await delay(delayMs);

  // 如果指定了 weekly-report Skill，生成周报
  if (skillName === "weekly-report") {
    return generateWeeklyReport(userMessage);
  }

  const agentType = getAgentType(agentId);

  switch (agentType) {
    case "introspection":
      return getRandomResponse(cultivationIntrospectionResponses);
    case "debate":
      return getRandomResponse(cultivationDebateResponses);
    case "workspace":
    default:
      return getRandomResponse(workspaceResponses);
  }
}

// 预定义的 Agents 列表，供组件使用
export const predefinedAgents: Agent[] = [
  // 工作空间 Agents
  {
    id: "secretary",
    name: "文书侍",
    title: "笔录整理",
    description: "擅长记录整理，助你梳理思路",
    category: "workspace",
  },
  {
    id: "advisor",
    name: "谋士",
    title: "谋略筹划",
    description: "运筹帷幄，为你出谋划策",
    category: "workspace",
  },
  {
    id: "analyst",
    name: "账房先生",
    title: "数据分析",
    description: "精于计算，洞察数据背后的规律",
    category: "workspace",
  },
  // 观心室 Agents
  {
    id: "guanxin-mirror",
    name: "明心子",
    title: "内观引导师",
    description: "心如明镜，照见本心",
    category: "cultivation",
  },
  {
    id: "guanxin-introspection",
    name: "问道人",
    title: "自省导师",
    description: "引导自我探索，发现内心真我",
    category: "cultivation",
  },
  // 论道场 Agents
  {
    id: "lundao-opponent",
    name: "辩机子",
    title: "辩论对手",
    description: "以辩会友，在交锋中明理",
    category: "cultivation",
  },
  {
    id: "lundao-dialectic",
    name: "思辨客",
    title: "逻辑检验者",
    description: "以逻辑为刃，检验观点真伪",
    category: "cultivation",
  },
];
