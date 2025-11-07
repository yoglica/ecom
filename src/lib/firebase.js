// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCuOCyPrxNT7_2H4tpA-a14lzueS8W0fac",
  authDomain: "ecom-b28e4.firebaseapp.com",
  projectId: "ecom-b28e4",
  storageBucket: "ecom-b28e4.firebasestorage.app",
  messagingSenderId: "441307020295",
  appId: "1:441307020295:web:dcfc70a8a23c7d36e9bea2",
  measurementId: "G-7JWG3G63FR"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app); 
export const db = getFirestore(app); 
export const storage = getStorage(app);