'use client'
import React, { useState } from 'react'
import { useAuth } from '@/hooks/auth'
import Modal from '@/components/Modal'
import { PlusIcon } from '@heroicons/react/solid'
import { useTheme } from '@/context/ThemeProvider'
import Register from '@/components/RegisterForm'
import Swal from 'sweetalert2'
import { EyeIcon, TrashIcon } from '@heroicons/react/outline'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPenToSquare } from '@fortawesome/free-solid-svg-icons'
import { useClientes } from '@/hooks/useClients'
import HistorialComprasModal from '@/components/Historial'
import RegisterClient from '@/components/RegisterClient'
import Pagination from '@/components/Pagination'

const Page = () => {
    const { hasPermission, user } = useAuth({ middleware: 'auth' })
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [modalContent, setModalContent] = useState(null)
    const [modalTitle, setModalTitle] = useState('')
    const [currentPage, setCurrentPage] = useState(1)
    const itemsPerPage = 10
    const {
        clientes,
        clientesError,
        getHistorialCompras,
        deleteClient,
    } = useClientes()
    const { isDark } = useTheme()

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

    const showClientInfo = client => {
        if (!client) return
        Swal.fire({
            title: 'Información del Cliente',
            html: `
                <div>
                    <p><strong>Nombre:</strong> ${client.nombre}</p>
                    <p><strong>Correo:</strong> ${client.correo_electronico}</p>
                    <p><strong>Teléfono:</strong> ${client.numero_de_telefono}</p>
                </div>
            `,
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Ver Historial de Compras',
        }).then(result => {
            if (result.isConfirmed) {
                openModal(
                    <HistorialComprasModal
                        client={client}
                        onClose={closeModal}
                    />,
                    'Historial de Compras',
                )
            }
        })
    }

    const handleEdit = client => {
        openModal(
            <RegisterClient
                client={client}
                onClose={closeModal}
                editMode={true}
            />,
            'Editar Cliente',
        )
    }

    const handleDelete = async clientId => {
        Swal.fire({
            title: '¿Estás seguro?',
            text: 'No podrás revertir esto!',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Sí, eliminarlo!',
            cancelButtonText: 'Cancelar',
        }).then(async result => {
            if (result.isConfirmed) {
                try {
                    await deleteClient(clientId)
                    Swal.fire(
                        'Eliminado!',
                        'El cliente ha sido eliminado.',
                        'success',
                    )
                } catch (error) {
                    Swal.fire(
                        'Error!',
                        'Hubo un problema al eliminar el cliente.',
                        'error',
                    )
                }
            }
        })
    }

    const startIndex = (currentPage - 1) * itemsPerPage
    const paginatedClientes = clientes
        ? clientes.slice(startIndex, startIndex + itemsPerPage)
        : []

    return (
        <div>
            <Modal isOpen={isModalOpen} onClose={closeModal} title={modalTitle}>
                {modalContent}
            </Modal>

            <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
                <div className="flex items-center justify-between flex-wrap md:flex-row space-y-4 md:space-y-0 pb-4 bg-transparent">
                    <div className="flex items-center space-x-2">
                        <div className="px-4">
                            {hasPermission(user, 'clientes') ||
                            user?.rol === 'admin' ? (
                                <button
                                    onClick={() =>
                                        openModal(
                                            <RegisterClient
                                                onClose={closeModal}
                                                editMode={false}
                                            />,
                                            'Nuevo Cliente',
                                        )
                                    }
                                    className="flex items-center px-4 py-2 rounded-lg bg-blue-500 hover:bg-blue-700 text-white font-semibold shadow whitespace-nowrap">
                                    <PlusIcon className="h-5 w-5 mr-2" />
                                    Nuevo Cliente
                                </button>
                            ) : null}
                        </div>
                    </div>

                    <label htmlFor="table-search" className="sr-only">
                        Buscar
                    </label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                            <svg
                                className="w-4 h-4 text-gray-500 dark:text-gray-400"
                                aria-hidden="true"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 20 20">
                                <path
                                    stroke="currentColor"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                                />
                            </svg>
                        </div>
                        <input
                            type="text"
                            id="table-search-users"
                            className="block p-2 pl-10 text-sm rounded-lg w-80"
                            placeholder="Buscar clientes"
                        />
                    </div>
                </div>

                {clientesError ? (
                    <div>Error al cargar los clientes.</div>
                ) : !clientes ? (
                    <div>Cargando...</div>
                ) : (
                    <div>
                        <table
                            className={`w-full text-sm text-left rtl:text-right ${
                                isDark
                                    ? 'bg-gray-800 text-white'
                                    : 'bg-white text-black'
                            }`}>
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
                                        Nombre
                                    </th>
                                    <th scope="col" className="px-6 py-3">
                                        Cédula
                                    </th>

                                    <th scope="col" className="px-6 py-3">
                                        Teléfono
                                    </th>
                                    <th scope="col" className="px-6 py-3">
                                        Acción
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {paginatedClientes.map(client => (
                                    <tr
                                        key={client.id}
                                        className="border-b cursor-pointer">
                                        <td className="w-4 p-4">
                                            <div className="flex items-center">
                                                <input
                                                    id={`checkbox-table-search-${client.id}`}
                                                    type="checkbox"
                                                    className="w-4 h-4 rounded"
                                                />
                                                <label
                                                    htmlFor={`checkbox-table-search-${client.id}`}
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
                                                    {client.nombre}
                                                </div>
                                                <div className="font-normal text-gray-500">
                                                    {client.correo_electronico}
                                                </div>
                                            </div>
                                        </th>
                                        <td className="px-6 py-4">
                                            {client.cedula}
                                        </td>
                                        <td className="px-6 py-4">
                                            {client.numero_de_telefono}
                                        </td>
                                        <td className="px-6 py-4 flex space-x-2">
                                            <button
                                                onClick={() =>
                                                    showClientInfo(client)
                                                }
                                                className="text-blue-600 hover:text-blue-900">
                                                <EyeIcon className="h-5 w-5" />
                                            </button>
                                            {hasPermission(
                                                user,
                                                'facturacion',
                                            ) || user?.rol === 'admin' ? (
                                                <>
                                                    <button
                                                        onClick={() => {
                                                            handleEdit(client)
                                                        }}
                                                        className="text-green-600 hover:text-green-900">
                                                        <FontAwesomeIcon
                                                            className="h-4 w-4"
                                                            icon={faPenToSquare}
                                                        />
                                                    </button>
                                                    <button
                                                        onClick={() => {
                                                            handleDelete(
                                                                client.id,
                                                            )
                                                        }}
                                                        className="text-red-600 hover:text-red-900">
                                                        <TrashIcon className="h-5 w-5" />
                                                    </button>
                                                </>
                                            ) : null}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <Pagination
                            currentPage={currentPage}
                            totalItems={clientes.length}
                            itemsPerPage={itemsPerPage}
                            onPageChange={setCurrentPage}
                        />
                    </div>
                )}
            </div>
        </div>
    )
}

export default Page
