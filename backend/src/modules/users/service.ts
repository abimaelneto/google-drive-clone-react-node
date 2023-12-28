import { Prisma } from '@prisma/client'
import { PrismaService } from '../../base/PrismaService'
import { CreateUserRequestDTO } from './dtos/createUserDTO'
import { UpdateUserRequestDTO } from './dtos/updateUserDTO'

export class UsersService {
  async create(user: CreateUserRequestDTO) {
    const newUser = await PrismaService.user.create({
      data: user,
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
      },
    })
    return newUser
  }
async get(where:Prisma.UserWhereUniqueInput){
  const user = await PrismaService.user.findFirstOrThrow({
    where,
  })
  return user
}
  async list() {
    return await PrismaService.user.findMany({select:{id:true, name:true, email:true, role:true}})
  }

  async update(id:string, payload: UpdateUserRequestDTO){
    const user = await PrismaService.user.findFirstOrThrow({
      where: { id },
    })
    return await PrismaService.user.update({
      data: payload,
      where: { id },
      
    })
    
  }
  async delete (id:string){
    return await PrismaService.user.delete({ where: { id } })
  }
}
