import React, { useEffect, useState, useRef } from "react";
import { getAllFact, downloadPdf } from "../../services/documentService";

const DocumentModal = ({ isOpen, onClose, admission }) => {
  const [facturas, setFacturas] = useState([]);
  const [selectedFactura, setSelectedFactura] = useState(null);
  const [pdfUrl, setPdfUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [iframeKey, setIframeKey] = useState(0);
  const [isMobileView, setIsMobileView] = useState(false);
  const scrollPosition = useRef(0);

  const MapAdmissionType = (type) => {
    if (type === "1") return "Urgencias";
    if (type === "9") return "Triage";
    if (type === "99") return "Consulta Externa";
    return "Hospitalización";
  };

  const mapCompanionType = (type) => {
    if (type === "H") return "Hijo(a)";
    if (type === "F") return "Familiar";
    if (type === "C") return "Cónyuge";
    if (type === "A") return "Amigo(a)";
    if (type === "O") return "Otro";
    return "N/A";
  };

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobileView(window.innerWidth < 768); // 768px es el breakpoint común para md en Tailwind
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);

    return () => {
      window.removeEventListener("resize", checkScreenSize);
    };
  }, []);

  useEffect(() => {
    if (isOpen) {
      scrollPosition.current = window.scrollY;
      document.body.classList.add("overflow-hidden");

      const handleKeyDown = (e) => {
        if (e.key === "Escape") {
          e.preventDefault();
          e.stopPropagation();
        }
      };

      window.addEventListener("keydown", handleKeyDown, { capture: true });

      return () => {
        document.body.classList.remove("overflow-hidden");
        window.removeEventListener("keydown", handleKeyDown, { capture: true });
        window.scrollTo(0, scrollPosition.current);
      };
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen && admission) {
      getAllFact(admission.documentPatient, admission.consecutiveAdmission)
        .then((response) => {
          setFacturas(response);
          if (response.length > 0) {
            setSelectedFactura(response[0]);
            loadPdf(response[0].MPNFac);
          } else {
            setSelectedFactura(null);
            loadPdf();
          }
        })
        .catch((error) => console.error("Error al obtener facturas:", error));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, admission]);

  const loadPdf = async (numberFac = null) => {
    try {
      setLoading(true);
      setPdfUrl(null);
      setIframeKey((prev) => prev + 1);

      await new Promise((resolve) => setTimeout(resolve, 100));
      const pdfBlob = await downloadPdf(
        admission.documentPatient,
        admission.consecutiveAdmission,
        numberFac
      );
      await new Promise((resolve) => setTimeout(resolve, 1000));

      if (pdfBlob instanceof Blob) {
        const url = window.URL.createObjectURL(pdfBlob);
        setPdfUrl(url);
      } else {
        console.error("No se recibió un blob válido del servidor.");
      }
    } catch (error) {
      console.error("Error al cargar el PDF:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleFacturaClick = (factura) => {
    setSelectedFactura(factura);
    loadPdf(factura.MPNFac);
  };

  const handleOpenPdfInNewTab = () => {
    if (pdfUrl) {
      window.open(pdfUrl, "_blank");
    }
  };

  if (!isOpen || !admission) return null;

  return (
    <div className="fixed inset-0 bg-black/70 z-50 flex justify-center items-start overflow-y-auto p-4">
      <div className="bg-white rounded-lg w-full max-w-[1000px] min-h-[90vh] p-4 relative overflow-hidden flex flex-col">
        <button onClick={onClose} className="absolute top-3 right-3 text-xl text-gray-600 hover:text-black">
          ✖
        </button>

        <div className="border-b pb-3">
          <h2 className="text-lg font-bold text-center">Información de la Admisión</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-3 text-sm">
            <div><strong>Nombre Paciente:</strong> {admission.fullNamePatient}</div>
            <div><strong>Documento Paciente:</strong> {admission.documentPatient}</div>
            <div><strong>Nombre Acompañante:</strong> {admission.nameCompanion}</div>
            <div><strong>Documento Acompañante:</strong> {admission.documentCompanion}</div>
            <div><strong>Fecha:</strong> {new Date(admission.dateAdmission).toLocaleDateString()}</div>
            <div><strong>Teléfono Acompañante:</strong> {admission.phoneCompanion}</div>
            <div><strong>Servicio de Ingreso:</strong> {MapAdmissionType(admission.typeAdmission)}</div>
            <div><strong>Parentesco Acompañante:</strong> {mapCompanionType(admission.relationCompanion)}</div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-3 mt-4 flex-1">
          {facturas.length > 0 && (
            <div className="bg-gray-100 p-2 rounded-md overflow-y-auto md:w-[180px] md:flex-shrink-0">
              <h3 className="text-sm font-bold text-center mb-2">Facturas</h3>
              <ul className="flex md:flex-col gap-2 overflow-x-auto md:overflow-x-hidden">
                {facturas.map((factura, index) => (
                  <li
                    key={index}
                    onClick={() => handleFacturaClick(factura)}
                    className={`text-sm px-3 py-1 rounded border cursor-pointer text-center whitespace-nowrap ${
                      selectedFactura?.MPNFac === factura.MPNFac
                        ? "bg-blue-600 text-white border-blue-600"
                        : "bg-white text-gray-700 border-gray-300 hover:bg-gray-200"
                    }`}
                  >
                    {factura.FacDscPrf} {factura.MPNFac}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="flex-1 border rounded-md bg-gray-50 relative min-h-[300px]">
            {loading || !pdfUrl ? (
              <div className="flex justify-center items-center h-full">
                <div className="animate-spin border-4 border-gray-200 border-t-blue-600 rounded-full w-10 h-10" />
              </div>
            ) : isMobileView ? (
              <div className="flex flex-col items-center justify-center h-full p-4">
                <p className="text-center mb-4">El documento PDF está disponible para visualización en pantallas más grandes.</p>
                <button
                  onClick={handleOpenPdfInNewTab}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded"
                >
                  Abrir PDF en nueva pestaña
                </button>
              </div>
            ) : (
              <iframe
                key={iframeKey}
                src={pdfUrl}
                title="Factura"
                className="w-full h-full min-h-[300px] border-none"
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentModal;