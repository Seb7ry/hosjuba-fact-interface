import React, { useEffect, useState } from "react";
import { getLogsByLevels, getLogsTec } from "../../services/recordService";
import RecordList from "../../components/recordList/recordList";
import Navbar from "../../components/navbar/navbar";

const Record = () => {
  const [isEndDateDisabled, setIsEndDateDisabled] = useState(true);
  const [selectedLevel, setSelectedLevel] = useState("");
  const [startDate, setStartDate] = useState("");
  const [loading, setLoading] = useState(true);
  const [endDate, setEndDate] = useState("");
  // eslint-disable-next-line no-unused-vars
  const [error, setError] = useState(null);
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    fetchInitialLogs();
  }, []);

  const fetchInitialLogs = async () => {
    setLoading(true);
    try {
      const data = await getLogsByLevels(["warn", "error"]);
      setLogs(data);
    } catch (err) {
      setError("No se pudieron cargar los registros iniciales.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchFilteredLogs = async (level = "", start = "", end = "") => {
    setLoading(true);
    try {
      const levels = level ? [level] : ["warn", "error"];
      const data = await getLogsTec(levels, start, end);
      setLogs(data);
    } catch (err) {
      setError("No se pudieron cargar los registros filtrados.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleLevelChange = (e) => setSelectedLevel(e.target.value);

  const handleStartDateChange = (e) => {
    const date = e.target.value;
    setStartDate(date);
    if (!date) {
      setEndDate("");
      setIsEndDateDisabled(true);
    } else {
      setIsEndDateDisabled(false);
    }
  };

  const handleEndDateChange = (e) => {
    const date = e.target.value;
    if (!date) {
      setEndDate("");
      return;
    }

    if (date < startDate) {
      alert("⚠️ La fecha de final no puede ser menor a la fecha de inicio.");
      return;
    }
    setEndDate(date);
  };

  const handleSearch = () => {
    if (selectedLevel || startDate || endDate) {
      fetchFilteredLogs(selectedLevel, startDate, endDate);
    } else {
      fetchInitialLogs();
    }
  };

  const handleClearFilters = () => {
    setSelectedLevel("");
    setStartDate("");
    setEndDate("");
    fetchInitialLogs();
  };

  return (
    <div className="flex bg-gray-100 min-h-screen">
      <Navbar />

      <div className="flex-1 px-5 py-6 pt-14 md:pt-6 md:ml-[250px] transition-all duration-300">
        <div className="max-w-[1200px] mx-auto flex flex-col gap-6">
          {/* Descripción */}
          <section className="bg-white rounded-lg shadow-md p-6">
            <h1 className="text-4xl font-bold text-black mb-4">Registros</h1>
            <hr className="mb-4" />
            <p className="text-gray-700 mb-4">
              En este apartado puedes visualizar y gestionar los registros relevantes del sistema.
              Aquí se almacena información clave relacionada con errores o advertencias del software,
              lo que te permitirá identificar con precisión dónde y cuándo ocurrió un incidente,
              incluyendo la fecha y hora exactas.
            </p>
            <ul className="list-disc pl-5 text-gray-800 space-y-2 text-sm">
              <li><strong>Nivel:</strong> Indica el grado de afectación del evento. <code className="bg-gray-100 px-2 py-1 rounded">Ejemplo: Advertencia</code></li>
              <li><strong>Mensaje:</strong> Describe brevemente el evento registrado. <code className="bg-gray-100 px-2 py-1 rounded">Ejemplo: Usuario no encontrado</code></li>
              <li><strong>Contexto:</strong> Módulo del backend donde se originó. <code className="bg-gray-100 px-2 py-1 rounded">Ejemplo: AdmissionService</code></li>
              <li><strong>Fecha de Registro:</strong> Momento en que se almacenó el evento. <code className="bg-gray-100 px-2 py-1 rounded">Ejemplo: 7/4/2025, 8:42:07</code></li>
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
              <label className="text-sm font-semibold">Filtrar por Nivel</label>
              <select
                value={selectedLevel}
                onChange={handleLevelChange}
                className="border border-gray-300 rounded px-3 py-2 text-sm"
              >
                <option value="">Todos (warn/error)</option>
                <option value="warn">Warn</option>
                <option value="error">Error</option>
              </select>
            </div>

            {/* Botones */}
            <div className="flex flex-wrap gap-2 items-end">
              <button onClick={handleSearch} className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 text-sm">Buscar</button>
              <button onClick={handleClearFilters} className="bg-yellow-400 text-black px-4 py-2 rounded hover:bg-yellow-500 text-sm">Limpiar</button>
              <button onClick={fetchInitialLogs} className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 text-sm">Actualizar</button>
            </div>
          </section>

          {/* Lista */}
          <RecordList logs={logs} loading={loading} />
        </div>
      </div>
    </div>
  );
};

export default Record;
