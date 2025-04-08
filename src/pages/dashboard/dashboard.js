import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../../components/navbar/navbar";
import {
    PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer
} from "recharts";
import "./dashboard.css";

const Dashboard = () => {
    const [stats, setStats] = useState(null);

    useEffect(() => {
        if (!sessionStorage.getItem("access_token")) {
            console.warn("⚠️ No hay access token, redirigiendo al login...");
            window.location.href = "/";
        }

        const fetchStats = async () => {
            try {
                const token = sessionStorage.getItem("access_token");
                const res = await axios.get("http://192.168.168.108:3000/stat", {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setStats(res.data);
            } catch (error) {
                console.error("Error obteniendo estadísticas:", error);
            }
        };

        fetchStats();
    }, []);

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
                        <h2>Documentos Recientes</h2>
                        <p>Estos son los últimos documentos generados por el sistema.</p>
                        <ul className="document-list">
                            <li><span className="pdf-icon">📄</span> Comprobante de atención - 2025/04/01</li>
                            <li><span className="pdf-icon">📄</span> Consentimiento informado - 2025/03/29</li>
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
