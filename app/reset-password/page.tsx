"use client";

import { useEffect, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { getSupabaseClient } from "@/utils/supabase/client";
import { passwordSchema } from "@/utils/signupValidation";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [recoveryReady, setRecoveryReady] = useState(false);
  const [checkingLink, setCheckingLink] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [complete, setComplete] = useState(false);

  useEffect(() => {
    const supabase = getSupabaseClient();
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "PASSWORD_RECOVERY" && session) {
        setRecoveryReady(true);
        setCheckingLink(false);
      } else if (event === "INITIAL_SESSION") {
        setCheckingLink(false);
      }
    });
    return () => subscription.unsubscribe();
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!recoveryReady || submitting) return;

    const formData = new FormData(event.currentTarget);
    const password = String(formData.get("password") ?? "");
    const confirm = String(formData.get("password-confirm") ?? "");
    const validation = passwordSchema.safeParse(password);
    if (!validation.success) {
      setError(validation.error.issues[0]?.message ?? "비밀번호를 확인해 주세요.");
      return;
    }
    if (password !== confirm) {
      setError("비밀번호가 일치하지 않습니다.");
      return;
    }

    setSubmitting(true);
    setError(null);
    try {
      const supabase = getSupabaseClient();
      const { error: updateError } = await supabase.auth.updateUser({ password });
      if (updateError) {
        setError("비밀번호를 변경하지 못했습니다. 재설정 링크를 다시 요청해 주세요.");
        return;
      }
      await supabase.auth.signOut({ scope: "local" });
      setComplete(true);
    } catch {
      setError("비밀번호 변경 요청을 처리하지 못했습니다. 다시 시도해 주세요.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="flex min-h-svh items-center justify-center bg-[#f5f7fa] px-4 py-8">
      <section className="w-full max-w-[460px] rounded-lg border border-[#e7e9ee] bg-white p-6 shadow-sm">
        <h1 className="mb-6 text-center text-[28px] font-bold text-[#202735]">비밀번호 재설정</h1>
        {checkingLink ? (
          <p role="status" className="text-sm text-[#697382]">재설정 링크를 확인하는 중입니다…</p>
        ) : complete ? (
          <div className="space-y-4">
            <p role="status" className="text-sm text-[#21835a]">비밀번호가 변경되었습니다. 새 비밀번호로 로그인해 주세요.</p>
            <button className="h-11 w-full rounded-lg bg-[#2196F3] font-bold text-white" onClick={() => router.replace("/login")} type="button">로그인으로 이동</button>
          </div>
        ) : recoveryReady ? (
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="mb-1 block text-sm font-medium" htmlFor="new-password">새 비밀번호</label>
              <input autoComplete="new-password" className="h-10 w-full rounded-lg border border-[#e8ebf0] px-3" id="new-password" name="password" required type="password" />
              <p className="mt-1 text-xs text-[#697382]">8~64자, 영문 대문자·소문자·숫자·특수문자 각 1자 이상</p>
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium" htmlFor="password-confirm">비밀번호 확인</label>
              <input autoComplete="new-password" className="h-10 w-full rounded-lg border border-[#e8ebf0] px-3" id="password-confirm" name="password-confirm" required type="password" />
            </div>
            {error && <p role="alert" className="text-sm text-red-600">{error}</p>}
            <button className="h-11 w-full rounded-lg bg-[#2196F3] font-bold text-white disabled:opacity-60" disabled={submitting} type="submit">{submitting ? "변경 중…" : "비밀번호 변경"}</button>
          </form>
        ) : (
          <div className="space-y-4">
            <p role="alert" className="text-sm text-red-600">재설정 링크가 유효하지 않거나 만료되었습니다. 로그인 화면에서 다시 요청해 주세요.</p>
            <button className="h-11 w-full rounded-lg bg-[#2196F3] font-bold text-white" onClick={() => router.replace("/login")} type="button">로그인으로 이동</button>
          </div>
        )}
      </section>
    </main>
  );
}
