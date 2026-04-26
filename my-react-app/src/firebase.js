import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDlhVtj4OE6Km-7REGhW3D-CeRe7YGUSYg",
  authDomain: "web-arsen-horobets.firebaseapp.com",
  projectId: "web-arsen-horobets",
  storageBucket: "web-arsen-horobets.firebasestorage.app",
  messagingSenderId: "948919831970",
  appId: "1:948919831970:web:b6481a8ba6a0abae0bf6fb",
  measurementId: "G-KVGBWTN88F"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);