import React, { useState, useEffect } from 'react'
import { useClientes } from '@/hooks/useClients'
import Button from '@/components/Button'
import Input from '@/components/Input'
import InputError from '@/components/InputError'
import Label from '@/components/Label'
import Swal from 'sweetalert2'

const RegisterClient = ({ client, onClose, onSave }) => {
    const { addCliente, updateCliente } = useClientes()
    const [formData, setFormData] = useState({
        nombre: '',
        apellido: '',
        correo_electronico: '',
        prefijo_telefono: '0412',
        numero_de_telefono: '',
        direccion: '',
        cedula: '',
        edad: '',
        descuento: 0,
    })
    const [errors, setErrors] = useState({})
    const [touched, setTouched] = useState({})

    useEffect(() => {
        if (client) {
            const { numero_de_telefono, ...rest } = client
            setFormData({
                ...rest,
                prefijo_telefono: numero_de_telefono.slice(0, 4),
                numero_de_telefono: numero_de_telefono.slice(4),
            })
        }
    }, [client])

    useEffect(() => {
        validateForm()
    }, [formData])

    const handleChange = e => {
        const { name, value } = e.target
        let formattedValue = value

        if (name === 'nombre' || name === 'apellido') {
            formattedValue = formattedValue.replace(/[^a-zA-Z\s]/g, '')
            formattedValue = formattedValue.replace(/\b\w/g, l =>
                l.toUpperCase(),
            )
        } else if (
            name === 'numero_de_telefono' ||
            name === 'cedula' ||
            name === 'edad' ||
            name === 'descuento'
        ) {
            formattedValue = formattedValue.replace(/\D/g, '')
        }

        setFormData({ ...formData, [name]: formattedValue })
    }

    const handleBlur = field => {
        setTouched({
            ...touched,
            [field]: true,
        })
    }

    const validateForm = () => {
        const newErrors = {}
        if (!formData.nombre.trim()) {
            newErrors.nombre = 'El nombre no puede estar vacío'
        }
        if (!/^[A-Za-z\s]+$/.test(formData.nombre)) {
            newErrors.nombre = 'El nombre solo debe contener letras y espacios'
        }
        if (!formData.apellido.trim()) {
            newErrors.apellido = 'El apellido no puede estar vacío'
        }
        if (!/^[A-Za-z\s]+$/.test(formData.apellido)) {
            newErrors.apellido =
                'El apellido solo debe contener letras y espacios'
        }
        if (!formData.correo_electronico.trim()) {
            newErrors.correo_electronico = 'El correo no puede estar vacío'
        } else if (
            !/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}$/.test(
                formData.correo_electronico,
            )
        ) {
            newErrors.correo_electronico = 'Correo electrónico no válido'
        }
        if (!formData.numero_de_telefono.trim()) {
            newErrors.numero_de_telefono =
                'El número de teléfono no puede estar vacío'
        } else if (!/^\d{7}$/.test(formData.numero_de_telefono)) {
            newErrors.numero_de_telefono =
                'El número de teléfono debe tener 7 dígitos'
        }
        if (!formData.direccion.trim()) {
            newErrors.direccion = 'La dirección no puede estar vacía'
        }
        if (!formData.cedula.trim()) {
            newErrors.cedula = 'La cédula no puede estar vacía'
        } else if (!/^\d+$/.test(formData.cedula)) {
            newErrors.cedula = 'La cédula debe contener solo números'
        }
        if (!String(formData.edad).trim()) {
            newErrors.edad = 'La edad no puede estar vacía'
        } else if (!/^\d+$/.test(formData.edad)) {
            newErrors.edad = 'La edad debe contener solo números'
        }
        if (!formData.descuento.toString().trim()) {
            newErrors.descuento = 'El descuento no puede estar vacío'
        } else if (formData.descuento < 0 || formData.descuento > 100) {
            newErrors.descuento = 'El descuento debe estar entre 0 y 100'
        }
        setErrors(newErrors)
    }

    const handleSubmit = async e => {
        e.preventDefault()
        setTouched({
            nombre: true,
            apellido: true,
            correo_electronico: true,
            numero_de_telefono: true,
            direccion: true,
            cedula: true,
            edad: true,
            descuento: true,
        })

        if (Object.keys(errors).length > 0) {
            Swal.fire('Error en la validación', '', 'error')
            return
        }

        const formDataToSubmit = {
            ...formData,
            numero_de_telefono: `${formData.prefijo_telefono}${formData.numero_de_telefono}`,
        }

        try {
            if (client) {
                const response = await updateCliente(
                    client.id,
                    formDataToSubmit,
                )
                if (response.status === 422) {
                    setErrors(response.data.errors)
                } else {
                    Swal.fire('Cliente Actualizado', '', 'success')
                    onClose()
                }
            } else {
                const response = await addCliente(formDataToSubmit)
                if (response.status === 422) {
                    setErrors(response.data.errors)
                    Swal.fire(
                        'Error',
                        response.data.error || 'Error de validación',
                        'error',
                    )
                } else {
                    if (onSave) onSave(response.data)
                    Swal.fire('Cliente Registrado', '', 'success')
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
                    {client ? 'Editar Cliente' : 'Registrar Cliente'}
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
                            pattern="[A-Za-z\s]*"
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
                            htmlFor="apellido"
                            className="block mb-2 text-sm font-medium">
                            Apellido
                        </Label>
                        <Input
                            id="apellido"
                            name="apellido"
                            type="text"
                            value={formData.apellido}
                            className="border border-gray-300 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                            onChange={handleChange}
                            onBlur={() => handleBlur('apellido')}
                            required
                            placeholder="Ej: Pérez"
                            pattern="[A-Za-z\s]*"
                        />
                        <div
                            style={{
                                minHeight: '24px',
                                marginTop: '4px',
                                color: 'red',
                                fontSize: '12px',
                            }}>
                            {touched.apellido &&
                                errors?.apellido &&
                                errors.apellido}
                        </div>
                    </div>
                    <div>
                        <Label
                            htmlFor="correo_electronico"
                            className="block mb-2 text-sm font-medium">
                            Correo Electrónico
                        </Label>
                        <Input
                            id="correo_electronico"
                            name="correo_electronico"
                            type="email"
                            value={formData.correo_electronico}
                            className="border border-gray-300 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                            onChange={handleChange}
                            onBlur={() => handleBlur('correo_electronico')}
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
                            {touched.correo_electronico &&
                                errors?.correo_electronico &&
                                errors.correo_electronico}
                        </div>
                    </div>
                    <div>
                        <Label
                            htmlFor="numero_de_telefono"
                            className="block mb-2 text-sm font-medium">
                            Número de Teléfono
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
                                id="numero_de_telefono"
                                name="numero_de_telefono"
                                type="text"
                                value={formData.numero_de_telefono}
                                className="border border-gray-300 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                                onChange={handleChange}
                                onBlur={() => handleBlur('numero_de_telefono')}
                                required
                                placeholder="Ej: 1234567"
                                pattern="\d*"
                            />
                        </div>
                        <div
                            style={{
                                minHeight: '24px',
                                marginTop: '4px',
                                color: 'red',
                                fontSize: '12px',
                            }}>
                            {touched.numero_de_telefono &&
                                errors?.numero_de_telefono &&
                                errors.numero_de_telefono}
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
                    <div>
                        <Label
                            htmlFor="cedula"
                            className="block mb-2 text-sm font-medium">
                            Cédula
                        </Label>
                        <Input
                            id="cedula"
                            name="cedula"
                            type="text"
                            value={formData.cedula}
                            className="border border-gray-300 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                            onChange={handleChange}
                            onBlur={() => handleBlur('cedula')}
                            required
                            placeholder="Ej: 12345678"
                            pattern="\d*"
                        />
                        <div
                            style={{
                                minHeight: '24px',
                                marginTop: '4px',
                                color: 'red',
                                fontSize: '12px',
                            }}>
                            {touched.cedula && errors?.cedula && errors.cedula}
                        </div>
                    </div>
                    <div>
                        <Label
                            htmlFor="edad"
                            className="block mb-2 text-sm font-medium">
                            Edad
                        </Label>
                        <Input
                            id="edad"
                            name="edad"
                            type="number"
                            value={formData.edad}
                            className="border border-gray-300 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                            onChange={handleChange}
                            onBlur={() => handleBlur('edad')}
                            required
                            placeholder="Ej: 25"
                            min="0"
                        />
                        <div
                            style={{
                                minHeight: '24px',
                                marginTop: '4px',
                                color: 'red',
                                fontSize: '12px',
                            }}>
                            {touched.edad && errors?.edad && errors.edad}
                        </div>
                    </div>
                    <div>
                        <Label
                            htmlFor="descuento"
                            className="block mb-2 text-sm font-medium">
                            Descuento (%)
                        </Label>
                        <Input
                            id="descuento"
                            name="descuento"
                            type="number"
                            value={formData.descuento}
                            className="border border-gray-300 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                            onChange={handleChange}
                            onBlur={() => handleBlur('descuento')}
                            min="0"
                            max="100"
                            required
                            placeholder="Ej: 10"
                        />
                        <div
                            style={{
                                minHeight: '24px',
                                marginTop: '4px',
                                color: 'red',
                                fontSize: '12px',
                            }}>
                            {touched.descuento &&
                                errors?.descuento &&
                                errors.descuento}
                        </div>
                    </div>
                </div>
                <div className="flex justify-end pl-4 mt-4">
                    <Button className="bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center">
                        {client ? 'ACTUALIZAR' : 'REGISTRAR'}
                    </Button>
                </div>
            </form>
        </div>
    )
}

export default RegisterClient
