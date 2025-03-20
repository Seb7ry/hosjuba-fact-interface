import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { isAccessTokenExpired, refreshAccessToken } from '../../services/authService';

const PrivateRoute = ({ component: Component, ...rest }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);

  useEffect(() => {
    const checkAuth = async () => {
      if (isAccessTokenExpired()) {
        const newToken = await refreshAccessToken();
        setIsAuthenticated(!!newToken);
      } else {
        setIsAuthenticated(true);
      }
    };

    checkAuth();
  }, []);

  if (isAuthenticated === null) {
    return <div>Cargando...</div>;
  }

  return isAuthenticated ? (
    <Component {...rest} /> // Si está autenticado, renderiza el componente
  ) : (
    <Navigate to="/" /> // Si no está autenticado, redirige a la página de login
  );
};

export default PrivateRoute;
