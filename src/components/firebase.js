// firebase.js
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyArSuI0RvD2BuzSsh7fPAQrByhVlridIHw",
  authDomain: "expense-tracker-webapp-e90f2.firebaseapp.com",
  databaseURL: "https://expense-tracker-webapp-e90f2-default-rtdb.firebaseio.com",
  projectId: "expense-tracker-webapp-e90f2",
  storageBucket: "expense-tracker-webapp-e90f2.appspot.com",
  messagingSenderId: "342720011472",
  appId: "1:342720011472:web:4ded5773e1862d5874d2d5",
  measurementId: "G-7R1TSLKXSN"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const googleProvider = new GoogleAuthProvider();


export { auth, db, googleProvider };

