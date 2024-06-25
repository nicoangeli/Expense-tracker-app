import { sendPasswordResetEmail } from "firebase/auth";
import React from "react";
import { auth } from "./firebase";
import { useNavigate } from "react-router-dom";

function ForgotPassword(){
    const navigate = useNavigate();

    // Definizione della funzione di gestione dell'invio del form
    const handleSubmit = async(e)=>{
        // Impedisce il comportamento predefinito di ricaricare la pagina al submit del form
        e.preventDefault()
        // Ottiene il valore dell'input email dal form
        const emalVal = e.target.email.value;
        // Invia l'email di reset della password tramite Firebase Authentication
        sendPasswordResetEmail(auth,emalVal)
        .then(()=>{
            alert("Check your email for password reset instructions.") // Mostra un messaggio di avviso
            navigate("/") // Manda l'utente alla homepage dopo aver inviato l'email di reset
        }).catch(err=>{
            alert(err.code) // Mostra il codice di errore in caso di fallimento nell'invio dell'email di reset
        })
    }

    // Gestione click bottone Login
    const handleLoginClick = () => {
        navigate('/');
    }

    return(
        <div className="App">
            {/* Titolo della pagina */}
            <h1>Forgot Password</h1>
            {/* Form per l'invio dell'email di reset della password */}
            <form onSubmit={(e)=>handleSubmit(e)}>
                {/* Input per l'email */}
                <input 
                name="email" 
                placeholder="Email for reset password..."/><br/><br/>
                {/* Pulsante per avviare il reset della password */}
                <button>Reset</button>
                <button id="register-button" onClick={handleLoginClick}>Login</button>
            </form>
        </div>
    )
}
export default ForgotPassword;