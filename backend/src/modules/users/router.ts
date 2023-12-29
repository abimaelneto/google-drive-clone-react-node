import { Router } from 'express'
import { UsersController } from './controller'
import { UsersService } from './service'
import { AuthController } from '../auth/controller'
import { PrismaService } from '../../base/PrismaService'

export const usersRouter = Router()
const authController = new AuthController(PrismaService.user)
usersRouter.use(authController.protect)
usersRouter.use(authController.restrictTo('ADMIN'))

const usersController = new UsersController(new UsersService())

usersRouter.get('/', usersController.list)
usersRouter.post('/', usersController.create)
usersRouter.get('/:userId', usersController.get)
usersRouter.patch('/:userId', usersController.update)
usersRouter.delete('/:userId', usersController.delete)
