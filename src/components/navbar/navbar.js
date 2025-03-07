import React, { useState } from "react";
import { faShoppingCart,  faBook, faCalendar, 
        faCogs, faTachometerAlt, faUsers, 
        faBox, faBell, faChartPie, faChevronDown
} from "@fortawesome/free-solid-svg-icons";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./navbar.css";

const Navbar = () => {
    const [openSubMenu, setOpenSubMenu] = useState(null);

    const toggleSubMenu = (menu) => {
        setOpenSubMenu(openSubMenu === menu ? null : menu);
    };

return (
    <aside className="sidebar">
        <div className="sidebar-header">
            <div className="pro-sidebar-logo">
                <img src="/src/assets/logo.png" alt="Logo" className="sidebar-logo" />
            </div>
        </div>
        <nav className="menu">
            <ul>
                <li className="menu-header"><span> GENERAL </span></li>

                <li className={`menu-item sub-menu ${openSubMenu === "dashboard" ? "open" : ""}`}>
                    <a href="#" onClick={() => toggleSubMenu("dashboard")}>
                        <FontAwesomeIcon icon={faTachometerAlt} className="menu-icon" />
                        <span className="menu-title">Dashboard</span>
                        <FontAwesomeIcon icon={faChevronDown} className="menu-suffix" />
                    </a>
                    <ul className="sub-menu-list">
                        <li className="menu-item"><a href="#">Overview</a></li>
                        <li className="menu-item"><a href="#">Analytics</a></li>
                    </ul>
                </li>

                <li className={`menu-item sub-menu ${openSubMenu === "orders" ? "open" : ""}`}>
                    <a href="#" onClick={() => toggleSubMenu("orders")}>
                        <FontAwesomeIcon icon={faShoppingCart} className="menu-icon" />
                        <span className="menu-title">Orders</span>
                        <FontAwesomeIcon icon={faChevronDown} className="menu-suffix" />
                    </a>
                    <ul className="sub-menu-list">
                        <li className="menu-item"><a href="#">Pending Orders</a></li>
                        <li className="menu-item"><a href="#">Completed Orders</a></li>
                    </ul>
                </li>

                <li className={`menu-item sub-menu ${openSubMenu === "analytics" ? "open" : ""}`}>
                    <a href="#" onClick={() => toggleSubMenu("analytics")}>
                        <FontAwesomeIcon icon={faChartPie} className="menu-icon" />
                        <span className="menu-title">Analytics</span>
                        <FontAwesomeIcon icon={faChevronDown} className="menu-suffix" />
                    </a>
                    <ul className="sub-menu-list">
                        <li className="menu-item"><a href="#">Reports</a></li>
                        <li className="menu-item"><a href="#">Trends</a></li>
                    </ul>
                </li>

            <li className="menu-item">
                <a href="#">
                    <FontAwesomeIcon icon={faUsers} className="menu-icon" />
                    <span className="menu-title">Customers</span>
                </a>
            </li>

            <li className="menu-item">
                <a href="#">
                    <FontAwesomeIcon icon={faBox} className="menu-icon" />
                    <span className="menu-title">Products</span>
                </a>
            </li>

            <li className="menu-item">
                <a href="#">
                    <FontAwesomeIcon icon={faBell} className="menu-icon" />
                    <span className="menu-title">Notifications</span>
                </a>
            </li>

            <li className="menu-header"><span> EXTRAS </span></li>
            <li className="menu-item">
                <a href="#">
                    <FontAwesomeIcon icon={faBook} className="menu-icon" />
                    <span className="menu-title">Documentation</span>   
                </a>
            </li>

            <li className="menu-item">
                <a href="#">
                    <FontAwesomeIcon icon={faCalendar} className="menu-icon" />
                    <span className="menu-title">Calendar</span>
                </a>
            </li>

            <li className="menu-item">
                <a href="#">
                    <FontAwesomeIcon icon={faCogs} className="menu-icon" />
                    <span className="menu-title">Settings</span>
                </a>
            </li>
        </ul>
        </nav>
    </aside>
    );
};

export default Navbar;
