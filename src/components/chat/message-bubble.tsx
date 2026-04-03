"use client";

import { useEffect, useState } from "react";
import { FileText, Image, File, Sparkles } from "lucide-react";
import { Message, Attachment } from "@/lib/types";
import { cn } from "@/lib/utils";
import { MarkdownRenderer } from "./markdown-renderer";

// 获取文件图标
function getFileIcon(type: string) {
  if (type.startsWith("image/")) return Image;
  if (type.includes("text") || type.includes("markdown")) return FileText;
  return File;
}

// 格式化文件大小
function formatFileSize(bytes: number): string {
  if (bytes < 1024) return bytes + " B";
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
  return (bytes / (1024 * 1024)).toFixed(1) + " MB";
}

// 附件列表组件
function AttachmentList({ attachments }: { attachments: Attachment[] }) {
  return (
    <div className="flex flex-wrap gap-2 mt-2">
      {attachments.map((file) => {
        const Icon = getFileIcon(file.type);
        return (
          <div
            key={file.id}
            className="flex items-center gap-1.5 px-2 py-1 bg-[#f0eee6] rounded-lg"
          >
            <Icon className="h-3 w-3 text-[#5e5d59]" />
            <span className="text-xs text-[#141413] truncate max-w-[120px]">
              {file.name}
            </span>
            <span className="text-[10px] text-[#5e5d59]">
              {formatFileSize(file.size)}
            </span>
          </div>
        );
      })}
    </div>
  );
}

interface MessageBubbleProps {
  message: Message;
  agentName: string;
  agentInitial: string;
  isTyping?: boolean;
  typingSpeed?: number; // 每字符显示的毫秒数
}

// 格式化时间戳
function formatTime(timestamp: number): string {
  const date = new Date(timestamp);
  return date.toLocaleTimeString("zh-CN", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function MessageBubble({
  message,
  agentName,
  agentInitial,
  isTyping = false,
  typingSpeed = 40,
}: MessageBubbleProps) {
  const isUser = message.role === "user";
  // 使用统一的初始状态，避免服务端/客户端不一致
  const [displayContent, setDisplayContent] = useState(message.content);
  const [isTypingComplete, setIsTypingComplete] = useState(true);
  const [mounted, setMounted] = useState(false);

  // 客户端挂载后处理打字机效果
  useEffect(() => {
    setMounted(true);
    
    // 如果不是打字状态，直接显示完整内容
    if (isUser || !isTyping) {
      setDisplayContent(message.content);
      setIsTypingComplete(true);
      return;
    }

    // 打字状态：客户端挂载后才开始打字效果
    setDisplayContent("");
    setIsTypingComplete(false);

    let currentIndex = 0;
    const content = message.content;

    const typeChar = () => {
      if (currentIndex < content.length) {
        setDisplayContent(content.slice(0, currentIndex + 1));
        currentIndex++;
        // 随机延迟，模拟真实打字
        const randomDelay = typingSpeed + Math.random() * 20 - 10;
        setTimeout(typeChar, randomDelay);
      } else {
        setIsTypingComplete(true);
      }
    };

    // 开始打字
    const timeoutId = setTimeout(typeChar, typingSpeed);

    return () => clearTimeout(timeoutId);
  }, [message.content, isUser, isTyping, typingSpeed]);

  return (
    <div
      className={cn(
        "flex gap-3",
        isUser ? "flex-row-reverse" : "flex-row"
      )}
    >
      {/* 头像 */}
      <div
        className={cn(
          "flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-medium",
          isUser
            ? "bg-[#d97760]/10 text-[#d97760]"
            : "bg-[#d97760] text-white"
        )}
      >
        {isUser ? "我" : agentInitial}
      </div>

      {/* 消息内容 */}
      <div className={cn("flex flex-col", isUser ? "items-end" : "items-start")}>
        {/* 名称和时间 */}
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs font-medium text-[#5e5d59] font-serif">
            {isUser ? "我" : agentName}
          </span>
          <span className="text-[10px] text-[#5e5d59]/60">
            {formatTime(message.timestamp)}
          </span>
        </div>

        {/* 消息气泡 */}
        <div
          className={cn(
            "relative max-w-[85%] rounded-2xl overflow-hidden",
            isUser
              ? "bg-[#d97760]/10 text-[#141413] rounded-tr-sm"
              : "bg-white text-[#141413] border border-[#c2c0b6] rounded-tl-sm shadow-sm",
            // 如果是周报（包含Markdown格式），使用更宽的布局和特殊样式
            !isUser && message.skillName === "weekly-report" && "max-w-[95%] border-[#d97760]/20 shadow-md"
          )}
        >
          {/* Skill 调用标识 */}
          {message.skillName && (
            <div className="flex items-center gap-1.5 px-4 pt-3 pb-2 border-b border-[#c2c0b6]/30 bg-[#f0eee6]/30">
              <Sparkles className="h-3.5 w-3.5 text-[#d97760]" />
              <span className="text-xs text-[#5e5d59] font-medium">
                {message.skillName === "weekly-report" ? "📋 周报生成" : message.skillName}
              </span>
            </div>
          )}
          
          {/* 消息内容 - 使用 Markdown 渲染或纯文本 */}
          <div className={cn(
            "px-4 py-3",
            // 如果是周报，使用更大的内边距
            !isUser && message.skillName === "weekly-report" && "px-6 py-5"
          )}>
            {!isUser && message.skillName === "weekly-report" ? (
              // 周报使用 Markdown 渲染（使用原始内容，不是打字机内容）
              <MarkdownRenderer content={message.content} />
            ) : (
              // 普通消息使用纯文本 - 过滤掉附件内容，只显示用户输入
              <span className="whitespace-pre-wrap text-sm leading-relaxed">
                {isUser 
                  ? message.content.split('\n## 附件:')[0] || displayContent.split('\n## 附件:')[0]
                  : displayContent
                }
              </span>
            )}
          </div>
          
          {/* 附件列表 */}
          {message.attachments && message.attachments.length > 0 && (
            <div className="px-4 pb-3">
              <AttachmentList attachments={message.attachments} />
            </div>
          )}
          
          {/* 打字中指示器 */}
          {!isUser && isTyping && !isTypingComplete && (
            <div className="px-4 pb-3">
              <span className="inline-flex ml-1">
                <span className="animate-pulse">·</span>
                <span className="animate-pulse delay-100">·</span>
                <span className="animate-pulse delay-200">·</span>
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// 欢迎消息组件
interface WelcomeMessageProps {
  agentName: string;
  agentTitle: string;
  welcomeMessage?: string;
  agentInitial: string;
}

export function WelcomeMessage({
  agentName,
  agentTitle,
  welcomeMessage,
  agentInitial,
}: WelcomeMessageProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      {/* Agent 头像 */}
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#d97760] text-white text-xl font-medium mb-4">
        {agentInitial}
      </div>

      {/* Agent 信息 */}
      <h3 className="text-lg font-medium text-[#141413] font-serif mb-1">
        {agentName}
      </h3>
      <p className="text-sm text-[#5e5d59] mb-4">{agentTitle}</p>

      {/* 欢迎消息 */}
      {welcomeMessage && (
        <div className="max-w-md px-6 py-4 bg-white border border-[#c2c0b6] rounded-xl shadow-sm">
          <p className="text-sm text-[#141413] leading-relaxed font-serif">
            {welcomeMessage}
          </p>
        </div>
      )}
    </div>
  );
}

// 正在思考指示器
export function ThinkingIndicator({ agentName }: { agentName: string }) {
  return (
    <div className="flex gap-3">
      {/* 头像占位 */}
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#d97760] text-white text-sm font-medium">
        {agentName.charAt(0)}
      </div>

      <div className="flex flex-col items-start">
        <span className="text-xs font-medium text-[#5e5d59] font-serif mb-1">
          {agentName}
        </span>

        <div className="px-4 py-3 bg-white border border-[#c2c0b6] rounded-2xl rounded-tl-sm shadow-sm">
          <div className="flex items-center gap-1.5">
            <span className="text-xs text-[#5e5d59]">正在思考</span>
            <span className="flex">
              <span className="w-1 h-1 bg-[#d97760] rounded-full animate-bounce" />
              <span className="w-1 h-1 bg-[#d97760] rounded-full animate-bounce delay-100 ml-1" />
              <span className="w-1 h-1 bg-[#d97760] rounded-full animate-bounce delay-200 ml-1" />
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
