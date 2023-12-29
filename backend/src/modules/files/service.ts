import { Prisma } from '@prisma/client'

export class FilesService {
  prismaFileNodeRepository: Prisma.FileNodeDelegate
  constructor(prismaFileNodeRepository: Prisma.FileNodeDelegate) {
    this.prismaFileNodeRepository = prismaFileNodeRepository
  }

  async list(args: Prisma.FileNodeFindManyArgs) {
    return await this.prismaFileNodeRepository.findMany(args)
  }
  async get(args: Prisma.FileNodeFindUniqueOrThrowArgs) {
    return await this.prismaFileNodeRepository.findUniqueOrThrow(args)
  }
  async create(args: Prisma.FileNodeCreateArgs) {
    return await this.prismaFileNodeRepository.create(args)
  }
}
