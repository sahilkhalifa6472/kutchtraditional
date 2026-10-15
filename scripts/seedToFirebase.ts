import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc, collection, getDocs } from 'firebase/firestore';
import { readFileSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { KUTCH_CATEGORIES, KUTCH_HERITAGE_PRODUCTS, KUTCH_BANNER_SLIDES } from '../src/data/kutchProductsData';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function runSeed() {
  try {
    const configPath = path.resolve(__dirname, '../firebase-applet-config.json');
    const configRaw = readFileSync(configPath, 'utf-8');
    const firebaseConfig = JSON.parse(configRaw);

    console.log(`Connecting to Firebase project: ${firebaseConfig.projectId}...`);
    const app = initializeApp(firebaseConfig);
    const db = getFirestore(app);

    console.log(`Seeding ${KUTCH_HERITAGE_PRODUCTS.length} authentic Kutch products to Firestore...`);
    for (const prod of KUTCH_HERITAGE_PRODUCTS) {
      const prodRef = doc(db, 'products', prod.id);
      await setDoc(prodRef, prod, { merge: true });
      console.log(` - Saved product: ${prod.name} (₹${prod.price})`);
    }

    console.log(`Seeding ${KUTCH_CATEGORIES.length} Kutch categories to Firestore...`);
    for (const cat of KUTCH_CATEGORIES) {
      const catRef = doc(db, 'categories', cat.id);
      await setDoc(catRef, cat, { merge: true });
      console.log(` - Saved category: ${cat.name}`);
    }

    console.log(`Seeding ${KUTCH_BANNER_SLIDES.length} banner slides to Firestore...`);
    for (const slide of KUTCH_BANNER_SLIDES) {
      const slideRef = doc(db, 'slides', String(slide.id));
      await setDoc(slideRef, slide, { merge: true });
      console.log(` - Saved slide: ${slide.titleLine1}`);
    }

    const settingsRef = doc(db, 'settings', 'store_config');
    await setDoc(settingsRef, {
      announcementText: '🌟 100% Authentic Kutch Handicrafts & Heritage Products • Worldwide Shipping',
      currency: 'INR',
    }, { merge: true });

    console.log('\n✅ All authentic Kutch heritage products, categories, and slides successfully uploaded to Firebase Firestore!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding to Firebase:', error);
    process.exit(1);
  }
}

runSeed();
