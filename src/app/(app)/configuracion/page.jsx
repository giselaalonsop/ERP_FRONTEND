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

const ConfigurationForm = () => {
    const { hasPermission, user } = useAuth({ middleware: 'auth' })
    const {
        configuracion,
        createConfiguracion,
        updateConfiguracion,
        loading,
    } = useConfiguracion()

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
    const [errors, setErrors] = useState([])

    useEffect(() => {
        if (configuracion) {
            setId(configuracion.id)
            setIva(configuracion.IVA || '')
            setPorcentajeGanancia(configuracion.porcentaje_ganancia || '')
            setNombreEmpresa(configuracion.nombre_empresa || '')
            setTelefono(configuracion.telefono || '')
            setRif(configuracion.rif || '')
            setCorreo(configuracion.correo || '')
            setDirecciones(configuracion.direcciones || [])
            setPagoMovil(configuracion.pago_movil || [])
            setTransferencias(configuracion.transferencias || [])
            if (configuracion.logo) {
                const logoPath = `http://localhost:8000/${configuracion.logo}`
                setLogoPreview(logoPath)
            }
        }
    }, [configuracion])

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

    const submitForm = async event => {
        event.preventDefault()
        setErrors([])

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
        console.log('formData:', formData)

        try {
            const response = id
                ? await updateConfiguracion(id, formData)
                : await createConfiguracion(formData)
            if (response.status === 200 || response.status === 201) {
                Swal.fire('Configuración guardada', '', 'success')
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

    if (loading) {
        return <div>Loading...</div>
    }

    return (
        <div className="max-w-3xl mx-auto bg-blue-50 p-8 rounded-lg shadow-lg">
            <div className="text-center mb-10">
                <h1 className="text-2xl font-semibold">Configuración</h1>
                <p>Actualiza la configuración de la empresa</p>
            </div>
            <form onSubmit={submitForm}>
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
                                    className="rounded-lg mx-auto object-cover"
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
                            value={nombreEmpresa}
                            className="border border-gray-300 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                            onChange={event =>
                                setNombreEmpresa(event.target.value)
                            }
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
                            value={rif}
                            className="border border-gray-300 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                            onChange={event => setRif(event.target.value)}
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
                            value={iva}
                            className="border border-gray-300 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                            onChange={event => setIva(event.target.value)}
                            required
                        />
                        <InputError messages={errors?.IVA} className="mt-2" />
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
                            value={porcentajeGanancia}
                            className="border border-gray-300 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                            onChange={event =>
                                setPorcentajeGanancia(event.target.value)
                            }
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
                            value={telefono}
                            className="border border-gray-300 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                            onChange={event => setTelefono(event.target.value)}
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
                            value={correo}
                            className="border border-gray-300 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                            onChange={event => setCorreo(event.target.value)}
                            required
                        />
                        <InputError
                            messages={errors?.correo}
                            className="mt-2"
                        />
                    </div>
                    <div className="sm:col-span-2">
                        <Label
                            htmlFor="direcciones"
                            className="block mb-2 text-sm font-medium">
                            Direcciones
                        </Label>
                        <textarea
                            id="direcciones"
                            value={direcciones.join(', ')}
                            className="border border-gray-300 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                            onChange={handleArrayChange(setDirecciones)}
                        />
                        <InputError
                            messages={errors?.direcciones}
                            className="mt-2"
                        />
                    </div>
                    <div className="sm:col-span-2">
                        <Label
                            htmlFor="pago_movil"
                            className="block mb-2 text-sm font-medium">
                            Pago Móvil
                        </Label>
                        <textarea
                            id="pago_movil"
                            value={pagoMovil.join(', ')}
                            className="border border-gray-300 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                            onChange={handleArrayChange(setPagoMovil)}
                        />
                        <InputError
                            messages={errors?.pago_movil}
                            className="mt-2"
                        />
                    </div>
                    <div className="sm:col-span-2">
                        <Label
                            htmlFor="transferencias"
                            className="block mb-2 text-sm font-medium">
                            Transferencias
                        </Label>
                        <textarea
                            id="transferencias"
                            value={transferencias.join(', ')}
                            className="border border-gray-300 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                            onChange={handleArrayChange(setTransferencias)}
                        />
                        <InputError
                            messages={errors?.transferencias}
                            className="mt-2"
                        />
                    </div>
                </div>
                <div className="flex justify-end mt-4">
                    <Button className="bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center">
                        GUARDAR
                    </Button>
                </div>
            </form>
        </div>
    )
}

export default ConfigurationForm
