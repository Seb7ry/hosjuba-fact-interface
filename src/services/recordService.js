import axios from "axios";

const API_URL = "http://localhost:3000/log"; // Ajusta la URL si es diferente

/**
 * Obtiene los registros de logs desde el backend, permitiendo filtrar por nivel.
 * 
 * @param {string[]} levels - (Opcional) Array con los niveles de log a filtrar (ejemplo: ['info', 'error']).
 * @returns {Promise<Array>} Lista de logs obtenidos del servidor.
 */
export const getLogs = async (levels = []) => {
    try {
        const token = sessionStorage.getItem("access_token"); // ✅ Se obtiene el access_token correcto

        if (!token) {
            console.warn("⚠️ No hay token disponible, asegúrate de estar autenticado.");
            return [];
        }

        // Construcción dinámica de la URL con los niveles seleccionados
        let queryParams = "";
        if (levels.length > 0) {
            queryParams = levels.map(level => `level=${level}`).join("&");
        }

        const response = await axios.get(`${API_URL}?${queryParams}`, {
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