import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFilePdf } from "@fortawesome/free-solid-svg-icons";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";

import { getStats } from "../../services/statService";
import Navbar from "../../components/navbar/navbar";

const Dashboard = () => {
    const [stats, setStats] = useState(null);
    const [hoveredDoc, setHoveredDoc] = useState(null);
    const [userGroup, setUserGroup] = useState(null);

    useEffect(() => {
        const group = sessionStorage.getItem("grupo");
        setUserGroup(group);
        if (!sessionStorage.getItem("access_token")) {
            console.warn("⚠️ No hay access token, redirigiendo al login...");
            window.location.href = "/";
            return;
        }

        const fetchStats = async () => {
            try {
                const data = await getStats();
                setStats(data);
            } catch (error) {
                console.error("Error de estadísticas:", error);
            }
        };

        fetchStats();
    }, []);

    const isAdmin =
        userGroup === "ADMINISTRADOR" ||
        userGroup === "COORFACTURACION" ||
        userGroup === "LIDERFACTURACION";

    const documents = [
        {
            id: 1,
            title: "Manual de Instalación",
            url: process.env.REACT_APP_MANUAL_INSTALACION
        },
        {
            id: 2,
            title: "Manual de Usuario (Intrucciones de Uso)",
            url: process.env.REACT_APP_MANUAL_USUARIO_REGULAR
        },
        {
            id: 3,
            title: "Manual de Usuario Administradores (Intrucciones de Uso)",
            url: process.env.REACT_APP_MANUAL_USUARIO_ADMIN
        },
        {
            id: 4,
            title: "Manual de usuario técnico (Front-end)",
            url: process.env.REACT_APP_MANUAL_TECNICO_FRONT
        },
        {
            id: 5,
            title: "Manual de usuario técnico (Back-end + Base de Datos)",
            url: process.env.REACT_APP_MANUAL_TECNICO_BACK
        }
    ];

    const visibleDocuments = documents.filter((doc) => {
        if ([3, 4, 5].includes(doc.id) && !isAdmin) return false;
        return true;
    });

    const COLORS = ["#1f77b4", "#d62728", "#2ca02c", "#9467bd"];

    const chartData = stats
        ? [
            { name: "Urgencias", value: stats.urgencias },
            { name: "Triage", value: stats.triage },
            { name: "Consulta externa", value: stats.consultaExterna },
            { name: "Hospitalización", value: stats.hospitalizacion }
        ]
        : [];

    const total =
        stats?.urgencias +
        stats?.triage +
        stats?.consultaExterna +
        stats?.hospitalizacion || 0;

    return (
        <div className="flex bg-gray-100 min-h-screen">
            <Navbar />

            {/* ✅ Sidebar margen en escritorio + padding top para móvil */}
            <div className="flex-1 px-5 py-6 overflow-y-visible pt-14 md:pt-6 md:ml-[250px] transition-all duration-300">
                <div className="bg-gray-100 rounded-lg shadow-md text-center p-6 mb-5">
                    <h1 className="text-5xl font-bold text-black mb-2">Bienvenido</h1>
                    <hr className="my-4 border-gray-300" />
                    <p className="text-base text-black">
                        Gestiona de manera eficiente las admisiones,
                        firmas digitales y comprobantes médicos en un solo lugar.
                    </p>
                </div>

                <div className="flex flex-wrap gap-5 mt-6">
                    {/* Manuales */}
                    <div className="flex-1 min-w-[300px] bg-white rounded-xl shadow-lg p-5 transition-transform hover:-translate-y-1">
                        <h2 className="text-xl font-semibold text-black mb-2">Manuales de Uso</h2>
                        <p className="text-black mb-4">
                            Aquí encontrarás el manual de usuario para el uso del sistema. Tanto para administradores como para usuarios regulares.
                        </p>
                        <ul className="mt-2 space-y-2">
                            {visibleDocuments.map((doc) => (
                                <li
                                    key={doc.id}
                                    className={`rounded-md p-2 transition-all duration-200 ${hoveredDoc === doc.id
                                            ? "bg-gray-200 shadow-sm"
                                            : "hover:bg-gray-100 hover:translate-x-1"
                                        }`}
                                    onMouseEnter={() => setHoveredDoc(doc.id)}
                                    onMouseLeave={() => setHoveredDoc(null)}
                                >
                                    <a
                                        href={doc.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center text-sm text-gray-700 hover:text-blue-600"
                                    >
                                        <FontAwesomeIcon
                                            icon={faFilePdf}
                                            className="text-red-600 text-xl mr-2 transition-transform duration-200 group-hover:scale-110"
                                        />
                                        {doc.title}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Estadísticas */}
                    <div className="flex-1 min-w-[300px] bg-white rounded-xl shadow-lg p-5 transition-transform hover:-translate-y-1">
                        <h2 className="text-xl font-semibold text-black mb-2">Resumen General</h2>
                        <p className="text-black mb-4">Aquí podrás ver estadísticas de registros y firmas asignadas.</p>
                        {stats && (
                            <>
                                <div className="w-full h-[300px]">
                                    <ResponsiveContainer>
                                        <PieChart>
                                            <Pie
                                                data={chartData}
                                                dataKey="value"
                                                nameKey="name"
                                                cx="50%"
                                                cy="50%"
                                                outerRadius={80}
                                                label
                                            >
                                                {chartData.map((entry, index) => (
                                                    <Cell
                                                        key={`cell-${index}`}
                                                        fill={COLORS[index % COLORS.length]}
                                                    />
                                                ))}
                                            </Pie>
                                            <Tooltip />
                                            <Legend verticalAlign="bottom" />
                                        </PieChart>
                                    </ResponsiveContainer>
                                </div>
                                <div className="text-center mt-3 font-bold text-gray-700">
                                    Total de admisiones firmadas: {total}
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
