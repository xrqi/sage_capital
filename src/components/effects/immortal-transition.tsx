"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

export function ImmortalTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [displayChildren, setDisplayChildren] = useState(children);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (displayChildren !== children) {
      // 开始切换动画
      setIsTransitioning(true);
      
      // 等待云雾扩散
      const timer = setTimeout(() => {
        setDisplayChildren(children);
        
        // 等待新内容淡入
        setTimeout(() => {
          setIsTransitioning(false);
        }, 100);
      }, 600);

      return () => clearTimeout(timer);
    }
  }, [children, displayChildren]);

  return (
    <div className="relative">
      {/* 云雾过渡层 */}
      <div className={`mist-overlay ${isTransitioning ? "active" : ""}`}>
        {/* 多层云雾效果 */}
        <div className="mist-layer mist-layer-1" />
        <div className="mist-layer mist-layer-2" />
        <div className="mist-layer mist-layer-3" />
        
        {/* 仙气粒子 - 只在客户端挂载后渲染，避免 Hydration mismatch */}
        {mounted && (
          <div className="immortal-aura">
            {[...Array(12)].map((_, i) => (
              <span
                key={i}
                className="aura-particle"
                style={{
                  "--i": i,
                  "--x": `${Math.random() * 100}%`,
                  "--y": `${Math.random() * 100}%`,
                } as React.CSSProperties}
              />
            ))}
          </div>
        )}
      </div>
      
      {/* 内容层 */}
      <div className={`content-layer ${isTransitioning ? "fading" : "visible"}`}>
        {displayChildren}
      </div>
    </div>
  );
}
