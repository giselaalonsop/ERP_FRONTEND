import React, { useRef, forwardRef } from 'react'
import { useClientes } from '@/hooks/useClients'
import { format } from 'date-fns'
import { useEffect, useState } from 'react'

const Factura = forwardRef(({ venta }, ref) => {
    const configuracion = JSON.parse(localStorage.getItem('configuracion'))
    const { clientes } = useClientes()

    const cliente = clientes?.find(cliente => cliente.cedula == venta.cliente)
    const formatDate = dateString => {
        const date = new Date(dateString)
        if (isNaN(date)) {
            return 'Fecha inválida'
        }
        return format(date, 'dd-MM-yyyy HH:mm:ss')
    }
    const [img, setImg] = useState('')

    useEffect(() => {
        if (configuracion) {
            const logoPath = `http://localhost:8000/${configuracion.logo}`
            setImg(logoPath)
        }
    }, [configuracion])

    if (!cliente || !configuracion) return <div>Cargando...</div>
    return (
        <div
            ref={ref}
            className="bg-white border rounded-lg shadow-lg px-6 py-8 max-w-md mx-auto mt-8">
            <img
                src={img}
                alt="logo"
                className=" mx-auto mb-4"
                style={{ width: '200px', height: 'auto' }}
            />
            <hr className="mb-2" />
            <div className="text-center text-gray-700 mb-4">
                {configuracion.nombre_empresa}
                <br></br>
                RIF: {configuracion.rif}
            </div>
            <div className="flex justify-between mb-6">
                <h1 className="text-lg font-bold">Factura</h1>
                <div className="text-gray-700">
                    <div>Fecha: {formatDate(venta.created_at)}</div>
                    <div>Factura #: {venta.numero_de_venta}</div>
                </div>
            </div>
            <div className="mb-8">
                <h2 className="text-lg font-bold mb-4">Comprador:</h2>
                <div className="text-gray-700 mb-2">
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
                        <th className="text-left font-bold text-gray-700">#</th>
                        <th className="text-left font-bold text-gray-700">
                            Descripción
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
                    {venta.detalles.map((product, index) => (
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
                                ${parseFloat(product.total).toFixed(2)}
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
                            ${parseFloat(venta.total_venta_dol).toFixed(2)}
                        </td>
                    </tr>
                    <tr>
                        <td
                            colSpan="3"
                            className="text-left font-bold text-gray-700">
                            Total en Bs
                        </td>
                        <td className="text-right font-bold text-gray-700">
                            {parseFloat(venta.total_venta_bs).toFixed(2)} Bs
                        </td>
                    </tr>
                </tfoot>
            </table>
            <div className="text-gray-700 mb-2">Gracias por tu compra!</div>
        </div>
    )
})

export default Factura
