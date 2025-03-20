import React, { useState } from "react";
import "./recordList.css";

/**
 * Componente que muestra una lista de registros con paginación.
 * 
 * @component
 * @param {Object} props - Propiedades del componente.
 * @param {Array} props.logs - Lista de registros a mostrar.
 * @param {boolean} props.loading - Indica si los datos están cargando.
 * @returns {JSX.Element} Componente de lista de registros.
 */
const RecordList = ({ logs = [], loading }) => {
    const itemsPerPage = 10;
    const [currentPage, setCurrentPage] = useState(1);

    const totalPages = Math.ceil(logs.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentLogs = logs.slice(startIndex, endIndex);

    /**
     * Mapea el nivel del log a un color y estilo visual.
     * 
     * @param {string} level - Nivel del log (info, warn, error).
     * @returns {string} Nombre del nivel formateado.
     */
    const mapLogLevel = (level) => {
        const levels = {
            info: "ℹ️ INFO",
            warn: "⚠️ ADVERTENCIA",
            error: "❌ ERROR"
        };
        return levels[level] || level.toUpperCase();
    };

    if (loading) {
        return (
            <div className="loading-container">
                <div className="spinner"></div>
            </div>
        );
    }

    return (
        <div className="record-list-container">
            <h2>Historial de Registros</h2>

            {/* Mensaje cuando no hay resultados */}
            {logs.length === 0 ? (
                <p className="no-results">No hay registros disponibles.</p>
            ) : (
                <>
                    {/* Tabla con la lista de registros */}
                    <table className="record-table">
                        <thead>
                            <tr>
                                <th>Nivel</th>
                                <th>Usuario</th>
                                <th>Mensaje</th>
                                <th>Contexto</th>
                                <th>Fecha</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentLogs.map((log, index) => (
                                <tr key={index} className={`log-${log.level}`}>
                                    <td className="log-level">{mapLogLevel(log.level)}</td>
                                    <td>{log.user}</td>
                                    <td>{log.message}</td>
                                    <td>{log.context || "N/A"}</td>
                                    <td>{new Date(log.timestamp).toLocaleString()}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {/* Sección de paginación */}
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

export default RecordList;
