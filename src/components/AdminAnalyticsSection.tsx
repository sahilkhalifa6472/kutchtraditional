import React, { useState } from 'react';
import {
  TrendingUp,
  Eye,
  ShoppingBag,
  Users,
  Activity,
  Layers,
  ArrowUpRight,
  Globe,
  Share2,
  Calendar,
  Sparkles,
  Smartphone,
  RotateCcw,
} from 'lucide-react';
import { Product, AnalyticsData } from '../types';

interface AdminAnalyticsSectionProps {
  products: Product[];
  analytics: AnalyticsData;
  onSimulateView?: (productId?: string) => void;
  onResetAnalytics?: () => void;
}

export const AdminAnalyticsSection: React.FC<AdminAnalyticsSectionProps> = ({
  products,
  analytics,
  onSimulateView,
  onResetAnalytics,
}) => {
  const totalPageViews = Object.values(analytics.pageViews).reduce((a, b) => a + b, 0);
  const totalProductViews = Object.values(analytics.productViews).reduce((a, b) => a + b, 0);
  const totalVisitors = analytics.totalVisitors;

  const rankedProducts = [...products]
    .map((p) => {
      const views = analytics.productViews[p.id] || 0;
      return {
        product: p,
        views,
      };
    })
    .sort((a, b) => b.views - a.views);

  const maxProductViews = rankedProducts[0]?.views || 1;

  const pageViewList = [
    { page: 'Home Page', path: '/home', views: analytics.pageViews.home, color: 'bg-[#FF5722]' },
    { page: 'Product Details Screen', path: '/product/:id', views: analytics.pageViews.productDetails, color: 'bg-[#E65100]' },
    { page: 'All Handicrafts Catalog', path: '/catalog', views: analytics.pageViews.catalog, color: 'bg-[#FF7043]' },
    { page: 'Shopping Bag / Checkout', path: '/cart', views: analytics.pageViews.cart, color: 'bg-[#E5832E]' },
    { page: 'Saved Wishlist', path: '/wishlist', views: analytics.pageViews.wishlist, color: 'bg-[#E5484D]' },
    { page: 'Customer Profile', path: '/profile', views: analytics.pageViews.profile, color: 'bg-[#315798]' },
  ];

  return (
    <div className="space-y-5 animate-in fade-in duration-300">
      {/* 1. Header with Live Badge */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-3xl bg-white border border-[#E3E8DC] shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-[#EBF5DC] text-[#3D6816] flex items-center justify-center font-bold">
            <Activity size={20} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm sm:text-base font-black text-[#1C2518] tracking-tight">
                Live Store Traffic & View Analytics
              </h2>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#EBF5DC] text-[#3E6816] text-[10px] font-black tracking-tight animate-pulse">
                <span className="w-1.5 h-1.5 rounded-full bg-[#52871A]"></span>
                Live {analytics.activeVisitorsNow} Shoppers Active
              </span>
            </div>
            <p className="text-[11px] text-[#788871]">
              Tracking real customer page visits and product engagement in real-time
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {onSimulateView && (
            <button
              onClick={() => onSimulateView()}
              className="px-3 py-2 rounded-xl bg-[#FF5722] hover:bg-[#7CA235] text-white text-xs font-bold transition-all cursor-pointer shadow-xs"
            >
              Simulate View
            </button>
          )}
          {onResetAnalytics && (
            <button
              onClick={onResetAnalytics}
              className="px-3 py-2 rounded-xl bg-[#F2F5ED] hover:bg-[#E5EADF] text-[#55634E] text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5"
              title="Reset counters"
            >
              <RotateCcw size={13} />
              <span>Reset</span>
            </button>
          )}
        </div>
      </div>

      {/* 2. KPI Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="p-4 rounded-2xl bg-white border border-[#E3E8DC] shadow-xs space-y-1">
          <div className="flex items-center justify-between text-[#71806C]">
            <span className="text-[10px] font-bold uppercase tracking-wider">Total Page Views</span>
            <Eye size={15} />
          </div>
          <span className="text-2xl font-black text-[#1C2518] block">{totalPageViews.toLocaleString()}</span>
          <span className="text-[10px] text-[#426C18] font-semibold">Tracked live from session</span>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-[#E3E8DC] shadow-xs space-y-1">
          <div className="flex items-center justify-between text-[#71806C]">
            <span className="text-[10px] font-bold uppercase tracking-wider">Product Views</span>
            <Layers size={15} />
          </div>
          <span className="text-2xl font-black text-[#1C2518] block">{totalProductViews.toLocaleString()}</span>
          <span className="text-[10px] text-[#E65100] font-semibold">Craft product item clicks</span>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-[#E3E8DC] shadow-xs space-y-1">
          <div className="flex items-center justify-between text-[#71806C]">
            <span className="text-[10px] font-bold uppercase tracking-wider">Total Visitors</span>
            <Users size={15} />
          </div>
          <span className="text-2xl font-black text-[#1C2518] block">{totalVisitors.toLocaleString()}</span>
          <span className="text-[10px] text-[#426C18] font-semibold">Unique storefront visitors</span>
        </div>
      </div>

      {/* 3. Page Views Breakdown */}
      <div className="p-5 rounded-3xl bg-white border border-[#E3E8DC] shadow-xs space-y-4">
        <h3 className="text-xs font-black uppercase tracking-wider text-[#63725C]">
          Page View Distribution
        </h3>
        <div className="space-y-3">
          {pageViewList.map((pv, idx) => {
            const pct = totalPageViews > 0 ? Math.round((pv.views / totalPageViews) * 100) : 0;
            return (
              <div key={idx} className="space-y-1">
                <div className="flex items-center justify-between text-xs font-bold text-[#1C2518]">
                  <span>{pv.page} <span className="text-[#788871] font-normal font-mono text-[11px]">({pv.path})</span></span>
                  <span>{pv.views} views ({pct}%)</span>
                </div>
                <div className="w-full h-2 rounded-full bg-[#F2F5ED] overflow-hidden">
                  <div
                    className={`h-full rounded-full ${pv.color} transition-all duration-500`}
                    style={{ width: `${Math.max(3, pct)}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 4. Ranked Products by Real Views */}
      <div className="p-5 rounded-3xl bg-white border border-[#E3E8DC] shadow-xs space-y-4">
        <h3 className="text-xs font-black uppercase tracking-wider text-[#63725C]">
          Product Engagement Ranking
        </h3>
        <div className="space-y-3">
          {rankedProducts.map(({ product, views }) => (
            <div
              key={product.id}
              className="p-3 rounded-2xl bg-[#F8FAF5] border border-[#E3E8DC] flex items-center justify-between gap-3"
            >
              <div className="flex items-center gap-3 min-w-0">
                <img
                  src={product.images[0]}
                  alt={product.name}
                  className="w-11 h-11 rounded-xl object-cover border border-[#DFE7D6] shrink-0"
                />
                <div className="min-w-0">
                  <h4 className="text-xs font-bold text-[#1C2518] truncate">{product.name}</h4>
                  <span className="text-[10px] text-[#71806C] block">
                    Base Price: ₹{product.price} • {views} Total Views
                  </span>
                </div>
              </div>
              <button
                onClick={() => onSimulateView && onSimulateView(product.id)}
                className="px-3 py-1.5 rounded-xl bg-[#EBF5DC] text-[#3E6816] text-xs font-bold hover:bg-[#DEEFCB] cursor-pointer shrink-0"
              >
                Simulate View
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
