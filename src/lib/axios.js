// lib/axios.js
import Axios from 'axios';

const axios = Axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_URL, // https://api.gcode-sytem.com
  withCredentials: true,
  headers: { Accept: 'application/json', 'X-Requested-With': 'XMLHttpRequest' },
});

// Nombres que usa Laravel Sanctum
axios.defaults.xsrfCookieName = 'XSRF-TOKEN';
axios.defaults.xsrfHeaderName = 'X-XSRF-TOKEN';

// Leer cookie y poner SIEMPRE el header (porque es cross-site entre subdominios)
function getCookie(name) {
  const m = typeof document !== 'undefined'
    ? document.cookie.match(new RegExp('(^|; )' + name + '=([^;]*)'))
    : null;
  return m ? decodeURIComponent(m[2]) : null;
}

axios.interceptors.request.use((config) => {
  const token = getCookie('XSRF-TOKEN');
  if (token) {
    config.headers['X-XSRF-TOKEN'] = token; // <- clave para evitar 419
  }
  return config;
});

export default axios;
