import { Permission } from '@prisma/client'
import { Optional } from '@prisma/client/runtime/library'

export type PermissionCheckResult = Optional<Permission> & {
  ownerEmail: string
}
