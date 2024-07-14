'use client'
import React, { useState, useEffect } from 'react'
import { useCaja } from '@/hooks/useCaja'
import Swal from 'sweetalert2'
import { useAuth } from '@/hooks/auth'
import { Button } from 'flowbite-react'
import { format } from 'date-fns'

const CierreDeCaja = () => {
    const { obtenerCierreDeCaja, cerrarCaja } = useCaja()
    const { user } = useAuth()
    const [cierreDeCaja, setCierreDeCaja] = useState(null)
    const [cajaCerrada, setCajaCerrada] = useState(false)

    useEffect(() => {
        const fetchCierreDeCaja = async () => {
            try {
                const data = await obtenerCierreDeCaja(user.location)
                if (
                    data.message &&
                    data.message === 'La caja del día ya fue cerrada.'
                ) {
                    setCajaCerrada(true)
                } else {
                    setCierreDeCaja(data)
                }
            } catch (error) {
                console.error('Error al obtener cierre de caja', error)
            }
        }

        fetchCierreDeCaja()
    }, [user.location])

    const handleCerrarCaja = async () => {
        try {
            await cerrarCaja(user.location)
            Swal.fire(
                'Caja Cerrada',
                'La caja ha sido cerrada exitosamente',
                'success',
            )
            setCierreDeCaja(prev => ({ ...prev, estado: 'cerrado' }))
        } catch (error) {
            Swal.fire('Error', 'Hubo un problema al cerrar la caja', 'error')
        }
    }

    if (cajaCerrada) {
        return (
            <div className="text-center">La caja del día ya fue cerrada.</div>
        )
    }

    if (!cierreDeCaja) {
        return <div className="text-center">Cargando...</div>
    }

    const formatDate = dateString => {
        return format(new Date(dateString), 'dd-MM-yyyy HH:mm:ss')
    }

    return (
        <div className="max-w-4xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold mb-4">
                Cierre de Caja - {user.location}
            </h2>
            <div className="mb-4">
                <p className="font-semibold">
                    Responsable:{' '}
                    <span className="font-normal">{user.name}</span>
                </p>
                <p className="font-semibold">
                    Punto de Venta:{' '}
                    <span className="font-normal">{user.location}</span>
                </p>
                <p className="font-semibold">
                    Fecha de Apertura:{' '}
                    <span className="font-normal">
                        {formatDate(cierreDeCaja.created_at)}
                    </span>
                </p>
            </div>
            <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                    <p className="font-semibold">
                        Monto Total:{' '}
                        <span className="font-normal">
                            {cierreDeCaja.monto_total} Bs.
                        </span>
                    </p>
                    <p className="font-semibold">
                        Dólares en Efectivo:{' '}
                        <span className="font-normal">
                            {cierreDeCaja.dol_efectivo} $
                        </span>
                    </p>
                    <p className="font-semibold">
                        Zelle:{' '}
                        <span className="font-normal">
                            {cierreDeCaja.zelle} $
                        </span>
                    </p>
                    <p className="font-semibold">
                        Bolívares en Efectivo:{' '}
                        <span className="font-normal">
                            {cierreDeCaja.bs_efectivo} Bs.
                        </span>
                    </p>
                    <p className="font-semibold">
                        Punto de Venta:{' '}
                        <span className="font-normal">
                            {cierreDeCaja.bs_punto_de_venta} Bs.
                        </span>
                    </p>
                    <p className="font-semibold">
                        Pago Móvil:{' '}
                        <span className="font-normal">
                            {cierreDeCaja.bs_pago_movil} Bs.
                        </span>
                    </p>
                </div>
                <div className="flex flex-col justify-around">
                    {cierreDeCaja.estado === 'abierto' && (
                        <button
                            onClick={handleCerrarCaja}
                            type="button"
                            className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4
                         focus:ring-blue-300 font-medium rounded-lg py-2.5 mb-2
                          dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none
                           dark:focus:ring-blue-800">
                            Cerrar Caja
                        </button>
                    )}
                </div>
            </div>
        </div>
    )
}

export default CierreDeCaja
