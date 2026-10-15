import React from 'react';
import { Menu, Heart, User, Sparkles, Shield, Leaf } from 'lucide-react';
import { ActiveTab } from '../types';

interface HeaderProps {
  title?: string;
  onOpenMenu?: () => void;
  onOpenWishlist?: () => void;
  onOpenProfile?: () => void;
  onNavigateTab: (tab: ActiveTab, category?: string) => void;
  cartCount: number;
  wishlistCount: number;
  currentTab: ActiveTab;
}

export const Header: React.FC<HeaderProps> = ({
  title,
  onOpenMenu,
  onOpenWishlist,
  onOpenProfile,
  onNavigateTab,
  cartCount,
  wishlistCount,
  currentTab,
}) => {
  return (
    <header className="w-full bg-white/95 backdrop-blur-md sticky top-0 z-30 border-b border-[#E2E8DC] rounded-b-[20px] sm:rounded-b-[28px] shadow-[0_4px_20px_rgba(20,30,15,0.04)] transition-all">
      <div className="max-w-6xl mx-auto px-3.5 sm:px-6 py-2.5 sm:py-3.5 flex items-center justify-between">
        {/* Left Section: Menu & Brand */}
        <div className="flex items-center gap-2.5 sm:gap-6 min-w-0">
          <button
            onClick={onOpenMenu}
            aria-label="Open navigation menu"
            className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-white border border-[#E3E8DC] flex flex-col items-center justify-center gap-1 text-[#191F17] hover:bg-[#F2F6E8] active:scale-95 transition-all shadow-xs cursor-pointer lg:hidden shrink-0"
          >
            <div className="w-4 h-[2px] bg-[#191F17] rounded-full"></div>
            <div className="w-3 h-[2px] bg-[#191F17] rounded-full -ml-1"></div>
            <div className="w-4 h-[2px] bg-[#191F17] rounded-full"></div>
          </button>

          {/* Brand Logo */}
          <div
            className="flex items-center cursor-pointer select-none"
            onClick={() => onNavigateTab('home')}
          >
            <div className="flex flex-col">
              <span className="text-base sm:text-xl font-black tracking-tight text-[#191F17] leading-none">
                Kutch<span className="text-[#FF5722]"> Traditional</span>
              </span>
              <span className="text-[9px] font-semibold text-[#7A8673] tracking-widest uppercase hidden sm:block mt-0.5">
                Authentic Heritage & Premium Quality
              </span>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-6 ml-4">
            <button
              onClick={() => onNavigateTab('home')}
              className={`text-xs font-bold transition-colors cursor-pointer ${
                currentTab === 'home'
                  ? 'text-[#E65100] border-b-2 border-[#FF5722] pb-0.5'
                  : 'text-[#4A5544] hover:text-[#191F17]'
              }`}
            >
              Home
            </button>
            <button
              onClick={() => onNavigateTab('catalog')}
              className={`text-xs font-bold transition-colors cursor-pointer ${
                currentTab === 'catalog'
                  ? 'text-[#E65100] border-b-2 border-[#FF5722] pb-0.5'
                  : 'text-[#4A5544] hover:text-[#191F17]'
              }`}
            >
              All Handicrafts
            </button>
          </nav>
        </div>

        {/* Right Section: Wishlist & Profile (Cart & Back buttons removed as requested) */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <button
            onClick={onOpenWishlist}
            aria-label="View saved wishlist"
            className="flex w-10 h-10 rounded-full bg-white border border-[#E3E8DC] items-center justify-center text-[#191F17] hover:bg-[#F2F6E8] active:scale-95 transition-all shadow-xs relative cursor-pointer"
          >
            <Heart size={18} strokeWidth={2.2} />
            {wishlistCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#E5484D] text-white text-[10px] font-bold flex items-center justify-center">
                {wishlistCount}
              </span>
            )}
          </button>

          <button
            onClick={onOpenProfile}
            aria-label="My Account"
            className="flex w-10 h-10 rounded-full bg-white border border-[#E3E8DC] items-center justify-center text-[#191F17] hover:bg-[#F2F6E8] active:scale-95 transition-all shadow-xs cursor-pointer"
          >
            <User size={18} strokeWidth={2.2} />
          </button>
        </div>
      </div>
    </header>
  );
};
