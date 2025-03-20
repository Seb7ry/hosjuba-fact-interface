import React from 'react';
import { Navigate } from 'react-router-dom';

const PublicRoute = ({ component: Component, ...rest }) => {
  const isAuthenticated = !!sessionStorage.getItem('access_token'); // Verifica si hay un token de sesión

  return isAuthenticated ? (
    <Navigate to="/dashboard" /> // Redirige si ya está autenticado
  ) : (
    <Component {...rest} /> // Si no está autenticado, renderiza el componente
  );
};

export default PublicRoute;
