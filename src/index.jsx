import React from 'react';
import ReactDOM from 'react-dom/client';
// importo il componente principale App
import App from './App';
import './index.css';

// Registrazione del Service Worker
// verifico che il browser supporti i service worker
if ('serviceWorker' in navigator) {
  // quando la pagina è caricata aggiungo un evento listener(per l'ascolto)
  window.addEventListener('load', () => {
    // registra il service worker specificato dal percorso
    navigator.serviceWorker.register('/sw.js')
    .then((registration) => {
      // messaggio se registrazione avvenuta con successo
      console.log('Service Worker registrato con successo!', registration);
    })
    .catch((error) => {
      // messaggio se registrazione non avvenuta con successo
      console.error('Errore nella registrazione del Service Worker:', error);
    });
  });
}
// crea un root React che renderizza l'applicazione nel nodo HTML con l'id root
const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    {/* componente principale ed iniziale del render */}
    <App /> 
  </React.StrictMode>
);



