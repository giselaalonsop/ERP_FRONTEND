import React, { useState, useEffect } from 'react'
import Pagination from '@/components/Pagination'
import { useTheme } from '@/context/ThemeProvider'

const InhabilitadosTable = ({ data, columns, onToggleEnable }) => {
    const [currentPage, setCurrentPage] = useState(1)
    const itemsPerPage = 10
    const { isDark } = useTheme()

    const handleToggleChange = index => {
        const updatedEnabledItems = [...enabledItems]
        updatedEnabledItems[index] = !updatedEnabledItems[index]
        setEnabledItems(updatedEnabledItems)
        onToggleEnable(data[index].id, updatedEnabledItems[index])
    }

    const startIndex = (currentPage - 1) * itemsPerPage
    const paginatedData = data?.slice(startIndex, startIndex + itemsPerPage)

    const [enabledItems, setEnabledItems] = useState([])

    useEffect(() => {
        // Initialize the enabledItems state with default values (false for each item)
        const initialEnabledState = data.map(item => false)
        setEnabledItems(initialEnabledState)
    }, [data])

    return (
        <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
            <table
                className={`w-full text-sm text-left ${
                    isDark ? 'bg-gray-800 text-white' : 'bg-white text-black'
                }`}>
                <thead
                    className={`text-xs uppercase ${
                        isDark
                            ? 'bg-gray-700 text-gray-400'
                            : 'bg-gray-50 text-gray-700'
                    }`}>
                    <tr>
                        {columns.map(col => (
                            <th key={col.key} className="px-6 py-3">
                                {col.header}
                            </th>
                        ))}
                        <th className="px-6 py-3">Restablecer</th>
                    </tr>
                </thead>
                <tbody>
                    {paginatedData.map((item, idx) => (
                        <tr
                            key={idx}
                            className={`border-b ${
                                isDark
                                    ? 'bg-gray-800 border-gray-700'
                                    : 'bg-white border-gray-200'
                            }`}>
                            {columns.map(col => (
                                <td
                                    key={col.key}
                                    className="px-6 py-4 whitespace-nowrap">
                                    {col.format
                                        ? col.format(item)
                                        : item[col.key]}
                                </td>
                            ))}
                            <td className="px-6 py-4 text-right">
                                <div className="flex items-center">
                                    <label className="block mb-2 text-sm font-medium cursor-pointer mr-2">
                                        <input
                                            type="checkbox"
                                            checked={
                                                enabledItems[
                                                    startIndex + idx
                                                ] || false
                                            }
                                            onChange={() =>
                                                handleToggleChange(
                                                    startIndex + idx,
                                                )
                                            }
                                            className="sr-only peer"
                                        />
                                        <div
                                            className={`relative w-11 h-6 ${
                                                isDark
                                                    ? 'bg-gray-700'
                                                    : 'bg-gray-200'
                                            } peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer-checked:after:translate-x-full peer-checked:bg-blue-600 after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all`}></div>
                                    </label>
                                    <span
                                        className={`text-sm font-medium ${
                                            isDark
                                                ? 'text-gray-300'
                                                : 'text-gray-900'
                                        }`}>
                                        {enabledItems[startIndex + idx]
                                            ? 'Habilitado'
                                            : 'Deshabilitado'}
                                    </span>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <Pagination
                currentPage={currentPage}
                totalItems={data.length}
                itemsPerPage={itemsPerPage}
                onPageChange={setCurrentPage}
            />
        </div>
    )
}

export default InhabilitadosTable
