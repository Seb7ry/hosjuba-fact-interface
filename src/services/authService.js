import axios from 'axios';

const API_URL = 'http://localhost:3000/auth/login';

export const loginUser = async (username, password) => {
    try {
        const response = await axios.post(API_URL, { username, password });

        // Guardar los tokens en sessionStorage
        const { access_token, refresh_token } = response.data;
        sessionStorage.setItem('access_token', access_token);
        sessionStorage.setItem('refresh_token', refresh_token);

        return response.data;
    } catch (error) {
        throw new Error('Error al intentar iniciar sesión: ' + error.message);
    }
};
