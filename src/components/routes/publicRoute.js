import React from 'react';
import { Route, Redirect } from 'react-router-dom';

const PublicRoute = ({ component: Component, ...rest }) => {
    const isAuthenticated = !!sessionStorage.getItem('access_token');

    return (
        <Route
            {...rest}
            render={(props) =>
                isAuthenticated ? (
                    <Redirect to="/dashboard" /> 
                ) : (
                    <Component {...props} /> 
                )
            }
        />
    );
};

export default PublicRoute;
