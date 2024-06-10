import React, { useState } from 'react'
import { useClientes } from '@/hooks/useClients'
import Button from '@/components/Button'
import Input from '@/components/Input'
import InputError from '@/components/InputError'
import Label from '@/components/Label'
import Swal from 'sweetalert2'

const RegisterClient = ({ onClose }) => {
    const { addCliente } = useClientes()
    const [formData, setFormData] = useState({
        nombre: '',
        apellido: '',
        correo_electronico: '', // actualizado
        numero_de_telefono: '', // actualizado
        direccion: '',
        cedula: '',
        edad: '',
        numero_de_compras: 0, // actualizado
        cantidad_de_articulos_comprados: 0, // actualizado
        estatus: 'Activo',
        frecuencia: 0, // actualizado
    })
    const [errors, setErrors] = useState([])

    const handleChange = e => {
        const { name, value } = e.target
        setFormData({ ...formData, [name]: value })
    }

    const handleSubmit = async e => {
        e.preventDefault()
        try {
            await addCliente(formData)
            Swal.fire('Cliente Registrado', '', 'success')
            onClose()
        } catch (error) {
            if (error.response && error.response.status === 422) {
                setErrors(error.response.data.errors)
            } else {
                Swal.fire(
                    'Error',
                    'Hubo un problema al registrar el cliente',
                    'error',
                )
            }
        }
    }

    return (
        <div>
            <form onSubmit={handleSubmit} className="p-4 justify-center">
                <div className="flex -mx-3 mb-6">
                    <div className="w-1/2 px-3 mb-6">
                        <Label
                            htmlFor="nombre"
                            className="text-xs font-semibold px-1">
                            Nombre
                        </Label>
                        <div className="flex">
                            <Input
                                id="nombre"
                                name="nombre"
                                type="text"
                                value={formData.nombre}
                                className="w-full -ml-10 pl-10 pr-3 py-2 rounded-lg border-2 border-gray-200 outline-none focus:border-indigo-500"
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <InputError messages={errors.nombre} className="mt-2" />
                    </div>
                    <div className="w-1/2 px-3 mb-6">
                        <Label
                            htmlFor="apellido"
                            className="text-xs font-semibold px-1">
                            Apellido
                        </Label>
                        <div className="flex">
                            <Input
                                id="apellido"
                                name="apellido"
                                type="text"
                                value={formData.apellido}
                                className="w-full -ml-10 pl-10 pr-3 py-2 rounded-lg border-2 border-gray-200 outline-none focus:border-indigo-500"
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <InputError
                            messages={errors.apellido}
                            className="mt-2"
                        />
                    </div>
                </div>
                <div className="flex -mx-3 mb-6">
                    <div className="w-1/2 px-3 mb-6">
                        <Label
                            htmlFor="correo_electronico"
                            className="text-xs font-semibold px-1">
                            Correo Electrónico
                        </Label>
                        <div className="flex">
                            <Input
                                id="correo_electronico"
                                name="correo_electronico" // actualizado
                                type="email"
                                value={formData.correo_electronico} // actualizado
                                className="w-full -ml-10 pl-10 pr-3 py-2 rounded-lg border-2 border-gray-200 outline-none focus:border-indigo-500"
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <InputError
                            messages={errors.correo_electronico} // actualizado
                            className="mt-2"
                        />
                    </div>
                    <div className="w-1/2 px-3 mb-6">
                        <Label
                            htmlFor="numero_de_telefono"
                            className="text-xs font-semibold px-1">
                            Número de Teléfono
                        </Label>
                        <div className="flex">
                            <Input
                                id="numero_de_telefono"
                                name="numero_de_telefono" // actualizado
                                type="text"
                                value={formData.numero_de_telefono} // actualizado
                                className="w-full -ml-10 pl-10 pr-3 py-2 rounded-lg border-2 border-gray-200 outline-none focus:border-indigo-500"
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <InputError
                            messages={errors.numero_de_telefono} // actualizado
                            className="mt-2"
                        />
                    </div>
                </div>
                <div className="flex -mx-3 mb-6">
                    <div className="w-1/2 px-3 mb-6">
                        <Label
                            htmlFor="direccion"
                            className="text-xs font-semibold px-1">
                            Dirección
                        </Label>
                        <div className="flex">
                            <Input
                                id="direccion"
                                name="direccion"
                                type="text"
                                value={formData.direccion}
                                className="w-full -ml-10 pl-10 pr-3 py-2 rounded-lg border-2 border-gray-200 outline-none focus:border-indigo-500"
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <InputError
                            messages={errors.direccion}
                            className="mt-2"
                        />
                    </div>
                    <div className="w-1/2 px-3 mb-6">
                        <Label
                            htmlFor="cedula"
                            className="text-xs font-semibold px-1">
                            Cédula
                        </Label>
                        <div className="flex">
                            <Input
                                id="cedula"
                                name="cedula"
                                type="text"
                                value={formData.cedula}
                                className="w-full -ml-10 pl-10 pr-3 py-2 rounded-lg border-2 border-gray-200 outline-none focus:border-indigo-500"
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <InputError messages={errors.cedula} className="mt-2" />
                    </div>
                </div>
                <div className="flex -mx-3 mb-6">
                    <div className="w-1/2 px-3 mb-6">
                        <Label
                            htmlFor="edad"
                            className="text-xs font-semibold px-1">
                            Edad
                        </Label>
                        <div className="flex">
                            <Input
                                id="edad"
                                name="edad"
                                type="number"
                                value={formData.edad}
                                className="w-full -ml-10 pl-10 pr-3 py-2 rounded-lg border-2 border-gray-200 outline-none focus:border-indigo-500"
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <InputError messages={errors.edad} className="mt-2" />
                    </div>
                    <div className="w-1/2 px-3 mb-6">
                        <Button className="block w-full text-center max-w-xs mx-auto bg-indigo-500 hover:bg-indigo-700 focus:bg-indigo-700 text-white rounded-lg px-3 py-3 font-semibold">
                            Registrar
                        </Button>
                    </div>
                </div>
            </form>
        </div>
    )
}

export default RegisterClient
