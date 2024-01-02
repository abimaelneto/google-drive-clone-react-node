import { Action, Permission } from '../types/permissions'

export const hasPermission = (permissions: Permission[], action: Action) =>
  Boolean(permissions.find((i) => i.actions?.includes(action)))
