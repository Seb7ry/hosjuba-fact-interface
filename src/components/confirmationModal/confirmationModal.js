import React from "react";
import "./confirmationModal.css";

const ConfirmationModal = ({ isOpen, onConfirm, onCancel, admission }) => {
    if (!isOpen || !admission) return null;

    const {
        fullNamePatient,
        documentPatient,
        phonePatient,
        nameCompanion,
        documentCompanion,
        phoneCompanion,
        relationCompanion
    } = admission;

    const mapCompanionType = (type) => {
        if (type === 'H') return "Hijo(a)";
        if (type === 'F') return "Familiar";
        if (type === 'C') return "Conyuge";
        if (type === 'A') return "Amigo(a)";
        if (type === 'O') return "Otro";
    };

    return (
        <div className="modal-overlay">
            <div className="confirmation-modal">
                <h3 className="modal-title">¿Guardar firma?</h3>
                <p>Verifique los datos actuales en el sistema.</p>
                <hr/>
                <div className="minimal-columns">
                    <div className="minimal-block">
                        <h4 className="block-title">Datos del paciente</h4>
                        <p><strong>Nombre:</strong> {fullNamePatient}</p>
                        <p><strong>Documento:</strong> {documentPatient}</p>
                        <p><strong>Telefono:</strong> {phonePatient}</p>
                    </div>

                    <div className="minimal-block">
                        <h4 className="block-title">Datos del acompañante</h4>
                        <p><strong>Nombre:</strong> {nameCompanion}</p>
                        <p><strong>Documento:</strong> {documentCompanion}</p>
                        <p><strong>Teléfono:</strong> {phoneCompanion}</p>
                        <p><strong>Relación:</strong> {mapCompanionType(relationCompanion)}</p>
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
