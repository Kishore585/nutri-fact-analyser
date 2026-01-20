
import { initializeApp, getApp, getApps } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBQ7g6cT6F4pdisXv_nnM8qGiZMzJSHGZM",
  authDomain: "nutrifact-analyser.firebaseapp.com",
  projectId: "nutrifact-analyser",
  storageBucket: "nutrifact-analyser.firebasestorage.app",
  messagingSenderId: "206074146797",
  appId: "1:206074146797:web:e8676d2aa53971702f41e4",
  measurementId: "G-KGVBD0JS4Y"
};

// Initialize Firebase (Singleton pattern)
// This ensures that the app is only initialized once, even during hot module replacement.
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Initialize Services using the specific app instance to maintain shared registry context.
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);
const googleProvider = new GoogleAuthProvider();

// Initialize Analytics safely after checking for environment support.
let analytics: any = null;
if (typeof window !== "undefined") {
  isSupported().then(supported => {
    if (supported) {
      analytics = getAnalytics(app);
    }
  }).catch(err => {
    console.warn("Firebase Analytics skipped:", err);
  });
}

export { app, analytics, auth, db, storage, googleProvider };
