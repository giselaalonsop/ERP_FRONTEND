import useSWR from 'swr'
import axios from '@/lib/axios'
import { useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Swal from 'sweetalert2'
const fetcher = url => axios.get(url).then(res => res.data);
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
        
        throw error
      }),
  )

  const csrf = () => axios.get('/sanctum/csrf-cookie')

  const register = async ({ setErrors, ...props }) => {
    setErrors([])
    try {
      const response = await axios.post('/register', props)
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
    const {
      data: usuariosInhabilitados,
      error: errorInhabilitado,
  
  } = useSWR('/api/usuarios/inhabilitados', fetcher)
    

  
  const habilitarUser = async id => {
    await csrf()

    try {
        const response = await axios.put(`/api/usuarios/habilitar/${id}`)
        if (response.status === 200 || response.status === 201) {
          mutateUsers()
            return true // Indica éxito
        } else {
            console.error('Error al habilitar el usuario')
            return false // Indica fallo
        }
    } catch (error) {
        console.error('Error al habilitar el usuario', error)
        return false // Indica fallo
    }
}
  
const login = async ({ email, password, remember, setErrors, setStatus }) => {
  setErrors([]); // Limpiar errores anteriores
  setStatus(null); // Limpiar status anterior

  try {
      await csrf(); // Asegura que el token CSRF está disponible

      const response = await axios.post('/login', {
          email,
          password,
          remember,
      });

      // Si la autenticación es exitosa, podrías manejar aquí la redirección o mutar el estado global del usuario
      mutate(); // Supongo que esta función actualiza algún estado global relacionado con el usuario autenticado

      // Opcional: manejar respuesta del servidor después de un login exitoso
      return response;

  } catch (error) {
    console.log(error.response.status)
    console.log(error.response.data)

      if (error.response) {
      
          setStatus(error.response.data.message);
        

       
          
      }
  }
};


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
      await axios.put(`/api/users/borrar/${userId}`)
      mutateUsers()
      Swal.fire("Usuario Eliminado", "", "success")
    } catch (error) {
      Swal.fire("Error al eliminar usuario", "", "error")
      throw error
    }
  }
  const hasPermission = (user, permission) => {
    if (!user || !user.permissions) return false;

    // Intenta parsear si es string, maneja cualquier error silenciosamente
    let userPermissions;
    if (typeof user.permissions === 'string') {
        try {
            userPermissions = JSON.parse(user.permissions);
        } catch (e) {
            console.error("Error parsing permissions: ", e);
            return false;
        }
    } else {
        userPermissions = user.permissions;
    }

    return !!userPermissions[permission];
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
    habilitarUser,
    usuariosInhabilitados,
    errorInhabilitado,

  }
}
