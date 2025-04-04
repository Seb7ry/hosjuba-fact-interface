import React, { useState, useEffect } from "react";
import "./historyList.css";

const HistoryList = ({ history = [], loading, onFilterApplied, title = "Historial de Eventos" }) => {
    const itemsPerPage = 10;
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        setCurrentPage(1);
        if (onFilterApplied) onFilterApplied();
    }, [history, onFilterApplied]);

    const totalPages = Math.ceil(history.length / itemsPerPage);
    const paginatedHistory = history.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    if (loading) {
        return (
            <div className="history-list-loading">
                <div className="history-list-spinner" />
            </div>
        );
    }

    return (
        <div className="history-list-container">
            <h1 className="history-list-title">{title}</h1>

            {history.length === 0 ? (
                <p className="history-list-no-results">No hay eventos de historial disponibles.</p>
            ) : (
                <>
                    <div className="history-list-table-wrapper">
                        <table className="history-list-table">
                            <thead>
                                <tr>
                                    <th className="history-col-user">Usuario</th>
                                    <th className="history-col-message">Mensaje</th>
                                    <th className="history-col-context">Contexto</th>
                                    <th className="history-col-date">Fecha</th>
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
                    </div>

                    {totalPages > 1 && (
                        <div className="history-list-pagination">
                            <button
                                className="history-list-btn"
                                onClick={() => setCurrentPage(currentPage - 1)}
                                disabled={currentPage === 1}
                            >
                                ⬅️ Anterior
                            </button>
                            <span>Página {currentPage} de {totalPages}</span>
                            <button
                                className="history-list-btn"
                                onClick={() => setCurrentPage(currentPage + 1)}
                                disabled={currentPage === totalPages}
                            >
                                Siguiente ➡️
                            </button>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default HistoryList;
