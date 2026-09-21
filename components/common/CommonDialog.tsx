import * as React from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Field, FieldGroup } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type CommonDialogProps = {
  onClose?: () => void;
};

export default function CommonDialog({ onClose }: CommonDialogProps) {
  const [open, setOpen] = React.useState(true);

  const handleOpenChange = (nextOpen: boolean) => {
    setOpen(nextOpen);
    if (!nextOpen) {
      onClose?.();
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md rounded-2xl border border-slate-200 bg-white p-5 shadow-xl">
        <DialogHeader className="space-y-1.5">
          <DialogTitle className="text-lg font-semibold text-slate-900">보험 정보 등록</DialogTitle>
          <DialogDescription className="text-sm text-slate-500">
            보험 정보를 입력하고 저장하세요.
          </DialogDescription>
        </DialogHeader>

        <FieldGroup className="space-y-4 pt-2">
          <Field>
            <Label htmlFor="insurance-name" className="mb-1.5 block text-sm font-medium text-slate-600">
              보험명
            </Label>
            <Input
              id="insurance-name"
              name="insuranceName"
              defaultValue="종합보험"
              className="h-[42px] rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-700 shadow-sm transition-colors placeholder:text-slate-400 focus-visible:border-sky-500 focus-visible:ring-2 focus-visible:ring-sky-100"
            />
          </Field>

          <Field>
            <Label htmlFor="insurance-user" className="mb-1.5 block text-sm font-medium text-slate-600">
              고객명
            </Label>
            <Input
              id="insurance-user"
              name="customerName"
              defaultValue="김민수"
              className="h-[42px] rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-700 shadow-sm transition-colors placeholder:text-slate-400 focus-visible:border-sky-500 focus-visible:ring-2 focus-visible:ring-sky-100"
            />
          </Field>
        </FieldGroup>

        <DialogFooter className="mt-4 border-t border-slate-200 bg-white p-5">
          <DialogClose render={<Button variant="outline" className="h-[42px] rounded-xl border-slate-200 bg-white text-slate-700 hover:bg-slate-50">취소</Button>} />
          <Button type="submit" className="h-[42px] rounded-xl bg-black text-white" onClick={onClose}>
            확인
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
