"use client";

import { useState, useCallback, useEffect } from "react";
import { BookOpen, RefreshCw, ArrowLeft, Quote, ChevronDown, Loader2, Download } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { getAIConfig } from "@/lib/ai-config";

// localStorage 缓存 key
const QUOTES_CACHE_KEY = "quotes_cache_v1";
const LOADED_CATEGORIES_KEY = "quotes_loaded_categories_v1";

interface CachedQuotes {
  [categoryId: string]: QuoteItem[];
}

interface QuoteItem {
  content: string;
  author: string;
  source?: string;
}

interface Category {
  id: string;
  name: string;
  description: string;
  prompt: string;
}

const categories: Category[] = [
  { 
    id: "tangshi", 
    name: "唐诗三百首", 
    description: "盛唐气象，诗韵流芳",
    prompt: `请提供50首完整的唐诗（不是只给一句）。要求：
1. 选取最著名、最优美的唐诗全篇
2. 每条包含：content（完整诗作全文，包括所有句子）、author（诗人姓名）、source（诗题）
3. 返回严格的JSON数组格式，不要任何其他文字说明
4. 示例格式：[{"content":"床前明月光，疑是地上霜。举头望明月，低头思故乡。","author":"李白","source":"《静夜思》"}]`
  },
  { 
    id: "songci", 
    name: "宋词", 
    description: "婉约豪放，词牌悠扬",
    prompt: `请提供50首完整的宋词（不是只给一句）。要求：
1. 选取最著名、最优美的宋词全篇，包括婉约派和豪放派
2. 每条包含：content（完整词作全文，包括所有句子）、author（词人姓名）、source（词牌名和词题）
3. 返回严格的JSON数组格式，不要任何其他文字说明
4. 示例格式：[{"content":"明月几时有？把酒问青天。不知天上宫阙，今夕是何年。","author":"苏轼","source":"《水调歌头·明月几时有》"}]`
  },
  { 
    id: "shijing", 
    name: "诗经", 
    description: "先民之歌，风雅颂声",
    prompt: `请提供30首完整的诗经篇章（不是只给一句）。要求：
1. 从风、雅、颂各部分选取最经典的完整篇章
2. 每条包含：content（完整诗篇全文）、author（可不填或填"诗经"）、source（具体篇名，如《关雎》《蒹葭》等）
3. 返回严格的JSON数组格式，不要任何其他文字说明
4. 示例格式：[{"content":"关关雎鸠，在河之洲。窈窕淑女，君子好逑。参差荇菜，左右流之。","author":"","source":"《关雎》"}]`
  },
  { 
    id: "classics", 
    name: "诸子百家", 
    description: "圣贤之道，智慧之源",
    prompt: `请提供100条诸子百家经典名句。要求：
1. 选取最具哲理、最富智慧的名句（可以是完整段落或名言）
2. 每条包含：content（名句完整内容）、author（作者，如孔子、老子等）、source（具体篇章，如《论语·学而》）
3. 返回严格的JSON数组格式，不要任何其他文字说明
4. 示例格式：[{"content":"学而时习之，不亦说乎？有朋自远方来，不亦乐乎？","author":"孔子","source":"《论语·学而》"}]`
  },
];

// 默认本地数据，作为后备（完整诗词）
const defaultQuotes: Record<string, QuoteItem[]> = {
  tangshi: [
    { 
      content: "床前明月光，疑是地上霜。\n举头望明月，低头思故乡。", 
      author: "李白", 
      source: "《静夜思》" 
    },
    { 
      content: "春眠不觉晓，处处闻啼鸟。\n夜来风雨声，花落知多少。", 
      author: "孟浩然", 
      source: "《春晓》" 
    },
    { 
      content: "白日依山尽，黄河入海流。\n欲穷千里目，更上一层楼。", 
      author: "王之涣", 
      source: "《登鹳雀楼》" 
    },
    { 
      content: "红豆生南国，春来发几枝。\n愿君多采撷，此物最相思。", 
      author: "王维", 
      source: "《相思》" 
    },
  ],
  songci: [
    { 
      content: "明月几时有？把酒问青天。\n不知天上宫阙，今夕是何年。\n我欲乘风归去，又恐琼楼玉宇，高处不胜寒。\n起舞弄清影，何似在人间。", 
      author: "苏轼", 
      source: "《水调歌头·明月几时有》" 
    },
    { 
      content: "大江东去，浪淘尽，千古风流人物。\n故垒西边，人道是，三国周郎赤壁。\n乱石穿空，惊涛拍岸，卷起千堆雪。\n江山如画，一时多少豪杰。", 
      author: "苏轼", 
      source: "《念奴娇·赤壁怀古》" 
    },
    { 
      content: "寻寻觅觅，冷冷清清，凄凄惨惨戚戚。\n乍暖还寒时候，最难将息。\n三杯两盏淡酒，怎敌他、晚来风急！\n雁过也，正伤心，却是旧时相识。", 
      author: "李清照", 
      source: "《声声慢》" 
    },
  ],
  shijing: [
    { 
      content: "关关雎鸠，在河之洲。\n窈窕淑女，君子好逑。\n参差荇菜，左右流之。\n窈窕淑女，寤寐求之。", 
      author: "", 
      source: "《关雎》" 
    },
    { 
      content: "蒹葭苍苍，白露为霜。\n所谓伊人，在水一方。\n溯洄从之，道阻且长。\n溯游从之，宛在水中央。", 
      author: "", 
      source: "《蒹葭》" 
    },
  ],
  classics: [
    { 
      content: "学而时习之，不亦说乎？\n有朋自远方来，不亦乐乎？\n人不知而不愠，不亦君子乎？", 
      author: "孔子", 
      source: "《论语·学而》" 
    },
    { 
      content: "非淡泊无以明志，非宁静无以致远。\n夫学须静也，才须学也，非学无以广才，非志无以成学。", 
      author: "诸葛亮", 
      source: "《诫子书》" 
    },
    { 
      content: "上善若水。水善利万物而不争，处众人之所恶，故几于道。\n居善地，心善渊，与善仁，言善信，正善治，事善能，动善时。\n夫唯不争，故无尤。", 
      author: "老子", 
      source: "《道德经》" 
    },
  ],
};

async function fetchQuotesFromAI(category: Category): Promise<QuoteItem[]> {
  const config = getAIConfig();
  
  if (!config.isConfigured) {
    console.log("AI未配置，使用默认数据");
    return defaultQuotes[category.id] || [];
  }

  try {
    const response = await fetch(`${config.apiUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${config.apiKey}`,
      },
      body: JSON.stringify({
        model: config.model,
        messages: [
          { role: 'system', content: '你是一个中国古典文学专家。请严格按照用户要求的格式返回JSON数据，不要添加任何其他文字说明。' },
          { role: 'user', content: category.prompt }
        ],
        temperature: 0.7,
        max_tokens: 4000,
      }),
    });

    if (!response.ok) {
      throw new Error(`API调用失败: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;
    
    if (!content) {
      throw new Error("API返回内容为空");
    }

    // 尝试解析JSON
    try {
      // 清理可能的markdown代码块
      const jsonStr = content.replace(/```json\n?|\n?```/g, '').trim();
      const quotes = JSON.parse(jsonStr);
      if (Array.isArray(quotes) && quotes.length > 0) {
        return quotes.slice(0, 100); // 最多100条
      }
    } catch (parseError) {
      console.error("JSON解析失败，尝试提取数组:", parseError);
      // 尝试从文本中提取JSON数组
      const match = content.match(/\[[\s\S]*\]/);
      if (match) {
        return JSON.parse(match[0]).slice(0, 100);
      }
    }
    
    throw new Error("无法解析返回的数据");
  } catch (error) {
    console.error("获取AI数据失败:", error);
    return defaultQuotes[category.id] || [];
  }
}

function getRandomQuote(quotes: QuoteItem[], currentQuote: QuoteItem | null): QuoteItem {
  if (quotes.length <= 1) return quotes[0];
  
  let newIndex;
  do {
    newIndex = Math.floor(Math.random() * quotes.length);
  } while (quotes[newIndex] === currentQuote);
  
  return quotes[newIndex];
}

// 从 localStorage 读取缓存
function getCachedQuotes(): CachedQuotes {
  if (typeof window === "undefined") return {};
  try {
    const cached = localStorage.getItem(QUOTES_CACHE_KEY);
    return cached ? JSON.parse(cached) : {};
  } catch {
    return {};
  }
}

// 保存到 localStorage
function saveCachedQuotes(cache: CachedQuotes) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(QUOTES_CACHE_KEY, JSON.stringify(cache));
  } catch (e) {
    console.error("保存缓存失败:", e);
  }
}

// 从 localStorage 读取已加载的分类
function getLoadedCategoriesFromStorage(): Set<string> {
  if (typeof window === "undefined") return new Set();
  try {
    const stored = localStorage.getItem(LOADED_CATEGORIES_KEY);
    return stored ? new Set(JSON.parse(stored)) : new Set();
  } catch {
    return new Set();
  }
}

// 保存已加载的分类
function saveLoadedCategories(categories: Set<string>) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(LOADED_CATEGORIES_KEY, JSON.stringify([...categories]));
  } catch (e) {
    console.error("保存分类记录失败:", e);
  }
}

export default function QuotesPage() {
  const [currentCategory, setCurrentCategory] = useState("tangshi");
  const [quotes, setQuotes] = useState<QuoteItem[]>([]);
  const [currentQuote, setCurrentQuote] = useState<QuoteItem | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [loadedCategories, setLoadedCategories] = useState<Set<string>>(new Set());
  const [isMounted, setIsMounted] = useState(false);

  const currentCategoryInfo = categories.find((c) => c.id === currentCategory);

  // 客户端挂载标记（避免 SSR Hydration 问题）
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // 从 localStorage 恢复缓存状态
  useEffect(() => {
    if (!isMounted) return;
    const stored = getLoadedCategoriesFromStorage();
    setLoadedCategories(stored);
  }, [isMounted]);

  // 加载分类数据
  const loadCategory = useCallback(async (categoryId: string) => {
    // 直接从 localStorage 检查缓存（不依赖内存状态）
    const cached = getCachedQuotes();
    if (cached[categoryId] && cached[categoryId].length > 0) {
      // 有缓存，直接使用
      setQuotes(cached[categoryId]);
      setCurrentQuote(getRandomQuote(cached[categoryId], null));
      // 同步内存状态
      setLoadedCategories(prev => new Set(prev).add(categoryId));
      return;
    }

    setIsLoading(true);
    const category = categories.find(c => c.id === categoryId);
    if (category) {
      const newQuotes = await fetchQuotesFromAI(category);
      setQuotes(newQuotes);
      setCurrentQuote(getRandomQuote(newQuotes, null));
      
      // 更新内存状态
      setLoadedCategories(prev => new Set(prev).add(categoryId));
      
      // 保存到 localStorage
      cached[categoryId] = newQuotes;
      saveCachedQuotes(cached);
      saveLoadedCategories(new Set([...getLoadedCategoriesFromStorage(), categoryId]));
    }
    setIsLoading(false);
  }, []);

  // 初始加载
  useEffect(() => {
    if (!isMounted) return;
    loadCategory(currentCategory);
  }, [isMounted, loadCategory]);

  const handleRefresh = useCallback(() => {
    if (quotes.length === 0) return;
    setIsAnimating(true);
    setTimeout(() => {
      setCurrentQuote(getRandomQuote(quotes, currentQuote));
      setIsAnimating(false);
    }, 300);
  }, [quotes, currentQuote]);

  const handleCategoryChange = async (categoryId: string) => {
    if (categoryId === currentCategory) return;
    
    setCurrentCategory(categoryId);
    
    // 检查是否有缓存（内存或 localStorage）
    const hasCache = loadedCategories.has(categoryId);
    
    if (hasCache) {
      // 有缓存，直接从缓存读取
      const cached = getCachedQuotes();
      if (cached[categoryId]) {
        setQuotes(cached[categoryId]);
        setCurrentQuote(getRandomQuote(cached[categoryId], null));
        return;
      }
    }
    
    // 无缓存，加载新数据
    await loadCategory(categoryId);
  };

  return (
    <div className="min-h-full p-8 lg:p-12">
      {/* Header */}
      <div className="mb-8">
        <Link
          href="/park"
          className="inline-flex items-center gap-2 text-[#5e5d59] hover:text-[#d97760] transition-colors mb-4"
        >
          <ArrowLeft className="h-4 w-4" />
          <span className="text-sm font-serif">返回逍遥园</span>
        </Link>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[#d97760]/10 flex items-center justify-center">
              <BookOpen className="h-5 w-5 text-[#d97760]" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-[#141413] font-serif tracking-wide">
                晨言录
              </h1>
              <p className="text-sm text-[#9a9590] font-serif">
                {currentCategoryInfo?.description || "一言一悟，启迪心智"}
              </p>
            </div>
          </div>

          {/* Category Selector */}
          <DropdownMenu>
            <DropdownMenuTrigger
              disabled={isLoading}
              className="inline-flex items-center justify-center gap-2 rounded-md border border-[#c2c0b6] bg-white px-4 py-2 text-sm font-medium text-[#5e5d59] hover:bg-[#f0eee6] hover:text-[#141413] font-serif transition-colors disabled:opacity-50"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <BookOpen className="h-4 w-4" />
              )}
              {currentCategoryInfo?.name || "选择典籍"}
              <ChevronDown className="h-4 w-4" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              {categories.map((category) => (
                <DropdownMenuItem
                  key={category.id}
                  onClick={() => handleCategoryChange(category.id)}
                  className={`font-serif cursor-pointer ${
                    currentCategory === category.id
                      ? "bg-[#d97760]/10 text-[#d97760]"
                      : ""
                  }`}
                >
                  <div className="flex flex-col">
                    <span>{category.name}</span>
                    <span className="text-xs text-[#9a9590]">
                      {category.description}
                    </span>
                  </div>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Quote Display */}
      <div className="flex flex-col items-center justify-center min-h-[500px]">
        {/* Decorative background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-[#d97760]/3 blur-3xl" />
        </div>

        {/* Loading State */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="h-12 w-12 text-[#d97760] animate-spin mb-4" />
            <p className="text-[#9a9590] font-serif">正在从典籍中汲取智慧...</p>
          </div>
        ) : currentQuote ? (
          <>
            {/* Quote Card */}
            <div className="relative max-w-3xl w-full mx-auto">
              {/* Decorative border */}
              <div className="absolute -inset-4 border border-[#c2c0b6]/40 rounded-2xl" />
              <div className="absolute -inset-8 border border-[#c2c0b6]/20 rounded-3xl" />

              {/* Main content */}
              <div className="relative bg-white/80 backdrop-blur-sm rounded-xl p-12 md:p-16 border border-[#c2c0b6]/60 shadow-lg">
                {/* Quote icon */}
                <div className="absolute -top-6 left-1/2 -translate-x-1/2">
                  <div className="w-12 h-12 rounded-full bg-[#d97760] flex items-center justify-center shadow-md">
                    <Quote className="h-5 w-5 text-white" />
                  </div>
                </div>

                {/* Quote content */}
                <div
                  className={`text-center transition-all duration-300 ${
                    isAnimating ? "opacity-0 transform translate-y-4" : "opacity-100 transform translate-y-0"
                  }`}
                >
                  <blockquote className="text-xl md:text-2xl lg:text-3xl font-serif text-[#141413] leading-loose mb-8 tracking-wide whitespace-pre-line">
                    {currentQuote.content}
                  </blockquote>

                  <div className="flex flex-col items-center gap-1">
                    <div className="w-16 h-px bg-[#d97760]/40 mb-4" />
                    <p className="text-lg text-[#5e5d59] font-serif">
                      {currentQuote.author}
                    </p>
                    {currentQuote.source && (
                      <p className="text-sm text-[#9a9590] font-serif">
                        {currentQuote.source}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Corner decorations */}
              <div className="absolute -top-2 -left-2 w-8 h-8 border-t-2 border-l-2 border-[#d97760]/40 rounded-tl-lg" />
              <div className="absolute -top-2 -right-2 w-8 h-8 border-t-2 border-r-2 border-[#d97760]/40 rounded-tr-lg" />
              <div className="absolute -bottom-2 -left-2 w-8 h-8 border-b-2 border-l-2 border-[#d97760]/40 rounded-bl-lg" />
              <div className="absolute -bottom-2 -right-2 w-8 h-8 border-b-2 border-r-2 border-[#d97760]/40 rounded-br-lg" />
            </div>

            {/* Refresh Button */}
            <div className="mt-12 z-10">
              <Button
                onClick={handleRefresh}
                disabled={isAnimating}
                className="px-8 py-6 rounded-full bg-[#d97760] hover:bg-[#c96a54] text-white font-serif text-lg transition-all shadow-md hover:shadow-lg"
              >
                <RefreshCw className={`h-5 w-5 mr-2 ${isAnimating ? "animate-spin" : ""}`} />
                换一言
              </Button>
            </div>

            {/* Quote counter */}
            <div className="mt-6 text-sm text-[#9a9590] font-serif z-10">
              {currentCategoryInfo?.name} · 共 {quotes.length} 则箴言
              {loadedCategories.has(currentCategory) && (
                <span className="ml-2 text-green-600">✓ 已缓存</span>
              )}
            </div>
          </>
        ) : (
          <div className="text-center py-20">
            <p className="text-[#9a9590] font-serif">暂无数据，请选择典籍</p>
          </div>
        )}
      </div>
    </div>
  );
}
