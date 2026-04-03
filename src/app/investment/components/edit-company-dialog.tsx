"use client";

import { useState, useEffect } from "react";
import { Edit } from "lucide-react";
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
import { PortfolioCompany, CompanyStage, CompanyStatus } from "@/lib/types";

interface EditCompanyDialogProps {
  company: PortfolioCompany;
}

const stageOptions: { value: CompanyStage; label: string }[] = [
  { value: "seed", label: "种子期" },
  { value: "angel", label: "天使轮" },
  { value: "preA", label: "Pre-A轮" },
  { value: "A", label: "A轮" },
  { value: "B", label: "B轮" },
  { value: "C", label: "C轮" },
  { value: "preIPO", label: "Pre-IPO" },
  { value: "IPO", label: "已上市" },
];

const statusOptions: { value: CompanyStatus; label: string }[] = [
  { value: "active", label: "在管" },
  { value: "exited", label: "已退出" },
  { value: "writtenOff", label: "已核销" },
];

export function EditCompanyDialog({ company }: EditCompanyDialogProps) {
  const [open, setOpen] = useState(false);
  const { updateCompany } = useAppStore();
  
  const [formData, setFormData] = useState({
    name: company.name,
    industry: company.industry,
    investmentDate: company.investmentDate,
    investmentAmount: company.investmentAmount.toString(),
    equityRatio: company.equityRatio.toString(),
    valuationAtInvestment: company.valuationAtInvestment.toString(),
    currentValuation: company.currentValuation?.toString() || "",
    stage: company.stage,
    status: company.status,
    description: company.description || "",
    website: company.website || "",
    location: company.location || "",
  });

  // 当company变化时更新表单数据
  useEffect(() => {
    setFormData({
      name: company.name,
      industry: company.industry,
      investmentDate: company.investmentDate,
      investmentAmount: company.investmentAmount.toString(),
      equityRatio: company.equityRatio.toString(),
      valuationAtInvestment: company.valuationAtInvestment.toString(),
      currentValuation: company.currentValuation?.toString() || "",
      stage: company.stage,
      status: company.status,
      description: company.description || "",
      website: company.website || "",
      location: company.location || "",
    });
  }, [company]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name) return;

    updateCompany(company.id, {
      name: formData.name,
      industry: formData.industry || "未分类",
      investmentDate: formData.investmentDate,
      investmentAmount: Number(formData.investmentAmount) || 0,
      equityRatio: Number(formData.equityRatio) || 0,
      valuationAtInvestment: Number(formData.valuationAtInvestment) || 0,
      currentValuation: formData.currentValuation ? Number(formData.currentValuation) : undefined,
      stage: formData.stage as CompanyStage,
      status: formData.status as CompanyStatus,
      description: formData.description,
      website: formData.website,
      location: formData.location,
    });

    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button variant="outline" className="border-[#c2c0b6] text-[#5e5d59]">
            <Edit className="h-4 w-4 mr-2" />
            编辑
          </Button>
        }
      />
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-serif text-[#141413]">
            编辑企业信息
          </DialogTitle>
          <DialogDescription className="text-[#5e5d59]">
            修改被投企业的基本信息和投资信息
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6 py-4">
          {/* 基本信息 */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-[#141413] font-serif border-b border-[#e8e6df] pb-2">
              基本信息
            </h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-[#5e5d59]">
                  企业名称 <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="请输入企业名称"
                  className="border-[#c2c0b6] focus-visible:ring-[#d97760]"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="industry" className="text-[#5e5d59]">
                  所属行业
                </Label>
                <Input
                  id="industry"
                  value={formData.industry}
                  onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                  placeholder="如：人工智能、生物医药"
                  className="border-[#c2c0b6] focus-visible:ring-[#d97760]"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="location" className="text-[#5e5d59]">
                  所在地
                </Label>
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  placeholder="如：北京、上海"
                  className="border-[#c2c0b6] focus-visible:ring-[#d97760]"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="website" className="text-[#5e5d59]">
                  官网链接
                </Label>
                <Input
                  id="website"
                  value={formData.website}
                  onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                  placeholder="https://..."
                  className="border-[#c2c0b6] focus-visible:ring-[#d97760]"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description" className="text-[#5e5d59]">
                企业简介
              </Label>
              <textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="简要描述企业业务、产品、团队等"
                rows={3}
                className="w-full px-3 py-2 border border-[#c2c0b6] rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#d97760] focus:border-transparent resize-none"
              />
            </div>
          </div>

          {/* 投资信息 */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-[#141413] font-serif border-b border-[#e8e6df] pb-2">
              投资信息
            </h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="stage" className="text-[#5e5d59]">
                  投资阶段 <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={formData.stage}
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setFormData({ ...formData, stage: e.target.value as CompanyStage })}
                  className="border-[#c2c0b6] focus:ring-[#d97760]"
                  required
                >
                  {stageOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="status" className="text-[#5e5d59]">
                  当前状态
                </Label>
                <Select
                  value={formData.status}
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setFormData({ ...formData, status: e.target.value as CompanyStatus })}
                  className="border-[#c2c0b6] focus:ring-[#d97760]"
                >
                  {statusOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="investmentDate" className="text-[#5e5d59]">
                  投资日期
                </Label>
                <Input
                  id="investmentDate"
                  type="date"
                  value={formData.investmentDate}
                  onChange={(e) => setFormData({ ...formData, investmentDate: e.target.value })}
                  className="border-[#c2c0b6] focus-visible:ring-[#d97760]"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="currentValuation" className="text-[#5e5d59]">
                  当前估值（万元）
                </Label>
                <Input
                  id="currentValuation"
                  type="number"
                  value={formData.currentValuation}
                  onChange={(e) => setFormData({ ...formData, currentValuation: e.target.value })}
                  placeholder="0"
                  className="border-[#c2c0b6] focus-visible:ring-[#d97760]"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="investmentAmount" className="text-[#5e5d59]">
                  投资金额（万元）
                </Label>
                <Input
                  id="investmentAmount"
                  type="number"
                  value={formData.investmentAmount}
                  onChange={(e) => setFormData({ ...formData, investmentAmount: e.target.value })}
                  placeholder="0"
                  className="border-[#c2c0b6] focus-visible:ring-[#d97760]"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="equityRatio" className="text-[#5e5d59]">
                  持股比例（%）
                </Label>
                <Input
                  id="equityRatio"
                  type="number"
                  step="0.01"
                  value={formData.equityRatio}
                  onChange={(e) => setFormData({ ...formData, equityRatio: e.target.value })}
                  placeholder="0.00"
                  className="border-[#c2c0b6] focus-visible:ring-[#d97760]"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="valuationAtInvestment" className="text-[#5e5d59]">
                  投资时估值（万元）
                </Label>
                <Input
                  id="valuationAtInvestment"
                  type="number"
                  value={formData.valuationAtInvestment}
                  onChange={(e) => setFormData({ ...formData, valuationAtInvestment: e.target.value })}
                  placeholder="0"
                  className="border-[#c2c0b6] focus-visible:ring-[#d97760]"
                />
              </div>
            </div>
          </div>

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
              保存修改
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
