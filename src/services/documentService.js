import axios from "axios";

const API_URL = "http://localhost:3000/document"; // Ajusta la URL si es diferente

/**
 * Descarga el PDF generado para una admisión específica.
 * @param {string} documentPatient - Documento del paciente.
 * @param {number} consecutiveAdmission - Número de admisión.
 * @param {string} [numberFac] - (Opcional) Número de factura.
 */
export const downloadPdf = async (documentPatient, consecutiveAdmission, numberFac = null) => {
    try {
        const token = sessionStorage.getItem("access_token");

        if (!token) {
            console.warn("⚠️ No hay token disponible, asegúrate de estar autenticado.");
            return;
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
            responseType: "blob", // 🔥 Importante para descargar archivos
        });

        // Crear un enlace para descargar el archivo
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "comprobante.pdf");
        document.body.appendChild(link);
        link.click();
        link.remove();

    } catch (error) {
        console.error("❌ Error al descargar el PDF:", error);
    }
};

/**
 * Obtiene todas las facturas asociadas a una admisión.
 * @param {string} documentPatient - Documento del paciente.
 * @param {string} consecutiveAdmission - Número de admisión.
 * @returns {Promise<Array>} Lista de facturas.
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

        return response.data;
    } catch (error) {
        console.error("❌ Error al obtener las facturas:", error);
        return [];
    }
};

/**
 * Obtiene los detalles de una factura específica.
 * @param {string} documentPatient - Documento del paciente.
 * @param {string} consecutiveAdmission - Número de admisión.
 * @param {string} numberFac - Número de factura.
 * @returns {Promise<any>} Detalles de la factura.
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