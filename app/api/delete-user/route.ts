import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  try {
    const { userId } = await req.json();
    if (!userId) {
      console.log("No userId provided");
      return NextResponse.json({ error: "Missing userId" }, { status: 400 });
    }

    // First, delete from your users table
    const { error: dbError } = await supabaseAdmin
      .from("users")
      .delete()
      .eq("id", userId);
    if (dbError) {
      console.log("Database error deleting user:", dbError);
      return NextResponse.json(
        { error: "Database error deleting user" },
        { status: 500 }
      );
    } else {
      console.log("Deleted from custom users table:", userId);
    }

    // Then, try to delete from Supabase Auth, but ignore 'user not found' errors
    const { error: authError } = await supabaseAdmin.auth.admin.deleteUser(
      userId
    );
    if (authError) {
      console.log("Supabase Auth delete error:", authError);
    } else {
      console.log("Deleted from Supabase Auth users table:", userId);
    }
    if (
      authError &&
      !authError.message?.toLowerCase().includes("user not found")
    ) {
      return NextResponse.json({ error: authError.message }, { status: 500 });
    }

    return NextResponse.json({ message: "User deleted successfully" });
  } catch (err: any) {
    console.log("Unknown error:", err);
    return NextResponse.json(
      { error: err.message || "Unknown error" },
      { status: 500 }
    );
  }
}
