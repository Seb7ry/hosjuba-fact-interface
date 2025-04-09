import axios from "axios";

const API_URL = `${process.env.REACT_APP_ROUTEROUTE_BACKSERVICE}/signature`;

/**
 * Genera los encabezados de autenticación para las solicitudes HTTP.
 * 
 * Obtiene el token almacenado en `sessionStorage` y lo incluye en los headers.
 * Si no hay token disponible, solo retorna el encabezado de tipo de contenido.
 * 
 * @returns {Object} Encabezados HTTP con Content-Type y, si está disponible, Authorization.
 */
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

/**
 * Actualiza el token de acceso si la respuesta del backend contiene un nuevo `access_token`.
 * 
 * @param {Object} response - Objeto de respuesta del backend que puede contener un nuevo token.
 */
const handleTokenRefresh = (response) => {
    if (response?.access_token) {
        sessionStorage.setItem("access_token", response.access_token);
    }
};

/**
 * Sube una firma digital al servidor asociada a una admisión específica.
 * 
 * Envía la firma en formato base64 junto con el ID de la admisión y el nombre del firmante.
 * Si la respuesta incluye un nuevo token, se actualiza automáticamente en el `sessionStorage`.
 * 
 * @param {string} signatureBase64 - Firma digital codificada en base64.
 * @param {string} admissionId - Identificador de la admisión relacionada.
 * @returns {Promise<Object>} Objeto con los datos de la firma guardada.
 * @throws {Error} Lanza un error con un mensaje específico si la solicitud falla.
 */
const uploadSignature = async (signatureBase64, admissionId) => {
    try {
        const response = await axios.post(
            `${API_URL}/upload`,
            {
                signatureBase64,
                admissionId, 
                signedBy: "user" 
            },
            getAuthHeaders()
        );

        const resData = response.data;
        handleTokenRefresh(resData);

        return resData.data;
    } catch (error) {
        console.error("❌ Error al subir la firma:", error.response?.data || error.message);

        if (error.response) {
            throw new Error(error.response.data?.message || "Error al subir la firma.");
        } else if (error.request) {
            throw new Error("No se pudo conectar con el servidor.");
        } else {
            throw new Error("Ocurrió un error inesperado.");
        }
    }
};

/**
 * Exporta las funciones del servicio de firma digital.
 * 
 * Métodos disponibles:
 * - uploadSignature: Sube una firma digital para una admisión.
 */
export default {
    uploadSignature,
};