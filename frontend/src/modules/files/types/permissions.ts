export type Action = 'READ' | 'WRITE' | 'DELETE'

export type Permission = {
  actions?: Action[] | null
  fileNodeId: string | null
  ownerEmail: string | null
  recursive: boolean | null
  userEmail: string | null
}
