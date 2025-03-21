import axios from "axios";

const API_URL = "http://localhost:3000/log"; // Ajusta la URL si es diferente

export const getRecord = async (levels = ['warn', 'error']) => {
    try {
        const token = sessionStorage.getItem("access_token"); // ✅ Se obtiene el access_token correcto

        if (!token) {
            return [];
        }

        // Asegurarse de que los niveles por defecto ('warn' y 'error') siempre estén presentes
        if (levels.length === 0) {
            levels = ['warn', 'error'];
        }

        // Construcción dinámica de la URL con los niveles seleccionados
        let queryParams = levels.map(level => `level=${level}`).join("&");

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


export const getHistory = async (levels = ['info']) => {
    try {
        const token = sessionStorage.getItem("access_token"); // ✅ Se obtiene el access_token correcto

        if (!token) {
            console.warn("⚠️ No hay token disponible, asegúrate de estar autenticado.");
            return [];
        }

        // Asegurarse de que los niveles por defecto ('warn' y 'error') siempre estén presentes
        if (levels.length === 0) {
            levels = ['info'];
        }

        // Construcción dinámica de la URL con los niveles seleccionados
        let queryParams = levels.map(level => `level=${level}`).join("&");

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
