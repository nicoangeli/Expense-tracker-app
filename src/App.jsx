// import React, { useState } from 'react';
// import ExpenseForm from './components/ExpenseForm';
// import ExpenseList from './components/ExpenseList';
// import Budget from './components/Budget';
// import RemainingBudget from './components/RemainingBudget'; // Import the new component
// import './App.css';

// const App = () => {
//   const [expenses, setExpenses] = useState([]);
//   const [totalAmount, setTotalAmount] = useState(0);
//   const [budget, setBudget] = useState(''); // State for the budget

//   const addExpense = (expense) => {
//     setExpenses([...expenses, expense]);
//     setTotalAmount(totalAmount + expense.amount);
//   };

//   const deleteExpense = (index) => {
//     const expense = expenses[index];
//     const newExpenses = expenses.filter((_, i) => i !== index);
//     setExpenses(newExpenses);
//     setTotalAmount(totalAmount - expense.amount);
//   };

//   const handleSetBudget = (value) => {
//     setBudget(value);
//   };

//   return (
//     <div className="App">
//       <h1>Expense Tracker App</h1>
//       <Budget setBudget={handleSetBudget} />
//       <RemainingBudget budget={budget} totalExpenses={totalAmount} /> {/* Pass the updated budget */}
//       <ExpenseForm addExpense={addExpense} />
//       <ExpenseList expenses={expenses} deleteExpense={deleteExpense} />
//       <div className="total">
//         <h2>Total Expense: {totalAmount} $</h2>
//       </div>
//     </div>
//   );
// };

// export default App;
import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Register from "./components/Register";
import Expenses from "./components/Expenses"; 
import Homepage from "./components/HomePage";
import Budget from "./components/Budget";
import Incomes from "./components/Incomes";
import Promemoria from "./components/Promemoria";
import ForgotPassword from "./components/ForgotPassword";


function App(){
    return(
        <BrowserRouter>
            <div>
                <Routes>
                    <Route path="/" element={<Register/>} />
					<Route path="/homepage" element={<Homepage/>} />
					<Route path="/expenses" element={<Expenses/>} />
					<Route path="/incomes" element={<Incomes/>} /> 
					<Route path="/budget" element={<Budget/>} /> 
					<Route path="/promemoria" element={<Promemoria/>} />
                    <Route path="/reset" element={<ForgotPassword/>} />
                </Routes>
            </div>
        </BrowserRouter>
    )
}
export default App;

