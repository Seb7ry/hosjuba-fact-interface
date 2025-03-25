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
    const [showModal, setShowModal] = useState(false); // Estado para manejar el modal

    const navigate = useNavigate();  

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setShowError(false);
    
        try {
            await authService(username, password);
            setLoading(false);
            navigate('/dashboard'); 
        } catch (error) {
            setLoading(false);
            setError(error.message); 
            setShowError(true);
    
            setTimeout(() => {
                setShowError(false);
            }, 5000);
        }
    };

    return (
        <div className="login-container">
            {loading && <LoadingOverlay />}

            {/* Alerta de error */}
            <div className={`error-alert ${showError ? 'show' : ''}`}>
                {error}
            </div>

            <div className={`login-box ${loading ? 'blurred' : ''}`}>
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
                    <div className="password-container">
                        <input
                            type={showPassword ? "text" : "password"}
                            placeholder="Ingrese su contraseña"
                            value={password}
                            onChange={(e) => setPassword(e.target.value.toUpperCase())}
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
                        ¿Deseas más información de este servicio?
                        
                        <a href="#" onClick={(e) => { e.preventDefault(); setShowModal(true); }}>
                            Aquí
                        </a>
                    </p>
                </form>

                {/* MODAL */}
                {showModal && (
                    <div className="modal-overlay">
                        <div className="modal-box">
                            <div className="modal-header">
                                <h5 className="modal-title">Información del Servicio</h5>
                                <button className="close-button" onClick={() => setShowModal(false)}>&times;</button>
                            </div>
                            <div className="modal-body">
                                <p>
                                Pendiente modificar este modal, cambiar en caso de necesitarse.
                                </p>
                            </div>
                            <div className="modal-footer">
                                <button className="btn-close" onClick={() => setShowModal(false)}>Cerrar</button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Login;