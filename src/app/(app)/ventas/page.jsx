'use client'
import React, { useState, useRef, useMemo } from 'react'
import { useVentas } from '@/hooks/useVentas'
import { EyeIcon, TrashIcon, DocumentIcon } from '@heroicons/react/outline'
import Swal from 'sweetalert2'
import Pagination from '@/components/Pagination'
import Factura from '@/components/Factura'
import Modal from '@/components/Modal'
import { faDownload } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'
import { useClientes } from '@/hooks/useClients'
import ReactDOM from 'react-dom'
import { format } from 'date-fns'

const SalesTable = () => {
    const { ventas, ventasError, deleteVenta } = useVentas()
    const [currentPage, setCurrentPage] = useState(1)
    const itemsPerPage = 10
    const printRef = useRef()
    const [selectedVenta, setSelectedVenta] = useState(null)
    const configuracion = JSON.parse(localStorage.getItem('configuracion'))
    const { clientes } = useClientes()
    const [searchQuery, setSearchQuery] = useState('')
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [modalContent, setModalContent] = useState(null)
    const [modalTitle, setModalTitle] = useState('')

    const formatDate = dateString => {
        const date = new Date(dateString)
        if (isNaN(date)) {
            return 'Fecha inválida'
        }
        return format(date, 'dd-MM-yyyy HH:mm:ss')
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
                deleteVenta(id)
            }
        })
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

    const viewDetails = venta => {
        openModal(<Factura venta={venta} pdf={false} />, 'Detalles de la venta')
    }

    const generateInvoice = async venta => {
        const cliente = clientes?.find(
            cliente => cliente.cedula === venta.cliente,
        )
        const element = <Factura venta={venta} ref={printRef} />

        const container = document.createElement('div')
        document.body.appendChild(container)
        ReactDOM.render(element, container)

        const pdf = new jsPDF('p', 'pt', 'a4')
        const pdfWidth = pdf.internal.pageSize.getWidth()
        const pdfHeight = 600
        const canvas = await html2canvas(printRef.current, { scale: 2 })
        const imgData = canvas.toDataURL('image/png')
        pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight)
        pdf.save(`invoice-${venta.numero_de_venta}.pdf`)

        document.body.removeChild(container)
    }

    if (ventasError) return <div>Error al cargar las ventas.</div>
    if (!ventas) return <div>Cargando...</div>

    // Ordenar y filtrar las ventas antes del render
    const sortedVentas = ventas.sort(
        (a, b) => new Date(b.created_at) - new Date(a.created_at),
    )

    const filteredVentas = !searchQuery
        ? sortedVentas
        : sortedVentas.filter(venta => {
              const cliente = clientes?.find(
                  cliente => cliente.cedula === venta.cliente,
              )
              const clienteNombre = cliente ? cliente.nombre.toLowerCase() : ''
              const clienteCedula = cliente ? cliente.cedula.toLowerCase() : ''
              return (
                  clienteNombre.includes(searchQuery.toLowerCase()) ||
                  clienteCedula.includes(searchQuery.toLowerCase())
              )
          })

    const startIndex = (currentPage - 1) * itemsPerPage
    const paginatedVentas = filteredVentas.slice(
        startIndex,
        startIndex + itemsPerPage,
    )

    return (
        <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
            <div className="flex items-center justify-between flex-wrap md:flex-row space-y-4 md:space-y-0 pb-4 bg-transparent">
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
                        placeholder="Buscar por nombre o cédula"
                        value={searchQuery}
                        onChange={e => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>
            <Modal isOpen={isModalOpen} onClose={closeModal} title={modalTitle}>
                {modalContent}
            </Modal>
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
                    {paginatedVentas.map(venta => (
                        <tr key={venta.id} className="bg-white border-b">
                            <td className="px-6 py-4">{venta.cliente}</td>
                            <td className="px-6 py-4">{venta.usuario}</td>
                            <td className="px-6 py-4">
                                {venta.numero_de_venta}
                            </td>
                            <td className="px-6 py-4">
                                {venta.total_venta_dol}
                            </td>
                            <td className="px-6 py-4">
                                {formatDate(venta.created_at)}
                            </td>
                            <td className="px-6 py-4 flex space-x-2">
                                <button
                                    onClick={() => viewDetails(venta)}
                                    className="text-blue-600 hover:text-blue-900">
                                    <EyeIcon className="h-5 w-5" />
                                </button>
                                <button
                                    onClick={() => generateInvoice(venta)}
                                    className="text-green-600 hover:text-green-900">
                                    <FontAwesomeIcon
                                        icon={faDownload}
                                        className="h-5 w-5"
                                    />
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
                totalItems={filteredVentas.length}
                itemsPerPage={itemsPerPage}
                onPageChange={setCurrentPage}
            />
        </div>
    )
}

export default SalesTable
