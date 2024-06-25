// src/components/ExpenseItem.jsx
//Componente per visualizzare una singola spesa in una riga della tabella
import React from 'react'; //importo react
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashCan } from '@fortawesome/free-solid-svg-icons';

//Componente ExpenseItem prende tre props:
//indice elemento lista
//l'oggetto spesa che contiene i dettagli della spesa
//funzione per eliminare la spesa dalla lista
const ExpenseItem = ({ index, expense, deleteExpense }) => {
  //funzione che viene chiamata quando si clicca sul pulsante 'delete'
  const handleDelete = () => {
    deleteExpense(index);
  };

  return (
    //tr = riga della tabella, td = celle della tabella
    //prima cella = category
    //seconda cella = importo spesa
    //terza cella = data spesa
    //quarta cella = pulsante 'delete' che chiama la funzione handleDelete
    <tr>
      <td>{expense.category}</td>
      <td>{expense.title}</td>
      <td>{expense.amount} $ </td>
      <td>{expense.date}</td>
      <td>
        {/* buttone con il cestino per eliminare la spesa dalla lista */}
        <button className="delete-btn" onClick={handleDelete}>
          <FontAwesomeIcon icon={faTrashCan} />
        </button>
      </td>
    </tr>
  );
};

export default ExpenseItem;
