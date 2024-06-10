'use client'
import React, { useState } from 'react'
import { useAuth } from '@/hooks/auth'
import Modal from '@/components/Modal'
import { PlusIcon } from '@heroicons/react/solid'
import { useTheme } from '@/context/ThemeProvider'
import Register from '@/components/RegisterForm'
import Swal from 'sweetalert2'

const Page = () => {
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [modalContent, setModalContent] = useState(null)
    const [modalTitle, setModalTitle] = useState('')
    const [isDropdownOpen, setIsDropdownOpen] = useState(false)
    const [selectedUser, setSelectedUser] = useState(null)
    const {
        user,
        users,
        usersError,
        mutateUsers,
        editUser,
        deleteUser,
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

    if (!user) {
        return <p>Loading...</p>
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
                        Search
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
                            placeholder="Search for users"
                        />
                    </div>
                </div>

                {usersError ? (
                    <div>Error al cargar los usuarios.</div>
                ) : !users ? (
                    <div>Cargando...</div>
                ) : (
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
                                    Name
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Role
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Status
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Action
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map(user => (
                                <tr
                                    key={user.id}
                                    className="border-b cursor-pointer">
                                    <td className="w-4 p-4">
                                        <div className="flex items-center">
                                            <input
                                                id={`checkbox-table-search-${user.id}`}
                                                type="checkbox"
                                                className="w-4 h-4 rounded"
                                            />
                                            <label
                                                htmlFor={`checkbox-table-search-${user.id}`}
                                                className="sr-only">
                                                checkbox
                                            </label>
                                        </div>
                                    </td>
                                    <th
                                        scope="row"
                                        className="flex items-center px-6 py-4 whitespace-nowrap">
                                        <img
                                            className="w-10 h-10 rounded-full"
                                            src="/docs/images/people/profile-picture-1.jpg"
                                            alt={`${user.name} image`}
                                        />
                                        <div className="pl-3">
                                            <div className="text-base font-semibold">
                                                {user.name}
                                            </div>
                                            <div className="font-normal text-gray-500">
                                                {user.email}
                                            </div>
                                        </div>
                                    </th>
                                    <td className="px-6 py-4">{user.rol}</td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center">
                                            <div className="h-2.5 w-2.5 rounded-full bg-green-500 mr-2"></div>
                                            Online
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="relative">
                                            <button
                                                className="font-medium hover:underline"
                                                onClick={() =>
                                                    toggleDropdown(user)
                                                }>
                                                Actions
                                            </button>
                                            {isDropdownOpen &&
                                                selectedUser?.id ===
                                                    user.id && (
                                                    <div
                                                        id="dropdownAction"
                                                        className={`z-10 absolute mt-2 ${
                                                            isDark
                                                                ? 'bg-gray-800 text-white'
                                                                : 'bg-white text-gray-800'
                                                        } rounded-lg shadow w-44`}>
                                                        <ul
                                                            className="py-1 text-sm text-gray-700 dark:text-gray-200"
                                                            aria-labelledby="dropdownActionButton">
                                                            <li>
                                                                <a
                                                                    href="#"
                                                                    className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                                                                    onClick={() => {
                                                                        closeDropdown()
                                                                        handleEdit(
                                                                            user,
                                                                        )
                                                                    }}>
                                                                    Editar
                                                                    Usuario
                                                                </a>
                                                            </li>
                                                            <li>
                                                                <a
                                                                    href="#"
                                                                    className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                                                                    onClick={() => {
                                                                        closeDropdown()
                                                                        handleDelete(
                                                                            user.id,
                                                                        )
                                                                    }}>
                                                                    Eliminar
                                                                    Usuario
                                                                </a>
                                                            </li>
                                                        </ul>
                                                    </div>
                                                )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    )
}

export default Page
