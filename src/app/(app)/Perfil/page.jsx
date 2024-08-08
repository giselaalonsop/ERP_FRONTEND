'use client'
import React from 'react'
import { useAuth } from '@/hooks/auth' // Asegúrate de tener la ruta correcta al hook
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheckCircle, faTimesCircle } from '@fortawesome/free-solid-svg-icons'

const UserCard = () => {
    const { user } = useAuth({ middleware: 'auth' })

    if (!user) {
        return <p>Cargando información del usuario...</p>
    }

    // Parsear los permisos si están en formato string, de lo contrario usar directamente
    const permissionsList =
        typeof user.permissions === 'string'
            ? JSON.parse(user.permissions)
            : user.permissions

    return (
        <div className="bg-white shadow-lg rounded-lg p-6">
            <h2 className="text-xl font-bold mb-4">Información del Usuario</h2>
            <p>
                <strong>Nombre:</strong> {user.name}
            </p>
            <p>
                <strong>Email:</strong> {user.email}
            </p>
            <p>
                <strong>Rol:</strong> {user.rol}
            </p>
            <p>
                <strong>Ubicacion</strong> {user.location}
            </p>
            <div>
                <strong>Permisos:</strong>
                {user.rol === 'admin' ? (
                    <p className="text-sm text-gray-500">
                        Los administradores tienen todos los permisos
                    </p>
                ) : (
                    <ul className="list-disc ml-6">
                        {Object.entries(permissionsList).map(([key, value]) => (
                            <li key={key}>
                                {key}:{' '}
                                {value ? (
                                    <FontAwesomeIcon
                                        icon={faCheckCircle}
                                        className="text-green-500"
                                    />
                                ) : (
                                    <FontAwesomeIcon
                                        icon={faTimesCircle}
                                        className="text-red-500"
                                    />
                                )}
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    )
}

export default UserCard
