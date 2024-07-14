'use client'

import Loading from '@/app/(app)/Loading'
import React, { useState, useEffect } from 'react'

import { useAuth } from '@/hooks/auth'
import Navigation from './Navigation'
import Sidebar from './Sidebar'
import Navbar from './Navbar'
import { useTheme } from '@/context/ThemeProvider'
import { Component } from '@/components/Footer'
import useConfiguracion from '@/hooks/useConfiguracion'

const AppLayout = ({ children, header }) => {
    const { user, logout } = useAuth({ middleware: 'auth' })
    const { isDark } = useTheme();
    const {configuracion}=useConfiguracion()
    //guardar configuracion en localstorage
    useEffect(() => {
        localStorage.setItem('configuracion', JSON.stringify(configuracion))
    }, [configuracion])

    if (!user) {
        return <Loading />
    }

    return (
        <div className={`${isDark ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'}
         fixed z-30 w-full min-h-screen top-0 left-0 right-0 transition-all duration-300`}>
            <div className={`${
                isDark ? 'bg-gray-800 text-white' : ' bg-white text-gray-800'
            } flex h-screen transition-all duration-300`}>
            <Sidebar user={user} logout={logout} />
        <div className={`${
                isDark ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'
            }flex flex-col flex-grow h-full transition-all duration-300 overflow-y-auto`}
            >
            <Navbar />
          
            <main className={`${isDark? 'bg-gray-900':' bg-indigo-50'} mx-2 my-3  rounded-md flex-grow p-6 overflow-y-auto `}
            >
                {children}
               
            </main>
            <Component />
        </div>
        
            </div>
           
        
    </div>
   
    )
}

export default AppLayout

