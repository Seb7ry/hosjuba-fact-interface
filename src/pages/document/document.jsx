import React, { useState, useEffect } from "react";
import { getSignedAdmissionsFiltrer, getSignedAdmissionsAll } from "../../services/admissionService";
import DocumentList from "../../components/documentList/documentList";
import Navbar from "../../components/navbar/navbar";

const Document = () => {
  const [documentNumber, setDocumentNumber] = useState("");
  const [admissionNumber, setAdmissionNumber] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [user, setUser] = useState("");
  const [admissionType, setAdmissionType] = useState("");
  const [admissions, setAdmissions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showDateErrorModal, setShowDateErrorModal] = useState(false);

  useEffect(() => {
    fetchAdmissions();
  }, []);

  const fetchAdmissions = async () => {
    setLoading(true);
    const data = await getSignedAdmissionsAll();
    setAdmissions(data);
    setLoading(false);
  };

  const handleClearFilters = () => {
    setDocumentNumber("");
    setAdmissionNumber("");
    setStartDate("");
    setEndDate("");
    setUser("");
    setAdmissionType("");
    fetchAdmissions();
  };

  const handleStartDateChange = (e) => {
    const selectedDate = e.target.value;
    setStartDate(selectedDate);
    if (!selectedDate) setEndDate("");
  };

  const handleEndDateChange = (e) => {
    const selectedEndDate = e.target.value;
    setEndDate(selectedEndDate);
  };

  const handleSearch = async () => {
    if (startDate && endDate && startDate > endDate) {
      setShowDateErrorModal(true);
      return;
    }

    setLoading(true);
    const filters = {
      documentPatient: documentNumber || undefined,
      consecutiveAdmission: admissionNumber || undefined,
      startDateAdmission: startDate || undefined,
      endDateAdmission: endDate || undefined,
      userAdmission: user || undefined,
      typeAdmission: admissionType || undefined,
    };

    const data = await getSignedAdmissionsFiltrer(filters);
    setAdmissions(data);
    setLoading(false);
  };

  return (
    <div className="flex bg-gray-100 min-h-screen">
      <Navbar />
      <div className="flex-1 px-5 py-6 pt-14 md:pt-6 md:ml-[250px] transition-all duration-300">
        <div className="max-w-[1200px] mx-auto flex flex-col gap-6">
          <section className="bg-white rounded-lg shadow-md p-6">
            <h1 className="text-4xl font-bold text-black mb-4">Comprobantes</h1>
            <hr className="mb-4" />
            <p className="text-gray-700 mb-4">
              En esta sección puedes visualizar y descargar los comprobantes de atención registrados en el sistema.
            </p>
            <ul className="list-disc pl-5 text-gray-800 space-y-2 text-sm">
              <li><strong>Número de Admisión:</strong> <code>Ejemplo: 59</code></li>
              <li><strong>Número de Documento:</strong> <code>Ejemplo: 1001234567</code></li>
              <li><strong>Nombre Paciente:</strong> <code>Ejemplo: Juan Pérez</code></li>
              <li><strong>Fecha de Inicio:</strong> <code>Ejemplo: 2025-03-10</code></li>
              <li><strong>Tipo de Admisión:</strong> <code>Ejemplo: Consulta Externa</code></li>
              <li><strong>Usuario:</strong> <code>Ejemplo: JMURILLO</code></li>
            </ul>
          </section>

          <section className="bg-white rounded-lg shadow-md p-6 flex flex-wrap gap-4 justify-center">
            <div className="flex flex-col gap-1">
              <label className="text-sm font-semibold">Número de Documento</label>
              <input
                type="text"
                placeholder="Ingresar número de documento"
                value={documentNumber}
                onChange={(e) => setDocumentNumber(e.target.value.replace(/\D/g, ""))}
                className="border border-gray-300 rounded px-3 py-2 text-sm"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-sm font-semibold">Número de Admisión</label>
              <input
                type="text"
                placeholder="Ingresar número de admisión"
                value={admissionNumber}
                onChange={(e) => setAdmissionNumber(e.target.value.replace(/\D/g, ""))}
                className="border border-gray-300 rounded px-3 py-2 text-sm"
              />
            </div>
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
              <label className="text-sm font-semibold">Fecha de Final</label>
              <input
                type="date"
                value={endDate}
                onChange={handleEndDateChange}
                disabled={!startDate}
                className="border border-gray-300 rounded px-3 py-2 text-sm"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-sm font-semibold">Usuario</label>
              <input
                type="text"
                placeholder="Ingresar el usuario que admisionó"
                value={user}
                onChange={(e) => setUser(e.target.value.toUpperCase())}
                className="border border-gray-300 rounded px-3 py-2 text-sm"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-sm font-semibold">Tipo de Admisión</label>
              <select
                value={admissionType}
                onChange={(e) => setAdmissionType(e.target.value)}
                className="border border-gray-300 rounded px-3 py-2 text-sm"
              >
                <option value="">Seleccione el tipo</option>
                <option value="9">Triage</option>
                <option value="1">Urgencias</option>
                <option value="99">Consulta Externa</option>
                <option value="hospitalizacion">Hospitalización</option>
              </select>
            </div>

            <div className="flex flex-wrap gap-2 items-end">
              <button onClick={handleSearch} className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 text-sm">Buscar</button>
              <button onClick={handleClearFilters} className="bg-yellow-400 text-black px-4 py-2 rounded hover:bg-yellow-500 text-sm">Limpiar</button>
              <button onClick={fetchAdmissions} className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 text-sm">Actualizar</button>
            </div>
          </section>

          <section className="bg-white rounded-lg shadow-md p-4">
            <div className="bg-yellow-100 text-yellow-900 p-4 text-sm text-center font-medium rounded-md shadow-sm border border-yellow-300">
              📄 Para consultar un comprobante, oprime el botón al final de la fila correspondiente a la columna <strong>"Comprobante"</strong>.
              Dentro del recuadro podrás visualizar e imprimir el documento. 📄
            </div>
          </section>

          <DocumentList admissions={admissions} loading={loading} onRefresh={fetchAdmissions} />
        </div>
      </div>

      {showDateErrorModal && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded shadow-lg text-center">
            <p className="mb-4 font-medium">⚠️ La fecha de inicio no puede ser mayor que la fecha final.</p>
            <button onClick={() => setShowDateErrorModal(false)} className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">Cerrar</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Document;
