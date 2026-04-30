import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getAuth } from "firebase/auth";
import { getMessaging } from "firebase/messaging";

const firebaseConfig = {
  apiKey: "AIzaSyDSrPok0eBRCMeTM2s1wKvWWPqt4SQvLr4",
  authDomain: "ipl-predictions-a5f10.firebaseapp.com",
  databaseURL: "https://ipl-predictions-a5f10-default-rtdb.firebaseio.com",
  projectId: "ipl-predictions-a5f10",
  storageBucket: "ipl-predictions-a5f10.firebasestorage.app",
  messagingSenderId: "824242512776",
  appId: "1:824242512776:web:f27d80519805b0cb1c503d"
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