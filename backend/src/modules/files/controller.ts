import { NextFunction, Request, Response } from 'express'
import { FilesService } from './service'
import { catchAsync } from '../../utils/catchAsync'
import AppError from '../../utils/AppError'
import { UsersService } from '../users/service'

export class FilesController {
  filesService: FilesService
  usersService: UsersService
  constructor(filesService: FilesService, usersService: UsersService) {
    this.filesService = filesService
    this.usersService = usersService
  }

  listRoot = catchAsync(async (req: Request, res: Response) => {
    const fileNodes = await this.filesService.list({
      where: { parentId: null },
      select: { id: true, isFolder: true, name: true },
    })
    return res.status(200).json(fileNodes)
  })

  getFolder = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
      const { folderId } = req.params
      const folder = await this.filesService.get({
        where: { isFolder: true, id: folderId },
      })
      if (!folder) return next(new AppError('Folder not found', 404))
      const fileNodes = await this.filesService.list({
        where: { parentId: folderId },
        select: {
          id: true,
          isFolder: true,
          name: true,
          owner: true,
          ownerEmail: true,
        },
      })
      return res.status(200).json(fileNodes)
    }
  )
  create = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
      const { parentId } = req.body
      if (parentId) {
        const parentFolder = await this.filesService.get({
          where: { id: parentId },
        })

        if (!parentFolder)
          return next(
            // eslint-disable-next-line quotes
            new AppError("Invalid param parentId. Folder doesn't exist", 400)
          )
      }
      const owner = await this.usersService.get({ id: req.user.id })

      const newFileNode = await this.filesService.create({
        data: {
          ...req.body,
          owner: { connect: { id: owner.id } },
        },
      })
      return res.status(201).json(newFileNode)
    }
  )
}
