import { useEffect, useRef, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { logout, getAccessToken } from "../../services/authService";
import "./sessionMonitor.css";

const SessionMonitor = () => {
  const [showWarning, setShowWarning] = useState(false);
  const [timeLeft, setTimeLeft] = useState(null);
  const warningShownRef = useRef(false);
  const lastTokenRef = useRef(null);

  const WARNING_TIME = 5 * 60 * 1000; 
  const VIBRATION_TIME = 1 * 60 * 1000; 

  const getTokenId = (token) => {
    try {
      const decoded = jwtDecode(token);
      return decoded.jti || decoded.exp;
    } catch {
      return null;
    }
  };

  const getExpiration = (token) => {
    try {
      const decoded = jwtDecode(token);
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
        lastTokenRef.current = token;
      }

      const expiresAt = getExpiration(token);
      if (!expiresAt) {
        logout();
        return;
      }

      const currentTime = Date.now();
      const timeRemaining = expiresAt - currentTime;

      setTimeLeft(timeRemaining);

      if (timeRemaining <= 0) {
        logout();
        return;
      }

      const tokenId = getTokenId(token);
      const alreadyWarnedKey = `warned_${tokenId}`;

      if (timeRemaining <= WARNING_TIME && !warningShownRef.current && !sessionStorage.getItem(alreadyWarnedKey)) {
        setShowWarning(true);
        warningShownRef.current = true;
        sessionStorage.setItem(alreadyWarnedKey, "true");
      }

      if (timeRemaining > WARNING_TIME && warningShownRef.current) {
        setShowWarning(false);
        warningShownRef.current = false;
      }
    };

    checkSession(); 
    const intervalId = setInterval(checkSession, 1000); 

    return () => clearInterval(intervalId);
    // eslint-disable-next-line
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
          <div className={`session-modal ${timeLeft <= VIBRATION_TIME ? "vibrate" : ""}`}>
            <h3>⏳ Tu sesión está por expirar</h3>
            <p>
              Tu sesión expirará en <strong>{formatTimeLeft(timeLeft)}</strong>. Realiza alguna función para no ser expulsado.
            </p>
            <button onClick={() => setShowWarning(false)}>Entiendo</button>
          </div>
        </div>
      )}
    </>
  );
};

export default SessionMonitor;
