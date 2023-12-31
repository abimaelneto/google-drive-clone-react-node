import { API } from '../../../service/api'

export class FileNodesService {
  static async list() {
    return await API.private.get('/files/')
  }
  static async get(nodeId: string) {
    return await API.private.get(`/files/${nodeId}`)
  }
}
