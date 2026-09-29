"use client";

import noticeData from "@/data/notice.json";
import CommonDialog from "@/components/common/CommonDialog";
import { CommonPagination } from "@/components/common/CommonPagination";
import CommonTable from "@/components/common/CommonTable";
import { useState } from "react";
import NoticeDialog from "@/components/common/NoticeDialog";

const notices = noticeData.response.body.items.item;
const rowsPerPage = 10;

export default function Page() {
  const [pageNo, setPageNo] = useState(1);
  const [selectedNotice, setSelectedNotice] = useState<(typeof notices)[number] | null>(null);

  const columns = [
    { key: "id", label: "번호", headerClassName: "w-20" },
    { key: "title", label: "제목" },
    { key: "author", label: "작성자", headerClassName: "w-40" },
    { key: "date", label: "등록일", headerClassName: "w-36" },
  ];

  const rows = notices.map(({ id, title, author, date }) => ({
    id,
    title,
    author,
    date,
  }));
  const totalPages = Math.ceil(rows.length / rowsPerPage);
  const visibleRows = rows.slice((pageNo - 1) * rowsPerPage, pageNo * rowsPerPage);

  return (
    <div className="space-y-4 p-6">
      <CommonTable
        name="공지사항"
        columns={columns}
        rows={visibleRows}
        onRowClick={(row) => {
          const notice = notices.find((item) => item.id === Number(row.id));
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
            { label: "첨부파일", value: selectedNotice.author}
          ]}
          onClose={() => setSelectedNotice(null)}
        />
      )}
      <CommonPagination
        currentPage={pageNo}
        onPageChange={setPageNo}
        totalPages={totalPages}
      />
    </div>
  );
}
