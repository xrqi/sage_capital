"use client";

import { useState, useEffect, useCallback } from "react";
import { Wind, Play, Pause, RotateCcw, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

type BreathingPhase = "inhale" | "hold" | "exhale";

const PHASE_CONFIG: Record<BreathingPhase, { text: string; duration: number; subtext: string }> = {
  inhale: { text: "吸气...", duration: 4000, subtext: "缓缓吸入，感受气息充盈" },
  hold: { text: "屏息...", duration: 4000, subtext: "保持宁静，安住当下" },
  exhale: { text: "呼气...", duration: 6000, subtext: "徐徐呼出，释放烦忧" },
};

export default function BreathingPage() {
  const [isActive, setIsActive] = useState(false);
  const [phase, setPhase] = useState<BreathingPhase>("inhale");
  const [round, setRound] = useState(1);
  const [progress, setProgress] = useState(0);

  const reset = useCallback(() => {
    setIsActive(false);
    setPhase("inhale");
    setRound(1);
    setProgress(0);
  }, []);

  useEffect(() => {
    if (!isActive) return;

    const currentPhase = PHASE_CONFIG[phase];
    const interval = 50; // Update every 50ms for smooth animation
    const steps = currentPhase.duration / interval;
    let currentStep = 0;

    const timer = setInterval(() => {
      currentStep++;
      setProgress((currentStep / steps) * 100);

      if (currentStep >= steps) {
        // Move to next phase
        if (phase === "inhale") {
          setPhase("hold");
        } else if (phase === "hold") {
          setPhase("exhale");
        } else {
          setPhase("inhale");
          setRound((prev) => prev + 1);
        }
        setProgress(0);
      }
    }, interval);

    return () => clearInterval(timer);
  }, [isActive, phase]);

  const getCircleScale = () => {
    if (phase === "inhale") {
      return 0.6 + (progress / 100) * 0.6; // 0.6 -> 1.2
    } else if (phase === "hold") {
      return 1.2;
    } else {
      return 1.2 - (progress / 100) * 0.6; // 1.2 -> 0.6
    }
  };

  const getCircleOpacity = () => {
    if (phase === "inhale") {
      return 0.4 + (progress / 100) * 0.4; // 0.4 -> 0.8
    } else if (phase === "hold") {
      return 0.8;
    } else {
      return 0.8 - (progress / 100) * 0.4; // 0.8 -> 0.4
    }
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
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-[#d97760]/10 flex items-center justify-center">
            <Wind className="h-5 w-5 text-[#d97760]" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-[#141413] font-serif tracking-wide">
              吐纳术
            </h1>
            <p className="text-sm text-[#9a9590] font-serif">调息养气，静心凝神</p>
          </div>
        </div>
      </div>

      {/* Breathing Animation */}
      <div className="flex flex-col items-center justify-center min-h-[500px]">
        {/* Decorative background elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-[#d97760]/5 blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-48 h-48 rounded-full bg-[#8b9a7c]/5 blur-3xl" />
        </div>

        {/* Breathing Circle */}
        <div className="relative mb-12">
          {/* Outer rings */}
          <div
            className="absolute inset-0 rounded-full border-2 border-[#d97760]/20 transition-all duration-300"
            style={{
              transform: `scale(${getCircleScale() * 1.3})`,
              opacity: getCircleOpacity() * 0.5,
            }}
          />
          <div
            className="absolute inset-0 rounded-full border border-[#d97760]/30 transition-all duration-300"
            style={{
              transform: `scale(${getCircleScale() * 1.15})`,
              opacity: getCircleOpacity() * 0.6,
            }}
          />

          {/* Main breathing circle */}
          <div
            className="w-48 h-48 rounded-full bg-gradient-to-br from-[#d97760] to-[#c9a86c] flex items-center justify-center transition-all duration-100 ease-linear shadow-lg"
            style={{
              transform: `scale(${getCircleScale()})`,
              opacity: getCircleOpacity(),
              boxShadow: `0 0 ${60 * getCircleOpacity()}px ${20 * getCircleOpacity()}px rgba(217, 119, 96, 0.3)`,
            }}
          >
            <div className="w-32 h-32 rounded-full bg-gradient-to-br from-[#faf9f5] to-[#f0eee6] flex items-center justify-center">
              <span className="text-3xl font-serif text-[#141413]">
                {PHASE_CONFIG[phase].text.replace("...", "")}
              </span>
            </div>
          </div>
        </div>

        {/* Phase Text */}
        <div className="text-center mb-8 z-10">
          <h2 className="text-3xl font-serif text-[#141413] mb-2">
            {PHASE_CONFIG[phase].text}
          </h2>
          <p className="text-[#5e5d59] font-serif">
            {PHASE_CONFIG[phase].subtext}
          </p>
        </div>

        {/* Round Counter */}
        <div className="flex items-center gap-2 mb-8 text-[#9a9590] font-serif z-10">
          <span>第</span>
          <span className="text-2xl font-semibold text-[#d97760]">{round}</span>
          <span>轮</span>
        </div>

        {/* Progress Bar */}
        <div className="w-64 h-1 bg-[#c2c0b6]/30 rounded-full mb-8 overflow-hidden z-10">
          <div
            className="h-full bg-[#d97760] transition-all duration-100 ease-linear rounded-full"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Controls */}
        <div className="flex items-center gap-4 z-10">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setIsActive(!isActive)}
            className="w-14 h-14 rounded-full border-[#d97760] text-[#d97760] hover:bg-[#d97760] hover:text-white transition-all"
          >
            {isActive ? (
              <Pause className="h-6 w-6" />
            ) : (
              <Play className="h-6 w-6 ml-0.5" />
            )}
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={reset}
            className="w-12 h-12 rounded-full border-[#c2c0b6] text-[#5e5d59] hover:bg-[#f0eee6] hover:text-[#141413] transition-all"
          >
            <RotateCcw className="h-5 w-5" />
          </Button>
        </div>

        {/* Instructions */}
        <div className="mt-12 text-center max-w-md z-10">
          <p className="text-sm text-[#9a9590] font-serif leading-relaxed">
            吸气四息，屏气四息，呼气六息。
            <br />
            周而复始，气息绵长，心神自安。
          </p>
        </div>
      </div>
    </div>
  );
}
