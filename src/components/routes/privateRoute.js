import React, { useState, useEffect } from 'react';
import { Route, Redirect } from 'react-router-dom';
import { isAccessTokenExpired, refreshAccessToken } from '../../services/authService';

const PrivateRoute = ({ component: Component, ...rest }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(null);

    useEffect(() => {
        const checkAuth = async () => {
            if (isAccessTokenExpired()) {
                const newToken = await refreshAccessToken(); // Intentamos renovar el token
                setIsAuthenticated(!!newToken); // Si hay un nuevo token, está autenticado; si no, no lo está.
            } else {
                setIsAuthenticated(true); // El token sigue válido
            }
        };

        checkAuth();
    }, []);

    if (isAuthenticated === null) {
        return <div>Cargando...</div>; // Mientras verifica, mostramos un mensaje de carga
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
