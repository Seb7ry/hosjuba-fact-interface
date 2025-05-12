import React, { useState, useEffect } from "react";
import { getAllAdmissions, getFilteredAdmissions } from "../../services/admissionService";
import AdmissionList from "../../components/admissionList/admissionList";
import Navbar from "../../components/navbar/navbar";

const Admission = () => {
    const [documentNumber, setDocumentNumber] = useState("");
    const [admissionNumber, setAdmissionNumber] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [isEndDateDisabled, setIsEndDateDisabled] = useState(true);
    const [user, setUser] = useState("");
    const [admissionType, setAdmissionType] = useState("");
    const [admissions, setAdmissions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showDateErrorModal, setShowDateErrorModal] = useState(false);
    const [isSearchDisabled, setIsSearchDisabled] = useState(true);

    useEffect(() => {
        fetchAdmissions();
    }, []);

    useEffect(() => {
        setIsSearchDisabled(documentNumber.trim() === "");
    }, [documentNumber]);

    const fetchAdmissions = async () => {
        setLoading(true);
        const data = await getAllAdmissions();
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
        const selectedStartDate = e.target.value;
        setStartDate(selectedStartDate);

        if (!selectedStartDate) {
            setEndDate("");
            setIsEndDateDisabled(true);
        } else {
            setIsEndDateDisabled(false);
        }
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
            typeAdmission: admissionType || undefined
        };

        let data = await getFilteredAdmissions(filters);

        if (admissionType === "hospitalizacion") {
            data = data.filter(admission =>
                admission.typeAdmission !== 1 &&
                admission.typeAdmission !== 99 &&
                admission.typeAdmission !== 9
            );
        }

        setAdmissions(data);
        setLoading(false);
    };

    return (
        <div className="flex bg-gray-100 min-h-screen">
            <Navbar />
            <div className="flex-1 px-5 py-6 pt-14 md:pt-6 md:ml-[250px] transition-all duration-300">
                <div className="max-w-[1200px] mx-auto flex flex-col gap-6">
                    {/* Sección de Descripción */}
                    <section className="bg-white rounded-lg shadow-md p-6">
                        <h1 className="text-4xl font-bold text-black mb-4">Admisiones</h1>
                        <hr className="mb-4" />
                        <p className="text-gray-700 mb-4">
                            En este apartado puedes buscar la admisión correspondiente al paciente al cual
                            le asignarás la firma, la búsqueda puede ser mediante su número de documento y
                            añadido a esto filtros para hacer la búsqueda más detallada. Los campos mostrados
                            en la lista son los siguientes:
                        </p>
                        <ul className="list-disc pl-5 text-gray-800 space-y-2 text-sm">
                            <li><strong>Número de Admisión:</strong> Código único de la admisión del paciente. <code className="bg-gray-100 px-2 py-1 rounded">Ejemplo: 59</code></li>
                            <li><strong>Documento:</strong> Número de identificación del paciente. <code className="bg-gray-100 px-2 py-1 rounded">Ejemplo: 1001234567</code></li>
                            <li><strong>Nombre Paciente:</strong> Nombre del paciente. <code className="bg-gray-100 px-2 py-1 rounded">Ejemplo: Juan Pérez</code></li>
                            <li><strong>Fecha:</strong> Fecha en la que se realizó la admisión. <code className="bg-gray-100 px-2 py-1 rounded">Ejemplo: 10-03-2025</code></li>
                            <li><strong>Servicio:</strong> Servicio por el cual tuvo la admisión el paciente. <code className="bg-gray-100 px-2 py-1 rounded">Ejemplo: Triage</code></li>
                            <li><strong>Usuario:</strong> Nombre del funcionario que realizó la admisión. <code className="bg-gray-100 px-2 py-1 rounded">Ejemplo: JMURILLO</code></li>
                            <li><strong>Firma:</strong> Indica si ya existe una firma para el paciente o no. En caso de que no, le permite acceder al formulario para asignar la firma; en caso de que si, muestra un check de confirmación.</li>
                            <li><strong>Actualizar:</strong> Permite actualizar los datos de la admisión como lo pueden ser datos del paciente o del acompañante desde el hospital. Esta función únicamente será habilitada si es que existe una firma para la admisión del paciente en cuestión.</li>
                        </ul>
                    </section>

                    {/* Mensaje de advertencia */}
                    <section className="bg-yellow-100 text-yellow-900 p-4 rounded-lg shadow-sm border border-yellow-300">
                        <div className="text-center font-medium">
                            ⚠️ Es obligatorio ingresar el <strong>número de documento</strong> antes de aplicar filtros.
                        </div>
                    </section>

                    {/* Filtros */}
                    <section className="bg-white rounded-lg shadow-md p-6 flex flex-wrap gap-4 justify-center">
                        <div className="flex flex-col gap-1 w-full sm:w-auto">
                            <label className="text-sm font-semibold">Número de Documento</label>
                            <input
                                type="text"
                                placeholder="Ingrese el número de documento"
                                value={documentNumber}
                                onChange={(e) => {
                                    const document = e.target.value.replace(/\D/g, "");
                                    setDocumentNumber(document);
                                }}
                                className="border border-gray-300 rounded px-3 py-2 text-sm w-full"
                                required
                            />
                        </div>

                        <div className="flex flex-col gap-1 w-full sm:w-auto">
                            <label className="text-sm font-semibold">Número de Admisión</label>
                            <input
                                type="text"
                                placeholder="Código de admisión"
                                value={admissionNumber}
                                onChange={(e) => {
                                    const consecutive = e.target.value.replace(/\D/g, "");
                                    setAdmissionNumber(consecutive);
                                }}
                                disabled={isSearchDisabled}
                                className="border border-gray-300 rounded px-3 py-2 text-sm w-full disabled:bg-gray-100"
                            />
                        </div>

                        <div className="flex flex-col gap-1 w-full sm:w-auto">
                            <label className="text-sm font-semibold">Fecha de Inicio</label>
                            <input
                                type="date"
                                value={startDate}
                                onChange={handleStartDateChange}
                                disabled={isSearchDisabled}
                                className="border border-gray-300 rounded px-3 py-2 text-sm w-full disabled:bg-gray-100"
                            />
                        </div>

                        <div className="flex flex-col gap-1 w-full sm:w-auto">
                            <label className="text-sm font-semibold">Fecha de Final</label>
                            <input
                                type="date"
                                value={endDate}
                                onChange={handleEndDateChange}
                                disabled={isSearchDisabled || isEndDateDisabled}
                                className="border border-gray-300 rounded px-3 py-2 text-sm w-full disabled:bg-gray-100"
                            />
                        </div>

                        <div className="flex flex-col gap-1 w-full sm:w-auto">
                            <label className="text-sm font-semibold">Usuario</label>
                            <input
                                type="text"
                                placeholder="Nombre del usuario"
                                value={user}
                                onChange={(e) => setUser(e.target.value.toUpperCase())}
                                disabled={isSearchDisabled}
                                className="border border-gray-300 rounded px-3 py-2 text-sm w-full disabled:bg-gray-100"
                            />
                        </div>

                        <div className="flex flex-col gap-1 w-full sm:w-auto">
                            <label className="text-sm font-semibold">Tipo de Admisión</label>
                            <select
                                value={admissionType}
                                onChange={(e) => {
                                    const selectedValue = e.target.value;
                                    if (selectedValue === "1") {
                                        setAdmissionType(1);
                                    } else if (selectedValue === "9") {
                                        setAdmissionType(9);
                                    } else if (selectedValue === "99") {
                                        setAdmissionType(99);
                                    } else if (selectedValue === "hospitalizacion") {
                                        setAdmissionType("hospitalizacion");
                                    } else {
                                        setAdmissionType("");
                                    }
                                }}
                                disabled={isSearchDisabled}
                                className="border border-gray-300 rounded px-3 py-2 text-sm w-full disabled:bg-gray-100"
                            >
                                <option value="">Seleccione el tipo</option>
                                <option value="9">Triage</option>
                                <option value="1">Urgencias</option>
                                <option value="99">Consulta Externa</option>
                                <option value="hospitalizacion">Hospitalización</option>
                            </select>
                        </div>

                        <div className="flex flex-wrap gap-2 items-end w-full justify-center">
                            <button
                                onClick={handleSearch}
                                disabled={isSearchDisabled}
                                className={`px-4 py-2 rounded text-sm w-full sm:w-auto ${isSearchDisabled ? 'bg-gray-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700 text-white'}`}
                            >
                                Buscar
                            </button>
                            <button
                                onClick={handleClearFilters}
                                className="bg-yellow-400 hover:bg-yellow-500 text-black px-4 py-2 rounded text-sm w-full sm:w-auto"
                            >
                                Limpiar
                            </button>
                            <button
                                onClick={fetchAdmissions}
                                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded text-sm w-full sm:w-auto"
                            >
                                Actualizar Admisiones
                            </button>
                        </div>
                    </section>

                    {/* Mensaje informativo */}
                    <section className="bg-green-100 text-green-900 p-4 rounded-lg shadow-sm border border-green-300">
                        <div className="text-center font-medium">
                            ✍️ Para asignar una firma a una admisión <strong>oprimir el botón "Asignar" al final de la fila </strong>
                            correspondiente. Si la admisión ya contiene una firma asignada el botón desaparecerá y en su lugar habrá
                            un icono de check.✍️
                        </div>
                    </section>

                    {/* Lista de admisiones */}
                    <AdmissionList admissions={admissions} loading={loading} />
                </div>
            </div>

            {/* Modal de error de fechas */}
            {showDateErrorModal && (
                <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50">
                    <div className="bg-white p-6 rounded shadow-lg text-center">
                        <p className="mb-4 font-medium">⚠️ La fecha de inicio no puede ser mayor que la fecha final. Por favor corrígela.</p>
                        <button
                            onClick={() => setShowDateErrorModal(false)}
                            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
                        >
                            Cerrar
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Admission;