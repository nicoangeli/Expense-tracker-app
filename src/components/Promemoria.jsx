import React, { useState, useEffect } from 'react';
import { collection, doc, addDoc, getDocs, deleteDoc, updateDoc } from 'firebase/firestore';
import { auth, db } from './firebase';
import { useNavigate } from 'react-router-dom';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck } from '@fortawesome/free-solid-svg-icons';

import './Promemoria.css';

const Promemoria = () => {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    nome: '',
    giorno: '',
    ora: '',
    commento: ''
  });
  const [promemoriaList, setPromemoriaList] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const fetchPromemoria = async () => {
    try {
      const user = auth.currentUser;
      if (user) {
        const promemoriaRef = collection(db, 'users', user.uid, 'promemoria');
        const snapshot = await getDocs(promemoriaRef);
        const promemoriaData = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setPromemoriaList(promemoriaData);
      }
    } catch (error) {
      console.error('Error fetching promemoria:', error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchPromemoria();

    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        fetchPromemoria();
      }
    });

    return () => unsubscribe();
  }, []);

  const savePromemoria = async () => {
    try {
      const user = auth.currentUser;
      if (user) {
        const promemoriaRef = collection(db, 'users', user.uid, 'promemoria');
        const docRef = await addDoc(promemoriaRef, { ...formData, notified: false, completed: false });
        const newPromemoria = { id: docRef.id, ...formData, notified: false, completed: false };
        setPromemoriaList((prevList) => [...prevList, newPromemoria]);
        setFormData({ nome: '', giorno: '', ora: '', commento: '' });
        scheduleNotification(newPromemoria);
        setShowForm(false); // Chiude il form dopo aver salvato il promemoria
      }
    } catch (error) {
      console.error('Error saving promemoria:', error);
    }
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    savePromemoria();
  };

  const handleDeletePromemoria = async (id) => {
    try {
      const user = auth.currentUser;
      if (user) {
        const promemoriaRef = doc(db, 'users', user.uid, 'promemoria', id);
        await deleteDoc(promemoriaRef);
        setPromemoriaList((prevList) => prevList.filter((item) => item.id !== id));
      }
    } catch (error) {
      console.error('Error deleting promemoria:', error);
    }
  };

  const handleToggleCompletePromemoria = async (id, currentStatus) => {
    try {
      const user = auth.currentUser;
      if (user) {
        const promemoriaRef = doc(db, 'users', user.uid, 'promemoria', id);
        const newStatus = !currentStatus;
        await updateDoc(promemoriaRef, { completed: newStatus });
        setPromemoriaList((prevList) =>
          prevList.map((item) => item.id === id ? { ...item, completed: newStatus } : item)
        );
      }
    } catch (error) {
      console.error('Error toggling complete promemoria:', error);
    }
  };

  const scheduleNotification = (promemoria) => {
    const date = new Date(`${promemoria.giorno}T${promemoria.ora}`);
    const now = new Date();

    if (date > now) {
      const delay = date - now;
      setTimeout(() => {
        showNotification(promemoria);
      }, delay);
    }
  };

  const showNotification = (promemoria) => {
    Notification.requestPermission().then((permission) => {
      if (permission === 'granted') {
        const options = {
          body: `${promemoria.commento} - ${promemoria.giorno} ${promemoria.ora}`,
          icon: '/dollar1.png'
        };
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

  const handleHomeClick = () => {
    navigate('/homepage');
  }

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <button id="crea-button" onClick={() => setShowForm(!showForm)}>+ Crea</button>
      {showForm && (
        <form onSubmit={handleFormSubmit}>
          <div>
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
      <h2>Promemoria</h2>
      {promemoriaList.length > 0 ? (
        <div className='promemoria-container'>
          <ul style={{ maxHeight: '200px', overflowY: promemoriaList.length > 5 ? 'scroll' : 'auto' }}>
            {promemoriaList.map((promemoria) => (
              <li key={promemoria.id} style={{ textDecoration: promemoria.completed ? 'line-through' : 'none' }}>
                {/* <button id="check-button" onClick={() => handleToggleCompletePromemoria(promemoria.id, promemoria.completed)}><FontAwesomeIcon icon={faCheck}/></button> */}
                <label className="checkbox-container">
                  <input 
                    className="custom-checkbox" 
                    type="checkbox" 
                    checked={promemoria.completed} 
                    onChange={() => handleToggleCompletePromemoria(promemoria.id, promemoria.completed)} 
                  />
                  <span className="checkmark"></span>
                </label>
                <strong>{promemoria.nome}</strong>: {promemoria.commento} - {promemoria.giorno} {promemoria.ora}
                <button id="delete-button" onClick={() => handleDeletePromemoria(promemoria.id)}>Elimina</button>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <p>Non ci sono promemoria...</p>
      )}
      <button id="home-button" onClick={handleHomeClick}>Home</button>
    </div>
  );
};

export default Promemoria;
