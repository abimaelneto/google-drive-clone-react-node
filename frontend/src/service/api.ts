import axios, { AxiosInstance, AxiosError } from 'axios'

const createBaseApi = () =>
  axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    withCredentials: true,
  })

export class API {
  private static _public: AxiosInstance
  private static _private: AxiosInstance
  static token: string
  static cookies: string

  public static get public() {
    if (!API._public) {
      API._public = createBaseApi()
    }

    return API._public
  }
  public static get private() {
    if (!API._private) {
      API._private = createBaseApi()
      API._private.interceptors.response.use(
        (r) => r,
        (err: AxiosError) => {
          if (err.response?.status == 401) {
            return (window.location.href = '/login')
          }
          return err
        }
      )
    }
    return API._private
  }
  static setupPrivateApi(token?: string, cookies?: string) {
    if (token) API.token = token
    if (cookies) API.cookies = cookies
  }
}
