import { motion } from "framer-motion";

interface DefaultTableProps {
  currentData: any[];
  handleDeleteUser: (id: string) => void;
  handleEditUser: (user: any) => void;
  formatDate: (date: string | null) => string;
}

export default function DefaultTable({
  currentData,
  handleDeleteUser,
  handleEditUser,
  formatDate,
}: DefaultTableProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {currentData.map((item) => (
        <motion.div
          key={item.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="bg-[#1a1a1a]/60 backdrop-blur-md rounded-xl border border-[#333] shadow-lg hover:shadow-[#fa5b00]/50 transition-all duration-300"
        >
          <div className="p-6">
            <div className="flex items-center space-x-4 mb-6">
              <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-[#fa5b00] to-[#d44d00] flex items-center justify-center text-white font-semibold text-lg shadow-md">
                {item.name?.[0]?.toUpperCase() ||
                  item.email?.[0]?.toUpperCase() ||
                  "?"}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-base font-semibold text-white truncate">
                  {item.name || item.email || item.title || "No Name"}
                </h3>
                <p className="text-sm text-[#666]">
                  ID: {item.id?.slice(0, 8)}...
                </p>
              </div>
            </div>

            <div className="space-y-4 mb-6">
              {Object.entries(item).map(([key, value]) => {
                if (
                  key === "id" ||
                  key === "name" ||
                  key === "email" ||
                  key === "title" ||
                  key === "updated_at"
                )
                  return null;

                // Format dates
                let displayValue = value;
                if (key === "created_at" || key === "last_sign_in_at") {
                  displayValue = formatDate(value as string);
                }

                return (
                  <div key={key} className="flex justify-between items-center">
                    <span className="text-[#666] text-sm capitalize">
                      {key === "last_sign_in_at"
                        ? "Last Sign In"
                        : key.replace(/_/g, " ")}
                    </span>
                    <span className="text-white text-sm">
                      {displayValue ? String(displayValue) : "Never"}
                    </span>
                  </div>
                );
              })}
            </div>

            <div className="flex space-x-3">
              <button
                onClick={() => handleDeleteUser(item.id)}
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
              <button
                onClick={() => handleEditUser(item)}
                className="flex-1 text-sm bg-[#fa5b00] hover:bg-[#d44d00] text-white px-4 py-2 rounded-md transition-colors duration-200 flex items-center justify-center space-x-2"
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
                    d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                  />
                </svg>
                <span>Edit</span>
              </button>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
