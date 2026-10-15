import React from 'react';
import { Heart, ShoppingBag } from 'lucide-react';
import { Product } from '../types';
import { ProductCard } from '../components/ProductCard';
import { ProductGridSkeleton } from '../components/Skeletons';

interface WishlistViewProps {
  products: Product[];
  wishlistIds: string[];
  isLoading?: boolean;
  onSelectProduct: (product: Product) => void;
  onToggleWishlist: (product: Product, e: React.MouseEvent) => void;
  onQuickAdd: (product: Product, e: React.MouseEvent) => void;
  onExploreProducts: () => void;
}

export const WishlistView: React.FC<WishlistViewProps> = ({
  products,
  wishlistIds,
  isLoading = false,
  onSelectProduct,
  onToggleWishlist,
  onQuickAdd,
  onExploreProducts,
}) => {
  const wishlistedProducts = products.filter((p) => wishlistIds.includes(p.id));

  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto px-4 sm:px-6 pb-28 sm:pb-16 pt-3 animate-in fade-in duration-300">
        <div className="pb-4 space-y-1.5">
          <div className="h-6 w-44 rounded-lg bg-[#E3E8DC] animate-pulse" />
          <div className="h-3 w-56 rounded-md bg-[#E3E8DC] animate-pulse" />
        </div>
        <ProductGridSkeleton count={4} />
      </div>
    );
  }

  if (wishlistedProducts.length === 0) {
    return (
      <div className="max-w-md mx-auto px-6 py-24 text-center animate-in fade-in duration-300">
        <div className="w-20 h-20 rounded-full bg-[#FCE8E8] flex items-center justify-center text-[#E5484D] mx-auto mb-4">
          <Heart size={34} strokeWidth={2} />
        </div>
        <h2 className="text-xl font-extrabold text-[#191F17]">
          No favorites saved yet
        </h2>
        <p className="text-xs sm:text-sm text-[#7A8673] mt-2 max-w-[260px] mx-auto">
          Tap the heart icon on any botanical serum or cleanser to save it to your wishlist.
        </p>
        <button
          onClick={onExploreProducts}
          className="mt-6 px-7 py-3 rounded-full bg-[#FF5722] text-white text-xs font-bold shadow-md hover:bg-[#7EA536] active:scale-95 transition-all cursor-pointer"
        >
          Browse Botanicals
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 pb-28 sm:pb-16 pt-3 animate-in fade-in duration-300">
      <div className="flex items-center justify-between pb-4">
        <div>
          <h2 className="text-xl font-extrabold text-[#191F17]">
            Saved Wishlist ({wishlistedProducts.length})
          </h2>
          <span className="text-xs text-[#7A8673]">
            Curated botanical formulations saved for your daily routine
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3.5 sm:gap-5">
        {wishlistedProducts.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onSelect={onSelectProduct}
            isWishlisted={true}
            onToggleWishlist={onToggleWishlist}
            onQuickAdd={onQuickAdd}
          />
        ))}
      </div>
    </div>
  );
};
