import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faWallet, faMoneyBill, faMoneyBillTrendUp, faArrowRightFromBracket, faBell, faUser } from '@fortawesome/free-solid-svg-icons';
import { auth } from './firebase'; // Importa il modulo auth da firebase.js
import { signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

// Importa il file CSS per lo stile della pagina
import './HomePage.css';

const Homepage = () => {
    // Stato per memorizzare l'email dell'utente, inizializzato con il valore dell'archivio locale o stringa vuota se non presente
    const [userEmail, setUserEmail] = useState(localStorage.getItem('userEmail') || ''); // Leggi l'email dall'archivio locale
    const [loading, setLoading] = useState(true); // Stato di caricamento

    const navigate = useNavigate();

    // useEffect per il caricamento dei dati dell'utente
    useEffect(() => {
        const fetchUserData = async () => {
            const user = auth.currentUser;
            if (user) {
                try {
                    await user.reload(); // Aggiorna i dati utente
                    setUserEmail(user.email); // Imposta l'email dell'utente nello stato
                    localStorage.setItem('userEmail', user.email); // Salva l'email nell'archivio locale
                } catch (error) {
                    console.error('Error fetching user data:', error);
                }
            }
            setLoading(false); // Imposta lo stato di caricamento su false indipendentemente dall'esito
        };

        fetchUserData();
    }, []);

    // Funzione per gestire il click sul bottone Logout
    const handleClick = () => {
        // Esegue il logout dell'utente utilizzando Firebase Auth
        signOut(auth).then(() => {
          console.log("User signed out");
          navigate('/'); // Naviga alla homepage dopo il logout
        }).catch((error) => {
          console.error("Error signing out: ", error);
        });
    };

    // Funzioni per gestire i click sui bottoni delle diverse sezioni

    // Funzione per gestire il button Expenses
    const handleExpensesClick = () => {
        navigate('/expenses'); // Naviga alla pagina delle spese
    }

    // Funzione per gestire il button Incomes
    const handleIncomesClick = () => {
        navigate('/incomes'); // Naviga alla pagina delle entrate
    }

    // Funzione per gestire il button Budget
    const handleBudgetClick = () => {
        navigate('/budget'); // Naviga alla pagina del budget
    }

    // Funzione per gestire il button Budget
    const handlePromemoriaClick = () => {
        navigate('/promemoria'); // Naviga alla pagina deli promemoria
    }

    return (
        <div className='main-div'>
            <h1 id="homepage-title">EXPENSE TRACKER APP</h1>
            {loading ? (
                <h2 id='homepage-subtitle'>Loading...</h2>
            ) : (
                <h2 id='homepage-subtitle'><FontAwesomeIcon icon={faUser} />User: {userEmail}</h2>
            )}
            {/* Pulsanti per le diverse sezioni, con span per mettere il testo e l'icona dentro un bottone*/}
            <div className='container'>
                {/*Button incomes*/}
                <button className='button-home' onClick={handleIncomesClick}>
                    <span id='button-incomes'>Incomes</span>
                    <span id='button-icon-incomes'>
                        <FontAwesomeIcon icon={faMoneyBillTrendUp} />
                    </span>
                </button>
                {/*Button expense*/}
                <button className='button-home' onClick={handleExpensesClick}>
                    <span id='button-expense'>Expenses</span>
                    <span id='button-icon-expense'>
                        <FontAwesomeIcon icon={faMoneyBill} />
                    </span>
                </button>
                {/*Button budget*/}
                <button className='button-home' onClick={handleBudgetClick}>
                    <span id='button-budget'>Budget</span>
                    <span id='button-icon-budget'>
                        <FontAwesomeIcon icon={faWallet} />
                    </span>
                </button>
                {/*Button promemoria*/}
                <button className='button-home' onClick={handlePromemoriaClick}>
                    <span id='button-promemoria'>Promemoria</span>
                    <span id='button-icon-promemoria'>
                        <FontAwesomeIcon icon={faBell} />
                    </span>
                </button>
            </div>
            {/*Button logout*/}
            <button className='button-logout' onClick={handleClick}>
                <span id='button-title-logout'>Logout</span>
                <span id='button-icon-logout'>
                    <FontAwesomeIcon icon={faArrowRightFromBracket} />
                </span>
            </button>
        </div>
    );
}

export default Homepage;
