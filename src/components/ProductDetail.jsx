import React from 'react'
import { useTheme } from '@/context/ThemeProvider'
import { useProveedores } from '@/hooks/useProveedores'

const ProductDetail = ({ product }) => {
    const { isDark } = useTheme()
    const { proveedores } = useProveedores()

    const proveedor = proveedores?.find(
        proveedor => proveedor.id === parseInt(product.proveedor),
    )

    return (
        <section
            className={`py-8 md:py-16 antialiased ${
                isDark ? 'bg-gray-900' : 'bg-white'
            }`}>
            <div className="max-w-screen-xl px-4 mx-auto 2xl:px-0">
                <div className="lg:grid lg:grid-cols-2 lg:gap-8 xl:gap-16">
                    <div className="shrink-0 max-w-md lg:max-w-lg mx-auto">
                        <img
                            className="w-full"
                            src={`http://localhost:8000/${product.imagen}`}
                            alt={product.nombre}
                        />
                    </div>

                    <div className="mt-6 sm:mt-8 lg:mt-0">
                        <h1
                            className={`text-xl font-semibold sm:text-2xl ${
                                isDark ? 'text-white' : 'text-gray-900'
                            }`}>
                            {product.nombre}
                        </h1>
                        <div className="mt-4 sm:items-center sm:gap-4 sm:flex">
                            <p
                                className={`text-2xl font-extrabold sm:text-3xl ${
                                    isDark ? 'text-white' : 'text-gray-900'
                                }`}>
                                $
                                {(
                                    product.precio_compra *
                                    (1 + product.porcentaje_ganancia / 100)
                                ).toFixed(2)}
                            </p>
                        </div>

                        <hr
                            className={`my-6 md:my-8 ${
                                isDark ? 'border-gray-800' : 'border-gray-200'
                            }`}
                        />

                        <div className="grid grid-cols-2 gap-4">
                            <p
                                className={`col-span-2 mb-6 ${
                                    isDark ? 'text-gray-400' : 'text-gray-500'
                                }`}>
                                {product.descripcion}
                            </p>
                            <div>
                                <p>
                                    <strong>Código de Barras:</strong>{' '}
                                    {product.codigo_barras}
                                </p>
                                <p>
                                    <strong>Categoría:</strong>{' '}
                                    {product.categoria}
                                </p>
                                <p>
                                    <strong>Cantidad en Stock:</strong>{' '}
                                    {product.cantidad_en_stock}
                                </p>
                                <p>
                                    <strong>Cantidad en Stock (Mayor):</strong>{' '}
                                    {product.cantidad_en_stock_mayor}
                                </p>
                                <p>
                                    <strong>Unidad de Medida:</strong>{' '}
                                    {product.unidad_de_medida}
                                </p>
                                <p>
                                    <strong>Ubicación:</strong>{' '}
                                    {product.ubicacion}
                                </p>
                            </div>
                            <div>
                                <p>
                                    <strong>Porcentaje de Ganancia:</strong>{' '}
                                    {product.porcentaje_ganancia}
                                </p>
                                <p>
                                    <strong>
                                        Porcentaje de Ganancia (Mayor):
                                    </strong>{' '}
                                    {product.porcentaje_ganancia_mayor}
                                </p>
                                <p>
                                    <strong>Forma de Venta:</strong>{' '}
                                    {product.forma_de_venta}
                                </p>
                                <p>
                                    <strong>Forma de Venta (Mayor):</strong>{' '}
                                    {product.forma_de_venta_mayor}
                                </p>
                                <p>
                                    <strong>Proveedor:</strong>{' '}
                                    {proveedor?.empresa}
                                </p>
                                <p>
                                    <strong>Fecha de Entrada:</strong>{' '}
                                    {product.fecha_entrada}
                                </p>
                                <p>
                                    <strong>Fecha de Caducidad:</strong>{' '}
                                    {product.fecha_caducidad}
                                </p>
                                <p>
                                    <strong>Peso:</strong> {product.peso}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default ProductDetail
