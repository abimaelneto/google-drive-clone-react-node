import { NextFunction, Request, Response } from 'express'
import { FilesService } from './service'
import { catchAsync } from '../../utils/catchAsync'
import AppError from '../../utils/AppError'
import { UsersService } from '../users/service'
import { Prisma } from '@prisma/client'
import { PermissionsService } from '../permissions/service'
import { PrismaService } from '../../base/PrismaService'

export class FilesController {
  constructor(
    private filesService: FilesService,
    private permissionsService: PermissionsService
  ) {}

  list = catchAsync(async (req: Request, res: Response) => {
    const fileNodes = await this.filesService.list({
      where:
        req.user.role == 'ADMIN'
          ? { parentId: null }
          : {
              OR: [
                {
                  parentId: null,
                  ownerEmail: req.user.email,
                },
                { permissions: { some: { userEmail: req.user.email } } },
              ],
            },
      select: { id: true, name: true, isFolder: true },
    })
    return res.status(200).json(fileNodes)
  })

  get = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { nodeId } = req.params
    if (req.user.role != 'ADMIN') {
      const permissions = await this.permissionsService.getPermissionsForNode(
        nodeId,
        req.user.email,
        'READ'
      )
      console.log(permissions)
      if (!permissions.length)
        return next(
          //eslint-disable-next-line quotes
          new AppError("You don't have permission to perform this action", 403)
        )
    }

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
      const { parentId, ...rest } = req.body

      if (req.user.role != 'ADMIN') {
        const permissions = await this.permissionsService.getPermissionsForNode(
          parentId,
          req.user.email,
          'WRITE'
        )
        if (!permissions.length)
          return next(
            //eslint-disable-next-line quotes
            new AppError(
              "You don't have permission to perform this action",
              403
            )
          )
        if (parentId) {
          const parentFolder = await this.filesService.get({
            where: { id: parentId, isFolder: true },
          })

          if (!parentFolder)
            return next(
              // eslint-disable-next-line quotes
              new AppError("Invalid param parentId. Folder doesn't exist", 404)
            )
        }
      }

      const newFileNode = await this.filesService.create({
        data: {
          ...rest,
          parent: { connect: { id: req.body.parentId } },
          owner: { connect: { email: req.user.email } },
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

      if (req.user.role != 'ADMIN') {
        const childPermissions =
          await this.permissionsService.getPermissionsForNode(
            nodeId,
            req.user.email,
            'WRITE'
          )
        if (!childPermissions.length)
          return next(
            //eslint-disable-next-line quotes
            new AppError(
              "You don't have permission to perform this action",
              403
            )
          )
        if (parentId) {
          const parentPermissions =
            await this.permissionsService.getPermissionsForNode(
              parentId,
              req.user.email,
              'WRITE'
            )
          if (!parentPermissions.length)
            return next(
              //eslint-disable-next-line quotes
              new AppError(
                "You don't have permission to perform this action",
                403
              )
            )
        }
      }
      if (parentId) {
        const parentFolder = await this.filesService.get({
          where: { id: parentId, isFolder: true },
        })

        if (!parentFolder)
          return next(
            // eslint-disable-next-line quotes
            new AppError("Invalid param parentId. Folder doesn't exist", 404)
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

      if (req.user.role != 'ADMIN') {
        const permissions = await this.permissionsService.getPermissionsForNode(
          nodeId,
          req.user.email,
          'DELETE'
        )
        if (!permissions.length)
          return next(
            //eslint-disable-next-line quotes
            new AppError(
              "You don't have permission to perform this action",
              403
            )
          )
      }

      try {
        await this.filesService.delete({
          where: { id: nodeId },
        })
        return res.status(204).send()
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
