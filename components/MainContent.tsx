import { motion, AnimatePresence } from "framer-motion";
import PushTokens from "./tables/PushTokens";
import DefaultTable from "./tables/DefaultTable";
import Users from "./tables/Users";
import Sellers from "./tables/Sellers";
import Providers from "./tables/Providers";
import Products from "./tables/Products";
import Services from "./tables/Services";
import Notifications from "./tables/Notifications";
import Analytics from "./tables/Analytics";

interface MainContentProps {
  user: any;
  activeTable: string;
  loading: boolean;
  filteredData: any[];
  currentData: any[];
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  currentPage: number;
  setCurrentPage: (page: number) => void;
  totalPages: number;
  startIndex: number;
  endIndex: number;
  handleDeleteUser: (id: string) => void;
  handleEditUser: (user: any) => void;
  handleExportUsers: () => void;
  formatDate: (date: string | null) => string;
  toggleSidebar: () => void;
  isSidebarOpen: boolean;
}

export default function MainContent({
  user,
  activeTable,
  loading,
  filteredData,
  currentData,
  searchQuery,
  setSearchQuery,
  currentPage,
  setCurrentPage,
  totalPages,
  startIndex,
  endIndex,
  handleDeleteUser,
  handleEditUser,
  handleExportUsers,
  formatDate,
  toggleSidebar,
  isSidebarOpen,
}: MainContentProps) {
  return (
    <div
      className={`flex-1 flex flex-col transition-all duration-300 ${
        !isSidebarOpen ? "w-full" : ""
      }`}
    >
      <nav className="bg-black shadow-sm border-b border-white/30">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <button
              onClick={toggleSidebar}
              className="text-white p-2 rounded-md transition-all duration-200 hover:bg-[#fa5b00]/80 hover:text-white"
            >
              <div className="w-6 h-6 relative flex flex-col justify-between py-1">
                <span
                  className={`h-0.5 w-6 bg-white transform transition-all duration-300 ${
                    isSidebarOpen ? "rotate-45 translate-y-2" : ""
                  }`}
                ></span>
                <span
                  className={`h-0.5 w-6 bg-white transition-all duration-300 ${
                    isSidebarOpen ? "opacity-0" : "opacity-100"
                  }`}
                ></span>
                <span
                  className={`h-0.5 w-6 bg-white transform transition-all duration-300 ${
                    isSidebarOpen ? "-rotate-45 -translate-y-2" : ""
                  }`}
                ></span>
              </div>
            </button>
            <span className="text-white">{user?.email}</span>
          </div>
        </div>
      </nav>

      <main className="flex-1 p-6 overflow-y-auto">
        <div className="w-full">
          <div className="flex justify-between items-center mb-8">
            <motion.div
              className="flex-1"
              initial={false}
              animate={{ x: isSidebarOpen ? 0 : 20 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              <h2 className="text-3xl font-semibold text-white tracking-tight capitalize">
                {activeTable.replace(/_/g, " ")} Management
              </h2>
            </motion.div>
            <motion.div
              className="flex-1 flex justify-end"
              initial={false}
              animate={{ x: isSidebarOpen ? 0 : -20 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              <button
                onClick={handleExportUsers}
                className="bg-[#fa5b00] text-white px-6 py-2 rounded-md hover:bg-[#d44d00] transition-colors duration-200 shadow-md min-w-[200px]"
              >
                Export {activeTable.replace(/_/g, " ")}
              </button>
            </motion.div>
          </div>

          <motion.div
            className="mb-8"
            initial={false}
            animate={{ scale: isSidebarOpen ? 1 : 1.02 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            <input
              type="text"
              placeholder={`🔍 Search ${activeTable.replace(/_/g, " ")}...`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#1a1a1a] text-white border border-[#333] rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-[#fa5b00]/80 focus:border-[#fa5b00] transition-all duration-300 shadow-sm"
            />
          </motion.div>

          {loading ? (
            <div className="text-center text-white text-lg py-12">
              Loading...
            </div>
          ) : filteredData.length === 0 ? (
            <div className="text-center text-white text-lg py-12">
              No {activeTable.replace(/_/g, " ")} found.
            </div>
          ) : (
            <motion.div
              initial={false}
              animate={{
                scale: isSidebarOpen ? 1 : 1.01,
                x: isSidebarOpen ? 0 : 10,
              }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              {activeTable === "push_tokens" ? (
                <PushTokens
                  currentData={currentData}
                  handleDeleteUser={handleDeleteUser}
                  formatDate={formatDate}
                />
              ) : activeTable === "notifications" ? (
                <Notifications
                  currentData={currentData}
                  handleDeleteUser={handleDeleteUser}
                  formatDate={formatDate}
                />
              ) : activeTable === "analytics" ? (
                <Analytics currentData={currentData} />
              ) : activeTable === "users" ? (
                <Users
                  currentData={currentData}
                  handleDeleteUser={handleDeleteUser}
                  handleEditUser={handleEditUser}
                  formatDate={formatDate}
                />
              ) : activeTable === "sellers" ? (
                <Sellers
                  currentData={currentData}
                  handleDeleteUser={handleDeleteUser}
                  handleEditUser={handleEditUser}
                  formatDate={formatDate}
                />
              ) : activeTable === "providers" ? (
                <Providers
                  currentData={currentData}
                  handleDeleteUser={handleDeleteUser}
                  handleEditUser={handleEditUser}
                  formatDate={formatDate}
                />
              ) : activeTable === "products" ? (
                <Products
                  currentData={currentData}
                  handleDeleteUser={handleDeleteUser}
                  handleEditUser={handleEditUser}
                  formatDate={formatDate}
                />
              ) : activeTable === "services" ? (
                <Services
                  currentData={currentData}
                  handleDeleteUser={handleDeleteUser}
                  handleEditUser={handleEditUser}
                  formatDate={formatDate}
                />
              ) : (
                <DefaultTable
                  currentData={currentData}
                  handleDeleteUser={handleDeleteUser}
                  handleEditUser={handleEditUser}
                  formatDate={formatDate}
                />
              )}
            </motion.div>
          )}

          {/* Pagination Controls */}
          <motion.div
            className="mt-8 flex items-center justify-between"
            initial={false}
            animate={{
              y: isSidebarOpen ? 0 : 5,
              opacity: isSidebarOpen ? 1 : 0.9,
            }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            <div className="text-sm text-[#888]">
              Showing {startIndex + 1} to{" "}
              {Math.min(endIndex, filteredData.length)} of {filteredData.length}{" "}
              {activeTable.replace(/_/g, " ")}
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setCurrentPage(Math.max(currentPage - 1, 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 rounded-md bg-[#1a1a1a] border border-[#333] text-white disabled:opacity-50 disabled:cursor-not-allowed hover:border-[#fa5b00] transition-colors duration-200"
              >
                Previous
              </button>
              <div className="flex items-center space-x-1">
                {[...Array(totalPages)].map((_, index) => (
                  <button
                    key={index + 1}
                    onClick={() => setCurrentPage(index + 1)}
                    className={`w-8 h-8 rounded-md flex items-center justify-center text-sm ${
                      currentPage === index + 1
                        ? "bg-[#fa5b00] text-white"
                        : "bg-[#1a1a1a] border border-[#333] text-white hover:border-[#fa5b00]"
                    } transition-colors duration-200`}
                  >
                    {index + 1}
                  </button>
                ))}
              </div>
              <button
                onClick={() =>
                  setCurrentPage(Math.min(currentPage + 1, totalPages))
                }
                disabled={currentPage === totalPages}
                className="px-3 py-1 rounded-md bg-[#1a1a1a] border border-[#333] text-white disabled:opacity-50 disabled:cursor-not-allowed hover:border-[#fa5b00] transition-colors duration-200"
              >
                Next
              </button>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
