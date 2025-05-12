import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import React, { useState } from 'react';

import LoadingOverlay from '../../components/loadingOverlay/loadingOverlay';
import { authService } from '../../services/authService';
import background from '../../assets/background-chapa.jpeg';

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showError, setShowError] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
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
    <div className="relative z-10 flex h-screen w-full items-center justify-center bg-cover bg-center" style={{ backgroundImage: "url('/src/assets/background-chapa.jpeg')" }}>
      <div className="absolute inset-0 z-0 bg-cover bg-center blur-sm" style={{ backgroundImage: `url(${background})` }} />

      {loading && <LoadingOverlay />}

      {showError && (
        <div className="absolute top-[15%] left-1/2 z-30 w-[350px] -translate-x-1/2 transform rounded-md bg-red-100 px-5 py-3 text-center text-sm font-bold text-red-800 shadow-md transition-opacity duration-300">
          {error}
        </div>
      )}

      <div className={`relative z-10 w-[370px] rounded-lg bg-white p-8 text-center shadow-md ${loading ? 'opacity-50' : ''}`}>
        <h2 className="mb-6 text-2xl font-bold text-black">Bienvenido</h2>
        <form onSubmit={handleSubmit} className="flex flex-col text-left">
          <label className="mb-1 text-sm font-bold text-black">Usuario</label>
          <input
            type="text"
            placeholder="Ingrese su usuario"
            value={username}
            onChange={(e) => setUsername(e.target.value.toUpperCase())}
            required
            className="mb-4 rounded-md border border-gray-300 px-3 py-2 text-sm text-black focus:outline-none"
          />

          <label className="mb-1 text-sm font-bold text-black">Contraseña</label>
          <div className="relative flex items-center">
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Ingrese su contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value.toUpperCase())}
              required
              className="w-full rounded-md border border-gray-300 px-3 py-2 pr-10 text-sm text-black focus:outline-none"
            />
            <span
              className="absolute right-3 top-1/2 -translate-y-1/2 transform cursor-pointer text-lg text-gray-700 hover:text-blue-500"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>

          <button
            type="submit"
            className="mt-5 w-full rounded-md bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-800"
          >
            Ingresar
          </button>

          <p className="mt-4 text-center text-sm text-black">
            ¿Deseas más información de este servicio?{' '}
            <a
              href="/#"
              className="text-blue-600 underline hover:text-blue-800"
              onClick={(e) => {
                e.preventDefault();
                setShowModal(true);
              }}
            >
              Aquí
            </a>
          </p>
        </form>

        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="w-[400px] rounded-md bg-white p-5 shadow-lg">
              <div className="mb-3 flex items-center justify-between">
                <h5 className="flex-1 text-center text-sm font-bold">Información del Servicio</h5>
                <button className="text-lg text-gray-800" onClick={() => setShowModal(false)}>&times;</button>
              </div>
              <div className="mb-4 text-sm text-gray-800">
                <p>Este software de gestión documental de comprobantes de atención fue desarrollado en el Hospital San Juan Bautista como parte del proyecto de paz y desarrollo regional. El desarrollo estuvo a cargo de un estudiante de la Universidad de Ibagué, en el marco del programa Paz y Región durante su semestre de inmersión, contando con el respaldo, acompañamiento y facilidades brindadas por el área de sistemas del hospital. Esta colaboración tuvo como propósito contribuir a la transformación digital del sistema de salud y al fortalecimiento institucional en el municipio de Chaparral, Tolima.</p>
              </div>
              <div className="flex justify-center">
                <button className="rounded-md bg-red-600 px-4 py-2 text-white hover:bg-red-800" onClick={() => setShowModal(false)}>Cerrar</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Login;
