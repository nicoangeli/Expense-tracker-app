// importo React e gli hook useEffect e useState
import React, { useEffect, useState } from 'react';
// importo le funzioni per l'utilizzo di firebase firestone
import { doc, getDoc, setDoc } from 'firebase/firestore';
//importa database e autenticazione
import { db, auth } from './firebase';


//Definizione del componente RemainingBudget per calcolare il Budget rimanente
const RemainingBudget = () => {
  //definisce lo stato  del remainingbudget e una funzione per aggiornarlo, inizialmente a 0
  const [remainingBudget, setRemainingBudget] = useState(0);

  // Useeffect per eseguire il codice al montaggio del componente
  useEffect(() => {
    // Funzione asincrona per recuperare i dati dell'utente 
    const fetchUserData = async () => {
      //ottiene l'utente autenticato 
      const user = auth.currentUser;
      // se c'è un utente autenticato
      if (user) {
        // riferimento al documento dell'utente autenticato
        const docRef = doc(db, 'users', user.uid);
        try {
          // recupero il documento dell'utente
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            // Se il documento esiste ottengo i dati
            const userData = docSnap.data();
            const budget = userData.budget || 0; // Budget
            const totalAmount = userData.totalAmount || 0; //TotaleSpese
            const totalIncome = userData.totalIncome || 0; //TotaleEntrate
            // Calcolo del budget rimanente
            const remainingBudgetValue = Number(budget) + Number(totalIncome) - Number(totalAmount);
            // Se il valore calcolato è valido
            if (!isNaN(remainingBudgetValue)) {
              // aggiorna lo stato
              setRemainingBudget(remainingBudgetValue);
              // salva il valore in firestone
              saveRemainingBudgetToFirestore(remainingBudgetValue);
            } else {
              console.error("Invalid remaining budget value:", remainingBudgetValue);
            }
          } else {
            console.log("No such document!");
          }
        } catch (error) {
          console.error("Error fetching user data from Firestore:", error);
        }
      }
    };
    
    // chiamo la funzione per recuperare i dati dell'utente
    fetchUserData();
    // L'array vuoto [] significa che questo useEffect viene eseguito solo una volta al montaggio del componente
  }, []);

  // Funzione per salvare il budget rimanente sul database firestone
  const saveRemainingBudgetToFirestore = async (remainingBudget) => {
    const user = auth.currentUser;
    if (user) {
      const docRef = doc(db, 'users', user.uid);
      try {
        // Salva il budget rimanente nel documento dell'utente, unendo con i dati esistenti
        await setDoc(docRef, { remainingBudget }, { merge: true });
        console.log("Remaining budget saved to Firestore:", remainingBudget);
      } catch (error) {
        console.error("Error saving remaining budget to Firestore:", error);
      }
    }
  };

  // render del componente
  return (
    <div className="remaining-budget">
      <h2>Remaining Budget: {remainingBudget} $</h2>
    </div>
  );
};

export default RemainingBudget;