import { Role } from '.prisma/client'

export type UpdateUserRequestDTO = {
  id?: string
  password?: string
  email?: string
  name?: string
  role?: Role
}

