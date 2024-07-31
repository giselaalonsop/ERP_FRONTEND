'use client'
import React, { useState, useEffect } from 'react'
import { useAuth } from '@/hooks/auth'
import Modal from '@/components/Modal'
import { PlusIcon } from '@heroicons/react/solid'
import { useTheme } from '@/context/ThemeProvider'
import Register from '@/components/RegisterForm'
import Swal from 'sweetalert2'
import { EyeIcon, TrashIcon } from '@heroicons/react/outline'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPenToSquare, faUserCheck } from '@fortawesome/free-solid-svg-icons'
import Pagination from '@/components/Pagination'

const Page = () => {
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [modalContent, setModalContent] = useState(null)
    const [modalTitle, setModalTitle] = useState('')
    const [isDropdownOpen, setIsDropdownOpen] = useState(false)
    const [selectedUser, setSelectedUser] = useState(null)
    const [currentPage, setCurrentPage] = useState(1)
    const [searchTerm, setSearchTerm] = useState('')
    const itemsPerPage = 10
    const {
        user,
        users,
        usersError,
        mutateUsers,
        editUser,
        deleteUser,
        hasPermission,
    } = useAuth({ middleware: 'auth' })
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

    const toggleDropdown = user => {
        setSelectedUser(user)
        setIsDropdownOpen(!isDropdownOpen)
    }

    const closeDropdown = () => {
        setIsDropdownOpen(false)
    }

    const handleEdit = user => {
        openModal(
            <Register user={user} onClose={closeModal} editMode={true} />,
            'Editar Usuario',
        )
    }

    const handleDelete = async userId => {
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
                    await deleteUser(userId)
                    Swal.fire(
                        'Eliminado!',
                        'El usuario ha sido eliminado.',
                        'success',
                    )
                } catch (error) {
                    Swal.fire(
                        'Error!',
                        'Hubo un problema al eliminar el usuario.',
                        'error',
                    )
                }
            }
        })
    }

    const handleSearchChange = event => {
        setSearchTerm(event.target.value)
    }

    const filteredUsers = users
        ? users.filter(
              currentUser =>
                  currentUser.name
                      ?.toLowerCase()
                      .includes(searchTerm.toLowerCase()) ||
                  currentUser.cedula
                      ?.toLowerCase()
                      .includes(searchTerm.toLowerCase()),
          )
        : []

    const startIndex = (currentPage - 1) * itemsPerPage
    const paginatedUsers = filteredUsers.slice(
        startIndex,
        startIndex + itemsPerPage,
    )

    if (!user) {
        return <p>Loading...</p>
    }

    const showUserInfo = user => {
        const permissionsList =
            typeof user.permissions === 'string'
                ? JSON.parse(user.permissions)
                : user.permissions

        Swal.fire({
            title: 'Información del Usuario',
            html: `
                <div>
                    <p><strong>Nombre:</strong> ${user.name}</p>
                    <p><strong>Correo:</strong> ${user.email}</p>
                    <p><strong>Rol:</strong> ${user.rol}</p>
                    <p><strong>Permisos:</strong></p>
                    <ul>
                        ${Object.keys(permissionsList)
                            .map(
                                permission =>
                                    `<li>${permission}: ${
                                        permissionsList[permission]
                                            ? '✔️'
                                            : '🚫'
                                    }</li>`,
                            )
                            .join('')}
                    </ul>
                </div>
            `,
            icon: 'info',
            confirmButtonText: 'Cerrar',
        })
    }

    return (
        <div>
            <Modal isOpen={isModalOpen} onClose={closeModal} title={modalTitle}>
                {modalContent}
            </Modal>

            <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
                <div className="flex items-center justify-between flex-wrap md:flex-row space-y-4 md:space-y-0 pb-4 bg-transparent">
                    <div className="flex items-center space-x-2">
                        <div className="px-4">
                            <button
                                onClick={() =>
                                    openModal(
                                        <Register
                                            onClose={closeModal}
                                            editMode={false}
                                        />,
                                        'Nuevo Usuario',
                                    )
                                }
                                className="flex items-center px-4 py-2 rounded-lg bg-blue-500 hover:bg-blue-700 text-white font-semibold shadow whitespace-nowrap">
                                <PlusIcon className="h-5 w-5 mr-2" />
                                Nuevo Usuario
                            </button>
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
                            value={searchTerm}
                            onChange={handleSearchChange}
                            className="block p-2 pl-10 text-sm rounded-lg w-80"
                            placeholder="Buscar por nombre o cédula"
                        />
                    </div>
                </div>

                {usersError ? (
                    <div>Error al cargar los usuarios.</div>
                ) : !users ? (
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
                                        <div className="flex items-center"></div>
                                    </th>
                                    <th scope="col" className="px-6 py-3">
                                        Nombre
                                    </th>
                                    <th scope="col" className="px-6 py-3">
                                        Cédula
                                    </th>
                                    <th scope="col" className="px-6 py-3">
                                        Rol
                                    </th>
                                    <th scope="col" className="px-6 py-3">
                                        Correo
                                    </th>
                                    <th scope="col" className="px-6 py-3">
                                        Sede
                                    </th>
                                    <th scope="col" className="px-6 py-3">
                                        Acciones
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {paginatedUsers.map(currentUser => (
                                    <tr
                                        key={currentUser.id}
                                        className="border-b cursor-pointer">
                                        <td className="w-4 p-4">
                                            <div className="flex items-center"></div>
                                        </td>
                                        <th
                                            scope="row"
                                            className="flex items-center px-6 py-4 whitespace-nowrap">
                                            <FontAwesomeIcon
                                                icon={faUserCheck}
                                            />
                                            <div className="pl-3">
                                                <div className="text-base font-semibold">
                                                    {currentUser.name}
                                                </div>
                                                <div className="font-normal text-gray-500">
                                                    {currentUser.email}
                                                </div>
                                            </div>
                                        </th>
                                        <td className="px-6 py-4">
                                            {currentUser.cedula}
                                        </td>
                                        <td className="px-6 py-4">
                                            {currentUser.rol}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center">
                                                <div className="h-2.5 w-2.5 rounded-full bg-green-500 mr-2"></div>
                                                {currentUser.email}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            {currentUser.location}
                                        </td>

                                        <div className="relative">
                                            <td className="px-6 py-4 flex space-x-2">
                                                <button
                                                    onClick={() =>
                                                        showUserInfo(
                                                            currentUser,
                                                        )
                                                    }
                                                    className="text-blue-600 hover:text-blue-900">
                                                    <EyeIcon className="h-5 w-5" />
                                                </button>
                                                {hasPermission(
                                                    user,
                                                    'registrarUsuarios',
                                                ) || user.rol == 'admin' ? (
                                                    <>
                                                        <button
                                                            onClick={() => {
                                                                closeDropdown()
                                                                handleEdit(
                                                                    currentUser,
                                                                )
                                                            }}
                                                            className="text-green-600 hover:text-green-900">
                                                            <FontAwesomeIcon
                                                                className="h-4 w-4"
                                                                icon={
                                                                    faPenToSquare
                                                                }
                                                            />
                                                        </button>
                                                        {currentUser.id !==
                                                            user.id && (
                                                            <button
                                                                onClick={() => {
                                                                    closeDropdown()
                                                                    handleDelete(
                                                                        currentUser.id,
                                                                    )
                                                                }}
                                                                className="text-red-600 hover:text-red-900">
                                                                <TrashIcon className="h-5 w-5" />
                                                            </button>
                                                        )}
                                                    </>
                                                ) : null}
                                            </td>
                                        </div>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <Pagination
                            currentPage={currentPage}
                            totalItems={filteredUsers.length}
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
