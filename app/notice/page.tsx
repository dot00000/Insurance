"use client";

import noticeData from "@/data/notice.json";
import { CommonPagination } from "@/components/common/CommonPagination";
import CommonTable from "@/components/common/CommonTable";
import { useState } from "react";
import NoticeDialog from "@/components/common/NoticeDialog";
import NoticeRegisterDialog, { type NoticeDraft } from "@/components/common/NoticeRegisterDialog";
import { Button } from "@/components/ui/button";

const notices = noticeData.response.body.items.item;
const rowsPerPage = 10;
type NoticeRecord = (typeof notices)[number] & { attachmentName?: string | null };

export default function Page() {
  const [pageNo, setPageNo] = useState(1);
  const [noticeItems, setNoticeItems] = useState<NoticeRecord[]>(notices);
  const [selectedNotice, setSelectedNotice] = useState<NoticeRecord | null>(null);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);

  function registerNotice(draft: NoticeDraft) {
    const newNotice: NoticeRecord = {
      id: noticeItems.reduce((maxId, notice) => Math.max(maxId, notice.id), 0) + 1,
      title: draft.title,
      author: "관리자",
      date: draft.date,
      content: draft.content,
      attachmentName: draft.attachmentName,
    };

    setNoticeItems((current) => [newNotice, ...current]);
    setPageNo(1);
    setIsRegisterOpen(false);
  }

  const columns = [
    { key: "id", label: "번호", headerClassName: "w-20" },
    { key: "title", label: "제목" },
    { key: "author", label: "작성자", headerClassName: "w-40" },
    { key: "date", label: "등록일", headerClassName: "w-36" },
  ];

  const rows = noticeItems.map(({ id, title, author, date }) => ({
    id,
    title,
    author,
    date,
  }));
  const totalPages = Math.ceil(rows.length / rowsPerPage);
  const visibleRows = rows.slice((pageNo - 1) * rowsPerPage, pageNo * rowsPerPage);

  return (
    <div className="space-y-4 p-6">
      <div className="flex justify-end">
        <Button
          type="button"
          variant="outline"
          className="h-11 rounded-sm border-slate-400 px-6 text-sm font-medium text-slate-900 shadow-none hover:bg-[#2196F3] hover:text-white"
          onClick={() => setIsRegisterOpen(true)}
        >
          공지사항 등록
        </Button>
      </div>
      <CommonTable
        name="공지사항"
        columns={columns}
        rows={visibleRows}
        onRowClick={(row) => {
          const notice = noticeItems.find((item) => item.id === Number(row.id));
          if (notice) setSelectedNotice(notice);
        }}
      />
      {selectedNotice && (
        <NoticeDialog
          title={selectedNotice.title}
          description="보험 관련 공지사항"
          details={[
            { label: "번호", value: selectedNotice.id },
            { label: "작성자", value: selectedNotice.author },
            { label: "등록일", value: selectedNotice.date },
            { label: "내용", value: selectedNotice.content },
            { label: "첨부파일", value: selectedNotice.attachmentName ?? "첨부 없음" },
          ]}
          onClose={() => setSelectedNotice(null)}
        />
      )}
      <NoticeRegisterDialog
        open={isRegisterOpen}
        onOpenChange={setIsRegisterOpen}
        onSubmit={registerNotice}
      />
      <CommonPagination
        currentPage={pageNo}
        onPageChange={setPageNo}
        totalPages={totalPages}
      />
    </div>
  );
}
