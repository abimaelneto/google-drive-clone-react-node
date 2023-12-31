import { Action, Permission, Prisma } from '@prisma/client'
import { PrismaService } from '../../base/PrismaService'
import { PermissionCheckResult } from './types/PermissionCheckResults'

export class PermissionsService {
  constructor(private prismaPermissionsRepository: Prisma.PermissionDelegate) {}
  async list(email: string) {
    return await this.prismaPermissionsRepository.findMany({
      where: { userEmail: email },
    })
  }

  async get(nodeId: string, userEmail: string) {
    return await this.prismaPermissionsRepository.findUniqueOrThrow({
      where: { fileNodeId_userEmail: { fileNodeId: nodeId, userEmail } },
    })
  }

  async upsert(
    nodeId: string,
    userEmail: string,
    actions: Action[],
    recursive: boolean
  ) {
    return await this.prismaPermissionsRepository.upsert({
      create: { fileNodeId: nodeId, userEmail, actions, recursive },
      update: {
        actions,
        recursive,
      },
      where: { fileNodeId_userEmail: { fileNodeId: nodeId, userEmail } },
    })
  }

  async update(nodeId: string, userEmail: string, actions: Action[]) {
    return await this.prismaPermissionsRepository.update({
      data: {
        actions,
      },
      where: { fileNodeId_userEmail: { fileNodeId: nodeId, userEmail } },
    })
  }
  async getPermissionsForNode(
    nodeId: string,
    userEmail: string,
    action: Action
  ) {
    const results = await PrismaService.$queryRawUnsafe<Permission[]>(
      `WITH RECURSIVE getPermission AS (
      SELECT
        f.id,
        f."ownerEmail",
        f."parentId",
        p."userEmail",
        p.recursive,
        p."fileNodeId",
        p."actions"
      FROM
        public."FileNode" as f
      LEFT JOIN
        public."Permission" as p
      ON 
        f.id = p."fileNodeId"
      WHERE
        f.id=$1
      UNION
      SELECT
        f.id,
        f."ownerEmail",
        f."parentId",
        p."userEmail",
        p.recursive,
        p."fileNodeId",
        p."actions"
      FROM
        public."FileNode" as f
      LEFT JOIN
        public."Permission" as p
      ON 
        f.id = p."fileNodeId"
      INNER JOIN
        getPermission as gp
      ON
        gp."parentId" = f.id
      ) SELECT
        *
      FROM
        getPermission
      WHERE
        ("id"=$1 AND "ownerEmail"=$2)
        OR
          ("fileNodeId"=$1 AND "userEmail"=$2 AND array_position(actions::text[], $3)::bool)
        OR
          (recursive='true' AND "userEmail"=$2 AND array_position(actions::text[], $3)::bool)
      `,
      nodeId,
      userEmail,
      action
    )

    return results
  }

  async listPermissionsForNode(nodeId: string, userEmail: string) {
    const results = await PrismaService.$queryRawUnsafe<
      PermissionCheckResult[]
    >(
      `WITH RECURSIVE getPermission AS (
      SELECT
        f.id,
        f."ownerEmail",
        f."parentId",
        p."userEmail",
        p.recursive,
        p."fileNodeId",
        p."actions"
      FROM
        public."FileNode" as f
      LEFT JOIN
        public."Permission" as p
      ON 
        f.id = p."fileNodeId"
      WHERE
        f.id=$1
      UNION
      SELECT
        f.id,
        f."ownerEmail",
        f."parentId",
        p."userEmail",
        p.recursive,
        p."fileNodeId",
        p."actions"
      FROM
        public."FileNode" as f
      LEFT JOIN
        public."Permission" as p
      ON 
        f.id = p."fileNodeId"
      INNER JOIN
        getPermission as gp
      ON
        gp."parentId" = f.id
      ) SELECT
      "fileNodeId",
      "recursive",
      "actions",
      "userEmail",
      "ownerEmail"
      FROM
        getPermission
      WHERE
        ("id"=$1 AND "ownerEmail"=$2)
        OR
          ("fileNodeId"=$1 AND "userEmail"=$2)
        OR
          (recursive='true' AND "userEmail"=$2)
          
      `,
      nodeId,
      userEmail
    )
    console.log(results)
    return results
  }
}
