# Expense Tracker WebApp

L'Expense Tracker WebApp è una semplice applicazione web che ti aiuta a tenere traccia delle tue spese. Puoi aggiungere nuove voci di spesa, visualizzare il riepilogo delle tue spese e filtrare i risultati per data.

## Caratteristiche

- Aggiunta di nuove voci di spesa con descrizione, importo e data
- Visualizzazione di tutte le voci di spesa in un elenco
- Filtro delle voci di spesa per data
- Calcolo del totale delle spese
- Modalità offline con service worker e cache

## Tecnologie utilizzate

- React.js
- Vite (per la configurazione e il build)
- Service Worker e Cache API per la modalità offline
- CSS per lo stile

## Installazione e avvio

1. Clona il repository:

```
git clone https://github.com/tuonome/expense-tracker-webapp.git
```

2. Installa le dipendenze:

```
cd expense-tracker-webapp
npm install
```

3. Avvia l'applicazione in modalità di sviluppo:

```
npm run dev
```

L'applicazione sarà disponibile all'indirizzo `http://localhost:3000`.

## Modalità offline

L'Expense Tracker WebApp supporta la modalità offline grazie all'utilizzo di Service Worker e Cache API. Quando l'utente è offline, l'applicazione utilizzerà i dati memorizzati nella cache per continuare a funzionare.

Per testare la modalità offline:

1. Avvia l'applicazione in modalità di sviluppo.
2. Apri il browser e simula l'assenza di connessione (ad esempio, utilizzando gli strumenti di sviluppo del browser).
3. Dovresti essere in grado di interagire con l'applicazione e aggiungere nuove voci di spesa, che verranno salvate nella cache.

## Roadmap

- Implementare la sincronizzazione dei dati tra online e offline
- Aggiungere la possibilità di modificare e eliminare le voci di spesa
- Implementare grafici e statistiche sulle spese
- Aggiungere la possibilità di condividere le spese con altri utenti

## Contribuire

Se vuoi contribuire al progetto, sei il benvenuto! Puoi segnalare bug, proporre miglioramenti o inviare pull request.