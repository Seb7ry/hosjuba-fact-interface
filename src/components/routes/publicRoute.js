    import React from 'react';
    import { Route, Redirect } from 'react-router-dom';

    /**
     * Componente de Ruta Pública que gestiona el acceso a páginas sin autenticación.
     * 
     * - Si el usuario **NO está autenticado**, renderiza el componente solicitado.
     * - Si el usuario **está autenticado**, lo redirige al `/dashboard` para evitar el acceso a páginas como login o registro.
     * 
     * @component
     * @param {Object} props - Propiedades del componente.
     * @param {React.Component} props.component - Componente a renderizar si el usuario no está autenticado.
     * @returns {JSX.Element} Ruta pública protegida.
     */
    const PublicRoute = ({ component: Component, ...rest }) => {
        const isAuthenticated = !!sessionStorage.getItem('access_token'); // Verifica si hay un token de sesión

        return (
            <Route
                {...rest}
                render={(props) =>
                    isAuthenticated ? (
                        <Redirect to="/dashboard" /> // Si está autenticado, redirige al dashboard
                    ) : (
                        <Component {...props} /> // Si no está autenticado, muestra el componente solicitado
                    )
                }
            />
        );
    };

    export default PublicRoute;