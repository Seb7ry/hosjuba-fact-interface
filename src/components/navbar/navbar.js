import React, { useState } from "react";
import { Link } from "react-router-dom";
import { faHome, faFileAlt, faCalendar, 
    faCogs, faUsers, faBell, faSignOutAlt
} from "@fortawesome/free-solid-svg-icons";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import logo from "../../assets/logo-hosjuba.png";
import { logout } from "../../services/authService"; // Importa la función logout
import "./navbar.css";

const Navbar = () => {

    // Función que se ejecuta al hacer clic en "Salir"
    const handleLogout = async () => {
        await logout(); // Llamamos a la función de logout del servicio
    };

    return (
        <aside className="sidebar">
            <div className="sidebar-header">
                <div className="pro-sidebar-logo">
                    <img src={logo} alt="Logo" className="sidebar-logo" />
                </div>
            </div>
            <div className="sidebar-divider"></div>
            <nav className="menu">
                <ul>
                    <li className="menu-item">
                        <a href="/dashboard">
                            <FontAwesomeIcon icon={faHome} className="menu-icon" />
                            <span className="menu-title">Inicio</span>
                        </a>
                    </li>

                    <li className="menu-item">
                        <a href="/admission">
                            <FontAwesomeIcon icon={faUsers} className="menu-icon" />
                            <span className="menu-title">Admisiones</span>
                        </a>
                    </li>
                    
                    <li className="menu-item">
                        <a href="/document">
                            <FontAwesomeIcon icon={faFileAlt} className="menu-icon" />
                            <span className="menu-title">Comprobantes</span>   
                        </a>
                    </li>
                    <div className="administrator">
                        <div className="sidebar-divider"></div>

                        <li className="menu-item">
                            <a href="#">
                                <FontAwesomeIcon icon={faCalendar} className="menu-icon" />
                                <span className="menu-title">Historial</span>
                            </a>
                        </li>

                        <li className="menu-item">
                            <a href="#">
                                <FontAwesomeIcon icon={faCogs} className="menu-icon" />
                                <span className="menu-title">Registros</span>
                            </a>
                        </li>
                    </div>
                </ul>
            </nav>

            {/* Línea separadora antes del botón de logout */}
            <div className="sidebar-divider"></div>

            {/* Opción de Logout */}
            <div className="logout-container">
                <button onClick={handleLogout} className="logout-button">
                    <FontAwesomeIcon icon={faSignOutAlt} className="menu-icon" />
                    <span className="menu-title">Salir</span>
                </button>
            </div>
        </aside>
    );
};

export default Navbar;