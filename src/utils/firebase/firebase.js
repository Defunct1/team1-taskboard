import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Конфігурація для автентифікації (taskboard-1dc41)
const authConfig = {
  apiKey: "AIzaSyAGL19lzx4yazD6MlZGnqaAbqvCS5PZHAE",
  authDomain: "taskboard-1dc41.firebaseapp.com",
  projectId: "taskboard-1dc41",
  storageBucket: "taskboard-1dc41.firebasestorage.app",
  messagingSenderId: "803801454650",
  appId: "1:803801454650:web:a9585395b984a0f7a3fd03",
};

// Конфігурація для даних завдань (cardandsqaure)
const tasksConfig = {
  apiKey: "AIzaSyDmut_9cU45O4_vyh2hXxrqFmRskNTSMr4",
  authDomain: "cardandsqaure.firebaseapp.com",
  projectId: "cardandsqaure",
  storageBucket: "cardandsqaure.firebasestorage.app",
  messagingSenderId: "84251171649",
  appId: "1:84251171649:web:3397c782d0e10eae13dfc0",
};

// Ініціалізація першого додатку (для автентифікації)
const authApp = initializeApp(authConfig, "authApp");
export const auth = getAuth(authApp);

// Ініціалізація другого додатку (для завдань)
const tasksApp = initializeApp(tasksConfig, "tasksApp");
export const db = getFirestore(tasksApp); // База даних для карток завдань