import React, { useState, useEffect } from "react";
import "./historyList.css";

/**
 * Componente que muestra una lista de historial con paginación.
 * 
 * @component
 * @param {Object} props - Propiedades del componente.
 * @param {Array} props.history - Lista de registros de historial a mostrar.
 * @param {boolean} props.loading - Indica si los datos están cargando.
 * @param {Function} props.onFilterApplied - Función para resetear la paginación.
 * @returns {JSX.Element} Componente de lista de historial.
 */
const HistoryList = ({ history = [], loading, onFilterApplied }) => {
    const itemsPerPage = 10;
    const [currentPage, setCurrentPage] = useState(1);


    useEffect(() => {
        setCurrentPage(1);
        if (onFilterApplied) onFilterApplied();
    }, [history, onFilterApplied]);

    const totalPages = Math.ceil(history.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentHistory = history.slice(startIndex, endIndex);

    if (loading) {
        return (
            <div className="loading-container">
                <div className="spinner"></div>
            </div>
        );
    }

    return (
        <div className="history-list-container">
            <h2>Historial de Eventos</h2>

            {history.length === 0 ? (
                <p className="no-results">No hay eventos de historial disponibles.</p>
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
                            {currentHistory.map((event, index) => (
                                <tr key={index}>
                                    <td>{event.user || "N/A"}</td>
                                    <td>{event.message}</td>
                                    <td>{event.context || "N/A"}</td>
                                    <td>{new Date(event.timestamp).toLocaleString()}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {totalPages > 1 && (
                        <div className="pagination">
                            <button 
                                className="pagination-btn" 
                                onClick={() => setCurrentPage(currentPage - 1)} 
                                disabled={currentPage === 1}
                            >
                                ⬅️ Anterior
                            </button>
                            <span>Página {currentPage} de {totalPages}</span>
                            <button 
                                className="pagination-btn" 
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