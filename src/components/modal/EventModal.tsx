"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useState, useEffect } from "react";

interface EventModalProps {
  open: boolean;
  onClose: () => void;
  onAddOrUpdate: (title: string, isLunar: boolean) => void;
  onDelete: (id: string) => void;
  // date: string;
  event: { id: string; title: string; isLunar?: boolean } | null;
}

export default function EventModal({
  open,
  onClose,
  onAddOrUpdate,
  onDelete,
  // date,
  event,
}: EventModalProps) {
  const [title, setTitle] = useState("");
  const [isLunar, setIsLunar] = useState(false);

  useEffect(() => {
    if (event) {
      setTitle(event.title.replace(" (Âm lịch)", ""));
      setIsLunar(event.isLunar || false);
    } else {
      setTitle("");
      setIsLunar(false);
    }
  }, [event]);

  const handleSubmit = () => {
    if (title.trim()) {
      onAddOrUpdate(title, isLunar);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {event ? "Chỉnh sửa sự kiện" : "Thêm sự kiện"} ({event?.title})
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Tiêu đề sự kiện</Label>
            <Input
              id="title"
              placeholder="Nhập tiêu đề sự kiện"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="isLunar"
              checked={isLunar}
              onCheckedChange={(checked) => setIsLunar(Boolean(checked))}
            />
            <Label htmlFor="isLunar">Sự kiện theo lịch âm?</Label>
          </div>
        </div>
        <DialogFooter className="mt-6">
          {event && (
            <Button variant="destructive" onClick={() => onDelete(event.id)}>
              Xóa sự kiện
            </Button>
          )}
          <Button onClick={handleSubmit}>
            {event ? "Lưu thay đổi" : "Lưu sự kiện"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
