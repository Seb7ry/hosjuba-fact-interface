import axios from "axios";

const API_URL = "http://localhost:3000/admission"; // Ajusta la URL de tu backend

// Función para obtener el token de sesión
const getAuthHeaders = () => {
    const token = sessionStorage.getItem("access_token");
    return {
        headers: { "Authorization": `Bearer ${token}` }
    };
};

// Obtener todas las admisiones
export const getAllAdmissions = async () => {
    try {
        const response = await axios.get(API_URL, getAuthHeaders());
        return response.data;
    } catch (error) {
        console.error("❌ Error al obtener todas las admisiones:", error);
        return [];
    }
};

// Obtener admisiones con filtros
export const getFilteredAdmissions = async (filters) => {
    try {
        const response = await axios.get(`${API_URL}/filtrer`, { 
            params: filters,
            ...getAuthHeaders()
        });
        return response.data;
    } catch (error) {
        console.error("❌ Error al filtrar admisiones:", error);
        return [];
    }
};
