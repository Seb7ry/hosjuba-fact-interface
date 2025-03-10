import React, { useState } from "react";
import Navbar from "../../components/navbar/navbar"; // Menú lateral
import "./admission.css"; // Importa los estilos

const Admission = () => {
    const [activeTab, setActiveTab] = useState("Todas");

    return (
        <div className="admission-container">
            <Navbar /> {/* Menú lateral */}
            <div className="admission-content">
                {/* Jumbotron mejorado */}  
                <div className="jumbotron">
                    <h1 className="display-4">Bienvenido a Admission</h1>
                    <p className="lead">
                        Esta es una sección especial donde puedes gestionar las admisiones. Aquí puedes ver información importante y acceder a las funciones clave.
                    </p>
                    <hr className="my-4" />
                    <p>Usa las opciones del menú para navegar entre las secciones de admisiones.</p>
                </div>

                {/* Menú superior corregido */}
                <nav className="navbar navbar-expand-lg navbar-mainbg">
                    <div className="container">
                        <div className="collapse navbar-collapse" id="navbarNav">
                            <ul className="navbar-nav">
                                {["Todas", "Consulta Externa", "Urgencias", "Hospitalización"].map((tab) => (
                                    <li 
                                        key={tab} 
                                        className={`nav-item ${activeTab === tab ? "active-tab" : ""}`} 
                                        onClick={() => setActiveTab(tab)}
                                    >
                                        <a className="nav-link">{tab}</a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </nav>
            </div>
        </div>
    );
};

export default Admission;
