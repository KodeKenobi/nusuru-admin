import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

interface PushTokensProps {
  currentData: any[];
  handleDeleteUser: (id: string) => void;
  formatDate: (date: string | null) => string;
}

export default function PushTokens({
  currentData,
  handleDeleteUser,
  formatDate,
}: PushTokensProps) {
  const [userNames, setUserNames] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    const fetchUserNames = async () => {
      const userIds = currentData.map((token) => token.user_id).filter(Boolean);
      if (userIds.length === 0) return;

      const { data: users, error } = await supabase
        .from("users")
        .select("id, display_name")
        .in("id", userIds);

      if (error) {
        console.error("Error fetching user names:", error);
        return;
      }

      const nameMap = users.reduce(
        (acc, user) => ({
          ...acc,
          [user.id]: user.display_name || "Unknown User",
        }),
        {}
      );

      setUserNames(nameMap);
    };

    fetchUserNames();
  }, [currentData]);

  return (
    <div className="max-w-[800px] mx-auto">
      <div className="grid grid-cols-1 gap-4">
        {currentData.map((token) => (
          <motion.div
            key={token.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="bg-[#1a1a1a]/60 backdrop-blur-md rounded-xl border border-[#333] shadow-lg hover:shadow-[#fa5b00]/50 transition-all duration-300"
          >
            <div className="p-6">
              <div className="flex items-center space-x-4 mb-6">
                <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-[#fa5b00] to-[#d44d00] flex items-center justify-center text-white font-semibold text-lg shadow-md">
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                    />
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-base font-semibold text-white truncate">
                    Push Token
                  </h3>
                  {token.user_id && (
                    <p className="text-sm text-white italic">
                      {userNames[token.user_id] || "Loading..."}
                    </p>
                  )}
                  <p className="text-xs text-[#666]">Token ID: {token.id}</p>
                </div>
              </div>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between items-center">
                  <span className="text-[#666] text-sm">User ID</span>
                  <span className="text-white text-sm">
                    {token.user_id || "Unknown"}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[#666] text-sm">Push Token</span>
                  <span className="text-white text-sm break-all">
                    {token.push_token || "No token"}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[#666] text-sm">Created At</span>
                  <span className="text-white text-sm">
                    {formatDate(token.created_at)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[#666] text-sm">Last Updated</span>
                  <span className="text-white text-sm">
                    {formatDate(token.updated_at)}
                  </span>
                </div>
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={() => handleDeleteUser(token.id)}
                  className="flex-1 text-sm bg-[#dc2626] hover:bg-[#b91c1c] text-white px-4 py-2 rounded-md transition-colors duration-200 flex items-center justify-center space-x-2"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                  <span>Delete</span>
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
