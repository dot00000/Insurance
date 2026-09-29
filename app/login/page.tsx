"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <main className="relative flex min-h-svh items-center justify-center overflow-hidden bg-[radial-gradient(ellipse_at_8%_10%,rgba(210,214,255,0.82),transparent_38%),radial-gradient(ellipse_at_96%_94%,rgba(255,245,227,0.82),transparent_40%),#fff] px-4 py-8">
      <section className="w-full max-w-[360px] h-[500px] rounded-[8px] border border-[#e7e9ee] bg-white/80 px-4 pb-4 pt-6 shadow-[0_1px_2px_rgba(20,30,50,0.12)] backdrop-blur-sm">
        <h1 className="mb-10 mt-10 text-center text-[28px] font-bold leading-6 text-[#202735]">
          로그인
        </h1>

        <form className="space-y-1" onSubmit={(event) => event.preventDefault()}>
          <label className="sr-only" htmlFor="login-id">
            아이디
          </label>
          <input
            autoComplete="username"
            className="h-10 w-full rounded-[8px] border border-[#e8ebf0] bg-white/70 px-3 text-base text-[#202735] outline-none transition placeholder:text-[#a0a8b4] focus:border-[#7ea5f8] focus:ring-2 focus:ring-[#3569e8]/10"
            id="login-id"
            name="username"
            placeholder="아이디"
            required
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
                className="size-[16px] accent-[#3569e8]"
                name="remember"
                type="checkbox"
              />
              아이디 기억하기
            </label>
            <button className="font-medium font-bold text-[#2196F3] hover:underline" type="button">
              비밀번호 찾기
            </button>
          </div>

          <button
            className="mt-1 h-12 w-full font-bold rounded-[8px] bg-[#2196F3] text-base font-medium text-white shadow-[0_1px_2px_rgba(30,70,170,0.2)] transition hover:bg-[#285bd4] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#3268e8]"
            type="submit"
          >
            로그인
          </button>
        </form>

        <button
          aria-label="Google로 로그인"
          className="mt-3 flex h-12 w-full items-center justify-center rounded-[8px] border border-[#e8ebf0] bg-white/70 text-2xl font-bold transition hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#3268e8]"
          type="button"
        >
          <span className="bg-[conic-gradient(from_-45deg,#4285f4_0_25%,#34a853_25%_50%,#fbbc05_50%_75%,#ea4335_75%)] bg-clip-text text-transparent">
            G
          </span>
        </button>

        <p className="mt-10 text-center text-sm text-[#697382]">
          회원 가입을 원하시나요?{" "}
          <button className="font-medium text-[#2196F3] hover:underline" type="button">
            회원가입
          </button>
        </p>
      </section>
    </main>
  );
}
