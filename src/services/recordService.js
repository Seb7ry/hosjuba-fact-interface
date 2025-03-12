import axios from "axios";

const API_URL = "http://localhost:3000/log"; // Ajusta la URL si es diferente

/**
 * Obtiene los registros de logs desde el backend con el token correcto.
 * @returns {Promise<Array>} Lista de logs obtenidos del servidor.
 */
export const getLogs = async () => {
    try {
        const token = sessionStorage.getItem("access_token"); // ✅ Se obtiene el access_token correcto

        if (!token) {
            console.warn("⚠️ No hay token disponible, asegúrate de estar autenticado.");
            return [];
        }

        const response = await axios.get(API_URL, {
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
