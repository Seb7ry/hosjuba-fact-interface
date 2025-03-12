import React, { useEffect, useState } from "react";
import Navbar from "../../components/navbar/navbar";
import RecordList from "../../components/recordList/recordList";
import "./record.css";
import recordsImg from "../../assets/ux/register.png";
import { getLogs } from "../../services/recordService"; // Importamos el servicio de logs

const Record = () => {
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchLogs = async () => {
            try {
                const data = await getLogs();
                setLogs(data);
            } catch (err) {
                setError("No se pudieron cargar los registros.");
            } finally {
                setLoading(false);
            }
        };
        fetchLogs();
    }, []);

    return (
        <div className="records-container">
            <Navbar />
            <div className="records-content">
                {/* Sección de descripción con imagen */}
                <div className="records-description">
                    <div className="records-image">
                        <img src={recordsImg} alt="Descripción de registros" />
                    </div>
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
                            <li><strong>Fecha de Registro:</strong> Indica cuándo se almacenó la información.</li>
                            <li><strong>Usuario:</strong> Persona que realizó la acción registrada.</li>
                            <li><strong>Descripción:</strong> Breve explicación del evento registrado.</li>
                        </ul>
                    </div>
                </div>

                {/* Tabla de registros */}
                <RecordList logs={logs} loading={loading} />
            </div>
        </div>
    );
};

export default Record;