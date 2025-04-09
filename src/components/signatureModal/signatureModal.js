import React, { useState, useRef, useEffect } from "react";
import SignatureCanvas from "react-signature-canvas";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faRedo, faTimes } from "@fortawesome/free-solid-svg-icons";

import { saveAdmission } from "../../services/admissionService";
import ConfirmationModal from "../confirmationModal/confirmationModal";
import "./signatureModal.css";

const SignatureModal = ({ isOpen, onClose, admission }) => {
    const [isSigned, setIsSigned] = useState(false);
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [signatureData, setSignatureData] = useState(null);
    const [isUploading, setIsUploading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [signer, setSigner] = useState(""); 
    const signatureRef = useRef(null);

    const handleEnd = () => {
        if (signatureRef.current && !signatureRef.current.isEmpty()) {
            const dataURL = signatureRef.current.toDataURL().split(",")[1]; 
            setSignatureData(dataURL);
            setIsSigned(true);
        }
    };

    const handleClear = () => {
        if (signatureRef.current) {
            signatureRef.current.clear();
            setIsSigned(false);
            setSignatureData(null);
        }
    };

    const handleFinalConfirm = async () => {
        setShowConfirmModal(false); 
    
        setIsUploading(true);
        try {
            let signedBy = signer;
    
            // eslint-disable-next-line
            const response = await saveAdmission(
                admission.documentPatient,
                admission.consecutiveAdmission,
                signatureData,
                signedBy
            );
    
            setIsSuccess(true);
            setTimeout(() => onClose(null), 2000);
        } catch (error) {
            console.error("❌ Error al guardar la admisión:", error);
            alert("Hubo un error al registrar la firma. Inténtalo de nuevo.");
        } finally {
            setIsUploading(false);
        }
    };    

    const MapAdmissionType = (type) => {
        if (type === 1) return "Urgencias";
        if (type === 9) return "Triage";
        if (type === 99) return "Consulta Externa";
        return "Hospitalización";
    };

    useEffect(() => {
        document.body.style.overflow = isOpen ? "hidden" : "auto";
        return () => {
            document.body.style.overflow = "auto";
        };
    }, [isOpen]);

    useEffect(() => {
        if(isOpen){
            if(signatureRef.current) {
                signatureRef.current.clear();
            }
            setIsSigned(false);
            setSignatureData(null);
            setIsSuccess(false);
            setSigner("");
            setIsUploading(false);
        }
    }, [isOpen, admission]);

    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-container">
                <h2 className="modal-title">Firma Digital</h2>

                <div className="patient-container">
                    <div className="patient-info">
                        <p><strong>Paciente:</strong> {admission.fullNamePatient}</p>
                        <p><strong>Documento:</strong> {admission.documentPatient}</p>
                        <p><strong>Fecha:</strong> {new Date(admission.dateAdmission).toLocaleDateString()}</p>
                        <p><strong>Servicio Ingreso:</strong> {MapAdmissionType(admission.typeAdmission)}</p>
                    </div>
                </div>

                {isSuccess ? (
                    <div className="success-message">
                        <div className="success-icon">
                            <FontAwesomeIcon icon={faCheck} size="2x" />
                        </div>
                        <h3>Firma registrada correctamente</h3>
                        <button className="btn exit-btn" onClick={() => onClose(null)}>
                            <FontAwesomeIcon icon={faTimes} /> Cerrar
                        </button>
                    </div>
                ) : (
                    <>
                        <div className="signer-select">
                            <label htmlFor="signer"><strong>¿Quién firma?</strong></label>
                            <select
                                id="signer"
                                value={signer}
                                onChange={(e) => setSigner(e.target.value)}
                            >
                                <option value="">Seleccione...</option>
                                <option value="patient">Paciente</option>
                                <option value="companion">Acompañante</option>
                                
                            </select>
                        </div>

                        <div className="signature-area">
                            <SignatureCanvas
                                ref={signatureRef}
                                penColor="black"
                                canvasProps={{
                                    className: "signature-canvas"
                                }}
                                onEnd={handleEnd}
                            />
                        </div>

                        <div className="modal-buttons">
                        <button 
                            className="btn confirm-btn" 
                            onClick={() => setShowConfirmModal(true)} 
                            disabled={!isSigned || isUploading || !signer}
                        >
                            {isUploading ? "Enviando..." : <><FontAwesomeIcon icon={faCheck} /> Confirmar</>}
                        </button>
                            <button className="btn reset-btn" onClick={handleClear} disabled={isUploading}>
                                <FontAwesomeIcon icon={faRedo} /> Repetir
                            </button>
                            <button className="btn exit-btn" onClick={() => onClose(null)} disabled={isUploading}>
                                <FontAwesomeIcon icon={faTimes} /> Salir
                            </button>
                        </div>
                    </>
                )}
            </div>

            <ConfirmationModal
                isOpen={showConfirmModal}
                onConfirm={handleFinalConfirm}
                onCancel={() => setShowConfirmModal(false)}
                admission={admission}
            />
        </div>
    );
};

export default SignatureModal;
