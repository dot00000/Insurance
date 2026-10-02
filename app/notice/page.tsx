"use client";

import { CommonPagination } from "@/components/common/CommonPagination";
import CommonTable from "@/components/common/CommonTable";
import { useEffect, useState } from "react";
import NoticeDialog from "@/components/common/NoticeDialog";
import NoticeRegisterDialog from "@/components/common/NoticeRegisterDialog";
import NoticeEditDialog from "@/components/common/NoticeEditDialog";
import { CustomButton } from "@/components/common/CustomButton";
import { getSupabaseClient } from "@/utils/supabase/client";

const rowsPerPage = 10;
type NoticeRecord = {
  id: number;
  notice_date: string;
  title: string;
  content: string;
  attachment_path: string | null;
  author_id: string | null;
  username: string | null;
};

export default function Page() {
  const [pageNo, setPageNo] = useState(1);
  const [noticeItems, setNoticeItems] = useState<NoticeRecord[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [listError, setListError] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState(0);
  const [selectedNotice, setSelectedNotice] = useState<NoticeRecord | null>(null);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [editingNotice, setEditingNotice] = useState<NoticeRecord | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  useEffect(() => {
    const supabase = getSupabaseClient();
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsLoggedIn(Boolean(session));
      setCurrentUserId(session?.user.id ?? null);
    });
    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    let active = true;
    async function loadNotices() {
      try {
        const supabase = getSupabaseClient();
        const { data, count, error } = await supabase
          .from("notices")
          .select("id, notice_date, title, content, attachment_path, author_id", { count: "exact" })
          .order("id", { ascending: false })
          .range((pageNo - 1) * rowsPerPage, pageNo * rowsPerPage - 1);
        if (!active) return;
        if (error) {
          setListError("공지사항을 불러오지 못했습니다.");
          return;
        }
        const authorIds = [...new Set((data ?? []).map((notice) => notice.author_id).filter((id): id is string => Boolean(id)))];
        let usernames = new Map<string, string>();
        if (authorIds.length > 0) {
          const { data: profiles, error: profileError } = await supabase
            .from("profiles")
            .select("id, username")
            .in("id", authorIds);
          if (!active) return;
          if (profileError) {
            setListError("작성자 정보를 불러오지 못했습니다.");
            return;
          }
          usernames = new Map((profiles ?? []).map((profile) => [profile.id, profile.username]));
        }
        setNoticeItems((data ?? []).map((notice) => ({
          ...notice,
          username: notice.author_id ? usernames.get(notice.author_id) ?? null : null,
        })));
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
    { key: "username", label: "작성자", headerClassName: "w-56" },
    { key: "notice_date", label: "등록일", headerClassName: "w-36" },
  ];

  const rows = noticeItems.map(({ id, title, username, notice_date }) => ({
    id,
    title,
    username: username ?? "-",
    notice_date,
  }));
  const totalPages = Math.ceil(totalCount / rowsPerPage);

  return (
    <div className="space-y-4 p-6">
      {isLoggedIn && <div className="flex justify-end">
        <CustomButton
          type="button"
          onClick={() => setIsRegisterOpen(true)}
        >
          공지사항 등록
        </CustomButton>
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
          canEdit={Boolean(currentUserId && selectedNotice.author_id === currentUserId)}
          onEdit={() => {
            setEditingNotice(selectedNotice);
            setSelectedNotice(null);
          }}
          description="보험 관련 공지사항"
          details={[
            { label: "번호", value: selectedNotice.id },
            { label: "등록일", value: selectedNotice.notice_date },
            { label: "작성자", value: selectedNotice.username ?? "-" },
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
      {editingNotice && (
        <NoticeEditDialog
          notice={editingNotice}
          open={true}
          onOpenChange={(open) => { if (!open) setEditingNotice(null); }}
          onUpdated={() => {
            setReloadKey((current) => current + 1);
            setEditingNotice(null);
          }}
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
