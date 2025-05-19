import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabaseServiceKey = process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY!;

// Log database URL (without sensitive information)
console.log("Database URL:", supabaseUrl);

// Client for regular user operations
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Admin client with service role for privileged operations
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

// Function to fetch all tables
export const getAllTables = async () => {
  try {
    // First, try to get tables from the users table
    const { data: usersData, error: usersError } = await supabase
      .from("users")
      .select("*")
      .limit(1);

    if (usersError) throw usersError;

    // Add known tables
    const tables = ["users", "custom_users", "profiles"];

    // Log the tables for debugging
    console.log("Available tables:", tables);

    return tables;
  } catch (error) {
    console.error("Error fetching tables:", error);
    return [];
  }
};

// Function to fetch table data
export const getTableData = async (tableName: string) => {
  try {
    const { data, error } = await supabase.from(tableName).select("*");

    if (error) throw error;
    return data;
  } catch (error) {
    console.error(`Error fetching data from ${tableName}:`, error);
    return [];
  }
};
