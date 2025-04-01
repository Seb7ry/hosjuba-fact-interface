import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom"; // Cambié Link por NavLink
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHome, faFileAlt, faCalendar, faCogs, faUsers, faSignOutAlt, faBars } from "@fortawesome/free-solid-svg-icons";

import logo from "../../assets/logo-hosjuba.png";
import { logout } from "../../services/authService";
import "./navbar.css";

const Navbar = () => {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [userGroup, setUserGroup] = useState(null);

    useEffect(() => {
        const group = sessionStorage.getItem("grupo");
        setUserGroup(group);
    }, []);

    const toggleMenu = () => {
        setIsCollapsed(!isCollapsed);
    };

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
                            <NavLink
                                to="/dashboard"
                                className={({ isActive }) => (isActive ? 'active' : '')}
                                onClick={() => setIsCollapsed(false)}
                            >
                                <FontAwesomeIcon icon={faHome} className="menu-icon" />
                                {!isCollapsed && <span className="menu-title">Inicio</span>}
                            </NavLink>
                        </li>

                        <li className="menu-item">
                            <NavLink
                                to="/admission"
                                className={({ isActive }) => (isActive ? 'active' : '')}
                                onClick={() => setIsCollapsed(false)}
                            >
                                <FontAwesomeIcon icon={faUsers} className="menu-icon" />
                                {!isCollapsed && <span className="menu-title">Admisiones</span>}
                            </NavLink>
                        </li>

                        <li className="menu-item">
                            <NavLink
                                to="/document"
                                className={({ isActive }) => (isActive ? 'active' : '')}
                                onClick={() => setIsCollapsed(false)}
                            >
                                <FontAwesomeIcon icon={faFileAlt} className="menu-icon" />
                                {!isCollapsed && <span className="menu-title">Comprobantes</span>}
                            </NavLink>
                        </li>

                        {(userGroup === "ADMINISTRADOR" || userGroup === "COORFACTURACION" || userGroup === "LIDERFACTURACION") && (
                            <li className="menu-item">
                                <NavLink
                                    to="/history"
                                    className={({ isActive }) => (isActive ? 'active' : '')}
                                    onClick={() => setIsCollapsed(false)}
                                >
                                    <FontAwesomeIcon icon={faCalendar} className="menu-icon" />
                                    {!isCollapsed && <span className="menu-title">Historial</span>}
                                </NavLink>
                            </li>
                        )}

                        {(userGroup === "ADMINISTRADOR" || userGroup === "COORFACTURACION" || userGroup === "LIDERFACTURACION") && (
                            <li className="menu-item">
                                <NavLink
                                    to="/record"
                                    className={({ isActive }) => (isActive ? 'active' : '')}
                                    onClick={() => setIsCollapsed(false)}
                                >
                                    <FontAwesomeIcon icon={faCogs} className="menu-icon" />
                                    {!isCollapsed && <span className="menu-title">Registros</span>}
                                </NavLink>
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

            <main className="content">
                {/* Aquí va el contenido de la página */}
            </main>
        </div>
    );
};

export default Navbar;