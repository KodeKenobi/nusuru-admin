"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { supabase } from "@/lib/supabase";

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  images: string[];
  category: string;
  created_at: string;
  status: string;
  seller_id: string;
}

interface ProductsProps {
  data: Product[];
  onDelete: (id: string) => void;
  onEdit: (product: Product) => void;
}

export default function Products({ data, onDelete, onEdit }: ProductsProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const handleApprove = async (product: Product) => {
    try {
      const { error } = await supabase
        .from("products")
        .update({ status: "approved" })
        .eq("id", product.id);

      if (error) throw error;
      window.location.reload();
    } catch (error) {
      console.error("Error approving product:", error);
      alert("Failed to approve product");
    }
  };

  const handleDecline = async (product: Product) => {
    try {
      const { error } = await supabase
        .from("products")
        .update({ status: "declined" })
        .eq("id", product.id);

      if (error) throw error;
      window.location.reload();
    } catch (error) {
      console.error("Error declining product:", error);
      alert("Failed to decline product");
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
      {data.map((product) => (
        <motion.div
          key={product.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-[#0a0a0a] rounded-xl border border-[#1a1a1a] overflow-hidden"
        >
          {/* Image Gallery */}
          <div className="relative h-48 bg-[#1a1a1a] overflow-hidden">
            <div className="flex overflow-x-auto snap-x snap-mandatory h-full">
              {product.images.map((image, index) => (
                <div
                  key={index}
                  className="flex-none w-full h-full snap-center cursor-pointer"
                  onClick={() => {
                    setSelectedImage(image);
                    setSelectedProduct(product);
                  }}
                >
                  <Image
                    src={image}
                    alt={`${product.name} - Image ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
            <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-1">
              {product.images.map((_, index) => (
                <div key={index} className="w-2 h-2 rounded-full bg-white/50" />
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="p-4 space-y-3">
            <div className="flex justify-between items-start">
              <h3 className="text-lg font-semibold text-white">
                {product.name}
              </h3>
              <span className="text-[#fa5b00] font-medium">
                ${product.price.toFixed(2)}
              </span>
            </div>

            <p className="text-[#666] text-sm line-clamp-2">
              {product.description}
            </p>

            <div className="flex items-center space-x-2">
              <span className="px-2 py-1 text-xs rounded-full bg-[#1a1a1a] text-[#666]">
                {product.category}
              </span>
              <span
                className={`px-2 py-1 text-xs rounded-full ${
                  product.status === "approved"
                    ? "bg-green-900/20 text-green-400"
                    : product.status === "declined"
                    ? "bg-red-900/20 text-red-400"
                    : "bg-yellow-900/20 text-yellow-400"
                }`}
              >
                {product.status}
              </span>
            </div>

            {/* <div className="">
              {product.status !== "approved" && (
                <button
                  onClick={() => handleApprove(product)}
                  className="px-3 py-1 text-sm bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                >
                  Approve
                </button>
              )}
              <button
                onClick={() => handleDecline(product)}
                className="px-3 py-1 text-sm bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
              >
                Decline
              </button>
              <button
                onClick={() => onEdit(product)}
                className="px-3 py-1 text-sm bg-[#fa5b00] text-white rounded-md hover:bg-[#d44d00] transition-colors"
              >
                Edit
              </button>
              <button
                onClick={() => onDelete(product.id)}
                className="px-3 py-1 text-sm bg-[#1a1a1a] text-white rounded-md hover:bg-[#2a2a2a] transition-colors"
              >
                Delete
              </button>
            </div> */}
          </div>
        </motion.div>
      ))}

      {/* Image Modal */}
      {selectedImage && selectedProduct && (
        <div
          className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={() => {
            setSelectedImage(null);
            setSelectedProduct(null);
          }}
        >
          <div className="relative w-full max-w-4xl max-h-[90vh]">
            <Image
              src={selectedImage}
              alt={selectedProduct.name}
              width={1200}
              height={800}
              className="object-contain w-full h-full"
            />
            <button
              className="absolute top-4 right-4 text-white bg-black/50 rounded-full p-2 hover:bg-black/80 transition-colors"
              onClick={() => {
                setSelectedImage(null);
                setSelectedProduct(null);
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
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
    </div>
  );
}
