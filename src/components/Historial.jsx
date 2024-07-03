import React from 'react'
import { useState, useEffect } from 'react'
import Swal from 'sweetalert2'
import { useClientes } from '@/hooks/useClients'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'

const HistorialComprasModal = ({ client, onClose }) => {
    const [historialCompras, setHistorialCompras] = useState([])
    const { getHistorialCompras } = useClientes()

    useEffect(() => {
        const fetchHistorialCompras = async () => {
            try {
                const compras = await getHistorialCompras(client.cedula)
                setHistorialCompras(compras)
            } catch (error) {
                Swal.fire(
                    'Error',
                    'No se pudo cargar el historial de compras',
                    'error',
                )
            }
        }

        fetchHistorialCompras()
    }, [client, getHistorialCompras])
    const generatePDF = () => {
        const doc = new jsPDF()
        doc.text(`Historial de Compras de ${client?.nombre}`, 10, 10)
        autoTable(doc, {
            startY: 20,
            head: [['Fecha', 'Total', 'Detalles']],
            body: historialCompras.map(compra => [
                compra.fecha,
                compra.total_venta,
                compra.detalles
                    .map(
                        detalle =>
                            `${detalle.nombre} - ${detalle.cantidad} x ${detalle.precio_unitario}`,
                    )
                    .join('\n'),
            ]),
        })
        doc.save('historial_compras.pdf')
    }

    return (
        <div className="p-4">
            <div className="mb-4">
                <h2 className="text-lg font-semibold">
                    {client
                        ? `Historial de Compras de ${client.nombre}`
                        : 'Historial de Compras'}
                </h2>
                <p>
                    {client && (
                        <>
                            <strong>Cédula:</strong> {client.cedula}
                        </>
                    )}
                </p>
            </div>
            <table className="w-full text-sm text-left text-gray-500">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                    <tr>
                        <th className="px-6 py-3">Fecha</th>
                        <th className="px-6 py-3">Total</th>
                        <th className="px-6 py-3">Detalles</th>
                    </tr>
                </thead>
                <tbody>
                    {historialCompras.map((compra, index) => (
                        <tr key={index} className="bg-white border-b">
                            <td className="px-6 py-4">{compra.fecha}</td>
                            <td className="px-6 py-4">{compra.total_venta}</td>
                            <td className="px-6 py-4">
                                <ul>
                                    {compra.detalles.map(
                                        (detalle, detalleIndex) => (
                                            <li key={detalleIndex}>
                                                {detalle.nombre} -{' '}
                                                {detalle.cantidad} x{' '}
                                                {detalle.precio_unitario}
                                            </li>
                                        ),
                                    )}
                                </ul>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <button
                onClick={generatePDF}
                className="bg-blue-500 text-white py-2 px-4 rounded mt-4">
                Descargar PDF
            </button>
        </div>
    )
}

export default HistorialComprasModal
