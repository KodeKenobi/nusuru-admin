import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { supabase } from "@/lib/supabase";
import NotificationTemplateForm from "@/components/forms/NotificationTemplateForm";

type NotificationType = "basic" | "rich" | "interactive";

interface NotificationTemplate {
  id: string;
  title: string;
  body: string;
  image_url?: string;
  button_text?: string;
  button_link?: string;
  screen?: string;
  params?: any;
  notification_type: NotificationType;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

interface NotificationTemplatesProps {
  currentData: NotificationTemplate[];
  formatDate: (date: string | null) => string;
}

export default function NotificationTemplates({
  currentData: initialData,
  formatDate,
}: NotificationTemplatesProps) {
  const [templates, setTemplates] = useState<NotificationTemplate[]>(
    initialData || []
  );
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [isToggling, setIsToggling] = useState<string | null>(null);

  useEffect(() => {
    fetchTemplates();
  }, []);

  const fetchTemplates = async () => {
    try {
      const { data, error } = await supabase
        .from("notification_templates")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setTemplates(data || []);
    } catch (error) {
      console.error("Error fetching templates:", error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this template?")) return;

    try {
      setIsDeleting(id);
      const { error } = await supabase
        .from("notification_templates")
        .delete()
        .eq("id", id);

      if (error) throw error;
      await fetchTemplates();
    } catch (error) {
      console.error("Error deleting template:", error);
    } finally {
      setIsDeleting(null);
    }
  };

  const handleToggleActive = async (id: string, currentStatus: boolean) => {
    try {
      setIsToggling(id);
      const { error } = await supabase
        .from("notification_templates")
        .update({ is_active: !currentStatus })
        .eq("id", id);

      if (error) throw error;
      await fetchTemplates();
    } catch (error) {
      console.error("Error toggling template status:", error);
    } finally {
      setIsToggling(null);
    }
  };

  return (
    <div className="p-6">
      {/* Create Template Form */}
      <div className="mb-8">
        <NotificationTemplateForm onSuccess={fetchTemplates} />
      </div>

      {/* Templates List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {templates.length === 0 ? (
          <div className="col-span-full text-center text-gray-400 py-8">
            No notification templates found.
          </div>
        ) : (
          templates.map((template) => (
            <motion.div
              key={template.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-[#0a0a0a] rounded-xl border border-[#1a1a1a] p-4"
            >
              <div className="space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-semibold text-white">
                      {template.title}
                    </h3>
                    <p className="text-sm text-[#888]">{template.body}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() =>
                        handleToggleActive(template.id, template.is_active)
                      }
                      disabled={isToggling === template.id}
                      className={`px-2 py-1 text-xs rounded transition-colors ${
                        template.is_active
                          ? "bg-green-900 text-green-300 hover:bg-green-800"
                          : "bg-red-900 text-red-300 hover:bg-red-800"
                      } ${
                        isToggling === template.id
                          ? "opacity-50 cursor-not-allowed"
                          : ""
                      }`}
                    >
                      {isToggling === template.id ? (
                        <svg
                          className="animate-spin h-4 w-4"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                      ) : template.is_active ? (
                        "Active"
                      ) : (
                        "Inactive"
                      )}
                    </button>
                    <button
                      onClick={() => handleDelete(template.id)}
                      disabled={isDeleting === template.id}
                      className={`p-1 text-red-500 hover:text-red-400 transition-colors ${
                        isDeleting === template.id
                          ? "opacity-50 cursor-not-allowed"
                          : ""
                      }`}
                    >
                      {isDeleting === template.id ? (
                        <svg
                          className="animate-spin h-4 w-4"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                      ) : (
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
                      )}
                    </button>
                  </div>
                </div>

                {template.image_url && (
                  <div className="relative h-40 rounded-lg overflow-hidden">
                    <img
                      src={template.image_url}
                      alt="Notification"
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}

                {template.button_text && template.button_link && (
                  <a
                    href={template.button_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full text-center bg-[#fa5b00] text-white px-4 py-2 rounded-md hover:bg-[#d44d00] transition-colors"
                  >
                    {template.button_text}
                  </a>
                )}

                {template.screen && (
                  <div className="text-sm text-[#888]">
                    Screen: {template.screen}
                  </div>
                )}
                {template.params && (
                  <div className="text-sm text-[#888]">
                    Params: {JSON.stringify(template.params)}
                  </div>
                )}
                <div className="text-xs text-[#aaa]">
                  Created: {formatDate(template.created_at)}
                </div>
                <div className="text-xs text-[#aaa]">
                  Type: {template.notification_type}
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}
