import { NextFunction, Request, Response } from 'express'
import { FilesService } from './service'
import { catchAsync } from '../../utils/catchAsync'
import AppError from '../../utils/AppError'
import { UsersService } from '../users/service'

export class FilesController {
  constructor(
    private filesService: FilesService,
    private usersService: UsersService
  ) {}

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
  updateFile = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
      const { fileId } = req.params
      if (!fileId) return next(new AppError('Missing fileId param.', 400))
      const updatedFile = await this.filesService.update({
        where: { id: fileId, isFolder: false },
        data: req.body,
      })
      if (!updatedFile) return next(new AppError('File not found', 404))
      return res.status(200).json(updatedFile)
    }
  )
  updateFolder = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
      const { folderId } = req.params
      if (!folderId) return next(new AppError('Missing folderId param.', 400))
      const updatedFolder = await this.filesService.update({
        where: { id: folderId, isFolder: true },
        data: req.body,
      })
      if (!updatedFolder) return next(new AppError('Folder not found', 404))
      return res.status(200).json(updatedFolder)
    }
  )
  deleteFile = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
      const { fileId } = req.params
      if (!fileId) return next(new AppError('Missing fileId param.', 400))
      const updatedFile = await this.filesService.delete({
        where: { id: fileId, isFolder: false },
      })
      if (!updatedFile) return next(new AppError('File not found', 404))
      return res.status(204)
    }
  )

  deleteFolder = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
      const { folderId } = req.params
      if (!folderId) return next(new AppError('Missing folderId param.', 400))
      const deletedFolder = await this.filesService.delete({
        where: { id: folderId, isFolder: true },
      })
      if (!deletedFolder) return next(new AppError('Folder not found', 404))
      await this.filesService.deleteMany({
        where: { parentId: folderId, isFolder: false },
      })
      return res.status(204)
    }
  )
}
