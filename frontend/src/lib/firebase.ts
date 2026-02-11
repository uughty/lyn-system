import { initializeApp } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBDkLGxL9qudbp4vebmGxHoH8VpNJUCWuc",
  authDomain: "lyn-system.firebaseapp.com",
  projectId: "lyn-system",
  storageBucket: "lyn-system.firebasestorage.app",
  messagingSenderId: "873635991331",
  appId: "1:873635991331:web:6caaa4faa35aaa74f08696",
  measurementId: "G-G2L3042X19"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);

if (typeof window !== "undefined") {
  isSupported().then((yes) => {
    if (yes) {
      getAnalytics(app);
    }
  });
}
