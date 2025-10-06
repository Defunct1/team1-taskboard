// src/utils/firebase/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const authConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_TASKS_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_TASKS_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_TASKS_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_TASKS_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_TASKS_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_TASKS_APP_ID,
};

const app = initializeApp(authConfig, "authApp");
export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();
