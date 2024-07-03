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
        numero_de_telefono: '',
        direccion: '',
        cedula: '',
        edad: '',
        numero_de_compras: 0,
        cantidad_de_articulos_comprados: 0,
        estatus: 'Activo',
        frecuencia: 0,
        descuento: 0,
    })
    const [errors, setErrors] = useState([])

    useEffect(() => {
        if (client) {
            setFormData(client)
        }
    }, [client])

    const handleChange = e => {
        const { name, value } = e.target
        setFormData({ ...formData, [name]: value })
    }

    const handleSubmit = async e => {
        e.preventDefault()
        try {
            if (client) {
                await updateCliente(client.id, formData)
                Swal.fire('Cliente Actualizado', '', 'success')
            } else {
                const response = await addCliente(formData)
                if (onSave) onSave(response.data)
                Swal.fire('Cliente Registrado', '', 'success')
            }
            onClose()
        } catch (error) {
            if (error.response.status === 422) {
                setErrors(error.response.data.errors)
            } else {
                Swal.fire(
                    'Error',
                    'Hubo un problema al procesar la solicitud',
                    'error',
                )
            }
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
                            required
                        />
                        <InputError messages={errors.nombre} className="mt-2" />
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
                            required
                        />
                        <InputError
                            messages={errors.apellido}
                            className="mt-2"
                        />
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
                            required
                        />
                        <InputError
                            messages={errors.correo_electronico}
                            className="mt-2"
                        />
                    </div>
                    <div>
                        <Label
                            htmlFor="numero_de_telefono"
                            className="block mb-2 text-sm font-medium">
                            Número de Teléfono
                        </Label>
                        <Input
                            id="numero_de_telefono"
                            name="numero_de_telefono"
                            type="text"
                            value={formData.numero_de_telefono}
                            className="border border-gray-300 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                            onChange={handleChange}
                            required
                        />
                        <InputError
                            messages={errors.numero_de_telefono}
                            className="mt-2"
                        />
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
                            required
                        />
                        <InputError
                            messages={errors.direccion}
                            className="mt-2"
                        />
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
                            required
                        />
                        <InputError messages={errors.cedula} className="mt-2" />
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
                            required
                        />
                        <InputError messages={errors.edad} className="mt-2" />
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
                            min="0"
                            max="100"
                            required
                        />
                        <InputError
                            messages={errors.descuento}
                            className="mt-2"
                        />
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
