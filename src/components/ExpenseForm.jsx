// src/components/ExpenseForm.jsx
import React, { useState } from 'react'; //useState per gestire lo stato locale del componente
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCirclePlus } from '@fortawesome/free-solid-svg-icons';

//import del componente CSS di ExpenseForm
import './ExpenseForm.css'

//Componente ExpenseForm, a cui viene passata come proprietà addExpense dal componente genitore Expenses che utilizza ExpenseForm
const ExpenseForm = ({ addExpense }) => { //Prende una funzione per aggiungere una nuova spesa alla lista delle spese
  //Inizializzazione degli stati locali, per la specifica della spesa
  //category = stato per la cetegoria della spesa, inizialmente 'Food & Beverage'
  //setCategory = funzione per aggiornare lo stato category
  const [category, setCategory] = useState('Food & Beverage');
  //amount = stato che memorizza l'importo inizialmente 0
  //setAmount = funzione per aggiornare lo stato amount
  const [amount, setAmount] = useState('');
  //date = stato che memorizza la data della spesa inizialmente stringa vuota
  //setDate = funzione per aggiornare lo stato date
  const [date, setDate] = useState('');
  //title = stato per memorizzare il titolo della spesa
  //setTitle = funzione per aggiornare il title
  const [title, setTitle] = useState('');

  //funzione per la gestione del form, gestisce l'evento di invio del form
  const handleSubmit = (e) => {
    e.preventDefault(); //previene il comportamento predefinito del form che ricarica la pagina
    //controlla se l'importo è minore di 0 o data nulla, mostra un alert come errore
    if (amount <= 0 || date === '' || title === '') {
      alert('Please enter valid amount, date, and title');
      return;
    }
    //altrimenti, chiama la funzione per aggiungere un nuovo oggetto, con i dati della nuova spesa
    addExpense({ category, title, amount: Number(amount), date });
    //una volta aggiunto, reimposta gli stati al valore iniziale
    setCategory('Food & Beverage');
    setTitle('');
    setAmount('');
    setDate('');
  };

  //render del componente ExpenseForm
  return (
    //Div per il form
    <div className="input-section">
      {/* Form per category */}
      <label htmlFor="category-select">Category:</label>
      <select
        id="category-select"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
      >
        <option value="Food & Beverage">Food & Beverage</option>
        <option value="Bills">Bills</option>
        <option value="Transport">Transport</option>
        <option value="Relaxing">Relaxing</option>
        <option value="Other">Other</option>
      </select>
      {/* Form per title */}
      <label htmlFor="title-input">Title:</label>
      <input 
        type="text" 
        id="title-input"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder='Expense title...'
      />
      {/* Form per amount */}
      <label htmlFor="amount-input">Amount:</label>
      <input
        type="number"
        id="amount-input"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        placeholder='Amount...'
      />
      {/* Form per date */}
      <label htmlFor="date-input">Date:</label>
      <input
        type="date"
        id="date-input"
        value={date}
        onChange={(e) => setDate(e.target.value)}
      />
      {/* Button per aggiungere la spesa */}
      <button id="add-button" onClick={handleSubmit}>
        <FontAwesomeIcon icon={faCirclePlus} />
      </button>
    </div>
  );
};

export default ExpenseForm;
