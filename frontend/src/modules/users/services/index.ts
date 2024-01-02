import { User } from '@/types/user'
import { API } from '../../../service/api'

export class UsersService {
  static async list() {
    return await API.private.get('/users/')
  }
  static async get(userId: string) {
    return await API.private.get(`/users/${userId}`)
  }

  static async create(payload: Partial<User>) {
    return await API.private.post('/users', payload)
  }
  static async update(userId: string, payload: Partial<User>) {
    return await API.private.patch(`/users/${userId}`, payload)
  }
  static async delete(userId: string) {
    return await API.private.delete(`/users/${userId}`)
  }
}
