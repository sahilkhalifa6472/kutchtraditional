import React from 'react';
import { Home, ShoppingBag, Heart, User } from 'lucide-react';
import { ActiveTab } from '../types';

interface BottomNavProps {
  activeTab: ActiveTab;
  onChangeTab: (tab: ActiveTab) => void;
  cartCount: number;
  wishlistCount: number;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  onChangeTab,
  cartCount,
  wishlistCount,
}) => {
  const tabs = [
    { id: 'home' as ActiveTab, label: 'Home', icon: Home },
    {
      id: 'cart' as ActiveTab,
      label: 'Cart',
      icon: ShoppingBag,
      badge: cartCount > 0 ? (cartCount > 9 ? '9+' : cartCount) : null,
      badgeColor: 'bg-[#FF5722]',
    },
    {
      id: 'wishlist' as ActiveTab,
      label: 'Saved',
      icon: Heart,
      badge: wishlistCount > 0 ? (wishlistCount > 9 ? '9+' : wishlistCount) : null,
      badgeColor: 'bg-[#E5484D]',
    },
    { id: 'profile' as ActiveTab, label: 'Profile', icon: User },
  ];

  return (
    <div className="lg:hidden fixed bottom-5 inset-x-0 z-40 flex justify-center pointer-events-none px-4">
      <nav
        aria-label="Mobile Navigation"
        className="pointer-events-auto bg-white/95 backdrop-blur-md rounded-full p-1.5 shadow-[0_12px_36px_rgba(20,35,15,0.18)] border border-[#DCE4D6] flex items-center gap-1.5 transition-all duration-300"
      >
        {tabs.map((tab) => {
          const isActive = tab.id === activeTab;
          const Icon = tab.icon;

          return (
            <button
              key={tab.id}
              onClick={() => onChangeTab(tab.id)}
              aria-label={tab.label}
              className={`relative flex items-center justify-center rounded-full transition-all duration-300 ease-out cursor-pointer select-none active:scale-95 ${
                isActive
                  ? 'bg-[#FFF3E0] text-[#E65100] px-4 py-2 font-black shadow-2xs'
                  : 'text-[#64745E] hover:text-[#192314] hover:bg-[#FDF2E9] px-3 py-2'
              }`}
            >
              <div className="relative flex items-center justify-center">
                <Icon
                  size={19}
                  strokeWidth={isActive ? 2.5 : 2}
                  className={`transition-colors duration-200 ${
                    isActive ? 'text-[#E65100]' : 'text-[#64745E]'
                  }`}
                />

                {/* Notification Badge */}
                {tab.badge && (
                  <span
                    className={`absolute -top-1.5 -right-2 min-w-4 h-4 px-1 rounded-full ${tab.badgeColor} text-white text-[9px] font-black flex items-center justify-center shadow-xs leading-none`}
                  >
                    {tab.badge}
                  </span>
                )}
              </div>

              {/* Animated Sliding / Expanding Label */}
              {isActive && (
                <span className="ml-1.5 text-xs font-bold tracking-tight text-[#E65100] whitespace-nowrap animate-in fade-in slide-in-from-left-1 duration-200">
                  {tab.label}
                </span>
              )}
            </button>
          );
        })}
      </nav>
    </div>
  );
};
