import React from 'react';
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  BarChart3,
  Store,
  Users,
} from 'lucide-react';

export type AdminTab =
  | 'overview'
  | 'products'
  | 'analytics'
  | 'orders'
  | 'customers'
  | 'storeview'
  | 'categories'
  | 'slides'
  | 'coupons'
  | 'settings';

interface AdminBottomNavProps {
  activeTab: AdminTab;
  onChangeTab: (tab: AdminTab) => void;
  ordersCount: number;
  productsCount: number;
}

export const AdminBottomNav: React.FC<AdminBottomNavProps> = ({
  activeTab,
  onChangeTab,
  ordersCount,
  productsCount,
}) => {
  const tabs = [
    {
      id: 'overview' as AdminTab,
      label: 'Dashboard',
      icon: LayoutDashboard,
    },
    {
      id: 'products' as AdminTab,
      label: 'Products',
      icon: Package,
      badge: productsCount > 0 ? productsCount : null,
      badgeColor: 'bg-[#517621]',
    },
    {
      id: 'customers' as AdminTab,
      label: 'Customers',
      icon: Users,
    },
    {
      id: 'orders' as AdminTab,
      label: 'Orders',
      icon: ShoppingBag,
      badge: ordersCount > 0 ? ordersCount : null,
      badgeColor: 'bg-[#E5484D]',
    },
    {
      id: 'storeview' as AdminTab,
      label: 'Store View',
      icon: Store,
    },
  ];

  const mappedActiveTab: AdminTab =
    activeTab === 'categories' || activeTab === 'slides'
      ? 'products'
      : activeTab === 'coupons' || activeTab === 'settings' || activeTab === 'analytics'
      ? 'overview'
      : activeTab;

  const activeIndex = tabs.findIndex((t) => t.id === mappedActiveTab);
  const currentIndex = activeIndex >= 0 ? activeIndex : 0;

  return (
    <div className="fixed bottom-5 inset-x-0 mx-auto flex justify-center z-40 pointer-events-none px-3">
      <nav
        aria-label="Admin Navigation"
        className="pointer-events-auto relative bg-[#182215]/95 backdrop-blur-md rounded-full p-1.5 shadow-[0_16px_40px_rgba(0,0,0,0.35)] border border-white/15 flex items-center w-full max-w-[410px]"
      >
        <div
          className="absolute top-1.5 bottom-1.5 left-1.5 rounded-full bg-[#FF5722] shadow-sm pointer-events-none transition-transform duration-350 ease-[cubic-bezier(0.32,0.72,0,1)]"
          style={{
            width: 'calc((100% - 12px) / 5)',
            transform: `translateX(${currentIndex * 100}%)`,
          }}
        />

        {tabs.map((tab) => {
          const isActive = tab.id === mappedActiveTab;
          const Icon = tab.icon;

          return (
            <button
              key={tab.id}
              onClick={() => onChangeTab(tab.id)}
              aria-label={tab.label}
              className="relative flex-1 flex flex-col items-center justify-center py-1.5 transition-colors z-10 cursor-pointer active:scale-95"
            >
              <div className="relative">
                <Icon
                  size={19}
                  strokeWidth={isActive ? 2.5 : 2}
                  className={`transition-colors duration-200 ${
                    isActive ? 'text-white' : 'text-[#9DAA95] hover:text-white'
                  }`}
                />
                {tab.badge && (
                  <span
                    className={`absolute -top-1.5 -right-2 min-w-4 h-4 px-1 rounded-full text-[9px] font-black text-white flex items-center justify-center shadow-xs ${tab.badgeColor}`}
                  >
                    {tab.badge}
                  </span>
                )}
              </div>
              <span
                className={`text-[9px] mt-0.5 tracking-tight font-extrabold transition-colors duration-200 ${
                  isActive ? 'text-white font-black' : 'text-[#879680]'
                }`}
              >
                {tab.label}
              </span>
            </button>
          );
        })}
      </nav>
    </div>
  );
};
