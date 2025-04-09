import axios from "axios";

const API_URL = `${process.env.REACT_APP_ROUTEROUTE_BACKSERVICE}/admission`; 

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
    return {
        headers: { "Authorization": `Bearer ${token}` }
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
 * Guarda la firma digital en una admisión específica.
 * 
 * @param {string} documentPatient - Número de documento del paciente.
 * @param {string} consecutiveAdmission - Consecutivo de la admisión.
 * @param {string} signatureBase64 - Firma digital codificada en base64.
 * @param {string} signedBy - Nombre del firmante.
 * @returns {Promise<Object>} Datos actualizados de la admisión.
 * @throws {Error} Si ocurre un error en la petición o la conexión falla.
 */
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

/**
 * Obtiene todas las admisiones disponibles desde el backend.
 * 
 * @returns {Promise<Array>} Lista de todas las admisiones o lista vacía si falla.
 */
export const getAllAdmissions = async () => {
    try {
        const response = await axios.get(API_URL, getAuthHeaders());
        return response.data;
    } catch (error) {
        console.error("❌ Error al obtener todas las admisiones:", error);
        return [];
    }
};

/**
 * Filtra las admisiones según los criterios proporcionados.
 * 
 * @param {Object} filters - Objeto con los filtros a aplicar.
 * @returns {Promise<Array>} Lista de admisiones filtradas.
 */
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

/**
 * Verifica cuáles de las admisiones visibles están firmadas.
 * 
 * @param {Array} visibleAdmissions - Lista de admisiones visibles en pantalla.
 * @returns {Promise<Array>} Lista de admisiones firmadas.
 */
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

/**
 * Obtiene todas las admisiones que tienen firma digital, sin aplicar filtros.
 * 
 * @returns {Promise<Array>} Lista de todas las admisiones firmadas.
 */
export const getSignedAdmissionsAll = async () => {
    try {
        const response = await axios.get(`${API_URL}/signedAll`, getAuthHeaders()); 
        return response.data; 
    } catch (error) {
        console.error("❌ Error al obtener admisiones firmadas:", error);
        return [];
    }
};

/**
 * Filtra las admisiones firmadas según criterios específicos.
 * 
 * @param {Object} filters - Filtros para aplicar a las admisiones firmadas.
 * @returns {Promise<Array>} Lista de admisiones firmadas y filtradas.
 */
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

/**
 * Actualiza una admisión marcada como firmada.
 * 
 * @param {string} documentPatient - Documento del paciente.
 * @param {string} consecutiveAdmission - Consecutivo de la admisión.
 * @returns {Promise<Object>} Objeto actualizado de la admisión.
 * @throws {Error} Si ocurre un error al actualizar la admisión.
 */
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
