"use client";

import { useState } from "react";
import { AlertCircle, Shield } from "lucide-react";
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
import { RiskFlag, RiskType, RiskLevel } from "@/lib/types";

interface AddRiskDialogProps {
  companyId: string;
}

const riskTypeOptions: { value: RiskType; label: string }[] = [
  { value: "financial", label: "财务风险" },
  { value: "operational", label: "经营风险" },
  { value: "team", label: "团队风险" },
  { value: "market", label: "市场风险" },
  { value: "legal", label: "法律风险" },
  { value: "other", label: "其他风险" },
];

const riskLevelOptions: { value: RiskLevel; label: string; color: string }[] = [
  { value: "low", label: "低", color: "text-yellow-600" },
  { value: "medium", label: "中", color: "text-orange-600" },
  { value: "high", label: "高", color: "text-red-600" },
  { value: "critical", label: "紧急", color: "text-red-700" },
];

export function AddRiskDialog({ companyId }: AddRiskDialogProps) {
  const [open, setOpen] = useState(false);
  const { addRiskFlag } = useAppStore();
  
  const [formData, setFormData] = useState({
    type: "operational" as RiskType,
    level: "medium" as RiskLevel,
    description: "",
    mitigationPlan: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.description) return;

    const risk: Omit<RiskFlag, "id" | "identifiedAt"> = {
      companyId,
      type: formData.type,
      level: formData.level,
      description: formData.description,
      mitigationPlan: formData.mitigationPlan || undefined,
    };

    addRiskFlag(risk);
    setOpen(false);
    setFormData({
      type: "operational",
      level: "medium",
      description: "",
      mitigationPlan: "",
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button variant="outline" size="sm" className="border-[#c2c0b6] text-[#5e5d59]">
            <AlertCircle className="h-4 w-4 mr-2" />
            标记风险
          </Button>
        }
      />
      <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-serif text-[#141413]">
            标记风险
          </DialogTitle>
          <DialogDescription className="text-[#5e5d59]">
            识别和记录潜在风险，便于及时跟踪和处理
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6 py-4">
          {/* 风险类型 */}
          <div className="space-y-2">
            <Label htmlFor="type" className="text-[#5e5d59]">
              风险类型
            </Label>
            <Select
              value={formData.type}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setFormData({ ...formData, type: e.target.value as RiskType })}
              className="border-[#c2c0b6] focus:ring-[#d97760]"
            >
              {riskTypeOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </Select>
          </div>

          {/* 风险等级 */}
          <div className="space-y-2">
            <Label htmlFor="level" className="text-[#5e5d59]">
              风险等级 <span className="text-red-500">*</span>
            </Label>
            <Select
              value={formData.level}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setFormData({ ...formData, level: e.target.value as RiskLevel })}
              className="border-[#c2c0b6] focus:ring-[#d97760]"
            >
              {riskLevelOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </Select>
          </div>

          {/* 风险描述 */}
          <div className="space-y-2">
            <Label htmlFor="description" className="text-[#5e5d59]">
              风险描述 <span className="text-red-500">*</span>
            </Label>
            <textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="详细描述风险的具体情况、可能的影响..."
              rows={4}
              className="w-full px-3 py-2 border border-[#c2c0b6] rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#d97760] focus:border-transparent resize-none"
              required
            />
          </div>

          {/* 缓解措施 */}
          <div className="space-y-2">
            <Label htmlFor="mitigationPlan" className="text-[#5e5d59]">
              缓解措施 / 跟进计划
            </Label>
            <textarea
              id="mitigationPlan"
              value={formData.mitigationPlan}
              onChange={(e) => setFormData({ ...formData, mitigationPlan: e.target.value })}
              placeholder="计划采取的措施来降低或消除风险..."
              rows={3}
              className="w-full px-3 py-2 border border-[#c2c0b6] rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#d97760] focus:border-transparent resize-none"
            />
          </div>

          <DialogFooter className="gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              className="border-[#c2c0b6] text-[#5e9590]"
            >
              取消
            </Button>
            <Button
              type="submit"
              className="bg-red-500 hover:bg-red-600 text-white"
            >
              <AlertCircle className="h-4 w-4 mr-2" />
              标记风险
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
