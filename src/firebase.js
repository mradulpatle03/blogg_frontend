// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "mern-blog-be240.firebaseapp.com",
  projectId: "mern-blog-be240",
  storageBucket: "mern-blog-be240.firebasestorage.app",
  messagingSenderId: "994465419583",
  appId: "1:994465419583:web:7f543b040f28ca657f438a"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);