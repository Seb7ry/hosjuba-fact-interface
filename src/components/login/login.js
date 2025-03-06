import React, { useState } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import './login.css';
import { loginUser } from '../../services/authService';
import LoadingOverlay from '../loadingOverlay/loadingOverlay'; // Ruta correcta

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false); // Para controlar la animación de carga

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true); // Iniciar carga
        try {
            const response = await loginUser(username, password);
            console.log('Login exitoso:', response);
            setLoading(false); // Detener carga
            window.location.href = '/dashboard'; // Redirigir a dashboard
        } catch (error) {
            setLoading(false); // Detener carga
            setError('Hubo un problema al iniciar sesión. Inténtalo de nuevo.');
            console.error('Error en login:', error);
        }
    };

    return (
        <div className="login-container">
            {/* Mostrar la animación de carga si está cargando */}
            {loading && <LoadingOverlay />}

            <div className={`login-box ${loading ? 'blurred' : ''}`}>
                <h2>Bienvenido</h2>
                {/* Mostrar mensaje de error si ocurre */}
                {error && <div className="error-message">{error}</div>}
                <form onSubmit={handleSubmit}>
                    <label>Usuario</label>
                    <input
                        type="text"
                        placeholder="Ingrese su usuario"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                    <label>Contraseña</label>
                    <div className="password-container">
                        <input
                            type={showPassword ? "text" : "password"}
                            placeholder="Ingrese su contraseña"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                        <span
                            className="toggle-password"
                            onClick={() => setShowPassword(!showPassword)}
                        >
                            {showPassword ? <FaEyeSlash /> : <FaEye />}
                        </span>
                    </div>
                    <button type="submit" className="sign-in-button">Ingresar</button>
                    <p className="signup-text">
                        ¿Deseas más información de este servicio? <a href="/info">Aquí</a>
                    </p>
                </form>
            </div>
        </div>
    );
};

export default Login;
