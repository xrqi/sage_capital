import { create } from "zustand";
import { persist } from "zustand/middleware";
import { ChatSession, Message, UserProfile, LongTermMemory, AgentMemory, Agent, PortfolioCompany, PostInvestmentReport, FinancialData, Milestone, RiskFlag } from "./types";
import { workspaceAgents, investmentAgents } from "./agents";

// 生成唯一 ID
function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

// 创建新的聊天会话
function createChatSession(agentId: string): ChatSession {
  const now = Date.now();
  return {
    id: generateId(),
    agentId,
    messages: [],
    createdAt: now,
    updatedAt: now,
  };
}

// 创建默认用户画像
function createDefaultUserProfile(): UserProfile {
  return {
    name: "道友",
    tags: [],
    thinkingPatterns: [],
    growthTimeline: [],
  };
}

interface AppStore {
  // 对话相关
  sessions: Record<string, ChatSession>; // agentId -> ChatSession
  addMessage: (agentId: string, message: Message) => void;
  getSession: (agentId: string) => ChatSession | undefined;
  clearSession: (agentId: string) => void;

  // 用户画像
  userProfile: UserProfile;
  updateProfile: (profile: Partial<UserProfile>) => void;
  addTag: (tag: string) => void;
  removeTag: (tag: string) => void;
  addGrowthEvent: (event: UserProfile["growthTimeline"][0]) => void;

  // 长期记忆管理
  longTermMemories: LongTermMemory[];
  addMemory: (memory: LongTermMemory) => void;
  removeMemory: (id: string) => void;
  getMemoriesByCategory: (category: string) => LongTermMemory[];

  // Agent 专属记忆管理
  agentMemories: Record<string, AgentMemory>;  // agentId -> AgentMemory
  updateAgentMemory: (agentId: string, updates: Partial<AgentMemory>) => void;
  addAgentKeyFact: (agentId: string, fact: string) => void;
  getAgentMemory: (agentId: string) => AgentMemory | undefined;

  // Agent 在线状态管理
  agentStatuses: Record<string, boolean>;  // agentId -> isOnline
  toggleAgentStatus: (agentId: string) => void;
  setAgentStatus: (agentId: string, isOnline: boolean) => void;
  getOnlineAgents: () => Agent[];
  getOfflineAgents: () => Agent[];

  // ============================================
  // 投资管理模块
  // ============================================
  
  // 被投企业
  portfolioCompanies: PortfolioCompany[];
  addCompany: (company: Omit<PortfolioCompany, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateCompany: (id: string, updates: Partial<PortfolioCompany>) => void;
  deleteCompany: (id: string) => void;
  
  // 财务数据
  addFinancialData: (data: Omit<FinancialData, 'id'>) => void;
  
  // 里程碑
  addMilestone: (milestone: Omit<Milestone, 'id' | 'createdAt'>) => void;
  updateMilestone: (id: string, updates: Partial<Milestone>) => void;
  
  // 风险标记
  addRiskFlag: (risk: Omit<RiskFlag, 'id' | 'identifiedAt'>) => void;
  resolveRiskFlag: (riskId: string, resolvedBy: string) => void;
  
  // 投后报告
  reports: PostInvestmentReport[];
  addReport: (report: Omit<PostInvestmentReport, 'id' | 'createdAt'>) => void;
}

// 创建默认 Agent 记忆
function createDefaultAgentMemory(agentId: string): AgentMemory {
  return {
    agentId,
    keyFacts: [],
    interactionCount: 0,
    lastInteraction: 0,
    summary: "",
  };
}

// 初始化 agent 状态（包括通用Agent和投资管理Agent）
function createInitialAgentStatuses(): Record<string, boolean> {
  const statuses: Record<string, boolean> = {};
  workspaceAgents.forEach((agent) => {
    statuses[agent.id] = agent.isOnline;
  });
  investmentAgents.forEach((agent) => {
    statuses[agent.id] = agent.isOnline;
  });
  return statuses;
}

export const useAppStore = create<AppStore>()(
  persist(
    (set, get) => ({
      // 初始状态
      sessions: {},
      userProfile: createDefaultUserProfile(),
      longTermMemories: [],
      agentMemories: {},
      agentStatuses: createInitialAgentStatuses(),
      
      // 投资管理初始状态
      portfolioCompanies: [],
      reports: [],
      
      // 添加消息到指定会话
      addMessage: (agentId: string, message: Message) => {
        set((state) => {
          const existingSession = state.sessions[agentId];
          const session = existingSession || createChatSession(agentId);

          return {
            sessions: {
              ...state.sessions,
              [agentId]: {
                ...session,
                messages: [...session.messages, message],
                updatedAt: Date.now(),
              },
            },
          };
        });
      },

      // 获取会话
      getSession: (agentId: string) => {
        return get().sessions[agentId];
      },

      // 清空会话
      clearSession: (agentId: string) => {
        set((state) => {
          const { [agentId]: _, ...remainingSessions } = state.sessions;
          return {
            sessions: remainingSessions,
          };
        });
      },

      // 更新用户画像
      updateProfile: (profile: Partial<UserProfile>) => {
        set((state) => ({
          userProfile: {
            ...state.userProfile,
            ...profile,
          },
        }));
      },

      // 添加标签
      addTag: (tag: string) => {
        set((state) => {
          if (state.userProfile.tags.includes(tag)) {
            return state;
          }
          return {
            userProfile: {
              ...state.userProfile,
              tags: [...state.userProfile.tags, tag],
            },
          };
        });
      },

      // 移除标签
      removeTag: (tag: string) => {
        set((state) => ({
          userProfile: {
            ...state.userProfile,
            tags: state.userProfile.tags.filter((t) => t !== tag),
          },
        }));
      },

      // 添加成长事件
      addGrowthEvent: (event: UserProfile["growthTimeline"][0]) => {
        set((state) => ({
          userProfile: {
            ...state.userProfile,
            growthTimeline: [...state.userProfile.growthTimeline, event],
          },
        }));
      },

      // 添加长期记忆
      addMemory: (memory: LongTermMemory) => {
        set((state) => ({
          longTermMemories: [...state.longTermMemories, memory],
        }));
      },

      // 移除长期记忆
      removeMemory: (id: string) => {
        set((state) => ({
          longTermMemories: state.longTermMemories.filter((m) => m.id !== id),
        }));
      },

      // 按分类获取长期记忆
      getMemoriesByCategory: (category: string) => {
        return get().longTermMemories.filter((m) => m.category === category);
      },

      // 更新 Agent 记忆
      updateAgentMemory: (agentId: string, updates: Partial<AgentMemory>) => {
        set((state) => {
          const existingMemory = state.agentMemories[agentId] || createDefaultAgentMemory(agentId);
          return {
            agentMemories: {
              ...state.agentMemories,
              [agentId]: {
                ...existingMemory,
                ...updates,
              },
            },
          };
        });
      },

      // 添加 Agent 关键事实
      addAgentKeyFact: (agentId: string, fact: string) => {
        set((state) => {
          const existingMemory = state.agentMemories[agentId] || createDefaultAgentMemory(agentId);
          if (existingMemory.keyFacts.includes(fact)) {
            return state;
          }
          return {
            agentMemories: {
              ...state.agentMemories,
              [agentId]: {
                ...existingMemory,
                keyFacts: [...existingMemory.keyFacts, fact],
              },
            },
          };
        });
      },

      // 获取 Agent 记忆
      getAgentMemory: (agentId: string) => {
        return get().agentMemories[agentId];
      },

      // 切换 Agent 在线状态
      toggleAgentStatus: (agentId: string) => {
        set((state) => ({
          agentStatuses: {
            ...state.agentStatuses,
            [agentId]: !state.agentStatuses[agentId],
          },
        }));
      },

      // 设置 Agent 在线状态
      setAgentStatus: (agentId: string, isOnline: boolean) => {
        set((state) => ({
          agentStatuses: {
            ...state.agentStatuses,
            [agentId]: isOnline,
          },
        }));
      },

      // 获取在线 Agents
      getOnlineAgents: () => {
        const { agentStatuses } = get();
        return workspaceAgents.filter((agent) => agentStatuses[agent.id] ?? agent.isOnline);
      },

      // 获取离线 Agents
      getOfflineAgents: () => {
        const { agentStatuses } = get();
        return workspaceAgents.filter((agent) => !(agentStatuses[agent.id] ?? agent.isOnline));
      },

      // ============================================
      // 投资管理 Actions
      // ============================================
      
      // 添加被投企业
      addCompany: (company) => {
        const now = Date.now();
        const newCompany: PortfolioCompany = {
          ...company,
          id: generateId(),
          createdAt: now,
          updatedAt: now,
        };
        set((state) => ({
          portfolioCompanies: [...state.portfolioCompanies, newCompany],
        }));
      },
      
      // 更新被投企业
      updateCompany: (id, updates) => {
        set((state) => ({
          portfolioCompanies: state.portfolioCompanies.map((company) =>
            company.id === id
              ? { ...company, ...updates, updatedAt: Date.now() }
              : company
          ),
        }));
      },
      
      // 删除被投企业
      deleteCompany: (id) => {
        set((state) => ({
          portfolioCompanies: state.portfolioCompanies.filter((c) => c.id !== id),
        }));
      },
      
      // 添加财务数据
      addFinancialData: (data) => {
        const newData: FinancialData = {
          ...data,
          id: generateId(),
        };
        set((state) => ({
          portfolioCompanies: state.portfolioCompanies.map((company) =>
            company.id === data.companyId
              ? { ...company, financials: [...company.financials, newData] }
              : company
          ),
        }));
      },
      
      // 添加里程碑
      addMilestone: (milestone) => {
        const newMilestone: Milestone = {
          ...milestone,
          id: generateId(),
          createdAt: Date.now(),
        };
        set((state) => ({
          portfolioCompanies: state.portfolioCompanies.map((company) =>
            company.id === milestone.companyId
              ? { ...company, milestones: [...company.milestones, newMilestone] }
              : company
          ),
        }));
      },
      
      // 更新里程碑
      updateMilestone: (id, updates) => {
        set((state) => ({
          portfolioCompanies: state.portfolioCompanies.map((company) => ({
            ...company,
            milestones: company.milestones.map((m) =>
              m.id === id ? { ...m, ...updates } : m
            ),
          })),
        }));
      },
      
      // 添加风险标记
      addRiskFlag: (risk) => {
        const newRisk: RiskFlag = {
          ...risk,
          id: generateId(),
          identifiedAt: Date.now(),
        };
        set((state) => ({
          portfolioCompanies: state.portfolioCompanies.map((company) =>
            company.id === risk.companyId
              ? { ...company, riskFlags: [...company.riskFlags, newRisk] }
              : company
          ),
        }));
      },
      
      // 解决风险标记
      resolveRiskFlag: (riskId, resolvedBy) => {
        set((state) => ({
          portfolioCompanies: state.portfolioCompanies.map((company) => ({
            ...company,
            riskFlags: company.riskFlags.map((risk) =>
              risk.id === riskId
                ? { ...risk, resolvedAt: Date.now(), resolvedBy }
                : risk
            ),
          })),
        }));
      },
      
      // 添加投后报告
      addReport: (report) => {
        const newReport: PostInvestmentReport = {
          ...report,
          id: generateId(),
          createdAt: Date.now(),
        };
        set((state) => ({
          reports: [...state.reports, newReport],
        }));
      },
    }),
    {
      name: "yunxuange-storage", // localStorage 键名
      partialize: (state) => ({
        sessions: state.sessions,
        userProfile: state.userProfile,
        longTermMemories: state.longTermMemories,
        agentMemories: state.agentMemories,
        agentStatuses: state.agentStatuses,
        portfolioCompanies: state.portfolioCompanies,
        reports: state.reports,
      }),
    }
  )
);
