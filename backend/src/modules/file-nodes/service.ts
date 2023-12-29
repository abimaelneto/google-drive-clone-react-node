import { Prisma } from '@prisma/client'

export class FilesService {
  constructor(private prismaFileNodeRepository: Prisma.FileNodeDelegate) {}

  async list(args: Prisma.FileNodeFindManyArgs) {
    return await this.prismaFileNodeRepository.findMany(args)
  }
  async get(args: Prisma.FileNodeFindUniqueOrThrowArgs) {
    return await this.prismaFileNodeRepository.findUniqueOrThrow(args)
  }
  async create(args: Prisma.FileNodeCreateArgs) {
    return await this.prismaFileNodeRepository.create(args)
  }
  async update(args: Prisma.FileNodeUpdateArgs) {
    return await this.prismaFileNodeRepository.update(args)
  }
  async delete(args: Prisma.FileNodeDeleteArgs) {
    return await this.prismaFileNodeRepository.delete(args)
  }
  async deleteMany(args: Prisma.FileNodeDeleteManyArgs) {
    return await this.prismaFileNodeRepository.deleteMany(args)
  }
}
