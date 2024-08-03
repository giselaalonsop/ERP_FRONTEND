'use client'
import React, { useState } from 'react'
import Modal from '@/components/Modal'
import { PlusIcon } from '@heroicons/react/solid'
import { useTheme } from '@/context/ThemeProvider'
import RegisterProveedorForm from '@/components/RegisterProveedorForm'
import Swal from 'sweetalert2'
import { EyeIcon, TrashIcon } from '@heroicons/react/outline'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPenToSquare } from '@fortawesome/free-solid-svg-icons'
import { useProveedores } from '@/hooks/useProveedores'
import Pagination from '@/components/Pagination'
import { useAuth } from '@/hooks/auth'

const ProveedoresPage = () => {
    const { hasPermission, user } = useAuth({ middleware: 'auth' })
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [modalContent, setModalContent] = useState(null)
    const [modalTitle, setModalTitle] = useState('')
    const [currentPage, setCurrentPage] = useState(1)
    const itemsPerPage = 10
    const { proveedores, proveedoresError, deleteProveedor } = useProveedores()
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

    const showProveedorInfo = proveedor => {
        if (!proveedor) return

        const cuentas = proveedor.numeros_de_cuenta
            .map(
                cuenta => `
            <div key="${cuenta.id}">
                <p><strong>Banco:</strong> ${cuenta.banco}</p>
                <p><strong>Número:</strong> ${cuenta.numero_cuenta}</p>
                <p><strong>Pago móvil:</strong> ${
                    cuenta.pago_movil ? 'Sí' : 'No'
                }</p>
            </div>
        `,
            )
            .join('')

        Swal.fire({
            title: 'Información del Proveedor',
            html: `
                <div>
                    <p><strong>Nombre:</strong> ${proveedor.nombre}</p>
                    <p><strong>Correo:</strong> ${proveedor.correo}</p>
                    <p><strong>Teléfono:</strong> ${proveedor.telefono}</p>
                    <p><strong>Dirección:</strong> ${proveedor.direccion}</p>
                    <p><strong>Empresas:</strong> ${proveedor.empresa}</p>
                    <p><strong>Datos Bancarios:</strong></p>
                    ${cuentas.length > 0 ? cuentas : '<p>No Vinculado</p>'}
                </div>
            `,
            icon: 'info',
            confirmButtonText: 'Cerrar',
        })
    }

    const handleEdit = proveedor => {
        openModal(
            <RegisterProveedorForm
                proveedor={proveedor}
                onClose={closeModal}
                editMode={true}
            />,
            'Editar Proveedor',
        )
    }

    const handleDelete = async proveedorId => {
        Swal.fire({
            title: '¿Estás seguro?',
            text:
                'Podras recuperar este producto mas adelante en la seccion Papelera!',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Sí, eliminarlo!',
            cancelButtonText: 'Cancelar',
        }).then(async result => {
            if (result.isConfirmed) {
                try {
                    const response = await deleteProveedor(proveedorId)
                    if (response.status === 204 || response.status === 200) {
                        Swal.fire(
                            'Eliminado!',
                            'El proveedor ha sido eliminado.',
                            'success',
                        )
                    } else {
                        Swal.fire('Error!', response.data.message, 'error')
                    }
                } catch (error) {
                    Swal.fire(
                        'Error!',
                        'Hubo un problema al eliminar el proveedor.',
                        'error',
                    )
                }
            }
        })
    }

    const startIndex = (currentPage - 1) * itemsPerPage
    const paginatedProveedores = proveedores
        ? proveedores.slice(startIndex, startIndex + itemsPerPage)
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
                            {hasPermission(user, 'agregarProveedores') ||
                            user?.rol === 'admin' ? (
                                <button
                                    onClick={() =>
                                        openModal(
                                            <RegisterProveedorForm
                                                onClose={closeModal}
                                                editMode={false}
                                            />,
                                            'Nuevo Proveedor',
                                        )
                                    }
                                    className="flex items-center px-4 py-2 rounded-lg bg-blue-500 hover:bg-blue-700 text-white font-semibold shadow whitespace-nowrap">
                                    <PlusIcon className="h-5 w-5 mr-2" />
                                    Nuevo Proveedor
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
                            id="table-search-proveedores"
                            className="block p-2 pl-10 text-sm rounded-lg w-80"
                            placeholder="Buscar proveedores"
                        />
                    </div>
                </div>

                {proveedoresError ? (
                    <div>Error al cargar los proveedores.</div>
                ) : !proveedores ? (
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
                                        Empresa
                                    </th>
                                    <th scope="col" className="px-6 py-3">
                                        Correo
                                    </th>
                                    <th scope="col" className="px-6 py-3">
                                        Teléfono
                                    </th>
                                    <th scope="col" className="px-6 py-3">
                                        Dirección
                                    </th>
                                    <th scope="col" className="px-6 py-3">
                                        Datos Bancarios
                                    </th>
                                    <th scope="col" className="px-6 py-3">
                                        Acción
                                    </th>
                                </tr>
                            </thead>

                            <tbody>
                                {paginatedProveedores.map(proveedor => (
                                    <tr
                                        key={proveedor.id}
                                        className="border-b cursor-pointer">
                                        <td className="w-4 p-4">
                                            <div className="flex items-center">
                                                <input
                                                    id={`checkbox-table-search-${proveedor.id}`}
                                                    type="checkbox"
                                                    className="w-4 h-4 rounded"
                                                />
                                                <label
                                                    htmlFor={`checkbox-table-search-${proveedor.id}`}
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
                                                    {proveedor.nombre}
                                                </div>
                                                <div className="font-normal text-gray-500">
                                                    {proveedor.correo}
                                                </div>
                                            </div>
                                        </th>
                                        <td className="px-6 py-4">
                                            {proveedor.empresa}
                                        </td>
                                        <td className="px-6 py-4">
                                            {proveedor.correo}
                                        </td>
                                        <td className="px-6 py-4">
                                            {proveedor.telefono}
                                        </td>
                                        <td className="px-6 py-4">
                                            {proveedor.direccion}
                                        </td>
                                        <td className="px-6 py-4">
                                            {proveedor.numeros_de_cuenta
                                                .length > 0
                                                ? 'Sí'
                                                : 'No Vinculado'}
                                        </td>
                                        <td className="px-6 py-4 flex space-x-2">
                                            <button
                                                onClick={() =>
                                                    showProveedorInfo(proveedor)
                                                }
                                                className="text-blue-600 hover:text-blue-900">
                                                <EyeIcon className="h-5 w-5" />
                                            </button>

                                            {hasPermission(
                                                user,
                                                'agregarProveedores',
                                            ) || user?.rol === 'admin' ? (
                                                <>
                                                    <button
                                                        onClick={() =>
                                                            handleEdit(
                                                                proveedor,
                                                            )
                                                        }
                                                        className="text-green-600 hover:text-green-900">
                                                        <FontAwesomeIcon
                                                            className="h-4 w-4"
                                                            icon={faPenToSquare}
                                                        />
                                                    </button>
                                                    <button
                                                        onClick={() =>
                                                            handleDelete(
                                                                proveedor.id,
                                                            )
                                                        }
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
                            totalItems={proveedores.length}
                            itemsPerPage={itemsPerPage}
                            onPageChange={setCurrentPage}
                        />
                    </div>
                )}
            </div>
        </div>
    )
}

export default ProveedoresPage
