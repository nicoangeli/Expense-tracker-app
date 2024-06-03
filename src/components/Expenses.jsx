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

import ExpenseForm from './ExpenseForm';
import ExpenseList from './ExpenseList';
import './Expenses.css';

const Expenses = () => {
  const [expenses, setExpenses] = useState([]);
  const [filteredExpenses, setFilteredExpenses] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [filteredTotalAmount, setFilteredTotalAmount] = useState(0);
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
          setTotalAmount(data.totalAmount || 0);
          setExpenses(data.expenses || []);
          setFilteredExpenses(data.expenses || []);
          setFilteredTotalAmount(data.expenses.reduce((total, expense) => total + expense.amount, 0));
        } else {
          console.log("No such document!");
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
            totalAmount,
            expenses
          }, { merge: true });
          console.log("User data saved: ", { budget, totalAmount, expenses });
        }
      };
      saveData();
    }
  }, [budget, totalAmount, expenses, loading]);

  useEffect(() => {
    filterExpensesByDate();
  }, [expenses, filterType, selectedDate]);

  useEffect(() => {
    filterExpensesByTitle();
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

  const addExpense = (expense) => {
    const newExpenses = [...expenses, expense];
    const newTotalAmount = totalAmount + expense.amount;
    setExpenses(newExpenses);
    setTotalAmount(newTotalAmount);

    sendNotification("Nuova Spesa Aggiunta", {
      lang: "en",
      body: `Hai aggiunto una nuova spesa di ${expense.amount} $ con il titolo "${expense.title}".`,
      icon: "/dollar1.png",
      vibrate: [200, 100, 200],
    });

    updateFirestore(newExpenses, newTotalAmount);
  };

  const deleteExpense = (index) => {
    const expense = expenses[index];
    const newExpenses = expenses.filter((_, i) => i !== index);
    const newTotalAmount = totalAmount - expense.amount;
    setExpenses(newExpenses);
    setTotalAmount(newTotalAmount);

    updateFirestore(newExpenses, newTotalAmount);
  };

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

  const handleSetBudget = (value) => {
    setBudget(value);
    updateFirestore(expenses, totalAmount); // Update Firestore when budget changes
  };

  const handleClick = () => {
    signOut(auth).then(() => {
      console.log("User signed out");
      navigate('/');
    }).catch((error) => {
      console.error("Error signing out: ", error);
    });
  };

  const handleHomeClick = () => {
    navigate('/homepage');
  }

  const handleFilterChange = (type) => {
    setFilterType(type);
  }

  const handleSearchClick = () => {
    setShowTitleSearch(!showTitleSearch);
    if (showTitleSearch) {
      setSearchTitle('');
    }
  }

  const filterExpensesByDate = () => {
    let startDate, endDate;
    const currentDate = selectedDate;

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

    const filteredByDate = expenses.filter(expense => {
      const expenseDate = new Date(expense.date);
      return expenseDate >= startDate && expenseDate <= endDate;
    });

    setFilteredExpenses(filteredByDate);
    setFilteredTotalAmount(filteredByDate.reduce((total, expense) => total + expense.amount, 0));
  };

  const filterExpensesByTitle = () => {
    const filteredByTitle = searchTitle 
      ? expenses.filter(expense => expense.title.toLowerCase().includes(searchTitle.toLowerCase()))
      : expenses;

    setFilteredExpenses(filteredByTitle);
    setFilteredTotalAmount(filteredByTitle.reduce((total, expense) => total + expense.amount, 0));
  };

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
      <ExpenseForm addExpense={addExpense} />
      {/* <DatePicker selected={selectedDate} onChange={date => setSelectedDate(date)} /> */}
      <div className="filters">
        <input type="date" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} />
        <button className={`filters-button ${filterType === 'day' ? 'selected' : ''}`} onClick={() => handleFilterChange('day')}>Giorno</button>
        <button className={`filters-button ${filterType === 'week' ? 'selected' : ''}`} onClick={() => handleFilterChange('week')}>Settimana</button>
        <button className={`filters-button ${filterType === 'month' ? 'selected' : ''}`} onClick={() => handleFilterChange('month')}>Mese</button>
        <button className={`filters-button ${filterType === 'year' ? 'selected' : ''}`} onClick={() => handleFilterChange('year')}>Anno</button>
        <button id="search-button-expenses" onClick={handleSearchClick}>
          <FontAwesomeIcon icon={faSearch} />
        </button>
        {showTitleSearch && (
          <input
            type="text"
            value={searchTitle}
            onChange={(e) => setSearchTitle(e.target.value)}
            placeholder="Cerca per titolo"
          />
        )}
      </div>
      <ExpenseList expenses={filteredExpenses} deleteExpense={deleteExpense} />
      <div className="total">
        <h2>Total Amount: {filteredTotalAmount} $</h2>
      </div>
      <button id="home-button-expenses" onClick={handleHomeClick}>Home</button>
      <button id="download-excel-button" onClick={downloadExcel}><FontAwesomeIcon icon={faDownload} /></button>
    </div>
  );
};

export default Expenses;
