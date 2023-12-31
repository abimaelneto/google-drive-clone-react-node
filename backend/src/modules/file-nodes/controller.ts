import { NextFunction, Request, Response } from 'express'
import { FilesService } from './service'
import { catchAsync } from '../../utils/catchAsync'
import AppError from '../../utils/AppError'
import { UsersService } from '../users/service'
import { Action, Permission, Prisma } from '@prisma/client'
import { PermissionsService } from '../permissions/service'
import { PrismaService } from '../../base/PrismaService'
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library'
import { PermissionCheckResult } from '../permissions/types/PermissionCheckResults'
import { isOwner } from '../permissions/utils/isOwner'

export class FilesController {
  constructor(
    private filesService: FilesService,
    private permissionsService: PermissionsService,
    private usersService: UsersService
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
      select: {
        id: true,
        name: true,
        isFolder: true,
        permissions: { select: { actions: true } },
      },
    })

    return res.status(200).json(fileNodes)
  })

  get = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { nodeId } = req.params
    let permissions: PermissionCheckResult[] = []
    if (req.user.role != 'ADMIN') {
      permissions = await this.permissionsService.listPermissionsForNode(
        nodeId,
        req.user.email
      )
      if (
        !isOwner(permissions, req.user.email) &&
        !permissions.find((i) => i.actions?.includes('READ'))
      )
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
          owner: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      })

      return res.status(200).json({ ...node, permissions })
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
      let permissions: PermissionCheckResult[] = []

      if (req.user.role != 'ADMIN' && parentId) {
        permissions = await this.permissionsService.listPermissionsForNode(
          parentId,
          req.user.email
        )
        if (
          !isOwner(permissions, req.user.email) &&
          !permissions.find((i) => i.actions?.includes('WRITE'))
        )
          return next(
            new AppError(
              //eslint-disable-next-line quotes
              "You don't have permission to perform this action",
              403
            )
          )

        const parentFolder = await this.filesService.get({
          where: { id: parentId, isFolder: true },
        })

        if (!parentFolder)
          return next(
            // eslint-disable-next-line quotes
            new AppError("Invalid param parentId. Folder doesn't exist", 404)
          )
      }

      const newFileNode = await this.filesService.create({
        data: {
          ...rest,
          ...(parentId
            ? { parent: { connect: { id: req.body.parentId } } }
            : {}),
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

  share = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
      const { nodeId } = req.params
      const { email, actions, recursive } = req.body
      try {
        if (req.user.role != 'ADMIN') {
          const file = await this.filesService.get({
            where: { id: nodeId },
          })

          if (file.ownerEmail != req.user.email)
            return next(
              //eslint-disable-next-line quotes
              new AppError(
                "You don't have permission to perform this action",
                403
              )
            )
        }

        const user = await this.usersService.get({ email })
        if (!user)
          return next(
            //eslint-disable-next-line quotes
            new AppError('User with provided email not found', 404)
          )
        const permission = await this.permissionsService.upsert(
          nodeId,
          email,
          actions,
          recursive
        )
        return res.status(200).json(permission)
      } catch (err: any) {
        return next(new AppError(err.message, 500))
      }
    }
  )
}
