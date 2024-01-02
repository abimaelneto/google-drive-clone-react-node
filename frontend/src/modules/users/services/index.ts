import { User } from '@/types/user'
import { API } from '../../../service/api'

export class UsersService {
  static async list() {
    return await API.private.get('/users/')
  }
  static async get(nodeId: string) {
    return await API.private.get(`/users/${nodeId}`)
  }

  static async create(payload: Partial<User>) {
    return await API.private.post('/users', payload)
  }
  static async update(nodeId: string, payload: Partial<User>) {
    return await API.private.patch(`/users/${nodeId}`, payload)
  }
  static async delete(nodeId: string) {
    return await API.private.delete(`/users/${nodeId}`)
  }
}
