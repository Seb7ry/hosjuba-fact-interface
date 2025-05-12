import React from "react";

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
        switch (type) {
            case 'H': return "Hijo(a)";
            case 'F': return "Familiar";
            case 'C': return "Cónyuge";
            case 'A': return "Amigo(a)";
            case 'O': return "Otro";
            default: return type;
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 px-4">
            <div className="w-full max-w-md bg-white rounded-xl p-6 shadow-xl text-center">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">¿Guardar firma?</h3>
                <p className="text-sm text-gray-600 mb-4">Verifique los datos actuales en el sistema.</p>
                <hr className="mb-4"/>

                <div className="flex flex-col md:flex-row gap-4 justify-center mb-6">
                    <div className="flex-1 min-w-[200px] bg-gray-50 p-4 rounded-lg text-left text-sm shadow-sm">
                        <h4 className="text-base font-semibold text-black border-b border-gray-300 pb-1 text-center mb-2">Datos del paciente</h4>
                        <p><strong>Nombre:</strong> {fullNamePatient}</p>
                        <p><strong>Documento:</strong> {documentPatient}</p>
                        <p><strong>Teléfono:</strong> {phonePatient}</p>
                    </div>

                    <div className="flex-1 min-w-[200px] bg-gray-50 p-4 rounded-lg text-left text-sm shadow-sm">
                        <h4 className="text-base font-semibold text-black border-b border-gray-300 pb-1 text-center mb-2">Datos del acompañante</h4>
                        <p><strong>Nombre:</strong> {nameCompanion}</p>
                        <p><strong>Documento:</strong> {documentCompanion}</p>
                        <p><strong>Teléfono:</strong> {phoneCompanion}</p>
                        <p><strong>Relación:</strong> {mapCompanionType(relationCompanion)}</p>
                    </div>
                </div>

                <div className="flex justify-center gap-4">
                    <button
                        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 text-sm rounded-md transition"
                        onClick={onConfirm}
                    >
                        Sí, guardar
                    </button>
                    <button
                        className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 text-sm rounded-md transition"
                        onClick={onCancel}
                    >
                        No, volver
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmationModal;
