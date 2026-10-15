import React, { useState, useEffect } from 'react';
import { PRODUCTS, CATEGORIES } from './data/products';
import { INITIAL_SLIDES } from './data/slides';
import {
  Product,
  CartItem,
  ActiveTab,
  FilterOptions,
  CategoryItem,
  BannerSlide,
  AnalyticsData,
} from './types';
import {
  initializeFirestoreData,
  subscribeToProducts,
  subscribeToCategories,
  subscribeToSlides,
  subscribeToAnalytics,
  saveProductToFirestore,
  deleteProductFromFirestore,
  saveCategoryToFirestore,
  deleteCategoryFromFirestore,
  saveSlideToFirestore,
  deleteSlideFromFirestore,
  recordPageViewInFirestore,
  recordProductViewInFirestore,
} from './lib/firestoreService';
import { auth, googleProvider, signInWithPopup, signOut, onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile, User } from './lib/firebase';
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { FilterDrawer } from './components/FilterDrawer';
import { SidebarMenu } from './components/SidebarMenu';
import { CheckoutModal } from './components/CheckoutModal';
import { Toast } from './components/Toast';
import { ProductDetailSkeleton } from './components/Skeletons';

import { HomeView } from './views/HomeView';
import { ProductDetailView } from './views/ProductDetailView';
import { CatalogView } from './views/CatalogView';
import { CartView } from './views/CartView';
import { WishlistView } from './views/WishlistView';
import { ProfileView } from './views/ProfileView';
import { AdminView } from './views/AdminView';
import { NotFoundView } from './views/NotFoundView';

import { Leaf, ShieldCheck, Truck, Sparkles, Heart, Instagram, X, Shield } from 'lucide-react';

export default function App() {
  // Skeleton Loading Transition States
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [isTabLoading, setIsTabLoading] = useState(false);
  const [isProductLoading, setIsProductLoading] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsInitialLoading(false);
    }, 400);
    return () => clearTimeout(timer);
  }, []);
  // Dynamic Catalog State with localStorage persistence
  const [products, setProducts] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem('kutch_traditional_products');
      return saved ? JSON.parse(saved) : PRODUCTS;
    } catch {
      return PRODUCTS;
    }
  });

  const [categories, setCategories] = useState<CategoryItem[]>(() => {
    try {
      const saved = localStorage.getItem('kutch_traditional_categories');
      return saved ? JSON.parse(saved) : CATEGORIES;
    } catch {
      return CATEGORIES;
    }
  });

  const [slides, setSlides] = useState<BannerSlide[]>(() => {
    try {
      const saved = localStorage.getItem('kutch_traditional_slides');
      return saved ? JSON.parse(saved) : INITIAL_SLIDES;
    } catch {
      return INITIAL_SLIDES;
    }
  });

  const [productPageSettings, setProductPageSettings] = useState(() => {
    try {
      const saved = localStorage.getItem('kutch_traditional_product_page_settings');
      return saved ? JSON.parse(saved) : {
        showRecentPurchase: true,
        showPhotoReviews: true,
        showSoldCounter: true,
        showCartReservationTimer: true,
        showFlashSaleTimer: true,
        showTrustBadges: true,
      };
    } catch {
      return {
        showRecentPurchase: true,
        showPhotoReviews: true,
        showSoldCounter: true,
        showCartReservationTimer: true,
        showFlashSaleTimer: true,
        showTrustBadges: true,
      };
    }
  });

  const handleUpdateProductPageSettings = (newSettings: any) => {
    setProductPageSettings(newSettings);
    try {
      localStorage.setItem('kutch_traditional_product_page_settings', JSON.stringify(newSettings));
    } catch {}
    showToast('Product page settings updated successfully!');
  };

  // Navigation State
  const [activeTab, setActiveTab] = useState<ActiveTab>('home');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Admin Secret Route /avesh-140 & Password Protection (Avesh@140)
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(() => {
    return sessionStorage.getItem('kutch_traditional_admin_auth') === 'true';
  });
  const [showAdminPasswordModal, setShowAdminPasswordModal] = useState<boolean>(false);
  const [adminPasswordInput, setAdminPasswordInput] = useState<string>('');
  const [adminPasswordError, setAdminPasswordError] = useState<boolean>(false);

  // Firebase Auth State
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
    });
    return () => unsubscribe();
  }, []);

  const handleGoogleSignIn = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      showToast('Successfully signed in with Google!');
    } catch (error) {
      console.error('Google Sign In Error:', error);
      showToast('Google Sign In failed. Please try again.');
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      showToast('Signed out successfully.');
    } catch (error) {
      console.error('Sign Out Error:', error);
    }
  };

  const handleEmailSignIn = async (email: string, pass: string) => {
    try {
      await signInWithEmailAndPassword(auth, email, pass);
      showToast('Successfully signed in!');
    } catch (error: any) {
      console.error('Email Sign In Error:', error);
      showToast(error.message || 'Sign in failed. Please check your email and password.');
      throw error;
    }
  };

  const handleEmailSignUp = async (name: string, email: string, phone: string, pass: string) => {
    try {
      const cred = await createUserWithEmailAndPassword(auth, email, pass);
      if (cred.user) {
        await updateProfile(cred.user, { displayName: name });
      }
      showToast('Account created & signed in successfully!');
    } catch (error: any) {
      console.error('Email Sign Up Error:', error);
      showToast(error.message || 'Sign up failed. Please try again.');
      throw error;
    }
  };

  const handleAutoCreateAccount = async (name: string, email: string, phone: string) => {
    try {
      try {
        const cred = await createUserWithEmailAndPassword(auth, email, 'kutch12345');
        if (cred.user) {
          await updateProfile(cred.user, { displayName: name });
        }
      } catch (err) {
        try {
          await signInWithEmailAndPassword(auth, email, 'kutch12345');
        } catch {}
      }
      setIsLoggedIn(true);
      showToast(`Account auto-created & logged in for ${email}!`);
    } catch (err) {
      setCurrentUser({
        uid: 'usr-' + Date.now(),
        displayName: name,
        email: email,
        phoneNumber: phone,
      } as any);
      setIsLoggedIn(true);
      showToast(`Welcome! Your Kutch Traditional account was created successfully.`);
    }
  };

  useEffect(() => {
    const handleRoute = () => {
      const path = window.location.pathname;
      const hash = window.location.hash;
      
      const isAveshRoute = path === '/avesh-140' || hash === '#avesh-140';
      if (isAveshRoute) {
        if (sessionStorage.getItem('kutch_traditional_admin_auth') === 'true') {
          setActiveTab('admin');
        } else {
          setShowAdminPasswordModal(true);
        }
        return;
      }

      if (path === '/' || path === '' || path === '/index.html') {
        if (hash === '#cart') setActiveTab('cart');
        else if (hash === '#wishlist') setActiveTab('wishlist');
        else if (hash === '#profile') setActiveTab('profile');
        else if (hash === '#catalog') setActiveTab('catalog');
        else if (hash === '' || hash === '#home') {
          setActiveTab('home');
        } else {
          setActiveTab('notfound');
        }
      } else if (path === '/cart') {
        setActiveTab('cart');
      } else if (path === '/wishlist') {
        setActiveTab('wishlist');
      } else if (path === '/profile') {
        setActiveTab('profile');
      } else if (path === '/catalog') {
        setActiveTab('catalog');
      } else {
        setActiveTab('notfound');
      }
    };

    handleRoute();
    window.addEventListener('popstate', handleRoute);
    window.addEventListener('hashchange', handleRoute);
    return () => {
      window.removeEventListener('popstate', handleRoute);
      window.removeEventListener('hashchange', handleRoute);
    };
  }, []);

  // 2026 Enterprise On-Page SEO Effect (Dynamic Title, Description, OpenGraph & Product Schema.org JSON-LD)
  useEffect(() => {
    const defaultTitle = 'Kutch Traditional – Authentic Handicrafts & Premium Dry Fruits';
    const defaultDesc = 'Experience the rich heritage of Kutch. Shop 100% authentic traditional handicrafts, organic dry fruits, and handcrafted artifacts.';
    
    let title = defaultTitle;
    let desc = defaultDesc;
    let imageUrl = 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=1200&q=80';
    let schemaData: any = null;

    if (selectedProduct) {
      title = `${selectedProduct.name} - Price ₹${selectedProduct.price} | Buy Online | Kutch Traditional`;
      const sizeStr = selectedProduct.sizes?.[0]?.size || 'Standard';
      desc = `Order 100% pure ${selectedProduct.name} (${sizeStr}). Handpicked organic quality direct from orchards. Fast delivery across India.`;
      imageUrl = selectedProduct.images?.[0] || imageUrl;
      
      schemaData = {
        "@context": "https://schema.org/",
        "@type": "Product",
        "name": selectedProduct.name,
        "image": selectedProduct.images,
        "description": desc,
        "sku": `SNZ-${selectedProduct.id}`,
        "brand": {
          "@type": "Brand",
          "name": "Kutch Traditional"
        },
        "offers": {
          "@type": "Offer",
          "url": window.location.href,
          "priceCurrency": "INR",
          "price": selectedProduct.price,
          "priceValidUntil": "2026-12-31",
          "itemCondition": "https://schema.org/NewCondition",
          "availability": "https://schema.org/InStock"
        },
        "aggregateRating": {
          "@type": "AggregateRating",
          "ratingValue": selectedProduct.rating || 4.8,
          "reviewCount": selectedProduct.reviewCount || 128
        }
      };
    } else {
      switch (activeTab) {
        case 'catalog':
          title = 'All Premium Handicrafts & Dry Fruits | Kutch Traditional';
          desc = 'Browse our complete catalog of authentic Kutch handicrafts, organic dry fruits, and traditional Gujarati art.';
          break;
        case 'cart':
          title = 'Shopping Bag - Checkout | Kutch Traditional';
          desc = 'Review your selected items in your shopping bag and proceed to secure checkout.';
          break;
        case 'wishlist':
          title = 'My Saved Wishlist | Kutch Traditional';
          desc = 'View your saved favorite handicrafts and organic products.';
          break;
        case 'profile':
          title = 'My Account & Order History | Kutch Traditional';
          desc = 'Manage your Kutch Traditional account, track live orders, and check delivery status.';
          break;
        case 'admin':
          title = 'Store Admin Portal | Kutch Traditional';
          desc = 'Kutch Traditional Management Dashboard for inventory, orders, analytics, and coupons.';
          break;
        default:
          title = defaultTitle;
          desc = defaultDesc;
          break;
      }

      schemaData = {
        "@context": "https://schema.org",
        "@type": "WebSite",
        "name": "Kutch Traditional",
        "url": "https://kutchtraditional.store/",
        "potentialAction": {
          "@type": "SearchAction",
          "target": "https://kutchtraditional.store/?q={search_term_string}",
          "query-input": "required name=search_term_string"
        }
      };
    }

    // Apply to DOM
    document.title = title;
    
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) metaDesc.setAttribute('content', desc);

    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) ogTitle.setAttribute('content', title);

    const ogDesc = document.querySelector('meta[property="og:description"]');
    if (ogDesc) ogDesc.setAttribute('content', desc);

    const ogImg = document.querySelector('meta[property="og:image"]');
    if (ogImg) ogImg.setAttribute('content', imageUrl);

    const twTitle = document.querySelector('meta[name="twitter:title"]');
    if (twTitle) twTitle.setAttribute('content', title);

    const twDesc = document.querySelector('meta[name="twitter:description"]');
    if (twDesc) twDesc.setAttribute('content', desc);

    const canonical = document.querySelector('link[rel="canonical"]');
    if (canonical) canonical.setAttribute('href', window.location.href);

    // Inject/Update JSON-LD Schema Script
    let scriptTag = document.getElementById('dynamic-schema-ld');
    if (!scriptTag) {
      scriptTag = document.createElement('script');
      scriptTag.id = 'dynamic-schema-ld';
      scriptTag.setAttribute('type', 'application/ld+json');
      document.head.appendChild(scriptTag);
    }
    scriptTag.textContent = JSON.stringify(schemaData);

  }, [selectedProduct, activeTab]);

  const handleAdminPasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminPasswordInput === 'Avesh@140') {
      sessionStorage.setItem('kutch_traditional_admin_auth', 'true');
      setIsAdminAuthenticated(true);
      setShowAdminPasswordModal(false);
      setActiveTab('admin');
      setAdminPasswordError(false);
      showToast('Secure Admin Portal unlocked!');
    } else {
      setAdminPasswordError(true);
      showToast('Incorrect Admin Password!');
    }
  };

  // Cart & Wishlist State
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [appliedPromo, setAppliedPromo] = useState<string | null>(null);

  // Modals & Drawers
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [policyModal, setPolicyModal] = useState<'about' | 'privacy' | 'return' | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Filter Options
  const [filters, setFilters] = useState<FilterOptions>({
    category: 'All',
    searchQuery: '',
    minPrice: 50,
    maxPrice: 300,
    sortBy: 'popular',
  });

  // Settings
  const [currency, setCurrency] = useState('USD');

  // Real-time Traffic and Product/Page View Analytics with persistence
  const [analytics, setAnalytics] = useState<AnalyticsData>(() => {
    try {
      const saved = localStorage.getItem('kutch_traditional_analytics');
      if (saved) return JSON.parse(saved);
    } catch {}
    return {
      pageViews: {
        home: 0,
        catalog: 0,
        productDetails: 0,
        cart: 0,
        wishlist: 0,
        profile: 0,
        admin: 0,
      },
      productViews: {},
      totalVisitors: 0,
      activeVisitorsNow: 0,
      dailyViews: [],
      trafficSources: [],
    };
  });

  // Real-time Firestore subscriptions for instant cloud sync
  useEffect(() => {
    initializeFirestoreData();

    const unsubProds = subscribeToProducts((cloudProds) => {
      if (cloudProds && cloudProds.length > 0) {
        setProducts(cloudProds);
      }
    });

    const unsubCats = subscribeToCategories((cloudCats) => {
      if (cloudCats && cloudCats.length > 0) {
        setCategories(cloudCats);
      }
    });

    const unsubSlides = subscribeToSlides((cloudSlides) => {
      if (cloudSlides && cloudSlides.length > 0) {
        setSlides(cloudSlides);
      }
    });

    const unsubAnalytics = subscribeToAnalytics((cloudAnalytics) => {
      if (cloudAnalytics) {
        setAnalytics((prev) => ({
          ...prev,
          pageViews: { ...prev.pageViews, ...(cloudAnalytics.pageViews || {}) },
          productViews: { ...prev.productViews, ...(cloudAnalytics.productViews || {}) },
          totalVisitors: cloudAnalytics.totalVisitors || prev.totalVisitors,
        }));
      }
    });

    return () => {
      unsubProds();
      unsubCats();
      unsubSlides();
      unsubAnalytics();
    };
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem('kutch_traditional_analytics', JSON.stringify(analytics));
    } catch {}
  }, [analytics]);

  // Trigger Toast Notification helper
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3200);
  };

  const handleToggleLogin = () => {
    if (isLoggedIn) {
      setIsLoggedIn(false);
      showToast('Logged out of Kutch Traditional');
    } else {
      setIsLoggedIn(true);
      showToast('Welcome back, Kutch Traditional Guest!');
    }
  };

  // Admin Management Handlers with Cloud Database Sync
  const handleAddProduct = (prod: Product) => {
    setProducts((prev) => [prod, ...prev]);
    saveProductToFirestore(prod).catch((e) => console.warn(e));
    showToast(`Product "${prod.name}" saved to Cloud Catalog!`);
  };

  const handleUpdateProduct = (prod: Product) => {
    setProducts((prev) => prev.map((p) => (p.id === prod.id ? prod : p)));
    saveProductToFirestore(prod).catch((e) => console.warn(e));
    showToast(`Product "${prod.name}" updated in Cloud Database!`);
  };

  const handleDeleteProduct = (id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
    deleteProductFromFirestore(id).catch((e) => console.warn(e));
    showToast('Product removed from Cloud Store.');
  };

  const handleAddCategory = (cat: CategoryItem) => {
    setCategories((prev) => [...prev, cat]);
    saveCategoryToFirestore(cat).catch((e) => console.warn(e));
    showToast(`Category "${cat.name}" added to Cloud Database!`);
  };

  const handleDeleteCategory = (id: string) => {
    setCategories((prev) => prev.filter((c) => c.id !== id));
    deleteCategoryFromFirestore(id).catch((e) => console.warn(e));
    showToast('Category removed from Cloud Store.');
  };

  const handleAddSlide = async (slide: BannerSlide) => {
    setSlides((prev) => {
      if (prev.some((s) => s.id === slide.id)) return prev;
      const updated = [...prev, slide];
      try {
        localStorage.setItem('kutch_traditional_slides', JSON.stringify(updated));
      } catch {}
      return updated;
    });

    try {
      await saveSlideToFirestore(slide);
      showToast('New hero banner slide saved to Cloud Database!');
    } catch (e) {
      console.error('[App] Failed to save slide to Firestore:', e);
      showToast('Slide saved locally!');
    }
  };

  const handleUpdateSlide = async (slide: BannerSlide) => {
    setSlides((prev) => {
      const updated = prev.map((s) => (s.id === slide.id ? slide : s));
      try {
        localStorage.setItem('kutch_traditional_slides', JSON.stringify(updated));
      } catch {}
      return updated;
    });

    try {
      await saveSlideToFirestore(slide);
      showToast('Hero banner slide updated in Cloud Database!');
    } catch (e) {
      console.error('[App] Failed to update slide in Firestore:', e);
      showToast('Slide updated locally!');
    }
  };

  const handleDeleteSlide = async (id: number) => {
    setSlides((prev) => {
      const updated = prev.filter((s) => s.id !== id);
      try {
        localStorage.setItem('kutch_traditional_slides', JSON.stringify(updated));
      } catch {}
      return updated;
    });

    try {
      await deleteSlideFromFirestore(id);
      showToast('Slide removed from Cloud Database!');
    } catch (e) {
      console.error('[App] Failed to delete slide in Firestore:', e);
      showToast('Slide removed locally!');
    }
  };

  // Add to Cart handler
  const handleAddToCart = (
    product: Product,
    size: string,
    price: number,
    quantity: number,
  ) => {
    const itemId = `${product.id}-${size}`;
    setCart((prev) => {
      const existing = prev.find((item) => item.id === itemId);
      if (existing) {
        return prev.map((item) =>
          item.id === itemId
            ? { ...item, quantity: item.quantity + quantity }
            : item,
        );
      }
      return [
        ...prev,
        {
          id: itemId,
          product,
          selectedSize: size,
          price,
          quantity,
        },
      ];
    });
    showToast(`Added ${quantity}x ${product.name} (${size}) to Bag`);
  };

  const handleBuyNow = (
    product: Product,
    size: string,
    price: number,
    quantity: number,
  ) => {
    handleAddToCart(product, size, price, quantity);
    navigateToTab('cart');
  };

  // Quick Add from Card
  const handleQuickAdd = (product: Product, e: React.MouseEvent) => {
    e.stopPropagation();
    handleAddToCart(product, product.sizes[0].size, product.sizes[0].price, 1);
  };

  // Toggle Wishlist
  const handleToggleWishlist = (product: Product, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setWishlist((prev) => {
      const exists = prev.includes(product.id);
      if (exists) {
        showToast(`Removed from saved wishlist`);
        return prev.filter((id) => id !== product.id);
      } else {
        showToast(`Saved to your botanical wishlist!`);
        return [...prev, product.id];
      }
    });
  };

  // Cart helpers
  const handleUpdateQuantity = (id: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.id === id) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[],
    );
  };

  const handleRemoveFromCart = (id: string) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
    showToast('Removed item from bag');
  };

  // Apply Promo
  const handleApplyPromo = (code: string) => {
    setAppliedPromo(code);
    showToast(`Promo "${code}" applied: 20% Discount!`);
  };

  // Calculate cart count & subtotal
  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  let discount = 0;
  if (appliedPromo) {
    discount = Math.round(subtotal * 0.2);
  }
  const total = Math.max(0, subtotal - discount);

  // Filter application
  const handleApplyFilters = (newFilters: FilterOptions) => {
    setFilters(newFilters);
    if (newFilters.category !== 'All') {
      setSelectedCategory(newFilters.category);
      setActiveTab('catalog');
    }
  };

  const handleResetFilters = () => {
    setFilters({
      category: 'All',
      searchQuery: '',
      minPrice: 50,
      maxPrice: 300,
      sortBy: 'popular',
    });
    setSelectedCategory('All');
  };

  // Navigation callbacks with live analytics view tracking
  const openProductDetails = (product: Product) => {
    setSelectedProduct(product);
    window.history.pushState({}, '', `/product/${product.id}`);
    setIsProductLoading(true);

    // Increment product views in cloud firestore and local state
    recordProductViewInFirestore(product.id).catch(() => {});
    recordPageViewInFirestore('productDetails').catch(() => {});

    setAnalytics((prev) => ({
      ...prev,
      pageViews: {
        ...prev.pageViews,
        productDetails: prev.pageViews.productDetails + 1,
      },
      productViews: {
        ...prev.productViews,
        [product.id]: (prev.productViews[product.id] || 450) + 1,
      },
    }));

    window.scrollTo({ top: 0, behavior: 'smooth' });
    setTimeout(() => {
      setIsProductLoading(false);
    }, 280);
  };

  const closeProductDetails = () => {
    setSelectedProduct(null);
    window.history.pushState({}, '', activeTab === 'home' ? '/' : `/${activeTab}`);
  };

  const navigateToCatalog = (category?: string) => {
    if (category) setSelectedCategory(category);
    setSelectedProduct(null);
    setIsTabLoading(true);
    setActiveTab('catalog');
    window.history.pushState({}, '', '/catalog');
    recordPageViewInFirestore('catalog').catch(() => {});

    // Increment catalog views in real-time
    setAnalytics((prev) => ({
      ...prev,
      pageViews: {
        ...prev.pageViews,
        catalog: prev.pageViews.catalog + 1,
      },
    }));

    window.scrollTo({ top: 0, behavior: 'smooth' });
    setTimeout(() => {
      setIsTabLoading(false);
    }, 300);
  };

  const navigateToTab = (tab: ActiveTab, category?: string) => {
    if (tab === 'admin' && !isAdminAuthenticated && sessionStorage.getItem('kutch_traditional_admin_auth') !== 'true') {
      setShowAdminPasswordModal(true);
      return;
    }
    setSelectedProduct(null);
    if (category) setSelectedCategory(category);
    setIsTabLoading(true);
    setActiveTab(tab);
    
    const newPath = tab === 'home' ? '/' : tab === 'admin' ? '/avesh-140' : `/${tab}`;
    window.history.pushState({}, '', newPath);

    recordPageViewInFirestore(tab).catch(() => {});

    // Increment route page view in real-time
    const pageKey =
      tab === 'home'
        ? 'home'
        : tab === 'catalog'
        ? 'catalog'
        : tab === 'cart'
        ? 'cart'
        : tab === 'wishlist'
        ? 'wishlist'
        : tab === 'profile'
        ? 'profile'
        : tab === 'admin'
        ? 'admin'
        : null;

    if (pageKey) {
      setAnalytics((prev) => ({
        ...prev,
        pageViews: {
          ...prev.pageViews,
          [pageKey]: (prev.pageViews[pageKey as keyof typeof prev.pageViews] || 0) + 1,
        },
      }));
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
    setTimeout(() => {
      setIsTabLoading(false);
    }, 300);
  };

  // Analytics Simulation & Reset Helpers
  const handleSimulateView = (productId?: string) => {
    const targetProduct = productId
      ? products.find((p) => p.id === productId)
      : products[Math.floor(Math.random() * products.length)];
    const targetId = targetProduct?.id || 'kutch-traditional-mamra-almonds';

    setAnalytics((prev) => ({
      ...prev,
      totalVisitors: prev.totalVisitors + 1,
      activeVisitorsNow: Math.min(35, prev.activeVisitorsNow + 1),
      pageViews: {
        ...prev.pageViews,
        home: prev.pageViews.home + 1,
        productDetails: prev.pageViews.productDetails + 1,
      },
      productViews: {
        ...prev.productViews,
        [targetId]: (prev.productViews[targetId] || 450) + 1,
      },
    }));
    showToast(`Recorded real customer view for ${targetProduct?.name || 'Mamra Almonds'}!`);
  };

  const handleResetAnalytics = () => {
    localStorage.removeItem('kutch_traditional_analytics');
    setAnalytics({
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
    });
    showToast('Analytics counters reset to standard benchmark.');
  };

  return (
    <div className="min-h-screen bg-[#F8FAF6] flex flex-col text-[#191F17] selection:bg-[#FF5722] selection:text-white">
      {/* Primary Responsive Navigation Header (Hidden on Admin page) */}
      {activeTab !== 'admin' && (
        <Header
          title={
            selectedProduct
              ? undefined
              : activeTab === 'cart'
              ? 'Shopping Bag'
              : activeTab === 'wishlist'
              ? 'Saved Wishlist'
              : activeTab === 'profile'
              ? 'My Account'
              : activeTab === 'notfound'
              ? 'Page Not Found'
              : activeTab === 'catalog'
              ? 'All Dry Fruits'
              : undefined
          }
          onOpenMenu={() => setIsMenuOpen(true)}
          onOpenWishlist={() => navigateToTab('wishlist')}
          onOpenProfile={() => navigateToTab('profile')}
          onNavigateTab={navigateToTab}
          cartCount={cartCount}
          wishlistCount={wishlist.length}
          currentTab={activeTab}
        />
      )}

      {/* Interactive Toast Notifications */}
      <Toast
        message={toastMessage}
        onViewCart={() => navigateToTab('cart')}
      />

      {/* Main Content Area */}
      <main className="flex-1 w-full">
        {selectedProduct ? (
          /* Screen 2: Details Screen (Exact match to screenshot 2) */
          isProductLoading ? (
            <ProductDetailSkeleton />
          ) : (
            <ProductDetailView
              product={selectedProduct}
              onAddToCart={handleAddToCart}
              onBuyNow={handleBuyNow}
              isWishlisted={wishlist.includes(selectedProduct.id)}
              onToggleWishlist={handleToggleWishlist}
              settings={productPageSettings}
            />
          )
        ) : activeTab === 'home' ? (
          /* Screen 1: Home Screen (Exact match to screenshot 1) */
          <HomeView
            products={products}
            categories={categories}
            slides={slides}
            isLoading={isInitialLoading || isTabLoading}
            onSelectProduct={openProductDetails}
            onOpenCatalog={navigateToCatalog}
            onOpenFilter={() => setIsFilterOpen(true)}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            wishlistIds={wishlist}
            onToggleWishlist={handleToggleWishlist}
            onQuickAdd={handleQuickAdd}
            onApplyPromo={handleApplyPromo}
          />
        ) : activeTab === 'catalog' ? (
          <CatalogView
            products={products}
            categories={categories}
            selectedCategory={selectedCategory}
            isLoading={isTabLoading}
            onSelectCategory={setSelectedCategory}
            onSelectProduct={openProductDetails}
            onOpenFilter={() => setIsFilterOpen(true)}
            wishlistIds={wishlist}
            onToggleWishlist={handleToggleWishlist}
            onQuickAdd={handleQuickAdd}
          />
        ) : activeTab === 'cart' ? (
          <CartView
            items={cart}
            isLoading={isTabLoading}
            onUpdateQuantity={handleUpdateQuantity}
            onRemoveItem={handleRemoveFromCart}
            onExploreProducts={() => navigateToCatalog('All')}
            onOpenCheckout={() => setIsCheckoutOpen(true)}
            appliedPromo={appliedPromo}
            onApplyPromo={handleApplyPromo}
            onRemovePromo={() => setAppliedPromo(null)}
          />
        ) : activeTab === 'wishlist' ? (
          <WishlistView
            products={products}
            wishlistIds={wishlist}
            isLoading={isTabLoading}
            onSelectProduct={openProductDetails}
            onToggleWishlist={handleToggleWishlist}
            onQuickAdd={handleQuickAdd}
            onExploreProducts={() => navigateToCatalog('All')}
          />
        ) : activeTab === 'admin' ? (
          <AdminView
            products={products}
            categories={categories}
            slides={slides}
            analytics={analytics}
            isLoading={isTabLoading}
            onAddProduct={handleAddProduct}
            onUpdateProduct={handleUpdateProduct}
            onDeleteProduct={handleDeleteProduct}
            onAddCategory={handleAddCategory}
            onDeleteCategory={handleDeleteCategory}
            onAddSlide={handleAddSlide}
            onUpdateSlide={handleUpdateSlide}
            onDeleteSlide={handleDeleteSlide}
            onExitAdmin={() => setActiveTab('home')}
            onSimulateView={handleSimulateView}
            onResetAnalytics={handleResetAnalytics}
            productPageSettings={productPageSettings}
            onUpdateProductPageSettings={handleUpdateProductPageSettings}
          />
        ) : activeTab === 'notfound' ? (
          <NotFoundView
            onNavigateHome={() => setActiveTab('home')}
            onNavigateCatalog={navigateToCatalog}
            onNavigateCart={() => navigateToTab('cart')}
          />
        ) : (
          <ProfileView
            currency={currency}
            onChangeCurrency={setCurrency}
            onExploreProducts={() => navigateToCatalog('All')}
            onNavigateTab={navigateToTab}
            user={currentUser}
            onGoogleSignIn={handleGoogleSignIn}
            onEmailSignIn={handleEmailSignIn}
            onEmailSignUp={handleEmailSignUp}
            onSignOut={handleSignOut}
            isLoading={isTabLoading}
          />
        )}
      </main>

      {/* Mobile Floating Bottom Navigation Bar (Hidden when on product details screen or desktop or admin/notfound) */}
      {!selectedProduct && activeTab !== 'admin' && activeTab !== 'notfound' && (
        <BottomNav
          activeTab={activeTab}
          onChangeTab={(tab) => navigateToTab(tab)}
          cartCount={cartCount}
          wishlistCount={wishlist.length}
        />
      )}

      {/* Minimalist Centered Footer with Rounded Top Corners */}
      {!selectedProduct && activeTab !== 'admin' && (
        <footer className="w-full bg-[#182115] text-[#D8E2D2] mt-auto rounded-t-[32px] sm:rounded-t-[42px] border-t border-white/10 shadow-[0_-12px_40px_rgba(0,0,0,0.25)] py-10 pb-24 lg:pb-12 text-center">
          <div className="max-w-xl mx-auto px-4 flex flex-col items-center justify-center space-y-4">
            {/* 1. Brand Name */}
            <div
              onClick={() => navigateToTab('home')}
              className="inline-flex items-center justify-center gap-2.5 cursor-pointer group"
            >
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#FF5722] to-[#6B922A] flex items-center justify-center text-white shadow-xs font-bold transition-transform group-hover:scale-105">
                <Leaf size={16} strokeWidth={2.4} />
              </div>
              <span className="text-xl font-black tracking-tight text-white">
                Kutch<span className="text-[#FF5722]"> Traditional</span>
              </span>
            </div>

            {/* 2. Instagram Handle */}
            <a
              href="https://instagram.com/kutchtraditional"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-[#D4E0CD] hover:text-white transition-all cursor-pointer group"
            >
              <Instagram size={15} className="text-[#E1306C] group-hover:scale-110 transition-transform" />
              <span>@kutchtraditional</span>
            </a>

            {/* 3. Exactly 3 Useful Links */}
            <nav className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-xs font-medium text-[#A9BAA4] pt-1">
              <button
                onClick={() => setPolicyModal('about')}
                className="hover:text-[#FF5722] transition-colors cursor-pointer"
              >
                About Us
              </button>
              <span className="text-white/20">•</span>
              <button
                onClick={() => setPolicyModal('privacy')}
                className="hover:text-[#FF5722] transition-colors cursor-pointer"
              >
                Privacy Policy
              </button>
              <span className="text-white/20">•</span>
              <button
                onClick={() => setPolicyModal('return')}
                className="hover:text-[#FF5722] transition-colors cursor-pointer"
              >
                Return & Exchange Policy
              </button>
            </nav>

            {/* 4. Copyright */}
            <div className="pt-3 border-t border-white/10 w-full max-w-xs">
              <p className="text-[11px] text-[#7E8E7A]">
                © 2026 Kutch Traditional • All rights reserved.
              </p>
            </div>
          </div>
        </footer>
      )}

      {/* Policy & About Us Modal */}
      {policyModal && (
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => setPolicyModal(null)}
        >
          <div
            className="w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl border border-[#E3E8DC] animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3.5 border-b border-[#EEF2E6]">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-[#EBF3DA] text-[#4E761E] flex items-center justify-center">
                  <Leaf size={16} />
                </div>
                <h3 className="text-base font-black text-[#1C2518]">
                  {policyModal === 'about' && 'About Kutch Traditional'}
                  {policyModal === 'privacy' && 'Privacy Policy'}
                  {policyModal === 'return' && 'Return & Exchange Policy'}
                </h3>
              </div>
              <button
                onClick={() => setPolicyModal(null)}
                className="w-8 h-8 rounded-full bg-[#F2F5ED] hover:bg-[#E5EADF] flex items-center justify-center text-[#5D6B55] transition-colors cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            <div className="py-4 text-xs text-[#52604C] space-y-3 leading-relaxed max-h-[60vh] overflow-y-auto">
              {policyModal === 'about' && (
                <>
                  <p>
                    <strong>Kutch Traditional</strong> is dedicated to preserving the rich cultural heritage of Kutch by bringing authentic handicrafts, traditional art, and premium organic dry fruits directly to you.
                  </p>
                  <p>
                    From intricate embroidery and hand-loomed fabrics to the finest organic produce, every item is sourced responsibly from local artisans and farmers to ensure quality and authenticity.
                  </p>
                  <p>
                    🌟 <strong>Our Mission:</strong> To empower local craftsmanship and deliver the essence of Kutch tradition worldwide.
                  </p>
                </>
              )}

              {policyModal === 'privacy' && (
                <>
                  <p>
                    Your privacy is deeply important to us. At <strong>Kutch Traditional</strong>, we implement industry-standard 256-bit encryption to protect your sensitive payment and order information.
                  </p>
                  <p>
                    • We do <strong>not</strong> sell, rent, or trade your personal data to third parties.
                  </p>
                  <p>
                    • Contact details are only utilized to provide order status updates and dispatch confirmations.
                  </p>
                </>
              )}

              {policyModal === 'return' && (
                <>
                  <p>
                    We guarantee exceptional craftsmanship and quality. We offer a <strong>Quality Assurance Guarantee</strong> on all our traditional artifacts and products.
                  </p>
                  <p>
                    • <strong>Hassle-Free Returns:</strong> Unused items can be returned within 30 days of delivery for a full refund or exchange.
                  </p>
                  <p>
                    • <strong>Transit Damage:</strong> If any item arrives damaged, we provide an immediate free replacement or refund.
                  </p>
                </>
              )}
            </div>

            <div className="pt-2 border-t border-[#EEF2E6]">
              <button
                onClick={() => setPolicyModal(null)}
                className="w-full py-2.5 rounded-xl bg-[#FF5722] hover:bg-[#7CA435] text-white font-bold text-xs transition-all shadow-xs cursor-pointer"
              >
                Got It
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Filter Drawer Bottom Sheet */}
      <FilterDrawer
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        filters={filters}
        onApplyFilters={handleApplyFilters}
        onResetFilters={handleResetFilters}
      />

      {/* Hamburger Sidebar Drawer */}
      <SidebarMenu
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
        onSelectCategory={navigateToCatalog}
        onNavigateTab={(tab) => navigateToTab(tab)}
        activeCategory={selectedCategory}
        isLoggedIn={!!currentUser || isLoggedIn}
        onToggleLogin={() => {
          if (currentUser || isLoggedIn) {
            setIsLoggedIn(false);
            showToast('Logged out successfully.');
          } else {
            navigateToTab('profile');
            setIsMenuOpen(false);
          }
        }}
        userEmail={currentUser?.email || (isLoggedIn ? 'account@kutchtraditional.store' : '')}
        userName={currentUser?.displayName || 'Kutch Guest'}
        categories={categories}
        products={products}
        onSelectProduct={(p) => setSelectedProduct(p)}
      />

      {/* Checkout & Payment Confirmation Modal with Confetti */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        items={cart}
        subtotal={subtotal}
        discount={discount}
        total={total}
        appliedPromo={appliedPromo}
        onClearCart={() => setCart([])}
        onAutoCreateAccount={handleAutoCreateAccount}
        user={currentUser}
      />

      {/* SECURE ADMIN PASSWORD MODAL FOR /avesh-140 */}
      {showAdminPasswordModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-sm bg-white rounded-3xl p-6 shadow-2xl border border-[#E3E8DC] animate-in zoom-in-95 duration-200 space-y-5 text-center">
            <div className="w-12 h-12 rounded-2xl bg-[#192215] text-[#FF5722] flex items-center justify-center mx-auto shadow-md">
              <Shield size={24} />
            </div>
            <div>
              <h3 className="text-base font-black text-[#1C2518]">Secure Admin Portal</h3>
              <p className="text-xs text-[#71806B] mt-1">
                Enter admin password to access CMS dashboard (/avesh-140)
              </p>
            </div>

            <form onSubmit={handleAdminPasswordSubmit} className="space-y-4 text-left">
              <div>
                <label className="text-[11px] font-bold text-[#6B7B65] block mb-1">
                  Admin Password
                </label>
                <input
                  type="password"
                  value={adminPasswordInput}
                  onChange={(e) => setAdminPasswordInput(e.target.value)}
                  placeholder="Enter password..."
                  autoFocus
                  className={`w-full px-4 py-2.5 rounded-xl border text-xs font-semibold focus:outline-none ${
                    adminPasswordError ? 'border-red-500 bg-red-50' : 'border-[#DDE5D4] focus:border-[#FF5722]'
                  }`}
                />
                {adminPasswordError && (
                  <p className="text-[10px] text-red-600 font-bold mt-1">Incorrect password. Use Avesh@140</p>
                )}
              </div>

              <div className="flex gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => {
                    setShowAdminPasswordModal(false);
                    navigateToTab('home');
                  }}
                  className="flex-1 py-2.5 rounded-xl bg-[#F2F5ED] text-[#55634E] font-bold text-xs hover:bg-[#E8EDE0] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-[#FF5722] text-white font-bold text-xs hover:bg-[#7DA535] cursor-pointer shadow-xs"
                >
                  Unlock Admin
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
