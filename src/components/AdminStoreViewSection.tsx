import React, { useState } from 'react';
import {
  Smartphone,
  Laptop,
  Edit2,
  Eye,
  Plus,
  Trash2,
  ExternalLink,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Check,
  X,
  Package,
  Layers,
  Image as ImageIcon,
  Tag,
  AlertTriangle,
  RotateCcw,
  Leaf,
} from 'lucide-react';
import { Product, CategoryItem, BannerSlide } from '../types';

interface AdminStoreViewSectionProps {
  products: Product[];
  categories: CategoryItem[];
  slides: BannerSlide[];
  announcementText: string;
  onUpdateAnnouncement: (text: string) => void;
  onAddProduct: () => void;
  onEditProduct: (p: Product) => void;
  onDeleteProduct: (id: string) => void;
  onToggleProductStock: (p: Product) => void;
  onAddCategory: () => void;
  onDeleteCategory: (id: string) => void;
  onAddSlide: () => void;
  onEditSlide: (s: BannerSlide) => void;
  onDeleteSlide: (id: number) => void;
  onExitAdmin: () => void;
}

export const AdminStoreViewSection: React.FC<AdminStoreViewSectionProps> = ({
  products,
  categories,
  slides,
  announcementText,
  onUpdateAnnouncement,
  onAddProduct,
  onEditProduct,
  onDeleteProduct,
  onToggleProductStock,
  onAddCategory,
  onDeleteCategory,
  onAddSlide,
  onEditSlide,
  onDeleteSlide,
  onExitAdmin,
}) => {
  const [device, setDevice] = useState<'mobile' | 'desktop'>('mobile');
  const [storeMode, setStoreMode] = useState<'edit' | 'simulate'>('edit');
  const [currentSlideIdx, setCurrentSlideIdx] = useState(0);

  // In-place Quick Announcement Editor
  const [isEditingNotice, setIsEditingNotice] = useState(false);
  const [tempNotice, setTempNotice] = useState(announcementText);

  // Simulated Detail Modal in Customer Mode
  const [simulatedProduct, setSimulatedProduct] = useState<Product | null>(null);
  const [simulatedSize, setSimulatedSize] = useState('250g');
  const [simulatedQty, setSimulatedQty] = useState(1);
  const [simulatedBagSuccess, setSimulatedBagSuccess] = useState(false);

  const safeSlides = slides.length > 0 ? slides : [];
  const activeSlide = safeSlides[currentSlideIdx % (safeSlides.length || 1)] || safeSlides[0];

  const handleSaveNotice = () => {
    onUpdateAnnouncement(tempNotice);
    setIsEditingNotice(false);
  };

  const handleSimulateAddBag = () => {
    setSimulatedBagSuccess(true);
    setTimeout(() => setSimulatedBagSuccess(false), 2000);
  };

  return (
    <div className="space-y-4 animate-in fade-in duration-300">
      {/* 1. Control Toolbar */}
      <div className="p-4 rounded-3xl bg-white border border-[#E3E8DC] shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-xs font-black uppercase tracking-wider text-[#697961]">
              Live Storefront Visual Studio
            </h3>
            <span className="px-2 py-0.5 rounded-full bg-[#EBF5DC] text-[#3D6816] text-[10px] font-black uppercase">
              WYSIWYG Mode
            </span>
          </div>
          <p className="text-[11px] text-[#788872]">
            {storeMode === 'edit'
              ? 'Click directly on any banner, category or product card to edit it live'
              : 'Interactive customer shopping simulation mode'}
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {/* Mode Switcher */}
          <div className="bg-[#F0F4EA] p-1 rounded-2xl flex items-center gap-1 border border-[#DEE5D6]">
            <button
              onClick={() => setStoreMode('edit')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-all ${
                storeMode === 'edit'
                  ? 'bg-[#FF5722] text-white shadow-2xs'
                  : 'text-[#4D6045] hover:text-[#182313]'
              }`}
            >
              <Edit2 size={13} />
              <span>In-Place Edit Mode</span>
            </button>
            <button
              onClick={() => setStoreMode('simulate')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-all ${
                storeMode === 'simulate'
                  ? 'bg-[#FF5722] text-white shadow-2xs'
                  : 'text-[#4D6045] hover:text-[#182313]'
              }`}
            >
              <Eye size={13} />
              <span>Customer Simulation</span>
            </button>
          </div>

          {/* Device Switcher */}
          <div className="bg-[#F0F4EA] p-1 rounded-2xl flex items-center gap-1 border border-[#DEE5D6]">
            <button
              onClick={() => setDevice('mobile')}
              className={`px-2.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1 cursor-pointer transition-all ${
                device === 'mobile'
                  ? 'bg-white text-[#182313] shadow-xs'
                  : 'text-[#506248]'
              }`}
              title="Mobile Smartphone View"
            >
              <Smartphone size={14} />
              <span className="hidden sm:inline">Mobile</span>
            </button>
            <button
              onClick={() => setDevice('desktop')}
              className={`px-2.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1 cursor-pointer transition-all ${
                device === 'desktop'
                  ? 'bg-white text-[#182313] shadow-xs'
                  : 'text-[#506248]'
              }`}
              title="Desktop View"
            >
              <Laptop size={14} />
              <span className="hidden sm:inline">Desktop</span>
            </button>
          </div>

          {/* Open Real Fullscreen Store */}
          <button
            onClick={onExitAdmin}
            className="px-3.5 py-2 rounded-xl bg-[#192215] text-white text-xs font-bold flex items-center gap-1.5 hover:bg-[#2B3B23] cursor-pointer shadow-xs active:scale-95"
          >
            <ExternalLink size={13} />
            <span>Open Real Store</span>
          </button>
        </div>
      </div>

      {/* 2. Visual Frame Container */}
      <div className="flex justify-center p-2 sm:p-4 bg-[#EAF0E4] rounded-3xl border border-[#D5E1CD]">
        <div
          className={`w-full bg-[#F8FAF6] rounded-[36px] border-4 border-[#182215] shadow-2xl overflow-hidden transition-all duration-300 relative ${
            device === 'mobile'
              ? 'max-w-[410px] min-h-[680px]'
              : 'max-w-4xl min-h-[720px]'
          }`}
        >
          {/* Smartphone Speaker notch if in mobile mode */}
          {device === 'mobile' && (
            <div className="w-full flex justify-center pt-2 pb-1 bg-white">
              <div className="w-24 h-4 bg-[#182215] rounded-full flex items-center justify-center">
                <div className="w-2.5 h-2.5 rounded-full bg-[#2A3723] mr-2" />
                <div className="w-8 h-1 bg-[#2A3723] rounded-full" />
              </div>
            </div>
          )}

          {/* A. EDITABLE ANNOUNCEMENT NOTICE BAR */}
          <div className="bg-[#182215] text-[#DCE6D7] px-3 py-1.5 text-[11px] font-semibold flex items-center justify-between gap-2 relative group">
            {isEditingNotice ? (
              <div className="flex items-center gap-1.5 w-full">
                <input
                  type="text"
                  value={tempNotice}
                  onChange={(e) => setTempNotice(e.target.value)}
                  className="flex-1 px-2 py-0.5 rounded bg-white text-[#182215] text-xs font-medium focus:outline-none"
                />
                <button
                  onClick={handleSaveNotice}
                  className="px-2 py-0.5 rounded bg-[#FF5722] text-white font-bold text-[10px] hover:bg-[#7CA235]"
                >
                  Save
                </button>
                <button
                  onClick={() => setIsEditingNotice(false)}
                  className="px-1.5 py-0.5 rounded bg-white/20 text-white text-[10px]"
                >
                  ✕
                </button>
              </div>
            ) : (
              <>
                <span className="truncate flex-1">{announcementText}</span>
                {storeMode === 'edit' && (
                  <button
                    onClick={() => {
                      setTempNotice(announcementText);
                      setIsEditingNotice(true);
                    }}
                    className="px-2 py-0.5 rounded-md bg-[#FF5722] text-white text-[9px] font-bold shrink-0 hover:bg-[#7CA235] cursor-pointer"
                  >
                    ✏️ Edit Notice
                  </button>
                )}
              </>
            )}
          </div>

          {/* B. STORE HEADER MOCKUP */}
          <div className="p-3 bg-white border-b border-[#E3E8DC] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-[#FF5722] flex items-center justify-center text-white">
                <Leaf size={13} strokeWidth={2.4} />
              </div>
              <span className="text-xs font-black text-[#1C2518]">
                Kutch<span className="text-[#FF5722]"> Traditional</span>
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold text-[#FF5722] bg-[#F2F7EC] px-2 py-0.5 rounded-full">
                {storeMode === 'edit' ? '✏️ Edit Active' : '👁️ Live Customer Mode'}
              </span>
            </div>
          </div>

          {/* C. STORE BODY CONTENT */}
          <div className="p-3 sm:p-4 space-y-4 overflow-y-auto max-h-[700px]">
            {/* 1. EDITABLE HERO BANNER */}
            {activeSlide && (
              <div className="relative group">
                <div
                  className={`p-4 rounded-3xl bg-gradient-to-br ${activeSlide.bgGradient} text-[#182313] flex items-center justify-between shadow-xs border border-white/40`}
                >
                  <div className="max-w-[65%] space-y-1">
                    <span className="px-2 py-0.5 rounded-full bg-white/80 text-[9px] font-black uppercase">
                      {activeSlide.tag}
                    </span>
                    <h4 className="text-sm font-black leading-tight">
                      {activeSlide.titleLine1}
                      <br />
                      {activeSlide.titleLine2}
                    </h4>
                    <span className="text-[10px] font-mono font-bold block pt-1">
                      Code: {activeSlide.code}
                    </span>
                  </div>
                  <img
                    src={activeSlide.imageSrc}
                    alt="Hero Slide"
                    className="w-20 h-20 rounded-2xl object-cover border border-white/50 shadow-md shrink-0"
                  />
                </div>

                {/* Edit Controls for Slider */}
                {storeMode === 'edit' && (
                  <div className="absolute top-2 right-2 flex items-center gap-1 bg-[#182215]/85 backdrop-blur-xs p-1 rounded-xl shadow-md">
                    <button
                      onClick={() =>
                        setCurrentSlideIdx((prev) =>
                          prev === 0 ? safeSlides.length - 1 : prev - 1,
                        )
                      }
                      className="p-1 rounded text-white hover:bg-white/20 cursor-pointer"
                      title="Previous slide"
                    >
                      <ChevronLeft size={13} />
                    </button>
                    <button
                      onClick={() => onEditSlide(activeSlide)}
                      className="px-2 py-0.5 rounded bg-[#FF5722] text-white text-[10px] font-bold hover:bg-[#7CA235] cursor-pointer flex items-center gap-1"
                    >
                      <Edit2 size={10} />
                      <span>Edit Slide</span>
                    </button>
                    <button
                      onClick={onAddSlide}
                      className="p-1 rounded text-white hover:bg-white/20 cursor-pointer"
                      title="Add new slide"
                    >
                      <Plus size={13} />
                    </button>
                    <button
                      onClick={() =>
                        setCurrentSlideIdx((prev) => (prev + 1) % safeSlides.length)
                      }
                      className="p-1 rounded text-white hover:bg-white/20 cursor-pointer"
                      title="Next slide"
                    >
                      <ChevronRight size={13} />
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* 2. EDITABLE CATEGORIES ROW */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase tracking-wider text-[#697961]">
                  Categories ({categories.length})
                </span>
                {storeMode === 'edit' && (
                  <button
                    onClick={onAddCategory}
                    className="text-[10px] font-bold text-[#FF5722] hover:underline flex items-center gap-0.5 cursor-pointer"
                  >
                    <Plus size={12} />
                    <span>Add Category</span>
                  </button>
                )}
              </div>

              <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
                {categories.map((c) => (
                  <div
                    key={c.id}
                    className="relative group shrink-0 flex items-center gap-1.5 pl-2.5 pr-2 py-1 rounded-xl bg-white border border-[#DEE5D6] shadow-2xs hover:border-[#FF5722]"
                  >
                    <span className="text-[11px] font-bold text-[#232C1F]">
                      {c.name}
                    </span>
                    <img
                      src={c.image}
                      alt={c.name}
                      className="w-5 h-5 rounded-md object-cover"
                    />

                    {storeMode === 'edit' && categories.length > 1 && (
                      <button
                        onClick={() => {
                          if (confirm(`Delete category "${c.name}"?`)) {
                            onDeleteCategory(c.id);
                          }
                        }}
                        className="w-3.5 h-3.5 rounded-full bg-[#FCE8E8] text-[#E5484D] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity ml-1 cursor-pointer"
                        title="Delete category"
                      >
                        ✕
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* 3. EDITABLE PRODUCTS SHELF */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase tracking-wider text-[#697961]">
                  Products on Shelf ({products.length})
                </span>
                {storeMode === 'edit' && (
                  <button
                    onClick={onAddProduct}
                    className="text-[10px] font-bold text-[#FF5722] hover:underline flex items-center gap-0.5 cursor-pointer"
                  >
                    <Plus size={12} />
                    <span>Add Product SKU</span>
                  </button>
                )}
              </div>

              <div
                className={`grid gap-2.5 ${
                  device === 'mobile' ? 'grid-cols-2' : 'grid-cols-3'
                }`}
              >
                {products.map((p) => {
                  const isOut = p.inStock === false || (p.stock !== undefined && p.stock <= 0);

                  return (
                    <div
                      key={p.id}
                      onClick={() => {
                        if (storeMode === 'simulate') {
                          setSimulatedProduct(p);
                          setSimulatedSize(p.sizes[0]?.size || '250g');
                          setSimulatedQty(1);
                        } else {
                          onEditProduct(p);
                        }
                      }}
                      className="relative group p-2.5 rounded-2xl bg-white border border-[#E3E8DC] shadow-2xs hover:border-[#FF5722] transition-all cursor-pointer flex flex-col justify-between"
                    >
                      {/* Product Thumbnail */}
                      <div className="relative aspect-square w-full rounded-xl overflow-hidden bg-[#F2F5ED] mb-2">
                        <img
                          src={p.images[0]}
                          alt={p.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        />
                        {/* Out of Stock Overlay */}
                        {isOut && (
                          <div className="absolute inset-0 bg-black/60 backdrop-blur-2xs flex items-center justify-center">
                            <span className="px-2 py-0.5 rounded-md bg-[#E5484D] text-white text-[9px] font-black uppercase">
                              Out of Stock
                            </span>
                          </div>
                        )}

                        {/* Edit Mode Buttons Overlay on Image */}
                        {storeMode === 'edit' && (
                          <div className="absolute inset-0 bg-black/35 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1.5 p-2">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                onEditProduct(p);
                              }}
                              className="p-1.5 rounded-lg bg-white text-[#182313] hover:bg-[#FF5722] hover:text-white transition-colors cursor-pointer"
                              title="Edit product"
                            >
                              <Edit2 size={12} />
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                onToggleProductStock(p);
                              }}
                              className={`p-1.5 rounded-lg text-white font-bold text-[9px] transition-colors cursor-pointer ${
                                isOut ? 'bg-[#517621]' : 'bg-[#E5484D]'
                              }`}
                              title={isOut ? 'Mark In Stock' : 'Mark Out of Stock'}
                            >
                              {isOut ? 'Restock' : 'Out'}
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                if (confirm(`Delete "${p.name}"?`)) onDeleteProduct(p.id);
                              }}
                              className="p-1.5 rounded-lg bg-[#FCEAEA] text-[#A63A3A] hover:bg-[#E5484D] hover:text-white transition-colors cursor-pointer"
                              title="Delete product"
                            >
                              <Trash2 size={12} />
                            </button>
                          </div>
                        )}
                      </div>

                      {/* Info */}
                      <div>
                        <span className="text-[9px] uppercase font-bold text-[#7F8F79] block truncate">
                          {p.category}
                        </span>
                        <h5 className="text-[11px] font-extrabold text-[#1C2518] truncate">
                          {p.name}
                        </h5>
                        <div className="flex items-center justify-between mt-1">
                          <span className="text-xs font-black text-[#1C2518]">
                            ${p.price}
                          </span>
                          <span
                            className={`text-[9px] font-bold px-1.5 py-0.2 rounded ${
                              isOut
                                ? 'bg-[#FCEAEA] text-[#A63A3A]'
                                : 'bg-[#EBF5DC] text-[#3E6816]'
                            }`}
                          >
                            {isOut ? 'Sold out' : 'In stock'}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}

                {/* + Add New Product Card slot in Edit Mode */}
                {storeMode === 'edit' && (
                  <button
                    onClick={onAddProduct}
                    className="aspect-square rounded-2xl border-2 border-dashed border-[#C3D2B8] hover:border-[#FF5722] bg-[#F4F8EE]/60 hover:bg-[#EAF3DE] flex flex-col items-center justify-center gap-1.5 transition-all cursor-pointer p-3 text-center"
                  >
                    <div className="w-8 h-8 rounded-full bg-[#FF5722] text-white flex items-center justify-center shadow-xs">
                      <Plus size={16} />
                    </div>
                    <span className="text-[11px] font-extrabold text-[#1C2518]">
                      + Add Product
                    </span>
                    <span className="text-[9px] text-[#71806C]">
                      New Kutch Craft SKU
                    </span>
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* D. SIMULATED PRODUCT DETAIL POPUP (Inside device frame for Customer Mode) */}
          {simulatedProduct && (
            <div className="absolute inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-end animate-in fade-in duration-200">
              <div className="w-full bg-[#F8FAF6] rounded-t-3xl p-4 space-y-3.5 border-t border-white/20 shadow-2xl max-h-[85%] overflow-y-auto">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#7A8A73]">
                    Customer Preview Mode
                  </span>
                  <button
                    onClick={() => setSimulatedProduct(null)}
                    className="w-7 h-7 rounded-full bg-white border border-[#DEE5D6] flex items-center justify-center text-xs font-bold"
                  >
                    ✕
                  </button>
                </div>

                <div className="flex items-center gap-3">
                  <img
                    src={simulatedProduct.images[0]}
                    alt={simulatedProduct.name}
                    className="w-16 h-16 rounded-xl object-cover border border-[#DEE5D6]"
                  />
                  <div>
                    <h4 className="text-xs font-black text-[#1C2518]">
                      {simulatedProduct.name}
                    </h4>
                    <span className="text-[10px] text-[#71806C] block">
                      {simulatedProduct.category} • Base ${simulatedProduct.price}
                    </span>
                    <span className="text-xs font-black text-[#FF5722] mt-0.5 block">
                      ${simulatedProduct.price * simulatedQty} (Total)
                    </span>
                  </div>
                </div>

                {/* Weight selection preview */}
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-[#6D7D66] block">
                    Select Packaging Weight:
                  </span>
                  <div className="flex items-center gap-1.5">
                    {simulatedProduct.sizes.map((s) => (
                      <button
                        key={s.size}
                        onClick={() => setSimulatedSize(s.size)}
                        className={`px-2.5 py-1 rounded-lg text-[10px] font-bold cursor-pointer transition-all ${
                          simulatedSize === s.size
                            ? 'bg-[#FF5722] text-white shadow-2xs'
                            : 'bg-white border border-[#DEE5D6] text-[#475740]'
                        }`}
                      >
                        {s.size} (${s.price})
                      </button>
                    ))}
                  </div>
                </div>

                {/* Simulated Add to bag */}
                <div className="pt-2 flex items-center gap-2">
                  <button
                    onClick={handleSimulateAddBag}
                    className="flex-1 py-2.5 rounded-full bg-[#182215] text-white text-xs font-extrabold flex items-center justify-center gap-1.5 hover:bg-black transition-all cursor-pointer shadow-md"
                  >
                    {simulatedBagSuccess ? (
                      <>
                        <Check size={14} className="text-[#FF5722]" />
                        <span>Added to Test Bag!</span>
                      </>
                    ) : (
                      <>
                        <span>Test "Add to Bag"</span>
                      </>
                    )}
                  </button>
                  <button
                    onClick={() => {
                      const p = simulatedProduct;
                      setSimulatedProduct(null);
                      onEditProduct(p);
                    }}
                    className="px-3 py-2.5 rounded-full bg-[#FF5722] text-white text-xs font-bold hover:bg-[#7CA235] cursor-pointer"
                  >
                    ✏️ Edit
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
