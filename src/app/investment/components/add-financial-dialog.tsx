"use client";

import { useState } from "react";
import { TrendingUp } from "lucide-react";
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
import { useAppStore } from "@/lib/store";
import { FinancialData } from "@/lib/types";

interface AddFinancialDialogProps {
  companyId: string;
}

export function AddFinancialDialog({ companyId }: AddFinancialDialogProps) {
  const [open, setOpen] = useState(false);
  const { addFinancialData } = useAppStore();
  
  const [formData, setFormData] = useState({
    period: "",
    revenue: "",
    netProfit: "",
    cashBalance: "",
    burnRate: "",
    runway: "",
    gmv: "",
    userCount: "",
    notes: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.period) return;

    const data: Omit<FinancialData, "id"> = {
      companyId,
      period: formData.period,
      revenue: formData.revenue ? Number(formData.revenue) : undefined,
      netProfit: formData.netProfit ? Number(formData.netProfit) : undefined,
      cashBalance: formData.cashBalance ? Number(formData.cashBalance) : undefined,
      burnRate: formData.burnRate ? Number(formData.burnRate) : undefined,
      runway: formData.runway ? Number(formData.runway) : undefined,
      gmv: formData.gmv ? Number(formData.gmv) : undefined,
      userCount: formData.userCount ? Number(formData.userCount) : undefined,
      notes: formData.notes || undefined,
      reportedAt: Date.now(),
    };

    addFinancialData(data);
    setOpen(false);
    setFormData({
      period: "",
      revenue: "",
      netProfit: "",
      cashBalance: "",
      burnRate: "",
      runway: "",
      gmv: "",
      userCount: "",
      notes: "",
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button variant="outline" size="sm" className="border-[#c2c0b6] text-[#5e5d59]">
            <TrendingUp className="h-4 w-4 mr-2" />
            录入数据
          </Button>
        }
      />
      <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-serif text-[#141413]">
            录入财务数据
          </DialogTitle>
          <DialogDescription className="text-[#5e5d59]">
            记录企业最新财务和经营数据
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6 py-4">
          {/* 报告期 */}
          <div className="space-y-2">
            <Label htmlFor="period" className="text-[#5e5d59]">
              报告期 <span className="text-red-500">*</span>
            </Label>
            <Input
              id="period"
              value={formData.period}
              onChange={(e) => setFormData({ ...formData, period: e.target.value })}
              placeholder="如：2024-Q1、2024-03"
              className="border-[#c2c0b6] focus-visible:ring-[#d97760]"
              required
            />
          </div>

          {/* 财务数据 */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-[#141413] font-serif border-b border-[#e8e6df] pb-2">
              核心财务指标（万元）
            </h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="revenue" className="text-[#5e5d59]">
                  营业收入
                </Label>
                <Input
                  id="revenue"
                  type="number"
                  value={formData.revenue}
                  onChange={(e) => setFormData({ ...formData, revenue: e.target.value })}
                  placeholder="0"
                  className="border-[#c2c0b6] focus-visible:ring-[#d97760]"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="netProfit" className="text-[#5e5d59]">
                  净利润
                </Label>
                <Input
                  id="netProfit"
                  type="number"
                  value={formData.netProfit}
                  onChange={(e) => setFormData({ ...formData, netProfit: e.target.value })}
                  placeholder="0"
                  className="border-[#c2c0b6] focus-visible:ring-[#d97760]"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="cashBalance" className="text-[#5e5d59]">
                  现金余额
                </Label>
                <Input
                  id="cashBalance"
                  type="number"
                  value={formData.cashBalance}
                  onChange={(e) => setFormData({ ...formData, cashBalance: e.target.value })}
                  placeholder="0"
                  className="border-[#c2c0b6] focus-visible:ring-[#d97760]"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="burnRate" className="text-[#5e5d59]">
                  月度烧钱率
                </Label>
                <Input
                  id="burnRate"
                  type="number"
                  value={formData.burnRate}
                  onChange={(e) => setFormData({ ...formData, burnRate: e.target.value })}
                  placeholder="0"
                  className="border-[#c2c0b6] focus-visible:ring-[#d97760]"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="runway" className="text-[#5e5d59]">
                  资金 Runway（月）
                </Label>
                <Input
                  id="runway"
                  type="number"
                  value={formData.runway}
                  onChange={(e) => setFormData({ ...formData, runway: e.target.value })}
                  placeholder="0"
                  className="border-[#c2c0b6] focus-visible:ring-[#d97760]"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="gmv" className="text-[#5e5d59]">
                  GMV（如有）
                </Label>
                <Input
                  id="gmv"
                  type="number"
                  value={formData.gmv}
                  onChange={(e) => setFormData({ ...formData, gmv: e.target.value })}
                  placeholder="0"
                  className="border-[#c2c0b6] focus-visible:ring-[#d97760]"
                />
              </div>
            </div>
          </div>

          {/* 经营数据 */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-[#141413] font-serif border-b border-[#e8e6df] pb-2">
              经营指标
            </h3>
            
            <div className="space-y-2">
              <Label htmlFor="userCount" className="text-[#5e5d59]">
                用户数（如有）
              </Label>
              <Input
                id="userCount"
                type="number"
                value={formData.userCount}
                onChange={(e) => setFormData({ ...formData, userCount: e.target.value })}
                placeholder="0"
                className="border-[#c2c0b6] focus-visible:ring-[#d97760]"
              />
            </div>
          </div>

          {/* 备注 */}
          <div className="space-y-2">
            <Label htmlFor="notes" className="text-[#5e5d59]">
              备注
            </Label>
            <textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="补充说明..."
              rows={3}
              className="w-full px-3 py-2 border border-[#c2c0b6] rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#d97760] focus:border-transparent resize-none"
            />
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
              保存数据
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
