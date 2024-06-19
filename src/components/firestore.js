// // import dell'istanza inizializzata del database firestone 
// import { db } from './firebase';
// // funzioni importare per manipolare i documenti nel database
// import { collection, doc, setDoc, getDoc, updateDoc, arrayUnion } from 'firebase/firestore';

// // Funzione asincrona per creare il profilo utente
// export const createUserProfile = async (user) => {
//   try {
//     const userRef = doc(db, 'users', user.uid); //crea un riferimento al documento dell'utente dentro la collezione users usando l'id utente
//     // creo i imposto il documento con i dati dell'utente
//     await setDoc(userRef, {
//       email: user.email,
//       budget: 0,
//       totalAmount: 0,
//       expenses: [],
//       remainingBudget: 0,
//       createdAt: new Date()
//     });
//   } catch (error) {
//     // in caso di errore stampa un messaggio sulla console
//     console.error('Error creating user profile:', error);
//   }
// };

// // Funzione asincrona per aggiornare il profilo utente
// export const updateUserProfile = async (userId, data) => {
//   try {
//     const userRef = doc(db, 'users', userId); //crea un riferimento al documento dell'utente dentro la collezione users usando l'id utente
//     await updateDoc(userRef, data); //aggiorna i documenti con i dati forniti
//   } catch (error) {
//     // in caso di errore stampa un messaggio sulla console
//     console.error('Error updating user profile:', error);
//   }
// };

// // Funzione per aggiungere una spesa
// export const addExpense = async (userId, expense) => {
//   try {
//     const userRef = doc(db, 'users', userId);
//     await updateDoc(userRef, {
//       expenses: arrayUnion(expense),
//       totalAmount: expense.amount,
//       remainingBudget: newValue => newValue.budget - newValue.totalAmount
//     });
//   } catch (error) {
//     console.error('Error adding expense:', error);
//   }
// };

// // Funzione per ottenere il profilo utente
// export const getUserProfile = async (userId) => {
//   try {
//     const userRef = doc(db, 'users', userId);
//     const userDoc = await getDoc(userRef);
//     if (userDoc.exists()) {
//       return userDoc.data();
//     } else {
//       console.log('No such document!');
//       return null;
//     }
//   } catch (error) {
//     console.error('Error getting user profile:', error);
//   }
// };
