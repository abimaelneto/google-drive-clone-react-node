import 'express'
import { CreateUserResponseDTO } from '../../src/modules/users/dtos/createUserDTO'

declare global {
  namespace Express {
    interface Request {
      user: CreateUserResponseDTO
      requestTime: string
    }
  }
}
