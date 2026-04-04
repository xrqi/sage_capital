"use client";

import { useEffect, useState, useCallback } from "react";

export function FuchenCursor() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isClicking, setIsClicking] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    setPosition({ x: e.clientX, y: e.clientY });
    if (!isVisible) setIsVisible(true);
  }, [isVisible]);

  const handleMouseDown = useCallback(() => {
    setIsClicking(true);
    // 动画时长 5s + 缓冲 0.5s = 5.5s
    setTimeout(() => setIsClicking(false), 5500);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setIsVisible(false);
  }, []);

  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mousedown", handleMouseDown);
    document.body.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mousedown", handleMouseDown);
      document.body.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [handleMouseMove, handleMouseDown, handleMouseLeave]);

  if (!isVisible) return null;

  return (
    <>
      {/* 浮沉光标 - 斜向设计 */}
      <div
        className={`fuchen-cursor ${isClicking ? "swinging" : ""}`}
        style={{
          left: position.x,
          top: position.y,
          pointerEvents: 'none',
        }}
      >
        <svg
          width="40"
          height="70"
          viewBox="0 0 40 70"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            {/* 仙气渐变 - 朦胧云雾效果 */}
            <linearGradient id="mistGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFFEF8" stopOpacity="0.8" />
              <stop offset="50%" stopColor="#F5F0E8" stopOpacity="0.5" />
              <stop offset="100%" stopColor="#EDE6D6" stopOpacity="0.2" />
            </linearGradient>
            <linearGradient id="mistGrad2" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FAF8F0" stopOpacity="0.9" />
              <stop offset="40%" stopColor="#F0EBE0" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#E8E0D5" stopOpacity="0.3" />
            </linearGradient>
            {/* 鬃毛渐变 - 自然的马尾色 */}
            <linearGradient id="hairGrad1" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#FFFEF8" />
              <stop offset="30%" stopColor="#F8F4E8" />
              <stop offset="70%" stopColor="#EDE6D6" />
              <stop offset="100%" stopColor="#E0D5C8" />
            </linearGradient>
            <linearGradient id="hairGrad2" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#FAF7F0" />
              <stop offset="40%" stopColor="#F0EBE0" />
              <stop offset="100%" stopColor="#E5DCD0" />
            </linearGradient>
            {/* 深色木质手柄 */}
            <linearGradient id="darkWood" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#3D3229" />
              <stop offset="25%" stopColor="#4A3F35" />
              <stop offset="50%" stopColor="#5A4D42" />
              <stop offset="75%" stopColor="#4A3F35" />
              <stop offset="100%" stopColor="#3D3229" />
            </linearGradient>
            {/* 金属装饰 */}
            <linearGradient id="metalGold" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#B8A060" />
              <stop offset="50%" stopColor="#D4C080" />
              <stop offset="100%" stopColor="#9A8540" />
            </linearGradient>
            {/* 编织纹理 */}
            <pattern id="weavePattern" x="0" y="0" width="4" height="4" patternUnits="userSpaceOnUse">
              <rect width="4" height="4" fill="#4A3F35" />
              <path d="M0 2L4 2M2 0L2 4" stroke="#5A4D42" strokeWidth="0.5" />
            </pattern>
            {/* 柔和模糊滤镜 - 营造仙气 */}
            <filter id="softBlur" x="-30%" y="-20%" width="160%" height="140%">
              <feGaussianBlur in="SourceGraphic" stdDeviation="1.2" />
            </filter>
          </defs>

          {/* 拂尘鬃毛束 - 大量鬃毛，蓬松饱满 */}
          <g className="fuchen-hairs">
            {/* 最外层鬃毛 - 最长最朦胧 */}
            <path d="M24 28 Q20 42 16 50 Q12 56 10 60" stroke="url(#mistGrad1)" strokeWidth="3.5" strokeLinecap="round" fill="none" opacity="0.3" filter="url(#softBlur)" />
            <path d="M24 28 Q22 40 18 48 Q14 54 12 58" stroke="url(#mistGrad2)" strokeWidth="3" strokeLinecap="round" fill="none" opacity="0.4" filter="url(#softBlur)" />
            <path d="M24 28 Q18 43 14 51 Q10 57 8 61" stroke="url(#mistGrad1)" strokeWidth="2.8" strokeLinecap="round" fill="none" opacity="0.35" filter="url(#softBlur)" />
            <path d="M24 28 Q21 41 17 49 Q13 55 11 59" stroke="url(#mistGrad2)" strokeWidth="2.5" strokeLinecap="round" fill="none" opacity="0.38" filter="url(#softBlur)" />
            
            {/* 外层鬃毛 */}
            <path d="M24 27 Q19 38 15 46 Q11 52 9 56" stroke="url(#hairGrad2)" strokeWidth="2.2" strokeLinecap="round" fill="none" opacity="0.5" />
            <path d="M24 27 Q21 37 17 45 Q13 51 11 55" stroke="url(#hairGrad1)" strokeWidth="2" strokeLinecap="round" fill="none" opacity="0.55" />
            <path d="M24 27 Q20 39 16 47 Q12 53 10 57" stroke="url(#hairGrad2)" strokeWidth="1.8" strokeLinecap="round" fill="none" opacity="0.6" />
            <path d="M24 27 Q22 36 18 44 Q14 50 12 54" stroke="url(#hairGrad1)" strokeWidth="1.6" strokeLinecap="round" fill="none" opacity="0.65" />
            <path d="M24 27 Q18 40 14 48 Q10 54 8 58" stroke="url(#hairGrad2)" strokeWidth="1.5" strokeLinecap="round" fill="none" opacity="0.55" />
            
            {/* 中层鬃毛 */}
            <path d="M24 26 Q20 34 16 42 Q12 48 10 52" stroke="#FFFEF8" strokeWidth="1.4" strokeLinecap="round" fill="none" opacity="0.7" />
            <path d="M24 26 Q22 33 18 41 Q14 47 12 51" stroke="#FFFEF8" strokeWidth="1.3" strokeLinecap="round" fill="none" opacity="0.75" />
            <path d="M24 26 Q21 35 17 43 Q13 49 11 53" stroke="#FFFFFF" strokeWidth="1.2" strokeLinecap="round" fill="none" opacity="0.8" />
            <path d="M24 26 Q19 36 15 44 Q11 50 9 54" stroke="#FFFEF8" strokeWidth="1.1" strokeLinecap="round" fill="none" opacity="0.72" />
            <path d="M24 26 Q23 32 19 40 Q15 46 13 50" stroke="#FFFFFF" strokeWidth="1" strokeLinecap="round" fill="none" opacity="0.78" />
            <path d="M24 26 Q20 35 16 43 Q12 49 10 53" stroke="#FFFEF8" strokeWidth="0.9" strokeLinecap="round" fill="none" opacity="0.68" />
            
            {/* 内层鬃毛 */}
            <path d="M24 25 Q21 30 17 38 Q13 44 11 48" stroke="#FFFFFF" strokeWidth="0.9" strokeLinecap="round" fill="none" opacity="0.85" />
            <path d="M24 25 Q22 29 18 37 Q14 43 12 47" stroke="#FFFEF8" strokeWidth="0.8" strokeLinecap="round" fill="none" opacity="0.88" />
            <path d="M24 25 Q20 31 16 39 Q12 45 10 49" stroke="#FFFFFF" strokeWidth="0.7" strokeLinecap="round" fill="none" opacity="0.9" />
            <path d="M24 25 Q23 28 19 36 Q15 42 13 46" stroke="#FFFEF8" strokeWidth="0.6" strokeLinecap="round" fill="none" opacity="0.82" />
            <path d="M24 25 Q21 30 17 38 Q13 44 11 48" stroke="#FFFFFF" strokeWidth="0.5" strokeLinecap="round" fill="none" opacity="0.86" />
            
            {/* 核心鬃毛 */}
            <path d="M24 24 Q22 27 18 35 Q14 41 12 45" stroke="#FFFFFF" strokeWidth="0.6" strokeLinecap="round" fill="none" opacity="0.92" />
            <path d="M24 24 Q23 26 19 34 Q15 40 13 44" stroke="#FFFEF8" strokeWidth="0.5" strokeLinecap="round" fill="none" opacity="0.95" />
            <path d="M24 24 Q21 28 17 36 Q13 42 11 46" stroke="#FFFFFF" strokeWidth="0.4" strokeLinecap="round" fill="none" opacity="0.9" />
            
            {/* 细碎发丝 - 增加蓬松感 */}
            <path d="M24 26 Q22 32 18 40" stroke="#FFFEF8" strokeWidth="0.4" strokeLinecap="round" fill="none" opacity="0.5" />
            <path d="M24 25 Q20 33 16 41" stroke="#FFFFFF" strokeWidth="0.35" strokeLinecap="round" fill="none" opacity="0.55" />
            <path d="M24 27 Q23 31 19 39" stroke="#FFFEF8" strokeWidth="0.3" strokeLinecap="round" fill="none" opacity="0.45" />
            <path d="M24 25 Q21 29 17 37" stroke="#FFFFFF" strokeWidth="0.3" strokeLinecap="round" fill="none" opacity="0.5" />
            <path d="M24 26 Q19 34 15 42" stroke="#FFFEF8" strokeWidth="0.25" strokeLinecap="round" fill="none" opacity="0.4" />
            <path d="M24 24 Q22 28 18 36" stroke="#FFFFFF" strokeWidth="0.25" strokeLinecap="round" fill="none" opacity="0.48" />
          </g>

          {/* 鬃毛根部编织固定 - 调整到新位置 */}
          <ellipse cx="24" cy="26" rx="5" ry="3" fill="url(#metalGold)" />
          <ellipse cx="24" cy="25" rx="4" ry="2" fill="#3D3229" />
          
          {/* 编织纹理装饰 */}
          <circle cx="24" cy="26" r="3.5" fill="url(#weavePattern)" opacity="0.6" />
          <ellipse cx="24" cy="26" rx="4" ry="2" fill="none" stroke="url(#metalGold)" strokeWidth="0.8" />

          {/* 金属环装饰 */}
          <rect x="22" y="28" width="4" height="2" rx="0.5" fill="url(#metalGold)" />

          {/* 手柄 - 短而精致 */}
          <g className="fuchen-handle">
            {/* 主手柄 - 缩短到22px */}
            <rect x="22" y="30" width="4" height="22" rx="1.5" fill="url(#darkWood)" />
            
            {/* 雕刻纹理 */}
            <rect x="22" y="33" width="4" height="0.8" rx="0.2" fill="#2A231D" opacity="0.5" />
            <rect x="22" y="37" width="4" height="0.6" rx="0.2" fill="#2A231D" opacity="0.4" />
            <rect x="22" y="41" width="4" height="0.6" rx="0.2" fill="#2A231D" opacity="0.4" />
            <rect x="22" y="45" width="4" height="0.6" rx="0.2" fill="#2A231D" opacity="0.4" />
            
            {/* 菱形雕刻 */}
            <path d="M23 38L24 37L25 38L24 39Z" fill="#5A4D42" opacity="0.6" />
            <path d="M23 44L24 43L25 44L24 45Z" fill="#5A4D42" opacity="0.6" />
            
            {/* 高光 */}
            <rect x="23" y="31" width="0.6" height="20" rx="0.3" fill="#6B5B4F" opacity="0.4" />
          </g>

          {/* 手柄底部装饰 */}
          <g className="fuchen-bottom">
            {/* 底部金属帽 */}
            <ellipse cx="24" cy="53" rx="2.5" ry="1.8" fill="url(#metalGold)" />
            <circle cx="24" cy="53" r="1.2" fill="#3D3229" />
            
            {/* 挂绳 */}
            <path d="M24 55 Q24 57 22 59 Q21 60 21 61" stroke="#8B7355" strokeWidth="0.7" fill="none" opacity="0.8" />
          </g>
        </svg>
      </div>
      
      {/* 点击时的仙气粒子效果 */}
      {isClicking && (
        <div
          className="immortal-particles"
          style={{
            left: position.x,
            top: position.y,
          }}
        >
          {[...Array(8)].map((_, i) => (
            <span
              key={i}
              className="particle"
              style={{
                "--i": i,
                "--delay": `${i * 0.06}s`,
              } as React.CSSProperties}
            />
          ))}
        </div>
      )}
    </>
  );
}
