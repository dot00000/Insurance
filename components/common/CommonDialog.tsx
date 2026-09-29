import * as React from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { filterImages } from "@/utils/filterImages";
import type { ReactNode } from "react";

type CommonDialogBaseProps = {
  title?: string;
  description?: string;
  content?: ReactNode;
  details?: { label: string; value: ReactNode }[];
  onClose?: () => void;
};

type CommonDialogProps = CommonDialogBaseProps &
  (
    | {
        actionMode?: "close";
        onConfirm?: never;
        cancelLabel?: never;
        confirmLabel?: never;
      }
    | {
        actionMode: "confirm";
        onConfirm: () => void;
        cancelLabel?: string;
        confirmLabel?: string;
      }
  );

export default function CommonDialog({
  title = "보험 정보",
  description = "선택한 보험 상품의 상세 정보입니다.",
  content,
  details = [],
  actionMode = "close",
  onConfirm,
  cancelLabel = "취소",
  confirmLabel = "확인",
  onClose,
}: CommonDialogProps) {
  const [open, setOpen] = React.useState(true);
  const descriptionImage = filterImages(description);

  const handleOpenChange = (nextOpen: boolean) => {
    setOpen(nextOpen);
    if (!nextOpen) {
      onClose?.();
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-lg rounded-2xl border border-slate-200 bg-white p-5 shadow-xl">
        <DialogHeader className="space-y-2">
          <DialogTitle className="text-lg mb-2 font-semibold text-slate-900 px-3">{title}</DialogTitle>
          {description && (
            <div className="flex items-center gap-3 text-sm text-slate-500 px-3">
              {descriptionImage && (
                <Image
                  src={descriptionImage}
                  alt={`${description} 로고`}
                  width={96}
                  height={48}
                  className="h-8 w-16 object-contain"
                />
              )}
              <p>{description}</p>
            </div>
          )}
        </DialogHeader>

        {content ? (
          <div className="px-3 py-2 text-sm leading-6 text-slate-700">{content}</div>
        ) : (
          <dl className="grid max-h-[60vh] px-3 grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)] gap-x-4 gap-y-3 overflow-y-auto py-2">
            {details.map((detail) => (
              <React.Fragment key={detail.label}>
                <dt className="text-sm text-slate-500">{detail.label}</dt>
                <dd className="break-words text-right text-sm font-medium text-slate-800">
                  {detail.value || "-"}
                </dd>
              </React.Fragment>
            ))}
          </dl>
        )}

        <DialogFooter className="mt-2 border-t border-slate-200 pt-4">
            {actionMode === "confirm" ? (
              <>
                <DialogClose
                  render={
                    <Button
                      variant="outline"
                      className="h-[42px] w-[80px] font-bold rounded-xl border-slate-200 bg-white text-slate-700 hover:bg-[#2196F3] hover:text-white"
                    >
                      {cancelLabel}
                    </Button>
                  }
                />
                <DialogClose render={<Button className="ml-3 h-[42px] w-[80px] rounded-xl border-slate-200 font-bold bg-white text-slate-700 hover:bg-[#2196F3] hover:text-white" onClick={onConfirm}>{confirmLabel}</Button>} />
              </>
            ) : (
              <DialogClose
                render={
                  <Button
                    variant="outline"
                    className="h-[42px] w-[80px] font-bold rounded-xl border-slate-200 bg-white text-slate-700 hover:bg-[#2196F3] hover:text-white"
                  >
                    닫기
                  </Button>
                }
              />
            )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
