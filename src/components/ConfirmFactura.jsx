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
    venta, // Nueva propiedad para la venta en edición
}) => {
    const { isDark } = useTheme()
    const { addVenta, updateVenta } = useVentas() // Añadimos updateVenta
    const { registrarVentaEnCaja } = useCaja()
    const [selectedPayments, setSelectedPayments] = useState([])
    const [amounts, setAmounts] = useState({})
    const [changes, setChanges] = useState({})
    const [remainingAmount, setRemainingAmount] = useState(TotalGeneral)
    const [factura, setFactura] = useState(false)
    const { user } = useAuth()
    const htmlContentRef = useRef(null)
    const [isPending, setIsPending] = useState(false)
    const [ventaData, setVentaData] = useState({})
    const [exchangeRate, setExchangeRate] = useState(36.65)
    const [img, setImg] = useState('')
    const configuracion = JSON.parse(localStorage.getItem('configuracion'))

    useEffect(() => {
        if (configuracion) {
            const logoPath = `http://localhost:8000/${configuracion.logo}`
            setImg(logoPath)
        }
    }, [configuracion])

    // useEffect(() => {
    //     fetch('https://pydolarvenezuela-api.vercel.app/api/v1/dollar?page=bcv')
    //         .then(res => res.json())
    //         .then(data => setExchangeRate(data.monitors.usd.price))
    // }, [])

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

    // Cargar datos de la venta en edición
    useEffect(() => {
        if (venta) {
            setIsPending(venta.estado === 'Pendiente')
            setRemainingAmount(parseFloat(venta.total_venta_dol))
            TotalGeneral = parseFloat(TotalGeneral)
        }
    }, [venta])

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
            let amount = parseFloat(amounts[method] || 0)
            if (method !== 'Dolares en efectivo' && method !== 'Zelle') {
                amount = amount / exchangeRate // Convertir a dólares
            }
            return acc + amount
        }, 0)

        const totalChange = Object.keys(changes).reduce((acc, method) => {
            let change = parseFloat(changes[method] || 0)
            if (method !== 'Dolares en efectivo' && method !== 'Zelle') {
                change = change / exchangeRate // Convertir a dólares
            }
            return acc + change
        }, 0)

        const remaining = TotalGeneral - totalEntered + totalChange
        setRemainingAmount(parseFloat(remaining))
    }, [amounts, changes, TotalGeneral])

    const remainingAmountInBs = remainingAmount * exchangeRate

    const handleSubmit = async e => {
        e.preventDefault()
        if (
            remainingAmount.toFixed(2) === '0.00' ||
            remainingAmount.toFixed(2) === '-0.00' ||
            isPending
        ) {
            const paymentData = isPending
                ? [
                      {
                          method: paymentMethodsEnum['Pagar Luego'],
                          amount: 0,
                          change: 0,
                      },
                  ]
                : selectedPayments.map(method => ({
                      method: paymentMethodsEnum[method],
                      amount: amounts[method] ? parseFloat(amounts[method]) : 0,
                      change: changes[method] ? parseFloat(changes[method]) : 0,
                  }))
            console.log(paymentData)
            const metodoPago = paymentData

            const ventaData = {
                cliente: cliente.cedula,
                usuario: user.name,
                numero_de_venta: venta
                    ? venta.numero_de_venta
                    : Math.floor(Math.random() * 1000),
                comprobante: 'Factura',
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
                                  (product.porcentaje_ganancia -
                                      cliente.descuento) /
                                      100)),
                })),
                descuento: cliente.descuento > 0 ? cliente.descuento : 0,
            }
            setVentaData(ventaData)

            const dataCaja = {
                location: user.location,
                total_venta_dol: TotalGeneral,
                payments: paymentData,
            }

            try {
                if (venta) {
                    await updateVenta(venta.id, ventaData)
                } else {
                    await addVenta(ventaData)
                }

                if (!isPending) {
                    await registrarVentaEnCaja(dataCaja)
                }

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
        <>
            <div
                ref={htmlContentRef}
                className="bg-white border rounded-lg shadow-lg px-6 py-8 max-w-md mx-auto mt-8">
                <img
                    src={img}
                    alt="logo"
                    className="w-20 h-auto mx-auto mb-4"
                />
                <hr className="mb-2" />
                <div className="text-center text-gray-700 mb-4">
                    {configuracion.nombre_empresa}
                    <br></br>
                    RIF: {configuracion.rif}
                </div>
                <div className="flex justify-between mb-6">
                    <h1 className="text-lg font-bold">Invoice</h1>
                    <div className="text-gray-700">
                        <div>Fecha: {new Date().toLocaleDateString()}</div>
                        <div>Factura #: {ventaData.numero_de_venta}</div>
                    </div>
                </div>
                <div className="mb-8">
                    <h2 className="text-lg font-bold mb-4">Comprador:</h2>
                    <div className="text-gray-700 mb-2">
                        {' '}
                        {cliente.nombre + ' ' + cliente.apellido}
                    </div>
                    <div className="text-gray-700 mb-2">
                        Descuento: {cliente.descuento + '%' || 'N/A'}
                    </div>
                    <div className="text-gray-700 mb-2">
                        {cliente.direccion || 'N/A'}
                    </div>

                    <div className="text-gray-700">
                        {cliente.correo_electronico || 'N/A'}
                    </div>
                </div>
                <table className="w-full mb-8">
                    <thead>
                        <tr>
                            <th className="text-left font-bold text-gray-700">
                                #
                            </th>
                            <th className="text-left font-bold text-gray-700">
                                Description
                            </th>
                            <th className="text-right font-bold text-gray-700">
                                Cantidad
                            </th>
                            <th className="text-right font-bold text-gray-700">
                                Total
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {ventaData.productos.map((product, index) => (
                            <tr key={index}>
                                <td className="text-left text-gray-700">
                                    {index + 1}
                                </td>
                                <td className="text-left text-gray-700">
                                    {product.nombre}
                                </td>
                                <td className="text-right text-gray-700">
                                    {product.cantidad}
                                </td>
                                <td className="text-right text-gray-700">
                                    ${product.total.toFixed(2)}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                    <tfoot>
                        <tr>
                            <td
                                colSpan="3"
                                className="text-left font-bold text-gray-700">
                                Total
                            </td>
                            <td className="text-right font-bold text-gray-700">
                                ${ventaData.total_venta_dol.toFixed(2)}
                            </td>
                        </tr>
                        <tr>
                            <td
                                colSpan="3"
                                className="text-left font-bold text-gray-700">
                                Total en Bs
                            </td>
                            <td className="text-right font-bold text-gray-700">
                                {(
                                    ventaData.total_venta_dol * exchangeRate
                                ).toFixed(2)}{' '}
                                Bs
                            </td>
                        </tr>
                    </tfoot>
                </table>
                <div className="text-gray-700 mb-2">Gracias por tu compra!</div>
            </div>
            <PdfGenerator htmlContentRef={htmlContentRef} fileName="factura" />
        </>
    ) : (
        <div>
            <form onSubmit={handleSubmit}>
                <div className="flex items-center mb-4 text-lg">
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
                                    required={
                                        selectedPayments.includes(method) &&
                                        !isPending
                                    }
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
                                        isPending ||
                                        method === 'Punto de venta' // Agregar esta condición
                                    }
                                    style={{
                                        display:
                                            method === 'Punto de venta'
                                                ? 'none'
                                                : 'block', // Agregar esta condición
                                    }}
                                />
                            </div>
                        </div>
                    ))}
                </div>
                <div
                    className="flex justify-between items-center mb-4"
                    style={{ marginTop: '50px' }}>
                    <div className="mb-4">
                        <p
                            className={`text-xl font-medium ${
                                isDark ? 'text-gray-300' : 'text-gray-900'
                            }`}>
                            Total: $
                            {typeof TotalGeneral === 'number'
                                ? TotalGeneral.toFixed(2)
                                : parseFloat(TotalGeneral).toFixed(2)}
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
                            {typeof remainingAmountInBs === 'number'
                                ? remainingAmountInBs.toFixed(2)
                                : '0.00'}{' '}
                            Bs
                        </p>
                    </div>
                    <div className="mb-4">
                        <button
                            type="submit"
                            onClick={handleSubmit}
                            style={{ width: '200px', height: '50px' }}
                            className="  font-bold mt-4 bg-green-500 hover:bg-green-700 text-white py-2 px-4 rounded-lg self-end">
                            Procesar
                        </button>
                    </div>
                </div>
            </form>
        </div>
    )
}

export default ConfirmFactura
