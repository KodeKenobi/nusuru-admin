import Image from "next/image";

interface SidebarProps {
  user: any;
  tables: { table_name: string }[];
  activeTable: string;
  setActiveTable: (table: string) => void;
  isServicesOpen: boolean;
  setIsServicesOpen: (isOpen: boolean) => void;
  isProductsOpen: boolean;
  setIsProductsOpen: (isOpen: boolean) => void;
  isProvidersOpen: boolean;
  setIsProvidersOpen: (isOpen: boolean) => void;
  handleSignOut: () => void;
  isOpen: boolean;
}

export default function Sidebar({
  user,
  tables,
  activeTable,
  setActiveTable,
  isServicesOpen,
  setIsServicesOpen,
  isProductsOpen,
  setIsProductsOpen,
  isProvidersOpen,
  setIsProvidersOpen,
  handleSignOut,
  isOpen,
}: SidebarProps) {
  return (
    <aside
      className={`w-64 bg-black shadow-lg flex flex-col justify-between border-r border-white/30 transition-transform duration-300 h-full ${
        !isOpen ? "-translate-x-full" : ""
      }`}
    >
      <div className="flex flex-col flex-1">
        <div className="mt-20">
          <Image
            src="logo.png"
            alt="Nusuru Logo"
            width={240}
            height={80}
            className="mx-auto"
            priority
          />
        </div>
        <nav className="flex-1 px-4 mt-4 flex flex-col justify-start">
          <div className="space-y-2">
            {/* Users Button - Always First */}
            <button
              onClick={() => setActiveTable("users")}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors duration-200 ${
                activeTable === "users"
                  ? "text-white bg-[#fa5b00]/10"
                  : "text-[#888] hover:text-white hover:bg-[#fa5b00]/5"
              } hover:scale-[1.04] transition-transform duration-200 hover:bg-[#fa5b00]/80`}
            >
              <svg
                className={`w-5 h-5 ${
                  activeTable === "users" ? "text-[#fa5b00]" : ""
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                />
              </svg>
              <span className="capitalize">Users</span>
            </button>

            {/* Push Tokens Button */}
            <button
              onClick={() => setActiveTable("push_tokens")}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors duration-200 ${
                activeTable === "push_tokens"
                  ? "text-white bg-[#fa5b00]/10"
                  : "text-[#888] hover:text-white hover:bg-[#fa5b00]/5"
              } hover:scale-[1.04] transition-transform duration-200 hover:bg-[#fa5b00]/80`}
            >
              <svg
                className={`w-5 h-5 ${
                  activeTable === "push_tokens" ? "text-[#fa5b00]" : ""
                }`}
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
              <span className="capitalize">Push Tokens</span>
            </button>

            {/* Notifications Button */}
            <button
              onClick={() => setActiveTable("notifications")}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors duration-200 ${
                activeTable === "notifications"
                  ? "text-white bg-[#fa5b00]/10"
                  : "text-[#888] hover:text-white hover:bg-[#fa5b00]/5"
              } hover:scale-[1.04] transition-transform duration-200 hover:bg-[#fa5b00]/80`}
            >
              <svg
                className={`w-5 h-5 ${
                  activeTable === "notifications" ? "text-[#fa5b00]" : ""
                }`}
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
              <span className="capitalize">Notifications</span>
            </button>

            {/* Notification Templates Button */}
            <button
              onClick={() => setActiveTable("notification_templates")}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors duration-200 ${
                activeTable === "notification_templates"
                  ? "text-white bg-[#fa5b00]/10"
                  : "text-[#888] hover:text-white hover:bg-[#fa5b00]/5"
              } hover:scale-[1.04] transition-transform duration-200 hover:bg-[#fa5b00]/80`}
            >
              <svg
                className={`w-5 h-5 ${
                  activeTable === "notification_templates"
                    ? "text-[#fa5b00]"
                    : ""
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              <span className="capitalize">Notification Templates</span>
            </button>

            {/* Providers Section */}
            <div className="space-y-1">
              <button
                onClick={() => setIsProvidersOpen(!isProvidersOpen)}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-lg transition-colors duration-200 ${
                  activeTable === "providers" || activeTable === "sellers"
                    ? "text-white bg-[#fa5b00]/10"
                    : "text-[#888] hover:text-white hover:bg-[#fa5b00]/5"
                } hover:scale-[1.04] transition-transform duration-200 hover:bg-[#fa5b00]/80`}
              >
                <div className="flex items-center space-x-3">
                  <svg
                    className={`w-5 h-5 ${
                      activeTable === "providers" || activeTable === "sellers"
                        ? "text-[#fa5b00]"
                        : ""
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                  <span className="capitalize">Providers</span>
                </div>
                <svg
                  className={`w-4 h-4 transition-transform duration-200 ${
                    isProvidersOpen ? "transform rotate-180" : ""
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>
              {isProvidersOpen && (
                <div className="pl-4 space-y-1">
                  <button
                    onClick={() => setActiveTable("providers")}
                    className={`w-full flex items-center space-x-3 px-4 py-2 rounded-lg transition-colors duration-200 ${
                      activeTable === "providers"
                        ? "text-white bg-[#fa5b00]/10"
                        : "text-[#888] hover:text-white hover:bg-[#fa5b00]/5"
                    } hover:scale-[1.04] transition-transform duration-200 hover:bg-[#fa5b00]/80`}
                  >
                    <svg
                      className={`w-4 h-4 ${
                        activeTable === "providers" ? "text-[#fa5b00]" : ""
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      />
                    </svg>
                    <span className="capitalize">Service Providers</span>
                  </button>
                  <button
                    onClick={() => setActiveTable("sellers")}
                    className={`w-full flex items-center space-x-3 px-4 py-2 rounded-lg transition-colors duration-200 ${
                      activeTable === "sellers"
                        ? "text-white bg-[#fa5b00]/10"
                        : "text-[#888] hover:text-white hover:bg-[#fa5b00]/5"
                    } hover:scale-[1.04] transition-transform duration-200 hover:bg-[#fa5b00]/80`}
                  >
                    <svg
                      className={`w-4 h-4 ${
                        activeTable === "sellers" ? "text-[#fa5b00]" : ""
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                      />
                    </svg>
                    <span className="capitalize">Sellers</span>
                  </button>
                </div>
              )}
            </div>

            {/* Other Tables */}
            {tables.map((table) => {
              if (
                table.table_name === "users" ||
                table.table_name === "roles" ||
                table.table_name === "providers" ||
                table.table_name === "notifications"
              )
                return null; // Skip users, roles, providers, notifications as they're handled separately
              if (
                table.table_name === "service_images" ||
                table.table_name === "product_images"
              ) {
                return null;
              }
              // SERVICES BUTTON (no dropdown)
              if (table.table_name === "services") {
                return (
                  <button
                    key={table.table_name}
                    onClick={() => setActiveTable("services")}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors duration-200 ${
                      activeTable === "services"
                        ? "text-white bg-[#fa5b00]/10"
                        : "text-[#888] hover:text-white hover:bg-[#fa5b00]/5"
                    } hover:scale-[1.04] transition-transform duration-200 hover:bg-[#fa5b00]/80`}
                  >
                    <svg
                      className={`w-5 h-5 ${
                        activeTable === "services" ? "text-[#fa5b00]" : ""
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      />
                    </svg>
                    <span className="capitalize">Services</span>
                  </button>
                );
              }
              if (
                table.table_name === "services" ||
                table.table_name === "service_images"
              ) {
                return null;
              }
              // PRODUCTS BUTTON (no dropdown)
              if (table.table_name === "products") {
                return (
                  <button
                    key={table.table_name}
                    onClick={() => setActiveTable("products")}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors duration-200 ${
                      activeTable === "products"
                        ? "text-white bg-[#fa5b00]/10"
                        : "text-[#888] hover:text-white hover:bg-[#fa5b00]/5"
                    } hover:scale-[1.04] transition-transform duration-200 hover:bg-[#fa5b00]/80`}
                  >
                    <svg
                      className={`w-5 h-5 ${
                        activeTable === "products" ? "text-[#fa5b00]" : ""
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                      />
                    </svg>
                    <span className="capitalize">Products</span>
                  </button>
                );
              }
              return (
                <button
                  key={table.table_name}
                  onClick={() => setActiveTable(table.table_name)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors duration-200 ${
                    activeTable === table.table_name
                      ? "text-white bg-[#fa5b00]/10"
                      : "text-[#888] hover:text-white hover:bg-[#fa5b00]/5"
                  } hover:scale-[1.04] transition-transform duration-200 hover:bg-[#fa5b00]/80`}
                >
                  <svg
                    className={`w-5 h-5 ${
                      activeTable === table.table_name ? "text-[#fa5b00]" : ""
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                    />
                  </svg>
                  <span className="capitalize">
                    {table.table_name.replace(/_/g, " ")}
                  </span>
                </button>
              );
            })}
            {/* Analytics Button (now just after the other nav buttons) */}
            <button
              onClick={() => setActiveTable("analytics")}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors duration-200 ${
                activeTable === "analytics"
                  ? "text-white bg-[#fa5b00]/10"
                  : "text-[#888] hover:text-white hover:bg-[#fa5b00]/5"
              } hover:scale-[1.04] transition-transform duration-200 hover:bg-[#fa5b00]/80`}
            >
              <svg
                className={`w-5 h-5 ${
                  activeTable === "analytics" ? "text-[#fa5b00]" : ""
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M11 17a1 1 0 001 1h1a1 1 0 001-1v-4a1 1 0 00-1-1h-1a1 1 0 00-1 1v4zm-4 4a1 1 0 001 1h1a1 1 0 001-1v-8a1 1 0 00-1-1h-1a1 1 0 00-1 1v8zm8-8a1 1 0 011 1v2a1 1 0 01-1 1h-1a1 1 0 01-1-1v-2a1 1 0 011-1h1zm4-4a1 1 0 011 1v10a1 1 0 01-1 1h-1a1 1 0 01-1-1V10a1 1 0 011-1h1z"
                />
              </svg>
              <span className="capitalize">Analytics</span>
            </button>
          </div>
        </nav>
      </div>
      {/* User Profile */}
      <div className="p-4 border-t border-[#333]">
        <div className="flex items-center space-x-3 p-3 bg-[#fa5b00]/5 rounded-lg">
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#fa5b00] to-[#d44d00] flex items-center justify-center text-white font-semibold shadow-md">
            {user?.email?.[0]?.toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm text-white truncate">{user?.email}</p>
            <p className="text-xs text-[#888]">Admin</p>
          </div>
          <button
            onClick={handleSignOut}
            className="p-2 text-[#888] hover:text-white transition-colors duration-200"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
              />
            </svg>
          </button>
        </div>
      </div>
    </aside>
  );
}
