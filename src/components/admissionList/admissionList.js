import React, { useState, useEffect, useCallback } from "react"; // Importa useCallback
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSignature, faCheckCircle } from "@fortawesome/free-solid-svg-icons";
import { getSignedAdmissions } from "../../services/admissionService";
import SignatureModal from "../../components/signatureModal/signatureModal";
import "./admissionList.css";

const AdmissionList = ({ admissions, loading }) => {
    const itemsPerPage = 10;
    const [currentPage, setCurrentPage] = useState(1);
    const [signedAdmissions, setSignedAdmissions] = useState([]); 
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedAdmission, setSelectedAdmission] = useState(null);
    const [isFetching, setIsFetching] = useState(false);

    const totalPages = Math.ceil(admissions.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentAdmissions = admissions.slice(startIndex, endIndex);

    const MapAdmissionType = (type) => {
        if (type === 1) return "Urgencias";
        if (type === 99) return "Consulta Externa";
        return "Hospitalización";
    };

    const fetchSignedAdmissions = useCallback(async () => {
        if (isFetching || currentAdmissions.length === 0) {
            return; 
        }

        setIsFetching(true);  
        try {
            const response = await getSignedAdmissions(currentAdmissions);
            setSignedAdmissions(response);
        } catch (error) {
            console.error("❌ Error al obtener admisiones firmadas:", error);
        } finally {
            setIsFetching(false);  
            
        }
    }, [currentAdmissions, isFetching]); 

    useEffect(() => {
        if (currentAdmissions.length > 0) {
            fetchSignedAdmissions(); 
        }
    /* eslint-disable-next-line react-hooks/exhaustive-deps */
    }, [currentPage]);

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
                                <th>Firma</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentAdmissions.map((admission, index) => {
                                const isSigned = signedAdmissions.some(signed => 
                                    String(signed.documentPatient) === String(admission.documentPatient) &&
                                    String(signed.consecutiveAdmission) === String(admission.consecutiveAdmission)
                                );

                                return (
                                    <tr key={index} className={isSigned ? "signed-row" : ""}>
                                        <td>{admission.consecutiveAdmission}</td>
                                        <td>{admission.documentPatient}</td>
                                        <td>{admission.fullNamePatient}</td>
                                        <td>{new Date(admission.dateAdmission).toLocaleDateString()}</td>
                                        <td>{MapAdmissionType(admission.typeAdmission)}</td>
                                        <td>{admission.userAdmission}</td>
                                        <td>
                                            {isSigned ? (
                                                <FontAwesomeIcon icon={faCheckCircle} className="signed-icon" />
                                            ) : (
                                                <button 
                                                    className="signature-btn" 
                                                    onClick={() => openModal(admission)}
                                                    
                                                >
                                                    <FontAwesomeIcon icon={faSignature} />
                                                </button>
                                            )}
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

export default AdmissionList;