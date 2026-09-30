"use client";

import { Button } from "@/components/ui/button";
import CommonDialog from "@/components/common/CommonDialog";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { getSupabaseClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

type MemberValues = { name: string; id: string; phone: string; email: string };
type RecoveryValues = { email: string };

function metadataString(value: unknown): string {
  return typeof value === "string" ? value : "";
}

function formatPhone(value: string): string {
  const digits = value.replace(/\D/g, "");
  if (digits.length === 11 && digits.startsWith("010")) {
    return `${digits.slice(0, 3)}-${digits.slice(3, 7)}-${digits.slice(7)}`;
  }
  return value;
}

export default function Page() {
  const router = useRouter();
  const { register, handleSubmit, reset, getValues, formState: { errors, isSubmitting: editSubmitting } } = useForm<MemberValues>({
    defaultValues: { name: "", id: "", phone: "", email: "" },
    mode: "onTouched",
  });
  const { register: registerRecovery, handleSubmit: submitRecovery, reset: resetRecovery, formState: { errors: recoveryErrors, isSubmitting: recoverySubmitting } } = useForm<RecoveryValues>({
    defaultValues: { email: "" },
  });
  const [memberError, setMemberError] = useState<string | null>(null);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [editError, setEditError] = useState<string | null>(null);
  const [editMessage, setEditMessage] = useState<string | null>(null);
  const [showRecoveryDialog, setShowRecoveryDialog] = useState(false);
  const [recoveryError, setRecoveryError] = useState<string | null>(null);
  const [recoverySent, setRecoverySent] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deleteSubmitting, setDeleteSubmitting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    async function loadMember() {
      try {
        const { data: { user }, error } = await getSupabaseClient().auth.getUser();
        if (!active) return;
        if (error || !user) {
          setMemberError(user ? "회원 정보를 불러오지 못했습니다." : "로그인 후 회원 정보를 확인할 수 있습니다.");
          return;
        }

        const metadata = user.user_metadata;
        const userEmail = user.email ?? "";
        reset({
          name: metadataString(metadata?.name),
          id: metadataString(metadata?.id) || userEmail,
          phone: formatPhone(metadataString(metadata?.phone)),
          email: userEmail,
        });
        setMemberError(null);
      } catch {
        if (active) setMemberError("회원 정보를 불러오지 못했습니다.");
      }
    }

    void loadMember();
    return () => { active = false; };
  }, [reset]);

  async function handleEditMember(values: MemberValues) {
    const nextName = values.name.trim();
    const nextId = values.id.trim();
    const nextEmail = values.email.trim();
    const digits = values.phone.replace(/\D/g, "");
    setEditError(null);
    try {
      const supabase = getSupabaseClient();
      const { data: { user: currentUser }, error: userError } = await supabase.auth.getUser();
      if (userError || !currentUser) {
        setEditError("로그인 후 다시 시도해 주세요.");
        return;
      }

      const emailChanged = nextEmail !== currentUser.email;
      const { error: updateError } = await supabase.auth.updateUser({
        ...(emailChanged ? { email: nextEmail } : {}),
        data: { name: nextName, id: nextId, phone: digits },
      });
      if (updateError) {
        setEditError("회원 정보를 저장하지 못했습니다. 입력값을 확인하고 다시 시도해 주세요.");
        return;
      }

      const { data: { user: savedUser }, error: reloadError } = await supabase.auth.getUser();
      if (reloadError || !savedUser) {
        setEditError("저장했지만 회원 정보를 다시 불러오지 못했습니다. 새로고침해 주세요.");
        return;
      }
      const savedInfo = {
        name: metadataString(savedUser.user_metadata?.name),
        id: metadataString(savedUser.user_metadata?.id) || savedUser.email || "",
        phone: formatPhone(metadataString(savedUser.user_metadata?.phone)),
      };
      reset({ ...savedInfo, email: savedUser.email ?? "" });
      setShowEditDialog(false);
      setEditMessage(emailChanged
        ? "회원 정보가 저장되었습니다. 새 이메일 주소의 인증 메일을 확인해 주세요."
        : "회원 정보가 저장되었습니다.");
    } catch {
      setEditError("회원 정보 저장 요청을 처리하지 못했습니다. 다시 시도해 주세요.");
    }
  }

  async function handleRecovery(values: RecoveryValues) {
    const recoveryEmail = values.email.trim();
    setRecoveryError(null);

    try {
      const { error } = await getSupabaseClient().auth.resetPasswordForEmail(recoveryEmail, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      if (error) {
        setRecoveryError("재설정 메일을 보내지 못했습니다. 잠시 후 다시 시도해 주세요.");
        return;
      }
      setRecoverySent(true);
    } catch {
      setRecoveryError("재설정 요청을 처리하지 못했습니다. 연결 상태를 확인해 주세요.");
    }
  }

  async function handleDeleteAccount() {
    if (deleteSubmitting) return;
    setDeleteSubmitting(true);
    setDeleteError(null);

    try {
      const supabase = getSupabaseClient();
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      if (sessionError || !session) {
        setDeleteError("로그인 후 다시 시도해 주세요.");
        return;
      }

      const response = await fetch("/api/account", {
        method: "DELETE",
        headers: { authorization: `Bearer ${session.access_token}` },
      });
      if (!response.ok) {
        const result = await response.json() as { message?: string };
        setDeleteError(result.message ?? "회원탈퇴를 처리하지 못했습니다.");
        return;
      }

      await supabase.auth.signOut({ scope: "local" });
      router.replace("/login");
    } catch {
      setDeleteError("회원탈퇴 요청을 처리하지 못했습니다. 연결 상태를 확인해 주세요.");
    } finally {
      setDeleteSubmitting(false);
    }
  }

  return (
    <main className="p-6">
      <section className="w-full max-w-5xl">
        <h1 className="border-b border-slate-300 pb-5 text-lg font-semibold text-slate-900">
          회원 정보
        </h1>
        {memberError && <p role="alert" className="py-3 text-sm text-red-600">{memberError}</p>}
        {editMessage && <p role="status" className="py-3 text-sm text-green-700">{editMessage}</p>}

        <form noValidate onSubmit={handleSubmit(() => { setEditError(null); setShowEditDialog(true); })}>
          <div className="divide-y divide-slate-200">
          {([
            { label: "이름", field: "name", id: "member-name", rules: { validate: (value: string) => Boolean(value.trim()) || "이름을 입력해 주세요." } },
            { label: "아이디", field: "id", id: "member-id", rules: { validate: (value: string) => Boolean(value.trim()) || "아이디를 입력해 주세요." } },
          ] as const).map((row) => (
            <div
              key={row.id}
              className="grid gap-3 py-3 sm:grid-cols-[190px_minmax(0,1fr)] sm:items-center"
            >
              <label
                htmlFor={row.id}
                className="text-sm font-medium text-slate-800"
              >
                {row.label}
              </label>

              <div>
                <Input id={row.id} {...register(row.field, row.rules)} aria-invalid={Boolean(errors[row.field])} className="h-11 w-lg !bg-white rounded-sm border-slate-300 px-4 text-sm text-slate-900 shadow-none focus-visible:border-sky-500 focus-visible:ring-2 focus-visible:ring-sky-100" />
                {errors[row.field] && <p role="alert" className="mt-1 text-sm text-red-600">{errors[row.field]?.message}</p>}
              </div>
            </div>
          ))}

          <div className="grid gap-3 py-3 sm:grid-cols-[190px_minmax(0,1fr)] sm:items-center">
            <span className="text-sm font-medium text-slate-800">비밀번호</span>
            <div>
              <Button
                type="button"
                variant="outline"
                className="h-11 rounded-sm border-slate-400 px-6 text-sm font-medium text-slate-900 shadow-none hover:bg-[#2196F3] hover:text-white"
                onClick={() => {
                  resetRecovery({ email: getValues("email") });
                  setShowRecoveryDialog(true);
                }}
              >
                비밀번호 변경
              </Button>
            </div>
          </div>

          <div className="grid gap-3 py-3 sm:grid-cols-[190px_minmax(0,1fr)] sm:items-center">
            <label htmlFor="member-phone" className="text-sm font-medium text-slate-800">
              휴대폰 번호
            </label>
            <div className="flex flex-wrap items-center gap-2.5">
              <Input
                id="member-phone"
                type="tel"
                {...register("phone", { validate: (value) => /^010\d{8}$/.test(value.replace(/\D/g, "")) || "010으로 시작하는 휴대폰 번호 11자리를 입력해 주세요." })}
                aria-invalid={Boolean(errors.phone)}
                autoComplete="tel"
                className="h-11 w-lg !bg-white rounded-sm border-slate-300 px-4 text-sm text-slate-900 shadow-none focus-visible:border-sky-500 focus-visible:ring-2 focus-visible:ring-sky-100"
              />
              {errors.phone && <p role="alert" className="text-sm text-red-600">{errors.phone.message}</p>}
            </div>
          </div>

          <div className="grid gap-3 py-3 sm:grid-cols-[190px_minmax(0,1fr)] sm:items-center">
            <label
              htmlFor="member-email"
              className="text-sm font-medium text-slate-800"
            >
              이메일
            </label>
            <Input
              id="member-email"
              type="email"
              {...register("email", { required: "이메일을 입력해 주세요.", pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: "올바른 이메일 주소를 입력해 주세요." } })}
              aria-invalid={Boolean(errors.email)}
              autoComplete="email"
              className="h-11 w-lg !bg-white rounded-sm border-slate-300 px-4 text-sm text-slate-900 shadow-none focus-visible:border-sky-500 focus-visible:ring-2 focus-visible:ring-sky-100"
            />
            {errors.email && <p role="alert" className="text-sm text-red-600">{errors.email.message}</p>}
          </div>
        </div>
        <div className="flex items-center justify-between gap-3 border-t border-slate-200 pt-8">
          <Button
            type="button"
            variant="outline"
            className="h-11 rounded-sm border-slate-400 px-6 text-sm font-medium text-slate-900 shadow-none hover:bg-[#2196F3] hover:text-white"
            onClick={() => setShowDeleteDialog(true)}
          >
            회원탈퇴
          </Button>
          <Button
            type="submit"
            variant="outline"
            className="h-11 rounded-sm border-slate-400 px-6 text-sm font-medium text-slate-900 shadow-none hover:bg-[#2196F3] hover:text-white"
          >
            수정
          </Button>
        </div>
        </form>
      </section>
      <Dialog open={showEditDialog} onOpenChange={(open) => {
        if (editSubmitting) return;
        setShowEditDialog(open);
        if (!open) setEditError(null);
      }}>
        <DialogContent className="sm:max-w-lg rounded-2xl border border-slate-200 bg-white p-5 shadow-xl">
          <DialogHeader><DialogTitle className="px-3 text-lg font-semibold text-slate-900">회원정보 수정</DialogTitle></DialogHeader>
          <div className="px-3 py-2 text-sm leading-6 text-slate-700">
            <p>회원 정보를 수정하시겠습니까?</p>
            {editError && <p role="alert" className="mt-2 text-red-600">{editError}</p>}
          </div>
          <DialogFooter className="mt-2 border-t border-slate-200 pt-4">
            <Button type="button" variant="outline" disabled={editSubmitting} onClick={() => setShowEditDialog(false)}>취소</Button>
            <Button type="button" disabled={editSubmitting} onClick={() => { void handleSubmit(handleEditMember)(); }}>
              {editSubmitting ? "저장 중…" : "확인"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <Dialog open={showDeleteDialog} onOpenChange={(open) => {
        if (deleteSubmitting) return;
        setShowDeleteDialog(open);
        if (!open) setDeleteError(null);
      }}>
        <DialogContent className="sm:max-w-lg rounded-2xl border border-slate-200 bg-white p-5 shadow-xl">
          <DialogHeader>
            <DialogTitle className="px-3 text-lg font-semibold text-slate-900">회원탈퇴</DialogTitle>
          </DialogHeader>
          <div className="px-3 py-2 text-sm leading-6 text-slate-700">
            <p>회원정보는 복구되지 않습니다. 정말로 탈퇴하시겠습니까?</p>
            {deleteError && <p role="alert" className="mt-2 text-red-600">{deleteError}</p>}
          </div>
          <DialogFooter className="mt-2 border-t border-slate-200 pt-4">
            <Button type="button" variant="outline" disabled={deleteSubmitting} onClick={() => setShowDeleteDialog(false)}>취소</Button>
            <Button type="button" disabled={deleteSubmitting} onClick={() => { void handleDeleteAccount(); }}>
              {deleteSubmitting ? "처리 중…" : "탈퇴"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      {showRecoveryDialog && (
        <CommonDialog
          title="비밀번호 찾기"
          description="가입한 이메일로 비밀번호 재설정 링크를 보내드립니다."
          onClose={() => {
            setShowRecoveryDialog(false);
            setRecoveryError(null);
            setRecoverySent(false);
          }}
          content={recoverySent ? (
            <p role="status">계정이 있다면 재설정 메일이 발송됩니다. 받은편지함을 확인해 주세요.</p>
          ) : (
            <form className="space-y-3" onSubmit={submitRecovery(handleRecovery)}>
              <label className="block font-medium" htmlFor="recovery-email">이메일</label>
              <input
                autoComplete="email"
                className="h-10 w-[320px] rounded-lg border border-slate-200 px-3 outline-none focus:border-[#2196F3]"
                id="recovery-email"
                {...registerRecovery("email", { required: "이메일을 입력해 주세요.", pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: "올바른 이메일 주소를 입력해 주세요." } })}
                aria-invalid={Boolean(recoveryErrors.email)}
                type="email"
              />
              {recoveryErrors.email && <p role="alert" className="text-red-600">{recoveryErrors.email.message}</p>}
              {recoveryError && <p role="alert" className="text-red-600">{recoveryError}</p>}
              <button className="rounded-lg bg-[#2196F3] ml-4 px-4 py-2 font-semibold text-white disabled:opacity-60" disabled={recoverySubmitting} type="submit">
                {recoverySubmitting ? "전송 중…" : "메일 전송하기"}
              </button>
            </form>
          )}
        />
      )}
    </main>
  );
}
