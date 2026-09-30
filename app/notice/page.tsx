"use client";

import { CommonPagination } from "@/components/common/CommonPagination";
import CommonTable from "@/components/common/CommonTable";
import { useEffect, useState } from "react";
import NoticeDialog from "@/components/common/NoticeDialog";
import NoticeRegisterDialog from "@/components/common/NoticeRegisterDialog";
import { Button } from "@/components/ui/button";
import { getSupabaseClient } from "@/utils/supabase/client";

const rowsPerPage = 10;
type NoticeRecord = {
  id: number;
  notice_date: string;
  title: string;
  content: string;
  attachment_path: string | null;
};

export default function Page() {
  const [pageNo, setPageNo] = useState(1);
  const [noticeItems, setNoticeItems] = useState<NoticeRecord[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [listError, setListError] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState(0);
  const [selectedNotice, setSelectedNotice] = useState<NoticeRecord | null>(null);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const { data: { subscription } } = getSupabaseClient().auth.onAuthStateChange((_event, session) => {
      setIsLoggedIn(Boolean(session));
    });
    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    let active = true;
    async function loadNotices() {
      try {
        const { data, count, error } = await getSupabaseClient()
          .from("notices")
          .select("id, notice_date, title, content, attachment_path", { count: "exact" })
          .order("id", { ascending: false })
          .range((pageNo - 1) * rowsPerPage, pageNo * rowsPerPage - 1);
        if (!active) return;
        if (error) {
          setListError("공지사항을 불러오지 못했습니다.");
          return;
        }
        setNoticeItems(data ?? []);
        setTotalCount(count ?? 0);
        setListError(null);
      } catch {
        if (active) setListError("공지사항을 불러오지 못했습니다.");
      }
    }
    void loadNotices();
    return () => { active = false; };
  }, [pageNo, reloadKey]);

  const columns = [
    { key: "id", label: "번호", headerClassName: "w-20" },
    { key: "title", label: "제목" },
    { key: "notice_date", label: "등록일", headerClassName: "w-36" },
  ];

  const rows = noticeItems.map(({ id, title, notice_date }) => ({
    id,
    title,
    notice_date,
  }));
  const totalPages = Math.ceil(totalCount / rowsPerPage);

  return (
    <div className="space-y-4 p-6">
      {isLoggedIn && <div className="flex justify-end">
        <Button
          type="button"
          variant="outline"
          className="h-11 rounded-sm border-slate-400 px-6 text-sm font-medium text-slate-900 shadow-none hover:bg-[#2196F3] hover:text-white"
          onClick={() => setIsRegisterOpen(true)}
        >
          공지사항 등록
        </Button>
      </div>}
      {listError && <p role="alert" className="text-sm text-red-600">{listError}</p>}
      <CommonTable
        name="공지사항"
        columns={columns}
        rows={rows}
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
            { label: "등록일", value: selectedNotice.notice_date },
            { label: "내용", value: selectedNotice.content },
            { label: "첨부파일", value: selectedNotice.attachment_path ? (
              <a
                className="text-[#2196F3] underline"
                href={getSupabaseClient().storage.from("notices").getPublicUrl(selectedNotice.attachment_path).data.publicUrl}
                rel="noopener noreferrer"
                target="_blank"
              >
                첨부파일 열기
              </a>
            ) : "첨부 없음" },
          ]}
          onClose={() => setSelectedNotice(null)}
        />
      )}
      {isLoggedIn && <NoticeRegisterDialog
        open={isRegisterOpen}
        onOpenChange={setIsRegisterOpen}
        onCreated={() => {
          setPageNo(1);
          setReloadKey((current) => current + 1);
          setIsRegisterOpen(false);
        }}
      />}
      <CommonPagination
        currentPage={pageNo}
        onPageChange={setPageNo}
        totalPages={totalPages}
      />
    </div>
  );
}
