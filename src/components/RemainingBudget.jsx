import React, { useEffect, useState } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db, auth } from './firebase';

const RemainingBudget = () => {
  const [remainingBudget, setRemainingBudget] = useState(0);

  useEffect(() => {
    const fetchUserData = async () => {
      const user = auth.currentUser;
      if (user) {
        const docRef = doc(db, 'users', user.uid);
        try {
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            const userData = docSnap.data();
            const budget = userData.budget || 0;
            const totalAmount = userData.totalAmount || 0;
            const totalIncome = userData.totalIncome || 0;
            const remainingBudgetValue = Number(budget) + Number(totalIncome) - Number(totalAmount);
            if (!isNaN(remainingBudgetValue)) {
              setRemainingBudget(remainingBudgetValue);
              saveRemainingBudgetToFirestore(remainingBudgetValue);
            } else {
              console.error("Invalid remaining budget value:", remainingBudgetValue);
            }
          } else {
            console.log("No such document!");
          }
        } catch (error) {
          console.error("Error fetching user data from Firestore:", error);
          // Gestione degli errori qui
        }
      }
    };
    

    fetchUserData();
  }, []);

  const saveRemainingBudgetToFirestore = async (remainingBudget) => {
    const user = auth.currentUser;
    if (user) {
      const docRef = doc(db, 'users', user.uid);
      try {
        await setDoc(docRef, { remainingBudget }, { merge: true });
        console.log("Remaining budget saved to Firestore:", remainingBudget);
      } catch (error) {
        console.error("Error saving remaining budget to Firestore:", error);
        // Gestione degli errori qui
      }
    }
  };

  return (
    <div className="remaining-budget">
      <h2>Remaining Budget: {remainingBudget} $</h2>
    </div>
  );
};

export default RemainingBudget;