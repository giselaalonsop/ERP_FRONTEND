import useSWR from 'swr'
import axios from '@/lib/axios'
import Swal from 'sweetalert2'

export const useClientes = () => {
    const {
        data: clientes,
        error: clientesError,
        mutate: mutateClientes,
    } = useSWR('/api/clientes', () =>
        axios
            .get('/api/clientes')
            .then(res => res.data)
            .catch(error => {
                if (error.response.status === 401) {
                    router.push('/login')
                }
                throw error
            }),
    )

    const csrf = () => axios.get('/sanctum/csrf-cookie')

    const addCliente = async data => {
        await csrf()
        try {
            const response = await axios.post('/api/clientes', data)
            mutateClientes()
            if (response.status === 201 || response.status === 200) {
                return response
            } else {
                throw new Error('Error al registrar cliente')
            }
        } catch (error) {
            if (error.response) {
                return error.response
            } else {
                throw new Error('Error al registrar cliente')
            }
        }
    }

    const updateCliente = async (id, data) => {
        await csrf()

        try {
            const response = await axios.put(`/api/clientes/${id}`, data)
            mutateClientes()
            if (response.status === 200 || response.status === 201) {
                Swal.fire('Cliente Actualizado', '', 'success')
                return response
            }
        } catch (error) {
            Swal.fire('Error al actualizar cliente', '', 'error')
            throw error
        }
    }

    const deleteClient = async id => {
        await csrf()

        try {
            const response = await axios.delete(`/api/clientes/${id}`)
            mutateClientes()
            if (response.status === 204) {
                Swal.fire('Cliente Eliminado', '', 'success')
            }
        } catch (error) {
            Swal.fire('Error al eliminar cliente', '', 'error')
            throw error
        }
    }
    const getHistorialCompras = async cedula => {
        try {
            const response = await axios.get(
                `/api/clientes/${cedula}/historial`,
            )
            return response.data
        } catch (error) {
            Swal.fire(
                'Error',
                'No se pudo cargar el historial de compras',
                'error',
            )
            throw error
        }
    }
    const getUltimaCompra = async cedula => {
        try {
            const response = await axios.get(
                `/api/clientes/${cedula}/ultimaCompra`,
            )
            const historial = response.data.fecha
            return historial
        } catch (error) {
            return 'N/A'
        }
    }

    return {
        clientes,
        clientesError,
        addCliente,
        updateCliente,
        deleteClient,
        mutateClientes,
        getHistorialCompras,
        getUltimaCompra,
    }
}
