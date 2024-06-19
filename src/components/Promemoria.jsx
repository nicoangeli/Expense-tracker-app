import React, { useState, useEffect } from 'react';
import { collection, doc, addDoc, getDocs, deleteDoc, updateDoc } from 'firebase/firestore';
import { auth, db } from './firebase';
import { useNavigate } from 'react-router-dom';

// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faCheck } from '@fortawesome/free-solid-svg-icons';

// Importa lo stile CSS del componente
import './Promemoria.css';

const Promemoria = () => {
  // Stato per mostrare/nascondere il form di creazione del promemoria
  const [showForm, setShowForm] = useState(false);
  // Stato per i dati del form di creazione
  const [formData, setFormData] = useState({
    nome: '',
    giorno: '',
    ora: '',
    commento: ''
  });
  // Stato per la lista dei promemoria
  const [promemoriaList, setPromemoriaList] = useState([]);
  // Stato per gestire lo stato di caricamento dei dati
  const [loading, setLoading] = useState(true);
  // Ottiene la funzione di navigazione dal hook useNavigate
  const navigate = useNavigate();

  // Gestisce l'aggiornamento degli input del form
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Recupera i promemoria dal database firestone
  const fetchPromemoria = async () => {
    try {
      const user = auth.currentUser; // Ottiene l'utente corrente da Firebase Authentication
      if (user) {
        // Referenza alla collezione 'promemoria' dell'utente
        const promemoriaRef = collection(db, 'users', user.uid, 'promemoria');
        // Ottiene una snapshot dei documenti nella collezione
        const snapshot = await getDocs(promemoriaRef);
        // Mappa i dati dei documenti in un array di oggetti
        const promemoriaData = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setPromemoriaList(promemoriaData); // Aggiorna lo stato con i dati dei promemoria
      }
    } catch (error) {
      console.error('Error fetching promemoria:', error);
    }
    setLoading(false);
  };

  // Effettua il fetch dei promemoria all'inizializzazione del componente e quando cambia lo stato di autenticazione
  useEffect(() => {
    fetchPromemoria();

    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        fetchPromemoria();
      }
    });

    return () => unsubscribe();
  }, []);

  // Salva un nuovo promemoria nel database Firestore
  const savePromemoria = async () => {
    try {
      const user = auth.currentUser;
      if (user) {
        const promemoriaRef = collection(db, 'users', user.uid, 'promemoria');
        // Aggiunge un nuovo documento con i dati del form
        const docRef = await addDoc(promemoriaRef, { ...formData, notified: false, completed: false });
        // Crea un nuovo oggetto promemoria con l'ID generato
        const newPromemoria = { id: docRef.id, ...formData, notified: false, completed: false };
        // Aggiorna lo stato aggiungendo il nuovo promemoria alla lista
        setPromemoriaList((prevList) => [...prevList, newPromemoria]);
        // Resetta lo stato del form dopo il salvataggio
        setFormData({ nome: '', giorno: '', ora: '', commento: '' });
        // Programma la notifica per il nuovo promemoria
        scheduleNotification(newPromemoria);
        setShowForm(false); // Chiude il form dopo aver salvato il promemoria
      }
    } catch (error) {
      console.error('Error saving promemoria:', error);
    }
  };

  // Gestisce l'invio del form di creazione dei promemoria
  const handleFormSubmit = (e) => {
    e.preventDefault();
    savePromemoria(); // Chiama la funzione savePromemoria
  };

  // Gestisce l'eliminazione di un promemoria dal database Firestore
  const handleDeletePromemoria = async (id) => {
    try {
      const user = auth.currentUser;
      if (user) {
        const promemoriaRef = doc(db, 'users', user.uid, 'promemoria', id);
        await deleteDoc(promemoriaRef); // Elimina il documento dal database
        // Aggiorna lo stato rimuovendo il promemoria dalla lista
        setPromemoriaList((prevList) => prevList.filter((item) => item.id !== id));
      }
    } catch (error) {
      console.error('Error deleting promemoria:', error);
    }
  };

  // Gestisce il cambiamento dello stato 'completato' di un promemoria nel database Firestore
  const handleToggleCompletePromemoria = async (id, currentStatus) => {
    try {
      const user = auth.currentUser;
      if (user) {
        const promemoriaRef = doc(db, 'users', user.uid, 'promemoria', id);
        const newStatus = !currentStatus;
        await updateDoc(promemoriaRef, { completed: newStatus });
        // Aggiorna lo stato aggiornando il promemoria specifico
        setPromemoriaList((prevList) =>
          prevList.map((item) => item.id === id ? { ...item, completed: newStatus } : item)
        );
      }
    } catch (error) {
      console.error('Error toggling complete promemoria:', error);
    }
  };

  // Programma la notifica per un promemoria specifico
  const scheduleNotification = (promemoria) => {
    // Crea una data combinando giorno e ora dal form
    const date = new Date(`${promemoria.giorno}T${promemoria.ora}`);
    // Ottiene la data e l'ora attuali
    const now = new Date();

    // Verifica se la data del promemoria è nel futuro
    if (date > now) {
      const delay = date - now; // Calcola il ritardo per la notifica
      setTimeout(() => {
        showNotification(promemoria); // Chiama la funzione per mostrare la notifica dopo il ritardo
      }, delay);
    }
  };

  // Mostra la notifica al momento programmato
  const showNotification = (promemoria) => {
    // Richiede il permesso per mostrare la notifica
    Notification.requestPermission().then((permission) => {
      // Verifica se il permesso è stato concesso
      if (permission === 'granted') {
        // Contenuto della notifica
        const options = {
          body: `${promemoria.commento} - ${promemoria.giorno} ${promemoria.ora}`,
          icon: '/dollar1.png'
        };
        // Crea e mostra la notifica
        new Notification(promemoria.nome, options);
  
        // Aggiorna lo stato per segnare il promemoria come notificato
        setPromemoriaList((prevList) =>
          prevList.map((item) =>
            item.id === promemoria.id ? { ...item, notified: true } : item
          )
        );
      }
    });
  };

  // Gestisce il click sul pulsante per tornare alla homepage
  const handleHomeClick = () => {
    navigate('/homepage');
  }

  // Se il componente è ancora in fase di caricamento, mostra un messaggio di caricamento
  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      {/* Pulsante per mostrare/nascondere il form di creazione di un nuovo promemoria, mette showForm a true */}
      <button id="crea-button" onClick={() => setShowForm(!showForm)}>+ Crea</button>
      {/* Mostra il form solo se showForm è true */}
      {showForm && (
        <form onSubmit={handleFormSubmit}>
          <div>
            {/* label per descrivere il campo di input associato */}
            <label> 
              Nome Promemoria:
              <input
                type="text"
                name="nome"
                value={formData.nome}
                onChange={handleInputChange}
                required
              />
            </label>
          </div>
          <div>
            <label>
              Giorno:
              <input
                type="date"
                name="giorno"
                value={formData.giorno}
                onChange={handleInputChange}
                required
              />
            </label>
          </div>
          <div>
            <label>
              Ora:
              <input
                type="time"
                name="ora"
                value={formData.ora}
                onChange={handleInputChange}
                required
              />
            </label>
          </div>
          <div>
            <label>
              Commento:
              <input
                type="text"
                name="commento"
                value={formData.commento}
                onChange={handleInputChange}
                required
              />
            </label>
          </div>
          <button id="imposta-button" type="submit">Imposta Promemoria</button>
        </form>
      )}
      {/* Titolo per la lista dei promemoria */}
      <h2>Promemoria</h2>
      {/* Contenitore per la lista dei promemoria */}
      {promemoriaList.length > 0 ? (
        <div className='promemoria-container'>
          {/* Lista dei promemoria con scrollbar se più di 5 */}
          <ul style={{ maxHeight: '200px', overflowY: promemoriaList.length > 5 ? 'scroll' : 'auto' }}>
            {/* Mappa ogni promemoria nella lista */}
            {promemoriaList.map((promemoria) => (
              <li key={promemoria.id} style={{ textDecoration: promemoria.completed ? 'line-through' : 'none' }}>
                {/* <button id="check-button" onClick={() => handleToggleCompletePromemoria(promemoria.id, promemoria.completed)}><FontAwesomeIcon icon={faCheck}/></button> */}
                {/* Checkbox per segnare il promemoria come completato */}
                <label className="checkbox-container">
                  <input 
                    className="custom-checkbox" 
                    type="checkbox" 
                    checked={promemoria.completed} 
                    onChange={() => handleToggleCompletePromemoria(promemoria.id, promemoria.completed)} 
                  />
                  <span className="checkmark"></span>
                </label>
                {/* Nome, commento, data e ora del promemoria */}
                {/* strong per il carattere in grassetto */}
                <strong>{promemoria.nome}</strong>: {promemoria.commento} - {promemoria.giorno} {promemoria.ora}
                {/* Pulsante per eliminare il promemoria */}
                <button id="delete-button" onClick={() => handleDeletePromemoria(promemoria.id)}>Elimina</button>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <p>Non ci sono promemoria...</p>// Messaggio se non ci sono promemoria nella lista
      )}
      {/* Pulsante per tornare alla homepage */}
      <button id="home-button" onClick={handleHomeClick}>Home</button>
    </div>
  );
};

export default Promemoria;
