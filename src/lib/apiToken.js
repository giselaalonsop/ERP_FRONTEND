import Axios from 'axios'

const api = Axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_URL, // p.ej. https://erpbackend-production-b9a5.up.railway.app
  headers: { Accept: 'application/json' },
})

// Añade automáticamente Authorization: Bearer <token> si existe
api.interceptors.request.use(cfg => {
  if (typeof window !== 'undefined') {
    const t = localStorage.getItem('token')
    if (t) cfg.headers.Authorization = `Bearer ${t}`
  }
  return cfg
})

// (Opcional) Si el token expira, limpia y redirige
api.interceptors.response.use(
  r => r,
  err => {
    const status = err?.response?.status
    if (status === 401 && typeof window !== 'undefined') {
      localStorage.removeItem('token')
      // Puedes redirigir aquí si quieres:
      // window.location.href = '/login'
    }
    return Promise.reject(err)
  }
)

export default api
