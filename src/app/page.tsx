import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollText, Mountain, Flame, ArrowRight, Sparkle } from "lucide-react";

interface ModuleCard {
  title: string;
  description: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  accentColor: string;
}

const modules: ModuleCard[] = [
  {
    title: "百工堂",
    description: "群贤毕至，各司其职，为君分忧解劳",
    href: "/workspace",
    icon: ScrollText,
    accentColor: "#d97760",
  },
  {
    title: "逍遥园",
    description: "偷得浮生半日闲，且听风吟且品茗",
    href: "/park",
    icon: Mountain,
    accentColor: "#8b9a7c",
  },
  {
    title: "问道阁",
    description: "吾日三省吾身，修心养性，破迷开悟",
    href: "/cultivation",
    icon: Flame,
    accentColor: "#c9a86c",
  },
];

export default function Home() {
  return (
    <div className="min-h-full p-8 lg:p-12">
      {/* Header Section */}
      <div className="mb-12">
        <div className="flex items-center gap-2 mb-3">
          <Sparkle className="h-5 w-5 text-[#d97760]" />
          <span className="text-sm font-medium text-[#d97760] tracking-wide">
            欢迎归来
          </span>
        </div>
        <h1 className="text-4xl font-bold tracking-wide text-[#141413] mb-3 font-serif">
          今日可有所悟？
        </h1>
        <p className="text-lg text-[#5e5d59] max-w-2xl leading-relaxed">
          云轩阁中，百工汇聚，逍遥自在，问道求真。
          <br />
          <span className="text-[#9a9590] italic font-serif">"路漫漫其修远兮，吾将上下而求索。"</span>
        </p>
      </div>

      {/* Module Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {modules.map((module) => {
          const Icon = module.icon;
          return (
            <Link key={module.href} href={module.href} className="group block">
              <Card className="relative overflow-hidden border border-[#c2c0b6] bg-white shadow-md hover:shadow-xl transition-all duration-500 ease-out hover:-translate-y-1">
                {/* Decorative top border */}
                <div 
                  className="absolute top-0 left-0 right-0 h-1"
                  style={{ backgroundColor: module.accentColor }}
                />
                
                <CardHeader className="pb-4 pt-6">
                  <div 
                    className="w-14 h-14 rounded-xl flex items-center justify-center mb-4 transition-all duration-500 group-hover:scale-105"
                    style={{ backgroundColor: module.accentColor }}
                  >
                    <Icon className="h-7 w-7 text-white" />
                  </div>
                  <CardTitle className="text-xl font-semibold text-[#141413] group-hover:text-[#1f1e1d] transition-colors font-serif tracking-wide">
                    {module.title}
                  </CardTitle>
                  <CardDescription className="text-[#5e5d59] text-sm leading-relaxed font-serif">
                    {module.description}
                  </CardDescription>
                </CardHeader>
                
                <CardContent className="pt-0">
                  <Button 
                    variant="ghost" 
                    className="group/btn p-0 h-auto text-[#5e5d59] hover:text-[#d97760] hover:bg-transparent"
                  >
                    <span className="text-sm font-medium font-serif">入内</span>
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
                  </Button>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>

      {/* Decorative Footer */}
      <div className="mt-16 pt-8 border-t border-[#c2c0b6]/60">
        <div className="flex items-center justify-between text-sm text-[#9a9590]">
          <p className="font-serif">愿君于此得偿所愿，不负韶华</p>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-[#8b9a7c] animate-pulse" />
            <span className="font-serif">阁中安宁</span>
          </div>
        </div>
      </div>
    </div>
  );
}
