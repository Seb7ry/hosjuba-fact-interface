import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { logout } from "../../services/authService";
import "./sessionMonitor.css";

const SessionMonitor = () => {
  const [showWarning, setShowWarning] = useState(false);
  const [tokenVersion, setTokenVersion] = useState(0);

  useEffect(() => {
    const checkSession = () => {
      const token = sessionStorage.getItem("access_token");

      if (!token) {
        console.warn("🚨 No hay token, cerrando sesión...");
        logout();
        return;
      }

      try {
        const decoded = jwtDecode(token);
        const expiresAt = decoded.exp * 1000;
        const currentTime = Date.now();
        const timeRemaining = expiresAt - currentTime;

        if (timeRemaining <= 0) {
          logout();
        } else if (timeRemaining <= 5 * 60 * 1000) {
          setShowWarning(true);
        } else {
          setShowWarning(false);
        }
      } catch (error) {
        console.error("⚠️ Error al decodificar el token:", error);
        logout();
      }
    };

    checkSession();
    const intervalId = setInterval(checkSession, 5 * 60 * 1000);

    window.addEventListener("storage", (event) => {
      if (event.key === "access_token") {
        setTokenVersion((prev) => prev + 1);
      }
    });

    return () => clearInterval(intervalId);
  }, [tokenVersion]);

  return (
    <>
      {showWarning && (
        <div className="session-modal-backdrop">
          <div className="session-modal">
            <h3>⏳ Tu sesión está por expirar</h3>
            <p>Tu sesión expirará en menos de 5 minutos.</p>
            <button onClick={() => setShowWarning(false)}>Entiendo</button>
          </div>
        </div>
      )}
    </>
  );
};

export default SessionMonitor;
