import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHome, faFileAlt, faCalendar, faCogs, faUsers, faSignOutAlt, faBars } from "@fortawesome/free-solid-svg-icons";

import logo from "../../assets/logo-hosjuba.png";
import { logout } from "../../services/authService"; // Importa la función logout
import "./navbar.css";

const Navbar = () => {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [userGroup, setUserGroup] = useState(null);

    useEffect(() => {
        const group = sessionStorage.getItem("grupo");
        setUserGroup(group);
    }, []);

    // Alternar el estado del menú (colapsado o expandido)
    const toggleMenu = () => {
        setIsCollapsed(!isCollapsed);
    };

    // Función para manejar el logout
    const handleLogout = async () => {
        await logout();
    };

    return (
        <div className={`layout-container ${isCollapsed ? "collapsed" : ""}`}>
            <aside className={`sidebar ${isCollapsed ? "collapsed" : ""}`}>
                <div className="sidebar-header">
                    <button className="menu-toggle" onClick={toggleMenu}>
                        <FontAwesomeIcon icon={faBars} />
                    </button>
                    {/* El logo solo aparece si el menú está expandido */}
                    {!isCollapsed && <img src={logo} alt="Logo" className="sidebar-logo" />}
                </div>

                <nav className="menu">
                    <ul>
                        <li className="menu-item">
                            <Link to="/dashboard" onClick={() => setIsCollapsed(false)}>
                                <FontAwesomeIcon icon={faHome} className="menu-icon" />
                                {!isCollapsed && <span className="menu-title">Inicio</span>}
                            </Link>
                        </li>

                        <li className="menu-item">
                            <Link to="/admission" onClick={() => setIsCollapsed(false)}>
                                <FontAwesomeIcon icon={faUsers} className="menu-icon" />
                                {!isCollapsed && <span className="menu-title">Admisiones</span>}
                            </Link>
                        </li>

                        <li className="menu-item">
                            <Link to="/document" onClick={() => setIsCollapsed(false)}>
                                <FontAwesomeIcon icon={faFileAlt} className="menu-icon" />
                                {!isCollapsed && <span className="menu-title">Comprobantes</span>}
                            </Link>
                        </li>

                        {userGroup === "ADMINISTRADOR" && (
                            <li className="menu-item">
                                <Link to="/history" onClick={() => setIsCollapsed(false)}>
                                    <FontAwesomeIcon icon={faCalendar} className="menu-icon" />
                                    {!isCollapsed && <span className="menu-title">Historial</span>}
                                </Link>
                            </li>
                        )}

                        {userGroup === "ADMINISTRADOR" && (
                            <li className="menu-item">
                                <Link to="/record" onClick={() => setIsCollapsed(false)}>
                                    <FontAwesomeIcon icon={faCogs} className="menu-icon" />
                                    {!isCollapsed && <span className="menu-title">Registros</span>}
                                </Link>
                            </li>
                        )}
                    </ul>
                </nav>

                <div className="sidebar-divider"></div>

                <div className="logout-container">
                    <button onClick={handleLogout} className="logout-button">
                        <FontAwesomeIcon icon={faSignOutAlt} className="menu-icon" />
                        {!isCollapsed && <span className="menu-title">Salir</span>}
                    </button>
                </div>
            </aside>

            {/* Contenido principal que se ajusta al menú sin solaparse */}
            <main className="content">
                {/* Aquí va el contenido de la página */}
            </main>
        </div>
    );
};

export default Navbar;