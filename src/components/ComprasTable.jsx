import React, { useState } from 'react'
import { useCompras } from '@/hooks/useCompras'
import { PlusIcon, TrashIcon } from '@heroicons/react/solid'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPenToSquare } from '@fortawesome/free-solid-svg-icons'
import Modal from '@/components/Modal'
import Button from '@/components/Button'
import Pagination from '@/components/Pagination'
import RegisterCompra from '@/components/RegisterCompra'
import Swal from 'sweetalert2'

const ComprasTable = ({ compras }) => {
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [modalContent, setModalContent] = useState(null)
    const [modalTitle, setModalTitle] = useState('')
    const [currentPage, setCurrentPage] = useState(1)
    const itemsPerPage = 10

    const { deleteCompra } = useCompras()

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

    const handleEdit = compra => {
        openModal(
            <RegisterCompra
                compra={compra}
                onClose={closeModal}
                editMode={true}
            />,
            'Editar Compra',
        )
    }

    const handleDelete = async compraId => {
        Swal.fire({
            title: '¿Estás seguro?',
            text: 'No podrás revertir esto!',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Sí, eliminarla!',
            cancelButtonText: 'Cancelar',
        }).then(async result => {
            if (result.isConfirmed) {
                try {
                    await deleteCompra(compraId)
                    Swal.fire(
                        'Eliminada!',
                        'La compra ha sido eliminada.',
                        'success',
                    )
                } catch (error) {
                    Swal.fire(
                        'Error!',
                        'Hubo un problema al eliminar la compra.',
                        'error',
                    )
                }
            }
        })
    }

    const startIndex = (currentPage - 1) * itemsPerPage
    const paginatedCompras =
        compras?.slice(startIndex, startIndex + itemsPerPage) || []

    return (
        <div>
            <Modal isOpen={isModalOpen} onClose={closeModal} title={modalTitle}>
                {modalContent}
            </Modal>

            <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
                <div className="flex items-center justify-between flex-wrap md:flex-row space-y-4 md:space-y-0 pb-4 bg-transparent"></div>

                {!compras ? (
                    <div>Cargando...</div>
                ) : (
                    <div>
                        <table className="w-full text-sm text-left rtl:text-right bg-white text-black">
                            <thead className="text-xs uppercase">
                                <tr>
                                    <th scope="col" className="p-4">
                                        <div className="flex items-center">
                                            <input
                                                id="checkbox-all-search"
                                                type="checkbox"
                                                className="w-4 h-4"
                                            />
                                            <label
                                                htmlFor="checkbox-all-search"
                                                className="sr-only">
                                                checkbox
                                            </label>
                                        </div>
                                    </th>
                                    <th scope="col" className="px-6 py-3">
                                        Proveedor
                                    </th>
                                    <th scope="col" className="px-6 py-3">
                                        Fecha
                                    </th>
                                    <th scope="col" className="px-6 py-3">
                                        Monto Total
                                    </th>
                                    <th scope="col" className="px-6 py-3">
                                        Monto Abonado
                                    </th>
                                    <th scope="col" className="px-6 py-3">
                                        Monto Restante
                                    </th>
                                    <th scope="col" className="px-6 py-3">
                                        Estado
                                    </th>
                                    <th scope="col" className="px-6 py-3">
                                        Acción
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {paginatedCompras.map(compra => (
                                    <tr
                                        key={compra.id}
                                        className="border-b cursor-pointer">
                                        <td className="w-4 p-4">
                                            <div className="flex items-center">
                                                <input
                                                    id={`checkbox-table-search-${compra.id}`}
                                                    type="checkbox"
                                                    className="w-4 h-4 rounded"
                                                />
                                                <label
                                                    htmlFor={`checkbox-table-search-${compra.id}`}
                                                    className="sr-only">
                                                    checkbox
                                                </label>
                                            </div>
                                        </td>
                                        <th
                                            scope="row"
                                            className="flex items-center px-6 py-4 whitespace-nowrap">
                                            <div className="pl-3">
                                                <div className="text-base font-semibold">
                                                    {compra.proveedor.empresa}
                                                </div>
                                            </div>
                                        </th>
                                        <td className="px-6 py-4">
                                            {compra.fecha}
                                        </td>
                                        <td className="px-6 py-4">
                                            {compra.monto_total}
                                        </td>
                                        <td className="px-6 py-4">
                                            {compra.monto_abonado}
                                        </td>
                                        <td className="px-6 py-4">
                                            {compra.monto_restante}
                                        </td>
                                        <td className="px-6 py-4">
                                            {compra.estado}
                                        </td>
                                        <td className="px-6 py-4 flex space-x-2">
                                            <button
                                                onClick={() =>
                                                    handleEdit(compra)
                                                }
                                                className="text-green-600 hover:text-green-900">
                                                <FontAwesomeIcon
                                                    className="h-4 w-4"
                                                    icon={faPenToSquare}
                                                />
                                            </button>
                                            <button
                                                onClick={() =>
                                                    handleDelete(compra.id)
                                                }
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
                            totalItems={compras.length}
                            itemsPerPage={itemsPerPage}
                            onPageChange={setCurrentPage}
                        />
                    </div>
                )}
            </div>
        </div>
    )
}

export default ComprasTable
