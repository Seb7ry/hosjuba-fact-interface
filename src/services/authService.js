import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

const API_URL = 'http://192.168.168.108:3000/auth';

export const getAccessToken = () => sessionStorage.getItem('access_token');

export const isAccessTokenExpired = () => {
    const token = getAccessToken();
    if (!token) return true;

    try {
        const decoded = jwtDecode(token);
        return decoded.exp * 1000 < Date.now(); 
    } catch (error) {
        return true;
    }
};

export const refreshAccessToken = async () => {
    const refreshToken = sessionStorage.getItem('refresh_token');
    if (!refreshToken) return null;

    try {
        const response = await axios.post(`${API_URL}/refresh`, { refreshToken });
        const { access_token } = response.data;

        sessionStorage.setItem('access_token', access_token);
        return access_token;
    } catch (error) {
        logout();
        return null;
    }
};

export const logout = async () => {
    const username = sessionStorage.getItem('username'); 
    if (!username) {
        clearSession();
        return;
    }

    try {
        await axios.post(`${API_URL}/logout`, { username }, {
            headers: { Authorization: `Bearer ${getAccessToken()}` }
        });
    } catch (error) {
        console.warn('Error al cerrar sesión en el backend:', error);
    }

    clearSession(); 
};

const clearSession = () => {
    sessionStorage.removeItem('access_token');
    sessionStorage.removeItem('refresh_token');
    sessionStorage.removeItem('username');
    sessionStorage.removeItem('grupo'); 
    window.location.href = '/'; 
};

export const apiClient = axios.create({
    baseURL: API_URL,
});

apiClient.interceptors.request.use(
    async (config) => {
        if (isAccessTokenExpired()) {
            await refreshAccessToken();
        }
        const newToken = getAccessToken();
        if (newToken) {
            config.headers.Authorization = `Bearer ${newToken}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
    response => response,
    async (error) => {
        if (error.response?.status === 401) {
            logout(); 
        }
        return Promise.reject(error);
    }
);

export const authService = async (username, password) => {
    try {
        const response = await axios.post(`${API_URL}/login`, { username, password });
        const { access_token, refresh_token, grupo } = response.data;

        sessionStorage.setItem('access_token', access_token);
        sessionStorage.setItem('refresh_token', refresh_token);
        sessionStorage.setItem('username', username);
        sessionStorage.setItem('grupo', grupo )

        return response.data;
    } catch (error) {
        if (error.response) {
            if (error.response.status === 404) {
                throw new Error('El usuario no existe.');
            } else if (error.response.status === 401) {
                throw new Error('Contraseña incorrecta.');
            } else {
                throw new Error('Error al iniciar sesión. Inténtalo de nuevo.');
            }
        } else {
            throw new Error('No se pudo conectar con el servidor.');
        }
    }
};