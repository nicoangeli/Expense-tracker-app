import React, { useEffect, useState } from 'react';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { auth, db, googleProvider } from './firebase';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGoogle } from '@fortawesome/free-brands-svg-icons';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';


import './Register.css';

function Register() {
  const [login, setLogin] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    function noBack() {
      window.history.forward();
    }

    window.onload = noBack;
    window.onpageshow = (event) => {
      if (event.persisted) {
        noBack();
      }
    };
    window.onpopstate = noBack;
  }, []);

  const handleSubmit = async (e, type) => {
    e.preventDefault();
    const email = e.target.email.value;
    const password = e.target.password.value;

    try {
      if (type === 'signup') {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        await setDoc(doc(db, 'users', user.uid), {
          budget: 0,
          totalAmount: 0,
          expenses: []
        });
        navigate('/homepage');
      } else {
        await signInWithEmailAndPassword(auth, email, password);
        navigate('/homepage');
      }
    } catch (err) {
      alert(err.message);
      if (type === 'signup') {
        setLogin(true);
      }
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      // Verifica se l'utente è già presente nel database
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      if (!userDoc.exists()) {
        // Se l'utente non esiste, crea un nuovo documento per l'utente
        await setDoc(doc(db, 'users', user.uid), {
          budget: 0,
          totalAmount: 0,
          expenses: []
        });
        alert('Registrazione avvenuta con successo. Ora puoi effettuare il login.');
      } else {
        alert('Login avvenuto con successo.');
      }

      navigate('/homepage');
    } catch (error) {
      console.error("Error during Google sign-in: ", error);
      alert(error.message);
    }
  };

  const handleReset = () => {
    navigate("/reset");
  }

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  }

  return (
    <div className="App">
      <div className="container-register">
        <div
          className={login === false ? 'activeColor' : 'pointer'}
          onClick={() => setLogin(false)}
        >
          SignUp
        </div>
        <div
          className={login === true ? 'activeColor' : 'pointer'}
          onClick={() => setLogin(true)}
        >
          SignIn
        </div>
      </div>
      <h1>{login ? 'SignIn' : 'SignUp'}</h1>
      <form onSubmit={(e) => handleSubmit(e, login ? 'signin' : 'signup')}>
        <input name="email" placeholder="Email" />
        <br />
        {/* <input name="password" type="password" placeholder="Password" /> */}
        <div className="password-container">
          <input 
            name="password" 
            type={showPassword ? "text" : "password"} 
            placeholder="Password" 
          />
          <FontAwesomeIcon 
            icon={showPassword ? faEyeSlash : faEye} 
            onClick={togglePasswordVisibility} 
            className="password-icon"
          />
        </div>
        <br />
        <p onClick={handleReset}>Forgot Password?</p>
        <br />
        <button type="submit">{login ? 'SignIn' : 'SignUp'}</button>
      </form>
      <button id="button-google" onClick={handleGoogleLogin}>
        <span>SignUp with Google </span>
          <span>
            <FontAwesomeIcon icon={faGoogle} />
          </span>
      </button>
    </div>
  );
}

export default Register;
