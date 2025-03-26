import axios from "axios";

const API_URL = "http://localhost:3000/admission"; // Ajusta la URL de tu backend

// 🔹 Función para obtener los headers con el token de autenticación
const getAuthHeaders = () => {
    const token = sessionStorage.getItem("access_token");
    return {
        headers: { "Authorization": `Bearer ${token}` }
    };
};

export const saveAdmission = async (documentPatient, consecutiveAdmission, signatureBase64) => {
    try {
        console.log(documentPatient, ' and ', consecutiveAdmission);
        const response = await axios.post(
            `${API_URL}/save?documentPatient=${documentPatient}&consecutiveAdmission=${consecutiveAdmission}`,  // 👈 Ahora se envían en la URL
            { signature: signatureBase64 },  // Solo la firma va en el body
            getAuthHeaders()
        );

        return response.data;
    } catch (error) {
        console.error("❌ Error al guardar la admisión:", error);
        throw error;
    }
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
            { admissions: visibleAdmissions }, 
            getAuthHeaders()
        );
        return response.data; // Devuelve la lista de admisiones firmadas
    } catch (error) {
        console.error("❌ Error al obtener admisiones firmadas:", error);
        return [];
    }
};

export const getSignedAdmissionsAll = async () => {
    try {
        const response = await axios.get(`${API_URL}/signedAll`, getAuthHeaders()); // Llamada GET sin enviar "admissions"
        return response.data; // Devuelve todas las admisiones firmadas
    } catch (error) {
        console.error("❌ Error al obtener admisiones firmadas:", error);
        return [];
    }
};

export const getSignedAdmissionsFiltrer = async (filters) => {
    try {
        const response = await axios.get(`${API_URL}/signedFiltrer`, {
            params: filters, // Los filtros que se pasan desde el frontend
            ...getAuthHeaders()
        });
        return response.data; // Devuelve las admisiones filtradas que cumplen con los parámetros
    } catch (error) {
        console.error("❌ Error al obtener admisiones filtradas:", error);
        return [];
    }
};