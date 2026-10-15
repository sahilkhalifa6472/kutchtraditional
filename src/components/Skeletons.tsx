import React from 'react';

// Shimmer gradient animation helper class
const shimmerClass = 'animate-pulse bg-[#E3E8DC]';

/**
 * Skeleton for single Product Card
 * Matches exact aspect-[4/5] and rounded-[24px] of ProductCard.tsx
 */
export const ProductCardSkeleton: React.FC = () => {
  return (
    <div className="flex flex-col">
      {/* Image Container Card */}
      <div className="relative aspect-[4/5] w-full rounded-[24px] bg-[#EAECE6] overflow-hidden p-2 flex items-center justify-center border border-[#E3E7DE] shadow-xs">
        {/* Heart Wishlist circle skeleton */}
        <div className={`absolute top-2.5 right-2.5 z-10 w-8 h-8 rounded-full ${shimmerClass} shadow-xs`} />
        
        {/* Badge skeleton */}
        <div className={`absolute top-2.5 left-2.5 z-10 w-16 h-5 rounded-full ${shimmerClass}`} />

        {/* Main image skeleton */}
        <div className={`w-full h-full rounded-[18px] ${shimmerClass}`} />
      </div>

      {/* Info below image */}
      <div className="pt-2 px-1 space-y-1.5">
        <div className={`h-2.5 w-16 rounded-md ${shimmerClass}`} />
        <div className={`h-3.5 w-3/4 rounded-md ${shimmerClass}`} />
        <div className="flex items-center justify-between pt-1">
          <div className="flex items-center gap-1.5">
            <div className={`h-4 w-12 rounded-md ${shimmerClass}`} />
            <div className={`h-3 w-8 rounded-md ${shimmerClass}`} />
          </div>
          <div className={`h-3 w-8 rounded-md ${shimmerClass}`} />
        </div>
      </div>
    </div>
  );
};

/**
 * Skeleton Grid for Product Cards
 */
export const ProductGridSkeleton: React.FC<{ count?: number }> = ({ count = 6 }) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
};

/**
 * Skeleton for Hero Promotional Banner
 * Matches exact curved shape, scooped arch at bottom, and slider dots
 */
export const HeroBannerSkeleton: React.FC = () => {
  return (
    <div className="relative mx-auto w-full max-w-[440px] sm:max-w-2xl px-2">
      <div className="relative overflow-hidden rounded-[32px] sm:rounded-[40px] bg-gradient-to-br from-[#D9E4CC] via-[#CFDDC0] to-[#C3D2B3] p-5 sm:p-7 min-h-[190px] sm:min-h-[220px] flex items-center justify-between shadow-xs border border-[#CBD7BD]">
        {/* Left Text Block */}
        <div className="z-10 max-w-[62%] space-y-2.5">
          {/* Tag badge */}
          <div className={`h-5 w-24 rounded-full ${shimmerClass}`} />
          {/* Title lines */}
          <div className={`h-5 sm:h-6 w-44 rounded-lg ${shimmerClass}`} />
          <div className={`h-5 sm:h-6 w-36 rounded-lg ${shimmerClass}`} />
          {/* Button */}
          <div className="pt-1">
            <div className={`h-8 sm:h-9 w-28 rounded-full ${shimmerClass}`} />
          </div>
        </div>

        {/* Right Circle Image Skeleton */}
        <div className="relative w-28 h-28 sm:w-36 sm:h-36 shrink-0">
          <div className={`w-full h-full rounded-full ${shimmerClass} shadow-md`} />
        </div>

        {/* Bottom Scooped Notch Skeleton */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 flex items-center justify-center">
          <div className="w-32 h-6 bg-[#F8FAF6] rounded-t-2xl flex items-center justify-center gap-1.5 pt-1">
            <div className="w-6 h-2 rounded-full bg-[#CBD7BD] animate-pulse" />
            <div className="w-2 h-2 rounded-full bg-[#CBD7BD] animate-pulse" />
            <div className="w-2 h-2 rounded-full bg-[#CBD7BD] animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  );
};

/**
 * Skeleton for Category Chips Horizontal Bar
 */
export const CategoryChipsSkeleton: React.FC = () => {
  return (
    <div className="space-y-2.5">
      <div className="flex items-center justify-between">
        <div className={`h-4 w-28 rounded-md ${shimmerClass}`} />
        <div className={`h-3 w-16 rounded-md ${shimmerClass}`} />
      </div>
      <div className="flex items-center gap-2.5 sm:gap-4 overflow-x-auto no-scrollbar py-1">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-[#E3E8DC] shadow-2xs shrink-0"
          >
            <div className={`w-7 h-7 rounded-full ${shimmerClass} shrink-0`} />
            <div className={`h-3 w-20 rounded-md ${shimmerClass}`} />
          </div>
        ))}
      </div>
    </div>
  );
};

/**
 * Skeleton for Product Details View
 * Matches exact layout of ProductDetailView.tsx
 */
export const ProductDetailSkeleton: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#F8FAF6] pb-32 pt-1 animate-in fade-in duration-300">
      <div className="max-w-md sm:max-w-lg mx-auto px-4 space-y-4">
        {/* 1. Main Square Image Container */}
        <div className="flex flex-col items-center">
          <div className="w-full aspect-[1/1] rounded-[28px] sm:rounded-[32px] overflow-hidden bg-[#E7EDE1] border border-[#DEE5D6] shadow-xs flex items-center justify-center">
            <div className={`w-full h-full ${shimmerClass}`} />
          </div>
          {/* 3-Dot Carousel Indicator */}
          <div className="flex items-center justify-center gap-1.5 mt-3">
            <div className="w-6 h-1.5 rounded-full bg-[#C2CDB9] animate-pulse" />
            <div className="w-2 h-1.5 rounded-full bg-[#D1D8CB] animate-pulse" />
            <div className="w-2 h-1.5 rounded-full bg-[#D1D8CB] animate-pulse" />
          </div>
        </div>

        {/* 2. Category, Title & Wishlist Button */}
        <div className="flex items-start justify-between gap-3 pt-1">
          <div className="flex-1 space-y-2">
            <div className={`h-3 w-24 rounded-md ${shimmerClass}`} />
            <div className={`h-6 w-3/4 rounded-lg ${shimmerClass}`} />
          </div>
          <div className={`w-10 h-10 rounded-full ${shimmerClass} shrink-0`} />
        </div>

        {/* 3. Weight selection & Qty Stepper */}
        <div className="flex items-end justify-between gap-4 pt-1">
          <div className="space-y-2">
            <div className={`h-3 w-20 rounded-md ${shimmerClass}`} />
            <div className="flex items-center gap-2">
              <div className={`w-16 h-8 rounded-xl ${shimmerClass}`} />
              <div className={`w-16 h-8 rounded-xl ${shimmerClass}`} />
              <div className={`w-16 h-8 rounded-xl ${shimmerClass}`} />
            </div>
          </div>
          <div className="space-y-2 flex flex-col items-end">
            <div className={`h-3 w-8 rounded-md ${shimmerClass}`} />
            <div className={`w-24 h-8 rounded-xl ${shimmerClass}`} />
          </div>
        </div>

        {/* 4. Description & Highlights */}
        <div className="pt-2 space-y-2">
          <div className={`h-4 w-44 rounded-md ${shimmerClass}`} />
          <div className={`h-3 w-full rounded-md ${shimmerClass}`} />
          <div className={`h-3 w-5/6 rounded-md ${shimmerClass}`} />
          <div className={`h-3 w-4/6 rounded-md ${shimmerClass}`} />

          <div className="pt-2 space-y-1.5">
            <div className={`h-3 w-36 rounded-md ${shimmerClass}`} />
            <div className={`h-3 w-64 rounded-md ${shimmerClass}`} />
            <div className={`h-3 w-56 rounded-md ${shimmerClass}`} />
          </div>
        </div>
      </div>

      {/* Floating Bottom Action Bar */}
      <div className="fixed bottom-5 inset-x-0 mx-auto max-w-md px-4 z-40">
        <div className="bg-white rounded-full p-2 pl-6 pr-2 shadow-[0_14px_45px_rgba(20,35,15,0.18)] border border-[#E3E9DC] flex items-center justify-between">
          <div className="space-y-1">
            <div className={`h-2.5 w-14 rounded-md ${shimmerClass}`} />
            <div className={`h-5 w-16 rounded-md ${shimmerClass}`} />
          </div>
          <div className={`w-36 h-11 rounded-full ${shimmerClass}`} />
        </div>
      </div>
    </div>
  );
};

/**
 * Skeleton for Shopping Cart View
 * Matches exact structure of CartView.tsx
 */
export const CartSkeleton: React.FC = () => {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 pb-32 sm:pb-16 pt-3 animate-in fade-in duration-300">
      {/* Header */}
      <div className="pb-4 space-y-1.5">
        <div className={`h-6 w-44 rounded-lg ${shimmerClass}`} />
        <div className={`h-3.5 w-64 rounded-md ${shimmerClass}`} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Cart Item Cards */}
        <div className="lg:col-span-7 space-y-3">
          {[1, 2].map((i) => (
            <div
              key={i}
              className="p-4 rounded-2xl bg-white border border-[#E6EAE0] flex items-center gap-4 shadow-xs"
            >
              <div className={`w-18 h-18 rounded-xl ${shimmerClass} shrink-0`} />
              <div className="flex-1 space-y-2">
                <div className={`h-2.5 w-16 rounded-md ${shimmerClass}`} />
                <div className={`h-4 w-40 rounded-md ${shimmerClass}`} />
                <div className="flex items-center gap-2">
                  <div className={`h-4 w-12 rounded-md ${shimmerClass}`} />
                  <div className={`h-4 w-10 rounded-md ${shimmerClass}`} />
                </div>
              </div>
              <div className="flex flex-col items-end gap-3 shrink-0">
                <div className={`w-5 h-5 rounded-md ${shimmerClass}`} />
                <div className={`w-20 h-7 rounded-lg ${shimmerClass}`} />
              </div>
            </div>
          ))}

          {/* Eco Banner Skeleton */}
          <div className="p-3.5 rounded-2xl bg-[#EEF5E3] flex items-center gap-2.5">
            <div className={`w-4 h-4 rounded-full ${shimmerClass} shrink-0`} />
            <div className={`h-3.5 w-72 rounded-md ${shimmerClass}`} />
          </div>
        </div>

        {/* Order Summary Skeleton */}
        <div className="lg:col-span-5 space-y-4">
          <div className="p-5 rounded-3xl bg-white border border-[#E6EAE0] shadow-xs space-y-4">
            <div className={`h-4 w-32 rounded-md ${shimmerClass}`} />
            <div className="space-y-2.5 py-1">
              <div className="flex justify-between">
                <div className={`h-3.5 w-20 rounded-md ${shimmerClass}`} />
                <div className={`h-3.5 w-12 rounded-md ${shimmerClass}`} />
              </div>
              <div className="flex justify-between">
                <div className={`h-3.5 w-16 rounded-md ${shimmerClass}`} />
                <div className={`h-3.5 w-10 rounded-md ${shimmerClass}`} />
              </div>
              <div className="flex justify-between pt-2 border-t border-[#EEF2E6]">
                <div className={`h-4 w-16 rounded-md ${shimmerClass}`} />
                <div className={`h-5 w-16 rounded-md ${shimmerClass}`} />
              </div>
            </div>
            {/* Checkout button */}
            <div className={`h-11 w-full rounded-2xl ${shimmerClass}`} />
          </div>
        </div>
      </div>
    </div>
  );
};

/**
 * Skeleton for Profile View
 * Matches exact structure of ProfileView.tsx
 */
export const ProfileSkeleton: React.FC = () => {
  return (
    <div className="max-w-xl mx-auto px-4 sm:px-6 pb-28 sm:pb-16 pt-3 animate-in fade-in duration-300 space-y-4">
      {/* 1. Profile Header Card */}
      <div className="p-5 rounded-3xl bg-white border border-[#E3E8DC] shadow-xs flex items-center justify-between">
        <div className="flex items-center gap-3.5">
          <div className={`w-14 h-14 rounded-full ${shimmerClass}`} />
          <div className="space-y-1.5">
            <div className={`h-4 w-32 rounded-md ${shimmerClass}`} />
            <div className={`h-3 w-40 rounded-md ${shimmerClass}`} />
            <div className={`h-2.5 w-24 rounded-md ${shimmerClass}`} />
          </div>
        </div>
        <div className={`w-9 h-9 rounded-full ${shimmerClass}`} />
      </div>

      {/* 2. Orders Skeleton */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between px-1">
          <div className={`h-3.5 w-24 rounded-md ${shimmerClass}`} />
          <div className={`h-3 w-16 rounded-md ${shimmerClass}`} />
        </div>

        {[1, 2].map((i) => (
          <div
            key={i}
            className="p-4 rounded-2xl bg-white border border-[#E3E8DC] shadow-xs space-y-3"
          >
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <div className={`h-3.5 w-24 rounded-md ${shimmerClass}`} />
                <div className={`h-2.5 w-20 rounded-md ${shimmerClass}`} />
              </div>
              <div className={`h-5 w-20 rounded-full ${shimmerClass}`} />
            </div>

            <div className="flex items-center gap-3 pt-1">
              <div className={`w-12 h-12 rounded-xl ${shimmerClass} shrink-0`} />
              <div className="flex-1 space-y-1.5">
                <div className={`h-3.5 w-44 rounded-md ${shimmerClass}`} />
                <div className={`h-3 w-32 rounded-md ${shimmerClass}`} />
              </div>
              <div className={`w-16 h-8 rounded-xl ${shimmerClass} shrink-0`} />
            </div>
          </div>
        ))}
      </div>

      {/* 3. Account Settings List Skeleton */}
      <div className="space-y-2">
        <div className={`h-3.5 w-28 rounded-md ${shimmerClass} ml-1`} />
        <div className="bg-white rounded-2xl border border-[#E3E8DC] shadow-xs divide-y divide-[#EEF2E6] overflow-hidden">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-xl ${shimmerClass}`} />
                <div className="space-y-1">
                  <div className={`h-3.5 w-32 rounded-md ${shimmerClass}`} />
                  <div className={`h-2.5 w-48 rounded-md ${shimmerClass}`} />
                </div>
              </div>
              <div className={`w-4 h-4 rounded-md ${shimmerClass}`} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

/**
 * Skeleton for Catalog Page View
 * Matches exact structure of CatalogView.tsx
 */
export const CatalogSkeleton: React.FC = () => {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 pb-28 sm:pb-16 pt-3 animate-in fade-in duration-300 space-y-5">
      {/* Search Bar Skeleton */}
      <div className="flex items-center gap-2">
        <div className={`h-11 flex-1 rounded-2xl ${shimmerClass}`} />
        <div className={`w-11 h-11 rounded-2xl ${shimmerClass} shrink-0`} />
      </div>

      {/* Category Pills Bar Skeleton */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className={`h-8 w-24 rounded-full ${shimmerClass} shrink-0`} />
        ))}
      </div>

      {/* Grid of Product Skeletons */}
      <ProductGridSkeleton count={8} />
    </div>
  );
};

/**
 * Skeleton for Admin CMS Portal View
 * Matches exact structure of AdminView.tsx
 */
export const AdminSkeleton: React.FC = () => {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 pb-28 pt-3 animate-in fade-in duration-300 space-y-5">
      {/* Top Banner Skeleton */}
      <div className="p-4 sm:p-5 rounded-3xl bg-[#192215] flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-[#2A3723] animate-pulse" />
          <div className="space-y-1.5">
            <div className="h-4 w-36 bg-[#2A3723] rounded-md animate-pulse" />
            <div className="h-3 w-48 bg-[#2A3723] rounded-md animate-pulse" />
          </div>
        </div>
        <div className="w-32 h-8 rounded-xl bg-[#2A3723] animate-pulse" />
      </div>

      {/* Sub-nav Tab Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className={`h-8 w-24 rounded-xl ${shimmerClass} shrink-0`} />
        ))}
      </div>

      {/* 4 Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="p-4 rounded-2xl bg-white border border-[#E3E8DC] shadow-xs space-y-2">
            <div className={`h-2.5 w-16 rounded-md ${shimmerClass}`} />
            <div className={`h-7 w-12 rounded-md ${shimmerClass}`} />
            <div className={`h-2.5 w-20 rounded-md ${shimmerClass}`} />
          </div>
        ))}
      </div>

      {/* List Rows */}
      <div className="space-y-2.5">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="p-3.5 rounded-2xl bg-white border border-[#E3E8DC] shadow-xs flex items-center justify-between gap-3"
          >
            <div className="flex items-center gap-3 flex-1">
              <div className={`w-12 h-12 rounded-xl ${shimmerClass} shrink-0`} />
              <div className="space-y-1.5 flex-1">
                <div className={`h-3.5 w-40 rounded-md ${shimmerClass}`} />
                <div className={`h-3 w-28 rounded-md ${shimmerClass}`} />
              </div>
            </div>
            <div className="flex gap-2">
              <div className={`w-8 h-8 rounded-xl ${shimmerClass}`} />
              <div className={`w-8 h-8 rounded-xl ${shimmerClass}`} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
