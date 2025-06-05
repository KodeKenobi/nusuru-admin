import { motion } from "framer-motion";
import Image from "next/image";
import { useState } from "react";
import { supabase } from "@/lib/supabase";

interface SellersProps {
  currentData: any[];
  handleDeleteUser: (id: string) => void;
  handleEditUser: (user: any) => void;
  formatDate: (date: string | null) => string;
}

export default function Sellers({
  currentData,
  handleDeleteUser,
  handleEditUser,
  formatDate,
}: SellersProps) {
  const [selectedImage, setSelectedImage] = useState<{
    url: string;
    alt: string;
  } | null>(null);
  const [loadingId, setLoadingId] = useState<string | null>(null);

  // Approve seller
  const handleApprove = async (sellerId: string) => {
    setLoadingId(sellerId);
    await supabase
      .from("providers")
      .update({ approved: true })
      .eq("id", sellerId);
    setLoadingId(null);
    window.location.reload(); // Or refetch data if you have a better way
  };

  // Decline seller
  const handleDecline = async (sellerId: string) => {
    const confirmed = window.confirm(
      "Are you sure you want to decline this seller?"
    );
    if (!confirmed) return;
    setLoadingId(sellerId);
    await supabase
      .from("providers")
      .update({ approved: false })
      .eq("id", sellerId);
    setLoadingId(null);
    window.location.reload(); // Or refetch data if you have a better way
  };

  return (
    <div className="w-full max-w-[calc(100vw-300px)] mx-auto px-4">
      {/* Image Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative w-full max-w-4xl h-[80vh] rounded-lg overflow-hidden">
            <Image
              src={selectedImage.url}
              alt={selectedImage.alt}
              fill
              className="object-contain"
              sizes="(max-width: 1024px) 100vw, 1024px"
            />
            <button
              className="absolute top-4 right-4 text-white bg-black/50 hover:bg-black/70 rounded-full p-2 transition-colors"
              onClick={() => setSelectedImage(null)}
            >
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
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 gap-4">
        {currentData.map((seller) => (
          <motion.div
            key={seller.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="bg-[#1a1a1a]/60 backdrop-blur-md rounded-xl border border-[#333] shadow-lg hover:shadow-[#fa5b00]/50 transition-all duration-300"
          >
            <div className="p-6">
              <div className="flex items-center space-x-4 mb-6">
                <div className="flex-1 min-w-0">
                  <h3 className="text-base font-semibold text-white truncate">
                    {seller.first_name} {seller.last_name}
                  </h3>
                  <p className="text-xs text-[#666]">ID: {seller.id}</p>
                </div>
              </div>

              {/* Images Comparison */}
              <div className="mb-6">
                <h4 className="text-sm text-[#666] mb-2">
                  Identity Verification
                </h4>
                <div className="grid grid-cols-2 gap-4">
                  {/* Profile Picture */}
                  <div>
                    <p className="text-xs text-[#666] mb-2">Profile Picture</p>
                    <div
                      className="relative w-full h-64 rounded-lg overflow-hidden border-2 border-[#333] bg-[#0a0a0a] group cursor-pointer"
                      onClick={() =>
                        seller.profile_picture_url &&
                        setSelectedImage({
                          url: seller.profile_picture_url,
                          alt: `${seller.first_name}'s profile`,
                        })
                      }
                    >
                      {seller.profile_picture_url ? (
                        <Image
                          src={seller.profile_picture_url}
                          alt={`${seller.first_name}'s profile`}
                          fill
                          className="object-contain transition-transform duration-300 group-hover:scale-150"
                          sizes="(max-width: 768px) 100vw, 400px"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-tr from-[#fa5b00] to-[#d44d00]">
                          <span className="text-white text-4xl font-semibold">
                            {seller.first_name?.[0]?.toUpperCase() || "?"}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* ID Document */}
                  <div>
                    <p className="text-xs text-[#666] mb-2">ID Document</p>
                    <div
                      className="relative w-full h-64 rounded-lg overflow-hidden border-2 border-[#333] bg-[#0a0a0a] group cursor-pointer"
                      onClick={() =>
                        seller.id_document_url &&
                        setSelectedImage({
                          url: seller.id_document_url,
                          alt: "ID Document",
                        })
                      }
                    >
                      {seller.id_document_url ? (
                        <Image
                          src={seller.id_document_url}
                          alt="ID Document"
                          fill
                          className="object-contain transition-transform duration-300 group-hover:scale-150"
                          sizes="(max-width: 768px) 100vw, 400px"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-[#1a1a1a]">
                          <span className="text-[#666]">No ID document</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between items-center">
                  <span className="text-[#666] text-sm">Email</span>
                  <span className="text-white text-sm">
                    {seller.email || "No email"}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[#666] text-sm">Phone</span>
                  <span className="text-white text-sm">
                    {seller.phone_number || "No phone"}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[#666] text-sm">Location</span>
                  <span className="text-white text-sm">
                    {seller.city}, {seller.province}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[#666] text-sm">Status</span>
                  <span
                    className={`text-sm px-2 py-1 rounded-full ${
                      seller.approved
                        ? "bg-green-500/20 text-green-400"
                        : "bg-yellow-500/20 text-yellow-400"
                    }`}
                  >
                    {seller.approved ? "Approved" : "Pending"}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[#666] text-sm">Created At</span>
                  <span className="text-white text-sm">
                    {formatDate(seller.created_at)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[#666] text-sm">Last Updated</span>
                  <span className="text-white text-sm">
                    {formatDate(seller.updated_at)}
                  </span>
                </div>
              </div>

              {/* Approve/Decline Buttons */}
              <div className="flex space-x-3 mb-4">
                {!seller.approved && (
                  <button
                    onClick={() => handleApprove(seller.id)}
                    disabled={loadingId === seller.id}
                    className="text-sm min-w-[90px] bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md transition-colors duration-200 flex items-center justify-center space-x-2 disabled:opacity-50"
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
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    <span>Approve</span>
                  </button>
                )}
                <button
                  onClick={() => handleDecline(seller.id)}
                  disabled={loadingId === seller.id}
                  className="text-sm min-w-[90px] bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md transition-colors duration-200 flex items-center justify-center space-x-2 disabled:opacity-50"
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
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                  <span>Decline</span>
                </button>
                <div className="flex space-x-3">
                  <button
                    onClick={() => handleEditUser(seller)}
                    className="text-sm min-w-[90px] bg-[#fa5b00] hover:bg-[#d44d00] text-white px-4 py-2 rounded-md transition-colors duration-200 flex items-center justify-center space-x-2"
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
                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                      />
                    </svg>
                    <span>Edit</span>
                  </button>
                  <button
                    onClick={() => handleDeleteUser(seller.id)}
                    className="text-sm min-w-[90px] bg-[#dc2626] hover:bg-[#b91c1c] text-white px-4 py-2 rounded-md transition-colors duration-200 flex items-center justify-center space-x-2"
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
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
