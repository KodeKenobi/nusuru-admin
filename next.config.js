/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    NEXT_PUBLIC_SUPABASE_URL: "https://fteifbqniqfmiuipvbug.supabase.co",
    NEXT_PUBLIC_SUPABASE_ANON_KEY:
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ0ZWlmYnFuaXFmbWl1aXB2YnVnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDUzMDY5ODYsImV4cCI6MjA2MDg4Mjk4Nn0.CxGGAtG2FpKDbReQdmUGC8tzmiMpk3meFqkTPnBx01U",
  },
  images: {
    unoptimized: true,
    domains: [
      "https://fteifbqniqfmiuipvbug.supabase.co",
      "fteifbqniqfmiuipvbug.supabase.co",
    ],
  },
};

module.exports = nextConfig;
