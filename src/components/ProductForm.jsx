import React, { useState, useEffect } from 'react'
import DropzoneComponent from './Dropzone'
import { useProduct } from '@/hooks/useProduct'
import { useCategories } from '@/hooks/useCategories'
import Swal from 'sweetalert2'
import 'tailwindcss/tailwind.css'
import Input from '@/components/Input'
import Label from '@/components/Label'
import InputError from '@/components/InputError'
import Button from '@/components/Button'
import { AutoComplete } from 'primereact/autocomplete'
import { useProveedores } from '@/hooks/useProveedores'
import RegisterProveedor from '@/components/RegisterProveedorForm'
import Modal from '@/components/Modal'
import { image } from '@tensorflow/tfjs'
import { useDropzone } from 'react-dropzone'
import { useAuth } from '@/hooks/auth'
const getCurrentDate = () => {
    const today = new Date()
    const day = String(today.getDate()).padStart(2, '0')
    const month = String(today.getMonth() + 1).padStart(2, '0')
    const year = today.getFullYear()
    return `${year}-${month}-${day}`
}

const capitalizeWords = str => {
    return str.replace(/\b\w/g, char => char.toUpperCase()).replace(/\d+/g, '')
}

const AddProductPage = ({ product, onClose }) => {
    const { hasPermission, user } = useAuth({ middleware: 'auth' })
    const configuracion = JSON.parse(localStorage.getItem('configuracion'))
    const { categories, addCategoria, isLoading, isError } = useCategories()
    const { addProduct, updateProduct } = useProduct()
    const [step, setStep] = useState(1)
    const [newCategory, setNewCategory] = useState('')
    const [isAddingCategory, setIsAddingCategory] = useState(false)
    const [errors, setErrors] = useState({})
    const [responseMessage, setResponseMessage] = useState(null)
    const [touchedFields, setTouchedFields] = useState({})
    const [sumarIVA, setSumarIVA] = useState(true)
    const [formData, setFormData] = useState({
        codigo_barras: '',
        nombre: '',
        descripcion: '',
        categoria: '',
        imagen: null,
        cantidad_en_stock: '',
        cantidad_en_stock_mayor: '',
        unidad_de_medida: '',
        fecha_entrada: getCurrentDate(),
        fecha_caducidad: '',
        peso: '',
        precio_compra: '',
        porcentaje_ganancia: configuracion
            ? configuracion.porcentaje_ganancia
            : '',
        porcentaje_ganancia_mayor: '',
        forma_de_venta: '',
        forma_de_venta_mayor: '',
        proveedor: '',
        cantidad_por_caja: '',
        ubicacion: localStorage.getItem('almacen') || 'General',
    })
    const { proveedores } = useProveedores()
    const [filteredProveedores, setFilteredProveedores] = useState([])
    const [selectedProveedor, setSelectedProveedor] = useState(null)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [modalContent, setModalContent] = useState(null)
    const [modalTitle, setModalTitle] = useState('')
    const [logoFile, setLogoFile] = useState(null)
    const [logoPreview, setLogoPreview] = useState('')

    useEffect(() => {
        if (product) {
            setFormData(product)
            if (product.imagen) {
                setLogoPreview(`http://localhost:8000/${product.imagen}`)
            }
            const proveedor = proveedores?.find(
                proveedor =>
                    parseInt(proveedor.id) === parseInt(product.proveedor),
            )
            if (proveedor) {
                setSelectedProveedor(proveedor)
            }
        }
    }, [product, proveedores])

    useEffect(() => {
        if (responseMessage) {
            Swal.fire('Registro procesado', '', 'success')
        }
    }, [responseMessage])

    const validateStep = currentStep => {
        const newErrors = {}
        if (currentStep === 1) {
            if (!formData.codigo_barras)
                newErrors.codigo_barras = 'Código de Barras es requerido'
            if (!formData.nombre)
                newErrors.nombre = 'Nombre del Producto es requerido'
            if (!formData.categoria)
                newErrors.categoria = 'Categoría es requerida'
        } else if (currentStep === 2) {
            if (!formData.cantidad_en_stock)
                newErrors.cantidad_en_stock = 'Cantidad en Stock es requerida'
            if (formData.cantidad_en_stock < 0)
                newErrors.cantidad_en_stock =
                    'Cantidad en Stock no puede ser menor a 0'
            if (formData.cantidad_en_stock_mayor < 0)
                newErrors.cantidad_en_stock_mayor =
                    'Cantidad en Stock al Mayor no puede ser menor a 0'
            if (!formData.unidad_de_medida)
                newErrors.unidad_de_medida = 'Unidad de Medida es requerida'
            if (!formData.fecha_entrada)
                newErrors.fecha_entrada = 'Fecha de Entrada es requerida'
            if (!formData.cantidad_por_caja)
                newErrors.cantidad_por_caja = 'Cantidad por Caja es requerida'
        } else if (currentStep === 3) {
            if (!formData.precio_compra)
                newErrors.precio_compra = 'Precio de Compra es requerido'
            if (formData.precio_compra <= 0)
                newErrors.precio_compra = 'Precio de Compra debe ser mayor a 0'
            if (!formData.porcentaje_ganancia)
                newErrors.porcentaje_ganancia =
                    'Porcentaje de Ganancia es requerido'
            if (formData.porcentaje_ganancia <= 0)
                newErrors.porcentaje_ganancia =
                    'Porcentaje de Ganancia debe ser mayor a 0'
            if (!formData.porcentaje_ganancia_mayor)
                newErrors.porcentaje_ganancia_mayor =
                    'Porcentaje de Ganancia al Mayor es requerido'
            if (formData.porcentaje_ganancia_mayor <= 0)
                newErrors.porcentaje_ganancia_mayor =
                    'Porcentaje de Ganancia al Mayor debe ser mayor a 0'
            if (!formData.forma_de_venta)
                newErrors.forma_de_venta = 'Forma de Venta es requerida'
            if (!formData.forma_de_venta_mayor)
                newErrors.forma_de_venta_mayor =
                    'Forma de Venta al Mayor es requerida'
            if (!formData.proveedor)
                newErrors.proveedor = 'Proveedor es requerido'
        }
        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }
    useEffect(() => {
        validateStep(step)
    }, [step, formData])
    const handleNextStep = () => {
        if (validateStep(step)) {
            setStep(prevStep => Math.min(prevStep + 1, 3))
        } else {
            markFieldsAsTouched(step)
        }
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

    const handlePrevStep = () => {
        setStep(prevStep => Math.max(prevStep - 1, 1))
    }

    const markFieldsAsTouched = currentStep => {
        let fields = {}
        if (currentStep === 1) {
            fields = {
                codigo_barras: true,
                nombre: true,
                categoria: true,
            }
        } else if (currentStep === 2) {
            fields = {
                cantidad_en_stock: true,
                cantidad_en_stock_mayor: true,
                unidad_de_medida: true,
                fecha_entrada: true,
                cantidad_por_caja: true,
            }
        } else if (currentStep === 3) {
            fields = {
                precio_compra: true,
                porcentaje_ganancia: true,
                porcentaje_ganancia_mayor: true,
                forma_de_venta: true,
                forma_de_venta_mayor: true,
                proveedor: true,
            }
        }
        setTouchedFields(prevTouchedFields => ({
            ...prevTouchedFields,
            ...fields,
        }))
    }

    const handleChange = e => {
        const { name, value } = e.target
        setFormData(prevData => ({
            ...prevData,
            [name]:
                name === 'nombre' ||
                name === 'categoria' ||
                name === 'unidad_de_medida' ||
                name === 'forma_de_venta' ||
                name === 'forma_de_venta_mayor' ||
                name === 'proveedor'
                    ? capitalizeWords(value)
                    : value,
            [name]: name === 'codigo_barras' ? value.replace(/\D/g, '') : value,
        }))
    }

    const handleBlur = e => {
        const name = e.target ? e.target.name : e.originalEvent.target.name
        setTouchedFields(prevTouchedFields => ({
            ...prevTouchedFields,
            [name]: true,
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

    const handleCantidadPorCajaChange = e => {
        const value = parseInt(e.target.value, 10)
        setFormData(prevData => ({
            ...prevData,
            cantidad_por_caja: value,
            cantidad_en_stock: prevData.cantidad_en_stock_mayor * value,
        }))
    }

    const handleSubmit = async e => {
        e.preventDefault()

        const dataToSend = new FormData()
        Object.keys(formData).forEach(key => {
            if (formData[key] !== null && formData[key] !== '') {
                dataToSend.append(key, formData[key])
            }
        })

        if (logoFile) {
            dataToSend.append('imagen', logoFile)
        }

        // Log para verificar los datos que se envían
        for (let pair of dataToSend.entries()) {
            console.log(pair[0] + ', ' + pair[1])
        }

        try {
            const response = product
                ? await updateProduct(product.id, dataToSend)
                : await addProduct(dataToSend)
            setResponseMessage('Producto guardado con éxito')
            onClose()
        } catch (error) {
            console.error('Error al guardar el producto', error)
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

    const searchProveedor = event => {
        const query = event.query.toLowerCase()
        const filtered = proveedores.filter(proveedor =>
            proveedor.empresa.toLowerCase().includes(query),
        )

        if (filtered.length === 0) {
            if (
                hasPermission(user, 'agregarProveedores') ||
                user?.rol === 'admin'
            ) {
                filtered.push({ id: 'new', empresa: 'Agregar nuevo proveedor' })
            }
        }

        setFilteredProveedores(filtered)
    }
    const handleProveedorSelect = e => {
        const selected = e.value

        if (selected.id === 'new') {
            openModal(
                <RegisterProveedor onClose={closeModal} />,
                'Agregar Nuevo Proveedor',
            )
            setSelectedProveedor(null) // Limpiar el AutoComplete
            setFormData({ ...formData, proveedor: '' }) // Limpiar el formData
        } else {
            setSelectedProveedor(selected)
            setFormData({ ...formData, proveedor: selected.id })
        }
    }

    const steps = ['Información', 'Stock', 'Precios']
    const onDrop = acceptedFiles => {
        const file = acceptedFiles[0]
        setLogoFile(file)
        const reader = new FileReader()
        reader.onload = () => {
            setLogoPreview(reader.result)
        }
        reader.readAsDataURL(file)
    }

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: 'image/*',
    })

    return (
        <div className="max-w-3xl mx-auto">
            <Modal isOpen={isModalOpen} onClose={closeModal} title={modalTitle}>
                {modalContent}
            </Modal>
            <div className="text-center mb-4">
                <h2 className="text-2xl font-bold">
                    {product ? 'Editar Producto' : 'Agregar Producto'}
                </h2>
            </div>
            <div className="relative bg-white  p-6">
                <div className="absolute top-4 left-0 right-0 flex justify-between mb-4 px-6">
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
                <form onSubmit={handleSubmit} className="pt-16">
                    <div className="h-96 overflow-y-auto">
                        {step === 1 && (
                            <div className="grid gap-4 sm:grid-cols-2">
                                <div>
                                    <Label htmlFor="codigo_barras">
                                        Código de Barras / SKU
                                    </Label>
                                    <Input
                                        type="text"
                                        id="codigo_barras"
                                        name="codigo_barras"
                                        value={formData.codigo_barras}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        className={`bg-gray-50 border ${
                                            errors.codigo_barras
                                                ? touchedFields.codigo_barras
                                                    ? 'border-red-500'
                                                    : 'border-gray-300'
                                                : 'border-gray-300'
                                        } text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5`}
                                        placeholder="Ingrese el código de barras"
                                    />
                                    <div style={{ minHeight: '24px' }}>
                                        {touchedFields.codigo_barras && (
                                            <InputError
                                                messages={errors.codigo_barras}
                                                className="mt-2"
                                            />
                                        )}
                                    </div>
                                </div>
                                <div>
                                    <Label htmlFor="nombre">
                                        Nombre del Producto
                                    </Label>
                                    <Input
                                        type="text"
                                        id="nombre"
                                        name="nombre"
                                        value={formData.nombre}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        className={`bg-gray-50 border ${
                                            errors.nombre
                                                ? touchedFields.nombre
                                                    ? 'border-red-500'
                                                    : 'border-gray-300'
                                                : 'border-gray-300'
                                        } text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5`}
                                        placeholder="Ingrese el nombre del producto"
                                    />
                                    <div style={{ minHeight: '24px' }}>
                                        {touchedFields.nombre && (
                                            <InputError
                                                messages={errors.nombre}
                                                className="mt-2"
                                            />
                                        )}
                                    </div>
                                </div>
                                <div className="sm:col-span-2 grid grid-cols-2 gap-4">
                                    <div>
                                        <Label htmlFor="categoria">
                                            Categoría
                                        </Label>
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
                                                    onBlur={handleBlur}
                                                    className={`bg-gray-50 border ${
                                                        errors.categoria &&
                                                        touchedFields.categoria
                                                            ? 'border-red-500'
                                                            : 'border-gray-300'
                                                    } text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5`}
                                                    placeholder="Ingrese nueva categoría"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={handleAddCategory}
                                                    className="ml-2 bg-blue-500 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg">
                                                    Agregar
                                                </button>
                                            </div>
                                        ) : (
                                            <select
                                                id="categoria"
                                                name="categoria"
                                                value={formData.categoria}
                                                onChange={handleCategoryChange}
                                                onBlur={handleBlur}
                                                className={`bg-gray-50 border ${
                                                    errors.categoria &&
                                                    touchedFields.categoria
                                                        ? 'border-red-500'
                                                        : 'border-gray-300'
                                                } text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5`}>
                                                <option value="">
                                                    Seleccione una categoría
                                                </option>
                                                {categories?.map(category => (
                                                    <option
                                                        key={category.id}
                                                        value={category.nombre}>
                                                        {category.nombre}
                                                    </option>
                                                ))}
                                                <option value="add_new">
                                                    Agregar nueva categoría
                                                </option>
                                            </select>
                                        )}
                                        <div style={{ minHeight: '24px' }}>
                                            {touchedFields.categoria && (
                                                <InputError
                                                    messages={errors.categoria}
                                                    className="mt-2"
                                                />
                                            )}
                                        </div>
                                    </div>
                                    <div>
                                        <Label htmlFor="almacen">Almacén</Label>
                                        <select
                                            id="almacen"
                                            name="ubicacion"
                                            value={formData.ubicacion}
                                            onChange={handleAlmacenChange}
                                            className="block w-full p-2.5 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600">
                                            <option value="General">
                                                General
                                            </option>
                                            <option value="montalban">
                                                Montalban
                                            </option>
                                            <option value="bejuma">
                                                Bejuma
                                            </option>
                                        </select>
                                    </div>
                                </div>
                                <div className="sm:col-span-2 grid grid-cols-2 gap-4">
                                    <div>
                                        <Label htmlFor="descripcion">
                                            Descripción
                                        </Label>
                                        <textarea
                                            id="descripcion"
                                            name="descripcion"
                                            rows="4"
                                            value={formData.descripcion}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-primary-600 focus:border-primary-600"
                                            placeholder="Ingrese la descripción del producto"
                                        />
                                        <div style={{ minHeight: '24px' }}>
                                            {touchedFields.descripcion && (
                                                <InputError
                                                    messages={
                                                        errors.descripcion
                                                    }
                                                    className="mt-2"
                                                />
                                            )}
                                        </div>
                                    </div>
                                    <div className="sm:col-span-1 sm:row-span-2">
                                        <Label
                                            htmlFor="logo"
                                            className="block mb-2 text-sm font-medium">
                                            Imagen
                                        </Label>
                                        <div
                                            {...getRootProps()}
                                            className={`border-2 border-dashed rounded-lg p-4 text-center cursor-pointer ${
                                                isDragActive
                                                    ? 'border-blue-600'
                                                    : 'border-gray-300'
                                            }`}
                                            style={{ height: '120px' }}>
                                            <input {...getInputProps()} />
                                            {logoPreview ? (
                                                <img
                                                    src={logoPreview}
                                                    alt="Logo preview"
                                                    className="rounded-lg mx-auto object-cover"
                                                    style={{
                                                        width: '100%',
                                                        height: '100%',
                                                    }}
                                                />
                                            ) : (
                                                <p className="text-sm text-gray-500">
                                                    Arrastra y suelta un archivo
                                                    aquí, o haz clic para
                                                    seleccionar uno
                                                </p>
                                            )}
                                        </div>
                                        <InputError
                                            messages={errors?.logo}
                                            className="mt-2"
                                        />
                                    </div>
                                </div>
                            </div>
                        )}
                        {step === 2 && (
                            <div className="grid gap-4 sm:grid-cols-2">
                                <div>
                                    <Label htmlFor="cantidad_en_stock_mayor">
                                        Cantidad en Stock (Mayor)
                                    </Label>
                                    <Input
                                        type="number"
                                        min="0"
                                        id="cantidad_en_stock_mayor"
                                        name="cantidad_en_stock_mayor"
                                        value={formData.cantidad_en_stock_mayor}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        className={`bg-gray-50 border ${
                                            errors.cantidad_en_stock_mayor &&
                                            touchedFields.cantidad_en_stock_mayor
                                                ? 'border-red-500'
                                                : 'border-gray-300'
                                        } text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5`}
                                        placeholder="Ingrese la cantidad en stock (Mayor)"
                                    />
                                    <div style={{ minHeight: '24px' }}>
                                        {touchedFields.cantidad_en_stock_mayor && (
                                            <InputError
                                                messages={
                                                    errors.cantidad_en_stock_mayor
                                                }
                                                className="mt-2"
                                            />
                                        )}
                                    </div>
                                </div>
                                <div>
                                    <Label htmlFor="cantidad_por_caja">
                                        Cantidad por Caja
                                    </Label>
                                    <Input
                                        type="number"
                                        id="cantidad_por_caja"
                                        name="cantidad_por_caja"
                                        min="0"
                                        value={formData.cantidad_por_caja}
                                        onChange={handleCantidadPorCajaChange}
                                        onBlur={handleBlur}
                                        className={`bg-gray-50 border ${
                                            errors.cantidad_por_caja &&
                                            touchedFields.cantidad_por_caja
                                                ? 'border-red-500'
                                                : 'border-gray-300'
                                        } text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5`}
                                        placeholder="Ingrese la cantidad por caja"
                                    />
                                    <div style={{ minHeight: '24px' }}>
                                        {touchedFields.cantidad_por_caja && (
                                            <InputError
                                                messages={
                                                    errors.cantidad_por_caja
                                                }
                                                className="mt-2"
                                            />
                                        )}
                                    </div>
                                </div>
                                <div>
                                    <Label htmlFor="cantidad_en_stock">
                                        Cantidad en Stock (Detal)
                                    </Label>
                                    <Input
                                        type="number"
                                        id="cantidad_en_stock"
                                        name="cantidad_en_stock"
                                        min="0"
                                        value={formData.cantidad_en_stock}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        className={`bg-gray-50 border ${
                                            errors.cantidad_en_stock &&
                                            touchedFields.cantidad_en_stock
                                                ? 'border-red-500'
                                                : 'border-gray-300'
                                        } text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5`}
                                        placeholder="Ingrese la cantidad en stock (Detal)"
                                    />
                                    <div style={{ minHeight: '24px' }}>
                                        {touchedFields.cantidad_en_stock && (
                                            <InputError
                                                messages={
                                                    errors.cantidad_en_stock
                                                }
                                                className="mt-2"
                                            />
                                        )}
                                    </div>
                                </div>
                                <div>
                                    <Label htmlFor="unidad_de_medida">
                                        Unidad de Medida
                                    </Label>
                                    <Input
                                        type="text"
                                        id="unidad_de_medida"
                                        name="unidad_de_medida"
                                        value={formData.unidad_de_medida}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        className={`bg-gray-50 border ${
                                            touchedFields.unidad_de_medida
                                                ? errors.unidad_de_medida
                                                    ? 'border-red-500'
                                                    : 'border-gray-300'
                                                : 'border-gray-300'
                                        } text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5`}
                                        placeholder="Ingrese la unidad de medida"
                                    />
                                    <div style={{ minHeight: '24px' }}>
                                        {touchedFields.unidad_de_medida && (
                                            <InputError
                                                messages={
                                                    errors.unidad_de_medida
                                                }
                                                className="mt-2"
                                            />
                                        )}
                                    </div>
                                </div>
                                <div>
                                    <Label htmlFor="fecha_entrada">
                                        Fecha de Entrada
                                    </Label>
                                    <Input
                                        type="date"
                                        id="fecha_entrada"
                                        name="fecha_entrada"
                                        max={
                                            new Date()
                                                .toISOString()
                                                .split('T')[0]
                                        }
                                        value={formData.fecha_entrada}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        className={`bg-gray-50 border ${
                                            errors.fecha_entrada &&
                                            touchedFields.fecha_entrada
                                                ? 'border-red-500'
                                                : 'border-gray-300'
                                        } text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5`}
                                    />
                                    <div style={{ minHeight: '24px' }}>
                                        {touchedFields.fecha_entrada && (
                                            <InputError
                                                messages={errors.fecha_entrada}
                                                className="mt-2"
                                            />
                                        )}
                                    </div>
                                </div>
                                <div>
                                    <Label htmlFor="fecha_caducidad">
                                        Fecha de Caducidad
                                    </Label>
                                    <Input
                                        type="date"
                                        id="fecha_caducidad"
                                        name="fecha_caducidad"
                                        min={
                                            new Date()
                                                .toISOString()
                                                .split('T')[0]
                                        }
                                        value={formData.fecha_caducidad}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                                        placeholder="Ingrese la fecha de caducidad"
                                    />
                                    <div style={{ minHeight: '24px' }}>
                                        {touchedFields.fecha_caducidad && (
                                            <InputError
                                                messages={
                                                    errors.fecha_caducidad
                                                }
                                                className="mt-2"
                                            />
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}
                        {step === 3 && (
                            <div className="grid gap-4 sm:grid-cols-2">
                                <div>
                                    <Label htmlFor="peso">Peso</Label>
                                    <Input
                                        type="number"
                                        id="peso"
                                        name="peso"
                                        min="0"
                                        value={formData.peso}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        className={`bg-gray-50 border ${
                                            errors.peso && touchedFields.peso
                                                ? 'border-red-500'
                                                : 'border-gray-300'
                                        } text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5`}
                                        placeholder="Ingrese el peso"
                                    />
                                    <div style={{ minHeight: '24px' }}>
                                        {touchedFields.peso && (
                                            <InputError
                                                messages={errors.peso}
                                                className="mt-2"
                                            />
                                        )}
                                    </div>
                                </div>
                                <div>
                                    <Label htmlFor="precio_compra">
                                        Precio de Compra
                                    </Label>
                                    <Input
                                        type="number"
                                        id="precio_compra"
                                        name="precio_compra"
                                        min="0"
                                        step="0.01"
                                        value={formData.precio_compra}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        className={`bg-gray-50 border ${
                                            errors.precio_compra &&
                                            touchedFields.precio_compra
                                                ? 'border-red-500'
                                                : 'border-gray-300'
                                        } text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5`}
                                        placeholder="Ingrese el precio de compra"
                                    />
                                    <div style={{ minHeight: '24px' }}>
                                        {touchedFields.precio_compra && (
                                            <InputError
                                                messages={errors.precio_compra}
                                                className="mt-2"
                                            />
                                        )}
                                    </div>
                                </div>
                                <div>
                                    <Label htmlFor="porcentaje_ganancia">
                                        Porcentaje de Ganancia
                                    </Label>
                                    <Input
                                        type="number"
                                        id="porcentaje_ganancia"
                                        name="porcentaje_ganancia"
                                        min="0"
                                        step="0.01"
                                        value={formData.porcentaje_ganancia}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        className={`bg-gray-50 border ${
                                            errors.porcentaje_ganancia &&
                                            touchedFields.porcentaje_ganancia
                                                ? 'border-red-500'
                                                : 'border-gray-300'
                                        } text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5`}
                                        placeholder="Ingrese el porcentaje de ganancia"
                                    />
                                    <div style={{ minHeight: '24px' }}>
                                        {touchedFields.porcentaje_ganancia && (
                                            <InputError
                                                messages={
                                                    errors.porcentaje_ganancia
                                                }
                                                className="mt-2"
                                            />
                                        )}
                                    </div>
                                </div>
                                <div>
                                    <Label htmlFor="porcentaje_ganancia_mayor">
                                        Porcentaje de Ganancia (Mayor)
                                    </Label>
                                    <Input
                                        type="number"
                                        id="porcentaje_ganancia_mayor"
                                        name="porcentaje_ganancia_mayor"
                                        min="0"
                                        step="0.01"
                                        value={
                                            formData.porcentaje_ganancia_mayor
                                        }
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        className={`bg-gray-50 border ${
                                            errors.porcentaje_ganancia_mayor &&
                                            touchedFields.porcentaje_ganancia_mayor
                                                ? 'border-red-500'
                                                : 'border-gray-300'
                                        } text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5`}
                                        placeholder="Ingrese el porcentaje de ganancia (Mayor)"
                                    />
                                    <div style={{ minHeight: '24px' }}>
                                        {touchedFields.porcentaje_ganancia_mayor && (
                                            <InputError
                                                messages={
                                                    errors.porcentaje_ganancia_mayor
                                                }
                                                className="mt-2"
                                            />
                                        )}
                                    </div>
                                </div>
                                <div>
                                    <Label htmlFor="forma_de_venta">
                                        Forma de Venta
                                    </Label>
                                    <Input
                                        type="text"
                                        id="forma_de_venta"
                                        name="forma_de_venta"
                                        value={formData.forma_de_venta}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        className={`bg-gray-50 border ${
                                            errors.forma_de_venta &&
                                            touchedFields.forma_de_venta
                                                ? 'border-red-500'
                                                : 'border-gray-300'
                                        } text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5`}
                                        placeholder="Ingrese la forma de venta"
                                    />
                                    <div style={{ minHeight: '24px' }}>
                                        {touchedFields.forma_de_venta && (
                                            <InputError
                                                messages={errors.forma_de_venta}
                                                className="mt-2"
                                            />
                                        )}
                                    </div>
                                </div>
                                <div>
                                    <Label htmlFor="forma_de_venta_mayor">
                                        Forma de Venta (Mayor)
                                    </Label>
                                    <Input
                                        type="text"
                                        id="forma_de_venta_mayor"
                                        name="forma_de_venta_mayor"
                                        value={formData.forma_de_venta_mayor}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        className={`bg-gray-50 border ${
                                            errors.forma_de_venta_mayor &&
                                            touchedFields.forma_de_venta_mayor
                                                ? 'border-red-500'
                                                : 'border-gray-300'
                                        } text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5`}
                                        placeholder="Ingrese la forma de venta (Mayor)"
                                    />
                                    <div style={{ minHeight: '24px' }}>
                                        {touchedFields.forma_de_venta_mayor && (
                                            <InputError
                                                messages={
                                                    errors.forma_de_venta_mayor
                                                }
                                                className="mt-2"
                                            />
                                        )}
                                    </div>
                                </div>
                                <div>
                                    <Label htmlFor="proveedor">Proveedor</Label>
                                    <AutoComplete
                                        value={selectedProveedor}
                                        suggestions={filteredProveedores}
                                        completeMethod={searchProveedor}
                                        field="empresa"
                                        itemTemplate={item => (
                                            <div className="bg-white text-gray-900">
                                                {item.empresa}
                                            </div>
                                        )}
                                        onChange={e => {
                                            setSelectedProveedor(e.value)
                                            setFormData({
                                                ...formData,
                                                proveedor: e.value
                                                    ? e.value.id
                                                    : '',
                                            })
                                            handleBlur(e) // Aquí se llama a handleBlur
                                        }}
                                        onSelect={handleProveedorSelect}
                                        inputClassName={`bg-gray-50 border text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5`}
                                        dropdown
                                        forceSelection={false}
                                        completeOnFocus
                                        style={{ width: '100%' }}
                                        panelStyle={{ background: 'white' }}
                                        placeholder="Seleccione un proveedor"
                                    />

                                    {touchedFields.proveedor && (
                                        <InputError
                                            messages={errors.proveedor}
                                            className="mt-2"
                                        />
                                    )}
                                </div>
                                <div>
                                    <input
                                        type="checkbox"
                                        id="sumarIVA"
                                        checked={sumarIVA}
                                        onChange={() => setSumarIVA(!sumarIVA)}
                                        className="mr-2"
                                    />
                                    <Label htmlFor="sumarIVA">Sumar IVA</Label>
                                </div>
                            </div>
                        )}
                    </div>
                    <div className="flex justify-between ">
                        <Button
                            type="button"
                            onClick={handlePrevStep}
                            className="px-4 py-2 bg-gray-200 text-gray-800 font-medium rounded-md">
                            Anterior
                        </Button>
                        <div>
                            {step < 3 && (
                                <Button
                                    type="button"
                                    onClick={handleNextStep}
                                    className="px-4 py-2 bg-blue-500 hover:bg-blue-700 text-white font-medium rounded-md">
                                    Siguiente
                                </Button>
                            )}
                            {step === 3 && (
                                <Button
                                    type="submit"
                                    className="px-4 py-2 bg-green-500 hover:bg-green-700 text-white font-medium rounded-md">
                                    Enviar
                                </Button>
                            )}
                        </div>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default AddProductPage
