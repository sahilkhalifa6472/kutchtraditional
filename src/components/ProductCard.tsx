import React, { useState } from 'react';
import { Heart, Plus } from 'lucide-react';
import { Product } from '../types';

interface ProductCardProps {
  product: Product;
  onSelect: (product: Product) => void;
  isWishlisted: boolean;
  onToggleWishlist: (product: Product, e: React.MouseEvent) => void;
  onQuickAdd?: (product: Product, e: React.MouseEvent) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onSelect,
  isWishlisted,
  onToggleWishlist,
  onQuickAdd,
}) => {
  const [imageLoaded, setImageLoaded] = useState(false);

  return (
    <div
      onClick={() => onSelect(product)}
      className="group relative flex flex-col cursor-pointer transition-all duration-200"
    >
      {/* Image Container Card */}
      <div className="relative aspect-[4/5] w-full rounded-[24px] bg-[#EAECE6] overflow-hidden p-2 flex items-center justify-center border border-[#E3E7DE] shadow-xs group-hover:shadow-md transition-all">
        {/* Skeleton Shimmer until image loads */}
        {!imageLoaded && (
          <div className="absolute inset-0 bg-[#E3E8DC] animate-pulse rounded-[24px]" />
        )}

        {/* Wishlist Heart Button */}
        <button
          onClick={(e) => onToggleWishlist(product, e)}
          aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
          className="absolute top-2.5 right-2.5 z-10 w-8 h-8 rounded-full bg-white/90 backdrop-blur-xs flex items-center justify-center text-[#191F17] hover:bg-white active:scale-90 transition-transform shadow-xs"
        >
          <Heart
            size={16}
            className={`transition-colors ${
              isWishlisted
                ? 'fill-[#E5484D] text-[#E5484D]'
                : 'text-[#626C5C] group-hover:text-[#191F17]'
            }`}
          />
        </button>

        {/* Badge if any */}
        {product.badge && (
          <span className="absolute top-2.5 left-2.5 z-10 px-2 py-0.5 rounded-full bg-[#182115]/75 backdrop-blur-xs text-[10px] font-semibold text-white">
            {product.badge}
          </span>
        )}

        {/* Product Photograph */}
        <img
          src={product.images[0]}
          alt={product.name}
          onLoad={() => setImageLoaded(true)}
          className={`w-full h-full object-cover rounded-[18px] transition-all duration-500 group-hover:scale-105 ${
            imageLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          loading="lazy"
        />

        {/* Quick Add Button overlay */}
        {onQuickAdd && (
          <button
            onClick={(e) => onQuickAdd(product, e)}
            aria-label="Quick add to cart"
            className="absolute bottom-2.5 right-2.5 w-8 h-8 rounded-full bg-[#111612] text-white flex items-center justify-center opacity-0 group-hover:opacity-100 hover:bg-[#FF5722] transition-all duration-200 shadow-md active:scale-90"
          >
            <Plus size={16} strokeWidth={2.5} />
          </button>
        )}
      </div>

      {/* Info Below Image */}
      <div className="pt-2 px-1">
        <span className="text-[11px] font-medium text-[#7D8876] tracking-tight uppercase">
          {product.category}
        </span>
        <h3 className="text-xs font-bold text-[#191F17] line-clamp-1 group-hover:text-[#527F20] transition-colors">
          {product.name}
        </h3>
        <div className="flex items-center justify-between mt-1">
          <div className="flex items-baseline gap-1.5">
            <span className="text-sm font-extrabold text-[#191F17]">
              ₹{product.price}
            </span>
            {product.originalPrice && (
              <span className="text-xs text-[#9DA796] line-through">
                ₹{product.originalPrice}
              </span>
            )}
          </div>
          <span className="text-[11px] font-semibold text-[#66725F]">
            ★ {product.rating}
          </span>
        </div>
      </div>
    </div>
  );
};
