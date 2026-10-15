import {
  collection,
  doc,
  getDocs,
  getDoc,
  setDoc,
  deleteDoc,
  onSnapshot,
  updateDoc,
  increment,
} from 'firebase/firestore';
import { db } from './firebase';
import { Product, CategoryItem, BannerSlide, AnalyticsData } from '../types';
import { PRODUCTS, CATEGORIES } from '../data/products';
import { INITIAL_SLIDES } from '../data/slides';

export interface OrderRecord {
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

// Collections references
const PRODUCTS_COLLECTION = 'products';
const CATEGORIES_COLLECTION = 'categories';
const SLIDES_COLLECTION = 'slides';
const ORDERS_COLLECTION = 'orders';
const ANALYTICS_DOC = 'global_metrics';
const SETTINGS_DOC = 'store_config';

import { KUTCH_CATEGORIES, KUTCH_HERITAGE_PRODUCTS, KUTCH_BANNER_SLIDES } from '../data/kutchProductsData';

/**
 * Seed authentic Kutch heritage products, categories, and slides to Firestore
 */
export async function seedKutchHeritageDataToFirestore(force = false): Promise<{ success: boolean; message: string; count: number }> {
  try {
    const prodCol = collection(db, PRODUCTS_COLLECTION);
    const existingSnap = await getDocs(prodCol);
    
    if (!force && !existingSnap.empty) {
      return { success: true, message: 'Products already exist in Firebase.', count: existingSnap.size };
    }

    let seededCount = 0;
    // Batch setDoc for products
    for (const prod of KUTCH_HERITAGE_PRODUCTS) {
      const prodRef = doc(db, PRODUCTS_COLLECTION, prod.id);
      await setDoc(prodRef, prod, { merge: true });
      seededCount++;
    }

    // Seed categories
    for (const cat of KUTCH_CATEGORIES) {
      const catRef = doc(db, CATEGORIES_COLLECTION, cat.id);
      await setDoc(catRef, cat, { merge: true });
    }

    // Seed banner slides
    for (const slide of KUTCH_BANNER_SLIDES) {
      const slideRef = doc(db, SLIDES_COLLECTION, String(slide.id));
      await setDoc(slideRef, slide, { merge: true });
    }

    // Update settings
    const settingRef = doc(db, 'settings', SETTINGS_DOC);
    await setDoc(settingRef, {
      announcementText: '🌟 100% Authentic Kutch Handicrafts & Heritage Products • Worldwide Shipping',
      currency: 'INR',
    }, { merge: true });

    return {
      success: true,
      message: `Successfully synchronized ${seededCount} authentic Kutch products to Firebase!`,
      count: seededCount,
    };
  } catch (error: any) {
    console.error('[Firestore] Seeding Kutch products failed:', error);
    return {
      success: false,
      message: error?.message || 'Failed to seed products to Firebase',
      count: 0,
    };
  }
}

/**
 * Initialize / Seed Firestore Collections if empty
 */
export async function initializeFirestoreData(): Promise<void> {
  try {
    // Check & Seed Settings only (essential for app config)
    const settingRef = doc(db, 'settings', SETTINGS_DOC);
    const settingSnap = await getDoc(settingRef);
    if (!settingSnap.exists()) {
      await setDoc(settingRef, {
        announcementText: '🌟 100% Authentic Kutch Handicrafts & Heritage Products • Worldwide Shipping',
        imgbbApiKey: '',
        currency: 'INR',
      });
    }

    // Check if products collection is empty
    const prodCol = collection(db, PRODUCTS_COLLECTION);
    const prodSnap = await getDocs(prodCol);
    if (prodSnap.empty) {
      console.log('[Firestore] Empty database detected. Seeding Kutch Heritage products to Firestore...');
      await seedKutchHeritageDataToFirestore(false);
    }
  } catch (error) {
    console.warn('[Firestore] Initialize data error:', error);
  }
}

// ================= PRODUCT METHODS =================

export function subscribeToProducts(callback: (products: Product[]) => void) {
  try {
    const colRef = collection(db, PRODUCTS_COLLECTION);
    return onSnapshot(
      colRef,
      (snapshot) => {
        const prods: Product[] = [];
        snapshot.forEach((d) => {
          prods.push(d.data() as Product);
        });
        callback(prods);
      },
      (error) => {
        console.warn('[Firestore] Product subscription error:', error);
        callback([]);
      }
    );
  } catch (err) {
    console.error('[Firestore] subscribeToProducts setup error:', err);
    callback([]);
    return () => {};
  }
}

export async function saveProductToFirestore(product: Product): Promise<void> {
  const prodRef = doc(db, PRODUCTS_COLLECTION, product.id);
  await setDoc(prodRef, product, { merge: true });
}

export async function deleteProductFromFirestore(productId: string): Promise<void> {
  const prodRef = doc(db, PRODUCTS_COLLECTION, productId);
  await deleteDoc(prodRef);
}

// ================= CATEGORY METHODS =================

export function subscribeToCategories(callback: (categories: CategoryItem[]) => void) {
  try {
    const colRef = collection(db, CATEGORIES_COLLECTION);
    return onSnapshot(
      colRef,
      (snapshot) => {
        const cats: CategoryItem[] = [];
        snapshot.forEach((d) => {
          cats.push(d.data() as CategoryItem);
        });
        callback(cats);
      },
      (error) => {
        console.warn('[Firestore] Category subscription error:', error);
        callback([]);
      }
    );
  } catch (err) {
    console.error('[Firestore] subscribeToCategories error:', err);
    callback([]);
    return () => {};
  }
}

export async function saveCategoryToFirestore(category: CategoryItem): Promise<void> {
  const catRef = doc(db, CATEGORIES_COLLECTION, category.id);
  await setDoc(catRef, category, { merge: true });
}

export async function deleteCategoryFromFirestore(categoryId: string): Promise<void> {
  const catRef = doc(db, CATEGORIES_COLLECTION, categoryId);
  await deleteDoc(catRef);
}

// ================= BANNER SLIDES METHODS =================

export function subscribeToSlides(callback: (slides: BannerSlide[]) => void) {
  try {
    const colRef = collection(db, SLIDES_COLLECTION);
    return onSnapshot(
      colRef,
      (snapshot) => {
        const slides: BannerSlide[] = [];
        snapshot.forEach((d) => {
          const data = d.data();
          slides.push({
            id: Number(data.id || d.id),
            tag: data.tag || 'Special Offer',
            titleLine1: data.titleLine1 || '',
            titleLine2: data.titleLine2 || '',
            buttonText: data.buttonText || 'Shop Now',
            code: data.code || '',
            bgGradient: data.bgGradient || 'from-[#A6D546] via-[#9DC941] to-[#88B835]',
            imageSrc: data.imageSrc || '',
            tagBgColor: data.tagBgColor || '#12170F',
          });
        });
        const sorted = slides.sort((a, b) => a.id - b.id);
        try {
          localStorage.setItem('kutch_traditional_slides', JSON.stringify(sorted));
        } catch {}
        callback(sorted);
      },
      (error) => {
        console.warn('[Firestore] Slides subscription error:', error);
        callback([]);
      }
    );
  } catch (err) {
    console.error('[Firestore] subscribeToSlides error:', err);
    callback([]);
    return () => {};
  }
}

export async function saveSlideToFirestore(slide: BannerSlide): Promise<void> {
  const sanitizedSlide: Record<string, any> = {
    id: Number(slide.id),
    tag: slide.tag || 'Special Offer',
    titleLine1: slide.titleLine1 || '',
    titleLine2: slide.titleLine2 || '',
    buttonText: slide.buttonText || 'Shop Now',
    code: slide.code || '',
    bgGradient: slide.bgGradient || 'from-[#A6D546] via-[#9DC941] to-[#88B835]',
    imageSrc: slide.imageSrc || 'https://images.unsplash.com/photo-1541544741938-0af808871cc0?auto=format&fit=crop&w=1200&q=80',
    tagBgColor: slide.tagBgColor || '#12170F',
  };

  const slideRef = doc(db, SLIDES_COLLECTION, String(slide.id));
  await setDoc(slideRef, sanitizedSlide, { merge: true });
}

export async function deleteSlideFromFirestore(slideId: number): Promise<void> {
  const slideRef = doc(db, SLIDES_COLLECTION, String(slideId));
  await deleteDoc(slideRef);
}

// ================= ORDERS METHODS =================

export function subscribeToOrders(callback: (orders: OrderRecord[]) => void) {
  try {
    const colRef = collection(db, ORDERS_COLLECTION);
    return onSnapshot(
      colRef,
      (snapshot) => {
        if (!snapshot.empty) {
          const ords: OrderRecord[] = [];
          snapshot.forEach((d) => {
            ords.push(d.data() as OrderRecord);
          });
          callback(ords);
        } else {
          callback([]);
        }
      },
      (error) => {
        console.warn('[Firestore] Orders subscription error:', error);
        callback([]);
      }
    );
  } catch (err) {
    console.error('[Firestore] subscribeToOrders error:', err);
    callback([]);
    return () => {};
  }
}

export async function createOrderInFirestore(order: OrderRecord): Promise<void> {
  const orderRef = doc(db, ORDERS_COLLECTION, order.id);
  await setDoc(orderRef, order);
}

export async function updateOrderStatusInFirestore(
  orderId: string,
  status: 'In Transit' | 'Delivered' | 'Processing',
  trackingNumber?: string
): Promise<void> {
  const orderRef = doc(db, ORDERS_COLLECTION, orderId);
  const updateData: any = { status };
  if (trackingNumber) {
    updateData.trackingNumber = trackingNumber;
  }
  await updateDoc(orderRef, updateData);
}

// ================= ANALYTICS & STORE SETTINGS =================

export async function recordPageViewInFirestore(pageKey: string): Promise<void> {
  try {
    const analyticsRef = doc(db, 'analytics', ANALYTICS_DOC);
    await setDoc(
      analyticsRef,
      {
        totalVisitors: increment(1),
        [`pageViews.${pageKey}`]: increment(1),
      },
      { merge: true }
    );
  } catch (err) {
    // Non-blocking
  }
}

export async function recordProductViewInFirestore(productId: string): Promise<void> {
  try {
    const analyticsRef = doc(db, 'analytics', ANALYTICS_DOC);
    await setDoc(
      analyticsRef,
      {
        [`productViews.${productId}`]: increment(1),
      },
      { merge: true }
    );
  } catch (err) {
    // Non-blocking
  }
}

export function subscribeToAnalytics(callback: (data: Partial<AnalyticsData>) => void) {
  try {
    const analyticsRef = doc(db, 'analytics', ANALYTICS_DOC);
    return onSnapshot(analyticsRef, (snapshot) => {
      if (snapshot.exists()) {
        callback(snapshot.data() as Partial<AnalyticsData>);
      }
    });
  } catch (err) {
    return () => {};
  }
}

export async function fetchStoreSettings(): Promise<{ announcementText: string; imgbbApiKey?: string } | null> {
  try {
    const ref = doc(db, 'settings', SETTINGS_DOC);
    const snap = await getDoc(ref);
    if (snap.exists()) {
      return snap.data() as { announcementText: string; imgbbApiKey?: string };
    }
  } catch (err) {
    // fallback
  }
  return null;
}

export async function saveStoreSettings(settings: { announcementText?: string; imgbbApiKey?: string }): Promise<void> {
  const ref = doc(db, 'settings', SETTINGS_DOC);
  await setDoc(ref, settings, { merge: true });
}
