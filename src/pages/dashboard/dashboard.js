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
            <Navbar /> {/* Menú lateral */}
            <div className="dashboard-content">
                {/* Jumbotron mejorado */}  
                <div className="jumbotron">
                    <h1 className="display-4">Bienvenido</h1>
                    <hr className="my-4" />
                    <p> 
                        Gestiona de manera eficiente las admisiones, 
                        firmas digitales y comprobantes médicos en un solo lugar.
                    </p>
                    <p>
                        Accede a las funciones clave a través del menú lateral.
                    </p>
                </div>

            </div>
        </div>
    );
};

export default Dashboard;
