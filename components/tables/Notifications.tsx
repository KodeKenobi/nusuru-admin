import { useState } from "react";
import { motion } from "framer-motion";
import { supabase } from "@/lib/supabase";
import { sendTestNotification } from "@/lib/sendNotification";

interface NotificationsProps {
  currentData: any[];
  handleDeleteUser: (id: string) => void;
  formatDate: (date: string | null) => string;
}

export default function Notifications({
  currentData,
  handleDeleteUser,
  formatDate,
}: NotificationsProps) {
  const [loading, setLoading] = useState(false);
  const [selectedToken, setSelectedToken] = useState<string | null>(null);
  const [form, setForm] = useState({ title: "", body: "" });
  const [sendingAll, setSendingAll] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  const handleTestNotification = async (pushToken: string) => {
    try {
      setLoading(true);
      setSelectedToken(pushToken);
      await sendTestNotification(pushToken);
      alert("Test notification sent successfully!");
    } catch (error) {
      console.error("Error sending test notification:", error);
      alert("Failed to send test notification. Please try again.");
    } finally {
      setLoading(false);
      setSelectedToken(null);
    }
  };

  // Send custom notification to all tokens
  const handleSendAll = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim() || !form.body.trim()) {
      alert("Please enter both a title and a message.");
      return;
    }
    setSendingAll(true);
    let successCount = 0;
    let failCount = 0;
    if (currentData.length === 0) {
      setResult("No push tokens found. No notifications sent.");
      setSendingAll(false);
      return;
    }
    for (const token of currentData) {
      try {
        await sendTestNotification(token.push_token, form.title, form.body);
        successCount++;
      } catch {
        failCount++;
      }
    }
    setSendingAll(false);
    setResult(
      `Notifications sent! Success: ${successCount}, Failed: ${failCount}`
    );
    setForm({ title: "", body: "" });
  };

  return (
    <div className="p-6">
      {/* Send to All Form */}
      <form
        onSubmit={handleSendAll}
        className="mb-8 bg-[#181818] border border-[#222] rounded-xl p-6 max-w-2xl mx-auto"
      >
        <h2 className="text-xl font-semibold text-white mb-4">
          Send Notification to Everyone
        </h2>
        <div className="mb-4">
          <input
            type="text"
            placeholder="Title"
            value={form.title}
            onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
            className="w-full bg-[#1a1a1a] text-white border border-[#333] rounded-lg p-3 mb-2 focus:outline-none focus:ring-2 focus:ring-[#fa5b00]/80 focus:border-[#fa5b00]"
            required
          />
          <textarea
            placeholder="Message"
            value={form.body}
            onChange={(e) => setForm((f) => ({ ...f, body: e.target.value }))}
            className="w-full bg-[#1a1a1a] text-white border border-[#333] rounded-lg p-3 h-24 focus:outline-none focus:ring-2 focus:ring-[#fa5b00]/80 focus:border-[#fa5b00]"
            required
          />
        </div>
        <button
          type="submit"
          disabled={sendingAll}
          className="bg-[#fa5b00] text-white px-6 py-2 rounded-md hover:bg-[#d44d00] transition-colors disabled:opacity-50"
        >
          {sendingAll ? "Sending..." : "Send to Everyone"}
        </button>
        {result && <div className="mt-4 text-white text-center">{result}</div>}
      </form>
      {/* Optionally, you can show a message if there are no tokens */}
      {currentData.length === 0 && (
        <div className="text-center text-[#fa5b00] text-lg py-8">
          No push tokens found. No notifications will be sent.
        </div>
      )}
      {/* Existing cards */}
      {/* <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {currentData.map((token) => (
          <motion.div
            key={token.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-[#0a0a0a] rounded-xl border border-[#1a1a1a] p-4"
          >
            <div className="space-y-3">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-semibold text-white">
                    {token.user_email || "Unknown User"}
                  </h3>
                  <p className="text-sm text-[#888]">
                    Token:{" "}
                    {token.push_token
                      ? token.push_token.substring(0, 20) + "..."
                      : "No token"}
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-1 gap-2 text-xs text-[#aaa]">
                <div>
                  <span className="font-semibold text-[#fa5b00]">Created:</span>{" "}
                  {formatDate(token.created_at)}
                </div>
                <div>
                  <span className="font-semibold text-[#fa5b00]">
                    Last Used:
                  </span>{" "}
                  {formatDate(token.last_used_at)}
                </div>
              </div>
              <div className="flex justify-end space-x-2 pt-2">
                <button
                  onClick={() => handleTestNotification(token.push_token)}
                  disabled={loading && selectedToken === token.push_token}
                  className="px-3 py-1 text-sm bg-[#fa5b00] text-white rounded-md hover:bg-[#d44d00] transition-colors disabled:opacity-50"
                >
                  {loading && selectedToken === token.push_token
                    ? "Sending..."
                    : "Send Test Notification"}
                </button>
                <button
                  onClick={() => handleDeleteUser(token.id)}
                  className="px-3 py-1 text-sm bg-[#1a1a1a] text-white rounded-md hover:bg-[#2a2a2a] transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div> */}
    </div>
  );
}
