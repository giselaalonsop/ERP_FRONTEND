import useSWR from 'swr'
import axios from '@/lib/axios'
import Swal from 'sweetalert2'
 
export const useLogs = () => {
    const { data: logs, error: logsError, mutate: mutateLogs } = useSWR('/api/logs', () =>
        axios
            .get('/api/logs')
            .then(res => res.data)
            .catch(error => {
                if (error.response.status === 401) {
                    router.push('/login')
                }
                throw error
            }),
    )
    
    return { logs, logsError, mutateLogs }
}
