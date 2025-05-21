"use client";

import { supabase, supabaseAdmin } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import Sidebar from "./Sidebar";
import MainContent from "./MainContent";

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState<any[]>([]);
  const [tables, setTables] = useState<{ table_name: string }[]>([]);
  const [activeTable, setActiveTable] = useState<string>("users");
  const [tableData, setTableData] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [currentPage, setCurrentPage] = useState(1);
  const [editingUser, setEditingUser] = useState<any>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isServicesOpen, setIsServicesOpen] = useState(false);
  const [isProductsOpen, setIsProductsOpen] = useState(false);
  const [isProvidersOpen, setIsProvidersOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const usersPerPage = 3;

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "Never";
    const date = new Date(dateString);
    return date.toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const fetchTableData = async (tableName: string) => {
    try {
      setLoading(true);
      if (tableName === "analytics") {
        // Aggregate analytics data
        const now = new Date();
        const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        const isoSevenDaysAgo = sevenDaysAgo.toISOString();

        // Fetch counts and active users
        const [
          { count: usersCount },
          { count: sellersCount },
          { count: providersCount },
          { count: productsCount },
          { count: servicesCount },
          { data: authUsers },
          { data: signInData },
        ] = await Promise.all([
          supabase.from("users").select("id", { count: "exact", head: true }),
          supabase
            .from("providers")
            .select("id", { count: "exact", head: true })
            .eq("provider_type", "seller"),
          supabase
            .from("providers")
            .select("id", { count: "exact", head: true })
            .eq("provider_type", "service_provider"),
          supabase
            .from("products")
            .select("id", { count: "exact", head: true }),
          supabase
            .from("services")
            .select("id", { count: "exact", head: true }),
          supabaseAdmin.auth.admin.listUsers(),
          supabase
            .from("users")
            .select("last_sign_in_at")
            .gte("last_sign_in_at", isoSevenDaysAgo),
        ]);

        // Calculate active users count from auth data
        const activeUsersCount =
          authUsers?.users?.filter((user) => {
            if (!user.last_sign_in_at) return false;
            const lastSignIn = new Date(user.last_sign_in_at);
            const sevenDaysAgo = new Date(isoSevenDaysAgo);
            return lastSignIn >= sevenDaysAgo;
          }).length || 0;

        console.log("Debug - Active Users:", {
          authUsers: authUsers?.users,
          activeUsersCount,
          isoSevenDaysAgo,
        });

        // Aggregate busy times (by hour, last 7 days)
        const busyTimes = Array(24).fill(0);
        (signInData || []).forEach((row) => {
          if (row.last_sign_in_at) {
            const date = new Date(row.last_sign_in_at);
            const hour = date.getHours();
            busyTimes[hour]++;
          }
        });

        setTableData([
          {
            users: usersCount || 0,
            sellers: sellersCount || 0,
            providers: providersCount || 0,
            products: productsCount || 0,
            services: servicesCount || 0,
            activeUsers: activeUsersCount || 0,
            busyTimes,
          },
        ]);
        return;
      } else if (tableName === "users") {
        // Get auth users for last sign in
        const { data: authUsers } = await supabaseAdmin.auth.admin.listUsers();

        // Get custom users
        const { data: usersData, error } = await supabase
          .from("users")
          .select("*");
        if (error) throw error;

        // Combine auth data with custom users
        const combinedUsers =
          usersData?.map((user) => ({
            ...user,
            last_sign_in_at: authUsers?.users?.find(
              (auth) => auth.email === user.email
            )?.last_sign_in_at,
          })) || [];

        setTableData(combinedUsers);
      } else if (tableName === "providers" || tableName === "sellers") {
        const { data, error } = await supabase
          .from("providers")
          .select("*")
          .eq(
            "provider_type",
            tableName === "providers" ? "service_provider" : "seller"
          );

        if (error) throw error;
        setTableData(data || []);
      } else if (tableName === "products") {
        // Fetch products and product_images
        const { data: products, error: productsError } = await supabase
          .from("products")
          .select("*");
        const { data: productImages, error: imagesError } = await supabase
          .from("product_images")
          .select("*");
        // Fetch sellers (users)
        const { data: sellers, error: sellersError } = await supabase
          .from("users")
          .select("id, first_name, last_name, phone");
        // Fetch providers
        const { data: providers, error: providersError } = await supabase
          .from("providers")
          .select("id, first_name, last_name, phone_number, email");

        if (productsError) throw productsError;
        if (imagesError) throw imagesError;
        if (sellersError) throw sellersError;
        if (providersError) throw providersError;

        // Attach images array, seller info, and provider info to each product
        const productsWithImages = (products || []).map((product) => {
          const seller = (sellers || []).find(
            (u) => u.id === product.seller_id
          );
          const provider = (providers || []).find(
            (p) => p.id === product.provider_id
          );
          return {
            ...product,
            images: (productImages || [])
              .filter((img) => img.product_id === product.id)
              .map((img) => img.image_url),
            seller_name: seller
              ? `${seller.first_name || ""} ${seller.last_name || ""}`.trim()
              : null,
            seller_phone: seller ? seller.phone : null,
            provider_name: provider
              ? `${provider.first_name || ""} ${
                  provider.last_name || ""
                }`.trim()
              : null,
            provider_phone: provider ? provider.phone_number : null,
            provider_email: provider ? provider.email : null,
          };
        });

        setTableData(productsWithImages);
      } else if (tableName === "services") {
        console.log("Fetching services data...");
        // Fetch services and service_images
        const { data: services, error: servicesError } = await supabase
          .from("services")
          .select("*");
        const { data: serviceImages, error: imagesError } = await supabase
          .from("service_images")
          .select("*");
        // Fetch providers
        const { data: providers, error: providersError } = await supabase
          .from("providers")
          .select("id, first_name, last_name, phone_number, email");

        console.log("Services data:", services);
        console.log("Service images:", serviceImages);
        console.log("Providers data:", providers);

        if (servicesError) throw servicesError;
        if (imagesError) throw imagesError;
        if (providersError) throw providersError;

        // Attach images array and provider info to each service
        const servicesWithImages = (services || []).map((service) => {
          const provider = (providers || []).find(
            (p) => p.id === service.provider_id
          );
          return {
            ...service,
            images: (serviceImages || [])
              .filter((img) => img.service_id === service.id)
              .map((img) => img.image_url),
            provider_name: provider
              ? `${provider.first_name || ""} ${
                  provider.last_name || ""
                }`.trim()
              : null,
            provider_phone: provider ? provider.phone_number : null,
            provider_email: provider ? provider.email : null,
          };
        });

        console.log("Services with images:", servicesWithImages);
        setTableData(servicesWithImages);
      } else if (tableName === "notifications") {
        // Fetch push tokens for notifications section
        const { data: pushTokens, error } = await supabase
          .from("push_tokens")
          .select("*");
        if (error) throw error;
        setTableData(pushTokens || []);
      } else if (tableName === "notification_templates") {
        // Fetch notification templates
        const { data: templates, error } = await supabase
          .from("notification_templates")
          .select("*")
          .order("created_at", { ascending: false });
        if (error) throw error;
        setTableData(templates || []);
      } else {
        const { data, error } = await supabase.from(tableName).select("*");
        if (error) throw error;
        setTableData(data || []);
      }
    } catch (error) {
      console.error(`Error fetching ${tableName}:`, error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTableData(activeTable);
  }, [activeTable]);

  useEffect(() => {
    const getUser = async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (!user) {
          await router.replace("/");
          return;
        }
        setUser(user);
      } catch (error) {
        console.error("Error fetching user:", error);
        await router.replace("/");
      } finally {
        setLoading(false);
      }
    };

    const fetchData = async () => {
      try {
        // Get all tables
        const { data: tablesData, error: tablesError } = await supabase.rpc(
          "get_tables"
        );
        if (tablesError) throw tablesError;

        // Filter out push_tokens from the tables list
        const filteredTables = (tablesData || []).filter(
          (table: { table_name: string }) => table.table_name !== "push_tokens"
        );
        setTables(filteredTables);

        // Get auth users for last sign in
        const { data: authUsers } = await supabaseAdmin.auth.admin.listUsers();
        console.log("Auth users:", authUsers);

        // Get custom users
        const { data: usersData } = await supabase.from("users").select("*");
        console.log("Custom users:", usersData);

        // Combine auth data with custom users
        const combinedUsers =
          usersData?.map((user) => ({
            ...user,
            last_sign_in_at: authUsers?.users?.find(
              (auth) => auth.email === user.email
            )?.last_sign_in_at,
          })) || [];

        setUsers(combinedUsers);
      } catch (error) {
        console.error("Error:", error);
      }
    };

    // Debug: Fetch and log products and product_images tables
    const debugFetchProductsAndImages = async () => {
      const { data: products, error: productsError } = await supabase
        .from("products")
        .select("*");
      const { data: productImages, error: imagesError } = await supabase
        .from("product_images")
        .select("*");
      if (productsError) console.error("Products fetch error:", productsError);
      if (imagesError)
        console.error("Product images fetch error:", imagesError);
      console.log("DEBUG products table:", products);
      console.log("DEBUG product_images table:", productImages);
    };

    getUser();
    fetchData();
    debugFetchProductsAndImages();
  }, [router]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

  const handleDeleteUser = async (userId: string) => {
    const userToDelete = users.find((u) => u.id === userId);
    const confirmed = window.confirm(
      `Are you sure you want to delete the user ${
        userToDelete?.email || userId
      }?\n\n` + "This action cannot be undone."
    );

    if (!confirmed) return;

    try {
      setLoading(true);
      const { error } = await supabase.from("users").delete().eq("id", userId);

      if (error) throw error;

      // Refresh the users list
      const { data: usersData } = await supabase.from("users").select("*");
      setUsers(usersData || []);

      // Show success message
      alert("User deleted successfully");
    } catch (error) {
      console.error("Error deleting user:", error);
      alert("Failed to delete user. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleEditUser = (user: any) => {
    setEditingUser(user);
    setIsEditModalOpen(true);
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;

    try {
      setLoading(true);
      const { error } = await supabase
        .from("users")
        .update({
          display_name: editingUser.display_name,
          phone: editingUser.phone,
        })
        .eq("id", editingUser.id);

      if (error) throw error;

      // Refresh users list
      const { data: usersData } = await supabase.from("users").select("*");
      setUsers(usersData || []);

      // Close modal and show success message
      setIsEditModalOpen(false);
      setEditingUser(null);
      alert("User updated successfully");
    } catch (error) {
      console.error("Error updating user:", error);
      alert("Failed to update user. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleExportUsers = () => {
    const headers = ["ID", "Email", "Created At", "Last Sign In"];
    const csvContent = [
      headers.join(","),
      ...users.map((user) =>
        [
          user.id,
          user.email || "No Email",
          user.created_at,
          user.last_sign_in_at,
        ].join(",")
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "users-export.csv";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  const filteredData = tableData.filter((item) => {
    const searchableFields = Object.values(item).join(" ").toLowerCase();
    return searchableFields.includes(searchQuery.toLowerCase());
  });

  // Calculate pagination
  const totalPages = Math.ceil(filteredData.length / usersPerPage);
  const startIndex = (currentPage - 1) * usersPerPage;
  const endIndex = startIndex + usersPerPage;
  const currentData = filteredData.slice(startIndex, endIndex);

  // Reset to first page when search query changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#101010]">
        <div className="text-lg text-white">Loading...</div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-black font-sans">
      <div
        className={`transition-all duration-300 ${
          isSidebarOpen ? "w-64" : "w-0"
        }`}
      >
        <Sidebar
          user={user}
          tables={tables}
          activeTable={activeTable}
          setActiveTable={setActiveTable}
          isServicesOpen={isServicesOpen}
          setIsServicesOpen={setIsServicesOpen}
          isProductsOpen={isProductsOpen}
          setIsProductsOpen={setIsProductsOpen}
          isProvidersOpen={isProvidersOpen}
          setIsProvidersOpen={setIsProvidersOpen}
          handleSignOut={handleSignOut}
          isOpen={isSidebarOpen}
        />
      </div>

      <div className="flex-1 flex flex-col h-full">
        <MainContent
          user={user}
          activeTable={activeTable}
          loading={loading}
          filteredData={filteredData}
          currentData={currentData}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          totalPages={totalPages}
          startIndex={startIndex}
          endIndex={endIndex}
          handleDeleteUser={handleDeleteUser}
          handleEditUser={handleEditUser}
          handleExportUsers={handleExportUsers}
          formatDate={formatDate}
          toggleSidebar={toggleSidebar}
          isSidebarOpen={isSidebarOpen}
        />
      </div>

      {/* Edit Modal */}
      {isEditModalOpen && editingUser && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-[#0a0a0a] rounded-xl border border-[#1a1a1a] p-6 w-full max-w-md">
            <h3 className="text-xl font-semibold text-white mb-4">Edit User</h3>
            <form onSubmit={handleSaveEdit}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-[#666] mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    value={editingUser.email || ""}
                    onChange={(e) =>
                      setEditingUser({ ...editingUser, email: e.target.value })
                    }
                    className="w-full bg-[#0a0a0a] text-white border border-[#1a1a1a] rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-[#fa5b00]/80 focus:border-[#fa5b00]"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm text-[#666] mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={editingUser.display_name || ""}
                    onChange={(e) =>
                      setEditingUser({
                        ...editingUser,
                        display_name: e.target.value,
                      })
                    }
                    className="w-full bg-[#0a0a0a] text-white border border-[#1a1a1a] rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-[#fa5b00]/80 focus:border-[#fa5b00]"
                  />
                </div>
                <div>
                  <label className="block text-sm text-[#666] mb-1">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={editingUser.phone || ""}
                    onChange={(e) =>
                      setEditingUser({ ...editingUser, phone: e.target.value })
                    }
                    className="w-full bg-[#0a0a0a] text-white border border-[#1a1a1a] rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-[#fa5b00]/80 focus:border-[#fa5b00]"
                  />
                </div>
                <div className="flex justify-end space-x-3 mt-6">
                  <button
                    type="button"
                    onClick={() => {
                      setIsEditModalOpen(false);
                      setEditingUser(null);
                    }}
                    className="px-4 py-2 text-[#666] hover:text-white transition-colors duration-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-[#fa5b00] text-white rounded-md hover:bg-[#d44d00] transition-colors duration-200"
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
