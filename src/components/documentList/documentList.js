import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFileAlt } from "@fortawesome/free-solid-svg-icons";
import "./documentList.css";
import DocumentModal from "../documentModal/documentModal";

const DocumentList = ({ admissions, loading, onRefresh }) => {
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
        if (type === '9') return "Triage";
        if (type === '99') return "Consulta Externa";
        return "Hospitalización";
    };

    useEffect(() => {
        if(currentPage > Math.ceil(admissions.length / itemsPerPage)) {
            setCurrentPage(1);
        }
        // eslint-disable-next-line
    }, [admissions]);

    const openModal = (admission) => {
        setSelectedAdmission(admission);
        setIsModalOpen(true);
    };

    if (loading) {
        return (
            <div className="document-list-loading">
                <div className="document-spinner"></div>
            </div>
        );
    }

    return (
        <div className="document-list-wrapper">
            <h1>Resultados de Comprobantes</h1>
            
            {admissions.length === 0 ? (
                <p className="document-list-no-results">No se encontraron admisiones.</p>
            ) : (
                <>
                    <table className="document-list-table">
                        <thead>
                            <tr>
                                <th>No. Admisión</th>
                                <th>Documento</th>
                                <th>Nombre Paciente</th>
                                <th>Fecha</th>
                                <th>Ingreso</th>
                                <th>Usuario</th>
                                <th>Comprobante</th>
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
                                        <button
                                            className="document-signature-btn"
                                            onClick={() => openModal(admission)}
                                        >
                                            <FontAwesomeIcon icon={faFileAlt} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    <div className="document-pagination">
                        <button
                            className="document-pagination-btn"
                            onClick={() => setCurrentPage(currentPage - 1)}
                            disabled={currentPage === 1}
                        >
                            ⬅️ Anterior
                        </button>
                        <span>Página {currentPage} de {totalPages}</span>
                        <button
                            className="document-pagination-btn"
                            onClick={() => setCurrentPage(currentPage + 1)}
                            disabled={currentPage === totalPages}
                        >
                            Siguiente ➡️
                        </button>
                    </div>
                </>
            )}

            <DocumentModal
                isOpen={isModalOpen}
                onClose={() => {
                    setIsModalOpen(false);
                    onRefresh();
                }}
                admission={selectedAdmission}
            />
        </div>
    );
};

export default DocumentList;
