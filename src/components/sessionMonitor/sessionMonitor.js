import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { logout } from "../../services/authService";
import "./sessionMonitor.css";

const SessionMonitor = () => {
  const [showWarning, setShowWarning] = useState(false);
  const [tokenVersion, setTokenVersion] = useState(0); // para forzar actualización

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

        console.log(
          `🕒 Tiempo restante antes de expirar el token: ${Math.floor(
            timeRemaining / 1000
          )} segundos`
        );

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

    checkSession(); // primera ejecución inmediata
    const intervalId = setInterval(checkSession, 10000); // cada 10 segundos

    // Escuchar cambios en el sessionStorage (token actualizado desde otra pestaña)
    const handleStorageChange = (event) => {
      if (event.key === "access_token") {
        console.log("🔄 Token actualizado en sessionStorage.");
        setTokenVersion((prev) => prev + 1); // fuerza que el hook se reejecute
      }
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      clearInterval(intervalId);
      window.removeEventListener("storage", handleStorageChange);
    };
  }, [tokenVersion]); // si cambia el token, se vuelve a ejecutar el efecto

  return (
    <>
      {showWarning && (
        <div className="session-warning">
          ⚠️ Tu sesión expirará en menos de 5 minutos.
          <button className="close-button" onClick={() => setShowWarning(false)}>
            ✖
          </button>
        </div>
      )}
    </>
  );
};

export default SessionMonitor;