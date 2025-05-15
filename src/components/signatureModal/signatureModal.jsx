import React, { useState, useRef, useEffect } from "react";
import SignatureCanvas from "react-signature-canvas";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faRedo, faTimes } from "@fortawesome/free-solid-svg-icons";

import { saveAdmission } from "../../services/admissionService";
import ConfirmationModal from "../confirmationModal/confirmationModal";

const SignatureModal = ({ isOpen, onClose, admission }) => {
  const [isSigned, setIsSigned] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [signatureData, setSignatureData] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [signer, setSigner] = useState("");
  const signatureRef = useRef(null);

  const handleEnd = () => {
    if (signatureRef.current && !signatureRef.current.isEmpty()) {
      const dataURL = signatureRef.current.toDataURL().split(",")[1];
      setSignatureData(dataURL);
      setIsSigned(true);
    }
  };

  const handleClear = () => {
    if (signatureRef.current) {
      signatureRef.current.clear();
      setIsSigned(false);
      setSignatureData(null);
    }
  };

  const handleFinalConfirm = async () => {
    setShowConfirmModal(false);
    setIsUploading(true);
    try {
      await saveAdmission(
        admission.documentPatient,
        admission.consecutiveAdmission,
        signatureData,
        signer
      );
      setIsSuccess(true);
      setTimeout(() => onClose(), 2000);
    } catch (error) {
      console.error("❌ Error al guardar la admisión:", error);
      alert("Hubo un error al registrar la firma. Inténtalo de nuevo.");
    } finally {
      setIsUploading(false);
    }
  };

  const MapAdmissionType = (type) => {
    if (type === 1) return "Urgencias";
    if (type === 9) return "Triage";
    if (type === 99) return "Consulta Externa";
    return "Hospitalización";
  };

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "auto";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      if (signatureRef.current) {
        signatureRef.current.clear();
      }
      setIsSigned(false);
      setSignatureData(null);
      setIsSuccess(false);
      setSigner("");
      setIsUploading(false);
      setShowConfirmModal(false);
    }
  }, [isOpen, admission]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/30 flex items-center justify-center px-4">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-5">
        <h2 className="text-xl font-bold text-center mb-4">Firma Digital</h2>

        <div className="space-y-1 text-sm text-gray-700 mb-4">
          <p><strong>Paciente:</strong> {admission.fullNamePatient}</p>
          <p><strong>Documento:</strong> {admission.documentPatient}</p>
          <p><strong>Fecha:</strong> {new Date(admission.dateAdmission).toLocaleDateString()}</p>
          <p><strong>Servicio Ingreso:</strong> {MapAdmissionType(admission.typeAdmission)}</p>
        </div>

        {isSuccess ? (
          <div className="text-center bg-green-100 p-4 rounded-md">
            <div className="text-green-600 text-3xl mb-2">
              <FontAwesomeIcon icon={faCheck} />
            </div>
            <h3 className="font-semibold mb-3">Firma registrada correctamente</h3>
            <button
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 w-full"
              onClick={() => onClose(null)}
            >
              <FontAwesomeIcon icon={faTimes} /> Cerrar
            </button>
          </div>
        ) : (
          <>
            <div className="mb-4">
              <label htmlFor="signer" className="block mb-1 text-sm font-semibold">¿Quién firma?</label>
              <select
                id="signer"
                value={signer}
                onChange={(e) => setSigner(e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
              >
                <option value="">Seleccione...</option>
                <option value="patient">Paciente</option>
                <option value="companion">Acompañante</option>
              </select>
            </div>

            <div className="border-2 border-gray-300 bg-gray-50 rounded-md h-48 mb-4">
              <SignatureCanvas
                ref={signatureRef}
                penColor="black"
                canvasProps={{ className: "w-full h-full bg-white" }}
                onEnd={handleEnd}
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => setShowConfirmModal(true)}
                disabled={!isSigned || isUploading || !signer}
                className="flex-1 bg-green-600 text-white px-4 py-2 rounded disabled:opacity-50 hover:bg-green-700"
              >
                {isUploading ? "Enviando..." : (<><FontAwesomeIcon icon={faCheck} /> Confirmar</>)}
              </button>
              <button
                onClick={handleClear}
                disabled={isUploading}
                className="flex-1 bg-yellow-400 text-white px-4 py-2 rounded hover:bg-yellow-500"
              >
                <FontAwesomeIcon icon={faRedo} /> Repetir
              </button>
              <button
                onClick={() => onClose(null)}
                disabled={isUploading}
                className="flex-1 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
              >
                <FontAwesomeIcon icon={faTimes} /> Salir
              </button>
            </div>
          </>
        )}
      </div>

      <ConfirmationModal
        isOpen={showConfirmModal}
        onConfirm={handleFinalConfirm}
        onCancel={() => setShowConfirmModal(false)}
        admission={admission}
      />
    </div>
  );
};

export default SignatureModal;
