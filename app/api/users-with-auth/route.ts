import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin, supabase } from "@/lib/supabase";

export async function GET(req: NextRequest) {
  try {
    // Get auth users for last sign in
    const { data: authUsers } = await supabaseAdmin.auth.admin.listUsers();
    // Get custom users
    const { data: usersData, error } = await supabase.from("users").select("*");
    if (error) throw error;
    // Combine auth data with custom users
    const combinedUsers =
      usersData?.map((user) => ({
        ...user,
        last_sign_in_at: authUsers?.users?.find(
          (auth) => auth.email === user.email
        )?.last_sign_in_at,
      })) || [];
    return NextResponse.json(combinedUsers);
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Unknown error" },
      { status: 500 }
    );
  }
}
