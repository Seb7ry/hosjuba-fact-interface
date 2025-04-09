import React, { useEffect, useState } from "react";
import "./record.css";

import { getLogsByLevels, getLogsTec } from "../../services/recordService";
import RecordList from "../../components/recordList/recordList";
import Navbar from "../../components/navbar/navbar";


const Record = () => {
    const [isEndDateDisabled, setIsEndDateDisabled] = useState(true);
    const [selectedLevel, setSelectedLevel] = useState("");
    const [startDate, setStartDate] = useState("");
    const [loading, setLoading] = useState(true);
    const [endDate, setEndDate] = useState("");
    // eslint-disable-next-line
    const [error, setError] = useState(null);
    const [logs, setLogs] = useState([]);

    useEffect(() => {
        fetchInitialLogs();
    }, []);

    const fetchInitialLogs = async () => {
        setLoading(true);
        try {
            const data = await getLogsByLevels(['warn', 'error']);
            setLogs(data);
        } catch (err) {
            setError("No se pudieron cargar los registros iniciales.");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const fetchFilteredLogs = async (level = "", start = "", end = "") => {
        setLoading(true);
        try {
            const levels = level ? [level] : ['warn', 'error'];
            const data = await getLogsTec(levels, start, end);
            setLogs(data);
        } catch (err) {
            setError("No se pudieron cargar los registros filtrados.");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleLevelChange = (e) => setSelectedLevel(e.target.value);

    const handleStartDateChange = (e) => {
        const date = e.target.value;
        setStartDate(date);
        if (!date) {
            setEndDate("");
            setIsEndDateDisabled(true);
        } else {
            setIsEndDateDisabled(false);
        }
    };

    const handleEndDateChange = (e) => {
        const date = e.target.value;
        if (!date) {
            setEndDate("");
            return;
        }
        
        if (date < startDate) {
            alert("⚠️ La fecha de final no puede ser menor a la fecha de inicio.");
            return;
        }
        setEndDate(date);
    };

    const handleSearch = () => {
        if (selectedLevel || startDate || endDate) {
            fetchFilteredLogs(selectedLevel, startDate, endDate);
        } else {
            fetchInitialLogs();
        }
    };

    const handleClearFilters = () => {
        setSelectedLevel("");
        setStartDate("");
        setEndDate("");
        fetchInitialLogs();
    };

    return (
        <div className="record__layout">
            <Navbar />
            <div className="record__container">
                <div className="record__content">
                    <section className="record__description">
                        <div className="record__text">
                            <h1>Registros</h1>
                            <hr />
                            <p>
                                En este apartado puedes visualizar y gestionar los registros relevantes del sistema. 
                                Aquí se almacena información clave relacionada con errores o advertencias del software,
                                lo que te permitirá identificar con precisión dónde y cuándo ocurrió un incidente, 
                                incluyendo la fecha y hora exactas. Los campos mostrados en la lista son los siguientes:
                            </p>
                            <ul className="record__list">
                                <li><strong>Nivel:</strong> Indica el grado de afectación del evento en el sistema.<code>Ejemplo: Advertencia</code></li>
                                <li><strong>Mensaje:</strong> Describe brevemente el evento registrado.<code>Ejemplo: Usuario no encontrado</code></li>
                                <li><strong>Contexto:</strong> Documento o módulo del backend donde se originó el registro.<code>Ejemplo: AdmissionService</code></li>
                                <li><strong>Fecha de Registro:</strong> Momento en que se almacenó el evento.<code>Ejemplo:: 7/4/2025, 8:42:07</code></li>
                            </ul>
                        </div>
                    </section>

                    <section className="record__filters">
                        <div>
                            <label>Fecha de Inicio</label>
                            <input type="date" value={startDate} onChange={handleStartDateChange} />
                        </div>
                        <div>
                            <label>Fecha de Fin</label>
                            <input type="date" value={endDate} onChange={handleEndDateChange} disabled={isEndDateDisabled} />
                        </div>
                        <div>
                            <label>Filtrar por Nivel</label>
                            <select value={selectedLevel} onChange={handleLevelChange}>
                                <option value="">Todos (warn/error)</option>
                                <option value="warn">Warn</option>
                                <option value="error">Error</option>
                            </select>
                        </div>
                        <div className="record__buttons">
                            <button className="btn-search" onClick={handleSearch}>Buscar</button>
                            <button className="btn-clear" onClick={handleClearFilters}>Limpiar</button>
                        </div>

                        <div className="record__buttons">
                            <button className="btn-updates" onClick={fetchInitialLogs}>Actualizar Registros</button>
                        </div>
                    </section>

                    <RecordList logs={logs} loading={loading} />
                
                </div>
            </div>
        </div>
    );
};

export default Record;