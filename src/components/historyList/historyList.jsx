import React, { useState, useEffect } from "react";

const HistoryList = ({ history = [], loading, onFilterApplied, title = "Historial de Eventos" }) => {
  const itemsPerPage = 10;
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    setCurrentPage(1);
    if (onFilterApplied) onFilterApplied();
  }, [history, onFilterApplied]);

  const totalPages = Math.ceil(history.length / itemsPerPage);
  const paginatedHistory = history.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  if (loading) {
    return (
      <div className="flex justify-center items-center mt-6">
        <div className="animate-spin rounded-full h-10 w-10 border-4 border-t-emerald-600 border-gray-200" />
      </div>
    );
  }

  return (
    <div className="w-full max-w-[1200px] bg-white rounded-lg shadow-md p-4 mx-auto">
      <h1 className="text-xl font-bold text-black mb-4 text-center">{title}</h1>

      {history.length === 0 ? (
        <p className="text-gray-700 text-center font-semibold">No hay eventos de historial disponibles.</p>
      ) : (
        <>
          {/* Tabla en escritorio */}
          <div className="hidden md:block overflow-x-auto">
            <table className="min-w-[700px] w-full border-collapse text-sm text-center">
              <thead>
                <tr className="bg-emerald-700 text-white font-bold">
                  <th className="px-4 py-2">Usuario</th>
                  <th className="px-4 py-2">Mensaje</th>
                  <th className="px-4 py-2">Contexto</th>
                  <th className="px-4 py-2">Fecha</th>
                </tr>
              </thead>
              <tbody>
                {paginatedHistory.map((event, index) => (
                  <tr key={index} className="border-b bg-white">
                    <td className="px-3 py-2">{event.user || "N/A"}</td>
                    <td className="px-3 py-2 break-words">{event.message}</td>
                    <td className="px-3 py-2">{event.context || "N/A"}</td>
                    <td className="px-3 py-2">{new Date(event.timestamp).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Tarjetas en móviles */}
          <div className="md:hidden flex flex-col gap-4">
            {paginatedHistory.map((event, index) => (
              <div key={index} className="rounded-md p-3 shadow-sm border border-gray-200 bg-white text-left">
                <p><span className="font-bold">Usuario:</span> {event.user || "N/A"}</p>
                <p><span className="font-bold">Mensaje:</span> {event.message}</p>
                <p><span className="font-bold">Contexto:</span> {event.context || "N/A"}</p>
                <p><span className="font-bold">Fecha:</span> {new Date(event.timestamp).toLocaleString()}</p>
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

export default HistoryList;
