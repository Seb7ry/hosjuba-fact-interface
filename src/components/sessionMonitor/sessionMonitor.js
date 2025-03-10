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
            const expiresAt = decoded.exp * 1000; 
            const currentTime = Date.now();
            const timeRemaining = expiresAt - currentTime;

            console.log("⏳ Tiempo actual:", new Date(currentTime).toLocaleString());
            console.log("🔔 Expiración del access token:", new Date(expiresAt).toLocaleString());
            console.log("🕐 Tiempo restante antes de expirar:", (timeRemaining / 1000).toFixed(0), "segundos");

            setTimeLeft(timeRemaining);

            if (timeRemaining <= 5 * 60 * 1000) {
                setShowWarning(true);
            }

            const timeoutLogout = setTimeout(() => {
                console.warn("⛔ El access token ha expirado, cerrando sesión.");
                logout();
            }, timeRemaining);

            const timeoutWarning = setTimeout(() => {
                console.warn("⚠️ Quedan menos de 5 minutos para que la sesión expire. Realiza alguna petición para evitar el cierre de sesión.");
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
    }, []);

    return (
        <>
            {showWarning && (
                <div className="session-warning">
                    ⚠️ Tu sesión expirará en menos de 5 minutos. 
                    <button className="close-button" onClick={() => setShowWarning(false)}>✖</button>
                </div>
            )}
        </>
    );
};

export default SessionMonitor;
