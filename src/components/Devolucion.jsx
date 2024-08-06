'use client'
import React, { useState, useEffect } from 'react'
import { useTheme } from '@/context/ThemeProvider'
import Swal from 'sweetalert2'
import { useAuth } from '@/hooks/auth'
import { useVentas } from '@/hooks/useVentas'

const Devolucion = ({
    TotalGeneral,
    TotalGeneralBs,
    venta,
    onSuccess,
    onCancel,
}) => {
    const { isDark } = useTheme()
    const [selectedPayments, setSelectedPayments] = useState([])
    const [amounts, setAmounts] = useState({})
    const [remainingAmount, setRemainingAmount] = useState(TotalGeneral)
    const [remainingAmountBs, setRemainingAmountBs] = useState(TotalGeneralBs)
    const { user } = useAuth()
    const [exchangeRate, setExchangeRate] = useState(0)
    const { handleDevolucion } = useVentas()

    useEffect(() => {
        fetch('https://pydolarvenezuela-api.vercel.app/api/v1/dollar?page=bcv')
            .then(res => res.json())
            .then(data => setExchangeRate(data.monitors.usd.price))
    }, [])

    const paymentMethods = [
        'Dolares en efectivo',
        'Punto de venta',
        'Pago Movil',
        'Zelle',
        'Bolivares en efectivo',
    ]

    const paymentMethodsEnum = {
        'Dolares en efectivo': 'dol_efectivo',
        'Punto de venta': 'bs_punto_de_venta',
        'Pago Movil': 'bs_pago_movil',
        Zelle: 'zelle',
        'Bolivares en efectivo': 'bs_efectivo',
    }

    const handleCheckboxChange = method => {
        setSelectedPayments(prevState =>
            prevState.includes(method)
                ? prevState.filter(payment => payment !== method)
                : [...prevState, method],
        )
        if (selectedPayments.includes(method)) {
            setAmounts(prevState => {
                const newAmounts = { ...prevState }
                delete newAmounts[method]
                return newAmounts
            })
        }
    }

    const handleAmountChange = (method, value) => {
        setAmounts(prevState => ({
            ...prevState,
            [method]: parseFloat(value) || 0,
        }))
    }

    useEffect(() => {
        const totalEnteredDol = Object.keys(amounts).reduce((acc, method) => {
            let amount = parseFloat(amounts[method] || 0)
            if (method !== 'Dolares en efectivo' && method !== 'Zelle') {
                amount = amount / exchangeRate // Convertir a dólares
            }
            return acc + amount
        }, 0)

        const totalEnteredBs = Object.keys(amounts).reduce((acc, method) => {
            let amount = parseFloat(amounts[method] || 0)
            if (method === 'Dolares en efectivo' || method === 'Zelle') {
                amount = amount * exchangeRate // Convertir a bolívares
            }
            return acc + amount
        }, 0)

        const remainingDol = TotalGeneral - totalEnteredDol
        const remainingBs = TotalGeneralBs - totalEnteredBs

        setRemainingAmount(parseFloat(remainingDol))
        setRemainingAmountBs(parseFloat(remainingBs))
    }, [amounts, TotalGeneral, TotalGeneralBs, exchangeRate])

    const handleSubmit = async e => {
        e.preventDefault()
        if (
            (remainingAmount.toFixed(2) === '0.00' ||
                remainingAmount.toFixed(2) === '-0.00') &&
            (remainingAmountBs.toFixed(2) === '0.00' ||
                remainingAmountBs.toFixed(2) === '-0.00')
        ) {
            const paymentData = selectedPayments.map(method => ({
                method: paymentMethodsEnum[method],
                amount: amounts[method] ? parseFloat(amounts[method]) : 0,
            }))

            const devolucionData = {
                numero_de_venta: venta.numero_de_venta,
                location: venta.location,
                total_venta_dol: TotalGeneral,
                total_venta_bs: TotalGeneralBs,
                metodo_pago: paymentData,
            }

            try {
                // Aquí debes llamar a la función para manejar la devolución en el backend
                await handleDevolucion(venta.id, devolucionData)
                onSuccess()
                Swal.fire('Devolución procesada con éxito', '', 'success')
            } catch (error) {
                Swal.fire(
                    'Error',
                    'Hubo un problema al procesar la devolución.',
                    'error',
                )
            }
        } else {
            alert(
                'El monto restante debe ser 0 antes de proceder con la devolución.',
            )
        }
    }

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <div className="grid gap-4 mb-4 sm:grid-cols-1">
                    {paymentMethods.map((method, index) => (
                        <div
                            key={index}
                            className={`grid grid-cols-1 sm:grid-cols-2 gap-4 items-center ps-4 border ${
                                isDark ? 'border-gray-700' : 'border-gray-200'
                            } rounded mb-4`}>
                            <div className="col-span-1 flex items-center">
                                <input
                                    id={`bordered-checkbox-${index}`}
                                    type="checkbox"
                                    name="bordered-checkbox"
                                    className={`w-4 h-4 ${
                                        isDark
                                            ? 'bg-gray-700 border-gray-600'
                                            : 'bg-gray-100 border-gray-300'
                                    } text-blue-600 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2`}
                                    checked={selectedPayments.includes(method)}
                                    onChange={() =>
                                        handleCheckboxChange(method)
                                    }
                                />
                                <label
                                    htmlFor={`bordered-checkbox-${index}`}
                                    className={`w-full py-2 ms-2 text-sm font-medium ${
                                        isDark
                                            ? 'text-gray-300 border-gray-700'
                                            : 'text-gray-900 border-gray-300'
                                    }`}>
                                    {method}
                                </label>
                            </div>
                            <div className="col-span-1">
                                <input
                                    type="number"
                                    name={`${method}-amount`}
                                    id={`${method}-amount`}
                                    className={`w-full p-1 text-sm rounded-lg block ${
                                        isDark
                                            ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                                            : 'bg-gray-50 border-gray-300 text-gray-900'
                                    } focus:ring-primary-600 focus:border-primary-600`}
                                    placeholder={`Monto en ${method}`}
                                    value={amounts[method] || ''}
                                    onChange={e =>
                                        handleAmountChange(
                                            method,
                                            e.target.value,
                                        )
                                    }
                                    disabled={
                                        !selectedPayments.includes(method)
                                    }
                                    required={selectedPayments.includes(method)}
                                />
                            </div>
                        </div>
                    ))}
                </div>
                <div className="flex justify-between items-center mb-4">
                    <div className="mb-4">
                        <p
                            className={`text-xl font-medium ${
                                isDark ? 'text-gray-300' : 'text-gray-900'
                            }`}>
                            Total a devolver: $
                            {typeof TotalGeneral === 'number'
                                ? TotalGeneral.toFixed(2)
                                : parseFloat(TotalGeneral).toFixed(2)}
                        </p>
                        <p
                            className={`text-xl font-medium ${
                                isDark ? 'text-gray-300' : 'text-gray-900'
                            }`}>
                            Total a devolver en Bs:{' '}
                            {parseFloat(TotalGeneralBs).toFixed(2)} Bs
                        </p>
                        <p
                            className={`text-xl font-medium ${
                                remainingAmount >= 0
                                    ? 'text-green-500'
                                    : 'text-red-500'
                            }`}>
                            Restante: $
                            {typeof remainingAmount === 'number'
                                ? remainingAmount.toFixed(2)
                                : '0.00'}
                        </p>
                        <p
                            className={`text-xl font-medium  ${
                                isDark ? 'text-gray-300' : 'text-gray-900'
                            }`}>
                            Restante en Bs:{' '}
                            {typeof remainingAmountBs === 'number'
                                ? remainingAmountBs.toFixed(2)
                                : '0.00'}{' '}
                            Bs
                        </p>
                    </div>
                    <div className="mb-4">
                        <button
                            type="submit"
                            style={{ width: '200px', height: '50px' }}
                            className="font-bold mt-4 bg-red-500 hover:bg-red-700 text-white py-2 px-4 rounded-lg">
                            Procesar Devolución
                        </button>
                    </div>
                </div>
            </form>
            <button
                onClick={onCancel}
                className="mt-4 px-4 py-2 bg-gray-500 hover:bg-gray-700 text-white font-semibold rounded-md shadow">
                Cancelar
            </button>
        </div>
    )
}

export default Devolucion
