import { getApps, getApp, initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDeC3OX0ZNkWO1-wZgprbP-j73XnOp1QdQ",
  authDomain: "blaze-plan-account.firebaseapp.com",
  databaseURL:
    "https://blaze-plan-account-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "blaze-plan-account",
  storageBucket: "blaze-plan-account.appspot.com",
  messagingSenderId: "258048658228",
  appId: "1:258048658228:web:0964cfd34babde57657361",
  measurementId: "G-ZQWFNN1F5P",
};

// Initialize Firebase
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);

export { db, storage };
