"use client";

import { useState } from "react";
import { Calendar, Flag } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectItem,
} from "@/components/ui/select";
import { useAppStore } from "@/lib/store";
import { Milestone, MilestoneStatus } from "@/lib/types";

interface AddMilestoneDialogProps {
  companyId: string;
}

const statusOptions: { value: MilestoneStatus; label: string; color: string }[] = [
  { value: "pending", label: "待完成", color: "text-[#9a9590]" },
  { value: "achieved", label: "已完成", color: "text-green-600" },
  { value: "delayed", label: "已延期", color: "text-yellow-600" },
  { value: "atRisk", label: "有风险", color: "text-red-600" },
];

export function AddMilestoneDialog({ companyId }: AddMilestoneDialogProps) {
  const [open, setOpen] = useState(false);
  const { addMilestone } = useAppStore();
  
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    targetDate: "",
    status: "pending" as MilestoneStatus,
    achievedDate: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.targetDate) return;

    const milestone: Omit<Milestone, "id" | "createdAt"> = {
      companyId,
      title: formData.title,
      description: formData.description,
      targetDate: formData.targetDate,
      status: formData.status,
      achievedDate: formData.achievedDate || undefined,
    };

    addMilestone(milestone);
    setOpen(false);
    setFormData({
      title: "",
      description: "",
      targetDate: "",
      status: "pending",
      achievedDate: "",
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button variant="outline" size="sm" className="border-[#c2c0b6] text-[#5e5d59]">
            <Calendar className="h-4 w-4 mr-2" />
            添加里程碑
          </Button>
        }
      />
      <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-serif text-[#141413]">
            添加里程碑
          </DialogTitle>
          <DialogDescription className="text-[#5e5d59]">
            记录企业发展的关键节点和目标
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6 py-4">
          {/* 里程碑标题 */}
          <div className="space-y-2">
            <Label htmlFor="title" className="text-[#5e5d59]">
              里程碑标题 <span className="text-red-500">*</span>
            </Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="如：完成A轮融资、产品上线、用户突破10万"
              className="border-[#c2c0b6] focus-visible:ring-[#d97760]"
              required
            />
          </div>

          {/* 描述 */}
          <div className="space-y-2">
            <Label htmlFor="description" className="text-[#5e5d59]">
              描述
            </Label>
            <textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="详细描述该里程碑的内容和意义..."
              rows={3}
              className="w-full px-3 py-2 border border-[#c2c0b6] rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#d97760] focus:border-transparent resize-none"
            />
          </div>

          {/* 目标日期 */}
          <div className="space-y-2">
            <Label htmlFor="targetDate" className="text-[#5e5d59]">
              目标日期 <span className="text-red-500">*</span>
            </Label>
            <Input
              id="targetDate"
              type="date"
              value={formData.targetDate}
              onChange={(e) => setFormData({ ...formData, targetDate: e.target.value })}
              className="border-[#c2c0b6] focus-visible:ring-[#d97760]"
              required
            />
          </div>

          {/* 状态 */}
          <div className="space-y-2">
            <Label htmlFor="status" className="text-[#5e5d59]">
              当前状态
            </Label>
            <Select
              value={formData.status}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setFormData({ ...formData, status: e.target.value as MilestoneStatus })}
              className="border-[#c2c0b6] focus:ring-[#d97760]"
            >
              {statusOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </Select>
          </div>

          {/* 完成日期（仅当状态为已完成时显示） */}
          {formData.status === "achieved" && (
            <div className="space-y-2">
              <Label htmlFor="achievedDate" className="text-[#5e5d59]">
                实际完成日期
              </Label>
              <Input
                id="achievedDate"
                type="date"
                value={formData.achievedDate}
                onChange={(e) => setFormData({ ...formData, achievedDate: e.target.value })}
                className="border-[#c2c0b6] focus-visible:ring-[#d97760]"
              />
            </div>
          )}

          <DialogFooter className="gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              className="border-[#c2c0b6] text-[#5e5d59]"
            >
              取消
            </Button>
            <Button
              type="submit"
              className="bg-[#d97760] hover:bg-[#c96a54] text-white"
            >
              添加里程碑
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
