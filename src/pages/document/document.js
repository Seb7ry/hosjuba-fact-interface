import React, { useState, useEffect } from "react";
import "./document.css";

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
    <div className="document-layout">
      <Navbar />
      <div className="document-container">
        <div className="document-content">
          <section className="document-description">
            <div className="document-text">
              <h1>Comprobantes</h1>
              <hr />
              <p>
              En esta sección puedes visualizar y descargar los comprobantes de atención registrados en el sistema. 
              Estos documentos contienen información esencial que puedes consultar en cualquier momento. Los campos mostrados
              en la lista son los siguientes:
              </p>
              <ul className="document__list">
                <li><strong>Número de Admisión:</strong> Consecutivo asignado a la admisión del paciente relacionada con el comprobante.<code>Ejemplo: 59</code></li>
                <li><strong>Número de Documento:</strong> Documento de identidad del paciente al que pertenece el comprobante.<code>Ejemplo: 1001234567</code></li>
                <li><strong>Nombre Paciente:</strong> Nombre completo del paciente relacionado con el comprobante de atención.<code> Ejemplo: Consulta Externa</code></li>
                <li><strong>Fecha de Inicio:</strong> Fecha en la que se realizó la admisión correspondiente al comprobante.<code>Ejemplo: 2025-03-10</code></li>
                <li><strong>Tipo de Admisión:</strong> Clasificación del servicio al que ingresó el paciente.<code>Ejemplo: Consulta Externa</code></li>
                <li><strong>Usuario:</strong> Usuario que registró la admisión del paciente.<code>Ejemplo: JMURILLO</code></li>
              </ul>
            </div>
          </section>

          <section className="document-filters">
            <div>
              <label>Número de Documento</label>
              <input 
                type="text" 
                placeholder="Ingresar número de documento" 
                value={documentNumber} 
                onChange={(e) => {
                  const document = e.target.value.replace(/\D/g, "");
                  setDocumentNumber(document);
                  }} />
            </div>

            <div>
              <label>Número de Admisión</label>
              <input 
                type="text" 
                placeholder="Ingresar número de admisión" 
                value={admissionNumber} 
                onChange={(e) => {
                  const consecutive = e.target.value.replace(/\D/g, "");
                  setAdmissionNumber(consecutive)
                  }} />
            </div>

            <div>
              <label>Fecha de Inicio</label>
              <input type="date" value={startDate} onChange={handleStartDateChange} />
            </div>

            <div>
              <label>Fecha de Final</label>
              <input 
                type="date" 
                value={endDate} 
                onChange={handleEndDateChange} 
                disabled={!startDate} />
            </div>

            <div>
              <label>Usuario</label>
              <input 
                type="text" 
                placeholder="Ingresar el usuario que admisionó" 
                value={user} 
                onChange={(e) => setUser(e.target.value.toUpperCase()
                )} />
            </div>

            <div>
              <label>Tipo de Admisión</label>
              <select value={admissionType} onChange={(e) => setAdmissionType(e.target.value)}>
                <option value="">Seleccione el tipo</option>
                <option value="9">Triage</option>
                <option value="1">Urgencias</option>
                <option value="99">Consulta Externa</option>
                <option value="hospitalizacion">Hospitalización</option>
              </select>
            </div>

            <div className="document-buttons">
              <button className="search-btn" onClick={handleSearch}>Buscar</button>
              <button className="clear-btn" onClick={handleClearFilters}>Limpiar</button>
            </div>

            <div className="document-buttons">
              <button className="updatedocument-btn" onClick={fetchAdmissions}> Actualizar Comprobantes </button>
            </div>

          </section>

          <section className="document-message">
            <div className="info-message">
              📄 Para consultar un comprobante <strong>oprimir el botón al final de la fila </strong>
              correspondiente a la columna "Comprobante". Dentro del recuadro que salga podrás visualizar 
              e imprimir el documento. 📄
            </div>
          </section>

          <DocumentList admissions={admissions} loading={loading} onRefresh={fetchAdmissions} />
        
        </div>
      </div>
      {showDateErrorModal && (
          <div className="modal-overlay">
              <div className="modal">
                  <p>⚠️ La fecha de inicio no puede ser mayor que la fecha final. Por favor corrígela.</p>
                  <button onClick={() => setShowDateErrorModal(false)}>Cerrar</button>
              </div>
          </div>
      )}
    </div>
  );
};

export default Document;
