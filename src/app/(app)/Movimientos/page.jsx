'use client'
import React, { useState } from 'react'
import { useLogs } from '@/hooks/useLogs' // Asegúrate de que la ruta sea correcta
import Pagination from '@/components/Pagination'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUserCheck } from '@fortawesome/free-solid-svg-icons'
import { useTheme } from '@/context/ThemeProvider'
import { format } from 'date-fns'

const LogsTable = () => {
    const [currentPage, setCurrentPage] = useState(1)
    const itemsPerPage = 10
    const { logs, logsError, mutateLogs } = useLogs()
    const { isDark } = useTheme()

    if (!logs) return <p>Cargando...</p>
    if (logsError) return <p>Error al cargar los registros.</p>

    const startIndex = (currentPage - 1) * itemsPerPage
    const paginatedLogs = logs.slice(startIndex, startIndex + itemsPerPage)

    const formatDate = dateString => {
        return format(new Date(dateString), 'dd-MM-yyyy HH:mm:ss')
    }

    return (
        <div>
            <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
                <div className="flex items-center justify-between flex-wrap md:flex-row space-y-4 md:space-y-0 pb-4 bg-transparent">
                    <label htmlFor="table-search" className="sr-only">
                        Buscar
                    </label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                            <svg
                                className="w-4 h-4 text-gray-500 dark:text-gray-400"
                                aria-hidden="true"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 20 20">
                                <path
                                    stroke="currentColor"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                                />
                            </svg>
                        </div>
                        <input
                            type="text"
                            id="table-search-users"
                            className="block p-2 pl-10 text-sm rounded-lg w-80"
                            placeholder="Buscar movimientos"
                        />
                    </div>
                </div>

                <div>
                    <table
                        className={`w-full text-sm text-left rtl:text-right ${
                            isDark
                                ? 'bg-gray-800 text-white'
                                : 'bg-white text-black'
                        }`}>
                        <thead className="text-xs uppercase">
                            <tr>
                                <th scope="col" className="p-4">
                                    <div className="flex items-center"></div>
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Usuario
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Acción
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Tabla
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Valores Antiguos
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Valores Nuevos
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Fecha
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {paginatedLogs.map(log => (
                                <tr
                                    key={log.id}
                                    className="border-b cursor-pointer">
                                    <td className="w-4 p-4">
                                        <div className="flex items-center"></div>
                                    </td>
                                    <th
                                        scope="row"
                                        className="flex items-center px-6 py-4 whitespace-nowrap">
                                        <FontAwesomeIcon icon={faUserCheck} />
                                        <div className="pl-3">
                                            <div className="text-base font-semibold">
                                                {log.user
                                                    ? log.user.name
                                                    : 'Guest'}
                                            </div>
                                            <div className="font-normal text-gray-500">
                                                {log.user
                                                    ? log.user.email
                                                    : 'N/A'}
                                            </div>
                                        </div>
                                    </th>
                                    <td className="px-6 py-4">{log.action}</td>
                                    <td className="px-6 py-4">
                                        {log.table_name}
                                    </td>
                                    <td className="px-6 py-4">
                                        <pre>{log.old_values}</pre>
                                    </td>
                                    <td className="px-6 py-4">
                                        <pre>{log.new_values}</pre>
                                    </td>
                                    <td className="px-6 py-4">
                                        {formatDate(log.created_at)}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <Pagination
                        currentPage={currentPage}
                        totalItems={logs.length}
                        itemsPerPage={itemsPerPage}
                        onPageChange={setCurrentPage}
                    />
                </div>
            </div>
        </div>
    )
}

export default LogsTable
