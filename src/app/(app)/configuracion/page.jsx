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

    if (!isLoaded || loading) {
        return <div>Loading...</div>
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
            <form onSubmit={submitForm} className={`m-4 p-6 `}>
                <div className="grid gap-4 sm:grid-cols-2">
                    <div className="sm:col-span-1 sm:row-span-2">
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
                    <div className="sm:col-span-1">
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
                    <div className="sm:col-span-1">
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
                    <div className="sm:col-span-1">
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
                    <div className="sm:col-span-1">
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
                    <div className="sm:col-span-1">
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
                    <div className="sm:col-span-1">
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
                </div>
                <div className="flex justify-end mt-4 mb-8">
                    <Button className="bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center">
                        GUARDAR
                    </Button>
                </div>
            </form>
        </div>
    )
}

export default ConfigurationForm
