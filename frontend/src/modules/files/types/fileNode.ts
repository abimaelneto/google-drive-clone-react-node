import { User } from '@/types/user'
import { Permission } from './permissions'

export type FileNode = {
  id: string
  name: string
  owner?: User
  ownerEmail?: string
  isFolder: boolean
  content?: string
  children?: FileNode[]
  parentId: string
  permissions?: Permission[]
}
