import React, { useEffect, useState } from "react";
import Navbar from "../../components/navbar/navbar";
import RecordList from "../../components/recordList/recordList";
import "./record.css";
import recordsImg from "../../assets/ux/register.png";
import { getRecord } from "../../services/recordService"; 

const Record = () => {
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    // eslint-disable-next-line no-unused-vars
    const [error, setError] = useState(null);
    const [selectedLevel, setSelectedLevel] = useState(""); // Estado para el select

    useEffect(() => {
        fetchLogs();
    }, []);

    // Función para obtener logs con filtro de niveles
    const fetchLogs = async (level = "") => {
        setLoading(true);
        try {
            const data = await getRecord(level ? [level] : []);
            setLogs(data);
        } catch (err) {
            setError("No se pudieron cargar los registros.");
        } finally {
            setLoading(false);
        }
    };

    // Manejar cambio en el select
    const handleLevelChange = (event) => {
        setSelectedLevel(event.target.value);
    };

    // Ejecutar búsqueda
    const handleSearch = () => {
        fetchLogs(selectedLevel);
    };

    // Limpiar filtros
    const handleClearFilters = () => {
        setSelectedLevel("");
        fetchLogs();
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
                    <label><strong>Filtrar por Nivel:</strong></label>
                    <select value={selectedLevel} onChange={handleLevelChange}>
                        <option value="">Todos</option>
                        <option value="warn">Warn</option>
                        <option value="error">Error</option>
                    </select>

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
