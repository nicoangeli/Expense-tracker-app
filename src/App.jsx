import React from "react"; //importo React
import { BrowserRouter, Route, Routes } from "react-router-dom"; //importo le componenti di react-router-dom, per la gestione della navigazione
// importo i componenti, per ciascuna route
import Register from "./components/Register";
import Expenses from "./components/Expenses"; 
import Homepage from "./components/HomePage";
import Budget from "./components/Budget";
import Incomes from "./components/Incomes";
import Promemoria from "./components/Promemoria";
import ForgotPassword from "./components/ForgotPassword";

// funzione che rappresenta il componente principale dell'applicazione
function App(){
    return(
        // contenitore per abilitare la navigazione
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
export default App; //export nel componente per poterlo usarlo altrove o importato in altri file

