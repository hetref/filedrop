import { getApps, getApp, initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyArsmp3kgpwSKccuU-7TFXiixLhaTM24zg",
  authDomain: "filedrop-a311b.firebaseapp.com",
  projectId: "filedrop-a311b",
  storageBucket: "filedrop-a311b.appspot.com",
  messagingSenderId: "67610513511",
  appId: "1:67610513511:web:4683ff54d5748128abc4c2",
  measurementId: "G-L5HKXHJ4Y2",
};

// Initialize Firebase
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);

export { db, storage };
