// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyByyrrxyiJ0mCYfBtTm6Q0lxM9IIZ8FBwM",
  authDomain: "fanpuri-107aa.firebaseapp.com",
  projectId: "fanpuri-107aa",
  storageBucket: "fanpuri-107aa.firebasestorage.app",
  messagingSenderId: "435377399049",
  appId: "1:435377399049:web:ff2aa9bba5efd57db15fd8",
  measurementId: "G-G41BC6BHT7"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export { app, auth, provider }; 