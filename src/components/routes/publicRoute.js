import React from 'react';
import { Navigate } from 'react-router-dom';

const PublicRoute = ({ component: Component, ...rest }) => {
  const isAuthenticated = !!localStorage.getItem("access_token");

  return isAuthenticated ? (
    <Navigate to="/dashboard" /> 
  ) : (
    <Component {...rest} /> 
  );
};

export default PublicRoute;
