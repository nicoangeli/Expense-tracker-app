// src/components/ExpenseList.jsx
import React, { useState, useEffect } from 'react';
import ExpenseItem from './ExpenseItem'; // Import ExpenseItem per rappresentare un singolo elemento della lista
import './ExpenseList.css'; // Assicurati di avere un file CSS per gestire gli stili

// Componente ExpenseList
// Prende due props : expenses = array oggetti spesa, funzione per eliminare una spesa dalla lista
const ExpenseList = ({ expenses, deleteExpense }) => {
  const [sortOrderDate, setSortOrderDate] = useState('DESC');
  const [sortOrderAmount, setSortOrderAmount] = useState('none');
  const [sortOrderTitle, setSortOrderTitle] = useState('none');
  const [sortedExpenses, setSortedExpenses] = useState([]);

  useEffect(() => {
    // Ordina le spese all'avvio e quando cambiano le spese
    const sortData = () => {
      const sortedData = [...expenses].sort((a, b) => {
        // Ordina per data in ordine crescente
        return new Date(a.date) - new Date(b.date);
      });
      setSortedExpenses(sortedData.reverse()); // Inverti l'ordine dopo l'ordinamento
    };
  
    sortData();
  }, [expenses]); // Esegui l'effetto quando le spese cambiano
  
  useEffect(() => {
    const sortData = () => {
      const sortedData = [...expenses].sort((a, b) => {
        if (sortOrderTitle !== 'none') {
          return sortOrderTitle === 'ASC' ? a.title.localeCompare(b.title) : b.title.localeCompare(a.title);
        } else if (sortOrderAmount !== 'none') {
          return sortOrderAmount === 'ASC' ? a.amount - b.amount : b.amount - a.amount;
        } else if (sortOrderDate !== 'none') {
          const dateA = new Date(a.date);
          const dateB = new Date(b.date);
          return sortOrderDate === 'ASC' ? dateA - dateB : dateB - dateA;
        }
      });
      setSortedExpenses(sortedData);
    };

    sortData();
  }, [expenses, sortOrderDate, sortOrderAmount, sortOrderTitle]);

  const handleSortTitle = () => {
    setSortOrderTitle(sortOrderTitle === 'ASC' ? 'DESC' : 'ASC');
    setSortOrderAmount('none'); // Resetta l'ordinamento dell'importo
    setSortOrderDate('none'); // Resetta l'ordinamento della data
  };

  const handleSortAmount = () => {
    setSortOrderAmount(sortOrderAmount === 'ASC' ? 'DESC' : 'ASC');
    setSortOrderTitle('none'); // Resetta l'ordinamento del titolo
    setSortOrderDate('none'); // Resetta l'ordinamento della data
  };

  const handleSortDate = () => {
    setSortOrderDate(sortOrderDate === 'ASC' ? 'DESC' : 'ASC');
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
