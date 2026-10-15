import React, { useState } from 'react';
import {
  X,
  Leaf,
  User,
  LogOut,
  LogIn,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  TrendingUp,
  ShoppingBag,
  Layers,
  ChevronRight,
} from 'lucide-react';
import { CATEGORIES, PRODUCTS } from '../data/products';
import { ActiveTab, CategoryItem, Product } from '../types';

interface SidebarMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectCategory: (categoryName: string) => void;
  onNavigateTab: (tab: ActiveTab, category?: string) => void;
  activeCategory?: string;
  isLoggedIn?: boolean;
  onToggleLogin?: () => void;
  userEmail?: string;
  userName?: string;
  categories?: CategoryItem[];
  products?: Product[];
  onSelectProduct?: (product: Product) => void;
}

export const SidebarMenu: React.FC<SidebarMenuProps> = ({
  isOpen,
  onClose,
  onSelectCategory,
  onNavigateTab,
  activeCategory = 'All',
  isLoggedIn = false,
  onToggleLogin,
  userEmail = '',
  userName = 'Kutch Guest',
  categories = CATEGORIES,
  products = PRODUCTS,
  onSelectProduct,
}) => {
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});

  if (!isOpen) return null;

  const handleImageError = (id: string) => {
    setImageErrors((prev) => ({ ...prev, [id]: true }));
  };

  return (
    <div className="fixed inset-0 z-50 flex bg-black/55 backdrop-blur-xs transition-opacity duration-300 animate-in fade-in">
      {/* Sliding Drawer Container with Smooth Right Rounded Corners */}
      <div
        className="w-[85%] sm:w-[370px] max-w-[400px] bg-[#FAFBF8] h-full shadow-[0_20px_50px_rgba(15,25,10,0.35)] flex flex-col justify-between rounded-r-[28px] sm:rounded-r-[36px] overflow-hidden border-r border-[#DDE6D2] animate-in slide-in-from-left duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* TOP SECTION: Header & Login/Profile */}
        <div className="p-4 pb-3 border-b border-[#E8EDE0] bg-white/95 backdrop-blur-xs space-y-3">
          {/* Logo & Close Button */}
          <div className="flex items-center justify-between">
            <div
              className="flex items-center cursor-pointer"
              onClick={() => {
                onNavigateTab('home');
                onClose();
              }}
            >
              <span className="text-lg font-black tracking-tight text-[#191F17] leading-none">
                Kutch<span className="text-[#FF5722]"> Traditional</span>
              </span>
            </div>

            <button
              onClick={onClose}
              aria-label="Close Menu"
              className="w-8 h-8 rounded-full bg-[#F0F4E8] hover:bg-[#E2ECD5] flex items-center justify-center text-[#55634E] hover:text-[#191F17] transition-all cursor-pointer active:scale-95"
            >
              <X size={17} strokeWidth={2.4} />
            </button>
          </div>

          {/* User Status (Login / Profile / Logout) */}
          <div className="pt-2.5 border-t border-[#EEF2E6]">
            {isLoggedIn ? (
              <div className="flex items-center justify-between bg-[#F4F8EC] p-2.5 rounded-2xl border border-[#DFE8D3]">
                {/* User Info */}
                <div
                  className="flex items-center gap-2.5 cursor-pointer min-w-0 flex-1"
                  onClick={() => {
                    onNavigateTab('profile');
                    onClose();
                  }}
                >
                  <div className="w-9 h-9 rounded-xl bg-[#FF5722] text-white flex items-center justify-center font-bold text-xs shadow-xs flex-shrink-0">
                    SR
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-bold text-[#1C2518] truncate">
                        {userName}
                      </span>
                      <span className="px-1.5 py-0.2 rounded-full bg-[#FF5722] text-[8.5px] font-extrabold text-white flex-shrink-0">
                        VIP
                      </span>
                    </div>
                    <span className="text-[10px] text-[#71806B] truncate block">
                      {userEmail || 'Account Connected'}
                    </span>
                  </div>
                </div>

                {/* Profile & Logout Action Buttons */}
                <div className="flex items-center gap-1 flex-shrink-0 ml-2">
                  <button
                    onClick={() => {
                      onNavigateTab('profile');
                      onClose();
                    }}
                    className="p-1.5 rounded-lg bg-white text-[#4A6D22] hover:bg-[#EBF3DA] transition-colors border border-[#D5E2C5] cursor-pointer"
                    title="View Profile"
                  >
                    <User size={15} />
                  </button>

                  <button
                    onClick={() => {
                      if (onToggleLogin) onToggleLogin();
                    }}
                    className="p-1.5 rounded-lg bg-white text-[#9E3E3E] hover:bg-[#FEECEC] transition-colors border border-[#E9D4D4] cursor-pointer"
                    title="Log Out"
                  >
                    <LogOut size={15} />
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-between bg-[#F4F8EC] p-2.5 rounded-2xl border border-[#DFE8D3]">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-[#E2ECCF] text-[#556942] flex items-center justify-center">
                    <User size={16} />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-[#1F291C] block">
                      Login / Sign Up
                    </span>
                    <span className="text-[10px] text-[#7A8772]">
                      Access orders & wishlist
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => {
                    onNavigateTab('profile');
                    onClose();
                  }}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#FF5722] hover:bg-[#7CA235] text-white text-xs font-bold transition-all shadow-xs cursor-pointer active:scale-95"
                >
                  <LogIn size={13} />
                  <span>Login</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* MIDDLE SECTION: Scrollable Content (Trending & Categories) */}
        <div className="flex-1 overflow-y-auto p-4 space-y-5 custom-scrollbar">
          {/* 1. Shop by Category Section (Replacing Trending) */}
          <div className="space-y-3">
            <div className="flex items-center justify-between px-0.5">
              <div className="flex items-center gap-1.5">
                <Layers size={14} className="text-[#FF5722]" />
                <span className="text-xs font-black uppercase tracking-wider text-[#1C2518]">
                  📦 Shop by Category
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-2">
              {categories.map((cat) => (
                <div
                  key={cat.id}
                  onClick={() => {
                    onSelectCategory(cat.name);
                    onClose();
                  }}
                  className={`p-2.5 rounded-2xl border transition-all cursor-pointer flex items-center gap-3 group shadow-[0_2px_8px_rgba(20,30,15,0.03)] ${
                    activeCategory === cat.name
                      ? 'bg-[#F2F6ED] border-[#FF5722]'
                      : 'bg-white border-[#E3E8DC] hover:border-[#FF5722]'
                  }`}
                >
                  <div className="w-10 h-10 rounded-full bg-[#F2F6ED] overflow-hidden shrink-0 border border-[#DEE7D4]">
                    <img
                      src={cat.image}
                      alt={cat.name}
                      className="w-full h-full object-cover rounded-full group-hover:scale-110 transition-transform duration-300"
                    />
                  </div>

                  <div className="min-w-0 flex-1">
                    <h4 className={`text-xs font-extrabold transition-colors truncate ${
                      activeCategory === cat.name ? 'text-[#517621]' : 'text-[#191F17]'
                    }`}>
                      {cat.name}
                    </h4>
                  </div>
                  
                  <ChevronRight size={14} className="text-[#A2AEA0]" />
                </div>
              ))}
            </div>
          </div>


        </div>

        {/* BOTTOM SECTION: Clean Action Button */}
        <div className="p-4 border-t border-[#E8EDE0] bg-white/95 backdrop-blur-xs space-y-2">
          <button
            onClick={() => {
              onSelectCategory('All');
              onClose();
            }}
            className="w-full py-2.5 px-4 rounded-xl bg-[#FF5722] hover:bg-[#E65100] text-white text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-xs cursor-pointer active:scale-95"
          >
            <Sparkles size={14} />
            <span>View All Kutch Heritage Crafts</span>
            <ArrowRight size={13} />
          </button>

          <div className="flex items-center justify-center gap-1.5 text-[10px] text-[#71826B] pt-0.5">
            <ShieldCheck size={13} className="text-[#FF5722]" />
            <span>100% Authentic Kutch Heritage • Direct from Master Artisans</span>
          </div>
        </div>
      </div>

      {/* Backdrop click to dismiss */}
      <div className="flex-1" onClick={onClose}></div>
    </div>
  );
};
