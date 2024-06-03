import React, { useState, useEffect } from 'react';
import IncomeItem from './IncomeItem';
import './IncomeList.css';

const IncomeList = ({ incomes, deleteIncome }) => {
  const [sortOrderDate, setSortOrderDate] = useState('DESC');
  const [sortOrderAmount, setSortOrderAmount] = useState('none');
  const [sortOrderTitle, setSortOrderTitle] = useState('none');
  const [sortedIncomes, setSortedIncomes] = useState([]);

  useEffect(() => {
    // Ordina le entrate all'avvio e quando cambiano le entrate
    const sortData = () => {
      const sortedData = [...incomes].sort((a, b) => {
        // Ordina per data in ordine crescente
        return new Date(a.date) - new Date(b.date);
      });
      setSortedIncomes(sortedData.reverse()); // Inverti l'ordine dopo l'ordinamento
    };
  
    sortData();
  }, [incomes]); // Esegui l'effetto quando le entrate cambiano
  

  useEffect(() => {
    const sortData = () => {
      const sortedData = [...incomes].sort((a, b) => {
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
      setSortedIncomes(sortedData);
    };

    sortData();
  }, [incomes, sortOrderDate, sortOrderAmount, sortOrderTitle]);

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
    <div className="incomes-list">
      <h2>Incomes List</h2>
      <div className="income-list-scrollable">
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
            {sortedIncomes.map((income, index) => (
              <IncomeItem
                key={index}
                index={index}
                income={income}
                deleteIncome={deleteIncome}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default IncomeList;
