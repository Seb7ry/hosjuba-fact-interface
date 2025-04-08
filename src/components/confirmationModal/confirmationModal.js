import React from "react";
//import "../signatureModal/signatureModal.css";
import "./confirmationModal.css";

const ConfirmationModal = ({ isOpen, onConfirm, onCancel, admission }) => {
    if (!isOpen || !admission) return null;

    const {
        fullNamePatient,
        documentPatient,
        companionName,
        phoneConpanion,
        companionDocument,
        typeAdmission,
        dateAdmission
    } = admission;

    console.log(admission)

    const mapAdmissionType = (type) => {
        if (type === 1) return "Urgencias";
        if (type === 9) return "Triage";
        if (type === 99) return "Consulta Externa";
        return "Hospitalización";
    };

    return (
        <div className="modal-overlay">
            <div className="confirmation-modal">
                <h3 className="modal-title">¿Guardar firma?</h3>

                <div className="minimal-columns">
                    <div className="minimal-block">
                        <h4 className="block-title">Datos del paciente</h4>
                        <p><strong>Nombre:</strong> {fullNamePatient}</p>
                        <p><strong>Documento:</strong> {documentPatient}</p>
                        <p><strong>Telefono:</strong> {mapAdmissionType(typeAdmission)}</p>
                        <p><strong>Fecha:</strong> {new Date(dateAdmission).toLocaleDateString()}</p>
                    </div>

                    <div className="minimal-block">
                        <h4 className="block-title">Datos del acompañante</h4>
                        <p><strong>Nombre:</strong> {companionName || "N/A"}</p>
                        <p><strong>Documento:</strong> {companionDocument || "N/A"}</p>
                        <p><strong>Documento:</strong> {companionDocument || "N/A"}</p>
                        <p><strong>Documento:</strong> {companionDocument || "N/A"}</p>
                    </div>
                </div>

                <div className="modal-buttons">
                    <button className="btn confirm-btn" onClick={onConfirm}>
                        Sí, guardar
                    </button>
                    <button className="btn exit-btn" onClick={onCancel}>
                        No, volver
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmationModal;
