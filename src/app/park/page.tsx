"use client";

import Link from "next/link";
import { Mountain, Wind, BookOpen, Music, Palette } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

interface FeatureCard {
  title: string;
  description: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

const features: FeatureCard[] = [
  {
    title: "吐纳术",
    description: "调息养气，静心凝神",
    href: "/park/breathing",
    icon: Wind,
  },
  {
    title: "晨言录",
    description: "一言一悟，启迪心智",
    href: "/park/quotes",
    icon: BookOpen,
  },
  {
    title: "天籁阁",
    description: "万籁俱寂，唯余天音",
    href: "/park/sounds",
    icon: Music,
  },
  {
    title: "丹青坊",
    description: "挥毫泼墨，随心所欲",
    href: "/park/canvas",
    icon: Palette,
  },
];

export default function ParkPage() {
  return (
    <div className="min-h-full p-8 lg:p-12">
      {/* Header Section */}
      <div className="mb-12">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-xl bg-[#8b9a7c] flex items-center justify-center">
            <Mountain className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-[#141413] font-serif tracking-wide">
              逍遥园
            </h1>
            <p className="text-[#9a9590] font-serif">
              偷得浮生半日闲，且听风吟且品茗
            </p>
          </div>
        </div>
        <p className="text-[#5e5d59] max-w-2xl leading-relaxed">
          于此园中暂忘尘嚣，调息养气，品茗听音。时光缓缓，心境悠然，
          寻得一方清净之地。
        </p>
      </div>

      {/* Feature Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {features.map((feature) => {
          const Icon = feature.icon;
          return (
            <Link key={feature.href} href={feature.href} className="group block">
              <Card className="relative overflow-hidden border border-[#c2c0b6] bg-white shadow-md hover:shadow-xl transition-all duration-500 ease-out hover:-translate-y-1">
                {/* Decorative top border with cinnabar color */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-[#d97760]" />

                <CardHeader className="pb-4 pt-6">
                  <div className="w-14 h-14 rounded-xl flex items-center justify-center mb-4 transition-all duration-500 group-hover:scale-105 bg-[#d97760]">
                    <Icon className="h-7 w-7 text-white" />
                  </div>
                  <CardTitle className="text-xl font-semibold text-[#141413] group-hover:text-[#1f1e1d] transition-colors font-serif tracking-wide">
                    {feature.title}
                  </CardTitle>
                  <CardDescription className="text-[#5e5d59] text-sm leading-relaxed font-serif">
                    {feature.description}
                  </CardDescription>
                </CardHeader>

                <CardContent className="pt-0">
                  <span className="text-sm font-medium font-serif text-[#9a9590] group-hover:text-[#d97760] transition-colors">
                    入内游览 →
                  </span>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>

      {/* Decorative Footer */}
      <div className="mt-16 pt-8 border-t border-[#c2c0b6]/60">
        <div className="flex items-center justify-between text-sm text-[#9a9590]">
          <p className="font-serif">心随云水闲，意逐风月悠</p>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-[#8b9a7c] animate-pulse" />
            <span className="font-serif">园中静谧</span>
          </div>
        </div>
      </div>
    </div>
  );
}
