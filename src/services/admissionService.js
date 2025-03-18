import axios from "axios";

const API_URL = "http://localhost:3000/admission"; // Ajusta la URL de tu backend

// 🔹 Función para obtener los headers con el token de autenticación
const getAuthHeaders = () => {
    const token = sessionStorage.getItem("access_token");
    return {
        headers: { "Authorization": `Bearer ${token}` }
    };
};

// 🔹 Obtener todas las admisiones desde SQL Server
export const getAllAdmissions = async () => {
    try {
        const response = await axios.get(API_URL, getAuthHeaders());
        return response.data;
    } catch (error) {
        console.error("❌ Error al obtener todas las admisiones:", error);
        return [];
    }
};

// 🔹 Obtener admisiones con filtros desde SQL Server
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

// 🔹 Obtener admisiones firmadas desde MongoDB **SOLO las visibles en la página actual**
export const getSignedAdmissions = async (visibleAdmissions) => {
    try {
        const response = await axios.post(
            `${API_URL}/signed`, 
            { admissions: visibleAdmissions }, // Solo los registros visibles en la página
            getAuthHeaders()
        );
        return response.data; // Devuelve la lista de admisiones firmadas
    } catch (error) {
        console.error("❌ Error al obtener admisiones firmadas:", error);
        return [];
    }
};

export const getSignedAdmissionsAll = async (visibleAdmissions) => {
    try {
        const response = await axios.post(
            `${API_URL}/signed`, 
            { admissions: visibleAdmissions }, // Solo los registros visibles en la página
            getAuthHeaders()
        );
        return response.data; // Devuelve la lista de admisiones firmadas
    } catch (error) {
        console.error("❌ Error al obtener admisiones firmadas:", error);
        return [];
    }
};