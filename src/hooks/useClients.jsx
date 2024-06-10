// hooks/useClientes.js
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
            if (response.status === 200 || response.status === 201) {
                Swal.fire('Cliente Registrado', '', 'success')
                return response
            }
        } catch (error) {
            Swal.fire('Error al registrar cliente', '', 'error')
            throw error
        }
    }

    return {
        clientes,
        clientesError,
        addCliente,
        mutateClientes,
    }
}
