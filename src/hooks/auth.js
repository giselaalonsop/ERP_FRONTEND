import useSWR from 'swr';
import axios from '@/lib/axios';
import { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Swal from 'sweetalert2';

const fetcher = url => axios.get(url).then(res => res.data);

export const useAuth = ({ middleware, redirectIfAuthenticated } = {}) => {
  const router = useRouter();
  const params = useParams();

  const csrf = () => axios.get('/sanctum/csrf-cookie');

  // Usuario actual
  const { data: user, error, mutate } = useSWR('/api/user', fetcher, {
    shouldRetryOnError: false,
    revalidateOnFocus: false,
  });

  // Usuarios (solo si autenticado)
  const {
    data: users,
    error: usersError,
    mutate: mutateUsers,
  } = useSWR(user ? '/api/users' : null, fetcher, {
    shouldRetryOnError: false,
    revalidateOnFocus: false,
  });

  // Usuarios inhabilitados (solo si autenticado)
  const {
    data: usuariosInhabilitados,
    error: errorInhabilitado,
  } = useSWR(user ? '/api/usuarios/inhabilitados' : null, fetcher, {
    shouldRetryOnError: false,
    revalidateOnFocus: false,
  });

  const register = async ({ setErrors, ...props }) => {
    await csrf();
    setErrors([]);
    try {
      const response = await axios.post('/register', props);
      mutateUsers();
      if (response.status === 200 || response.status === 201) {
        Swal.fire('Usuario Registrado', '', 'success');
      }
      return response;
    } catch (error) {
      Swal.fire('Error al registrar usuario', '', 'error');
      setErrors(error?.response?.data?.errors || {});
      if (error?.response?.status !== 422) throw error;
    }
  };

  const registerUser = async ({ setErrors, ...props }) => {
    await csrf();
    setErrors([]);
    try {
      const response = await axios.post('/api/register', props);
      mutateUsers();
      if (response.status === 200 || response.status === 201) {
        Swal.fire('Usuario Registrado', '', 'success');
      }
      return response;
    } catch (error) {
      Swal.fire('Error al registrar usuario', '', 'error');
      setErrors(error?.response?.data?.errors || {});
      if (error?.response?.status !== 422) throw error;
    }
  };

  const habilitarUser = async id => {
    await csrf();
    try {
      const response = await axios.put(`/api/usuarios/habilitar/${id}`);
      if (response.status === 200 || response.status === 201) {
        mutateUsers();
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error al habilitar el usuario', error);
      return false;
    }
  };

  const login = async ({ email, password, remember, setErrors, setStatus }) => {
  setErrors([]);
  setStatus(null);
  try {
    await axios.get('/sanctum/csrf-cookie');      // 1) setea cookies
    const resp = await axios.post('/login', {     // 2) ahora sí, con X-XSRF-TOKEN
      email, password, remember,
    });
    await mutate();
    return resp;
  } catch (error) {
    const status = error?.response?.status;
    setStatus(error?.response?.data?.message || 'Error');
    if (status === 422) setErrors(error?.response?.data?.errors || {});
    throw error;
  }
};
  const forgotPassword = async ({ setErrors, setStatus, email }) => {
    await csrf();
    setErrors([]);
    setStatus(null);
    try {
      const response = await axios.post('/forgot-password', { email });
      setStatus(response.data.status);
    } catch (error) {
      if (error?.response?.status !== 422) throw error;
      setErrors(error?.response?.data?.errors || {});
    }
  };

  const resetPassword = async ({ setErrors, setStatus, ...props }) => {
    await csrf();
    setErrors([]);
    setStatus(null);
    try {
      const response = await axios.post('/reset-password', {
        token: params?.token,
        ...props,
      });
      router.push('/login?reset=' + btoa(response.data.status));
    } catch (error) {
      if (error?.response?.status !== 422) throw error;
      setErrors(error?.response?.data?.errors || {});
    }
  };

  const resendEmailVerification = async ({ setStatus }) => {
    await csrf();
    const { data } = await axios.post('/email/verification-notification');
    setStatus(data.status);
  };

  const logout = async () => {
    try {
      await axios.post('/logout');
    } finally {
      await mutate(null, false); // limpia cache /api/user
      router.push('/login');
    }
  };

  const editUser = async (userId, data) => {
    await csrf();
    try {
      const response = await axios.put(`/api/users/${userId}`, data);
      mutateUsers();
      if (response.status === 200 || response.status === 201) {
        Swal.fire('Usuario Actualizado', '', 'success');
      }
      return response;
    } catch (error) {
      Swal.fire('Error al actualizar usuario', '', 'error');
      throw error;
    }
  };

  const deleteUser = async userId => {
    await csrf();
    try {
      await axios.put(`/api/users/borrar/${userId}`);
      mutateUsers();
      Swal.fire('Usuario Eliminado', '', 'success');
    } catch (error) {
      Swal.fire('Error al eliminar usuario', '', 'error');
      throw error;
    }
  };

  const hasPermission = (userObj, permission) => {
    if (!userObj || !userObj.permissions) return false;
    let userPermissions = userObj.permissions;
    if (typeof userPermissions === 'string') {
      try {
        userPermissions = JSON.parse(userPermissions);
      } catch {
        return false;
      }
    }
    return !!userPermissions?.[permission];
  };

  useEffect(() => {
    if (middleware === 'guest' && redirectIfAuthenticated && user) {
      router.push(redirectIfAuthenticated);
    }
    if (window.location.pathname === '/verify-email' && user?.email_verified_at) {
      router.push(redirectIfAuthenticated);
    }
    // Evita bucles: solo actúa si realmente es 401
    const status = error?.status || error?.response?.status;
    if (middleware === 'auth' && status === 401) {
      router.push('/login');
    }
  }, [user, error, middleware, redirectIfAuthenticated, router]);

  return {
    user,
    users,
    register,
    registerUser,
    login,
    forgotPassword,
    resetPassword,
    resendEmailVerification,
    logout,
    usersError,
    mutateUsers,
    editUser,
    deleteUser,
    hasPermission,
    habilitarUser,
    usuariosInhabilitados,
    errorInhabilitado,
  };
};
