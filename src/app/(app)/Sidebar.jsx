'use client'
import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
    faRightFromBracket,
    faDiagramProject,
    faUsers,
    faChartSimple,
    faNewspaper,
    faCartShopping,
    faFileLines,
    faGear,
    faLayerGroup,
    faUserGroup,
    faCashRegister,
    faRepeat,
} from '@fortawesome/free-solid-svg-icons'
import { HiChartPie, HiUser, HiViewBoards, HiShoppingBag } from 'react-icons/hi'
import { useTheme } from '@/context/ThemeProvider'
import useConfiguracion from '@/hooks/useConfiguracion'

const Sidebar = ({ user, logout }) => {
    const [sidebarOpen, setSidebarOpen] = useState(true)
    const [inventario, setInventario] = useState(true)
    const [ventas, setVentas] = useState(true)
    const [compras, setCompras] = useState(true)
    const { isDark } = useTheme()
    const [img, setImg] = useState('')
    const { logo, loading } = useConfiguracion()
    useEffect(() => {
        if (loading) {
            return
        }
        if (logo) {
            const logoPath = `http://localhost:8000/${logo}`
            setImg(logoPath)
        }
    }, [logo])
    return (
        <div
            className={`${sidebarOpen ? 'w-64' : 'w-20'} ${
                isDark ? 'bg-gray-800 text-white' : 'bg-white text-gray-800 '
            } transition-all duration-300 h-full flex flex-col`}
            style={{
                border: isDark ? '1px solid transparent' : ' none',
            }}>
            <div
                className={`flex items-center justify-center border-b ${
                    isDark
                        ? 'bg-gray-800 text-white border-gray-700'
                        : 'bg-white text-gray-800'
                }`}
                style={{
                    height: '4.5rem',
                    justifyContent: sidebarOpen ? 'right' : 'center',
                    paddingRight: sidebarOpen ? '10px' : '0px',
                }}>
                {sidebarOpen && (
                    <img
                        src={img}
                        alt="Logo"
                        className="h-10 w-auto px-2"
                        style={{ marginRight: 'auto' }}
                    />
                )}
                <button onClick={() => setSidebarOpen(!sidebarOpen)}>
                    <svg
                        className="h-8 w-8"
                        stroke="currentColor"
                        fill="none"
                        viewBox="0 0 24 24">
                        {sidebarOpen ? (
                            <path
                                className="inline-flex"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M6 18L18 6M6 6l12 12"
                            />
                        ) : (
                            <path
                                className="inline-flex"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M4 6h16M4 12h16M4 18h16"
                            />
                        )}
                    </svg>
                </button>
            </div>

            <div className="overflow-y-auto flex-grow">
                <ul className="flex flex-col py-4 space-y-1">
                    <li className="px-5 hidden md:block">
                        <div className="flex flex-row items-center h-8">
                            <span
                                className={`${
                                    sidebarOpen ? 'inline' : 'hidden'
                                } font-medium tracking-wide text-gray-400 uppercase text-lg`}>
                                Main
                            </span>
                        </div>
                    </li>
                    <li>
                        <Link
                            href="/dashboard"
                            className="relative flex flex-row items-center h-12 hover:bg-blue-800 dark:hover:bg-gray-600 text-white-600 hover:text-white-800 pr-6">
                            <span className="inline-flex justify-center items-center ml-4">
                                <HiChartPie className="w-6 h-6" />
                            </span>
                            <span
                                className={`${
                                    sidebarOpen ? 'inline' : 'hidden'
                                } ml-2 text-base tracking-wide truncate`}>
                                Dashboard
                            </span>
                        </Link>
                    </li>
                    <li>
                        <Link
                            href="/Usuarios"
                            className="relative flex flex-row items-center h-12 hover:bg-blue-800 dark:hover:bg-gray-600 text-white-600 hover:text-white-800 pr-6">
                            <span className="inline-flex justify-center items-center ml-4">
                                <HiUser className="w-6 h-6" />
                            </span>
                            <span
                                className={`${
                                    sidebarOpen ? 'inline' : 'hidden'
                                } ml-2 text-base tracking-wide truncate`}>
                                Usuarios
                            </span>
                        </Link>
                    </li>

                    <li>
                        <Link
                            href="/Clientes"
                            className="relative flex flex-row items-center h-12 hover:bg-blue-800 dark:hover:bg-gray-600 text-white-600 hover:text-white-800 pr-6">
                            <span className="inline-flex justify-center items-center ml-4">
                                <FontAwesomeIcon
                                    icon={faUsers}
                                    className="w-6 h-6"
                                />
                            </span>
                            <span
                                className={`${
                                    sidebarOpen ? 'inline' : 'hidden'
                                } ml-2 text-base tracking-wide truncate`}>
                                Clientes
                            </span>
                        </Link>
                    </li>
                    <li>
                        <Link
                            onClick={() => setInventario(!inventario)}
                            href="#"
                            className="relative flex flex-row items-center h-12 hover:bg-blue-800 dark:hover:bg-gray-600 text-white-600 hover:text-white-800 pr-6">
                            <span className="inline-flex justify-center items-center ml-4">
                                <FontAwesomeIcon
                                    icon={faDiagramProject}
                                    className="w-6 h-6"
                                />
                            </span>
                            <span
                                className={`${
                                    sidebarOpen ? 'inline' : 'hidden'
                                } ml-2 text-base tracking-wide truncate`}>
                                Operaciones
                            </span>
                        </Link>
                        <ul
                            className={`${
                                inventario ? 'block' : 'hidden'
                            } ml-4`}>
                            <li>
                                <Link
                                    href="/Inventario"
                                    className="relative flex flex-row items-center h-12 hover:bg-blue-800 dark:hover:bg-gray-600 text-white-600 hover:text-white-800 pr-6">
                                    <span className="inline-flex justify-center items-center ml-4">
                                        <HiViewBoards className="w-6 h-6" />
                                    </span>
                                    <span
                                        className={`${
                                            sidebarOpen ? 'inline' : 'hidden'
                                        } ml-2 text-base tracking-wide truncate`}>
                                        Inventario
                                    </span>
                                </Link>
                            </li>
                        </ul>
                    </li>
                    <li></li>
                    <li>
                        <Link
                            onClick={() => setVentas(!ventas)}
                            href="#"
                            className="relative flex flex-row items-center h-12 hover:bg-blue-800 dark:hover:bg-gray-600 text-white-600 hover:text-white-800 pr-6">
                            <span className="inline-flex justify-center items-center ml-4">
                                <FontAwesomeIcon
                                    icon={faCartShopping}
                                    className="w-6 h-6"
                                />
                            </span>
                            <span
                                className={`${
                                    sidebarOpen ? 'inline' : 'hidden'
                                } ml-2 text-base tracking-wide truncate`}>
                                Ventas
                            </span>
                        </Link>
                        <ul className={`${ventas ? 'block' : 'hidden'} ml-4`}>
                            <li>
                                <Link
                                    href="/facturacion"
                                    className="relative flex flex-row items-center h-12 hover:bg-blue-800 dark:hover:bg-gray-600 text-white-600 hover:text-white-800 pr-6">
                                    <span className="inline-flex justify-center items-center ml-4">
                                        <FontAwesomeIcon
                                            className="w-6 h-6"
                                            icon={faNewspaper}
                                        />
                                    </span>
                                    <span
                                        className={`${
                                            sidebarOpen ? 'inline' : 'hidden'
                                        } ml-2 text-base tracking-wide truncate`}>
                                        Facturacion
                                    </span>
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/ventas"
                                    className="relative flex flex-row items-center h-12 hover:bg-blue-800 dark:hover:bg-gray-600 text-white-600 hover:text-white-800 pr-6">
                                    <span className="inline-flex justify-center items-center ml-4">
                                        <FontAwesomeIcon
                                            icon={faChartSimple}
                                            className="w-6 h-6"
                                        />
                                    </span>
                                    <span
                                        className={`${
                                            sidebarOpen ? 'inline' : 'hidden'
                                        } ml-2 text-base tracking-wide truncate`}>
                                        Historial
                                    </span>
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/CobrosPendientes"
                                    className="relative flex flex-row items-center h-12 hover:bg-blue-800 dark:hover:bg-gray-600 text-white-600 hover:text-white-800 pr-6">
                                    <span className="inline-flex justify-center items-center ml-4">
                                        <FontAwesomeIcon
                                            icon={faFileLines}
                                            className="w-6 h-6"
                                        />
                                    </span>
                                    <span
                                        className={`${
                                            sidebarOpen ? 'inline' : 'hidden'
                                        } ml-2 text-base tracking-wide truncate`}>
                                        Cuentas por Cobrar
                                    </span>
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/CierreCaja"
                                    className="relative flex flex-row items-center h-12 hover:bg-blue-800 dark:hover:bg-gray-600 text-white-600 hover:text-white-800 pr-6">
                                    <span className="inline-flex justify-center items-center ml-4">
                                        <FontAwesomeIcon
                                            icon={faCashRegister}
                                            className="w-6 h-6"
                                        />
                                    </span>
                                    <span
                                        className={`${
                                            sidebarOpen ? 'inline' : 'hidden'
                                        } ml-2 text-base tracking-wide truncate`}>
                                        Reporte Z
                                    </span>
                                </Link>
                            </li>
                        </ul>
                    </li>
                    <li>
                        <Link
                            onClick={() => setCompras(!compras)}
                            href="#"
                            className="relative flex flex-row items-center h-12 hover:bg-blue-800 dark:hover:bg-gray-600 text-white-600 hover:text-white-800 pr-6">
                            <span className="inline-flex justify-center items-center ml-4">
                                <FontAwesomeIcon
                                    icon={faLayerGroup}
                                    className="w-6 h-6"
                                />
                            </span>
                            <span
                                className={`${
                                    sidebarOpen ? 'inline' : 'hidden'
                                } ml-2 text-base tracking-wide truncate`}>
                                Compras
                            </span>
                        </Link>
                        <ul className={`${compras ? 'block' : 'hidden'} ml-4`}>
                            <li>
                                <Link
                                    href="/proveedores"
                                    className="relative flex flex-row items-center h-12 hover:bg-blue-800 dark:hover:bg-gray-600 text-white-600 hover:text-white-800 pr-6">
                                    <span className="inline-flex justify-center items-center ml-4">
                                        <FontAwesomeIcon
                                            className="w-6 h-6"
                                            icon={faUserGroup}
                                        />
                                    </span>
                                    <span
                                        className={`${
                                            sidebarOpen ? 'inline' : 'hidden'
                                        } ml-2 text-base tracking-wide truncate`}>
                                        Proveedores
                                    </span>
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/compras"
                                    className="relative flex flex-row items-center h-12 hover:bg-blue-800 dark:hover:bg-gray-600 text-white-600 hover:text-white-800 pr-6">
                                    <span className="inline-flex justify-center items-center ml-4">
                                        <FontAwesomeIcon
                                            icon={faChartSimple}
                                            className="w-6 h-6"
                                        />
                                    </span>
                                    <span
                                        className={`${
                                            sidebarOpen ? 'inline' : 'hidden'
                                        } ml-2 text-base tracking-wide truncate`}>
                                        Historial
                                    </span>
                                </Link>
                            </li>
                        </ul>
                    </li>
                    <li>
                        <Link
                            href="/Movimientos"
                            className="relative flex flex-row items-center h-12 hover:bg-blue-800 dark:hover:bg-gray-600 text-white-600 hover:text-white-800 pr-6">
                            <span className="inline-flex justify-center items-center ml-4">
                                <FontAwesomeIcon
                                    icon={faRepeat}
                                    className="w-6 h-6"
                                />
                            </span>
                            <span
                                className={`${
                                    sidebarOpen ? 'inline' : 'hidden'
                                } ml-2 text-base tracking-wide truncate`}>
                                Movimientos
                            </span>
                        </Link>
                    </li>
                    <li>
                        <Link
                            href="/configuracion"
                            className="relative flex flex-row items-center h-12 hover:bg-blue-800 dark:hover:bg-gray-600 text-white-600 hover:text-white-800 pr-6">
                            <span className="inline-flex justify-center items-center ml-4">
                                <FontAwesomeIcon
                                    icon={faGear}
                                    className="w-6 h-6"
                                />
                            </span>
                            <span
                                className={`${
                                    sidebarOpen ? 'inline' : 'hidden'
                                } ml-2 text-base tracking-wide truncate`}>
                                Configuracion
                            </span>
                        </Link>
                    </li>

                    <li onClick={logout}>
                        <Link
                            href="#"
                            className="relative flex flex-row items-center h-12 hover:bg-blue-800 dark:hover:bg-gray-600 text-white-600 hover:text-white-800 pr-6">
                            <span className="inline-flex justify-center items-center ml-4">
                                <FontAwesomeIcon
                                    icon={faRightFromBracket}
                                    className="w-6 h-6"
                                />
                            </span>
                            <span
                                className={`${
                                    sidebarOpen ? 'inline' : 'hidden'
                                } ml-2 text-base tracking-wide truncate`}>
                                Logout
                            </span>
                        </Link>
                    </li>
                </ul>
            </div>
        </div>
    )
}

export default Sidebar
