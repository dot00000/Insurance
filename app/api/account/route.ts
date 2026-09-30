import { createClient } from "@supabase/supabase-js";

export async function DELETE(request: Request) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const publicKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
    || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const adminKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !publicKey || !adminKey) {
    return Response.json({ message: "회원탈퇴 서비스 설정이 완료되지 않았습니다." }, { status: 503 });
  }

  const authorization = request.headers.get("authorization");
  const token = authorization?.startsWith("Bearer ") ? authorization.slice(7) : null;
  if (!token) {
    return Response.json({ message: "로그인 후 다시 시도해 주세요." }, { status: 401 });
  }

  try {
    const authClient = createClient(url, publicKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
    const { data: { user }, error: authError } = await authClient.auth.getUser(token);
    if (authError || !user) {
      return Response.json({ message: "로그인 정보가 만료되었습니다. 다시 로그인해 주세요." }, { status: 401 });
    }

    const adminClient = createClient(url, adminKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
    const { error: deleteError } = await adminClient.auth.admin.deleteUser(user.id);
    if (deleteError) {
      return Response.json({ message: "회원탈퇴를 처리하지 못했습니다. 잠시 후 다시 시도해 주세요." }, { status: 500 });
    }

    return Response.json({ success: true });
  } catch {
    return Response.json({ message: "회원탈퇴 요청을 처리하지 못했습니다." }, { status: 500 });
  }
}
