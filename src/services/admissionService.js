import axios from "axios";

const API_URL = "http://192.168.168.108:3000/admission"; 

const getAuthHeaders = () => {
    const token = sessionStorage.getItem("access_token");
    return {
        headers: { "Authorization": `Bearer ${token}` }
    };
};

const handleTokenRefresh = (response) => {
    if (response?.access_token) {
        sessionStorage.setItem("access_token", response.access_token);
    }
};

export const saveAdmission = async (documentPatient, consecutiveAdmission, signatureBase64, signedBy) => {
    try {
        const response = await axios.post(
            `${API_URL}/save`, 
            { signature: signatureBase64, signedBy },  
            {
                ...getAuthHeaders(),
                params: { documentPatient, consecutiveAdmission }  
            }
        );

        const resData = response.data;
        handleTokenRefresh(resData);

        return resData.data
    } catch (error) {
        console.error("❌ Error al guardar la admisión:", error.response?.data || error.message);

        if (error.response) {
            throw new Error(error.response.data?.message || "Error al guardar la admisión.");
        } else if (error.request) {
            throw new Error("No se pudo conectar con el servidor.");
        } else {
            throw new Error("Ocurrió un error inesperado.");
        }
    }
};

export const getAllAdmissions = async () => {
    try {
        const response = await axios.get(API_URL, getAuthHeaders());
        return response.data;
    } catch (error) {
        console.error("❌ Error al obtener todas las admisiones:", error);
        return [];
    }
};

export const getFilteredAdmissions = async (filters) => {
    try {
        const response = await axios.get(`${API_URL}/filtrer`, { 
            params: filters,
            ...getAuthHeaders()
        });

        const resData = response.data;
        handleTokenRefresh(resData);

        return resData.data;
    } catch (error) {
        console.error("❌ Error al filtrar admisiones:", error);
        return [];
    }
};

export const getSignedAdmissions = async (visibleAdmissions) => {
    try {
        const response = await axios.post(
            `${API_URL}/signed`, 
            { admissions: visibleAdmissions }, 
            getAuthHeaders()
        );
        return response.data;
    } catch (error) {
        console.error("❌ Error al obtener admisiones firmadas:", error);
        return [];
    }
};

export const getSignedAdmissionsAll = async () => {
    try {
        const response = await axios.get(`${API_URL}/signedAll`, getAuthHeaders()); 
        return response.data; 
    } catch (error) {
        console.error("❌ Error al obtener admisiones firmadas:", error);
        return [];
    }
};

export const getSignedAdmissionsFiltrer = async (filters) => {
    try {
        const response = await axios.get(`${API_URL}/signedFiltrer`, {
            params: filters,
            ...getAuthHeaders()
        });

        const resData = response.data;
        handleTokenRefresh(resData);

        return resData.data;
    } catch (error) {
        console.error("❌ Error al obtener admisiones filtradas:", error);
        return [];
    }
};

export const updateAdmission = async (documentPatient, consecutiveAdmission) => {
    try {
        const response = await axios.put(
            `${API_URL}/updateSigned`, 
            {},  
            {
                ...getAuthHeaders(),
                params: { 
                    documentPatient, 
                    consecutiveAdmission 
                }  
            }
        );

        const resData = response.data;
        handleTokenRefresh(resData);

        return resData.data;
    } catch (error) {
        console.error("❌ Error al actualizar la admisión:", error.response?.data || error.message);

        if (error.response) {
            throw new Error(error.response.data?.message || "Error al actualizar la admisión.");
        } else if (error.request) {
            throw new Error("No se pudo conectar con el servidor.");
        } else {
            throw new Error("Ocurrió un error inesperado.");
        }
    }
};
