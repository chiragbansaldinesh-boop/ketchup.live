import { initializeApp } from "firebase/app";
import { 
  getAuth, 
  initializeAuth, 
  getReactNativePersistence 
} from "firebase/auth";

import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// AsyncStorage only works in native (Android/iOS), so import safely
import AsyncStorage from "@react-native-async-storage/async-storage";

// --- Your Firebase Config ---
const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY || "your-api-key",
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN || "ketchup-live.firebaseapp.com",
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID || "ketchup-live",
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET || "ketchup-live.appspot.com",
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "123456789",
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID || "1:123456789:web:abcdef123456",
  measurementId: process.env.EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID || "G-XXXXXXXXXX"
};

// --- Initialize Firebase ---
const app = initializeApp(firebaseConfig);

// --- Authentication ---
// On native (iOS/Android) → use AsyncStorage persistence
// On web → fallback to normal getAuth
let auth;
if (typeof window === "undefined") {
  // Native (no window object)
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage),
  });
} else {
  // Web
  auth = getAuth(app);
}

// --- Firestore & Storage ---
const db = getFirestore(app);
const storage = getStorage(app);

export { app, auth, db, storage };