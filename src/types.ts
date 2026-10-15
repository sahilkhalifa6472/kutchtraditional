export interface Product {
  id: string;
  name: string;
  category: string;
  subtitle: string;
  price: number; // base price for smallest size
  originalPrice?: number;
  rating: number;
  reviewCount: number;
  images: string[];
  sizes: {
    size: string;
    price: number;
    volume: string;
  }[];
  description: string;
  ingredients: string[];
  benefits: string[];
  howToUse: string;
  isNew?: boolean;
  isBestSeller?: boolean;
  badge?: string;
  store: {
    name: string;
    isOfficial: boolean;
    followers: string;
  };
  stock?: number;
  inStock?: boolean;
  sku?: string;
}

export interface CouponItem {
  id: string;
  code: string;
  discountPercent?: number;
  discountAmount?: number;
  description: string;
  minOrder: number;
  expiry: string;
  isActive: boolean;
  usageCount: number;
}

export interface CartItem {
  id: string; // unique item id (productId + size)
  product: Product;
  selectedSize: string;
  price: number;
  quantity: number;
}

export interface CategoryItem {
  id: string;
  name: string;
  image: string;
  count: number;
  description?: string;
}

export interface BannerSlide {
  id: number;
  tag: string;
  titleLine1: string;
  titleLine2: string;
  buttonText: string;
  code: string;
  bgGradient: string;
  imageSrc: string;
  tagBgColor?: string;
}

export type ActiveTab = 'home' | 'cart' | 'wishlist' | 'profile' | 'catalog' | 'admin' | 'notfound';

export interface FilterOptions {
  category: string;
  searchQuery: string;
  minPrice: number;
  maxPrice: number;
  sortBy: 'popular' | 'price-asc' | 'price-desc' | 'rating';
}

export interface AnalyticsData {
  pageViews: {
    home: number;
    catalog: number;
    productDetails: number;
    cart: number;
    wishlist: number;
    profile: number;
    admin: number;
  };
  productViews: Record<string, number>;
  totalVisitors: number;
  activeVisitorsNow: number;
  dailyViews: { date: string; views: number; visitors: number }[];
  trafficSources: { source: string; percentage: number; visits: number }[];
}

