import axios from "axios";

const API_URL = "http://localhost:3000/log"; // Ajusta la URL si es diferente

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
        const token = sessionStorage.getItem("access_token"); // ✅ Se obtiene el access_token correcto

        if (!token) {
            console.warn("⚠️ No hay token disponible, asegúrate de estar autenticado.");
            return [];
        }

        // Construcción dinámica de la URL con los niveles y fechas seleccionados
        const queryParams = new URLSearchParams();

        // Agregar niveles a los parámetros de la URL
        if (levels.length > 0) {
            levels.forEach(level => queryParams.append("level", level));
        }

        // Agregar fecha de inicio si está definida
        if (startDate) {
            queryParams.append("startDate", startDate);
        }

        // Agregar fecha de fin si está definida
        if (endDate) {
            queryParams.append("endDate", endDate);
        }

        // Realizar la solicitud al backend
        const response = await axios.get(`${API_URL}/filtrerTec?${queryParams.toString()}`, {
            headers: {
                Authorization: `Bearer ${token}`, // ✅ Se envía el token correcto
            },
        });

        return response.data;
    } catch (error) {
        console.error("❌ Error al obtener los registros:", error);
        return [];
    }
};