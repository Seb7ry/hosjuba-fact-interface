import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faHome,
    faFileAlt,
    faCalendar,
    faCogs,
    faUsers,
    faSignOutAlt,
    faBars,
} from "@fortawesome/free-solid-svg-icons";

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

    const toggleMenu = () => setIsCollapsed(!isCollapsed);

    const handleLogout = async () => {
        await logout();
    };

    const renderMenuItem = (to, icon, title, condition = true) => {
        if (!condition) return null;
        return (
            <li className="menu-item">
                <NavLink
                    to={to}
                    className={({ isActive }) => (isActive ? "active" : "")}
                    onClick={() => setIsCollapsed(false)}
                >
                    <FontAwesomeIcon icon={icon} className="menu-icon" />
                    {!isCollapsed && <span className="menu-title">{title}</span>}
                </NavLink>
            </li>
        );
    };

    const isAdmin =
        userGroup === "ADMINISTRADOR" ||
        userGroup === "COORFACTURACION" ||
        userGroup === "LIDERFACTURACION";

    return (
        <div className={`layout-container ${isCollapsed ? "collapsed" : ""}`}>
            <aside className={`sidebar ${isCollapsed ? "collapsed" : ""}`}>
                <div className="sidebar-header">
                    <button className="menu-toggle" onClick={toggleMenu}>
                        <FontAwesomeIcon icon={faBars} />
                    </button>
                    {!isCollapsed && (
                        <img src={logo} alt="Logo" className="sidebar-logo" />
                    )}
                </div>

                <nav className="menu">
                    <ul>
                        {renderMenuItem("/dashboard", faHome, "Inicio")}
                        {renderMenuItem("/admission", faUsers, "Admisiones")}
                        {renderMenuItem("/document", faFileAlt, "Comprobantes")}
                        {renderMenuItem("/history", faCalendar, "Historial", isAdmin)}
                        {renderMenuItem("/record", faCogs, "Registros", isAdmin)}
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

            </main>
        </div>
    );
};

export default Navbar;
