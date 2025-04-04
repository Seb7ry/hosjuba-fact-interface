import React, { useState, useEffect } from "react";
import "./recordList.css";

const RecordList = ({ logs = [], loading, onFilterApplied, title = "Historial de Registros" }) => {
    const itemsPerPage = 10;
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        setCurrentPage(1);
        if (onFilterApplied) onFilterApplied();
    }, [logs, onFilterApplied]);

    const totalPages = Math.ceil(logs.length / itemsPerPage);
    const currentLogs = logs.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    const mapLogLevel = (level) => {
        const levels = {
            warn: "⚠️ Advertencia",
            error: "⛔ Error",
        };
        return levels[level] || "ℹ️ Info";
    };

    const getRowClass = (level) => {
        if (level === "error") return "record-list-row-error";
        if (level === "warn") return "record-list-row-warn";
        return "";
    };

    if (loading) {
        return (
            <div className="record-list-loading">
                <div className="record-list-spinner"></div>
            </div>
        );
    }

    return (
        <div className="record-list-container">
            <h1 className="record-list-title">{title}</h1>

            {logs.length === 0 ? (
                <p className="record-list-no-results">No hay registros disponibles.</p>
            ) : (
                <>
                    <div className="record-list-table-wrapper">
                        <table className="record-list-table">
                            <thead>
                                <tr>
                                    <th className="record-col-nivel">Nivel</th>
                                    <th className="record-col-mensaje">Mensaje</th>
                                    <th className="record-col-contexto">Contexto</th>
                                    <th className="record-col-fecha">Fecha</th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentLogs.map((log, index) => (
                                    <tr key={index} className={getRowClass(log.level)}>
                                        <td>{mapLogLevel(log.level)}</td>
                                        <td>{log.message}</td>
                                        <td>{log.context || "N/A"}</td>
                                        <td>{new Date(log.timestamp).toLocaleString()}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {totalPages > 1 && (
                        <div className="record-list-pagination">
                            <button
                                className="record-list-btn"
                                onClick={() => setCurrentPage(currentPage - 1)}
                                disabled={currentPage === 1}
                            >
                                ⬅️ Anterior
                            </button>
                            <span>Página {currentPage} de {totalPages}</span>
                            <button
                                className="record-list-btn"
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
