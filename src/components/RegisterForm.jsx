'use client'
import { useAuth } from '@/hooks/auth'
import Button from '@/components/Button'
import InputError from '@/components/InputError'
import Label from '@/components/Label'
import { useState, useEffect } from 'react'
import Swal from 'sweetalert2'

import 'tailwindcss/tailwind.css'

const Register = ({ user: editUser, onClose }) => {
    const { registerUser, editUser: updateUser, hasPermission, user } = useAuth(
        {
            middleware: 'guest',
        },
    )

    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [passwordConfirmation, setPasswordConfirmation] = useState('')
    const [rol, setRol] = useState('user')
    const [location, setLocation] = useState('')
    const [permissions, setPermissions] = useState({
        facturacion: false,
        registrarUsuarios: false,
        verUsuarios: false,
        clientes: false,
        configuraciones: false,
        cargaInventario: false,
        descargaInventario: false,
        agregarNuevoProducto: false,
        agregarProveedores: false,
        cuentasPorPagar: false,
        cierreDeCaja: false,
    })
    const [errors, setErrors] = useState([])

    const setAdminPermissions = () => {
        setPermissions({
            facturacion: true,
            registrarUsuarios: true,
            verUsuarios: true,
            clientes: true,
            configuraciones: true,
            cargaInventario: true,
            descargaInventario: true,
            agregarNuevoProducto: true,
            agregarProveedores: true,
            cuentasPorPagar: true,
            cierreDeCaja: true,
        })
    }

    const handleRoleChange = event => {
        const newRole = event.target.value
        setRol(newRole)
        if (newRole === 'admin') {
            setAdminPermissions()
        } else {
            setPermissions({
                facturacion: false,
                registrarUsuarios: false,
                verUsuarios: false,
                clientes: false,
                configuraciones: false,
                cargaInventario: false,
                descargaInventario: false,
                agregarNuevoProducto: false,
                agregarProveedores: false,
                cuentasPorPagar: false,
                cierreDeCaja: false,
            })
        }
    }

    useEffect(() => {
        if (editUser) {
            setName(editUser.name)
            setEmail(editUser.email)
            setRol(editUser.rol)
            setLocation(editUser.location || '')

            if (typeof editUser.permissions === 'string') {
                try {
                    const parsedPermissions = JSON.parse(editUser.permissions)
                    setPermissions(parsedPermissions)
                } catch (error) {
                    console.error('Error parsing permissions:', error)
                }
            } else if (typeof editUser.permissions === 'object') {
                setPermissions(editUser.permissions)
            }
        }
    }, [editUser])

    const handleCheckboxChange = event => {
        setPermissions({
            ...permissions,
            [event.target.name]: event.target.checked,
        })
    }

    const submitForm = async event => {
        event.preventDefault()
        setErrors([])

        try {
            let response
            if (editUser) {
                response = await updateUser(editUser.id, {
                    name,
                    email,
                    rol,
                    location,
                    permissions,
                })
            } else {
                response = await registerUser({
                    name,
                    email,
                    password,
                    password_confirmation: passwordConfirmation,
                    rol,
                    location,
                    permissions,
                    setErrors, // Pass setErrors correctly
                })
            }

            if (response && response.status === 422) {
                setErrors(response.data.errors)
                Swal.fire('Error en la validación', '', 'error')
            } else if (
                (response && response.status === 200) ||
                response.status === 201
            ) {
                const successMessage = editUser
                    ? 'Usuario Actualizado'
                    : 'Usuario Registrado'
                Swal.fire(successMessage, '', 'success')
                clearFormFields()
                onClose()
            } else {
                Swal.fire(
                    'Hubo un problema al procesar tu solicitud',
                    response.data.message || '',
                    'error',
                )
            }
        } catch (error) {
            console.error('Error:', error)
            Swal.fire('Hubo un problema al procesar tu solicitud', '', 'error')
        }
    }

    const clearFormFields = () => {
        setName('')
        setEmail('')
        setPassword('')
        setPasswordConfirmation('')
        setRol('user')
        setLocation('')
        setPermissions({
            facturacion: false,
            registrarUsuarios: false,
            verUsuarios: false,
            clientes: false,
            configuraciones: false,
            cargaInventario: false,
            descargaInventario: false,
            agregarNuevoProducto: false,
            agregarProveedores: false,
            cuentasPorPagar: false,
            cierreDeCaja: false,
        })
    }

    const permissionsOptions = [
        { name: 'facturacion', label: 'Facturación' },
        { name: 'registrarUsuarios', label: 'Registrar Usuarios' },
        { name: 'verUsuarios', label: 'Ver Usuarios' },
        { name: 'clientes', label: 'Clientes' },
        { name: 'configuraciones', label: 'Configuraciones' },
        { name: 'cargaInventario', label: 'Carga de Inventario' },
        { name: 'descargaInventario', label: 'Descarga de Inventario' },
        { name: 'agregarNuevoProducto', label: 'Agregar Nuevo Producto' },
        { name: 'agregarProveedores', label: 'Agregar Proveedores' },
        { name: 'cuentasPorPagar', label: 'Cuentas por Pagar' },
        { name: 'cierreDeCaja', label: 'Cierre de Caja' },
    ]

    if (!hasPermission('registrarUsuarios') && user.rol !== 'admin') {
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

    return (
        <div className="max-w-3xl mx-auto">
            <div className="text-center mb-10">
                <h1 className="font-bold text-3xl text-gray-900">
                    {editUser ? 'EDITAR USUARIO' : 'REGISTRAR'}
                </h1>
                <p>
                    {editUser
                        ? 'Actualiza la información del usuario'
                        : 'Ingrese su información para registrarse'}
                </p>
            </div>
            <form onSubmit={submitForm}>
                <div className="grid gap-4  sm:grid-cols-2">
                    <div>
                        <Label
                            htmlFor="name"
                            className="block mb-2 text-sm font-medium">
                            Nombre
                        </Label>
                        <input
                            type="text"
                            id="name"
                            value={name}
                            className="border border-gray-300 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                            onChange={event => setName(event.target.value)}
                            required
                        />
                        <InputError messages={errors?.name} className="mt-2" />
                    </div>
                    <div>
                        <Label
                            htmlFor="email"
                            className="block mb-2 text-sm font-medium">
                            Correo
                        </Label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            className="border border-gray-300 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                            onChange={event => setEmail(event.target.value)}
                            required
                        />
                        <InputError messages={errors?.email} className="mt-2" />
                    </div>
                    {!editUser && (
                        <>
                            <div>
                                <Label
                                    htmlFor="password"
                                    className="block mb-2 text-sm font-medium">
                                    Contraseña
                                </Label>
                                <input
                                    type="password"
                                    id="password"
                                    value={password}
                                    className="border border-gray-300 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                                    onChange={event =>
                                        setPassword(event.target.value)
                                    }
                                    required={!editUser}
                                    autoComplete="new-password"
                                />
                                <InputError
                                    messages={errors?.password}
                                    className="mt-2"
                                />
                            </div>
                            <div>
                                <Label
                                    htmlFor="passwordConfirmation"
                                    className="block mb-2 text-sm font-medium">
                                    Confirmar Contraseña
                                </Label>
                                <input
                                    type="password"
                                    id="passwordConfirmation"
                                    value={passwordConfirmation}
                                    className="border border-gray-300 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                                    onChange={event =>
                                        setPasswordConfirmation(
                                            event.target.value,
                                        )
                                    }
                                    required={!editUser}
                                />
                                <InputError
                                    messages={errors?.password_confirmation}
                                    className="mt-2"
                                />
                            </div>
                        </>
                    )}
                    <div>
                        <Label
                            htmlFor="rol"
                            className="block mb-2 text-sm font-medium">
                            Rol
                        </Label>
                        <select
                            id="rol"
                            value={rol}
                            onChange={handleRoleChange}
                            className="border border-gray-300 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5">
                            <option value="user">Usuario</option>
                            <option value="admin">Admin</option>
                        </select>
                    </div>
                    <div>
                        <Label
                            htmlFor="location"
                            className="block mb-2 text-sm font-medium">
                            Ubicación
                        </Label>
                        <select
                            id="location"
                            value={location}
                            onChange={event => setLocation(event.target.value)}
                            className="border border-gray-300 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5">
                            <option value="" disabled>
                                Selecciona una ubicación
                            </option>
                            <option value="Bejuma">Bejuma</option>
                            <option value="Montalban">Montalbán</option>
                        </select>
                        <InputError
                            messages={errors?.location}
                            className="mt-2"
                        />
                    </div>

                    <div className="sm:col-span-2">
                        <h2 className="font-bold text-xl mb-4">Permisos</h2>
                        <div className="grid gap-2  sm:grid-cols-3">
                            {permissionsOptions.map(option => (
                                <div
                                    key={option.name}
                                    className="flex items-center mb-2">
                                    <input
                                        id={option.name}
                                        name={option.name}
                                        type="checkbox"
                                        checked={
                                            permissions[option.name] || false
                                        }
                                        onChange={handleCheckboxChange}
                                        className="mr-2"
                                    />
                                    <label
                                        htmlFor={option.name}
                                        className="text-sm">
                                        {option.label}
                                    </label>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
                <div className="flex justify-end pl-4">
                    <Button className="bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center">
                        {editUser ? 'ACTUALIZAR' : 'REGISTRAR'}
                    </Button>
                </div>
            </form>
        </div>
    )
}

export default Register
