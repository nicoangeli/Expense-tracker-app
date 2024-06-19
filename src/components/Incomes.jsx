import React, { useState, useEffect } from 'react';
import { signOut } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { auth, db } from './firebase';
import DatePicker from 'react-datepicker'; // Componente di datepicker per React
import "react-datepicker/dist/react-datepicker.css"; // Stili per il datepicker
import { startOfDay, endOfDay, startOfWeek, endOfWeek, startOfMonth, endOfMonth, startOfYear, endOfYear } from 'date-fns';// Funzioni per il calcolo delle date con date-fns
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faDownload } from '@fortawesome/free-solid-svg-icons';
import * as XLSX from 'xlsx';  // Importa il pacchetto xlsx

// Import delle componenti utilizzate
import IncomeForm from './IncomeForm';
import IncomeList from './IncomeList';

// Stili CSS specifici per le spese
import './Expenses.css';
import './Incomes.css'

const Incomes = () => {
  // Stato per memorizzare tutte le entrate
  const [incomes, setIncomes] = useState([]);
  // Stato per memorizzare entrate filtrate per data o titolo
  const [filteredIncomes, setFilteredIncomes] = useState([]);
  // Stato per memorizzare il totale delle entrate
  const [totalIncome, setTotalIncome] = useState(0);
  // Stato per memorizzare il totale delle entrate filtrate
  const [filteredTotalIncome, setFilteredTotalIncome] = useState(0);
  // Stato per memorizzare il budget dell'utente
  const [budget, setBudget] = useState('');
  // Stato per gestire lo stato di caricamento dei dati
  const [loading, setLoading] = useState(true);
  // Stato per il tipo di filtro (giorno, settimana, mese, anno)
  const [filterType, setFilterType] = useState('year');
  // Stato per memorizzare la data selezionata
  const [selectedDate, setSelectedDate] = useState(new Date());
  // Stato per il titolo di ricerca
  const [searchTitle, setSearchTitle] = useState('');
  // Stato per gestire la visibilità del campo di ricerca per titolo
  const [showTitleSearch, setShowTitleSearch] = useState(false);
  const navigate = useNavigate();

  // Effetto per caricare i dati dell'utente quando il componente si monta
  useEffect(() => {
    const fetchData = async () => {
      const user = auth.currentUser;
      if (user) {
        const docRef = doc(db, 'users', user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          console.log("User data fetched: ", data);
          // Imposta i dati utente dal documento Firestore
          setBudget(data.budget || '');
          setTotalIncome(data.totalIncome || 0);
          setIncomes(data.incomes || []);
          setFilteredIncomes(data.incomes || []);
          setFilteredTotalIncome(data.incomes.reduce((total, income) => total + income.amount, 0));
        } else {
          // Inizializza i dati utente se non esistono nel database Firestore
          await setDoc(docRef, {
            budget: 0,
            totalIncome: 0,
            incomes: [],
            totalAmount: 0,
            expenses: []
          });
          console.log("User data initialized.");
          setBudget(0);
          setTotalIncome(0);
          setIncomes([]);
          setFilteredIncomes([]);
          setFilteredTotalIncome(0);
        }
      }
      setLoading(false);
    };

    fetchData();

    // Gestione del cambio di stato dell'autenticazione utente
    const unsubscribe = auth.onAuthStateChanged((user) => {
      fetchData();
    });

    return () => unsubscribe();
  }, []);

  // Effetto per salvare i dati utente su Firestore quando il budget, il totale entrate o le entrate cambiano
  useEffect(() => {
    if (!loading) {
      const saveData = async () => {
        const user = auth.currentUser;
        if (user) {
          const docRef = doc(db, 'users', user.uid);
          await setDoc(docRef, {
            budget,
            totalIncome,
            incomes
          }, { merge: true });
          console.log("User data saved: ", { budget, totalIncome, incomes });
        }
      };
      saveData();
    }
  }, [budget, totalIncome, incomes, loading]);

  // Effetto per filtrare le entrate per data quando cambiano le entrate, il tipo di filtro o la data selezionata
  useEffect(() => {
    filterIncomesByDate();
  }, [incomes, filterType, selectedDate]);

  // Effetto per filtrare le entrate per titolo quando cambia il titolo di ricerca
  useEffect(() => {
    filterIncomesByTitle();
  }, [searchTitle]);

  // Funzione per mostrare le notifiche desktop
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

  // Funzione per aggiungere una nuova entrata
  const addIncome = (income) => {
    setIncomes([...incomes, income]);
    setTotalIncome(totalIncome + income.amount);

    // Invia una notifica per la nuova entrata aggiunta
    sendNotification("Nuova Entrata Aggiunta", {
      lang: "en",
      body: `Hai aggiunto una nuova entrata di ${income.amount} $ con il titolo "${income.title}".`,
      icon: "/dollar1.png",
      vibrate: [200, 100, 200],
      badge: "logo.png"
    });
  };

  // Funzione per filtrare le entrate per data
  const filterIncomesByDate = () => {
    let startDate, endDate;

    switch (filterType) {
      case 'day':
        startDate = startOfDay(selectedDate);
        endDate = endOfDay(selectedDate);
        break;
      case 'week':
        startDate = startOfWeek(selectedDate);
        endDate = endOfWeek(selectedDate);
        break;
      case 'month':
        startDate = startOfMonth(selectedDate);
        endDate = endOfMonth(selectedDate);
        break;
      case 'year':
        startDate = startOfYear(selectedDate);
        endDate = endOfYear(selectedDate);
        break;
      default:
        startDate = startOfYear(selectedDate);
        endDate = endOfYear(selectedDate);
        break;
    }

    // Filtra le entrate in base alla data e imposta i nuovi stati filtrati
    const filtered = incomes.filter((income) => {
      const incomeDate = new Date(income.date);
      return incomeDate >= startDate && incomeDate <= endDate;
    });

    setFilteredIncomes(filtered);
    setFilteredTotalIncome(filtered.reduce((total, income) => total + income.amount, 0));
  };

  // Funzione per filtrare le entrate per titolo
  const filterIncomesByTitle = () => {
    const filtered = incomes.filter((income) => {
      return income.title.toLowerCase().includes(searchTitle.toLowerCase());
    });

    setFilteredIncomes(filtered);
    setFilteredTotalIncome(filtered.reduce((total, income) => total + income.amount, 0));
  };

  // const handleLogout = async () => {
  //   await signOut(auth);
  //   navigate('/');
  // };

  // Funzione per gestire il cambio del tipo di filtro (giorno, settimana, mese, anno)
  const handleFilterTypeChange = (e) => {
    setFilterType(e.target.value);
  };

  // Funzione per gestire il cambio del titolo di ricerca
  const handleSearchTitleChange = (e) => {
    setSearchTitle(e.target.value);
  };

  // Funzione per gestire il cambio della data selezionata nel datepicker
  const handleDateChange = (date) => {
    setSelectedDate(date);
  };
// Funzione per gestire la navigazione alla homepage
  const handleHomeClick = () => {
    navigate('/homepage');
  }

  //Funzione per la gestione dell'eliminazione di un'entrata
  const deleteIncome = async (index) => {
    const user = auth.currentUser;
    if (user) {
      const docRef = doc(db, 'users', user.uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        const updatedIncomes = [...data.incomes]; // Crea una copia dell'array delle entrate
        updatedIncomes.splice(index, 1); // Rimuove l'entrata dall'array tramite l'indice
        // Calcola il nuovo totale delle entrate aggiornato
        const updatedTotalIncome = updatedIncomes.reduce((total, income) => total + income.amount, 0);
  
        // Aggiorna il documento Firestore con i nuovi dati
        await setDoc(docRef, {
          budget: data.budget,
          totalIncome: updatedTotalIncome,
          incomes: updatedIncomes
        }, { merge: true });
  
        // Aggiorna gli stati locali con i nuovi dati
        setIncomes(updatedIncomes);
        setTotalIncome(updatedTotalIncome);
        setFilteredIncomes(updatedIncomes);
        setFilteredTotalIncome(updatedTotalIncome);
  
        // Invia una notifica per l'entrata eliminata
        sendNotification("Entrata Eliminata", {
          lang: "en",
          body: `Hai eliminato un'entrata di ${data.incomes[index].amount} $ con il titolo "${data.incomes[index].title}".`,
          icon: "/dollar1.png",
          vibrate: [200, 100, 200],
          badge: "logo.png"
        });
      } else {
        console.error("No user data found in Firestore");
      }
    } else {
      console.error("No user is currently signed in");
    }
  };

  // Funzione per scaricare la lista delle entrate in formato Exel
  const downloadExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(incomes);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Incomes");
    XLSX.writeFile(workbook, "incomes.xlsx");
  }
  

  return (
    <div>
      <div className="budget-container-incomes">
        <h1>Incomes</h1>
      </div>
      <IncomeForm addIncome={addIncome} />
      <div className="filter-container">
        <label htmlFor="filter">Filtra per:</label>
        <select id="filter" value={filterType} onChange={handleFilterTypeChange}>
          <option value="day">Giorno</option>
          <option value="week">Settimana</option>
          <option value="month">Mese</option>
          <option value="year">Anno</option>
        </select>
        {/* per selezionare le date, prende la data selezionata  */}
        <DatePicker selected={selectedDate} onChange={handleDateChange} />
        <button id="search-button" onClick={() => setShowTitleSearch(!showTitleSearch)}>
          <FontAwesomeIcon icon={faSearch} />
        </button>
        {showTitleSearch && (
          <input
            type="text"
            placeholder="Cerca per titolo"
            value={searchTitle}
            onChange={handleSearchTitleChange}
          />
        )}
      </div>
      <IncomeList incomes={filteredIncomes} deleteIncome={deleteIncome}/>
      <div className="total-income-container">
        <h2>Total Amount: {filteredTotalIncome} $</h2>
      </div>
      <button id="home-button-incomes" onClick={handleHomeClick}>Home</button>
      <button id="download-excel-button" onClick={downloadExcel}><FontAwesomeIcon icon={faDownload} /></button>
    </div>
  );
};

export default Incomes;
