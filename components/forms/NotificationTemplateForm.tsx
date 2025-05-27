import { useState } from "react";
import { motion } from "framer-motion";
import { supabase } from "@/lib/supabase";
import Image from "next/image";

type NotificationType = "basic" | "rich" | "interactive" | "critical";

interface NotificationTemplateFormProps {
  onSuccess: () => void;
}

export default function NotificationTemplateForm({
  onSuccess,
}: NotificationTemplateFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    body: "",
    image_url: "",
    button_text: "",
    button_link: "",
    screen: "",
    params: "",
    notification_type: "basic" as NotificationType,
    required_version: "",
    is_active: true,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isUploading, setIsUploading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = "Title is required";
    }
    if (!formData.body.trim()) {
      newErrors.body = "Body is required";
    }
    if (formData.button_text && !formData.button_link) {
      newErrors.button_link =
        "Button link is required when button text is provided";
    }
    if (formData.button_link && !formData.button_text) {
      newErrors.button_text =
        "Button text is required when button link is provided";
    }
    if (
      formData.notification_type === "critical" &&
      !formData.required_version.trim()
    ) {
      newErrors.required_version =
        "Required version is mandatory for critical notifications";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      const { error } = await supabase.from("notification_templates").insert({
        ...formData,
        params: formData.params ? JSON.parse(formData.params) : null,
      });

      if (error) throw error;

      // Reset form
      setFormData({
        title: "",
        body: "",
        image_url: "",
        button_text: "",
        button_link: "",
        screen: "",
        params: "",
        notification_type: "basic",
        required_version: "",
        is_active: true,
      });
      setErrors({});
      onSuccess();
    } catch (error) {
      console.error("Error creating notification template:", error);
      setErrors({ submit: "Failed to create notification template" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Preview the image
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);

    // Upload to Supabase Storage
    try {
      setIsUploading(true);
      const fileExt = file.name.split(".").pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = fileName;

      // Upload the file
      const { error: uploadError, data } = await supabase.storage
        .from("notification-images")
        .upload(filePath, file, {
          cacheControl: "3600",
          upsert: false,
        });

      if (uploadError) {
        console.error("Upload error:", uploadError);
        throw uploadError;
      }

      // Get public URL
      const {
        data: { publicUrl },
      } = supabase.storage.from("notification-images").getPublicUrl(filePath);

      setFormData((prev) => ({ ...prev, image_url: publicUrl }));
    } catch (error) {
      console.error("Error uploading image:", error);
      setErrors((prev) => ({
        ...prev,
        image:
          error instanceof Error ? error.message : "Failed to upload image",
      }));
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-[#0a0a0a] rounded-xl border border-[#1a1a1a] p-6"
    >
      <h2 className="text-xl font-semibold text-white mb-6">
        Create Notification Template
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Title *
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className={`w-full px-3 py-2 bg-[#1a1a1a] border rounded-md text-white focus:outline-none focus:ring-2 focus:ring-[#fa5b00] ${
                errors.title ? "border-red-500" : "border-[#333]"
              }`}
              placeholder="Enter notification title"
            />
            {errors.title && (
              <p className="mt-1 text-sm text-red-500">{errors.title}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Type
            </label>
            <select
              name="notification_type"
              value={formData.notification_type}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-[#1a1a1a] border border-[#333] rounded-md text-white focus:outline-none focus:ring-2 focus:ring-[#fa5b00]"
            >
              <option value="basic">Basic</option>
              <option value="rich">Rich</option>
              <option value="interactive">Interactive</option>
              <option value="critical">Critical</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            Body *
          </label>
          <textarea
            name="body"
            value={formData.body}
            onChange={handleChange}
            rows={3}
            className={`w-full px-3 py-2 bg-[#1a1a1a] border rounded-md text-white focus:outline-none focus:ring-2 focus:ring-[#fa5b00] ${
              errors.body ? "border-red-500" : "border-[#333]"
            }`}
            placeholder="Enter notification body"
          />
          {errors.body && (
            <p className="mt-1 text-sm text-red-500">{errors.body}</p>
          )}
        </div>

        {formData.notification_type !== "basic" && (
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Image
            </label>
            <div className="space-y-2">
              <div
                className="relative w-full h-48 rounded-lg overflow-hidden border-2 border-dashed border-[#333] bg-[#0a0a0a] group cursor-pointer hover:border-[#fa5b00] transition-colors"
                onClick={() => document.getElementById("image-upload")?.click()}
              >
                {imagePreview ? (
                  <>
                    <Image
                      src={imagePreview}
                      alt="Preview"
                      fill
                      className="object-contain transition-transform duration-300 group-hover:scale-150"
                      sizes="(max-width: 768px) 100vw, 400px"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-opacity flex items-center justify-center">
                      <span className="text-white opacity-0 group-hover:opacity-100 transition-opacity">
                        Click to change image
                      </span>
                    </div>
                  </>
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center bg-[#1a1a1a]">
                    <svg
                      className="w-12 h-12 text-[#666] mb-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                    <span className="text-[#666]">Click to upload image</span>
                  </div>
                )}
              </div>
              <input
                id="image-upload"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
                disabled={isUploading}
              />
              {isUploading && (
                <div className="flex items-center space-x-2 text-[#fa5b00]">
                  <svg
                    className="animate-spin h-5 w-5"
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
                  <span>Uploading image...</span>
                </div>
              )}
              {errors.image && (
                <p className="text-sm text-red-500">{errors.image}</p>
              )}
            </div>
          </div>
        )}

        {formData.notification_type === "rich" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Button Text
              </label>
              <input
                type="text"
                name="button_text"
                value={formData.button_text}
                onChange={handleChange}
                className={`w-full px-3 py-2 bg-[#1a1a1a] border rounded-md text-white focus:outline-none focus:ring-2 focus:ring-[#fa5b00] ${
                  errors.button_text ? "border-red-500" : "border-[#333]"
                }`}
                placeholder="Enter button text"
              />
              {errors.button_text && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.button_text}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Button Link
              </label>
              <input
                type="url"
                name="button_link"
                value={formData.button_link}
                onChange={handleChange}
                className={`w-full px-3 py-2 bg-[#1a1a1a] border rounded-md text-white focus:outline-none focus:ring-2 focus:ring-[#fa5b00] ${
                  errors.button_link ? "border-red-500" : "border-[#333]"
                }`}
                placeholder="Enter button link"
              />
              {errors.button_link && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.button_link}
                </p>
              )}
            </div>
          </div>
        )}

        {formData.notification_type === "interactive" && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Button Text
                </label>
                <input
                  type="text"
                  name="button_text"
                  value={formData.button_text}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 bg-[#1a1a1a] border rounded-md text-white focus:outline-none focus:ring-2 focus:ring-[#fa5b00] ${
                    errors.button_text ? "border-red-500" : "border-[#333]"
                  }`}
                  placeholder="Enter button text"
                />
                {errors.button_text && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.button_text}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Button Link
                </label>
                <input
                  type="url"
                  name="button_link"
                  value={formData.button_link}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 bg-[#1a1a1a] border rounded-md text-white focus:outline-none focus:ring-2 focus:ring-[#fa5b00] ${
                    errors.button_link ? "border-red-500" : "border-[#333]"
                  }`}
                  placeholder="Enter button link"
                />
                {errors.button_link && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.button_link}
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Screen
                </label>
                <input
                  type="text"
                  name="screen"
                  value={formData.screen}
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-[#1a1a1a] border border-[#333] rounded-md text-white focus:outline-none focus:ring-2 focus:ring-[#fa5b00]"
                  placeholder="Enter screen name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Params (JSON)
                </label>
                <input
                  type="text"
                  name="params"
                  value={formData.params}
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-[#1a1a1a] border border-[#333] rounded-md text-white focus:outline-none focus:ring-2 focus:ring-[#fa5b00]"
                  placeholder='{"key": "value"}'
                />
              </div>
            </div>
          </>
        )}

        {formData.notification_type === "critical" && (
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Required Version *
            </label>
            <input
              type="text"
              name="required_version"
              value={formData.required_version}
              onChange={handleChange}
              className={`w-full px-3 py-2 bg-[#1a1a1a] border rounded-md text-white focus:outline-none focus:ring-2 focus:ring-[#fa5b00] ${
                errors.required_version ? "border-red-500" : "border-[#333]"
              }`}
              placeholder="Enter required version (e.g. 2.0.1)"
            />
            {errors.required_version && (
              <p className="mt-1 text-sm text-red-500">
                {errors.required_version}
              </p>
            )}
          </div>
        )}

        <div className="flex items-center">
          <input
            type="checkbox"
            name="is_active"
            checked={formData.is_active}
            onChange={handleChange}
            className="h-4 w-4 text-[#fa5b00] focus:ring-[#fa5b00] border-[#333] rounded"
          />
          <label className="ml-2 block text-sm text-gray-300">Active</label>
        </div>

        {errors.submit && (
          <p className="text-sm text-red-500">{errors.submit}</p>
        )}

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isSubmitting || isUploading}
            className={`px-4 py-2 bg-[#fa5b00] text-white rounded-md hover:bg-[#d44d00] transition-colors ${
              isSubmitting || isUploading ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {isSubmitting ? "Creating..." : "Create Template"}
          </button>
        </div>
      </form>
    </motion.div>
  );
}
