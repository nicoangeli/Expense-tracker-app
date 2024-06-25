// import delle librerie neccessarie
import React, { useEffect, useState } from 'react'; //React
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth'; //per registrazione e autenticazione tramite mail e password o google 
import { doc, setDoc, getDoc } from 'firebase/firestore'; //funzioni di firestone
import { useNavigate } from 'react-router-dom'; //funzione per la navigazione in react router
import { auth, db, googleProvider } from './firebase'; //Configurazioni Firebase (autenticazione, database, Google)
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'; //icone fontawesome
import { faGoogle } from '@fortawesome/free-brands-svg-icons';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

// file css per lo stile del componente
import './Register.css';

//Componente Register
function Register() {
  //stato per determinare se l'utente sta eseguendo il login o la registrazione, all'inizio il login è impostato su false
  const [login, setLogin] = useState(false); 
  //stato per gestire la visibilità della passoword, inizialmente impostato su false, quindi password non visibile
  const [showPassword, setShowPassword] = useState(false);
  //hook per la navigazione
  const navigate = useNavigate();

  //esegue il codice per impedire all'utente una volta che è sulla pagina di registrazione/login di tornare indietro con le freccie del browser
  //viene eseguito solo una volta al montaggio del componente, infatti il secondo componente di useEffect è []
  useEffect(() => {
    function noBack() {
      //forza il componente a non tornare indietro ma in avanti
      window.history.forward();
    }
    // quando tutta la pagina viene caricata viene richiamata la funzione noBack
    window.onload = noBack;
    window.onpageshow = (event) => {
      if (event.persisted) {
        noBack();
      }
    };
    window.onpopstate = noBack;
  }, []);

// funzione asincrona per gestire l'evento di submit di un form
  const handleSubmit = async (e, type) => {
    // previene il comportamento di default della pagina ovvero il refresh della pagina, evita che al refresh si perdano i dati
    e.preventDefault();
    // prendo i valori di email e password inseriti nel form
    const email = e.target.email.value;
    const password = e.target.password.value;

    try {
      // se il tipo di operazione è registrazione
      if (type === 'signup') {
        // creo un nuovo utente con email e password utilizzando Firebase Authentication
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        //ottengo l'utente appena creato
        const user = userCredential.user;
        // crea un documento nel database Firestore per il nuovo utente
        await setDoc(doc(db, 'users', user.uid), {
          // Imposta i campi budget, totalAmount e expenses con valori iniziali 0,0,[]
          budget: 0,
          totalAmount: 0,
          expenses: []
        });
        //Dopo la registrazione si viene indirizzati alla 'homepage'
        navigate('/homepage');
      } else {
        // Se il tipo di operazione non è 'signup'/registrazione, si effettua il login con email e password
        await signInWithEmailAndPassword(auth, email, password);
        //Dopo il login si viene indirizzati alla homepage
        navigate('/homepage');
      }
    } catch (err) {
      // In caso di errore, mostra un messaggio di allarme con l'errore
      alert(err.message);
      // Se il tipo di operazione è 'signup'/login, imposta lo stato di login a true per mostrare la finestra di login invece di quella della registrazione
      if (type === 'signup') {
        setLogin(true);
      }
    }
  };

// funzione asincrona per gestire il login tramite google
  const handleGoogleLogin = async () => {
    try {
      //utilizzo di firebase auth per effettuare il login con un popup di google
      const result = await signInWithPopup(auth, googleProvider);
      //ottengo l'utente autenticato dal result del login con google
      const user = result.user;

      //recupero il documento dell'utente dal database utilizzando l'id dell'utente
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      //controllo se il documento dell'utente non esiste
      if (!userDoc.exists()) {
        // Se l'utente non esiste, crea un nuovo documento per l'utente con i valori iniziali
        await setDoc(doc(db, 'users', user.uid), {
          budget: 0,
          totalAmount: 0,
          expenses: []
        });
        //messaggio alert di avvenuta registrazione
        alert('Registrazione avvenuta con successo. Ora puoi effettuare il login.');
      } else {
        //messaggio alert di avvenuto login
        alert('Login avvenuto con successo.');
      }

      //naviga alla homepage dopo la registrazione o login
      navigate('/homepage');
    } catch (error) {
      //in caso di errore stampa l'errore nella console
      console.error("Error during Google sign-in: ", error);
      //messaggio di alert
      alert(error.message);
    }
  };

// funzione per la gestione di forgot password
  const handleReset = () => {
    //navigazione alla pagina di reset
    navigate("/reset");
  }

// funzione per la gestione della visibilità della password
  const togglePasswordVisibility = () => {
    //cambio lo stato della visibilità della password
    setShowPassword(!showPassword);
  }

  return (
    <div className="App">
      <div className="container-register">
        {/* div per selezionare la modalità di registrazione */}
        <div
          className={login === false ? 'activeColor' : 'pointer'}
          onClick={() => setLogin(false)}
        >
          SignUp
        </div>
        {/* div per selezionare la modalità di login */}
        <div
          className={login === true ? 'activeColor' : 'pointer'}
          onClick={() => setLogin(true)}
        >
          SignIn
        </div>
      </div>
      {/* Titolo che cambia in base alla modalità selezionata */}
      <h1>{login ? 'SignIn' : 'SignUp'}</h1>
      {/* Form per la registrazione o il login */}
      <form onSubmit={(e) => handleSubmit(e, login ? 'signin' : 'signup')}>
        {/* Campo di input per l'email */}
        <input name="email" placeholder="Email" />
        <br />
        {/* <input name="password" type="password" placeholder="Password" /> */}
        {/* Campo di input per la password */}
        <div className="password-container">
          <input 
            name="password" 
            type={showPassword ? "text" : "password"}
            placeholder="Password" 
          />
          {/* Icona per mostrare/nascondere la password */}
          <FontAwesomeIcon 
            icon={showPassword ? faEyeSlash : faEye} 
            onClick={togglePasswordVisibility} 
            className="password-icon"
          />
        </div>
        <br />
        {/* p con link per reimpostare la password dimenticata*/}
        <p onClick={handleReset}>Forgot Password?</p>
        <br />
        <button type="submit">{login ? 'SignIn' : 'SignUp'}</button>
      </form>
      {/* Bottone per il login/registrazione con Google */}
      <button id="button-google" onClick={handleGoogleLogin}>
        <span>SignUp with Google </span>
          <span>
            <FontAwesomeIcon icon={faGoogle} />
          </span>
      </button>
    </div>
  );
}
// export del componente
export default Register;
