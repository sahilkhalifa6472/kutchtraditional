import React from 'react';
import { Search, SlidersHorizontal, X } from 'lucide-react';

interface SearchBarProps {
  value: string;
  onChange: (val: string) => void;
  onOpenFilter: () => void;
  hasActiveFilters?: boolean;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onChange,
  onOpenFilter,
  hasActiveFilters = false,
}) => {
  return (
    <div className="w-full px-5 py-2">
      <div className="relative flex items-center w-full h-12 bg-white rounded-full border border-[#E2E6DD] px-4 shadow-[0_2px_8px_rgba(0,0,0,0.03)] focus-within:border-[#FF5722] focus-within:ring-2 focus-within:ring-[#FF5722]/20 transition-all">
        {/* Search Icon */}
        <Search size={18} className="text-[#9DA796] shrink-0 mr-2.5" />

        {/* Input */}
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="what are you looking for?"
          className="w-full bg-transparent text-sm text-[#191F17] placeholder:text-[#9DA796] focus:outline-none"
        />

        {/* Clear Button if text typed */}
        {value && (
          <button
            onClick={() => onChange('')}
            className="p-1 text-[#9DA796] hover:text-[#191F17] mr-1"
          >
            <X size={15} />
          </button>
        )}

        {/* Filter Sliders Button */}
        <button
          onClick={onOpenFilter}
          aria-label="Open filter settings"
          className={`relative p-1.5 rounded-full transition-colors cursor-pointer ${
            hasActiveFilters
              ? 'bg-[#EBF3D8] text-[#527F20]'
              : 'text-[#626C5C] hover:text-[#191F17] hover:bg-[#F2F5ED]'
          }`}
        >
          <SlidersHorizontal size={17} strokeWidth={2.2} />
          {hasActiveFilters && (
            <span className="absolute top-0 right-0 w-2 h-2 rounded-full bg-[#FF5722]"></span>
          )}
        </button>
      </div>
    </div>
  );
};
