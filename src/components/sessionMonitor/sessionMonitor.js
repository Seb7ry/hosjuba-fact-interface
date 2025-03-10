import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { logout } from "../../services/authService"; 
import "./sessionMonitor.css"; 

const SessionMonitor = () => {
    const [showWarning, setShowWarning] = useState(false);
    const [timeLeft, setTimeLeft] = useState(null);

    useEffect(() => {
        console.log("✅ SessionMonitor montado");

        const token = sessionStorage.getItem("access_token");

        if (!token) {
            console.warn("🚨 No hay access token, no se ejecutará SessionMonitor.");
            return;
        }

        try {
            const decoded = jwtDecode(token);
            const expiresAt = decoded.exp * 1000; // Convertir exp a milisegundos
            const currentTime = Date.now(); // Obtener el tiempo actual en milisegundos
            const timeRemaining = expiresAt - currentTime; // Calcular cuánto tiempo queda

            console.log("⏳ Tiempo actual:", new Date(currentTime).toLocaleString());
            console.log("🔔 Expiración del access token:", new Date(expiresAt).toLocaleString());
            console.log("🕐 Tiempo restante antes de expirar:", (timeRemaining / 1000).toFixed(0), "segundos");

            setTimeLeft(timeRemaining);

            // Si faltan menos de 5 minutos, mostrar la advertencia
            if (timeRemaining <= 5 * 60 * 1000) {
                setShowWarning(true);
            }

            // Programar cierre de sesión cuando el token expire
            const timeoutLogout = setTimeout(() => {
                console.warn("⛔ El access token ha expirado, cerrando sesión.");
                logout();
            }, timeRemaining);

            // Mostrar advertencia 5 minutos antes de la expiración
            const timeoutWarning = setTimeout(() => {
                console.warn("⚠️ Quedan menos de 5 minutos para que la sesión expire.");
                setShowWarning(true);
            }, timeRemaining - 5 * 60 * 1000);

            return () => {
                clearTimeout(timeoutLogout);
                clearTimeout(timeoutWarning);
            };
        } catch (error) {
            console.error("❌ Error al decodificar el accessToken:", error);
            logout();
        }
    }, []); // 👈 Se ejecuta solo una vez al montarse

    return (
        <>
            {showWarning && (
                <div className="session-warning">
                    ⚠️ Tu sesión expirará en menos de 5 minutos. Realiza alguna acción para mantenerla activa.
                </div>
            )}
        </>
    );
};

export default SessionMonitor;
