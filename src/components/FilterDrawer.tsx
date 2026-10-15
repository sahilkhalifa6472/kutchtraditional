import React from 'react';
import { X, Check } from 'lucide-react';
import { FilterOptions } from '../types';
import { CATEGORIES } from '../data/products';

interface FilterDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  filters: FilterOptions;
  onApplyFilters: (filters: FilterOptions) => void;
  onResetFilters: () => void;
}

export const FilterDrawer: React.FC<FilterDrawerProps> = ({
  isOpen,
  onClose,
  filters,
  onApplyFilters,
  onResetFilters,
}) => {
  const [localFilters, setLocalFilters] = React.useState<FilterOptions>(filters);

  React.useEffect(() => {
    setLocalFilters(filters);
  }, [filters, isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 backdrop-blur-xs transition-opacity animate-in fade-in">
      <div
        className="w-full max-w-[430px] bg-white rounded-t-[32px] p-6 shadow-2xl border-t border-[#E3E7DE] max-h-[85vh] overflow-y-auto no-scrollbar"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#F0F2EB]">
          <h2 className="text-lg font-bold text-[#191F17]">Filter Products</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#F4F6F0] flex items-center justify-center text-[#626C5C] hover:text-[#191F17]"
          >
            <X size={18} />
          </button>
        </div>

        {/* Categories */}
        <div className="py-4 border-b border-[#F0F2EB]">
          <label className="text-xs font-bold uppercase tracking-wider text-[#7A8573] block mb-3">
            Category
          </label>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setLocalFilters({ ...localFilters, category: 'All' })}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
                localFilters.category === 'All'
                  ? 'bg-[#FF5722] text-white shadow-xs'
                  : 'bg-[#F2F5ED] text-[#4F5949] hover:bg-[#E7EBDD]'
              }`}
            >
              All Categories
            </button>
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setLocalFilters({ ...localFilters, category: cat.name })}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
                  localFilters.category === cat.name
                    ? 'bg-[#FF5722] text-white shadow-xs'
                    : 'bg-[#F2F5ED] text-[#4F5949] hover:bg-[#E7EBDD]'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        {/* Price Range */}
        <div className="py-4 border-b border-[#F0F2EB]">
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-bold uppercase tracking-wider text-[#7A8573]">
              Max Price
            </label>
            <span className="text-sm font-bold text-[#191F17]">
              ${localFilters.maxPrice}
            </span>
          </div>
          <input
            type="range"
            min="50"
            max="300"
            step="10"
            value={localFilters.maxPrice}
            onChange={(e) =>
              setLocalFilters({ ...localFilters, maxPrice: Number(e.target.value) })
            }
            className="w-full accent-[#FF5722] cursor-pointer"
          />
          <div className="flex justify-between text-[11px] text-[#8C9784] mt-1">
            <span>$50</span>
            <span>$300+</span>
          </div>
        </div>

        {/* Sort By */}
        <div className="py-4">
          <label className="text-xs font-bold uppercase tracking-wider text-[#7A8573] block mb-2.5">
            Sort By
          </label>
          <div className="grid grid-cols-2 gap-2">
            {[
              { id: 'popular', label: 'Most Popular' },
              { id: 'price-asc', label: 'Price: Low to High' },
              { id: 'price-desc', label: 'Price: High to Low' },
              { id: 'rating', label: 'Highest Rated' },
            ].map((sort) => (
              <button
                key={sort.id}
                onClick={() =>
                  setLocalFilters({
                    ...localFilters,
                    sortBy: sort.id as FilterOptions['sortBy'],
                  })
                }
                className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium border text-left transition-all ${
                  localFilters.sortBy === sort.id
                    ? 'border-[#FF5722] bg-[#F4F9EC] text-[#3F6317] font-bold'
                    : 'border-[#E5E9E0] text-[#55604E] hover:border-[#D0D6C8]'
                }`}
              >
                <span>{sort.label}</span>
                {localFilters.sortBy === sort.id && (
                  <Check size={14} className="text-[#FF5722]" />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="pt-4 flex items-center gap-3">
          <button
            onClick={() => {
              onResetFilters();
              onClose();
            }}
            className="flex-1 py-3 rounded-full border border-[#D8DFD1] text-xs font-bold text-[#4E5948] hover:bg-[#F4F6F0] active:scale-95 transition-all"
          >
            Reset All
          </button>
          <button
            onClick={() => {
              onApplyFilters(localFilters);
              onClose();
            }}
            className="flex-2 py-3 rounded-full bg-[#FF5722] text-white text-xs font-bold shadow-md hover:bg-[#7FA737] active:scale-95 transition-all"
          >
            Apply Filters
          </button>
        </div>
      </div>
    </div>
  );
};
