import { NextFunction, Request, Response } from 'express'
import { FilesService } from './service'
import { catchAsync } from '../../utils/catchAsync'
import AppError from '../../utils/AppError'
import { UsersService } from '../users/service'
import { Prisma } from '@prisma/client'

export class FilesController {
  constructor(
    private filesService: FilesService,
    private usersService: UsersService
  ) {}

  list = catchAsync(async (req: Request, res: Response) => {
    const fileNodes = await this.filesService.list({
      where: { parentId: null },
      select: { id: true, name: true, isFolder: true },
    })
    return res.status(200).json(fileNodes)
  })

  get = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { nodeId } = req.params
    try {
      const node = await this.filesService.get({
        where: { id: nodeId },
        include: {
          children: {
            select: {
              id: true,
              name: true,
              isFolder: true,
              ownerEmail: true,
            },
          },
        },
      })

      return res.status(200).json(node)
    } catch (err) {
      if (
        err instanceof Prisma.PrismaClientKnownRequestError &&
        err.code == 'P2025'
      )
        return next(new AppError('Node not found', 404))
    }
  })

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

  update = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
      const { nodeId } = req.params
      const { parentId } = req.body
      if (!nodeId) return next(new AppError('Missing nodeId param.', 400))
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
      const updatedNode = await this.filesService.update({
        where: { id: nodeId },
        data: req.body,
      })
      if (!updatedNode) return next(new AppError('Node not found', 404))
      return res.status(200).json(updatedNode)
    }
  )

  delete = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
      const { nodeId } = req.params
      if (!nodeId) return next(new AppError('Missing nodeId param.', 400))
      try {
        await this.filesService.delete({
          where: { id: nodeId },
        })
        return res.status(204)
      } catch (err: unknown) {
        if (err instanceof Prisma.PrismaClientKnownRequestError) {
          err.code == 'P2025'
          return next(new AppError('Node not found', 404))
        }
        return next(new AppError('Something went wrong', 500))
      }
    }
  )
}
