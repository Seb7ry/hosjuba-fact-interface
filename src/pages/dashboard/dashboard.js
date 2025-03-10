import React, { useEffect } from "react";
import Navbar from "../../components/navbar/navbar"; 
import "./dashboard.css"; 

const Dashboard = () => {
    useEffect(() => {
        console.log("✅ Dashboard montado");
        console.log("Access Token:", sessionStorage.getItem("access_token"));
        console.log("Refresh Token:", sessionStorage.getItem("refresh_token"));
        console.log("Username:", sessionStorage.getItem("username"));

        if (!sessionStorage.getItem("access_token")) {
            console.warn("⚠️ No hay access token, redirigiendo al login...");
            window.location.href = "/"; // Redirige al login si no hay sesión
        }
    }, []);

    return (
        <div className="dashboard-container">
            <Navbar /> 
            <div className="dashboard-content">
                <h1>Bienvenido al Dashboard</h1>
                <p>Aquí va el contenido del dashboard.</p>
            </div>
        </div>
    );
};

export default Dashboard;
