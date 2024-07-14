'use client'
import React, { useState, useEffect, useRef } from 'react'
import { useProduct } from '@/hooks/useProduct'
import Swal from 'sweetalert2'
import 'tailwindcss/tailwind.css'
import { AutoComplete } from 'primereact/autocomplete'
import 'primereact/resources/themes/saga-blue/theme.css'
import 'primereact/resources/primereact.min.css'
import 'primeicons/primeicons.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrashAlt } from '@fortawesome/free-solid-svg-icons'
import { useAuth } from '@/hooks/auth'
import { useVentas } from '@/hooks/useVentas'
import { useClientes } from '@/hooks/useClients'
import RegisterCliente from '@/components/RegisterClient'
import Pagination from '@/components/Pagination'
import Modal from '@/components/Modal'
import { useTheme } from '@/context/ThemeProvider'
import ConfirmFactura from '@/components/ConfirmFactura'

const Facturacion = () => {
    const { isDark } = useTheme()
    const [procesado, setProcesado] = useState(false)
    const [factura, setFactura] = useState(false)
    const { products: productos } = useProduct()
    const [formaVenta, setFormaVenta] = useState('')
    const { user } = useAuth()
    const { addVenta } = useVentas()
    const { clientes, mutateClientes } = useClientes()
    const [filteredProducts, setFilteredProducts] = useState([])
    const [selectedProducts, setSelectedProducts] = useState([])
    const [searchTerm, setSearchTerm] = useState('')
    const [selectedProduct, setSelectedProduct] = useState(null)
    const [currentPage, setCurrentPage] = useState(1)
    const itemsPerPage = 10
    const autoCompleteRef = useRef(null)
    const [cliente, setCliente] = useState(null)
    const [filteredClientes, setFilteredClientes] = useState([])
    const [
        isRegisterClienteModalOpen,
        setIsRegisterClienteModalOpen,
    ] = useState(false)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [modalContent, setModalContent] = useState(null)
    const [modalTitle, setModalTitle] = useState('')
    const [isMayor, setIsMayor] = useState(false)

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
        mutateClientes()
    }, [mutateClientes])

    useEffect(() => {
        factura
    }, [factura])

    useEffect(() => {
        if (searchTerm.length >= 3) {
            const results = productos?.filter(
                product =>
                    product.cantidad_en_stock > 0 &&
                    product.ubicacion.toLowerCase() ===
                        user.location.toLowerCase() &&
                    (product.nombre
                        .toLowerCase()
                        .includes(searchTerm.toLowerCase()) ||
                        product.codigo_barras
                            .toLowerCase()
                            .includes(searchTerm.toLowerCase())),
            )
            setFilteredProducts(results)
        } else {
            setFilteredProducts([])
        }
    }, [searchTerm, productos, user.location])

    const handleAddProduct = product => {
        const descuentoCliente = cliente ? cliente.descuento : 0
        const porcentajeGanancia = isMayor
            ? product.porcentaje_ganancia_mayor
            : product.porcentaje_ganancia
        const formaDeVenta = isMayor
            ? product.forma_de_venta_mayor
            : product.forma_de_venta
        const precioVenta =
            product.precio_compra *
            (1 + (porcentajeGanancia - descuentoCliente) / 100)

        setSelectedProducts(prev => {
            const existingProductIndex = prev.findIndex(
                p => p.codigo_barras === product.codigo_barras,
            )
            if (existingProductIndex > -1) {
                return prev
            }

            return [
                ...prev,
                {
                    ...product,
                    precio_venta: precioVenta,
                    cantidad: formaDeVenta === 'peso' ? 0.1 : 1,
                    total: precioVenta * (formaDeVenta === 'peso' ? 0.1 : 1),
                    forma_de_venta: formaDeVenta,
                },
            ]
        })

        setSearchTerm('')
        setFilteredProducts([])
        setSelectedProduct(null)
    }

    const handleQuantityChange = (index, cantidad) => {
        const updatedProducts = [...selectedProducts]
        const product = updatedProducts[index]
        const formaDeVenta = isMayor
            ? product.forma_de_venta_mayor
            : product.forma_de_venta
        const isDecimal = formaDeVenta === 'peso'

        if (
            cantidad === '' ||
            parseFloat(cantidad) <= product.cantidad_en_stock
        ) {
            updatedProducts[index].cantidad =
                cantidad === ''
                    ? ''
                    : parseFloat(cantidad).toFixed(isDecimal ? 1 : 0)
            updatedProducts[index].total =
                cantidad === ''
                    ? 0
                    : parseFloat(cantidad) * updatedProducts[index].precio_venta
            setSelectedProducts(updatedProducts)
        }
    }

    const handleQuantityBlur = (index, cantidad) => {
        const updatedProducts = [...selectedProducts]
        const product = updatedProducts[index]
        const formaDeVenta = isMayor
            ? product.forma_de_venta_mayor
            : product.forma_de_venta
        const isDecimal = formaDeVenta === 'peso'

        if (cantidad === '' || parseFloat(cantidad) < (isDecimal ? 0.1 : 1)) {
            updatedProducts[index].cantidad = isDecimal ? 0.1 : 1
            updatedProducts[index].total =
                updatedProducts[index].cantidad *
                updatedProducts[index].precio_venta
        } else {
            updatedProducts[index].cantidad = parseFloat(cantidad).toFixed(
                isDecimal ? 1 : 0,
            )
            updatedProducts[index].total =
                updatedProducts[index].cantidad *
                updatedProducts[index].precio_venta
        }
        setSelectedProducts(updatedProducts)
    }

    const handleRemoveProduct = index => {
        setSelectedProducts(prev => prev.filter((_, i) => i !== index))
    }

    const handleFacturaSuccess = () => {
        setSelectedProducts([])
        setCliente(null)
    }

    const handleFacturar = async () => {
        if (!cliente || selectedProducts.length === 0) {
            Swal.fire(
                'Error',
                'Debe ingresar productos a facturar y seleccionar un cliente',
                'error',
            )
            return
        }

        openModal(
            <ConfirmFactura
                setProcesado={setProcesado}
                TotalGeneral={totalGeneral}
                cliente={cliente}
                selectedProducts={selectedProducts}
                location={user.location}
                onSuccess={handleFacturaSuccess}
                isMayor={isMayor} // Pasamos el estado isMayor
            />,
            'Metodo de pago',
        )
    }

    const totalGeneral = selectedProducts.reduce(
        (acc, product) => acc + product.total,
        0,
    )

    const searchProduct = event => {
        setSearchTerm(event.query)
    }

    const searchCliente = event => {
        const query = event.query.toLowerCase()
        const results = clientes.filter(cliente =>
            cliente.cedula.toLowerCase().includes(query),
        )
        setFilteredClientes(results)

        if (results.length === 0) {
            setFilteredClientes([
                { cedula: 'Agregar nuevo cliente', nombre: '' },
            ])
        }
    }

    const handleClienteSelect = e => {
        const selected = e.value
        if (selected.cedula === 'Agregar nuevo cliente') {
            setCliente(null)
            openModal(
                <RegisterCliente
                    onClose={closeModal}
                    onSave={handleClienteSave}
                />,
                'Registro de Cliente',
            )
        } else {
            setCliente(selected)
        }
    }

    const handleClienteSave = newCliente => {
        if (newCliente) {
            setCliente(newCliente)
        } else {
            setCliente(null)
        }
    }

    useEffect(() => {
        setSelectedProducts(prevProducts =>
            prevProducts.map(product => {
                const descuentoCliente = cliente ? cliente.descuento : 0
                const porcentajeGanancia = isMayor
                    ? product.porcentaje_ganancia_mayor
                    : product.porcentaje_ganancia
                const formaDeVenta = isMayor
                    ? product.forma_de_venta_mayor
                    : product.forma_de_venta

                const precioVenta =
                    product.precio_compra *
                    (1 + (porcentajeGanancia - descuentoCliente) / 100)
                const cantidad = product.cantidad
                const total = cantidad * precioVenta

                return {
                    ...product,
                    precio_venta: precioVenta,
                    total: total,
                    forma_de_venta: formaDeVenta,
                }
            }),
        )
    }, [isMayor, cliente])

    const startIndex = (currentPage - 1) * itemsPerPage
    const paginatedProducts = selectedProducts.slice(
        startIndex,
        startIndex + itemsPerPage,
    )

    return (
        <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
            <Modal isOpen={isModalOpen} onClose={closeModal} title={modalTitle}>
                {modalContent}
            </Modal>

            <div className="flex items-center justify-between flex-wrap md:flex-row space-y-4 md:space-y-0 pb-4 bg-transparent">
                <div className="relative w-80 m-4">
                    <label htmlFor="table-search-clientes" className="sr-only">
                        Buscar Cliente
                    </label>
                    <AutoComplete
                        value={cliente}
                        suggestions={filteredClientes}
                        completeMethod={searchCliente}
                        field="cedula"
                        onChange={e => setCliente(e.value)}
                        onSelect={handleClienteSelect}
                        placeholder="Ingresa la cédula del cliente..."
                        dropdown
                        forceSelection={false}
                        completeOnFocus
                        style={{ width: '100%' }}
                        itemTemplate={item => (
                            <div>
                                {item.cedula !== 'Agregar nuevo cliente'
                                    ? `${item.cedula} - ${item.nombre}`
                                    : item.cedula}
                            </div>
                        )}
                        footer={
                            <button
                                onClick={() =>
                                    setIsRegisterClienteModalOpen(true)
                                }
                                className="text-blue-500">
                                Agregar nuevo cliente
                            </button>
                        }
                    />
                </div>

                <div className="relative w-80">
                    <label htmlFor="table-search-products" className="sr-only">
                        Buscar Producto
                    </label>
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
                        onSelect={e => {
                            handleAddProduct(e.value)
                        }}
                        inputClassName="bg-gray-50 border text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 pl-10"
                        placeholder="Ingresa el código o nombre del producto..."
                        dropdown
                        forceSelection={false}
                        completeOnFocus
                        style={{ width: '100%' }}
                    />
                </div>

                <div className="flex items-center space-x-2">
                    <label
                        htmlFor="mayor-switch"
                        className={`mr-2 text-sm font-medium ${
                            isDark ? 'text-gray-300' : 'text-gray-900'
                        }`}>
                        Venta al Mayor
                    </label>
                    <input
                        type="checkbox"
                        id="mayor-switch"
                        className="w-4 h-4"
                        checked={isMayor}
                        onChange={() => setIsMayor(prevState => !prevState)}
                    />
                </div>
            </div>

            <table
                className={`w-full text-sm text-left rtl:text-right ${
                    isDark ? 'bg-gray-800 text-white' : 'bg-white text-black'
                }`}>
                <thead className="text-xs uppercase">
                    <tr>
                        <th scope="col" className="px-6 py-3">
                            Código
                        </th>
                        <th scope="col" className="px-6 py-3">
                            Nombre
                        </th>
                        <th scope="col" className="px-6 py-3">
                            Foto
                        </th>
                        <th scope="col" className="px-6 py-3">
                            Cantidad
                        </th>
                        <th scope="col" className="px-6 py-3">
                            Precio por {isMayor ? 'unidad (Mayor)' : 'unidad'}
                        </th>
                        <th scope="col" className="px-6 py-3">
                            Precio Total
                        </th>
                        <th scope="col" className="px-6 py-3">
                            Acción
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {paginatedProducts.map((product, index) => (
                        <tr
                            key={product.codigo_barras}
                            className="border-b cursor-pointer">
                            <td className="px-6 py-4">
                                {product.codigo_barras}
                            </td>
                            <td className="px-6 py-4">{product.nombre}</td>
                            <td className="px-6 py-4">
                                <img
                                    className="w-10 h-10 rounded-full"
                                    src={product.imagen}
                                    alt={`${product.nombre} image`}
                                />
                            </td>
                            <td className="px-6 py-4">
                                <input
                                    type="number"
                                    step={
                                        (isMayor
                                            ? product.forma_de_venta_mayor
                                            : product.forma_de_venta) === 'peso'
                                            ? '0.1'
                                            : '1'
                                    }
                                    min={
                                        (isMayor
                                            ? product.forma_de_venta_mayor
                                            : product.forma_de_venta) === 'peso'
                                            ? '0.1'
                                            : '1'
                                    }
                                    max={product.cantidad_en_stock}
                                    value={product.cantidad}
                                    onChange={e =>
                                        handleQuantityChange(
                                            index,
                                            e.target.value === ''
                                                ? ''
                                                : parseFloat(e.target.value),
                                        )
                                    }
                                    onBlur={e =>
                                        handleQuantityBlur(
                                            index,
                                            e.target.value,
                                        )
                                    }
                                    className={`w-16 p-2 text-center rounded-lg ${
                                        product.cantidad >=
                                        product.cantidad_en_stock
                                            ? 'border-red-500'
                                            : ''
                                    }`}
                                />
                            </td>

                            <td className="px-6 py-4">
                                {product.precio_venta.toFixed(2)}
                            </td>
                            <td className="px-6 py-4">
                                {product.total.toFixed(2)}
                            </td>
                            <td className="px-6 py-4 text-center">
                                <FontAwesomeIcon
                                    icon={faTrashAlt}
                                    className="text-red-500 cursor-pointer"
                                    onClick={() => handleRemoveProduct(index)}
                                />
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <div className="flex justify-between items-center p-4">
                <button
                    onClick={handleFacturar}
                    className="bg-green-500 text-white font-bold py-2 px-4 rounded-full hover:bg-green-700">
                    Facturar
                </button>
                <div className="font-semibold">
                    Precio Total: {totalGeneral.toFixed(2)}
                </div>
            </div>
            <Pagination
                currentPage={currentPage}
                totalItems={selectedProducts.length}
                itemsPerPage={itemsPerPage}
                onPageChange={setCurrentPage}
            />
            {isRegisterClienteModalOpen && (
                <RegisterCliente
                    onClose={() => {
                        setIsRegisterClienteModalOpen(false)
                        setCliente(null)
                    }}
                    onSave={handleClienteSave}
                />
            )}
        </div>
    )
}

export default Facturacion
