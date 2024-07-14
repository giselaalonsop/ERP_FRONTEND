import axios from '@/lib/axios'
import Swal from 'sweetalert2'

export const useCaja = () => {
    const csrf = () => axios.get('/sanctum/csrf-cookie')

    const registrarVentaEnCaja = async dataCaja => {
        await csrf()
        try {
            const response = await axios.post(
                '/api/cierre-de-caja/registrar-venta',
                dataCaja,
            )
            return response.data
        } catch (error) {
            console.error('Error al registrar venta en caja', error)
            throw error
        }
    }

    const obtenerCierreDeCaja = async ubicacion => {
        await csrf()
        try {
            const response = await axios.get(`/api/cierre-de-caja/${ubicacion}`)
            return response.data
        } catch (error) {
            console.error('Error al obtener cierre de caja', error)
            throw error
        }
    }

    const cerrarCaja = async ubicacion => {
        await csrf()
        try {
            const response = await axios.post(
                `/api/cierre-de-caja/cerrar/${ubicacion}`,
            )
            return response.data
        } catch (error) {
            console.error('Error al cerrar caja', error)
            throw error
        }
    }

    return {
        registrarVentaEnCaja,
        obtenerCierreDeCaja,
        cerrarCaja,
    }
}
