import React, { useState, useEffect } from 'react';
import { signOut } from 'firebase/auth'; // Import della funzione di logout da firebase
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { auth, db } from './firebase';
// import DatePicker from 'react-datepicker';
// import "react-datepicker/dist/react-datepicker.css"; // Stili predefiniti per il datapicker
import { startOfDay, endOfDay, startOfWeek, endOfWeek, startOfMonth, endOfMonth, startOfYear, endOfYear } from 'date-fns'; // Funzioni di date-fns per calcolare inizio e fine periodo
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faDownload } from '@fortawesome/free-solid-svg-icons';
import * as XLSX from 'xlsx';  // Importa il pacchetto xlsx, per permettere la funzione per il download delle spese come un file excel

// Import dei componenti e del file CSS
import ExpenseForm from './ExpenseForm';
import ExpenseList from './ExpenseList';
import './Expenses.css';

// Componente Expenses
const Expenses = () => {
  // Stati per gestire le spese
  // Array per le spese
  const [expenses, setExpenses] = useState([]);
  // Array di spese filtrate
  const [filteredExpenses, setFilteredExpenses] = useState([]);
  // Stato dell'importo totale delle spese
  const [totalAmount, setTotalAmount] = useState(0);
  // Stato dell'importo totale delle spese filtrate
  const [filteredTotalAmount, setFilteredTotalAmount] = useState(0);
  // Budget dell'utente
  const [budget, setBudget] = useState('');
  // Stato per il caricamento
  const [loading, setLoading] = useState(true);
  // Tipo di filtro per periodo (giorno, settimana, mese, anno), default visualizzo le spese annuali
  const [filterType, setFilterType] = useState('year');
  // Data selezionata per il filtro per data
  const [selectedDate, setSelectedDate] = useState(new Date());
  // Titolo di ricerca per il filtro per titolo
  const [searchTitle, setSearchTitle] = useState('');
  // Mostra/nasconde l'input per la ricerca per titolo
  const [showTitleSearch, setShowTitleSearch] = useState(false);
  // Hook per la navigazione tra le pagine
  const navigate = useNavigate();

  // useEffect per caricare i dati dell'utente da Firestore al caricamento della pagina
  useEffect(() => {
    const fetchData = async () => {
      const user = auth.currentUser;
      if (user) {
        const docRef = doc(db, 'users', user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          console.log("User data fetched: ", data);
          // Aggiorna gli stati con i dati recuperati da Firestore
          setBudget(data.budget || '');
          setTotalAmount(data.totalAmount || 0);
          setExpenses(data.expenses || []);
          setFilteredExpenses(data.expenses || []);
          // Calcola l'importo totale delle spese
          setFilteredTotalAmount(data.expenses.reduce((total, expense) => total + expense.amount, 0));
        } else {
          console.log("No such document!");
        }
      }
      setLoading(false); // Quando i dati vengono recuperati imposta il flag di carimento a false, per dire che non sta più caricando
    };

    fetchData(); // Chiama la funzione per caricare i dati

    const unsubscribe = auth.onAuthStateChanged((user) => {
      fetchData();
    });

    return () => unsubscribe(); // Pulisce la sottoscrizione all'uscita dal componente
  }, []); // Eseguito solo al montaggio del componente una volta

  // useEffect per salvare i dati su Firestore quando budget, totalAmount o expenses cambiano
  useEffect(() => {
    if (!loading) {
      const saveData = async () => {
        const user = auth.currentUser;
        if (user) {
          const docRef = doc(db, 'users', user.uid);
          await setDoc(docRef, {
            budget,
            totalAmount,
            expenses
          }, { merge: true });
          console.log("User data saved: ", { budget, totalAmount, expenses });
        }
      };
      saveData(); // Chiama la funzione per salvare i dati
    }
  }, [budget, totalAmount, expenses, loading]);

  // useEffect per filtrare le spese in base alla data selezionata, al tipo di filtro e alle spese
  useEffect(() => {
    filterExpensesByDate(); // Chiama la funzione per filtrare le spese per data
  }, [expenses, filterType, selectedDate]);

  // useEffect per filtrare le spese per titolo quando il titolo di ricerca cambia
  useEffect(() => {
    filterExpensesByTitle(); // Chiama la funzione per filtrare le spese per titolo
  }, [searchTitle]);

  // Funzione per inviare notifiche desktop
  const sendNotification = (title, options) => {
    if (!("Notification" in window)) {
      alert("This browser does not support desktop notification");
    } else if (Notification.permission === "granted") {
      new Notification(title, options);
    } else if (Notification.permission !== "denied") {
      Notification.requestPermission().then((permission) => {
        if (permission === "granted") {
          new Notification(title, options);
        }
      });
    }
  };

  // Funzione per aggiungere una nuova spesa
  const addExpense = (expense) => {
    const newExpenses = [...expenses, expense];
    const newTotalAmount = totalAmount + expense.amount;
    setExpenses(newExpenses); // Aggiorna l'array di spese
    setTotalAmount(newTotalAmount); // Aggiorna l'importo totale

    // Invia una notifica desktop per la nuova spesa aggiunta
    sendNotification("Nuova Spesa Aggiunta", {
      lang: "en",
      body: `Hai aggiunto una nuova spesa di ${expense.amount} $ con il titolo "${expense.title}".`,
      icon: "/dollar1.png",
      vibrate: [200, 100, 200],
    });

    updateFirestore(newExpenses, newTotalAmount); // Aggiorna Firestore con i nuovi dati
  };

  // Funzione per eliminare una spesa
  const deleteExpense = (index) => {
    const expense = expenses[index];
    const newExpenses = expenses.filter((_, i) => i !== index);
    const newTotalAmount = totalAmount - expense.amount;
    setExpenses(newExpenses); // Aggiorna l'array di spese
    setTotalAmount(newTotalAmount); // Aggiorna l'importo totale

    updateFirestore(newExpenses, newTotalAmount); // Aggiorna Firestore con i nuovi dati
  };

  // Funzione per aggiornare Firestore con le spese e l'importo totale aggiornati
  const updateFirestore = async (expenses, totalAmount) => {
    const user = auth.currentUser;
    if (user) {
      const docRef = doc(db, 'users', user.uid);
      await setDoc(docRef, {
        budget,
        totalAmount,
        expenses
      }, { merge: true });
      console.log("User data updated in Firestore: ", { budget, totalAmount, expenses });
    }
  };

  // const handleSetBudget = (value) => {
  //   setBudget(value);
  //   updateFirestore(expenses, totalAmount); // Update Firestore when budget changes
  // };

  // const handleClick = () => {
  //   signOut(auth).then(() => {
  //     console.log("User signed out");
  //     navigate('/');
  //   }).catch((error) => {
  //     console.error("Error signing out: ", error);
  //   });
  // };

  // Gestione click bottone homepage
  const handleHomeClick = () => {
    navigate('/homepage');
  }

  // Gestore per cambiare il tipo di filtro per periodo (giorno, settimana, mese, anno)
  const handleFilterChange = (type) => {
    setFilterType(type); // Imposta il nuovo tipo di filtro
  }

  // Gestore per gestire il click sul pulsante di ricerca per titolo
  const handleSearchClick = () => {
    // Toggle della visibilità della barra di ricerca per il titolo delle spese
    setShowTitleSearch(!showTitleSearch);
    if (showTitleSearch) {
      // Se la barra di ricerca è attiva, resetta il campo di ricerca
      setSearchTitle('');
    }
  }

  // Funzione per filtrare le spese in base alla data
  const filterExpensesByDate = () => {
    let startDate, endDate;
    const currentDate = selectedDate;

    // Switch per determinare la data di inizio e fine in base al tipo di filtro selezionato
    switch (filterType) {
      case 'day':
        startDate = startOfDay(currentDate);
        endDate = endOfDay(currentDate);
        break;
      case 'week':
        startDate = startOfWeek(currentDate);
        endDate = endOfWeek(currentDate);
        break;
      case 'month':
        startDate = startOfMonth(currentDate);
        endDate = endOfMonth(currentDate);
        break;
      case 'year':
        startDate = startOfYear(currentDate);
        endDate = endOfYear(currentDate);
        break;
      default:
        startDate = startOfYear(currentDate);
        endDate = endOfYear(currentDate);
        break;
    }

    // Filtra le spese in base alla data
    const filteredByDate = expenses.filter(expense => {
      const expenseDate = new Date(expense.date);
      return expenseDate >= startDate && expenseDate <= endDate;
    });

    // Imposta le spese filtrate e il totale delle spese filtrate, per la visualizzazione
    setFilteredExpenses(filteredByDate);
    setFilteredTotalAmount(filteredByDate.reduce((total, expense) => total + expense.amount, 0));
  };

  // Funzione per filtare le spese per titolo
  const filterExpensesByTitle = () => {
    // Filtra le spese per titolo, ignorando maiuscole/minuscole
    const filteredByTitle = searchTitle 
      ? expenses.filter(expense => expense.title.toLowerCase().includes(searchTitle.toLowerCase()))
      : expenses;

    // Imposta le spese filtrate e il totale delle spese filtrate, per la visualizzazione
    setFilteredExpenses(filteredByTitle);
    setFilteredTotalAmount(filteredByTitle.reduce((total, expense) => total + expense.amount, 0));
  };

  // Se il caricamento è in corso, mostra "Loading..."
  if (loading) {
    return <div>Loading...</div>;
  }

  // Funzione per scaricare la lista delle entrate in formato Exel
  const downloadExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(expenses);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Expenses");
    XLSX.writeFile(workbook, "expenses.xlsx");
  }

  return (
    <div className="expense-div">
      <h1>Expenses</h1>
      {/* Componente per aggiungere una nuova spesa */}
      <ExpenseForm addExpense={addExpense} />
      {/* <DatePicker selected={selectedDate} onChange={date => setSelectedDate(date)} /> */}
      {/* Div per selezionare una data */}
      <div className="filters">
        <input type="date" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} />
        {/* Pulsanti per filtrare le spese per giorno, settimana, mese, anno */}
        <button className={`filters-button ${filterType === 'day' ? 'selected' : ''}`} onClick={() => handleFilterChange('day')}>Giorno</button>
        <button className={`filters-button ${filterType === 'week' ? 'selected' : ''}`} onClick={() => handleFilterChange('week')}>Settimana</button>
        <button className={`filters-button ${filterType === 'month' ? 'selected' : ''}`} onClick={() => handleFilterChange('month')}>Mese</button>
        <button className={`filters-button ${filterType === 'year' ? 'selected' : ''}`} onClick={() => handleFilterChange('year')}>Anno</button>
        {/* Pulsante per attivare/disattivare la ricerca per titolo */}
        <button id="search-button-expenses" onClick={handleSearchClick}>
          <FontAwesomeIcon icon={faSearch} />
        </button>
        {/* Input per cercare le spese per titolo */}
        {showTitleSearch && (
          <input
            type="text"
            value={searchTitle}
            onChange={(e) => setSearchTitle(e.target.value)}
            placeholder="Cerca per titolo"
          />
        )}
      </div>
      {/* Lista delle spese filtrate */}
      <ExpenseList expenses={filteredExpenses} deleteExpense={deleteExpense} />
      <div className="total">
        {/* Totale delle spese filtrate */}
        <h2>Total Amount: {filteredTotalAmount} $</h2>
      </div>
      {/* Pulsante per tornare alla home */}
      <button id="home-button-expenses" onClick={handleHomeClick}>Home</button>
      {/* Pulsante per scaricare le spese in formato Excel */}
      <button id="download-excel-button" onClick={downloadExcel}><FontAwesomeIcon icon={faDownload} /></button>
    </div>
  );
};

export default Expenses;
