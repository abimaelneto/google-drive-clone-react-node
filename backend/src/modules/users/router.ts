import { Router } from 'express'
import { UsersController } from './controller'
import { UsersService } from './service'
import { AuthController } from '../auth/controller'

export const usersRouter = Router()
usersRouter.use(AuthController.protect)
usersRouter.use(AuthController.restrictTo('ADMIN'))

const usersController = new UsersController(new UsersService())

usersRouter.get('/', usersController.list)
usersRouter.post('/', usersController.create)
usersRouter.get('/:userId', usersController.get)
usersRouter.patch('/:userId', usersController.update)
usersRouter.delete('/:userId', usersController.delete)
