'use client'
import React, { useState, useEffect, useRef } from 'react'
import { useTheme } from '@/context/ThemeProvider'
import { useVentas } from '@/hooks/useVentas'
import Swal from 'sweetalert2'
import { useAuth } from '@/hooks/auth'
import PdfGenerator from '@/components/PdfGenerator'
import { useCaja } from '@/hooks/useCaja'

const ConfirmFactura = ({
    setProcesado,
    TotalGeneral,
    cliente,
    selectedProducts,
    location,
    onSuccess,
    isMayor,
}) => {
    const { isDark } = useTheme()
    const { addVenta } = useVentas()
    const { registrarVentaEnCaja } = useCaja()
    const [selectedPayments, setSelectedPayments] = useState([])
    const [amounts, setAmounts] = useState({})
    const [changes, setChanges] = useState({})
    const [remainingAmount, setRemainingAmount] = useState(TotalGeneral)
    const [factura, setFactura] = useState(false)
    const { user } = useAuth()
    const htmlContentRef = useRef(null)
    const [isPending, setIsPending] = useState(false)

    const exchangeRate = 28 // Supongamos que 1$ = 28 Bs, este valor puede ser actualizado desde una API

    useEffect(() => {
        factura
    }, [factura])

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
        'Pagar Luego': 'pagar_luego', // Método de pago para pagos pendientes
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
            setChanges(prevState => {
                const newChanges = { ...prevState }
                delete newChanges[method]
                return newChanges
            })
        }
    }

    const handleAmountChange = (method, value) => {
        setAmounts(prevState => ({
            ...prevState,
            [method]: parseFloat(value) || 0,
        }))
    }

    const handleChangeAmount = (method, value) => {
        setChanges(prevState => ({
            ...prevState,
            [method]: parseFloat(value) || 0,
        }))
    }

    useEffect(() => {
        const totalEntered = Object.keys(amounts).reduce((acc, method) => {
            if (method !== 'Dolares en efectivo' && method !== 'Zelle') {
                return acc + (amounts[method] || 0) / exchangeRate
            }
            return acc + (amounts[method] || 0)
        }, 0)

        const totalChange = Object.keys(changes).reduce((acc, method) => {
            if (method !== 'Dolares en efectivo' && method !== 'Zelle') {
                return acc + (changes[method] || 0) / exchangeRate
            }
            return acc + (changes[method] || 0)
        }, 0)

        const remaining = TotalGeneral - totalEntered + totalChange
        setRemainingAmount(parseFloat(remaining.toFixed(2)))
    }, [amounts, changes, TotalGeneral])

    const handleSubmit = async e => {
        e.preventDefault()
        if (remainingAmount.toFixed(2) === '0.00' || isPending) {
            const paymentData = isPending
                ? [
                      {
                          method: paymentMethodsEnum['Pagar Luego'],
                          amount: 0,
                          change: 0,
                      },
                  ]
                : Object.keys(amounts).map(method => ({
                      method: paymentMethodsEnum[method],
                      amount:
                          method !== 'Dolares en efectivo' && method !== 'Zelle'
                              ? (amounts[method] || 0) / exchangeRate
                              : amounts[method] || 0,
                      change: changes[method] || 0,
                  }))

            const metodoPago = paymentData.map(p => p.method).join(', ')

            const ventaData = {
                cliente: cliente.cedula,
                usuario: user.name,
                numero_de_venta: Math.floor(Math.random() * 1000),
                comprobante: 'Comprobante1',
                estado: isPending ? 'Pendiente' : 'Aceptado',
                mayor_o_detal: isMayor ? 'Mayor' : 'Detal',
                location,
                total_venta_bs: TotalGeneral * exchangeRate,
                metodo_pago: metodoPago,
                total_venta_dol: TotalGeneral,
                productos: selectedProducts.map(product => ({
                    codigo_barras: product.codigo_barras,
                    id: product.id,
                    cantidad: product.cantidad,
                    nombre: product.nombre,
                    precio_unitario: isMayor
                        ? product.precio_compra *
                          (1 +
                              (product.porcentaje_ganancia -
                                  cliente.descuento) /
                                  100)
                        : product.precio_compra *
                          (1 +
                              (product.porcentaje_ganancia -
                                  cliente.descuento) /
                                  100),
                    total:
                        product.cantidad *
                        (isMayor
                            ? product.precio_compra *
                              (1 +
                                  (product.porcentaje_ganancia_mayor -
                                      cliente.descuento) /
                                      100)
                            : product.precio_compra *
                              (1 +
                                  (product.porcentaje_ganancia_mayor -
                                      cliente.descuento) /
                                      100)),
                })),
                descuento: cliente.descuento > 0 ? cliente.descuento : 0,
            }

            const dataCaja = {
                location: user.location,
                total_venta_dol: TotalGeneral,
                payments: paymentData,
            }

            try {
                await addVenta(ventaData)
                if (!isPending) {
                    await registrarVentaEnCaja(dataCaja)
                }
                Swal.fire(
                    isPending ? 'Guardado' : 'Facturado',
                    isPending
                        ? 'La venta ha sido guardada como pendiente.'
                        : 'La venta ha sido procesada exitosamente.',
                    'success',
                )
                onSuccess()
                setFactura(true)
            } catch (error) {
                if (error.response && error.response.data) {
                    console.log(
                        'Validation Errors:',
                        error.response.data.errors,
                    )
                    Swal.fire(
                        'Error',
                        'Hubo un problema al procesar la venta.',
                        'error',
                    )
                } else {
                    Swal.fire(
                        'Error',
                        'Hubo un problema al procesar la venta.',
                        'error',
                    )
                }
            }
        } else {
            alert(
                'El monto restante debe ser 0 antes de proceder con la facturación.',
            )
        }
    }

    const handlePendingSwitch = () => {
        setIsPending(prevState => !prevState)
        setSelectedPayments([])
        setAmounts({})
        setChanges({})
    }

    return factura ? (
        <div ref={htmlContentRef}>
            <div className="mt-4 grid grid-cols-2 gap-4">
                <h2
                    className={`text-xl font-semibold ${
                        isDark ? 'text-gray-300' : 'text-gray-900'
                    }`}>
                    Resumen de la Factura
                </h2>
                <PdfGenerator
                    className={`justify-end ${
                        isDark
                            ? 'text-gray-300 bg-red-700'
                            : 'text-gray-900 bg-red-400'
                    }`}
                    htmlContentRef={htmlContentRef}
                    fileName="factura"
                />
            </div>

            <div
                className={`mt-6 space-y-4 border-b border-t ${
                    isDark ? 'border-gray-700' : 'border-gray-200'
                } py-8`}>
                <h4
                    className={`text-lg font-semibold ${
                        isDark ? 'text-gray-300' : 'text-gray-900'
                    }`}>
                    Información del Cliente
                </h4>
                <dl>
                    <dt
                        className={`text-base font-medium ${
                            isDark ? 'text-gray-300' : 'text-gray-900'
                        }`}>
                        Nombre
                    </dt>
                    <dd
                        className={`mt-1 text-base ${
                            isDark ? 'text-gray-400' : 'text-gray-500'
                        }`}>
                        {cliente?.nombre}
                    </dd>
                    <dt
                        className={`text-base font-medium ${
                            isDark ? 'text-gray-300' : 'text-gray-900'
                        }`}>
                        Cédula
                    </dt>
                    <dd
                        className={`mt-1 text-base ${
                            isDark ? 'text-gray-400' : 'text-gray-500'
                        }`}>
                        {cliente?.cedula}
                    </dd>
                    <dt
                        className={`text-base font-medium ${
                            isDark ? 'text-gray-300' : 'text-gray-900'
                        }`}>
                        Nombre de la Empresa
                    </dt>
                    <dd
                        className={`mt-1 text-base ${
                            isDark ? 'text-gray-400' : 'text-gray-500'
                        }`}>
                        {cliente?.empresa}
                    </dd>
                </dl>
            </div>

            <div
                className={`mt-6 ${
                    isDark ? 'border-gray-700' : 'border-gray-200'
                } border-b`}>
                <h4
                    className={`text-xl font-semibold ${
                        isDark ? 'text-gray-300' : 'text-gray-900'
                    }`}>
                    Detalles de la Venta
                </h4>
                <div className="relative overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead>
                            <tr>
                                <th className="px-4 py-2">Producto</th>
                                <th className="px-4 py-2">Cantidad</th>
                                <th className="px-4 py-2">Precio Unitario</th>
                                <th className="px-4 py-2">Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            {selectedProducts.map((product, index) => (
                                <tr key={index}>
                                    <td className="px-4 py-2">
                                        {product.nombre}
                                    </td>
                                    <td className="px-4 py-2">
                                        {product.cantidad}
                                    </td>
                                    <td className="px-4 py-2">
                                        $
                                        {isMayor
                                            ? (
                                                  product.precio_compra *
                                                  (1 +
                                                      product.porcentaje_ganancia_mayor -
                                                      cliente.descuento / 100)
                                              ).toFixed(2)
                                            : (
                                                  product.precio_compra *
                                                  (1 +
                                                      product.porcentaje_ganancia -
                                                      cliente.descuento / 100)
                                              ).toFixed(2)}
                                    </td>
                                    <td className="px-4 py-2">
                                        $
                                        {(
                                            product.cantidad *
                                            (isMayor
                                                ? product.precio_compra *
                                                  (1 +
                                                      product.porcentaje_ganancia_mayor -
                                                      cliente.descuento / 100)
                                                : product.precio_compra *
                                                  (1 +
                                                      product.porcentaje_ganancia -
                                                      cliente.descuento / 100))
                                        ).toFixed(2)}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            <div className="mt-4 grid grid-cols-2 items-center">
                <h4
                    className={`text-xl font-semibold ${
                        isDark ? 'text-gray-300' : 'text-gray-900'
                    }`}>
                    Resumen del Pedido
                </h4>
                <div className="text-right">
                    <p
                        className={`text-base ${
                            isDark ? 'text-gray-300' : 'text-gray-900'
                        }`}>
                        Total: ${TotalGeneral.toFixed(2)}
                    </p>
                    <p
                        className={`text-base ${
                            isDark ? 'text-gray-300' : 'text-gray-900'
                        }`}>
                        Total en Bs: {(TotalGeneral * exchangeRate).toFixed(2)}{' '}
                        Bs
                    </p>
                    <p
                        className={`text-base ${
                            isDark ? 'text-gray-300' : 'text-gray-900'
                        }`}>
                        Restante en Bs:{' '}
                        {(remainingAmount * exchangeRate).toFixed(2)} Bs
                    </p>
                </div>
            </div>
        </div>
    ) : (
        <div>
            <form onSubmit={handleSubmit}>
                <div className="flex items-center mb-4">
                    <label
                        htmlFor="pending-switch"
                        className={`mr-2 text-sm font-medium ${
                            isDark ? 'text-gray-300' : 'text-gray-900'
                        }`}>
                        Pagar Luego
                    </label>
                    <input
                        type="checkbox"
                        id="pending-switch"
                        className="w-4 h-4"
                        checked={isPending}
                        onChange={handlePendingSwitch}
                    />
                </div>

                <div className="grid gap-4 mb-4 sm:grid-cols-1">
                    {paymentMethods.map((method, index) => (
                        <div
                            key={index}
                            className={`grid grid-cols-1 sm:grid-cols-3 gap-4 items-center ps-4 border ${
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
                                    disabled={isPending}
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
                                        !selectedPayments.includes(method) ||
                                        isPending
                                    }
                                    required
                                />
                            </div>
                            <div className="col-span-1">
                                <input
                                    type="number"
                                    name={`${method}-change`}
                                    id={`${method}-change`}
                                    className={`w-full p-1 text-sm rounded-lg block ${
                                        isDark
                                            ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                                            : 'bg-gray-50 border-gray-300 text-gray-900'
                                    } focus:ring-primary-600 focus:border-primary-600`}
                                    placeholder={`Cambio en ${method}`}
                                    value={changes[method] || ''}
                                    onChange={e =>
                                        handleChangeAmount(
                                            method,
                                            e.target.value,
                                        )
                                    }
                                    disabled={
                                        !selectedPayments.includes(method) ||
                                        isPending
                                    }
                                />
                            </div>
                        </div>
                    ))}
                </div>
                <div className="mb-4">
                    <p
                        className={`text-sm font-medium ${
                            isDark ? 'text-gray-300' : 'text-gray-900'
                        }`}>
                        Total: $
                        {TotalGeneral ? TotalGeneral.toFixed(2) : '0.00'}
                    </p>
                    <p
                        className={`text-sm font-medium ${
                            remainingAmount >= 0
                                ? 'text-green-500'
                                : 'text-red-500'
                        }`}>
                        Restante: $
                        {remainingAmount ? remainingAmount.toFixed(2) : '0.00'}
                    </p>
                    <p
                        className={`text-sm font-medium ${
                            isDark ? 'text-gray-300' : 'text-gray-900'
                        }`}>
                        Restante en Bs:{' '}
                        {(remainingAmount * exchangeRate).toFixed(2)} Bs
                    </p>
                </div>
                <button
                    type="submit"
                    onClick={handleSubmit}
                    className="inline-flex items-center bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800">
                    <svg
                        className="mr-1 -ml-1 w-6 h-6"
                        viewBox="0 0 20 20"
                        xmlns="http://www.w3.org/2000/svg">
                        <path
                            fillRule="evenodd"
                            d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a 1 1 0 011-1z"
                            clipRule="evenodd"
                        />
                    </svg>
                    Procesar
                </button>
            </form>
        </div>
    )
}

export default ConfirmFactura
