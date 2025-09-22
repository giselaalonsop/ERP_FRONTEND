// lib/axios.js
import Axios from 'axios'
const axios = Axios.create({
  baseURL: 'https://api.gcode-sytem.com',
  withCredentials: true,
  headers: { Accept: 'application/json', 'X-Requested-With': 'XMLHttpRequest' },
})
axios.defaults.xsrfCookieName = 'XSRF-TOKEN'
axios.defaults.xsrfHeaderName = 'X-XSRF-TOKEN'
export default axios
