'use client'
import React, { useState, useEffect } from 'react'
import { useProduct } from '@/hooks/useProduct'
import { useTheme } from '@/context/ThemeProvider'
import Modal from '@/components/Modal'
import 'tailwindcss/tailwind.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { EyeIcon, TrashIcon } from '@heroicons/react/outline'
import { faPenToSquare } from '@fortawesome/free-solid-svg-icons'
import AddProductPage from './ProductForm'
import ProductDetail from './ProductDetail'
import Swal from 'sweetalert2'

const ProductTable = ({ selectedCategory, searchText, selectedLocation }) => {
    const { isDark } = useTheme()
    const { products, removeProduct } = useProduct()
    const [errors, setErrors] = useState(null)
    const [isLoading, setIsLoading] = useState(true)
    const [currentPage, setCurrentPage] = useState(1)
    const [itemsPerPage] = useState(10)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [modalContent, setModalContent] = useState(null)
    const [modalTitle, setModalTitle] = useState('')

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

    useEffect(() => {
        if (products) {
            setIsLoading(false)
        }
    }, [products])

    const handlePrevious = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1)
        }
    }

    const handleNext = () => {
        if (currentPage * itemsPerPage < products.length) {
            setCurrentPage(currentPage + 1)
        }
    }

    const handleRemoveProduct = id => {
        Swal.fire({
            title: '¿Está seguro?',
            text: 'No podrás revertir esto!',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sí, eliminarlo!',
        }).then(result => {
            if (result.isConfirmed) {
                removeProduct(id)
            }
        })
    }

    const handleUpdateProduct = product => {
        openModal(
            <AddProductPage product={product} onClose={closeModal} />,
            'Actualizar Producto',
        )
    }

    const handleShowProduct = product => {
        openModal(<ProductDetail product={product} />, 'Detalles del Producto')
    }

    const startIndex = (currentPage - 1) * itemsPerPage

    const filteredProducts =
        products?.filter(product => {
            const matchesCategory = selectedCategory
                ? product.categoria.toLowerCase() ===
                  selectedCategory.toLowerCase()
                : true
            const matchesSearchText =
                product.nombre
                    .toLowerCase()
                    .includes(searchText.toLowerCase()) ||
                product.codigo_barras
                    .toLowerCase()
                    .includes(searchText.toLowerCase())
            const matchesLocation =
                selectedLocation === 'General' ||
                product.ubicacion.toLowerCase() ===
                    selectedLocation.toLowerCase()
            return matchesCategory && matchesSearchText && matchesLocation
        }) || []

    const selectedProducts = filteredProducts?.slice(
        startIndex,
        startIndex + itemsPerPage,
    )

    const calculatePrecioVenta = (precioCompra, porcentajeGanancia) => {
        const precioVenta =
            parseFloat(precioCompra) +
            parseFloat(precioCompra) * (parseFloat(porcentajeGanancia) / 100)
        return isNaN(precioVenta) ? 0 : precioVenta
    }

    if (errors) {
        return (
            <div className="text-red-500">Error al cargar los productos.</div>
        )
    }

    return (
        <>
            <section>
                <Modal
                    isOpen={isModalOpen}
                    onClose={closeModal}
                    title={modalTitle}>
                    {modalContent}
                </Modal>
                <div className="flex flex-col mb-4">
                    <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                        <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
                            <div
                                className={`overflow-hidden border ${
                                    isDark
                                        ? 'border-gray-700 dark:bg-gray-900'
                                        : 'border-gray-200 bg-white'
                                } md:rounded-lg`}>
                                <table
                                    className={`min-w-full divide-y ${
                                        isDark
                                            ? 'divide-gray-700'
                                            : 'divide-gray-300'
                                    }`}>
                                    <thead
                                        className={`${
                                            isDark
                                                ? 'bg-gray-800'
                                                : 'bg-gray-200'
                                        }`}>
                                        <tr>
                                            <th className="py-3.5 px-4 text-sm font-normal text-left rtl:text-right text-gray-800 dark:text-gray-400">
                                                Código de Barras
                                            </th>
                                            <th className="px-4 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-800 dark:text-gray-400">
                                                Nombre
                                            </th>
                                            <th className="px-4 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-800 dark:text-gray-400">
                                                Categoría
                                            </th>
                                            <th className="px-4 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-800 dark:text-gray-400">
                                                Estado
                                            </th>
                                            <th className="px-4 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-800 dark:text-gray-400">
                                                Precio de Compra
                                            </th>
                                            <th className="px-4 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-800 dark:text-gray-400">
                                                Precio de Venta
                                            </th>
                                            <th className="px-4 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-800 dark:text-gray-400">
                                                Cantidad en Stock
                                            </th>
                                            <th className="px-4 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-800 dark:text-gray-400">
                                                Ubicación
                                            </th>
                                            <th className="px-4 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-800 dark:text-gray-400">
                                                Imagen
                                            </th>
                                            <th className="px-4 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-800 dark:text-gray-400">
                                                Acción
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody
                                        className={`bg-white ${
                                            isDark ? 'dark:bg-gray-900' : ''
                                        } divide-y ${
                                            isDark
                                                ? 'divide-gray-700'
                                                : 'divide-gray-300'
                                        }`}>
                                        {isLoading ? (
                                            <tr>
                                                <td
                                                    colSpan="10"
                                                    className="px-4 py-4 text-sm text-center text-gray-500 dark:text-gray-300">
                                                    Cargando productos...
                                                </td>
                                            </tr>
                                        ) : selectedProducts?.length === 0 ? (
                                            <tr>
                                                <td
                                                    colSpan="10"
                                                    className="px-4 py-4 text-sm text-center text-gray-500 dark:text-gray-300">
                                                    No se encontraron registros
                                                    en esta categoría.
                                                </td>
                                            </tr>
                                        ) : (
                                            selectedProducts?.map(
                                                (product, index) => (
                                                    <tr
                                                        key={index}
                                                        className="cursor-pointer">
                                                        <td className="px-4 py-4 text-sm font-medium text-gray-800 dark:text-gray-200 whitespace-nowrap">
                                                            {
                                                                product.codigo_barras
                                                            }
                                                        </td>
                                                        <td className="px-4 py-4 text-sm text-gray-800 dark:text-gray-300 whitespace-nowrap">
                                                            {product.nombre}
                                                        </td>
                                                        <td className="px-4 py-4 text-sm text-gray-800 dark:text-gray-300 whitespace-nowrap">
                                                            {product.categoria}
                                                        </td>
                                                        <td className="px-4 py-4 text-sm font-medium text-gray-800 whitespace-nowrap">
                                                            <div
                                                                className={`inline-flex items-center px-3 py-1 rounded-full gap-x-2 ${
                                                                    product.cantidad_en_stock >
                                                                    0
                                                                        ? isDark
                                                                            ? 'text-emerald-500 bg-emerald-500/20'
                                                                            : 'text-emerald-500 bg-emerald-100/60'
                                                                        : isDark
                                                                        ? 'text-red-500 bg-red-500/20'
                                                                        : 'text-red-500 bg-red-100/60'
                                                                }`}>
                                                                <svg
                                                                    width="12"
                                                                    height="12"
                                                                    viewBox="0 0 12 12"
                                                                    fill="none"
                                                                    xmlns="http://www.w3.org/2000/svg">
                                                                    <path
                                                                        d={
                                                                            product.cantidad_en_stock >
                                                                            0
                                                                                ? 'M10 3L4.5 8.5L2 6'
                                                                                : 'M9 3L3 9M3 3L9 9'
                                                                        }
                                                                        stroke="currentColor"
                                                                        strokeWidth="1.5"
                                                                        strokeLinecap="round"
                                                                        strokeLinejoin="round"
                                                                    />
                                                                </svg>
                                                                <h2 className="text-sm font-normal">
                                                                    {product.cantidad_en_stock >
                                                                    0
                                                                        ? 'Disponible'
                                                                        : 'Agotado'}
                                                                </h2>
                                                            </div>
                                                        </td>
                                                        <td className="px-4 py-4 text-sm text-gray-800 dark:text-gray-300 whitespace-nowrap">
                                                            {
                                                                product.precio_compra
                                                            }
                                                        </td>
                                                        <td className="px-4 py-4 text-sm text-gray-800 dark:text-gray-300 whitespace-nowrap">
                                                            {calculatePrecioVenta(
                                                                product.precio_compra,
                                                                product.porcentaje_ganancia,
                                                            ).toFixed(2)}
                                                        </td>
                                                        <td className="px-4 py-4 text-sm text-gray-800 dark:text-gray-300 whitespace-nowrap">
                                                            {
                                                                product.cantidad_en_stock
                                                            }
                                                        </td>
                                                        <td className="px-4 py-4 text-sm text-gray-800 dark:text-gray-300 whitespace-nowrap">
                                                            {product.ubicacion}
                                                        </td>
                                                        <td className="px-4 py-4 text-sm text-gray-800 dark:text-gray-300 whitespace-nowrap">
                                                            <img
                                                                className="w-16 h-16 object-cover rounded"
                                                                src={
                                                                    product.imagen
                                                                }
                                                                alt={
                                                                    product.nombre
                                                                }
                                                            />
                                                        </td>
                                                        <div className="relative">
                                                            <td className="px-6 py-4 flex space-x-2">
                                                                <button
                                                                    onClick={() =>
                                                                        handleShowProduct(
                                                                            product,
                                                                        )
                                                                    }
                                                                    className="text-blue-600 hover:text-blue-900">
                                                                    <EyeIcon className="h-5 w-5" />
                                                                </button>
                                                                <button
                                                                    onClick={() => {
                                                                        handleUpdateProduct(
                                                                            product,
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
                                                                <button
                                                                    onClick={() => {
                                                                        handleRemoveProduct(
                                                                            product.id,
                                                                        )
                                                                    }}
                                                                    className="text-red-600 hover:text-red-900">
                                                                    <TrashIcon className="h-5 w-5" />
                                                                </button>
                                                            </td>
                                                        </div>
                                                    </tr>
                                                ),
                                            )
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
                <div
                    className={`flex items-center justify-between border-t ${
                        isDark
                            ? 'border-gray-700 bg-gray-900'
                            : 'border-gray-200 bg-white'
                    } px-4 py-3 sm:px-6`}>
                    <div className="flex flex-1 justify-between sm:hidden">
                        <button
                            onClick={handlePrevious}
                            disabled={currentPage === 1}
                            className={`relative inline-flex items-center rounded-md border ${
                                isDark
                                    ? 'border-gray-700 bg-gray-900 text-gray-300 hover:bg-gray-800'
                                    : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
                            } px-4 py-2 text-sm font-medium`}>
                            Anterior
                        </button>
                        <button
                            onClick={handleNext}
                            disabled={
                                currentPage * itemsPerPage >= products?.length
                            }
                            className={`relative ml-3 inline-flex items-center rounded-md border ${
                                isDark
                                    ? 'border-gray-700 bg-gray-900 text-gray-300 hover:bg-gray-800'
                                    : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
                            } px-4 py-2 text-sm font-medium`}>
                            Siguiente
                        </button>
                    </div>
                    <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                        <div>
                            <p
                                className={`text-sm ${
                                    isDark ? 'text-gray-300' : 'text-gray-700'
                                }`}>
                                Mostrando
                                <span className="font-medium">
                                    {' '}
                                    {startIndex + 1}{' '}
                                </span>
                                a
                                <span className="font-medium">
                                    {' '}
                                    {Math.min(
                                        startIndex + itemsPerPage,
                                        products?.length,
                                    )}{' '}
                                </span>
                                de
                                <span className="font-medium">
                                    {' '}
                                    {products?.length}{' '}
                                </span>
                                resultados
                            </p>
                        </div>
                        <div>
                            <nav
                                className="isolate inline-flex -space-x-px rounded-md shadow-sm"
                                aria-label="Pagination">
                                <button
                                    onClick={handlePrevious}
                                    disabled={currentPage === 1}
                                    className={`relative inline-flex items-center rounded-l-md px-2 py-2 ${
                                        isDark
                                            ? 'text-gray-400 ring-gray-700 hover:bg-gray-800'
                                            : 'text-gray-400 ring-gray-300 hover:bg-gray-50'
                                    } ring-1 ring-inset focus:z-20 focus:outline-offset-0`}>
                                    <span className="sr-only">Anterior</span>
                                    <svg
                                        className="h-5 w-5"
                                        viewBox="0 0 20 20"
                                        fill="currentColor"
                                        aria-hidden="true">
                                        <path
                                            fillRule="evenodd"
                                            d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z"
                                            clipRule="evenodd"
                                        />
                                    </svg>
                                </button>
                                <button
                                    className={`relative z-10 inline-flex items-center px-4 py-2 text-sm font-semibold ${
                                        currentPage === 1
                                            ? 'bg-indigo-600 text-white'
                                            : isDark
                                            ? 'text-gray-300 ring-gray-700 hover:bg-gray-800'
                                            : 'text-gray-900 ring-gray-300 hover:bg-gray-50'
                                    } ring-1 ring-inset focus:z-20 focus:outline-offset-0`}>
                                    {currentPage}
                                </button>
                                {currentPage <
                                    Math.ceil(
                                        products?.length / itemsPerPage,
                                    ) && (
                                    <>
                                        <button
                                            onClick={handleNext}
                                            className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold ${
                                                isDark
                                                    ? 'text-gray-300 ring-gray-700 hover:bg-gray-800'
                                                    : 'text-gray-900 ring-gray-300 hover:bg-gray-50'
                                            } ring-1 ring-inset focus:z-20 focus:outline-offset-0`}>
                                            {currentPage + 1}
                                        </button>
                                        <span
                                            className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold ${
                                                isDark
                                                    ? 'text-gray-700 ring-gray-700'
                                                    : 'text-gray-700 ring-gray-300'
                                            } ring-1 ring-inset focus:outline-offset-0`}>
                                            ...
                                        </span>
                                        <button
                                            onClick={() =>
                                                setCurrentPage(
                                                    Math.ceil(
                                                        products?.length /
                                                            itemsPerPage,
                                                    ),
                                                )
                                            }
                                            className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold ${
                                                isDark
                                                    ? 'text-gray-300 ring-gray-700 hover:bg-gray-800'
                                                    : 'text-gray-900 ring-gray-300 hover:bg-gray-50'
                                            } ring-1 ring-inset focus:z-20 focus:outline-offset-0`}>
                                            {Math.ceil(
                                                products?.length / itemsPerPage,
                                            )}
                                        </button>
                                    </>
                                )}
                                <button
                                    onClick={handleNext}
                                    disabled={
                                        currentPage * itemsPerPage >=
                                        products?.length
                                    }
                                    className={`relative inline-flex items-center rounded-r-md px-2 py-2 ${
                                        isDark
                                            ? 'text-gray-400 ring-gray-700 hover:bg-gray-800'
                                            : 'text-gray-400 ring-gray-300 hover:bg-gray-50'
                                    } ring-1 ring-inset focus:z-20 focus:outline-offset-0`}>
                                    <span className="sr-only">Siguiente</span>
                                    <svg
                                        className="h-5 w-5"
                                        viewBox="0 0 20 20"
                                        fill="currentColor"
                                        aria-hidden="true">
                                        <path
                                            fillRule="evenodd"
                                            d="M7.21 14.77a.75.75 0 01-.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z"
                                            clipRule="evenodd"
                                        />
                                    </svg>
                                </button>
                            </nav>
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}

export default ProductTable
