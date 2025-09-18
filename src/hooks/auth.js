// hooks/useAuth.js
'use client'

import useSWR from 'swr'
import api from '@/lib/apiToken'
import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Swal from 'sweetalert2'

const fetcher = url => api.get(url).then(res => res.data)

export const useAuth = ({ middleware, redirectIfAuthenticated } = {}) => {
  const router = useRouter()
  const params = useParams()

  // Estado para no disparar SWR antes de leer el token
  const [ready, setReady] = useState(false)
  const [token, setToken] = useState(null)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const t = localStorage.getItem('token')
      setToken(t)
      setReady(true)
    }
  }, [])

  // --- Usuario actual (solo si hay token)
  const { data: user, error, mutate } = useSWR(
    ready && token ? '/api/user' : null,
    fetcher,
    { shouldRetryOnError: false, revalidateOnFocus: false }
  )

  // --- Listado de usuarios (solo si hay user)
  const { data: users, error: usersError, mutate: mutateUsers } = useSWR(
    user ? '/api/users' : null,
    fetcher,
    { shouldRetryOnError: false, revalidateOnFocus: false }
  )

  // --- Usuarios inhabilitados (solo si hay user)
  const {
    data: usuariosInhabilitados,
    error: errorInhabilitado,
  } = useSWR(
    user ? '/api/usuarios/inhabilitados' : null,
    fetcher,
    { shouldRetryOnError: false, revalidateOnFocus: false }
  )

  // ==========================
  //  AUTENTICACIÓN CON TOKEN
  // ==========================
  const loginToken = async ({ email, password, setErrors, setStatus }) => {
    setErrors?.([])
    setStatus?.(null)
    try {
      const { data } = await api.post('/api/login-token', { email, password })
      localStorage.setItem('token', data.token)
      setToken(data.token)      // habilita SWR /api/user
      await mutate()            // revalida usuario
      return data
    } catch (error) {
      const status = error?.response?.status
      setStatus?.(error?.response?.data?.message || 'Error')
      if (status === 422) setErrors?.(error?.response?.data?.errors || {})
      throw error
    }
  }

  const logoutToken = async () => {
    try { await api.post('/api/logout-token') } catch (_) {}
    localStorage.removeItem('token')
    setToken(null)
    await mutate(null, false) // limpia cache /api/user
    router.push('/login')
  }

  // ==========================
  //  ACCIONES API (todas via Bearer)
  // ==========================
  const registerUser = async ({ setErrors, ...props }) => {
    setErrors?.([])
    try {
      const response = await api.post('/api/register', props)
      mutateUsers()
      if (response.status === 200 || response.status === 201) {
        Swal.fire('Usuario Registrado', '', 'success')
      }
      return response
    } catch (error) {
      Swal.fire('Error al registrar usuario', '', 'error')
      setErrors?.(error?.response?.data?.errors || {})
      if (error?.response?.status !== 422) throw error
    }
  }

  const habilitarUser = async id => {
    try {
      const response = await api.put(`/api/usuarios/habilitar/${id}`)
      if (response.status === 200 || response.status === 201) {
        mutateUsers()
        return true
      }
      return false
    } catch (error) {
      console.error('Error al habilitar usuario', error)
      return false
    }
  }

  const editUser = async (userId, data) => {
    try {
      const response = await api.put(`/api/users/${userId}`, data)
      mutateUsers()
      if (response.status === 200 || response.status === 201) {
        Swal.fire('Usuario Actualizado', '', 'success')
      }
      return response
    } catch (error) {
      Swal.fire('Error al actualizar usuario', '', 'error')
      throw error
    }
  }

  const deleteUser = async userId => {
    try {
      await api.put(`/api/users/borrar/${userId}`)
      mutateUsers()
      Swal.fire('Usuario Eliminado', '', 'success')
    } catch (error) {
      Swal.fire('Error al eliminar usuario', '', 'error')
      throw error
    }
  }

  // ==========================
  //  HELPERS
  // ==========================
  const hasPermission = (userObj, permission) => {
    if (!userObj || !userObj.permissions) return false
    let userPermissions = userObj.permissions
    if (typeof userPermissions === 'string') {
      try { userPermissions = JSON.parse(userPermissions) } catch { return false }
    }
    return !!userPermissions?.[permission]
  }

  // Redirecciones por middleware
  useEffect(() => {
    if (middleware === 'guest' && redirectIfAuthenticated && user) {
      router.push(redirectIfAuthenticated)
    }
    if (typeof window !== 'undefined' &&
        window.location.pathname === '/verify-email' &&
        user?.email_verified_at) {
      router.push(redirectIfAuthenticated)
    }
    const status = error?.status || error?.response?.status
    if (middleware === 'auth' && status === 401) {
      router.push('/login')
    }
  }, [user, error, middleware, redirectIfAuthenticated, router])

  return {
    // datos
    user,
    users,
    usuariosInhabilitados,
    usersError,
    errorInhabilitado,

    // auth (tokens)
    loginToken,
    logoutToken,

    // acciones
    registerUser,
    editUser,
    deleteUser,
    habilitarUser,
    mutateUsers,

    // helpers
    hasPermission,
  }
}
