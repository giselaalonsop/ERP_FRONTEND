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

    return {
        ventas,
        ventaDetalles,
        ventasError,
        ventaDetallesError,
        addVenta,
        addVentaDetalle
    }
}
