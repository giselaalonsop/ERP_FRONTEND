import { useState, useEffect } from 'react'
import { useTheme } from '@/context/ThemeProvider'

export function Component() {
    const { isDark } = useTheme()
    const [configuracion, setConfiguracion] = useState(null)

    useEffect(() => {
        // Función para cargar configuración desde localStorage
        const loadConfiguracion = () => {
            const storedConfig = JSON.parse(
                localStorage.getItem('configuracion'),
            )
            setConfiguracion(storedConfig)
        }

        // Cargar configuración inicial
        loadConfiguracion()

        // Escuchar eventos de cambios en el almacenamiento
        window.addEventListener('storage', loadConfiguracion)

        // Limpieza
        return () => {
            window.removeEventListener('storage', loadConfiguracion)
        }
    }, [])

    if (!configuracion) {
        return null // O muestra un loader o mensaje mientras carga
    }

    return (
        <footer className="">
            <div className="w-full mx-auto max-w-screen-xl p-4 md:flex md:items-center md:justify-between">
                <span className="text-sm text-gray-500 sm:text-center dark:text-gray-400">
                    © 2024{' '}
                    <a href="https://flowbite.com/" className="hover:underline">
                        {configuracion?.nombre_empresa}
                    </a>
                    . Todos los derechos reservados.
                </span>
                <ul className="flex flex-wrap items-center mt-3 text-sm font-medium text-gray-500 dark:text-gray-400 sm:mt-0">
                    <li>
                        <span className="hover:underline me-4 md:me-6">
                            Teléfono: {configuracion?.telefono}
                        </span>
                    </li>
                    <li>
                        <span className="hover:underline me-4 md:me-6">
                            RIF: {configuracion?.rif}
                        </span>
                    </li>
                    <li>
                        <span className="hover:underline me-4 md:me-6">
                            Email: {configuracion?.correo}
                        </span>
                    </li>
                    <li></li>
                </ul>
            </div>
        </footer>
    )
}
