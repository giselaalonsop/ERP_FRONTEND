'use client'
import React from 'react'
import { useVentas } from '@/hooks/useVentas'
import { EyeIcon, TrashIcon, DocumentIcon } from '@heroicons/react/outline'
import Swal from 'sweetalert2'

const SalesTable = () => {
    const { ventas, ventasError, deleteVenta } = useVentas()

    const handleDelete = id => {
        Swal.fire({
            title: '¿Estás seguro?',
            text: 'Esta acción no se puede deshacer',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar',
        }).then(result => {
            if (result.isConfirmed) {
                deleteVenta(id)
            }
        })
    }

    if (ventasError) return <div>Error al cargar las ventas.</div>
    if (!ventas) return <div>Cargando...</div>

    return (
        <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
            <table className="w-full text-sm text-left text-gray-500">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                    <tr>
                        <th scope="col" className="px-6 py-3">
                            Cliente
                        </th>
                        <th scope="col" className="px-6 py-3">
                            Usuario
                        </th>
                        <th scope="col" className="px-6 py-3">
                            Número de Venta
                        </th>
                        <th scope="col" className="px-6 py-3">
                            Total
                        </th>
                        <th scope="col" className="px-6 py-3">
                            Fecha
                        </th>
                        <th scope="col" className="px-6 py-3">
                            Acciones
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {ventas.map(venta => (
                        <tr key={venta.id} className="bg-white border-b">
                            <td className="px-6 py-4">{venta.cliente}</td>
                            <td className="px-6 py-4">{venta.usuario}</td>
                            <td className="px-6 py-4">
                                {venta.numero_de_venta}
                            </td>
                            <td className="px-6 py-4">{venta.total_venta}</td>
                            <td className="px-6 py-4">
                                {new Date(venta.fecha).toLocaleString()}
                            </td>
                            <td className="px-6 py-4 flex space-x-2">
                                <button
                                    onClick={() => viewDetails(venta.id)}
                                    className="text-blue-600 hover:text-blue-900">
                                    <EyeIcon className="h-5 w-5" />
                                </button>
                                <button
                                    onClick={() => generateInvoice(venta.id)}
                                    className="text-green-600 hover:text-green-900">
                                    <DocumentIcon className="h-5 w-5" />
                                </button>
                                <button
                                    onClick={() => handleDelete(venta.id)}
                                    className="text-red-600 hover:text-red-900">
                                    <TrashIcon className="h-5 w-5" />
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}

const viewDetails = id => {
    // Implementar la lógica para ver los detalles de la venta
    Swal.fire(
        'Detalles de la venta',
        `Detalles de la venta con ID ${id}`,
        'info',
    )
}

const generateInvoice = id => {
    // Implementar la lógica para generar la factura de la venta
    Swal.fire(
        'Factura generada',
        `Factura de la venta con ID ${id} generada`,
        'success',
    )
}

export default SalesTable
