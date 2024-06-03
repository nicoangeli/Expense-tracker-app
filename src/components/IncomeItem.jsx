// src/components/ExpenseItem.jsx
//Componente per visualizzare una singola spesa in una riga della tabella
import React from 'react'; //importo react
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashCan } from '@fortawesome/free-solid-svg-icons';
//Componente ExpenseItem prende tre props:
//indice elemento lista
//l'oggetto spesa che contiene i dettagli della spesa
//funzioner per eliminare la spesa dalla lista
const IncomeItem = ({ index, income, deleteIncome }) => {
  //funzione che viene chiamata quando si clicca sul pulsante 'delete'
  const handleDelete = () => {
    deleteIncome(index);
  };

  return (
    //tr = riga della tabella, td = celle della tabella
    //prima cella = category
    //seconda cella = importo spesa
    //terza cella = data spesa
    //quarta cella = pulsante 'delete' che chiama la funzione handleDelete
    <tr>
      <td>{income.category}</td>
      <td>{income.title}</td>
      <td>{income.amount} $ </td>
      <td>{income.date}</td>
      <td>
        <button className="delete-btn" onClick={handleDelete}>
            <FontAwesomeIcon icon={faTrashCan} />
        </button>
      </td>
    </tr>
  );
};

export default IncomeItem;
