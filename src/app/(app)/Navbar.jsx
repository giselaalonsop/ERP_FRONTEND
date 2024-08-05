import { Fragment } from 'react'
import { useAuth } from '@/hooks/auth'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUser } from '@fortawesome/free-solid-svg-icons'
import React, { useState } from 'react'
import { useTheme } from '@/context/ThemeProvider'
import Breadcrumb from '@/components/Breadcrumb'
import Link from 'next/link'

const Navbar = () => {
    const { isDark, toggleTheme } = useTheme()
    const { user } = useAuth()

    return (
        <>
            <nav
                className={`${
                    isDark
                        ? 'bg-blue-900 text-white'
                        : ' bg-blue-300 text-gray-800'
                }shadow-md py-4 transition-all duration-300`}>
                <div className="container mx-auto px-4 flex items-center justify-between">
                    <div className="text-lg font-semibold text-gray-900 dark:text-white"></div>
                    <div className="flex items-center space-x-4">
                        <button className="text-gray-900 dark:text-white"></button>
                        <button className="text-gray-900 dark:text-white"></button>
                        <div className="relative">
                            <button
                                onClick={toggleTheme}
                                className="group p-2 transition-colors duration-200 rounded-full shadow-md bg-blue-200 hover:bg-blue-200 dark:bg-gray-50 dark:hover:bg-gray-200 text-gray-900 focus:outline-none">
                                {isDark ? (
                                    <svg
                                        width="24"
                                        height="24"
                                        className="fill-current text-gray-700 group-hover:text-gray-500 group-focus:text-gray-700 dark:text-gray-700 dark:group-hover:text-gray-500 dark:group-focus:text-gray-700"
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="">
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                                        />
                                    </svg>
                                ) : (
                                    <svg
                                        width="24"
                                        height="24"
                                        className="fill-current text-gray-700 group-hover:text-gray-500 group-focus:text-gray-700 dark:text-gray-700 dark:group-hover:text-gray-500 dark:group-focus:text-gray-700"
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="">
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                                        />
                                    </svg>
                                )}
                            </button>
                        </div>
                        {user && (
                            <div className="flex items-center space-x-2">
                                <FontAwesomeIcon
                                    icon={faUser}
                                    className="text-gray-900 dark:text-white"
                                />
                                <Link href={`/Perfil`}>
                                    {user.name}
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </nav>
            <Breadcrumb />
        </>
    )
}
export default Navbar
