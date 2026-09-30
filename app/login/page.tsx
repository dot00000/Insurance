"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useRouter } from "next/navigation";
import { getSupabaseClient } from "@/utils/supabase/client";
import CommonDialog from "@/components/common/CommonDialog";

const rememberedEmailKey = "rememberedLoginEmail";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const emailInput = useRef<HTMLInputElement>(null);
  const rememberInput = useRef<HTMLInputElement>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [showRecoveryDialog, setShowRecoveryDialog] = useState(false);
  const [recoverySubmitting, setRecoverySubmitting] = useState(false);
  const [recoveryError, setRecoveryError] = useState<string | null>(null);
  const [recoverySent, setRecoverySent] = useState(false);
  const [recoveryEmail, setRecoveryEmail] = useState("");
  const router = useRouter();

  useEffect(() => {
    const savedEmail = localStorage.getItem(rememberedEmailKey);
    if (savedEmail) {
      if (emailInput.current) emailInput.current.value = savedEmail;
      if (rememberInput.current) rememberInput.current.checked = true;
    }
  }, []);

  async function handleLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);
    setLoginError(null);
    const formData = new FormData(event.currentTarget);
    const loginEmail = String(formData.get("email") ?? "").trim();

    try {
      const { error } = await getSupabaseClient().auth.signInWithPassword({
        email: loginEmail,
        password: String(formData.get("password") ?? ""),
      });

      if (error) {
        setLoginError("이메일 또는 비밀번호를 확인해 주세요.");
        return;
      }

      if (formData.get("remember")) {
        localStorage.setItem(rememberedEmailKey, loginEmail);
      } else {
        localStorage.removeItem(rememberedEmailKey);
      }
      router.replace("/");
    } catch {
      setLoginError("로그인 요청을 처리하지 못했습니다. 잠시 후 다시 시도해 주세요.");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleRecovery(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (recoverySubmitting) return;

    const formData = new FormData(event.currentTarget);
    const email = String(formData.get("recovery-email") ?? "").trim();
    setRecoverySubmitting(true);
    setRecoveryError(null);

    try {
      const { error } = await getSupabaseClient().auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      if (error) {
        setRecoveryError("재설정 메일을 보내지 못했습니다. 잠시 후 다시 시도해 주세요.");
        return;
      }
      setRecoverySent(true);
    } catch {
      setRecoveryError("재설정 요청을 처리하지 못했습니다. 연결 상태를 확인해 주세요.");
    } finally {
      setRecoverySubmitting(false);
    }
  }

  return (
    <main className="relative flex min-h-svh items-center justify-center overflow-hidden bg-[radial-gradient(ellipse_at_8%_10%,rgba(210,214,255,0.82),transparent_38%),radial-gradient(ellipse_at_96%_94%,rgba(255,245,227,0.82),transparent_40%),#fff] px-4 py-8">
      <section className="w-full max-w-[360px] h-[500px] rounded-[8px] border border-[#e7e9ee] bg-white/80 px-4 pb-4 pt-6 shadow-[0_1px_2px_rgba(20,30,50,0.12)] backdrop-blur-sm">
        <h1 className="mb-10 mt-10 text-center text-[28px] font-bold leading-6 text-[#202735]">
          로그인
        </h1>

        <form className="space-y-1" aria-busy={isSubmitting} onSubmit={handleLogin}>
          <label className="sr-only" htmlFor="login-email">
            이메일
          </label>
          <input
            autoComplete="email"
            ref={emailInput}
            className="h-10 w-full rounded-[8px] border border-[#e8ebf0] bg-white/70 px-3 text-base text-[#202735] outline-none transition placeholder:text-[#a0a8b4] focus:border-[#7ea5f8] focus:ring-2 focus:ring-[#3569e8]/10"
            id="login-email"
            name="email"
            placeholder="이메일"
            required
            type="email"
          />

          <label className="sr-only" htmlFor="login-password">
            비밀번호
          </label>
          <div className="relative">
            <input
              autoComplete="current-password"
              className="mt-2 h-10 w-full rounded-[8px] border border-[#e8ebf0] bg-white/70 px-3 pr-9 text-base text-[#202735] outline-none transition placeholder:text-[#a0a8b4] focus:border-[#7ea5f8] focus:ring-2 focus:ring-[#3569e8]/10"
              id="login-password"
              name="password"
              placeholder="비밀번호"
              required
              type={showPassword ? "text" : "password"}
            />
            <button
              aria-label={showPassword ? "비밀번호 숨기기" : "비밀번호 보기"}
              className="absolute inset-y-0 mt-2 mr-2 right-0 flex w-8 items-center justify-center text-[#a0a8b4] transition hover:text-[#536273]"
              onClick={() => setShowPassword((visible) => !visible)}
              type="button"
            >
              {showPassword ? <EyeOff size={22} /> : <Eye size={22} />}
            </button>
          </div>

          <div className="flex h-10 items-center justify-between text-sm text-[#697382] mb-10">
            <label className="flex items-center gap-1.5">
              <input
                ref={rememberInput}
                className="size-[16px] accent-[#3569e8]"
                name="remember"
                onChange={(event) => {
                  if (!event.target.checked) localStorage.removeItem(rememberedEmailKey);
                }}
                type="checkbox"
              />
              이메일 기억하기
            </label>
            <button className="font-medium font-bold text-[#2196F3] hover:underline" onClick={() => {
              setRecoveryEmail(emailInput.current?.value ?? "");
              setShowRecoveryDialog(true);
            }} type="button">
              비밀번호 찾기
            </button>
          </div>

          <button
            disabled={isSubmitting}
            className="mt-1 h-12 w-full font-bold rounded-[8px] bg-[#2196F3] text-base font-medium text-white shadow-[0_1px_2px_rgba(30,70,170,0.2)] transition hover:bg-[#285bd4] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#3268e8]"
            type="submit"
          >
            {isSubmitting ? "로그인 중…" : "로그인"}
          </button>
          {loginError && <p role="alert" className="mt-3 text-sm text-red-600">{loginError}</p>}
        </form>

        <p className="py-18 text-center text-sm text-[#697382]">
          회원 가입을 원하시나요?{" "}
          <button className="font-medium text-[#2196F3] hover:underline" onClick={() => router.push("/signup")} type="button" >
            회원가입
          </button>
        </p>
      </section>
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
            <form className="space-y-3" onSubmit={handleRecovery}>
              <label className="block font-medium" htmlFor="recovery-email">이메일</label>
              <input
                autoComplete="email"
                className="h-10 w-[320px] rounded-lg border border-slate-200 px-3 outline-none focus:border-[#2196F3]"
                defaultValue={recoveryEmail}
                id="recovery-email"
                name="recovery-email"
                required
                type="email"
              />
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
