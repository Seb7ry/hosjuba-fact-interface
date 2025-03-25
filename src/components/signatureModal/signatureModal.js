import React, { useState, useRef, useEffect } from "react";
import SignatureCanvas from "react-signature-canvas";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import signatureImg from "../../assets/ux/signature.png";
import { faCheck, faRedo, faTimes } from "@fortawesome/free-solid-svg-icons";
import "./signatureModal.css";

const SignatureModal = ({ isOpen, onClose, admission }) => {
    const [isSigned, setIsSigned] = useState(false);
    const [signatureData, setSignatureData] = useState(null);
    const signatureRef = useRef(null);

    const handleEnd = () => {
        if (signatureRef.current && !signatureRef.current.isEmpty()) {
            const dataURL = signatureRef.current.toDataURL();
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

    const handleConfirm = () => {
        if (signatureData) {
            onClose(signatureData);
        }
    };

    const MapAdmissionType = (type) => {
        if (type === 1) return "Urgencias";
        if (type === 99) return "Consulta Externa";
        return "Hospitalización";
    };

    useEffect(() => {
        document.body.style.overflow = isOpen ? "hidden" : "auto";
        return () => {
            document.body.style.overflow = "auto";
        };
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-container">
                <h2 className="modal-title">Firma Digital</h2>

                <div className="patient-container">
                    <div className="patient-image">
                        <img src={signatureImg} alt="Firma digital" className="signature-icon" />
                    </div>
                    <div className="patient-info">
                        <p><strong>Paciente:</strong> {admission.fullNamePatient}</p>
                        <p><strong>Documento:</strong> {admission.documentPatient}</p>
                        <p><strong>Fecha:</strong> {new Date(admission.dateAdmission).toLocaleDateString()}</p>
                        <p><strong>Servicio:</strong> {MapAdmissionType(admission.typeAdmission)}</p>
                    </div>
                </div>

                <div className="signature-area">
                    <SignatureCanvas
                        ref={signatureRef}
                        penColor="black"
                        canvasProps={{
                            className: "signature-canvas",
                            width: 500,
                            height: 200
                        }}
                        onEnd={handleEnd}
                    />
                </div>

                <div className="modal-buttons">
                    <button className="btn confirm-btn" onClick={handleConfirm} disabled={!isSigned}>
                        <FontAwesomeIcon icon={faCheck} /> Confirmar
                    </button>
                    <button className="btn reset-btn" onClick={handleClear}>
                        <FontAwesomeIcon icon={faRedo} /> Repetir
                    </button>
                    <button className="btn exit-btn" onClick={() => onClose(null)}>
                        <FontAwesomeIcon icon={faTimes} /> Salir
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SignatureModal;