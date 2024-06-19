// src/components/ExpenseList.jsx
import React, { useState, useEffect } from 'react';
import ExpenseItem from './ExpenseItem'; // Import ExpenseItem per rappresentare un singolo elemento della lista
import './ExpenseList.css'; // Assicurati di avere un file CSS per gestire gli stili

// Componente ExpenseList, per creare la tabella delle spese e la sua visualizzazione
// Prende due props (proprietà) : expenses = array oggetti spesa, deleteExpense: funzione per eliminare una spesa dalla lista
const ExpenseList = ({ expenses, deleteExpense }) => {
  // Stati per gestire l'ordinamento della lista
  const [sortOrderDate, setSortOrderDate] = useState('DESC'); // Ordinamento per data, default discendente
  const [sortOrderAmount, setSortOrderAmount] = useState('none'); // Ordinamento per amount, default non attivo
  const [sortOrderTitle, setSortOrderTitle] = useState('none'); // Ordinamento per titolo, default non attivo
  const [sortedExpenses, setSortedExpenses] = useState([]); // Stato per le spese ordinate

  // useEffect per ordinare le spese in base alla data all'avvio e quando cambiano le spese
  // All'avvio le spese vengono ordinate per data dalla più recente alla meno recente
  useEffect(() => {
    // Ordina le spese all'avvio e quando cambiano le spese per data
    const sortData = () => {
      const sortedData = [...expenses].sort((a, b) => {
        // Ordina per data in ordine crescente
        return new Date(a.date) - new Date(b.date);
      });
      setSortedExpenses(sortedData.reverse()); // Inverti l'ordine dopo l'ordinamento
    };
  
    sortData(); //Chiamata della funzione di ordinamento
  }, [expenses]); // Esegui l'effetto quando le spese cambiano, viene aggiunta o eliminata una spesa
  
  // useEffect per ordinare le spese in base al titolo, all'importo o alla data
  useEffect(() => {
    const sortData = () => {
      const sortedData = [...expenses].sort((a, b) => { //crea una copia dell'array, e ordina l'array in base alla funzione di ordinamento passata
        // Ordinamento per titolo
        if (sortOrderTitle !== 'none') {
          return sortOrderTitle === 'ASC' ? a.title.localeCompare(b.title) : b.title.localeCompare(a.title);
        } 
        // Ordinamento per amount
        else if (sortOrderAmount !== 'none') {
          return sortOrderAmount === 'ASC' ? a.amount - b.amount : b.amount - a.amount;
        }
        // Ordinamento per data 
        else if (sortOrderDate !== 'none') {
          const dateA = new Date(a.date);
          const dateB = new Date(b.date);
          return sortOrderDate === 'ASC' ? dateA - dateB : dateB - dateA;
        }
      });
      setSortedExpenses(sortedData); // Imposta le spese ordinate nello stato
    };

    sortData(); // Chiamo la funzione di ordinamento
  }, [expenses, sortOrderDate, sortOrderAmount, sortOrderTitle]); // Esegui l'effetto quando cambiano le spese o gli ordini di ordinamento

  // Funzione per gestire l'ordinamento in base al Titolo, quando si clicca sul titolo della colonna
  const handleSortTitle = () => {
    setSortOrderTitle(sortOrderTitle === 'ASC' ? 'DESC' : 'ASC'); // Cambia l'ordine del titolo tra ascendente e discendente
    setSortOrderAmount('none'); // Resetta l'ordinamento dell'importo
    setSortOrderDate('none'); // Resetta l'ordinamento della data
  };

  // Funzione per gestire l'ordinamento in base al Amount
  const handleSortAmount = () => {
    setSortOrderAmount(sortOrderAmount === 'ASC' ? 'DESC' : 'ASC');// Cambia l'ordine del titolo tra ascendente e discendente
    setSortOrderTitle('none'); // Resetta l'ordinamento del titolo
    setSortOrderDate('none'); // Resetta l'ordinamento della data
  };

  // Funzione per gestire l'ordinamento in base alla Data
  const handleSortDate = () => {
    setSortOrderDate(sortOrderDate === 'ASC' ? 'DESC' : 'ASC');// Cambia l'ordine del titolo tra ascendente e discendente
    setSortOrderTitle('none'); // Resetta l'ordinamento del titolo
    setSortOrderAmount('none'); // Resetta l'ordinamento dell'importo
  };

  return (
    // Div che contiene tutti gli elementi della spesa
    <div className="expenses-list">
      <h2>Expenses List</h2>
      <div className="expense-list-scrollable">
        <table>
          <thead>
            {/* Intestazione della tabella */}
            <tr>
              <th>Category</th>
              <th style={{ cursor: 'pointer' }} onClick={handleSortTitle}>
                Title {sortOrderTitle !== 'none' ? (sortOrderTitle === 'ASC' ? ' ↑ ' : ' ↓ ') : ''}
              </th>
              <th style={{ cursor: 'pointer' }} onClick={handleSortAmount}>
                Amount {sortOrderAmount !== 'none' ? (sortOrderAmount === 'ASC' ? ' ↑ ' : ' ↓ ') : ''}
              </th>
              <th style={{ cursor: 'pointer' }} onClick={handleSortDate}>
                Date {sortOrderDate !== 'none' ? (sortOrderDate === 'ASC' ? ' ↑ ' : ' ↓ ') : ''}
              </th>
              <th>Delete</th>
            </tr>
          </thead>
          <tbody>
            {/* Mappa delle spese ordinate e creazione di un componente ExpenseItem per ogni spesa */}
            {/* vengono passati i dati della spesa e la funzione deleteExpense */}
            {sortedExpenses.map((expense, index) => (
              <ExpenseItem
                key={index}
                index={index}
                expense={expense}
                deleteExpense={deleteExpense}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ExpenseList;
