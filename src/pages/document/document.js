import React, { useState, useEffect } from "react";
import Navbar from "../../components/navbar/navbar";
import "./document.css";
import documentImg from "../../assets/ux/document.png"; // Usa la misma imagen que en Records
import { getSignedAdmissionsFiltrer, getSignedAdmissionsAll } from "../../services/admissionService";
import DocumentList from "../../components/documentList/documentList";

const Document = () => {
    const [documentNumber, setDocumentNumber] = useState(""); 
    const [admissionNumber, setAdmissionNumber] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    // eslint-disable-next-line
    const [isEndDateDisabled, setIsEndDateDisabled] = useState(true);
    const [user, setUser] = useState("");
    const [admissionType, setAdmissionType] = useState("");
    const [admissions, setAdmissions] = useState([]);
    const [loading, setLoading] = useState(false);

    // Cargar las admisiones con firma cuando se ingresa a la página
    useEffect(() => {
        fetchAdmissions();  // Cargar todas las admisiones con firma al ingresar a la página
    }, []); // Solo se ejecuta una vez al cargar la página

    const handleClearFilters = () => {
        setDocumentNumber("");
        setAdmissionNumber("");
        setStartDate("");
        setEndDate("");
        setUser("");
        setAdmissionType("");
        fetchAdmissions(); // Recargar todas las admisiones automáticamente
    };

    const handleStartDateChange = (e) => {
        const selectedStartDate = e.target.value;
        setStartDate(selectedStartDate);
    
        if (!selectedStartDate) {
            setEndDate(""); // Borra la fecha final si se borra la de inicio
            setIsEndDateDisabled(true);
        } else {
            setIsEndDateDisabled(false);
        }
    };  

    const handleEndDateChange = (e) => {
        const selectedEndDate = e.target.value;
    
        if (selectedEndDate < startDate) {
            alert("⚠️ La fecha de final no puede ser menor a la fecha de inicio.");
            return;
        }
    
        setEndDate(selectedEndDate);
    };    

    const fetchAdmissions = async () => {
        setLoading(true);
        const data = await getSignedAdmissionsAll();
        setAdmissions(data);
        setLoading(false);
    };

    const handleSearch = async () => {
        setLoading(true);

        // Preparar los filtros para enviar al backend
        const filters = {
            documentPatient: documentNumber || undefined,
            consecutiveAdmission: admissionNumber || undefined,
            startDateAdmission: startDate || undefined,
            endDateAdmission: endDate || undefined,
            userAdmission: user || undefined,
            typeAdmission: admissionType || undefined
        };

        // Llamar al backend con los filtros y obtener las admisiones filtradas
        const data = await getSignedAdmissionsFiltrer(filters);
        setAdmissions(data);
        setLoading(false);
    };

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
                            <li><strong>Número de Documento:</strong> Número de identificación del paciente. Ejemplo: <code>1001234567</code></li>
                            <li><strong>Número de Admisión:</strong> Código único de la admisión del paciente. Ejemplo: <code>59</code></li>
                            <li><strong>Fecha de Inicio:</strong> Fecha en la que se realizó la admisión. Ejemplo: <code>2025-03-10</code></li>
                            <li><strong>Fecha de Final:</strong> Fecha de alta o finalización del servicio. Ejemplo: <code>2025-03-15</code></li>
                            <li><strong>Usuario:</strong> Nombre del funcionario que realizó la admisión. Ejemplo: <code>JMURILLO</code></li>
                            <li><strong>Tipo de Admisión:</strong> Clasificación de la admisión según el tipo de servicio. Ejemplo: <code>Consulta Externa</code></li>
                        </ul>
                    </div>
                </div>

                {/* Formulario de búsqueda */}
                <div className="search-container">
                    <div className="search-field">
                        <label>Número de Documento</label>
                        <input 
                            type="text" 
                            placeholder="Ingrese el número de documento" 
                            value={documentNumber} 
                            onChange={(e) => setDocumentNumber(e.target.value)}
                        />
                    </div>
                    
                    <div className="search-field">
                        <label>Número de Admisión</label>
                        <input 
                            type="text" 
                            placeholder="Código de admisión" 
                            value={admissionNumber} 
                            onChange={(e) => setAdmissionNumber(e.target.value)}
                        />
                    </div>

                    <div className="search-field">
                        <label>Fecha de Inicio</label>
                        <input 
                            type="date" 
                            value={startDate} 
                            onChange={handleStartDateChange}
                        />
                    </div>

                    <div className="search-field">
                        <label>Fecha de Final</label>
                        <input 
                            type="date" 
                            value={endDate} 
                            onChange={handleEndDateChange}
                        />
                    </div>

                    <div className="search-field">
                        <label>Usuario</label>
                        <input 
                            type="text" 
                            placeholder="Nombre del usuario" 
                            value={user} 
                            onChange={(e) => setUser(e.target.value)}
                        />
                    </div>

                    <div className="search-field  selectno">
                        <label>Tipo de Admisión</label>
                        <select 
                            value={admissionType} 
                            onChange={(e) => {
                                const selectedValue = e.target.value;
                                if (selectedValue === "1") {
                                    setAdmissionType(1);
                                } else if (selectedValue === "99") {
                                    setAdmissionType(99);
                                } else if (selectedValue === "hospitalizacion") {
                                    setAdmissionType("hospitalizacion");
                                } else {
                                    setAdmissionType("");
                                }
                            }}
                        >
                            <option value="">Seleccione el tipo</option>
                            <option value="1">Urgencias</option>
                            <option value="99">Consulta Externa</option>
                            <option value="hospitalizacion">Hospitalización</option>
                        </select>
                    </div>

                    <div className="search-field">
                        <label>&nbsp;</label>
                        <button className="search-btn" onClick={handleSearch}>
                            Buscar
                        </button>
                    </div>

                    <div className="search-field">
                        <label>&nbsp;</label>
                        <button className="clear-btn" onClick={handleClearFilters}>
                            Limpiar
                        </button>
                    </div>
                </div>
                <div className="info-message">
                📄 Para consultar un comprobante <strong>oprimir el botón al final de la fila </strong> 
                correspondiente a la columna "Comprobante". Dentro del recuadro que salga podrá visualizar 
                e imprimir el documento.📄
                </div>
                {/* Lista de admisiones con paginación */}
                <DocumentList admissions={admissions} loading={loading} />
            </div>
        </div>
    );
};

export default Document;
