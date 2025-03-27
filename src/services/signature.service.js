import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:3000/signatures";

const getAuthHeaders = () => {
    const token = sessionStorage.getItem("access_token");
    
    if (!token) {
        console.warn("⚠️ No hay token de autenticación disponible.");
        return { headers: { "Content-Type": "application/json" } };
    }

    return {
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        }
    };
};

const uploadSignature = async (signatureBase64, admissionId) => {
    try {
        const response = await axios.post(
            `${API_URL}/upload`,
            {
                signatureBase64,
                filename: `signature-${admissionId}.png`,
            },
            getAuthHeaders()
        );

        return response.data;
    } catch (error) {
        console.error("❌ Error al subir la firma:", error.response?.data || error.message);

        // Lanzamos un error más claro dependiendo del tipo de fallo
        if (error.response) {
            throw new Error(error.response.data?.message || "Error al subir la firma.");
        } else if (error.request) {
            throw new Error("No se pudo conectar con el servidor.");
        } else {
            throw new Error("Ocurrió un error inesperado.");
        }
    }
};

export default {
    uploadSignature,
};