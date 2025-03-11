import React from 'react';
import './loadingOverlay.css'; 

/**
 * Componente que muestra una superposición de carga con un spinner animado.
 * 
 * Se utiliza para indicar al usuario que una acción está en proceso, bloqueando la interacción
 * con la interfaz hasta que la carga se complete.
 * 
 * @component
 * @returns {JSX.Element} Componente de superposición de carga.
 */
const LoadingOverlay = () => {
    return (
        <div className="loading-overlay">
            <div className="spinner"></div>
        </div>
    );
};

export default LoadingOverlay;
