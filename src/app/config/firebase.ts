import { initializeApp } from "firebase/app";
import "firebase/firestore";
import "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import "firebase/storage";
import "firebase/database";
import { getStorage } from "firebase/storage";
import { getDatabase } from "firebase/database";
// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "revents-26acd.firebaseapp.com",
  projectId: "revents-26acd",
  storageBucket: "revents-26acd.firebasestorage.app",
  messagingSenderId: "67948873303",
  appId: "1:67948873303:web:3432dd3a500a3241634512",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);
export const fb = getDatabase(app);
