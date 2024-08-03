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
import { useAuth } from '@/hooks/auth'

const DescargaInventario = ({ onClose }) => {
    const { hasPermission, user } = useAuth({ middleware: 'auth' })
    const { products, descargarInventario } = useProduct()
    const [filteredProducts, setFilteredProducts] = useState([])
    const [selectedProduct, setSelectedProduct] = useState(null)
    const [cantidad, setCantidad] = useState('')
    const [almacenDestino, setAlmacenDestino] = useState('')
    const [motivo, setMotivo] = useState('')
    const [cambiarAlmacen, setCambiarAlmacen] = useState(false)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [modalContent, setModalContent] = useState(null)
    const [modalTitle, setModalTitle] = useState('')
    const [searchQuery, setSearchQuery] = useState('')
    const [errors, setErrors] = useState({})
    const [touched, setTouched] = useState({})
    const autoCompleteRef = useRef(null)

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
            }
        };

        document.addEventListener('keydown', handleKeyDown);

        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, []);

    useEffect(() => {
        const newErrors = {}
        if (touched.product && !selectedProduct) {
            newErrors.product = 'Debe seleccionar un producto'
        }
        if (touched.cantidad && (!cantidad || cantidad <= 0 || (selectedProduct && cantidad > parseFloat(selectedProduct.cantidad_en_stock)))) {
            newErrors.cantidad = 'Debe ingresar una cantidad válida (no mayor a la disponible)'
        }
        if (touched.motivo && !motivo) {
            newErrors.motivo = 'Debe ingresar un motivo'
        }
        setErrors(newErrors)
    }, [selectedProduct, cantidad, motivo, touched])

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
            if (hasPermission(user, 'agregarNuevoProducto') ||
                            user?.rol === 'admin'){
                                filtered.push({ id: 'new', nombre: 'Agregar nuevo producto' })
                            }
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
            setCambiarAlmacen(false) // Resetear el toggle cuando se selecciona un nuevo producto
            setAlmacenDestino('') // Limpiar el almacén destino cuando se selecciona un nuevo producto
            setCantidad('') // Limpiar la cantidad cuando se selecciona un nuevo producto
        }
    }

    const handleBlur = (field) => {
        setTouched({
            ...touched,
            [field]: true,
        })
    }

    const validateForm = () => {
        const newErrors = {}
        if (!selectedProduct) newErrors.product = 'Debe seleccionar un producto'
        if (!cantidad || cantidad <= 0 || cantidad > selectedProduct.cantidad_en_stock) {
            newErrors.cantidad = 'Debe ingresar una cantidad válida (no mayor a la disponible)'
        }
        if (almacenDestino == 'seleccionar ubicacion') newErrors.almacenDestino = 'Debe seleccionar un almacén destino'
        if (!motivo) newErrors.motivo = 'Debe ingresar un motivo'
        setErrors(newErrors)
        setTouched({
            product: true,
            cantidad: true,
            motivo: true,
            almacenDestino: true,
        })
        return Object.keys(newErrors).length === 0
    }

    const handleSubmit = async e => {
        e.preventDefault(); // Evitar el comportamiento predeterminado del formulario
        if (validateForm()) {
            const cantidadAEnviar = cambiarAlmacen ? cantidad : 0
            const ubicacion = cambiarAlmacen ? almacenDestino : null
            await descargarInventario(
                selectedProduct.id,
                cantidad,
                selectedProduct.ubicacion,
                ubicacion,
                cantidadAEnviar // Aquí usamos 0 si no se cambia el almacén
            )
            setSelectedProduct(null)
            setCantidad('')
            setMotivo('')
            setCambiarAlmacen(false)
            setAlmacenDestino('')
            setTouched({})
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
                            inputClassName={`bg-gray-50 border text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 ${
                                errors.product ? 'border-red-500' : 'border-gray-300'
                            }`}
                            placeholder="Ingrese nombre o codigo del producto..."
                            dropdown
                            forceSelection={false}
                            completeOnFocus
                            style={{ width: '100%' }}
                            showClear // Mostrar el botón de limpiar
                            autoHighlight // Resaltar automáticamente el primer elemento de la lista
                            onBlur={() => handleBlur('product')}
                        />
                        {errors.product && (
                            <div className="text-red-500 text-sm mt-1">{errors.product}</div>
                        )}
                    </div>
                    <div className="mb-8 w-full">
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
                            min="0" // Añadir min para evitar números negativos
                            className={`w-full p-2.5 bg-gray-50 border text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 ${
                                errors.cantidad ? 'border-red-500' : 'border-gray-300'
                            }`}
                            placeholder="Ingrese la cantidad a descargar"
                            onBlur={() => handleBlur('cantidad')}
                        />
                        {errors.cantidad && (
                            <div className="text-red-500 text-sm mt-1">{errors.cantidad}</div>
                        )}
                    </div>
                    <div className="mb-8 w-full">
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
                            className={`w-full p-2.5 bg-gray-50 border text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 ${
                                errors.motivo ? 'border-red-500' : 'border-gray-300'
                            }`}
                            placeholder="Ingrese el motivo de la descarga"
                            onBlur={() => handleBlur('motivo')}
                        />
                        {errors.motivo && (
                            <div className="text-red-500 text-sm mt-1">{errors.motivo}</div>
                        )}
                    </div>
                    <div className="mb-4 w-full m-7 ">
                        <div className='flex items-center'>
                            <label className="block mb-2 text-sm font-medium cursor-pointer mr-2">
                                <input
                                type="checkbox"
                                checked={cambiarAlmacen}
                                onChange={e => setCambiarAlmacen(e.target.checked)}
                                className="sr-only peer"
                                disabled={!selectedProduct} // Deshabilitar si no se ha seleccionado un producto
                                />
                            <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                        <span className="text-sm font-medium text-gray-900">
                            Cambiar de Almacén
                        </span>
                        </div>
                    </div>
                    {cambiarAlmacen && selectedProduct && (
                        <div className="mb-8 w-full">
                            <label
                                htmlFor="almacenDestino"
                                className="block mb-2 text-sm font-medium">
                                Almacén Destino
                            </label>
                            <select
                                id="almacenDestino"
                                value={almacenDestino}
                                onBlur={() => handleBlur('almacenDestino')}
                                onChange={e => setAlmacenDestino(e.target.value)}
                                className="w-full p-2.5 bg-gray-50 border border-gray-300 rounded-lg focus:ring-primary-600 focus:border-primary-600">
                                {['seleccionar ubicacion','montalban', 'bejuma']
                                    .filter(almacen => almacen !== selectedProduct.ubicacion) // Excluir la ubicación actual del producto
                                    .map(almacen => (
                                        <option key={almacen} value={almacen}>
                                            {almacen.charAt(0).toUpperCase() + almacen.slice(1)}
                                        </option>
                                    ))}
                            </select>
                        </div>
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
