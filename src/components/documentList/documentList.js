import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFileAlt } from "@fortawesome/free-solid-svg-icons";
import SignatureModal from "../signatureModal/signatureModal";
import "./documentList.css";

const DocumentList = ({ admissions, loading }) => {
    const itemsPerPage = 10;
    const [currentPage, setCurrentPage] = useState(1);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedAdmission, setSelectedAdmission] = useState(null);

    const totalPages = Math.ceil(admissions.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentAdmissions = admissions.slice(startIndex, endIndex);

    const MapAdmissionType = (type) => {
        if (type === '1') return "Urgencias";
        if (type === '99') return "Consulta Externa";
        return "Hospitalización";
    };

    useEffect(() => {
        setCurrentPage(1);
    }, [admissions]);

    const openModal = (admission) => {
        setSelectedAdmission(admission);
        setIsModalOpen(true);
    };

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
                                <th>No. Admisión</th>
                                <th>Documento</th>
                                <th>Nombre Paciente</th>
                                <th>Fecha</th>
                                <th>Servicio</th>
                                <th>Usuario</th>
                                <th>Comprobante</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentAdmissions.map((admission, index) => {
                                return (
                                    <tr key={index}>
                                        <td>{admission.consecutiveAdmission}</td>
                                        <td>{admission.documentPatient}</td>
                                        <td>{admission.namePatient}</td>
                                        <td>{new Date(admission.dateAdmission).toLocaleDateString()}</td>
                                        <td>{MapAdmissionType(admission.typeAdmission)}</td>
                                        <td>{admission.userAdmission}</td>
                                        <td>
                                            <button
                                                className="signature-btn"
                                                onClick={() => openModal(admission)}
                                            >
                                                <FontAwesomeIcon icon={faFileAlt} />
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>

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

            {/* Modal de Firma */}
            <SignatureModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                admission={selectedAdmission}
            />
        </div>
    );
};

export default DocumentList;
