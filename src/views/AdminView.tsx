import React, { useState } from 'react';
import { compressImageToUnder100Kb } from '../utils/imageCompressor';
import {
  Package,
  Layers,
  Image as ImageIcon,
  ShoppingBag,
  TrendingUp,
  DollarSign,
  Plus,
  Trash2,
  Edit2,
  X,
  Check,
  ArrowLeft,
  Search,
  Sparkles,
  Truck,
  ExternalLink,
  Shield,
  Eye,
  Tag,
  Settings,
  Store,
  Copy,
  Printer,
  Smartphone,
  Laptop,
  AlertTriangle,
  CheckCircle2,
  SlidersHorizontal,
  ChevronRight,
  Phone,
  Mail,
  MapPin,
  BarChart3,
  Activity,
  Cloud,
  Database,
  Key,
  Users,
  RefreshCw,
} from 'lucide-react';
import { Product, CategoryItem, BannerSlide, CouponItem, AnalyticsData } from '../types';
import { AdminSkeleton } from '../components/Skeletons';
import { seedKutchHeritageDataToFirestore } from '../lib/firestoreService';
import { AdminBottomNav, AdminTab } from '../components/AdminBottomNav';
import { AdminAnalyticsSection } from '../components/AdminAnalyticsSection';
import { AdminStoreViewSection } from '../components/AdminStoreViewSection';
import { ImgBBUploader } from '../components/ImgBBUploader';
import { subscribeToOrders, updateOrderStatusInFirestore } from '../lib/firestoreService';
import { getImgbbApiKey, setImgbbApiKey } from '../lib/imgbb';

interface OrderItemAdmin {
  id: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  shippingAddress: string;
  date: string;
  total: number;
  subtotal: number;
  discount: number;
  shipping: number;
  status: 'In Transit' | 'Delivered' | 'Processing';
  carrier: string;
  trackingNumber: string;
  productName: string;
  productSize: string;
  quantity: number;
}

export interface ProductPageSettings {
  showRecentPurchase: boolean;
  showPhotoReviews: boolean;
  showSoldCounter: boolean;
  showCartReservationTimer: boolean;
  showFlashSaleTimer: boolean;
  showTrustBadges: boolean;
}

interface AdminViewProps {
  products: Product[];
  categories: CategoryItem[];
  slides: BannerSlide[];
  analytics?: AnalyticsData;
  isLoading?: boolean;
  onAddProduct: (prod: Product) => void;
  onUpdateProduct: (prod: Product) => void;
  onDeleteProduct: (id: string) => void;
  onAddCategory: (cat: CategoryItem) => void;
  onDeleteCategory: (id: string) => void;
  onAddSlide: (slide: BannerSlide) => void;
  onUpdateSlide: (slide: BannerSlide) => void;
  onDeleteSlide: (id: number) => void;
  onExitAdmin: () => void;
  onSimulateView?: (productId?: string) => void;
  onResetAnalytics?: () => void;
  productPageSettings: ProductPageSettings;
  onUpdateProductPageSettings: (settings: ProductPageSettings) => void;
}

export const AdminView: React.FC<AdminViewProps> = ({
  products,
  categories,
  slides,
  analytics,
  isLoading = false,
  onAddProduct,
  onUpdateProduct,
  onDeleteProduct,
  onAddCategory,
  onDeleteCategory,
  onAddSlide,
  onUpdateSlide,
  onDeleteSlide,
  onExitAdmin,
  onSimulateView,
  onResetAnalytics,
  productPageSettings,
  onUpdateProductPageSettings,
}) => {
  const [activeTab, setActiveTab] = useState<AdminTab>('overview');

  // Search & Filter states for Products
  const [productSearch, setProductSearch] = useState('');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState('All');
  const [stockFilter, setStockFilter] = useState<'All' | 'inStock' | 'lowStock' | 'outOfStock'>('All');

  // Modals state
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [previewingProduct, setPreviewingProduct] = useState<Product | null>(null);

  const [isSyncingKutch, setIsSyncingKutch] = useState(false);
  const [syncStatusMsg, setSyncStatusMsg] = useState<string | null>(null);

  const handleSyncKutchHeritage = async () => {
    setIsSyncingKutch(true);
    setSyncStatusMsg('Connecting to Firebase and uploading Kutch heritage products...');
    try {
      const res = await seedKutchHeritageDataToFirestore(true);
      if (res.success) {
        setSyncStatusMsg(`✅ ${res.message}`);
      } else {
        setSyncStatusMsg(`❌ ${res.message}`);
      }
    } catch (err: any) {
      setSyncStatusMsg(`❌ Error: ${err?.message || 'Sync failed'}`);
    } finally {
      setIsSyncingKutch(false);
      setTimeout(() => setSyncStatusMsg(null), 4500);
    }
  };

  // Dynamic Product Variants / Pack Sizes State for Kutch Products
  const VARIANT_PRESETS = [
    {
      name: '🧣 Bandhani / Dupattas (2.5m, 2.8m, Saree)',
      variants: [
        { size: 'Standard (2.5 Metres)', price: 3499, volume: '2.5m x 44 in' },
        { size: 'Grand Royal (2.8 Metres)', price: 4199, volume: '2.8m x 44 in' },
        { size: 'Bridal Saree (6.3 Metres)', price: 8999, volume: 'Full Saree + Blouse' },
      ],
    },
    {
      name: '🎨 Ajrakh & Stoles (2m Stole, 2.5m Dupatta)',
      variants: [
        { size: 'Stole (2.0 Metres)', price: 2199, volume: '2.0m x 22 in' },
        { size: 'Full Dupatta (2.5 Metres)', price: 2899, volume: '2.5m x 44 in' },
      ],
    },
    {
      name: '🖼️ Rogan Art & Wall Frames (12x16, 18x24)',
      variants: [
        { size: 'Medium (12 x 16 Inches)', price: 4850, volume: 'Framed Canvas' },
        { size: 'Grand Edition (18 x 24 Inches)', price: 7999, volume: 'Framed Canvas' },
      ],
    },
    {
      name: '🔔 Bell Metal Craft (Set of 3, Set of 5)',
      variants: [
        { size: 'Set of 3 Bells', price: 1299, volume: '18 inch drop' },
        { size: 'Set of 5 Bells', price: 1899, volume: '26 inch drop' },
      ],
    },
    {
      name: '🌴 Kutch Kharek Dates & Spices (500g, 1kg, 2kg)',
      variants: [
        { size: '500g Pack', price: 549, volume: '500g Pouch' },
        { size: '1kg Jumbo Pack', price: 999, volume: '1kg Box' },
        { size: '2kg Family Box', price: 1899, volume: '2kg Gift Box' },
      ],
    },
    {
      name: '📦 Single / Multi Piece (1 Pc, 2 Pcs, Set of 3)',
      variants: [
        { size: '1 Piece', price: 999, volume: 'Single Item' },
        { size: 'Set of 2', price: 1899, volume: 'Duo Pack' },
        { size: 'Set of 3', price: 2699, volume: 'Combo Pack' },
      ],
    },
  ];

  const [productVariants, setProductVariants] = useState<{ size: string; price: number; volume: string }[]>([
    { size: 'Standard (2.5 Metres)', price: 3499, volume: '2.5m x 44 in' },
    { size: 'Grand Royal (2.8 Metres)', price: 4199, volume: '2.8m x 44 in' },
  ]);

  const handleAddVariantRow = () => {
    setProductVariants((prev) => [
      ...prev,
      { size: `${(prev.length + 1) * 100}g`, price: (prev[prev.length - 1]?.price || 15) + 10, volume: 'Custom Pack' },
    ]);
  };

  const handleUpdateVariant = (index: number, field: 'size' | 'price' | 'volume', value: any) => {
    setProductVariants((prev) =>
      prev.map((v, i) => (i === index ? { ...v, [field]: field === 'price' ? Math.max(0, Number(value)) : value } : v))
    );
  };

  const handleRemoveVariant = (index: number) => {
    if (productVariants.length <= 1) return;
    setProductVariants((prev) => prev.filter((_, i) => i !== index));
  };

  const [isNewProduct, setIsNewProduct] = useState(true);
  const [isBestSellerProduct, setIsBestSellerProduct] = useState(false);

  const openAddProductModal = () => {
    setProductImages(['https://images.unsplash.com/photo-1508061253366-f7da158b6d46?auto=format&fit=crop&w=800&q=80']);
    setProductVariants([
      { size: '250g', price: 18, volume: 'Standard Pack' },
      { size: '500g', price: 34, volume: 'Vacuum Pack' },
      { size: '1kg', price: 65, volume: 'Royal Box' },
    ]);
    setIsNewProduct(true);
    setIsBestSellerProduct(false);
    setEditingProduct(null);
    setIsAddProductOpen(true);
  };

  const openEditProductModal = (p: Product) => {
    setProductImages(p.images || []);
    if (p.sizes && p.sizes.length > 0) {
      setProductVariants(
        p.sizes.map((s) => ({
          size: s.size || 'Standard',
          price: Number(s.price) || Number(p.price) || 0,
          volume: s.volume || 'Standard Pack',
        }))
      );
    } else {
      setProductVariants([
        { size: 'Standard', price: Number(p.price) || 18, volume: 'Standard Pack' },
      ]);
    }
    setIsNewProduct(p.isNew ?? true);
    setIsBestSellerProduct(p.isBestSeller ?? false);
    setEditingProduct(p);
    setIsAddProductOpen(false);
  };

  const [isAddCategoryOpen, setIsAddCategoryOpen] = useState(false);
  const [isAddSlideOpen, setIsAddSlideOpen] = useState(false);
  const [editingSlide, setEditingSlide] = useState<BannerSlide | null>(null);

  // ImgBB Upload States for Modals
  const [productImages, setProductImages] = useState<string[]>([]);
  const [categoryUploadedImage, setCategoryUploadedImage] = useState<string>('');
  const [slideUploadedImage, setSlideUploadedImage] = useState<string>('');
  const [imgbbConfigKey, setImgbbConfigKey] = useState<string>(getImgbbApiKey());
  const [imgbbConfigSaved, setImgbbConfigSaved] = useState(false);

  // Marketing Coupons State
  const [coupons, setCoupons] = useState<CouponItem[]>([
    {
      id: 'cpn-1',
      code: 'FIRSTPURCHASE',
      discountPercent: 20,
      description: '20% off for first-time dry fruits buyers',
      minOrder: 30,
      expiry: 'Dec 31, 2026',
      isActive: true,
      usageCount: 142,
    },
    {
      id: 'cpn-2',
      code: 'KUTCH20',
      discountPercent: 20,
      description: 'Seasonal Kutch Handicrafts & Dry Fruits discount',
      minOrder: 40,
      expiry: 'Nov 30, 2026',
      isActive: true,
      usageCount: 89,
    },
    {
      id: 'cpn-3',
      code: 'ROYAL50',
      discountAmount: 25,
      description: 'Flat $25 off on Royal Gift Hampers over $100',
      minOrder: 100,
      expiry: 'Dec 15, 2026',
      isActive: true,
      usageCount: 34,
    },
  ]);
  const [isAddCouponOpen, setIsAddCouponOpen] = useState(false);
  const [copiedCoupon, setCopiedCoupon] = useState<string | null>(null);

  // Orders State with comprehensive details
  const [orders, setOrders] = useState<OrderItemAdmin[]>([]);

  // Real-time listener for incoming customer orders from Firebase Cloud Database
  React.useEffect(() => {
    const unsub = subscribeToOrders((cloudOrders) => {
      if (cloudOrders && cloudOrders.length > 0) {
        setOrders(cloudOrders);
      }
    });
    return () => unsub();
  }, []);

  // Selected Order for Invoice view
  const [selectedInvoice, setSelectedInvoice] = useState<OrderItemAdmin | null>(null);
  const [selectedCustomerOrders, setSelectedCustomerOrders] = useState<{
    name: string;
    email: string;
    phone: string;
    orders: OrderItemAdmin[];
  } | null>(null);

  // Store Settings State
  const [announcementText, setAnnouncementText] = useState(
    '🌟 Kutch Traditional • Authentic Handicrafts & Premium Dry Fruits • Worldwide Shipping'
  );
  const [savedSettingsSuccess, setSavedSettingsSuccess] = useState(false);

  // Device view switcher for Store View
  const [storeViewDevice, setStoreViewDevice] = useState<'mobile' | 'desktop'>('mobile');

  if (isLoading) {
    return <AdminSkeleton />;
  }

  // Handle Order Status change with Firestore Cloud sync
  const handleOrderStatusChange = (orderId: string, newStatus: 'In Transit' | 'Delivered' | 'Processing') => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
    );
    updateOrderStatusInFirestore(orderId, newStatus).catch((err) =>
      console.warn('[Firestore] Failed to update order status in cloud:', err)
    );
  };

  // Toggle Product In-Stock status
  const handleToggleStock = (product: Product, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const updated = {
      ...product,
      inStock: product.inStock === false ? true : false,
      stock: product.inStock === false ? 25 : 0,
    };
    onUpdateProduct(updated);
  };

  // Filtered Products
  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(productSearch.toLowerCase()) ||
      p.category.toLowerCase().includes(productSearch.toLowerCase());
    const matchesCat = selectedCategoryFilter === 'All' || p.category === selectedCategoryFilter;
    
    let matchesStock = true;
    const isOut = p.inStock === false || (p.stock !== undefined && p.stock <= 0);
    const isLow = !isOut && p.stock !== undefined && p.stock <= 10;
    
    if (stockFilter === 'inStock') matchesStock = !isOut;
    else if (stockFilter === 'lowStock') matchesStock = isLow;
    else if (stockFilter === 'outOfStock') matchesStock = isOut;

    return matchesSearch && matchesCat && matchesStock;
  });

  const copyToClipboard = (text: string) => {
    navigator.clipboard?.writeText(text);
    setCopiedCoupon(text);
    setTimeout(() => setCopiedCoupon(null), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 pb-36 pt-3 animate-in fade-in duration-300 lg:grid lg:grid-cols-[260px_1fr] gap-6 items-start">
      {/* 1. LEFT SIDE MENU (Sidebar) FOR PC & DESKTOP */}
      <aside className="bg-white rounded-3xl p-5 border border-[#E2E8DC] shadow-sm sticky top-4 space-y-6 hidden lg:block">
        <div className="flex items-center gap-3 px-2 pb-4 border-b border-[#EEF2E6]">
          <div className="w-9 h-9 rounded-xl bg-[#FF5722] text-white flex items-center justify-center font-black shadow-xs">
            <Shield size={18} />
          </div>
          <div>
            <h2 className="text-sm font-black text-[#1C2518]">Kutch Traditional Admin</h2>
            <span className="text-[10px] text-[#788871] font-semibold">Store Management</span>
          </div>
        </div>

        <nav className="space-y-1.5">
          {[
            { id: 'overview', label: 'Dashboard', icon: TrendingUp },
            { id: 'customers', label: 'Customers', icon: Users },
            { id: 'orders', label: `Orders (${orders.length})`, icon: ShoppingBag, badge: orders.length },
            { id: 'products', label: `Products (${products.length})`, icon: Package },
            { id: 'analytics', label: 'Analytics & Views', icon: BarChart3 },
            { id: 'storeview', label: 'Store View & Edit', icon: Store },
            { id: 'slides', label: `Hero Slider (${slides.length})`, icon: ImageIcon },
            { id: 'coupons', label: `Coupons (${coupons.length})`, icon: Tag },
            { id: 'settings', label: 'Settings', icon: Settings },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`w-full px-4 py-3 rounded-2xl text-xs font-bold flex items-center justify-between transition-all cursor-pointer ${
                  isActive
                    ? 'bg-[#FF5722] text-white shadow-md'
                    : 'text-[#52634B] hover:bg-[#F2F6ED] hover:text-[#191F17]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon size={16} />
                  <span>{tab.label}</span>
                </div>
                {tab.badge && tab.badge > 0 ? (
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${isActive ? 'bg-white text-[#52634B]' : 'bg-[#EBF5DC] text-[#426C18]'}`}>
                    {tab.badge}
                  </span>
                ) : null}
              </button>
            );
          })}
        </nav>

        <div className="pt-4 border-t border-[#EEF2E6]">
          <button
            onClick={onExitAdmin}
            className="w-full px-4 py-3 rounded-2xl bg-[#192215] hover:bg-black text-white text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs"
          >
            <ArrowLeft size={16} />
            <span>Customer Store</span>
          </button>
        </div>
      </aside>

      {/* 2. RIGHT MAIN CONTENT AREA */}
      <div className="space-y-5 min-w-0">
        {/* Mobile top tab pills for smaller screens */}
        <div className="lg:hidden flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
          {[
            { id: 'overview', label: 'Dashboard', icon: TrendingUp },
            { id: 'customers', label: 'Customers', icon: Users },
            { id: 'orders', label: `Orders (${orders.length})`, icon: ShoppingBag },
            { id: 'products', label: `Products (${products.length})`, icon: Package },
            { id: 'analytics', label: 'Analytics', icon: BarChart3 },
            { id: 'storeview', label: 'Store View', icon: Store },
            { id: 'slides', label: 'Slider', icon: ImageIcon },
            { id: 'coupons', label: 'Coupons', icon: Tag },
            { id: 'settings', label: 'Settings', icon: Settings },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 shrink-0 transition-all cursor-pointer ${
                  isActive ? 'bg-[#FF5722] text-white shadow-xs' : 'bg-white text-[#52634B] border border-[#DEE5D6]'
                }`}
              >
                <Icon size={14} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* HIGHLIGHTED TOP ORDERS BANNER */}
        <div className="p-4 rounded-3xl bg-gradient-to-r from-[#192215] to-[#2B3B23] text-white shadow-lg border border-[#FF5722]/40 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#FF5722] flex items-center justify-center text-white animate-pulse shrink-0">
              <ShoppingBag size={20} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-black text-white">Live High-Priority Orders Feed</h2>
                <span className="px-2 py-0.5 rounded-full bg-[#FF5722] text-white text-[9px] font-black uppercase">
                  {orders.length} Active
                </span>
              </div>
              <p className="text-[11px] text-[#C2D4B7]">
                Latest customer order: <strong className="text-white">{orders[0]?.orderNumber}</strong> ({orders[0]?.customerName} • ₹{orders[0]?.total})
              </p>
            </div>
          </div>
          <button
            onClick={() => setActiveTab('orders')}
            className="px-4 py-2 rounded-xl bg-[#FF5722] hover:bg-[#7CA235] text-white text-xs font-bold transition-all cursor-pointer shadow-xs active:scale-95 shrink-0"
          >
            View All Orders
          </button>
        </div>

      {/* 3. TAB CONTENT: OVERVIEW (DASHBOARD) */}
      {activeTab === 'overview' && (
        <div className="space-y-4 animate-in fade-in duration-200">
          {/* 4 Metric Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-4 rounded-2xl bg-white border border-[#E3E8DC] shadow-xs">
              <span className="text-[10px] font-bold text-[#71806C] uppercase tracking-wider block">
                Total Products
              </span>
              <span className="text-2xl font-black text-[#1C2518] mt-1 block">
                {products.length}
              </span>
              <span className="text-[10px] text-[#FF5722] font-semibold">Active in Catalog</span>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-[#E3E8DC] shadow-xs">
              <span className="text-[10px] font-bold text-[#71806C] uppercase tracking-wider block">
                Total Categories
              </span>
              <span className="text-2xl font-black text-[#1C2518] mt-1 block">
                {categories.length}
              </span>
              <span className="text-[10px] text-[#FF5722] font-semibold">Craft Categories</span>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-[#E3E8DC] shadow-xs">
              <span className="text-[10px] font-bold text-[#71806C] uppercase tracking-wider block">
                Total Orders
              </span>
              <span className="text-2xl font-black text-[#1C2518] mt-1 block">
                {orders.length}
              </span>
              <span className="text-[10px] text-[#345BA0] font-semibold">1 In Transit</span>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-[#E3E8DC] shadow-xs">
              <span className="text-[10px] font-bold text-[#71806C] uppercase tracking-wider block">
                Gross Sales
              </span>
              <span className="text-2xl font-black text-[#1C2518] mt-1 block">
                ₹{orders.reduce((sum, o) => sum + o.total, 0) + 12400}
              </span>
              <span className="text-[10px] text-[#FF5722] font-semibold">Avg. ₹2,450 / order</span>
            </div>
          </div>

          {/* Sync Authentic Kutch Crafts to Firebase Banner */}
          <div className="p-4.5 rounded-2xl bg-gradient-to-r from-[#FFF3E0] to-[#FFE0B2] border border-[#FFCC80] flex flex-wrap items-center justify-between gap-3 shadow-xs">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#FF5722] text-white flex items-center justify-center shrink-0 shadow-xs">
                <Database size={18} />
              </div>
              <div>
                <h4 className="text-xs font-black text-[#E65100] flex items-center gap-2">
                  <span>Firebase Cloud Database Sync</span>
                  <span className="px-1.5 py-0.5 rounded-md bg-[#FF5722] text-white text-[9px] font-extrabold uppercase">
                    Live
                  </span>
                </h4>
                <p className="text-[11px] text-[#BF360C]">
                  {syncStatusMsg || 'Direct cloud sync: 10 authentic Kutch handicrafts, 8 categories, and hero banner slides.'}
                </p>
              </div>
            </div>
            <button
              onClick={handleSyncKutchHeritage}
              disabled={isSyncingKutch}
              className="px-4 py-2 rounded-xl bg-[#E65100] hover:bg-[#BF360C] disabled:opacity-60 text-white text-xs font-bold transition-all cursor-pointer shadow-xs active:scale-95 flex items-center gap-2 shrink-0"
            >
              <RefreshCw size={13} className={isSyncingKutch ? 'animate-spin' : ''} />
              <span>{isSyncingKutch ? 'Syncing to Firebase...' : '⚡ Sync Kutch Products to Firebase'}</span>
            </button>
          </div>

          {/* Low Stock Alert Banner */}
          <div className="p-4 rounded-2xl bg-[#FFF9E6] border border-[#FDE3A2] flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-[#F4A721] text-white flex items-center justify-center shrink-0">
                <AlertTriangle size={17} />
              </div>
              <div>
                <h4 className="text-xs font-bold text-[#674305]">
                  Inventory Status: Heritage Crafts Monitored
                </h4>
                <p className="text-[11px] text-[#8C6013]">
                  Handcrafted Rogan Art & Master Bandhani Silk pieces have limited stock due to artisan hand-knotting time.
                </p>
              </div>
            </div>
            <button
              onClick={() => {
                setActiveTab('products');
                setStockFilter('lowStock');
              }}
              className="px-3 py-1.5 rounded-xl bg-[#674305] text-white text-xs font-bold hover:bg-[#503303] cursor-pointer"
            >
              Review Stock
            </button>
          </div>

          {/* Quick Actions & Recent Orders Preview */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-5 rounded-3xl bg-white border border-[#E3E8DC] shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-black uppercase tracking-wider text-[#63725C]">
                  Quick Management
                </h3>
                <span className="text-[10px] text-[#FF5722] font-bold">Shortcuts</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={openAddProductModal}
                  className="p-3 rounded-2xl bg-[#F6FAF1] border border-[#DEE7D4] text-left hover:border-[#FF5722] transition-colors cursor-pointer group"
                >
                  <Package size={17} className="text-[#FF5722] mb-1 group-hover:scale-110 transition-transform" />
                  <span className="text-xs font-bold text-[#1C2518] block">+ Add Product</span>
                  <span className="text-[10px] text-[#71806C]">Add Kutch craft SKU</span>
                </button>
                <button
                  onClick={() => setIsAddCouponOpen(true)}
                  className="p-3 rounded-2xl bg-[#F6FAF1] border border-[#DEE7D4] text-left hover:border-[#FF5722] transition-colors cursor-pointer group"
                >
                  <Tag size={17} className="text-[#FF5722] mb-1 group-hover:scale-110 transition-transform" />
                  <span className="text-xs font-bold text-[#1C2518] block">+ New Coupon</span>
                  <span className="text-[10px] text-[#71806C]">Discount promo code</span>
                </button>
                <button
                  onClick={() => setActiveTab('slides')}
                  className="p-3 rounded-2xl bg-[#F6FAF1] border border-[#DEE7D4] text-left hover:border-[#FF5722] transition-colors cursor-pointer group"
                >
                  <ImageIcon size={17} className="text-[#FF5722] mb-1 group-hover:scale-110 transition-transform" />
                  <span className="text-xs font-bold text-[#1C2518] block">Hero Slider</span>
                  <span className="text-[10px] text-[#71806C]">Homepage banners</span>
                </button>
                <button
                  onClick={() => setActiveTab('storeview')}
                  className="p-3 rounded-2xl bg-[#F6FAF1] border border-[#DEE7D4] text-left hover:border-[#FF5722] transition-colors cursor-pointer group"
                >
                  <Store size={17} className="text-[#FF5722] mb-1 group-hover:scale-110 transition-transform" />
                  <span className="text-xs font-bold text-[#1C2518] block">Store View</span>
                  <span className="text-[10px] text-[#71806C]">Preview customer app</span>
                </button>
              </div>
            </div>

            {/* Recent Orders Overview */}
            <div className="p-5 rounded-3xl bg-white border border-[#E3E8DC] shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-black uppercase tracking-wider text-[#63725C]">
                  Recent Orders
                </h3>
                <button
                  onClick={() => setActiveTab('orders')}
                  className="text-xs font-bold text-[#FF5722] hover:underline cursor-pointer"
                >
                  View All ({orders.length})
                </button>
              </div>
              <div className="space-y-2">
                {orders.slice(0, 3).map((ord) => (
                  <div
                    key={ord.id}
                    onClick={() => setSelectedInvoice(ord)}
                    className="p-2.5 rounded-xl bg-[#F8FAF4] border border-[#E8EDE0] flex items-center justify-between hover:border-[#FF5722] transition-colors cursor-pointer"
                  >
                    <div>
                      <span className="text-xs font-extrabold text-[#1C2518]">
                        {ord.orderNumber}
                      </span>
                      <span className="text-[11px] text-[#71806C] block">
                        {ord.customerName} • ${ord.total}
                      </span>
                    </div>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[9px] font-extrabold ${
                        ord.status === 'In Transit'
                          ? 'bg-[#E5EEFA] text-[#1B4B82]'
                          : ord.status === 'Delivered'
                          ? 'bg-[#EBF5DC] text-[#426C18]'
                          : 'bg-[#FFF7E8] text-[#9A6014]'
                      }`}
                    >
                      {ord.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 4. TAB CONTENT: PRODUCTS MANAGER & PRODUCT VIEW */}
      {activeTab === 'products' && (
        <div className="space-y-4 animate-in fade-in duration-200">
          {/* Action Bar */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5">
            <div className="flex items-center gap-2 flex-1 flex-wrap">
              <div className="relative flex-1 min-w-[180px]">
                <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#85967E]" />
                <input
                  type="text"
                  placeholder="Search products..."
                  value={productSearch}
                  onChange={(e) => setProductSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 rounded-xl bg-white border border-[#DCE4D3] text-xs font-semibold focus:outline-none focus:border-[#FF5722]"
                />
              </div>

              <select
                value={selectedCategoryFilter}
                onChange={(e) => setSelectedCategoryFilter(e.target.value)}
                className="px-3 py-2 rounded-xl bg-white border border-[#DCE4D3] text-xs font-semibold focus:outline-none focus:border-[#FF5722]"
              >
                <option value="All">All Categories</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.name}>
                    {c.name}
                  </option>
                ))}
              </select>

              {/* Stock Filter */}
              <select
                value={stockFilter}
                onChange={(e) => setStockFilter(e.target.value as any)}
                className="px-3 py-2 rounded-xl bg-white border border-[#DCE4D3] text-xs font-semibold focus:outline-none focus:border-[#FF5722]"
              >
                <option value="All">All Stock Levels</option>
                <option value="inStock">In Stock</option>
                <option value="lowStock">Low Stock (&lt;10)</option>
                <option value="outOfStock">Out of Stock</option>
              </select>
            </div>

            <button
              onClick={openAddProductModal}
              className="px-4 py-2 rounded-xl bg-[#FF5722] text-white text-xs font-bold flex items-center justify-center gap-1.5 hover:bg-[#7CA235] cursor-pointer shadow-xs active:scale-95 shrink-0"
            >
              <Plus size={15} />
              <span>Add New Product</span>
            </button>
          </div>

          {/* Product Cards List */}
          <div className="space-y-2.5">
            {filteredProducts.map((p) => {
              const isOut = p.inStock === false || (p.stock !== undefined && p.stock <= 0);
              const isLow = !isOut && p.stock !== undefined && p.stock <= 10;

              return (
                <div
                  key={p.id}
                  className="p-3.5 rounded-2xl bg-white border border-[#E3E8DC] shadow-xs flex flex-wrap items-center justify-between gap-3 hover:border-[#FF5722]/60 transition-colors"
                >
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <img
                      src={p.images[0]}
                      alt={p.name}
                      className="w-13 h-13 rounded-xl object-cover border border-[#DEE5D6] bg-[#F5F8F0] shrink-0"
                    />
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <h4 className="text-xs font-bold text-[#1C2518] truncate">
                          {p.name}
                        </h4>
                        {p.isBestSeller && (
                          <span className="px-2 py-0.5 rounded-full bg-[#EBF5DC] text-[#426C18] text-[9px] font-bold shrink-0">
                            Bestseller
                          </span>
                        )}
                      </div>
                      <span className="text-[11px] text-[#71806C] block truncate">
                        {p.category} • Base: ${p.price} ({p.sizes[0]?.size})
                      </span>
                      {/* Live Stock Indicator & Quick Toggles */}
                      <div className="flex flex-wrap items-center gap-1.5 mt-1.5">
                        <span
                          className={`inline-flex items-center gap-1 text-[10px] font-extrabold px-2 py-0.5 rounded-md ${
                            isOut
                              ? 'bg-[#FEECEC] text-[#B02828]'
                              : isLow
                              ? 'bg-[#FEF5DC] text-[#91660A]'
                              : 'bg-[#EDF5E0] text-[#3E6518]'
                          }`}
                        >
                          <span className={`w-1.5 h-1.5 rounded-full ${isOut ? 'bg-[#B02828]' : isLow ? 'bg-[#D2900B]' : 'bg-[#55861F]'}`} />
                          {isOut ? 'Out of Stock' : isLow ? 'Low Stock' : 'In Stock'}
                        </span>

                        {/* 1-Click New Arrival Toggle */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onUpdateProduct({ ...p, isNew: !p.isNew });
                          }}
                          className={`text-[9.5px] font-black px-2 py-0.5 rounded-md transition-all cursor-pointer flex items-center gap-0.5 ${
                            p.isNew
                              ? 'bg-[#E0F2FE] text-[#0369A1] border border-[#BAE6FD]'
                              : 'bg-[#F1F5F9] text-[#64748B] hover:bg-[#E2E8F0]'
                          }`}
                          title="Toggle show in Home New Arrivals"
                        >
                          <span>✨ New Arrival: {p.isNew ? 'ON' : 'OFF'}</span>
                        </button>

                        {/* 1-Click Bestseller Toggle */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onUpdateProduct({ ...p, isBestSeller: !p.isBestSeller });
                          }}
                          className={`text-[9.5px] font-black px-2 py-0.5 rounded-md transition-all cursor-pointer flex items-center gap-0.5 ${
                            p.isBestSeller
                              ? 'bg-[#EBF5DC] text-[#3B6216] border border-[#D0E5B3]'
                              : 'bg-[#F1F5F9] text-[#64748B] hover:bg-[#E2E8F0]'
                          }`}
                          title="Toggle Bestseller badge"
                        >
                          <span>🔥 Bestseller: {p.isBestSeller ? 'ON' : 'OFF'}</span>
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    {/* PRODUCT VIEW BUTTON (Eye Icon for instant Preview) */}
                    <button
                      onClick={() => setPreviewingProduct(p)}
                      className="px-2.5 py-1.5 rounded-xl bg-[#F0F5E9] hover:bg-[#E3EDD6] text-[#3B6216] text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer"
                      title="Product View (Preview Customer Card)"
                    >
                      <Eye size={13} />
                      <span className="hidden sm:inline">Product View</span>
                    </button>
                    <button
                      onClick={() => openEditProductModal(p)}
                      className="p-2 rounded-xl bg-[#F4F7EE] hover:bg-[#E7EFE0] text-[#3B6216] transition-colors cursor-pointer"
                      title="Edit Product"
                    >
                      <Edit2 size={14} />
                    </button>
                    <button
                      onClick={() => {
                        if (confirm(`Delete "${p.name}"?`)) {
                          onDeleteProduct(p.id);
                        }
                      }}
                      className="p-2 rounded-xl bg-[#FDF2F2] hover:bg-[#FCE2E2] text-[#A63A3A] transition-colors cursor-pointer"
                      title="Delete Product"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 5. TAB CONTENT: CATEGORIES MANAGER */}
      {activeTab === 'categories' && (
        <div className="space-y-4 animate-in fade-in duration-200">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#697961]">
                Dry Fruit Categories
              </h3>
              <p className="text-[11px] text-[#788872]">
                Organize products into customer-facing shelves
              </p>
            </div>
            <button
              onClick={() => setIsAddCategoryOpen(true)}
              className="px-3.5 py-1.5 rounded-xl bg-[#FF5722] text-white text-xs font-bold flex items-center gap-1.5 hover:bg-[#7CA235] cursor-pointer shadow-xs active:scale-95"
            >
              <Plus size={14} />
              <span>Add Category</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {categories.map((c) => (
              <div
                key={c.id}
                className="p-3.5 rounded-2xl bg-white border border-[#E3E8DC] shadow-xs flex items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={c.image}
                    alt={c.name}
                    className="w-11 h-11 rounded-xl object-cover border border-[#DFE7D6]"
                  />
                  <div>
                    <h4 className="text-xs font-bold text-[#1C2518]">{c.name}</h4>
                    <span className="text-[10px] text-[#71806C]">
                      {products.filter((p) => p.category === c.name).length} products listed
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => {
                    if (confirm(`Remove category "${c.name}"?`)) {
                      onDeleteCategory(c.id);
                    }
                  }}
                  className="p-1.5 rounded-lg text-[#9B3C3C] hover:bg-[#FEECEC] cursor-pointer"
                  title="Delete category"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 6. TAB CONTENT: SLIDER MANAGER */}
      {activeTab === 'slides' && (
        <div className="space-y-4 animate-in fade-in duration-200">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#697961]">
                Homepage Hero Slider Banners
              </h3>
              <p className="text-[11px] text-[#788872]">
                Update promotional tags, titles, discount codes and banner images
              </p>
            </div>
            <button
              onClick={() => {
                setSlideUploadedImage('');
                setEditingSlide(null);
                setIsAddSlideOpen(true);
              }}
              className="px-3.5 py-1.5 rounded-xl bg-[#FF5722] text-white text-xs font-bold flex items-center gap-1.5 hover:bg-[#7CA235] cursor-pointer shadow-xs active:scale-95"
            >
              <Plus size={14} />
              <span>Add Slide</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {slides.map((s, idx) => (
              <div
                key={s.id}
                className="p-4 rounded-3xl bg-white border border-[#E3E8DC] shadow-xs space-y-3 relative"
              >
                {/* Visual Preview */}
                <div
                  className={`p-4 rounded-2xl bg-gradient-to-br ${s.bgGradient} text-[#182313] flex items-center justify-between shadow-xs`}
                >
                  <div>
                    <span className="px-2 py-0.5 rounded-full bg-white/70 text-[9px] font-black uppercase">
                      {s.tag}
                    </span>
                    <h4 className="text-sm font-black leading-tight mt-1">
                      {s.titleLine1}
                      <br />
                      {s.titleLine2}
                    </h4>
                    <span className="text-[10px] font-mono font-bold mt-1 block">
                      Code: {s.code}
                    </span>
                  </div>
                  <img
                    src={s.imageSrc}
                    alt="Slide"
                    className="w-16 h-16 rounded-xl object-cover border border-white/40 shadow-xs"
                  />
                </div>

                <div className="flex items-center justify-between pt-1">
                  <span className="text-xs font-bold text-[#6D7D67]">
                    Slide #{idx + 1}
                  </span>
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => {
                        setSlideUploadedImage(s.imageSrc || '');
                        setEditingSlide(s);
                        setIsAddSlideOpen(false);
                      }}
                      className="px-3 py-1 rounded-lg bg-[#F4F7EE] text-[#3C6416] text-xs font-bold hover:bg-[#E8EFE0] cursor-pointer"
                    >
                      Edit
                    </button>
                    {slides.length > 1 && (
                      <button
                        onClick={() => onDeleteSlide(s.id)}
                        className="p-1 rounded-lg text-[#9B3C3C] hover:bg-[#FEECEC] cursor-pointer"
                        title="Delete Slide"
                      >
                        <Trash2 size={14} />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB CONTENT: CUSTOMERS */}
      {activeTab === 'customers' && (
        <div className="space-y-4 animate-in fade-in duration-200">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#697961]">
                Customer Directory & Orders History
              </h3>
              <p className="text-[11px] text-[#788872]">
                Click on any customer to view all orders placed by them
              </p>
            </div>
            <span className="text-xs font-bold text-[#FF5722]">
              {Array.from(new Set(orders.map(o => o.customerEmail || o.customerName))).length} Total Customers
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {Array.from(
              orders.reduce((map, ord) => {
                const key = ord.customerEmail || ord.customerName;
                if (!map.has(key)) {
                  map.set(key, {
                    name: ord.customerName,
                    email: ord.customerEmail,
                    phone: ord.customerPhone,
                    address: ord.shippingAddress,
                    orders: [],
                  });
                }
                map.get(key)?.orders.push(ord);
                return map;
              }, new Map<string, { name: string; email: string; phone: string; address: string; orders: OrderItemAdmin[] }>()).values()
            ).map((cust, idx) => {
              const totalSpent = cust.orders.reduce((sum, o) => sum + o.total, 0);
              return (
                <div
                  key={idx}
                  onClick={() => setSelectedCustomerOrders(cust)}
                  className="p-4 rounded-3xl bg-white border border-[#E3E8DC] shadow-xs hover:border-[#FF5722] transition-all cursor-pointer space-y-3 group"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-2xl bg-[#EBF5DC] text-[#426C18] flex items-center justify-center font-bold">
                        <Users size={18} />
                      </div>
                      <div>
                        <h4 className="text-sm font-extrabold text-[#1C2518] group-hover:text-[#426C18] transition-colors">
                          {cust.name}
                        </h4>
                        <span className="text-[11px] text-[#71806C] block truncate max-w-[200px]">
                          {cust.email}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-black text-[#1C2518]">₹{totalSpent}</span>
                      <span className="text-[10px] text-[#788871] block">{cust.orders.length} Orders</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-[#EEF2E6] text-[11px] text-[#697961]">
                    <span>Phone: {cust.phone || 'Not Provided'}</span>
                    <span className="text-[#FF5722] font-bold group-hover:underline">View All Orders →</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 7. TAB CONTENT: ORDERS MANAGER & INVOICES */}
      {activeTab === 'orders' && (
        <div className="space-y-4 animate-in fade-in duration-200">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#697961]">
                Customer Orders & Dispatch
              </h3>
              <p className="text-[11px] text-[#788872]">
                Change status to update real-time tracking for customer profile
              </p>
            </div>
            <span className="text-xs font-bold text-[#FF5722]">
              {orders.length} Active Orders
            </span>
          </div>

          <div className="space-y-3">
            {orders.map((ord) => (
              <div
                key={ord.id}
                className="p-4 rounded-2xl bg-white border border-[#E3E8DC] shadow-xs space-y-3"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <span className="text-xs font-extrabold text-[#1C2518]">
                      {ord.orderNumber}
                    </span>
                    <span className="text-[11px] text-[#71806C] block">
                      Customer: {ord.customerName} ({ord.customerEmail})
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    {/* View Invoice button */}
                    <button
                      onClick={() => setSelectedInvoice(ord)}
                      className="px-2.5 py-1 rounded-lg bg-[#F0F5E9] hover:bg-[#E2ECD5] text-[#396016] text-xs font-bold flex items-center gap-1 cursor-pointer"
                    >
                      <Printer size={13} />
                      <span>Invoice</span>
                    </button>

                    {/* Status Dropdown */}
                    <select
                      value={ord.status}
                      onChange={(e) =>
                        handleOrderStatusChange(ord.id, e.target.value as any)
                      }
                      className={`px-3 py-1 rounded-full text-xs font-extrabold cursor-pointer border ${
                        ord.status === 'In Transit'
                          ? 'bg-[#E5EEFA] text-[#1B4B82] border-[#C3D7F3]'
                          : ord.status === 'Delivered'
                          ? 'bg-[#EBF5DC] text-[#426C18] border-[#CCE0B5]'
                          : 'bg-[#FFF7E8] text-[#9A6014] border-[#FBE0B2]'
                      }`}
                    >
                      <option value="Processing">Processing</option>
                      <option value="In Transit">In Transit</option>
                      <option value="Delivered">Delivered</option>
                    </select>
                  </div>
                </div>

                <div className="p-2.5 rounded-xl bg-[#F8FAF4] border border-[#E8EDE0] flex flex-wrap items-center justify-between text-xs gap-2">
                  <div>
                    <span className="font-bold text-[#1C2518] block">{ord.productName}</span>
                    <span className="text-[10px] text-[#71806C]">Size: {ord.productSize}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-[#71806C] block">Tracking Code:</span>
                    <code className="text-xs font-mono font-bold text-[#3B6416]">
                      {ord.trackingNumber}
                    </code>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 8. TAB CONTENT: MARKETING & COUPONS MANAGER */}
      {activeTab === 'coupons' && (
        <div className="space-y-4 animate-in fade-in duration-200">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#697961]">
                Promotional Discount Coupons
              </h3>
              <p className="text-[11px] text-[#788872]">
                Create discount promo codes that customers can apply at checkout
              </p>
            </div>
            <button
              onClick={() => setIsAddCouponOpen(true)}
              className="px-3.5 py-1.5 rounded-xl bg-[#FF5722] text-white text-xs font-bold flex items-center gap-1.5 hover:bg-[#7CA235] cursor-pointer shadow-xs active:scale-95"
            >
              <Plus size={14} />
              <span>Create Coupon</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {coupons.map((c) => (
              <div
                key={c.id}
                className="p-4 rounded-2xl bg-white border border-[#E3E8DC] shadow-xs space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="px-2.5 py-1 rounded-lg bg-[#EBF5DC] text-[#3C6416] font-mono font-black text-xs">
                      {c.code}
                    </div>
                    {c.isActive ? (
                      <span className="text-[9px] px-1.5 py-0.5 rounded-md bg-[#EDF7E1] text-[#3F6B17] font-bold">
                        Active
                      </span>
                    ) : (
                      <span className="text-[9px] px-1.5 py-0.5 rounded-md bg-[#FCEAEA] text-[#A63A3A] font-bold">
                        Paused
                      </span>
                    )}
                  </div>
                  <button
                    onClick={() => copyToClipboard(c.code)}
                    className="p-1 rounded-md text-[#71806C] hover:text-[#182313] hover:bg-[#F2F5ED] cursor-pointer"
                    title="Copy Code"
                  >
                    {copiedCoupon === c.code ? <Check size={14} className="text-[#FF5722]" /> : <Copy size={14} />}
                  </button>
                </div>

                <div>
                  <h4 className="text-xs font-bold text-[#1C2518]">
                    {c.discountPercent ? `${c.discountPercent}% OFF` : `$${c.discountAmount} OFF`}
                  </h4>
                  <p className="text-[11px] text-[#71806C] mt-0.5">{c.description}</p>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-[#EEF2E6] text-[10px] text-[#71806C]">
                  <span>Min Cart: ${c.minOrder}</span>
                  <span>Used: {c.usageCount} times</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB CONTENT: ANALYTICS & PRODUCT/PAGE VIEWS */}
      {activeTab === 'analytics' && (
        <AdminAnalyticsSection
          products={products}
          analytics={
            analytics || {
              pageViews: {
                home: 4320,
                catalog: 2680,
                productDetails: 3150,
                cart: 1140,
                wishlist: 780,
                profile: 620,
                admin: 190,
              },
              productViews: {
                'kutch-traditional-mamra-almonds': 1480,
                'kutch-traditional-w180-cashews': 1120,
                'kutch-traditional-snow-white-walnuts': 960,
                'kutch-traditional-medjool-dates': 810,
                'kutch-traditional-royal-afghan-anjeer': 690,
                'kutch-traditional-roasted-pistachios': 840,
              },
              totalVisitors: 6940,
              activeVisitorsNow: 16,
              dailyViews: [
                { date: 'Mon', views: 820, visitors: 410 },
                { date: 'Tue', views: 950, visitors: 490 },
                { date: 'Wed', views: 1120, visitors: 580 },
                { date: 'Thu', views: 1340, visitors: 690 },
                { date: 'Fri', views: 1490, visitors: 740 },
                { date: 'Sat', views: 1820, visitors: 890 },
                { date: 'Sun (Today)', views: 1210, visitors: 620 },
              ],
              trafficSources: [
                { source: 'Direct (kutchtraditional.store)', percentage: 41, visits: 2845 },
                { source: 'Google Organic Search', percentage: 29, visits: 2012 },
                { source: 'Instagram & Social Ads', percentage: 19, visits: 1318 },
                { source: 'WhatsApp & Referral', percentage: 11, visits: 765 },
              ],
            }
          }
          onSimulateView={onSimulateView}
          onResetAnalytics={onResetAnalytics}
        />
      )}

      {/* TAB CONTENT: STORE VIEW (LIVE INTERACTIVE & WYSIWYG EDITABLE) */}
      {activeTab === 'storeview' && (
        <AdminStoreViewSection
          products={products}
          categories={categories}
          slides={slides}
          announcementText={announcementText}
          onUpdateAnnouncement={(t) => setAnnouncementText(t)}
          onAddProduct={openAddProductModal}
          onEditProduct={(p) => openEditProductModal(p)}
          onDeleteProduct={(id) => onDeleteProduct(id)}
          onToggleProductStock={(p) => handleToggleStock(p)}
          onAddCategory={() => setIsAddCategoryOpen(true)}
          onDeleteCategory={(id) => onDeleteCategory(id)}
          onAddSlide={() => {
            setSlideUploadedImage('');
            setEditingSlide(null);
            setIsAddSlideOpen(true);
          }}
          onEditSlide={(s) => {
            setSlideUploadedImage(s.imageSrc || '');
            setEditingSlide(s);
            setIsAddSlideOpen(false);
          }}
          onDeleteSlide={(id) => onDeleteSlide(id)}
          onExitAdmin={onExitAdmin}
        />
      )}

      {/* 10. TAB CONTENT: SETTINGS & ANNOUNCEMENT BAR */}
      {activeTab === 'settings' && (
        <div className="space-y-4 animate-in fade-in duration-200">
          {/* Product Page Setting (Feature Toggles) */}
          <div className="p-5 rounded-3xl bg-white border border-[#E3E8DC] shadow-xs space-y-4">
            <div>
              <h3 className="text-xs font-black uppercase tracking-wider text-[#697961] flex items-center gap-1.5">
                <SlidersHorizontal size={15} className="text-[#FF5722]" />
                Product Page Setting (Feature Toggles)
              </h3>
              <p className="text-[11px] text-[#788872]">
                Enable or disable specific product detail features in real-time
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              {[
                { key: 'showRecentPurchase', label: 'Recent Purchase Popups', desc: 'Live toast notifications (e.g., Rahul from Mumbai)' },
                { key: 'showPhotoReviews', label: 'Verified Photo Reviews', desc: 'Customer unboxing photo gallery & star ratings' },
                { key: 'showSoldCounter', label: 'Sold Units Counter', desc: '🔥 342 units sold in last 7 days badge' },
                { key: 'showCartReservationTimer', label: 'Cart Reservation Timer', desc: 'Reserved for 10:00 mins countdown timer' },
                { key: 'showFlashSaleTimer', label: 'Harvest Flash Sale Timer', desc: 'Top harvest flash sale countdown banner' },
                { key: 'showTrustBadges', label: 'Trust & Safety Badges', desc: 'Organic, lab tested, & Srinagar farm stamps' },
              ].map((item) => {
                const isEnabled = (productPageSettings as any)[item.key];
                return (
                  <div key={item.key} className="p-3.5 rounded-2xl bg-[#F8FAF4] border border-[#E8EDE0] flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <span className="text-xs font-extrabold text-[#192315] block truncate">{item.label}</span>
                      <span className="text-[10px] text-[#71806C] block leading-tight">{item.desc}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        const updated = { ...productPageSettings, [item.key]: !isEnabled };
                        onUpdateProductPageSettings(updated);
                      }}
                      className={`w-11 h-6 flex items-center rounded-full p-1 duration-300 cursor-pointer shrink-0 ${
                        isEnabled ? 'bg-[#FF5722]' : 'bg-[#D1DCD0]'
                      }`}
                    >
                      <div
                        className={`bg-white w-4 h-4 rounded-full shadow-md transform duration-300 ${
                          isEnabled ? 'translate-x-5' : 'translate-x-0'
                        }`}
                      />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="p-5 rounded-3xl bg-white border border-[#E3E8DC] shadow-xs space-y-4">
            <div>
              <h3 className="text-xs font-black uppercase tracking-wider text-[#697961]">
                Store Settings & Customer Notice
              </h3>
              <p className="text-[11px] text-[#788872]">
                Configure announcement banner text, customer support WhatsApp and contact info
              </p>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                setSavedSettingsSuccess(true);
                setTimeout(() => setSavedSettingsSuccess(false), 2500);
              }}
              className="space-y-3.5"
            >
              <div>
                <label className="text-[11px] font-bold text-[#6B7B65] block mb-1">
                  Top Announcement Bar Banner Text
                </label>
                <input
                  type="text"
                  value={announcementText}
                  onChange={(e) => setAnnouncementText(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#DDE5D4] text-xs font-semibold focus:outline-none focus:border-[#FF5722]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-[#6B7B65] block mb-1">
                    Store Support Email
                  </label>
                  <input
                    type="email"
                    defaultValue="kutchtraditional@gmail.com"
                    className="w-full px-3.5 py-2 rounded-xl border border-[#DDE5D4] text-xs font-semibold focus:outline-none focus:border-[#FF5722]"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-[#6B7B65] block mb-1">
                    Customer Care WhatsApp Phone
                  </label>
                  <input
                    type="text"
                    defaultValue="+1 (555) 739-2041"
                    className="w-full px-3.5 py-2 rounded-xl border border-[#DDE5D4] text-xs font-semibold focus:outline-none focus:border-[#FF5722]"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                {savedSettingsSuccess && (
                  <span className="text-xs font-bold text-[#426C18] flex items-center gap-1">
                    <CheckCircle2 size={14} />
                    <span>Settings updated successfully!</span>
                  </span>
                )}
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-[#FF5722] text-white text-xs font-bold hover:bg-[#7CA235] cursor-pointer shadow-xs ml-auto"
                >
                  Save Store Settings
                </button>
              </div>
            </form>
          </div>

          {/* FIREBASE CLOUD & IMGBB HOSTING CONTROL CENTER */}
          <div className="p-5 rounded-3xl bg-white border border-[#E3E8DC] shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xs font-black uppercase tracking-wider text-[#697961] flex items-center gap-1.5">
                  <Cloud size={15} className="text-[#FF5722]" />
                  Firebase Cloud Database & ImgBB Hosting
                </h3>
                <p className="text-[11px] text-[#788872]">
                  Centralized real-time cloud data storage & high-speed image CDN
                </p>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-[#EBF5DC] text-[#3E6518] text-[10px] font-black flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#55861F] animate-pulse" />
                Live Cloud Synced
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div className="p-3 rounded-2xl bg-[#F8FAF4] border border-[#E8EDE0] text-xs space-y-1">
                <span className="text-[10px] uppercase font-bold text-[#71806C] block">
                  Firebase Project ID
                </span>
                <span className="font-mono font-bold text-[#1C2518] text-xs">
                  bhujtop-4afc6
                </span>
                <p className="text-[10px] text-[#7D8E78]">
                  Database: Firestore Cloud Engine (New dedicated instance)
                </p>
              </div>

              <div className="p-3 rounded-2xl bg-[#F8FAF4] border border-[#E8EDE0] text-xs space-y-1">
                <span className="text-[10px] uppercase font-bold text-[#71806C] block">
                  Image CDN Engine
                </span>
                <span className="font-mono font-bold text-[#1C2518] text-xs">
                  ImgBB (i.ibb.co)
                </span>
                <p className="text-[10px] text-[#7D8E78]">
                  Hosted URLs are automatically saved into Firebase Firestore
                </p>
              </div>
            </div>

            {/* ImgBB API Key Configuration */}
            <div className="p-4 rounded-2xl bg-[#F4F8EE] border border-[#DFE8D3] space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-[#1C2518] flex items-center gap-1.5">
                  <Key size={13} className="text-[#FF5722]" />
                  ImgBB API Key (For Custom Image Hosting)
                </span>
                <a
                  href="https://api.imgbb.com/"
                  target="_blank"
                  rel="noreferrer"
                  className="text-[#4E761E] font-bold text-[11px] hover:underline"
                >
                  Get Free Key (api.imgbb.com)
                </a>
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={imgbbConfigKey}
                  onChange={(e) => setImgbbConfigKey(e.target.value)}
                  placeholder="Enter your ImgBB API key..."
                  className="flex-1 px-3 py-2 text-xs rounded-xl border border-[#D0DCBF] bg-white focus:outline-none focus:border-[#FF5722]"
                />
                <button
                  type="button"
                  onClick={() => {
                    setImgbbApiKey(imgbbConfigKey);
                    setImgbbConfigSaved(true);
                    setTimeout(() => setImgbbConfigSaved(false), 2500);
                  }}
                  className="px-4 py-2 bg-[#FF5722] text-white text-xs font-bold rounded-xl hover:bg-[#7CA235] cursor-pointer shadow-xs"
                >
                  Save Key
                </button>
              </div>
              {imgbbConfigSaved && (
                <span className="text-xs font-bold text-[#426C18] flex items-center gap-1">
                  <CheckCircle2 size={13} />
                  <span>ImgBB Key saved to store configuration!</span>
                </span>
              )}
            </div>

            {/* Live ImgBB Test Uploader */}
            <div className="pt-1">
              <ImgBBUploader
                label="Quick Test ImgBB Upload"
                helperText="Upload any dry fruits image here to verify instant ImgBB CDN hosting & URL generation."
                onImageUploaded={(url) => {
                  alert(`Image hosted successfully on ImgBB CDN!\n\nHosted URL:\n${url}\n\nThis URL is ready to be saved in Firebase.`);
                }}
              />
            </div>
          </div>
        </div>
      )}

      {/* 11. MODAL: PRODUCT VIEW (PREVIEW MODAL) */}
      {previewingProduct && (
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto"
          onClick={() => setPreviewingProduct(null)}
        >
          <div
            className="w-full max-w-md bg-white rounded-3xl p-5 sm:p-6 shadow-2xl border border-[#E3E8DC] animate-in zoom-in-95 duration-200 space-y-4 my-8"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-2 border-b border-[#EEF2E6]">
              <div className="flex items-center gap-1.5">
                <Eye size={16} className="text-[#FF5722]" />
                <h3 className="text-xs font-black uppercase text-[#1C2518]">
                  Product View (Customer Preview)
                </h3>
              </div>
              <button
                onClick={() => setPreviewingProduct(null)}
                className="w-7 h-7 rounded-full bg-[#F2F5ED] flex items-center justify-center text-[#55634E] cursor-pointer"
              >
                <X size={15} />
              </button>
            </div>

            {/* Product Card Graphic Preview */}
            <div className="relative aspect-square w-full rounded-2xl bg-[#F0F3EC] overflow-hidden border border-[#E0E7D8] flex items-center justify-center">
              <img
                src={previewingProduct.images[0]}
                alt={previewingProduct.name}
                className="w-full h-full object-cover"
              />
              <span className="absolute top-3 left-3 px-2 py-0.5 rounded-full bg-[#192215]/80 text-white text-[9px] font-bold">
                {previewingProduct.category}
              </span>
              <span
                className={`absolute top-3 right-3 px-2 py-0.5 rounded-full text-[9px] font-bold ${
                  previewingProduct.inStock === false
                    ? 'bg-[#E5484D] text-white'
                    : 'bg-[#FF5722] text-white'
                }`}
              >
                {previewingProduct.inStock === false ? 'Out of Stock' : 'In Stock'}
              </span>
            </div>

            {/* Details */}
            <div className="space-y-2">
              <h4 className="text-base font-black text-[#1C2518]">
                {previewingProduct.name}
              </h4>
              <p className="text-xs text-[#6C7B65] leading-relaxed">
                {previewingProduct.description}
              </p>

              {/* Weight & Prices Available */}
              <div className="pt-2">
                <span className="text-[10px] font-bold uppercase text-[#86957F] block mb-1">
                  Weight Variants & Pricing:
                </span>
                <div className="flex items-center gap-2">
                  {previewingProduct.sizes.map((s) => (
                    <div
                      key={s.size}
                      className="px-2.5 py-1 rounded-xl bg-[#F4F7EE] border border-[#DCE4D3] text-center"
                    >
                      <span className="text-[11px] font-bold text-[#1C2518] block">
                        {s.size}
                      </span>
                      <span className="text-xs font-black text-[#456C19]">
                        ${s.price}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Actions inside Product View */}
            <div className="pt-2 flex items-center gap-2">
              <button
                onClick={() => {
                  const target = previewingProduct;
                  setPreviewingProduct(null);
                  if (target) openEditProductModal(target);
                }}
                className="flex-1 py-2.5 rounded-xl bg-[#FF5722] hover:bg-[#7CA235] text-white font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
              >
                <Edit2 size={13} />
                <span>Edit This Product</span>
              </button>
              <button
                onClick={() => {
                  handleToggleStock(previewingProduct);
                  setPreviewingProduct(null);
                }}
                className="py-2.5 px-3 rounded-xl border border-[#DDE5D4] bg-white text-[#293621] font-bold text-xs hover:bg-[#F4F7EE] cursor-pointer"
              >
                Toggle Stock
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 12. MODAL: ORDER INVOICE & RECEIPT */}
      {selectedInvoice && (
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto"
          onClick={() => setSelectedInvoice(null)}
        >
          <div
            className="w-full max-w-lg bg-white rounded-3xl p-5 sm:p-6 shadow-2xl border border-[#E3E8DC] animate-in zoom-in-95 duration-200 space-y-4 my-8"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-[#EEF2E6]">
              <div>
                <span className="text-[10px] font-bold text-[#FF5722] uppercase tracking-wider block">
                  Official Store Invoice
                </span>
                <h3 className="text-sm font-black text-[#1C2518]">
                  Order {selectedInvoice.orderNumber}
                </h3>
              </div>
              <button
                onClick={() => setSelectedInvoice(null)}
                className="w-7 h-7 rounded-full bg-[#F2F5ED] flex items-center justify-center text-[#55634E] cursor-pointer"
              >
                <X size={15} />
              </button>
            </div>

            {/* Customer Details */}
            <div className="p-3 rounded-2xl bg-[#F8FAF4] border border-[#E8EDE0] text-xs space-y-1">
              <div className="flex justify-between">
                <span className="text-[#71806C]">Customer:</span>
                <span className="font-bold text-[#1C2518]">{selectedInvoice.customerName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#71806C]">Email:</span>
                <span className="font-bold text-[#1C2518]">{selectedInvoice.customerEmail}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#71806C]">Phone:</span>
                <span className="font-bold text-[#1C2518]">{selectedInvoice.customerPhone}</span>
              </div>
              <div className="flex justify-between pt-1 border-t border-[#E8EDE0]">
                <span className="text-[#71806C]">Ship To:</span>
                <span className="font-bold text-[#1C2518] text-right max-w-[65%]">
                  {selectedInvoice.shippingAddress}
                </span>
              </div>
            </div>

            {/* Item Details */}
            <div className="p-3 rounded-2xl bg-white border border-[#E3E8DC] text-xs space-y-2">
              <div className="flex justify-between font-bold text-[#1C2518]">
                <span>{selectedInvoice.productName} ({selectedInvoice.productSize})</span>
                <span>${selectedInvoice.subtotal}</span>
              </div>
              <div className="flex justify-between text-[#71806C]">
                <span>Carrier: {selectedInvoice.carrier}</span>
                <span>Qty: {selectedInvoice.quantity}</span>
              </div>
              <div className="pt-2 border-t border-[#EEF2E6] space-y-1">
                <div className="flex justify-between text-[#71806C]">
                  <span>Subtotal</span>
                  <span>${selectedInvoice.subtotal}</span>
                </div>
                <div className="flex justify-between text-[#3F6B17]">
                  <span>Discount</span>
                  <span>-${selectedInvoice.discount}</span>
                </div>
                <div className="flex justify-between text-[#71806C]">
                  <span>Shipping</span>
                  <span>${selectedInvoice.shipping}</span>
                </div>
                <div className="flex justify-between font-black text-sm text-[#1C2518] pt-1 border-t border-[#EEF2E6]">
                  <span>Total Paid</span>
                  <span>${selectedInvoice.total}</span>
                </div>
              </div>
            </div>

            {/* Tracking Code */}
            <div className="p-2.5 rounded-xl bg-[#EBF5DC] border border-[#CCE0B5] flex items-center justify-between text-xs">
              <span className="font-bold text-[#3B6416]">Tracking: {selectedInvoice.trackingNumber}</span>
              <button
                onClick={() => copyToClipboard(selectedInvoice.trackingNumber)}
                className="px-2 py-0.5 rounded bg-white text-[#3B6416] text-[10px] font-bold cursor-pointer"
              >
                Copy
              </button>
            </div>

            {/* Print button */}
            <button
              onClick={() => window.print()}
              className="w-full py-2.5 rounded-xl bg-[#192215] text-white font-bold text-xs flex items-center justify-center gap-2 hover:bg-[#2B3B23] cursor-pointer"
            >
              <Printer size={14} />
              <span>Print / Save PDF Receipt</span>
            </button>
          </div>
        </div>
      )}

      {/* MODAL: CUSTOMER ORDERS HISTORY */}
      {selectedCustomerOrders && (
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto"
          onClick={() => setSelectedCustomerOrders(null)}
        >
          <div
            className="w-full max-w-lg bg-white rounded-3xl p-6 shadow-2xl border border-[#E3E8DC] animate-in zoom-in-95 duration-200 space-y-4 max-h-[85vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-[#EEF2E6]">
              <div>
                <span className="text-[10px] font-bold text-[#FF5722] uppercase tracking-wider block">
                  Customer Profile & Orders
                </span>
                <h3 className="text-base font-black text-[#1C2518]">
                  {selectedCustomerOrders.name}
                </h3>
                <p className="text-xs text-[#71806C]">
                  {selectedCustomerOrders.email} • {selectedCustomerOrders.phone}
                </p>
              </div>
              <button
                onClick={() => setSelectedCustomerOrders(null)}
                className="w-8 h-8 rounded-full bg-[#F2F5ED] flex items-center justify-center text-[#55634E] cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            <div className="space-y-3">
              <h4 className="text-xs font-bold text-[#63725C] uppercase tracking-wider">
                Placed Orders ({selectedCustomerOrders.orders.length})
              </h4>
              {selectedCustomerOrders.orders.map((ord) => (
                <div
                  key={ord.id}
                  className="p-3.5 rounded-2xl bg-[#F8FAF4] border border-[#E3E8DC] space-y-2 text-xs"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-extrabold text-[#1C2518]">{ord.orderNumber}</span>
                    <span className="px-2 py-0.5 rounded-full bg-[#EBF5DC] text-[#426C18] text-[10px] font-bold">
                      {ord.status}
                    </span>
                  </div>
                  <div className="flex justify-between text-[#697961]">
                    <span>Product: {ord.productName} ({ord.productSize})</span>
                    <span className="font-bold text-[#1C2518]">₹{ord.total}</span>
                  </div>
                  <div className="text-[11px] text-[#71806C] pt-1 border-t border-[#E8EDE0]">
                    Shipped to: {ord.shippingAddress} ({ord.date})
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={() => setSelectedCustomerOrders(null)}
              className="w-full py-2.5 rounded-xl bg-[#FF5722] text-white font-bold text-xs hover:bg-[#7DA535] cursor-pointer shadow-xs"
            >
              Close Profile
            </button>
          </div>
        </div>
      )}

      {/* 13. MODAL: ADD / EDIT PRODUCT */}
      {(isAddProductOpen || editingProduct) && (
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto"
          onClick={() => {
            setIsAddProductOpen(false);
            setEditingProduct(null);
          }}
        >
          <div
            className="w-full max-w-lg bg-white rounded-3xl p-5 sm:p-6 shadow-2xl border border-[#E3E8DC] animate-in zoom-in-95 duration-200 space-y-4 my-8"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-[#EEF2E6]">
              <h3 className="text-sm font-black text-[#1C2518]">
                {editingProduct ? 'Edit Dry Fruit Product' : 'Add New Dry Fruit Product'}
              </h3>
              <button
                onClick={() => {
                  setIsAddProductOpen(false);
                  setEditingProduct(null);
                }}
                className="w-7 h-7 rounded-full bg-[#F2F5ED] flex items-center justify-center text-[#55634E] cursor-pointer"
              >
                <X size={15} />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                const form = e.currentTarget;
                const name = (form.elements.namedItem('name') as HTMLInputElement)?.value || '';
                const formPrice = Number((form.elements.namedItem('price') as HTMLInputElement)?.value || 0);
                const formOriginalPrice = Number((form.elements.namedItem('originalPrice') as HTMLInputElement)?.value) || 0;
                const subtitle = (form.elements.namedItem('subtitle') as HTMLInputElement)?.value || '';
                const finalImages = productImages.length > 0 ? productImages : ['https://images.unsplash.com/photo-1508061253366-f7da158b6d46?auto=format&fit=crop&w=800&q=80'];
                const description = (form.elements.namedItem('description') as HTMLTextAreaElement)?.value || '';

                // Build verified sizes list from dynamic variants
                const validVariants = productVariants.filter((v) => v.size.trim().length > 0);
                const finalSizes = validVariants.length > 0 ? validVariants : [
                  { size: 'Standard', price: formPrice || 18, volume: 'Standard Pack' },
                ];
                const baseSellingPrice = finalSizes[0]?.price || formPrice || 18;
                const baseOriginalPrice = formOriginalPrice > baseSellingPrice ? formOriginalPrice : Math.round(baseSellingPrice * 1.3);

                if (editingProduct) {
                  onUpdateProduct({
                    ...editingProduct,
                    name,
                    category: editingProduct.category || 'All Dry Fruits',
                    subtitle: subtitle || editingProduct.subtitle,
                    price: baseSellingPrice,
                    originalPrice: baseOriginalPrice,
                    images: finalImages,
                    description,
                    inStock: editingProduct.inStock ?? true,
                    stock: editingProduct.stock ?? 50,
                    sizes: finalSizes,
                    isNew: isNewProduct,
                    isBestSeller: isBestSellerProduct,
                  });
                  setEditingProduct(null);
                  setProductImages([]);
                } else {
                  const newProd: Product = {
                    id: `df-${Date.now()}`,
                    name,
                    category: 'All Dry Fruits',
                    subtitle: subtitle || 'Fresh Harvest • Premium Quality',
                    price: baseSellingPrice,
                    originalPrice: baseOriginalPrice,
                    rating: 4.9,
                    reviewCount: 120,
                    inStock: true,
                    stock: 50,
                    images: finalImages,
                    sizes: finalSizes,
                    isNew: isNewProduct,
                    isBestSeller: isBestSellerProduct,
                    description: description || 'Handpicked organic dry fruits harvested from certified growers.',
                    ingredients: [`100% Pure ${name}`],
                    benefits: ['Rich in dietary fiber and essential vitamins', 'Natural energy without refined sugars'],
                    howToUse: 'Enjoy as a daily nutritious snack or blend into morning smoothies and desserts.',
                    store: {
                      name: 'Kutch Traditional',
                      isOfficial: true,
                      followers: '154.2k',
                    },
                  };
                  onAddProduct(newProd);
                  setIsAddProductOpen(false);
                  setProductImages([]);
                }
              }}
              className="space-y-3.5"
            >
              {/* 1. PRODUCT GALLERY IMAGES MANAGER */}
              <div>
                <label className="text-[11px] font-bold text-[#6B7B65] block mb-1.5 flex items-center justify-between">
                  <span>Product Gallery Images ({productImages.length})</span>
                  <span className="text-[10px] text-[#FF5722]">Upload multiple angles</span>
                </label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {productImages.map((imgUrl, imgIdx) => (
                    <div key={imgIdx} className="relative w-16 h-16 rounded-xl border border-[#D5DFCC] overflow-hidden bg-[#F4F8EE] group shadow-xs">
                      <img src={imgUrl} alt={`Gallery ${imgIdx}`} className="w-full h-full object-cover" />
                      {productImages.length > 1 && (
                        <button
                          type="button"
                          onClick={() => setProductImages(productImages.filter((_, i) => i !== imgIdx))}
                          className="absolute top-1 right-1 w-5 h-5 rounded-full bg-red-600 text-white flex items-center justify-center text-[10px] opacity-90 hover:opacity-100 cursor-pointer shadow-xs"
                          title="Remove image"
                        >
                          ✕
                        </button>
                      )}
                    </div>
                  ))}
                </div>
                <ImgBBUploader
                  onImageUploaded={(url) => {
                    if (url && !productImages.includes(url)) {
                      setProductImages([...productImages, url]);
                    }
                  }}
                  label="Add Image to Product Gallery (ImgBB CDN)"
                  helperText="Upload multiple product photos. All uploaded photos are saved to product gallery."
                />
              </div>

              {/* 2. PRODUCT NAME */}
              <div>
                <label className="text-[11px] font-bold text-[#6B7B65] block mb-1">
                  Product Name
                </label>
                <input
                  name="name"
                  required
                  defaultValue={editingProduct?.name || ''}
                  placeholder="e.g. Royal Kashmiri Kesar Saffron / Mamra Almonds / Pure Shilajit"
                  className="w-full px-3 py-2 rounded-xl border border-[#DDE5D4] text-xs font-semibold focus:outline-none focus:border-[#FF5722]"
                />
              </div>

              {/* 3. DYNAMIC WEIGHT / QUANTITY PACK SIZES MANAGER */}
              <div className="p-3.5 rounded-2xl bg-[#F6FAF1] border border-[#DEE7D4] space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-xs font-bold text-[#1C2518] block">
                      Weight / Pack Sizes & Prices ({productVariants.length} Sizes)
                    </label>
                    <span className="text-[10px] text-[#697961]">
                      Add 1g, 2g, 5g, 10g or 250g, 500g, 1kg etc. Customers will choose weight on product page.
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={handleAddVariantRow}
                    className="px-2.5 py-1 rounded-lg bg-[#FF5722] text-white text-[11px] font-bold hover:bg-[#7CA235] cursor-pointer flex items-center gap-1 shadow-xs"
                  >
                    <Plus size={12} />
                    <span>Add Size</span>
                  </button>
                </div>

                {/* Quick 1-Click Presets */}
                <div>
                  <span className="text-[9.5px] font-bold text-[#55654E] block mb-1 uppercase tracking-wider">
                    ⚡ Quick Presets (Click to Auto-fill Sizes):
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {VARIANT_PRESETS.map((preset, pIdx) => (
                      <button
                        key={pIdx}
                        type="button"
                        onClick={() => setProductVariants(preset.variants)}
                        className="px-2 py-1 rounded-md bg-white border border-[#D5DFCC] text-[10px] font-bold text-[#3B6216] hover:bg-[#E9F3DC] transition-colors cursor-pointer"
                      >
                        {preset.name}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Variants List Table */}
                <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                  {productVariants.map((v, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-2 p-2 rounded-xl bg-white border border-[#E3E8DC] shadow-2xs"
                    >
                      <div className="w-5 text-center font-bold text-[10px] text-[#84967F]">
                        #{idx + 1}
                      </div>

                      {/* Size / Weight */}
                      <div className="w-24">
                        <label className="text-[9px] font-bold text-[#71826B] block">Weight/Size</label>
                        <input
                          type="text"
                          value={v.size}
                          onChange={(e) => handleUpdateVariant(idx, 'size', e.target.value)}
                          placeholder="e.g. 1g, 500g"
                          required
                          className="w-full px-2 py-1 rounded-lg border border-[#D8E2D0] text-xs font-bold text-[#1C2518] focus:outline-none focus:border-[#FF5722]"
                        />
                      </div>

                      {/* Price */}
                      <div className="w-20">
                        <label className="text-[9px] font-bold text-[#71826B] block">Price ($)</label>
                        <input
                          type="number"
                          value={v.price}
                          onChange={(e) => handleUpdateVariant(idx, 'price', e.target.value)}
                          min="0"
                          required
                          className="w-full px-2 py-1 rounded-lg border border-[#D8E2D0] text-xs font-bold text-[#1C2518] focus:outline-none focus:border-[#FF5722]"
                        />
                      </div>

                      {/* Packaging Note */}
                      <div className="flex-1 min-w-[70px]">
                        <label className="text-[9px] font-bold text-[#71826B] block">Packaging/Type</label>
                        <input
                          type="text"
                          value={v.volume}
                          onChange={(e) => handleUpdateVariant(idx, 'volume', e.target.value)}
                          placeholder="e.g. Glass Vial, Jar"
                          className="w-full px-2 py-1 rounded-lg border border-[#D8E2D0] text-xs font-medium text-[#1C2518] focus:outline-none focus:border-[#FF5722]"
                        />
                      </div>

                      {/* Remove Button */}
                      {productVariants.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveVariant(idx)}
                          className="w-7 h-7 mt-3 rounded-lg text-red-600 hover:bg-red-50 flex items-center justify-center cursor-pointer transition-colors"
                          title="Remove size"
                        >
                          <Trash2 size={13} />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* 4. BASE / DISPLAY PRICES */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[11px] font-bold text-[#6B7B65] block mb-1">
                    Base Display Price ($)
                  </label>
                  <input
                    type="number"
                    name="price"
                    value={productVariants[0]?.price || 18}
                    onChange={(e) => handleUpdateVariant(0, 'price', e.target.value)}
                    min="1"
                    className="w-full px-3 py-2 rounded-xl border border-[#DDE5D4] text-xs font-semibold focus:outline-none focus:border-[#FF5722] bg-[#F8FAF4]"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-[#6B7B65] block mb-1">
                    Original Price / MRP ($)
                  </label>
                  <input
                    type="number"
                    name="originalPrice"
                    defaultValue={editingProduct?.originalPrice || Math.round((productVariants[0]?.price || 18) * 1.3)}
                    min="1"
                    className="w-full px-3 py-2 rounded-xl border border-[#DDE5D4] text-xs font-semibold focus:outline-none focus:border-[#FF5722]"
                  />
                </div>
              </div>

              {/* 5. SUBTITLE */}
              <div>
                <label className="text-[11px] font-bold text-[#6B7B65] block mb-1">
                  Subtitle / Highlight
                </label>
                <input
                  name="subtitle"
                  defaultValue={editingProduct?.subtitle || ''}
                  placeholder="e.g. 100% Pure Kashmiri Grade A1 • Lab Tested"
                  className="w-full px-3 py-2 rounded-xl border border-[#DDE5D4] text-xs font-semibold focus:outline-none focus:border-[#FF5722]"
                />
              </div>

              {/* 6. DESCRIPTION */}
              <div>
                <label className="text-[11px] font-bold text-[#6B7B65] block mb-1">
                  Description
                </label>
                <textarea
                  name="description"
                  rows={3}
                  defaultValue={editingProduct?.description || ''}
                  placeholder="Enter details on origin, grade, aroma, health benefits and storage..."
                  className="w-full px-3 py-2 rounded-xl border border-[#DDE5D4] text-xs font-semibold focus:outline-none focus:border-[#FF5722]"
                />
              </div>

              {/* 7. HOMEPAGE SECTIONS & BADGES (New Arrival & Bestseller) */}
              <div className="grid grid-cols-2 gap-2.5 p-3 rounded-2xl bg-[#F6FAF1] border border-[#DEE7D4]">
                <label className="flex items-center gap-2.5 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={isNewProduct}
                    onChange={(e) => setIsNewProduct(e.target.checked)}
                    className="accent-[#0284C7] w-4 h-4 rounded cursor-pointer"
                  />
                  <div>
                    <span className="text-xs font-bold text-[#1C2518] flex items-center gap-1">
                      ✨ New Arrival
                    </span>
                    <span className="text-[9.5px] text-[#64748B] block">
                      Show in Home &apos;New Arrival&apos;
                    </span>
                  </div>
                </label>

                <label className="flex items-center gap-2.5 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={isBestSellerProduct}
                    onChange={(e) => setIsBestSellerProduct(e.target.checked)}
                    className="accent-[#FF5722] w-4 h-4 rounded cursor-pointer"
                  />
                  <div>
                    <span className="text-xs font-bold text-[#1C2518] flex items-center gap-1">
                      🔥 Bestseller
                    </span>
                    <span className="text-[9.5px] text-[#697A62] block">
                      Show Bestseller Badge
                    </span>
                  </div>
                </label>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-[#FF5722] text-white font-bold text-xs hover:bg-[#7DA535] cursor-pointer shadow-xs"
                >
                  {editingProduct ? 'Save Product Changes' : 'Create Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 14. MODAL: ADD CATEGORY */}
      {isAddCategoryOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => setIsAddCategoryOpen(false)}
        >
          <div
            className="w-full max-w-sm bg-white rounded-3xl p-5 shadow-2xl border border-[#E3E8DC] animate-in zoom-in-95 duration-200 space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-[#EEF2E6]">
              <h3 className="text-xs font-bold text-[#1C2518]">Add Dry Fruit Category</h3>
              <button
                onClick={() => setIsAddCategoryOpen(false)}
                className="w-7 h-7 rounded-full bg-[#F2F5ED] flex items-center justify-center text-[#55634E]"
              >
                <X size={15} />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                const form = e.currentTarget;
                const name = (form.elements.namedItem('name') as HTMLInputElement)?.value || '';
                const description = (form.elements.namedItem('description') as HTMLTextAreaElement)?.value || '';
                const imageInput = (form.elements.namedItem('image') as HTMLInputElement)?.value || '';
                const finalImage = categoryUploadedImage || imageInput || 'https://images.unsplash.com/photo-1508061253366-f7da158b6d46?auto=format&fit=crop&w=400&q=80';

                if (name) {
                  onAddCategory({
                    id: `cat-${Date.now()}`,
                    name,
                    image: finalImage,
                    count: 0,
                    description,
                  });
                  setIsAddCategoryOpen(false);
                  setCategoryUploadedImage('');
                }
              }}
              className="space-y-3"
            >
              <div>
                <label className="text-[11px] font-bold text-[#6B7B65] block mb-1">
                  Category Name
                </label>
                <input
                  name="name"
                  placeholder="e.g. Raisins (Kishmish)"
                  className="w-full px-3 py-2 rounded-xl border border-[#DDE5D4] text-xs font-semibold focus:outline-none focus:border-[#FF5722]"
                  required
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-[#6B7B65] block mb-1">
                  Description
                </label>
                <textarea
                  name="description"
                  placeholder="Short summary of this category..."
                  className="w-full px-3 py-2 rounded-xl border border-[#DDE5D4] text-xs font-semibold focus:outline-none focus:border-[#FF5722] min-h-[60px]"
                />
              </div>

              {/* IMGBB CATEGORY IMAGE UPLOADER */}
              <ImgBBUploader
                currentImageUrl={categoryUploadedImage}
                onImageUploaded={(url) => setCategoryUploadedImage(url)}
                label="Category Cover Photo (ImgBB)"
                helperText="Upload to ImgBB CDN and save URL in Firebase."
              />

              <input
                type="hidden"
                name="image"
                value={categoryUploadedImage || ''}
              />

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-[#FF5722] text-white font-bold text-xs hover:bg-[#7DA535] cursor-pointer"
                >
                  Create Category
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 15. MODAL: ADD / EDIT SLIDE */}
      {(isAddSlideOpen || editingSlide) && (
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => {
            setIsAddSlideOpen(false);
            setEditingSlide(null);
          }}
        >
          <div
            className="w-full max-w-sm bg-white rounded-3xl p-5 shadow-2xl border border-[#E3E8DC] animate-in zoom-in-95 duration-200 space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-[#EEF2E6]">
              <h3 className="text-xs font-bold text-[#1C2518]">
                {editingSlide ? 'Edit Hero Banner Slide' : 'Add Hero Banner Slide'}
              </h3>
              <button
                onClick={() => {
                  setIsAddSlideOpen(false);
                  setEditingSlide(null);
                }}
                className="w-7 h-7 rounded-full bg-[#F2F5ED] flex items-center justify-center text-[#55634E]"
              >
                <X size={15} />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                const form = e.currentTarget;
                const tag = (form.elements.namedItem('tag') as HTMLInputElement)?.value || '';
                const line1 = (form.elements.namedItem('line1') as HTMLInputElement)?.value || '';
                const line2 = (form.elements.namedItem('line2') as HTMLInputElement)?.value || '';
                const code = (form.elements.namedItem('code') as HTMLInputElement)?.value || '';
                const tagBgColor = (form.elements.namedItem('tagBgColor') as HTMLInputElement)?.value || '#12170F';
                const finalImage = slideUploadedImage || editingSlide?.imageSrc || 'https://images.unsplash.com/photo-1508061253366-f7da158b6d46?auto=format&fit=crop&w=900&q=80';

                if (editingSlide) {
                  onUpdateSlide({
                    ...editingSlide,
                    tag,
                    titleLine1: line1,
                    titleLine2: line2,
                    code,
                    imageSrc: finalImage,
                    tagBgColor,
                  });
                  setEditingSlide(null);
                  setSlideUploadedImage('');
                } else {
                  onAddSlide({
                    id: Date.now(),
                    tag: tag || 'Special Offer',
                    titleLine1: line1,
                    titleLine2: line2,
                    buttonText: 'Shop Now',
                    code: code || 'DRYFRUIT20',
                    bgGradient: 'from-[#A6D546] via-[#9DC941] to-[#88B835]',
                    imageSrc: finalImage,
                    tagBgColor,
                  });
                  setIsAddSlideOpen(false);
                  setSlideUploadedImage('');
                }
              }}
              className="space-y-3"
            >
               <div>
                <label className="text-[11px] font-bold text-[#6B7B65] block mb-1">
                  Tag Badge Text
                </label>
                <input
                  name="tag"
                  defaultValue={editingSlide?.tag || 'Harvest Special'}
                  className="w-full px-3 py-2 rounded-xl border border-[#DDE5D4] text-xs font-semibold focus:outline-none focus:border-[#FF5722]"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-[#6B7B65] block mb-1">
                  Tag Badge Background Color (Default: Black #12170F)
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    name="tagBgColor"
                    defaultValue={editingSlide?.tagBgColor || '#12170F'}
                    className="w-10 h-9 rounded-xl border border-[#DDE5D4] p-1 cursor-pointer bg-white"
                  />
                  <span className="text-[11px] text-[#6B7B65]">Choose tag pill color</span>
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold text-[#6B7B65] block mb-1">
                  Title Line 1
                </label>
                <input
                  name="line1"
                  defaultValue={editingSlide?.titleLine1 || ''}
                  placeholder="e.g. Kashmiri Mamra"
                  className="w-full px-3 py-2 rounded-xl border border-[#DDE5D4] text-xs font-semibold focus:outline-none focus:border-[#FF5722]"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-[#6B7B65] block mb-1">
                  Title Line 2
                </label>
                <input
                  name="line2"
                  defaultValue={editingSlide?.titleLine2 || ''}
                  placeholder="e.g. & King Cashews 20% Off"
                  className="w-full px-3 py-2 rounded-xl border border-[#DDE5D4] text-xs font-semibold focus:outline-none focus:border-[#FF5722]"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-[#6B7B65] block mb-1">
                  Coupon Code
                </label>
                <input
                  name="code"
                  defaultValue={editingSlide?.code || 'FIRSTPURCHASE'}
                  className="w-full px-3 py-2 rounded-xl border border-[#DDE5D4] text-xs font-semibold focus:outline-none focus:border-[#FF5722]"
                />
              </div>

              {/* IMGBB SLIDE IMAGE UPLOADER */}
              <ImgBBUploader
                currentImageUrl={slideUploadedImage || editingSlide?.imageSrc}
                onImageUploaded={(url) => setSlideUploadedImage(url)}
                label="Banner Photo (ImgBB CDN)"
                helperText="Upload banner photo or provide direct URL. Auto-compressed & stored in Firebase."
              />

              <input
                type="hidden"
                name="image"
                value={slideUploadedImage || editingSlide?.imageSrc || ''}
              />

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-[#FF5722] text-white font-bold text-xs hover:bg-[#7DA535] cursor-pointer"
                >
                  {editingSlide ? 'Save Slide' : 'Add Banner Slide'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 16. MODAL: CREATE NEW COUPON */}
      {isAddCouponOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => setIsAddCouponOpen(false)}
        >
          <div
            className="w-full max-w-sm bg-white rounded-3xl p-5 shadow-2xl border border-[#E3E8DC] animate-in zoom-in-95 duration-200 space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-[#EEF2E6]">
              <h3 className="text-xs font-bold text-[#1C2518]">Create Discount Promo Coupon</h3>
              <button
                onClick={() => setIsAddCouponOpen(false)}
                className="w-7 h-7 rounded-full bg-[#F2F5ED] flex items-center justify-center text-[#55634E]"
              >
                <X size={15} />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                const form = e.currentTarget;
                const code = ((form.elements.namedItem('code') as HTMLInputElement)?.value || '').toUpperCase();
                const discount = Number((form.elements.namedItem('discount') as HTMLInputElement)?.value || 0);
                const minOrder = Number((form.elements.namedItem('minOrder') as HTMLInputElement)?.value) || 20;
                const description = (form.elements.namedItem('description') as HTMLInputElement)?.value || '';

                if (code) {
                  setCoupons((prev) => [
                    ...prev,
                    {
                      id: `cpn-${Date.now()}`,
                      code,
                      discountPercent: discount,
                      description: description || `${discount}% off on dry fruit orders`,
                      minOrder,
                      expiry: 'Dec 31, 2026',
                      isActive: true,
                      usageCount: 0,
                    },
                  ]);
                  setIsAddCouponOpen(false);
                }
              }}
              className="space-y-3"
            >
              <div>
                <label className="text-[11px] font-bold text-[#6B7B65] block mb-1">
                  Coupon Code (uppercase)
                </label>
                <input
                  name="code"
                  required
                  placeholder="e.g. KASHMIR25"
                  className="w-full px-3 py-2 rounded-xl border border-[#DDE5D4] text-xs font-mono font-bold focus:outline-none focus:border-[#FF5722]"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[11px] font-bold text-[#6B7B65] block mb-1">
                    Discount (%)
                  </label>
                  <input
                    type="number"
                    name="discount"
                    defaultValue={15}
                    required
                    min="1"
                    max="90"
                    className="w-full px-3 py-2 rounded-xl border border-[#DDE5D4] text-xs font-semibold focus:outline-none focus:border-[#FF5722]"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-[#6B7B65] block mb-1">
                    Min Order ($)
                  </label>
                  <input
                    type="number"
                    name="minOrder"
                    defaultValue={30}
                    required
                    min="0"
                    className="w-full px-3 py-2 rounded-xl border border-[#DDE5D4] text-xs font-semibold focus:outline-none focus:border-[#FF5722]"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold text-[#6B7B65] block mb-1">
                  Description
                </label>
                <input
                  name="description"
                  placeholder="e.g. Festive seasonal discount"
                  className="w-full px-3 py-2 rounded-xl border border-[#DDE5D4] text-xs font-semibold focus:outline-none focus:border-[#FF5722]"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-[#FF5722] text-white font-bold text-xs hover:bg-[#7DA535] cursor-pointer"
                >
                  Activate Coupon
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      </div>

      {/* 17. FLOATING DEDICATED ADMIN BOTTOM NAVIGATION BAR */}
      <AdminBottomNav
        activeTab={activeTab as AdminTab}
        onChangeTab={(tab) => {
          if (tab === 'storeview') {
            setActiveTab('storeview');
          } else {
            setActiveTab(tab);
          }
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        ordersCount={orders.length}
        productsCount={products.length}
      />
    </div>
  );
};
