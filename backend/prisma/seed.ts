import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  await prisma.user.create({
    data: {
      password: 'password',
      email: 'admin@admin.com',
      name: 'Administrator User',
      role: 'ADMIN',
    },
  })
  const folder1 = await prisma.fileNode.create({
    data: {
      name: 'folder1',
      ownerEmail: 'admin@admin.com',
      isFolder: true,
    },
  })
  const folder2 = await prisma.fileNode.create({
    data: {
      name: 'folder2',
      ownerEmail: 'admin@admin.com',
      isFolder: true,
      parentId: folder1.id,
    },
  })
  await prisma.fileNode.createMany({
    data: [
      {
        name: 'file1',
        ownerEmail: 'admin@admin.com',
        content: 'test',
      },
      {
        name: 'file2',
        ownerEmail: 'admin@admin.com',
        content: 'test',
        parentId: folder1.id,
      },
      {
        name: 'file3',
        ownerEmail: 'admin@admin.com',
        content: 'test',
        parentId: folder1.id,
      },
      {
        name: 'file4',
        ownerEmail: 'admin@admin.com',
        content: 'test',
        parentId: folder2.id,
      },
    ],
  })
}
main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })

// WITH RECURSIVE filesAndFolders AS (
//   SELECT
//     id,
//     name,
//     "parentId",
//     "isFolder"
//   FROM
//     public."FileNode"
//   WHERE
//     name = 'folder2'
//   UNION
//     SELECT
//       f.id,
//       f.name,
//       f."parentId",
//       f."isFolder"
//     FROM
//       public."FileNode"  as f
//     INNER JOIN filesAndFolders as ff ON ff.id = f."parentId"
// ) SELECT
//   *
// FROM
//   filesAndFolders;
