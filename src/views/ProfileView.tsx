import React, { useState } from 'react';
import {
  Package,
  Truck,
  ChevronRight,
  ShieldCheck,
  Shield,
  MapPin,
  HelpCircle,
  Edit3,
  Copy,
  Check,
  LogOut,
  CreditCard,
  Plus,
  X,
  Bell,
  MessageCircle,
  User as UserIcon,
} from 'lucide-react';
import { ActiveTab } from '../types';
import { ProfileSkeleton } from '../components/Skeletons';
import { User } from '../lib/firebase';

interface ProfileViewProps {
  currency: string;
  onChangeCurrency: (c: string) => void;
  onExploreProducts: () => void;
  onNavigateTab?: (tab: ActiveTab, category?: string) => void;
  user?: User | null;
  onGoogleSignIn?: () => void;
  onEmailSignIn?: (email: string, pass: string) => Promise<void>;
  onEmailSignUp?: (name: string, email: string, phone: string, pass: string) => Promise<void>;
  onSignOut?: () => void;
  isLoading?: boolean;
}

interface OrderItem {
  id: string;
  orderNumber: string;
  date: string;
  total: number;
  status: 'In Transit' | 'Delivered';
  carrier: string;
  trackingNumber: string;
  estimatedDelivery: string;
  productName: string;
  productSize: string;
  productImage: string;
  steps: {
    title: string;
    date: string;
    description: string;
    completed: boolean;
    current?: boolean;
  }[];
}

const ORDERS: OrderItem[] = [];

export const ProfileView: React.FC<ProfileViewProps> = ({
  currency,
  onChangeCurrency,
  onExploreProducts,
  onNavigateTab,
  user,
  onGoogleSignIn,
  onEmailSignIn,
  onEmailSignUp,
  onSignOut,
  isLoading = false,
}) => {
  const [userName, setUserName] = useState(
    user?.displayName || user?.email?.split('@')[0] || localStorage.getItem('kutch_traditional_user_name') || 'Kutch Guest'
  );
  const [userPhone, setUserPhone] = useState(
    user?.phoneNumber || localStorage.getItem('kutch_traditional_user_phone') || ''
  );
  const [userEmailState, setUserEmailState] = useState(
    user?.email || localStorage.getItem('kutch_traditional_user_email') || ''
  );
  const [userAddress, setUserAddress] = useState(() => {
    try {
      const saved = localStorage.getItem('kutch_traditional_user_address');
      if (saved) return JSON.parse(saved);
    } catch {}
    return {
      street: '',
      city: '',
      state: '',
      zip: '',
      country: '',
    };
  });
  const [addressInput, setAddressInput] = useState(userAddress);
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [trackingModalOrder, setTrackingModalOrder] = useState<OrderItem | null>(null);
  const [activeModal, setActiveModal] = useState<'address' | 'payments' | 'notifications' | null>(null);
  const [copiedTracking, setCopiedTracking] = useState(false);

  // Sync state with actual logged-in user
  React.useEffect(() => {
    if (user) {
      const name = user.displayName || user.email?.split('@')[0] || 'Member';
      setUserName(name);
      setUserEmailState(user.email || '');
      if (user.phoneNumber) setUserPhone(user.phoneNumber);
    }
  }, [user]);

  // Email Auth states
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');
  const [emailInput, setEmailInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [nameInput, setNameInput] = useState('');
  const [phoneInput, setPhoneInput] = useState('');
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  // Simple Notification States
  const [notifications, setNotifications] = useState({
    orderUpdates: true,
    promotions: false,
    deliverySMS: true,
  });

  const handleCopy = (text: string) => {
    navigator.clipboard?.writeText(text);
    setCopiedTracking(true);
    setTimeout(() => setCopiedTracking(false), 2000);
  };

  if (isLoading) {
    return <ProfileSkeleton />;
  }

  // If user is not logged in, show sign-in / sign-up options (Google + Email/Password/Mobile)
  if (!user) {
    const handleAuthSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      setAuthError(null);
      if (!emailInput || !passwordInput) {
        setAuthError('Please enter email and password.');
        return;
      }
      if (authMode === 'signup' && !nameInput) {
        setAuthError('Please enter your full name.');
        return;
      }
      setAuthLoading(true);
      try {
        if (authMode === 'signin') {
          if (onEmailSignIn) await onEmailSignIn(emailInput, passwordInput);
        } else {
          if (onEmailSignUp) await onEmailSignUp(nameInput, emailInput, phoneInput, passwordInput);
        }
      } catch (err: any) {
        setAuthError(err.message || 'Authentication failed.');
      } finally {
        setAuthLoading(false);
      }
    };

    return (
      <div className="max-w-md mx-auto px-4 py-10 text-center space-y-5 animate-in fade-in duration-300">
        <div className="w-16 h-16 rounded-full bg-[#EBF4DC] text-[#FF5722] flex items-center justify-center mx-auto shadow-inner">
          <UserIcon size={32} />
        </div>
        <div className="space-y-1">
          <h2 className="text-2xl font-black text-[#1C2518]">
            {authMode === 'signin' ? 'Sign in to Kutch Traditional' : 'Create Account'}
          </h2>
          <p className="text-xs text-[#6C7B65]">
            Access your orders, wishlist, and shipping address securely.
          </p>
        </div>

        {/* Tab Toggle */}
        <div className="flex rounded-2xl bg-[#EFEFEF] p-1 border border-[#E2E8DC]">
          <button
            type="button"
            onClick={() => { setAuthMode('signin'); setAuthError(null); }}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${authMode === 'signin' ? 'bg-white text-[#1C2518] shadow-xs' : 'text-[#6C7B65]'}`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => { setAuthMode('signup'); setAuthError(null); }}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${authMode === 'signup' ? 'bg-white text-[#1C2518] shadow-xs' : 'text-[#6C7B65]'}`}
          >
            Register
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleAuthSubmit} className="space-y-3 text-left">
          {authMode === 'signup' && (
            <div>
              <label className="text-[11px] font-bold text-[#6B7B65] block mb-1">Full Name</label>
              <input
                type="text"
                required
                placeholder="Enter your full name"
                value={nameInput}
                onChange={(e) => setNameInput(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#DDE5D4] text-xs font-semibold focus:outline-none focus:border-[#FF5722] bg-white"
              />
            </div>
          )}

          <div>
            <label className="text-[11px] font-bold text-[#6B7B65] block mb-1">Email Address</label>
            <input
              type="email"
              required
              placeholder="name@example.com"
              value={emailInput}
              onChange={(e) => setEmailInput(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#DDE5D4] text-xs font-semibold focus:outline-none focus:border-[#FF5722] bg-white"
            />
          </div>

          {authMode === 'signup' && (
            <div>
              <label className="text-[11px] font-bold text-[#6B7B65] block mb-1">Mobile Number</label>
              <input
                type="tel"
                placeholder="e.g. +91 98765 43210"
                value={phoneInput}
                onChange={(e) => setPhoneInput(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#DDE5D4] text-xs font-semibold focus:outline-none focus:border-[#FF5722] bg-white"
              />
            </div>
          )}

          <div>
            <label className="text-[11px] font-bold text-[#6B7B65] block mb-1">Password</label>
            <input
              type="password"
              required
              placeholder="••••••••"
              value={passwordInput}
              onChange={(e) => setPasswordInput(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#DDE5D4] text-xs font-semibold focus:outline-none focus:border-[#FF5722] bg-white"
            />
          </div>

          {authError && (
            <p className="text-[11px] font-bold text-red-600 bg-red-50 p-2 rounded-xl text-center">{authError}</p>
          )}

          <button
            type="submit"
            disabled={authLoading}
            className="w-full py-3 rounded-xl bg-[#FF5722] hover:bg-[#7DA535] text-white font-extrabold text-xs tracking-wide shadow-md transition-all active:scale-95 cursor-pointer disabled:opacity-50"
          >
            {authLoading ? 'Please wait...' : authMode === 'signin' ? 'Sign In with Email' : 'Create Account'}
          </button>
        </form>

        <div className="relative flex py-1 items-center">
          <div className="flex-grow border-t border-[#E3E8DC]"></div>
          <span className="flex-shrink mx-4 text-[10px] uppercase font-bold text-[#869680]">Or</span>
          <div className="flex-grow border-t border-[#E3E8DC]"></div>
        </div>

        <button
          onClick={onGoogleSignIn}
          className="w-full py-3 px-6 rounded-2xl bg-[#192215] hover:bg-[#2B3B23] text-white font-extrabold text-xs flex items-center justify-center gap-3 shadow-lg transition-all active:scale-95 cursor-pointer"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
            />
          </svg>
          <span>Continue with Google</span>
        </button>

        <div className="pt-1">
          <button
            onClick={onExploreProducts}
            className="text-xs font-bold text-[#FF5722] hover:underline cursor-pointer"
          >
            Or explore our traditional collection &rarr;
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto px-4 sm:px-6 pb-28 sm:pb-16 pt-3 animate-in fade-in duration-300 space-y-4">
      {/* 1. SIMPLE & CLEAN PROFILE HEADER CARD */}
      <div className="p-5 rounded-3xl bg-white border border-[#E3E8DC] shadow-xs flex items-center justify-between">
        <div className="flex items-center gap-3.5">
          {user.photoURL ? (
            <img
              src={user.photoURL}
              alt={user.displayName || 'User'}
              className="w-14 h-14 rounded-full object-cover border-2 border-[#FF5722] shadow-xs"
            />
          ) : (
            <div className="w-14 h-14 rounded-full bg-[#FF5722] text-white flex items-center justify-center text-lg font-bold shadow-xs">
              {(user.displayName || 'SM').substring(0, 2).toUpperCase()}
            </div>
          )}
          <div>
            <h2 className="text-base font-bold text-[#1C2518]">{userName}</h2>
            <span className="text-xs text-[#71806C] block">{userEmailState}</span>
            <span className="text-[11px] text-[#869680] block mt-0.5">{userPhone}</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsEditProfileOpen(true)}
            className="w-9 h-9 rounded-full bg-[#F3F7ED] hover:bg-[#E5EED8] flex items-center justify-center text-[#4B701D] transition-colors cursor-pointer active:scale-95 shadow-2xs"
            title="Edit Profile"
          >
            <Edit3 size={16} />
          </button>
          {onSignOut && (
            <button
              onClick={onSignOut}
              className="w-9 h-9 rounded-full bg-red-50 hover:bg-red-100 flex items-center justify-center text-red-600 transition-colors cursor-pointer active:scale-95 shadow-2xs"
              title="Sign Out"
            >
              <LogOut size={16} />
            </button>
          )}
        </div>
      </div>

      {/* 2. YOUR ORDERS & ORDER TRACKING */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-xs font-bold uppercase tracking-wider text-[#697961]">
            Your Orders
          </h3>
          <span className="text-[11px] font-semibold text-[#FF5722]">
            {ORDERS.length} Orders
          </span>
        </div>

        <div className="space-y-2.5">
          {ORDERS.map((order) => (
            <div
              key={order.id}
              className="p-4 rounded-2xl bg-white border border-[#E3E8DC] shadow-xs space-y-3"
            >
              {/* Order Info & Status */}
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-[#1C2518]">
                    {order.orderNumber}
                  </span>
                  <span className="text-[11px] text-[#71806C] block">
                    {order.date}
                  </span>
                </div>

                <span
                  className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                    order.status === 'In Transit'
                      ? 'bg-[#E5EEFA] text-[#1B4B82]'
                      : 'bg-[#EBF5DC] text-[#426C18]'
                  }`}
                >
                  {order.status}
                </span>
              </div>

              {/* Product preview */}
              <div className="flex items-center gap-3 pt-1">
                <img
                  src={order.productImage}
                  alt={order.productName}
                  className="w-12 h-12 rounded-xl object-cover border border-[#E3E8DC] bg-[#F5F8F0]"
                />
                <div className="flex-1 min-w-0">
                  <h4 className="text-xs font-bold text-[#1C2518] truncate">
                    {order.productName}
                  </h4>
                  <span className="text-[11px] text-[#71806C] block">
                    Size: {order.productSize} • Total: ${order.total}
                  </span>
                </div>

                {/* Track Button */}
                <button
                  onClick={() => setTrackingModalOrder(order)}
                  className="px-3.5 py-1.5 rounded-xl bg-[#FF5722] hover:bg-[#7CA235] text-white text-xs font-bold transition-all shadow-xs cursor-pointer active:scale-95 shrink-0"
                >
                  Track
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 3. SIMPLE SETTINGS & ACCOUNT OPTIONS */}
      <div className="space-y-2">
        <h3 className="text-xs font-bold uppercase tracking-wider text-[#697961] px-1 pt-1">
          Account Settings
        </h3>

        <div className="bg-white rounded-2xl border border-[#E3E8DC] shadow-xs divide-y divide-[#EEF2E6] overflow-hidden">
          {/* Delivery Addresses */}
          <button
            onClick={() => {
              setAddressInput(userAddress);
              setActiveModal('address');
            }}
            className="w-full p-4 flex items-center justify-between text-left hover:bg-[#F9FAF6] transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-[#EDF3E4] text-[#476F1B] flex items-center justify-center">
                <MapPin size={17} />
              </div>
              <div>
                <span className="text-xs font-bold text-[#1C2518] block">
                  Delivery Address (Google / Shipping)
                </span>
                <span className="text-[10px] text-[#71806B] truncate max-w-[220px] block">
                  {userAddress.street}, {userAddress.city}
                </span>
              </div>
            </div>
            <ChevronRight size={16} className="text-[#A2AEA0]" />
          </button>

          {/* Payment Methods */}
          <button
            onClick={() => setActiveModal('payments')}
            className="w-full p-4 flex items-center justify-between text-left hover:bg-[#F9FAF6] transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-[#EDF3E4] text-[#476F1B] flex items-center justify-center">
                <CreditCard size={17} />
              </div>
              <div>
                <span className="text-xs font-bold text-[#1C2518] block">
                  Payment Methods
                </span>
                <span className="text-[10px] text-[#71806B]">
                  Visa ending in •••• 4242
                </span>
              </div>
            </div>
            <ChevronRight size={16} className="text-[#A2AEA0]" />
          </button>

          {/* Notifications */}
          <button
            onClick={() => setActiveModal('notifications')}
            className="w-full p-4 flex items-center justify-between text-left hover:bg-[#F9FAF6] transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-[#EDF3E4] text-[#476F1B] flex items-center justify-center">
                <Bell size={17} />
              </div>
              <div>
                <span className="text-xs font-bold text-[#1C2518] block">
                  Notifications
                </span>
                <span className="text-[10px] text-[#71806B]">
                  Order updates & delivery alerts
                </span>
              </div>
            </div>
            <ChevronRight size={16} className="text-[#A2AEA0]" />
          </button>


          {/* Help & Support */}
          <a
            href="https://wa.me/?text=Hello%20Kutch%20Traditional%20Support%2C%20I%20have%20an%20order%20inquiry"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full p-4 flex items-center justify-between text-left hover:bg-[#F9FAF6] transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-[#EDF3E4] text-[#476F1B] flex items-center justify-center">
                <HelpCircle size={17} />
              </div>
              <div>
                <span className="text-xs font-bold text-[#1C2518] block">
                  Help & 24/7 Support
                </span>
                <span className="text-[10px] text-[#71806B]">
                  WhatsApp customer care
                </span>
              </div>
            </div>
            <ChevronRight size={16} className="text-[#A2AEA0]" />
          </a>
        </div>
      </div>

      {/* 4. CLEAN LOGOUT BUTTON */}
      {onSignOut && (
        <div className="pt-1">
          <button
            onClick={onSignOut}
            className="w-full py-3 rounded-2xl bg-white border border-[#E9D4D4] hover:bg-[#FFF6F6] text-[#A53A3A] text-xs font-bold flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-95 shadow-2xs"
          >
            <LogOut size={15} />
            <span>Sign Out</span>
          </button>
        </div>
      )}

      {/* 5. ORDER TRACKING MODAL */}
      {trackingModalOrder && (
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => setTrackingModalOrder(null)}
        >
          <div
            className="w-full max-w-sm bg-white rounded-3xl p-5 shadow-2xl border border-[#E3E8DC] animate-in zoom-in-95 duration-200 space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-[#EEF2E6]">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-[#EAF3DA] text-[#4B731C] flex items-center justify-center">
                  <Truck size={17} />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-[#1C2518]">
                    Tracking {trackingModalOrder.orderNumber}
                  </h3>
                  <span className="text-[10px] text-[#71806C]">
                    {trackingModalOrder.carrier}
                  </span>
                </div>
              </div>

              <button
                onClick={() => setTrackingModalOrder(null)}
                className="w-7 h-7 rounded-full bg-[#F2F5ED] flex items-center justify-center text-[#55634E] cursor-pointer"
              >
                <X size={15} />
              </button>
            </div>

            {/* Tracking ID & Status Banner */}
            <div className="p-3 rounded-xl bg-[#F6F9F2] border border-[#DEE7D4] flex items-center justify-between">
              <div>
                <span className="text-[10px] text-[#71806A] block">Tracking Code</span>
                <code className="text-xs font-mono font-bold text-[#2A3723]">
                  {trackingModalOrder.trackingNumber}
                </code>
              </div>
              <button
                onClick={() => handleCopy(trackingModalOrder.trackingNumber)}
                className="px-2.5 py-1 rounded-lg bg-white border border-[#CBD7BF] text-[10px] font-bold text-[#3E6515] flex items-center gap-1 cursor-pointer"
              >
                {copiedTracking ? <Check size={11} /> : <Copy size={11} />}
                <span>{copiedTracking ? 'Copied' : 'Copy'}</span>
              </button>
            </div>

            {/* 4 Steps Timeline */}
            <div className="relative pl-6 space-y-3.5 py-1">
              <div className="absolute top-2 bottom-2 left-2.5 w-0.5 bg-[#DFE7D6]" />

              {trackingModalOrder.steps.map((st, idx) => (
                <div key={idx} className="relative flex items-start gap-2.5">
                  <div
                    className={`absolute -left-6 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                      st.completed
                        ? 'bg-[#FF5722] text-white shadow-xs'
                        : 'bg-[#DFE7D6] text-[#71806A]'
                    }`}
                  >
                    {st.completed ? '✓' : idx + 1}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-xs font-bold ${
                          st.current
                            ? 'text-[#3E6515]'
                            : st.completed
                            ? 'text-[#1C2518]'
                            : 'text-[#879680]'
                        }`}
                      >
                        {st.title} {st.current && '(Active)'}
                      </span>
                      <span className="text-[10px] text-[#869680]">{st.date}</span>
                    </div>
                    <p className="text-[11px] text-[#6E7E67] mt-0.5">{st.description}</p>
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={() => setTrackingModalOrder(null)}
              className="w-full py-2.5 rounded-xl bg-[#FF5722] hover:bg-[#7DA535] text-white font-bold text-xs cursor-pointer shadow-xs"
            >
              Done
            </button>
          </div>
        </div>
      )}

      {/* 6. EDIT PROFILE MODAL */}
      {isEditProfileOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => setIsEditProfileOpen(false)}
        >
          <div
            className="w-full max-w-sm bg-white rounded-3xl p-5 shadow-2xl border border-[#E3E8DC] animate-in zoom-in-95 duration-200 space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-[#EEF2E6]">
              <h3 className="text-xs font-bold text-[#1C2518]">Edit Profile</h3>
              <button
                onClick={() => setIsEditProfileOpen(false)}
                className="w-7 h-7 rounded-full bg-[#F2F5ED] flex items-center justify-center text-[#55634E] cursor-pointer"
              >
                <X size={15} />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-[11px] font-bold text-[#6B7B65] block mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-[#DDE5D4] text-xs font-semibold focus:outline-none focus:border-[#FF5722]"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-[#6B7B65] block mb-1">
                  Phone Number
                </label>
                <input
                  type="text"
                  value={userPhone}
                  onChange={(e) => setUserPhone(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-[#DDE5D4] text-xs font-semibold focus:outline-none focus:border-[#FF5722]"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-[#6B7B65] block mb-1">
                  Email
                </label>
                <input
                  type="email"
                  value={userEmailState}
                  onChange={(e) => setUserEmailState(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-[#DDE5D4] text-xs font-semibold focus:outline-none focus:border-[#FF5722]"
                />
              </div>
            </div>

            <button
              onClick={() => {
                try {
                  localStorage.setItem('kutch_traditional_user_name', userName);
                  localStorage.setItem('kutch_traditional_user_phone', userPhone);
                  localStorage.setItem('kutch_traditional_user_email', userEmailState);
                } catch {}
                setIsEditProfileOpen(false);
              }}
              className="w-full py-2.5 rounded-xl bg-[#FF5722] text-white font-bold text-xs hover:bg-[#7DA535] cursor-pointer shadow-xs"
            >
              Save Changes
            </button>
          </div>
        </div>
      )}

      {/* 7. SETTINGS MODALS (Address / Payments / Notifications) */}
      {activeModal === 'address' && (
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => setActiveModal(null)}
        >
          <div
            className="w-full max-w-sm bg-white rounded-3xl p-5 shadow-2xl border border-[#E3E8DC] animate-in zoom-in-95 duration-200 space-y-3"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-2 border-b border-[#EEF2E6]">
              <h3 className="text-xs font-bold text-[#1C2518]">Delivery Address & Google Shipping</h3>
              <button
                onClick={() => setActiveModal(null)}
                className="w-7 h-7 rounded-full bg-[#F2F5ED] flex items-center justify-center text-[#55634E]"
              >
                <X size={15} />
              </button>
            </div>

            <div className="space-y-2.5">
              <div>
                <label className="text-[10px] font-bold text-[#6B7B65] block mb-1">Street Address</label>
                <input
                  type="text"
                  value={addressInput.street}
                  onChange={(e) => setAddressInput({ ...addressInput, street: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-[#DDE5D4] text-xs font-semibold focus:outline-none focus:border-[#FF5722]"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] font-bold text-[#6B7B65] block mb-1">City</label>
                  <input
                    type="text"
                    value={addressInput.city}
                    onChange={(e) => setAddressInput({ ...addressInput, city: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-[#DDE5D4] text-xs font-semibold focus:outline-none focus:border-[#FF5722]"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-[#6B7B65] block mb-1">State / Province</label>
                  <input
                    type="text"
                    value={addressInput.state}
                    onChange={(e) => setAddressInput({ ...addressInput, state: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-[#DDE5D4] text-xs font-semibold focus:outline-none focus:border-[#FF5722]"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] font-bold text-[#6B7B65] block mb-1">Zip / Postal Code</label>
                  <input
                    type="text"
                    value={addressInput.zip}
                    onChange={(e) => setAddressInput({ ...addressInput, zip: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-[#DDE5D4] text-xs font-semibold focus:outline-none focus:border-[#FF5722]"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-[#6B7B65] block mb-1">Country</label>
                  <input
                    type="text"
                    value={addressInput.country}
                    onChange={(e) => setAddressInput({ ...addressInput, country: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-[#DDE5D4] text-xs font-semibold focus:outline-none focus:border-[#FF5722]"
                  />
                </div>
              </div>
            </div>

            <button
              onClick={() => {
                setUserAddress(addressInput);
                try {
                  localStorage.setItem('kutch_traditional_user_address', JSON.stringify(addressInput));
                } catch {}
                setActiveModal(null);
              }}
              className="w-full py-2.5 rounded-xl bg-[#FF5722] text-white font-bold text-xs hover:bg-[#7DA535] cursor-pointer shadow-xs"
            >
              Save Delivery Address
            </button>
          </div>
        </div>
      )}

      {activeModal === 'payments' && (
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => setActiveModal(null)}
        >
          <div
            className="w-full max-w-sm bg-white rounded-3xl p-5 shadow-2xl border border-[#E3E8DC] animate-in zoom-in-95 duration-200 space-y-3"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-2 border-b border-[#EEF2E6]">
              <h3 className="text-xs font-bold text-[#1C2518]">Saved Payment Methods</h3>
              <button
                onClick={() => setActiveModal(null)}
                className="w-7 h-7 rounded-full bg-[#F2F5ED] flex items-center justify-center text-[#55634E]"
              >
                <X size={15} />
              </button>
            </div>

            <div className="p-3 rounded-xl bg-[#F8FAF4] border border-[#DEE7D4] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-7 rounded bg-[#1B2956] text-white font-bold text-[10px] flex items-center justify-center">
                  VISA
                </div>
                <div>
                  <span className="text-xs font-bold text-[#1C2518] block">•••• 4242</span>
                  <span className="text-[10px] text-[#71806C]">Expires 08/29</span>
                </div>
              </div>
              <span className="text-[10px] font-bold text-[#FF5722]">Primary</span>
            </div>

            <button
              onClick={() => setActiveModal(null)}
              className="w-full py-2.5 rounded-xl bg-[#FF5722] text-white font-bold text-xs cursor-pointer"
            >
              Done
            </button>
          </div>
        </div>
      )}

      {activeModal === 'notifications' && (
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => setActiveModal(null)}
        >
          <div
            className="w-full max-w-sm bg-white rounded-3xl p-5 shadow-2xl border border-[#E3E8DC] animate-in zoom-in-95 duration-200 space-y-3"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-2 border-b border-[#EEF2E6]">
              <h3 className="text-xs font-bold text-[#1C2518]">Notification Alerts</h3>
              <button
                onClick={() => setActiveModal(null)}
                className="w-7 h-7 rounded-full bg-[#F2F5ED] flex items-center justify-center text-[#55634E]"
              >
                <X size={15} />
              </button>
            </div>

            <div className="space-y-2.5">
              <div className="flex items-center justify-between p-2 rounded-xl bg-[#F8FAF4]">
                <div>
                  <span className="text-xs font-bold text-[#1C2518] block">Order Updates</span>
                  <span className="text-[10px] text-[#71806C]">Email updates on status</span>
                </div>
                <input
                  type="checkbox"
                  checked={notifications.orderUpdates}
                  onChange={(e) =>
                    setNotifications({ ...notifications, orderUpdates: e.target.checked })
                  }
                  className="accent-[#FF5722] w-4 h-4 cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-between p-2 rounded-xl bg-[#F8FAF4]">
                <div>
                  <span className="text-xs font-bold text-[#1C2518] block">SMS Alerts</span>
                  <span className="text-[10px] text-[#71806C]">Live courier SMS</span>
                </div>
                <input
                  type="checkbox"
                  checked={notifications.deliverySMS}
                  onChange={(e) =>
                    setNotifications({ ...notifications, deliverySMS: e.target.checked })
                  }
                  className="accent-[#FF5722] w-4 h-4 cursor-pointer"
                />
              </div>
            </div>

            <button
              onClick={() => setActiveModal(null)}
              className="w-full py-2.5 rounded-xl bg-[#FF5722] text-white font-bold text-xs cursor-pointer"
            >
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
