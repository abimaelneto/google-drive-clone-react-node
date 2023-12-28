export type CreateUserRequestDTO = {
  password: string
  email: string
  name: string
  role: string
}

export type CreateUserResponseDTO = {
  id: string
  email: string
  name: string | null
  role: string
}
