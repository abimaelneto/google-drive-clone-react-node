import { API } from '../../../service/api'

export class AuthService {
  static async login({ email, password }: { email: string; password: string }) {
    return await API.public.post('/auth/login', { email, password })
  }
  static async signUp({
    name,
    email,
    password,
  }: {
    name: string
    email: string
    password: string
  }) {
    return await API.public.post('/auth/signup', { name, email, password })
  }
  static async me() {
    return await API.private.get('/auth/me')
  }
  static async signOut() {
    return await API.private.get('/auth/signout')
  }
}
