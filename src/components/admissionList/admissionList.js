import React, { useState } from "react";
import "./admissionList.css";

const AdmissionList = ({ admissions, loading }) => {
    const itemsPerPage = 10; // Registros por página
    const [currentPage, setCurrentPage] = useState(1);

    // Calcular índices de paginación
    const totalPages = Math.ceil(admissions.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentAdmissions = admissions.slice(startIndex, endIndex);

    if (loading) {
        return (
            <div className="loading-container">
                <div className="spinner"></div>
            </div>
        );
    }

    return (        
        <div className="admission-list-container">
            <h2>Resultados de Admisión</h2>
            {admissions.length === 0 ? (
                <p className="no-results">No se encontraron admisiones.</p>
            ) : (
                <>
                    <table className="admission-table">
                        <thead>
                            <tr>
                                <th>no.Admisión</th>
                                <th>Documento</th>
                                <th>Nombre Paciente</th>
                                <th>Fecha</th>
                                <th>Servicio</th>
                                <th>Usuario</th>
                                <th>Acción</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentAdmissions.map((admission, index) => (
                                <tr key={index}>
                                    <td>{admission.consecutiveAdmission}</td>
                                    <td>{admission.documentPatient}</td>
                                    <td>{admission.fullNamePatient}</td>
                                    <td>{new Date(admission.dateAdmission).toLocaleDateString()}</td>
                                    <td>{admission.typeAdmission}</td>
                                    <td>{admission.userAdmission}</td>
                                    <td>
                                        <button className="view-btn">Ver</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {/* Paginación */}
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
                </>
            )}
        </div>
    );
};

export default AdmissionList;