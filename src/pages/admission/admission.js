import React, { useState } from "react";
import Navbar from "../../components/navbar/navbar"; // Menú lateral
import "./admission.css"; // Importa los estilos
import admisionImg from "../../assets/ux/admision.png";

const Admission = () => {
    const [activeTab, setActiveTab] = useState("Todas");
    const [documentNumber, setDocumentNumber] = useState(""); // Controla el número de documento
    const [admissionNumber, setAdmissionNumber] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [user, setUser] = useState("");
    const [admissionType, setAdmissionType] = useState("");

    // Habilitar o deshabilitar los otros campos según si el número de documento está lleno
    const isSearchDisabled = documentNumber.trim() === "";

    return (
        <div className="admission-container">
            <Navbar /> {/* Menú lateral */}
            <div className="admission-content">
                {/* Sección de descripción con imagen y detalles de los campos */}
                <div className="admission-description">
                    <div className="admission-text">
                        <h1>Admisiones</h1>
                        <hr className="my-4" />
                        <br />
                        <p>
                            En este apartado puedes buscar la admisión correspondiente al paciente al cual
                            le asignarás la firma, la busqueda puede ser mediante su número de documento y 
                            añadido a esto filtros para hacer la búsqueda más detallada. Te explico estos 
                            filtros a continuació.
                        </p>
                        <br />
                        <ul className="field-descriptions">
                            <li><strong>Número de Documento:</strong> Número de identificación del paciente. Ejemplo: <code>1001234567</code></li>
                            <li><strong>Número de Admisión:</strong> Código único de la admisión del paciente. Ejemplo: <code>59</code></li>
                            <li><strong>Fecha de Inicio:</strong> Fecha en la que se realizó la admisión. Ejemplo: <code>2025-03-10</code></li>
                            <li><strong>Fecha de Final:</strong> Fecha de alta o finalización del servicio. Ejemplo: <code>2025-03-15</code></li>
                            <li><strong>Usuario:</strong> Nombre del funcionario que realizó la admisión. Ejemplo: <code>JMURILLO</code></li>
                            <li><strong>Tipo de Admisión:</strong> Clasificación de la admisión según el tipo de servicio. Ejemplo: <code>Consulta Externa</code></li>
                        </ul>
                    </div>
                    <div className="admission-image">
                        {/* Imagen adjunta */}
                        <img src={admisionImg} alt="Descripción de la sección" />
                    </div>
                </div>

                {/* Nota de advertencia */}
                <div className="warning-message">
                    ⚠️ Es obligatorio ingresar el <strong>número de documento</strong> del paciente antes de aplicar cualquier otro filtro de búsqueda.
                </div>

                {/* Formulario de Búsqueda con títulos encima de cada input */}
                <div className="search-container">
                    <div className="search-field">
                        <label>Número de Documento</label>
                        <input 
                            type="text" 
                            placeholder="Ingrese el número de documento" 
                            value={documentNumber} 
                            onChange={(e) => setDocumentNumber(e.target.value)}
                            required
                        />
                    </div>
                    
                    <div className="search-field">
                        <label>Número de Admisión</label>
                        <input 
                            type="text" 
                            placeholder="Código de admisión" 
                            value={admissionNumber} 
                            onChange={(e) => setAdmissionNumber(e.target.value)}
                            disabled={isSearchDisabled}
                        />
                    </div>

                    <div className="search-field">
                        <label>Fecha de Inicio</label>
                        <input 
                            type="date" 
                            value={startDate} 
                            onChange={(e) => setStartDate(e.target.value)}
                            disabled={isSearchDisabled}
                        />
                    </div>

                    <div className="search-field">
                        <label>Fecha de Final</label>
                        <input 
                            type="date" 
                            value={endDate} 
                            onChange={(e) => setEndDate(e.target.value)}
                            disabled={isSearchDisabled}
                        />
                    </div>

                    <div className="search-field">
                        <label>Usuario</label>
                        <input 
                            type="text" 
                            placeholder="Nombre del usuario" 
                            value={user} 
                            onChange={(e) => setUser(e.target.value)}
                            disabled={isSearchDisabled}
                        />
                    </div>

                    <div className="search-field">
                        <label>Tipo de Admisión</label>
                        <select 
                            value={admissionType} 
                            onChange={(e) => setAdmissionType(e.target.value)}
                            disabled={isSearchDisabled}
                        >
                            <option value="">Seleccione el tipo</option>
                            <option value="Urgencias">Urgencias</option>
                            <option value="Consulta Externa">Consulta Externa</option>
                            <option value="Hospitalización">Hospitalización</option>
                        </select>
                    </div>

                    <div className="search-field">
                        <label>&nbsp;</label>
                        <button className="search-btn" disabled={isSearchDisabled}>Buscar</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Admission;
