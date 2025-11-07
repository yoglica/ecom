// components/ProductCard.tsx
"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import { useCart } from "@/context/CartContext";
import { Product } from "@/types/Product";
import { Timestamp } from "firebase/firestore";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();
  const router = useRouter();

  const mainImage = product.images && product.images.length > 0 
    ? product.images[0].url 
    : "/placeholder.png";
  
  const safeProduct = {
    id: product.id!,
    name: product.name || "",
    price: product.price || 0,
    images: product.images || [],
    previousPrice: product.previousPrice ?? null,
    discountPercent: product.discountPercent ?? null,
    weight: product.weight ?? null,
    specifications: product.specifications ?? [],
    meta: product.meta ?? { title: "", description: "", keywords: "", url: "" },
    createdAt: product.createdAt ?? Timestamp.now(),
  };

  const handleCardClick = () => {
    if (product.meta?.url) {
      router.push(`/${product.meta.url}`);
    } else {
      router.push(`/${product.id}`);
    }
  };

  return (
    <div className="card h-100 border-0 shadow-sm hover-shadow transition-all">
      {/* Image Container */}
      <div 
        className="position-relative bg-light cursor-pointer d-flex align-items-center justify-content-center overflow-hidden"
        style={{ height: '200px' }}
        onClick={handleCardClick}
      >
        <Image
          src={mainImage}
          alt={product.name || "Product"}
          width={200}
          height={200}
          className="img-fluid p-2"
          style={{ 
            width: 'auto', 
            height: 'auto',
            maxWidth: '100%',
            maxHeight: '100%',
            objectFit: 'contain'
          }}
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = "/placeholder.png";
          }}
        />
        {product.discountPercent && product.discountPercent > 0 && (
          <div className="position-absolute top-0 end-0 bg-danger text-white small fw-bold px-2 py-1 rounded-start">
            {product.discountPercent}% OFF
          </div>
        )}
      </div>
      
      {/* Content Container */}
      <div className="card-body d-flex flex-column">
        <h5 
          className="card-title fw-semibold text-dark mb-2 cursor-pointer text-decoration-hover"
          style={{ 
            minHeight: '48px',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden'
          }}
          onClick={handleCardClick}
        >
          {product.name || "Unnamed Product"}
        </h5>
        
        {/* Price Section */}
        <div className="mb-2">
          <p className="text-success fw-bold h5 mb-1">
            ${product.price?.toFixed(2) ?? "0.00"}
          </p>
          {product.previousPrice && product.previousPrice > product.price && (
            <p className="text-muted small text-decoration-line-through mb-0">
              ${product.previousPrice.toFixed(2)}
            </p>
          )}
        </div>

        {/* Weight - Only show if available */}
        {product.weight && (
          <p className="text-muted small mb-3">
            Weight: {product.weight.value} {product.weight.unit}
          </p>
        )}

        {/* Add to Cart Button - Pushed to bottom */}
        <div className="mt-auto pt-2">
          <button
            className="btn btn-success w-100 fw-medium"
            onClick={(e) => {
              e.stopPropagation();
              addToCart(safeProduct);
            }}
          >
            Add to Cart
          </button>
        </div>
      </div>

      <style jsx>{`
        .hover-shadow:hover {
          box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15) !important;
          transform: translateY(-2px);
          transition: all 0.3s ease;
        }
        .cursor-pointer {
          cursor: pointer;
        }
        .text-decoration-hover:hover {
          color: #0d6efd !important;
          text-decoration: underline;
        }
      `}</style>
    </div>
  );
}