import axios from 'axios'
import jwt_decode from 'jwt-decode'
import dayjs from 'dayjs'

axios.defaults.baseURL = ``

// axios.defaults.headers.common['Access-Control-Allow-Origin'] = 'http://localhost:3000';

var authTokens = localStorage.getItem('diskGodUserToken')
  ? JSON.parse(localStorage.getItem('diskGodUserToken'))
  : null

const instance = axios.create({
  baseURL: ``,
  headers: {
    Authorization: `Bearer ${authTokens?.access}`
  },
})

// interceptor for refreshing the access token
if (localStorage.getItem('diskGodUserToken')) {
  instance.interceptors.request.use(req => {
    //checks if the token is there, if not then adds it in the storage and header
    var authToken = localStorage.getItem('diskGodUserToken')
      ? JSON.parse(localStorage.getItem('diskGodUserToken'))
      : null

    //decodes the jwt access token to get the expiration date then compares it with current date and time
    const decoded_token = jwt_decode(authTokens.access)
    const isExpired = dayjs.unix(decoded_token.exp).diff(dayjs()) < 1

    //if the access token is expired
    //another req is made which gives new access token using the refresh token
    if (isExpired) {
      // console.log(
      //   'isExpired:',
      //   isExpired,
      //   'decoded_token:',
      //   decoded_token,
      //   'authToken:',
      //   authToken,
      //   'authtokens:',
      //   authTokens
      // )

      try {
        axios
          .post('/account/login/refresh', {
            refresh: authTokens.refresh?authTokens.refresh:authToken.refresh
          })
          .then(res => {
            // console.log(res)
            let accessToken = res.data.access
            authTokens.access = accessToken
            // then adds new access token to the storage(automatically to the authAtom too) and headers
            let stringTokens=JSON.stringify(authTokens)
            localStorage.setItem('diskGodUserToken', stringTokens)
            // console.log('isExpired:', isExpired, res, 'authTokens:',authTokens,'NewaccesToken:',accessToken)
          })
          .catch(err => {
            // alert(err)
            console.log(err)
          })
        } catch (error) {
          // alert(error.message)
          console.log(error)
        }
      }
      req.headers.Authorization = `Bearer ${authTokens.access}`
    return req
  })
}

export default instance