"use client";

import { Button } from "@/components/ui/button";
import CommonDialog from "@/components/common/CommonDialog";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useState } from "react";

type VerificationAction = "password" | "phone" | null;

const memberInfo = {
  name: "홍길동",
  id: "insurance_member",
  birthDate: "19900101",
  gender: "여자",
  phone: "010-1234-5678",
};

const rows = [
  { label: "이름", value: memberInfo.name },
  { label: "아이디", value: memberInfo.id },
  { label: "생년월일", value: memberInfo.birthDate },
  { label: "성별", value: memberInfo.gender },
];

function ReadonlyField({ id, value }: { id: string; value: string }) {
  return (
    <Input
      id={id}
      value={value}
      readOnly
      aria-readonly="true"
      className="h-11 max-w-[240px] rounded-sm border-slate-300 bg-slate-100 px-4 text-sm text-slate-500 shadow-none read-only:cursor-default focus-visible:ring-0"
    />
  );
}

export default function Page() {
  const [email, setEmail] = useState("member@example.com");
  const [commonDialog, setCommonDialog] = useState<{
    title: string;
    content: string;
  } | null>(null);
  const [verificationAction, setVerificationAction] =
    useState<VerificationAction>(null);

  const verificationTitle =
    verificationAction === "password" ? "비밀번호 변경" : "휴대폰 번호 변경";

  return (
    <main className="p-6">
      <section className="w-full max-w-5xl">
        <h1 className="border-b border-slate-300 pb-5 text-lg font-semibold text-slate-900">
          회원 정보
        </h1>

        <div className="divide-y divide-slate-200">
          {rows.slice(0, 2).map((row) => (
            <div
              key={row.label}
              className="grid gap-3 py-3 sm:grid-cols-[190px_minmax(0,1fr)] sm:items-center"
            >
              <label
                htmlFor={`member-${row.label}`}
                className="text-sm font-medium text-slate-800"
              >
                {row.label}
              </label>
              <ReadonlyField id={`member-${row.label}`} value={row.value} />
            </div>
          ))}

          <div className="grid gap-3 py-3 sm:grid-cols-[190px_minmax(0,1fr)] sm:items-center">
            <span className="text-sm font-medium text-slate-800">비밀번호</span>
            <div>
              <Button
                type="button"
                variant="outline"
                className="h-11 rounded-sm border-slate-400 px-6 text-sm font-medium text-slate-900 shadow-none hover:bg-[#2196F3] hover:text-white"
                onClick={() => setVerificationAction("password")}
              >
                비밀번호 변경
              </Button>
            </div>
          </div>

          {rows.slice(2).map((row) => (
            <div
              key={row.label}
              className="grid gap-3 py-3 sm:grid-cols-[190px_minmax(0,1fr)] sm:items-center"
            >
              <label
                htmlFor={`member-${row.label}`}
                className="text-sm font-medium text-slate-800"
              >
                {row.label}
              </label>
              <ReadonlyField id={`member-${row.label}`} value={row.value} />
            </div>
          ))}

          <div className="grid gap-3 py-3 sm:grid-cols-[190px_minmax(0,1fr)] sm:items-center">
            <span className="text-sm font-medium text-slate-800">
              휴대폰 번호
            </span>
            <div className="flex flex-wrap items-center gap-2.5">
              <ReadonlyField id="member-phone" value={memberInfo.phone} />
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
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              autoComplete="email"
              className="h-11 w-full rounded-sm border-slate-300 px-4 text-sm text-slate-900 shadow-none focus-visible:border-sky-500 focus-visible:ring-2 focus-visible:ring-sky-100"
            />
          </div>
        </div>
        <div className="flex items-center justify-between gap-3 border-t border-slate-200 pt-8">
          <Button
            type="button"
            variant="outline"
            className="h-11 rounded-sm border-slate-400 px-6 text-sm font-medium text-slate-900 shadow-none hover:bg-[#2196F3] hover:text-white"
            onClick={() =>
              setCommonDialog({
                title: "회원탈퇴",
                content: "회원정보는 복구되지 않습니다. 정말로 탈퇴하시겠습니까?",
              })
            }
          >
            회원탈퇴
          </Button>
          <Button
            type="button"
            variant="outline"
            className="h-11 rounded-sm border-slate-400 px-6 text-sm font-medium text-slate-900 shadow-none hover:bg-[#2196F3] hover:text-white"
            onClick={() =>
              setCommonDialog({
                title: "회원정보 수정",
                content: "회원 정보를 수정하시겠습니까?",
              })
            }
          >
            수정
          </Button>
        </div>
      </section>
      {commonDialog && (
        <CommonDialog
          title={commonDialog.title}
          description=""
          content={commonDialog.content}
          actionMode="confirm"
          onConfirm={() => setCommonDialog(null)}
          onClose={() => setCommonDialog(null)}
        />
      )}
      {/* 비밀번호 변경 dialog */}
      <Dialog
        open={verificationAction !== null}
        onOpenChange={(open) => {
          if (!open) setVerificationAction(null);
        }}
      >
        <DialogContent className="rounded-lg border border-slate-200 bg-white p-6 shadow-xl sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold text-slate-900">
              {verificationTitle}
            </DialogTitle>
            <DialogDescription className="text-sm leading-6 text-slate-600">
              본인인증 서비스가 연결되면 이곳에서 인증을 진행할 수 있습니다.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="border-t border-slate-200 pt-4">
            <DialogClose
              render={
                <Button
                  type="button"
                  variant="outline"
                  className="h-10 w-[80px] border-slate-300 text-slate-700 font-bold hover:bg-[#2196F3] hover:text-white"
                >
                  닫기
                </Button>
              }
            />
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </main>
  );
}
