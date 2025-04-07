import React, { useEffect, useState, useRef } from "react";
import modalDocumentImg from "../../assets/ux/modal-document.png";
import "./documentModal.css";
import { getAllFact, downloadPdf } from "../../services/documentService";

const DocumentModal = ({ isOpen, onClose, admission }) => {
    const [facturas, setFacturas] = useState([]);
    const [selectedFactura, setSelectedFactura] = useState(null);
    const [pdfUrl, setPdfUrl] = useState(null);
    const [loading, setLoading] = useState(false);
    const [iframeKey, setIframeKey] = useState(0);
    const scrollPosition = useRef(0);

    const MapAdmissionType = (type) => {
        if (type === '1') return "Urgencias";
        if (type === '9') return "Triage";
        if (type === '99') return "Consulta Externa";
        return "Hospitalización";
    };

    useEffect(() => {
        if (isOpen) {
            scrollPosition.current = window.scrollY;

            document.body.classList.add('modal-open');

            const handleKeyDown = (e) => {
                if (e.key === 'Escape') {
                    e.preventDefault();
                    e.stopPropagation();
                }
            };
            
            window.addEventListener('keydown', handleKeyDown, { capture: true });
            
            return () => {
                document.body.classList.remove('modal-open');
                window.removeEventListener('keydown', handleKeyDown, { capture: true });

                window.scrollTo(0, scrollPosition.current);
            };
        }
    }, [isOpen]);

    
    useEffect(() => {
        if (isOpen && admission) {
            getAllFact(admission.documentPatient, admission.consecutiveAdmission)
                .then(response => {
                    setFacturas(response); 
                    if (response.length > 0) {
                        setSelectedFactura(response[0]);
                        loadPdf(response[0].MPNFac);
                    } else {
                        setSelectedFactura(null);
                        loadPdf();
                    }
                })
                .catch(error => console.error("Error al obtener facturas:", error));
        }
        // eslint-disable-next-line
    }, [isOpen, admission]);

    const loadPdf = async (numberFac = null) => {
        try {
            setLoading(true);
            setPdfUrl(null); 
            setIframeKey(prev => prev + 1); 

            await new Promise(resolve => setTimeout(resolve, 100));
    
            const pdfBlob = await downloadPdf(admission.documentPatient, admission.consecutiveAdmission, numberFac);
            await new Promise(resolve => setTimeout(resolve, 1000));
    
            if (pdfBlob instanceof Blob) {
                const url = window.URL.createObjectURL(pdfBlob);
                setPdfUrl(url);
            } else {
                console.error("Error: No se ha recibido un Blob válido del servidor.");
            }
        } catch (error) {
            console.error("Error al cargar el PDF:", error);
        } finally {
            setLoading(false);
        }
    };
    

    const handleFacturaClick = (factura) => {
        setSelectedFactura(factura);
        loadPdf(factura.MPNFac);
    };

    if (!isOpen || !admission) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <button className="close-button" onClick={onClose}>✖</button>

                <div className="modal-header">
                    <div className="patient-image">
                        <img src={modalDocumentImg} alt="Paciente" />
                    </div>
                    <div className="patient-info">
                        <h2>Información de la Admisión</h2>
                        <p><strong>Nombre:</strong> {admission.fullNamePatient}</p>
                        <p><strong>Documento:</strong> {admission.documentPatient}</p>
                        <p><strong>Fecha:</strong> {new Date(admission.dateAdmission).toLocaleDateString()}</p>
                        <p><strong>Servicio de Ingreso:</strong> {MapAdmissionType(admission.typeAdmission)}</p>
                    </div>
                </div>

                <div className="modal-body">
                    <div className="document-container">
                        {facturas.length > 0 && (
                            <div className="factura-list">
                                <h3>Facturas</h3>
                                <ul>
                                    {facturas.map((factura, index) => (
                                        <li
                                            key={index}
                                            className={selectedFactura?.MPNFac === factura.MPNFac ? "active" : ""}
                                            onClick={() => handleFacturaClick(factura)}
                                        >
                                            {factura.FacDscPrf} {factura.MPNFac}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                        <div className="document-preview">
                            {loading || !pdfUrl ? (
                                <div className="spinner-container">
                                    <div className="spinner"></div>
                                </div>
                            ) : (
                                <iframe
                                    key={iframeKey}
                                    src={pdfUrl}
                                    title="Factura"
                                    style={{ height: '100%', width: '100%', border: 'none' }}
                                />
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DocumentModal;
