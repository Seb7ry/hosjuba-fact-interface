import axios from "axios";

const API_URL = "http://localhost:3000/signatures"; // Ajusta la URL de tu backend

// 🔹 Función para obtener los headers con el token de autenticación
const getAuthHeaders = () => {
    const token = sessionStorage.getItem("access_token");
    return {
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        }
    };
};

// 🔹 Subir la firma al backend
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
        console.error("❌ Error al subir la firma:", error);
        throw error;
    }
};

export default {
    uploadSignature,
};
