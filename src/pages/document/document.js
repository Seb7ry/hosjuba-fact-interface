import React, { useState, useEffect } from "react";
import Navbar from "../../components/navbar/navbar";
import "./document.css";
import documentImg from "../../assets/ux/document.png";
import { getSignedAdmissionsFiltrer, getSignedAdmissionsAll } from "../../services/admissionService";
import DocumentList from "../../components/documentList/documentList";

const Document = () => {
  const [documentNumber, setDocumentNumber] = useState("");
  const [admissionNumber, setAdmissionNumber] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [isEndDateDisabled, setIsEndDateDisabled] = useState(true);
  const [user, setUser] = useState("");
  const [admissionType, setAdmissionType] = useState("");
  const [admissions, setAdmissions] = useState([]);
  const [loading, setLoading] = useState(false);

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
    setIsEndDateDisabled(!selectedDate);
    if (!selectedDate) setEndDate("");
  };

  const handleEndDateChange = (e) => {
    const selectedEndDate = e.target.value;
    if (selectedEndDate < startDate) {
      alert("⚠️ La fecha de final no puede ser menor a la fecha de inicio.");
      return;
    }
    setEndDate(selectedEndDate);
  };

  const handleSearch = async () => {
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
                En este apartado puedes visualizar y gestionar los comprobantes del sistema.
                Aquí se almacena información clave que puedes revisar cuando sea necesario.
              </p>
              <ul>
                <li><strong>Número de Documento:</strong> Ej: <code>1001234567</code></li>
                <li><strong>Número de Admisión:</strong> Ej: <code>59</code></li>
                <li><strong>Fecha de Inicio:</strong> Ej: <code>2025-03-10</code></li>
                <li><strong>Fecha de Final:</strong> Ej: <code>2025-03-15</code></li>
                <li><strong>Usuario:</strong> Ej: <code>JMURILLO</code></li>
                <li><strong>Tipo de Admisión:</strong> Ej: <code>Consulta Externa</code></li>
              </ul>
            </div>
            <div className="document-image">
              <img src={documentImg} alt="Descripción de documentos" />
            </div>
          </section>

          <section className="document-filters">
            <div>
              <label>Número de Documento</label>
              <input type="text" placeholder="Ingresar número de documento" value={documentNumber} onChange={(e) => setDocumentNumber(e.target.value)} />
            </div>

            <div>
              <label>Número de Admisión</label>
              <input type="text" placeholder="Ingresar número de admisión" value={admissionNumber} onChange={(e) => setAdmissionNumber(e.target.value)} />
            </div>

            <div>
              <label>Fecha de Inicio</label>
              <input type="date" value={startDate} onChange={handleStartDateChange} />
            </div>

            <div>
              <label>Fecha de Final</label>
              <input type="date" value={endDate} onChange={handleEndDateChange} disabled={isEndDateDisabled} />
            </div>

            <div>
              <label>Usuario</label>
              <input type="text" placeholder="Ingresar el usuario que admisionó" value={user} onChange={(e) => setUser(e.target.value)} />
            </div>

            <div>
              <label>Tipo de Admisión</label>
              <select value={admissionType} onChange={(e) => setAdmissionType(e.target.value)}>
                <option value="">Seleccione el tipo</option>
                <option value="1">Urgencias</option>
                <option value="99">Consulta Externa</option>
                <option value="hospitalizacion">Hospitalización</option>
              </select>
            </div>

            <div className="document-buttons">
              <button className="search-btn" onClick={handleSearch}>Buscar</button>
              <button className="clear-btn" onClick={handleClearFilters}>Limpiar</button>
            </div>
          </section>

          <section className="document-message">
            <div className="info-message">
              📄 Para consultar un comprobante <strong>oprimir el botón al final de la fila </strong>
              correspondiente a la columna "Comprobante". Dentro del recuadro que salga podrás visualizar 
              e imprimir el documento. 📄
            </div>
          </section>

          <DocumentList admissions={admissions} loading={loading} />
        
        </div>
      </div>
    </div>
  );
};

export default Document;
