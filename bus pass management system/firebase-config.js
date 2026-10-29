// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDQ_tgeUBQTgv1UyZVCS7o7jFYIe7W1AOw",
  authDomain: "bus-management-65287.firebaseapp.com",
  projectId: "bus-management-65287",
  storageBucket: "bus-management-65287.firebasestorage.app",
  messagingSenderId: "277374926822",
  appId: "1:277374926822:web:37d8cb414dab4e0bbee027",
  measurementId: "G-YY0L7L06N7"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };
