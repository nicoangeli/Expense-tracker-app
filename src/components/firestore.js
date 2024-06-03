import { db } from './firebase';
import { collection, doc, setDoc, getDoc, updateDoc, arrayUnion } from 'firebase/firestore';

// Funzione per creare il profilo utente
export const createUserProfile = async (user) => {
  try {
    const userRef = doc(db, 'users', user.uid);
    await setDoc(userRef, {
      email: user.email,
      budget: 0,
      totalAmount: 0,
      expenses: [],
      remainingBudget: 0,
      createdAt: new Date()
    });
  } catch (error) {
    console.error('Error creating user profile:', error);
  }
};

// Funzione per aggiornare il profilo utente
export const updateUserProfile = async (userId, data) => {
  try {
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, data);
  } catch (error) {
    console.error('Error updating user profile:', error);
  }
};

// Funzione per aggiungere una spesa
export const addExpense = async (userId, expense) => {
  try {
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, {
      expenses: arrayUnion(expense),
      totalAmount: expense.amount,
      remainingBudget: newValue => newValue.budget - newValue.totalAmount
    });
  } catch (error) {
    console.error('Error adding expense:', error);
  }
};

// Funzione per ottenere il profilo utente
export const getUserProfile = async (userId) => {
  try {
    const userRef = doc(db, 'users', userId);
    const userDoc = await getDoc(userRef);
    if (userDoc.exists()) {
      return userDoc.data();
    } else {
      console.log('No such document!');
      return null;
    }
  } catch (error) {
    console.error('Error getting user profile:', error);
  }
};
