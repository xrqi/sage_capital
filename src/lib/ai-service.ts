import { getAIConfig } from './ai-config';
import { getMockResponse } from './mock-ai';
import { useAppStore } from './store';
import { LongTermMemory, AgentMemory } from './types';

interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

// 构建增强的 system prompt，包含记忆信息
function buildEnhancedSystemPrompt(
  basePrompt: string | undefined,
  longTermMemories: LongTermMemory[],
  agentMemory: AgentMemory | undefined
): string {
  let enhancedPrompt = basePrompt || '';
  
  // 添加长期记忆
  if (longTermMemories.length > 0) {
    enhancedPrompt += '\n\n## 你对用户的了解（长期记忆）\n';
    
    const preferences = longTermMemories.filter(m => m.category === 'preference');
    const facts = longTermMemories.filter(m => m.category === 'fact');
    const insights = longTermMemories.filter(m => m.category === 'insight');
    const habits = longTermMemories.filter(m => m.category === 'habit');
    
    if (preferences.length > 0) {
      enhancedPrompt += '- 用户偏好：' + preferences.map(m => m.content).join('；') + '\n';
    }
    if (facts.length > 0) {
      enhancedPrompt += '- 用户特征：' + facts.map(m => m.content).join('；') + '\n';
    }
    if (insights.length > 0) {
      enhancedPrompt += '- 深度洞察：' + insights.map(m => m.content).join('；') + '\n';
    }
    if (habits.length > 0) {
      enhancedPrompt += '- 用户习惯：' + habits.map(m => m.content).join('；') + '\n';
    }
  }
  
  // 添加 Agent 专属记忆
  if (agentMemory && (agentMemory.keyFacts.length > 0 || agentMemory.summary)) {
    enhancedPrompt += '\n## 你与用户的历史互动记忆\n';
    enhancedPrompt += `- 交互次数：${agentMemory.interactionCount} 次\n`;
    if (agentMemory.keyFacts.length > 0) {
      enhancedPrompt += '- 关键信息：' + agentMemory.keyFacts.join('；') + '\n';
    }
    if (agentMemory.summary) {
      enhancedPrompt += `- 你对用户的认知：${agentMemory.summary}\n`;
    }
  }
  
  return enhancedPrompt;
}

/**
 * 调用 AI 获取回复
 * 如果已配置 API，调用真实接口；否则使用 mock 回复
 */
export async function getAIResponse(
  agentId: string,
  userMessage: string,
  systemPrompt?: string,
  chatHistory?: ChatMessage[],
  skillName?: string
): Promise<string> {
  const config = getAIConfig();
  
  // 从 store 获取记忆数据
  const state = useAppStore.getState();
  const longTermMemories = state.longTermMemories;
  const agentMemory = state.getAgentMemory(agentId);
  
  // 构建增强的 system prompt
  const enhancedSystemPrompt = buildEnhancedSystemPrompt(systemPrompt, longTermMemories, agentMemory);
  
  // 未配置 API 时使用 mock，传入 skillName
  if (!config.isConfigured) {
    return getMockResponse(agentId, userMessage, skillName);
  }
  
  try {
    const messages: ChatMessage[] = [];
    
    // 添加系统提示词（使用增强版）
    if (enhancedSystemPrompt) {
      messages.push({ role: 'system', content: enhancedSystemPrompt });
    }
    
    // 添加历史消息（最近10条）
    if (chatHistory && chatHistory.length > 0) {
      const recent = chatHistory.slice(-10);
      messages.push(...recent);
    }
    
    // 添加当前用户消息
    messages.push({ role: 'user', content: userMessage });
    
    const response = await fetch(`${config.apiUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${config.apiKey}`,
      },
      body: JSON.stringify({
        model: config.model,
        messages,
        temperature: 0.7,
        max_tokens: 1000,
      }),
    });
    
    if (!response.ok) {
      console.error('AI API 调用失败:', response.status, response.statusText);
      // API 调用失败时降级为 mock
      return getMockResponse(agentId, userMessage);
    }
    
    const data = await response.json();
    return data.choices?.[0]?.message?.content || getMockResponse(agentId, userMessage);
  } catch (error) {
    console.error('AI API 调用异常:', error);
    // 出错时降级为 mock
    return getMockResponse(agentId, userMessage);
  }
}

// 用于指导大模型提取记忆的 system prompt
const MEMORY_EXTRACTION_PROMPT = `你是一个记忆提取助手。请分析以下对话内容，提取关于用户的关键信息。

请从两个维度分析：
1. 长期记忆：用户的偏好、特征、习惯、重要事实等（适合长期保存）
2. Agent 专属记忆：本次对话中的关键事实、用户的具体需求或表达的观点

请用 JSON 格式返回：
{
  "longTermMemories": ["记忆1", "记忆2"...],  // 每条记忆应该是一个简洁的事实陈述
  "agentKeyFacts": ["事实1", "事实2"...]      // 本次对话的关键事实
}

注意：
- 只提取有价值的信息，避免琐碎内容
- 记忆应该简洁明了，便于后续使用
- 如果没有值得提取的内容，返回空数组
- 只返回 JSON，不要其他解释文字`;

/**
 * 从对话中提取记忆
 * 如果 AI API 已配置，调用大模型分析对话并提取记忆
 * 如果未配置 API，返回 null
 */
export async function extractMemoryFromConversation(
  agentId: string,
  messages: ChatMessage[]
): Promise<{ longTermMemories: string[]; agentKeyFacts: string[] } | null> {
  const config = getAIConfig();
  
  // 未配置 API 时不提取记忆
  if (!config.isConfigured) {
    return null;
  }
  
  // 消息太少时不提取
  if (messages.length < 4) {
    return null;
  }
  
  try {
    // 构建对话文本
    const conversationText = messages
      .map(m => `${m.role === 'user' ? '用户' : '助手'}: ${m.content}`)
      .join('\n\n');
    
    const response = await fetch(`${config.apiUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${config.apiKey}`,
      },
      body: JSON.stringify({
        model: config.model,
        messages: [
          { role: 'system', content: MEMORY_EXTRACTION_PROMPT },
          { role: 'user', content: `请分析以下对话并提取记忆：\n\n${conversationText}` }
        ],
        temperature: 0.3,
        max_tokens: 500,
      }),
    });
    
    if (!response.ok) {
      console.error('记忆提取 API 调用失败:', response.status, response.statusText);
      return null;
    }
    
    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;
    
    if (!content) {
      return null;
    }
    
    // 解析 JSON 响应
    try {
      const result = JSON.parse(content);
      return {
        longTermMemories: result.longTermMemories || [],
        agentKeyFacts: result.agentKeyFacts || [],
      };
    } catch (parseError) {
      console.error('记忆提取结果解析失败:', parseError);
      return null;
    }
  } catch (error) {
    console.error('记忆提取异常:', error);
    return null;
  }
}
