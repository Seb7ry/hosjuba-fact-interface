import React, { useState, useRef, useEffect } from "react";
import SignatureCanvas from "react-signature-canvas";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import signatureImg from "../../assets/ux/signature.png"; // Imagen de firma
import { faCheck, faRedo, faTimes, faExclamationTriangle } from "@fortawesome/free-solid-svg-icons";
import "./signatureModal.css";

const SignatureModal = ({ isOpen, onClose, admission }) => {
    const [isSigned, setIsSigned] = useState(false);
    const [signatureData, setSignatureData] = useState(null);
    const [isDeviceAvailable, setIsDeviceAvailable] = useState(false);
    const signatureRef = useRef(null);

    // 🛠 Aseguramos que SignatureCanvas está montado antes de hacer la verificación
    useEffect(() => {
        if (isOpen) {
            setTimeout(() => {
                console.log("🔄 Verificando SignatureCanvas...");
                if (signatureRef.current && signatureRef.current.getCanvas()) {
                    console.log("✅ SignatureCanvas detectado correctamente.");
                    setIsDeviceAvailable(true);
                } else {
                    console.log("❌ No se detectó SignatureCanvas.");
                    setIsDeviceAvailable(false);
                }
            }, 300); // Reducimos el tiempo para hacer la verificación más rápida
        }
    }, [isOpen]); // Solo se ejecuta cuando el modal se abre

    // 🔹 Detecta si la firma está lista
    const handleEnd = () => {
        if (signatureRef.current && !signatureRef.current.isEmpty()) {
            setIsSigned(true);
            setSignatureData(signatureRef.current.toDataURL());
        }
    };

    // 🔄 Limpia la firma y reinicia el estado
    const handleClear = () => {
        if (signatureRef.current) {
            signatureRef.current.clear();
            setIsSigned(false);
            setSignatureData(null);
        }
    };

    // ✅ Confirma la firma y la envía (simulado en consola)
    const handleConfirm = () => {
        if (signatureRef.current && !signatureRef.current.isEmpty()) {
            console.log("✅ Firma confirmada:", signatureData);
            onClose();
        }
    };

    const MapAdmissionType = (type) => {
        if (type === 1) return "Urgencias";
        if (type === 99) return "Consulta Externa";
        return "Hospitalización";
    };

    // ❌ Cierra el modal con el botón "Salir"
    const handleClose = () => {
        handleClear();
        onClose();
    };

    // 🛑 Bloquear el scroll cuando el modal está abierto
    useEffect(() => {
        document.body.style.overflow = isOpen ? "hidden" : "auto";
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-container">
                <h2 className="modal-title">Firma Digital</h2>

                {/* 🔹 Información del paciente con imagen */}
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

                {/* 🔹 Área de firma */}
                <div className="signature-area">
                    {isDeviceAvailable ? (
                        isSigned ? (
                            <img src={signatureData} alt="Firma" className="signature-preview" />
                        ) : (
                            <SignatureCanvas
                                ref={signatureRef}
                                penColor="black"
                                onEnd={handleEnd}
                                canvasProps={{
                                    className: "signature-canvas",
                                }}
                            />
                        )
                    ) : (
                        <div className="no-device-detected">
                            <FontAwesomeIcon icon={faExclamationTriangle} className="warning-icon" />
                            <p>No se detectó ningún dispositivo de firma.</p>
                        </div>
                    )}
                </div>

                {/* 🔹 Botones */}
                <div className="modal-buttons">
                    <button className="btn confirm-btn" onClick={handleConfirm} disabled={!isSigned}>
                        <FontAwesomeIcon icon={faCheck} /> Confirmar
                    </button>
                    <button className="btn reset-btn" onClick={handleClear} disabled={!isSigned}>
                        <FontAwesomeIcon icon={faRedo} /> Repetir
                    </button>
                    <button className="btn exit-btn" onClick={handleClose}>
                        <FontAwesomeIcon icon={faTimes} /> Salir
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SignatureModal;
