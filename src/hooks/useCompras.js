import useSWR from 'swr'
import axios from '@/lib/axios'
import Swal from 'sweetalert2'

export const useCompras = () => {
    const {
        data: compras,
        error: comprasError,
        mutate: mutateCompras,
    } = useSWR('/api/compras', () =>
        axios
            .get('/api/compras')
            .then(res => res.data)
            .catch(error => {
                if (error.response.status === 401) {
                    router.push('/login')
                }
                throw error
            }),
    )

    const { data: proveedores } = useSWR('/api/proveedores', () =>
        axios.get('/api/proveedores').then(res => res.data),
    )

    const csrf = () => axios.get('/sanctum/csrf-cookie')

    const addCompra = async data => {
        await csrf()
        try {
            const response = await axios.post('/api/compras', data)
            mutateCompras()
          
                return response
            
        } catch (error) {
            if (error.response) {
                return error.response
            } else {
                throw new Error('Error al registrar compra')
            }
        }
    }

    const updateCompra = async (id, data) => {
        await csrf()

        try {
            const response = await axios.put(`/api/compras/${id}`, data)
            mutateCompras()
      
                return response
            
        } catch (error) {
            Swal.fire('Error al actualizar compra', '', 'error')
            throw error
        }
    }

    const deleteCompra = async id => {
        await csrf()

        try {
            const response = await axios.delete(`/api/compras/${id}`)
            mutateCompras()
            if (response.status === 204) {
                Swal.fire('Compra Eliminada', '', 'success')
            }
        } catch (error) {
            Swal.fire('Error al eliminar compra', '', 'error')
            throw error
        }
    }

    const abonarCompra = async (id, monto) => {
        await csrf()

        try {
            const response = await axios.post(`/api/compras/${id}/abonar`, { monto })
            mutateCompras()
            if (response.status === 200) {
                Swal.fire('Monto Abonado', '', 'success')
                return response
            }
        } catch (error) {
            Swal.fire('Error al abonar monto', '', 'error')
            throw error
        }
    }

    return {
        compras,
        comprasError,
        addCompra,
        updateCompra,
        deleteCompra,
        abonarCompra,
        mutateCompras,
        proveedores,
    }
}
