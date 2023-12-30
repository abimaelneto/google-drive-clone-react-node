import { Router } from 'express'
import { FilesController } from './controller'
import { FilesService } from './service'
import { AuthController } from '../auth/controller'
import { PrismaService } from '../../base/PrismaService'
import { PermissionsService } from '../permissions/service'
import { UsersService } from '../users/service'

export const filesRouter = Router()
const authController = new AuthController(PrismaService.user)
filesRouter.use(authController.protect)

const filesController = new FilesController(
  new FilesService(PrismaService.fileNode),
  new PermissionsService(PrismaService.permission),
  new UsersService()
)

filesRouter.route('/').get(filesController.list).post(filesController.create)
filesRouter
  .route('/:nodeId')
  .get(filesController.get)
  .patch(filesController.update)
  .delete(filesController.delete)

filesRouter.route('/:nodeId/share').post(filesController.share)
