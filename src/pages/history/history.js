import React, { useEffect, useState } from "react";
import Navbar from "../../components/navbar/navbar";
import "./history.css";
import historyImg from "../../assets/ux/history.png";
import { getLogsByLevels, getLogsHistory } from "../../services/recordService";
import HistoryList from "../../components/historyList/historyList";

const History = () => {
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    // eslint-disable-next-line
    const [error, setError] = useState(null);
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [username, setUsername] = useState("");
    const [isEndDateDisabled, setIsEndDateDisabled] = useState(true);

    // Carga inicial con logs de nivel info
    useEffect(() => {
        fetchInitialHistory();
    }, []);

    const fetchInitialHistory = async () => {
        setLoading(true);
        try { 
            const data = await getLogsByLevels(['info']);
            setHistory(data);
        } catch (err) {
            setError("No se pudieron cargar los registros iniciales de historial.");
            console.error("Error al obtener historial inicial:", err);
        } finally {
            setLoading(false);
        }
    };

    const fetchFilteredHistory = async (startDate = "", endDate = "", username = "") => {
        setLoading(true);
        try {
            const data = await getLogsHistory(startDate, endDate, username);
            setHistory(data);
        } catch (err) {
            setError("No se pudieron cargar los registros filtrados.");
            console.error("Error al obtener historial filtrado:", err);
        } finally {
            setLoading(false);
        }
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

    const handleUsernameChange = (event) => {
        setUsername(event.target.value.toUpperCase());
    };

    const handleSearch = () => {
        // Usar getLogsHistory solo cuando hay filtros aplicados
        if (startDate || endDate || username) {
            fetchFilteredHistory(startDate, endDate, username);
            console.log('Filtros aplicados: ', startDate, endDate, username);
        } else {
            // Si no hay filtros, cargar los logs iniciales de info
            fetchInitialHistory();
        }
    };

    const handleClearFilters = () => {
        setStartDate("");
        setEndDate("");
        setUsername("");
        fetchInitialHistory(); // Volver a cargar logs iniciales de info
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
                            En este apartado puedes visualizar y gestionar el historial de eventos informativos del sistema.
                            Aquí se almacena información clave que puedes revisar cuando sea necesario.
                        </p>
                        <br />
                        <ul className="field-descriptions">
                            <li><strong>Usuario:</strong> Usuario asociado al evento.</li>
                            <li><strong>Mensaje:</strong> Breve explicación del evento registrado.</li>
                            <li><strong>Contexto:</strong> Documento del código donde se manifestó el evento.</li>
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
                        <label><strong>Usuario</strong></label>
                        <input 
                            type="text" 
                            placeholder="Buscar por usuario"
                            value={username}
                            onChange={handleUsernameChange}
                        />
                    </div>

                    <div className="button-group">
                        <button className="search-btn" onClick={handleSearch}>Buscar</button>
                        <button className="clear-btn" onClick={handleClearFilters}>Actualizar</button>
                    </div>
                </div>

                {/* Tabla de historial */}
                <HistoryList history={history} loading={loading} />
            </div>
        </div>
    );
};

export default History;