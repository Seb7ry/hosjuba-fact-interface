import React from "react";
import Navbar from "../../components/navbar/navbar";
import "./document.css";
import documentImg from "../../assets/ux/document.png"; // Usa la misma imagen que en Records

const Document = () => {
    return (
        <div className="document-container">
            <Navbar />
            <div className="document-content">
                {/* Sección de descripción con imagen */}
                <div className="document-description">
                    <div className="document-image">
                        <img src={documentImg} alt="Descripción de documentos" />
                    </div>
                    <div className="document-text">
                        <h1>Comprobantes</h1>
                        <hr className="my-4" />
                        <br />
                        <p>
                            En este apartado puedes visualizar y gestionar los comprobantes del sistema.
                            Aquí se almacena información clave que puedes revisar cuando sea necesario.
                        </p>
                        <br />
                        <ul className="field-descriptions">
                            <li><strong>Tipo:</strong> Indica el tipo de documento generado en el sistema.</li>
                            <li><strong>Contenido:</strong> Breve descripción del contenido del documento.</li>
                            <li><strong>Firmado:</strong> Estado del documento respecto a la firma digital.</li>
                            <li><strong>Fecha de Generación:</strong> Indica cuándo se creó el documento.</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Document;
