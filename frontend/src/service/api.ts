import axios, { AxiosInstance } from 'axios'

const createBaseApi = () =>
  axios.create({
    baseURL: import.meta.env.VITE_API_URL,
  })

export class API {
  private static _public: AxiosInstance
  private static _private: AxiosInstance
  private static token: string

  public static get public() {
    if (!API._public) {
      console.log(import.meta.env.VITE_API_URL)
      API._public = createBaseApi()
    }
    return API._public
  }
  public static get private() {
    if (!API._private) {
      API._private = createBaseApi()
    }
    return API._private
  }
  static setupPrivateApi(token: string) {
    API.token = token
    API._private.interceptors.request.use(async (config) => {
      config.headers.Authorization = API.token
      return config
    })
  }
}
