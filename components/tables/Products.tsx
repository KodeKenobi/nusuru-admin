import { useState, useRef } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { supabase } from "@/lib/supabase";

interface ProductsProps {
  currentData: any[];
  handleDeleteUser: (id: string) => void;
  handleEditUser: (product: any) => void;
  formatDate: (date: string | null) => string;
}

export default function Products({
  currentData,
  handleDeleteUser,
  handleEditUser,
  formatDate,
}: ProductsProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<any | null>(null);
  const [sliderIndexes, setSliderIndexes] = useState<{ [key: string]: number }>(
    {}
  );
  const sliderRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  const handleSlider = (
    productId: string,
    direction: "prev" | "next",
    imagesLength: number
  ) => {
    setSliderIndexes((prev) => {
      const current = prev[productId] || 0;
      let nextIdx =
        direction === "prev"
          ? Math.max(current - 1, 0)
          : Math.min(current + 1, imagesLength - 1);
      // Scroll to the image
      const slider = sliderRefs.current[productId];
      if (slider) {
        const child = slider.children[nextIdx] as HTMLElement;
        if (child)
          child.scrollIntoView({ behavior: "smooth", inline: "center" });
      }
      return { ...prev, [productId]: nextIdx };
    });
  };

  const handleApprove = async (product: any) => {
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

  const handleDecline = async (product: any) => {
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
      {currentData.map((product) => {
        const images = product.images || [];
        const currentIndex = sliderIndexes[product.id] || 0;
        return (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-[#0a0a0a] rounded-xl border border-[#1a1a1a] overflow-hidden"
          >
            {/* Product Images Horizontal Slider with Arrows */}
            <div className="relative h-44 bg-[#1a1a1a] overflow-hidden flex items-center">
              {/* Left Arrow */}
              {images.length > 1 && (
                <button
                  onClick={() =>
                    handleSlider(product.id, "prev", images.length)
                  }
                  className="absolute left-2 z-10 bg-black/60 hover:bg-black/80 text-white rounded-full p-1 flex items-center justify-center"
                  style={{ top: "50%", transform: "translateY(-50%)" }}
                  disabled={currentIndex === 0}
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
                      d="M15 19l-7-7 7-7"
                    />
                  </svg>
                </button>
              )}
              <div
                ref={(el) => {
                  sliderRefs.current[product.id] = el;
                }}
                className="flex overflow-x-auto snap-x snap-mandatory h-full w-full scrollbar-hide"
                style={{
                  scrollBehavior: "smooth",
                  msOverflowStyle: "none",
                  scrollbarWidth: "none",
                }}
                onWheel={(e) => {
                  e.currentTarget.scrollLeft += e.deltaY;
                }}
              >
                {images.map((image: string, index: number) => (
                  <div
                    key={index}
                    className="flex-none w-56 h-40 mx-2 snap-center cursor-pointer relative group"
                    onClick={() => {
                      setSelectedImage(image);
                      setSelectedProduct(product);
                    }}
                  >
                    <Image
                      src={image}
                      alt={`${product.name || product.title} - Image ${
                        index + 1
                      }`}
                      fill
                      className="object-cover rounded-lg border border-[#222] group-hover:scale-105 transition-transform duration-200"
                      sizes="224px"
                    />
                  </div>
                ))}
              </div>
              {/* Right Arrow */}
              {images.length > 1 && (
                <button
                  onClick={() =>
                    handleSlider(product.id, "next", images.length)
                  }
                  className="absolute right-2 z-10 bg-black/60 hover:bg-black/80 text-white rounded-full p-1 flex items-center justify-center"
                  style={{ top: "50%", transform: "translateY(-50%)" }}
                  disabled={currentIndex === images.length - 1}
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
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </button>
              )}
              {/* Dots */}
              {images.length > 1 && (
                <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-1 z-10">
                  {images.map((_: string, idx: number) => (
                    <div
                      key={idx}
                      className={`w-2 h-2 rounded-full ${
                        idx === currentIndex ? "bg-white" : "bg-white/50"
                      }`}
                    />
                  ))}
                </div>
              )}
            </div>
            {/* Divider */}
            <div className="border-b border-[#222] mx-4 my-2" />

            {/* Product Info */}
            <div className="p-4 space-y-3">
              <div className="flex justify-between items-start">
                <h3 className="text-lg font-semibold text-white">
                  {product.name || product.title}
                </h3>
                {product.price && (
                  <span className="text-[#fa5b00] font-medium">
                    R
                    {product.price.toLocaleString("en-ZA", {
                      minimumFractionDigits: 2,
                    })}
                  </span>
                )}
              </div>
              <p className="text-[#ccc] text-sm whitespace-pre-line">
                {product.description}
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs text-[#aaa] pt-2">
                {product.condition && (
                  <div>
                    <span className="font-semibold text-[#fa5b00]">
                      Condition:
                    </span>{" "}
                    {product.condition}
                  </div>
                )}
                {product.category && (
                  <div>
                    <span className="font-semibold text-[#fa5b00]">
                      Category:
                    </span>{" "}
                    {product.category}
                  </div>
                )}
                {product.subcategory && (
                  <div>
                    <span className="font-semibold text-[#fa5b00]">
                      Subcategory:
                    </span>{" "}
                    {product.subcategory}
                  </div>
                )}
                {product.provider_id && (
                  <div>
                    <span className="font-semibold text-[#fa5b00]">
                      Provider ID:
                    </span>{" "}
                    {product.provider_id}
                  </div>
                )}
                {product.seller_id && (
                  <div>
                    <span className="font-semibold text-[#fa5b00]">
                      Seller ID:
                    </span>{" "}
                    {product.seller_id}
                  </div>
                )}
                {product.created_at && (
                  <div>
                    <span className="font-semibold text-[#fa5b00]">
                      Created At:
                    </span>{" "}
                    {formatDate(product.created_at)}
                  </div>
                )}
                {product.updated_at && (
                  <div>
                    <span className="font-semibold text-[#fa5b00]">
                      Updated At:
                    </span>{" "}
                    {formatDate(product.updated_at)}
                  </div>
                )}
                {product.id && (
                  <div>
                    <span className="font-semibold text-[#fa5b00]">
                      Product ID:
                    </span>{" "}
                    {product.id}
                  </div>
                )}
                {product.seller_name && (
                  <div>
                    <span className="font-semibold text-[#fa5b00]">
                      Seller Name:
                    </span>{" "}
                    {product.seller_name}
                  </div>
                )}
                {product.seller_phone && (
                  <div>
                    <span className="font-semibold text-[#fa5b00]">
                      Seller Phone:
                    </span>{" "}
                    {product.seller_phone}
                  </div>
                )}
                {product.provider_name && (
                  <div>
                    <span className="font-semibold text-[#fa5b00]">
                      Provider Name:
                    </span>{" "}
                    {product.provider_name}
                  </div>
                )}
                {product.provider_phone && (
                  <div>
                    <span className="font-semibold text-[#fa5b00]">
                      Provider Phone:
                    </span>{" "}
                    {product.provider_phone}
                  </div>
                )}
                {product.provider_email && (
                  <div>
                    <span className="font-semibold text-[#fa5b00]">
                      Provider Email:
                    </span>{" "}
                    {product.provider_email}
                  </div>
                )}
              </div>
              <div className="flex items-center space-x-2">
                {product.category && (
                  <span className="px-2 py-1 text-xs rounded-full bg-[#1a1a1a] text-[#666]">
                    {product.category}
                  </span>
                )}
                {product.status && (
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
                )}
              </div>
              <div className="flex items-center justify-between text-xs text-[#888] pt-2">
                <span>Created: {formatDate(product.created_at)}</span>
                {product.seller_id && <span>Seller: {product.seller_id}</span>}
              </div>
              <div className="flex justify-start space-x-2 pt-2">
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
                  onClick={() => handleEditUser(product)}
                  className="px-3 py-1 text-sm bg-[#fa5b00] text-white rounded-md hover:bg-[#d44d00] transition-colors"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteUser(product.id)}
                  className="px-3 py-1 text-sm bg-[#1a1a1a] text-white rounded-md hover:bg-[#2a2a2a] transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          </motion.div>
        );
      })}

      {/* Image Modal with Slider */}
      {selectedImage && selectedProduct && (
        <ModalImageSlider
          images={selectedProduct.images || []}
          initialImage={selectedImage}
          product={selectedProduct}
          onClose={() => {
            setSelectedImage(null);
            setSelectedProduct(null);
          }}
        />
      )}

      <style jsx global>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}

// ModalImageSlider component
function ModalImageSlider({
  images,
  initialImage,
  product,
  onClose,
}: {
  images: string[];
  initialImage: string;
  product: any;
  onClose: () => void;
}) {
  const initialIndex = Math.max(images.indexOf(initialImage), 0);
  const [modalIndex, setModalIndex] = useState(initialIndex);
  console.log({ images, initialImage, modalIndex });
  const handlePrev = () => setModalIndex((idx) => Math.max(idx - 1, 0));
  const handleNext = () =>
    setModalIndex((idx) => Math.min(idx + 1, images.length - 1));

  return (
    <div
      className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-4xl max-h-[90vh] rounded-lg overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Left Arrow */}
        {images.length > 1 && modalIndex > 0 && (
          <button
            onClick={handlePrev}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10 bg-black/60 hover:bg-black/80 text-white rounded-full p-2"
          >
            <svg
              className="w-8 h-8"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>
        )}
        {/* Image */}
        <div className="relative w-full" style={{ height: "70vh" }}>
          {images[modalIndex] ? (
            <Image
              src={images[modalIndex]}
              alt={product.name || product.title}
              fill
              className="object-contain"
              sizes="(max-width: 1024px) 100vw, 1024px"
            />
          ) : (
            <div className="flex items-center justify-center w-full h-full text-white text-lg">
              No image found
            </div>
          )}
        </div>
        {/* Right Arrow */}
        {images.length > 1 && modalIndex < images.length - 1 && (
          <button
            onClick={handleNext}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 z-10 bg-black/60 hover:bg-black/80 text-white rounded-full p-2"
          >
            <svg
              className="w-8 h-8"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        )}
        {/* Dots */}
        {images.length > 1 && (
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 z-10">
            {images.map((_, idx) => (
              <div
                key={idx}
                className={`w-3 h-3 rounded-full cursor-pointer ${
                  idx === modalIndex ? "bg-white" : "bg-white/50"
                }`}
                onClick={() => setModalIndex(idx)}
              />
            ))}
          </div>
        )}
        {/* Close Button */}
        <button
          className="absolute top-4 right-4 text-white bg-black/50 rounded-full p-2 hover:bg-black/80 transition-colors z-10"
          onClick={onClose}
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
  );
}
