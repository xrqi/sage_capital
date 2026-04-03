"use client";

import { useState, useRef, useCallback } from "react";
import { Paperclip, X, FileText, Image, File } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Attachment } from "@/lib/types";
import { cn } from "@/lib/utils";

interface FileUploadProps {
  onFilesSelected: (files: Attachment[]) => void;
  onClearFiles: () => void;
  selectedFiles: Attachment[];
  disabled?: boolean;
}

// 支持的文件类型
const SUPPORTED_TYPES = {
  text: [".txt", ".md", ".json", ".js", ".ts", ".tsx", ".jsx", ".css", ".html"],
  image: [".png", ".jpg", ".jpeg", ".gif", ".webp", ".svg"],
  document: [".pdf", ".doc", ".docx"],
};

// 获取文件图标
function getFileIcon(type: string) {
  if (type.startsWith("image/")) return Image;
  if (type.includes("text") || type.includes("markdown")) return FileText;
  return File;
}

// 格式化文件大小
function formatFileSize(bytes: number): string {
  if (bytes < 1024) return bytes + " B";
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
  return (bytes / (1024 * 1024)).toFixed(1) + " MB";
}

export function FileUpload({
  onFilesSelected,
  onClearFiles,
  selectedFiles,
  disabled = false,
}: FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 读取文件内容
  const readFileContent = async (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target?.result as string);
      reader.onerror = reject;
      
      // 文本文件读取内容
      if (file.type.startsWith("text/") || 
          file.name.endsWith(".md") ||
          file.name.endsWith(".json") ||
          file.name.endsWith(".js") ||
          file.name.endsWith(".ts") ||
          file.name.endsWith(".tsx")) {
        reader.readAsText(file);
      } else {
        // 其他文件只返回空字符串
        resolve("");
      }
    });
  };

  // 处理文件选择
  const handleFileSelect = useCallback(
    async (files: FileList | null) => {
      if (!files || files.length === 0) return;

      const attachments: Attachment[] = [];

      for (const file of Array.from(files)) {
        // 检查文件大小（限制 5MB）
        if (file.size > 5 * 1024 * 1024) {
          console.warn(`文件 ${file.name} 超过 5MB 限制，已跳过`);
          continue;
        }

        const content = await readFileContent(file);
        
        attachments.push({
          id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          name: file.name,
          type: file.type || "application/octet-stream",
          size: file.size,
          content: content || undefined,
        });
      }

      if (attachments.length > 0) {
        onFilesSelected(attachments);
      }
    },
    [onFilesSelected]
  );

  // 点击上传按钮
  const handleClick = () => {
    fileInputRef.current?.click();
  };

  // 处理文件输入变化
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFileSelect(e.target.files);
    // 重置 input 以便可以重复选择相同文件
    e.target.value = "";
  };

  // 拖拽事件处理
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFileSelect(e.dataTransfer.files);
  };

  // 移除单个文件
  const handleRemoveFile = (fileId: string) => {
    const newFiles = selectedFiles.filter((f) => f.id !== fileId);
    if (newFiles.length === 0) {
      onClearFiles();
    } else {
      onFilesSelected(newFiles);
    }
  };

  const hasFiles = selectedFiles.length > 0;

  return (
    <div className="relative">
      {/* 文件输入 */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept=".txt,.md,.json,.js,.ts,.tsx,.jsx,.css,.html,.png,.jpg,.jpeg,.gif,.webp,.svg,.pdf"
        onChange={handleInputChange}
        className="hidden"
        disabled={disabled}
      />

      {/* 上传按钮 */}
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={handleClick}
        disabled={disabled}
        className={cn(
          "h-8 w-8 p-0 rounded-lg",
          "text-[#5e5d59] hover:text-[#d97760] hover:bg-[#f0eee6]",
          "transition-colors duration-200",
          disabled && "opacity-50 cursor-not-allowed"
        )}
        title="上传文件"
      >
        <Paperclip className="h-4 w-4" />
      </Button>

      {/* 已选文件列表 */}
      {hasFiles && (
        <div className="absolute bottom-full left-0 mb-2 w-64 bg-white rounded-lg shadow-lg border border-[#c2c0b6] p-2 z-50">
          <div className="flex items-center justify-between mb-2 pb-2 border-b border-[#e5e3da]">
            <span className="text-xs text-[#5e5d59]">
              已选择 {selectedFiles.length} 个文件
            </span>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={onClearFiles}
              className="h-6 px-2 text-xs text-[#d97760] hover:text-[#c96a54] hover:bg-[#f0eee6]"
            >
              清除全部
            </Button>
          </div>
          <div className="space-y-1 max-h-32 overflow-y-auto">
            {selectedFiles.map((file) => {
              const Icon = getFileIcon(file.type);
              return (
                <div
                  key={file.id}
                  className="flex items-center gap-2 p-1.5 rounded-md bg-[#faf9f5] group"
                >
                  <Icon className="h-3.5 w-3.5 text-[#5e5d59] shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-[#141413] truncate">{file.name}</p>
                    <p className="text-[10px] text-[#5e5d59]">
                      {formatFileSize(file.size)}
                    </p>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemoveFile(file.id)}
                    className="h-5 w-5 p-0 opacity-0 group-hover:opacity-100 transition-opacity text-[#5e5d59] hover:text-[#d97760]"
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 拖拽提示 */}
      {isDragging && (
        <div className="fixed inset-0 bg-[#d97760]/10 flex items-center justify-center z-50 pointer-events-none">
          <div className="bg-white rounded-xl shadow-xl border-2 border-dashed border-[#d97760] p-8 text-center">
            <Paperclip className="h-12 w-12 text-[#d97760] mx-auto mb-3" />
            <p className="text-[#141413] font-medium">释放以上传文件</p>
            <p className="text-sm text-[#5e5d59] mt-1">支持文本、图片、PDF 等格式</p>
          </div>
        </div>
      )}
    </div>
  );
}
