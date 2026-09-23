import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// const firebaseConfig = {
//   apiKey: "ADD_YOUR_API_KEY",
//   authDomain: "ADD_YOUR_AUTH_DOMAIN",
//   projectId: "ADD_YOUR_PROJECT_ID",
//   storageBucket: "ADD_YOUR_STORAGE_BUCKET",
//   messagingSenderId: "ADD_YOUR_MESSAGING_SENDER_ID",
//   appId: "ADD_YOUR_APP_ID",
// };

const firebaseConfig = {
  apiKey: "AIzaSyCt5ZLQZdXldDWXkUVphZEJAqcz1ylsKwc",
  authDomain: "btp610-56eb9.firebaseapp.com",
  projectId: "btp610-56eb9",
  storageBucket: "btp610-56eb9.firebasestorage.app",
  messagingSenderId: "586073544779",
  appId: "1:586073544779:web:4bc6a9fd3c59fdd57c55ce",
  measurementId: "G-JHE2LRY755"
};

const app = initializeApp(firebaseConfig);
const firebaseAuth = getAuth(app);
const fireDB = getFirestore(app);

export { app, firebaseAuth, fireDB };
