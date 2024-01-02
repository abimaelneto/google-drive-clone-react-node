import { Permission } from '../types/permissions'

export const listPermissions = (
  permissions?: Permission[],
  email?: string
): string[] =>
  permissions?.reduce((acc: string[], i) => {
    i.actions?.forEach((action) => {
      if (!acc.includes(action)) acc.push(action)
    })
    if (i.ownerEmail == email && !acc.includes('OWNER')) acc.push('OWNER')
    return acc
  }, []) || []
