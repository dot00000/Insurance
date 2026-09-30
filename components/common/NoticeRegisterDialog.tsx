"use client";

import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { CommonCalendar } from "@/components/common/CommonCalendar";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

export type NoticeDraft = {
  date: string;
  title: string;
  content: string;
  attachmentName: string | null;
};

type NoticeRegisterDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (notice: NoticeDraft) => void;
};

function getToday() {
  const today = new Date();
  today.setMinutes(today.getMinutes() - today.getTimezoneOffset());
  return today.toISOString().slice(0, 10);
}

function formatLocalDate(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export default function NoticeRegisterDialog({
  open,
  onOpenChange,
  onSubmit,
}: NoticeRegisterDialogProps) {
  const [date, setDate] = useState(getToday);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [attachment, setAttachment] = useState<File | null>(null);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    onSubmit({ date, title: title.trim(), content: content.trim(), attachmentName: attachment?.name ?? null });
    setTitle("");
    setContent("");
    setAttachment(null);
    setDate(getToday());
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[95vh] gap-0 overflow-y-auto rounded-2xl border border-slate-200 bg-white p-5 shadow-xl sm:max-w-5xl">
        <DialogHeader className="space-y-2 border-b border-slate-300 px-3 pb-4">
          <DialogTitle className="text-lg font-semibold text-slate-900">
            공지사항 등록
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="px-3">
            <div className="grid gap-3 border-b border-slate-200 py-4 sm:grid-cols-[180px_minmax(0,1fr)] sm:items-center">
              <span className="text-sm font-medium text-slate-800">
                등록일 <span className="text-red-600">*</span>
              </span>
              <CommonCalendar
                initialDate={new Date(`${date}T00:00:00`)}
                label="등록일 선택"
                showAge={false}
                wrapperClassName="w-full"
                buttonWidthClassName="w-full max-w-sm"
                buttonClassName="rounded-sm shadow-none"
                onDateChange={(selectedDate) => setDate(formatLocalDate(selectedDate))}
              />
            </div>

            <div className="grid gap-3 border-b border-slate-200 py-4 sm:grid-cols-[180px_minmax(0,1fr)] sm:items-center">
              <label htmlFor="notice-title" className="text-sm font-medium text-slate-800">
                제목 <span className="text-red-600">*</span>
              </label>
              <Input
                id="notice-title"
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                required
                maxLength={120}
                className="h-11 rounded-sm border-slate-300 shadow-none focus-visible:border-sky-500 focus-visible:ring-2 focus-visible:ring-sky-100"
              />
            </div>

            <div className="grid gap-3 border-b border-slate-200 py-4 sm:grid-cols-[180px_minmax(0,1fr)]">
              <label htmlFor="notice-content" className="pt-3 text-sm font-medium text-slate-800">
                내용 <span className="text-red-600">*</span>
              </label>
              <textarea
                id="notice-content"
                value={content}
                onChange={(event) => setContent(event.target.value)}
                required
                rows={12}
                className="min-h-64 w-full resize-y rounded-sm border border-slate-300 bg-white p-3 text-sm text-slate-900 outline-none transition-colors placeholder:text-slate-400 focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
              />
            </div>

            <div className="grid gap-3 py-4 sm:grid-cols-[180px_minmax(0,1fr)] sm:items-center">
              <label htmlFor="notice-attachment" className="text-sm font-medium text-slate-800">
                첨부 이미지
              </label>
              <div className="flex flex-wrap items-center gap-3">
                <Input
                  id="notice-attachment"
                  type="file"
                  accept="image/*"
                  onChange={(event) => setAttachment(event.target.files?.[0] ?? null)}
                  className="h-11 max-w-md cursor-pointer rounded-sm border-slate-300 text-center file:mr-4 file:rounded-sm file:border-0 file:bg-[#2196F3] file:px-4 file: py-1 file:h-8 file:text-sm file:font-medium file:text-white"
                />
              </div>
            </div>
          </div>

          <DialogFooter className="mt-2 flex-row justify-between border-t border-slate-200 pt-4">
            <DialogClose
              render={
                <Button
                  type="button"
                  variant="outline"
                  className="h-11 min-w-28 rounded-sm border-slate-400 text-slate-900 shadow-none hover:bg-[#2196F3] hover:text-white"
                >
                  취소
                </Button>
              }
            />
            <Button
              type="submit"
              className="h-11 min-w-28 rounded-sm border border-slate-400 bg-white text-slate-900 shadow-none hover:bg-[#2196F3] hover:text-white"
            >
              등록
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}