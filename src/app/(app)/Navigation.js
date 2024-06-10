'use client'
import React, { useState } from 'react'
import ApplicationLogo from '@/components/ApplicationLogo'
import Link from 'next/link'
import ResponsiveNavLink, { ResponsiveNavButton } from '@/components/ResponsiveNavLink'
import { DropdownButton } from '@/components/DropdownLink'
import { useAuth } from '@/hooks/auth'
import { usePathname } from 'next/navigation'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRightFromBracket } from '@fortawesome/free-solid-svg-icons';
import { HiArrowSmRight, HiChartPie, HiInbox, HiShoppingBag, HiTable, HiUser, HiViewBoards,HiOutlineMinusSm,
    HiOutlinePlusSm, } from "react-icons/hi";
import Navbar from './Navbar'
const Navigation = ({ user }) => {
    const { logout } = useAuth()
    const [sidebarOpen, setSidebarOpen] = useState(true)
    const [inventario, setInventario] = useState(false)

    return (
        <div className={`${sidebarOpen ? 'w-64' : 'w-14'} transition-all duration-300 bg-blue-900 dark:bg-gray-900 text-white h-full flex flex-col`}>
        <div className="flex items-center justify-center h-16 "  style={ sidebarOpen? {justifyContent:"right", paddingRight:"10px"}: {justifyContent:"center"}}>
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="text-white">
            <svg className="h-6 w-6" stroke="currentColor" fill="none" viewBox="0 0 24 24" >
                                {sidebarOpen ? (
                                    <path className="inline-flex " strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                ) : (
                                    <path className="inline-flex" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                                )}
                            </svg>
            </button>
        </div>
        <nav className="bg-white dark:bg-gray-900 shadow-md py-4">
            <div className="container mx-auto px-4 flex items-center justify-between">
                <div className="text-lg font-semibold text-gray-900 dark:text-white">
                    <ApplicationLogo></ApplicationLogo>
                </div>
                <div className="flex items-center space-x-4">
                    <button className="text-gray-900 dark:text-white"></button>
                    <button className="text-gray-900 dark:text-white"></button>
                    <div className="relative">
                        <button className="text-gray-900 dark:text-white flex items-center">
                            <span className="mr-2">{user.name}</span>
                            <FontAwesomeIcon icon={faUser} />
                        </button>
                    </div>
                </div>
            </div>
        </nav>
        <div className="overflow-y-auto flex-grow">
            <ul className="flex flex-col py-4 space-y-1">
                <li className="px-5 hidden md:block">
                    <div className="flex flex-row items-center h-8">
                        <div className="text-sm font-light tracking-wide text-gray-400 uppercase">Main</div>
                    </div>
                </li>
                <li>
                    <Link href="/dashboard" active={usePathname() === '/dashboard'} className="relative flex flex-row items-center h-11 hover:bg-blue-800 dark:hover:bg-gray-600 text-white-600 hover:text-white-800 pr-6">
                        <span className="inline-flex justify-center items-center ml-4">
                           <HiChartPie className="w-5 h-5" />
                        </span>
                        <span className={`${sidebarOpen ? 'inline' : 'hidden'} ml-2 text-sm tracking-wide truncate`}>Panel</span>
                    </Link>
                </li>
                <li>
                    <a href="#" className="relative flex flex-row items-center h-11 hover:bg-blue-800 dark:hover:bg-gray-600 text-white-600 hover:text-white-800 pr-6">
                        <span className="inline-flex justify-center items-center ml-4">
                            <HiUser className="w-5 h-5" />
                        </span>
                        <span className={`${sidebarOpen ? 'inline' : 'hidden'} ml-2 text-sm tracking-wide truncate`}>Clientes</span> 
                    </a>

                </li>
                <li>
                    <a  onClick={() => setInventario(!inventario)}
                     className="relative flex flex-row items-center h-11 hover:bg-blue-800 dark:hover:bg-gray-600 text-white-600 hover:text-white-800 pr-6">
                        <span className="inline-flex justify-center items-center ml-4">
                            <HiViewBoards className="w-5 h-5" />
                        </span>
                        <span className={`${sidebarOpen ? 'inline' : 'hidden'} ml-2 text-sm tracking-wide truncate`}>
                            Inventario</span>
                           
                    </a>
                    <ul className={`${inventario ? 'block' : 'hidden'} ml-4`}>
                        <li>
                            <a href="/dashboard/Inventario/agregar" className="relative flex flex-row items-center h-11 hover:bg-blue-800 dark:hover:bg-gray-600 text-white-600 hover:text-white-800 pr-6">
                                <span className="inline-flex justify-center items-center ml-4">
                                    <HiOutlinePlusSm className="w-5 h-5" />
                                </span>
                                <span className={`${sidebarOpen ? 'inline' : 'hidden'} ml-2 text-sm tracking-wide truncate`}>Agregar</span>
                            </a>
                        </li>
                       {/*stock*/}
                        <li>
                            <a href="#" className="relative flex flex-row items-center h-11 hover:bg-blue-800 dark:hover:bg-gray-600 text-white-600 hover:text-white-800 pr-6">
                                <span className="inline-flex justify-center items-center ml-4">
                                    <HiOutlineMinusSm className="w-5 h-5" />
                                </span>
                                <span className={`${sidebarOpen ? 'inline' : 'hidden'} ml-2 text-sm tracking-wide truncate`}>Stock</span>
                            </a>
                        </li>
                        {/*productos*/}
                        <li>
                            <a href="#" className="relative flex flex-row items-center h-11 hover:bg-blue-800 dark:hover:bg-gray-600 text-white-600 hover:text-white-800 pr-6">
                                <span className="inline-flex justify-center items-center ml-4">
                                    <HiShoppingBag className="w-5 h-5" />
                                </span>
                                <span className={`${sidebarOpen ? 'inline' : 'hidden'} ml-2 text-sm tracking-wide truncate`}>Productos</span>
                            </a>    
                            </li>
                    </ul>
                    
                </li>
                <li>
                    <a onClick={logout} className="relative flex flex-row items-center h-11 hover:bg-blue-800 dark:hover:bg-gray-600 text-white-600 hover:text-white-800 pr-6">
                   
                        <span className="inline-flex justify-center items-center ml-4">
                        <FontAwesomeIcon icon={faRightFromBracket} />
                        </span>
                   
                        <span className={`${sidebarOpen ? 'inline' : 'hidden'} ml-2 text-sm tracking-wide truncate`}>Logout</span>
                        
                    </a>
                </li>

        

            </ul>
        </div>
     
       
    </div>
       
        
    )
}

export default Navigation
