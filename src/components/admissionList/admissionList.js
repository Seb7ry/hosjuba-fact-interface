import React, { useState, useEffect, useCallback } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSignature, faCheckCircle, faRedo, faTimesCircle } from "@fortawesome/free-solid-svg-icons";
import { getSignedAdmissions, updateAdmission } from "../../services/admissionService";
import SignatureModal from "../../components/signatureModal/signatureModal";
import "./admissionList.css";

const AdmissionList = ({ admissions, loading, shouldFetch }) => {
    
    const itemsPerPage = 10;
    const [currentPage, setCurrentPage] = useState(1);
    const [signedAdmissions, setSignedAdmissions] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedAdmission, setSelectedAdmission] = useState(null);
    const [isFetching, setIsFetching] = useState(false);
    const [isCheckingSignatures, setIsCheckingSignatures] = useState({});
    const [isUpdating, setIsUpdating] = useState({});

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
        if (isFetching || currentAdmissions.length === 0) return;

        setIsFetching(true);
        setIsCheckingSignatures((prev) =>
            Object.fromEntries(currentAdmissions.map((admission) => [admission.consecutiveAdmission, true]))
        );

        try {
            const response = await getSignedAdmissions(currentAdmissions);
            setSignedAdmissions(response || []);
        } catch (error) {
            console.error("Error al obtener admisiones firmadas:", error);
        } finally {
            setIsFetching(false);
            setIsCheckingSignatures({});
        }
        // eslint-disable-next-line
    }, [currentAdmissions]);

    useEffect(() => {
        fetchSignedAdmissions();

        // eslint-disable-next-line
    }, [currentPage, admissions]);

    useEffect(() => {
        setCurrentPage(1);
    }, [admissions]);

    const openModal = (admission) => {
        setSelectedAdmission(admission);
        setIsModalOpen(true);
    };

    const handleModalClose = async () => {
        setIsModalOpen(false);
        setSelectedAdmission(null);
        await fetchSignedAdmissions();
    };

    const handleUpdateAdmission = async (admission) => {
        setIsUpdating((prev) => ({
            ...prev,
            [admission.consecutiveAdmission]: true
        }));
        try {
            await updateAdmission(admission.documentPatient, admission.consecutiveAdmission);
            console.log("Admisión actualizada:", admission);
        } catch (error) {
            console.error("Error al actualizar la admisión:", error);
        } finally {
            setIsUpdating((prev) => ({
                ...prev,
                [admission.consecutiveAdmission]: false
            }));
        }
    };

    if (loading) {
        return (
            <div className="admission_list-loading">
                <div className="admission-spinner"></div>
            </div>
        );
    }

    return (
        <div className="admission__list-container">
            <h1>Resultados de Admisión</h1>
            {admissions.length === 0 ? (
                <p className="admission__no-results">No se encontraron admisiones.</p>
            ) : (
                <>
                    <table className="admission__list-table">
                        <thead>
                            <tr>
                                <th>No. Admisión</th>
                                <th>Documento</th>
                                <th>Nombre Paciente</th>
                                <th>Fecha</th>
                                <th>Servicio</th>
                                <th>Usuario</th>
                                <th>Firma</th>
                                <th>Actualizar</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentAdmissions.map((admission, index) => {
                                const isSigned = signedAdmissions.some(
                                    (signed) =>
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
                                        <td className="icon-cell">
                                            {isSigned ? (
                                                <FontAwesomeIcon icon={faCheckCircle} className="signed-icon" />
                                            ) : (
                                                <button className="signature-btn" onClick={() => openModal(admission)}>
                                                    {isCheckingSignatures[admission.consecutiveAdmission] ? (
                                                         <div className="admission-spinner-update"></div>
                                                    ) : (
                                                        <FontAwesomeIcon icon={faSignature} />
                                                    )}
                                                </button>
                                            )}
                                        </td>
                                        <td className="icon-cell">
                                            {isSigned ? (
                                                <button
                                                className={`update-btn ${isUpdating[admission.consecutiveAdmission] ? "loading" : ""}`}
                                                onClick={() => handleUpdateAdmission(admission)}
                                                disabled={isUpdating[admission.consecutiveAdmission]}
                                              >
                                                {isUpdating[admission.consecutiveAdmission] ? (
                                                   <div className="admission-spinner-update"></div>
                                                ) : (
                                                  <FontAwesomeIcon icon={faRedo} />
                                                )}
                                              </button>
                                              
                                            ) : (
                                                <FontAwesomeIcon
                                                    icon={faTimesCircle} 
                                                    className="not-signed-icon"
                                                />
                                            )}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>

                    <div className="admission__pagination">
                        <button
                            className="admission__pagination-btn"
                            onClick={() => setCurrentPage(currentPage - 1)}
                            disabled={currentPage === 1}
                        >
                            ⬅️ Anterior
                        </button>
                        <span>Página {currentPage} de {totalPages}</span>
                        <button
                            className="admission__pagination-btn"
                            onClick={() => setCurrentPage(currentPage + 1)}
                            disabled={currentPage === totalPages}
                        >
                            Siguiente ➡️
                        </button>
                    </div>
                </>
            )}

            <SignatureModal isOpen={isModalOpen} onClose={handleModalClose} admission={selectedAdmission} />
        </div>
    );
};

export default AdmissionList;
