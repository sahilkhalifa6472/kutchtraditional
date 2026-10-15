import React, { useState } from 'react';
import { ProductCard } from '../components/ProductCard';
import { SearchBar } from '../components/SearchBar';
import { CatalogSkeleton } from '../components/Skeletons';
import { Product, CategoryItem } from '../types';
import { CATEGORIES } from '../data/products';
import { SlidersHorizontal } from 'lucide-react';

interface CatalogViewProps {
  products: Product[];
  categories?: CategoryItem[];
  selectedCategory: string;
  isLoading?: boolean;
  onSelectCategory: (cat: string) => void;
  onSelectProduct: (p: Product) => void;
  onOpenFilter: () => void;
  wishlistIds: string[];
  onToggleWishlist: (product: Product, e: React.MouseEvent) => void;
  onQuickAdd: (product: Product, e: React.MouseEvent) => void;
}

export const CatalogView: React.FC<CatalogViewProps> = ({
  products,
  categories = CATEGORIES,
  selectedCategory,
  isLoading = false,
  onSelectCategory,
  onSelectProduct,
  onOpenFilter,
  wishlistIds,
  onToggleWishlist,
  onQuickAdd,
}) => {
  const [search, setSearch] = useState('');

  if (isLoading) {
    return <CatalogSkeleton />;
  }

  const filtered = products.filter((p) => {
    const matchesCat =
      selectedCategory === 'All' || p.category.toLowerCase() === selectedCategory.toLowerCase();
    const matchesSearch =
      search.trim() === '' ||
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.description.toLowerCase().includes(search.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="pb-28 sm:pb-16 pt-2 animate-in fade-in duration-300 max-w-6xl mx-auto px-4 sm:px-6">
      {/* Search Bar */}
      <div className="max-w-2xl mx-auto mb-2">
        <SearchBar
          value={search}
          onChange={setSearch}
          onOpenFilter={onOpenFilter}
        />
      </div>

      {/* Category Pills Slider */}
      <div className="py-2">
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
          <button
            onClick={() => onSelectCategory('All')}
            className={`px-4 py-2 rounded-full text-xs font-bold transition-all shrink-0 cursor-pointer ${
              selectedCategory === 'All'
                ? 'bg-[#FF5722] text-white shadow-xs'
                : 'bg-white border border-[#E1E5DC] text-[#485342] hover:bg-[#F2F5ED]'
            }`}
          >
            All Collections
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(cat.name)}
              className={`px-4 py-2 rounded-full text-xs font-bold transition-all shrink-0 cursor-pointer ${
                selectedCategory.toLowerCase() === cat.name.toLowerCase()
                  ? 'bg-[#FF5722] text-white shadow-xs'
                  : 'bg-white border border-[#E1E5DC] text-[#485342] hover:bg-[#F2F5ED]'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Results Header */}
      <div className="pt-3 pb-3 flex items-center justify-between">
        <span className="text-xs font-bold text-[#626E5B]">
          Showing {filtered.length} authentic Kutch products
        </span>
        <button
          onClick={onOpenFilter}
          className="text-xs font-semibold text-[#FF5722] flex items-center gap-1.5 cursor-pointer bg-white px-3 py-1.5 rounded-full border border-[#E0E5DC] shadow-xs hover:bg-[#F3F6ED]"
        >
          <SlidersHorizontal size={13} />
          <span>Filters</span>
        </button>
      </div>

      {/* Grid */}
      <div className="pt-1">
        {filtered.length === 0 ? (
          <div className="py-20 text-center">
            <p className="text-sm text-[#7D8876]">No Kutch heritage products found matching this filter.</p>
            <button
              onClick={() => {
                onSelectCategory('All');
                setSearch('');
              }}
              className="mt-3 px-5 py-2.5 rounded-full bg-[#FF5722] text-white text-xs font-bold shadow-xs hover:bg-[#7EA536] cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3.5 sm:gap-5">
            {filtered.map((product) => (
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
    </div>
  );
};
