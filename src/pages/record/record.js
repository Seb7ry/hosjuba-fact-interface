import React, { useEffect, useState } from "react";
import Navbar from "../../components/navbar/navbar";
import RecordList from "../../components/recordList/recordList";
import "./record.css";
import recordsImg from "../../assets/ux/register.png";
import { getLogsTec } from "../../services/recordService"; // Cambia la importación a getLogsTec

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
        fetchLogs();
    }, []);

    const fetchLogs = async (level = "", startDate = "", endDate = "") => {
        setLoading(true);
        try {
            // Usar getLogsTec en lugar de getRecord
            const data = await getLogsTec(level ? [level] : [], startDate, endDate);
            setLogs(data);
        } catch (err) {
            setError("No se pudieron cargar los registros.");
            console.error("Error al obtener los registros:", err);
        } finally {
            setLoading(false);
        }
    };

    // Manejar cambio en el select
    const handleLevelChange = (event) => {
        setSelectedLevel(event.target.value);
    };

    const handleStartDateChange = (event) => {
        const selectedStartDate = event.target.value;
        setStartDate(selectedStartDate);

        if (!selectedStartDate) {
            setEndDate("");
            setIsEndDateDisabled(true);
        } else {
            setIsEndDateDisabled(false);
        }
    };

    const handleEndDateChange = (event) => {
        const selectedEndDate = event.target.value;

        if (selectedEndDate < startDate) {
            alert("⚠️ La fecha de final no puede ser menor a la fecha de inicio.");
            return;
        }
        setEndDate(selectedEndDate);
    };

    const handleSearch = () => {
        fetchLogs(selectedLevel, startDate, endDate);
        console.log('Filtros aplicados: ', selectedLevel, startDate, endDate);
    };

    // Limpiar filtros
    const handleClearFilters = () => {
        setSelectedLevel("");
        setStartDate("");
        setEndDate("");
        fetchLogs(); // Recargar todos los logs sin filtros
    };

    return (
        <div className="records-container">
            <Navbar />
            <div className="records-content">
                {/* Sección de descripción con imagen */}
                <div className="records-description">
                    <div className="records-text">
                        <h1>Registros</h1>
                        <hr className="my-4" />
                        <br />
                        <p>
                            En este apartado puedes visualizar y gestionar los registros relevantes del sistema.
                            Aquí se almacena información clave que puedes revisar cuando sea necesario.
                        </p>
                        <br />
                        <ul className="field-descriptions">
                            <li><strong>Nivel:</strong> Indica el nivel de afectación del registro en el sistema.</li>
                            <li><strong>Mensaje:</strong> Breve explicación del evento registrado.</li>
                            <li><strong>Contexto:</strong> Documento del código (back) donde se manifestó el registro.</li>
                            <li><strong>Fecha de Registro:</strong> Indica cuándo se almacenó la información.</li>
                        </ul>
                    </div>
                    <div className="records-image">
                        <img src={recordsImg} alt="Descripción de registros" />
                    </div>
                </div>

                {/* Filtros de búsqueda */}
                <div className="search-container">
                    <div className="search-field">
                        <label><strong>Fecha de Inicio</strong></label>
                        <input
                            type="date"
                            value={startDate}
                            onChange={handleStartDateChange}
                        />
                    </div>

                    <div className="search-field">
                        <label><strong>Fecha de Fin</strong></label>
                        <input
                            type="date"
                            value={endDate}
                            onChange={handleEndDateChange}
                            disabled={isEndDateDisabled}
                        />
                    </div>

                    <div className="search-field">
                        <label><strong>Filtrar por Nivel</strong></label>
                        <select value={selectedLevel} onChange={handleLevelChange}>
                            <option value="">Todos</option>
                            <option value="warn">Warn</option>
                            <option value="error">Error</option>
                        </select>
                    </div>

                    <div className="button-group">
                        <button className="search-btn" onClick={handleSearch}>Buscar</button>
                        <button className="clear-btn" onClick={handleClearFilters}>Actualizar</button>
                    </div>
                </div>

                {/* Tabla de registros */}
                <RecordList logs={logs} loading={loading} />
            </div>
        </div>
    );
};

export default Record;