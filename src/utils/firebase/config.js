import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAGL19lzx4yazD6MlZGnqaAbqvCS5PZHAE",
  authDomain: "taskboard-1dc41.firebaseapp.com",
  projectId: "taskboard-1dc41",
  storageBucket: "taskboard-1dc41.firebasestorage.app",
  messagingSenderId: "803801454650",
  appId: "1:803801454650:web:a9585395b984a0f7a3fd03",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };
