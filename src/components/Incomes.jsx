import React, { useState, useEffect } from 'react';
import { signOut } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { auth, db } from './firebase';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { startOfDay, endOfDay, startOfWeek, endOfWeek, startOfMonth, endOfMonth, startOfYear, endOfYear } from 'date-fns';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faDownload } from '@fortawesome/free-solid-svg-icons';
import * as XLSX from 'xlsx';  // Importa il pacchetto xlsx

import IncomeForm from './IncomeForm';
import IncomeList from './IncomeList';
import IncomeItem from './IncomeItem';
import './Expenses.css';
import './Incomes.css'

const Incomes = () => {
  const [incomes, setIncomes] = useState([]);
  const [filteredIncomes, setFilteredIncomes] = useState([]);
  const [totalIncome, setTotalIncome] = useState(0);
  const [filteredTotalIncome, setFilteredTotalIncome] = useState(0);
  const [budget, setBudget] = useState('');
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState('year');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [searchTitle, setSearchTitle] = useState('');
  const [showTitleSearch, setShowTitleSearch] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const user = auth.currentUser;
      if (user) {
        const docRef = doc(db, 'users', user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          console.log("User data fetched: ", data);
          setBudget(data.budget || '');
          setTotalIncome(data.totalIncome || 0);
          setIncomes(data.incomes || []);
          setFilteredIncomes(data.incomes || []);
          setFilteredTotalIncome(data.incomes.reduce((total, income) => total + income.amount, 0));
        } else {
          // Initialize user data if it doesn't exist
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
            totalIncome,
            incomes
          }, { merge: true });
          console.log("User data saved: ", { budget, totalIncome, incomes });
        }
      };
      saveData();
    }
  }, [budget, totalIncome, incomes, loading]);

  useEffect(() => {
    filterIncomesByDate();
  }, [incomes, filterType, selectedDate]);

  useEffect(() => {
    filterIncomesByTitle();
  }, [searchTitle]);

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

  const addIncome = (income) => {
    setIncomes([...incomes, income]);
    setTotalIncome(totalIncome + income.amount);

    sendNotification("Nuova Entrata Aggiunta", {
      lang: "en",
      body: `Hai aggiunto una nuova entrata di ${income.amount} $ con il titolo "${income.title}".`,
      icon: "/dollar1.png",
      vibrate: [200, 100, 200],
      badge: "logo.png"
    });
  };

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

    const filtered = incomes.filter((income) => {
      const incomeDate = new Date(income.date);
      return incomeDate >= startDate && incomeDate <= endDate;
    });

    setFilteredIncomes(filtered);
    setFilteredTotalIncome(filtered.reduce((total, income) => total + income.amount, 0));
  };

  const filterIncomesByTitle = () => {
    const filtered = incomes.filter((income) => {
      return income.title.toLowerCase().includes(searchTitle.toLowerCase());
    });

    setFilteredIncomes(filtered);
    setFilteredTotalIncome(filtered.reduce((total, income) => total + income.amount, 0));
  };

  const handleLogout = async () => {
    await signOut(auth);
    navigate('/');
  };

  const handleFilterTypeChange = (e) => {
    setFilterType(e.target.value);
  };

  const handleSearchTitleChange = (e) => {
    setSearchTitle(e.target.value);
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  const handleHomeClick = () => {
    navigate('/homepage');
  }

  const deleteIncome = async (index) => {
    const user = auth.currentUser;
    if (user) {
      const docRef = doc(db, 'users', user.uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        const updatedIncomes = [...data.incomes];
        updatedIncomes.splice(index, 1);
        const updatedTotalIncome = updatedIncomes.reduce((total, income) => total + income.amount, 0);
  
        await setDoc(docRef, {
          budget: data.budget,
          totalIncome: updatedTotalIncome,
          incomes: updatedIncomes
        }, { merge: true });
  
        setIncomes(updatedIncomes);
        setTotalIncome(updatedTotalIncome);
        setFilteredIncomes(updatedIncomes);
        setFilteredTotalIncome(updatedTotalIncome);
  
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
