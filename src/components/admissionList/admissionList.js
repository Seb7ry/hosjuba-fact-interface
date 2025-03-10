import React from "react";
import "./admissionList.css"; // Archivo de estilos separado

const AdmissionList = ({ admissions }) => {
    return (
        <div className="admission-list-container">
            <h2 className="admission-list-title">Lista de Admisiones</h2>
            <div className="admission-list">
                {admissions.length === 0 ? (
                    <p className="no-data">No hay admisiones registradas.</p>
                ) : (
                    admissions.map((admission, index) => (
                        <div key={index} className="admission-card">
                            <p><strong>Consecutivo:</strong> {admission.consecutiveAdmission}</p>
                            <p><strong>Fecha:</strong> {new Date(admission.dateAdmission).toLocaleDateString()}</p>
                            <p><strong>Tipo de Admisión:</strong> {admission.typeAdmission}</p>
                            <p><strong>Usuario:</strong> {admission.userAdmission}</p>
                            <p><strong>Tipo Documento:</strong> {admission.typeDocumentPatient}</p>
                            <p><strong>Documento:</strong> {admission.documentPatient}</p>
                            <p><strong>Paciente:</strong> {admission.namePatient}</p>

                            <button className="admission-btn">Ingresar a Admisión</button>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default AdmissionList;
