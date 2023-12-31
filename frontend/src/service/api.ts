import axios, { AxiosInstance } from 'axios'

const createBaseApi = () =>
  axios.create({
    baseURL: import.meta.env.VITE_API_URL,
  })

export class API {
  private static _public: AxiosInstance
  private static _private: AxiosInstance
  static token: string

  public static get public() {
    if (!API._public) {
      API._public = createBaseApi()
    }

    return API._public
  }
  public static get private() {
    if (!API._private) {
      API._private = createBaseApi()
      API._private.interceptors.request.use(async (config) => {
        console.log(API.token)
        config.headers.Authorization = `Bearer ${API.token}`
        return config
      })
    }
    return API._private
  }
  static setupPrivateApi(token: string) {
    API.token = token
    console.log(token)
  }
}
