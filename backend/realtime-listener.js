import { createClient } from "@supabase/supabase-js";
import fetch from "node-fetch"; // If using Node.js < 18
import dotenv from "dotenv";
dotenv.config();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY;
const edgeFunctionUrl = process.env.NEXT_PUBLIC_SUPABASE_EDGE_FUNCTION_URL;

console.log("SUPABASE URL:", supabaseUrl);
console.log("SUPABASE KEY:", supabaseKey);
console.log("EDGE FUNCTION URL:", edgeFunctionUrl);

const supabase = createClient(supabaseUrl, supabaseKey);

async function logAllTemplates() {
  const { data, error } = await supabase
    .from("notification_templates")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching templates:", error);
  } else {
    console.log("Current notification_templates table:");
    console.table(data);
  }
}

logAllTemplates();

supabase
  .channel("notification-templates")
  .on(
    "postgres_changes",
    { schema: "public", table: "notification_templates" },
    (payload) => {
      console.log("Any event received:", payload);
    }
  )
  .subscribe();

console.log("Listening for new notification templates...");
