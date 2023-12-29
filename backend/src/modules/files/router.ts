import { Router } from 'express'
import { FilesController } from './controller'
import { FilesService } from './service'
import { AuthController } from '../auth/controller'
import { PrismaService } from '../../base/PrismaService'
import { UsersService } from '../users/service'

export const filesRouter = Router()
const authController = new AuthController(PrismaService.user)
filesRouter.use(authController.protect)

const filesController = new FilesController(
  new FilesService(PrismaService.fileNode),
  new UsersService()
)

filesRouter.get('/', filesController.listRoot)
filesRouter.get('/folders/:folderId/', filesController.getFolder)
filesRouter.post('/', filesController.create)
// filesRouter.get('/:userId', filesController.get)
// filesRouter.patch('/:userId', filesController.update)
// filesRouter.delete('/:userId', filesController.delete)
