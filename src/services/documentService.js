import axios from "axios";

const API_URL = `${process.env.REACT_APP_ROUTEROUTE_BACKSERVICE}/document`;

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
 * Descarga un documento PDF correspondiente a una admisión y, opcionalmente, a una factura.
 * 
 * @param {string} documentPatient - Número de documento del paciente.
 * @param {string} consecutiveAdmission - Consecutivo de la admisión.
 * @param {string|null} numberFac - (Opcional) Número de factura a incluir en el PDF.
 * @returns {Promise<Blob|null>} Blob del PDF si la descarga es exitosa, o `null` en caso de error.
 */
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

/**
 * Obtiene todas las facturas asociadas a una admisión específica desde el backend.
 * 
 * @param {string} documentPatient - Número de documento del paciente.
 * @param {string} consecutiveAdmission - Consecutivo de la admisión.
 * @returns {Promise<Array>} Lista de facturas obtenidas. Devuelve un arreglo vacío en caso de error.
 */
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

/**
 * Obtiene los detalles de una factura específica vinculada a una admisión.
 * 
 * @param {string} documentPatient - Número de documento del paciente.
 * @param {string} consecutiveAdmission - Consecutivo de la admisión.
 * @param {string} numberFac - Número de la factura a consultar.
 * @returns {Promise<Object|null>} Detalles de la factura o `null` si ocurre un error.
 */
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