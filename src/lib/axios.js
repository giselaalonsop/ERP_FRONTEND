// lib/axios.js
import Axios from 'axios'

const axios = Axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_URL, // ej. https://erp...railway.app
  withCredentials: true,
  withXSRFToken: true, // ok en axios >=1.6
  headers: {
    'Accept': 'application/json',
    'X-Requested-With': 'XMLHttpRequest',
  },
})

// Nombres por defecto de Laravel Sanctum (los pongo explícitos)
axios.defaults.xsrfCookieName = 'XSRF-TOKEN'
axios.defaults.xsrfHeaderName = 'X-XSRF-TOKEN'

export default axios
