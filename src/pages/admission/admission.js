import React, { useState, useEffect } from "react";
import Navbar from "../../components/navbar/navbar";
//import "./admission.css";
import admisionImg from "../../assets/ux/admision.png";
import AdmissionList from "../../components/admissionList/admissionList";
import { getAllAdmissions, getFilteredAdmissions } from "../../services/admissionService";

const Admission = () => {
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
        fetchAdmissions();
    };
    
    const handleStartDateChange = (e) => {
        const selectedStartDate = e.target.value;
        setStartDate(selectedStartDate);
    
        if (!selectedStartDate) {
            setEndDate("");
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
        const data = await getAllAdmissions();
        setAdmissions(data);
        setLoading(false);
    };


    const handleSearch = async () => {
        setLoading(true);
    
        const filters = {
            documentPatient: documentNumber || undefined,
            consecutiveAdmission: admissionNumber || undefined,
            startDateAdmission: startDate || undefined,
            endDateAdmission: endDate || undefined,
            userAdmission: user || undefined,
            typeAdmission: admissionType || undefined
        };
    
        let data = await getFilteredAdmissions(filters);
    
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

    const [isSearchDisabled, setIsSearchDisabled] = useState(true);
    
    useEffect(() => {
        setIsSearchDisabled(documentNumber.trim() === "");
    }, [documentNumber]);

    return (
        <div className="admission-container">
            <Navbar />
            <div className="admission-content">
                 {/* Sección de descripción con imagen y detalles de los campos */}
                <div className="admission-description">
                    <div className="admission-text">
                        <h1>Admisiones</h1>
                        <hr className="my-4" />
                        <br />
                        <p>
                            En este apartado puedes buscar la admisión correspondiente al paciente al cual
                            le asignarás la firma, la búsqueda puede ser mediante su número de documento y 
                            añadido a esto filtros para hacer la búsqueda más detallada. Te explico estos 
                            filtros a continuación.
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
                    <img src={admisionImg} alt="Descripción de la sección" />
                </div>
                </div>

                <div className="warning-message">
                    ⚠️ Es obligatorio ingresar el <strong>número de documento</strong> antes de aplicar filtros.
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

                    <div className="search-field ">
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

                <div className="info-message">
                ✍️ Para asignar una firma a una admisión <strong>oprimir el botón "Asignar" al final de la fila </strong> 
                correspondiente. Si la admisión ya contiene una firma asignada el botón desaparecerá y en su lugar habrá 
                un icono de check.✍️
                </div>

                {/* Lista de admisiones con paginación */}
                <AdmissionList admissions={admissions} loading={loading} />
            </div>
        </div>
    );
};

export default Admission;