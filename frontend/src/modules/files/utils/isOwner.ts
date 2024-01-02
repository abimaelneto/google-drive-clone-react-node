import { Permission } from '../types/permissions'

export const isOwner = (permissions: Permission[], email: string) =>
  Boolean(permissions.find((i) => i.ownerEmail === email))
