"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Send, Brain, Sparkles, Trash2 } from "lucide-react";
import { useAppStore } from "@/lib/store";
import { getAIResponse, extractMemoryFromConversation } from "@/lib/ai-service";
import { Message, LongTermMemory, Attachment } from "@/lib/types";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  MessageBubble,
  WelcomeMessage,
  ThinkingIndicator,
} from "./message-bubble";
import { FileUpload } from "./file-upload";

interface ChatPanelProps {
  agentId: string;
  agentName: string;
  agentTitle: string;
  placeholder?: string; // 输入框占位文字
  welcomeMessage?: string; // 初始欢迎消息
  systemPrompt?: string; // 系统提示词
}

// 生成唯一 ID
function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

export function ChatPanel({
  agentId,
  agentName,
  agentTitle,
  placeholder = "输入消息...",
  welcomeMessage,
  systemPrompt,
}: ChatPanelProps) {
  const [inputValue, setInputValue] = useState("");
  const [isThinking, setIsThinking] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [currentReply, setCurrentReply] = useState<Message | null>(null);
  const [selectedFiles, setSelectedFiles] = useState<Attachment[]>([]);
  const [showSkillMenu, setShowSkillMenu] = useState(false);
  const [mounted, setMounted] = useState(false);

  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // 从 store 获取会话和操作方法
  const { getSession, addMessage, addMemory, addAgentKeyFact, updateAgentMemory, getAgentMemory, clearSession } = useAppStore();
  const session = getSession(agentId);
  const messages = session?.messages || [];
  const agentMemory = getAgentMemory(agentId);

  // 获取 agent 首字符
  const agentInitial = agentName.charAt(0);

  // 自动滚动到底部
  const scrollToBottom = useCallback(() => {
    if (viewportRef.current) {
      viewportRef.current.scrollTop = viewportRef.current.scrollHeight;
    }
  }, []);

  // 消息变化或打字时滚动
  useEffect(() => {
    scrollToBottom();
  }, [messages, isThinking, isTyping, currentReply, scrollToBottom]);

  // 组件挂载时聚焦输入框
  useEffect(() => {
    inputRef.current?.focus();
    setMounted(true);
  }, []);

  // 发送消息
  const handleSend = async (skillName?: string) => {
    const content = inputValue.trim();
    if ((!content && selectedFiles.length === 0) || isThinking) return;

    // 构建消息内容（包含文件信息和内容）
    let messageContent = content;
    if (selectedFiles.length > 0) {
      const fileSections = selectedFiles.map((f) => {
        let section = `\n## 附件: ${f.name}\n`;
        if (f.content) {
          // 包含文件内容
          section += `\n${f.content}\n`;
        } else {
          section += `\n[文件大小: ${f.size} bytes]\n`;
        }
        return section;
      });
      
      messageContent = content
        ? `${content}\n${fileSections.join("\n")}`
        : fileSections.join("\n");
    }

    // 创建用户消息
    const userMessage: Message = {
      id: generateId(),
      role: "user",
      content: messageContent,
      timestamp: Date.now(),
      agentId,
      attachments: selectedFiles.length > 0 ? selectedFiles : undefined,
      skillName: skillName,
    };

    // 添加到 store
    addMessage(agentId, userMessage);
    setInputValue("");
    setSelectedFiles([]);
    setShowSkillMenu(false);

    // 开始思考
    setIsThinking(true);

    try {
      // 构建历史消息并获取 AI 回复，传入 skillName
      // 注意：使用包含文件内容的 messageContent，而不是仅用户输入的 content
      const chatHistory = messages.map(m => ({ role: m.role as 'user' | 'assistant', content: m.content }));
      const responseContent = await getAIResponse(agentId, messageContent, systemPrompt, chatHistory, skillName);

      // 创建 assistant 消息
      const assistantMessage: Message = {
        id: generateId(),
        role: "assistant",
        content: responseContent,
        timestamp: Date.now(),
        agentId,
        skillName: skillName, // 传递 skillName 用于后续渲染判断
      };

      // 如果是周报（内容较长），直接显示完整内容，不使用打字机效果
      const isWeeklyReport = skillName === "weekly-report";
      
      if (isWeeklyReport) {
        // 周报直接显示，不使用打字机效果
        setIsThinking(false);
        addMessage(agentId, assistantMessage);
        
        // 更新 Agent 交互计数和最后交互时间
        const currentCount = agentMemory?.interactionCount || 0;
        updateAgentMemory(agentId, {
          interactionCount: currentCount + 1,
          lastInteraction: Date.now(),
        });
        
        // 每 5 轮对话（10 条消息）后触发记忆提炼
        const newMessageCount = messages.length + 2;
        if (newMessageCount % 10 === 0) {
          triggerMemoryExtraction();
        }
      } else {
        // 普通消息使用打字机效果
        setCurrentReply(assistantMessage);
        setIsThinking(false);
        setIsTyping(true);

        // 等待打字机效果完成（估算时间）
        const typingDuration = Math.min(responseContent.length * 40 + 500, 5000); // 最多5秒
        setTimeout(() => {
          setIsTyping(false);
          setCurrentReply(null);
          // 添加到 store
          addMessage(agentId, assistantMessage);
          
          // 更新 Agent 交互计数和最后交互时间
          const currentCount = agentMemory?.interactionCount || 0;
          updateAgentMemory(agentId, {
            interactionCount: currentCount + 1,
            lastInteraction: Date.now(),
          });
          
          // 每 5 轮对话（10 条消息）后触发记忆提炼
          const newMessageCount = messages.length + 2;
          if (newMessageCount % 10 === 0) {
            triggerMemoryExtraction();
          }
        }, typingDuration);
      }
    } catch (error) {
      console.error("获取回复失败:", error);
      setIsThinking(false);
    }
  };

  // 触发记忆提炼
  const triggerMemoryExtraction = async () => {
    try {
      const chatHistory = messages.map(m => ({ 
        role: m.role as 'user' | 'assistant', 
        content: m.content 
      }));
      
      const result = await extractMemoryFromConversation(agentId, chatHistory);
      
      if (result) {
        // 保存长期记忆
        result.longTermMemories.forEach((content) => {
          const memory: LongTermMemory = {
            id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            content,
            source: agentId,
            category: 'insight',
            createdAt: Date.now(),
            updatedAt: Date.now(),
          };
          addMemory(memory);
        });
        
        // 保存 Agent 专属记忆
        result.agentKeyFacts.forEach((fact) => {
          addAgentKeyFact(agentId, fact);
        });
        
        console.log('记忆提炼完成:', result);
      }
    } catch (error) {
      console.error('记忆提炼失败:', error);
    }
  };

  // 处理键盘事件 - 默认使用 weekly-report Skill
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend("weekly-report");
    }
  };

  // 处理发送按钮点击 - 默认使用 weekly-report Skill
  const handleSendClick = () => {
    handleSend("weekly-report");
  };

  // 是否有消息
  const hasMessages = messages.length > 0;

  return (
    <div className="flex flex-col h-full bg-[#faf9f5]">
      {/* 顶部 Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-[#c2c0b6] bg-[#faf9f5]">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#d97760] text-white font-medium">
            {agentInitial}
          </div>
          <div>
            <h2 className="text-base font-medium text-[#141413] font-serif">
              {agentName}
            </h2>
            <p className="text-xs text-[#5e5d59]">{agentTitle}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          {/* 清除历史按钮 - 仅在客户端挂载后显示 */}
          {mounted && messages.length > 0 && (
            <button
              onClick={() => {
                if (confirm("确定要清除所有对话历史吗？")) {
                  clearSession(agentId);
                }
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-[#5e5d59] hover:text-[#d97760] hover:bg-[#d97760]/10 rounded-lg transition-colors"
              title="清除对话历史"
            >
              <Trash2 className="h-3.5 w-3.5" />
              <span>清除</span>
            </button>
          )}
          
          {/* 记忆状态指示器 - 仅在客户端挂载后显示，避免 hydration 不匹配 */}
          {mounted && agentMemory && agentMemory.interactionCount > 0 && (
            <div className="group relative flex items-center gap-1.5 text-[#d97760]">
              <Brain className="h-4 w-4" />
              <span className="text-xs font-medium">{agentMemory.interactionCount}</span>
              {/* Tooltip */}
              <div className="absolute right-0 top-full mt-2 hidden group-hover:block z-10">
                <div className="bg-[#141413] text-white text-xs px-3 py-1.5 rounded-lg whitespace-nowrap">
                  已交互 {agentMemory.interactionCount} 次
                  <div className="absolute -top-1 right-3 w-2 h-2 bg-[#141413] rotate-45"></div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 消息列表区域 */}
      <ScrollArea className="flex-1" ref={scrollAreaRef}>
        <div ref={viewportRef} className="px-6 py-6">
          {/* 空对话时显示欢迎消息 - 仅在客户端挂载后根据实际状态显示 */}
          {mounted && !hasMessages && !currentReply && (
            <WelcomeMessage
              agentName={agentName}
              agentTitle={agentTitle}
              welcomeMessage={
                welcomeMessage ||
                `吾乃${agentName}，${agentTitle}。有何指教，但说无妨。`
              }
              agentInitial={agentInitial}
            />
          )}

          {/* 历史消息 - 仅在客户端挂载后渲染，避免 hydration 不匹配 */}
          {mounted && (
            <div className="space-y-6">
              {messages.map((message) => (
                <MessageBubble
                  key={message.id}
                  message={message}
                  agentName={agentName}
                  agentInitial={agentInitial}
                  isTyping={false}
                />
              ))}

              {/* 正在思考 */}
              {isThinking && <ThinkingIndicator agentName={agentName} />}

              {/* 正在打字的消息 */}
              {currentReply && isTyping && (
                <MessageBubble
                  message={currentReply}
                  agentName={agentName}
                  agentInitial={agentInitial}
                  isTyping={true}
                  typingSpeed={40}
                />
              )}
            </div>
          )}
        </div>
      </ScrollArea>

      {/* 底部输入区域 */}
      <div className="px-6 py-4 border-t border-[#c2c0b6] bg-[#faf9f5]">
        <div className="flex items-end gap-3">
          {/* 文件上传按钮 */}
          <FileUpload
            onFilesSelected={setSelectedFiles}
            onClearFiles={() => setSelectedFiles([])}
            selectedFiles={selectedFiles}
            disabled={isThinking || isTyping}
          />

          {/* Skill 标识 - 默认使用 weekly-report */}
          <div 
            className="flex items-center gap-1 px-2 py-1 rounded-lg bg-[#f0eee6] text-[#5e5d59]"
            title="已启用周报生成 Skill"
          >
            <Sparkles className="h-3.5 w-3.5 text-[#d97760]" />
            <span className="text-xs">周报模式</span>
          </div>

          <div className="flex-1 relative">
            <Input
              ref={inputRef}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={placeholder}
              disabled={isThinking || isTyping}
              className={cn(
                "min-h-[44px] py-3 px-4 bg-white border-[#c2c0b6] rounded-xl",
                "text-sm text-[#141413] placeholder:text-[#5e5d59]/50",
                "focus-visible:ring-[#d97760] focus-visible:ring-1 focus-visible:border-[#d97760]",
                "disabled:opacity-60 disabled:cursor-not-allowed"
              )}
            />
          </div>
          <Button
            onClick={handleSendClick}
            disabled={(!inputValue.trim() && selectedFiles.length === 0) || isThinking || isTyping}
            className={cn(
              "h-11 w-11 shrink-0 rounded-xl bg-[#d97760] hover:bg-[#c96a54]",
              "text-white shadow-sm transition-all duration-200",
              "disabled:opacity-50 disabled:cursor-not-allowed",
              "flex items-center justify-center p-0"
            )}
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>

        {/* 提示文字 */}
        <p className="mt-2 text-[10px] text-[#5e5d59]/60 text-center">
          {isThinking
            ? `${agentName}正在思索...`
            : isTyping
            ? `${agentName}正在回复...`
            : selectedFiles.length > 0
            ? `已选择 ${selectedFiles.length} 个文件，按 Enter 发送`
            : "按 Enter 发送消息"}
        </p>
      </div>
    </div>
  );
}
