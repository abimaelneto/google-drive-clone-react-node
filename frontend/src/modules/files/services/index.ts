import { API } from '../../../service/api'
import { FileNode } from '../types/fileNode'
import { SharingPayload } from '../types/share'

export class FileNodesService {
  static async list() {
    return await API.private.get('/files/')
  }
  static async get(nodeId: string) {
    return await API.private.get(`/files/${nodeId}`)
  }

  static async create(payload: Partial<FileNode>) {
    return await API.private.post('/files', payload)
  }
  static async update(nodeId: string, payload: Partial<FileNode>) {
    return await API.private.patch(`/files/${nodeId}`, payload)
  }
  static async delete(nodeId: string) {
    return await API.private.delete(`/files/${nodeId}`)
  }
  static async share(nodeId: string, payload: SharingPayload) {
    return await API.private.post(`/files/${nodeId}/share`, payload)
  }
}
