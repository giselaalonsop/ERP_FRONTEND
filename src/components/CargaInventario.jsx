'use client'
import React, { useState, useEffect, useRef } from 'react'
import { useProduct } from '@/hooks/useProduct'
import Swal from 'sweetalert2'
import 'tailwindcss/tailwind.css'
import { AutoComplete } from 'primereact/autocomplete'
import 'primereact/resources/themes/saga-blue/theme.css'
import 'primereact/resources/primereact.min.css'
import 'primeicons/primeicons.css'
import AddProductPage from './ProductForm'
import Modal from '@/components/Modal'
import Label from './Label'

const CargaInventario = () => {
    const { products, cargarInventario, addProduct, getProducts } = useProduct()
    const [filteredProducts, setFilteredProducts] = useState([])
    const [selectedProduct, setSelectedProduct] = useState(null)
    const [cantidad, setCantidad] = useState('')
    const [almacen, setAlmacen] = useState(
        localStorage.getItem('almacen') || 'montalban',
    )
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [modalContent, setModalContent] = useState(null)
    const [modalTitle, setModalTitle] = useState('')
    const [isLoading, setIsLoading] = useState(true)
    const [searchQuery, setSearchQuery] = useState('')
    const autoCompleteRef = useRef(null)

    useEffect(() => {
        const fetchProducts = async () => {
            await getProducts()
            setIsLoading(false)
        }
        fetchProducts()
    }, [])

    useEffect(() => {
        if (!isLoading && searchQuery) {
            searchProduct({ query: searchQuery })
        }
    }, [isLoading, searchQuery])

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

    const searchProduct = event => {
        const query = event.query.toLowerCase()
        setSearchQuery(query)
        const filtered = products.filter(
            product =>
                product.nombre.toLowerCase().includes(query) ||
                product.codigo_barras.toLowerCase().includes(query),
        )

        if (filtered.length === 0 && !isLoading) {
            filtered.push({ id: 'new', nombre: 'Agregar nuevo producto' })
        }

        setFilteredProducts(filtered)
    }

    const handleProductSelect = e => {
        const selected = e.value

        if (selected.id === 'new') {
            openModal(
                <AddProductPage onClose={closeModal} />,
                'Add a New Product',
            )
        } else {
            setSelectedProduct(selected)
        }
    }

    const handleSubmit = async e => {
        e.preventDefault()
        if (selectedProduct && cantidad) {
            await cargarInventario(selectedProduct.id, cantidad, almacen)
            setSelectedProduct(null)
            setCantidad('')
        } else {
            Swal.fire('Error', 'Please fill all the fields', 'error')
        }
    }

    return (
        <div className="w-full h-full bg-white rounded-md p-6 flex flex-col">
            <Modal isOpen={isModalOpen} onClose={closeModal} title={modalTitle}>
                {modalContent}
            </Modal>
            <form
                onSubmit={handleSubmit}
                className="flex-grow flex flex-col justify-between">
                <div className="grid grid-cols-2 gap-4 flex-grow">
                    <div className="mb-4 w-full">
                        <label
                            htmlFor="product"
                            className="block mb-2 text-sm font-medium">
                            Product
                        </label>
                        <AutoComplete
                            ref={autoCompleteRef}
                            value={selectedProduct}
                            suggestions={
                                isLoading
                                    ? [{ nombre: 'Cargando...' }]
                                    : filteredProducts
                            }
                            completeMethod={searchProduct}
                            field="nombre"
                            itemTemplate={item => {
                                if (item.nombre === 'Cargando...') {
                                    return <div>{item.nombre}</div>
                                }
                                return item.id !== 'new' ? (
                                    <div>
                                        {item.codigo_barras} - {item.nombre} -{' '}
                                        {item.cantidad_en_stock}
                                    </div>
                                ) : (
                                    <div>{item.nombre}</div>
                                )
                            }}
                            onChange={e => setSelectedProduct(e.value)}
                            onSelect={handleProductSelect}
                            inputClassName={`bg-gray-50 border  text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5`}
                            dropdown
                            forceSelection={false}
                            completeOnFocus
                            style={{ width: '100%' }}
                        />
                    </div>
                    <div className="mb-4 w-full">
                        <label
                            htmlFor="cantidad"
                            className="block mb-2 text-sm font-medium">
                            Cantidad a Cargar
                        </label>
                        <input
                            type="number"
                            id="cantidad"
                            value={cantidad}
                            onChange={e => setCantidad(e.target.value)}
                            className="w-full p-2.5 bg-gray-50 border border-gray-300 rounded-lg focus:ring-primary-600 focus:border-primary-600"
                        />
                    </div>
                    <div className="mb-4 w-full">
                        <label
                            htmlFor="almacen"
                            className="block mb-2 text-sm font-medium">
                            Almacen
                        </label>
                        <select
                            id="almacen"
                            value={almacen}
                            onChange={e => {
                                setAlmacen(e.target.value)
                                localStorage.setItem('almacen', e.target.value)
                            }}
                            className="w-full p-2.5 bg-gray-50 border border-gray-300 rounded-lg focus:ring-primary-600 focus:border-primary-600">
                            <option value="montalban">Montalban</option>
                            <option value="bejuma">Bejuma</option>
                            <option value="bejuma">General</option>
                        </select>
                    </div>
                    <div className="mb-4 w-full">
                        <label
                            htmlFor="Motivo"
                            className="block mb-2 text-sm font-medium">
                            Motivo
                        </label>
                        <input
                            type="description"
                            id="motivo"
                            className="w-full p-2.5 bg-gray-50 border border-gray-300 rounded-lg focus:ring-primary-600 focus:border-primary-600"
                        />
                    </div>
                </div>
                <button
                    type="submit"
                    className="mt-4 bg-green-500 hover:bg-green-700 text-white py-2 px-4 rounded-lg self-end">
                    Cargar Inventario
                </button>
            </form>
        </div>
    )
}

export default CargaInventario
