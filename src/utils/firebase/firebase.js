// src/utils/firebase/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Конфігурація для автентифікації
const authConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_AUTH_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_AUTH_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_AUTH_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_AUTH_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_AUTH_APP_ID,
};

// Конфігурація для бази даних завдань
const tasksConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_TASKS_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_TASKS_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_TASKS_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_TASKS_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_TASKS_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_TASKS_APP_ID,
};

// Ініціалізація першого додатку (автентифікація)
const authApp = initializeApp(authConfig, "authApp");
export const auth = getAuth(authApp);

// Ініціалізація другого додатку (завдання)
const tasksApp = initializeApp(tasksConfig, "tasksApp");
export const db = getFirestore(tasksApp);
