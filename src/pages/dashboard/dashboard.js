import React, { useEffect } from "react";
import Navbar from "../../components/navbar/navbar"; 
import "./dashboard.css"; 

const Dashboard = () => {

    useEffect(() => {
        if (!sessionStorage.getItem("access_token")) {
            console.warn("⚠️ No hay access token, redirigiendo al login...");
            window.location.href = "/";
        }
    }, []);

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
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
