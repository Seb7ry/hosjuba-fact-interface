import axios from "axios";

const API_URL = "http://192.168.168.108:3000/document"; // Ajusta la URL si es diferente

const handleTokenRefresh = (response) => {
    if (response?.access_token) {
        sessionStorage.setItem("access_token", response.access_token);
    }
};

export const downloadPdf = async (documentPatient, consecutiveAdmission, numberFac = null) => {
    try {
        const token = sessionStorage.getItem("access_token");

        if (!token) {
            console.warn("⚠️ No hay token disponible, asegúrate de estar autenticado.");
            return null;
        }

        const queryParams = new URLSearchParams({
            documentPatient,
            consecutiveAdmission,
        });

        if (numberFac) {
            queryParams.append("numberFac", numberFac);
        }

        const response = await axios.get(`${API_URL}?${queryParams.toString()}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
            responseType: "blob",
        });

        return response.data; 
    } catch (error) {
        console.error("❌ Error al descargar el PDF:", error);
        return null; 
    }
};

export const getAllFact = async (documentPatient, consecutiveAdmission) => {
    try {
        const token = sessionStorage.getItem("access_token");

        if (!token) {
            console.warn("⚠️ No hay token disponible, asegúrate de estar autenticado.");
            return [];
        }

        const response = await axios.get(`${API_URL}/allFact`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
            params: { documentPatient, consecutiveAdmission },
        });

        const resData = response.data;
        handleTokenRefresh(resData);

        return resData.data;
    } catch (error) {
        console.error("❌ Error al obtener las facturas:", error);
        return [];
    }
};

export const getFactDetails = async (documentPatient, consecutiveAdmission, numberFac) => {
    try {
        const token = sessionStorage.getItem("access_token");

        if (!token) {
            console.warn("⚠️ No hay token disponible, asegúrate de estar autenticado.");
            return null;
        }

        const response = await axios.get(`${API_URL}/factDetails`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
            params: { documentPatient, consecutiveAdmission, numberFac },
        });

        return response.data;
    } catch (error) {
        console.error("❌ Error al obtener los detalles de la factura:", error);
        return null;
    }
};