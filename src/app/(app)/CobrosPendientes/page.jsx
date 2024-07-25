'use client'
import React, { useState } from 'react'
import { useVentas } from '@/hooks/useVentas'
import { PencilAltIcon, TrashIcon } from '@heroicons/react/outline'
import Swal from 'sweetalert2'
import Pagination from '@/components/Pagination'
import Modal from '@/components/Modal'
import ConfirmFactura from '@/components/ConfirmFactura'
import { useAuth } from '@/hooks/auth'
import { format } from 'date-fns'
import { useClientes } from '@/hooks/useClients'

const CuentasPorCobrar = () => {
    const { ventasPendientes, ventasPendientesError } = useVentas()
    const { user } = useAuth()
    const [currentPage, setCurrentPage] = useState(1)
    const itemsPerPage = 10
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [modalContent, setModalContent] = useState(null)
    const [modalTitle, setModalTitle] = useState('')
    const [selectedVenta, setSelectedVenta] = useState(null)
    const { clientes } = useClientes()
    const formatDate = dateString => {
        return format(new Date(dateString), 'dd-MM-yyyy HH:mm:ss')
    }
    const openModal = (content, title) => {
        setModalContent(content)
        setModalTitle(title)
        setIsModalOpen(true)
    }

    const closeModal = () => {
        setIsModalOpen(false)
        setModalContent(null)
        setModalTitle('')
    }

    const handleEdit = venta => {
        const cliente = clientes?.find(
            cliente => cliente.cedula == venta.cliente,
        )

        setSelectedVenta(venta)
        openModal(
            <ConfirmFactura
                setProcesado={() => {}}
                TotalGeneral={venta.total_venta_dol}
                cliente={cliente}
                selectedProducts={venta.detalles}
                location={user.location}
                onSuccess={handleUpdateSuccess}
                isMayor={venta.mayor_o_detal === 'Mayor'}
                venta={venta}
            />,
            'Actualizar Venta',
        )
    }

    const handleUpdateSuccess = () => {
        closeModal()

        Swal.fire(
            'Venta Actualizada',
            'La venta ha sido actualizada.',
            'success',
        )
    }

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
                deleteVenta(id).then(() => {
                    fetchVentasPendientes()
                    Swal.fire(
                        'Eliminado',
                        'La venta ha sido eliminada.',
                        'success',
                    )
                })
            }
        })
    }

    if (ventasPendientes?.length === 0) {
        return (
            <div className="text-center text-gray-500  py-2">
                No hay ventas por cobrar.
            </div>
        )
    }
    if (ventasPendientesError)
        return <div>Error al cargar las ventas pendientes.</div>
    if (!ventasPendientes) return <div>Cargando...</div>

    const startIndex = (currentPage - 1) * itemsPerPage
    const paginatedVentas = ventasPendientes.slice(
        startIndex,
        startIndex + itemsPerPage,
    )

    return (
        <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
            <Modal isOpen={isModalOpen} onClose={closeModal} title={modalTitle}>
                {modalContent}
            </Modal>

            <table className="w-full text-sm text-left text-gray-500">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                    <tr>
                        <th scope="col" className="px-6 py-3">
                            Cédula
                        </th>
                        <th scope="col" className="px-6 py-3">
                            Nombre
                        </th>
                        <th scope="col" className="px-6 py-3">
                            Fecha
                        </th>
                        <th scope="col" className="px-6 py-3">
                            Monto Total
                        </th>
                        <th scope="col" className="px-6 py-3">
                            Acciones
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {paginatedVentas.map(venta => (
                        <tr key={venta.id} className="bg-white border-b">
                            <td className="px-6 py-4">{venta.cliente}</td>

                            <td className="px-6 py-4">
                                {clientes?.find(
                                    cliente => cliente.cedula == venta.cliente,
                                )?.nombre +
                                    ' ' +
                                    clientes?.find(
                                        cliente =>
                                            cliente.cedula == venta.cliente,
                                    )?.apellido}
                            </td>
                            <td className="px-6 py-4">
                                {formatDate(venta.created_at)}
                            </td>
                            <td className="px-6 py-4">
                                {venta.total_venta_dol != null &&
                                !isNaN(venta.total_venta_dol)
                                    ? parseFloat(venta.total_venta_dol).toFixed(
                                          2,
                                      )
                                    : 'N/A'}
                            </td>
                            <td className="px-6 py-4 flex space-x-2">
                                <button
                                    onClick={() => handleEdit(venta)}
                                    className="text-blue-600 hover:text-blue-900">
                                    <PencilAltIcon className="h-5 w-5" />
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
            <Pagination
                currentPage={currentPage}
                totalItems={ventasPendientes.length}
                itemsPerPage={itemsPerPage}
                onPageChange={setCurrentPage}
            />
        </div>
    )
}

export default CuentasPorCobrar
