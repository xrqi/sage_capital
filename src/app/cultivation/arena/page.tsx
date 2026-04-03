"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Swords,
  Send,
  RotateCcw,
  Home,
  CheckCircle,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { getMockResponse } from "@/lib/mock-ai";

// 预设辩题
const presetTopics = [
  "人性本善还是本恶？",
  "自由意志是否存在？",
  "科技发展利大于弊还是弊大于利？",
  "成功靠努力还是靠天赋？",
  "应该追求稳定还是冒险？",
  "AI会让人类更幸福还是更迷失？",
  "独处优于社交还是社交优于独处？",
  "知识重要还是智慧重要？",
];

// 辩论观点类型
interface DebateArgument {
  id: string;
  userContent: string;
  agentContent: string;
  timestamp: number;
}

export default function ArenaPage() {
  // 状态管理
  const [phase, setPhase] = useState<"select" | "debate" | "summary">("select");
  const [currentTopic, setCurrentTopic] = useState("");
  const [customTopic, setCustomTopic] = useState("");
  const [arguments_list, setArguments] = useState<DebateArgument[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isThinking, setIsThinking] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // 选择辩题
  const handleSelectTopic = (topic: string) => {
    setCurrentTopic(topic);
    setPhase("debate");
  };

  // 提交自定义辩题
  const handleCustomTopic = () => {
    if (customTopic.trim()) {
      setCurrentTopic(customTopic.trim());
      setPhase("debate");
    }
  };

  // 提交观点
  const handleSubmitArgument = async () => {
    const content = inputValue.trim();
    if (!content || isThinking) return;

    setInputValue("");
    setIsThinking(true);

    try {
      // 获取 Agent 反驳
      const agentResponse = await getMockResponse("arena-debater", content);

      const newArgument: DebateArgument = {
        id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        userContent: content,
        agentContent: agentResponse,
        timestamp: Date.now(),
      };

      setArguments((prev) => [...prev, newArgument]);
    } catch (error) {
      console.error("获取回复失败:", error);
    } finally {
      setIsThinking(false);
    }
  };

  // 结束辩论
  const handleEndDebate = () => {
    setPhase("summary");
  };

  // 重新开始
  const handleRestart = () => {
    setPhase("select");
    setCurrentTopic("");
    setCustomTopic("");
    setArguments([]);
    setInputValue("");
  };

  // 返回主页
  const handleGoHome = () => {
    // 使用 Link 组件导航，这里只是状态重置
    setPhase("select");
    setCurrentTopic("");
    setCustomTopic("");
    setArguments([]);
    setInputValue("");
  };

  // 处理键盘事件
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmitArgument();
    }
  };

  return (
    <div className="h-full flex flex-col bg-[#faf9f5]">
      {/* Header */}
      <div className="flex items-center gap-4 px-6 py-4 border-b border-[#c2c0b6] bg-[#faf9f5]">
        <Link
          href="/cultivation"
          className="flex items-center gap-2 text-sm text-[#5e5d59] hover:text-[#d97760] transition-colors font-serif"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>返回问道阁</span>
        </Link>
        <div className="flex-1" />
        <div className="flex items-center gap-2">
          <Swords className="h-4 w-4 text-[#d97760]" />
          <span className="text-sm text-[#5e5d59] font-serif">论道场</span>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-hidden">
        {/* 选题阶段 */}
        {phase === "select" && (
          <div className="h-full overflow-auto p-8">
            <div className="max-w-4xl mx-auto">
              {/* Title */}
              <div className="text-center mb-10">
                <h1 className="text-3xl font-bold text-[#141413] font-serif tracking-wide mb-3">
                  论道场
                </h1>
                <p className="text-[#5e5d59] font-serif">
                  以辩明理，以论破执
                </p>
                <div className="w-12 h-0.5 bg-[#d97760] mx-auto mt-4" />
              </div>

              {/* 预设辩题 */}
              <div className="mb-8">
                <h2 className="text-sm font-medium text-[#9a9590] mb-4 font-serif tracking-wider">
                  选择辩题
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {presetTopics.map((topic, index) => (
                    <Card
                      key={index}
                      className="cursor-pointer border border-[#c2c0b6] bg-white hover:border-[#d97760] hover:shadow-md transition-all duration-300"
                      onClick={() => handleSelectTopic(topic)}
                    >
                      <CardContent className="p-4">
                        <p className="text-[#141413] font-serif">{topic}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              {/* 自定义辩题 */}
              <div>
                <h2 className="text-sm font-medium text-[#9a9590] mb-4 font-serif tracking-wider">
                  或自拟辩题
                </h2>
                <div className="flex gap-3">
                  <Input
                    value={customTopic}
                    onChange={(e) => setCustomTopic(e.target.value)}
                    placeholder="输入你想探讨的话题..."
                    className="flex-1 bg-white border-[#c2c0b6] focus-visible:ring-[#d97760] font-serif"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleCustomTopic();
                    }}
                  />
                  <Button
                    onClick={handleCustomTopic}
                    disabled={!customTopic.trim()}
                    className="bg-[#d97760] hover:bg-[#c96a54] text-white font-serif"
                  >
                    开始
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 辩论阶段 */}
        {phase === "debate" && (
          <div className="h-full flex flex-col">
            {/* 辩题显示 */}
            <div className="px-6 py-3 bg-[#f0eee6] border-b border-[#c2c0b6]">
              <p className="text-sm text-[#9a9590] font-serif mb-1">当前辩题</p>
              <p className="text-lg text-[#141413] font-serif font-medium">
                {currentTopic}
              </p>
            </div>

            {/* 辩论区域 - 左右分栏 */}
            <ScrollArea className="flex-1" ref={scrollRef}>
              <div className="p-6">
                <div className="max-w-5xl mx-auto">
                  {/* 表头 */}
                  <div className="grid grid-cols-2 gap-6 mb-6">
                    <div className="text-center pb-3 border-b-2 border-[#d97760]">
                      <span className="text-[#d97760] font-serif font-medium">
                        我方
                      </span>
                    </div>
                    <div className="text-center pb-3 border-b-2 border-[#5e5d59]">
                      <span className="text-[#5e5d59] font-serif font-medium">
                        对方 · 辩才天王
                      </span>
                    </div>
                  </div>

                  {/* 辩论内容 */}
                  <div className="space-y-6">
                    {arguments_list.length === 0 && (
                      <div className="text-center py-12 text-[#9a9590] font-serif">
                        <p>请先在左侧输入你的观点，开启辩论</p>
                      </div>
                    )}

                    {arguments_list.map((arg, index) => (
                      <div key={arg.id} className="grid grid-cols-2 gap-6">
                        {/* 用户观点 */}
                        <div className="bg-white border border-[#c2c0b6] rounded-lg p-4">
                          <p className="text-[#141413] font-serif leading-relaxed">
                            {arg.userContent}
                          </p>
                          <p className="text-xs text-[#9a9590] mt-2 font-serif">
                            第{index + 1}轮
                          </p>
                        </div>

                        {/* Agent 反驳 */}
                        <div className="bg-[#f0eee6] border border-[#c2c0b6] rounded-lg p-4">
                          <p className="text-[#141413] font-serif leading-relaxed">
                            {arg.agentContent}
                          </p>
                          <p className="text-xs text-[#9a9590] mt-2 font-serif">
                            辩才天王
                          </p>
                        </div>
                      </div>
                    ))}

                    {/* 思考中指示器 */}
                    {isThinking && (
                      <div className="grid grid-cols-2 gap-6">
                        <div />
                        <div className="bg-[#f0eee6] border border-[#c2c0b6] rounded-lg p-4">
                          <div className="flex items-center gap-2 text-[#9a9590]">
                            <div className="flex gap-1">
                              <span className="w-2 h-2 bg-[#9a9590] rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                              <span className="w-2 h-2 bg-[#9a9590] rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                              <span className="w-2 h-2 bg-[#9a9590] rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                            </div>
                            <span className="text-sm font-serif">辩才天王思索中...</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </ScrollArea>

            {/* 底部输入区和结束按钮 */}
            <div className="border-t border-[#c2c0b6] bg-[#faf9f5] p-4">
              <div className="max-w-5xl mx-auto">
                <div className="flex items-end gap-3">
                  <div className="flex-1">
                    <Input
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      onKeyDown={handleKeyDown}
                      placeholder="阐述你的观点..."
                      disabled={isThinking}
                      className="bg-white border-[#c2c0b6] focus-visible:ring-[#d97760] font-serif min-h-[44px]"
                    />
                  </div>
                  <Button
                    onClick={handleSubmitArgument}
                    disabled={!inputValue.trim() || isThinking}
                    className="bg-[#d97760] hover:bg-[#c96a54] text-white h-11 px-4"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                  <Button
                    onClick={handleEndDebate}
                    variant="outline"
                    className="border-[#c2c0b6] text-[#5e5d59] hover:text-[#d97760] hover:border-[#d97760] h-11 font-serif"
                  >
                    结束辩论
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 总结阶段 */}
        {phase === "summary" && (
          <div className="h-full overflow-auto p-8">
            <div className="max-w-2xl mx-auto">
              {/* 标题 */}
              <div className="text-center mb-8">
                <div className="inline-flex items-center gap-2 mb-4">
                  <CheckCircle className="h-6 w-6 text-[#8b9a7c]" />
                  <span className="text-lg text-[#8b9a7c] font-serif">辩论结束</span>
                </div>
                <h2 className="text-2xl font-bold text-[#141413] font-serif mb-2">
                  认知收获
                </h2>
                <p className="text-[#5e5d59] font-serif">
                  本次辩题：{currentTopic}
                </p>
              </div>

              {/* 总结卡片 */}
              <Card className="border border-[#c2c0b6] bg-white mb-8">
                <CardContent className="p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <Sparkles className="h-5 w-5 text-[#d97760]" />
                    <h3 className="text-lg font-medium text-[#141413] font-serif">
                      思辨总结
                    </h3>
                  </div>

                  <div className="space-y-4 text-[#5e5d59] font-serif leading-relaxed">
                    <p>
                      通过本次辩论，你展现了<span className="text-[#d97760]">清晰的逻辑思维</span>和
                      <span className="text-[#d97760]">敢于质疑的勇气</span>。
                      在面对对立观点时，你能够保持理性思考，这是极为可贵的品质。
                    </p>
                    <p>
                      然而，辩论中也暴露出一些可以改进之处：有时过于坚持己见，
                      未能充分考虑对方观点的合理内核。真正的智慧不在于驳倒对方，
                      而在于在交锋中看见事物的多面性。
                    </p>
                    <p>
                      建议今后在表达观点前，先试着用对方的视角审视问题。
                      记住：<span className="text-[#141413] font-medium">兼听则明，偏信则暗</span>。
                      每一次辩论都是一次自我完善的机会。
                    </p>
                  </div>

                  <div className="mt-6 pt-4 border-t border-[#c2c0b6]/50">
                    <p className="text-sm text-[#9a9590] font-serif italic">
                      "君子和而不同，小人同而不和。"
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* 操作按钮 */}
              <div className="flex justify-center gap-4">
                <Button
                  onClick={handleRestart}
                  className="bg-[#d97760] hover:bg-[#c96a54] text-white font-serif"
                >
                  <RotateCcw className="h-4 w-4 mr-2" />
                  再来一场
                </Button>
                <Link href="/cultivation">
                  <Button
                    variant="outline"
                    className="border-[#c2c0b6] text-[#5e5d59] hover:text-[#d97760] hover:border-[#d97760] font-serif"
                    onClick={handleGoHome}
                  >
                    <Home className="h-4 w-4 mr-2" />
                    返回问道阁
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
