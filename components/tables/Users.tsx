import { motion } from "framer-motion";

interface UsersProps {
  currentData: any[];
  handleDeleteUser: (id: string) => void;
  handleEditUser: (user: any) => void;
  formatDate: (date: string | null) => string;
}

export default function Users({
  currentData,
  handleDeleteUser,
  handleEditUser,
  formatDate,
}: UsersProps) {
  console.log("User data structure:", currentData[0]); // Log the first user to see the structure
  console.log(
    "User IDs:",
    currentData.map((u) => u.id)
  ); // Debug for duplicate/missing keys

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
                  {`${item.first_name} ${item.last_name}`}
                </h3>
                <p className="text-sm text-[#666]">{item.email}</p>
                <p className="text-xs text-[#666]">ID: {item.id}</p>
              </div>
            </div>

            <div className="space-y-4 mb-6">
              <div className="flex justify-between items-center">
                <span className="text-[#666] text-sm">Phone</span>
                <span className="text-white text-sm">{item.phone}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[#666] text-sm">Created At</span>
                <span className="text-white text-sm">
                  {formatDate(item.created_at)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[#666] text-sm">Last Sign In</span>
                <span className="text-white text-sm">
                  {formatDate(item.last_sign_in_at)}
                </span>
              </div>
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
