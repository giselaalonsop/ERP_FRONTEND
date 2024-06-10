'use client'
import { useAuth } from '@/hooks/auth'
import Button from '@/components/Button'
import Input from '@/components/Input'
import InputError from '@/components/InputError'
import Label from '@/components/Label'
import { useState, useEffect } from 'react'
import Swal from 'sweetalert2'

const Register = ({ user: editUser, onClose }) => {
    const { registerUser, editUser: updateUser } = useAuth({
        middleware: 'guest',
    })

    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [passwordConfirmation, setPasswordConfirmation] = useState('')
    const [rol, setRol] = useState('user')
    const [errors, setErrors] = useState([])

    useEffect(() => {
        if (editUser) {
            setName(editUser.name)
            setEmail(editUser.email)
            setRol(editUser.rol)
        }
    }, [editUser])

    const submitForm = async event => {
        event.preventDefault()

        if (editUser) {
            // Lógica para actualizar usuario
            const response = await updateUser(editUser.id, {
                name,
                email,
                password,
                password_confirmation: passwordConfirmation,
                rol,
                setErrors,
            })

            if (response) {
                Swal.fire('Usuario Actualizado', '', 'success')
                onClose()
            }
        } else {
            // Lógica para registrar nuevo usuario
            const response = await registerUser({
                name,
                email,
                password,
                password_confirmation: passwordConfirmation,
                rol,
                setErrors,
            })

            if (response) {
                Swal.fire('Usuario Registrado', '', 'success')
                setName('')
                setEmail('')
                setPassword('')
                setPasswordConfirmation('')
                setRol('user')
                onClose()
            }
        }
    }

    return (
        <div>
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
                <div className="flex -mx-3">
                    <div className="w-1/2 px-3 mb-10">
                        <Label
                            htmlFor="name"
                            className="text-xs font-semibold px-1">
                            Nombre
                        </Label>
                        <div className="flex">
                            <div className="w-10 z-10 pl-1 text-center pointer-events-none flex items-center justify-center">
                                <i className="mdi mdi-account-outline text-gray-400 text-lg"></i>
                            </div>
                            <Input
                                id="name"
                                type="text"
                                value={name}
                                className="w-full -ml-10 pl-10 pr-3 py-2 rounded-lg border-2 border-gray-200 outline-none focus:border-indigo-500"
                                onChange={event => setName(event.target.value)}
                                required
                            />
                        </div>
                        <InputError messages={errors.name} className="mt-2" />
                    </div>
                    <div className="w-1/2 px-3 mb-10">
                        <Label
                            htmlFor="email"
                            className="text-xs font-semibold px-1">
                            Correo
                        </Label>
                        <div className="flex">
                            <div className="w-10 z-10 pl-1 text-center pointer-events-none flex items-center justify-center">
                                <i className="mdi mdi-email-outline text-gray-400 text-lg"></i>
                            </div>
                            <Input
                                id="email"
                                type="email"
                                value={email}
                                className="w-full -ml-10 pl-10 pr-3 py-2 rounded-lg border-2 border-gray-200 outline-none focus:border-indigo-500"
                                onChange={event => setEmail(event.target.value)}
                                required
                            />
                        </div>
                        <InputError messages={errors.email} className="mt-2" />
                    </div>
                </div>
                <div className="flex -mx-3">
                    <div className="w-1/2 px-3 mb-10">
                        <Label
                            htmlFor="password"
                            className="text-xs font-semibold px-1">
                            Contraseña
                        </Label>
                        <div className="flex">
                            <div className="w-10 z-10 pl-1 text-center pointer-events-none flex items-center justify-center">
                                <i className="mdi mdi-lock-outline text-gray-400 text-lg"></i>
                            </div>
                            <Input
                                id="password"
                                type="password"
                                value={password}
                                className="w-full -ml-10 pl-10 pr-3 py-2 rounded-lg border-2 border-gray-200 outline-none focus:border-indigo-500"
                                onChange={event =>
                                    setPassword(event.target.value)
                                }
                                required={!editUser}
                                autoComplete="new-password"
                            />
                        </div>
                        <InputError
                            messages={errors.password}
                            className="mt-2"
                        />
                    </div>
                    <div className="w-1/2 px-3 mb-10">
                        <Label
                            htmlFor="passwordConfirmation"
                            className="text-xs font-semibold px-1">
                            Confirmar Contraseña
                        </Label>
                        <div className="flex">
                            <div className="w-10 z-10 pl-1 text-center pointer-events-none flex items-center justify-center">
                                <i className="mdi mdi-lock-outline text-gray-400 text-lg"></i>
                            </div>
                            <Input
                                id="passwordConfirmation"
                                type="password"
                                value={passwordConfirmation}
                                className="w-full -ml-10 pl-10 pr-3 py-2 rounded-lg border-2 border-gray-200 outline-none focus:border-indigo-500"
                                onChange={event =>
                                    setPasswordConfirmation(event.target.value)
                                }
                                required={!editUser}
                            />
                        </div>
                        <InputError
                            messages={errors.password_confirmation}
                            className="mt-2"
                        />
                    </div>
                </div>
                <div className="flex  justify-around mx-3">
                    {editUser && (
                        <div className="w-1/2 mb-10">
                            <div className="w-1/2 flex items-center justify-center">
                                <Label
                                    htmlFor="rol"
                                    className="text-xs font-semibold px-1">
                                    Rol
                                </Label>
                                <div className="flex">
                                    <select
                                        id="rol"
                                        value={rol}
                                        onChange={event =>
                                            setRol(event.target.value)
                                        }
                                        className="block w-full mt-1 border-gray-300 rounded-lg shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50">
                                        <option value="user">Usuario</option>
                                        <option value="admin">Admin</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    )}
                    <div className="w-1/2 px-3 mb-10">
                        <Button className="block w-full text-center max-w-xs mx-auto bg-indigo-500 hover:bg-indigo-700 focus:bg-indigo-700 text-white rounded-lg px-3 py-3 font-semibold">
                            {editUser ? 'ACTUALIZAR' : 'REGISTRAR'}
                        </Button>
                    </div>
                </div>
            </form>
        </div>
    )
}

export default Register
