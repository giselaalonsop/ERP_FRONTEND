'use client'
import React, { useState, useEffect } from 'react'
import { useProduct } from '@/hooks/useProduct'
import { useTheme } from '@/context/ThemeProvider'
import Modal, { ProductModal } from '@/components/Modal'
import 'tailwindcss/tailwind.css'
import AnotherForm from '@/components/DescargaInventario'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrashAlt, faEdit } from '@fortawesome/free-solid-svg-icons'

const ProductTable = ({ selectedCategory, searchText }) => {
    const { isDark } = useTheme()
    const { products, getProducts, removeProduct, updateProduct } = useProduct()
    const [errors, setErrors] = useState(null)
    const [isLoading, setIsLoading] = useState(true)
    const [currentPage, setCurrentPage] = useState(1)
    const [itemsPerPage] = useState(10)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [modalContent, setModalContent] = useState(null)
    const [modalTitle, setModalTitle] = useState('')

    const [selectedLocation, setSelectedLocation] = useState('General')

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
        getProducts().finally(() => setIsLoading(false))
    }, [])

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
        removeProduct(id)
    }

    const handleUpdateProducto = product => {
        openModal(
            <AnotherForm product={product} onClose={closeModal} />,
            'Actualizar Producto',
        )
    }

    const startIndex = (currentPage - 1) * itemsPerPage

    const filteredProducts = products.filter(product => {
        const matchesCategory = selectedCategory
            ? product.categoria === selectedCategory
            : true
        const matchesSearchText =
            product.nombre.toLowerCase().includes(searchText.toLowerCase()) ||
            product.codigo_barras
                .toLowerCase()
                .includes(searchText.toLowerCase())
        const matchesLocation =
            selectedLocation === 'General' ||
            product.ubicacion === selectedLocation
        return matchesCategory && matchesSearchText && matchesLocation
    })

    const selectedProducts = filteredProducts.slice(
        startIndex,
        startIndex + itemsPerPage,
    )

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
                    <div className="flex justify-between">
                        <div>
                            <button
                                className={`relative z-10 inline-flex items-center px-4 py-2 text-sm font-semibold ${
                                    isDark
                                        ? 'text-gray-300 ring-gray-700 hover:bg-gray-800'
                                        : 'text-gray-900 ring-gray-300 hover:bg-gray-50'
                                } ring-1 ring-inset focus:z-20 focus:outline-offset-0`}
                                onClick={() => setSelectedLocation('ejuma')}>
                                Bejuma
                            </button>
                            <button
                                className={`relative z-10 inline-flex items-center px-4 py-2 text-sm font-semibold ${
                                    isDark
                                        ? 'text-gray-300 ring-gray-700 hover:bg-gray-800'
                                        : 'text-gray-900 ring-gray-300 hover:bg-gray-50'
                                } ring-1 ring-inset focus:z-20 focus:outline-offset-0`}
                                onClick={() =>
                                    setSelectedLocation('montalban')
                                }>
                                Montalban
                            </button>
                            <button
                                className={`relative z-10 inline-flex items-center px-4 py-2 text-sm font-semibold ${
                                    isDark
                                        ? 'text-gray-300 ring-gray-700 hover:bg-gray-800'
                                        : 'text-gray-900 ring-gray-300 hover:bg-gray-50'
                                } ring-1 ring-inset focus:z-20 focus:outline-offset-0`}
                                onClick={() => setSelectedLocation('General')}>
                                General
                            </button>
                        </div>
                    </div>
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
                                            : 'divide-gray-200'
                                    }`}>
                                    <thead
                                        className={`${
                                            isDark
                                                ? 'bg-gray-800'
                                                : 'bg-gray-200'
                                        }`}>
                                        <tr>
                                            <th className="py-3.5 px-4 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400">
                                                Código de Barras
                                            </th>
                                            <th className="px-4 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400">
                                                Nombre
                                            </th>
                                            <th className="px-4 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400">
                                                Categoría
                                            </th>
                                            <th className="px-4 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400">
                                                Estado
                                            </th>
                                            <th className="px-4 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400">
                                                Precio de Compra
                                            </th>
                                            <th className="px-4 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400">
                                                Imagen
                                            </th>
                                            <th className="px-4 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400">
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
                                                : 'divide-gray-200'
                                        }`}>
                                        {isLoading ? (
                                            <tr>
                                                <td
                                                    colSpan="7"
                                                    className="px-4 py-4 text-sm text-center text-gray-500 dark:text-gray-300">
                                                    Cargando productos...
                                                </td>
                                            </tr>
                                        ) : selectedProducts.length === 0 ? (
                                            <tr>
                                                <td
                                                    colSpan="7"
                                                    className="px-4 py-4 text-sm text-center text-gray-500 dark:text-gray-300">
                                                    No se encontraron registros
                                                    en esta categoría.
                                                </td>
                                            </tr>
                                        ) : (
                                            selectedProducts.map(
                                                (product, index) => (
                                                    <tr
                                                        key={index}
                                                        className="cursor-pointer">
                                                        <td className="px-4 py-4 text-sm font-medium text-gray-700 dark:text-gray-200 whitespace-nowrap">
                                                            {
                                                                product.codigo_barras
                                                            }
                                                        </td>
                                                        <td className="px-4 py-4 text-sm text-gray-500 dark:text-gray-300 whitespace-nowrap">
                                                            {product.nombre}
                                                        </td>
                                                        <td className="px-4 py-4 text-sm text-gray-500 dark:text-gray-300 whitespace-nowrap">
                                                            {product.categoria}
                                                        </td>
                                                        <td className="px-4 py-4 text-sm font-medium text-gray-700 whitespace-nowrap">
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
                                                        <td className="px-4 py-4 text-sm text-gray-500 dark:text-gray-300 whitespace-nowrap">
                                                            {
                                                                product.precio_compra
                                                            }
                                                        </td>
                                                        <td className="px-4 py-4 text-sm text-gray-500 dark:text-gray-300 whitespace-nowrap">
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
                                                        <td className="px-4 py-4 text-sm text-center whitespace-nowrap">
                                                            <FontAwesomeIcon
                                                                icon={
                                                                    faTrashAlt
                                                                }
                                                                className={`mt-4 cursor-pointer mx-4 ${
                                                                    isDark
                                                                        ? 'text-gray-300 hover:text-red-500'
                                                                        : 'text-gray-700 hover:text-red-500'
                                                                }`}
                                                                size="lg"
                                                                onClick={() =>
                                                                    handleRemoveProduct(
                                                                        product.id,
                                                                    )
                                                                }
                                                            />
                                                            <FontAwesomeIcon
                                                                icon={faEdit}
                                                                className={`mt-4 cursor-pointer mx-2 ${
                                                                    isDark
                                                                        ? 'text-gray-300 hover:text-blue-500'
                                                                        : 'text-gray-700 hover:text-blue-500'
                                                                }`}
                                                                size="lg"
                                                                onClick={() =>
                                                                    handleUpdateProducto(
                                                                        product,
                                                                    )
                                                                }
                                                            />
                                                        </td>
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
                                currentPage * itemsPerPage >= products.length
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
                                        products.length,
                                    )}{' '}
                                </span>
                                de
                                <span className="font-medium">
                                    {' '}
                                    {products.length}{' '}
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
                                        products.length / itemsPerPage,
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
                                                        products.length /
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
                                                products.length / itemsPerPage,
                                            )}
                                        </button>
                                    </>
                                )}
                                <button
                                    onClick={handleNext}
                                    disabled={
                                        currentPage * itemsPerPage >=
                                        products.length
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
