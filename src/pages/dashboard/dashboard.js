import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFilePdf } from "@fortawesome/free-solid-svg-icons";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";
import "./dashboard.css";

import { getStats } from "../../services/statService";
import Navbar from "../../components/navbar/navbar";

const Dashboard = () => {
    const [stats, setStats] = useState(null);
    const [hoveredDoc, setHoveredDoc] = useState(null);

    useEffect(() => {
        if (!sessionStorage.getItem("access_token")) {
            console.warn("⚠️ No hay access token, redirigiendo al login...");
            window.location.href = "/";
            return;
        }

        /**
         * Obtiene las estadísticas generales desde el backend utilizando el servicio `getStats`.
         * Actualiza el estado global `stats` con los datos obtenidos.
         * Maneja errores de red o del servidor con un log en consola.
         */
        const fetchStats = async () => {
            try {
                const data = await getStats();
                setStats(data);
            } catch(error) {
                console.error("Error de estadísticas:", error);
            }
        };

        fetchStats();
    }, []);

    const documents = [
        {
            id: 1,
            title: "Manual de usuario (Instrucciones de Uso)",
            url: process.env.REACT_APP_MANUAL_USUARIO
        },
        {
            id: 2,
            title: "Manual de Usuario Técnico (Back-end)",
            url: process.env.REACT_APP_MANUAL_TECNICO
        },
        {
            id: 3,
            title: "Manual de usuario técnico (Front-end)",
            url: process.env.REACT_APP_MANUAL_TECNICO
        }
    ];

    const COLORS = ["#1f77b4", "#d62728", "#2ca02c", "#9467bd"];

    const chartData = stats
        ? [
              { name: "Urgencias", value: stats.urgencias },
              { name: "Triage", value: stats.triage },
              { name: "Consulta externa", value: stats.consultaExterna },
              { name: "Hospitalización", value: stats.hospitalizacion },
          ]
        : [];

    const total =
        stats?.urgencias +
        stats?.triage +
        stats?.consultaExterna +
        stats?.hospitalizacion || 0;

    return (
        <div className="dashboard-layout">
            <Navbar />
            <div className="dashboard-container">
                <div className="jumbotron">
                    <h1>Bienvenido</h1>
                    <hr />
                    <p>
                        Gestiona de manera eficiente las admisiones,
                        firmas digitales y comprobantes médicos en un solo lugar.
                    </p>
                </div>

                <div className="dashboard-cards">
                    <div className="dashboard-card">
                        <h2>Manuales de Uso</h2>
                        <p>Aquí encontrarás el manual de usuario para el uso del sistema. Tanto para administradores como para usuarios regulares.</p>
                        <ul className="document-list">
                            {documents.map((doc) => (
                                <li 
                                    key={doc.id}
                                    className={`document-item ${hoveredDoc === doc.id ? 'document-item-hovered' : ''}`}
                                    onMouseEnter={() => setHoveredDoc(doc.id)}
                                    onMouseLeave={() => setHoveredDoc(null)}
                                >
                                    <a 
                                        href={doc.url} 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        className="document-link"
                                    >
                                        <FontAwesomeIcon icon={faFilePdf} className="pdf-icon" />
                                        {doc.title}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="dashboard-card">
                        <h2>Resumen General</h2>
                        <p>Aquí podrás ver estadísticas de registros y firmas asignadas.</p>
                        {stats && (
                            <>
                                <div style={{ width: "100%", height: 300 }}>
                                    <ResponsiveContainer>
                                        <PieChart>
                                            <Pie
                                                data={chartData}
                                                dataKey="value"
                                                nameKey="name"
                                                cx="50%"
                                                cy="50%"
                                                outerRadius={80}
                                                label
                                            >
                                                {chartData.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                                ))}
                                            </Pie>
                                            <Tooltip />
                                            <Legend verticalAlign="bottom" />
                                        </PieChart>
                                    </ResponsiveContainer>
                                </div>
                                <div style={{ textAlign: "center", marginTop: "10px", fontWeight: "bold", color: "#333" }}>
                                    Total de admisiones firmadas: {total}
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;