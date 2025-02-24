import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyD3fKnhvyVNEWgE6lmgRtVsBZFSBjJdOOA",
    authDomain: "project-finalmbw.firebaseapp.com",
    projectId: "project-finalmbw",
    storageBucket: "project-finalmbw.firebasestorage.app",
    messagingSenderId: "742173296191",
    appId: "1:742173296191:web:91474e78e2c39275725a8a",
    measurementId: "G-MNXL2CMT5S"
  };

// เริ่มต้น Firebase
const app = initializeApp(firebaseConfig);

// เชื่อมต่อ Firestore Database
const db = getFirestore(app);

export { db };