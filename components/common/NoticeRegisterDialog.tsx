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
import { getSupabaseClient } from "@/utils/supabase/client";

type NoticeRegisterDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreated: () => void;
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
  onCreated,
}: NoticeRegisterDialogProps) {
  const [date, setDate] = useState(getToday);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [attachment, setAttachment] = useState<File | null>(null);
  const [fileInputKey, setFileInputKey] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const supabase = getSupabaseClient();
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) {
        setSubmitError("공지사항을 등록하려면 로그인해 주세요.");
        return;
      }

      let attachmentPath: string | null = null;
      if (attachment) {
        const extension = attachment.name.split(".").pop()?.toLowerCase();
        const safeExtension = extension?.match(/^[a-z0-9]{1,10}$/) ? extension : "bin";
        const path = `${user.id}/${crypto.randomUUID()}.${safeExtension}`;
        const { error: uploadError } = await supabase.storage
          .from("notices")
          .upload(path, attachment, { contentType: attachment.type || "application/octet-stream" });
        if (uploadError) {
          setSubmitError(uploadError.statusCode === "404"
            ? "첨부파일 버킷(notices)을 찾을 수 없습니다. Supabase Storage에서 버킷 이름을 확인해 주세요."
            : `첨부파일 업로드에 실패했습니다: ${uploadError.message}`);
          return;
        }
        attachmentPath = path;
      }

      const { error: insertError } = await supabase.from("notices").insert({
        notice_date: date,
        title: title.trim(),
        content: content.trim(),
        attachment_path: attachmentPath,
        author_id: user.id,
      });
      if (insertError) {
        setSubmitError("공지사항 저장에 실패했습니다. 테이블 컬럼과 등록 정책을 확인해 주세요.");
        return;
      }

      setTitle("");
      setContent("");
      setAttachment(null);
      setFileInputKey((current) => current + 1);
      setDate(getToday());
      onCreated();
    } catch {
      setSubmitError("공지사항 등록 요청을 처리하지 못했습니다. 다시 시도해 주세요.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={(nextOpen) => {
      if (!isSubmitting) onOpenChange(nextOpen);
    }}>
      <DialogContent className="max-h-[95vh] gap-0 overflow-y-auto rounded-2xl border border-slate-200 bg-white p-5 shadow-xl sm:max-w-5xl">
        <DialogHeader className="space-y-2 border-b border-slate-300 px-3 pb-4">
          <DialogTitle className="text-lg font-semibold text-slate-900">
            공지사항 등록
          </DialogTitle>
        </DialogHeader>

        <form aria-busy={isSubmitting} onSubmit={handleSubmit}>
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
                첨부파일
              </label>
              <div className="flex flex-wrap items-center gap-3">
                <Input
                  key={fileInputKey}
                  id="notice-attachment"
                  type="file"
                  onChange={(event) => setAttachment(event.target.files?.[0] ?? null)}
                  className="h-11 max-w-md cursor-pointer rounded-sm border-slate-300 text-center file:mr-4 file:rounded-sm file:border-0 file:bg-[#2196F3] file:px-4 file: py-1 file:h-8 file:text-sm file:font-medium file:text-white"
                />
              </div>
            </div>
          </div>

          {submitError && <p role="alert" className="px-3 text-sm text-red-600">{submitError}</p>}

          <DialogFooter className="mt-2 flex-row justify-between border-t border-slate-200 pt-4">
            <DialogClose
              render={
                <Button
                  type="button"
                  disabled={isSubmitting}
                  variant="outline"
                  className="h-11 min-w-28 rounded-sm border-slate-400 text-slate-900 shadow-none hover:bg-[#2196F3] hover:text-white"
                >
                  취소
                </Button>
              }
            />
            <Button
              type="submit"
              disabled={isSubmitting}
              className="h-11 min-w-28 rounded-sm border border-slate-400 bg-white text-slate-900 shadow-none hover:bg-[#2196F3] hover:text-white"
            >
              {isSubmitting ? "등록 중…" : "등록"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
