import axios from "axios";

const API_URL = `${process.env.REACT_APP_ROUTEROUTE_BACKSERVICE}/stat`; 

/**
 * Genera los encabezados de autenticación para las solicitudes HTTP.
 * 
 * Obtiene el token de `sessionStorage` y lo incluye en los headers. Si no hay token disponible,
 * retorna solo el header con `Content-Type: application/json`.
 * 
 * @returns {Object} Encabezados HTTP con o sin token de autenticación.
 */
const getAuthHeaders = () => {
    const token = sessionStorage.getItem("access_token");
    return {
        headers: { "Authorization": `Bearer ${token}` }
    };
};

/**
 * Obtiene estadísticas generales desde el backend.
 * 
 * Las estadísticas incluyen información resumida, como el número de firmas registradas 
 * y el total por tipo de admisión (urgencias, triage, consulta externa, hospitalización).
 * 
 * @returns {Promise<Object>} Objeto con los datos estadísticos obtenidos del servidor.
 * @throws Lanza un error si ocurre un problema durante la solicitud.
 */
export const getStats = async () => {
    try {
      const response = await axios.get(API_URL, getAuthHeaders());
      return response.data;
    } catch (error) {
      console.error("Error al obtener estadísticas:", error);
      throw error;
    }
  };