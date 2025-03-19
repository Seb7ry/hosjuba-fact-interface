import React, { useState, useRef, useEffect } from "react";
import SignatureCanvas from "react-signature-canvas";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import signatureImg from "../../assets/ux/signature.png"; // Imagen de firma
import { faCheck, faRedo, faTimes, faExclamationTriangle } from "@fortawesome/free-solid-svg-icons";
import "./signatureModal.css";

const SignatureModal = ({ isOpen, onClose, admission }) => {
    const [isSigned, setIsSigned] = useState(false);
    const [signatureData, setSignatureData] = useState(null);
    const [isDeviceAvailable, setIsDeviceAvailable] = useState(false); // Inicialmente asumimos que no hay dispositivo
    const [devices, setDevices] = useState([]); // Para almacenar los dispositivos detectados
    const signatureRef = useRef(null);

    useEffect(() => {
        if (isOpen) {
            // Conexión al servidor WebSocket
            const ws = new WebSocket('ws://localhost:8080');  // Conectar al servidor WebSocket (en el puerto 8080)
    
            // Cuando el WebSocket se conecta y recibe datos
            ws.onmessage = (event) => {
                const data = JSON.parse(event.data);
                console.log("Mensaje recibido del WebSocket:", data);
    
                if (data.type === 'signature-data') {
                    // Mostrar los datos recibidos en el cliente
                    console.log("Datos de la firma:", data.data);
    
                    // Si los datos de la firma son válidos, puedes actualizar el estado de la firma
                    setSignatureData(data.data); // Aquí guardamos la firma en formato base64 o hex
                }
    
                if (data.devices && data.devices.length > 0) {
                    setIsDeviceAvailable(true);  // Dispositivo de firma detectado
                    setDevices(data.devices);   // Actualiza los dispositivos disponibles
                } else {
                    setIsDeviceAvailable(false);  // No se detectó ningún dispositivo
                }
            };
    
            // Cerrar WebSocket cuando se cierre el modal
            return () => {
                ws.close();
            };
        }
    }, [isOpen]);
    

    // Verifica si la firma está lista
    const handleEnd = () => {
        if (signatureRef.current && !signatureRef.current.isEmpty()) {
            setIsSigned(true);
            setSignatureData(signatureRef.current.toDataURL()); // Guardar la firma en formato Base64
        }
    };

    // Limpiar la firma y reiniciar el estado
    const handleClear = () => {
        if (signatureRef.current) {
            signatureRef.current.clear();
            setIsSigned(false);
            setSignatureData(null);
        }
    };

    // Confirmar la firma y la envía
    const handleConfirm = () => {
        if (signatureData) {
            console.log("Firma confirmada:", signatureData);
            onClose(); // Cerrar el modal
        }
    };

    const MapAdmissionType = (type) => {
        if (type === 1) return "Urgencias";
        if (type === 99) return "Consulta Externa";
        return "Hospitalización";
    };

    // Cierra el modal con el botón "Salir"
    const handleClose = () => {
        handleClear();
        onClose();
    };

    // Bloquear el scroll cuando el modal está abierto
    useEffect(() => {
        document.body.style.overflow = isOpen ? "hidden" : "auto";
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-container">
                <h2 className="modal-title">Firma Digital</h2>

                {/* Información del paciente con imagen */}
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

                {/* Área de firma */}
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
                                    disabled: !isDeviceAvailable, // Deshabilitar el canvas si no hay dispositivo disponible
                                }}
                            />
                        )
                    ) : (
                        <div className="no-device-detected">
                            <FontAwesomeIcon icon={faExclamationTriangle} className="warning-icon" />
                            <p>No se detectó ningún dispositivo de firma.</p>
                            {/* Mostrar los dispositivos detectados */}
                            {devices.length > 0 && (
                                <div>
                                    <h4>Dispositivos detectados:</h4>
                                    {devices.map((device, index) => (
                                        <div key={index}>
                                            <p>{device.product} - {device.manufacturer}</p>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Botones */}
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
