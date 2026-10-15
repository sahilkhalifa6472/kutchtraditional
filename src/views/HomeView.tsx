import React from 'react';
import { HeroBanner } from '../components/HeroBanner';
import { SearchBar } from '../components/SearchBar';
import { ProductCard } from '../components/ProductCard';
import {
  HeroBannerSkeleton,
  CategoryChipsSkeleton,
  ProductGridSkeleton,
} from '../components/Skeletons';
import { Product, CategoryItem, BannerSlide } from '../types';
import { CATEGORIES } from '../data/products';
import { ArrowRight, Sparkles, TrendingUp, Flame, Layers } from 'lucide-react';

interface HomeViewProps {
  products: Product[];
  categories?: CategoryItem[];
  slides?: BannerSlide[];
  isLoading?: boolean;
  onSelectProduct: (product: Product) => void;
  onOpenCatalog: (category?: string) => void;
  onOpenFilter: () => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  wishlistIds: string[];
  onToggleWishlist: (product: Product, e: React.MouseEvent) => void;
  onQuickAdd: (product: Product, e: React.MouseEvent) => void;
  onApplyPromo: (code: string) => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  products,
  categories = CATEGORIES,
  slides,
  isLoading = false,
  onSelectProduct,
  onOpenCatalog,
  onOpenFilter,
  searchQuery,
  setSearchQuery,
  wishlistIds,
  onToggleWishlist,
  onQuickAdd,
  onApplyPromo,
}) => {
  // If user searched in the top search bar, filter products
  const filteredProducts = searchQuery.trim()
    ? products.filter(
        (p) =>
          p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.description.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    : products;

  // New arrivals
  const newArrivals = products.filter((p) => p.isNew);
  // Best sellers
  const bestSellers = products.filter((p) => p.isBestSeller);

  if (isLoading) {
    return (
      <div className="pb-28 sm:pb-16 pt-2 animate-in fade-in duration-300 max-w-6xl mx-auto px-4 sm:px-6 space-y-6">
        {/* Search Input Bar skeleton */}
        <div className="max-w-2xl mx-auto">
          <div className="h-11 w-full rounded-2xl bg-[#E3E8DC] animate-pulse" />
        </div>

        {/* Hero banner skeleton */}
        <HeroBannerSkeleton />

        {/* Categories chip skeleton */}
        <CategoryChipsSkeleton />

        {/* New Arrival Section Skeleton */}
        <div className="space-y-3 pt-2">
          <div className="flex items-center justify-between">
            <div className="h-5 w-32 rounded-md bg-[#E3E8DC] animate-pulse" />
            <div className="h-3 w-14 rounded-md bg-[#E3E8DC] animate-pulse" />
          </div>
          <ProductGridSkeleton count={4} />
        </div>

        {/* Bestseller Section Skeleton */}
        <div className="space-y-3 pt-4">
          <div className="flex items-center justify-between">
            <div className="h-5 w-32 rounded-md bg-[#E3E8DC] animate-pulse" />
            <div className="h-3 w-14 rounded-md bg-[#E3E8DC] animate-pulse" />
          </div>
          <ProductGridSkeleton count={4} />
        </div>
      </div>
    );
  }

  return (
    <div className="pb-28 sm:pb-16 pt-2 animate-in fade-in duration-300 max-w-6xl mx-auto px-4 sm:px-6">
      {/* Search Input Bar */}
      <div className="max-w-2xl mx-auto">
        <SearchBar
          value={searchQuery}
          onChange={setSearchQuery}
          onOpenFilter={onOpenFilter}
          hasActiveFilters={false}
        />
      </div>

      {/* If searching, display search results directly */}
      {searchQuery.trim() ? (
        <div className="py-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-bold text-[#191F17]">
              Search Results for "{searchQuery}"
            </h2>
            <span className="text-xs text-[#7A8573]">
              {filteredProducts.length} items
            </span>
          </div>
          {filteredProducts.length === 0 ? (
            <div className="py-16 text-center">
              <p className="text-sm text-[#7A8573]">
                No Kutch handicrafts or products found matching "{searchQuery}"
              </p>
              <button
                onClick={() => setSearchQuery('')}
                className="mt-3 px-5 py-2.5 rounded-full bg-[#FF5722] text-white text-xs font-bold shadow-xs hover:bg-[#7EA536] cursor-pointer"
              >
                Clear Search
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3.5 sm:gap-5">
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onSelect={onSelectProduct}
                  isWishlisted={wishlistIds.includes(product.id)}
                  onToggleWishlist={onToggleWishlist}
                  onQuickAdd={onQuickAdd}
                />
              ))}
            </div>
          )}
        </div>
      ) : (
        <>
          {/* Hero Promotional Banner (Curved green banner from Screen 1) */}
          <HeroBanner
            slides={slides}
            onShopNow={() => onOpenCatalog()}
            onApplyPromo={onApplyPromo}
          />

          {/* Shop by Category Section (Replacing Trending Today) */}
          <div className="pt-6 pb-2">
            <div className="flex items-center justify-between mb-4 px-0.5">
              <div className="flex items-center gap-2">
                <Layers size={18} className="text-[#FF5722]" />
                <h2 className="text-base sm:text-lg font-bold text-[#191F17] tracking-tight">
                  Shop by Category
                </h2>
              </div>
              <button
                onClick={() => onOpenCatalog('All')}
                className="text-xs font-semibold text-[#FF5722] hover:text-[#678B28] transition-colors cursor-pointer"
              >
                View all
              </button>
            </div>

            {/* Horizontal Scrollable Categories with Card Design (Left Image, Right Name + Desc) */}
            <div className="flex gap-3 overflow-x-auto no-scrollbar py-1">
              {categories.map((cat) => (
                <div
                  key={cat.id}
                  onClick={() => onOpenCatalog(cat.name)}
                  className="group flex items-center gap-3 shrink-0 cursor-pointer bg-white border border-[#E3E8DC] p-2 pr-4 rounded-2xl shadow-sm hover:border-[#FF5722] hover:shadow-md transition-all duration-300 w-[220px] sm:w-[260px]"
                >
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-[#F4F8EC] border border-[#E3E8DC] p-1 flex-shrink-0 overflow-hidden">
                    <img
                      src={cat.image}
                      alt={cat.name}
                      className="w-full h-full object-cover rounded-full group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="text-sm font-bold text-[#191F17] group-hover:text-[#FF5722] transition-colors truncate">
                      {cat.name}
                    </span>
                    <span className="text-[10px] text-[#7A8573] line-clamp-2 mt-0.5 leading-tight">
                      {cat.description || `Premium selection of ${cat.name.toLowerCase()}`}
                    </span>
                    <div className="flex items-center gap-1 mt-1.5">
                      <span className="text-[9px] font-bold text-[#FF5722] bg-[#F0F5E6] px-1.5 py-0.5 rounded-md">
                        {cat.count} Items
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* New Arrival Section (Exact match to Screen 1) */}
          <div className="pt-6 pb-3">
            <div className="flex items-center justify-between mb-3.5">
              <div className="flex items-center gap-1.5">
                <h2 className="text-base sm:text-lg font-bold text-[#191F17] tracking-tight">
                  New Arrival
                </h2>
                <span className="w-1.5 h-1.5 rounded-full bg-[#FF5722]"></span>
              </div>
              <button
                onClick={() => onOpenCatalog()}
                className="text-xs font-semibold text-[#FF5722] hover:text-[#678B28] transition-colors cursor-pointer"
              >
                See all
              </button>
            </div>

            {/* Product Grid: 2 columns on mobile (Screen 1 match), 3 or 4 on desktop */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3.5 sm:gap-5">
              {newArrivals.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onSelect={onSelectProduct}
                  isWishlisted={wishlistIds.includes(product.id)}
                  onToggleWishlist={onToggleWishlist}
                  onQuickAdd={onQuickAdd}
                />
              ))}
            </div>
          </div>

          {/* Best Sellers Section */}
          <div className="pt-6 pb-4">
            <div className="flex items-center justify-between mb-3.5">
              <div className="flex items-center gap-1.5">
                <Sparkles size={16} className="text-[#FF5722]" />
                <h2 className="text-base sm:text-lg font-bold text-[#191F17] tracking-tight">
                  Best Sellers
                </h2>
              </div>
              <button
                onClick={() => onOpenCatalog()}
                className="text-xs font-semibold text-[#FF5722] hover:text-[#678B28] transition-colors cursor-pointer"
              >
                See all
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3.5 sm:gap-5">
              {bestSellers.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onSelect={onSelectProduct}
                  isWishlisted={wishlistIds.includes(product.id)}
                  onToggleWishlist={onToggleWishlist}
                  onQuickAdd={onQuickAdd}
                />
              ))}
            </div>
          </div>

          {/* Botanical Promise Card */}
          <div className="pt-4">
            <div className="p-5 sm:p-6 rounded-3xl bg-[#FFF3E0] border border-[#FFE0B2] flex items-center justify-between flex-wrap gap-4">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#E65100] block">
                  Kutch Traditional Quality
                </span>
                <p className="text-xs sm:text-sm text-[#BF360C] font-bold mt-0.5">
                  100% Authentic Heritage Art • Premium Handpicked Quality • Worldwide Shipping
                </p>
              </div>
              <button
                onClick={() => onOpenCatalog()}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#182115] text-white text-xs font-bold hover:bg-black transition-colors cursor-pointer"
              >
                <span>Explore All Collections</span>
                <ArrowRight size={14} />
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
