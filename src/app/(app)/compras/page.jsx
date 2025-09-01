'use client'
import React, { useState, useEffect } from 'react'
import Modal from '@/components/Modal'
import { useAuth } from '@/hooks/auth'
import { useRouter } from 'next/navigation'
import { useCompras } from '@/hooks/useCompras'
import RegisterCompra from '@/components/RegisterCompra'
import ComprasTable from '@/components/ComprasTable'
import Swal from 'sweetalert2'
import { PlusIcon } from '@heroicons/react/solid'
import { ChevronDownIcon, SearchIcon } from '@heroicons/react/solid'
import { AutoComplete } from 'primereact/autocomplete'

const Page = () => {
    const { hasPermission, user } = useAuth({ middleware: 'auth' })
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [modalContent, setModalContent] = useState(null)
    const [modalTitle, setModalTitle] = useState('')

    const [searchQuery, setSearchQuery] = useState('')
    const [searchEstado, setSearchEstado] = useState('')

    const router = useRouter()
    const { compras, comprasError } = useCompras()

    useEffect(() => {
        if (user && user.rol !== 'admin') {
            router.push('/dashboard')
        }
    }, [user, router])

    if (!user || (user && user.rol !== 'admin')) {
        return <p className="text-center">Cargando...</p>
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

  

   

    const handleFilterEstado = e => {
        setSearchEstado(e.target.value)
    }



    return (
        <div className="m-6">
            <Modal isOpen={isModalOpen} onClose={closeModal} title={modalTitle}>
                {modalContent}
            </Modal>
            <div className="flex justify-between items-center mb-6">
                {hasPermission(user, 'registrarCompras') ||
                user?.rol === 'admin' ? (
                    <button
                        onClick={() =>
                            openModal(
                                <RegisterCompra onClose={closeModal} />,
                                'Nueva Compra',
                            )
                        }
                        className="flex items-center px-4 py-2 bg-blue-500 hover:bg-blue-700 text-white font-semibold rounded-md shadow">
                        <PlusIcon className="h-5 w-5 mr-2" />
                        Nueva Compra
                    </button>
                ) : null}
                <div className="flex items-center space-x-4">
                    <div className="relative w-64">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                            <SearchIcon
                                className="w-5 h-5 text-gray-500 dark:text-gray-400"
                                aria-hidden="true"
                            />
                        </div>
                       
                    </div>
                    <div className="flex items-center">
                        <label
                            htmlFor="estado"
                            className="mr-2 text-sm font-medium text-gray-900">
                            Estado
                        </label>
                        <select
                            id="estado"
                            value={searchEstado}
                            onChange={handleFilterEstado}
                            className="block w-full p-2 text-sm bg-gray-50 border text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600">
                            <option value="">Todos</option>
                            <option value="pendiente">Pendiente</option>
                            <option value="pagada">Pagada</option>
                        </select>
                    </div>
                </div>
            </div>

            <ComprasTable compras={filteredCompras} />
        </div>
    )
}

export default Page
