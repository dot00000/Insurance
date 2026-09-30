"use client";

import { useRef, useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useForm, type FieldErrors, type Resolver } from "react-hook-form";
import type { z } from "zod";
import { signupSchema } from "@/utils/signupValidation";
import { getSupabaseClient } from "@/utils/supabase/client";

const fields = [
    { name: "email", label: "이메일", type: "email", autoComplete: "email" },
  { name: "password", label: "비밀번호", type: "password", autoComplete: "new-password" },
  { name: "passwordConfirm", label: "비밀번호 확인", type: "password", autoComplete: "new-password" },
  { name: "name", label: "이름", type: "text", autoComplete: "name" },
  { name: "phone", label: "휴대전화", type: "tel", autoComplete: "tel" },
] as const;

type SignupValues = z.input<typeof signupSchema>;

const signupResolver: Resolver<SignupValues> = (values) => {
  const result = signupSchema.safeParse(values);
  if (result.success) return { values: result.data, errors: {} };

  const errors: FieldErrors<SignupValues> = {};
  for (const issue of result.error.issues) {
    const name = issue.path[0] as keyof SignupValues;
    errors[name] ??= { type: issue.code, message: issue.message };
  }
  return { values: {}, errors };
};

export default function SignupPage() {
  const [visiblePasswords, setVisiblePasswords] = useState<Record<string, boolean>>({});
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<SignupValues>({
    resolver: signupResolver,
    mode: "onTouched",
    reValidateMode: "onChange",
    defaultValues: {
       password: "", passwordConfirm: "", name: "", email: "", phone: "",
    },
  });
  const submitting = useRef(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);


  return (
    <main className="relative flex min-h-svh items-center justify-center overflow-hidden bg-[radial-gradient(ellipse_at_8%_10%,rgba(210,214,255,0.82),transparent_38%),radial-gradient(ellipse_at_96%_94%,rgba(255,245,227,0.82),transparent_40%),#fff] px-4 py-8">
      <section className="w-full max-w-[360px] rounded-[8px] border border-[#e7e9ee] bg-white/80 px-4 pb-6 pt-6 shadow-[0_1px_2px_rgba(20,30,50,0.12)] backdrop-blur-sm">
        <h1 className="mb-10 mt-10 text-center text-[28px] font-bold leading-6 text-[#202735]">
          회원가입
        </h1>

        <form noValidate aria-busy={isSubmitting} onSubmit={(event) => handleSubmit(async (values) => {
          if (submitting.current) return;
          setSubmitError(null);
          setSuccessMessage(null);
          submitting.current = true;
          try {
            const supabase = getSupabaseClient();
            const { email, password, name, phone } = values;
            const { data, error } = await supabase.auth.signUp({
              email,
              password,
              options: { data: { name, phone } },
            });

            if (error) {
              const messages: Record<string, string> = {
                user_already_exists: "이미 가입된 이메일입니다.",
                email_exists: "이미 가입된 이메일입니다.",
                weak_password: "더 안전한 비밀번호를 입력해 주세요.",
                over_email_send_rate_limit: "인증 메일 요청이 많습니다. 잠시 후 다시 시도해 주세요.",
                over_request_rate_limit: "요청이 많습니다. 잠시 후 다시 시도해 주세요.",
                signup_disabled: "현재 회원가입을 이용할 수 없습니다.",
                email_address_invalid: "가입 가능한 이메일 주소를 입력해 주세요.",
              };
              setSubmitError(messages[error.code ?? ""] ?? "회원가입에 실패했습니다. 잠시 후 다시 시도해 주세요.");
              return;
            }

            reset({ ...values, password: "", passwordConfirm: "" });
            setVisiblePasswords({});
            setSuccessMessage(data.session
              ? "회원가입이 완료되었습니다."
              : "이메일의 가입 인증 안내를 확인해 주세요. 이미 가입했다면 로그인해 주세요.");
          } catch (error) {
            setSubmitError(error instanceof Error && error.message.startsWith("회원가입 서비스 설정")
              ? error.message
              : "회원가입 요청을 처리하지 못했습니다. 연결 상태를 확인하고 다시 시도해 주세요.");
          } finally {
            submitting.current = false;
          }
        }, () => {
          setSubmitError(null);
          setSuccessMessage(null);
        })(event)}>
          <div className="space-y-3">
            {fields.map((field) => {
              const isPassword = field.type === "password";
              const visible = Boolean(visiblePasswords[field.name]);

              return (
                <div key={field.name}>
                  <label className="sr-only" htmlFor={`signup-${field.name}`}>
                    {field.label}
                  </label>
                  <div className="relative">
                    <input
                      {...register(field.name, field.name === "password" ? { deps: ["passwordConfirm"] } : undefined)}
                      readOnly={isSubmitting}
                      autoCapitalize={field.name === "email" ? "none" : undefined}
                      spellCheck={field.name === "email" ? false : undefined}
                      aria-invalid={Boolean(errors[field.name])}
                      aria-describedby={[
                        errors[field.name] ? `${field.name}-error` : "",
                        field.name === "password" ? `${field.name}-help` : "",
                      ].filter(Boolean).join(" ") || undefined}
                      autoComplete={field.autoComplete}
                      className={`h-10 w-full rounded-[8px] border border-[#e8ebf0] bg-white/70 px-3 text-base text-[#202735] outline-none transition placeholder:text-[#a0a8b4] focus:border-[#7ea5f8] focus:ring-2 focus:ring-[#3569e8]/10 ${isPassword ? "pr-11" : ""}`}
                      id={`signup-${field.name}`}
                      placeholder={field.label}
                      required
                      type={isPassword && visible ? "text" : field.type}
                    />
                    {isPassword && (
                      <button
                        aria-label={`${field.label} ${visible ? "숨기기" : "보기"}`}
                        aria-pressed={visible}
                        className="absolute inset-y-0 right-2 flex w-8 items-center justify-center rounded text-[#a0a8b4] transition hover:text-[#536273] focus-visible:outline-2 focus-visible:outline-[#3268e8]"
                        onClick={() => setVisiblePasswords((current) => ({ ...current, [field.name]: !current[field.name] }))}
                        type="button"
                      >
                        {visible ? <EyeOff size={22} /> : <Eye size={22} />}
                      </button>
                    )}
                  </div>
                  {field.name === "password" && (
                    <p id="password-help" className="mt-1.5 text-xs text-[#697382]">
                      8~64자, 영문 대문자·소문자·숫자·특수문자 각 1자 이상
                    </p>
                  )}
                  {errors[field.name] && (
                    <p id={`${field.name}-error`} role="alert" className="mt-1 text-xs text-red-600">
                      {errors[field.name]?.message}
                    </p>
                  )}
                </div>
              );
            })}
          </div>

          <button
            disabled={isSubmitting}
            className="mt-10 h-12 w-full rounded-[8px] bg-[#2196F3] text-base font-bold text-white shadow-[0_1px_2px_rgba(30,70,170,0.2)] transition hover:bg-[#285bd4] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#3268e8]"
            type="submit"
          >
            {isSubmitting ? "가입 처리 중…" : "회원가입"}
          </button>
          {submitError && <p role="alert" className="mt-3 text-sm text-red-600">{submitError}</p>}
          {successMessage && <p role="status" className="mt-3 text-sm text-[#21835a]">{successMessage}</p>}
        </form>
      </section>
    </main>
  );
}
