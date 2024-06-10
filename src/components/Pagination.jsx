'use client'

import React from 'react'

const Pagination = ({
    currentPage,
    totalItems,
    itemsPerPage,
    onPageChange,
}) => {
    const totalPages = Math.ceil(totalItems / itemsPerPage)

    const handlePrevious = () => {
        if (currentPage > 1) {
            onPageChange(currentPage - 1)
        }
    }

    const handleNext = () => {
        if (currentPage < totalPages) {
            onPageChange(currentPage + 1)
        }
    }

    return (
        <div className="flex items-center justify-between border-t px-4 py-3 sm:px-6">
            <div className="flex flex-1 justify-between sm:hidden">
                <button
                    onClick={handlePrevious}
                    disabled={currentPage === 1}
                    className="relative inline-flex items-center rounded-md border px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
                    Anterior
                </button>
                <button
                    onClick={handleNext}
                    disabled={currentPage === totalPages}
                    className="relative ml-3 inline-flex items-center rounded-md border px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
                    Siguiente
                </button>
            </div>
            <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                <div>
                    <p className="text-sm text-gray-700">
                        Mostrando{' '}
                        <span className="font-medium">
                            {(currentPage - 1) * itemsPerPage + 1}
                        </span>{' '}
                        a{' '}
                        <span className="font-medium">
                            {Math.min(currentPage * itemsPerPage, totalItems)}
                        </span>{' '}
                        de <span className="font-medium">{totalItems}</span>{' '}
                        resultados
                    </p>
                </div>
                <div>
                    <nav
                        className="isolate inline-flex -space-x-px rounded-md shadow-sm"
                        aria-label="Pagination">
                        <button
                            onClick={handlePrevious}
                            disabled={currentPage === 1}
                            className="relative inline-flex items-center rounded-l-md px-2 py-2 text-sm font-medium text-gray-500 hover:bg-gray-50">
                            <span className="sr-only">Anterior</span>
                            <svg
                                className="h-5 w-5"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                                aria-hidden="true">
                                <path
                                    fillRule="evenodd"
                                    d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z"
                                    clipRule="evenodd"
                                />
                            </svg>
                        </button>
                        <button className="relative z-10 inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700">
                            {currentPage}
                        </button>
                        {currentPage < totalPages && (
                            <>
                                <button
                                    onClick={handleNext}
                                    className="relative inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
                                    {currentPage + 1}
                                </button>
                                <span className="relative inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700">
                                    ...
                                </span>
                                <button
                                    onClick={() => onPageChange(totalPages)}
                                    className="relative inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
                                    {totalPages}
                                </button>
                            </>
                        )}
                        <button
                            onClick={handleNext}
                            disabled={currentPage === totalPages}
                            className="relative inline-flex items-center rounded-r-md px-2 py-2 text-sm font-medium text-gray-500 hover:bg-gray-50">
                            <span className="sr-only">Siguiente</span>
                            <svg
                                className="h-5 w-5"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                                aria-hidden="true">
                                <path
                                    fillRule="evenodd"
                                    d="M7.21 14.77a.75.75 0 01-.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z"
                                    clipRule="evenodd"
                                />
                            </svg>
                        </button>
                    </nav>
                </div>
            </div>
        </div>
    )
}

export default Pagination
