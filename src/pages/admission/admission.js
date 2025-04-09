import React, { useState, useEffect } from "react";
import "./admission.css";

import { getAllAdmissions, getFilteredAdmissions } from "../../services/admissionService";
import AdmissionList from "../../components/admissionList/admissionList";
import Navbar from "../../components/navbar/navbar";

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
    const [showDateErrorModal, setShowDateErrorModal] = useState(false);


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
        setEndDate(selectedEndDate);
    };   

    const fetchAdmissions = async () => {
        setLoading(true);
        const data = await getAllAdmissions();
        setAdmissions(data);
        setLoading(false);
    };


    const handleSearch = async () => {
        if (startDate && endDate && startDate > endDate) {
            setShowDateErrorModal(true);
            return;
        }
    
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
                admission.typeAdmission !== 99 &&
                admission.typeAdmission !== 9
            );
        }
    
        setAdmissions(data);
        setLoading(false);
    };      

    const [isSearchDisabled, setIsSearchDisabled] = useState(true);
    
    useEffect(() => {
        setIsSearchDisabled(documentNumber.trim() === "");
    }, [documentNumber]);

    return (
        <div className="admission__layout">
            <Navbar />
            <div className="admission__container">
                <div className="admission__content">
                        <section className="admission__description">
                            <div className="admission__text">
                                <h1>Admisiones</h1>
                                <hr />
                                <p>
                                    En este apartado puedes buscar la admisión correspondiente al paciente al cual
                                    le asignarás la firma, la búsqueda puede ser mediante su número de documento y 
                                    añadido a esto filtros para hacer la búsqueda más detallada. Los campos mostrados
                                    en la lista son los siguientes:
                                </p>
                                <ul className="admission__list">
                                    <li><strong>Número de Admisión:</strong> Código único de la admisión del paciente.<code>Ejemplo: 59</code></li>
                                    <li><strong>Documento:</strong> Número de identificación del paciente.<code>Ejemplo: 1001234567</code></li>
                                    <li><strong>Nombre Paciente:</strong> Nombre del paciente.<code>Ejemplo: 59</code></li>
                                    <li><strong>Fecha:</strong> Fecha en la que se realizó la admisión.<code>Ejemplo: 2025-03-10</code></li>
                                    <li><strong>Servicio: Servicio por el cual tuvo la admisión el paciente.</strong> <code>Ejemplo: Triage</code></li>
                                    <li><strong>Usuario:</strong> Nombre del funcionario que realizó la admisión.<code>Ejemplo: JMURILLO</code></li>
                                    <li><strong>Firma:</strong> Indica si ya existe una firma para el paciente o no. En caso de que no, le permite acceder al formulario para asignar la firma; en caso de que si, muestra un check de confirmación.</li>
                                    <li><strong>Actualizar:</strong> Permite actualizar los datos de la admisión como lo pueden ser datos del paciente o del acompañante desde el hosvital. Esta función únicamente será habilitada si es que existe una firma para la admisión del paciente en cuestión.</li>         
                                </ul>
                            </div>
                        </section>
                        
                        <section className="admission__mesaage">
                            <div className="admission__warning-message">
                                ⚠️ Es obligatorio ingresar el <strong>número de documento</strong> antes de aplicar filtros.
                            </div>
                        </section>

                        <section className="admission__filters">
                            <div>
                                <label>Número de Documento</label>
                                <input 
                                    type="text" 
                                    placeholder="Ingrese el número de documento" 
                                    value={documentNumber} 
                                    onChange={(e) => {
                                        const document = e.target.value.replace(/\D/g, "");
                                        setDocumentNumber(document)
                                    }}
                                    required
                                />
                            </div>
                            
                            <div>
                                <label>Número de Admisión</label>
                                <input 
                                    type="text" 
                                    placeholder="Código de admisión" 
                                    value={admissionNumber} 
                                    onChange={(e) => {
                                        const consecutive = e.target.value.replace(/\D/g, "");
                                        setAdmissionNumber(consecutive);
                                    }}
                                    disabled={isSearchDisabled}
                                />
                            </div>

                            <div>
                                <label>Fecha de Inicio</label>
                                <input 
                                    type="date" 
                                    value={startDate} 
                                    onChange={handleStartDateChange}
                                    disabled={isSearchDisabled}
                                />
                            </div>

                            <div>
                                <label>Fecha de Final</label>
                                <input 
                                    type="date" 
                                    value={endDate} 
                                    onChange={handleEndDateChange}
                                    disabled={isSearchDisabled || isEndDateDisabled}
                                />
                            </div>

                            <div>
                                <label>Usuario</label>
                                <input 
                                    type="text" 
                                    placeholder="Nombre del usuario" 
                                    value={user} 
                                    onChange={(e) => setUser(e.target.value.toUpperCase())}
                                    disabled={isSearchDisabled}
                                />
                            </div>

                            <div>
                                <label>Tipo de Admisión</label>
                                <select 
                                    value={admissionType} 
                                    onChange={(e) => {
                                        const selectedValue = e.target.value;
                                        if (selectedValue === "1") {
                                            setAdmissionType(1);
                                        } else if (selectedValue === "9") {
                                            setAdmissionType(9);
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
                                    <option value="9">Triage</option>
                                    <option value="1">Urgencias</option>
                                    <option value="99">Consulta Externa</option>
                                    <option value="hospitalizacion">Hospitalización</option>
                                </select>
                            </div>

                            <div className="admission__buttons">
                                <button className="admission__search-btn" onClick={handleSearch} disabled={isSearchDisabled}>Buscar</button>
                                <button className="admission__clear-btn" onClick={handleClearFilters}>Limpiar</button>
                            </div>
                            <div className="admission__buttons">
                                <button className="admission__update-btn" onClick={fetchAdmissions}>Actualizar Admisiones</button>
                            </div>
                        </section>

                        <section className="admission__message">
                            <div className="admission__info-message">
                            ✍️ Para asignar una firma a una admisión <strong>oprimir el botón "Asignar" al final de la fila </strong> 
                            correspondiente. Si la admisión ya contiene una firma asignada el botón desaparecerá y en su lugar habrá 
                            un icono de check.✍️
                            </div>
                        </section>
                
                        <AdmissionList admissions={admissions} loading={loading} />
                    </div>
                </div>
                {showDateErrorModal && (
                    <div className="modal-overlay">
                        <div className="modal">
                            <p>⚠️ La fecha de inicio no puede ser mayor que la fecha final. Por favor corrígela.</p>
                            <button onClick={() => setShowDateErrorModal(false)}>Cerrar</button>
                        </div>
                    </div>
                )}
        </div>
    );
};

export default Admission;