import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBgw4I4ljJ9HqGcngNT0FsffGSQ7FGEIiE",
  authDomain: "stock-monitor-8ac87.firebaseapp.com",
  projectId: "stock-monitor-8ac87",
  storageBucket: "stock-monitor-8ac87.firebasestorage.app",
  messagingSenderId: "83844887395",
  appId: "1:83844887395:web:d142c921ce377581b21956"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);