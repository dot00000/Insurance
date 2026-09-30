import { z } from "zod";

export const passwordSchema = z
  .string()
  .min(8, "비밀번호는 8자 이상 입력해 주세요.")
  .max(64, "비밀번호는 64자 이하로 입력해 주세요.")
  .regex(/[A-Z]/, "영문 대문자를 1자 이상 포함해 주세요.")
  .regex(/[a-z]/, "영문 소문자를 1자 이상 포함해 주세요.")
  .regex(/[0-9]/, "숫자를 1자 이상 포함해 주세요.")
  .regex(/[!-/:-@\[-`{-~]/, "특수문자를 1자 이상 포함해 주세요.");

export const nameSchema = z.string().trim()
  .min(2, "이름은 2자 이상 입력해 주세요.")
  .max(50, "이름은 50자 이하로 입력해 주세요.");

export const emailSchema = z.string().trim()
  .pipe(z.email("올바른 이메일 주소를 입력해 주세요."));

export const phoneSchema = z.string()
  .transform((phone) => phone.replace(/[\s-]/g, ""))
  .pipe(z.string().regex(/^010[0-9]{8}$/, "휴대전화는 010으로 시작하는 11자리 숫자를 입력해 주세요."));

export const signupFieldSchemas = {
  password: passwordSchema,
  passwordConfirm: z.string().min(1, "비밀번호 확인을 입력해 주세요."),
  name: nameSchema,
  email: emailSchema,
  phone: phoneSchema,
};

export const signupSchema = z.object(signupFieldSchemas).refine(
  (values) => values.password === values.passwordConfirm,
  { message: "비밀번호가 일치하지 않습니다.", path: ["passwordConfirm"] },
);
