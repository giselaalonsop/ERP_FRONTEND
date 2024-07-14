import useSWR from 'swr'
import axios from '@/lib/axios'
import Swal from 'sweetalert2'

export const useNumerosDeCuenta = () => {
    const { data: numerosDeCuenta, error: numerosDeCuentaError, mutate: mutateNumerosDeCuenta } = useSWR('/api/numeros-de-cuenta', () =>
        axios
            .get('/api/numeros-de-cuenta')
            .then(res => res.data)
            .catch(error => {
                if (error.response.status === 401) {
                    throw error
                }
            }),
    )

    const addNumeroDeCuenta = async (data) => {
        try {
            const response = await axios.post('/api/numeros-de-cuenta', data)
            mutateNumerosDeCuenta()
            if (response.status === 201) {
                Swal.fire("Número de Cuenta Registrado", "", "success")
                return response
            }
        } catch (error) {
            Swal.fire("Error al registrar número de cuenta", "", "error")
            throw error
        }
    }

    const updateNumeroDeCuenta = async (id, data) => {
        try {
            const response = await axios.put(`/api/numeros-de-cuenta/${id}`, data)
            mutateNumerosDeCuenta()
            if (response.status === 200) {
                Swal.fire("Número de Cuenta Actualizado", "", "success")
                return response
            }
        } catch (error) {
            Swal.fire("Error al actualizar número de cuenta", "", "error")
            throw error
        }
    }

    const deleteNumeroDeCuenta = async (id) => {
        try {
            await axios.delete(`/api/numeros-de-cuenta/${id}`)
            mutateNumerosDeCuenta()
            Swal.fire("Número de Cuenta Eliminado", "", "success")
        } catch (error) {
            Swal.fire("Error al eliminar número de cuenta", "", "error")
            throw error
        }
    }

    return { numerosDeCuenta, numerosDeCuentaError, addNumeroDeCuenta, updateNumeroDeCuenta, deleteNumeroDeCuenta }
}
