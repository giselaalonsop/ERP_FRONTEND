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

const DescargaInventario = ({ onClose }) => {
    const { products, descargarInventario } = useProduct()
    const [filteredProducts, setFilteredProducts] = useState([])
    const [selectedProduct, setSelectedProduct] = useState(null)
    const [cantidad, setCantidad] = useState('')
    const [almacenDestino, setAlmacenDestino] = useState('')
    const [cantidadAEnviar, setCantidadAEnviar] = useState('')
    const [motivo, setMotivo] = useState('')
    const [cambiarAlmacen, setCambiarAlmacen] = useState(false)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [modalContent, setModalContent] = useState(null)
    const [modalTitle, setModalTitle] = useState('')
    const [searchQuery, setSearchQuery] = useState('')
    const autoCompleteRef = useRef(null)

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
        const filtered = products
            .filter(product => product.cantidad_en_stock > 0)
            .filter(
                product =>
                    product.nombre.toLowerCase().includes(query) ||
                    product.codigo_barras.toLowerCase().includes(query),
            )

        if (filtered.length === 0) {
            filtered.push({ id: 'new', nombre: 'Agregar nuevo producto' })
        }

        setFilteredProducts(filtered)
    }

    const handleProductSelect = e => {
        const selected = e.value

        if (selected.id === 'new') {
            openModal(
                <AddProductPage onClose={closeModal} />,
                'Agregar Nuevo Producto',
            )
        } else {
            setSelectedProduct(selected)
        }
    }

    const handleSubmit = async e => {
        e.preventDefault()
        if (selectedProduct && cantidad && motivo) {
            if (cambiarAlmacen && almacenDestino && cantidadAEnviar) {
                await descargarInventario(
                    selectedProduct.id,
                    cantidad,
                    selectedProduct.ubicacion,
                    almacenDestino,
                    cantidadAEnviar
                )
            } else {
                await descargarInventario(
                    selectedProduct.id,
                    cantidad,
                    selectedProduct.ubicacion
                )
            }
            setSelectedProduct(null)
            setCantidad('')
            setMotivo('')
            setCambiarAlmacen(false)
            setAlmacenDestino('')
            setCantidadAEnviar('')
        } else {
            Swal.fire('Error', 'Por favor completa todos los campos', 'error')
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
                            Producto
                        </label>
                        <AutoComplete
                            ref={autoCompleteRef}
                            value={selectedProduct}
                            suggestions={filteredProducts}
                            completeMethod={searchProduct}
                            field="nombre"
                            itemTemplate={item => (
                                <div>
                                    {item.codigo_barras} - {item.nombre} -{' '}
                                    {item.cantidad_en_stock} - {item.ubicacion}
                                </div>
                            )}
                            onChange={e => setSelectedProduct(e.value)}
                            onSelect={handleProductSelect}
                            inputClassName={`bg-gray-50 border text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5`}
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
                            Cantidad a Descargar
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
                            htmlFor="motivo"
                            className="block mb-2 text-sm font-medium">
                            Motivo de la Descarga
                        </label>
                        <input
                            type="text"
                            id="motivo"
                            value={motivo}
                            onChange={e => setMotivo(e.target.value)}
                            className="w-full p-2.5 bg-gray-50 border border-gray-300 rounded-lg focus:ring-primary-600 focus:border-primary-600"
                        />
                    </div>
                    <div className="mb-4 w-full">
                        <label
                            htmlFor="cambiarAlmacen"
                            className="block mb-2 text-sm font-medium">
                            Cambiar de Almacén
                        </label>
                        <input
                            type="checkbox"
                            id="cambiarAlmacen"
                            checked={cambiarAlmacen}
                            onChange={e => setCambiarAlmacen(e.target.checked)}
                            className="w-full p-2.5 bg-gray-50 border border-gray-300 rounded-lg focus:ring-primary-600 focus:border-primary-600"
                        />
                    </div>
                    {cambiarAlmacen && (
                        <>
                            <div className="mb-4 w-full">
                                <label
                                    htmlFor="almacenDestino"
                                    className="block mb-2 text-sm font-medium">
                                    Almacén Destino
                                </label>
                                <select
                                    id="almacenDestino"
                                    value={almacenDestino}
                                    onChange={e => setAlmacenDestino(e.target.value)}
                                    className="w-full p-2.5 bg-gray-50 border border-gray-300 rounded-lg focus:ring-primary-600 focus:border-primary-600">
                                    <option value="montalban">Montalban</option>
                                    <option value="bejuma">Bejuma</option>
                                </select>
                            </div>
                            <div className="mb-4 w-full">
                                <label
                                    htmlFor="cantidadAEnviar"
                                    className="block mb-2 text-sm font-medium">
                                    Cantidad a Enviar
                                </label>
                                <input
                                    type="number"
                                    id="cantidadAEnviar"
                                    value={cantidadAEnviar}
                                    onChange={e => setCantidadAEnviar(e.target.value)}
                                    className="w-full p-2.5 bg-gray-50 border border-gray-300 rounded-lg focus:ring-primary-600 focus:border-primary-600"
                                />
                            </div>
                        </>
                    )}
                </div>
                <button
                    type="submit"
                    className="mt-4 bg-red-500 hover:bg-red-700 text-white py-2 px-4 rounded-lg self-end">
                    Descargar Inventario
                </button>
            </form>
        </div>
    )
}

export default DescargaInventario
