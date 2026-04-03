"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Archive,
  X,
  Plus,
  Brain,
  Lightbulb,
  Clock,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAppStore } from "@/lib/store";

// Mock 默认数据
const defaultTags = [
  "理性思考者",
  "好奇心旺盛",
  "完美主义倾向",
  "善于共情",
  "逻辑导向",
];

const defaultThinkingPatterns = [
  { name: "系统性思维", description: "善于从整体角度分析问题，关注各部分之间的联系" },
  { name: "发散性联想", description: "能够从一个点延伸到多个方向，产生丰富的联想" },
  { name: "直觉决策倾向", description: "在信息不完整时，倾向于依靠直觉做出判断" },
];

const defaultTimeline = [
  {
    date: "2026-01-15",
    event: "开始使用问道阁",
    insight: "踏上自我探索之旅",
  },
  {
    date: "2026-02-20",
    event: "完成首次辩论",
    insight: "学会从对立面思考问题",
  },
  {
    date: "2026-03-10",
    event: "深度内观对话",
    insight: "发现了自己对不确定性的恐惧",
  },
];

export default function ArchivePage() {
  // 从 store 获取用户画像
  const { userProfile, addTag, removeTag, addGrowthEvent } = useAppStore();

  // 本地状态
  const [newTag, setNewTag] = useState("");

  // 合并 store 数据和默认数据
  const tags = userProfile.tags.length > 0 ? userProfile.tags : defaultTags;
  const thinkingPatterns =
    userProfile.thinkingPatterns.length > 0
      ? userProfile.thinkingPatterns.map((name) => ({
          name,
          description: "基于你的对话行为分析得出",
        }))
      : defaultThinkingPatterns;
  const timeline =
    userProfile.growthTimeline.length > 0
      ? userProfile.growthTimeline
      : defaultTimeline;

  // 添加标签
  const handleAddTag = () => {
    if (newTag.trim()) {
      addTag(newTag.trim());
      setNewTag("");
    }
  };

  // 删除标签
  const handleRemoveTag = (tag: string) => {
    removeTag(tag);
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
          <Archive className="h-4 w-4 text-[#d97760]" />
          <span className="text-sm text-[#5e5d59] font-serif">鉴真阁</span>
        </div>
      </div>

      {/* Content */}
      <ScrollArea className="flex-1">
        <div className="p-8">
          <div className="max-w-4xl mx-auto">
            {/* Title */}
            <div className="text-center mb-10">
              <h1 className="text-3xl font-bold text-[#141413] font-serif tracking-wide mb-3">
                鉴真阁
              </h1>
              <p className="text-[#5e5d59] font-serif">观过知仁，察己明性</p>
              <div className="w-12 h-0.5 bg-[#d97760] mx-auto mt-4" />
            </div>

            {/* 性格特征标签区 */}
            <Card className="border border-[#c2c0b6] bg-white mb-6">
              <CardHeader className="pb-4">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-[#d97760]" />
                  <CardTitle className="text-lg font-serif text-[#141413]">
                    性格特征
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2 mb-4">
                  {tags.map((tag) => (
                    <Badge
                      key={tag}
                      variant="secondary"
                      className="bg-[#f0eee6] text-[#5e5d59] hover:bg-[#e8e6de] px-3 py-1 text-sm font-serif cursor-pointer group"
                    >
                      {tag}
                      <button
                        onClick={() => handleRemoveTag(tag)}
                        className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Input
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    placeholder="添加新标签..."
                    className="flex-1 bg-[#faf9f5] border-[#c2c0b6] focus-visible:ring-[#d97760] font-serif text-sm"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleAddTag();
                    }}
                  />
                  <Button
                    onClick={handleAddTag}
                    disabled={!newTag.trim()}
                    size="sm"
                    className="bg-[#d97760] hover:bg-[#c96a54] text-white"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* 思维模式区 */}
            <Card className="border border-[#c2c0b6] bg-white mb-6">
              <CardHeader className="pb-4">
                <div className="flex items-center gap-2">
                  <Brain className="h-5 w-5 text-[#d97760]" />
                  <CardTitle className="text-lg font-serif text-[#141413]">
                    思维模式
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {thinkingPatterns.map((pattern, index) => (
                    <div
                      key={index}
                      className="bg-[#f0eee6] rounded-lg p-4 border border-[#c2c0b6]/50"
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <Lightbulb className="h-4 w-4 text-[#d97760]" />
                        <h3 className="font-medium text-[#141413] font-serif">
                          {pattern.name}
                        </h3>
                      </div>
                      <p className="text-sm text-[#5e5d59] font-serif leading-relaxed">
                        {pattern.description}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* 成长轨迹时间线 */}
            <Card className="border border-[#c2c0b6] bg-white mb-6">
              <CardHeader className="pb-4">
                <div className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-[#d97760]" />
                  <CardTitle className="text-lg font-serif text-[#141413]">
                    成长轨迹
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="relative">
                  {/* 时间线 */}
                  <div className="absolute left-4 top-0 bottom-0 w-px bg-[#c2c0b6]" />

                  <div className="space-y-6">
                    {timeline.map((item, index) => (
                      <div key={index} className="relative pl-10">
                        {/* 时间点 */}
                        <div className="absolute left-2 top-1.5 w-5 h-5 rounded-full bg-[#faf9f5] border-2 border-[#d97760] flex items-center justify-center">
                          <div className="w-2 h-2 rounded-full bg-[#d97760]" />
                        </div>

                        {/* 内容 */}
                        <div className="bg-[#f0eee6] rounded-lg p-4 border border-[#c2c0b6]/50">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-xs text-[#9a9590] font-serif">
                              {item.date}
                            </span>
                          </div>
                          <h3 className="font-medium text-[#141413] font-serif mb-1">
                            {item.event}
                          </h3>
                          <p className="text-sm text-[#5e5d59] font-serif italic">
                            "{item.insight}"
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 底部说明 */}
            <div className="text-center py-4">
              <p className="text-sm text-[#9a9590] font-serif">
                此画像由 AI 基于你的对话与行为自动生成，仅供参考。
                <br />
                你也可以手动编辑和补充。
              </p>
            </div>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}
