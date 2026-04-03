"use client";

import { useState, useRef, useEffect } from "react";
import { Music, ArrowLeft, CloudRain, Bird, Waves, AudioLines, Bell, Wind, Bug, Flame, Volume2 } from "lucide-react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";

interface SoundOption {
  id: string;
  name: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  audioSrc?: string;
}

const soundOptions: SoundOption[] = [
  {
    id: "rain",
    name: "山间细雨",
    description: "淅淅沥沥，润物无声",
    icon: CloudRain,
    audioSrc: "/audio/山间细雨.mp3",
  },
  {
    id: "birds",
    name: "林间鸟鸣",
    description: "啁啾婉转，生机盎然",
    icon: Bird,
    audioSrc: "/audio/林间鸟鸣.mp3",
  },
  {
    id: "stream",
    name: "溪流潺潺",
    description: "清泉石上，叮咚作响",
    icon: Waves,
    audioSrc: "/audio/溪流潺潺.mp3",
  },
  {
    id: "guqin",
    name: "古琴悠扬",
    description: "高山流水，余音绕梁",
    icon: AudioLines,
    audioSrc: "/audio/古琴悠扬.mp3",
  },
  {
    id: "bell",
    name: "寺庙钟声",
    description: "晨钟暮鼓，梵音袅袅",
    icon: Bell,
    audioSrc: "/audio/寺庙钟声.mp3",
  },
  {
    id: "bamboo",
    name: "竹林风声",
    description: "萧萧瑟瑟，清雅脱俗",
    icon: Wind,
    audioSrc: "/audio/竹林风声.mp3",
  },
  {
    id: "crickets",
    name: "夜虫唧唧",
    description: "夏夜虫鸣，静谧安详",
    icon: Bug,
    audioSrc: "/audio/夜虫唧唧.mp3",
  },
  {
    id: "fire",
    name: "炉火噼啪",
    description: "温暖舒适，岁月静好",
    icon: Flame,
    audioSrc: "/audio/炉火噼啪.mp3",
  },
];

export default function SoundsPage() {
  const [playingSounds, setPlayingSounds] = useState<Set<string>>(new Set());
  const [volume, setVolume] = useState([50]);
  const audioRefs = useRef<Record<string, HTMLAudioElement | null>>({});

  const toggleSound = (id: string) => {
    setPlayingSounds((prev) => {
      const newSet = new Set(prev);
      const audio = audioRefs.current[id];
      
      if (newSet.has(id)) {
        // 停止播放
        newSet.delete(id);
        if (audio) {
          audio.pause();
          audio.currentTime = 0;
        }
      } else {
        // 开始播放
        newSet.add(id);
        if (audio) {
          audio.volume = volume[0] / 100;
          audio.play().catch((err) => {
            console.error("音频播放失败:", err);
            newSet.delete(id);
          });
        }
      }
      return newSet;
    });
  };

  // 音量变化时更新所有正在播放的音频
  useEffect(() => {
    playingSounds.forEach((id) => {
      const audio = audioRefs.current[id];
      if (audio) {
        audio.volume = volume[0] / 100;
      }
    });
  }, [volume, playingSounds]);

  // 组件卸载时停止所有音频
  useEffect(() => {
    return () => {
      Object.values(audioRefs.current).forEach((audio) => {
        if (audio) {
          audio.pause();
          audio.currentTime = 0;
        }
      });
    };
  }, []);

  const activeCount = playingSounds.size;

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
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-[#d97760]/10 flex items-center justify-center">
            <Music className="h-5 w-5 text-[#d97760]" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-[#141413] font-serif tracking-wide">
              天籁阁
            </h1>
            <p className="text-sm text-[#9a9590] font-serif">万籁俱寂，唯余天音</p>
          </div>
        </div>
      </div>

      {/* Active sounds indicator */}
      {activeCount > 0 && (
        <div className="mb-6 flex items-center gap-2 text-[#d97760]">
          <div className="w-2 h-2 rounded-full bg-[#d97760] animate-pulse" />
          <span className="text-sm font-serif">
            正在播放 {activeCount} 种音效
          </span>
        </div>
      )}

      {/* Sound Options Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-8">
        {soundOptions.map((sound) => {
          const Icon = sound.icon;
          const isPlaying = playingSounds.has(sound.id);

          return (
            <Card
              key={sound.id}
              onClick={() => toggleSound(sound.id)}
              className={`cursor-pointer transition-all duration-500 border ${
                isPlaying
                  ? "border-[#d97760] bg-white shadow-lg"
                  : "border-[#c2c0b6]/60 bg-white/80 hover:border-[#c2c0b6] hover:shadow-md"
              }`}
            >
              <CardContent className="p-5">
                <div className="flex items-start gap-4">
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-500 ${
                      isPlaying
                        ? "bg-[#d97760] animate-pulse"
                        : "bg-[#f0eee6]"
                    }`}
                  >
                    <Icon
                      className={`h-6 w-6 transition-all duration-500 ${
                        isPlaying ? "text-white" : "text-[#5e5d59]"
                      } ${isPlaying ? "animate-spin" : ""}`}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3
                      className={`font-serif font-semibold mb-1 transition-colors ${
                        isPlaying ? "text-[#d97760]" : "text-[#141413]"
                      }`}
                    >
                      {sound.name}
                    </h3>
                    <p className="text-xs text-[#9a9590] font-serif">
                      {sound.description}
                    </p>
                  </div>
                  {isPlaying && (
                    <div className="w-2 h-2 rounded-full bg-[#d97760] animate-pulse" />
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Volume Control */}
      <div className="max-w-md mx-auto">
        <Card className="border border-[#c2c0b6]/60 bg-white/80">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <Volume2 className="h-5 w-5 text-[#5e5d59]" />
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-serif text-[#141413]">音量</span>
                  <span className="text-sm text-[#9a9590] font-serif">{volume[0]}%</span>
                </div>
                <Slider
                  value={volume}
                  onValueChange={setVolume}
                  max={100}
                  step={1}
                  className="w-full"
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Footer hint */}
      <div className="mt-8 text-center">
        <p className="text-sm text-[#9a9590] font-serif">
          点击卡片可切换音效，支持多选同时播放
        </p>
      </div>

      {/* Hidden Audio Elements */}
      {soundOptions.map((sound) =>
        sound.audioSrc ? (
          <audio
            key={sound.id}
            ref={(el) => {
              audioRefs.current[sound.id] = el;
            }}
            src={sound.audioSrc}
            loop
            preload="auto"
          />
        ) : null
      )}
    </div>
  );
}
