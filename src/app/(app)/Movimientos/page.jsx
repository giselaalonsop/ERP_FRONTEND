'use client'
import React, { useState, useMemo } from 'react'
import { useLogs } from '@/hooks/useLogs' // Asegúrate de que la ruta sea correcta
import Pagination from '@/components/Pagination'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUserCheck, faEye } from '@fortawesome/free-solid-svg-icons'
import { useTheme } from '@/context/ThemeProvider'
import { format } from 'date-fns'
import Swal from 'sweetalert2'

const LogsTable = () => {
    const [currentPage, setCurrentPage] = useState(1)
    const [searchQuery, setSearchQuery] = useState('')
    const [actionFilter, setActionFilter] = useState('')
    const itemsPerPage = 10
    const { logs, logsError } = useLogs()
    const { isDark } = useTheme()

    const sortedLogs = useMemo(() => {
        if (!logs) return []
        return logs.sort(
            (a, b) => new Date(b.created_at) - new Date(a.created_at),
        )
    }, [logs])

    const filteredLogs = useMemo(() => {
        return sortedLogs.filter(log => {
            const matchesSearchQuery =
                log.user?.name
                    .toLowerCase()
                    .includes(searchQuery.toLowerCase()) ||
                log.user?.email
                    .toLowerCase()
                    .includes(searchQuery.toLowerCase())
            const matchesActionFilter = actionFilter
                ? log.action === actionFilter
                : true
            return matchesSearchQuery && matchesActionFilter
        })
    }, [sortedLogs, searchQuery, actionFilter])

    const startIndex = (currentPage - 1) * itemsPerPage
    const paginatedLogs = filteredLogs.slice(
        startIndex,
        startIndex + itemsPerPage,
    )

    const formatDate = dateString => {
        return format(new Date(dateString), 'dd-MM-yyyy HH:mm:ss')
    }

    const formatJsonValues = values => {
        if (!values) return 'N/A'
        return Object.entries(JSON.parse(values))
            .map(([key, value]) => `<strong>${key}:</strong> ${value}`)
            .join('<br>')
    }

    const showLogDetails = log => {
        Swal.fire({
            title: 'Detalles del Registro',
            html: `
              <div style="text-align: left;">
                    <p><strong>Fecha y Hora:</strong> ${formatDate(
                        log.created_at,
                    )}</p>
                    <p><strong>Usuario:</strong> ${
                        log.user
                            ? `${log.user.name} (${log.user.email})`
                            : 'Guest'
                    }</p>
                    <p><strong>Acción:</strong> ${log.action}</p>
                    <p><strong>Tabla:</strong> ${log.table_name}</p>
                    <p><strong>Valores Antiguos:</strong></p>
                    <div>${formatJsonValues(log.old_values)}</div>
                    <br><p><strong>Valores Nuevos:</strong></p>
                    <div>${formatJsonValues(log.new_values)}</div>
                </div>
            `,
            confirmButtonText: 'Cerrar',
        })
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
                            placeholder="Buscar movimientos por usuario..."
                            value={searchQuery}
                            onChange={e => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <div className="relative">
                        <select
                            id="action-filter"
                            className="block p-2 pl-3 text-sm rounded-lg w-40"
                            value={actionFilter}
                            onChange={e => setActionFilter(e.target.value)}>
                            <option value="">Todas las acciones</option>
                            <option value="created">Creación</option>
                            <option value="updated">Edición</option>
                            <option value="deleted">Eliminación</option>
                        </select>
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
                                <th scope="col" className="p-4"></th>
                                <th scope="col" className="px-6 py-3">
                                    Fecha y hora
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
                                    Detalles
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {paginatedLogs.map(log => (
                                <tr
                                    key={log.id}
                                    className="border-b cursor-pointer">
                                    <td className="w-4 p-4"></td>
                                    <td className="px-6 py-4">
                                        {formatDate(log.created_at)}
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
                                        <button
                                            onClick={() => showLogDetails(log)}
                                            className="text-blue-600 hover:text-blue-900">
                                            <FontAwesomeIcon icon={faEye} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <Pagination
                        currentPage={currentPage}
                        totalItems={filteredLogs.length}
                        itemsPerPage={itemsPerPage}
                        onPageChange={setCurrentPage}
                    />
                </div>
            </div>
        </div>
    )
}

export default LogsTable
