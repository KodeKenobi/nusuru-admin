import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
dotenv.config();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function insertTemplate() {
  const { data, error } = await supabase
    .from("notification_templates")
    .insert([
      {
        title: "Backend Test Notification",
        body: "This notification was inserted by the backend script.",
        notification_type: "basic",
        is_active: true,
      },
    ])
    .select();

  if (error) {
    console.error("Insert error:", error);
  } else {
    console.log("Inserted notification template:", data);
  }
}

insertTemplate();
