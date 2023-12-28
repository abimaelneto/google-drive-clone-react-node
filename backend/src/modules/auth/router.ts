import { Router } from 'express'
import { AuthController } from './controller'

export const AuthRouter = Router()

AuthRouter.post('/signup', AuthController.signup)
AuthRouter.post('/login', AuthController.login)
