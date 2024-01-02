import { PermissionCheckResult } from '../types/PermissionCheckResults'

export const isOwner = (results: PermissionCheckResult[], email: string) =>
  Boolean(results.find((i) => i.ownerEmail === email))
