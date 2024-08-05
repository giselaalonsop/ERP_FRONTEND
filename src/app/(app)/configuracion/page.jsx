'use client'
import { useAuth } from '@/hooks/auth'
import Button from '@/components/Button'
import InputError from '@/components/InputError'
import Label from '@/components/Label'
import { useState, useEffect } from 'react'
import Swal from 'sweetalert2'
import { useDropzone } from 'react-dropzone'
import useConfiguracion from '@/hooks/useConfiguracion'
import 'tailwindcss/tailwind.css'
import { useTheme } from '@/context/ThemeProvider'
import { useCategories } from '@/hooks/useCategories'
import { useParametros } from '@/hooks/useParametros'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
    faPenToSquare,
    faTrashAlt,
    faPlus,
    faEdit,
    faCircleCheck,
    faChevronDown,
} from '@fortawesome/free-solid-svg-icons'

// Function to capitalize only if the first character is a letter
const capitalizeFirstLetter = string => {
    if (!string) return string
    return /^[a-zA-Z]/.test(string)
        ? string.charAt(0).toUpperCase() + string.slice(1)
        : string
}

const ConfigurationForm = () => {
    const { hasPermission, user } = useAuth({ middleware: 'auth' })
    const {
        configuracion: configData,
        createConfiguracion,
        updateConfiguracion,
        loading,
    } = useConfiguracion()
    const { isDark } = useTheme()

    const [isLoaded, setIsLoaded] = useState(false)
    const [id, setId] = useState(null)
    const [iva, setIva] = useState('')
    const [porcentajeGanancia, setPorcentajeGanancia] = useState('')
    const [nombreEmpresa, setNombreEmpresa] = useState('')
    const [telefono, setTelefono] = useState('')
    const [rif, setRif] = useState('')
    const [correo, setCorreo] = useState('')
    const [direcciones, setDirecciones] = useState([])
    const [pagoMovil, setPagoMovil] = useState([])
    const [transferencias, setTransferencias] = useState([])
    const [logoFile, setLogoFile] = useState(null)
    const [logoPreview, setLogoPreview] = useState('')
    const [errors, setErrors] = useState({})
    const [touchedFields, setTouchedFields] = useState({})

    const {
        categories,
        addCategoria,
        updateCategoria,
        deleteCategoria,
        isLoading: isLoadingCategories,
        isError: isErrorCategories,
    } = useCategories()

    const {
        unidadesMedida,
        formasVenta,
        addUnidadMedida,
        updateUnidadMedida,
        deleteUnidadMedida,
        addFormaVenta,
        updateFormaVenta,
        deleteFormaVenta,
        isLoading: isLoadingParametros,
        isError: isErrorParametros,
    } = useParametros()

    const [newCategory, setNewCategory] = useState('')
    const [editingCategoryId, setEditingCategoryId] = useState(null)
    const [editingCategoryName, setEditingCategoryName] = useState('')
    const [dropdownOpenCategory, setDropdownOpenCategory] = useState(false)
    const [categoryError, setCategoryError] = useState('')

    const [newUnit, setNewUnit] = useState('')
    const [editingUnitId, setEditingUnitId] = useState(null)
    const [editingUnitName, setEditingUnitName] = useState('')
    const [dropdownOpenUnit, setDropdownOpenUnit] = useState(false)
    const [unitError, setUnitError] = useState('')

    const [newSaleForm, setNewSaleForm] = useState('')
    const [editingSaleFormId, setEditingSaleFormId] = useState(null)
    const [editingSaleFormName, setEditingSaleFormName] = useState('')
    const [dropdownOpenSaleForm, setDropdownOpenSaleForm] = useState(false)
    const [saleFormError, setSaleFormError] = useState('')

    // Carga inicial desde localStorage
    useEffect(() => {
        const storedConfig = JSON.parse(localStorage.getItem('configuracion'))
        if (storedConfig) {
            setId(storedConfig.id)
            setIva(storedConfig.IVA || '')
            setPorcentajeGanancia(storedConfig.porcentaje_ganancia || '')
            setNombreEmpresa(storedConfig.nombre_empresa || '')
            setTelefono(storedConfig.telefono || '')
            setRif(storedConfig.rif || '')
            setCorreo(storedConfig.correo || '')
            setDirecciones(storedConfig.direcciones || [])
            setPagoMovil(storedConfig.pago_movil || [])
            setTransferencias(storedConfig.transferencias || [])
            if (storedConfig.logo) {
                const logoPath = `http://localhost:8000/${storedConfig.logo}`
                setLogoPreview(logoPath)
            }
        }
        setIsLoaded(true)
    }, [])

    // Sincroniza configuracion desde el hook
    useEffect(() => {
        if (configData) {
            setId(configData.id)
            setIva(configData.IVA || '')
            setPorcentajeGanancia(configData.porcentaje_ganancia || '')
            setNombreEmpresa(configData.nombre_empresa || '')
            setTelefono(configData.telefono || '')
            setRif(configData.rif || '')
            setCorreo(configData.correo || '')
            setDirecciones(configData.direcciones || [])
            setPagoMovil(configData.pago_movil || [])
            setTransferencias(configData.transferencias || [])
            if (configData.logo) {
                const logoPath = `http://localhost:8000/${configData.logo}`
                setLogoPreview(logoPath)
            }
            localStorage.setItem('configuracion', JSON.stringify(configData))
        }
    }, [configData])

    const handleArrayChange = setter => event => {
        const value = event.target.value.split(',').map(item => item.trim())
        setter(value)
    }

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

    const handleBlur = e => {
        const { name, value } = e.target
        setTouchedFields(prevTouchedFields => ({
            ...prevTouchedFields,
            [name]: true,
        }))
        validateField(name, value)
    }

    const validateField = (name, value) => {
        let newErrors = {}

        switch (name) {
            case 'nombre_empresa':
                if (!value) {
                    newErrors.nombre_empresa =
                        'Nombre de la empresa es requerido'
                }
                break
            case 'rif':
                if (!value) {
                    newErrors.rif = 'RIF es requerido'
                }
                break
            case 'iva':
                if (!value || isNaN(value)) {
                    newErrors.iva = 'IVA debe ser un número'
                }
                break
            case 'porcentaje_ganancia':
                if (!value || isNaN(value)) {
                    newErrors.porcentaje_ganancia =
                        'Porcentaje de ganancia debe ser un número'
                }
                break
            case 'telefono':
                if (!value || isNaN(value)) {
                    newErrors.telefono = 'Teléfono debe ser un número'
                }
                break
            case 'correo':
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
                if (!value || !emailRegex.test(value)) {
                    newErrors.correo = 'Correo inválido'
                }
                break
            default:
                break
        }

        setErrors(prevErrors => ({
            ...prevErrors,
            ...newErrors,
        }))
    }

    const handleBlurSelect = event => {
        // Chequea si el nuevo elemento enfocado está fuera del dropdown
        if (!event.currentTarget.contains(event.relatedTarget)) {
            setDropdownOpenUnit(false)
            setDropdownOpenSaleForm(false)
        }
    }

    const handleChange = e => {
        const { name, value } = e.target
        let newValue = value

        if (['iva', 'porcentaje_ganancia', 'telefono'].includes(name)) {
            newValue = value.replace(/[^\d]/g, '')
        }

        switch (name) {
            case 'iva':
                setIva(newValue)
                break
            case 'porcentaje_ganancia':
                setPorcentajeGanancia(newValue)
                break
            case 'telefono':
                setTelefono(newValue)
                break
            default:
                break
        }
    }

    // Handle changes for new unit and new sale form inputs
    const handleChangeNewUnit = e => {
        const { value } = e.target
        setNewUnit(capitalizeFirstLetter(value))
    }

    const handleChangeNewSaleForm = e => {
        const { value } = e.target
        setNewSaleForm(capitalizeFirstLetter(value))
    }

    // Categorías Handlers
    const handleAddCategory = async () => {
        if (!newCategory) {
            setCategoryError('La categoría es requerida')
            return
        }

        try {
            await addCategoria({ nombre: newCategory })
            setNewCategory('')
            setCategoryError('')
            Swal.fire('Categoría creada', '', 'success')
        } catch (error) {
            console.error('Error al agregar la categoría:', error)
            setCategoryError('Error al crear la categoría')
        }
    }

    const handleEditCategory = async (id, name) => {
        setEditingCategoryId(id)
        setEditingCategoryName(name)
    }

    const handleUpdateCategory = async () => {
        if (editingCategoryId && editingCategoryName) {
            try {
                await updateCategoria(editingCategoryId, {
                    nombre: editingCategoryName,
                })
                setEditingCategoryId(null)
                setEditingCategoryName('')
                Swal.fire('Categoría actualizada', '', 'success')
            } catch (error) {
                console.error('Error al actualizar la categoría:', error)
                Swal.fire(
                    'Error',
                    'No se pudo actualizar la categoría',
                    'error',
                )
            }
        }
    }

    const handleDeleteCategory = async id => {
        Swal.fire({
            title: '¿Está seguro de eliminar?',
            text: '¡Podrá recuperar el registro en la Papelera!',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sí, eliminarla!',
        }).then(async result => {
            if (result.isConfirmed) {
                try {
                    await deleteCategoria(id)
                    Swal.fire('Categoría eliminada', '', 'success')
                } catch (error) {
                    console.error('Error al eliminar la categoría:', error)
                    Swal.fire(
                        'Error',
                        'No se pudo eliminar la categoría',
                        'error',
                    )
                }
            }
        })
    }

    // Unidades de Medida Handlers
    const handleAddUnit = async () => {
        if (!newUnit) {
            setUnitError('La unidad de medida es requerida')
            return
        }

        try {
            await addUnidadMedida({ nombre: newUnit })
            setNewUnit('')
            setUnitError('')
            Swal.fire('Unidad de medida creada', '', 'success')
        } catch (error) {
            console.error('Error al agregar la unidad de medida:', error)
            setUnitError('Error al crear la unidad de medida')
        }
    }

    const handleEditUnit = async (id, name) => {
        setEditingUnitId(id)
        setEditingUnitName(name)
    }

    const handleUpdateUnit = async () => {
        if (editingUnitId && editingUnitName) {
            try {
                await updateUnidadMedida(editingUnitId, {
                    nombre: editingUnitName,
                })
                setEditingUnitId(null)
                setEditingUnitName('')
                Swal.fire('Unidad de medida actualizada', '', 'success')
            } catch (error) {
                console.error('Error al actualizar la unidad de medida:', error)
                Swal.fire(
                    'Error',
                    'No se pudo actualizar la unidad de medida',
                    'error',
                )
            }
        }
    }

    const handleDeleteUnit = async id => {
        Swal.fire({
            title: '¿Está seguro de eliminar?',
            text: 'Podra registrarlo nuavemente luego',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sí, eliminarla!',
        }).then(async result => {
            if (result.isConfirmed) {
                try {
                    await deleteUnidadMedida(id)
                    Swal.fire('Unidad de medida eliminada', '', 'success')
                } catch (error) {
                    console.error(
                        'Error al eliminar la unidad de medida:',
                        error,
                    )
                    Swal.fire(
                        'Error',
                        'No se pudo eliminar la unidad de medida',
                        'error',
                    )
                }
            }
        })
    }

    // Formas de Venta Handlers
    const handleAddSaleForm = async () => {
        if (!newSaleForm) {
            setSaleFormError('La forma de venta es requerida')
            return
        }

        try {
            await addFormaVenta({ nombre: newSaleForm })
            setNewSaleForm('')
            setSaleFormError('')
            Swal.fire('Forma de venta creada', '', 'success')
        } catch (error) {
            console.error('Error al agregar la forma de venta:', error)
            setSaleFormError('Error al crear la forma de venta')
        }
    }

    const handleEditSaleForm = async (id, name) => {
        setEditingSaleFormId(id)
        setEditingSaleFormName(name)
    }

    const handleUpdateSaleForm = async () => {
        if (editingSaleFormId && editingSaleFormName) {
            try {
                await updateFormaVenta(editingSaleFormId, {
                    nombre: editingSaleFormName,
                })
                setEditingSaleFormId(null)
                setEditingSaleFormName('')
                Swal.fire('Forma de venta actualizada', '', 'success')
            } catch (error) {
                console.error('Error al actualizar la forma de venta:', error)
                Swal.fire(
                    'Error',
                    'No se pudo actualizar la forma de venta',
                    'error',
                )
            }
        }
    }

    const handleDeleteSaleForm = async id => {
        Swal.fire({
            title: '¿Está seguro de eliminar?',
            text: '¡Podrá recuperar el registro en la Papelera!',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sí, eliminarla!',
        }).then(async result => {
            if (result.isConfirmed) {
                try {
                    await deleteFormaVenta(id)
                    Swal.fire('Forma de venta eliminada', '', 'success')
                } catch (error) {
                    console.error('Error al eliminar la forma de venta:', error)
                    Swal.fire(
                        'Error',
                        'No se pudo eliminar la forma de venta',
                        'error',
                    )
                }
            }
        })
    }

    const toggleDropdown = type => {
        if (type === 'category') {
            setDropdownOpenCategory(!dropdownOpenCategory)
        } else if (type === 'unit') {
            setDropdownOpenUnit(!dropdownOpenUnit)
        } else if (type === 'saleForm') {
            setDropdownOpenSaleForm(!dropdownOpenSaleForm)
        }
    }

    const submitForm = async event => {
        event.preventDefault()
        setErrors({})

        const formData = new FormData()
        formData.append('IVA', iva)
        formData.append('porcentaje_ganancia', porcentajeGanancia)
        formData.append('nombre_empresa', nombreEmpresa)
        formData.append('telefono', telefono)
        formData.append('rif', rif)
        formData.append('correo', correo)
        formData.append('direcciones', direcciones)
        formData.append('pago_movil', pagoMovil)
        formData.append('transferencias', transferencias)
        if (logoFile) {
            formData.append('logo', logoFile)
        }
        formData.append('numero_sucursales', 2)

        try {
            const response = await createConfiguracion(formData)
            if (response.status === 200 || response.status === 201) {
                Swal.fire('Configuración guardada', '', 'success')
                // Actualiza localStorage después de guardar
                localStorage.setItem(
                    'configuracion',
                    JSON.stringify(configData),
                )
            }
        } catch (error) {
            console.error('Error:', error)
            Swal.fire('Hubo un problema al procesar tu solicitud', '', 'error')
        }
    }

    if (!hasPermission('configuraciones') && user.rol !== 'admin') {
        return (
            <>
                <div>No tienes permisos</div>
                <Button
                    onClick={onClose}
                    className="block w-full text-center max-w-xs mx-auto bg-red-500 hover:bg-red-700 focus:bg-red-700 text-white rounded-lg px-3 py-3 font-semibold">
                    Cerrar
                </Button>
            </>
        )
    }

    if (
        !isLoaded ||
        loading ||
        isLoadingCategories ||
        isLoadingParametros ||
        !categories ||
        !unidadesMedida ||
        !formasVenta
    ) {
        return <div className="text-center">Cargando...</div>
    }

    return (
        <div
            className={`max-w-3xl mx-auto rounded-md shadow-sm shadow-slate-300 ${
                isDark ? 'bg-gray-800 text-gray-400' : 'bg-white text-black'
            }`}>
            <div className="text-center mb-10 pt-4">
                <h1 className="text-2xl font-semibold">Configuración</h1>
                <p>Actualiza la configuración de la empresa</p>
            </div>
            <form onSubmit={submitForm} className={`m-4 p-6 overflow-hidden`}>
                <div className="grid gap-4 sm:grid-cols-2">
                    <div className="sm:col-span-1 sm:row-span-2 mb-4">
                        <Label
                            htmlFor="logo"
                            className="block mb-2 text-sm font-medium">
                            Logo
                        </Label>
                        <div
                            {...getRootProps()}
                            className={`border-2 border-dashed rounded-lg p-4 text-center cursor-pointer ${
                                isDragActive
                                    ? 'border-blue-600'
                                    : 'border-gray-300'
                            }`}
                            style={{ height: '200px' }}>
                            <input {...getInputProps()} />
                            {logoPreview ? (
                                <img
                                    src={logoPreview}
                                    alt="Logo preview"
                                    className={`${
                                        isDark ? 'bg-gray-800' : 'bg-gray-50'
                                    } rounded-lg mx-auto object-cover`}
                                    style={{ width: '100%', height: '100%' }}
                                />
                            ) : (
                                <p className="text-sm text-gray-500">
                                    Arrastra y suelta un archivo aquí, o haz
                                    clic para seleccionar uno
                                </p>
                            )}
                        </div>
                        <InputError messages={errors?.logo} className="mt-2" />
                    </div>
                    <div className="sm:col-span-1 mb-4">
                        <Label
                            htmlFor="nombre_empresa"
                            className="block mb-2 text-sm font-medium">
                            Nombre de la Empresa
                        </Label>
                        <input
                            type="text"
                            id="nombre_empresa"
                            name="nombre_empresa"
                            className={`${
                                isDark ? 'bg-gray-800' : 'bg-gray-50'
                            } border border-gray-300 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5`}
                            value={nombreEmpresa}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            required
                        />
                        <InputError
                            messages={errors?.nombre_empresa}
                            className="mt-2"
                        />
                    </div>
                    <div className="sm:col-span-1 mb-4">
                        <Label
                            htmlFor="rif"
                            className="block mb-2 text-sm font-medium">
                            RIF
                        </Label>
                        <input
                            type="text"
                            id="rif"
                            name="rif"
                            value={rif}
                            className={`${
                                isDark ? 'bg-gray-800' : 'bg-gray-50'
                            } border border-gray-300 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5`}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            required
                        />
                        <InputError messages={errors?.rif} className="mt-2" />
                    </div>
                    <div className="sm:col-span-1 mb-4">
                        <Label
                            htmlFor="iva"
                            className="block mb-2 text-sm font-medium">
                            IVA
                        </Label>
                        <input
                            type="text"
                            id="iva"
                            name="iva"
                            value={iva}
                            className={`${
                                isDark ? 'bg-gray-800' : 'bg-gray-50'
                            } border border-gray-300 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5`}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            required
                        />
                        <InputError messages={errors?.iva} className="mt-2" />
                    </div>
                    <div className="sm:col-span-1 mb-4">
                        <Label
                            htmlFor="porcentaje_ganancia"
                            className="block mb-2 text-sm font-medium">
                            Porcentaje de Ganancia
                        </Label>
                        <input
                            type="text"
                            id="porcentaje_ganancia"
                            name="porcentaje_ganancia"
                            value={porcentajeGanancia}
                            className={`${
                                isDark ? 'bg-gray-800' : 'bg-gray-50'
                            } border border-gray-300 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5`}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            required
                        />
                        <InputError
                            messages={errors?.porcentaje_ganancia}
                            className="mt-2"
                        />
                    </div>
                    <div className="sm:col-span-1 mb-4">
                        <Label
                            htmlFor="telefono"
                            className="block mb-2 text-sm font-medium">
                            Teléfono
                        </Label>
                        <input
                            type="text"
                            id="telefono"
                            name="telefono"
                            value={telefono}
                            className={`${
                                isDark ? 'bg-gray-800' : 'bg-gray-50'
                            } border border-gray-300 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5`}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            required
                        />
                        <InputError
                            messages={errors?.telefono}
                            className="mt-2"
                        />
                    </div>
                    <div className="sm:col-span-1 mb-4">
                        <Label
                            htmlFor="correo"
                            className="block mb-2 text-sm font-medium">
                            Correo
                        </Label>
                        <input
                            type="email"
                            id="correo"
                            name="correo"
                            value={correo}
                            className={`${
                                isDark ? 'bg-gray-800' : 'bg-gray-50'
                            } border border-gray-300 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5`}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            required
                        />
                        <InputError
                            messages={errors?.correo}
                            className="mt-2"
                        />
                    </div>

                    {/* Categorías */}
                    <div className="sm:col-span-1 mb-4">
                        <div className="relative inline-block text-left">
                            <Label
                                htmlFor="category_action"
                                className="block mb-2 text-sm font-medium">
                                Acción en Categorías
                            </Label>
                            <button
                                style={{ width: '340px', height: '40px' }}
                                type="button"
                                onClick={() => toggleDropdown('category')}
                                className={`${
                                    isDark ? 'bg-gray-800' : 'bg-gray-50'
                                } flex justify-between items-center border border-gray-300 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 w-full p-2.5`}>
                                <p className="text-left">
                                    Seleccione una categoría
                                </p>
                                <FontAwesomeIcon
                                    icon={faChevronDown}
                                    className="w-5 h-5"
                                />
                            </button>

                            {dropdownOpenCategory && (
                                <div
                                    style={{ zIndex: 1000 }}
                                    className="mb-4 origin-top-right absolute right-0 mt-2 w-full rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 max-h-20 overflow-y-auto"
                                    onBlur={() =>
                                        setDropdownOpenCategory(false)
                                    }
                                    tabIndex={-1}>
                                    <div
                                        className="py-2 p-2"
                                        role="menu"
                                        aria-orientation="vertical"
                                        aria-labelledby="dropdown-button">
                                        {categories &&
                                            categories.map(category => (
                                                <div
                                                    key={category.id}
                                                    className="flex items-center justify-between px-4 py-2 mb-1 text-sm text-gray-700 bg-white rounded-md hover:bg-gray-100">
                                                    <span>
                                                        {editingCategoryId ===
                                                        category.id ? (
                                                            <input
                                                                type="text"
                                                                value={
                                                                    editingCategoryName
                                                                }
                                                                onChange={e =>
                                                                    setEditingCategoryName(
                                                                        e.target
                                                                            .value,
                                                                    )
                                                                }
                                                                className="bg-gray-50 border border-gray-300 text-sm rounded-lg block w-full p-2.5"
                                                            />
                                                        ) : (
                                                            category.nombre
                                                        )}
                                                    </span>
                                                    <div className="flex items-center">
                                                        {editingCategoryId ===
                                                        category.id ? (
                                                            <>
                                                                <button
                                                                    type="button"
                                                                    onClick={
                                                                        handleUpdateCategory
                                                                    }
                                                                    className="text-lg text-green-500 hover:text-green-700 mr-2">
                                                                    <FontAwesomeIcon
                                                                        icon={
                                                                            faCircleCheck
                                                                        }
                                                                    />
                                                                </button>
                                                                <button
                                                                    type="button"
                                                                    onClick={() =>
                                                                        setEditingCategoryId(
                                                                            null,
                                                                        )
                                                                    }
                                                                    className="text-lg text-gray-500 hover:text-gray-700">
                                                                    Cancelar
                                                                </button>
                                                            </>
                                                        ) : (
                                                            <>
                                                                <button
                                                                    type="button"
                                                                    onClick={() =>
                                                                        handleEditCategory(
                                                                            category.id,
                                                                            category.nombre,
                                                                        )
                                                                    }
                                                                    className="text-lg text-blue-500 hover:text-blue-700 mr-2">
                                                                    <FontAwesomeIcon
                                                                        icon={
                                                                            faEdit
                                                                        }
                                                                    />
                                                                </button>
                                                                <button
                                                                    type="button"
                                                                    onClick={() =>
                                                                        handleDeleteCategory(
                                                                            category.id,
                                                                        )
                                                                    }
                                                                    className="text-lg text-red-500 hover:text-red-700">
                                                                    <FontAwesomeIcon
                                                                        icon={
                                                                            faTrashAlt
                                                                        }
                                                                    />
                                                                </button>
                                                            </>
                                                        )}
                                                    </div>
                                                </div>
                                            ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="sm:col-span-1 mb-4">
                        <div>
                            <label
                                htmlFor="new_category"
                                className="block mb-2 text-sm font-medium">
                                Nueva Categoría{' '}
                            </label>
                            <div className="flex">
                                <input
                                    type="text"
                                    id="new_category"
                                    name="new_category"
                                    value={newCategory}
                                    onChange={e =>
                                        setNewCategory(e.target.value)
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
                                    <FontAwesomeIcon icon={faPlus} />
                                </button>
                            </div>
                            <InputError
                                messages={categoryError}
                                className="mt-2"
                            />
                        </div>
                    </div>

                    {/* Unidades de Medida */}
                    <div className="sm:col-span-1 mb-4">
                        <div className="relative inline-block text-left">
                            <Label
                                htmlFor="unit_action"
                                className="block mb-2 text-sm font-medium">
                                Acción en Unidades de Medida
                            </Label>
                            <button
                                style={{ width: '340px', height: '40px' }}
                                type="button"
                                onClick={() => toggleDropdown('unit')}
                                className={`${
                                    isDark ? 'bg-gray-800' : 'bg-gray-50'
                                } flex justify-between items-center border border-gray-300 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 w-full p-2.5`}>
                                <p className="text-left">
                                    Seleccione una unidad de medida
                                </p>
                                <FontAwesomeIcon
                                    icon={faChevronDown}
                                    className="w-5 h-5"
                                />
                            </button>

                            {dropdownOpenUnit && (
                                <div
                                    onBlur={handleBlurSelect}
                                    style={{ zIndex: 1000 }}
                                    className="mb-4 origin-top-right absolute right-0 mt-2 w-full rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 max-h-20 overflow-y-auto"
                                    tabIndex={-1}>
                                    <div
                                        className="py-2 p-2"
                                        role="menu"
                                        aria-orientation="vertical"
                                        aria-labelledby="dropdown-button">
                                        {unidadesMedida &&
                                            unidadesMedida.map(unit => (
                                                <div
                                                    key={unit.id}
                                                    className="flex items-center justify-between px-4 py-2 mb-1 text-sm text-gray-700 bg-white rounded-md hover:bg-gray-100">
                                                    <span>
                                                        {editingUnitId ===
                                                        unit.id ? (
                                                            <input
                                                                type="text"
                                                                value={
                                                                    editingUnitName
                                                                }
                                                                onChange={e =>
                                                                    setEditingUnitName(
                                                                        e.target
                                                                            .value,
                                                                    )
                                                                }
                                                                className="bg-gray-50 border border-gray-300 text-sm rounded-lg block w-full p-2.5"
                                                            />
                                                        ) : (
                                                            unit.nombre
                                                        )}
                                                    </span>
                                                    <div className="flex items-center">
                                                        {editingUnitId ===
                                                        unit.id ? (
                                                            <>
                                                                <button
                                                                    type="button"
                                                                    onClick={
                                                                        handleUpdateUnit
                                                                    }
                                                                    className="text-lg text-green-500 hover:text-green-700 mr-2">
                                                                    <FontAwesomeIcon
                                                                        icon={
                                                                            faCircleCheck
                                                                        }
                                                                    />
                                                                </button>
                                                                <button
                                                                    type="button"
                                                                    onClick={() =>
                                                                        setEditingUnitId(
                                                                            null,
                                                                        )
                                                                    }
                                                                    className="text-lg text-gray-500 hover:text-gray-700">
                                                                    Cancelar
                                                                </button>
                                                            </>
                                                        ) : (
                                                            <>
                                                                <button
                                                                    type="button"
                                                                    onClick={() =>
                                                                        handleEditUnit(
                                                                            unit.id,
                                                                            unit.nombre,
                                                                        )
                                                                    }
                                                                    className="text-lg text-blue-500 hover:text-blue-700 mr-2">
                                                                    <FontAwesomeIcon
                                                                        icon={
                                                                            faEdit
                                                                        }
                                                                    />
                                                                </button>
                                                                <button
                                                                    type="button"
                                                                    onClick={() =>
                                                                        handleDeleteUnit(
                                                                            unit.id,
                                                                        )
                                                                    }
                                                                    className="text-lg text-red-500 hover:text-red-700">
                                                                    <FontAwesomeIcon
                                                                        icon={
                                                                            faTrashAlt
                                                                        }
                                                                    />
                                                                </button>
                                                            </>
                                                        )}
                                                    </div>
                                                </div>
                                            ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="sm:col-span-1 mb-4">
                        <div>
                            <label
                                htmlFor="new_unit"
                                className="block mb-2 text-sm font-medium">
                                Nueva Unidad de Medida{' '}
                            </label>
                            <div className="flex">
                                <input
                                    type="text"
                                    id="new_unit"
                                    name="new_unit"
                                    value={newUnit}
                                    onChange={handleChangeNewUnit}
                                    onBlur={handleBlur}
                                    className={`bg-gray-50 border ${
                                        errors.unit && touchedFields.unit
                                            ? 'border-red-500'
                                            : 'border-gray-300'
                                    } text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5`}
                                    placeholder="Ingrese nueva unidad de medida"
                                />
                                <button
                                    type="button"
                                    onClick={handleAddUnit}
                                    className="ml-2 bg-blue-500 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg">
                                    <FontAwesomeIcon icon={faPlus} />
                                </button>
                            </div>
                            <InputError messages={unitError} className="mt-2" />
                        </div>
                    </div>

                    {/* Formas de Venta */}
                    <div className="sm:col-span-1 mb-4">
                        <div className="relative inline-block text-left">
                            <Label
                                htmlFor="sale_form_action"
                                className="block mb-2 text-sm font-medium">
                                Acción en Formas de Venta
                            </Label>
                            <button
                                style={{ width: '340px', height: '40px' }}
                                type="button"
                                onClick={() => toggleDropdown('saleForm')}
                                className={`${
                                    isDark ? 'bg-gray-800' : 'bg-gray-50'
                                } flex justify-between items-center border border-gray-300 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 w-full p-2.5`}>
                                <p className="text-left">
                                    Seleccione una forma de venta
                                </p>
                                <FontAwesomeIcon
                                    icon={faChevronDown}
                                    className="w-5 h-5"
                                />
                            </button>

                            {dropdownOpenSaleForm && (
                                <div
                                    onBlur={handleBlurSelect}
                                    style={{ zIndex: 1000 }}
                                    className="mb-4 origin-top-right absolute right-0 mt-2 w-full rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 max-h-20 overflow-y-auto"
                                    tabIndex={-1}>
                                    <div
                                        className="py-2 p-2"
                                        role="menu"
                                        aria-orientation="vertical"
                                        aria-labelledby="dropdown-button">
                                        {formasVenta &&
                                            formasVenta.map(saleForm => (
                                                <div
                                                    key={saleForm.id}
                                                    className="flex items-center justify-between px-4 py-2 mb-1 text-sm text-gray-700 bg-white rounded-md hover:bg-gray-100">
                                                    <span>
                                                        {editingSaleFormId ===
                                                        saleForm.id ? (
                                                            <input
                                                                type="text"
                                                                value={
                                                                    editingSaleFormName
                                                                }
                                                                onChange={e =>
                                                                    setEditingSaleFormName(
                                                                        e.target
                                                                            .value,
                                                                    )
                                                                }
                                                                className="bg-gray-50 border border-gray-300 text-sm rounded-lg block w-full p-2.5"
                                                            />
                                                        ) : (
                                                            saleForm.nombre
                                                        )}
                                                    </span>
                                                    <div className="flex items-center">
                                                        {editingSaleFormId ===
                                                        saleForm.id ? (
                                                            <>
                                                                <button
                                                                    type="button"
                                                                    onClick={
                                                                        handleUpdateSaleForm
                                                                    }
                                                                    className="text-lg text-green-500 hover:text-green-700 mr-2">
                                                                    <FontAwesomeIcon
                                                                        icon={
                                                                            faCircleCheck
                                                                        }
                                                                    />
                                                                </button>
                                                                <button
                                                                    type="button"
                                                                    onClick={() =>
                                                                        setEditingSaleFormId(
                                                                            null,
                                                                        )
                                                                    }
                                                                    className="text-lg text-gray-500 hover:text-gray-700">
                                                                    Cancelar
                                                                </button>
                                                            </>
                                                        ) : (
                                                            <>
                                                                <button
                                                                    type="button"
                                                                    onClick={() =>
                                                                        handleEditSaleForm(
                                                                            saleForm.id,
                                                                            saleForm.nombre,
                                                                        )
                                                                    }
                                                                    className="text-lg text-blue-500 hover:text-blue-700 mr-2">
                                                                    <FontAwesomeIcon
                                                                        icon={
                                                                            faEdit
                                                                        }
                                                                    />
                                                                </button>
                                                                <button
                                                                    type="button"
                                                                    onClick={() =>
                                                                        handleDeleteSaleForm(
                                                                            saleForm.id,
                                                                        )
                                                                    }
                                                                    className="text-lg text-red-500 hover:text-red-700">
                                                                    <FontAwesomeIcon
                                                                        icon={
                                                                            faTrashAlt
                                                                        }
                                                                    />
                                                                </button>
                                                            </>
                                                        )}
                                                    </div>
                                                </div>
                                            ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="sm:col-span-1 mb-4">
                        <div>
                            <label
                                htmlFor="new_sale_form"
                                className="block mb-2 text-sm font-medium">
                                Nueva Forma de Venta{' '}
                            </label>
                            <div className="flex">
                                <input
                                    type="text"
                                    id="new_sale_form"
                                    name="new_sale_form"
                                    value={newSaleForm}
                                    onChange={handleChangeNewSaleForm}
                                    onBlur={handleBlur}
                                    className={`bg-gray-50 border ${
                                        errors.saleForm &&
                                        touchedFields.saleForm
                                            ? 'border-red-500'
                                            : 'border-gray-300'
                                    } text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5`}
                                    placeholder="Ingrese nueva forma de venta"
                                />
                                <button
                                    type="button"
                                    onClick={handleAddSaleForm}
                                    className="ml-2 bg-blue-500 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg">
                                    <FontAwesomeIcon icon={faPlus} />
                                </button>
                            </div>
                            <InputError
                                messages={saleFormError}
                                className="mt-2"
                            />
                        </div>
                    </div>
                </div>

                <div className="flex justify-end mt-4 mb-8">
                    <Button
                        type="submit"
                        className="bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center">
                        GUARDAR
                    </Button>
                </div>
            </form>
        </div>
    )
}

export default ConfigurationForm
