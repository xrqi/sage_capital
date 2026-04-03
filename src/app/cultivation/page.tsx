"use client";

import Link from "next/link";
import { Eye, Scale, ScrollText, ArrowRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface RoomCard {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

const rooms: RoomCard[] = [
  {
    id: "quiet-room",
    title: "观心室",
    subtitle: "闭目内观，洞察本心",
    description: "与引导师对话，发现看不见的另一个你。",
    href: "/cultivation/quiet-room",
    icon: Eye,
  },
  {
    id: "arena",
    title: "论道场",
    subtitle: "以辩明理，以论破执",
    description: "在思辨中纠正认知偏见，完善自我。",
    href: "/cultivation/arena",
    icon: Scale,
  },
  {
    id: "archive",
    title: "鉴真阁",
    subtitle: "观过知仁，察己明性",
    description: "你的成长画像，在这里一览无余。",
    href: "/cultivation/archive",
    icon: ScrollText,
  },
];

export default function CultivationPage() {
  return (
    <div className="min-h-full p-8 lg:p-12">
      {/* Header Section */}
      <div className="mb-12 text-center">
        <h1 className="text-4xl font-bold text-[#141413] font-serif tracking-wide mb-4">
          明心殿
        </h1>
        <div className="w-16 h-0.5 bg-[#d97760] mx-auto mb-4" />
        <p className="text-lg text-[#5e5d59] font-serif tracking-wider">
          洞察本心，明心见性，破迷开悟
        </p>
      </div>

      {/* Room Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
        {rooms.map((room, index) => {
          const Icon = room.icon;
          return (
            <Link key={room.id} href={room.href} className="group block">
              <Card className="relative h-full bg-white border border-[#c2c0b6] overflow-hidden transition-all duration-500 ease-out hover:shadow-lg hover:-translate-y-1">
                {/* Decorative ink wash line at top */}
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#c2c0b6] to-transparent opacity-60" />
                
                <CardContent className="p-8 flex flex-col items-center text-center">
                  {/* Icon Container */}
                  <div className="relative mb-6">
                    {/* Decorative circle background */}
                    <div className="absolute inset-0 rounded-full bg-[#f0eee6] scale-150 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <div className="relative w-16 h-16 rounded-full border border-[#c2c0b6] flex items-center justify-center transition-all duration-500 group-hover:border-[#d97760] group-hover:bg-[#faf9f5]">
                      <Icon className="h-7 w-7 text-[#5e5d59] transition-colors duration-500 group-hover:text-[#d97760]" />
                    </div>
                  </div>

                  {/* Title */}
                  <h2 className="text-xl font-semibold text-[#141413] font-serif tracking-wide mb-2 transition-colors duration-300 group-hover:text-[#d97760]">
                    {room.title}
                  </h2>

                  {/* Subtitle */}
                  <p className="text-sm text-[#9a9590] font-serif mb-4 tracking-wider">
                    {room.subtitle}
                  </p>

                  {/* Decorative divider */}
                  <div className="w-8 h-px bg-[#c2c0b6] mb-4 transition-all duration-500 group-hover:w-12 group-hover:bg-[#d97760]" />

                  {/* Description */}
                  <p className="text-sm text-[#5e5d59] leading-relaxed mb-6 font-serif">
                    {room.description}
                  </p>

                  {/* Enter button */}
                  <div className="mt-auto flex items-center gap-2 text-sm text-[#9a9590] transition-all duration-300 group-hover:text-[#d97760]">
                    <span className="font-serif">入内</span>
                    <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                  </div>
                </CardContent>

                {/* Corner decoration */}
                <div className="absolute bottom-0 right-0 w-16 h-16 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <div className="absolute bottom-3 right-3 w-8 h-px bg-[#c2c0b6]/40 rotate-45" />
                  <div className="absolute bottom-3 right-3 w-px h-8 bg-[#c2c0b6]/40 rotate-45" />
                </div>
              </Card>
            </Link>
          );
        })}
      </div>

      {/* Bottom quote */}
      <div className="mt-16 text-center">
        <p className="text-sm text-[#9a9590] font-serif italic">
          "知人者智，自知者明。胜人者有力，自胜者强。"
        </p>
        <p className="text-xs text-[#c2c0b6] mt-2 font-serif">——《道德经》</p>
      </div>
    </div>
  );
}
