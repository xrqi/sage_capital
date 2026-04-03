"use client";

import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { cn } from "@/lib/utils";

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

// 进度条组件
function ProgressBar({ value, color = "#d97760" }: { value: number; color?: string }) {
  return (
    <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
      <div 
        className="h-full rounded-full transition-all duration-500"
        style={{ width: `${value}%`, backgroundColor: color }}
      />
    </div>
  );
}

// 统计卡片
function StatCard({ label, value, unit, color }: { label: string; value: string; unit?: string; color: string }) {
  return (
    <div className="bg-gradient-to-br from-white to-gray-50 rounded-xl p-4 border border-gray-100 shadow-sm">
      <div className="text-xs text-gray-500 mb-1">{label}</div>
      <div className="flex items-baseline gap-1">
        <span className="text-2xl font-bold" style={{ color }}>{value}</span>
        {unit && <span className="text-xs text-gray-400">{unit}</span>}
      </div>
    </div>
  );
}

export function MarkdownRenderer({ content, className }: MarkdownRendererProps) {
  // 预处理内容，转换特殊标记
  const processedContent = content
    // 转换进度条标记 [进度:75%]
    .replace(/\[进度:(\d+)%\]/g, '<progress value="$1" />')
    // 转换统计标记 [统计:标签:值:单位:颜色]
    .replace(/\[统计:([^:]+):([^:]+):([^:]*):([^\]]+)\]/g, '<stat label="$1" value="$2" unit="$3" color="$4" />');

  return (
    <div className={cn("markdown-body font-sans", className)}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          // 标题样式 - 更现代的设计
          h1: ({ children }) => (
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                {children}
              </h1>
              <div className="h-1 w-20 bg-gradient-to-r from-orange-500 to-red-500 rounded-full"></div>
            </div>
          ),
          h2: ({ children }) => (
            <h2 className="text-lg font-bold text-gray-800 mt-8 mb-4 flex items-center gap-2 bg-gradient-to-r from-orange-50 to-transparent p-2 -mx-2 rounded-lg">
              <span className="w-2 h-6 bg-gradient-to-b from-orange-500 to-red-500 rounded-full"></span>
              <span>{children}</span>
            </h2>
          ),
          h3: ({ children }) => (
            <h3 className="text-base font-semibold text-gray-700 mt-6 mb-3 flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-orange-500 rounded-full"></span>
              {children}
            </h3>
          ),
          h4: ({ children }) => (
            <h4 className="text-sm font-medium text-gray-600 mt-4 mb-2 flex items-center gap-2">
              <span className="text-orange-500">▸</span>
              {children}
            </h4>
          ),
          
          // 段落样式
          p: ({ children }) => (
            <p className="text-sm text-gray-700 leading-relaxed mb-4">
              {children}
            </p>
          ),
          
          // 列表样式 - 更现代
          ul: ({ children }) => (
            <ul className="space-y-2 mb-4">
              {children}
            </ul>
          ),
          ol: ({ children }) => (
            <ol className="space-y-2 mb-4 counter-reset-item">
              {children}
            </ol>
          ),
          li: ({ children }) => (
            <li className="text-sm text-gray-700 flex items-start gap-3">
              <span className="w-2 h-2 rounded-full bg-gradient-to-br from-orange-400 to-red-400 mt-2 shrink-0"></span>
              <span className="flex-1">{children}</span>
            </li>
          ),
          
          // 表格样式 - 更专业
          table: ({ children }) => (
            <div className="overflow-x-auto mb-6 rounded-xl border border-gray-200 shadow-sm">
              <table className="w-full text-sm">
                {children}
              </table>
            </div>
          ),
          thead: ({ children }) => (
            <thead className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
              {children}
            </thead>
          ),
          tbody: ({ children }) => (
            <tbody className="bg-white divide-y divide-gray-100">
              {children}
            </tbody>
          ),
          tr: ({ children }) => (
            <tr className="hover:bg-orange-50/30 transition-colors">
              {children}
            </tr>
          ),
          th: ({ children }) => (
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
              {children}
            </th>
          ),
          td: ({ children }) => (
            <td className="px-4 py-3 text-sm text-gray-700">
              {children}
            </td>
          ),
          
          // 代码样式
          code: ({ children, className: codeClassName }) => {
            const isInline = !codeClassName;
            return isInline ? (
              <code className="px-1.5 py-0.5 bg-orange-50 border border-orange-100 rounded text-xs text-orange-700 font-mono">
                {children}
              </code>
            ) : (
              <pre className="p-4 bg-gray-900 rounded-xl overflow-x-auto mb-4">
                <code className="text-xs text-gray-100 font-mono">
                  {children}
                </code>
              </pre>
            );
          },
          
          // 引用样式 - 更醒目
          blockquote: ({ children }) => (
            <blockquote className="pl-4 border-l-4 border-gradient-to-b from-orange-500 to-red-500 bg-gradient-to-r from-orange-50/50 to-transparent py-3 pr-4 rounded-r-lg mb-4">
              <div className="text-sm text-gray-600 italic">
                {children}
              </div>
            </blockquote>
          ),
          
          // 链接样式
          a: ({ children, href }) => (
            <a 
              href={href}
              className="text-orange-600 hover:text-orange-700 underline underline-offset-2 font-medium"
              target="_blank"
              rel="noopener noreferrer"
            >
              {children}
            </a>
          ),
          
          // 强调样式
          strong: ({ children }) => (
            <strong className="font-bold text-gray-900 bg-yellow-100/50 px-1 rounded">
              {children}
            </strong>
          ),
          em: ({ children }) => (
            <em className="italic text-gray-600">
              {children}
            </em>
          ),
          
          // 分割线
          hr: () => (
            <hr className="my-6 border-t-2 border-dashed border-gray-200" />
          ),

          // 处理 HTML 标签（用于图表等）
          div: ({ children, className: divClassName }) => (
            <div className={divClassName}>
              {children}
            </div>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
      
      {/* 自定义样式 */}
      <style jsx global>{`
        .markdown-body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
        }
        
        /* 表格中的徽章样式 */
        .markdown-body td strong {
          display: inline-flex;
          align-items: center;
          padding: 0.25rem 0.75rem;
          border-radius: 9999px;
          font-size: 0.75rem;
          font-weight: 600;
        }
        
        /* 完成状态徽章 */
        .markdown-body td strong:contains("完成") {
          background-color: #dcfce7;
          color: #166534;
        }
        
        .markdown-body td strong:contains("进行") {
          background-color: #dbeafe;
          color: #1e40af;
        }
        
        /* 数字高亮 */
        .markdown-body p strong,
        .markdown-body li strong {
          color: #ea580c;
        }
        
        /* 列表计数器 */
        .markdown-body ol {
          counter-reset: item;
        }
        
        .markdown-body ol li::before {
          content: counter(item);
          counter-increment: item;
          position: absolute;
          left: 0;
          width: 1.25rem;
          height: 1.25rem;
          background: linear-gradient(135deg, #f97316, #dc2626);
          color: white;
          border-radius: 9999px;
          font-size: 0.65rem;
          font-weight: 600;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .markdown-body ol li {
          position: relative;
          padding-left: 1.75rem;
        }
      `}</style>
    </div>
  );
}
