// components/ProductDetail.jsx

import React from 'react'

const ProductDetail = ({ product }) => {
    return (
        <div className="p-4">
            <h2 className="text-2xl font-bold mb-4">{product.nombre}</h2>
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <p>
                        <strong>Código de Barras:</strong>{' '}
                        {product.codigo_barras}
                    </p>
                    <p>
                        <strong>Descripción:</strong> {product.descripcion}
                    </p>
                    <p>
                        <strong>Categoría:</strong> {product.categoria}
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
                        <strong>Ubicación:</strong> {product.ubicacion}
                    </p>
                </div>
                <div>
                    <p>
                        <strong>Precio de Compra:</strong>{' '}
                        {product.precio_compra}
                    </p>
                    <p>
                        <strong>Porcentaje de Ganancia:</strong>{' '}
                        {product.porcentaje_ganancia}
                    </p>
                    <p>
                        <strong>Porcentaje de Ganancia (Mayor):</strong>{' '}
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
                        <strong>Proveedor:</strong> {product.proveedor}
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
            {product.imagen && (
                <div className="mt-4">
                    <strong>Imagen:</strong>
                    <img
                        className="w-32 h-32 object-cover mt-2"
                        src={`http://localhost:8000/${product.imagen}`}
                        alt={product.nombre}
                    />
                </div>
            )}
        </div>
    )
}

export default ProductDetail
