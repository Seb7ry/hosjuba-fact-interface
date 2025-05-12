import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFileAlt } from "@fortawesome/free-solid-svg-icons";
import DocumentModal from "../documentModal/documentModal";

const DocumentList = ({ admissions, loading, onRefresh }) => {
  const itemsPerPage = 10;
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAdmission, setSelectedAdmission] = useState(null);

  const totalPages = Math.ceil(admissions.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentAdmissions = admissions.slice(startIndex, endIndex);

  const MapAdmissionType = (type) => {
    if (type === "1") return "Urgencias";
    if (type === "9") return "Triage";
    if (type === "99") return "Consulta Externa";
    return "Hospitalización";
  };

  useEffect(() => {
    if (currentPage > Math.ceil(admissions.length / itemsPerPage)) {
      setCurrentPage(1);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [admissions]);

  const openModal = (admission) => {
    setSelectedAdmission(admission);
    setIsModalOpen(true);
  };

  if (loading) {
    return (
      <div className="document-list-loading">
        <div className="document-spinner"></div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-[1200px] bg-white rounded-lg shadow-md p-4 mx-auto">
      <h1 className="text-xl font-bold text-black mb-4 text-center">Resultados de Comprobantes</h1>

      {admissions.length === 0 ? (
        <p className="text-gray-700 text-center font-semibold">
          No se encontraron admisiones.
        </p>
      ) : (
        <>
          {/* Tabla escritorio */}
          <div className="hidden md:block overflow-x-auto">
            <table className="min-w-[700px] w-full border-collapse text-sm text-center">
              <thead>
                <tr className="bg-emerald-700 text-white font-bold">
                  <th className="px-4 py-2">No. Admisión</th>
                  <th className="px-4 py-2">Documento</th>
                  <th className="px-4 py-2">Nombre Paciente</th>
                  <th className="px-4 py-2">Fecha</th>
                  <th className="px-4 py-2">Ingreso</th>
                  <th className="px-4 py-2">Usuario</th>
                  <th className="px-4 py-2">Comprobante</th>
                </tr>
              </thead>
              <tbody>
                {currentAdmissions.map((admission, index) => (
                  <tr key={index} className="border-b bg-white">
                    <td className="px-3 py-2">{admission.consecutiveAdmission}</td>
                    <td className="px-3 py-2">{admission.documentPatient}</td>
                    <td className="px-3 py-2">{admission.fullNamePatient}</td>
                    <td className="px-3 py-2">{new Date(admission.dateAdmission).toLocaleDateString()}</td>
                    <td className="px-3 py-2">{MapAdmissionType(admission.typeAdmission)}</td>
                    <td className="px-3 py-2">{admission.userAdmission}</td>
                    <td className="px-3 py-2">
                      <button
                        className="bg-indigo-600 text-white px-3 py-2 rounded hover:bg-indigo-700 text-sm"
                        onClick={() => openModal(admission)}
                      >
                        <FontAwesomeIcon icon={faFileAlt} /> Ver
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Tarjetas móviles */}
          <div className="md:hidden flex flex-col gap-4">
            {currentAdmissions.map((admission, index) => (
              <div key={index} className="rounded-md p-3 shadow-sm border border-gray-200 bg-white text-left">
                <p><strong>No. Admisión:</strong> {admission.consecutiveAdmission}</p>
                <p><strong>Documento:</strong> {admission.documentPatient}</p>
                <p><strong>Nombre:</strong> {admission.fullNamePatient}</p>
                <p><strong>Fecha:</strong> {new Date(admission.dateAdmission).toLocaleDateString()}</p>
                <p><strong>Ingreso:</strong> {MapAdmissionType(admission.typeAdmission)}</p>
                <p><strong>Usuario:</strong> {admission.userAdmission}</p>
                <button
                  className="bg-indigo-600 text-white w-full mt-2 px-3 py-2 rounded hover:bg-indigo-700 text-sm"
                  onClick={() => openModal(admission)}
                >
                  <FontAwesomeIcon icon={faFileAlt} /> Ver Comprobante
                </button>
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
                ⬅️ Anterior
              </button>
              <span className="font-medium">
                Página {currentPage} de {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-4 py-2 border border-gray-300 rounded-md bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Siguiente ➡️
              </button>
            </div>
          )}
        </>
      )}

      <DocumentModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          onRefresh();
        }}
        admission={selectedAdmission}
      />
    </div>
  );
};

export default DocumentList;
