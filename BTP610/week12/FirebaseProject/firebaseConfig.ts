// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";




// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD5Gzdll1TFm2X719Y2qzk20RzwC4QvYPM",
  authDomain: "goodreadclub-class.firebaseapp.com",
  projectId: "goodreadclub-class",
  storageBucket: "goodreadclub-class.firebasestorage.app",
  messagingSenderId: "329498545049",
  appId: "1:329498545049:web:435b6a6073b8791051a108",
  measurementId: "G-KLZBBWJNZ7"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const firebaseAuth=getAuth(app); //returns the Auth service- used for sign up, sign in, sign out
const fireDB=getFirestore(app); //returns the Firestore database- used for reading and writing data

export { app, firebaseAuth, fireDB };
