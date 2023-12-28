import { Role } from '.prisma/client'

export type CreateUserRequestDTO = {
  password: string
  email: string
  name: string
  role: Role
}

export type CreateUserResponseDTO = {
  id: string
  email: string
  name: string | null
  role: Role
}
