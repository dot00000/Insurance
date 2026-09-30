import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ROLE_KEY
);

const userId = "caf9bf27-55fe-4567-b400-0a6d9690cee5";

const { data, error } = await supabase.auth.admin.getUserById(userId);
if (error) throw error;

const { error: updateError } = await supabase.auth.admin.updateUserById(userId, {
    app_metadata: {
        ...data.user.app_metadata,
        role: "admin",
    }
});

if(updateError) throw updateError;
console.log("관리자 권한 설정");
