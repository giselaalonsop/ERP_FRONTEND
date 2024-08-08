'use client'
import React, { useState, useEffect } from 'react'
import Modal from '@/components/Modal'
import AdaptableModal from '@/components/AdaptableModal'

import { useRouter } from 'next/navigation'
import { UsersIcon, ShoppingCartIcon, CubeIcon } from '@heroicons/react/solid'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
    faClockRotateLeft,
    faGear,
    faSquareMinus,
    faUpload,
} from '@fortawesome/free-solid-svg-icons'
import { PlusIcon, DownloadIcon, TrashIcon } from '@heroicons/react/solid'
import SearchWithDropdown from '@/components/SearchWithDropdown'
import AddProductPage from '@/components/ProductForm'
import AnotherForm from '@/components/DescargaInventario'
import ProductsTable from '@/components/Table'
import CargaInventario from '@/components/CargaInventario'
import { useAuth } from '@/hooks/auth'

const Page = () => {
    const { hasPermission, user } = useAuth({ middleware: 'auth' })
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [isAdaptableModalOpen, setIsAdaptableModalOpen] = useState(false)
    const [modalContent, setModalContent] = useState(null)
    const [modalTitle, setModalTitle] = useState('')
    const [selectedCategory, setSelectedCategory] = useState('')
    const [selectedLocation, setSelectedLocation] = useState(user.location)
    const [searchText, setSearchText] = useState('')

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

    const openAdaptableModal = (content, title) => {
        setModalContent(content)
        setModalTitle(title)
        setIsAdaptableModalOpen(true)
    }

    const closeAdaptableModal = () => {
        setIsAdaptableModalOpen(false)
        setModalContent(null)
        setModalTitle('')
    }

    const router = useRouter()

    if (!user) {
        return <p className="text-center">Cargando...</p>
    }

    return (
        <div className="m-6">
            <Modal isOpen={isModalOpen} onClose={closeModal} title={modalTitle}>
                {modalContent}
            </Modal>
            <AdaptableModal
                isOpen={isAdaptableModalOpen}
                onClose={closeAdaptableModal}
                title={modalTitle}>
                {modalContent}
            </AdaptableModal>
            <div className="flex justify-between items-center mb-6">
                <div className="flex space-x-2">
                    {hasPermission(user, 'agregarNuevoProducto') ||
                    user?.rol === 'admin' ? (
                        <button
                            onClick={() =>
                                openModal(
                                    <AddProductPage onClose={closeModal} />,
                                    'Nuevo Producto',
                                )
                            }
                            className="flex items-center px-4 py-2 bg-blue-500 hover:bg-blue-700 text-white font-semibold rounded-md shadow">
                            <PlusIcon className="h-5 w-5 mr-2" />
                            Nuevo Producto
                        </button>
                    ) : null}

                    {hasPermission(user, 'descargaInventario') ||
                    user?.rol === 'admin' ? (
                        <button
                            onClick={() =>
                                openAdaptableModal(
                                    <AnotherForm
                                        onClose={closeAdaptableModal}
                                    />,
                                    'Descarga',
                                )
                            }
                            className="flex items-center px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-md shadow">
                            <FontAwesomeIcon
                                className="h-5 w-5 mr-2"
                                icon={faSquareMinus}
                            />
                            Descarga
                        </button>
                    ) : null}
                    {hasPermission(user, 'cargaInventario') ||
                    user?.rol === 'admin' ? (
                        <button
                            onClick={() =>
                                openAdaptableModal(
                                    <CargaInventario
                                        onClose={closeAdaptableModal}
                                    />,
                                    'Carga',
                                )
                            }
                            className="flex items-center px-4 py-2 bg-yellow-500 hover:bg-yellow-700 text-white font-semibold rounded-md shadow">
                            <FontAwesomeIcon
                                className="h-5 w-5 mr-2"
                                icon={faUpload}
                            />
                            Carga
                        </button>
                    ) : null}
                </div>
                <SearchWithDropdown
                    onCategorySelect={setSelectedCategory}
                    onLocationSelect={setSelectedLocation}
                    onSearchTextChange={setSearchText}
                    initialSelectedLocation={user.location} // Pasar el valor inicial aquí
                />
            </div>

            <ProductsTable
                selectedCategory={selectedCategory}
                selectedLocation={selectedLocation}
                searchText={searchText}
            />
        </div>
    )
}

export default Page
