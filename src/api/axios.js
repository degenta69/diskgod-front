import axios from 'axios'
import jwt_decode from 'jwt-decode'
import dayjs from 'dayjs'

// axios.defaults.baseURL = 'http://localhost:6453';
axios.defaults.baseURL = process.env.REACT_APP_BASE_URL
// axios.defaults.headers.common['Access-Control-Allow-Origin'] = 'http://localhost:3000';

var authTokens = localStorage.getItem('diskGodUserToken')
  ? JSON.parse(localStorage.getItem('diskGodUserToken'))
  : null

const instance = axios.create({
  baseURL: process.env.REACT_APP_BASE_URL,
  headers: {
    Authorization: `Bearer ${authTokens?.access}`
  },
})

// interceptor for refreshing the access token
instance.interceptors.request.use(async req => {
  // checks if the token is there, if not then adds it in the storage and header
  const storageToken = localStorage.getItem('diskGodUserToken')
  const authTokens = storageToken ? JSON.parse(storageToken) : null

  if (authTokens?.access) {
    req.headers.Authorization = `Bearer ${authTokens.access}`

    // Optional: Token Expiry Check & Refresh Logic
    const decoded_token = jwt_decode(authTokens.access)
    const isExpired = dayjs.unix(decoded_token.exp).diff(dayjs()) < 1

    if (isExpired && authTokens.refresh) {
      try {
        // console.log("Refreshing token...")
        const res = await axios.post(`${process.env.REACT_APP_BASE_URL}/account/login/refresh`, {
          refresh: authTokens.refresh
        })

        const newAccessToken = res.data.access
        authTokens.access = newAccessToken
        localStorage.setItem('diskGodUserToken', JSON.stringify(authTokens))
        req.headers.Authorization = `Bearer ${newAccessToken}`
      } catch (err) {
        console.log("Token Refresh Failed", err)
        // potentially logout user here?
      }
    }
  }
  return req
})

export default instance