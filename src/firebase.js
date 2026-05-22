// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBjzEeDWTWWuF9HVAzX7e3nDjsCuvBXkqM",
  authDomain: "docappoint-firebase.firebaseapp.com",
  projectId: "docappoint-firebase",
  storageBucket: "docappoint-firebase.firebasestorage.app",
  messagingSenderId: "222431043621",
  appId: "1:222431043621:web:b97ef006280de62d159fcc"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

export default app;