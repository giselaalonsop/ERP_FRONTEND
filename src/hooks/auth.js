import useSWR from 'swr'
import axios from '@/lib/axios'
import { useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Swal from 'sweetalert2'

export const useAuth = ({ middleware, redirectIfAuthenticated } = {}) => {
  const router = useRouter()
  const params = useParams()

   
  const { data: user, error, mutate } = useSWR('/api/user', () =>
    axios
      .get('/api/user')
      .then(res => res.data)
      .catch(error => {
        if (error.response.status !== 409) throw error

        router.push('/verify-email')
      }),
  )

  const { data: users, error: usersError, mutate: mutateUsers } = useSWR('/api/users', () =>
    axios
      .get('/api/users')
      .then(res => res.data)
      .catch(error => {
        if (error.response.status === 401) {
          router.push('/login')
        }
        throw error
      }),
  )

  const csrf = () => axios.get('/sanctum/csrf-cookie')

  const register = async ({ setErrors, ...props }) => {
    setErrors([])
    try {
      const response = await axios.post('/register', props)
      mutate()
      if (response.status === 200 || response.status === 201) {
        Swal.fire("Usuario Registrado", "", "success")
        return response
      }
    } catch (error) {
      Swal.fire("Error al registrar usuario", "", "error")
      setErrors(error.response.data.errors)
      if (error.response.status !== 422) {
        throw error
      }
    }
  }

  const registerUser = async ({ setErrors, ...props }) => {
    await csrf()

    setErrors([])

    try {
      const response = await axios.post('/api/register', props)
      mutateUsers()
      if (response.status === 200 || response.status === 201) {
        Swal.fire("Usuario Registrado", "", "success")
        return response
      }
    } catch (error) {
      Swal.fire("Error al registrar usuario", "", "error")
      setErrors(error.response.data.errors)
      if (error.response.status !== 422) {
        throw error
      }
    }
  }

  

  
  const login = async ({ setErrors, setStatus, ...props }) => {
    await csrf()

    setErrors([])
    setStatus(null)

    axios
        .post('/login', props)
        .then(() => mutate())
        .catch(error => {
            if (error.response.status !== 422) throw error

            setErrors(error.response.data.errors)
        })
}

  const forgotPassword = async ({ setErrors, setStatus, email }) => {
    await csrf()

    setErrors([])
    setStatus(null)

    try {
      const response = await axios.post('/forgot-password', { email })
      setStatus(response.data.status)
    } catch (error) {
      if (error.response.status !== 422) throw error

      setErrors(error.response.data.errors)
    }
  }

  const resetPassword = async ({ setErrors, setStatus, ...props }) => {
    await csrf()

    setErrors([])
    setStatus(null)

    try {
      const response = await axios.post('/reset-password', { token: params.token, ...props })
      router.push('/login?reset=' + btoa(response.data.status))
    } catch (error) {
      if (error.response.status !== 422) throw error

      setErrors(error.response.data.errors)
    }
  }

  const resendEmailVerification = ({ setStatus }) => {
    axios.post('/email/verification-notification')
      .then(response => setStatus(response.data.status))
  }

  const logout = async () => {
    if (!error) {
      await axios.post('/logout').then(() => mutate())
    }

    window.location.pathname = '/login'
  }
  const editUser = async (userId, data) => {
    await csrf()
    try {
      const response = await axios.put(`/api/users/${userId}`, data)
      mutateUsers()
      if (response.status === 200 || response.status === 201) {
        Swal.fire("Usuario Actualizado", "", "success")
        return response
      }
    } catch (error) {
      Swal.fire("Error al actualizar usuario", "", "error")
      throw error
    }
  }

  const deleteUser = async (userId) => {
    await csrf()
    try {
      await axios.delete(`/api/users/${userId}`)
      mutateUsers()
      Swal.fire("Usuario Eliminado", "", "success")
    } catch (error) {
      Swal.fire("Error al eliminar usuario", "", "error")
      throw error
    }
  }
  const hasPermission = (permission) => {
    if (!user || !user.permissions) return false

    const userPermissions = typeof user.permissions === 'string' ? JSON.parse(user.permissions) : user.permissions

    return userPermissions[permission]
  }

  useEffect(() => {
    if (middleware === 'guest' && redirectIfAuthenticated && user)
      router.push(redirectIfAuthenticated)
    if (
      window.location.pathname === '/verify-email' &&
      user?.email_verified_at
    )
      router.push(redirectIfAuthenticated)
    if (middleware === 'auth' && error) logout()
  }, [user, error])

  return {
    user,
    users,
    register,
    login,
    forgotPassword,
    resetPassword,
    resendEmailVerification,
    logout,
    usersError,
    mutateUsers,
    registerUser,
    editUser,
    deleteUser,
    hasPermission,
  }
}
