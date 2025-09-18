// lib/apiToken.js
import Axios from 'axios'

const api = Axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_URL,
  headers: { Accept: 'application/json' },
})

// Interceptor: añade Authorization si hay token
api.interceptors.request.use(cfg => {
  const t = typeof window !== 'undefined' ? localStorage.getItem('token') : null
  if (t) cfg.headers.Authorization = `Bearer ${t}`
  return cfg
})

export default api
