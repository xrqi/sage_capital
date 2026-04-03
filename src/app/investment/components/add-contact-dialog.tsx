"use client";

import { useState } from "react";
import { Users, Plus } from "lucide-react";
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
import { Switch } from "@/components/ui/switch";
import { useAppStore } from "@/lib/store";
import { CompanyContact } from "@/lib/types";

interface AddContactDialogProps {
  companyId: string;
}

export function AddContactDialog({ companyId }: AddContactDialogProps) {
  const [open, setOpen] = useState(false);
  const { updateCompany, portfolioCompanies } = useAppStore();
  
  const [formData, setFormData] = useState({
    name: "",
    role: "",
    phone: "",
    email: "",
    isPrimary: false,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name) return;

    const company = portfolioCompanies.find((c) => c.id === companyId);
    if (!company) return;

    const newContact: CompanyContact = {
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name: formData.name,
      role: formData.role,
      phone: formData.phone || undefined,
      email: formData.email || undefined,
      isPrimary: formData.isPrimary,
    };

    // 如果新联系人设为主要联系人，将其他联系人设为非主要
    let updatedContacts = [...company.contacts, newContact];
    if (formData.isPrimary) {
      updatedContacts = updatedContacts.map((c) => ({
        ...c,
        isPrimary: c.id === newContact.id,
      }));
    }

    updateCompany(companyId, { contacts: updatedContacts });
    setOpen(false);
    setFormData({
      name: "",
      role: "",
      phone: "",
      email: "",
      isPrimary: false,
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button variant="outline" size="sm" className="border-[#c2c0b6] text-[#5e5d59]">
            <Users className="h-4 w-4 mr-2" />
            添加
          </Button>
        }
      />
      <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-serif text-[#141413]">
            添加联系人
          </DialogTitle>
          <DialogDescription className="text-[#5e5d59]">
            记录企业关键联系人信息
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6 py-4">
          {/* 姓名 */}
          <div className="space-y-2">
            <Label htmlFor="name" className="text-[#5e5d59]">
              姓名 <span className="text-red-500">*</span>
            </Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="请输入联系人姓名"
              className="border-[#c2c0b6] focus-visible:ring-[#d97760]"
              required
            />
          </div>

          {/* 职位 */}
          <div className="space-y-2">
            <Label htmlFor="role" className="text-[#5e5d59]">
              职位 <span className="text-red-500">*</span>
            </Label>
            <Input
              id="role"
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              placeholder="如：CEO、CFO、创始人"
              className="border-[#c2c0b6] focus-visible:ring-[#d97760]"
              required
            />
          </div>

          {/* 联系方式 */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="phone" className="text-[#5e5d59]">
                电话
              </Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="手机号码"
                className="border-[#c2c0b6] focus-visible:ring-[#d97760]"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email" className="text-[#5e5d59]">
                邮箱
              </Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="邮箱地址"
                className="border-[#c2c0b6] focus-visible:ring-[#d97760]"
              />
            </div>
          </div>

          {/* 主要联系人开关 */}
          <div className="flex items-center justify-between p-4 rounded-lg bg-[#faf9f5] border border-[#e8e6df]">
            <div>
              <Label htmlFor="isPrimary" className="text-[#141413] font-medium">
                设为主要联系人
              </Label>
              <p className="text-sm text-[#9a9590]">
                主要联系人将作为企业的首选沟通对象
              </p>
            </div>
            <Switch
              id="isPrimary"
              checked={formData.isPrimary}
              onCheckedChange={(checked) => setFormData({ ...formData, isPrimary: checked })}
              className="data-[state=checked]:bg-[#d97760]"
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
              添加联系人
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
