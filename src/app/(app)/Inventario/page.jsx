'use client'
import React, { useState, useEffect } from 'react'
import Modal, { ProductModal } from '@/components/Modal'
import { useAuth } from '@/hooks/auth'
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

const Page = () => {
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [modalContent, setModalContent] = useState(null)
    const [modalTitle, setModalTitle] = useState('')
    const [selectedCategory, setSelectedCategory] = useState('')
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

    const { user } = useAuth({ middleware: 'auth' })
    const router = useRouter()

    useEffect(() => {
        if (user && user.rol !== 'admin') {
            router.push('/dashboard')
        }
    }, [user, router])

    if (!user || (user && user.rol !== 'admin')) {
        return <p>Loading...</p>
    }

    return (
        <div className="m-6">
            <Modal isOpen={isModalOpen} onClose={closeModal} title={modalTitle}>
                {modalContent}
            </Modal>
            <div className="flex justify-between items-center mb-6">
                <div className="flex space-x-2">
                    <button
                        onClick={() =>
                            openModal(
                                <AddProductPage onClose={closeModal} />,
                                'Carga de Inventario',
                            )
                        }
                        className="flex items-center px-4 py-2 bg-blue-500 hover:bg-blue-700 text-white font-semibold rounded-md shadow">
                        <PlusIcon className="h-5 w-5 mr-2" />
                        Nuevo Producto
                    </button>
                    <button
                        onClick={() =>
                            openModal(
                                <AnotherForm onClose={closeModal} />,
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
                    <button
                        onClick={() =>
                            openModal(
                                <CargaInventario onClose={closeModal} />,
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
                </div>
                <SearchWithDropdown
                    onCategorySelect={setSelectedCategory}
                    onSearchTextChange={setSearchText}
                />
            </div>

            <ProductsTable
                selectedCategory={selectedCategory}
                searchText={searchText}
            />

            <div className="mt-6">
                <div className="flex flex-wrap -mx-6">
                    <div className="w-full px-6 sm:w-1/2 xl:w-1/3">
                        <div className="flex items-center px-5 py-6 shadow-sm rounded-md bg-slate-100">
                            <div className="p-3 rounded-full bg-indigo-600 bg-opacity-75">
                                <FontAwesomeIcon
                                    icon={faClockRotateLeft}
                                    className="h-8 w-8 text-white"
                                />
                            </div>
                            <div className="mx-5">
                                <h4 className="text-2xl font-semibold text-gray-700">
                                    4644
                                </h4>
                                <div className="text-gray-500">Rotacion</div>
                            </div>
                        </div>
                    </div>
                    <div className="w-full mt-6 px-6 sm:w-1/2 xl:w-1/3 sm:mt-0">
                        <div className="flex items-center px-5 py-6 shadow-sm rounded-md bg-slate-100">
                            <div className="p-0 rounded-full bg-orange-600 bg-opacity-75">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    strokeWidth={1.5}
                                    stroke="currentColor"
                                    className="size-14 text-white">
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                                    />
                                </svg>
                            </div>
                            <div className="mx-5">
                                <h4 className="text-2xl font-semibold text-gray-700">
                                    3453
                                </h4>
                                <div className="text-gray-500">Agotados</div>
                            </div>
                        </div>
                    </div>
                    <div className="w-full mt-6 px-6 sm:w-1/2 xl:w-1/3 xl:mt-0">
                        <div className="flex items-center px-5 py-6 shadow-sm rounded-md bg-slate-100">
                            <div className="p-3 rounded-full bg-pink-600 bg-opacity-75">
                                <CubeIcon className="h-8 w-8 text-white" />
                            </div>
                            <div className="mx-5">
                                <h4 className="text-2xl font-semibold text-gray-700">
                                    678
                                </h4>
                                <div className="text-gray-500">Disponibles</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Page
