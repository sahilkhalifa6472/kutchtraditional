import React, { useState, useEffect } from 'react';
import {
  Heart,
  ShoppingBag,
  Zap,
  Flame,
  Clock,
  Eye,
  ShieldCheck,
  Truck,
  Sparkles,
  CheckCircle2,
  Package,
  Award,
  Star,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { Product } from '../types';

export interface ProductPageSettings {
  showRecentPurchase: boolean;
  showPhotoReviews: boolean;
  showSoldCounter: boolean;
  showCartReservationTimer: boolean;
  showFlashSaleTimer: boolean;
  showTrustBadges: boolean;
}

interface ProductDetailViewProps {
  product: Product;
  onAddToCart: (product: Product, size: string, price: number, quantity: number) => void;
  onBuyNow: (product: Product, size: string, price: number, quantity: number) => void;
  isWishlisted: boolean;
  onToggleWishlist: (product: Product) => void;
  settings?: ProductPageSettings;
}

export const ProductDetailView: React.FC<ProductDetailViewProps> = ({
  product,
  onAddToCart,
  onBuyNow,
  isWishlisted,
  onToggleWishlist,
  settings: propSettings,
}) => {
  const settings = propSettings || {
    showRecentPurchase: true,
    showPhotoReviews: true,
    showSoldCounter: true,
    showCartReservationTimer: true,
    showFlashSaleTimer: true,
    showTrustBadges: true,
  };
  const [selectedImageIdx, setSelectedImageIdx] = useState(0);
  const [selectedSizeObj, setSelectedSizeObj] = useState(
    product.sizes?.[0] || { size: 'Standard', price: product.price, volume: 'Standard Pack' }
  );

  useEffect(() => {
    if (product.sizes && product.sizes.length > 0) {
      setSelectedSizeObj(product.sizes[0]);
    }
  }, [product]);
  const [quantity, setQuantity] = useState(1);
  const [isAddedAnimation, setIsAddedAnimation] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  
  // Interactive features states
  const [viewingCount, setViewingCount] = useState(14);
  const [timeLeft, setTimeLeft] = useState({ hours: 4, minutes: 28, seconds: 45 });
  const [activeAccordion, setActiveAccordion] = useState<'storage' | 'benefits' | 'shipping' | 'recipes' | null>('benefits');
  const [recentPurchase, setRecentPurchase] = useState<{ name: string; city: string; time: string; item: string } | null>(null);
  const [isCartReserved, setIsCartReserved] = useState(false);
  const [cartTimer, setCartTimer] = useState(600); // 10 minutes

  // Cart reservation countdown timer
  useEffect(() => {
    if (!isCartReserved) return;
    const timer = setInterval(() => {
      setCartTimer((prev) => (prev > 0 ? prev - 1 : 600));
    }, 1000);
    return () => clearInterval(timer);
  }, [isCartReserved]);

  // Recent purchase toast popups rotation
  useEffect(() => {
    const purchases = [
      { name: 'Rahul Sharma', city: 'Mumbai', time: '2 mins ago', item: '500g Pack' },
      { name: 'Priya Patel', city: 'Ahmedabad', time: '5 mins ago', item: '1kg Pack' },
      { name: 'Aarav Mehta', city: 'Delhi', time: '1 min ago', item: '250g Pack' },
      { name: 'Sneha Reddy', city: 'Bengaluru', time: '4 mins ago', item: '500g Pack' },
    ];
    const timer = setInterval(() => {
      const randomPurchase = purchases[Math.floor(Math.random() * purchases.length)];
      setRecentPurchase(randomPurchase);
      setTimeout(() => {
        setRecentPurchase(null);
      }, 4500);
    }, 14000);
    return () => clearInterval(timer);
  }, []);

  // Randomize currently viewing count slightly for realism
  useEffect(() => {
    const interval = setInterval(() => {
      setViewingCount((prev) => {
        const delta = Math.floor(Math.random() * 5) - 2;
        const next = prev + delta;
        return next < 8 ? 12 : next > 28 ? 24 : next;
      });
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Countdown timer effect
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        }
        return { hours: 4, minutes: 30, seconds: 0 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const galleryImages = [
    product.images[0] || 'https://images.unsplash.com/photo-1508061253366-f7da158b6d46?auto=format&fit=crop&w=800&q=80',
    product.images[1] || 'https://images.unsplash.com/photo-1574570068036-e75bbc962e74?auto=format&fit=crop&w=800&q=80',
    product.images[2] || 'https://images.unsplash.com/photo-1563227812-0ea4c22e6cc8?auto=format&fit=crop&w=800&q=80',
  ];

  const currentImage = galleryImages[selectedImageIdx] || galleryImages[0];
  const totalPrice = selectedSizeObj.price * quantity;
  const originalPrice = product.originalPrice || Math.round(selectedSizeObj.price * 1.3);

  const handleAddAction = () => {
    setIsAddedAnimation(true);
    setIsCartReserved(true);
    onAddToCart(product, selectedSizeObj.size, selectedSizeObj.price, quantity);
    setTimeout(() => setIsAddedAnimation(false), 900);
  };

  const handleBuyAction = () => {
    setIsCartReserved(true);
    onBuyNow(product, selectedSizeObj.size, selectedSizeObj.price, quantity);
  };

  return (
    <div className="min-h-screen bg-[#F8FAF6] pb-40 pt-2 sm:pt-6 animate-in fade-in duration-300">
      <div className="max-w-4xl lg:max-w-5xl mx-auto px-4 sm:px-6">
        
        {/* Desktop 2-Column Grid / Mobile Single Column */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start">
          
          {/* Left Column: Product Image Gallery + Badges over Image */}
          <div className="flex flex-col items-center space-y-4">
            <div className="w-full aspect-[1/1] rounded-[28px] sm:rounded-[36px] overflow-hidden bg-[#EDF1E7] border border-[#E2E8DC] shadow-sm relative flex items-center justify-center group">
              {!imageLoaded && (
                <div className="absolute inset-0 bg-[#E3E8DC] animate-pulse" />
              )}
              <img
                src={currentImage}
                alt={product.name}
                onLoad={() => setImageLoaded(true)}
                className={`w-full h-full object-cover group-hover:scale-105 transition-all duration-500 ${
                  imageLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
                }`}
              />

              {/* Top-Left: Grey Glassy Currently Viewing Badge */}
              <div className="absolute top-3 left-3 flex flex-col gap-1.5 items-start z-10">
                {/* Grey Glassy Currently Viewing Badge */}
                <div className="bg-black/40 backdrop-blur-md text-white px-2.5 py-1 rounded-full text-[10.5px] font-bold flex items-center gap-1.5 shadow-sm border border-white/10">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#4ADE80] animate-ping" />
                  <Eye size={12} className="text-[#4ADE80]" />
                  <span>{viewingCount} viewing</span>
                </div>
              </div>

              {/* Top-Right: Only 4 left in stock badge */}
              <span className="absolute top-3 right-3 bg-black/50 backdrop-blur-md text-[#FFA600] text-[10.5px] font-black px-3 py-1 rounded-full shadow-md border border-white/10 flex items-center gap-1 z-10">
                🔥 Only 4 left
              </span>

              {/* Right Side Glassy Thumbnail Column Overlay */}
              <div className="absolute right-3 top-14 bottom-3 flex flex-col justify-center gap-2 z-20">
                <div className="bg-black/30 backdrop-blur-md p-1.5 rounded-2xl border border-white/20 shadow-lg flex flex-col gap-2">
                  {galleryImages.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedImageIdx(idx)}
                      className={`w-11 h-11 rounded-xl overflow-hidden border-2 transition-all cursor-pointer ${
                        selectedImageIdx === idx 
                          ? 'border-white ring-2 ring-white/50 scale-105 shadow-md' 
                          : 'border-white/30 opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img src={img} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Product Details & Actions */}
          <div className="space-y-4">
            
            {/* Light Flash Sale Timer Banner */}
            {settings.showFlashSaleTimer && (
              <div className="bg-[#F3F7EC] border border-[#DCE7D0] p-2.5 rounded-2xl flex items-center justify-between gap-2 shadow-2xs">
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-[#E5484D] text-white flex items-center justify-center shrink-0">
                    <Flame size={12} className="fill-white" />
                  </span>
                  <span className="text-[11px] font-extrabold text-[#2C3B24]">
                    Harvest Flash Sale ends in:
                  </span>
                </div>
                <span className="text-[11px] font-black text-[#527926] bg-white px-2.5 py-0.5 rounded-lg border border-[#D1E2BD]">
                  {String(timeLeft.hours).padStart(2, '0')}h : {String(timeLeft.minutes).padStart(2, '0')}m : {String(timeLeft.seconds).padStart(2, '0')}s
                </span>
              </div>
            )}

            {/* Category, Title, Rating & Wishlist */}
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#8C9886]">
                    {product.category || 'Kutch Heritage'}
                  </span>
                  <span className="w-1 h-1 rounded-full bg-[#B2C2A6]" />
                  <div className="flex items-center gap-1 text-[#E69B00] text-xs font-black">
                    <Star size={13} className="fill-[#E69B00]" />
                    <span>{product.rating || 4.9}</span>
                    <span className="text-[#8C9886] font-normal">({product.reviewCount || 128} reviews)</span>
                  </div>
                </div>

                <h1 className="text-xl sm:text-2xl lg:text-3xl font-black text-[#192316] leading-tight">
                  {product.name}
                </h1>
              </div>

              <button
                onClick={() => onToggleWishlist(product)}
                aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
                className="w-11 h-11 rounded-full border border-[#E3E9DC] bg-white flex items-center justify-center shrink-0 hover:bg-[#F3F6ED] active:scale-90 transition-all shadow-xs cursor-pointer"
              >
                <Heart
                  size={22}
                  className={`transition-colors ${
                    isWishlisted ? 'fill-[#E5484D] text-[#E5484D]' : 'text-[#7D8B78]'
                  }`}
                />
              </button>
            </div>

            {/* Sold Counter Badge */}
            {settings.showSoldCounter && (
              <div className="inline-flex items-center gap-1.5 bg-[#FFF8ED] border border-[#FDE6C8] text-[#B45309] text-[11px] font-extrabold px-3 py-1.5 rounded-full shadow-2xs">
                <Flame size={13} className="text-[#F59E0B] fill-[#F59E0B]" />
                <span>342 units sold in the last 7 days</span>
              </div>
            )}

            {/* Price Block with Discount */}
            <div className="flex items-center justify-between bg-white p-4 rounded-2xl border border-[#E3E9DC]">
              <div className="flex items-baseline gap-2">
                <span className="text-2xl sm:text-3xl font-black text-[#192315]">
                  ₹{selectedSizeObj.price}
                </span>
                <span className="text-sm font-bold text-[#869580] line-through">
                  ₹{originalPrice}
                </span>
              </div>
              <span className="text-xs font-extrabold text-[#E5484D] bg-[#FEECEC] px-3 py-1.5 rounded-xl">
                Save ₹{originalPrice - selectedSizeObj.price} (20% Off)
              </span>
            </div>

            {/* Select Weight & Quantity Box */}
            <div className="bg-white p-5 rounded-3xl border border-[#E3E9DC] shadow-2xs space-y-4">
              <div>
                <label className="text-xs font-bold text-[#879582] block mb-2 uppercase tracking-wide">
                  Select Size / Variant Option
                </label>
                <div className="flex flex-wrap items-center gap-2">
                  {product.sizes.map((s) => {
                    const isSelected = selectedSizeObj.size === s.size;
                    return (
                      <button
                        key={s.size}
                        onClick={() => setSelectedSizeObj(s)}
                        className={`px-3.5 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer flex flex-col items-center justify-center ${
                          isSelected
                            ? 'bg-[#FF5722] text-white shadow-xs scale-105'
                            : 'bg-[#EAEFE6] text-[#47553F] hover:bg-[#DEE5D8]'
                        }`}
                      >
                        <span className="font-extrabold">{s.size}</span>
                        {s.volume && (
                          <span className={`text-[9px] font-medium leading-tight mt-0.5 ${isSelected ? 'text-white/90' : 'text-[#697B65]'}`}>
                            {s.volume}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="pt-2">
                <span className="text-xs font-bold text-[#879582] block uppercase tracking-wide mb-1.5">
                  Select Quantity ({quantity} pack{quantity > 1 ? 's' : ''})
                </span>
                <div className="flex items-center rounded-xl bg-[#EAEFE6] px-3.5 py-2 gap-4 w-fit">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    aria-label="Decrease quantity"
                    className="text-base font-black text-[#2A3723] hover:text-black active:scale-90 cursor-pointer select-none leading-none"
                  >
                    −
                  </button>
                  <span className="text-sm font-extrabold text-[#192315] min-w-[20px] text-center select-none">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    aria-label="Increase quantity"
                    className="text-base font-black text-[#2A3723] hover:text-black active:scale-90 cursor-pointer select-none leading-none"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>

            {/* Trust, Quality & Safety Badges Grid */}
            {settings.showTrustBadges && (
              <div className="grid grid-cols-3 gap-2 w-full pt-1">
                <div className="flex flex-col items-center text-center p-3 rounded-2xl bg-white border border-[#E3E9DC] shadow-2xs space-y-1">
                  <div className="w-8 h-8 rounded-xl bg-[#F0F5EA] text-[#69922C] flex items-center justify-center shrink-0">
                    <ShieldCheck size={16} />
                  </div>
                  <div>
                    <span className="text-[10px] font-extrabold text-[#192215] block leading-tight">100% Organic</span>
                    <span className="text-[8.5px] text-[#71826B] leading-tight">Lab Tested Purity</span>
                  </div>
                </div>

                <div className="flex flex-col items-center text-center p-3 rounded-2xl bg-white border border-[#E3E9DC] shadow-2xs space-y-1">
                  <div className="w-8 h-8 rounded-xl bg-[#F0F5EA] text-[#69922C] flex items-center justify-center shrink-0">
                    <Award size={16} />
                  </div>
                  <div>
                    <span className="text-[10px] font-extrabold text-[#192215] block leading-tight">Direct Orchards</span>
                    <span className="text-[8.5px] text-[#71826B] leading-tight">Srinagar Farms</span>
                  </div>
                </div>

                <div className="flex flex-col items-center text-center p-3 rounded-2xl bg-white border border-[#E3E9DC] shadow-2xs space-y-1">
                  <div className="w-8 h-8 rounded-xl bg-[#F0F5EA] text-[#69922C] flex items-center justify-center shrink-0">
                    <CheckCircle2 size={16} />
                  </div>
                  <div>
                    <span className="text-[10px] font-extrabold text-[#192215] block leading-tight">Secure & Returns</span>
                    <span className="text-[8.5px] text-[#71826B] leading-tight">7-Day Guarantee</span>
                  </div>
                </div>
              </div>
            )}

            {/* Free Shipping Progress Bar */}
            <div className="bg-white p-3.5 rounded-2xl border border-[#E3E9DC] space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-[#192315]">
                <span className="flex items-center gap-1.5 text-[#527926]">
                  <Truck size={14} /> Free Shipping Progress
                </span>
                <span>{totalPrice >= 999 ? '🎉 FREE Express Shipping Unlocked!' : `Add ₹${Math.max(0, 999 - totalPrice)} more for FREE Shipping!`}</span>
              </div>
              <div className="w-full bg-[#EAEFE6] h-2 rounded-full overflow-hidden">
                <div 
                  className="bg-gradient-to-r from-[#FF5722] to-[#6B922A] h-full transition-all duration-500 rounded-full"
                  style={{ width: `${Math.min(100, (totalPrice / 999) * 100)}%` }}
                />
              </div>
            </div>

            {/* Bundle & Save (Frequently Bought Together) */}
            <div className="bg-gradient-to-br from-[#F4F8EC] to-[#EAEFE6] p-4 rounded-3xl border border-[#D5E2C5] space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black uppercase tracking-wider text-[#3E5C1D] flex items-center gap-1.5">
                  <Sparkles size={14} className="text-[#FF5722]" /> Bundle & Save 10% Off
                </span>
                <span className="text-[10px] font-extrabold bg-[#FF5722] text-white px-2 py-0.5 rounded-full">
                  Popular Combo
                </span>
              </div>
              <div className="flex items-center gap-3 bg-white p-2.5 rounded-2xl border border-[#E2E8D8]">
                <div className="w-12 h-12 rounded-xl bg-[#F2F6ED] overflow-hidden shrink-0">
                  <img src="https://images.unsplash.com/photo-1541592106381-b31e9677c0e5?auto=format&fit=crop&w=300&q=80" alt="Saffron" className="w-full h-full object-cover" />
                </div>
                <div className="min-w-0 flex-1">
                  <h4 className="text-xs font-extrabold text-[#192315] truncate">Kashmiri Mongra Saffron (1g)</h4>
                  <span className="text-[10px] font-bold text-[#71806B]">Add to get 10% off combo</span>
                </div>
                <button
                  onClick={() => onAddToCart(product, '1g Combo', Math.round(selectedSizeObj.price * 0.9 + 299), 1)}
                  className="px-3 py-1.5 bg-[#FF5722] hover:bg-[#789D35] text-white rounded-xl text-xs font-bold transition-all cursor-pointer shadow-2xs shrink-0"
                >
                  Add Combo
                </button>
              </div>
            </div>

            {/* Accordions: Description, Storage, Recipes & Usage */}
            <div className="space-y-2.5">
              <div className="bg-white rounded-2xl border border-[#E3E9DC] overflow-hidden">
                <button
                  onClick={() => setActiveAccordion(activeAccordion === 'benefits' ? null : 'benefits')}
                  className="w-full px-4 py-3 flex items-center justify-between text-xs font-bold text-[#192315] cursor-pointer hover:bg-[#F8FAF6]"
                >
                  <span className="flex items-center gap-2">
                    <Award size={15} className="text-[#FF5722]" />
                    <span>Nutritional Highlights & Benefits</span>
                  </span>
                  {activeAccordion === 'benefits' ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </button>
                {activeAccordion === 'benefits' && (
                  <div className="px-4 pb-3 pt-1 border-t border-[#EEF2EA] space-y-1.5">
                    <p className="text-xs text-[#52634B] leading-relaxed mb-2">
                      {product.description}
                    </p>
                    {product.benefits?.map((b, i) => (
                      <div key={i} className="text-xs text-[#52634B] flex items-center gap-2">
                        <CheckCircle2 size={13} className="text-[#FF5722] shrink-0" />
                        <span>{b}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="bg-white rounded-2xl border border-[#E3E9DC] overflow-hidden">
                <button
                  onClick={() => setActiveAccordion(activeAccordion === 'storage' ? null : 'storage')}
                  className="w-full px-4 py-3 flex items-center justify-between text-xs font-bold text-[#192315] cursor-pointer hover:bg-[#F8FAF6]"
                >
                  <span className="flex items-center gap-2">
                    <Package size={15} className="text-[#FF5722]" />
                    <span>Storage & Freshness Instructions</span>
                  </span>
                  {activeAccordion === 'storage' ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </button>
                {activeAccordion === 'storage' && (
                  <div className="px-4 pb-3 pt-1 border-t border-[#EEF2EA]">
                    <p className="text-xs text-[#52634B] leading-relaxed">
                      Store in an airtight container in a cool, dry place away from direct sunlight. Refrigeration recommended for extended crispness and shelf life.
                    </p>
                  </div>
                )}
              </div>

              <div className="bg-white rounded-2xl border border-[#E3E9DC] overflow-hidden">
                <button
                  onClick={() => setActiveAccordion(activeAccordion === 'recipes' ? null : 'recipes')}
                  className="w-full px-4 py-3 flex items-center justify-between text-xs font-bold text-[#192315] cursor-pointer hover:bg-[#F8FAF6]"
                >
                  <span className="flex items-center gap-2">
                    <Sparkles size={15} className="text-[#FF5722]" />
                    <span>Recipes & Daily Usage Ideas</span>
                  </span>
                  {activeAccordion === 'recipes' ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </button>
                {activeAccordion === 'recipes' && (
                  <div className="px-4 pb-3 pt-1 border-t border-[#EEF2EA] space-y-1.5">
                    <p className="text-xs text-[#52634B] leading-relaxed">
                      • <strong>Morning Boost:</strong> Soak 4-5 kernels overnight and consume first thing in the morning for peak vitality.
                    </p>
                    <p className="text-xs text-[#52634B] leading-relaxed">
                      • <strong>Culinary & Desserts:</strong> Garnish traditional kheer, shakes, and gourmet salads with crushed pieces for rich aroma.
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Verified Customer Photo Reviews */}
            {settings.showPhotoReviews && (
              <div className="bg-white p-4 sm:p-5 rounded-3xl border border-[#E3E9DC] space-y-3 shadow-2xs">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-[#F0F5EA] text-[#69922C] flex items-center justify-center font-black text-xs">
                      4.9
                    </div>
                    <div>
                      <h3 className="text-xs font-extrabold text-[#192315]">Verified Customer Reviews</h3>
                      <span className="text-[10px] text-[#71806B]">428 Photo & Video Unboxings</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 text-[#F59E0B]">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={12} className="fill-[#F59E0B]" />
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 pt-1">
                  {[
                    { img: 'https://images.unsplash.com/photo-1508061253366-f7da154b6d46?auto=format&fit=crop&w=300&q=80', user: 'Vikram S.', comment: 'Super fresh and crunchy!' },
                    { img: 'https://images.unsplash.com/photo-1515543237350-b3eea1ec8082?auto=format&fit=crop&w=300&q=80', user: 'Ananya K.', comment: 'Original valley quality.' },
                    { img: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=300&q=80', user: 'Rohit M.', comment: 'Fast delivery & premium.' },
                  ].map((rev, idx) => (
                    <div key={idx} className="relative group rounded-2xl overflow-hidden border border-[#E5EADF] aspect-square bg-[#F5F8F2]">
                      <img src={rev.img} alt={rev.user} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent flex flex-col justify-end p-2 text-white">
                        <span className="text-[10px] font-bold leading-tight">{rev.user}</span>
                        <span className="text-[9px] text-white/80 line-clamp-1">{rev.comment}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>
        </div>
      </div>

      {/* Recent Purchase Toast Popup */}
      {recentPurchase && settings.showRecentPurchase && (
        <div className="fixed bottom-20 left-4 z-50 bg-white/95 backdrop-blur-md text-[#192315] py-2 pl-2 pr-4 rounded-full shadow-[0_10px_30px_rgba(0,0,0,0.15)] border border-[#D5E2C5] flex items-center gap-3 max-w-xs animate-slide-up transition-all">
          <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-[#FF5722] shrink-0 shadow-sm bg-white">
            <img src={currentImage} alt={product.name} className="w-full h-full object-cover" />
          </div>
          <div className="min-w-0 pr-1">
            <p className="text-[11px] font-extrabold text-[#192315] truncate leading-tight">
              {recentPurchase.name} <span className="font-normal text-[#55634D]">ordered {recentPurchase.item}</span>
            </p>
            <p className="text-[10px] text-[#6B8E23] font-bold truncate flex items-center gap-1 mt-0.5">
              <span>📍 {recentPurchase.city}</span>
              <span>•</span>
              <span>🕒 {recentPurchase.time}</span>
            </p>
          </div>
        </div>
      )}

      {/* Sticky Bottom Action Bar at the very bottom */}
      <div className="fixed bottom-0 inset-x-0 bg-white/95 backdrop-blur-md border-t border-x border-[#E3E9DC] px-4 py-3 z-40 shadow-[0_-8px_30px_rgba(20,35,15,0.12)] rounded-t-3xl max-w-xl mx-auto">
        <div className="space-y-2">
          {isCartReserved && settings.showCartReservationTimer && (
            <div className="bg-[#FFF4EC] border border-[#FDE0D0] px-3 py-1.5 rounded-xl flex items-center justify-between gap-2 animate-in fade-in duration-300">
              <div className="flex items-center gap-1.5">
                <span className="w-4 h-4 rounded-full bg-[#E5484D] text-white flex items-center justify-center shrink-0">
                  <Clock size={10} className="text-white" />
                </span>
                <span className="text-[10px] font-extrabold text-[#7C2D12]">Cart Reserved for:</span>
              </div>
              <span className="text-[10px] font-black text-[#C2410C] bg-white px-2 py-0.5 rounded border border-[#FCD34D]">
                {String(Math.floor(cartTimer / 60)).padStart(2, '0')}:{String(cartTimer % 60).padStart(2, '0')} mins
              </span>
            </div>
          )}

          <div className="flex items-center justify-between gap-4">
            <div>
              <span className="text-[10px] font-semibold text-[#869480] block">
                Total ({quantity} pack{quantity > 1 ? 's' : ''})
              </span>
              <span className="text-xl font-black text-[#192315] leading-tight block">
                ₹{totalPrice}
              </span>
            </div>

            <div className="flex items-center gap-2.5">
              {/* Add to Cart Button */}
              <button
                onClick={handleAddAction}
                className={`px-4 py-2.5 rounded-xl flex items-center gap-2 text-xs font-extrabold transition-all cursor-pointer active:scale-95 border ${
                  isAddedAnimation 
                    ? 'bg-[#7DA535] text-white border-[#7DA535]' 
                    : 'bg-[#F2F6ED] text-[#192315] border-[#DEE7D4] hover:bg-[#E5EEDB]'
                }`}
              >
                <ShoppingBag size={15} strokeWidth={2.4} />
                <span>{isAddedAnimation ? 'Added!' : 'Add to Bag'}</span>
              </button>

              {/* Buy Now Button */}
              <button
                onClick={handleBuyAction}
                className="bg-[#FF5722] hover:bg-[#79A037] active:scale-95 text-white font-extrabold px-5 py-2.5 rounded-xl flex items-center gap-1.5 text-xs shadow-xs transition-all cursor-pointer"
              >
                <Zap size={15} className="fill-white" />
                <span>Buy Now</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
