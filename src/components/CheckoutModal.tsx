import React, { useState, useEffect } from 'react';
import { X, CheckCircle, ShieldCheck, Truck, CreditCard, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';
import { CartItem } from '../types';
import { createOrderInFirestore, OrderRecord } from '../lib/firestoreService';
import { User } from 'firebase/auth';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  subtotal: number;
  discount: number;
  total: number;
  appliedPromo: string | null;
  onClearCart: () => void;
  onAutoCreateAccount?: (name: string, email: string, phone: string) => void;
  user?: User | null;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  items,
  subtotal,
  discount,
  total,
  appliedPromo,
  onClearCart,
  onAutoCreateAccount,
  user,
}) => {
  const [step, setStep] = useState<'form' | 'success'>('form');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'online' | 'cod'>('online');
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderId, setOrderId] = useState('');

  // Sync user details when modal opens or user changes
  useEffect(() => {
    if (isOpen) {
      setName(user?.displayName || '');
      setEmail(user?.email || '');
      setPhone(user?.phoneNumber || '');
      setStep('form');
    }
  }, [isOpen, user]);

  if (!isOpen) return null;

  const codCharge = paymentMethod === 'cod' ? 50 : 0;
  const finalTotal = total + codCharge;

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    const randomId = 'SZ-' + Math.floor(100000 + Math.random() * 900000);
    const trackingCode = 'SZ' + Math.floor(10000000 + Math.random() * 90000000) + 'IN';

    const finalizeOrder = async () => {
      // 1. Automatically create / log in user account with entered details
      if (onAutoCreateAccount) {
        onAutoCreateAccount(name, email, phone);
      }

      // 2. Save order to Firebase Cloud Firestore
      const newOrder: OrderRecord = {
        id: `ord-${Date.now()}`,
        orderNumber: `#${randomId}`,
        customerName: name,
        customerEmail: email,
        customerPhone: phone,
        shippingAddress: `${address}, ${city}`,
        date: new Date().toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' }),
        total: finalTotal,
        subtotal: subtotal,
        discount: discount,
        shipping: 0,
        status: 'Processing',
        carrier: 'Express Cold-Chain Delivery',
        trackingNumber: trackingCode,
        productName: items[0]?.product.name || 'Kutch Traditional Package',
        productSize: items[0]?.selectedSize || '500g',
        quantity: items.reduce((acc, i) => acc + i.quantity, 0),
      };

      try {
        await createOrderInFirestore(newOrder);
        console.log('[Firestore] Order persisted to Firebase Cloud Database:', newOrder.id);
      } catch (err) {
        console.warn('[Firestore] Failed to persist order to cloud:', err);
      }

      setIsProcessing(false);
      setOrderId(randomId);
      setStep('success');
      onClearCart();

      // Trigger Confetti
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#FF5722', '#A3D95B', '#111612', '#F8FAF6'],
        });
      } catch (err) {
        // Safe fallback
      }
    };

    setTimeout(async () => {
      await finalizeOrder();
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-xs p-0 sm:p-4">
      <div
        className="w-full max-w-[430px] bg-white rounded-t-[32px] sm:rounded-[32px] p-6 shadow-2xl max-h-[90vh] overflow-y-auto no-scrollbar animate-in slide-in-from-bottom duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {step === 'form' ? (
          <div>
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-[#F0F2EB]">
              <div>
                <h2 className="text-base font-extrabold text-[#191F17]">
                  Express Checkout & Auto Account
                </h2>
                <span className="text-[11px] text-[#7A8572]">
                  {items.length} items • Account created instantly
                </span>
              </div>
              <button
                onClick={onClose}
                aria-label="Close checkout"
                className="w-8 h-8 rounded-full bg-[#F4F6F0] flex items-center justify-center text-[#626C5C] hover:text-[#191F17] cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handlePlaceOrder} className="pt-4 space-y-4">
              {/* Customer & Delivery Details */}
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-[#798572] block mb-2">
                  Customer & Delivery Details (India)
                </label>
                <div className="space-y-2">
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Full Name"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#DFE4DA] text-xs text-[#191F17] focus:outline-none focus:border-[#FF5722]"
                  />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email Address (Account ID)"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#DFE4DA] text-xs text-[#191F17] focus:outline-none focus:border-[#FF5722]"
                  />
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="Mobile Number (+91 ...)"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#DFE4DA] text-xs text-[#191F17] focus:outline-none focus:border-[#FF5722]"
                  />
                  <input
                    type="text"
                    required
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Street Address"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#DFE4DA] text-xs text-[#191F17] focus:outline-none focus:border-[#FF5722]"
                  />
                  <input
                    type="text"
                    required
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="City, State, Pincode"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#DFE4DA] text-xs text-[#191F17] focus:outline-none focus:border-[#FF5722]"
                  />
                </div>
              </div>

              {/* Payment Method */}
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-[#798572] block mb-2">
                  Payment Method
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('online')}
                    className={`p-3 rounded-2xl border text-left text-xs font-bold transition-all cursor-pointer flex flex-col gap-1 ${
                      paymentMethod === 'online'
                        ? 'border-[#FF5722] bg-[#F4F9EB] text-[#416819] shadow-xs'
                        : 'border-[#E0E5DC] text-[#616D59]'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm">💳 Pay Online</span>
                      <CreditCard size={14} className="text-[#FF5722]" />
                    </div>
                    <span className="text-[10px] font-normal text-[#6B7B65]">UPI, Cards, QR, NetBanking</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('cod')}
                    className={`p-3 rounded-2xl border text-left text-xs font-bold transition-all cursor-pointer flex flex-col gap-1 ${
                      paymentMethod === 'cod'
                        ? 'border-[#FF5722] bg-[#F4F9EB] text-[#416819] shadow-xs'
                        : 'border-[#E0E5DC] text-[#616D59]'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm">💵 COD</span>
                      <span className="text-[10px] font-bold text-orange-600 bg-orange-100 px-1.5 py-0.5 rounded">+₹50 fee</span>
                    </div>
                    <span className="text-[10px] font-normal text-[#6B7B65]">Cash on Delivery</span>
                  </button>
                </div>
              </div>

              {/* Order Summary Recap */}
              <div className="p-3.5 rounded-2xl bg-[#F6F8F2] border border-[#DEE5D6] space-y-1.5 text-xs">
                <div className="flex justify-between text-[#687462]">
                  <span>Subtotal</span>
                  <span>₹{subtotal}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-[#FF5722] font-semibold">
                    <span>Discount ({appliedPromo})</span>
                    <span>-₹{discount}</span>
                  </div>
                )}
                <div className="flex justify-between text-[#687462]">
                  <span>Express Cold-Chain Shipping</span>
                  <span className="text-[#FF5722] font-semibold">FREE</span>
                </div>
                {paymentMethod === 'cod' && (
                  <div className="flex justify-between text-orange-700 font-semibold">
                    <span>COD Handling Charge</span>
                    <span>+₹50</span>
                  </div>
                )}
                <div className="border-t border-[#DFE6D5] pt-1.5 flex justify-between font-extrabold text-sm text-[#191F17]">
                  <span>Total Amount</span>
                  <span>₹{finalTotal}</span>
                </div>
              </div>

              <div className="flex items-center gap-2 text-[11px] text-[#7E8B76]">
                <ShieldCheck size={14} className="text-[#FF5722]" />
                <span>Account auto-created & 100% Secure Checkout</span>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isProcessing}
                className="w-full py-3.5 rounded-full bg-[#FF5722] text-white font-bold text-sm shadow-md hover:bg-[#7DA535] active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isProcessing ? (
                  <span>Processing Order...</span>
                ) : (
                  <>
                    <span>{paymentMethod === 'online' ? `Pay Online ₹{finalTotal} & Order` : `Place COD Order (₹{finalTotal})`}</span>
                    <Sparkles size={16} />
                  </>
                )}
              </button>
            </form>
          </div>
        ) : (
          /* Order Confirmation View */
          <div className="py-6 text-center animate-in zoom-in-95 duration-300">
            <div className="w-16 h-16 rounded-full bg-[#FF5722]/15 text-[#FF5722] mx-auto flex items-center justify-center mb-4">
              <CheckCircle size={36} strokeWidth={2.4} />
            </div>

            <h2 className="text-xl font-extrabold text-[#191F17]">
              Order Placed & Account Created!
            </h2>
            <p className="text-xs text-[#7A8572] mt-1">
              Your Kutch Traditional account has been automatically created for {email}
            </p>

            <div className="my-5 p-4 rounded-2xl bg-[#F6F8F2] border border-[#DEE5D6] text-left text-xs space-y-2">
              <div className="flex justify-between">
                <span className="text-[#7A8572]">Order ID:</span>
                <span className="font-extrabold text-[#191F17]">{orderId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#7A8572]">Account Email:</span>
                <span className="font-bold text-[#446C1A] truncate max-w-[180px]">{email}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#7A8572]">Mobile Number:</span>
                <span className="font-bold text-[#191F17]">{phone || 'Not Provided'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#7A8572]">Total Amount:</span>
                <span className="font-bold text-[#446C1A]">₹{finalTotal}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#7A8572]">Delivery Estimate:</span>
                <span className="font-bold text-[#446C1A]">2-3 Business Days</span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-[#EEF5E3] text-[#3B5D19] text-xs font-semibold flex items-center justify-center gap-2 mb-4">
              <Truck size={15} />
              <span>You are now logged in to your Profile!</span>
            </div>

            <button
              onClick={() => {
                setStep('form');
                onClose();
              }}
              className="w-full py-3 rounded-full bg-[#111612] text-white text-xs font-bold hover:bg-black transition-all cursor-pointer"
            >
              Continue Shopping & View Profile
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
