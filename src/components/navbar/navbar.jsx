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
    faTimes,
} from "@fortawesome/free-solid-svg-icons";

import logo from "../../assets/logo-hosjuba.png";
import { logout } from "../../services/authService";

const Navbar = () => {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [isMobileOpen, setIsMobileOpen] = useState(false);
    const [userGroup, setUserGroup] = useState(null);

    useEffect(() => {
        const group = sessionStorage.getItem("grupo");
        setUserGroup(group);
    }, []);

    const toggleMenu = () => setIsCollapsed(!isCollapsed);
    const toggleMobileMenu = () => setIsMobileOpen(!isMobileOpen);
    const handleLogout = async () => await logout();

    const isAdmin =
        userGroup === "ADMINISTRADOR" ||
        userGroup === "COORFACTURACION" ||
        userGroup === "LIDERFACTURACION";

    const renderMenuItem = (to, icon, title, condition = true) => {
        if (!condition) return null;
        return (
            <li>
                <NavLink
                    to={to}
                    className={({ isActive }) =>
                        `group flex items-center rounded-lg px-4 py-3 transition-colors ${isActive
                            ? "bg-emerald-700 text-white"
                            : "text-black hover:bg-emerald-700 hover:text-white"
                        }`
                    }
                    onClick={() => {
                        setIsMobileOpen(false);
                        setIsCollapsed(false);
                    }}
                >
                    <FontAwesomeIcon
                        icon={icon}
                        className={`w-6 transition-all duration-200 ${isCollapsed ? "mx-auto" : "mr-3"
                            } group-hover:text-white group-[.active]:text-white group-hover:scale-110`}
                    />
                    {!isCollapsed && <span className="text-sm">{title}</span>}
                </NavLink>
            </li>
        );
    };


    return (
        <>
            {/* Botón hamburguesa visible solo en móvil */}
            <div className="md:hidden bg-emerald-700 text-white px-4 py-3 flex justify-between items-center fixed top-0 left-0 right-0 z-50">
                <button onClick={toggleMobileMenu} className="text-xl">
                    <FontAwesomeIcon icon={isMobileOpen ? faTimes : faBars} />
                </button>
                <img src={logo} alt="Logo" className="h-8" />
            </div>

            {/* Sidebar mobile con fondo oscuro, scroll y botón abajo */}
            {isMobileOpen && (
                <div className="fixed inset-0 z-40 bg-black/50 flex justify-start md:hidden">
                    <div className="w-[80%] max-w-xs bg-white shadow-lg rounded-r-lg flex flex-col justify-between overflow-y-auto h-full pt-12">
                        <div className="p-5">
                            <ul className="space-y-4">
                                {renderMenuItem("/dashboard", faHome, "Inicio")}
                                {renderMenuItem("/admission", faUsers, "Admisiones")}
                                {renderMenuItem("/document", faFileAlt, "Comprobantes")}
                                {renderMenuItem("/history", faCalendar, "Historial", isAdmin)}
                                {renderMenuItem("/record", faCogs, "Registros", isAdmin)}
                            </ul>
                        </div>
                        <div className="p-4">
                            <button
                                onClick={handleLogout}
                                className="w-full flex items-center justify-center border-2 border-red-500 px-4 py-2 rounded-lg text-red-500 font-bold hover:bg-red-500 hover:text-white"
                            >
                                <FontAwesomeIcon icon={faSignOutAlt} className="mr-2" />
                                <span className="text-sm">Salir</span>
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Sidebar para escritorio */}
            <aside
                className={`hidden md:flex fixed top-0 left-0 h-full bg-white shadow-lg flex-col justify-between z-30 transition-all duration-300 ${isCollapsed ? "w-[80px]" : "w-[250px]"
                    }`}
            >
                <div className="flex items-center justify-between bg-emerald-700 text-white px-4 h-[55px]">
                    <button className="text-lg focus:outline-none w-8" onClick={toggleMenu}>
                        <FontAwesomeIcon icon={faBars} />
                    </button>
                    {!isCollapsed && <img src={logo} alt="Logo" className="w-10 mr-[10%]" />}
                </div>

                <nav className="flex-1 px-3 py-4">
                    <ul className="space-y-1">
                        {renderMenuItem("/dashboard", faHome, "Inicio")}
                        {renderMenuItem("/admission", faUsers, "Admisiones")}
                        {renderMenuItem("/document", faFileAlt, "Comprobantes")}
                        {renderMenuItem("/history", faCalendar, "Historial", isAdmin)}
                        {renderMenuItem("/record", faCogs, "Registros", isAdmin)}
                    </ul>
                </nav>

                <div className="p-4">
                    <button
                        onClick={handleLogout}
                        className="flex w-full items-center justify-center rounded-lg border-2 border-red-500 px-4 py-2 font-bold text-red-500 transition-colors hover:bg-red-500 hover:text-white"
                    >
                        <FontAwesomeIcon icon={faSignOutAlt} className="mr-2 w-5" />
                        {!isCollapsed && <span className="text-sm">Salir</span>}
                    </button>
                </div>
            </aside>
        </>
    );
};

export default Navbar;
