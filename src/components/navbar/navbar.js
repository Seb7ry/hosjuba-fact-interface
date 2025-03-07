import React from 'react';
import { useHistory } from 'react-router-dom';
import { logout } from '../../services/authService';

const Navbar = () => {
    const history = useHistory();

    const handleLogout = async () => {
        await logout(); // Llamamos la función de logout
        history.push('/'); // Redirige al Login
    };

    return (
        <nav className="navbar">
            <h2>Mi Aplicación</h2>
            <button onClick={handleLogout}>Cerrar Sesión</button>
        </nav>
    );
};

export default Navbar;
