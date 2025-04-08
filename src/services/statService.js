import axios from "axios";

const API_URL = "http://192.168.168.108:3000/stat"; 

const getAuthHeaders = () => {
    const token = sessionStorage.getItem("access_token");
    return {
        headers: { "Authorization": `Bearer ${token}` }
    };
};

export const getStats = async () => {
    try {
      const response = await axios.get(API_URL, getAuthHeaders());
      return response.data;
    } catch (error) {
      console.error("Error al obtener estadísticas:", error);
      throw error;
    }
  };