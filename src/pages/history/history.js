import React, { useEffect, useState } from "react";
import Navbar from "../../components/navbar/navbar";
import "./history.css";
import historyImg from "../../assets/ux/history.png"; // Cambia la imagen si es necesario
import { getLogsTec } from "../../services/recordService"; // Cambia la importación a getHistory

const History = () => {
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    // eslint-disable-next-line
    const [error, setError] = useState(null);
    const [selectedLevel, setSelectedLevel] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [isEndDateDisabled, setIsEndDateDisabled] = useState(true);

    useEffect(() => {
        fetchHistory();
    }, []);

    const fetchHistory = async (level = "", startDate = "", endDate = "") => {
        setLoading(true);
        try {
            // Usar getHistory en lugar de getLogsTec
            const data = await getLogsTec(level ? [level] : [], startDate, endDate);
            setHistory(data);
        } catch (err) {
            setError("No se pudieron cargar los registros de historial.");
            console.error("Error al obtener el historial:", err);
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
        fetchHistory(selectedLevel, startDate, endDate);
        console.log('Filtros aplicados: ', selectedLevel, startDate, endDate);
    };

    // Limpiar filtros
    const handleClearFilters = () => {
        setSelectedLevel("");
        setStartDate("");
        setEndDate("");
        fetchHistory(); // Recargar todo el historial sin filtros
    };

    return (
        <div className="history-container">
            <Navbar />
            <div className="history-content">
                {/* Sección de descripción con imagen */}
                <div className="history-description">
                    <div className="history-text">
                        <h1>Historial</h1>
                        <hr className="my-4" />
                        <br />
                        <p>
                            En este apartado puedes visualizar y gestionar el historial de eventos relevantes del sistema.
                            Aquí se almacena información clave que puedes revisar cuando sea necesario.
                        </p>
                        <br />
                        <ul className="field-descriptions">
                            <li><strong>Nivel:</strong> Indica el nivel de afectación del evento en el sistema.</li>
                            <li><strong>Mensaje:</strong> Breve explicación del evento registrado.</li>
                            <li><strong>Contexto:</strong> Documento del código (back) donde se manifestó el evento.</li>
                            <li><strong>Fecha de Registro:</strong> Indica cuándo se almacenó la información.</li>
                        </ul>
                    </div>
                    <div className="history-image">
                        <img src={historyImg} alt="Descripción de historial" />
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

            </div>
        </div>
    );
};

export default History;