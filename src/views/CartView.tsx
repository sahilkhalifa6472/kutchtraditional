import React, { useState } from 'react';
import { Minus, Plus, Trash2, ArrowRight, Tag, ShieldCheck, ShoppingBag, Truck } from 'lucide-react';
import { CartItem } from '../types';
import { CartSkeleton } from '../components/Skeletons';

interface CartViewProps {
  items: CartItem[];
  isLoading?: boolean;
  onUpdateQuantity: (id: string, delta: number) => void;
  onRemoveItem: (id: string) => void;
  onExploreProducts: () => void;
  onOpenCheckout: () => void;
  appliedPromo: string | null;
  onApplyPromo: (code: string) => void;
  onRemovePromo: () => void;
}

export const CartView: React.FC<CartViewProps> = ({
  items,
  isLoading = false,
  onUpdateQuantity,
  onRemoveItem,
  onExploreProducts,
  onOpenCheckout,
  appliedPromo,
  onApplyPromo,
  onRemovePromo,
}) => {
  const [promoInput, setPromoInput] = useState('');
  const [promoError, setPromoError] = useState('');

  if (isLoading) {
    return <CartSkeleton />;
  }

  const subtotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);

  // Calculate discount if promo applied
  let discount = 0;
  if (appliedPromo === 'FIRSTPURCHASE' || appliedPromo === 'KUTCH20') {
    discount = Math.round(subtotal * 0.2); // 20% off
  } else if (appliedPromo === 'GLOW50') {
    discount = Math.min(50, Math.round(subtotal * 0.25));
  }

  const shipping = subtotal > 60 || subtotal === 0 ? 0 : 15;
  const total = Math.max(0, subtotal - discount + shipping);

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanCode = promoInput.trim().toUpperCase();
    if (cleanCode === 'FIRSTPURCHASE' || cleanCode === 'KUTCH20' || cleanCode === 'GLOW50') {
      onApplyPromo(cleanCode);
      setPromoError('');
      setPromoInput('');
    } else {
      setPromoError('Invalid coupon. Try "FIRSTPURCHASE" for 20% off!');
    }
  };

  if (items.length === 0) {
    return (
      <div className="max-w-md mx-auto px-6 py-24 text-center animate-in fade-in duration-300">
        <div className="w-20 h-20 rounded-full bg-[#EBF3D9] flex items-center justify-center text-[#558421] mx-auto mb-4">
          <ShoppingBag size={34} strokeWidth={2} />
        </div>
        <h2 className="text-xl font-extrabold text-[#191F17]">
          Your bag is empty
        </h2>
        <p className="text-xs sm:text-sm text-[#7A8673] mt-2 max-w-[260px] mx-auto">
          Explore Kutch Traditional's authentic collection.
        </p>
        <button
          onClick={onExploreProducts}
          className="mt-6 px-7 py-3 rounded-full bg-[#FF5722] text-white text-xs font-bold shadow-md hover:bg-[#7EA536] active:scale-95 transition-all cursor-pointer"
        >
          Explore Collection
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 pb-32 sm:pb-16 pt-3 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex items-center justify-between pb-4">
        <div>
          <h2 className="text-xl font-extrabold text-[#191F17]">
            Shopping Bag ({items.length})
          </h2>
          <span className="text-xs text-[#7A8673] font-medium">
            Free Carbon-Neutral Delivery applied on qualifying items
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Cart Items List */}
        <div className="lg:col-span-7 space-y-3">
          {items.map((item) => (
            <div
              key={item.id}
              className="p-4 rounded-2xl bg-white border border-[#E6EAE0] flex items-center gap-4 shadow-xs"
            >
              {/* Thumbnail */}
              <div className="w-18 h-18 rounded-xl bg-[#F0F2EC] overflow-hidden shrink-0">
                <img
                  src={item.product.images[0]}
                  alt={item.product.name}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Details */}
              <div className="flex-1 min-w-0">
                <span className="text-[10px] font-bold text-[#869280] uppercase tracking-wider block">
                  {item.product.category}
                </span>
                <h3 className="text-xs sm:text-sm font-extrabold text-[#191F17] truncate">
                  {item.product.name}
                </h3>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-[11px] px-2 py-0.5 rounded-md bg-[#F2F5ED] text-[#47543F] font-semibold">
                    {item.selectedSize}
                  </span>
                  <span className="text-xs font-bold text-[#191F17]">
                    ₹{item.price}
                  </span>
                </div>
              </div>

              {/* Quantity and Remove */}
              <div className="flex flex-col items-end gap-2 shrink-0">
                <button
                  onClick={() => onRemoveItem(item.id)}
                  aria-label="Remove item"
                  className="text-[#9CA695] hover:text-[#E5484D] transition-colors p-1 cursor-pointer"
                >
                  <Trash2 size={16} />
                </button>

                <div className="flex items-center rounded-lg bg-[#F5F7F0] border border-[#DEE3D7] px-2 py-0.5">
                  <button
                    onClick={() => onUpdateQuantity(item.id, -1)}
                    className="w-6 h-6 flex items-center justify-center text-[#55624E] hover:text-[#191F17] cursor-pointer"
                  >
                    <Minus size={12} strokeWidth={2.5} />
                  </button>
                  <span className="w-6 text-center text-xs font-extrabold text-[#191F17]">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => onUpdateQuantity(item.id, 1)}
                    className="w-6 h-6 flex items-center justify-center text-[#55624E] hover:text-[#191F17] cursor-pointer"
                  >
                    <Plus size={12} strokeWidth={2.5} />
                  </button>
                </div>
              </div>
            </div>
          ))}

          <div className="p-3.5 rounded-2xl bg-[#EEF5E3] text-[#375817] text-xs font-semibold flex items-center gap-2.5">
            <Truck size={17} className="shrink-0" />
            <span>All orders are shipped fresh in recyclable, biodegradable packaging.</span>
          </div>
        </div>

        {/* Right Summary Column */}
        <div className="lg:col-span-5 space-y-4">
          {/* Promo Code Section */}
          <div className="p-4 rounded-2xl bg-white border border-[#E6EAE0] shadow-xs">
            <label className="text-xs font-bold text-[#191F17] block mb-2 flex items-center gap-1.5">
              <Tag size={13} className="text-[#FF5722]" />
              <span>Promo Code</span>
            </label>

            {appliedPromo ? (
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#F0F7E4] border border-[#D1E4B9] text-xs">
                <span className="font-bold text-[#456C1C]">
                  🎉 "{appliedPromo}" Applied (20% OFF)
                </span>
                <button
                  onClick={onRemovePromo}
                  className="text-[#7A8870] hover:text-[#E5484D] font-bold text-xs cursor-pointer"
                >
                  Remove
                </button>
              </div>
            ) : (
              <form onSubmit={handleApplyPromo} className="flex gap-2">
                <input
                  type="text"
                  value={promoInput}
                  onChange={(e) => setPromoInput(e.target.value)}
                  placeholder="Enter FIRSTPURCHASE"
                  className="flex-1 px-3 py-2 text-xs rounded-xl border border-[#DFE4DA] focus:outline-none focus:border-[#FF5722] uppercase"
                />
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-[#111612] text-white text-xs font-bold hover:bg-black transition-colors cursor-pointer"
                >
                  Apply
                </button>
              </form>
            )}

            {promoError && (
              <p className="text-[11px] text-[#E5484D] mt-1.5">{promoError}</p>
            )}

            {!appliedPromo && (
              <button
                onClick={() => onApplyPromo('FIRSTPURCHASE')}
                className="mt-2 text-[11px] text-[#638C2B] font-semibold underline text-left block cursor-pointer"
              >
                Click here to apply 20% discount (Code: FIRSTPURCHASE)
              </button>
            )}
          </div>

          {/* Order Summary */}
          <div className="p-5 rounded-2xl bg-white border border-[#E6EAE0] shadow-xs space-y-2.5 text-xs">
            <h3 className="font-bold text-sm text-[#191F17] mb-1">Price Summary</h3>
            <div className="flex justify-between text-[#687462]">
              <span>Subtotal</span>
              <span className="font-medium text-[#191F17]">₹{subtotal}</span>
            </div>
            {discount > 0 && (
              <div className="flex justify-between text-[#FF5722] font-semibold">
                <span>Special Offer Discount</span>
                <span>-₹{discount}</span>
              </div>
            )}
            <div className="flex justify-between text-[#687462]">
              <span>Carbon-Neutral Shipping</span>
              <span className="text-[#FF5722] font-semibold">
                {shipping === 0 ? 'FREE' : `₹${shipping}`}
              </span>
            </div>
            <div className="border-t border-[#EEF2E8] pt-2.5 flex justify-between text-base font-extrabold text-[#191F17]">
              <span>Total</span>
              <span>₹{total}</span>
            </div>

            <button
              onClick={onOpenCheckout}
              className="w-full mt-2 py-3.5 rounded-full bg-[#FF5722] text-white font-bold text-sm shadow-md hover:bg-[#7EA536] active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
