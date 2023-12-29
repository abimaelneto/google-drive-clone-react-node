import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  const adminUser = await prisma.user.create({
    data: {
      password: 'password',
      email: 'admin@admin.com',
      name: 'Administrator User',
      role: 'ADMIN',
    },
  })
  const commonUser = await prisma.user.create({
    data: {
      password: '1234',
      email: 'email@mail.com',
      name: 'Common User',
    },
  })
  const adminFolder1 = await prisma.fileNode.create({
    data: {
      name: 'adminFolder1',
      ownerEmail: adminUser.email,
      isFolder: true,
    },
  })
  const commonUserFolder1 = await prisma.fileNode.create({
    data: {
      name: 'commonUserFolder1',
      ownerEmail: commonUser.email,
      isFolder: true,
    },
  })

  const commonUserfile1 = await prisma.fileNode.create({
    data: {
      name: 'commonUserfile1',
      ownerEmail: commonUser.email,
      isFolder: false,
      parentId: commonUserFolder1.id,
    },
  })
  const adminFolder2 = await prisma.fileNode.create({
    data: {
      name: 'adminFolder2',
      ownerEmail: adminUser.email,
      isFolder: true,
      parentId: adminFolder1.id,
    },
  })
  const adminFolder3 = await prisma.fileNode.create({
    data: {
      name: 'adminFolder3',
      ownerEmail: adminUser.email,
      isFolder: true,
      parentId: adminFolder2.id,
    },
  })

  const adminFolder4 = await prisma.fileNode.create({
    data: {
      name: 'adminFolder4',
      ownerEmail: adminUser.email,
      isFolder: true,
      parentId: adminFolder1.id,
    },
  })
  const adminFolder5 = await prisma.fileNode.create({
    data: {
      name: 'adminFolder5',
      ownerEmail: adminUser.email,
      isFolder: true,
      parentId: adminFolder4.id,
    },
  })

  const adminFile1 = await prisma.fileNode.create({
    data: {
      name: 'file1',
      ownerEmail: adminUser.email,
      content: 'test',
    },
  })
  const adminFile2 = await prisma.fileNode.create({
    data: {
      name: 'file2',
      ownerEmail: adminUser.email,
      content: 'test',
      parentId: adminFolder1.id,
    },
  })
  const adminFile3 = await prisma.fileNode.create({
    data: {
      name: 'file3',
      ownerEmail: adminUser.email,
      content: 'test',
      parentId: adminFolder1.id,
    },
  })
  const adminFile4 = await prisma.fileNode.create({
    data: {
      name: 'file4',
      ownerEmail: adminUser.email,
      content: 'test',
      parentId: adminFolder2.id,
    },
  })
  const adminFile5 = await prisma.fileNode.create({
    data: {
      name: 'file5',
      ownerEmail: adminUser.email,
      content: 'test',
      parentId: adminFolder3.id,
    },
  })

  const adminFile6 = await prisma.fileNode.create({
    data: {
      name: 'file6',
      ownerEmail: adminUser.email,
      content: 'test',
      parentId: adminFolder5.id,
    },
  })
  await prisma.permission.createMany({
    data: [
      {
        fileNodeId: adminFile3.id,
        userEmail: commonUser.email,
        actions: ['READ'],
      },
      {
        fileNodeId: adminFile5.id,
        userEmail: commonUser.email,
        actions: ['READ', 'WRITE'],
      },
      {
        fileNodeId: adminFolder2.id,
        userEmail: commonUser.email,
        recursive: true,
        actions: ['READ'],
      },
      {
        fileNodeId: adminFolder4.id,
        userEmail: commonUser.email,
        actions: ['READ', 'WRITE', 'DELETE'],
      },
    ],
  })
}

/*
 
ADMIN

file1
folder1
  file2
  file3
  folder2
    folder3
      file5
    file4
  folder4
    file6
    folder5
      file7


*/

// await prisma.fileNode.findUnique({where:{name:}})
//   await prisma.permission.createMany({
//     data:[]
//   })
// }
main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })

//   WITH RECURSIVE getPermission AS (
//   	SELECT
// 		f.id,
// 		f.name,
// 		f."parentId",
// 		p.recursive,
// 		p."fileNodeId"

// 	from
// 		public."FileNode" as f
// 	left join
// 			public."Permission" as p
// 		on
// 			f.id = p."fileNodeId"

//   	UNION
// 		SELECT
// 			f.id,
// 			f.name,
// 			f."parentId",
// 			p.recursive,
// 			p."fileNodeId"

// 		FROM
// 			public."FileNode" as f
// 		left join
// 			public."Permission" as p
// 		on
// 			f.id = p."fileNodeId"
// 		INNER JOIN
// 			getPermission as gp
// 		ON
// 			gp."parentId" = f.id
// 		--where p.recursive is null
// ) SELECT
//   *
// FROM
//   getPermission where "fileNodeId"='548e6497-3273-4ce8-a87d-d40ba14cf1ea' or recursive=true
