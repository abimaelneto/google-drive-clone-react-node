import { Action, Permission, Prisma } from '@prisma/client'
import { PrismaService } from '../../base/PrismaService'

export class PermissionsService {
  constructor(private prismaPermissionsRepository: Prisma.PermissionDelegate) {}
  async list(email: string) {
    return await this.prismaPermissionsRepository.findMany({
      where: { userEmail: email },
    })
  }
  async create(nodeId: string, userEmail: string, actions: Action[]) {
    return await this.prismaPermissionsRepository.create({
      data: {
        fileNode: { connect: { id: nodeId } },
        user: { connect: { email: userEmail } },
        actions,
      },
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
      p.id,
      f.id as "fileId",
      f."ownerEmail",
      f."parentId",
      p."userEmail",
      p.recursive,
      p."fileNodeId",
      p."actions"
    from
      public."FileNode" as f
    left join
        public."Permission" as p
      on 
        f.id = p."fileNodeId"
      WHERE f.id=$1
      UNION
      SELECT
        p.id,
        f.id as "fileId",
        f."ownerEmail",
        f."parentId",
        p."userEmail",
        p.recursive,
        p."fileNodeId",
        p."actions"
      
      FROM
        public."FileNode" as f
      left join
        public."Permission" as p
      on 
        f.id = p."fileNodeId"
      INNER JOIN
        getPermission as gp
      ON
        gp."parentId" = f.id
  ) SELECT
    *
  FROM
    getPermission where
      ("fileId"=$1 AND "ownerEmail"=$2)
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
}
