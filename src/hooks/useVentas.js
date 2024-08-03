// hooks/useVentas.js

import useSWR from 'swr'
import axios from '@/lib/axios'
import Swal from 'sweetalert2'

export const useVentas = () => {
    const { data: ventas, error: ventasError, mutate: mutateVentas } = useSWR('/api/ventas', () =>
        axios
            .get('/api/ventas')
            .then(res => res.data)
            .catch(error => {
                if (error.response.status === 401) {
                    router.push('/login')
                }
                throw error
            }),
    )
    const { data: ventasPendientes, error: ventasPendientesError, mutate: mutateVentasPendientes } = useSWR('/api/ventas-pendientes', () =>
        axios
            .get('/api/ventas-pendientes')
            .then(res => res.data)
            .catch(error => {
                if (error.response.status === 401) {
                    router.push('/login')
                }
                throw error
            }),
    )
    

    const { data: ventaDetalles, error: ventaDetallesError, mutate: mutateVentaDetalles } = useSWR('/api/venta-detalles', () =>
        axios
            .get('/api/venta-detalles')
            .then(res => res.data)
            .catch(error => {
                if (error.response.status === 401) {
                    router.push('/login')
                }
                throw error
            }),
    )

    const csrf = () => axios.get('/sanctum/csrf-cookie')

    const addVenta = async (data) => {
        await csrf()

        try {
            const response = await axios.post('/api/ventas', data)
            mutateVentas()
            if (response.status === 200 || response.status === 201) {
                Swal.fire("Venta Registrada", "", "success")
                return response
            }
        } catch (error) {
            Swal.fire("Error al registrar venta", "", "error")
            throw error
        }
    }

    const addVentaDetalle = async (data) => {
        await csrf()

        try {
            const response = await axios.post('/api/venta-detalles', data)
            mutateVentaDetalles()
            if (response.status === 200 || response.status === 201) {
                Swal.fire("Detalle de Venta Registrado", "", "success")
                return response
            }
        } catch (error) {
            Swal.fire("Error al registrar detalle de venta", "", "error")
            throw error
        }
    }
    const getVentaDetalles = async (id) => {
        await csrf()

        try {
            const response = await axios.get(`/api/ventas/${id}`)
            return response.data
        } catch (error) {
            Swal.fire("Error al obtener detalles de la venta", "", "error")
            throw error
        }
    }

    const deleteVenta = async (id) => {
        await csrf()

        try {
            const response = await axios.delete(`/api/ventas/${id}`)
            mutateVentas()
            if (response.status === 204) {
                Swal.fire('Venta Anulada', '', 'success')
            }
        } catch (error) {
            Swal.fire('Error al anular la venta', '', 'error')
            throw error
        }
    }
     const updateVenta = async (id, data) => {
        await csrf()

        try {
            const response = await axios.put(`/api/ventas/${id}`, data)
            mutateVentas()
            mutateVentasPendientes()
            if (response.status === 200) {
                Swal.fire('Venta Actualizada', '', 'success')
            }
        } catch (error) {
            Swal.fire('Error al actualizar venta', '', 'error')
            throw error
        }
    }

    return {
        ventas,
        ventaDetalles,
        ventasError,
        ventasPendientes,
        ventasPendientesError,
        ventaDetallesError,
        addVenta,
        addVentaDetalle,
        getVentaDetalles,
        deleteVenta,
        updateVenta,
        mutateVentasPendientes,
    }
}
