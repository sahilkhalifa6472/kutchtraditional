import React, { useState } from 'react';
import { Home, ShoppingBag, Search, Sparkles, Compass, ShieldAlert, ArrowRight } from 'lucide-react';

interface NotFoundViewProps {
  onNavigateHome: () => void;
  onNavigateCatalog: (category?: string) => void;
  onNavigateCart: () => void;
}

export const NotFoundView: React.FC<NotFoundViewProps> = ({
  onNavigateHome,
  onNavigateCatalog,
  onNavigateCart,
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      onNavigateCatalog('All');
    }
  };

  return (
    <div className="min-h-[82vh] flex items-center justify-center px-4 py-12 animate-in fade-in zoom-in-95 duration-300 bg-gradient-to-b from-[#F2F5EC] to-[#E8EDE0]">
      <div className="max-w-lg w-full bg-white rounded-[32px] p-6 sm:p-10 border border-[#D8E2CE] shadow-2xl text-center space-y-6 relative overflow-hidden">
        {/* Decorative background glow */}
        <div className="absolute -top-24 -right-24 w-48 h-48 rounded-full bg-[#FF5722]/10 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-48 h-48 rounded-full bg-[#E3EDD3] blur-3xl pointer-events-none" />

        {/* Animated Botanical 404 Graphic */}
        <div className="relative mx-auto w-32 h-32 flex items-center justify-center">
          <div className="absolute inset-0 rounded-full bg-[#EBF4DC] animate-ping opacity-30" />
          <div className="relative w-28 h-28 rounded-full bg-gradient-to-br from-[#192215] via-[#2B3B23] to-[#11170E] text-white flex flex-col items-center justify-center shadow-xl border-4 border-[#FF5722]/30">
            <Compass size={28} className="text-[#FF5722] animate-spin mb-1" style={{ animationDuration: '16s' }} />
            <span className="text-3xl font-black tracking-tight leading-none text-white">404</span>
          </div>
        </div>

        {/* Text Details */}
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFF3E0] text-[#E65100] text-[11px] font-bold border border-[#FFE0B2]">
            <ShieldAlert size={13} className="text-[#FF5722]" />
            <span>Lost in the White Desert of Kutch</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-[#192215]">
            Page Not Found / Yeh Panna Maujood Nahi Hai
          </h1>
          <p className="text-xs sm:text-sm text-[#6C7B65] leading-relaxed max-w-sm mx-auto">
            The link you followed might be broken, expired, or the heritage craft collection has moved.
          </p>
        </div>

        {/* Quick Search on 404 */}
        <form onSubmit={handleSearchSubmit} className="relative max-w-sm mx-auto">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search Bandhani, Ajrakh, Rogan art, Kharek dates..."
            className="w-full pl-10 pr-24 py-3 rounded-2xl bg-[#F8FAf5] border border-[#DCE4D3] text-xs font-semibold focus:outline-none focus:border-[#FF5722] shadow-inner"
          />
          <Search size={16} className="absolute left-3.5 top-3.5 text-[#86957F]" />
          <button
            type="submit"
            className="absolute right-1.5 top-1.5 px-3 py-2 rounded-xl bg-[#FF5722] text-white text-xs font-bold hover:bg-[#E65100] transition-all cursor-pointer flex items-center gap-1 shadow-xs"
          >
            <span>Search</span>
            <ArrowRight size={12} />
          </button>
        </form>

        {/* Popular Categories Shortcut Chips */}
        <div className="pt-1">
          <span className="text-[11px] font-bold text-[#86957F] uppercase tracking-wider block mb-2.5">
            Explore Handpicked Categories
          </span>
          <div className="flex flex-wrap justify-center gap-1.5">
            {[
              { label: 'Mamra Almonds', cat: 'Almonds (Badam)' },
              { label: 'King Cashews', cat: 'Cashews (Kaju)' },
              { label: 'Kashmiri Walnuts', cat: 'Walnuts (Akhrot)' },
              { label: 'Royal Dates', cat: 'Royal Dates (Khajoor)' },
              { label: 'Afghan Anjeer', cat: 'Figs & Berries (Anjeer)' },
            ].map((chip) => (
              <button
                key={chip.label}
                onClick={() => onNavigateCatalog(chip.cat)}
                className="px-3 py-1.5 rounded-full bg-[#F3F6EC] hover:bg-[#E5ECD9] text-[#344626] text-xs font-semibold border border-[#DEE5D4] transition-all cursor-pointer active:scale-95"
              >
                {chip.label}
              </button>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2.5 pt-2">
          <button
            onClick={onNavigateHome}
            className="w-full py-3.5 rounded-2xl bg-[#192215] hover:bg-[#2B3B23] text-white font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg transition-all active:scale-95 cursor-pointer"
          >
            <Home size={16} className="text-[#FF5722]" />
            <span>Return to Store Home</span>
          </button>

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => onNavigateCatalog('All')}
              className="py-3 rounded-2xl border border-[#DCE4D3] bg-white hover:bg-[#F8FAF4] text-[#293621] font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-xs"
            >
              <Sparkles size={14} className="text-[#FF5722]" />
              <span>All Products</span>
            </button>
            <button
              onClick={onNavigateCart}
              className="py-3 rounded-2xl border border-[#DCE4D3] bg-white hover:bg-[#F8FAF4] text-[#293621] font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-xs"
            >
              <ShoppingBag size={14} className="text-[#FF5722]" />
              <span>Shopping Bag</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
