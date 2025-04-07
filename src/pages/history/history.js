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

    useEffect(() => {
        fetchInitialHistory();
    }, []);

    const fetchInitialHistory = async () => {
        setLoading(true);
        try { 
            const data = await getLogsByLevels(["info"]);
            setHistory(data);
        } catch (err) {
            setError("No se pudieron cargar los registros iniciales de historial.");
            console.error("Error al obtener historial inicial:", err);
        } finally {
            setLoading(false);
        }
    };

    const fetchFilteredHistory = async () => {
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
        const value = event.target.value;
        setStartDate(value);
        setIsEndDateDisabled(!value);
        if (!value) setEndDate("");
    };

    const handleEndDateChange = (e) => {
        const selectedEndDate = e.target.value;
        
        if (!selectedEndDate) {
            setEndDate("");
            return;
        }
        
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
        if (startDate || endDate || username) {
            fetchFilteredHistory();
        } else {
            fetchInitialHistory();
        }
    };

    const handleClearFilters = () => {
        setStartDate("");
        setEndDate("");
        setUsername("");
        fetchInitialHistory();
    };

    return (
        <div className="history-page">
            <Navbar />
            <div className="history-container">
                <div className="history-content">
                    <section className="history-header">
                        <div className="history-info">
                            <h1>Historial</h1>
                            <hr />
                            <p>
                            Este apartado te permite consultar las acciones realizadas por los usuarios, 
                            como la generación o consulta de documentos, facilitando el seguimiento de la 
                            actividad dentro de la plataforma. Los campos mostrados en la lista son los 
                            siguientes:
                            </p>
                            <ul className="history__list">
                                <li><strong>Usuario:</strong> Identificador del usuario asociado al evento.<code>Ejemplo: JMURILLO</code></li>
                                <li><strong>Mensaje:</strong> Breve explicación del evento registrado.<code>Ejemplo: Documento generado exitosamente</code></li>
                                <li><strong>Contexto:</strong> Pagina o componente de la aplicación web donde ocurrió el evento.<code>Ejemplo: DocumentService</code></li>
                                <li><strong>Fecha de Registro:</strong> Momento en que se almacenó el evento.<code>Ejemplo: 7/4/2025, 10:15:42</code></li>
                            </ul>
                        </div>
                        <div className="history-image">
                            <img src={historyImg} alt="Historial" />
                        </div>
                    </section>

                    <section className="history-filters">
                        <div>
                            <label>Fecha de Inicio</label>
                            <input type="date" value={startDate} onChange={handleStartDateChange} />
                        </div>
                        <div>
                            <label>Fecha de Fin</label>
                            <input type="date" value={endDate} onChange={handleEndDateChange} disabled={isEndDateDisabled} />
                        </div>
                        <div>
                            <label>Usuario</label>
                            <input type="text" placeholder="Buscar por usuario" value={username} onChange={handleUsernameChange} />
                        </div>
                        <div className="history-buttons">
                            <button className="btnHis-search" onClick={handleSearch}>Buscar</button>
                            <button className="btnHis-clear" onClick={handleClearFilters}>Limpiar</button>
                        </div>
                        <div className="history-buttons">
                            <button className="btnHis-update" onClick={fetchInitialHistory}>Actualizar Historial</button>
                        </div>
                    </section>
                    <HistoryList history={history} loading={loading} />
                </div>
            </div>
        </div>
    );
};

export default History;
