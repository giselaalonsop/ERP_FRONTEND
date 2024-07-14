import React, { useState, useEffect } from 'react'
import { useProveedores } from '@/hooks/useProveedores'
import Button from '@/components/Button'
import Input from '@/components/Input'
import Label from '@/components/Label'
import Swal from 'sweetalert2'

const RegisterProveedor = ({ proveedor, onClose, onSave }) => {
    const { addProveedor, updateProveedor } = useProveedores()
    const [formData, setFormData] = useState({
        nombre: '',
        empresa: '',
        prefijo_telefono: '0412',
        telefono: '',
        correo: '',
        direccion: '',
        numeros_de_cuenta: [
            {
                banco: '',
                numero_cuenta: '',
                rif_cedula: '',
                telefono: '',
                pago_movil: false,
            },
        ],
    })
    const [errors, setErrors] = useState({})
    const [touched, setTouched] = useState({})

    useEffect(() => {
        if (proveedor) {
            const { telefono, ...rest } = proveedor
            setFormData({
                ...rest,
                prefijo_telefono: telefono.slice(0, 4),
                telefono: telefono.slice(4),
            })
        }
    }, [proveedor])

    useEffect(() => {
        validateForm()
    }, [formData])

    const handleChange = e => {
        const { name, value, checked, type } = e.target
        let formattedValue = value

        if (type === 'checkbox') {
            formattedValue = checked
        } else {
            formattedValue = value

            if (name === 'nombre' || name === 'empresa') {
                formattedValue = formattedValue.replace(/[^a-zA-Z\s]/g, '')
                formattedValue = formattedValue.replace(/\b\w/g, l =>
                    l.toUpperCase(),
                )
            } else if (name === 'telefono' || name.startsWith('telefono-')) {
                formattedValue = formattedValue.replace(/\D/g, '')
            }
        }

        setFormData({ ...formData, [name]: formattedValue })
    }

    const handleBlur = field => {
        setTouched({
            ...touched,
            [field]: true,
        })
    }

    const handleNumeroDeCuentaChange = (index, field, value) => {
        const newNumerosDeCuenta = formData.numeros_de_cuenta.map((cuenta, i) =>
            i === index ? { ...cuenta, [field]: value } : cuenta,
        )
        setFormData({ ...formData, numeros_de_cuenta: newNumerosDeCuenta })
    }

    const handleAddCuenta = () => {
        setFormData({
            ...formData,
            numeros_de_cuenta: [
                ...formData.numeros_de_cuenta,
                {
                    banco: '',
                    numero_cuenta: '',
                    rif_cedula: '',
                    telefono: '',
                    pago_movil: false,
                },
            ],
        })
    }

    const handleRemoveCuenta = index => {
        const newNumerosDeCuenta = formData.numeros_de_cuenta.filter(
            (cuenta, i) => i !== index,
        )
        setFormData({ ...formData, numeros_de_cuenta: newNumerosDeCuenta })
    }

    const validateForm = () => {
        const newErrors = {}
        if (!formData.nombre.trim()) {
            newErrors.nombre = 'El nombre no puede estar vacío'
        }
        if (!/^[A-Za-z\s]+$/.test(formData.nombre)) {
            newErrors.nombre = 'El nombre solo debe contener letras y espacios'
        }
        if (!formData.empresa.trim()) {
            newErrors.empresa = 'La empresa no puede estar vacía'
        }
        if (!formData.telefono.trim()) {
            newErrors.telefono = 'El teléfono no puede estar vacío'
        } else if (!/^\d{7}$/.test(formData.telefono)) {
            newErrors.telefono =
                'El teléfono debe contener exactamente 7 dígitos'
        }
        if (!formData.correo.trim()) {
            newErrors.correo = 'El correo no puede estar vacío'
        } else if (
            !/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}$/.test(
                formData.correo,
            )
        ) {
            newErrors.correo = 'Correo electrónico no válido'
        }
        if (!formData.direccion.trim()) {
            newErrors.direccion = 'La dirección no puede estar vacía'
        }

        formData.numeros_de_cuenta.forEach((cuenta, index) => {
            if (!cuenta.banco.trim()) {
                newErrors[`numeros_de_cuenta.${index}.banco`] =
                    'El banco no puede estar vacío'
            }
            if (!cuenta.numero_cuenta.trim()) {
                newErrors[`numeros_de_cuenta.${index}.numero_cuenta`] =
                    'El número de cuenta no puede estar vacío'
            }
            if (!cuenta.rif_cedula.trim()) {
                newErrors[`numeros_de_cuenta.${index}.rif_cedula`] =
                    'El RIF/Cédula no puede estar vacío'
            }
            if (!cuenta.telefono.trim()) {
                newErrors[`numeros_de_cuenta.${index}.telefono`] =
                    'El teléfono no puede estar vacío'
            } else if (!/^\d+$/.test(cuenta.telefono)) {
                newErrors[`numeros_de_cuenta.${index}.telefono`] =
                    'El teléfono solo debe contener números'
            }
        })

        setErrors(newErrors)
    }

    const handleSubmit = async e => {
        e.preventDefault()
        const allTouched = {
            nombre: true,
            empresa: true,
            prefijo_telefono: true,
            telefono: true,
            correo: true,
            direccion: true,
            numeros_de_cuenta: formData.numeros_de_cuenta.map(() => true),
        }
        setTouched(allTouched)

        validateForm()
        if (Object.keys(errors).length > 0) {
            Swal.fire('Error en la validación', '', 'error')
            return
        }

        const formDataToSubmit = {
            ...formData,
            telefono: `${formData.prefijo_telefono}${formData.telefono}`,
        }

        try {
            let response
            if (proveedor) {
                response = await updateProveedor(proveedor.id, formDataToSubmit)
                if (response.status === 422) {
                    setErrors(response.data.errors)
                } else {
                    Swal.fire('Proveedor Actualizado', '', 'success')
                    onClose()
                }
            } else {
                response = await addProveedor(formDataToSubmit)
                if (response.status === 422) {
                    setErrors(response.data.errors)
                    Swal.fire(
                        'Error',
                        response.data.error || 'Error de validación',
                        'error',
                    )
                } else {
                    if (onSave) onSave(response.data)
                    Swal.fire('Proveedor Registrado', '', 'success')
                    onClose()
                }
            }
        } catch (error) {
            Swal.fire(
                'Error',
                error.response?.data?.error ||
                    'Hubo un problema al procesar la solicitud',
                'error',
            )
        }
    }

    return (
        <div className="max-w-3xl mx-auto">
            <div className="text-center mb-10">
                <h2 className="text-2xl font-bold">
                    {proveedor ? 'Editar Proveedor' : 'Registrar Proveedor'}
                </h2>
            </div>
            <form onSubmit={handleSubmit}>
                <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                        <Label
                            htmlFor="nombre"
                            className="block mb-2 text-sm font-medium">
                            Nombre
                        </Label>
                        <Input
                            id="nombre"
                            name="nombre"
                            type="text"
                            value={formData.nombre}
                            className="border border-gray-300 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                            onChange={handleChange}
                            onBlur={() => handleBlur('nombre')}
                            required
                            placeholder="Ej: Juan"
                        />
                        <div
                            style={{
                                minHeight: '24px',
                                marginTop: '4px',
                                color: 'red',
                                fontSize: '12px',
                            }}>
                            {touched.nombre && errors?.nombre && errors.nombre}
                        </div>
                    </div>
                    <div>
                        <Label
                            htmlFor="empresa"
                            className="block mb-2 text-sm font-medium">
                            Empresa
                        </Label>
                        <Input
                            id="empresa"
                            name="empresa"
                            type="text"
                            value={formData.empresa}
                            className="border border-gray-300 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                            onChange={handleChange}
                            onBlur={() => handleBlur('empresa')}
                            required
                            placeholder="Ej: Empresa S.A."
                        />
                        <div
                            style={{
                                minHeight: '24px',
                                marginTop: '4px',
                                color: 'red',
                                fontSize: '12px',
                            }}>
                            {touched.empresa &&
                                errors?.empresa &&
                                errors.empresa}
                        </div>
                    </div>
                    <div>
                        <Label
                            htmlFor="telefono"
                            className="block mb-2 text-sm font-medium">
                            Teléfono
                        </Label>
                        <div className="flex">
                            <select
                                name="prefijo_telefono"
                                value={formData.prefijo_telefono}
                                onChange={handleChange}
                                className="border border-gray-300 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 p-2.5 mr-2">
                                <option value="0412">0412</option>
                                <option value="0414">0414</option>
                                <option value="0424">0424</option>
                                <option value="0426">0426</option>
                                <option value="0416">0416</option>
                            </select>
                            <Input
                                id="telefono"
                                name="telefono"
                                type="text"
                                value={formData.telefono}
                                className="border border-gray-300 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                                onChange={handleChange}
                                onBlur={() => handleBlur('telefono')}
                                required
                                placeholder="Ej: 1234567"
                            />
                        </div>
                        <div
                            style={{
                                minHeight: '24px',
                                marginTop: '4px',
                                color: 'red',
                                fontSize: '12px',
                            }}>
                            {touched.telefono &&
                                errors?.telefono &&
                                errors.telefono}
                        </div>
                    </div>
                    <div>
                        <Label
                            htmlFor="correo"
                            className="block mb-2 text-sm font-medium">
                            Correo Electrónico
                        </Label>
                        <Input
                            id="correo"
                            name="correo"
                            type="email"
                            value={formData.correo}
                            className="border border-gray-300 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                            onChange={handleChange}
                            onBlur={() => handleBlur('correo')}
                            required
                            placeholder="Ej: ejemplo@gmail.com"
                        />
                        <div
                            style={{
                                minHeight: '24px',
                                marginTop: '4px',
                                color: 'red',
                                fontSize: '12px',
                            }}>
                            {touched.correo && errors?.correo && errors.correo}
                        </div>
                    </div>
                    <div>
                        <Label
                            htmlFor="direccion"
                            className="block mb-2 text-sm font-medium">
                            Dirección
                        </Label>
                        <Input
                            id="direccion"
                            name="direccion"
                            type="text"
                            value={formData.direccion}
                            className="border border-gray-300 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                            onChange={handleChange}
                            onBlur={() => handleBlur('direccion')}
                            required
                            placeholder="Ej: Calle 123"
                        />
                        <div
                            style={{
                                minHeight: '24px',
                                marginTop: '4px',
                                color: 'red',
                                fontSize: '12px',
                            }}>
                            {touched.direccion &&
                                errors?.direccion &&
                                errors.direccion}
                        </div>
                    </div>
                </div>
                <div className="mt-6">
                    <h3 className="text-lg font-medium">Cuentas Bancarias</h3>
                    {formData.numeros_de_cuenta.map((cuenta, index) => (
                        <div key={index} className="border p-4 mt-4 rounded-lg">
                            <div className="grid gap-4 sm:grid-cols-2">
                                <div>
                                    <Label
                                        htmlFor={`banco-${index}`}
                                        className="block mb-2 text-sm font-medium">
                                        Banco
                                    </Label>
                                    <Input
                                        id={`banco-${index}`}
                                        name={`banco-${index}`}
                                        type="text"
                                        value={cuenta.banco}
                                        className="border border-gray-300 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                                        onChange={e =>
                                            handleNumeroDeCuentaChange(
                                                index,
                                                'banco',
                                                e.target.value,
                                            )
                                        }
                                        onBlur={() =>
                                            handleBlur(`banco-${index}`)
                                        }
                                        required
                                        placeholder="Ej: Banco XYZ"
                                    />
                                    <div
                                        style={{
                                            minHeight: '24px',
                                            marginTop: '4px',
                                            color: 'red',
                                            fontSize: '12px',
                                        }}>
                                        {touched[`banco-${index}`] &&
                                            errors?.[
                                                `numeros_de_cuenta.${index}.banco`
                                            ] &&
                                            errors[
                                                `numeros_de_cuenta.${index}.banco`
                                            ]}
                                    </div>
                                </div>
                                <div>
                                    <Label
                                        htmlFor={`numero_cuenta-${index}`}
                                        className="block mb-2 text-sm font-medium">
                                        Número de Cuenta
                                    </Label>
                                    <Input
                                        id={`numero_cuenta-${index}`}
                                        name={`numero_cuenta-${index}`}
                                        type="text"
                                        value={cuenta.numero_cuenta}
                                        className="border border-gray-300 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                                        onChange={e =>
                                            handleNumeroDeCuentaChange(
                                                index,
                                                'numero_cuenta',
                                                e.target.value,
                                            )
                                        }
                                        onBlur={() =>
                                            handleBlur(`numero_cuenta-${index}`)
                                        }
                                        required
                                        placeholder="Ej: 1234567890"
                                    />
                                    <div
                                        style={{
                                            minHeight: '24px',
                                            marginTop: '4px',
                                            color: 'red',
                                            fontSize: '12px',
                                        }}>
                                        {touched[`numero_cuenta-${index}`] &&
                                            errors?.[
                                                `numeros_de_cuenta.${index}.numero_cuenta`
                                            ] &&
                                            errors[
                                                `numeros_de_cuenta.${index}.numero_cuenta`
                                            ]}
                                    </div>
                                </div>
                                <div>
                                    <Label
                                        htmlFor={`rif_cedula-${index}`}
                                        className="block mb-2 text-sm font-medium">
                                        RIF/Cédula
                                    </Label>
                                    <Input
                                        id={`rif_cedula-${index}`}
                                        name={`rif_cedula-${index}`}
                                        type="text"
                                        value={cuenta.rif_cedula}
                                        className="border border-gray-300 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                                        onChange={e =>
                                            handleNumeroDeCuentaChange(
                                                index,
                                                'rif_cedula',
                                                e.target.value,
                                            )
                                        }
                                        onBlur={() =>
                                            handleBlur(`rif_cedula-${index}`)
                                        }
                                        required
                                        placeholder="Ej: J-12345678-9"
                                    />
                                    <div
                                        style={{
                                            minHeight: '24px',
                                            marginTop: '4px',
                                            color: 'red',
                                            fontSize: '12px',
                                        }}>
                                        {touched[`rif_cedula-${index}`] &&
                                            errors?.[
                                                `numeros_de_cuenta.${index}.rif_cedula`
                                            ] &&
                                            errors[
                                                `numeros_de_cuenta.${index}.rif_cedula`
                                            ]}
                                    </div>
                                </div>
                                <div>
                                    <Label
                                        htmlFor={`telefono-${index}`}
                                        className="block mb-2 text-sm font-medium">
                                        Teléfono
                                    </Label>
                                    <Input
                                        id={`telefono-${index}`}
                                        name={`telefono-${index}`}
                                        type="text"
                                        value={cuenta.telefono}
                                        className="border border-gray-300 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                                        onChange={e =>
                                            handleNumeroDeCuentaChange(
                                                index,
                                                'telefono',
                                                e.target.value,
                                            )
                                        }
                                        onBlur={() =>
                                            handleBlur(`telefono-${index}`)
                                        }
                                        required
                                        placeholder="Ej: 04141234567"
                                    />
                                    <div
                                        style={{
                                            minHeight: '24px',
                                            marginTop: '4px',
                                            color: 'red',
                                            fontSize: '12px',
                                        }}>
                                        {touched[`telefono-${index}`] &&
                                            errors?.[
                                                `numeros_de_cuenta.${index}.telefono`
                                            ] &&
                                            errors[
                                                `numeros_de_cuenta.${index}.telefono`
                                            ]}
                                    </div>
                                </div>
                                <div className="flex items-center mt-4">
                                    <Label
                                        htmlFor={`pago_movil-${index}`}
                                        className="block mb-2 text-sm font-medium mr-2">
                                        ¿Pago Móvil?
                                    </Label>
                                    <input
                                        id={`pago_movil-${index}`}
                                        name={`pago_movil-${index}`}
                                        type="checkbox"
                                        checked={cuenta.pago_movil}
                                        onChange={e =>
                                            handleNumeroDeCuentaChange(
                                                index,
                                                'pago_movil',
                                                e.target.checked,
                                            )
                                        }
                                        className="border border-gray-300 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block"
                                    />
                                </div>
                            </div>
                            <div className="flex justify-end">
                                <Button
                                    type="button"
                                    onClick={() => handleRemoveCuenta(index)}
                                    className="bg-red-500 hover:bg-red-700 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center mt-4">
                                    Eliminar Cuenta
                                </Button>
                            </div>
                        </div>
                    ))}
                    <div className="flex justify-end">
                        <Button
                            type="button"
                            onClick={handleAddCuenta}
                            className="bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center mt-4">
                            Añadir Cuenta
                        </Button>
                    </div>
                </div>
                <div className="flex justify-end pl-4 mt-4">
                    <Button className="bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center">
                        {proveedor ? 'ACTUALIZAR' : 'REGISTRAR'}
                    </Button>
                </div>
            </form>
        </div>
    )
}

export default RegisterProveedor
