// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBunc5g8G4kBoDmOP9lB70fk_eNnsFdvro",
  authDomain: "photofolio-baa8a.firebaseapp.com",
  projectId: "photofolio-baa8a",
  storageBucket: "photofolio-baa8a.appspot.com",
  messagingSenderId: "521040769123",
  appId: "1:521040769123:web:0b52c71252003130ee0856",
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp);

export { db };
