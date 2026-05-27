import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDw2mm-Vj-eoW3jAgaIpbI8FrmlbqmuzIY",
  authDomain: "filmes-beadando.firebaseapp.com",
  projectId: "filmes-beadando",
  storageBucket: "filmes-beadando.firebasestorage.app",
  messagingSenderId: "533056657446",
  appId: "1:533056657446:web:f2bb08f5da2be8c22baee7",
  measurementId: "G-RWH7RP7EF1"
};

// Firebase inicializálása
const app = initializeApp(firebaseConfig);

// Az adatbázis elérése és exportálása
export const db = getFirestore(app);