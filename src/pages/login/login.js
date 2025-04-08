import React, { useState } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import './login.css';
import { authService } from '../../services/authService';
import LoadingOverlay from '../../components/loadingOverlay/loadingOverlay';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [showError, setShowError] = useState(false);
    const [showModal, setShowModal] = useState(false);

    const navigate = useNavigate();  

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setShowError(false);

        try {
            await authService(username, password);
            setLoading(false);
            navigate('/dashboard');
        } catch (err) {
            setLoading(false);
            setError(err.message);
            setShowError(true);
            setTimeout(() => setShowError(false), 5000);
        }
    };

    return (
        <div className="login-container">
            {loading && <LoadingOverlay />}

            <div className={`login-error-alert ${showError ? 'login-show' : ''}`}>
                {error}
            </div>

            <div className={`login-box ${loading ? 'login-blurred' : ''}`}>
                <h2>Bienvenido</h2>
                <form onSubmit={handleSubmit}>
                    <label>Usuario</label>
                    <input
                        type="text"
                        placeholder="Ingrese su usuario"
                        value={username}
                        onChange={(e) => setUsername(e.target.value.toUpperCase())}
                        required
                    />
                    <label>Contraseña</label>
                    <div className="login-password-container">
                        <input
                            type={showPassword ? 'text' : 'password'}
                            placeholder="Ingrese su contraseña"
                            value={password}
                            onChange={(e) => setPassword(e.target.value.toUpperCase())}
                            required
                        />
                        <span
                            className="login-toggle-password"
                            onClick={() => setShowPassword(!showPassword)}
                        >
                            {showPassword ? <FaEyeSlash /> : <FaEye />}
                        </span>
                    </div>

                    <button type="submit" className="login-sign-in-button">Ingresar</button>

                    <p className="login-signup-text">
                        ¿Deseas más información de este servicio?{' '}
                        <a
                        href="/#"
                        onClick={(e) => {
                            e.preventDefault();
                            setShowModal(true);
                        }}
                        role="button"
                        >
                        Aquí
                        </a>
                    </p>
                </form>

                {showModal && (
                    <div className="login-modal-overlay">
                        <div className="login-modal-box">
                            <div className="login-modal-header">
                                <h5 className="login-modal-title">Información del Servicio</h5>
                                <button className="login-close-button" onClick={() => setShowModal(false)}>&times;</button>
                            </div>
                            <div className="login-modal-body">
                                <p>Este software de gestión documental de comprobantes de atención fue desarrollado en el Hospital San Juan Bautista como parte del proyecto de paz y desarrollo regional. El desarrollo estuvo a cargo de un estudiante de la Universidad de Ibagué, en el marco del programa Paz y Región durante su semestre de inmersión, contando con el respaldo, acompañamiento y facilidades brindadas por el área de sistemas del hospital. Esta colaboración tuvo como propósito contribuir a la transformación digital del sistema de salud y al fortalecimiento institucional en el municipio de Chaparral, Tolima.</p>
                            </div>
                            <div className="login-modal-footer">
                                <button className="login-btn-close" onClick={() => setShowModal(false)}>Cerrar</button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Login;