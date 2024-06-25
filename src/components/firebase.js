// firebase.js
// inizializza l'app con la configurazione firebase
import { initializeApp } from 'firebase/app';
// import per ottenre un'istanza del database
import { getFirestore } from 'firebase/firestore';
// import per gestire l'autenticazione con email e password e con google
import { getAuth, GoogleAuthProvider } from 'firebase/auth';

// Configurazione necessaria per collegarsi al progetto firebase specifico del progetto
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

// Inizializzazione Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const googleProvider = new GoogleAuthProvider();

// export le istanze per poter utilizzarle in altre componenti
export { auth, db, googleProvider };