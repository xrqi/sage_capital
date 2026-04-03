"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Palette, ArrowLeft, Pencil, Eraser, Trash2, Minus, Circle, Download } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Tool = "brush" | "eraser";
type BrushSize = "small" | "medium" | "large";

interface Point {
  x: number;
  y: number;
}

const PRESET_COLORS = [
  { name: "墨黑", value: "#1a1a1a" },
  { name: "朱砂", value: "#c45c48" },
  { name: "靛蓝", value: "#2e5090" },
  { name: "翠绿", value: "#5a8f5a" },
  { name: "藤黄", value: "#d4a843" },
  { name: "紫棠", value: "#7b5aa6" },
  { name: "赭石", value: "#a67c52" },
  { name: "雪白", value: "#f5f5f5" },
];

const BRUSH_SIZES: Record<BrushSize, number> = {
  small: 2,
  medium: 5,
  large: 10,
};

export default function CanvasPage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [tool, setTool] = useState<Tool>("brush");
  const [color, setColor] = useState("#1a1a1a");
  const [brushSize, setBrushSize] = useState<BrushSize>("medium");
  const [lastPoint, setLastPoint] = useState<Point | null>(null);

  // Initialize canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas size to match container
    const resizeCanvas = () => {
      const rect = container.getBoundingClientRect();
      canvas.width = rect.width;
      canvas.height = rect.height;

      // Fill white background
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    return () => window.removeEventListener("resize", resizeCanvas);
  }, []);

  const getCoordinates = (e: React.MouseEvent<HTMLCanvasElement>): Point => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };

    const rect = canvas.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  };

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
    const point = getCoordinates(e);
    setLastPoint(point);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !lastPoint) return;

    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const currentPoint = getCoordinates(e);

    ctx.beginPath();
    ctx.moveTo(lastPoint.x, lastPoint.y);

    // Use quadratic curve for smoother lines
    const midPoint = {
      x: (lastPoint.x + currentPoint.x) / 2,
      y: (lastPoint.y + currentPoint.y) / 2,
    };

    ctx.quadraticCurveTo(lastPoint.x, lastPoint.y, midPoint.x, midPoint.y);

    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.lineWidth = BRUSH_SIZES[brushSize];

    if (tool === "eraser") {
      ctx.strokeStyle = "#ffffff";
    } else {
      ctx.strokeStyle = color;
    }

    ctx.stroke();

    // Draw line to current point
    ctx.beginPath();
    ctx.moveTo(midPoint.x, midPoint.y);
    ctx.lineTo(currentPoint.x, currentPoint.y);
    ctx.stroke();

    setLastPoint(currentPoint);
  };

  const stopDrawing = () => {
    setIsDrawing(false);
    setLastPoint(null);
  };

  const clearCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }, []);

  const downloadImage = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const link = document.createElement("a");
    link.download = `丹青坊_${new Date().toLocaleString("zh-CN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    }).replace(/[/:]/g, "-")}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
  }, []);

  return (
    <div className="min-h-full p-8 lg:p-12">
      {/* Header */}
      <div className="mb-6">
        <Link
          href="/park"
          className="inline-flex items-center gap-2 text-[#5e5d59] hover:text-[#d97760] transition-colors mb-4"
        >
          <ArrowLeft className="h-4 w-4" />
          <span className="text-sm font-serif">返回逍遥园</span>
        </Link>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-[#d97760]/10 flex items-center justify-center">
            <Palette className="h-5 w-5 text-[#d97760]" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-[#141413] font-serif tracking-wide">
              丹青坊
            </h1>
            <p className="text-sm text-[#9a9590] font-serif">挥毫泼墨，随心所欲</p>
          </div>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-4 mb-6 p-4 bg-white rounded-xl border border-[#c2c0b6]/60 shadow-sm">
        {/* Tools */}
        <div className="flex items-center gap-2">
          <span className="text-sm text-[#9a9590] font-serif mr-1">工具</span>
          <button
            onClick={() => setTool("brush")}
            className={cn(
              "p-2 rounded-lg transition-all",
              tool === "brush"
                ? "bg-[#d97760] text-white"
                : "bg-[#f0eee6] text-[#5e5d59] hover:bg-[#e8e6de]"
            )}
            title="画笔"
          >
            <Pencil className="h-4 w-4" />
          </button>
          <button
            onClick={() => setTool("eraser")}
            className={cn(
              "p-2 rounded-lg transition-all",
              tool === "eraser"
                ? "bg-[#d97760] text-white"
                : "bg-[#f0eee6] text-[#5e5d59] hover:bg-[#e8e6de]"
            )}
            title="橡皮擦"
          >
            <Eraser className="h-4 w-4" />
          </button>
        </div>

        {/* Divider */}
        <div className="w-px h-8 bg-[#c2c0b6]/60" />

        {/* Colors */}
        <div className="flex items-center gap-2">
          <span className="text-sm text-[#9a9590] font-serif mr-1">颜色</span>
          <div className="flex items-center gap-1.5">
            {PRESET_COLORS.map((c) => (
              <button
                key={c.value}
                onClick={() => {
                  setColor(c.value);
                  setTool("brush");
                }}
                className={cn(
                  "w-7 h-7 rounded-full border-2 transition-all",
                  color === c.value && tool === "brush"
                    ? "border-[#d97760] scale-110"
                    : "border-transparent hover:scale-105"
                )}
                style={{ backgroundColor: c.value }}
                title={c.name}
              />
            ))}
          </div>
        </div>

        {/* Divider */}
        <div className="w-px h-8 bg-[#c2c0b6]/60" />

        {/* Brush Size */}
        <div className="flex items-center gap-2">
          <span className="text-sm text-[#9a9590] font-serif mr-1">粗细</span>
          <div className="flex items-center gap-1">
            {(["small", "medium", "large"] as BrushSize[]).map((size) => (
              <button
                key={size}
                onClick={() => setBrushSize(size)}
                className={cn(
                  "p-2 rounded-lg transition-all flex items-center justify-center",
                  brushSize === size
                    ? "bg-[#d97760] text-white"
                    : "bg-[#f0eee6] text-[#5e5d59] hover:bg-[#e8e6de]"
                )}
                title={size === "small" ? "细" : size === "medium" ? "中" : "粗"}
              >
                <Circle
                  className="fill-current"
                  style={{
                    width: size === "small" ? 4 : size === "medium" ? 8 : 12,
                    height: size === "small" ? 4 : size === "medium" ? 8 : 12,
                  }}
                />
              </button>
            ))}
          </div>
        </div>

        {/* Divider */}
        <div className="w-px h-8 bg-[#c2c0b6]/60" />

        {/* Clear Button */}
        <Button
          variant="outline"
          size="sm"
          onClick={clearCanvas}
          className="border-[#c2c0b6] text-[#5e5d59] hover:bg-[#f0eee6] hover:text-[#141413] font-serif"
        >
          <Trash2 className="h-4 w-4 mr-1.5" />
          清空画布
        </Button>

        {/* Divider */}
        <div className="w-px h-8 bg-[#c2c0b6]/60" />

        {/* Download Button */}
        <Button
          variant="outline"
          size="sm"
          onClick={downloadImage}
          className="border-[#d97760] text-[#d97760] hover:bg-[#d97760] hover:text-white font-serif"
        >
          <Download className="h-4 w-4 mr-1.5" />
          下载作品
        </Button>
      </div>

      {/* Canvas Container - 自适应高度 */}
      <div
        ref={containerRef}
        className="relative w-full bg-white rounded-xl border-2 border-[#c2c0b6]/60 shadow-inner overflow-hidden cursor-crosshair"
        style={{ height: "calc(100vh - 320px)", minHeight: "400px" }}
      >
        {/* Decorative corners */}
        <div className="absolute top-3 left-3 w-6 h-6 border-t-2 border-l-2 border-[#c2c0b6]/40 rounded-tl pointer-events-none" />
        <div className="absolute top-3 right-3 w-6 h-6 border-t-2 border-r-2 border-[#c2c0b6]/40 rounded-tr pointer-events-none" />
        <div className="absolute bottom-3 left-3 w-6 h-6 border-b-2 border-l-2 border-[#c2c0b6]/40 rounded-bl pointer-events-none" />
        <div className="absolute bottom-3 right-3 w-6 h-6 border-b-2 border-r-2 border-[#c2c0b6]/40 rounded-br pointer-events-none" />

        <canvas
          ref={canvasRef}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          className="block w-full h-full"
        />
      </div>

      {/* Footer hint */}
      <div className="mt-4 text-center">
        <p className="text-sm text-[#9a9590] font-serif">
          按住鼠标左键在画布上绘制，支持流畅曲线
        </p>
      </div>
    </div>
  );
}
