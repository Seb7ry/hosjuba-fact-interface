import React from "react";
import Navbar from "../../components/navbar/navbar"; // Importa el Navbar
import "./dashboard.css"; // Importa los estilos

const Dashboard = () => {
    return (
        <div className="dashboard-container">
            <Navbar /> {/* Menú lateral */}
            <div className="dashboard-content">
                <h1>Bienvenido al Dashboard</h1>
                <p>Aquí va el contenido del dashboard.</p>
            </div>
        </div>
    );
};

export default Dashboard;
