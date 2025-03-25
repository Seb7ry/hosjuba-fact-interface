import React, { useState, useRef, useEffect } from "react";
import SignatureCanvas from "react-signature-canvas";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import signatureImg from "../../assets/ux/signature.png";
import { faCheck, faRedo, faTimes, faExclamationTriangle } from "@fortawesome/free-solid-svg-icons";
import "./signatureModal.css";

const SignatureModal = ({ isOpen, onClose, admission }) => {
    const [isSigned, setIsSigned] = useState(false);
    const [signatureData, setSignatureData] = useState(null);
    const [isDeviceAvailable, setIsDeviceAvailable] = useState(false);
    const [devices, setDevices] = useState([]);
    const signatureRef = useRef(null);
    const [hidDevice, setHidDevice] = useState(null);
    const [lastPoint, setLastPoint] = useState(null);

    // 1. Detección y configuración del dispositivo HID
    useEffect(() => {
        if (!isOpen) return;

        const requestHIDDevice = async () => {
            try {
                const filters = [
                    { usagePage: 0x0D, usage: 0x01 },
                    { usagePage: 0xFF00, usage: 0x01 }
                ];

                const [device] = await navigator.hid.requestDevice({ filters });
                
                if (device) {
                    await device.open();
                    console.log("Dispositivo HID conectado:", device);
                    setHidDevice(device);
                    setIsDeviceAvailable(true);
                    setDevices([device]);

                    device.addEventListener('inputreport', handleHIDData);
                }
            } catch (error) {
                console.error("Error con HID:", error);
                setIsDeviceAvailable(false);
            }
        };

        const handleHIDData = (event) => {
            const data = new Uint8Array(event.data.buffer);
            console.log("Datos del pad:", data);
            
            // Procesamiento básico de datos (ajustar según tu dispositivo)
            const x = (data[1] << 8) | data[0]; // Ejemplo para coordenada X
            const y = (data[3] << 8) | data[2]; // Ejemplo para coordenada Y
            const pressure = data[4]; // Ejemplo para presión
            
            if (signatureRef.current) {
                const ctx = signatureRef.current.getCanvas()
                    .getContext('2d');
                
                if (lastPoint) {
                    // Dibujar línea desde el último punto al actual
                    ctx.beginPath();
                    ctx.moveTo(lastPoint.x, lastPoint.y);
                    ctx.lineTo(x, y);
                    ctx.strokeStyle = '#000000';
                    ctx.lineWidth = Math.max(1, pressure / 10); // Ajustar según presión
                    ctx.lineCap = 'round';
                    ctx.lineJoin = 'round';
                    ctx.stroke();
                }
                
                setLastPoint({ x, y });
                setIsSigned(true);
            }
        };

        if ('hid' in navigator) {
            requestHIDDevice();
        } else {
            console.warn("WebHID no soportado");
            setIsDeviceAvailable(false);
        }

        return () => {
            if (hidDevice) {
                hidDevice.removeEventListener('inputreport', handleHIDData);
                hidDevice.close();
                setHidDevice(null);
            }
            setLastPoint(null);
        };
    }, [isOpen, lastPoint]);

    const handleEnd = () => {
        if (signatureRef.current && !signatureRef.current.isEmpty()) {
            const dataURL = signatureRef.current.toDataURL();
            setSignatureData(dataURL);
            console.log("Firma generada:", dataURL.substring(0, 50) + "...");
        }
    };

    const handleClear = () => {
        if (signatureRef.current) {
            signatureRef.current.clear();
            setIsSigned(false);
            setSignatureData(null);
            setLastPoint(null);
        }
    };

    const handleConfirm = () => {
        if (signatureData) {
            console.log("Firma confirmada:", signatureData.substring(0, 50) + "...");
            onClose();
        }
    };

    const MapAdmissionType = (type) => {
        if (type === 1) return "Urgencias";
        if (type === 99) return "Consulta Externa";
        return "Hospitalización";
    };

    useEffect(() => {
        document.body.style.overflow = isOpen ? "hidden" : "auto";
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
                    {isDeviceAvailable ? (
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
                    ) : (
                        <div className="no-device-detected">
                            <FontAwesomeIcon icon={faExclamationTriangle} className="warning-icon" />
                            <p>Conecte un pad de firma compatible</p>
                            {devices.length > 0 && (
                                <div>
                                    <h4>Dispositivo detectado:</h4>
                                    <p>{devices[0].productName}</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                <div className="modal-buttons">
                    <button className="btn confirm-btn" onClick={handleConfirm} disabled={!isSigned}>
                        <FontAwesomeIcon icon={faCheck} /> Confirmar
                    </button>
                    <button className="btn reset-btn" onClick={handleClear}>
                        <FontAwesomeIcon icon={faRedo} /> Repetir
                    </button>
                    <button className="btn exit-btn" onClick={onClose}>
                        <FontAwesomeIcon icon={faTimes} /> Salir
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SignatureModal;