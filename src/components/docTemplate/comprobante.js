import React from 'react';
import { jsPDF } from "jspdf";
import html2pdf from 'html2pdf.js';

const Comprobante = ({ data }) => {
    return (
        <div id="comprobante">
            <img src="path_to_logo.png" alt="Logo Hospital" />
            <h2>COMPROBANTE DE PRESTACIÓN DE SERVICIOS</h2>
            <p>Fecha: {data.date}</p>
            <p>Nombre Paciente: {data.patientName}</p>
            <p>Servicio Prestado: {data.service}</p>
            {data.invoice && (
                <div>
                    <h3>Procedimientos:</h3>
                    <ul>
                        {data.procedures.map((proc, idx) => (
                            <li key={idx}>{proc}</li>
                        ))}
                    </ul>
                </div>
            )}
            <button onClick={handleDownload}>Descargar PDF</button>
        </div>
    );
};

const handleDownload = () => {
    const element = document.getElementById("comprobante");
    html2pdf().from(element).save('comprobante.pdf');
};

export default Comprobante;
