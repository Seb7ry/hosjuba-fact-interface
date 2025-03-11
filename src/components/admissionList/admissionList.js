import React, { useState } from "react";
import "./admissionList.css";

/**
 * Componente que muestra una lista de admisiones con paginación.
 * 
 * @component
 * @param {Object} props - Propiedades del componente.
 * @param {Array} props.admissions - Lista de admisiones a mostrar.
 * @param {boolean} props.loading - Indica si los datos están cargando.
 * @returns {JSX.Element} Componente de lista de admisiones.
 */
const AdmissionList = ({ admissions, loading }) => {
    const itemsPerPage = 10;
    const [currentPage, setCurrentPage] = useState(1);

    const totalPages = Math.ceil(admissions.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentAdmissions = admissions.slice(startIndex, endIndex);

    /**
     * Mapea el tipo de admisión a su nombre correspondiente.
     * 
     * @param {number} type - Código del tipo de admisión.
     * @returns {string} Nombre del tipo de admisión.
     */
    const MapAdmissionType = (type) => {
        if( type === 1 ) return "Urgencias";
        if( type === 99 ) return "Consulta Externa";
        return "Hospitalización";
    }

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
            {/* Mensaje cuando no hay resultados */}
            {admissions.length === 0 ? (
                <p className="no-results">No se encontraron admisiones.</p>
            ) : (
                <>
                    {/* Tabla con la lista de admisiones */}
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
                                    <td>{MapAdmissionType(admission.typeAdmission)}</td>
                                    <td>{admission.userAdmission}</td>
                                    <td>
                                        <button className="view-btn">Ver</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {/* Sección de paginación */}
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