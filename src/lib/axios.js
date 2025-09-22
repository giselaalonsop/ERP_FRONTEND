// lib/axios.js
import Axios from 'axios'
const axios = Axios.create({
  baseURL: NEXT_PUBLIC_BACKEND_URL,
  withCredentials: true,
  headers: { Accept: 'application/json', 'X-Requested-With': 'XMLHttpRequest' },
})
axios.defaults.xsrfCookieName = 'XSRF-TOKEN'
axios.defaults.xsrfHeaderName = 'X-XSRF-TOKEN'
export default axios
