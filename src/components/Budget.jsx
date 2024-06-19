// Importa React e i suoi hook useState e useEffect
import React, { useState, useEffect } from 'react';
// Importa le funzioni doc, getDoc e setDoc da Firebase Firestore
import { doc, getDoc, setDoc } from 'firebase/firestore';
// Importa useNavigate da React Router per la navigazione tra pagine
import { useNavigate } from 'react-router-dom';
// Importa il database e l'autenticazione da Firebase
import { auth, db } from './firebase';

//importo lo stile CSS del componente Budget
import './Budget.css'

//Definisco il componente Budget, per la gestione e visualizzazione del Budget e RemainingBudget
const Budget = () => {
  //Definizione degli stati utilizzati nel componente
  // Stato per il budget, inizialmente ''
  const [budget, setBudget] = useState('');
  // Stato per il totale delle spese, inizialmente a 0
  const [totalAmount, setTotalAmount] = useState(0);
  // Stato per il totale delle entrate
  const [totalIncome, setTotalIncome] = useState(0);
  // Stato per il Budget rimanente inizialmente nullo
  const [remainingBudget, setRemainingBudget] = useState(null);
  // Stato per il caricamento
  const [loading, setLoading] = useState(true);
  // Stato per la modalità di modifica del budget (edit)
  const [editMode, setEditMode] = useState(false);

  // Hook per la navigazione
  const navigate = useNavigate();

  // useEffect per recuperare i dati dell'utente da Firestore al montaggio del componente
  useEffect(() => {
    const fetchData = async () => {
      try {
        const user = auth.currentUser;
        if (user) {
          const docRef = doc(db, 'users', user.uid);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            const data = docSnap.data();
            setBudget(data.budget || '');
            setTotalAmount(data.totalAmount || 0);
            setTotalIncome(data.totalIncome || 0);
            if (data.budget !== undefined && data.totalAmount !== undefined && data.totalIncome !== undefined) {
              calculateRemainingBudget(data.budget || 0, data.totalAmount || 0, data.totalIncome || 0);
            }
          } else {
            console.log("No such document!");
          }
        }
      } catch (error) {
        console.error('Errore durante il recupero dei dati da Firestore:', error);
      }
      // Imposta lo stato del caricamento a false, per dire che i dati sono stati caricati
      setLoading(false);
    };

    fetchData();

    // Imposta un listener per i cambiamenti dello stato di autenticazione
    const unsubscribe = auth.onAuthStateChanged((user) => {
      fetchData();
    });

    // Cleanup del listener al dismount del componente
    return () => unsubscribe();
  }, []);


  // useEffect per salvare i dati su Firestore ogni volta che budget, totalAmount o totalIncome cambiano
  useEffect(() => {
    if (!loading) {
      const saveData = async () => {
        const user = auth.currentUser;
        if (user) {
          const docRef = doc(db, 'users', user.uid);
          await setDoc(docRef, {
            budget,
            totalAmount,
            totalIncome
          }, { merge: true });
          
          // Dopo aver salvato il nuovo budget, ricalcola e salva il remainingBudget
          calculateRemainingBudget(Number(budget), totalAmount, totalIncome);
        }
      };
      saveData();
    }
  }, [budget, totalAmount, totalIncome, loading]);

  const calculateRemainingBudget = (newBudget, newTotalAmount, newTotalIncome) => {
    const newRemainingBudget = newBudget + newTotalIncome - newTotalAmount;
    setRemainingBudget(newRemainingBudget);
    updateRemainingBudgetInFirestore(newRemainingBudget);
  };

  const updateRemainingBudgetInFirestore = async (newRemainingBudget) => {
    const user = auth.currentUser;
    if (user) {
      const docRef = doc(db, 'users', user.uid);
      await setDoc(docRef, { remainingBudget: newRemainingBudget }, { merge: true });
    }
  };

  // Funzione per gestire il clic sul pulsante di modifica
  const handleEditClick = () => {
    // Imposta lo stato di modifica a true, attiva la modalità di modifica
    setEditMode(true);
  };

  // Funzione per gestire il clic sul pulsante di salvataggio
  const handleSaveClick = () => {
    // Imposta lo stato di modifica a false, disattiva la modalità di modifica, scompare l'input dell'edit
    setEditMode(false);
  };

  // Funzione per gestire il clic sul pulsante di ritorno alla home
  const handleHomeClick = () => {
    // Se premuto ritorna alla homepage
    navigate('/homepage');
  }

  // Se è in corso il caricamento, visualizza un messaggio di caricamento
  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="budget-container">
      <h2>Budget: {budget} $</h2>
      {editMode ? (
        <div>
          <input
            type="number"
            value={budget}
            onChange={(e) => setBudget(e.target.value)}
            placeholder='Budget...'
            
          />
          <button id="save-button" onClick={handleSaveClick}>Save</button>
        </div>
      ) : (
        <button id="edit-button" onClick={handleEditClick}>Edit Budget</button>
      )}
      <h2>Remaining Budget: {remainingBudget} $</h2>
      <button id="home-button-budget" onClick={handleHomeClick}>Home</button>
    </div>
  );
};

export default Budget;
