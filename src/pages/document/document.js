import React, { useState, useEffect } from "react";
import Navbar from "../../components/navbar/navbar";
import "./document.css";
import documentImg from "../../assets/ux/document.png"; // Usa la misma imagen que en Records
import { getFilteredAdmissions, getSignedAdmissionsAll } from "../../services/admissionService";

const Document = () => {
    const [documentNumber, setDocumentNumber] = useState(""); 
    const [admissionNumber, setAdmissionNumber] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [isEndDateDisabled, setIsEndDateDisabled] = useState(true);
    const [user, setUser] = useState("");
    const [admissionType, setAdmissionType] = useState("");
    const [admissions, setAdmissions] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchAdmissions();
    }, []);

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
    
        let typeAdmissionValue = admissionType;
        
        if (admissionType === "hospitalizacion") {
            // NO enviamos el filtro al backend, traemos todas las admisiones y filtramos en el frontend
            typeAdmissionValue = undefined;
        }
    
        const filters = {
            documentPatient: documentNumber || undefined,
            consecutiveAdmission: admissionNumber || undefined,
            startDateAdmission: startDate || undefined,
            endDateAdmission: endDate || undefined,
            userAdmission: user || undefined,
            typeAdmission: typeAdmissionValue
        };
    
        let data = await getFilteredAdmissions(filters);
    
        // Si es Hospitalización, filtramos en el frontend
        if (admissionType === "hospitalizacion") {
            data = data.filter(admission => 
                admission.typeAdmission !== 1 &&
                admission.typeAdmission !== 99
            );
        }
    
        setAdmissions(data);
        setLoading(false);
    };    

    useEffect(() => {
        if (!documentNumber && !admissionNumber && !startDate && !endDate && !user && !admissionType) {
            fetchAdmissions();
        }
    }, [documentNumber, admissionNumber, startDate, endDate, user, admissionType]);

    // Deshabilitar filtros si no hay número de documento
    const [isSearchDisabled, setIsSearchDisabled] = useState(true);
    
    useEffect(() => {
        setIsSearchDisabled(documentNumber.trim() === "");
    }, [documentNumber]);

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

                {/* Formulario de búsqueda */}
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
                            onChange={handleStartDateChange}
                            disabled={isSearchDisabled}
                        />
                    </div>

                    <div className="search-field">
                        <label>Fecha de Final</label>
                        <input 
                            type="date" 
                            value={endDate} 
                            onChange={handleEndDateChange}
                            disabled={isSearchDisabled || isEndDateDisabled}
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
                            disabled={isSearchDisabled}
                        >
                            <option value="">Seleccione el tipo</option>
                            <option value="1">Urgencias</option>
                            <option value="99">Consulta Externa</option>
                            <option value="hospitalizacion">Hospitalización</option>
                        </select>
                    </div>

                    <div className="search-field">
                        <label>&nbsp;</label>
                        <button className="search-btn" onClick={handleSearch} disabled={isSearchDisabled}>
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
            </div>
        </div>
    );
};

export default Document;
