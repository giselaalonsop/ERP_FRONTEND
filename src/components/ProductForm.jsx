'use client'
import React, { useState, useEffect, useRef } from 'react'
import DropzoneComponent from './Dropzone'
import { useProduct } from '@/hooks/useProduct'
import Swal from 'sweetalert2'
import 'tailwindcss/tailwind.css'
import { AutoComplete } from 'primereact/autocomplete'
import 'primereact/resources/themes/saga-blue/theme.css'
import 'primereact/resources/primereact.min.css'
import 'primeicons/primeicons.css'
import { useCategories } from '@/hooks/useCategories'

const getCurrentDate = () => {
    const today = new Date()
    const day = String(today.getDate()).padStart(2, '0')
    const month = String(today.getMonth() + 1).padStart(2, '0')
    const year = today.getFullYear()
    return `${year}-${month}-${day}`
}

const AddProductPage = ({ onClose }) => {
    const [isLoading, setIsLoading] = useState(true) // Nuevo estado de carga
    const { categories, getCategoria, addCategoria } = useCategories()
    const { products, addProduct, getProducts } = useProduct()
    const [step, setStep] = useState(1)
    const autoCompleteBarcodeRef = useRef(null) // Referencia para AutoComplete de código de barras
    const autoCompleteNameRef = useRef(null) // Referencia para AutoComplete de nombre
    const [filteredBarcodes, setFilteredBarcodes] = useState([])
    const [filteredNames, setFilteredNames] = useState([])
    const [filteredProducts, setFilteredProducts] = useState([])
    const [newCategory, setNewCategory] = useState('')
    const [isAddingCategory, setIsAddingCategory] = useState(false)
    const [errors, setErrors] = useState({})
    const [responseMessage, setResponseMessage] = useState(null)
    const [formData, setFormData] = useState({
        codigo_barras: '',
        nombre: '',
        descripcion: '',
        categoria: '',
        imagen: null,
        cantidad_en_stock: '',
        unidad_de_medida: '',
        fecha_entrada: getCurrentDate(),
        fecha_caducidad: '',
        peso: '',
        precio_compra: '',
        porcentaje_ganancia: '',
        forma_de_venta: '',
        proveedor: '',
        ubicacion: localStorage.getItem('almacen') || 'General',
    })

    useEffect(() => {
        const fetchProductsAndCategories = async () => {
            await getProducts()
            await getCategoria()
            setIsLoading(false) // Establecer isLoading a false después de cargar los productos y categorías
        }
        fetchProductsAndCategories()
    }, [])

    useEffect(() => {
        if (responseMessage) {
            Swal.fire('Registro procesado', '', 'success')
        }
    }, [responseMessage])

    const searchBarcode = event => {
        const query = event.query.toLowerCase()
        const filtered = products.filter(product =>
            product.codigo_barras.toLowerCase().includes(query),
        )
        setFilteredBarcodes(filtered)
        autoCompleteBarcodeRef.current.show() // Mantener las sugerencias visibles
    }

    const searchName = event => {
        const query = event.query.toLowerCase()
        const filtered = products.filter(product =>
            product.nombre.toLowerCase().includes(query),
        )
        setFilteredNames(filtered)
        autoCompleteNameRef.current.show() // Mantener las sugerencias visibles
    }

    const handleProductSelect = (e, field) => {
        const selectedProduct = e.value
        setFormData({
            ...formData,
            codigo_barras: selectedProduct.codigo_barras,
            nombre: selectedProduct.nombre,
            descripcion: selectedProduct.descripcion || '',
            categoria: selectedProduct.categoria || '',
            cantidad_en_stock: selectedProduct.cantidad_en_stock || '',
            unidad_de_medida: selectedProduct.unidad_de_medida || '',
            fecha_entrada: selectedProduct.fecha_entrada || getCurrentDate(),
            fecha_caducidad: selectedProduct.fecha_caducidad || '',
            peso: selectedProduct.peso || '',
            precio_compra: selectedProduct.precio_compra || '',
            porcentaje_ganancia: selectedProduct.porcentaje_ganancia || '',
            forma_de_venta: selectedProduct.forma_de_venta || '',
            proveedor: selectedProduct.proveedor || '',
            ubicacion:
                selectedProduct.ubicacion ||
                localStorage.getItem('almacen') ||
                'General',
        })
    }

    const validateStep = currentStep => {
        const newErrors = {}
        if (currentStep === 1) {
            if (!formData.codigo_barras)
                newErrors.codigo_barras = 'Barcode is required'
            if (!formData.nombre) newErrors.nombre = 'Product Name is required'
            if (!formData.categoria)
                newErrors.categoria = 'Category is required'
        } else if (currentStep === 2) {
            if (!formData.cantidad_en_stock)
                newErrors.cantidad_en_stock = 'Stock Quantity is required'
            if (!formData.unidad_de_medida)
                newErrors.unidad_de_medida = 'Unit of Measure is required'
            if (!formData.fecha_entrada)
                newErrors.fecha_entrada = 'Entry Date is required'
        } else if (currentStep === 3) {
            if (!formData.precio_compra)
                newErrors.precio_compra = 'Purchase Price is required'
            if (!formData.porcentaje_ganancia)
                newErrors.porcentaje_ganancia = 'Profit Percentage is required'
            if (!formData.forma_de_venta)
                newErrors.forma_de_venta = 'Sale Form is required'
            if (!formData.proveedor)
                newErrors.proveedor = 'Supplier is required'
        }
        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleNextStep = () => {
        if (validateStep(step)) {
            setStep(prevStep => Math.min(prevStep + 1, 3))
        }
    }

    const handlePrevStep = () => {
        setStep(prevStep => Math.max(prevStep - 1, 1))
    }

    const handleChange = e => {
        const { name, value } = e.target
        setFormData(prevData => ({
            ...prevData,
            [name]: value,
        }))
    }

    const handleDrop = acceptedFiles => {
        setFormData(prevData => ({
            ...prevData,
            imagen: acceptedFiles[0],
        }))
    }

    const handleAlmacenChange = e => {
        const value = e.target.value
        setFormData(prevData => ({
            ...prevData,
            ubicacion: value,
        }))
        localStorage.setItem('almacen', value)
    }

    const handleSubmit = e => {
        e.preventDefault()
        if (validateStep(3)) {
            addProduct({
                ...formData,
                setErrors,
                setResponseMessage,
            })
                .then(response => {
                    if (response && response.status === 201) {
                        setFormData({
                            codigo_barras: '',
                            nombre: '',
                            descripcion: '',
                            categoria: '',
                            imagen: null,
                            cantidad_en_stock: '',
                            unidad_de_medida: '',
                            fecha_entrada: getCurrentDate(),
                            fecha_caducidad: '',
                            peso: '',
                            precio_compra: '',
                            porcentaje_ganancia: '',
                            forma_de_venta: '',
                            proveedor: '',
                            ubicacion:
                                localStorage.getItem('almacen') || 'General',
                        })
                        setStep(1)
                        Swal.fire('Producto registrado', '', 'success')
                    }
                })
                .catch(error => {
                    console.error('Error al guardar el producto', error)
                    Swal.fire('Error al registrar el producto', '', 'error')
                })
        }
    }

    const handleCategoryChange = e => {
        const value = e.target.value
        if (value === 'add_new') {
            setIsAddingCategory(true)
            setNewCategory('')
            setFormData(prevData => ({
                ...prevData,
                categoria: '',
            }))
        } else {
            setIsAddingCategory(false)
            setFormData(prevData => ({
                ...prevData,
                categoria: value,
            }))
        }
    }

    const handleAddCategory = async () => {
        if (newCategory.trim()) {
            await addCategoria({ nombre: newCategory })
            setFormData(prevData => ({
                ...prevData,
                categoria: newCategory,
            }))
            setIsAddingCategory(false)
        }
    }

    const steps = ['About', 'Stock', 'Pricing']

    return (
        <>
            {isLoading ? (
                <div className="w-full flex justify-center text-gray-600 mb-3">
                    <p>Cargando..</p>
                </div>
            ) : (
                <div className="w-full h-full bg-white rounded-md mx-auto">
                    <div className="flex justify-between mb-4">
                        {steps.map((label, index) => (
                            <div
                                key={index}
                                className={`w-1/3 text-center ${
                                    step >= index + 1
                                        ? 'text-white'
                                        : 'text-gray-500'
                                }`}>
                                <div
                                    className={`mx-auto w-8 h-8 rounded-full border-2 flex items-center justify-center ${
                                        step > index
                                            ? 'bg-blue-500 border-blue-500'
                                            : 'border-gray-300'
                                    }`}>
                                    {step > index + 1 ? '✓' : index + 1}
                                </div>
                                <p className="mt-2">{label}</p>
                            </div>
                        ))}
                    </div>
                    <form onSubmit={handleSubmit}>
                        {step === 1 && (
                            <div className="grid grid-cols-2 gap-4">
                                <div className="mb-4">
                                    <label
                                        htmlFor="codigo_barras"
                                        className="block mb-2 text-sm font-medium">
                                        Barcode / SKU
                                    </label>
                                    <AutoComplete
                                        ref={autoCompleteBarcodeRef}
                                        value={formData.codigo_barras}
                                        suggestions={
                                            isLoading
                                                ? [
                                                      {
                                                          codigo_barras:
                                                              'Cargando...',
                                                      },
                                                  ]
                                                : filteredBarcodes
                                        }
                                        completeMethod={searchBarcode}
                                        field="codigo_barras"
                                        onChange={e =>
                                            setFormData({
                                                ...formData,
                                                codigo_barras: e.value,
                                            })
                                        }
                                        onSelect={e =>
                                            handleProductSelect(
                                                e,
                                                'codigo_barras',
                                            )
                                        }
                                        dropdown
                                        forceSelection={false}
                                        itemTemplate={item => {
                                            if (
                                                item.codigo_barras ===
                                                'Cargando...'
                                            ) {
                                                return (
                                                    <div>
                                                        {item.codigo_barras}
                                                    </div>
                                                )
                                            }
                                            return item.codigo_barras
                                        }}
                                        completeonfocus
                                        inputClassName={`bg-gray-50 border ${
                                            errors.codigo_barras
                                                ? 'border-red-500'
                                                : 'border-gray-300'
                                        } text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5`}
                                    />

                                    {errors.codigo_barras && (
                                        <p className="text-red-500 text-sm">
                                            {errors.codigo_barras}
                                        </p>
                                    )}
                                </div>

                                <div className="mb-4">
                                    <label
                                        htmlFor="nombre"
                                        className="block mb-2 text-sm font-medium">
                                        Product Name
                                    </label>
                                    <AutoComplete
                                        ref={autoCompleteNameRef}
                                        value={formData.nombre}
                                        suggestions={
                                            isLoading
                                                ? [{ nombre: 'Cargando...' }]
                                                : filteredNames
                                        }
                                        completeMethod={searchName}
                                        field="nombre"
                                        onChange={e =>
                                            setFormData({
                                                ...formData,
                                                nombre: e.value,
                                            })
                                        }
                                        onSelect={e =>
                                            handleProductSelect(e, 'nombre')
                                        }
                                        dropdown
                                        forceSelection={false}
                                        itemTemplate={item => {
                                            if (item.nombre === 'Cargando...') {
                                                return <div>{item.nombre}</div>
                                            }
                                            return item.nombre
                                        }}
                                        inputClassName={`bg-gray-50 border ${
                                            errors.codigo_barras
                                                ? 'border-red-500'
                                                : 'border-gray-300'
                                        } text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5`}
                                    />

                                    {errors.nombre && (
                                        <p className="text-red-500 text-sm">
                                            {errors.nombre}
                                        </p>
                                    )}
                                </div>

                                <div className="mb-4">
                                    <label
                                        htmlFor="descripcion"
                                        className="block mb-2 text-sm font-medium">
                                        Description
                                    </label>
                                    <textarea
                                        id="descripcion"
                                        name="descripcion"
                                        rows="4"
                                        value={formData.descripcion}
                                        onChange={handleChange}
                                        className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-primary-600 focus:border-primary-600"
                                    />
                                </div>
                                <div className="mb-4">
                                    <label
                                        htmlFor="categoria"
                                        className="block mb-2 text-sm font-medium">
                                        Category
                                    </label>
                                    {isAddingCategory ? (
                                        <div className="flex">
                                            <input
                                                type="text"
                                                id="new_category"
                                                name="new_category"
                                                value={newCategory}
                                                onChange={e =>
                                                    setNewCategory(
                                                        e.target.value,
                                                    )
                                                }
                                                className={`bg-gray-50 border ${
                                                    errors.categoria
                                                        ? 'border-red-500'
                                                        : 'border-gray-300'
                                                } text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5`}
                                                placeholder="Enter new category"
                                            />
                                            <button
                                                type="button"
                                                onClick={handleAddCategory}
                                                className="ml-2 bg-blue-500 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg">
                                                Add
                                            </button>
                                        </div>
                                    ) : (
                                        <select
                                            id="categoria"
                                            name="categoria"
                                            value={formData.categoria}
                                            onChange={handleCategoryChange}
                                            className={`bg-gray-50 border ${
                                                errors.categoria
                                                    ? 'border-red-500'
                                                    : 'border-gray-300'
                                            } text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5`}>
                                            <option value="">
                                                Select a category
                                            </option>
                                            {categories.map(category => (
                                                <option
                                                    key={category.id}
                                                    value={category.nombre}>
                                                    {category.nombre}
                                                </option>
                                            ))}
                                            <option value="add_new">
                                                Add new category
                                            </option>
                                        </select>
                                    )}
                                    {errors.categoria && (
                                        <p className="text-red-500 text-sm">
                                            {errors.categoria}
                                        </p>
                                    )}
                                </div>

                                <div className="mb-4">
                                    <label className="block mb-2 text-sm font-medium">
                                        Image
                                    </label>
                                    <DropzoneComponent
                                        onDrop={handleDrop}
                                        file={formData.imagen}
                                    />
                                </div>
                                <div className="mb-4">
                                    <label
                                        htmlFor="almacen"
                                        className="block mb-2 text-sm font-medium">
                                        Almacen
                                    </label>
                                    <select
                                        id="almacen"
                                        name="ubicacion"
                                        value={formData.ubicacion}
                                        onChange={handleAlmacenChange}
                                        className="block w-full p-2.5 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600">
                                        <option value="General">General</option>
                                        <option value="montalban">
                                            Montalban
                                        </option>
                                        <option value="bejuma">Bejuma</option>
                                    </select>
                                </div>
                            </div>
                        )}
                        {step === 2 && (
                            <div className="grid grid-cols-2 gap-4">
                                <div className="mb-4">
                                    <label
                                        htmlFor="cantidad_en_stock"
                                        className="block mb-2 text-sm font-medium">
                                        Stock Quantity
                                    </label>
                                    <input
                                        type="number"
                                        id="cantidad_en_stock"
                                        name="cantidad_en_stock"
                                        value={formData.cantidad_en_stock}
                                        onChange={handleChange}
                                        className={`bg-gray-50 border ${
                                            errors.cantidad_en_stock
                                                ? 'border-red-500'
                                                : 'border-gray-300'
                                        } text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5`}
                                    />
                                    {errors.cantidad_en_stock && (
                                        <p className="text-red-500 text-sm">
                                            {errors.cantidad_en_stock}
                                        </p>
                                    )}
                                </div>
                                <div className="mb-4">
                                    <label
                                        htmlFor="unidad_de_medida"
                                        className="block mb-2 text-sm font-medium">
                                        Unit of Measure
                                    </label>
                                    <input
                                        type="text"
                                        id="unidad_de_medida"
                                        name="unidad_de_medida"
                                        value={formData.unidad_de_medida}
                                        onChange={handleChange}
                                        className={`bg-gray-50 border ${
                                            errors.unidad_de_medida
                                                ? 'border-red-500'
                                                : 'border-gray-300'
                                        } text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5`}
                                    />
                                    {errors.unidad_de_medida && (
                                        <p className="text-red-500 text-sm">
                                            {errors.unidad_de_medida}
                                        </p>
                                    )}
                                </div>
                                <div className="mb-4">
                                    <label
                                        htmlFor="fecha_entrada"
                                        className="block mb-2 text-sm font-medium">
                                        Entry Date
                                    </label>
                                    <input
                                        type="date"
                                        id="fecha_entrada"
                                        name="fecha_entrada"
                                        value={formData.fecha_entrada}
                                        onChange={handleChange}
                                        className={`bg-gray-50 border ${
                                            errors.fecha_entrada
                                                ? 'border-red-500'
                                                : 'border-gray-300'
                                        } text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5`}
                                    />
                                    {errors.fecha_entrada && (
                                        <p className="text-red-500 text-sm">
                                            {errors.fecha_entrada}
                                        </p>
                                    )}
                                </div>
                                <div className="mb-4">
                                    <label
                                        htmlFor="fecha_caducidad"
                                        className="block mb-2 text-sm font-medium">
                                        Expiration Date
                                    </label>
                                    <input
                                        type="date"
                                        id="fecha_caducidad"
                                        name="fecha_caducidad"
                                        value={formData.fecha_caducidad}
                                        onChange={handleChange}
                                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                                    />
                                </div>
                            </div>
                        )}
                        {step === 3 && (
                            <div className="grid grid-cols-2 gap-4">
                                <div className="mb-4">
                                    <label
                                        htmlFor="peso"
                                        className="block mb-2 text-sm font-medium">
                                        Weight
                                    </label>
                                    <input
                                        type="text"
                                        id="peso"
                                        name="peso"
                                        value={formData.peso}
                                        onChange={handleChange}
                                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                                    />
                                </div>
                                <div className="mb-4">
                                    <label
                                        htmlFor="precio_compra"
                                        className="block mb-2 text-sm font-medium">
                                        Purchase Price
                                    </label>
                                    <input
                                        type="text"
                                        id="precio_compra"
                                        name="precio_compra"
                                        value={formData.precio_compra}
                                        onChange={handleChange}
                                        className={`bg-gray-50 border ${
                                            errors.precio_compra
                                                ? 'border-red-500'
                                                : 'border-gray-300'
                                        } text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5`}
                                    />
                                    {errors.precio_compra && (
                                        <p className="text-red-500 text-sm">
                                            {errors.precio_compra}
                                        </p>
                                    )}
                                </div>
                                <div className="mb-4">
                                    <label
                                        htmlFor="porcentaje_ganancia"
                                        className="block mb-2 text-sm font-medium">
                                        Profit Percentage
                                    </label>
                                    <input
                                        type="text"
                                        id="porcentaje_ganancia"
                                        name="porcentaje_ganancia"
                                        value={formData.porcentaje_ganancia}
                                        onChange={handleChange}
                                        className={`bg-gray-50 border ${
                                            errors.porcentaje_ganancia
                                                ? 'border-red-500'
                                                : 'border-gray-300'
                                        } text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5`}
                                    />
                                    {errors.porcentaje_ganancia && (
                                        <p className="text-red-500 text-sm">
                                            {errors.porcentaje_ganancia}
                                        </p>
                                    )}
                                </div>
                                <div className="mb-4">
                                    <label
                                        htmlFor="forma_de_venta"
                                        className="block mb-2 text-sm font-medium">
                                        Sale Form
                                    </label>
                                    <input
                                        type="text"
                                        id="forma_de_venta"
                                        name="forma_de_venta"
                                        value={formData.forma_de_venta}
                                        onChange={handleChange}
                                        className={`bg-gray-50 border ${
                                            errors.forma_de_venta
                                                ? 'border-red-500'
                                                : 'border-gray-300'
                                        } text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5`}
                                    />
                                    {errors.forma_de_venta && (
                                        <p className="text-red-500 text-sm">
                                            {errors.forma_de_venta}
                                        </p>
                                    )}
                                </div>
                                <div className="mb-4">
                                    <label
                                        htmlFor="proveedor"
                                        className="block mb-2 text-sm font-medium">
                                        Supplier
                                    </label>
                                    <input
                                        type="text"
                                        id="proveedor"
                                        name="proveedor"
                                        value={formData.proveedor}
                                        onChange={handleChange}
                                        className={`bg-gray-50 border ${
                                            errors.proveedor
                                                ? 'border-red-500'
                                                : 'border-gray-300'
                                        } text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5`}
                                    />
                                    {errors.proveedor && (
                                        <p className="text-red-500 text-sm">
                                            {errors.proveedor}
                                        </p>
                                    )}
                                </div>
                            </div>
                        )}
                        <div className="flex justify-between mt-6">
                            <button
                                type="button"
                                onClick={handlePrevStep}
                                className="px-4 py-2 bg-gray-200 text-gray-800 font-medium rounded-md">
                                Previous
                            </button>
                            <div>
                                {step < 3 && (
                                    <button
                                        type="button"
                                        onClick={handleNextStep}
                                        className="px-4 py-2 bg-blue-500 hover:bg-blue-700 text-white font-medium rounded-md">
                                        Next
                                    </button>
                                )}
                                {step === 3 && (
                                    <button
                                        type="submit"
                                        className="px-4 py-2 bg-green-500 hover:bg-green-700 text-white font-medium rounded-md">
                                        Submit
                                    </button>
                                )}
                            </div>
                        </div>
                    </form>
                </div>
            )}
        </>
    )
}

export default AddProductPage
