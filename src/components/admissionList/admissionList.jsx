import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSignature, faCheckCircle, faRedo, faTimesCircle } from "@fortawesome/free-solid-svg-icons";
import { getSignedAdmissions, updateAdmission } from "../../services/admissionService";
import SignatureModal from "../signatureModal/signatureModal";

const AdmissionList = ({ admissions, loading }) => {
  const itemsPerPage = 10;
  const [currentPage, setCurrentPage] = useState(1);
  const [signedAdmissions, setSignedAdmissions] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAdmission, setSelectedAdmission] = useState(null);
  const [isFetching, setIsFetching] = useState(false);
  const [isCheckingSignatures, setIsCheckingSignatures] = useState({});
  const [isUpdating, setIsUpdating] = useState({});
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successAdmission, setSuccessAdmission] = useState(null);

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
    const fetchSignedAdmissions = async () => {
      const startIndex = (currentPage - 1) * itemsPerPage;
      const endIndex = startIndex + itemsPerPage;
      const currentPageAdmissions = admissions.slice(startIndex, endIndex);

      if (isFetching || currentPageAdmissions.length === 0) return;

      setIsFetching(true);
      setIsCheckingSignatures(() =>
        Object.fromEntries(currentPageAdmissions.map((adm) => [adm.consecutiveAdmission, true]))
      );

      try {
        const response = await getSignedAdmissions(currentPageAdmissions);
        setSignedAdmissions(response || []);
      } catch (error) {
        console.error("Error al obtener admisiones firmadas:", error);
      } finally {
        setIsFetching(false);
        setIsCheckingSignatures({});
      }
    };
    fetchSignedAdmissions();
    // eslint-disable-next-line
  }, [admissions, currentPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [admissions]);

  const openModal = (admission) => {
    setSelectedAdmission(admission);
    setIsModalOpen(true);
  };

  const handleModalClose = async () => {
    setIsModalOpen(false);
    setSelectedAdmission(null);

    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentPageAdmissions = admissions.slice(startIndex, endIndex);

    if (currentPageAdmissions.length === 0) return;

    setIsFetching(true);
    setIsCheckingSignatures(() =>
      Object.fromEntries(currentPageAdmissions.map((adm) => [adm.consecutiveAdmission, true]))
    );

    try {
      const response = await getSignedAdmissions(currentPageAdmissions);
      setSignedAdmissions(response || []);
    } catch (error) {
      console.error("Error al obtener admisiones firmadas:", error);
    } finally {
      setIsFetching(false);
      setIsCheckingSignatures({});
    }
  };


  const handleUpdateAdmission = async (admission) => {
    setIsUpdating((prev) => ({
      ...prev,
      [admission.consecutiveAdmission]: true
    }));
    try {
      await updateAdmission(admission.documentPatient, admission.consecutiveAdmission);
      setSuccessAdmission(admission);
      setShowSuccessModal(true);
    } catch (error) {
      console.error("Error al actualizar la admisión:", error);
    } finally {
      setIsUpdating((prev) => ({
        ...prev,
        [admission.consecutiveAdmission]: false
      }));
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center mt-5">
        <div className="w-12 h-12 border-4 border-gray-200 border-t-emerald-700 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-[1200px] bg-white rounded-lg shadow-md p-4 mx-auto">
      <h1 className="text-xl font-bold text-black mb-4 text-center">Resultados de Admisión</h1>

      {admissions.length === 0 ? (
        <p className="text-gray-700 text-center font-semibold">
          No se encontraron admisiones.
        </p>
      ) : (
        <>
          {/* Desktop Table */}
          <div className="hidden md:block overflow-x-auto">
            <table className="min-w-[900px] w-full border-collapse text-sm text-center">
              <thead>
                <tr className="bg-emerald-700 text-white font-bold">
                  <th className="px-4 py-2 w-[5%]">No. Admisión</th>
                  <th className="px-4 py-2 w-[10%]">Documento</th>
                  <th className="px-4 py-2 w-[40%]">Nombre Paciente</th>
                  <th className="px-4 py-2 w-[5%]">Fecha</th>
                  <th className="px-4 py-2 w-[20%]">Servicio</th>
                  <th className="px-4 py-2 w-[10%]">Usuario</th>
                  <th className="px-4 py-2 w-[5%]">Firma</th>
                  <th className="px-4 py-2 w-[5%]">Actualizar</th>
                </tr>
              </thead>
              <tbody>
                {currentAdmissions.map((admission, index) => {
                  const isSigned = signedAdmissions.some(
                    (signed) =>
                      String(signed.documentPatient) === String(admission.documentPatient) &&
                      String(signed.consecutiveAdmission) === String(admission.consecutiveAdmission)
                  );

                  return (
                    <tr
                      key={index}
                      className={`border-b ${isSigned ? "bg-green-50" : "bg-white"}`}
                    >
                      <td className="px-3 py-2">{admission.consecutiveAdmission}</td>
                      <td className="px-3 py-2">{admission.documentPatient}</td>
                      <td className="px-3 py-2">{admission.fullNamePatient}</td>
                      <td className="px-3 py-2">{new Date(admission.dateAdmission).toLocaleDateString()}</td>
                      <td className="px-3 py-2">{MapAdmissionType(admission.typeAdmission)}</td>
                      <td className="px-3 py-2">{admission.userAdmission}</td>
                      <td className="px-3 py-2">
                        {isSigned ? (
                          <FontAwesomeIcon
                            icon={faCheckCircle}
                            className="text-green-600 text-xl"
                          />
                        ) : (
                          <button
                            className="bg-indigo-600 text-white w-9 h-9 flex items-center justify-center rounded hover:bg-indigo-700 mx-auto"
                            onClick={() => openModal(admission)}
                          >
                            {isCheckingSignatures[admission.consecutiveAdmission] ? (
                              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            ) : (
                              <FontAwesomeIcon icon={faSignature} />
                            )}
                          </button>
                        )}
                      </td>
                      <td className="px-3 py-2">
                        {isSigned ? (
                          <button
                            className={`bg-yellow-500 text-black w-9 h-9 flex items-center justify-center rounded hover:bg-yellow-600 mx-auto ${isUpdating[admission.consecutiveAdmission] ? "opacity-75 cursor-not-allowed" : ""
                              }`}
                            onClick={() => handleUpdateAdmission(admission)}
                            disabled={isUpdating[admission.consecutiveAdmission]}
                          >
                            {isUpdating[admission.consecutiveAdmission] ? (
                              <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                            ) : (
                              <FontAwesomeIcon icon={faRedo} />
                            )}
                          </button>
                        ) : (
                          <FontAwesomeIcon
                            icon={faTimesCircle}
                            className="text-red-600 text-xl"
                          />
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="md:hidden flex flex-col gap-4">
            {currentAdmissions.map((admission, index) => {
              const isSigned = signedAdmissions.some(
                (signed) =>
                  String(signed.documentPatient) === String(admission.documentPatient) &&
                  String(signed.consecutiveAdmission) === String(admission.consecutiveAdmission)
              );

              return (
                <div
                  key={index}
                  className={`rounded-md p-3 shadow-sm border ${isSigned ? "border-green-200 bg-green-50" : "border-gray-200 bg-white"}`}
                >
                  <p><strong>No. Admisión:</strong> {admission.consecutiveAdmission}</p>
                  <p><strong>Documento:</strong> {admission.documentPatient}</p>
                  <p><strong>Nombre:</strong> {admission.fullNamePatient}</p>
                  <p><strong>Fecha:</strong> {new Date(admission.dateAdmission).toLocaleDateString()}</p>
                  <p><strong>Servicio:</strong> {MapAdmissionType(admission.typeAdmission)}</p>
                  <p><strong>Usuario:</strong> {admission.userAdmission}</p>
                  <div className="flex justify-between mt-3">
                    <div className="flex items-center">
                      <strong>Firma:</strong>
                      {isSigned ? (
                        <FontAwesomeIcon
                          icon={faCheckCircle}
                          className="text-green-600 text-xl ml-2"
                        />
                      ) : (
                        <button
                          className="bg-indigo-600 text-white w-9 h-9 flex items-center justify-center rounded hover:bg-indigo-700 ml-2"
                          onClick={() => openModal(admission)}
                        >
                          {isCheckingSignatures[admission.consecutiveAdmission] ? (
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          ) : (
                            <FontAwesomeIcon icon={faSignature} />
                          )}
                        </button>
                      )}
                    </div>
                    <div className="flex items-center">
                      <strong>Actualizar:</strong>
                      {isSigned ? (
                        <button
                          className={`bg-yellow-500 text-black w-9 h-9 flex items-center justify-center rounded hover:bg-yellow-600 ml-2 ${isUpdating[admission.consecutiveAdmission] ? "opacity-75 cursor-not-allowed" : ""
                            }`}
                          onClick={() => handleUpdateAdmission(admission)}
                          disabled={isUpdating[admission.consecutiveAdmission]}
                        >
                          {isUpdating[admission.consecutiveAdmission] ? (
                            <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                          ) : (
                            <FontAwesomeIcon icon={faRedo} />
                          )}
                        </button>
                      ) : (
                        <FontAwesomeIcon
                          icon={faTimesCircle}
                          className="text-red-600 text-xl ml-2"
                        />
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Pagination */}
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

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <div className="text-center">
              <div className="text-green-500 mb-4">
                <FontAwesomeIcon icon={faCheckCircle} size="2x" />
              </div>
              <h3 className="text-xl font-bold mb-2">Admisión actualizada correctamente</h3>
              <p className="mb-4">{successAdmission?.fullNamePatient}</p>
              <button
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                onClick={() => setShowSuccessModal(false)}
              >
                <FontAwesomeIcon icon={faTimesCircle} className="mr-2" /> Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

      <SignatureModal isOpen={isModalOpen} onClose={handleModalClose} admission={selectedAdmission} />
    </div>
  );
};

export default AdmissionList;