import { useEffect, useRef, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { logout, getAccessToken } from "../../services/authService";
import "./sessionMonitor.css";

const SessionMonitor = () => {
  const [showWarning, setShowWarning] = useState(false);
  const [timeLeft, setTimeLeft] = useState(null);
  const warningShownRef = useRef(false);
  const lastTokenRef = useRef(null);

  const getTokenId = (token) => {
    try {
      const decoded = jwtDecode(token);
      return decoded.jti || decoded.exp; // usamos `jti` si existe, o el `exp` como fallback
    } catch {
      return null;
    }
  };

  const getExpiration = (token) => {
    try {
      const decoded = jwtDecode(token);
      console.log("🔐 Token decodificado, expira en:", new Date(decoded.exp * 1000));
      return decoded.exp * 1000;
    } catch (error) {
      console.error("❌ Error al decodificar el token:", error);
      return null;
    }
  };

  useEffect(() => {
    const checkSession = () => {
      const token = getAccessToken();

      if (!token) {
        console.warn("🚫 No hay token, cerrando sesión...");
        logout();
        return;
      }

      if (token !== lastTokenRef.current) {
        console.log("🔄 Token cambiado o refrescado");
        lastTokenRef.current = token;
      }

      const expiresAt = getExpiration(token);
      if (!expiresAt) {
        logout();
        return;
      }

      const currentTime = Date.now();
      const timeRemaining = expiresAt - currentTime;

      console.log("⏱️ Tiempo restante:", formatTimeLeft(timeRemaining));

      setTimeLeft(timeRemaining);

      if (timeRemaining <= 0) {
        console.log("⏳ Token expirado. Cerrando sesión...");
        logout();
        return;
      }

      const tokenId = getTokenId(token);
      const alreadyWarnedKey = `warned_${tokenId}`;

      if (timeRemaining <= 40000 && !warningShownRef.current && !sessionStorage.getItem(alreadyWarnedKey)) {
        console.log("⚠️ Mostrando advertencia de expiración");
        setShowWarning(true);
        warningShownRef.current = true;
        sessionStorage.setItem(alreadyWarnedKey, "true"); // ✅ Asociamos el warning al token específico
      }

      if (timeRemaining > 40000 && warningShownRef.current) {
        console.log("✅ Advertencia ocultada, suficiente tiempo restante");
        setShowWarning(false);
        warningShownRef.current = false;
      }
    };

    checkSession(); // Ejecutar inmediatamente
    const intervalId = setInterval(checkSession, 1000); // Revisar cada segundo

    return () => clearInterval(intervalId);
  }, []);

  const formatTimeLeft = (ms) => {
    const totalSeconds = Math.max(Math.floor(ms / 1000), 0);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}m ${seconds}s`;
  };

  return (
    <>
      {showWarning && timeLeft !== null && (
        <div className="session-modal-backdrop">
          <div className={`session-modal ${timeLeft <= 10000 ? "vibrate" : ""}`}>
            <h3>⏳ Tu sesión está por expirar</h3>
            <p>
              Tu sesión expirará en <strong>{formatTimeLeft(timeLeft)}</strong>. Realiza acciones para no ser expulsado.
            </p>
            <button onClick={() => setShowWarning(false)}>Entiendo</button>
          </div>
        </div>
      )}
    </>
  );
};

export default SessionMonitor;
