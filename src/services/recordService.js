import axios from "axios";

const API_URL = `${process.env.REACT_APP_ROUTEROUTE_BACKSERVICE}/log`;

/**
 * Obtiene los registros de logs filtrados por múltiples niveles
 * @param {string[]} levels - Array de niveles a filtrar (ej: ['info', 'warn'])
 * @returns {Promise<Array>} Lista de logs obtenidos del servidor
 */
export const getLogsByLevels = async (levels = []) => {
    try {
        const token = sessionStorage.getItem("access_token");

        if (!token) {
            console.warn("⚠️ No hay token disponible, asegúrate de estar autenticado.");
            return [];
        }

        const validLevels = ['info', 'warn', 'error'];
        if (!levels.length || levels.some(l => !validLevels.includes(l))) {
            console.warn("⚠️ Niveles no válidos. Usar: info, warn o error");
            return [];
        }

        const queryParams = new URLSearchParams();
        levels.forEach(level => queryParams.append("level", level));

        const response = await axios.get(`${API_URL}/all?${queryParams.toString()}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        return response.data;
    } catch (error) {
        console.error("❌ Error al obtener los logs por niveles:", error);
        return [];
    }
};


/**
 * Obtiene los registros de logs desde el backend, permitiendo filtrar por nivel y fechas.
 * 
 * @param {string[]} levels - (Opcional) Array con los niveles de log a filtrar (ejemplo: ['warn', 'error']).
 * @param {string} startDate - (Opcional) Fecha de inicio para filtrar los logs (formato: YYYY-MM-DD).
 * @param {string} endDate - (Opcional) Fecha de fin para filtrar los logs (formato: YYYY-MM-DD).
 * @returns {Promise<Array>} Lista de logs obtenidos del servidor.
 */
export const getLogsTec = async (levels = [], startDate = null, endDate = null) => {
    try {
        const token = sessionStorage.getItem("access_token");

        if (!token) {
            console.warn("⚠️ No hay token disponible, asegúrate de estar autenticado.");
            return [];
        }
        
        const queryParams = new URLSearchParams();

        if (levels.length > 0) {
            levels.forEach(level => queryParams.append("level", level));
        }

        if (startDate) {
            queryParams.append("startDate", startDate);
        }

        if (endDate) {
            queryParams.append("endDate", endDate);
        }

        const response = await axios.get(`${API_URL}/filtrerTec?${queryParams.toString()}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        return response.data;
    } catch (error) {
        console.error("❌ Error al obtener los registros:", error);
        return [];
    }
};

/**
 * Obtiene historial de actividades desde el backend, permitiendo filtrar por nivel y usuario.
 * 
 * @param {string} username - (Opcional) Array con los niveles de log a filtrar (ejemplo: ['warn', 'error']).
 * @param {string} startDate - (Opcional) Fecha de inicio para filtrar los logs (formato: YYYY-MM-DD).
 * @param {string} endDate - (Opcional) Fecha de fin para filtrar los logs (formato: YYYY-MM-DD).
 * @returns {Promise<Array>} Lista de logs obtenidos del servidor.
 */
export const getLogsHistory = async (startDate = null, endDate = null, username = null) => {
    try {
        const token = sessionStorage.getItem("access_token");

        if (!token) {
            console.warn("⚠️ No hay token disponible, asegúrate de estar autenticado.");
            return [];
        }

        const queryParams = new URLSearchParams();

        if (startDate) {
            queryParams.append("startDate", startDate);
        }

        if (endDate) {
            queryParams.append("endDate", endDate);
        }

        if (username) {
            queryParams.append("user", username);
        }

        const response = await axios.get(`${API_URL}/filtrerHis?${queryParams.toString()}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        return response.data;
    } catch (error) {
        console.error("❌ Error al obtener el historial:", error);
        return [];
    }
};