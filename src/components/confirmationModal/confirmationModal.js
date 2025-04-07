import React from "react";
import "../signatureModal/signatureModal.css";

const ConfirmationModal = ({ isOpen, onConfirm, onCancel }) => {
    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-container">
                <h2 className="modal-title">Confirmar Firma</h2>
                <p style={{ textAlign: "center", marginBottom: "20px" }}>
                    ¿Está seguro de que desea guardar esta firma?
                </p>
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
