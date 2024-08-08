'use client'
import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/auth'
import Swal from 'sweetalert2'
import InhabilitadosTable from '@/components/InhabilitadosTable'
import { useProduct } from '@/hooks/useProduct'
import { useClientes } from '@/hooks/useClients'
import { useCategories } from '@/hooks/useCategories'
import { useProveedores } from '@/hooks/useProveedores' // Importar el hook de proveedores
import { format } from 'date-fns'

const Page = () => {
    const { user, usuariosInhabilitados, habilitarUser } = useAuth({
        middleware: 'auth',
    }) // Obtener datos y función de usuarios
    const router = useRouter()
    const { productsInhabilitados, habilitarProducto } = useProduct()
    const { clientesInhabilitados, habilitarCliente } = useClientes()
    const { categoriasInhabilitada, habilitarCategoria } = useCategories()
    const { proveedoresInhabilitados, habilitarProveedor } = useProveedores()
    const [selectedType, setSelectedType] = useState('productos')
    const [enabledItems, setEnabledItems] = useState([])

    if (!user || user.rol !== 'admin') {
        router.push('/dashboard')
        return <p>Cargando...</p>
    }
    if (
        !productsInhabilitados ||
        !clientesInhabilitados ||
        !categoriasInhabilitada ||
        !proveedoresInhabilitados ||
        !usuariosInhabilitados // Verificar que los datos estén cargados
    ) {
        return <p className="text-center">Loading...</p>
    }

    const handleTypeChange = event => {
        setSelectedType(event.target.value)
    }

    const getColumnConfig = () => {
        switch (selectedType) {
            case 'productos':
                return [
                    { key: 'codigo_barras', header: 'Código de Barras' },
                    { key: 'nombre', header: 'Nombre' },
                    { key: 'descripcion', header: 'Descripción' },
                    { key: 'categoria', header: 'Categoría' },
                    { key: 'proveedor', header: 'Proveedor' },
                    {
                        key: 'precio_venta',
                        header: 'Precio de Venta',
                        format: item =>
                            item.precio_compra *
                            (1 + item.porcentaje_ganancia / 100),
                    },
                    {
                        key: 'imagen',
                        header: 'Imagen',
                        format: item => (
                            <img
                                src={`http://localhost:8000/${item.imagen}`}
                                alt={item.nombre}
                                className="w-10 h-10 rounded-full"
                            />
                        ),
                    },
                ]
            case 'clientes':
                return [
                    { key: 'nombre', header: 'Nombre' },
                    { key: 'apellido', header: 'Apellido' },
                    { key: 'correo_electronico', header: 'Correo Electrónico' },
                    { key: 'numero_de_telefono', header: 'Teléfono' },
                    { key: 'direccion', header: 'Dirección' },
                    { key: 'cedula', header: 'Cédula' },
                    { key: 'edad', header: 'Edad' },
                    { key: 'numero_de_compras', header: 'Número de Compras' },
                    { key: 'descuento', header: 'Descuento' },
                    {
                        key: 'created_at',
                        header: 'Fecha de Creación',
                        format: item =>
                            format(
                                new Date(item.created_at),
                                'dd/MM/yyyy HH:mm:ss',
                            ),
                    },
                ]
            case 'categorias':
                return [
                    { key: 'nombre', header: 'Nombre' },
                    {
                        key: 'created_at',
                        header: 'Fecha de Creación',
                        format: item =>
                            format(
                                new Date(item.created_at),
                                'dd/MM/yyyy HH:mm:ss',
                            ),
                    },
                    {
                        key: 'updated_at',
                        header: 'Última Modificación',
                        format: item =>
                            format(
                                new Date(item.updated_at),
                                'dd/MM/yyyy HH:mm:ss',
                            ),
                    },
                ]
            case 'proveedores':
                return [
                    { key: 'nombre', header: 'Nombre' },
                    { key: 'empresa', header: 'Empresa' },
                    { key: 'telefono', header: 'Teléfono' },
                    { key: 'correo', header: 'Correo' },
                    { key: 'direccion', header: 'Dirección' },
                ]
            case 'usuarios':
                return [
                    { key: 'name', header: 'Nombre' },
                    { key: 'email', header: 'Correo Electrónico' },
                    { key: 'cedula', header: 'Cédula' },
                    { key: 'rol', header: 'Rol' },

                    {
                        key: 'created_at',
                        header: 'Fecha de Creación',
                        format: item =>
                            format(
                                new Date(item.created_at),
                                'dd/MM/yyyy HH:mm:ss',
                            ),
                    },
                ]
            default:
                return []
        }
    }

    const dataToShow = () => {
        switch (selectedType) {
            case 'productos':
                return productsInhabilitados
            case 'clientes':
                return clientesInhabilitados
            case 'categorias':
                return categoriasInhabilitada
            case 'proveedores':
                return proveedoresInhabilitados
            case 'usuarios':
                return usuariosInhabilitados
            default:
                return []
        }
    }

    const handleGuardarCambios = async () => {
        const idsToEnable = dataToShow()
            .filter((_, index) => enabledItems[index])
            .map(item => item.id)

        if (idsToEnable.length === 0) {
            Swal.fire(
                'No se seleccionaron elementos para habilitar.',
                '',
                'info',
            )
            return
        }

        let successCount = 0
        let failureCount = 0

        for (const id of idsToEnable) {
            try {
                if (selectedType === 'productos') {
                    await habilitarProducto(id)
                } else if (selectedType === 'clientes') {
                    await habilitarCliente(id)
                } else if (selectedType === 'categorias') {
                    await habilitarCategoria(id)
                } else if (selectedType === 'proveedores') {
                    await habilitarProveedor(id)
                } else if (selectedType === 'usuarios') {
                    await habilitarUser(id)
                }
                successCount++
            } catch (error) {
                failureCount++
            }
        }

        if (successCount > 0) {
            Swal.fire(
                successCount === 1
                    ? 'Elemento habilitado exitosamente'
                    : 'Elementos habilitados exitosamente',
                '',
                'success',
            )
        }

        if (failureCount > 0) {
            Swal.fire(
                `Error al habilitar ${failureCount} elemento(s).`,
                '',
                'error',
            )
        }
    }

    return (
        <div className="m-6">
            <div className="flex justify-between items-center mb-6">
                <select
                    onChange={handleTypeChange}
                    className="px-4 py-2 bg-gray-200 border rounded-md"
                    value={selectedType}>
                    <option value="productos">Productos</option>
                    <option value="clientes">Clientes</option>
                    <option value="categorias">Categorías</option>
                    <option value="proveedores">Proveedores</option>
                    <option value="usuarios">Usuarios</option>
                </select>
            </div>
            {dataToShow().length === 0 ? (
                <p>No hay registros deshabilitados para {selectedType}.</p>
            ) : (
                <>
                    <InhabilitadosTable
                        data={dataToShow()}
                        columns={getColumnConfig()}
                        onToggleEnable={(id, enabled) => {
                            const index = dataToShow().findIndex(
                                item => item.id === id,
                            )
                            const newEnabledItems = [...enabledItems]
                            newEnabledItems[index] = enabled
                            setEnabledItems(newEnabledItems)
                        }}
                    />
                    <button
                        onClick={handleGuardarCambios}
                        className="mt-4 px-4 py-2 bg-blue-500 hover:bg-blue-700 text-white font-semibold rounded-md shadow">
                        Guardar Cambios
                    </button>
                </>
            )}
        </div>
    )
}

export default Page
