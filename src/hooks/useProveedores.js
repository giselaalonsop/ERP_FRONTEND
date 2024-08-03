import useSWR from 'swr'
import axios from '@/lib/axios'
import Swal from 'sweetalert2'
const fetcher = url => axios.get(url).then(res => res.data);
export const useProveedores = () => {
    const {
        data: proveedores,
        error: proveedoresError,
        mutate: mutateProveedores,
    } = useSWR('/api/proveedores', () =>
        axios
            .get('/api/proveedores')
            .then(res => res.data)
            .catch(error => {
                
                throw error
            }),
    )
    const {data: proveedoresInhabilitados, error: proveedoresInhabilitadosError} = useSWR('/api/proveedores/inhabilitados', fetcher)
    const csrf = () => axios.get('/sanctum/csrf-cookie')
    const habilitarProveedor = async id => {
        await csrf()
    
        try {
            const response = await axios.put(`/api/proveedor/habilitar/${id}`)
            if (response.status === 200 || response.status === 201) {
                mutateProveedores()
                return true // Indica éxito
            } else {
                console.error('Error al habilitar el proveedor')
                return false // Indica fallo
            }
        } catch (error) {
            console.error('Error al habilitar el proveedor', error)
            return false // Indica fallo
        }
    }
    const addProveedor = async data => {
        await csrf()
        try {
            const response = await axios.post('/api/proveedores', data)
            mutateProveedores()
            if (response.status === 201 || response.status === 200) {
                return response
            } else {
                throw new Error('Error al registrar proveedor')
            }
        } catch (error) {
            if (error.response) {
                return error.response
            } else {
                throw new Error('Error al registrar proveedor')
            }
        }
    }

    const updateProveedor = async (id, data) => {
        await csrf()

        try {
            const response = await axios.put(`/api/proveedores/${id}`, data)
            mutateProveedores()
            if (response.status === 200 || response.status === 201) {
                Swal.fire('Proveedor Actualizado', '', 'success')
                return response
            }
        } catch (error) {
            Swal.fire('Error al actualizar proveedor', '', 'error')
            throw error
        }
    }

    const deleteProveedor = async id => {
        await csrf()
        try {
            const response = await axios.delete(`/api/proveedores/${id}`)
            mutateProveedores()
            return response
        } catch (error) {
            throw error
        }
    }


    return {
        proveedores,
        proveedoresError,
        addProveedor,
        updateProveedor,
        deleteProveedor,
        mutateProveedores,
        proveedoresInhabilitados,
        proveedoresInhabilitadosError, 
        habilitarProveedor

    }
}
