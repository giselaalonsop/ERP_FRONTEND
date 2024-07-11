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
    const { categories, getCategoria, addCategoria } = useCategories()
    const { addProduct, updateProduct } = useProduct()
    const [step, setStep] = useState(1)
    const [newCategory, setNewCategory] = useState('')
    const [isAddingCategory, setIsAddingCategory] = useState(false)
    const [errors, setErrors] = useState({})
    const [responseMessage, setResponseMessage] = useState(null)
    const [touchedFields, setTouchedFields] = useState({})
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
        porcentaje_ganancia: '',
        porcentaje_ganancia_mayor: '',
        forma_de_venta: '',
        forma_de_venta_mayor: '',
        proveedor: '',
        cantidad_por_caja: '',
        ubicacion: localStorage.getItem('almacen') || 'General',
    })

    useEffect(() => {
        const fetchProductsAndCategories = async () => {
            await getCategoria()
        }
        fetchProductsAndCategories()
    }, [])

    useEffect(() => {
        if (product) {
            setFormData(product)
        }
    }, [product])

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
            if (!formData.cantidad_en_stock_mayor)
                newErrors.cantidad_en_stock_mayor =
                    'Cantidad en Stock al Mayor es requerida'
            if (!formData.unidad_de_medida)
                newErrors.unidad_de_medida = 'Unidad de Medida es requerida'
            if (!formData.fecha_entrada)
                newErrors.fecha_entrada = 'Fecha de Entrada es requerida'
            if (!formData.cantidad_por_caja)
                newErrors.cantidad_por_caja = 'Cantidad por Caja es requerida'
        } else if (currentStep === 3) {
            if (!formData.precio_compra)
                newErrors.precio_compra = 'Precio de Compra es requerido'
            if (!formData.porcentaje_ganancia)
                newErrors.porcentaje_ganancia =
                    'Porcentaje de Ganancia es requerido'
            if (!formData.porcentaje_ganancia_mayor)
                newErrors.porcentaje_ganancia_mayor =
                    'Porcentaje de Ganancia al Mayor es requerido'
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
        }
    }

    const handlePrevStep = () => {
        setStep(prevStep => Math.max(prevStep - 1, 1))
    }

    const handleChange = e => {
        const { name, value } = e.target
        setFormData(prevData => ({
            ...prevData,
            [name]:
                name === 'nombre' ||
                name === 'descripcion' ||
                name === 'categoria' ||
                name === 'unidad_de_medida' ||
                name === 'forma_de_venta' ||
                name === 'forma_de_venta_mayor' ||
                name === 'proveedor'
                    ? capitalizeWords(value)
                    : value,
        }))
    }

    const handleBlur = e => {
        const { name } = e.target
        setTouchedFields(prevTouchedFields => ({
            ...prevTouchedFields,
            [name]: true,
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
        if (validateStep(3)) {
            try {
                if (product) {
                    await updateProduct(product.id, formData)
                    Swal.fire('Producto actualizado', '', 'success')
                } else {
                    await addProduct({
                        ...formData,
                        setErrors,
                        setResponseMessage,
                    })
                    setFormData({
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
                        porcentaje_ganancia: '',
                        porcentaje_ganancia_mayor: '',
                        forma_de_venta: '',
                        forma_de_venta_mayor: '',
                        proveedor: '',
                        cantidad_por_caja: '',
                        ubicacion: localStorage.getItem('almacen') || 'General',
                    })
                    setStep(1)
                    Swal.fire('Producto registrado', '', 'success')
                }
                onClose()
            } catch (error) {
                console.error('Error al guardar el producto', error)
                Swal.fire('Error al registrar el producto', '', 'error')
            }
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

    const steps = ['Información', 'Stock', 'Precios']

    return (
        <div className="max-w-3xl mx-auto">
            <div className="text-center mb-4">
                <h2 className="text-2xl font-bold">
                    {product ? 'Editar Producto' : 'Agregar Producto'}
                </h2>
            </div>
            <div className="relative bg-white rounded-lg shadow-lg p-6">
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
                                                ? 'border-red-500'
                                                : 'border-gray-300'
                                        } text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5`}
                                        placeholder="Ingrese el código de barras"
                                    />
                                    {touchedFields.codigo_barras && (
                                        <InputError
                                            messages={errors.codigo_barras}
                                            className="mt-2"
                                        />
                                    )}
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
                                                ? 'border-red-500'
                                                : 'border-gray-300'
                                        } text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5`}
                                        placeholder="Ingrese el nombre del producto"
                                    />
                                    {touchedFields.nombre && (
                                        <InputError
                                            messages={errors.nombre}
                                            className="mt-2"
                                        />
                                    )}
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
                                                        errors.categoria
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
                                                    errors.categoria
                                                        ? 'border-red-500'
                                                        : 'border-gray-300'
                                                } text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5`}>
                                                <option value="">
                                                    Seleccione una categoría
                                                </option>
                                                {categories.map(category => (
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
                                        {touchedFields.categoria && (
                                            <InputError
                                                messages={errors.categoria}
                                                className="mt-2"
                                            />
                                        )}
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
                                        {touchedFields.descripcion && (
                                            <InputError
                                                messages={errors.descripcion}
                                                className="mt-2"
                                            />
                                        )}
                                    </div>
                                    <div>
                                        <Label>Imagen</Label>
                                        <DropzoneComponent
                                            onDrop={handleDrop}
                                            file={formData.imagen}
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
                                        id="cantidad_en_stock_mayor"
                                        name="cantidad_en_stock_mayor"
                                        value={formData.cantidad_en_stock_mayor}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        className={`bg-gray-50 border ${
                                            errors.cantidad_en_stock_mayor
                                                ? 'border-red-500'
                                                : 'border-gray-300'
                                        } text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5`}
                                        placeholder="Ingrese la cantidad en stock (Mayor)"
                                    />
                                    {touchedFields.cantidad_en_stock_mayor && (
                                        <InputError
                                            messages={
                                                errors.cantidad_en_stock_mayor
                                            }
                                            className="mt-2"
                                        />
                                    )}
                                </div>
                                <div>
                                    <Label htmlFor="cantidad_por_caja">
                                        Cantidad por Caja
                                    </Label>
                                    <Input
                                        type="number"
                                        id="cantidad_por_caja"
                                        name="cantidad_por_caja"
                                        value={formData.cantidad_por_caja}
                                        onChange={handleCantidadPorCajaChange}
                                        onBlur={handleBlur}
                                        className={`bg-gray-50 border ${
                                            errors.cantidad_por_caja
                                                ? 'border-red-500'
                                                : 'border-gray-300'
                                        } text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5`}
                                        placeholder="Ingrese la cantidad por caja"
                                    />
                                    {touchedFields.cantidad_por_caja && (
                                        <InputError
                                            messages={errors.cantidad_por_caja}
                                            className="mt-2"
                                        />
                                    )}
                                </div>
                                <div>
                                    <Label htmlFor="cantidad_en_stock">
                                        Cantidad en Stock (Detal)
                                    </Label>
                                    <Input
                                        type="number"
                                        id="cantidad_en_stock"
                                        name="cantidad_en_stock"
                                        value={formData.cantidad_en_stock}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        className={`bg-gray-50 border ${
                                            errors.cantidad_en_stock
                                                ? 'border-red-500'
                                                : 'border-gray-300'
                                        } text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5`}
                                        placeholder="Ingrese la cantidad en stock (Detal)"
                                    />
                                    {touchedFields.cantidad_en_stock && (
                                        <InputError
                                            messages={errors.cantidad_en_stock}
                                            className="mt-2"
                                        />
                                    )}
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
                                            errors.unidad_de_medida
                                                ? 'border-red-500'
                                                : 'border-gray-300'
                                        } text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5`}
                                        placeholder="Ingrese la unidad de medida"
                                    />
                                    {touchedFields.unidad_de_medida && (
                                        <InputError
                                            messages={errors.unidad_de_medida}
                                            className="mt-2"
                                        />
                                    )}
                                </div>
                                <div>
                                    <Label htmlFor="fecha_entrada">
                                        Fecha de Entrada
                                    </Label>
                                    <Input
                                        type="date"
                                        id="fecha_entrada"
                                        name="fecha_entrada"
                                        value={formData.fecha_entrada}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        className={`bg-gray-50 border ${
                                            errors.fecha_entrada
                                                ? 'border-red-500'
                                                : 'border-gray-300'
                                        } text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5`}
                                    />
                                    {touchedFields.fecha_entrada && (
                                        <InputError
                                            messages={errors.fecha_entrada}
                                            className="mt-2"
                                        />
                                    )}
                                </div>
                                <div>
                                    <Label htmlFor="fecha_caducidad">
                                        Fecha de Caducidad
                                    </Label>
                                    <Input
                                        type="date"
                                        id="fecha_caducidad"
                                        name="fecha_caducidad"
                                        value={formData.fecha_caducidad}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                                        placeholder="Ingrese la fecha de caducidad"
                                    />
                                    {touchedFields.fecha_caducidad && (
                                        <InputError
                                            messages={errors.fecha_caducidad}
                                            className="mt-2"
                                        />
                                    )}
                                </div>
                            </div>
                        )}
                        {step === 3 && (
                            <div className="grid gap-4 sm:grid-cols-2">
                                <div>
                                    <Label htmlFor="peso">Peso</Label>
                                    <Input
                                        type="text"
                                        id="peso"
                                        name="peso"
                                        value={formData.peso}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        className={`bg-gray-50 border ${
                                            errors.peso
                                                ? 'border-red-500'
                                                : 'border-gray-300'
                                        } text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5`}
                                        placeholder="Ingrese el peso"
                                    />
                                    {touchedFields.peso && (
                                        <InputError
                                            messages={errors.peso}
                                            className="mt-2"
                                        />
                                    )}
                                </div>
                                <div>
                                    <Label htmlFor="precio_compra">
                                        Precio de Compra
                                    </Label>
                                    <Input
                                        type="text"
                                        id="precio_compra"
                                        name="precio_compra"
                                        value={formData.precio_compra}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        className={`bg-gray-50 border ${
                                            errors.precio_compra
                                                ? 'border-red-500'
                                                : 'border-gray-300'
                                        } text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5`}
                                        placeholder="Ingrese el precio de compra"
                                    />
                                    {touchedFields.precio_compra && (
                                        <InputError
                                            messages={errors.precio_compra}
                                            className="mt-2"
                                        />
                                    )}
                                </div>
                                <div>
                                    <Label htmlFor="porcentaje_ganancia">
                                        Porcentaje de Ganancia
                                    </Label>
                                    <Input
                                        type="text"
                                        id="porcentaje_ganancia"
                                        name="porcentaje_ganancia"
                                        value={formData.porcentaje_ganancia}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        className={`bg-gray-50 border ${
                                            errors.porcentaje_ganancia
                                                ? 'border-red-500'
                                                : 'border-gray-300'
                                        } text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5`}
                                        placeholder="Ingrese el porcentaje de ganancia"
                                    />
                                    {touchedFields.porcentaje_ganancia && (
                                        <InputError
                                            messages={
                                                errors.porcentaje_ganancia
                                            }
                                            className="mt-2"
                                        />
                                    )}
                                </div>
                                <div>
                                    <Label htmlFor="porcentaje_ganancia_mayor">
                                        Porcentaje de Ganancia (Mayor)
                                    </Label>
                                    <Input
                                        type="text"
                                        id="porcentaje_ganancia_mayor"
                                        name="porcentaje_ganancia_mayor"
                                        value={
                                            formData.porcentaje_ganancia_mayor
                                        }
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        className={`bg-gray-50 border ${
                                            errors.porcentaje_ganancia_mayor
                                                ? 'border-red-500'
                                                : 'border-gray-300'
                                        } text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5`}
                                        placeholder="Ingrese el porcentaje de ganancia (Mayor)"
                                    />
                                    {touchedFields.porcentaje_ganancia_mayor && (
                                        <InputError
                                            messages={
                                                errors.porcentaje_ganancia_mayor
                                            }
                                            className="mt-2"
                                        />
                                    )}
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
                                            errors.forma_de_venta
                                                ? 'border-red-500'
                                                : 'border-gray-300'
                                        } text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5`}
                                        placeholder="Ingrese la forma de venta"
                                    />
                                    {touchedFields.forma_de_venta && (
                                        <InputError
                                            messages={errors.forma_de_venta}
                                            className="mt-2"
                                        />
                                    )}
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
                                            errors.forma_de_venta_mayor
                                                ? 'border-red-500'
                                                : 'border-gray-300'
                                        } text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5`}
                                        placeholder="Ingrese la forma de venta (Mayor)"
                                    />
                                    {touchedFields.forma_de_venta_mayor && (
                                        <InputError
                                            messages={
                                                errors.forma_de_venta_mayor
                                            }
                                            className="mt-2"
                                        />
                                    )}
                                </div>
                                <div>
                                    <Label htmlFor="proveedor">Proveedor</Label>
                                    <Input
                                        type="text"
                                        id="proveedor"
                                        name="proveedor"
                                        value={formData.proveedor}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        className={`bg-gray-50 border ${
                                            errors.proveedor
                                                ? 'border-red-500'
                                                : 'border-gray-300'
                                        } text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w/full p-2.5`}
                                        placeholder="Ingrese el proveedor"
                                    />
                                    {touchedFields.proveedor && (
                                        <InputError
                                            messages={errors.proveedor}
                                            className="mt-2"
                                        />
                                    )}
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
