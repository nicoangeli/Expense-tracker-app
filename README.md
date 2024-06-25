# Expense Tracker WebApp

L'Expense Tracker WebApp è una semplice applicazione web che ti aiuta a tenere traccia delle tue spese. Puoi aggiungere nuove voci di spesa, visualizzare il riepilogo delle tue spese e filtrare i risultati per data o per nome.
Si possono impostare promemoria per ricordarsi le scadenza dei pagamenti, o semplicemente per ricordasi una spesa da fare.

## Caratteristiche

- Aggiunta di nuove voci di spesa con descrizione, importo e data
- Visualizzazione di tutte le voci di spesa in un elenco
- Filtro delle voci di spesa per data
- Calcolo del totale delle spese

## Tecnologie utilizzate

- HTML, CSS, JavaScript, React.js
- Vite (per la configurazione e il build)
- Service Worker per la modalità offline
- Firebase e Firestone

## Installazione e avvio

1. Clona il repository:

```
git clone https://github.com/nicoangeli/expense-tracker-webapp.git
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
Se questa fosse già occupata verrebbe usata un'altra porta.

## Credenziali di test
1. Effettuare signin.

```
email: test@gmail.com
password: test123
```
2. Se si vuole testare anche il 'forgot password', utilizzare una mail accessibile all'utente.

## Modalità offline

L'Expense Tracker WebApp quando è offline, visualizza una pagina di fallback.

Per testare la modalità offline:

1. Avvia l'applicazione in modalità di sviluppo.
2. Apri il browser e simula l'assenza di connessione (ad esempio, utilizzando gli strumenti di sviluppo del browser).
3. Dovresti visualizzare la pagina di fallback offline.