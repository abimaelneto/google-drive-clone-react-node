import { Router } from 'express'
import { AuthController } from './controller'
import { PrismaService } from '../../base/PrismaService'

export const AuthRouter = Router()
const authController = new AuthController(PrismaService.user)
AuthRouter.post('/signup', authController.signup)
AuthRouter.post('/login', authController.login)
