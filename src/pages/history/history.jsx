import React, { useEffect, useState } from "react";
import { getLogsByLevels, getLogsHistory } from "../../services/recordService";
import HistoryList from "../../components/historyList/historyList";
import Navbar from "../../components/navbar/navbar";

const History = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  // eslint-disable-next-line no-unused-vars
  const [error, setError] = useState(null);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [username, setUsername] = useState("");
  const [isEndDateDisabled, setIsEndDateDisabled] = useState(true);

  useEffect(() => {
    fetchInitialHistory();
  }, []);

  const fetchInitialHistory = async () => {
    setLoading(true);
    try {
      const data = await getLogsByLevels(["info"]);
      setHistory(data);
    } catch (err) {
      setError("No se pudieron cargar los registros iniciales de historial.");
      console.error("Error al obtener historial inicial:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchFilteredHistory = async () => {
    setLoading(true);
    try {
      const data = await getLogsHistory(startDate, endDate, username);
      setHistory(data);
    } catch (err) {
      setError("No se pudieron cargar los registros filtrados.");
      console.error("Error al obtener historial filtrado:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleStartDateChange = (e) => {
    const value = e.target.value;
    setStartDate(value);
    setIsEndDateDisabled(!value);
    if (!value) setEndDate("");
  };

  const handleEndDateChange = (e) => {
    const value = e.target.value;
    if (!value) return setEndDate("");
    if (value < startDate) return alert("⚠️ La fecha de final no puede ser menor a la fecha de inicio.");
    setEndDate(value);
  };

  const handleUsernameChange = (e) => {
    setUsername(e.target.value.toUpperCase());
  };

  const handleSearch = () => {
    if (startDate || endDate || username) {
      fetchFilteredHistory();
    } else {
      fetchInitialHistory();
    }
  };

  const handleClearFilters = () => {
    setStartDate("");
    setEndDate("");
    setUsername("");
    fetchInitialHistory();
  };

  return (
    <div className="flex bg-gray-100 min-h-screen">
      <Navbar />
      <div className="flex-1 px-5 py-6 pt-14 md:pt-6 md:ml-[250px] transition-all duration-300">
        <div className="max-w-[1200px] mx-auto flex flex-col gap-6">
          {/* Descripción */}
          <section className="bg-white rounded-lg shadow-md p-6">
            <h1 className="text-4xl font-bold text-black mb-4">Historial</h1>
            <hr className="mb-4" />
            <p className="text-gray-700 mb-4">
              Este apartado te permite consultar las acciones realizadas por los usuarios,
              como la generación o consulta de documentos dentro del sistema.
            </p>
            <ul className="list-disc pl-5 text-gray-800 space-y-2 text-sm">
              <li><strong>Usuario:</strong> Identificador del usuario. <code className="bg-gray-100 px-2 py-1 rounded">Ejemplo: JMURILLO</code></li>
              <li><strong>Mensaje:</strong> Detalle del evento. <code className="bg-gray-100 px-2 py-1 rounded">Ejemplo: Documento generado exitosamente</code></li>
              <li><strong>Contexto:</strong> Componente del sistema. <code className="bg-gray-100 px-2 py-1 rounded">Ejemplo: DocumentService</code></li>
              <li><strong>Fecha:</strong> Registro del evento. <code className="bg-gray-100 px-2 py-1 rounded">Ejemplo: 7/4/2025, 10:15:42</code></li>
            </ul>
          </section>

          {/* Filtros */}
          <section className="bg-white rounded-lg shadow-md p-6 flex flex-wrap gap-4 justify-center">
            <div className="flex flex-col gap-1">
              <label className="text-sm font-semibold">Fecha de Inicio</label>
              <input
                type="date"
                value={startDate}
                onChange={handleStartDateChange}
                className="border border-gray-300 rounded px-3 py-2 text-sm"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-sm font-semibold">Fecha de Fin</label>
              <input
                type="date"
                value={endDate}
                onChange={handleEndDateChange}
                disabled={isEndDateDisabled}
                className="border border-gray-300 rounded px-3 py-2 text-sm"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-sm font-semibold">Usuario</label>
              <input
                type="text"
                placeholder="Buscar por usuario"
                value={username}
                onChange={handleUsernameChange}
                className="border border-gray-300 rounded px-3 py-2 text-sm"
              />
            </div>

            {/* Botones */}
            <div className="flex flex-wrap gap-2 items-end">
              <button onClick={handleSearch} className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 text-sm">Buscar</button>
              <button onClick={handleClearFilters} className="bg-yellow-400 text-black px-4 py-2 rounded hover:bg-yellow-500 text-sm">Limpiar</button>
              <button onClick={fetchInitialHistory} className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 text-sm">Actualizar</button>
            </div>
          </section>

          {/* Lista */}
          <HistoryList history={history} loading={loading} />
        </div>
      </div>
    </div>
  );
};

export default History;
