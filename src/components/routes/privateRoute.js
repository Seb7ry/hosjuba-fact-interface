import React, { useState, useEffect } from 'react';
import { Route, Redirect } from 'react-router-dom';
import { isAccessTokenExpired, refreshAccessToken } from '../../services/authService';

/**
 * Componente de Ruta Privada que protege las rutas que requieren autenticación.
 * 
 * - Verifica si el usuario tiene un **token de acceso válido**.
 * - Si el token ha expirado, intenta **renovarlo automáticamente**.
 * - Si la autenticación falla, redirige al usuario a la página de inicio (`/`).
 * 
 * @component
 * @param {Object} props - Propiedades del componente.
 * @param {React.Component} props.component - Componente a renderizar si el usuario está autenticado.
 * @returns {JSX.Element} Ruta privada protegida.
 */
const PrivateRoute = ({ component: Component, ...rest }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(null); // Estado de autenticación

    /**
     * Verifica si el token es válido o necesita ser renovado.
     * 
     * - Si el token ha expirado, intenta refrescarlo.
     * - Si se obtiene un nuevo token, marca al usuario como autenticado.
     * - Si la renovación falla, el usuario no está autenticado.
     */
    useEffect(() => {
        const checkAuth = async () => {
            if (isAccessTokenExpired()) {
                const newToken = await refreshAccessToken(); // Intento de renovación del token
                setIsAuthenticated(!!newToken); // Si hay un nuevo token, el usuario sigue autenticado
            } else {
                setIsAuthenticated(true); // El token sigue siendo válido
            }
        };

        checkAuth();
    }, []);

    // Muestra un mensaje de carga mientras se verifica la autenticación
    if (isAuthenticated === null) {
        return <div>Cargando...</div>;
    }

    return (
        <Route
            {...rest}
            render={(props) =>
                isAuthenticated ? <Component {...props} /> : <Redirect to="/" />
            }
        />
    );
};

export default PrivateRoute;