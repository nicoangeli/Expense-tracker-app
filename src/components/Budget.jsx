import React, { useState, useEffect } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { auth, db } from './firebase';

import './Budget.css'

const Budget = () => {
  const [budget, setBudget] = useState('');
  const [totalAmount, setTotalAmount] = useState(0);
  const [totalIncome, setTotalIncome] = useState(0);
  const [remainingBudget, setRemainingBudget] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);

  const navigate = useNavigate();

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
      setLoading(false);
    };

    fetchData();

    const unsubscribe = auth.onAuthStateChanged((user) => {
      fetchData();
    });

    return () => unsubscribe();
  }, []);

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

  const handleEditClick = () => {
    setEditMode(true);
  };

  const handleSaveClick = () => {
    setEditMode(false);
  };

  const handleHomeClick = () => {
    navigate('/homepage');
  }

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
