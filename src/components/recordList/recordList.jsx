import React, { useState, useEffect } from "react";

const RecordList = ({ logs = [], loading, onFilterApplied, title = "Historial de Registros" }) => {
  const itemsPerPage = 10;
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    setCurrentPage(1);
    if (onFilterApplied) onFilterApplied();
  }, [logs, onFilterApplied]);

  const totalPages = Math.ceil(logs.length / itemsPerPage);
  const currentLogs = logs.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const mapLogLevel = (level) => {
    const levels = {
      warn: "⚠️ Advertencia",
      error: "⛔ Error",
    };
    return levels[level] || "ℹ️ Info";
  };

  const getRowClass = (level) => {
    if (level === "error") return "bg-red-100";
    if (level === "warn") return "bg-yellow-100";
    return "bg-white";
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center mt-5">
        <div className="animate-spin rounded-full h-10 w-10 border-4 border-t-blue-600 border-gray-200" />
      </div>
    );
  }

  return (
    <div className="w-full max-w-[1200px] bg-white rounded-lg shadow-md p-4 mx-auto">
      <h1 className="text-xl font-bold text-black mb-4 text-center">{title}</h1>

      {logs.length === 0 ? (
        <p className="text-black text-lg font-semibold text-center">No hay registros disponibles.</p>
      ) : (
        <>
          {/* Tabla para pantallas grandes */}
          <div className="hidden md:block overflow-x-auto">
            <table className="min-w-[700px] w-full border-collapse text-sm text-center">
              <thead>
                <tr className="bg-emerald-700 text-white font-bold">
                  <th className="px-4 py-2">Nivel</th>
                  <th className="px-4 py-2">Mensaje</th>
                  <th className="px-4 py-2">Contexto</th>
                  <th className="px-4 py-2">Fecha</th>
                </tr>
              </thead>
              <tbody>
                {currentLogs.map((log, index) => (
                  <tr key={index} className={`border-b ${getRowClass(log.level)}`}>
                    <td className="px-3 py-2">{mapLogLevel(log.level)}</td>
                    <td className="px-3 py-2 break-words">{log.message}</td>
                    <td className="px-3 py-2">{log.context || "N/A"}</td>
                    <td className="px-3 py-2">{new Date(log.timestamp).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Tarjetas para pantallas pequeñas */}
          <div className="md:hidden flex flex-col gap-4">
            {currentLogs.map((log, index) => (
              <div
                key={index}
                className={`rounded-md p-3 shadow-sm border ${getRowClass(log.level)} text-left`}
              >
                <p><span className="font-bold">Nivel:</span> {mapLogLevel(log.level)}</p>
                <p><span className="font-bold">Mensaje:</span> {log.message}</p>
                <p><span className="font-bold">Contexto:</span> {log.context || "N/A"}</p>
                <p><span className="font-bold">Fecha:</span> {new Date(log.timestamp).toLocaleString()}</p>
              </div>
            ))}
          </div>

          {/* Paginación */}
          {totalPages > 1 && (
            <div className="flex justify-center flex-wrap items-center gap-3 mt-6 text-sm">
              <button
                onClick={() => setCurrentPage(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-4 py-2 border border-gray-300 rounded-md bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                ⬅️ 
              </button>
              <span className="font-medium">
                Página {currentPage} de {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-4 py-2 border border-gray-300 rounded-md bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                 ➡️
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default RecordList;
