import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getAuth } from "firebase/auth";
import { getMessaging } from "firebase/messaging";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

const app = initializeApp(firebaseConfig);

export const db = getDatabase(app);
export const auth = getAuth(app);

// ✅ Safe messaging
let messaging: any = null;
if (typeof window !== 'undefined' && 'Notification' in window) {
  try {
    messaging = getMessaging(app);
  } catch {
    console.log("Messaging not supported");
  }
}
export { messaging };

// 🔥 Players with emojis
export const PLAYERS = [
  { id: 'sai', name: 'Sai Pavan', short: 'SP', emoji: '👑', color: '#FF6B00', bg: '#FF6B0020', phone: '918125925934' },
  { id: 'kar', name: 'Karthik', short: 'KC', emoji: '🦊', color: '#4CAF50', bg: '#4CAF5020', phone: '919849834485' },
  { id: 'var', name: 'Vaibhav', short: 'VB', emoji: '🦅', color: '#2196F3', bg: '#2196F320', phone: '919392488585' },
  { id: 'cha', name: 'Charan', short: 'CH', emoji: '🦁', color: '#9C27B0', bg: '#9C27B020', phone: '917013894469' },
];

export const ADMIN_EMAIL = 'vaibhavkapilkanuru@gmail.com';