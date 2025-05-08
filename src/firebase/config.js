// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDz3_YhLAAz5pj5AoTCxyEmjpuX7vdgT4g",
  authDomain: "learnfirebase-de34d.firebaseapp.com",
  projectId: "learnfirebase-de34d",
  storageBucket: "learnfirebase-de34d.firebasestorage.app",
  messagingSenderId: "811337965770",
  appId: "1:811337965770:web:ff3fc1f0bafe69022cd433"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const db = getFirestore(app);

export { db };