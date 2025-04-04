import React, { useEffect, useState } from "react";
import Navbar from "../../components/navbar/navbar";
import RecordList from "../../components/recordList/recordList";
import "./record.css";
import recordsImg from "../../assets/ux/register.png";
import { getLogsByLevels, getLogsTec } from "../../services/recordService";

const Record = () => {
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    // eslint-disable-next-line
    const [error, setError] = useState(null);
    const [selectedLevel, setSelectedLevel] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [isEndDateDisabled, setIsEndDateDisabled] = useState(true);

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
                                Aquí se almacena información clave que puedes revisar cuando sea necesario.
                            </p>
                            <ul>
                                <li><strong>Nivel:</strong> Nivel de afectación del registro en el sistema.</li>
                                <li><strong>Mensaje:</strong> Explicación del evento registrado.</li>
                                <li><strong>Contexto:</strong> Documento del código donde ocurrió el registro.</li>
                                <li><strong>Fecha de Registro:</strong> Fecha de almacenamiento.</li>
                            </ul>
                        </div>
                        <div className="record__image">
                            <img src={recordsImg} alt="Descripción de registros" />
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
                            <button className="btn-clear" onClick={handleClearFilters}>Actualizar</button>
                        </div>
                    </section>

                    <section className="record__list-container">
                        <RecordList logs={logs} loading={loading} />
                    </section>
                </div>
            </div>
        </div>
    );
};

export default Record;