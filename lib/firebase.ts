import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyC00NkVdnQ83Ki7arDF8zklDzr3x2ijZzc",
    authDomain: "yo-te-importo.firebaseapp.com",
    projectId: "yo-te-importo",
    storageBucket: "yo-te-importo.firebasestorage.app",
    messagingSenderId: "250693725462",
    appId: "1:250693725462:web:4c10a216f6898578bcf437",
    measurementId: "G-EDKED26D57"
};

// Initialize Firebase (singleton pattern to avoid re-initialization errors in Next.js)
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };
