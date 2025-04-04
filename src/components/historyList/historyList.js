import React, { useState, useEffect } from "react";
import "./historyList.css";

const HistoryList = ({ history = [], loading, onFilterApplied }) => {
  const itemsPerPage = 10;
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    setCurrentPage(1);
    if (onFilterApplied) onFilterApplied();
  }, [history, onFilterApplied]);

  const totalPages = Math.ceil(history.length / itemsPerPage);
  const paginatedHistory = history.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  if (loading) {
    return (
      <div className="history-loading">
        <div className="history-spinner" />
      </div>
    );
  }

  return (
    <div className="history-container">
      <h2>Historial de Eventos</h2>

      {history.length === 0 ? (
        <p className="history-empty">No hay eventos de historial disponibles.</p>
      ) : (
        <>
          <table className="history-table">
            <thead>
              <tr>
                <th>Usuario</th>
                <th>Mensaje</th>
                <th>Contexto</th>
                <th>Fecha</th>
              </tr>
            </thead>
            <tbody>
              {paginatedHistory.map((event, index) => (
                <tr key={index}>
                  <td>{event.user || "N/A"}</td>
                  <td>{event.message}</td>
                  <td>{event.context || "N/A"}</td>
                  <td>{new Date(event.timestamp).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="history-pagination">
            <button
              onClick={() => setCurrentPage(currentPage - 1)}
              disabled={currentPage === 1}
              className="pagination-button"
            >
              ⬅️ Anterior
            </button>
            <span>Página {currentPage} de {totalPages}</span>
            <button
              onClick={() => setCurrentPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="pagination-button"
            >
              Siguiente ➡️
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default HistoryList;
